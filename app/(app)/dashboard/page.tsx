import Link from "next/link";
import { Flame, Medal, Sparkles, Target, Trophy } from "lucide-react";
import { getCurrentProfile } from "@/lib/auth/dal";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { OnboardingForm } from "@/components/auth/onboarding-form";
import { getDashboardLearningData } from "@/features/roadmaps/data-access";
import { AnimatedStat } from "@/components/dashboard/animated-stat";
import { AnalyticsPanel } from "@/components/ui/analytics-panel";
import { NotificationsPanel } from "@/components/ui/notifications-panel";

export default async function DashboardPage() {
  const profile = await getCurrentProfile();
  if (!profile) return <DashboardShell><OnboardingPrompt /></DashboardShell>;

  const learning = await getDashboardLearningData();
  const stats = [
    { label: "Rank points", value: profile.xp, icon: Trophy, color: "text-violet-200" },
    { label: "Current level", value: profile.level, icon: Medal, color: "text-amber-200" },
    { label: "Daily streak", value: profile.streak, suffix: " days", icon: Flame, color: "text-pink-200" },
    { label: "Weekly goal", value: 0, suffix: " / 5", icon: Target, color: "text-cyan-200" },
  ];
  const enrolled = learning.enrolled as unknown as Array<{ roadmaps: { id: string; slug: string; title: string; icon: string } | null }>;
  const achievements = learning.achievements as unknown as Array<{ earned_at: string; achievement_definitions: { title: string; description: string; icon: string } | null }>;

  return (
    <DashboardShell>
      <section className="mx-auto max-w-6xl">
        <div className="rounded-[32px] border border-white/10 bg-[linear-gradient(135deg,rgba(124,58,237,0.18),rgba(6,182,212,0.12))] p-8 shadow-[0_30px_90px_rgba(0,0,0,.24)]">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-2xl">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-cyan-100">OVERVIEW</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Good evening, {profile.name.split(" ")[0]}.</h1>
              <p className="mt-3 max-w-xl text-sm leading-7 text-white/65">Your next project is waiting. Pick up where you left off and turn momentum into proof.</p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-2 text-sm text-cyan-100">
              <Sparkles className="size-4" />
              <span>Momentum synced</span>
            </div>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map(({ label, value, suffix, icon, color }) => (
              <AnimatedStat key={label} label={label} value={value} suffix={suffix} icon={icon} color={color} />
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_.8fr]">
          <article className="rounded-[28px] border border-white/10 bg-white/[.035] p-6 shadow-[0_24px_60px_rgba(0,0,0,.16)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-[11px] text-violet-200">CONTINUE LEARNING</p>
                <h2 className="mt-2 text-lg font-semibold">{enrolled.length ? "Continue building momentum" : "Choose your first roadmap"}</h2>
                <p className="mt-2 max-w-md text-sm leading-6 text-white/55">{enrolled.length ? "Your active learning paths are ready whenever you are." : "Start with a guided path, then build something real at the end of each level."}</p>
              </div>
              <span className="rounded-lg bg-violet-300/10 px-2 py-1 font-mono text-[10px] text-violet-100">{enrolled.length ? `${enrolled.length} ACTIVE` : "NEW"}</span>
            </div>

            {enrolled.length ? (
              <div className="mt-6 grid gap-2 sm:grid-cols-2">
                {enrolled.filter((item) => item.roadmaps).map(({ roadmaps }) => (
                  <Link key={roadmaps!.id} href={`/roadmaps/${roadmaps!.slug}`} className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/15 p-3 text-sm font-medium transition hover:-translate-y-0.5 hover:bg-white/5">
                    <span className="grid size-8 place-items-center rounded-lg bg-violet-300/10 font-mono text-xs text-violet-100">{roadmaps!.icon}</span>
                    {roadmaps!.title}
                    <span className="ml-auto text-white/35">→</span>
                  </Link>
                ))}
              </div>
            ) : (
              <Link href="/roadmaps" className="mt-6 inline-flex rounded-full bg-white px-4 py-2.5 text-sm font-bold text-black transition hover:-translate-y-0.5">Explore roadmaps →</Link>
            )}

            {achievements.length ? (
              <div className="mt-6 rounded-2xl border border-white/10 bg-black/15 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-white/45">Recent achievements</p>
                <div className="mt-3 space-y-2">
                  {achievements.slice(0, 3).map((achievement) => (
                    <div key={achievement.earned_at} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/70">
                      <span>{achievement.achievement_definitions?.title ?? "Milestone unlocked"}</span>
                      <span className="text-xs text-cyan-100">{new Date(achievement.earned_at).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </article>

          <div className="grid gap-4">
            <AnalyticsPanel />
            <NotificationsPanel />
          </div>
        </div>
      </section>
    </DashboardShell>
  );
}

function OnboardingPrompt() {
  return (
    <section className="mx-auto max-w-xl py-16">
      <p className="font-mono text-xs text-cyan-200">ONE LAST STEP</p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight">Make your profile yours.</h1>
      <p className="mt-4 text-sm leading-6 text-white/60">Choose a name and username. Your profile is where your projects and progress will live.</p>
      <OnboardingFormWrapper />
    </section>
  );
}

async function OnboardingFormWrapper() {
  const { requireUser } = await import("@/lib/auth/dal");
  const user = await requireUser();
  return <OnboardingForm defaultName={user.user_metadata.full_name ?? user.email?.split("@")[0] ?? ""} />;
}
