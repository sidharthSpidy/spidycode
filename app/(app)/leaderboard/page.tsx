import Link from "next/link";
import { Crown, Medal, Trophy } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { PageHero } from "@/components/dashboard/page-hero";
import { getCommunityData, getLeaderboard } from "@/features/community/data-access";

const scopes = ["global", "circle", "college"] as const;
const periods = ["all_time", "weekly", "monthly"] as const;

export default async function LeaderboardPage({ searchParams }: { searchParams: Promise<{ scope?: string; period?: string; circle?: string }> }) {
  const search = await searchParams;
  const scope = scopes.includes(search.scope as typeof scopes[number]) ? search.scope as typeof scopes[number] : "global";
  const period = periods.includes(search.period as typeof periods[number]) ? search.period as typeof periods[number] : "all_time";
  const community = await getCommunityData();
  const circles = community.circles as unknown as Array<{ circles: { invite_code: string; name: string } | null }>;
  const circle = scope === "circle" ? search.circle ?? circles[0]?.circles?.invite_code : undefined;
  const entries = await getLeaderboard(scope, period, circle) as Array<{ user_id: string; username: string; name: string; xp: number; rank: number }>;

  return (
    <DashboardShell>
      <section className="mx-auto max-w-4xl">
        <PageHero
          eyebrow="Leaderboard"
          title="Momentum, made visible."
          description="Track the strongest community streaks and see where your progress lands across the platform."
          badge="Live rankings"
        />
        <div className="mt-7 flex flex-wrap gap-2">
          {scopes.map((item) => (
            <Link key={item} href={`/leaderboard?scope=${item}&period=${period}${item === "circle" && circle ? `&circle=${circle}` : ""}`} className={`rounded-full px-3 py-2 text-xs font-semibold capitalize ${scope === item ? "bg-white text-black" : "border border-white/10 bg-white/5 text-white/60 hover:text-white"}`}>
              {item === "circle" ? "Friends" : item}
            </Link>
          ))}
          <span className="mx-1 w-px bg-white/10" />
          {periods.map((item) => (
            <Link key={item} href={`/leaderboard?scope=${scope}&period=${item}${circle ? `&circle=${circle}` : ""}`} className={`rounded-full px-3 py-2 text-xs font-semibold ${period === item ? "bg-cyan-300/15 text-cyan-100" : "text-white/45 hover:text-white"}`}>
              {item.replace("_", " ")}
            </Link>
          ))}
        </div>

        {scope === "circle" && circles.length > 1 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {circles.map(({ circles: item }) => item && (
              <Link key={item.invite_code} href={`/leaderboard?scope=circle&period=${period}&circle=${item.invite_code}`} className={`rounded-lg border px-2.5 py-1.5 text-xs ${circle === item.invite_code ? "border-cyan-300/40 text-cyan-100" : "border-white/10 text-white/50"}`}>
                {item.name}
              </Link>
            ))}
          </div>
        )}

        <div className="mt-7 overflow-hidden rounded-[28px] border border-white/10 bg-white/[.035]">
          <div className="flex items-center gap-2 border-b border-white/10 p-5 text-sm font-semibold">
            <Trophy className="size-4 text-amber-200" />
            {scope === "circle" ? "Friends" : scope === "college" ? "College" : "Global"} · {period.replace("_", " ")}
          </div>
          {entries.map((entry, index) => (
            <div key={entry.user_id} className="flex items-center gap-4 border-b border-white/5 px-5 py-4 last:border-0">
              <span className={`w-5 font-mono text-xs ${index < 3 ? "text-amber-200" : "text-white/40"}`}>
                {index === 0 ? <Crown className="size-4" /> : entry.rank}
              </span>
              <span className="grid size-9 place-items-center rounded-full bg-violet-300/10 text-xs font-bold text-violet-100">{entry.name.slice(0, 1)}</span>
              <div className="flex-1">
                <p className="text-sm font-semibold">{entry.name}</p>
                <p className="font-mono text-[10px] text-white/45">@{entry.username}</p>
              </div>
              <span className="font-mono text-xs text-cyan-100">{entry.xp.toLocaleString()} XP</span>
            </div>
          ))}
          {!entries.length && (
            <div className="p-10 text-center text-sm text-white/50">
              <Medal className="mx-auto mb-3 size-5" />
              No rankings are available for this view yet.
            </div>
          )}
        </div>
      </section>
    </DashboardShell>
  );
}
