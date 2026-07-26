"use client";

import { useActionState } from "react";
import { Check, LoaderCircle } from "lucide-react";
import { completeLevel, type CompletionState } from "@/actions/roadmaps";
import { Button } from "@/components/ui/button";

export function CompleteLevelButton({ levelId, xp }: { levelId: string; xp: number }) {
  const [state, formAction, pending] = useActionState(completeLevel, {} as CompletionState);
  return <form action={formAction} className="mt-4"><input type="hidden" name="levelId" value={levelId} /><Button disabled={pending} size="sm" type="submit">{pending ? <LoaderCircle className="size-3.5 animate-spin" /> : <Check className="size-3.5" />}Mark complete <span className="font-mono text-[10px] opacity-75">+{xp} XP</span></Button>{state.error && <p role="alert" className="mt-2 text-xs text-red-200">{state.error}</p>}{state.success && <p role="status" className="mt-2 text-xs text-cyan-100">{state.success}</p>}</form>;
}
