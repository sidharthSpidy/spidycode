import { ArrowUpRight } from "lucide-react";

interface PageHeroProps {
  eyebrow: string;
  title: string;
  description: string;
  badge?: string;
  action?: React.ReactNode;
}

export function PageHero({ eyebrow, title, description, badge, action }: PageHeroProps) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(135deg,rgba(124,58,237,0.16),rgba(6,182,212,0.12))] p-7 shadow-[0_30px_90px_rgba(0,0,0,.22)]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-2xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-cyan-100">{eyebrow}</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">{title}</h1>
          <p className="mt-3 text-sm leading-7 text-white/65">{description}</p>
        </div>
        {(badge || action) && (
          <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/75">
            {badge ? <span>{badge}</span> : null}
            {action ? <div className="flex items-center gap-2 text-cyan-100">{action} <ArrowUpRight className="size-4" /></div> : null}
          </div>
        )}
      </div>
    </div>
  );
}
