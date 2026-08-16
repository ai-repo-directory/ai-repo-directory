import type { Metadata } from "next";
import { Suspense } from "react";
import { loadEnrichedRepositories } from "@/lib/data";
import { ExploreClient } from "./ExploreClient";

export const metadata: Metadata = {
  title: "Explore",
  description:
    "Search and filter a curated AI repository directory by category, language, license, maintenance, and more. Filters are shareable via URL.",
};

export default function ExplorePage() {
  const all = loadEnrichedRepositories();
  return (
    <Suspense fallback={<div className="site-container py-8 sm:py-10" />}>
      <ExploreClient repositories={all} />
    </Suspense>
  );
}
