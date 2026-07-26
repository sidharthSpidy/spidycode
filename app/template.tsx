"use client";
import { motion, useReducedMotion } from "framer-motion";
export default function Template({ children }: { children: React.ReactNode }) { const reduce = useReducedMotion(); return <motion.div initial={reduce ? false : { opacity:0, y:7 }} animate={{ opacity:1, y:0 }} exit={reduce ? undefined : { opacity:0, y:-5 }} transition={{ duration:.3, ease:[.2,.8,.2,1] }}>{children}</motion.div>; }
