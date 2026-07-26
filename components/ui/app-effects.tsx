"use client";
import { useEffect } from "react";
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring } from "framer-motion";

export function AppEffects() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 25 });
  const pointerX = useMotionValue(-200);
  const pointerY = useMotionValue(-200);
  const glowX = useSpring(pointerX, { stiffness: 45, damping: 18, mass: .4 });
  const glowY = useSpring(pointerY, { stiffness: 45, damping: 18, mass: .4 });

  useEffect(() => {
    if (reduce || !window.matchMedia("(pointer: fine)").matches) return;
    let frame = 0;
    let x = -200;
    let y = -200;
    const move = (event: PointerEvent) => {
      x = event.clientX - 128;
      y = event.clientY - 128;
      if (!frame) frame = requestAnimationFrame(() => { pointerX.set(x); pointerY.set(y); frame = 0; });
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => { window.removeEventListener("pointermove", move); cancelAnimationFrame(frame); };
  }, [pointerX, pointerY, reduce]);

  return <><motion.div className="scroll-progress fixed left-0 top-0 z-[60] h-px origin-left bg-gradient-to-r from-violet-400 via-cyan-200 to-pink-300" style={{ scaleX: progress }} /><motion.div aria-hidden="true" className="pointer-events-none fixed z-[-1] hidden size-64 rounded-full bg-cyan-300/[.035] blur-3xl md:block" style={{ x: glowX, y: glowY }} /><div aria-hidden="true" className="pointer-events-none fixed -right-32 top-32 -z-10 size-96 rounded-full bg-violet-500/[.055] blur-3xl" /></>;
}
