"use client";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { useState, type ButtonHTMLAttributes, type PointerEvent } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "ui-button inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#05060c] disabled:pointer-events-none disabled:opacity-45 disabled:grayscale-[.3]",
  { variants: { variant: { default: "bg-gradient-to-br from-violet-400 via-violet-500 to-indigo-600 px-5 py-3 text-white shadow-[0_10px_28px_rgba(115,92,235,.32)] hover:-translate-y-0.5 hover:shadow-[0_16px_42px_rgba(115,92,235,.52)]", outline: "border border-white/15 bg-white/[.055] px-5 py-3 text-white shadow-[inset_0_1px_0_rgba(255,255,255,.07)] hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[.1]" }, size: { default: "", sm: "px-4 py-2 text-xs" } }, defaultVariants: { variant: "default", size: "default" } }
);

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> { asChild?: boolean }
export function Button({ className, variant, size, asChild, onPointerDown, ...props }: ButtonProps) { const [pressed,setPressed]=useState(false); const Comp=asChild?Slot:"button"; const ripple=(event:PointerEvent<HTMLElement>)=>{const bounds=event.currentTarget.getBoundingClientRect();event.currentTarget.style.setProperty("--ripple-x",`${event.clientX-bounds.left}px`);event.currentTarget.style.setProperty("--ripple-y",`${event.clientY-bounds.top}px`);setPressed(true);window.setTimeout(()=>setPressed(false),440);onPointerDown?.(event as never);}; return <Comp data-pressed={pressed} className={cn(buttonVariants({variant,size}),className)} onPointerDown={ripple} {...props}/>; }
