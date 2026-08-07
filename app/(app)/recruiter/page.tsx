import { BriefcaseBusiness, ShieldCheck } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { PageHero } from "@/components/dashboard/page-hero";
import { JobForm } from "@/components/career/forms";
import { getCurrentProfile } from "@/lib/auth/dal";

export default async function RecruiterPage() {
  const profile = await getCurrentProfile();

  if (profile?.role !== "recruiter" && profile?.role !== "admin") {
    return (
      <DashboardShell>
        <section className="mx-auto max-w-xl rounded-[30px] border border-white/10 bg-white/[.035] p-8 shadow-[0_30px_80px_rgba(0,0,0,.24)]">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-100">
            <ShieldCheck className="size-3.5" /> Recruiter access
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight">This space is for verified recruiters.</h1>
          <p className="mt-3 text-sm leading-7 text-white/60">Contact the SpidyCode team to have your organization account verified and unlock job publishing.</p>
        </section>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <section className="mx-auto max-w-3xl">
        <PageHero
          eyebrow="Recruiter dashboard"
          title="Publish an opportunity"
          description="Learners apply with their verified profile, projects, and progress so your team can discover ready-to-work talent."
          badge="Hiring-ready talent pool"
          action={<BriefcaseBusiness className="size-4 text-cyan-200" />}
        />
        <div className="mt-7 grid gap-4 lg:grid-cols-[1fr_.8fr]">
          <div className="rounded-[28px] border border-white/10 bg-white/[.035] p-6 shadow-[0_24px_60px_rgba(0,0,0,.2)]">
            <JobForm />
          </div>
          <article className="rounded-[28px] border border-white/10 bg-[linear-gradient(135deg,rgba(124,58,237,0.14),rgba(6,182,212,0.1))] p-6 shadow-[0_24px_60px_rgba(0,0,0,.16)]">
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-100">Why it works</p>
            <h2 className="mt-3 text-xl font-semibold">Applications come with proof instead of promises.</h2>
            <p className="mt-2 text-sm leading-7 text-white/60">Each candidate arrives with project evidence, roadmap completion, and a public portfolio that makes screening faster.</p>
          </article>
        </div>
      </section>
    </DashboardShell>
  );
}
