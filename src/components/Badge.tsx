import type { ReactNode } from "react";

type BadgeTone = "neutral" | "accent" | "success" | "warning" | "danger";

const toneClass: Record<BadgeTone, string> = {
  neutral: "border-border bg-paper-elevated text-ink-muted",
  accent: "border-accent/30 bg-accent-soft text-accent",
  success: "border-success/25 bg-success/5 text-success",
  warning: "border-warning/25 bg-warning/5 text-warning",
  danger: "border-danger/25 bg-danger/5 text-danger",
};

export function Badge({
  children,
  tone = "neutral",
  className = "",
}: {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center border px-1.5 py-0.5 text-[0.6875rem] font-medium uppercase tracking-wide ${toneClass[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
