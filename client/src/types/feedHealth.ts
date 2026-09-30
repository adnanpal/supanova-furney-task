export type FeedStatus = "healthy" | "stale" | "unknown";

export type FeedHealth = {
  id: string;
  lastSeen: string | null;
  ageDays: number | null;
  filesSeen: number;
  status: FeedStatus;
};

export type HealthResponse = {
  referenceTime: string;
  thresholdDays: number;
  feeds: FeedHealth[];
};

export type RunStatus = "ok" | "fail";

export type Run = {
  run: number;
  started_at: string;
  status: RunStatus;
  error: string | null;
  counts: {
    seen: number;
    new: number;
    routed: number;
    unrouted: number;
  };
  feeds: Record<
    string,
    {
      last_file: string | null;
      files_seen: number;
    }
  >;
};

export type FeedHealthData = {
  health: HealthResponse;
  runs: Run[];
};

export type DataSource = "live" | "sample";

export type SystemState = "healthy" | "degraded" | "failing";

export type Severity = "critical" | "warning" | "notice";

export type IssueFact = {
  label: string;
  value: string;
  emphasis?: boolean;
};

export type Issue = {
  id: string;
  severity: Severity;
  subject: string;
  title: string;
  message?: string;
  messageIsError?: boolean;
  facts: IssueFact[];
  nextStep: string;
  href?: string;
  hrefLabel?: string;
};
