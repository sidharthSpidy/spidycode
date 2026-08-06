import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { PageHero } from "@/components/dashboard/page-hero";
import { ProjectSubmitForm } from "@/components/projects/project-submit-form";
import { getCompletedLevelsForUser } from "@/features/projects/data-access";

export default async function SubmitProjectPage({ searchParams }: { searchParams: Promise<{ levelId?: string }> }) {
  const [completed, { levelId }] = await Promise.all([getCompletedLevelsForUser(), searchParams]);
  const levels = (completed as unknown as Array<{ levels: { id: string; title: string; position: number; roadmaps: { title: string } | null } | null }>).flatMap(({ levels: level }) => level ? [{ id: level.id, label: `${level.roadmaps?.title ?? "Roadmap"} · ${String(level.position).padStart(2, "0")} ${level.title}` }] : []);

  return (
    <DashboardShell>
      <section className="mx-auto max-w-2xl">
        <PageHero
          eyebrow="Project submission"
          title="Show what you built."
          description="Submit a completed level project for an evidence-based AI review."
          badge="AI review ready"
        />
        {levels.length ? (
          <div className="mt-7 rounded-[28px] border border-white/10 bg-white/[.035] p-6 shadow-[0_24px_60px_rgba(0,0,0,.16)]">
            <ProjectSubmitForm levels={levels} initialLevelId={levelId} />
          </div>
        ) : (
          <div className="mt-8 rounded-[28px] border border-white/10 bg-white/[.035] p-7 text-sm text-white/55 shadow-[0_24px_60px_rgba(0,0,0,.16)]">
            Complete a roadmap level before submitting a project for review.
          </div>
        )}
      </section>
    </DashboardShell>
  );
}
