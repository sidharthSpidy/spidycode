"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[24px] border border-dashed border-white/15 bg-white/[.035] p-8 text-center shadow-[0_24px_60px_rgba(0,0,0,.16)]"
    >
      <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-200">
        <Sparkles className="size-5" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-white/60">{description}</p>
    </motion.div>
  );
}
