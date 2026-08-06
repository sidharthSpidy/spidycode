import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { CareerProfileForm } from "@/components/career/forms";
import { PageHero } from "@/components/dashboard/page-hero";
import { getCurrentProfile } from "@/lib/auth/dal";

export default async function ProfilePage() {
  const profile = await getCurrentProfile();
  if (!profile) return null;

  return (
    <DashboardShell>
      <section className="mx-auto max-w-3xl">
        <PageHero
          eyebrow="Profile & portfolio"
          title="Make your work discoverable."
          description="Shape your public identity and give recruiters a polished, trustworthy view of your work."
          badge="Portfolio ready"
          action={
            <span className="inline-flex items-center gap-2">
              <Sparkles className="size-4 text-violet-200" />
              Public URL
            </span>
          }
        />

        <div className="mt-5 flex flex-wrap items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-2 text-sm text-cyan-100">
          <span>Public URL</span>
          <Link className="font-semibold hover:text-white" href={`/u/${profile.username}`}>
            spidycode.dev/u/{profile.username}
          </Link>
          <ArrowUpRight className="size-4" />
        </div>

        <div className="mt-7 grid gap-4 lg:grid-cols-[1.1fr_.9fr]">
          <div className="rounded-[28px] border border-white/10 bg-white/[.035] p-6 shadow-[0_24px_60px_rgba(0,0,0,.2)]">
            <CareerProfileForm profile={profile as unknown as Record<string, string | boolean | null>} />
          </div>
          <div className="space-y-4">
            <article className="rounded-[28px] border border-white/10 bg-[linear-gradient(135deg,rgba(124,58,237,0.14),rgba(6,182,212,0.1))] p-6 shadow-[0_24px_60px_rgba(0,0,0,.16)]">
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-100">Portfolio signal</p>
              <h2 className="mt-3 text-xl font-semibold">Recruiters will see your strongest story first.</h2>
              <p className="mt-2 text-sm leading-7 text-white/60">Your headline, projects, and verified roadmaps work together to create a more trustworthy first impression.</p>
            </article>
            <Link href="/resume" className="flex items-center justify-between rounded-[28px] border border-white/10 bg-white/[.035] p-6 text-left shadow-[0_24px_60px_rgba(0,0,0,.16)] transition hover:-translate-y-0.5">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-violet-200">Resume builder</p>
                <p className="mt-2 text-sm font-semibold text-white">Preview a printable resume</p>
              </div>
              <ArrowUpRight className="size-4 text-cyan-200" />
            </Link>
          </div>
        </div>
      </section>
    </DashboardShell>
  );
}
