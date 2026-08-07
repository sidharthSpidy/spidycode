"use client";

import { motion } from "framer-motion";
import { BellRing, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

export function NotificationsPanel() {
  const [items, setItems] = useState<string[]>(["Profile updates are ready to share.", "New roadmaps are available to explore."]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setItems((current) => ["Your resume export is prepared.", ...current]);
    }, 1400);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-white/10 bg-white/[.035] p-6 shadow-[0_24px_60px_rgba(0,0,0,.16)]">
      <div className="flex items-center gap-2 text-cyan-100">
        <BellRing className="size-4" />
        <h2 className="font-semibold">Notifications</h2>
      </div>
      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <div key={item} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/20 px-3 py-3 text-sm text-white/70">
            <Sparkles className="mt-0.5 size-4 text-violet-200" />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
