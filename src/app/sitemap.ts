import type { MetadataRoute } from "next";
import { CATEGORIES } from "@/lib/categories";
import { COLLECTIONS } from "@/lib/collections";
import { loadEnrichedRepositories } from "@/lib/data";
import { absoluteUrl } from "@/lib/format";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: absoluteUrl("/explore"),
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: absoluteUrl("/methodology"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: absoluteUrl("/about"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ];

  const categoryRoutes = CATEGORIES.map((c) => ({
    url: absoluteUrl(`/category/${c.slug}`),
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const collectionRoutes = COLLECTIONS.map((c) => ({
    url: absoluteUrl(`/collection/${c.slug}`),
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const repoRoutes = loadEnrichedRepositories().map((r) => ({
    url: absoluteUrl(`/repo/${r.id}`),
    lastModified: r.effectivePushedAt
      ? new Date(r.effectivePushedAt)
      : now,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [
    ...staticRoutes,
    ...categoryRoutes,
    ...collectionRoutes,
    ...repoRoutes,
  ];
}
