import { CheckCircle2, XCircle } from "lucide-react";
import type { Run } from "../types/feedHealth";
import { daysBetween, formatAge, formatDate, formatDateTime } from "../utils/format";

type RunDetailProps = {
  run: Run;
  thresholdDays: number;
}

export function RunDetail({ run, thresholdDays }: RunDetailProps) {
  const feeds = Object.entries(run.feeds);

  return (
    <div className="grid gap-5 border-t border-zinc-100 bg-zinc-50/70 px-4 py-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] md:pl-[52px]">
      <div className="min-w-0">
        <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-zinc-500">Outcome</p>
        {run.error ? (
          <div className="mt-2 flex gap-2 rounded-md border border-red-200 bg-white p-2.5">
            <XCircle className="mt-px h-3.5 w-3.5 shrink-0 text-red-600" aria-hidden="true" />
            <p className="break-words font-mono text-[12px] leading-relaxed text-red-700">{run.error}</p>
          </div>
        ) : (
          <p className="mt-2 flex items-center gap-1.5 text-[12.5px] text-zinc-700">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
            {run.status === "fail" ? "Failed without an error message." : "Completed without errors."}
          </p>
        )}
        <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-[12px]">
          <dt className="text-zinc-500">Started</dt>
          <dd className="font-mono text-zinc-800">{formatDateTime(run.started_at)} UTC</dd>
          <dt className="text-zinc-500">Routing</dt>
          <dd className="font-mono text-zinc-800">
            {run.counts.routed} of {run.counts.new} new routed
          </dd>
          <dt className="text-zinc-500">Unrouted</dt>
          <dd className={`font-mono ${run.counts.unrouted ? "font-medium text-amber-700" : "text-zinc-800"}`}>
            {run.counts.unrouted}
          </dd>
        </dl>
      </div>

      <div className="min-w-0">
        <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-zinc-500">Feeds in this run</p>
        {feeds.length === 0 ? (
          <p className="mt-2 text-[12.5px] text-zinc-500">No feed data recorded for this run.</p>
        ) : (
          <table className="mt-2 w-full text-left text-[12px]">
            <thead>
              <tr className="text-[11px] text-zinc-500">
                <th scope="col" className="pb-1.5 font-normal">Feed</th>
                <th scope="col" className="pb-1.5 font-normal">Last file</th>
                <th scope="col" className="pb-1.5 font-normal">Age at run</th>
                <th scope="col" className="pb-1.5 text-right font-normal">Files</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200/70">
              {feeds.map(([id, feed]) => {
                const age = feed.last_file ? daysBetween(feed.last_file, run.started_at) : null;
                const over = age !== null && age > thresholdDays;
                return (
                  <tr key={id}>
                    <th scope="row" className="py-1.5 font-medium capitalize text-zinc-800">{id}</th>
                    <td className="py-1.5 font-mono text-zinc-700">{formatDate(feed.last_file)}</td>
                    <td className={`py-1.5 font-mono ${over ? "font-medium text-amber-700" : "text-zinc-700"}`}>
                      {formatAge(age)}
                    </td>
                    <td className="py-1.5 text-right font-mono text-zinc-700">{feed.files_seen}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
