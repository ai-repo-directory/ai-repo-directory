import Fuse from "fuse.js";
import type { CategoryId, Difficulty, EnrichedRepository } from "./types";

export interface SearchFilters {
  q?: string;
  category?: CategoryId | "";
  language?: string;
  license?: string;
  maintenance?: string;
  difficulty?: Difficulty | "";
  selfHostable?: boolean;
  localOfflineCapable?: boolean;
  minStars?: number;
  sort?: "score" | "stars" | "recent" | "name";
}

export function parseFilters(
  params: URLSearchParams | Record<string, string | string[] | undefined>,
): SearchFilters {
  const get = (key: string): string | undefined => {
    if (params instanceof URLSearchParams) {
      return params.get(key) ?? undefined;
    }
    const v = params[key];
    return Array.isArray(v) ? v[0] : v;
  };

  const bool = (key: string): boolean | undefined => {
    const v = get(key);
    if (v === "1" || v === "true") return true;
    if (v === "0" || v === "false") return false;
    return undefined;
  };

  const minStarsRaw = get("minStars");
  const minStars = minStarsRaw ? Number(minStarsRaw) : undefined;

  return {
    q: get("q")?.trim() || undefined,
    category: (get("category") as CategoryId) || undefined,
    language: get("language") || undefined,
    license: get("license") || undefined,
    maintenance: get("maintenance") || undefined,
    difficulty: (get("difficulty") as Difficulty) || undefined,
    selfHostable: bool("selfHostable"),
    localOfflineCapable: bool("localOfflineCapable"),
    minStars: Number.isFinite(minStars) ? minStars : undefined,
    sort: (get("sort") as SearchFilters["sort"]) || "score",
  };
}

export function filtersToSearchParams(filters: SearchFilters): URLSearchParams {
  const sp = new URLSearchParams();
  if (filters.q) sp.set("q", filters.q);
  if (filters.category) sp.set("category", filters.category);
  if (filters.language) sp.set("language", filters.language);
  if (filters.license) sp.set("license", filters.license);
  if (filters.maintenance) sp.set("maintenance", filters.maintenance);
  if (filters.difficulty) sp.set("difficulty", filters.difficulty);
  if (filters.selfHostable) sp.set("selfHostable", "1");
  if (filters.localOfflineCapable) sp.set("localOfflineCapable", "1");
  if (filters.minStars != null) sp.set("minStars", String(filters.minStars));
  if (filters.sort && filters.sort !== "score") sp.set("sort", filters.sort);
  return sp;
}

export function filterRepositories(
  repos: EnrichedRepository[],
  filters: SearchFilters,
): EnrichedRepository[] {
  let results = repos;

  if (filters.category) {
    const category = filters.category;
    results = results.filter(
      (r) =>
        r.primaryCategory === category ||
        r.secondaryCategories.includes(category),
    );
  }
  if (filters.language) {
    results = results.filter(
      (r) =>
        r.effectiveLanguage?.toLowerCase() ===
        filters.language!.toLowerCase(),
    );
  }
  if (filters.license) {
    results = results.filter((r) =>
      (r.effectiveLicense ?? "")
        .toLowerCase()
        .includes(filters.license!.toLowerCase()),
    );
  }
  if (filters.maintenance) {
    results = results.filter((r) => r.maintenance === filters.maintenance);
  }
  if (filters.difficulty) {
    results = results.filter((r) => r.difficulty === filters.difficulty);
  }
  if (filters.selfHostable) {
    results = results.filter((r) => r.selfHostable);
  }
  if (filters.localOfflineCapable) {
    results = results.filter((r) => r.localOfflineCapable);
  }
  if (filters.minStars != null) {
    results = results.filter(
      (r) => (r.effectiveStars ?? 0) >= filters.minStars!,
    );
  }

  if (filters.q) {
    const fuse = new Fuse(results, {
      keys: [
        { name: "name", weight: 0.3 },
        { name: "editorialSummary", weight: 0.25 },
        { name: "whyCare", weight: 0.15 },
        { name: "description", weight: 0.1 },
        { name: "tags", weight: 0.1 },
        { name: "owner", weight: 0.05 },
        { name: "repo", weight: 0.05 },
      ],
      threshold: 0.35,
      ignoreLocation: true,
    });
    results = fuse.search(filters.q).map((r) => r.item);
  }

  const sort = filters.sort ?? "score";
  results = [...results].sort((a, b) => {
    switch (sort) {
      case "stars":
        return (b.effectiveStars ?? 0) - (a.effectiveStars ?? 0);
      case "recent":
        return (
          new Date(b.effectivePushedAt ?? 0).getTime() -
          new Date(a.effectivePushedAt ?? 0).getTime()
        );
      case "name":
        return a.name.localeCompare(b.name);
      case "score":
      default:
        return b.score - a.score;
    }
  });

  return results;
}

export function uniqueLanguages(repos: EnrichedRepository[]): string[] {
  return [
    ...new Set(
      repos
        .map((r) => r.effectiveLanguage)
        .filter((x): x is string => Boolean(x)),
    ),
  ].sort();
}

export function uniqueLicenses(repos: EnrichedRepository[]): string[] {
  return [
    ...new Set(
      repos
        .map((r) => r.effectiveLicense)
        .filter((x): x is string => Boolean(x)),
    ),
  ].sort();
}
