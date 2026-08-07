"use client";

import { motion } from "framer-motion";
import { Activity, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { getAnalyticsSnapshot } from "@/lib/analytics";

export function AnalyticsPanel() {
  const [snapshot, setSnapshot] = useState(() => getAnalyticsSnapshot());

  useEffect(() => {
    const refresh = () => setSnapshot(getAnalyticsSnapshot());
    refresh();
    window.addEventListener("storage", refresh);
    return () => window.removeEventListener("storage", refresh);
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-white/10 bg-white/[.035] p-6 shadow-[0_24px_60px_rgba(0,0,0,.16)]">
      <div className="flex items-center gap-2 text-cyan-100">
        <Activity className="size-4" />
        <h2 className="font-semibold">Activity insights</h2>
      </div>
      <p className="mt-2 text-sm text-white/60">Recent interaction events are stored locally so your workflow can be tracked and reviewed.</p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-white/45">Tracked actions</p>
          <p className="mt-2 text-2xl font-semibold">{snapshot.total}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-white/45">Top event</p>
          <p className="mt-2 text-sm font-semibold">{snapshot.events[0]?.event ?? "No events yet"}</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {Object.entries(snapshot.totals).map(([event, count]) => (
          <span key={event} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-white/70">
            <Sparkles className="size-3.5" />
            {event}: {count}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
