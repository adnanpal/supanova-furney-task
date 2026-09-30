import fs from "node:fs";
import path from "node:path";

interface FeedRun {
  last_file: string | null;
  files_seen: number;
}

interface IngestRun {
  run: number;
  started_at: string;
  status: "ok" | "fail";
  error: string | null;
  counts: {
    seen: number;
    new: number;
    routed: number;
    unrouted: number;
  };
  feeds: Record<string, FeedRun>;
}

interface Config {
  feed_freshness_threshold_days: number;
}

export interface FeedHealth {
  id: string;
  lastSeen: string | null;
  ageDays: number | null;
  filesSeen: number;
  status: "healthy" | "stale" | "unknown";
}

export interface HealthResult {
  referenceTime: string;
  thresholdDays: number;
  feeds: FeedHealth[];
}

const fixturePath = path.resolve(process.cwd(), "../fixture");

function readConfig(): Config {
  const configPath = path.join(fixturePath, "config.json");

  return JSON.parse(fs.readFileSync(configPath, "utf-8")) as Config;
}

function readRunLog(): IngestRun[] {
  const runLogPath = path.join(fixturePath, "run-log.jsonl");

  const content = fs.readFileSync(runLogPath, "utf-8").trim();

  if (!content) {
    return [];
  }

  return content
    .split("\n")
    .filter(Boolean)
    .map((line) => JSON.parse(line) as IngestRun);
}

export function getFeedHealth(): HealthResult {
  const config = readConfig();
  const runs = readRunLog();

  if (runs.length === 0) {
    throw new Error("Run log is empty");
  }

  const latestRun = runs.reduce((latest, current) =>
    new Date(current.started_at) > new Date(latest.started_at)
      ? current
      : latest
  );

  const referenceTime = new Date(latestRun.started_at);

  const feeds = Object.entries(latestRun.feeds).map(
    ([feedId, feed]) => {
      if (!feed.last_file) {
        return {
          id: feedId,
          lastSeen: null,
          ageDays: null,
          filesSeen: feed.files_seen,
          status: "unknown" as const,
        };
      }

      const lastSeen = new Date(`${feed.last_file}T00:00:00Z`);

      const ageMilliseconds =
        referenceTime.getTime() - lastSeen.getTime();

      const ageDays = Math.floor(
        ageMilliseconds / (1000 * 60 * 60 * 24)
      );

      return {
        id: feedId,
        lastSeen: feed.last_file,
        ageDays,
        filesSeen: feed.files_seen,
        status:
          ageDays <= config.feed_freshness_threshold_days
            ? ("healthy" as const)
            : ("stale" as const),
      };
    }
  );

  return {
    referenceTime: latestRun.started_at,
    thresholdDays: config.feed_freshness_threshold_days,
    feeds,
  };
}

export function getRunHistory(): IngestRun[] {
  return readRunLog();
}