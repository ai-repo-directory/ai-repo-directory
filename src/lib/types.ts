import { z } from "zod";

export const CATEGORY_IDS = [
  "llm-inference",
  "ai-agents",
  "coding-agents",
  "rag",
  "local-ai",
  "image-ai",
  "video-ai",
  "audio-ai",
  "training",
  "evaluation",
  "mcp-tools",
  "multimodal",
  "datasets",
  "infrastructure",
  "research",
  "vector-db",
] as const;

export type CategoryId = (typeof CATEGORY_IDS)[number];

export const MAINTENANCE_SIGNALS = [
  "active",
  "moderate",
  "slow",
  "stale",
  "archived",
  "unknown",
] as const;

export type MaintenanceSignal = (typeof MAINTENANCE_SIGNALS)[number];

export const DIFFICULTIES = ["beginner", "intermediate", "advanced"] as const;
export type Difficulty = (typeof DIFFICULTIES)[number];

export const DOC_QUALITIES = [
  "excellent",
  "good",
  "fair",
  "poor",
  "unknown",
] as const;
export type DocQuality = (typeof DOC_QUALITIES)[number];

export const AUDIENCES = [
  "researchers",
  "engineers",
  "hobbyists",
  "enterprises",
  "students",
] as const;
export type Audience = (typeof AUDIENCES)[number];

export const repositoryRecordSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  owner: z.string().min(1),
  repo: z.string().min(1),
  githubUrl: z.string().url(),
  homepage: z.string().url().nullable(),
  description: z.string().nullable(),
  editorialSummary: z.string().min(1),
  whyCare: z.string().min(1),
  primaryCategory: z.enum(CATEGORY_IDS),
  secondaryCategories: z.array(z.enum(CATEGORY_IDS)),
  tags: z.array(z.string()),
  language: z.string().nullable(),
  license: z.string().nullable(),
  stars: z.number().int().nonnegative().nullable(),
  forks: z.number().int().nonnegative().nullable(),
  latestCommitAt: z.string().nullable(),
  latestRelease: z.string().nullable(),
  archived: z.boolean(),
  maintenance: z.enum(MAINTENANCE_SIGNALS),
  selfHostable: z.boolean(),
  localOfflineCapable: z.boolean(),
  audience: z.array(z.enum(AUDIENCES)),
  difficulty: z.enum(DIFFICULTIES),
  documentationQuality: z.enum(DOC_QUALITIES),
  demoAvailable: z.boolean(),
  featured: z.boolean(),
  emerging: z.boolean(),
  historicallySignificant: z.boolean(),
  dateLastVerified: z.string(),
  sources: z.array(z.string()),
  notes: z.string().optional(),
});

export type RepositoryRecord = z.infer<typeof repositoryRecordSchema>;

export const githubSnapshotSchema = z.object({
  id: z.string(),
  fetchedAt: z.string(),
  stars: z.number().int().nonnegative(),
  forks: z.number().int().nonnegative(),
  watchers: z.number().int().nonnegative(),
  openIssues: z.number().int().nonnegative(),
  language: z.string().nullable(),
  license: z.string().nullable(),
  description: z.string().nullable(),
  homepage: z.string().nullable(),
  topics: z.array(z.string()),
  archived: z.boolean(),
  disabled: z.boolean(),
  pushedAt: z.string().nullable(),
  updatedAt: z.string().nullable(),
  createdAt: z.string().nullable(),
  latestRelease: z.string().nullable(),
  latestReleaseAt: z.string().nullable(),
  defaultBranch: z.string().nullable(),
});

export type GitHubSnapshot = z.infer<typeof githubSnapshotSchema>;

export const scoreBreakdownSchema = z.object({
  adoption: z.number(),
  maintenance: z.number(),
  activity: z.number(),
  documentation: z.number(),
  maturity: z.number(),
  ecosystem: z.number(),
  usefulness: z.number(),
});

export const scoreRecordSchema = z.object({
  id: z.string(),
  score: z.number(),
  breakdown: scoreBreakdownSchema,
  computedAt: z.string(),
});

export type ScoreRecord = z.infer<typeof scoreRecordSchema>;

export const candidateRecordSchema = z.object({
  id: z.string(),
  githubUrl: z.string().url(),
  owner: z.string(),
  repo: z.string(),
  discoveredAt: z.string(),
  discoverySource: z.string(),
  suggestedCategory: z.enum(CATEGORY_IDS).nullable(),
  status: z.enum(["pending", "approved", "rejected"]),
  notes: z.string().optional(),
});

export type CandidateRecord = z.infer<typeof candidateRecordSchema>;

/** Merged view used by the UI */
export type EnrichedRepository = RepositoryRecord & {
  score: number;
  scoreBreakdown: ScoreRecord["breakdown"] | null;
  github: GitHubSnapshot | null;
  effectiveStars: number | null;
  effectiveForks: number | null;
  effectiveLicense: string | null;
  effectiveLanguage: string | null;
  effectivePushedAt: string | null;
  effectiveArchived: boolean;
};
