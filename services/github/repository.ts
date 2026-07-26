import { z } from "zod";

const repositoryUrlSchema = z.string().url().transform((value, context) => {
  const url = new URL(value); const parts = url.pathname.split("/").filter(Boolean);
  if (url.protocol !== "https:" || url.hostname !== "github.com" || parts.length !== 2) { context.addIssue({ code: z.ZodIssueCode.custom, message: "Use a public GitHub repository URL." }); return z.NEVER; }
  return { url: `https://github.com/${parts[0]}/${parts[1].replace(/\.git$/, "")}`, owner: parts[0], repository: parts[1].replace(/\.git$/, "") };
});
export const githubRepositoryUrl = repositoryUrlSchema;
const fileExtensions = /\.(?:ts|tsx|js|jsx|py|java|go|rb|php|cs|cpp|c|h|css|html|json|md|yml|yaml|sql)$/i;

function githubHeaders() { return { Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28", ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}) }; }
export type RepositorySnapshot = { fullName: string; defaultBranch: string; description: string | null; files: Array<{ path: string; content: string }> };
export async function readPublicRepository(input: z.infer<typeof repositoryUrlSchema>): Promise<RepositorySnapshot> {
  const base = `https://api.github.com/repos/${encodeURIComponent(input.owner)}/${encodeURIComponent(input.repository)}`;
  const repositoryResponse = await fetch(base, { headers: githubHeaders(), cache: "no-store", signal: AbortSignal.timeout(8_000) });
  if (!repositoryResponse.ok) throw new Error("GitHub could not access that public repository.");
  const repository = await repositoryResponse.json() as { full_name: string; default_branch: string; description: string | null };
  const treeResponse = await fetch(`${base}/git/trees/${encodeURIComponent(repository.default_branch)}?recursive=1`, { headers: githubHeaders(), cache: "no-store", signal: AbortSignal.timeout(10_000) });
  if (!treeResponse.ok) throw new Error("GitHub could not read the repository files.");
  const tree = await treeResponse.json() as { tree: Array<{ path: string; type: string; size?: number }> };
  const candidates = tree.tree.filter((item) => item.type === "blob" && item.size && item.size < 75_000 && fileExtensions.test(item.path) && !item.path.includes("node_modules/")).slice(0, 20);
  const files = await Promise.all(candidates.map(async (file) => { const response = await fetch(`${base}/contents/${file.path.split("/").map(encodeURIComponent).join("/")}`, { headers: githubHeaders(), cache: "no-store", signal: AbortSignal.timeout(8_000) }); if (!response.ok) return null; const content = await response.json() as { content?: string; encoding?: string }; if (content.encoding !== "base64" || !content.content) return null; return { path: file.path, content: Buffer.from(content.content, "base64").toString("utf8").slice(0, 12_000) }; }));
  return { fullName: repository.full_name, defaultBranch: repository.default_branch, description: repository.description, files: files.filter((file): file is { path: string; content: string } => Boolean(file)) };
}
