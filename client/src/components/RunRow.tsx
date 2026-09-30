import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import type { Run } from "../types/feedHealth";
import { formatDateTime, formatSince } from "../utils/format";
import { RUN_STATUS_LABEL, runTone } from "../utils/status";
import { RunDetail } from "./RunDetail";
import { StatusPill } from "./StatusIndicator";

export const RUN_COLS =
  "grid grid-cols-[16px_60px_120px_96px_repeat(4,64px)_minmax(180px,1fr)] items-center gap-x-3";

type RunRowProps = {
  run: Run;
  isLatest: boolean;
  open: boolean;
  onToggle: () => void;
  thresholdDays: number;
  referenceTime: string;
};

export function RunRow({ run, isLatest, open, onToggle, thresholdDays, referenceTime }: RunRowProps) {
  const reduceMotion = useReducedMotion();
  const failed = run.status === "fail";
  const detailId = `run-detail-${run.run}`;

  return (
    <li id={`run-${run.run}`} className="relative scroll-mt-20">
      {failed && <span aria-hidden="true" className="absolute inset-y-0 left-0 z-[1] w-[3px] bg-red-500" />}
      <button
        type="button"
        aria-expanded={open}
        aria-controls={detailId}
        onClick={onToggle}
        className={`${RUN_COLS} h-11 w-full px-4 text-left text-[13px] transition-colors focus-visible:outline-none focus-visible:shadow-[inset_0_0_0_2px_rgba(37,99,235,0.45)] ${
          failed ? "bg-red-50/40 hover:bg-red-50/80" : "hover:bg-zinc-50"
        } ${open ? "bg-zinc-50" : ""}`}
      >
        <ChevronRight
          className={`h-3.5 w-3.5 text-zinc-400 transition-transform duration-150 ${open ? "rotate-90" : ""}`}
          aria-hidden="true"
        />
        <span className="font-mono font-medium text-zinc-900">#{run.run}</span>
        <span className="font-mono text-[12.5px] text-zinc-700" title={formatSince(run.started_at, referenceTime)}>
          {formatDateTime(run.started_at)}
        </span>
        <span>
          <StatusPill tone={runTone(run.status)} label={RUN_STATUS_LABEL[run.status]} />
        </span>
        <Count value={run.counts.seen} />
        <Count value={run.counts.new} />
        <Count value={run.counts.routed} />
        <Count value={run.counts.unrouted} warn />
        <span className="flex min-w-0 items-center gap-2">
          {isLatest && (
            <span className="shrink-0 rounded-[4px] bg-zinc-900 px-1.5 py-0.5 text-[10.5px] font-medium text-white">Latest</span>
          )}
          {run.error ? (
            <span className="truncate font-mono text-[12px] text-red-700" title={run.error}>
              {run.error}
            </span>
          ) : (
            <span className="text-[12px] text-zinc-400">—</span>
          )}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={detailId}
            key="detail"
            initial={reduceMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.18, ease: [0.2, 0, 0, 1] }}
            className="overflow-hidden"
          >
            <RunDetail run={run} thresholdDays={thresholdDays} />
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

function Count({ value, warn = false }: { value: number; warn?: boolean }) {
  const cls =
    value === 0 ? "text-zinc-300" : warn ? "font-medium text-amber-700" : "text-zinc-800";
  return <span className={`text-right font-mono text-[12.5px] ${cls}`}>{value}</span>;
}
