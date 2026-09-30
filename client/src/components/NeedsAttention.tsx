import { CheckCircle2 } from "lucide-react";
import type { Issue, Severity } from "../types/feedHealth";
import { SEVERITY_LABEL } from "../utils/status";
import { IssueRow } from "./IssueRow";
import { SectionHeader } from "./SectionHeader";

type NeedsAttentionProps = {
  issues: Issue[];
  thresholdDays: number;
  feedCount: number;
};

const ORDER: Severity[] = ["critical", "warning", "notice"];

export function NeedsAttention({ issues, thresholdDays, feedCount }: NeedsAttentionProps) {
  const counts = ORDER.map((severity) => ({
    severity,
    count: issues.filter((i) => i.severity === severity).length,
  })).filter((c) => c.count > 0);

  return (
    <section aria-labelledby="attention-heading">
      <SectionHeader
        id="attention-heading"
        title="Needs attention"
        description={issues.length ? "Ranked by severity — start at the top." : undefined}
        aside={
          counts.length ? (
            <span className="font-mono">
              {counts.map((c) => `${c.count} ${SEVERITY_LABEL[c.severity].toLowerCase()}`).join(" · ")}
            </span>
          ) : undefined
        }
      />

      {issues.length === 0 ? (
        <div className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-white px-4 py-3.5">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <p className="text-[13.5px] font-medium text-zinc-900">Nothing needs attention</p>
            <p className="text-[12.5px] text-zinc-500">
              All {feedCount} feeds are inside the {thresholdDays}-day threshold, recent runs succeeded, and every item was routed.
            </p>
          </div>
        </div>
      ) : (
        <ol className="divide-y divide-zinc-100 overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
          {issues.map((issue) => (
            <IssueRow key={issue.id} issue={issue} />
          ))}
        </ol>
      )}
    </section>
  );
}
