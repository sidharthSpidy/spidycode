import { UsersRound, Zap } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { PageHero } from "@/components/dashboard/page-hero";
import { ChallengeButton, CreateCircleForm, JoinCircleForm } from "@/components/community/community-forms";
import { getCommunityData } from "@/features/community/data-access";

export default async function CommunityPage() {
  const { circles, challenges, completed } = await getCommunityData();
  const circleList = circles as unknown as Array<{ role: string; circles: { id: string; name: string; invite_code: string } | null }>;

  return (
    <DashboardShell>
      <section className="mx-auto max-w-5xl">
        <PageHero
          eyebrow="Community"
          title="Build with people who show up."
          description="Create a private circle for your friends, share an invite code, and turn solo momentum into a shared habit."
          badge="Circle ready"
        />
        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          <article className="rounded-[28px] border border-white/10 bg-white/[.035] p-6 shadow-[0_24px_60px_rgba(0,0,0,.16)]">
            <h2 className="flex items-center gap-2 font-semibold">
              <UsersRound className="size-4 text-violet-200" />
              Your circles
            </h2>
            {circleList.length ? (
              <div className="mt-5 grid gap-3">
                {circleList.map(({ circles: circle, role }) =>
                  circle ? (
                    <div key={circle.id} className="rounded-2xl border border-white/10 bg-black/15 p-4">
                      <div className="flex justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold">{circle.name}</p>
                          <p className="mt-1 font-mono text-[10px] text-white/45">INVITE · {circle.invite_code}</p>
                        </div>
                        <span className="text-xs capitalize text-cyan-100">{role}</span>
                      </div>
                    </div>
                  ) : null
                )}
              </div>
            ) : (
              <p className="mt-4 text-sm text-white/50">You haven’t joined a circle yet.</p>
            )}
            <div className="mt-6 grid gap-5 border-t border-white/10 pt-6 sm:grid-cols-2">
              <div>
                <p className="mb-3 text-sm font-medium">Create a circle</p>
                <CreateCircleForm />
              </div>
              <div>
                <p className="mb-3 text-sm font-medium">Join with a code</p>
                <JoinCircleForm />
              </div>
            </div>
          </article>

          <article className="rounded-[28px] border border-white/10 bg-white/[.035] p-6 shadow-[0_24px_60px_rgba(0,0,0,.16)]">
            <h2 className="flex items-center gap-2 font-semibold">
              <Zap className="size-4 text-cyan-200" />
              Active challenges
            </h2>
            <div className="mt-5 grid gap-3">
              {challenges.map((challenge) => (
                <div key={challenge.id} className="rounded-2xl border border-white/10 bg-black/15 p-4">
                  <div className="flex justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold">{challenge.title}</p>
                      <p className="mt-1 text-xs leading-5 text-white/50">{challenge.description}</p>
                    </div>
                    <span className="h-fit rounded-full bg-violet-300/10 px-2 py-1 font-mono text-[10px] text-violet-100">+{challenge.xp_reward} XP</span>
                  </div>
                  <ChallengeButton challengeId={challenge.id} completed={completed.has(challenge.id)} />
                </div>
              ))}
              {!challenges.length && <p className="text-sm text-white/50">No active challenges yet.</p>}
            </div>
          </article>
        </div>
      </section>
    </DashboardShell>
  );
}
