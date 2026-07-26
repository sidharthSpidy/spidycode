create type public.roadmap_difficulty as enum ('beginner', 'intermediate', 'advanced');
create type public.project_status as enum ('not_started', 'in_progress', 'submitted', 'approved', 'needs_changes');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username varchar(30) not null unique check (username ~ '^[a-z0-9_]{3,30}$'),
  name varchar(100) not null,
  avatar_url text,
  bio varchar(280),
  github_username varchar(39),
  xp integer not null default 0 check (xp >= 0),
  level integer not null default 1 check (level >= 1),
  streak integer not null default 0 check (streak >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.roadmaps (id uuid primary key default gen_random_uuid(), slug varchar(80) not null unique, title varchar(100) not null, description text not null, difficulty public.roadmap_difficulty not null, icon varchar(50) not null, is_published boolean not null default false, created_at timestamptz not null default now());
create table public.levels (id uuid primary key default gen_random_uuid(), roadmap_id uuid not null references public.roadmaps(id) on delete cascade, title varchar(120) not null, description text not null, xp_reward integer not null check (xp_reward >= 0), position integer not null check (position > 0), created_at timestamptz not null default now(), unique (roadmap_id, position));
create table public.projects (id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade, level_id uuid not null references public.levels(id), title varchar(140) not null, description text not null, github_repo text, ai_score integer check (ai_score between 0 and 100), status public.project_status not null default 'not_started', completed_at timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table public.user_roadmaps (user_id uuid not null references public.profiles(id) on delete cascade, roadmap_id uuid not null references public.roadmaps(id) on delete cascade, started_at timestamptz not null default now(), primary key (user_id, roadmap_id));

alter table public.profiles enable row level security;
alter table public.roadmaps enable row level security;
alter table public.levels enable row level security;
alter table public.projects enable row level security;
alter table public.user_roadmaps enable row level security;
create policy "public profiles are readable" on public.profiles for select using (true);
create policy "users update their profile" on public.profiles for update using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
create policy "users create their profile" on public.profiles for insert with check ((select auth.uid()) = id);
create policy "published roadmaps are readable" on public.roadmaps for select using (is_published = true);
create policy "published levels are readable" on public.levels for select using (exists (select 1 from public.roadmaps where roadmaps.id = levels.roadmap_id and roadmaps.is_published = true));
create policy "users view their projects" on public.projects for select using ((select auth.uid()) = user_id);
create policy "users create their projects" on public.projects for insert with check ((select auth.uid()) = user_id);
create policy "users update their projects" on public.projects for update using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "users view their roadmap progress" on public.user_roadmaps for select using ((select auth.uid()) = user_id);
create policy "users manage their roadmap progress" on public.user_roadmaps for all using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
