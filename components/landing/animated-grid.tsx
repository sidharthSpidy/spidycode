"use client";

import { useEffect, useRef } from "react";

export function AnimatedGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const context = canvas.getContext("2d"); if (!context) return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let animationFrame = 0;
    const draw = () => { const { innerWidth: width, innerHeight: height, devicePixelRatio: ratio } = window; canvas.width = width * ratio; canvas.height = height * ratio; context.setTransform(ratio, 0, 0, ratio, 0, 0); context.strokeStyle = "rgba(140,125,255,.055)"; context.lineWidth = 1; for (let x = 0; x < width; x += 72) { context.beginPath(); context.moveTo(x, 0); context.lineTo(x, height); context.stroke(); } for (let y = 0; y < height; y += 72) { context.beginPath(); context.moveTo(0, y); context.lineTo(width, y); context.stroke(); } };
    const render = () => { draw(); if (!prefersReducedMotion) animationFrame = requestAnimationFrame(render); };
    render(); window.addEventListener("resize", draw); return () => { cancelAnimationFrame(animationFrame); window.removeEventListener("resize", draw); };
  }, []);
  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 h-full w-full" />;
}
