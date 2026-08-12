import type { CategoryId } from "./types";

export interface CategoryMeta {
  id: CategoryId;
  name: string;
  slug: string;
  description: string;
  shortLabel: string;
}

export const CATEGORIES: CategoryMeta[] = [
  {
    id: "llm-inference",
    name: "LLM Inference & Serving",
    slug: "llm-inference",
    shortLabel: "Inference",
    description:
      "Runtimes and servers for running large language models efficiently in production and locally.",
  },
  {
    id: "ai-agents",
    name: "AI Agents",
    slug: "ai-agents",
    shortLabel: "Agents",
    description:
      "Frameworks and platforms for building autonomous and tool-using AI agents.",
  },
  {
    id: "coding-agents",
    name: "Coding Agents",
    slug: "coding-agents",
    shortLabel: "Coding",
    description:
      "AI pair programmers, coding agents, and developer-focused automation tools.",
  },
  {
    id: "rag",
    name: "RAG & Knowledge",
    slug: "rag",
    shortLabel: "RAG",
    description:
      "Retrieval-augmented generation stacks, knowledge pipelines, and document QA systems.",
  },
  {
    id: "vector-db",
    name: "Vector Databases",
    slug: "vector-db",
    shortLabel: "Vectors",
    description:
      "Vector stores and similarity search systems that power modern retrieval.",
  },
  {
    id: "local-ai",
    name: "Local & Self-Hosted AI",
    slug: "local-ai",
    shortLabel: "Local AI",
    description:
      "All-in-one local stacks, UIs, and self-hosted platforms for private AI.",
  },
  {
    id: "image-ai",
    name: "Image AI",
    slug: "image-ai",
    shortLabel: "Image",
    description:
      "Open-source image generation, editing, and vision-generation tooling.",
  },
  {
    id: "video-ai",
    name: "Video AI",
    slug: "video-ai",
    shortLabel: "Video",
    description:
      "Text-to-video, video editing, and temporal generative models.",
  },
  {
    id: "audio-ai",
    name: "Audio & Speech AI",
    slug: "audio-ai",
    shortLabel: "Audio",
    description:
      "Speech recognition, text-to-speech, music generation, and audio tooling.",
  },
  {
    id: "training",
    name: "Training & Fine-Tuning",
    slug: "training",
    shortLabel: "Training",
    description:
      "Libraries and frameworks for training, fine-tuning, and post-training models.",
  },
  {
    id: "evaluation",
    name: "Evaluation & Observability",
    slug: "evaluation",
    shortLabel: "Eval",
    description:
      "Benchmarks, eval harnesses, tracing, and LLM observability platforms.",
  },
  {
    id: "mcp-tools",
    name: "MCP & Tool Integrations",
    slug: "mcp-tools",
    shortLabel: "MCP",
    description:
      "Model Context Protocol servers, SDKs, and tool-use integration layers.",
  },
  {
    id: "multimodal",
    name: "Multimodal AI",
    slug: "multimodal",
    shortLabel: "Multimodal",
    description:
      "Models and frameworks that combine text, vision, audio, and more.",
  },
  {
    id: "datasets",
    name: "Datasets & Synthetic Data",
    slug: "datasets",
    shortLabel: "Datasets",
    description:
      "Public datasets, data pipelines, and synthetic data generation tools.",
  },
  {
    id: "infrastructure",
    name: "AI Infrastructure",
    slug: "infrastructure",
    shortLabel: "Infra",
    description:
      "Orchestration, serving platforms, and cluster tooling for AI workloads.",
  },
  {
    id: "research",
    name: "Research Implementations",
    slug: "research",
    shortLabel: "Research",
    description:
      "Seminal and educational implementations of important AI research.",
  },
];

export function getCategoryBySlug(slug: string): CategoryMeta | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function getCategoryById(id: CategoryId): CategoryMeta | undefined {
  return CATEGORIES.find((c) => c.id === id);
}
