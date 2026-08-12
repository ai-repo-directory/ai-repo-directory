# Data Schema

Canonical repository records live in `data/canonical/*.json` (one file per primary category, plus optional `extras.json`). Derived GitHub snapshots live in `data/derived/github/<owner>__<repo>.json`. Scores live in `data/derived/scores.json`. Candidates in `data/candidates/*.json`.

## RepositoryRecord

```ts
interface RepositoryRecord {
  /** Stable slug: owner-repo, lowercase, hyphenated */
  id: string;
  name: string;
  owner: string;
  repo: string;
  githubUrl: string;
  homepage: string | null;

  /** GitHub description (may be refreshed) */
  description: string | null;
  /** Human editorial summary (1–3 sentences) */
  editorialSummary: string;
  /** Why developers should care */
  whyCare: string;

  primaryCategory: CategoryId;
  secondaryCategories: CategoryId[];
  tags: string[];

  language: string | null;
  license: string | null;

  /** Seed / last-known values; ingestion overwrites in derived */
  stars: number | null;
  forks: number | null;
  latestCommitAt: string | null; // ISO
  latestRelease: string | null;
  archived: boolean;
  maintenance: MaintenanceSignal;

  selfHostable: boolean;
  localOfflineCapable: boolean;

  audience: Audience[];
  difficulty: Difficulty;
  documentationQuality: DocQuality;
  demoAvailable: boolean;

  /** Editors */
  featured: boolean;
  emerging: boolean;
  historicallySignificant: boolean;

  dateLastVerified: string; // ISO date
  sources: string[]; // docs URLs inspected
  notes?: string;
}

type MaintenanceSignal =
  | "active"
  | "moderate"
  | "slow"
  | "stale"
  | "archived"
  | "unknown";

type Difficulty = "beginner" | "intermediate" | "advanced";
type DocQuality = "excellent" | "good" | "fair" | "poor" | "unknown";
type Audience =
  | "researchers"
  | "engineers"
  | "hobbyists"
  | "enterprises"
  | "students";

type CategoryId =
  | "llm-inference"
  | "ai-agents"
  | "coding-agents"
  | "rag"
  | "local-ai"
  | "image-ai"
  | "video-ai"
  | "audio-ai"
  | "training"
  | "evaluation"
  | "mcp-tools"
  | "multimodal"
  | "datasets"
  | "infrastructure"
  | "research"
  | "vector-db";
```

## GitHubSnapshot

```ts
interface GitHubSnapshot {
  id: string;
  fetchedAt: string;
  stars: number;
  forks: number;
  watchers: number;
  openIssues: number;
  language: string | null;
  license: string | null;
  description: string | null;
  homepage: string | null;
  topics: string[];
  archived: boolean;
  disabled: boolean;
  pushedAt: string | null;
  updatedAt: string | null;
  createdAt: string | null;
  latestRelease: string | null;
  latestReleaseAt: string | null;
  defaultBranch: string | null;
}
```

## ScoreRecord

```ts
interface ScoreRecord {
  id: string;
  score: number; // 0–100
  breakdown: {
    adoption: number;
    maintenance: number;
    activity: number;
    documentation: number;
    maturity: number;
    ecosystem: number;
    usefulness: number;
  };
  computedAt: string;
}
```

## CandidateRecord

```ts
interface CandidateRecord {
  id: string;
  githubUrl: string;
  owner: string;
  repo: string;
  discoveredAt: string;
  discoverySource: string;
  suggestedCategory: CategoryId | null;
  status: "pending" | "approved" | "rejected";
  notes?: string;
}
```

## File conventions

- Never put secrets in data files.
- Prefer `null` over inventing values.
- `dateLastVerified` must be set when editorial fields are written.
- IDs must be unique across all canonical files.
- Secondary categories must not repeat the primary.
