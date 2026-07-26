"use server";
import { redirect } from "next/navigation";
import { createClient } from "@/supabase/server";
import { z } from "zod";
export async function signOut() { const supabase = await createClient(); await supabase.auth.signOut(); redirect("/"); }
export type PasswordState = { error?: string; success?: string };
export async function updatePassword(_: PasswordState, formData: FormData): Promise<PasswordState> { const password=z.string().min(8,"Password must contain at least 8 characters.").safeParse(formData.get("password")); if(!password.success)return {error:password.error.issues[0]?.message}; const supabase=await createClient(); const {error}=await supabase.auth.updateUser({password:password.data}); return error?{error:"Unable to update your password. Try signing in again."}:{success:"Password updated."}; }
