export interface CollectionMeta {
  id: string;
  slug: string;
  title: string;
  description: string;
  /** Predicate keys interpreted by collections.ts */
  filter:
    | { type: "featured-category"; category: string }
    | { type: "tag-any"; tags: string[] }
    | { type: "flag"; flag: "featured" | "emerging" | "selfHostable" | "localOfflineCapable" | "beginner" }
    | { type: "categories"; categories: string[] }
    | { type: "composite"; flags: Array<"featured" | "emerging" | "selfHostable" | "localOfflineCapable" | "beginner">; categories?: string[] };
}

export const COLLECTIONS: CollectionMeta[] = [
  {
    id: "best-coding-agents",
    slug: "best-coding-agents",
    title: "Best Open-Source Coding Agents",
    description:
      "Curated coding agents and AI developer tools that meaningfully help write, review, and ship code.",
    filter: { type: "featured-category", category: "coding-agents" },
  },
  {
    id: "best-local-ai",
    slug: "best-local-ai",
    title: "Best Local AI Projects",
    description:
      "Standout projects for running capable AI stacks on your own hardware.",
    filter: {
      type: "composite",
      flags: ["localOfflineCapable"],
      categories: ["local-ai", "llm-inference"],
    },
  },
  {
    id: "best-agent-frameworks",
    slug: "best-agent-frameworks",
    title: "Best Agent Frameworks",
    description:
      "Frameworks for building reliable multi-step and multi-agent systems.",
    filter: { type: "featured-category", category: "ai-agents" },
  },
  {
    id: "best-rag-tools",
    slug: "best-rag-tools",
    title: "Best RAG Tools",
    description:
      "Retrieval frameworks, knowledge systems, and vector stores that power grounded AI apps.",
    filter: { type: "categories", categories: ["rag", "vector-db"] },
  },
  {
    id: "best-for-beginners",
    slug: "best-for-beginners",
    title: "Best Open-Source AI for Beginners",
    description:
      "Approachable projects with strong docs and lower setup friction.",
    filter: { type: "flag", flag: "beginner" },
  },
  {
    id: "important-infrastructure",
    slug: "important-infrastructure",
    title: "Most Important AI Infrastructure Repositories",
    description:
      "Foundational infra for training, serving, and operating AI systems at scale.",
    filter: { type: "featured-category", category: "infrastructure" },
  },
  {
    id: "emerging-ai",
    slug: "emerging-ai",
    title: "Emerging AI Projects",
    description:
      "Newer projects with momentum that are worth watching closely.",
    filter: { type: "flag", flag: "emerging" },
  },
];

export function getCollectionBySlug(slug: string): CollectionMeta | undefined {
  return COLLECTIONS.find((c) => c.slug === slug);
}
