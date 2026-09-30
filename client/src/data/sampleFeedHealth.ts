import type { FeedHealthData } from "../types/feedHealth";

// Preview-only sample shaped exactly like /api/health and /api/runs.
// Used only when App is rendered with dataSource="sample"; live mode always fetches the backend.
const freshFeeds = {
  granola: { last_file: "2026-09-04", files_seen: 2 },
  meet: { last_file: "2026-09-04", files_seen: 2 },
  dropzone: { last_file: "2026-08-26", files_seen: 2 },
};

export const sampleFeedHealth: FeedHealthData = {
  health: {
    referenceTime: "2026-09-04T09:00:00Z",
    thresholdDays: 3,
    feeds: [
      { id: "granola", lastSeen: "2026-09-04", ageDays: 0, filesSeen: 2, status: "healthy" },
      { id: "meet", lastSeen: "2026-09-04", ageDays: 0, filesSeen: 2, status: "healthy" },
      { id: "dropzone", lastSeen: "2026-08-26", ageDays: 9, filesSeen: 2, status: "stale" },
    ],
  },
  runs: [
    { run: 1, started_at: "2026-09-01T12:00:00Z", status: "ok", error: null, counts: { seen: 6, new: 2, routed: 2, unrouted: 0 }, feeds: freshFeeds },
    { run: 2, started_at: "2026-09-01T18:00:00Z", status: "ok", error: null, counts: { seen: 6, new: 0, routed: 0, unrouted: 0 }, feeds: freshFeeds },
    { run: 3, started_at: "2026-09-02T00:00:00Z", status: "ok", error: null, counts: { seen: 6, new: 2, routed: 2, unrouted: 0 }, feeds: freshFeeds },
    { run: 4, started_at: "2026-09-02T06:00:00Z", status: "ok", error: null, counts: { seen: 6, new: 0, routed: 0, unrouted: 0 }, feeds: freshFeeds },
    { run: 5, started_at: "2026-09-02T12:00:00Z", status: "fail", error: "dropzone: listing timed out after 30s (s3://inbox-dropzone/incoming)", counts: { seen: 4, new: 0, routed: 0, unrouted: 0 }, feeds: freshFeeds },
    { run: 6, started_at: "2026-09-02T18:00:00Z", status: "ok", error: null, counts: { seen: 6, new: 1, routed: 1, unrouted: 0 }, feeds: freshFeeds },
    { run: 7, started_at: "2026-09-03T00:00:00Z", status: "ok", error: null, counts: { seen: 6, new: 1, routed: 0, unrouted: 1 }, feeds: freshFeeds },
    { run: 8, started_at: "2026-09-03T06:00:00Z", status: "ok", error: null, counts: { seen: 6, new: 0, routed: 0, unrouted: 0 }, feeds: freshFeeds },
    { run: 9, started_at: "2026-09-03T12:00:00Z", status: "fail", error: "dropzone: AccessDenied when listing s3://inbox-dropzone/incoming", counts: { seen: 4, new: 0, routed: 0, unrouted: 0 }, feeds: freshFeeds },
    { run: 10, started_at: "2026-09-03T18:00:00Z", status: "ok", error: null, counts: { seen: 6, new: 2, routed: 2, unrouted: 0 }, feeds: freshFeeds },
    { run: 11, started_at: "2026-09-04T00:00:00Z", status: "ok", error: null, counts: { seen: 6, new: 0, routed: 0, unrouted: 0 }, feeds: freshFeeds },
    { run: 12, started_at: "2026-09-04T06:00:00Z", status: "ok", error: null, counts: { seen: 6, new: 2, routed: 1, unrouted: 1 }, feeds: freshFeeds },
  ],
};
