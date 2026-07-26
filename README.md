# SpidyCode

## Milestone 1 — Foundation and public landing page

This milestone establishes the production frontend baseline and a performant, accessible public landing page. It intentionally excludes authentication, database access, and user data; those belong in the next approved milestone.

### Included

- Next.js App Router + TypeScript with strict checks
- Tailwind CSS v4, shadcn-compatible component configuration, and reusable Button primitive
- Framer Motion used only for reduced-motion-aware visual transitions
- SEO metadata, semantic landmarks, keyboard-visible focus styles, responsive navigation and layout
- A premium landing experience covering hero, product features, roadmap preview, leaderboard preview, and CTA

### Structure

```text
app/                 routes, metadata, global styles
components/
  landing/           public-page sections and client-side visual effects
  ui/                reusable UI primitives
lib/                 framework-agnostic helpers
features/            reserved for domain modules in Milestone 2+
services/            reserved for external integrations
supabase/            reserved for Supabase clients and policies
drizzle/             reserved for schema and migrations
tests/               reserved for Vitest and Playwright suites
```

### Run locally

Install Node.js 20.9+ first. Then run:

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. Before deploying, run `npm run typecheck`, `npm run lint`, and `npm run build`.

### Next milestone (requires approval)

Implement friend circles, leaderboards, challenges, and communities.

## Milestone 2 — Authentication, profiles, and application shell

This milestone adds the secure entry point for every private feature: Supabase Auth, server-side user verification, protected dashboard routing, a profile onboarding flow, and the initial PostgreSQL schema guarded with Row Level Security.

### Configure Supabase

1. Create a Supabase project and copy its Project URL and publishable key to a local `.env.local`, using `.env.example` as the template.
2. In Supabase SQL Editor, run `drizzle/migrations/0000_initial.sql` once. It creates the application tables and their RLS policies.
3. In **Authentication → URL configuration**, add `http://localhost:3000/auth/callback` and the deployed callback URL.
4. Enable Email, GitHub, and Google providers. Create each OAuth application with the callback URL `https://<project-ref>.supabase.co/auth/v1/callback`, then paste its credentials into Supabase.

Authentication is checked in both `proxy.ts` (fast route gate/session refresh) and the server-side data access layer (authoritative `getUser()` verification). Database access uses RLS so a browser client cannot read or mutate another user’s data.

## Milestone 3 — Roadmaps, XP, and achievements

This milestone delivers the learning loop: published roadmaps, gated sequential levels, user enrollment, real dashboard data, XP, and achievement unlocks.

Run `drizzle/migrations/0001_learning_progress.sql` in the Supabase SQL Editor after the initial migration. It contains both the new schema and a small, idempotent starter catalog. Level completion calls `complete_level`, a `security definer` PostgreSQL function that verifies the caller’s enrollment and awards XP atomically. Browsers have no RLS policy allowing them to write XP or level progress directly.

## Milestone 4 — Project submissions and AI review

Run `drizzle/migrations/0002_project_reviews.sql` after the first two migrations. Add `SUPABASE_SERVICE_ROLE_KEY`, `OPENAI_API_KEY`, and optionally `GITHUB_TOKEN` to `.env.local`; never expose any of them with a `NEXT_PUBLIC_` prefix.

Students submit a public `https://github.com/<owner>/<repo>` URL. Server-side code allows only that exact host, reads a bounded set of supported text source files, and does not persist the snapshot. The review uses the OpenAI Responses API with `store: false` and strict JSON Schema, then stores only the structured review. Project review writes use an admin-only server client after the authenticated user is verified; browser clients cannot create or alter project scores or review rows.
