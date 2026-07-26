import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#05060c] disabled:pointer-events-none disabled:opacity-50",
  { variants: { variant: { default: "bg-gradient-to-br from-violet-400 to-violet-600 px-5 py-3 text-white shadow-[0_12px_32px_rgba(115,92,235,.35)] hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(115,92,235,.5)]", outline: "border border-white/15 bg-white/5 px-5 py-3 text-white hover:bg-white/10" }, size: { default: "", sm: "px-4 py-2 text-xs" } }, defaultVariants: { variant: "default", size: "default" } }
);

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> { asChild?: boolean }
export function Button({ className, variant, size, asChild, ...props }: ButtonProps) { const Comp = asChild ? Slot : "button"; return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />; }
