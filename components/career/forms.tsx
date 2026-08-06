"use client";
import { useActionState } from "react";
import { LoaderCircle } from "lucide-react";
import { applyForJob, createJob, updateCareerProfile, type CareerState } from "@/actions/career";
import { Button } from "@/components/ui/button";

const empty = {} as CareerState;

function Notice({ state }: { state: CareerState }) {
  return (
    <>
      {state.error && <p role="alert" className="text-sm text-rose-200">{state.error}</p>}
      {state.success && <p role="status" className="text-sm text-cyan-100">{state.success}</p>}
    </>
  );
}

export function CareerProfileForm({ profile }: { profile: Record<string, string | boolean | null> }) {
  const [state, action, pending] = useActionState(updateCareerProfile, empty);

  return (
    <form action={action} className="mt-7 grid gap-4 rounded-3xl border border-white/10 bg-white/[.035] p-5 sm:p-6">
      <div className="rounded-2xl border border-cyan-300/15 bg-cyan-300/5 p-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-cyan-200">Career profile</p>
        <p className="mt-2 text-sm text-white/60">Shape the profile recruiters will see when they land on your work.</p>
      </div>

      <label className="text-sm font-medium text-white/80">
        Name
        <input name="name" required defaultValue={String(profile.name ?? "")} className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm outline-none transition focus:border-cyan-300/40" />
      </label>

      <label className="text-sm font-medium text-white/80">
        Headline
        <input name="headline" defaultValue={String(profile.headline ?? "")} className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm outline-none transition focus:border-cyan-300/40" />
      </label>

      <label className="text-sm font-medium text-white/80">
        Bio
        <textarea name="bio" defaultValue={String(profile.bio ?? "")} rows={3} className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm outline-none transition focus:border-cyan-300/40" />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-medium text-white/80">
          Location
          <input name="location" defaultValue={String(profile.location ?? "")} className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm outline-none transition focus:border-cyan-300/40" />
        </label>
        <label className="text-sm font-medium text-white/80">
          Website
          <input name="website" type="url" defaultValue={String(profile.website ?? "")} className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm outline-none transition focus:border-cyan-300/40" />
        </label>
      </div>

      <label className="text-sm font-medium text-white/80">
        LinkedIn URL
        <input name="linkedinUrl" type="url" defaultValue={String(profile.linkedin_url ?? "")} className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm outline-none transition focus:border-cyan-300/40" />
      </label>

      <label className="text-sm font-medium text-white/80">
        Resume summary
        <textarea name="resumeSummary" defaultValue={String(profile.resume_summary ?? "")} rows={5} className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm outline-none transition focus:border-cyan-300/40" />
      </label>

      <label className="flex items-center gap-2 text-sm text-white/70">
        <input type="checkbox" name="portfolioVisible" defaultChecked={Boolean(profile.portfolio_visible)} className="rounded border-white/10 bg-black/20" />
        Make my portfolio public
      </label>

      <Notice state={state} />
      <Button type="submit" disabled={pending} className="w-fit">
        {pending && <LoaderCircle className="size-4 animate-spin" />}
        Save profile
      </Button>
    </form>
  );
}

export function JobForm() {
  const [state, action, pending] = useActionState(createJob, empty);

  return (
    <form action={action} className="grid gap-3 rounded-3xl border border-white/10 bg-white/[.035] p-5">
      <div className="rounded-2xl border border-violet-300/15 bg-violet-300/5 p-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-violet-200">Publish a role</p>
        <p className="mt-2 text-sm text-white/60">Share your opportunity with the cohort that is already building momentum.</p>
      </div>

      <input name="title" required placeholder="Role title" className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm outline-none transition focus:border-violet-300/40" />
      <input name="company" required placeholder="Company" className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm outline-none transition focus:border-violet-300/40" />
      <textarea name="description" required minLength={30} rows={5} placeholder="Role description" className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm outline-none transition focus:border-violet-300/40" />
      <input name="location" placeholder="Location" className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm outline-none transition focus:border-violet-300/40" />
      <input name="applyUrl" type="url" placeholder="External apply URL (optional)" className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm outline-none transition focus:border-violet-300/40" />
      <label className="text-sm text-white/70">
        <input name="remote" type="checkbox" defaultChecked className="mr-2 rounded border-white/10 bg-black/20" />
        Remote friendly
      </label>
      <Notice state={state} />
      <Button disabled={pending} type="submit" className="w-fit">
        {pending && <LoaderCircle className="size-4 animate-spin" />}
        Publish job
      </Button>
    </form>
  );
}

export function ApplyForm({ jobId }: { jobId: string }) {
  const [state, action, pending] = useActionState(applyForJob, empty);

  return (
    <form action={action} className="mt-4 rounded-3xl border border-white/10 bg-white/[.035] p-5">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-cyan-200">Application note</p>
      <textarea name="note" maxLength={1200} rows={3} placeholder="Short note to the hiring team (optional)" className="mt-3 w-full rounded-2xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm outline-none transition focus:border-cyan-300/40" />
      <Notice state={state} />
      <Button disabled={pending} size="sm" type="submit" className="mt-3">
        {pending && <LoaderCircle className="size-3.5 animate-spin" />}
        Apply with SpidyCode profile
      </Button>
    </form>
  );
}
