import { BriefcaseBusiness, MapPin, Sparkles } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { PageHero } from "@/components/dashboard/page-hero";
import { ApplyForm } from "@/components/career/forms";
import { getJobs } from "@/features/career/data-access";
import { EmptyState } from "@/components/ui/empty-state";

export default async function JobsPage() {
  const jobs = await getJobs();

  return (
    <DashboardShell>
      <section className="mx-auto max-w-4xl">
        <PageHero
          eyebrow="Opportunities"
          title="Find a role worth building toward."
          description="Apply directly with your public portfolio, project evidence, and verified profile."
          badge="Application-ready"
        />
        <div className="mt-8 grid gap-4">
          {jobs.map((job) => (
            <article key={job.id} className="rounded-3xl border border-white/10 bg-white/[.035] p-6 shadow-[0_24px_60px_rgba(0,0,0,.16)]">
              <div className="flex flex-wrap justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold">{job.title}</h2>
                  <p className="mt-1 flex items-center gap-2 text-sm text-cyan-100">
                    <Sparkles className="size-4" />
                    {job.company}
                  </p>
                </div>
                <span className="flex h-fit items-center gap-1 rounded-full border border-white/10 bg-black/20 px-3 py-2 text-xs text-white/60">
                  <MapPin className="size-3.5" />
                  {job.remote ? "Remote" : job.location ?? "On site"}
                </span>
              </div>
              <p className="mt-4 text-sm leading-7 text-white/60">{job.description}</p>
              <ApplyForm jobId={job.id} />
            </article>
          ))}
          {!jobs.length && <EmptyState title="No roles are open right now" description="Check back soon for new postings from leading teams and recruiters." />}
        </div>
      </section>
    </DashboardShell>
  );
}
