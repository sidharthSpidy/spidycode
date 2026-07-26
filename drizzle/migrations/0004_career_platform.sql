create type public.profile_role as enum ('learner','recruiter','admin');
alter table public.profiles add column role public.profile_role not null default 'learner';
alter table public.profiles add column headline varchar(140);
alter table public.profiles add column location varchar(100);
alter table public.profiles add column website text;
alter table public.profiles add column linkedin_url text;
alter table public.profiles add column resume_summary varchar(1200);
alter table public.profiles add column portfolio_visible boolean not null default true;
alter table public.projects add column portfolio_visible boolean not null default true;

create table public.certificates (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade,
  roadmap_id uuid not null references public.roadmaps(id), verification_code varchar(24) not null unique,
  issued_at timestamptz not null default now(), unique (user_id, roadmap_id)
);
create table public.jobs (
  id uuid primary key default gen_random_uuid(), owner_id uuid not null references public.profiles(id) on delete cascade,
  title varchar(160) not null, company varchar(120) not null, description text not null,
  location varchar(100), remote boolean not null default true, apply_url text, is_published boolean not null default false,
  created_at timestamptz not null default now(), closes_at timestamptz
);
create table public.job_applications (
  id uuid primary key default gen_random_uuid(), job_id uuid not null references public.jobs(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade, note varchar(1200),
  status varchar(20) not null default 'submitted' check (status in ('submitted','reviewing','interview','rejected','accepted')),
  created_at timestamptz not null default now(), unique(job_id, user_id)
);
alter table public.certificates enable row level security; alter table public.jobs enable row level security; alter table public.job_applications enable row level security;
create policy "certificates are publicly readable" on public.certificates for select using (true);
create policy "published jobs are readable" on public.jobs for select using (is_published = true or owner_id = (select auth.uid()));
create policy "users view their applications" on public.job_applications for select using ((select auth.uid()) = user_id);

create or replace function public.issue_certificate(target_roadmap_id uuid) returns uuid language plpgsql security definer set search_path = public as $$
declare current_user_id uuid := auth.uid(); certificate_id uuid;
begin
  if current_user_id is null then raise exception 'Not authenticated'; end if;
  if not exists (select 1 from user_roadmaps where user_id = current_user_id and roadmap_id = target_roadmap_id) then raise exception 'Roadmap not started'; end if;
  if exists (select 1 from levels l where l.roadmap_id = target_roadmap_id and not exists (select 1 from user_level_progress p where p.user_id = current_user_id and p.level_id = l.id)) then raise exception 'Roadmap not complete'; end if;
  insert into certificates (user_id, roadmap_id, verification_code) values (current_user_id, target_roadmap_id, upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 16))) on conflict (user_id, roadmap_id) do update set issued_at = certificates.issued_at returning id into certificate_id;
  return certificate_id;
end; $$;
revoke all on function public.issue_certificate(uuid) from public; grant execute on function public.issue_certificate(uuid) to authenticated;
