alter table public.projects add column review_status varchar(20) not null default 'not_requested' check (review_status in ('not_requested', 'queued', 'reviewing', 'complete', 'failed'));
alter table public.projects add column submitted_at timestamptz;
create table public.ai_reviews (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null unique references public.projects(id) on delete cascade,
  model varchar(100) not null,
  overall_score integer not null check (overall_score between 0 and 100),
  code_quality_score integer not null check (code_quality_score between 0 and 100),
  performance_score integer not null check (performance_score between 0 and 100),
  security_score integer not null check (security_score between 0 and 100),
  structure_score integer not null check (structure_score between 0 and 100),
  strengths jsonb not null default '[]'::jsonb,
  weaknesses jsonb not null default '[]'::jsonb,
  suggestions jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.ai_reviews enable row level security;
create policy "users view reviews for their projects" on public.ai_reviews for select using (exists (select 1 from public.projects where projects.id = ai_reviews.project_id and projects.user_id = (select auth.uid())));

drop policy if exists "users create their projects" on public.projects;
drop policy if exists "users update their projects" on public.projects;
revoke insert, update, delete on public.projects from anon, authenticated;
