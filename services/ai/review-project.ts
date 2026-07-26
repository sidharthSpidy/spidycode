import OpenAI from "openai";
import { z } from "zod";
import type { RepositorySnapshot } from "@/services/github/repository";

const reviewSchema = z.object({ overallScore: z.number().int().min(0).max(100), codeQuality: z.number().int().min(0).max(100), performance: z.number().int().min(0).max(100), security: z.number().int().min(0).max(100), structure: z.number().int().min(0).max(100), strengths: z.array(z.string().max(220)).max(4), weaknesses: z.array(z.string().max(220)).max(4), suggestions: z.array(z.string().max(260)).max(5) });
export type ProjectReview = z.infer<typeof reviewSchema>;
const outputSchema = { type: "json_schema" as const, name: "project_review", strict: true, schema: { type: "object", additionalProperties: false, required: ["overallScore", "codeQuality", "performance", "security", "structure", "strengths", "weaknesses", "suggestions"], properties: { overallScore: { type: "integer", minimum: 0, maximum: 100 }, codeQuality: { type: "integer", minimum: 0, maximum: 100 }, performance: { type: "integer", minimum: 0, maximum: 100 }, security: { type: "integer", minimum: 0, maximum: 100 }, structure: { type: "integer", minimum: 0, maximum: 100 }, strengths: { type: "array", items: { type: "string" }, maxItems: 4 }, weaknesses: { type: "array", items: { type: "string" }, maxItems: 4 }, suggestions: { type: "array", items: { type: "string" }, maxItems: 5 } } } };

export async function reviewProject({ projectTitle, projectDescription, snapshot, safetyIdentifier }: { projectTitle: string; projectDescription: string; snapshot: RepositorySnapshot; safetyIdentifier: string }): Promise<{ review: ProjectReview; model: string }> {
  if (!process.env.OPENAI_API_KEY) throw new Error("AI review is not configured yet.");
  if (snapshot.files.length === 0) throw new Error("No supported source files were found in this repository.");
  const model = process.env.OPENAI_MODEL ?? "gpt-5";
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const source = snapshot.files.map((file) => `--- ${file.path} ---\n${file.content}`).join("\n\n").slice(0, 120_000);
  const response = await client.responses.create({ model, store: false, safety_identifier: safetyIdentifier, instructions: "You are a precise senior software engineer reviewing a student project. Assess only evidence in the submitted repository. Do not claim execution, testing, or vulnerabilities you cannot substantiate. Give concise, constructive feedback. Return the requested JSON only.", input: `Project title: ${projectTitle}\nProject goal: ${projectDescription}\nRepository: ${snapshot.fullName} (${snapshot.defaultBranch})\nRepository description: ${snapshot.description ?? "None"}\n\nSource snapshot:\n${source}`, text: { format: outputSchema } });
  const parsed = reviewSchema.safeParse(JSON.parse(response.output_text));
  if (!parsed.success) throw new Error("The AI review returned an invalid result.");
  return { review: parsed.data, model };
}
