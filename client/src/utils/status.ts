import type { FeedStatus, RunStatus, Severity, SystemState } from "../types/feedHealth";

export type Tone = "healthy" | "warning" | "critical" | "neutral";

export function feedTone(status: FeedStatus): Tone {
  if (status === "healthy") return "healthy";
  if (status === "stale") return "warning";
  return "neutral";
}

export function runTone(status: RunStatus): Tone {
  return status === "ok" ? "healthy" : "critical";
}

export function severityTone(severity: Severity): Tone {
  if (severity === "critical") return "critical";
  if (severity === "warning") return "warning";
  return "neutral";
}

export const FEED_STATUS_LABEL: Record<FeedStatus, string> = {
  healthy: "Healthy",
  stale: "Stale",
  unknown: "Unknown",
};

export const RUN_STATUS_LABEL: Record<RunStatus, string> = {
  ok: "Succeeded",
  fail: "Failed",
};

export const SEVERITY_LABEL: Record<Severity, string> = {
  critical: "Critical",
  warning: "Warning",
  notice: "Notice",
};

export const SYSTEM_STATE_LABEL: Record<SystemState, string> = {
  healthy: "Operational",
  degraded: "Degraded",
  failing: "Failing",
};

export const SYSTEM_STATE_TONE: Record<SystemState, Tone> = {
  healthy: "healthy",
  degraded: "warning",
  failing: "critical",
};

export const TONE_TEXT: Record<Tone, string> = {
  healthy: "text-emerald-700",
  warning: "text-amber-700",
  critical: "text-red-700",
  neutral: "text-zinc-500",
};

export const TONE_RAIL: Record<Tone, string> = {
  healthy: "bg-emerald-500",
  warning: "bg-amber-500",
  critical: "bg-red-500",
  neutral: "bg-zinc-300",
};
