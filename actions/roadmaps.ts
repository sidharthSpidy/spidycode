"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireUser } from "@/lib/auth/dal";
import { createClient } from "@/supabase/server";

const idSchema = z.string().uuid();
export type CompletionState = { error?: string; success?: string };

export async function startRoadmap(roadmapId: string, slug: string) {
  const roadmap = idSchema.safeParse(roadmapId); if (!roadmap.success) redirect("/roadmaps");
  const user = await requireUser(); const supabase = await createClient();
  const { error } = await supabase.from("user_roadmaps").upsert({ user_id: user.id, roadmap_id: roadmap.data }, { onConflict: "user_id,roadmap_id", ignoreDuplicates: true });
  if (error) throw new Error("Unable to start this roadmap.");
  revalidatePath("/dashboard"); redirect(`/roadmaps/${slug}`);
}

export async function completeLevel(_: CompletionState, formData: FormData): Promise<CompletionState> {
  const parsed = idSchema.safeParse(formData.get("levelId")); if (!parsed.success) return { error: "Invalid level." };
  await requireUser(); const supabase = await createClient();
  const { data, error } = await supabase.rpc("complete_level", { target_level_id: parsed.data });
  if (error) return { error: "We couldn’t record this level. Please try again." };
  const result = data as { alreadyCompleted: boolean; xpEarned?: number };
  if (result.alreadyCompleted) return { success: "This level is already complete." };
  revalidatePath("/dashboard"); revalidatePath("/roadmaps");
  return { success: `Level complete — you earned ${result.xpEarned ?? 0} XP.` };
}
