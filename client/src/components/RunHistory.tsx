import { useState } from "react";
import type { Run } from "../types/feedHealth";
import { plural } from "../utils/format";
import { RUN_COLS, RunRow } from "./RunRow";
import { RunSequence } from "./RunSequence";
import { SectionHeader } from "./SectionHeader";

type RunHistoryProps = {
  runsDesc: Run[];
  thresholdDays: number;
  referenceTime: string;
};

const DEFAULT_VISIBLE = 10;

export function RunHistory({ runsDesc, thresholdDays, referenceTime }: RunHistoryProps) {
  const [expanded, setExpanded] = useState<Set<number>>(() => new Set());
  const [showAll, setShowAll] = useState(false);

  const failed = runsDesc.filter((r) => r.status === "fail").length;
  const visible = showAll ? runsDesc : runsDesc.slice(0, DEFAULT_VISIBLE);
  const hidden = runsDesc.length - visible.length;

  function toggle(runNumber: number) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(runNumber)) next.delete(runNumber);
      else next.add(runNumber);
      return next;
    });
  }

  function focusRun(runNumber: number) {
    const index = runsDesc.findIndex((r) => r.run === runNumber);
    if (index >= DEFAULT_VISIBLE) setShowAll(true);
    setExpanded((prev) => new Set(prev).add(runNumber));
    requestAnimationFrame(() => {
      document.getElementById(`run-${runNumber}`)?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    });
  }

  return (
    <section aria-labelledby="runs-heading">
      <SectionHeader
        id="runs-heading"
        title="Run history"
        description="Newest first. Select a run for its error and per-feed detail."
        aside={
          <span className="font-mono">
            {plural(runsDesc.length, "run")} · <span className={failed ? "text-red-700" : ""}>{failed} failed</span>
          </span>
        }
      />

      <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
        {runsDesc.length === 0 ? (
          <p className="px-4 py-8 text-center text-[13px] text-zinc-500">No ingestion runs have been recorded yet.</p>
        ) : (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="text-[11.5px] text-zinc-500">Oldest</span>
                <RunSequence runsDesc={runsDesc} size="md" limit={40} onSelect={focusRun} />
                <span className="text-[11.5px] text-zinc-500">Latest</span>
              </div>
              <div className="flex items-center gap-3 text-[11.5px] text-zinc-500">
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-1.5 rounded-[1px] bg-emerald-500/60" aria-hidden="true" /> Succeeded
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-1.5 rounded-[1px] bg-red-500" aria-hidden="true" /> Failed
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <div className="min-w-[900px]">
                <div
                  className={`${RUN_COLS} border-b border-zinc-200 bg-zinc-50/80 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.06em] text-zinc-500`}
                  aria-hidden="true"
                >
                  <span />
                  <span>Run</span>
                  <span>Started · UTC</span>
                  <span>Status</span>
                  <span className="text-right">Seen</span>
                  <span className="text-right">New</span>
                  <span className="text-right">Routed</span>
                  <span className="text-right">Unrouted</span>
                  <span>Error</span>
                </div>
                <ul className="divide-y divide-zinc-100">
                  {visible.map((run, i) => (
                    <RunRow
                      key={run.run}
                      run={run}
                      isLatest={i === 0}
                      open={expanded.has(run.run)}
                      onToggle={() => toggle(run.run)}
                      thresholdDays={thresholdDays}
                      referenceTime={referenceTime}
                    />
                  ))}
                </ul>
              </div>
            </div>

            {(hidden > 0 || showAll) && runsDesc.length > DEFAULT_VISIBLE && (
              <div className="border-t border-zinc-100 px-4 py-2">
                <button
                  type="button"
                  onClick={() => setShowAll((v) => !v)}
                  className="rounded text-[12px] font-medium text-zinc-600 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/40"
                >
                  {showAll ? "Show recent runs only" : `Show ${plural(hidden, "older run")}`}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
