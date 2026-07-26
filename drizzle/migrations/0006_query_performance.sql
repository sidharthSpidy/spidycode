-- Phase 4: indexes for the production read paths used by the application.
-- Each index supports an existing filter/order or a foreign-key lookup.

create index if not exists roadmaps_published_title_idx
  on public.roadmaps (title)
  where is_published = true;

create index if not exists projects_user_status_completed_idx
  on public.projects (user_id, status, completed_at desc);

create index if not exists projects_public_portfolio_idx
  on public.projects (user_id, completed_at desc)
  where status = 'approved' and portfolio_visible = true;

create index if not exists circle_members_user_idx
  on public.circle_members (user_id, circle_id);

create index if not exists challenges_active_window_idx
  on public.challenges (starts_at, ends_at);

create index if not exists jobs_published_created_idx
  on public.jobs (created_at desc)
  where is_published = true;

create index if not exists certificates_user_issued_idx
  on public.certificates (user_id, issued_at desc);

create index if not exists job_applications_user_idx
  on public.job_applications (user_id, job_id);
