"use client";

import { motion, useReducedMotion } from "framer-motion";

const stars = Array.from({ length: 18 }, (_, index) => ({
  id: index,
  left: `${(index * 7) % 100}%`,
  top: `${(index * 13) % 100}%`,
  size: `${index % 2 === 0 ? 2 : 3}px`,
  delay: index * 0.16,
}));

export function AnimatedBackground() {
  const reduceMotion = useReducedMotion();

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#05060c]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(126,90,255,0.22),transparent_28%),radial-gradient(circle_at_80%_10%,rgba(34,211,238,0.15),transparent_24%),radial-gradient(circle_at_20%_80%,rgba(236,72,153,0.12),transparent_23%)]" />
      <motion.div
        animate={reduceMotion ? { opacity: 0.6 } : { opacity: [0.5, 0.7, 0.55, 0.8], scale: [1, 1.04, 1, 1.02] }}
        transition={reduceMotion ? { duration: 0 } : { duration: 12, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06),transparent_55%)]"
      />
      <motion.div
        animate={reduceMotion ? { x: 0, y: 0 } : { x: [0, 24, -12, 16, 0], y: [0, -30, 18, -12, 0] }}
        transition={reduceMotion ? { duration: 0 } : { duration: 18, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        className="absolute left-[-12%] top-[-10%] size-[32rem] rounded-full bg-fuchsia-500/10 blur-3xl"
      />
      <motion.div
        animate={reduceMotion ? { x: 0, y: 0 } : { x: [0, -18, 28, -8, 0], y: [0, 24, -20, 16, 0] }}
        transition={reduceMotion ? { duration: 0 } : { duration: 16, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        className="absolute bottom-[-14%] right-[-8%] size-[28rem] rounded-full bg-cyan-400/10 blur-3xl"
      />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:72px_72px] opacity-35" />
      {stars.map((star) => (
        <motion.span
          key={star.id}
          initial={{ opacity: 0.2 }}
          animate={reduceMotion ? { opacity: 0.45 } : { opacity: [0.2, 0.7, 0.3, 0.8] }}
          transition={reduceMotion ? { duration: 0 } : { duration: 4 + star.delay, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          className="absolute rounded-full bg-white/80"
          style={{ left: star.left, top: star.top, width: star.size, height: star.size }}
        />
      ))}
    </div>
  );
}
