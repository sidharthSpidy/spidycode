import Link from "next/link";
import { Award, Sparkles } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { PageHero } from "@/components/dashboard/page-hero";
import { Button } from "@/components/ui/button";
import { requestCertificate } from "@/actions/career";
import { requireUser } from "@/lib/auth/dal";
import { createAdminClient } from "@/supabase/admin";
import { EmptyState } from "@/components/ui/empty-state";

type RoadmapSummary = { id: string; title: string };
type RoadmapLink = { roadmaps: RoadmapSummary[] | null };
type CertificateLink = { id: string; verification_code: string; roadmaps: RoadmapSummary[] | null };

export default async function CertificatesPage() {
  const user = await requireUser();
  const admin = createAdminClient();
  const [{ data: started }, { data: certificates }] = await Promise.all([
    admin.from("user_roadmaps").select("roadmaps(id,title)").eq("user_id", user.id),
    admin.from("certificates").select("id,verification_code,roadmaps(id,title)").eq("user_id", user.id),
  ]);

  const startedItems = (started as RoadmapLink[] | null) ?? [];
  const certificateItems = (certificates as CertificateLink[] | null) ?? [];

  return (
    <DashboardShell>
      <section className="mx-auto max-w-3xl">
        <PageHero
          eyebrow="Certificates"
          title="Make your progress verifiable."
          description="Collect proof of completion for your strongest roadmaps and share it with recruiters when it matters."
          badge="Verified credentials"
        />
        <div className="mt-7 grid gap-4">
          {startedItems.length === 0 ? (
            <EmptyState title="No roadmap certificates yet" description="Complete a roadmap to unlock your first verified credential." />
          ) : (
            startedItems.map((item) => {
              const roadmap = item.roadmaps?.[0] ?? null;
              if (!roadmap) return null;
              const certificate = certificateItems.find((entry) => entry.roadmaps?.[0]?.id === roadmap.id);
              return (
                <article key={roadmap.id} className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/10 bg-white/[.035] p-5 shadow-[0_24px_60px_rgba(0,0,0,.16)]">
                  <div className="flex items-center gap-3">
                    <div className="grid size-11 place-items-center rounded-2xl bg-cyan-400/10 text-cyan-200">
                      <Award className="size-5" />
                    </div>
                    <div>
                      <h2 className="font-semibold">{roadmap.title}</h2>
                      <p className="mt-1 text-sm text-white/55">Available when every roadmap level is complete.</p>
                    </div>
                  </div>
                  {certificate ? (
                    <Link href={`/certificates/${certificate.id}`} className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-100 transition hover:text-white">
                      View certificate
                      <Sparkles className="size-4" />
                    </Link>
                  ) : (
                    <form action={requestCertificate.bind(null, roadmap.id)}>
                      <Button size="sm" type="submit">
                        <Award className="size-3.5" />Request certificate
                      </Button>
                    </form>
                  )}
                </article>
              );
            })
          )}
        </div>
      </section>
    </DashboardShell>
  );
}
