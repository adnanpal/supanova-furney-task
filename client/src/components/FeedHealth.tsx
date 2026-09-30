import { useMemo } from "react";
import { useFeedHealth } from "../hooks/useFeedHealth";
import type { DataSource } from "../types/feedHealth";
import { buildIssues, summarize } from "../utils/feedHealth";
import { formatClock, plural } from "../utils/format";
import { AgentWatch } from "./AgentWatch";
import { AppHeader } from "./AppHeader";
import { ErrorState } from "./ErrorState";
import { FeedTable } from "./FeedTable";
import { LoadingState } from "./LoadingState";
import { NeedsAttention } from "./NeedsAttention";
import { RunHistory } from "./RunHistory";
import { StatusSummary } from "./StatusSummary";

type FeedHealthConsoleProps = {
  dataSource: DataSource;
};

export function FeedHealthConsole({ dataSource }: FeedHealthConsoleProps) {
  const { status, data, error, fetchedAt, refreshing, refresh } = useFeedHealth(dataSource);

  const derived = useMemo(() => {
    if (!data) return null;
    const summary = summarize(data.health, data.runs);
    return { summary, issues: buildIssues(data.health, summary) };
  }, [data]);

  return (
    <div className="min-h-screen w-full bg-[#f6f6f7] font-heading text-zinc-900 antialiased">
      <AppHeader
        dataSource={dataSource}
        referenceTime={data?.health.referenceTime}
        thresholdDays={data?.health.thresholdDays}
        fetchedAt={fetchedAt}
        refreshing={refreshing}
        refreshError={data ? error : null}
        onRefresh={refresh}
      />

      <main className="mx-auto max-w-[1360px] px-4 pb-16 pt-5 sm:px-6 lg:px-8">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-x-6 gap-y-1">
          <div>
            <h1 className="text-[19px] font-semibold tracking-[-0.015em] text-zinc-900">Feed health</h1>
            <p className="mt-0.5 text-[13px] text-zinc-500">
              Ingestion pipeline monitoring
              {data && ` · ${plural(data.health.feeds.length, "feed")} · ${plural(data.runs.length, "run")} recorded`}
            </p>
          </div>
          {fetchedAt && (
            <p className="font-mono text-[11.5px] text-zinc-400">
              {dataSource === "live" ? "Fetched" : "Loaded sample"} {formatClock(fetchedAt)}
            </p>
          )}
        </div>

        {status === "loading" && <LoadingState />}
        {status === "error" && <ErrorState message={error} onRetry={refresh} />}

        {status === "ready" && data && derived && (
          <div className={`space-y-6 transition-opacity ${refreshing ? "opacity-70" : ""}`}>
            <StatusSummary health={data.health} summary={derived.summary} />
            <NeedsAttention
              issues={derived.issues}
              thresholdDays={data.health.thresholdDays}
              feedCount={data.health.feeds.length}
            />
            <FeedTable health={data.health} />
            <RunHistory
              runsDesc={derived.summary.runsDesc}
              thresholdDays={data.health.thresholdDays}
              referenceTime={data.health.referenceTime}
            />
            <AgentWatch summary={derived.summary} thresholdDays={data.health.thresholdDays} />
          </div>
        )}
      </main>
    </div>
  );
}
