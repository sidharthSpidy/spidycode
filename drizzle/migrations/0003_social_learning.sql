alter table public.profiles add column college_name varchar(120);
create table public.xp_events (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade,
  amount integer not null check (amount > 0), source varchar(30) not null check (source in ('level', 'challenge', 'manual')), source_id uuid, created_at timestamptz not null default now()
);
create index xp_events_user_created_at_idx on public.xp_events(user_id, created_at desc);
alter table public.xp_events enable row level security;
create policy "users view their xp events" on public.xp_events for select using ((select auth.uid()) = user_id);

create table public.circles (
  id uuid primary key default gen_random_uuid(), owner_id uuid not null references public.profiles(id) on delete cascade,
  name varchar(60) not null, invite_code varchar(12) not null unique, created_at timestamptz not null default now()
);
create table public.circle_members (
  circle_id uuid not null references public.circles(id) on delete cascade, user_id uuid not null references public.profiles(id) on delete cascade,
  role varchar(12) not null default 'member' check (role in ('owner','member')), joined_at timestamptz not null default now(), primary key (circle_id, user_id)
);
alter table public.circles enable row level security; alter table public.circle_members enable row level security;
create policy "members view circles" on public.circles for select using (exists (select 1 from public.circle_members where circle_members.circle_id = circles.id and circle_members.user_id = (select auth.uid())));
create policy "members view circle members" on public.circle_members for select using (exists (select 1 from public.circle_members mine where mine.circle_id = circle_members.circle_id and mine.user_id = (select auth.uid())));

create table public.challenges (
  id uuid primary key default gen_random_uuid(), title varchar(120) not null, description varchar(300) not null,
  xp_reward integer not null check (xp_reward > 0), cadence varchar(12) not null check (cadence in ('daily','weekly')),
  starts_at timestamptz not null, ends_at timestamptz not null, created_at timestamptz not null default now()
);
create table public.user_challenge_completions (user_id uuid not null references public.profiles(id) on delete cascade, challenge_id uuid not null references public.challenges(id) on delete cascade, completed_at timestamptz not null default now(), primary key (user_id, challenge_id));
alter table public.challenges enable row level security; alter table public.user_challenge_completions enable row level security;
create policy "active challenges are readable" on public.challenges for select using (true);
create policy "users view their challenge completions" on public.user_challenge_completions for select using ((select auth.uid()) = user_id);

create or replace function public.complete_level(target_level_id uuid) returns jsonb language plpgsql security definer set search_path = public as $$
declare current_user_id uuid := auth.uid(); reward integer; target_roadmap_id uuid; completed_count integer;
begin
  if current_user_id is null then raise exception 'Not authenticated'; end if;
  select xp_reward, roadmap_id into reward, target_roadmap_id from levels where id = target_level_id;
  if reward is null then raise exception 'Level not found'; end if;
  if not exists (select 1 from user_roadmaps where user_id = current_user_id and roadmap_id = target_roadmap_id) then raise exception 'Roadmap has not been started'; end if;
  insert into user_level_progress (user_id, level_id) values (current_user_id, target_level_id) on conflict do nothing;
  if not found then return jsonb_build_object('alreadyCompleted', true); end if;
  update profiles set xp = xp + reward, level = greatest(1, floor(sqrt((xp + reward)::numeric / 100))::integer + 1), updated_at = now() where id = current_user_id;
  insert into xp_events (user_id, amount, source, source_id) values (current_user_id, reward, 'level', target_level_id);
  select count(*) into completed_count from user_level_progress where user_id = current_user_id;
  insert into user_achievements (user_id, achievement_id) select current_user_id, id from achievement_definitions where threshold <= completed_count on conflict do nothing;
  return jsonb_build_object('alreadyCompleted', false, 'xpEarned', reward, 'completedLevels', completed_count);
end; $$;

create or replace function public.complete_challenge(target_challenge_id uuid) returns jsonb language plpgsql security definer set search_path = public as $$
declare current_user_id uuid := auth.uid(); reward integer;
begin
  if current_user_id is null then raise exception 'Not authenticated'; end if;
  select xp_reward into reward from challenges where id = target_challenge_id and starts_at <= now() and ends_at > now();
  if reward is null then raise exception 'Challenge is unavailable'; end if;
  insert into user_challenge_completions (user_id, challenge_id) values (current_user_id, target_challenge_id) on conflict do nothing;
  if not found then return jsonb_build_object('alreadyCompleted', true); end if;
  update profiles set xp = xp + reward, level = greatest(1, floor(sqrt((xp + reward)::numeric / 100))::integer + 1), updated_at = now() where id = current_user_id;
  insert into xp_events (user_id, amount, source, source_id) values (current_user_id, reward, 'challenge', target_challenge_id);
  return jsonb_build_object('alreadyCompleted', false, 'xpEarned', reward);
end; $$;
revoke all on function public.complete_challenge(uuid) from public; grant execute on function public.complete_challenge(uuid) to authenticated;

create or replace function public.leaderboard_snapshot(scope text default 'global', period text default 'all_time', circle_invite text default null)
returns table (user_id uuid, username varchar, name varchar, avatar_url text, xp bigint, rank bigint) language sql security definer set search_path = public as $$
  with my_profile as (select college_name from profiles where id = auth.uid()), eligible as (
    select p.* from profiles p where case
      when scope = 'circle' then exists (select 1 from circle_members cm join circles c on c.id = cm.circle_id where cm.user_id = auth.uid() and c.invite_code = circle_invite and exists (select 1 from circle_members target where target.circle_id = c.id and target.user_id = p.id))
      when scope = 'college' then p.college_name is not null and p.college_name = (select college_name from my_profile)
      else true end
  ), scored as (select e.id, e.username, e.name, e.avatar_url, case when period = 'all_time' then e.xp::bigint else coalesce((select sum(x.amount) from xp_events x where x.user_id = e.id and x.created_at >= case when period = 'weekly' then date_trunc('week', now()) else date_trunc('month', now()) end), 0)::bigint end as points from eligible e)
  select id, username, name, avatar_url, points, rank() over (order by points desc, username asc) from scored order by points desc, username asc limit 50;
$$;
revoke all on function public.leaderboard_snapshot(text, text, text) from public; grant execute on function public.leaderboard_snapshot(text, text, text) to authenticated;

insert into public.challenges (title, description, xp_reward, cadence, starts_at, ends_at) values
  ('Ship a useful commit', 'Make one meaningful commit to a project you are learning from.', 40, 'daily', date_trunc('day', now()), date_trunc('day', now()) + interval '1 day'),
  ('Build in public', 'Share a project update or learning reflection with your circle.', 100, 'weekly', date_trunc('week', now()), date_trunc('week', now()) + interval '7 days')
on conflict do nothing;
