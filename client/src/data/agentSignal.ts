export type SignalEvidenceKey =
  | "volume"
  | "zero-new"
  | "failures"
  | "unrouted"
  | "cadence"
  | "correlation";

export type SignalIcon = "activity" | "ban" | "repeat" | "split" | "clock" | "network";

export type AgentSignal = {
  id: string;
  icon: SignalIcon;
  title: string;
  description: string;
  thresholdGap: string;
  evidenceKey: SignalEvidenceKey;
};

export const agentSignals: AgentSignal[] = [
  {
    id: "abnormal-volume",
    icon: "activity",
    title: "Abnormal feed volume",
    description: "A feed delivers on time, but far fewer — or far more — files than it normally does.",
    thresholdGap: "One file resets freshness, no matter how many were expected.",
    evidenceKey: "volume",
  },
  {
    id: "zero-new-runs",
    icon: "ban",
    title: "Repeated zero-item runs",
    description: "Runs complete successfully but ingest nothing new, run after run.",
    thresholdGap: "A successful run with nothing in it still looks healthy.",
    evidenceKey: "zero-new",
  },
  {
    id: "recurring-failures",
    icon: "repeat",
    title: "Recurring ingestion failures",
    description: "The same error returns intermittently, often on one source, before it becomes an outage.",
    thresholdGap: "Freshness only reacts after data stops, not while it's wobbling.",
    evidenceKey: "failures",
  },
  {
    id: "repeated-unrouted",
    icon: "split",
    title: "Persistent unrouted items",
    description: "Items keep arriving that match no routing rule — a sign that a rule or a source changed.",
    thresholdGap: "Arrival is on time; the problem is where items go afterwards.",
    evidenceKey: "unrouted",
  },
  {
    id: "cadence-drift",
    icon: "clock",
    title: "Fresh but off-pattern",
    description: "Files land later each day or at unusual hours while staying inside the threshold.",
    thresholdGap: "Anything under the limit reads as healthy until it suddenly isn't.",
    evidenceKey: "cadence",
  },
  {
    id: "cross-run-patterns",
    icon: "network",
    title: "Correlated signals across runs",
    description: "A stale feed, recent failures, and falling volume that all point at the same source.",
    thresholdGap: "Each feed is judged alone; related symptoms are never connected.",
    evidenceKey: "correlation",
  },
];
