/**
 * Lightweight analytics hook points. Wire to your provider in production
 * without coupling page components to a vendor SDK.
 */
export type AnalyticsEvent =
  | { name: "search"; props: { q: string } }
  | { name: "filter_apply"; props: Record<string, string | boolean | number | undefined> }
  | { name: "repo_view"; props: { id: string } }
  | { name: "outbound_github"; props: { id: string } };

export function track(event: AnalyticsEvent): void {
  if (typeof window === "undefined") return;
  // Plausible / GA / custom: replace with real sink
  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.debug("[analytics]", event.name, event.props);
  }
  window.dispatchEvent(
    new CustomEvent("ai-repo-directory:analytics", { detail: event }),
  );
}
