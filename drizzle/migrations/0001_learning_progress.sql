create table public.user_level_progress (
  user_id uuid not null references public.profiles(id) on delete cascade,
  level_id uuid not null references public.levels(id) on delete cascade,
  completed_at timestamptz not null default now(),
  primary key (user_id, level_id)
);
create table public.achievement_definitions (
  id varchar(60) primary key,
  title varchar(100) not null,
  description varchar(180) not null,
  icon varchar(32) not null,
  threshold integer not null check (threshold > 0)
);
create table public.user_achievements (
  user_id uuid not null references public.profiles(id) on delete cascade,
  achievement_id varchar(60) not null references public.achievement_definitions(id) on delete cascade,
  earned_at timestamptz not null default now(),
  primary key (user_id, achievement_id)
);

alter table public.user_level_progress enable row level security;
alter table public.achievement_definitions enable row level security;
alter table public.user_achievements enable row level security;
create policy "users view their level progress" on public.user_level_progress for select using ((select auth.uid()) = user_id);
create policy "achievement definitions are readable" on public.achievement_definitions for select using (true);
create policy "users view their achievements" on public.user_achievements for select using ((select auth.uid()) = user_id);

revoke update on public.profiles from anon, authenticated;
grant update (username, name, avatar_url, bio, github_username) on public.profiles to authenticated;

insert into public.achievement_definitions (id, title, description, icon, threshold) values
  ('first-level', 'First steps', 'Complete your first level.', '✦', 1),
  ('builder-five', 'On a roll', 'Complete five levels.', '⚡', 5),
  ('builder-ten', 'Serious builder', 'Complete ten levels.', '◆', 10)
on conflict (id) do nothing;

create or replace function public.complete_level(target_level_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  reward integer;
  target_roadmap_id uuid;
  completed_count integer;
begin
  if current_user_id is null then raise exception 'Not authenticated'; end if;
  select xp_reward, roadmap_id into reward, target_roadmap_id from levels where id = target_level_id;
  if reward is null then raise exception 'Level not found'; end if;
  if not exists (select 1 from user_roadmaps where user_id = current_user_id and roadmap_id = target_roadmap_id) then raise exception 'Roadmap has not been started'; end if;
  insert into user_level_progress (user_id, level_id) values (current_user_id, target_level_id) on conflict do nothing;
  if not found then return jsonb_build_object('alreadyCompleted', true); end if;
  update profiles set xp = xp + reward, level = greatest(1, floor(sqrt((xp + reward)::numeric / 100))::integer + 1), updated_at = now() where id = current_user_id;
  select count(*) into completed_count from user_level_progress where user_id = current_user_id;
  insert into user_achievements (user_id, achievement_id)
    select current_user_id, id from achievement_definitions where threshold <= completed_count
    on conflict do nothing;
  return jsonb_build_object('alreadyCompleted', false, 'xpEarned', reward, 'completedLevels', completed_count);
end;
$$;
revoke all on function public.complete_level(uuid) from public;
grant execute on function public.complete_level(uuid) to authenticated;

insert into public.roadmaps (slug, title, description, difficulty, icon, is_published) values
  ('javascript', 'JavaScript', 'Build dynamic experiences for the web from first principles.', 'beginner', 'JS', true),
  ('react', 'React', 'Design and ship modern, component-driven interfaces.', 'intermediate', '⚛', true),
  ('python', 'Python', 'Automate, analyze, and build with a versatile language.', 'beginner', 'PY', true),
  ('sql', 'SQL', 'Query, model, and understand the data behind products.', 'beginner', 'DB', true)
on conflict (slug) do nothing;

insert into public.levels (roadmap_id, title, description, xp_reward, position)
select r.id, v.title, v.description, v.xp_reward, v.position from public.roadmaps r
cross join (values
  ('JavaScript foundations', 'Variables, functions, and control flow through useful mini-builds.', 100, 1),
  ('DOM interactions', 'Create responsive interfaces that react to real user input.', 150, 2),
  ('Async data', 'Work with APIs and loading states in a practical weather app.', 200, 3),
  ('Ship a task manager', 'Bring it all together in a deployable project.', 350, 4)
) as v(title, description, xp_reward, position)
where r.slug = 'javascript'
on conflict (roadmap_id, position) do nothing;
