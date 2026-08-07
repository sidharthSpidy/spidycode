import { FileDown, Printer } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { PageHero } from "@/components/dashboard/page-hero";
import { getCurrentProfile, requireUser } from "@/lib/auth/dal";
import { createAdminClient } from "@/supabase/admin";

export default async function ResumePage() {
  const user = await requireUser();
  const profile = await getCurrentProfile();
  const admin = createAdminClient();
  const { data: projects } = await admin.from("projects").select("title,description,github_repo,ai_score").eq("user_id", user.id).eq("status", "approved");

  return (
    <DashboardShell>
      <section className="mx-auto max-w-4xl print:bg-white print:text-black">
        <PageHero
          eyebrow="Resume builder"
          title="Export a resume that feels as sharp as your work."
          description="Turn your approved projects into a polished, printable document that is ready to share with hiring teams."
          badge="PDF export ready"
        />
        <div className="no-print mt-4 flex flex-wrap items-center justify-between gap-3 rounded-[24px] border border-white/10 bg-white/[.035] px-4 py-3 text-sm text-white/70">
          <div className="flex items-center gap-2">
            <Printer className="size-4 text-cyan-200" />
            <span>Print or save as PDF from your browser to export this resume.</span>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-2 text-white/70">
            <FileDown className="size-4" />
            <span>PDF export ready</span>
          </div>
        </div>
        <article className="mt-6 rounded-[32px] bg-white p-8 text-slate-900 shadow-[0_30px_90px_rgba(0,0,0,.28)] sm:p-12">
          <h1 className="text-3xl font-bold">{profile?.name}</h1>
          <p className="mt-1 text-slate-600">{profile?.headline ?? "Software developer"}</p>
          <p className="mt-5 leading-7 text-slate-700">{profile?.resume_summary ?? profile?.bio ?? ""}</p>
          <h2 className="mt-9 border-b border-slate-200 pb-2 text-lg font-bold">Selected projects</h2>
          <div className="mt-4 grid gap-4">
            {(projects ?? []).map((project) => (
              <div key={project.title}>
                <div className="flex flex-wrap justify-between gap-3">
                  <h3 className="font-semibold">{project.title}</h3>
                  <span className="text-sm text-slate-500">AI score: {project.ai_score ?? "—"}</span>
                </div>
                <p className="mt-1 text-sm leading-6 text-slate-700">{project.description}</p>
                <p className="mt-1 text-xs text-slate-500">{project.github_repo}</p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </DashboardShell>
  );
}
