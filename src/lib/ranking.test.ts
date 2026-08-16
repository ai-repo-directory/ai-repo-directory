import { describe, expect, it } from "vitest";
import { computeScore } from "./ranking";
import { filterRepositories, parseFilters } from "./search";
import type { EnrichedRepository, RepositoryRecord } from "./types";
import { repositoryRecordSchema } from "./types";
import { sitePath } from "./format";
import fs from "node:fs";
import path from "node:path";

const baseRepo: RepositoryRecord = {
  id: "vllm-project-vllm",
  name: "vLLM",
  owner: "vllm-project",
  repo: "vllm",
  githubUrl: "https://github.com/vllm-project/vllm",
  homepage: "https://vllm.ai",
  description: "High-throughput LLM serving",
  editorialSummary: "A high-throughput and memory-efficient inference engine.",
  whyCare: "Production serving with PagedAttention.",
  primaryCategory: "llm-inference",
  secondaryCategories: ["infrastructure"],
  tags: ["serving", "gpu"],
  language: "Python",
  license: "Apache-2.0",
  stars: 40000,
  forks: 6000,
  latestCommitAt: new Date().toISOString(),
  latestRelease: "v0.1.0",
  archived: false,
  maintenance: "active",
  selfHostable: true,
  localOfflineCapable: true,
  audience: ["engineers"],
  difficulty: "advanced",
  documentationQuality: "excellent",
  demoAvailable: false,
  featured: true,
  emerging: false,
  historicallySignificant: false,
  dateLastVerified: "2026-08-12",
  sources: ["https://github.com/vllm-project/vllm"],
};

describe("repositoryRecordSchema", () => {
  it("accepts a valid record", () => {
    expect(repositoryRecordSchema.parse(baseRepo).id).toBe(baseRepo.id);
  });

  it("rejects missing editorial fields", () => {
    const bad = { ...baseRepo, editorialSummary: "" };
    expect(() => repositoryRecordSchema.parse(bad)).toThrow();
  });
});

describe("computeScore", () => {
  it("scores active featured projects highly", () => {
    const score = computeScore(baseRepo, null);
    expect(score.score).toBeGreaterThan(60);
    expect(score.breakdown.maintenance).toBe(100);
  });

  it("penalizes archived repos", () => {
    const archived = computeScore(
      { ...baseRepo, archived: true, maintenance: "archived" },
      null,
    );
    expect(archived.score).toBeLessThan(computeScore(baseRepo, null).score);
  });
});

describe("filterRepositories", () => {
  const enriched = {
    ...baseRepo,
    score: 80,
    scoreBreakdown: null,
    github: null,
    effectiveStars: 40000,
    effectiveForks: 6000,
    effectiveLicense: "Apache-2.0",
    effectiveLanguage: "Python",
    effectivePushedAt: baseRepo.latestCommitAt,
    effectiveArchived: false,
  } satisfies EnrichedRepository;

  it("filters by category and selfHostable", () => {
    const result = filterRepositories([enriched], {
      category: "llm-inference",
      selfHostable: true,
    });
    expect(result).toHaveLength(1);
  });

  it("parses URL filters", () => {
    const filters = parseFilters(
      new URLSearchParams("q=vllm&selfHostable=1&sort=stars"),
    );
    expect(filters.q).toBe("vllm");
    expect(filters.selfHostable).toBe(true);
    expect(filters.sort).toBe("stars");
  });

  it("ignores an invalid minimum-stars filter", () => {
    expect(parseFilters(new URLSearchParams("minStars=not-a-number")).minStars).toBeUndefined();
  });

  it("sorts repositories by stars", () => {
    const lower = { ...enriched, id: "lower", effectiveStars: 1 };
    const higher = { ...enriched, id: "higher", effectiveStars: 2 };
    expect(filterRepositories([lower, higher], { sort: "stars" }).map((repo) => repo.id)).toEqual(["higher", "lower"]);
  });
});

describe("GitHub Pages helpers and release data", () => {
  it("prefixes project routes with the configured base path", () => {
    const previous = process.env.NEXT_PUBLIC_BASE_PATH;
    process.env.NEXT_PUBLIC_BASE_PATH = "/ai-repo-directory";
    expect(sitePath("/explore")).toBe("/ai-repo-directory/explore");
    process.env.NEXT_PUBLIC_BASE_PATH = previous;
  });

  it("ships 256 canonical records and matching scores", () => {
    const root = path.resolve(import.meta.dirname, "../..");
    const canonicalDir = path.join(root, "data", "canonical");
    const canonicalCount = fs.readdirSync(canonicalDir)
      .filter((file) => file.endsWith(".json"))
      .flatMap((file) => JSON.parse(fs.readFileSync(path.join(canonicalDir, file), "utf8")) as unknown[])
      .length;
    const scores = JSON.parse(fs.readFileSync(path.join(root, "data", "derived", "scores.json"), "utf8")) as unknown[];
    expect(canonicalCount).toBe(256);
    expect(scores).toHaveLength(canonicalCount);
  });
});
