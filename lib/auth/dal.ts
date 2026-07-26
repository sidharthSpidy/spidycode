import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/supabase/server";

export const getCurrentUser = cache(async () => {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) return null;
  return user;
});

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function getCurrentProfile() {
  const user = await requireUser();
  const supabase = await createClient();
  const { data, error } = await supabase.from("profiles").select("id, username, name, xp, level, streak, avatar_url").eq("id", user.id).maybeSingle();
  if (error) throw new Error("Unable to load your profile.");
  return data;
}
