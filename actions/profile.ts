"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireUser } from "@/lib/auth/dal";
import { createClient } from "@/supabase/server";

export type OnboardingState = { error?: string };
const profileSchema = z.object({ name: z.string().trim().min(2, "Enter your name.").max(100), username: z.string().trim().toLowerCase().regex(/^[a-z0-9_]{3,30}$/, "Use 3–30 lowercase letters, numbers, or underscores.") });

export async function completeOnboarding(_: OnboardingState, formData: FormData): Promise<OnboardingState> {
  const parsed = profileSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  const user = await requireUser();
  const supabase = await createClient();
  const { error } = await supabase.from("profiles").upsert({ id: user.id, name: parsed.data.name, username: parsed.data.username, avatar_url: user.user_metadata.avatar_url ?? null }, { onConflict: "id" });
  if (error?.code === "23505") return { error: "That username is already taken." };
  if (error) return { error: "We couldn’t save your profile. Please try again." };
  revalidatePath("/dashboard");
  redirect("/dashboard");
}
