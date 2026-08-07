import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth/dal";
import { createAdminClient } from "@/supabase/admin";
import { createClient } from "@/supabase/server";

export type Roadmap = { id: string; slug: string; title: string; description: string; difficulty: "beginner" | "intermediate" | "advanced"; icon: string; };
export type Level = { id: string; title: string; description: string; xp_reward: number; position: number; };

export async function getPublishedRoadmaps(): Promise<Roadmap[]> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase.from("roadmaps").select("id,slug,title,description,difficulty,icon").eq("is_published", true).order("title");
    if (error) throw new Error("Unable to load roadmaps.");
    return data as Roadmap[];
  } catch {
    return [];
  }
}

export async function getRoadmap(slug: string) {
  try {
    const user = await requireUser();
    const supabase = await createClient();
    const { data: roadmap, error } = await supabase.from("roadmaps").select("id,slug,title,description,difficulty,icon").eq("slug", slug).eq("is_published", true).maybeSingle();
    if (error) throw new Error("Unable to load this roadmap.");
    if (!roadmap) notFound();
    const [{ data: levels, error: levelsError }, { data: enrollment, error: enrollmentError }] = await Promise.all([
      supabase.from("levels").select("id,title,description,xp_reward,position").eq("roadmap_id", roadmap.id).order("position"),
      supabase.from("user_roadmaps").select("started_at").eq("user_id", user.id).eq("roadmap_id", roadmap.id).maybeSingle(),
    ]);
    if (levelsError || enrollmentError) throw new Error("Unable to load your roadmap progress.");
    const levelIds = (levels ?? []).map((level) => level.id);
    const { data: progress, error: progressError } = levelIds.length ? await supabase.from("user_level_progress").select("level_id").eq("user_id", user.id).in("level_id", levelIds) : { data: [], error: null };
    if (progressError) throw new Error("Unable to load your roadmap progress.");
    return { roadmap: roadmap as Roadmap, levels: levels as Level[], started: Boolean(enrollment), completedLevelIds: new Set((progress ?? []).map((item: { level_id: string }) => item.level_id)) };
  } catch {
    notFound();
  }
}

export async function getDashboardLearningData() {
  try {
    const user = await requireUser();
    const supabase = await createClient();
    const [{ data: enrolled }, { data: achievements }] = await Promise.all([
      supabase.from("user_roadmaps").select("roadmaps(id,slug,title,icon)").eq("user_id", user.id).limit(3),
      supabase.from("user_achievements").select("earned_at,achievement_definitions(title,description,icon)").eq("user_id", user.id).order("earned_at", { ascending: false }).limit(3),
    ]);
    return { enrolled: enrolled ?? [], achievements: achievements ?? [] };
  } catch {
    return { enrolled: [], achievements: [] };
  }
}
