import {
  candidateRecordSchema,
  CATEGORY_IDS,
  repositoryRecordSchema,
  type CandidateRecord,
  type CategoryId,
} from "../src/lib/types";
import {
  CANONICAL_DIR,
  CANDIDATES_DIR,
  candidatePath,
  ensureDir,
  listJsonFiles,
  readJsonFile,
  writeJsonFile,
} from "./lib/paths";
import fs from "node:fs";

const API = "https://api.github.com";
const USER_AGENT = "ai-repo-directory-discover";

/** Hardcoded AI topic searches — discovery only; never auto-promotes. */
const SEARCH_QUERIES: { q: string; suggestedCategory: CategoryId | null }[] = [
  { q: "llm inference stars:>500", suggestedCategory: "llm-inference" },
  { q: "AI agent framework stars:>200", suggestedCategory: "ai-agents" },
  {
    q: "coding agent OR coding assistant LLM stars:>200",
    suggestedCategory: "coding-agents",
  },
  { q: "RAG retrieval augmented generation stars:>200", suggestedCategory: "rag" },
  {
    q: "local LLM OR ollama OR llama.cpp stars:>500",
    suggestedCategory: "local-ai",
  },
  {
    q: "stable diffusion OR image generation AI stars:>500",
    suggestedCategory: "image-ai",
  },
  {
    q: "text to video OR video generation AI stars:>200",
    suggestedCategory: "video-ai",
  },
  {
    q: "speech recognition OR TTS OR whisper stars:>500",
    suggestedCategory: "audio-ai",
  },
  {
    q: "LLM fine-tuning OR LoRA training stars:>200",
    suggestedCategory: "training",
  },
  {
    q: "LLM evaluation OR observability stars:>200",
    suggestedCategory: "evaluation",
  },
  {
    q: "model context protocol OR MCP server stars:>100",
    suggestedCategory: "mcp-tools",
  },
  {
    q: "multimodal LLM vision language stars:>200",
    suggestedCategory: "multimodal",
  },
  { q: "vector database embedding stars:>500", suggestedCategory: "vector-db" },
  {
    q: "AI infrastructure GPU inference serving stars:>200",
    suggestedCategory: "infrastructure",
  },
];

type RateState = { remaining: number | null; resetAt: number | null };

async function sleep(ms: number): Promise<void> {
  await new Promise((r) => setTimeout(r, ms));
}

function updateRate(res: Response, state: RateState): void {
  const rem = res.headers.get("x-ratelimit-remaining");
  const reset = res.headers.get("x-ratelimit-reset");
  if (rem != null) state.remaining = Number(rem);
  if (reset != null) state.resetAt = Number(reset);
}

async function maybeWait(state: RateState): Promise<void> {
  if (state.remaining == null || state.remaining > 3) return;
  const resetMs = state.resetAt
    ? Math.max(0, state.resetAt * 1000 - Date.now()) + 1000
    : 60_000;
  console.warn(`Search rate limit low; waiting ${Math.ceil(resetMs / 1000)}s`);
  await sleep(resetMs);
}

function loadCanonicalIds(): Set<string> {
  const ids = new Set<string>();
  for (const file of listJsonFiles(CANONICAL_DIR)) {
    const raw = readJsonFile<unknown>(file);
    if (!Array.isArray(raw)) continue;
    for (const item of raw) {
      const parsed = repositoryRecordSchema.safeParse(item);
      if (parsed.success) ids.add(parsed.data.id);
      else if (
        item &&
        typeof item === "object" &&
        "id" in item &&
        typeof (item as { id: unknown }).id === "string"
      ) {
        ids.add((item as { id: string }).id);
      }
    }
  }
  return ids;
}

function loadExistingCandidateIds(): Set<string> {
  const ids = new Set<string>();
  for (const file of listJsonFiles(CANDIDATES_DIR)) {
    try {
      const raw = readJsonFile<unknown>(file);
      const parsed = candidateRecordSchema.safeParse(raw);
      if (parsed.success) ids.add(parsed.data.id);
    } catch {
      /* ignore */
    }
  }
  return ids;
}

function toId(owner: string, repo: string): string {
  return `${owner}-${repo}`.toLowerCase().replace(/[^a-z0-9-]+/g, "-");
}

type SearchItem = {
  full_name?: string;
  html_url?: string;
  owner?: { login?: string };
  name?: string;
};

async function search(
  query: string,
  token: string | undefined,
  state: RateState,
): Promise<SearchItem[]> {
  await maybeWait(state);
  const params = new URLSearchParams({
    q: query,
    sort: "stars",
    order: "desc",
    per_page: "20",
  });
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": USER_AGENT,
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API}/search/repositories?${params}`, { headers });
  updateRate(res, state);

  if (!res.ok) {
    console.warn(`Search failed for "${query}": HTTP ${res.status}`);
    return [];
  }
  const json = (await res.json()) as { items?: SearchItem[] };
  return json.items ?? [];
}

async function main(): Promise<void> {
  const token = process.env.GITHUB_TOKEN || undefined;
  if (!token) {
    console.warn("GITHUB_TOKEN not set — search API is heavily rate-limited");
  }

  ensureDir(CANDIDATES_DIR);
  const canonical = loadCanonicalIds();
  const existing = loadExistingCandidateIds();
  const known = new Set([...canonical, ...existing]);
  const rate: RateState = { remaining: null, resetAt: null };

  let written = 0;
  let seenThisRun = 0;

  for (const { q, suggestedCategory } of SEARCH_QUERIES) {
    if (suggestedCategory && !CATEGORY_IDS.includes(suggestedCategory)) {
      continue;
    }

    console.log(`Searching: ${q}`);
    const items = await search(q, token, rate);
    // polite spacing between search pages (secondary rate limit)
    await sleep(1200);

    for (const item of items) {
      const owner = item.owner?.login ?? item.full_name?.split("/")[0];
      const repo = item.name ?? item.full_name?.split("/")[1];
      if (!owner || !repo) continue;

      const id = toId(owner, repo);
      seenThisRun++;
      if (known.has(id)) continue;

      const candidate: CandidateRecord = {
        id,
        githubUrl: item.html_url ?? `https://github.com/${owner}/${repo}`,
        owner,
        repo,
        discoveredAt: new Date().toISOString(),
        discoverySource: `github-search:${q}`,
        suggestedCategory,
        status: "pending",
      };

      const parsed = candidateRecordSchema.safeParse(candidate);
      if (!parsed.success) {
        console.warn(`Invalid candidate ${id}: ${parsed.error.message}`);
        continue;
      }

      const out = candidatePath(id);
      if (fs.existsSync(out)) continue;
      writeJsonFile(out, parsed.data);
      known.add(id);
      written++;
      console.log(`  + candidate ${id}`);
    }
  }

  console.log(
    `Discovery done: new candidates=${written}, scanned=${seenThisRun}, ` +
      `canonical=${canonical.size}. Review data/candidates/ — do not auto-promote.`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
