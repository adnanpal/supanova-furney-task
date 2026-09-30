import type { ReactNode } from "react";
import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import type { HealthResponse } from "../types/feedHealth";
import type { Summary } from "../utils/feedHealth";
import {
  FEED_STATUS_LABEL,
  SYSTEM_STATE_LABEL,
  SYSTEM_STATE_TONE,
  TONE_TEXT,
  feedTone,
  type Tone,
} from "../utils/status";
import { RunSequence } from "./RunSequence";
import { StatusDot } from "./StatusIndicator";

type StatusSummaryProps = {
  health: HealthResponse;
  summary: Summary;
};

const VERDICT_BG: Record<Tone, string> = {
  healthy: "bg-white",
  warning: "bg-amber-50/50",
  critical: "bg-red-50/50",
  neutral: "bg-white",
};

export function StatusSummary({ health, summary }: StatusSummaryProps) {
  const tone = SYSTEM_STATE_TONE[summary.state];
  const Icon = summary.state === "healthy" ? CheckCircle2 : summary.state === "failing" ? XCircle : AlertTriangle;
  const latest = summary.latestRun;

  return (
    <section
      aria-labelledby="system-status-heading"
      className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04)]"
    >
      <div className="grid lg:grid-cols-[minmax(280px,340px)_1fr]">
        <div className={`border-b border-zinc-200 px-4 py-4 lg:border-b-0 lg:border-r ${VERDICT_BG[tone]}`}>
          <p id="system-status-heading" className="text-[11px] font-medium uppercase tracking-[0.08em] text-zinc-500">
            System status
          </p>
          <div className="mt-2 flex items-center gap-2">
            <Icon className={`h-[18px] w-[18px] ${TONE_TEXT[tone]}`} aria-hidden="true" />
            <span className={`text-[17px] font-semibold tracking-[-0.01em] ${TONE_TEXT[tone]}`}>
              {SYSTEM_STATE_LABEL[summary.state]}
            </span>
          </div>
          <p className="mt-1 text-[13px] leading-snug text-zinc-700">{summary.headline}</p>
        </div>

        <dl className="grid grid-cols-2 gap-px bg-zinc-100 sm:grid-cols-3 xl:grid-cols-6">
          <Metric label="Feeds healthy" value={`${summary.healthy}/${summary.total}`}>
            <div className="flex flex-wrap items-center gap-1.5">
              {health.feeds.map((feed) => (
                <span key={feed.id} title={`${feed.id} · ${FEED_STATUS_LABEL[feed.status]}`} className="flex">
                  <StatusDot tone={feedTone(feed.status)} />
                </span>
              ))}
            </div>
          </Metric>
          <Metric
            label="Stale"
            value={String(summary.staleFeeds.length)}
            tone={summary.staleFeeds.length ? "warning" : undefined}
          >
            <span className="truncate capitalize">
              {summary.staleFeeds.length ? summary.staleFeeds.map((f) => f.id).join(", ") : "None"}
            </span>
          </Metric>
          <Metric label="Unknown" value={String(summary.unknownFeeds.length)}>
            <span className="truncate capitalize">
              {summary.unknownFeeds.length ? summary.unknownFeeds.map((f) => f.id).join(", ") : "None"}
            </span>
          </Metric>
          <Metric
            label="Failed runs"
            value={String(summary.failedRuns.length)}
            suffix={`/ ${summary.totalRuns}`}
            tone={latest?.status === "fail" ? "critical" : undefined}
          >
            {summary.totalRuns ? <RunSequence runsDesc={summary.runsDesc} size="sm" limit={16} /> : <span>No runs</span>}
          </Metric>
          <Metric
            label="Unrouted · latest"
            value={String(summary.latestUnrouted)}
            tone={summary.latestUnrouted ? "warning" : undefined}
          >
            <span>{latest ? `in run #${latest.run}` : "No runs"}</span>
          </Metric>
          <Metric label="Freshness limit" value={String(health.thresholdDays)} suffix="days">
            <span>max age before stale</span>
          </Metric>
        </dl>
      </div>
    </section>
  );
}

type MetricProps = {
  label: string;
  value: string;
  suffix?: string;
  tone?: Tone;
  children: ReactNode;
};

function Metric({ label, value, suffix, tone, children }: MetricProps) {
  return (
    <div className="flex min-w-0 flex-col justify-between gap-2 bg-white px-4 py-3.5">
      <dt className="text-[11.5px] text-zinc-500">{label}</dt>
      <dd className="flex items-baseline gap-1">
        <span className={`font-mono text-[20px] font-medium leading-none tracking-[-0.02em] ${tone ? TONE_TEXT[tone] : "text-zinc-900"}`}>
          {value}
        </span>
        {suffix && <span className="font-mono text-[12px] text-zinc-400">{suffix}</span>}
      </dd>
      <dd className="flex min-h-[14px] items-center text-[11.5px] text-zinc-500">{children}</dd>
    </div>
  );
}
