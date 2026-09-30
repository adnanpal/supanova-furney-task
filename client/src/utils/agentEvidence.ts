import type { SignalEvidenceKey } from "../data/agentSignal";
import type { Summary } from "./feedHealth";
import { plural } from "./format";

export type Evidence = {
  observed: boolean;
  text: string;
};

export function getSignalEvidence(key: SignalEvidenceKey, summary: Summary): Evidence {
  const { runsDesc, totalRuns } = summary;

  switch (key) {
    case "volume":
      return { observed: false, text: "Needs a per-feed volume baseline — not tracked yet" };

    case "cadence":
      return { observed: false, text: "Needs arrival-time history per feed" };

    case "zero-new": {
      const zero = runsDesc.filter((r) => r.counts.new === 0).length;
      let streak = 0;
      for (const run of runsDesc) {
        if (run.counts.new !== 0) break;
        streak += 1;
      }
      if (!zero) return { observed: false, text: "No zero-item runs in current history" };
      return {
        observed: true,
        text: `${zero} of ${totalRuns} runs ingested no new items${streak > 1 ? ` · ${streak} in a row now` : ""}`,
      };
    }

    case "failures": {
      const failed = summary.failedRuns;
      if (!failed.length) return { observed: false, text: "No failed runs in current history" };
      const distinct = new Set(failed.map((r) => r.error ?? "unknown")).size;
      return {
        observed: true,
        text: `${failed.length} of ${totalRuns} runs failed · ${plural(distinct, "distinct error")}`,
      };
    }

    case "unrouted": {
      const affected = runsDesc.filter((r) => r.counts.unrouted > 0);
      if (!affected.length) return { observed: false, text: "No unrouted items in current history" };
      const total = affected.reduce((sum, r) => sum + r.counts.unrouted, 0);
      return {
        observed: true,
        text: `${plural(total, "item")} unrouted across ${plural(affected.length, "run")}`,
      };
    }

    case "correlation": {
      const errors = summary.failedRuns.map((r) => (r.error ?? "").toLowerCase());
      const matches = summary.staleFeeds
        .map((feed) => ({ id: feed.id, count: errors.filter((e) => e.includes(feed.id.toLowerCase())).length }))
        .filter((m) => m.count > 0);
      if (!matches.length) {
        return { observed: false, text: "No overlap between stale feeds and run errors" };
      }
      const [first] = matches;
      return {
        observed: true,
        text: `${first.id} is stale and named in ${plural(first.count, "failure message")}`,
      };
    }
  }
}
