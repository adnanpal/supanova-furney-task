import type {
  FeedHealth,
  HealthResponse,
  Issue,
  Run,
  Severity,
  SystemState,
} from "../types/feedHealth";
import { capitalize, formatAge, formatDate, formatDateTime, plural } from "./format";

const RECENT_WINDOW = 10;
const SEVERITY_RANK: Record<Severity, number> = { critical: 0, warning: 1, notice: 2 };

export type Summary = {
  total: number;
  healthy: number;
  staleFeeds: FeedHealth[];
  unknownFeeds: FeedHealth[];
  runsDesc: Run[];
  totalRuns: number;
  failedRuns: Run[];
  latestRun: Run | null;
  latestUnrouted: number;
  consecutiveFailures: number;
  recentWindow: number;
  recentFailures: number;
  state: SystemState;
  headline: string;
};

export type Freshness = {
  tone: "within" | "over" | "none";
  label: string;
  detail: string;
};

export function sortRunsDesc(runs: Run[]): Run[] {
  return [...runs].sort((a, b) => b.run - a.run);
}

export function summarize(health: HealthResponse, runs: Run[]): Summary {
  const runsDesc = sortRunsDesc(runs);
  const staleFeeds = health.feeds.filter((f) => f.status === "stale");
  const unknownFeeds = health.feeds.filter((f) => f.status === "unknown");
  const healthy = health.feeds.filter((f) => f.status === "healthy").length;
  const failedRuns = runsDesc.filter((r) => r.status === "fail");
  const latestRun = runsDesc[0] ?? null;
  const latestUnrouted = latestRun?.counts.unrouted ?? 0;

  let consecutiveFailures = 0;
  for (const run of runsDesc) {
    if (run.status !== "fail") break;
    consecutiveFailures += 1;
  }

  const recent = runsDesc.slice(0, RECENT_WINDOW);
  const recentFailures = recent.filter((r) => r.status === "fail").length;
  const latestFailed = latestRun?.status === "fail";

  let state: SystemState = "healthy";
  if (latestFailed) state = "failing";
  else if (staleFeeds.length || unknownFeeds.length || recentFailures || latestUnrouted) {
    state = "degraded";
  }

  const parts: string[] = [];
  if (latestFailed) parts.push("latest run failed");
  if (staleFeeds.length) parts.push(`${plural(staleFeeds.length, "feed")} stale`);
  if (unknownFeeds.length) parts.push(`${plural(unknownFeeds.length, "feed")} with no data`);
  if (recentFailures && !latestFailed) {
    parts.push(`${plural(recentFailures, "failed run")} in last ${recent.length}`);
  }
  if (latestUnrouted) parts.push(`${plural(latestUnrouted, "unrouted item")} in latest run`);

  const headline = parts.length
    ? capitalize(parts.join(" · "))
    : `All ${plural(health.feeds.length, "feed")} within threshold and the latest run succeeded`;

  return {
    total: health.feeds.length,
    healthy,
    staleFeeds,
    unknownFeeds,
    runsDesc,
    totalRuns: runsDesc.length,
    failedRuns,
    latestRun,
    latestUnrouted,
    consecutiveFailures,
    recentWindow: recent.length,
    recentFailures,
    state,
    headline,
  };
}

export function getFreshness(feed: FeedHealth, thresholdDays: number): Freshness {
  if (feed.status === "unknown" || feed.ageDays === null) {
    return { tone: "none", label: "No data", detail: "no file seen" };
  }
  const over = feed.ageDays - thresholdDays;
  if (feed.status === "stale" || over > 0) {
    return {
      tone: "over",
      label: over > 0 ? `${over}d past threshold` : "At threshold",
      detail: `${feed.ageDays}d / ${thresholdDays}d`,
    };
  }
  return {
    tone: "within",
    label: "Within threshold",
    detail: `${thresholdDays - feed.ageDays}d headroom`,
  };
}

export function buildIssues(health: HealthResponse, summary: Summary): Issue[] {
  const issues: Issue[] = [];
  const { latestRun, thresholdDays } = { ...summary, thresholdDays: health.thresholdDays };

  if (latestRun && latestRun.status === "fail") {
    issues.push({
      id: `run-${latestRun.run}`,
      severity: "critical",
      subject: `Run #${latestRun.run}`,
      title: "Latest ingestion run failed",
      message: latestRun.error ?? "The run reported a failure without an error message.",
      messageIsError: true,
      facts: [
        { label: "Started", value: `${formatDateTime(latestRun.started_at)} UTC` },
        { label: "Failing streak", value: plural(summary.consecutiveFailures, "run"), emphasis: true },
        { label: "Items seen", value: String(latestRun.counts.seen) },
      ],
      nextStep: "Inspect the error, fix the source, and re-run ingestion before more feeds age past threshold.",
      href: `#run-${latestRun.run}`,
      hrefLabel: "Open run",
    });
  }

  for (const feed of summary.staleFeeds) {
    const over = feed.ageDays !== null ? feed.ageDays - thresholdDays : null;
    issues.push({
      id: `feed-${feed.id}`,
      severity: "warning",
      subject: feed.id,
      title: "Feed is stale",
      message: feed.lastSeen
        ? `No new file since ${formatDate(feed.lastSeen)}.`
        : "No file has been seen for this feed.",
      facts: [
        { label: "Last seen", value: formatDate(feed.lastSeen) },
        { label: "Age", value: formatAge(feed.ageDays), emphasis: true },
        { label: "Threshold", value: plural(thresholdDays, "day") },
        { label: "Over by", value: over !== null && over > 0 ? plural(over, "day") : "—", emphasis: true },
      ],
      nextStep: `Confirm the ${feed.id} source is still producing files and the watcher can reach it.`,
      href: `#feed-${feed.id}`,
      hrefLabel: "View feed",
    });
  }

  if (latestRun && latestRun.counts.unrouted > 0) {
    issues.push({
      id: "latest-unrouted",
      severity: "warning",
      subject: `Run #${latestRun.run}`,
      title: `${plural(latestRun.counts.unrouted, "item")} not routed`,
      message: "New items were ingested but matched no destination inbox.",
      facts: [
        { label: "Unrouted", value: String(latestRun.counts.unrouted), emphasis: true },
        { label: "Routed", value: String(latestRun.counts.routed) },
        { label: "New", value: String(latestRun.counts.new) },
      ],
      nextStep: "Review routing rules for the unmatched items so they reach an inbox.",
      href: `#run-${latestRun.run}`,
      hrefLabel: "Open run",
    });
  }

  const historical = summary.failedRuns.filter((r) => r.run !== latestRun?.run);
  if (historical.length) {
    const mostRecent = historical[0];
    const runsSince = summary.runsDesc.findIndex((r) => r.run === mostRecent.run);
    const shown = historical.slice(0, 4).map((r) => `#${r.run}`).join(", ");
    issues.push({
      id: "history-failures",
      severity: runsSince < 5 ? "warning" : "notice",
      subject: "Run history",
      title: `${historical.length} of ${summary.totalRuns} runs failed`,
      message: mostRecent.error ?? "Failure reported without an error message.",
      messageIsError: true,
      facts: [
        { label: "Failed", value: historical.length > 4 ? `${shown} +${historical.length - 4}` : shown, emphasis: true },
        { label: "Most recent", value: `#${mostRecent.run} · ${formatDateTime(mostRecent.started_at)}` },
        { label: "Runs since", value: String(runsSince) },
      ],
      nextStep: "Check whether failures share a cause — recurring errors on one source often precede staleness.",
    });
  }

  for (const feed of summary.unknownFeeds) {
    issues.push({
      id: `unknown-${feed.id}`,
      severity: "notice",
      subject: feed.id,
      title: "Feed state unknown",
      message: "No file has ever been observed, so freshness can't be evaluated.",
      facts: [
        { label: "Last seen", value: "Never" },
        { label: "Files seen", value: String(feed.filesSeen) },
      ],
      nextStep: `Verify ${feed.id} is configured and has produced at least one file.`,
      href: `#feed-${feed.id}`,
      hrefLabel: "View feed",
    });
  }

  return issues.sort((a, b) => SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity]);
}
