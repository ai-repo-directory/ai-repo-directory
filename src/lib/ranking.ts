import type {
  EnrichedRepository,
  GitHubSnapshot,
  RepositoryRecord,
  ScoreRecord,
} from "./types";

const MAINTENANCE_SCORES: Record<string, number> = {
  active: 100,
  moderate: 70,
  slow: 40,
  stale: 15,
  archived: 5,
  unknown: 35,
};

const DOC_SCORES: Record<string, number> = {
  excellent: 100,
  good: 75,
  fair: 45,
  poor: 20,
  unknown: 40,
};

function clamp(n: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, n));
}

function logAdoption(stars: number | null): number {
  if (stars == null || stars <= 0) return 25;
  // log10 scale: 100 stars ~40, 1k ~55, 10k ~70, 100k ~85
  return clamp(20 + Math.log10(stars + 1) * 15);
}

function activityScore(pushedAt: string | null, maintenance: string): number {
  if (!pushedAt) return MAINTENANCE_SCORES[maintenance] ?? 35;
  const days =
    (Date.now() - new Date(pushedAt).getTime()) / (1000 * 60 * 60 * 24);
  if (Number.isNaN(days)) return MAINTENANCE_SCORES[maintenance] ?? 35;
  if (days <= 14) return 100;
  if (days <= 45) return 85;
  if (days <= 90) return 70;
  if (days <= 180) return 50;
  if (days <= 365) return 30;
  return 10;
}

function maturityScore(repo: RepositoryRecord, github: GitHubSnapshot | null): number {
  let score = 50;
  if (repo.historicallySignificant) score += 20;
  if (repo.featured) score += 10;
  if (github?.latestRelease) score += 10;
  if (repo.archived || github?.archived) score -= 25;
  if (repo.maintenance === "active") score += 10;
  return clamp(score);
}

function ecosystemScore(repo: RepositoryRecord): number {
  let score = 40;
  score += Math.min(20, repo.secondaryCategories.length * 6);
  score += Math.min(15, repo.tags.length * 2);
  if (repo.featured) score += 15;
  if (repo.emerging) score += 8;
  return clamp(score);
}

function usefulnessScore(repo: RepositoryRecord): number {
  let score = 45;
  if (repo.selfHostable) score += 10;
  if (repo.localOfflineCapable) score += 8;
  if (repo.demoAvailable) score += 7;
  if (repo.documentationQuality === "excellent") score += 15;
  else if (repo.documentationQuality === "good") score += 10;
  if (repo.difficulty === "beginner") score += 5;
  if (repo.whyCare.length > 80) score += 5;
  return clamp(score);
}

/**
 * Transparent composite score (0–100). Not a scientific ranking —
 * a practical discovery heuristic. See RANKING_METHODOLOGY.md.
 */
export function computeScore(
  repo: RepositoryRecord,
  github: GitHubSnapshot | null,
): ScoreRecord {
  const stars = github?.stars ?? repo.stars;
  const pushedAt = github?.pushedAt ?? repo.latestCommitAt;
  const archived = github?.archived ?? repo.archived;

  const breakdown = {
    adoption: logAdoption(stars),
    maintenance: archived
      ? 5
      : (MAINTENANCE_SCORES[repo.maintenance] ?? 35),
    activity: archived ? 5 : activityScore(pushedAt, repo.maintenance),
    documentation: DOC_SCORES[repo.documentationQuality] ?? 40,
    maturity: maturityScore(repo, github),
    ecosystem: ecosystemScore(repo),
    usefulness: usefulnessScore(repo),
  };

  const score =
    breakdown.adoption * 0.18 +
    breakdown.maintenance * 0.16 +
    breakdown.activity * 0.16 +
    breakdown.documentation * 0.12 +
    breakdown.maturity * 0.12 +
    breakdown.ecosystem * 0.12 +
    breakdown.usefulness * 0.14;

  return {
    id: repo.id,
    score: Math.round(score * 10) / 10,
    breakdown,
    computedAt: new Date().toISOString(),
  };
}

export function enrichRepository(
  repo: RepositoryRecord,
  github: GitHubSnapshot | null,
  scoreRecord: ScoreRecord | null,
): EnrichedRepository {
  const computed = scoreRecord ?? computeScore(repo, github);
  return {
    ...repo,
    score: computed.score,
    scoreBreakdown: computed.breakdown,
    github,
    effectiveStars: github?.stars ?? repo.stars,
    effectiveForks: github?.forks ?? repo.forks,
    effectiveLicense: github?.license ?? repo.license,
    effectiveLanguage: github?.language ?? repo.language,
    effectivePushedAt: github?.pushedAt ?? repo.latestCommitAt,
    effectiveArchived: github?.archived ?? repo.archived,
  };
}
