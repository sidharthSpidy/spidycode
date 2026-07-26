"use server";

import type { Route } from "next";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/supabase/server";
import { getApplicationUrl } from "@/lib/url";

export type AuthState = { error?: string; message?: string };
const credentialsSchema = z.object({ email: z.string().trim().email("Enter a valid email address."), password: z.string().min(8, "Password must contain at least 8 characters.") });
const safeNext = (value: FormDataEntryValue | null): Route => (typeof value === "string" && value.startsWith("/") && !value.startsWith("//") ? value : "/dashboard") as Route;

export async function signIn(_: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = credentialsSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) return { error: "We couldn’t sign you in with those details." };
  redirect(safeNext(formData.get("next")));
}

export async function signUp(_: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = credentialsSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  const origin = getApplicationUrl();
  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({ email: parsed.data.email, password: parsed.data.password, options: { emailRedirectTo: `${origin}/auth/callback` } });
  if (error) return { error: "We couldn’t create your account. Try a different email." };
  return { message: "Check your inbox to confirm your email, then come back to sign in." };
}

export async function signInWithOAuth(provider: "github" | "google") {
  const origin = getApplicationUrl();
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({ provider, options: { redirectTo: `${origin}/auth/callback` } });
  if (error || !data.url) redirect("/login?error=oauth");
  redirect(data.url as never);
}
