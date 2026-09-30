import type { ReactNode } from "react";
import { Check, Minus, TriangleAlert } from "lucide-react";
import type { HealthResponse } from "../types/feedHealth";
import { formatAge, formatDate, formatDateTime } from "../utils/format";
import { getFreshness } from "../utils/feedHealth";
import { FEED_STATUS_LABEL, feedTone } from "../utils/status";
import { SectionHeader } from "./SectionHeader";
import { StatusDot, StatusPill } from "./StatusIndicator";

type FeedTableProps = {
  health: HealthResponse;
};

const COLS =
  "md:grid md:grid-cols-[minmax(160px,1.2fr)_104px_128px_88px_minmax(200px,1.5fr)_64px] md:items-center md:gap-x-4";

export function FeedTable({ health }: FeedTableProps) {
  const { feeds, thresholdDays, referenceTime } = health;

  return (
    <section aria-labelledby="feeds-heading">
      <SectionHeader
        id="feeds-heading"
        title="Feeds"
        description={`Age measured against a ${thresholdDays}-day freshness threshold at ${formatDateTime(referenceTime)} UTC.`}
        aside={<span className="font-mono">{feeds.length} feeds</span>}
      />

      <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
        <div
          className={`hidden border-b border-zinc-200 bg-zinc-50/80 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.06em] text-zinc-500 ${COLS}`}
          aria-hidden="true"
        >
          <span>Feed</span>
          <span>Status</span>
          <span>Last seen</span>
          <span>Age</span>
          <span>Freshness vs threshold</span>
          <span className="text-right">Files</span>
        </div>

        {feeds.length === 0 ? (
          <p className="px-4 py-8 text-center text-[13px] text-zinc-500">The health endpoint returned no feeds.</p>
        ) : (
          <ul className="divide-y divide-zinc-100">
            {feeds.map((feed) => {
              const tone = feedTone(feed.status);
              const stale = feed.status === "stale";
              const freshness = getFreshness(feed, thresholdDays);
              const FreshIcon = freshness.tone === "over" ? TriangleAlert : freshness.tone === "within" ? Check : Minus;

              return (
                <li
                  key={feed.id}
                  id={`feed-${feed.id}`}
                  className={`relative scroll-mt-20 px-4 py-3 transition-colors md:py-0 ${
                    stale ? "bg-amber-50/45 hover:bg-amber-50/80" : "hover:bg-zinc-50/80"
                  } target:bg-blue-50/60`}
                >
                  {stale && <span aria-hidden="true" className="absolute inset-y-0 left-0 w-[3px] bg-amber-500" />}
                  <div className={`${COLS} md:h-[52px]`}>
                    <div className="flex min-w-0 items-center gap-2.5">
                      <StatusDot tone={tone} />
                      <span className="truncate text-[13.5px] font-medium capitalize text-zinc-900">{feed.id}</span>
                      <span className="ml-auto md:hidden">
                        <StatusPill tone={tone} label={FEED_STATUS_LABEL[feed.status]} />
                      </span>
                    </div>
                    <div className="hidden md:block">
                      <StatusPill tone={tone} label={FEED_STATUS_LABEL[feed.status]} />
                    </div>

                    <dl className="mt-2.5 grid grid-cols-2 gap-x-4 gap-y-2 pl-[18px] sm:grid-cols-4 md:contents">
                      <Cell label="Last seen">
                        <span className="font-mono text-[12.5px] text-zinc-800">{formatDate(feed.lastSeen)}</span>
                      </Cell>
                      <Cell label="Age">
                        <span className={`font-mono text-[12.5px] ${stale ? "font-medium text-amber-700" : "text-zinc-800"}`}>
                          {formatAge(feed.ageDays)}
                        </span>
                      </Cell>
                      <Cell label="Freshness" className="col-span-2 sm:col-span-1">
                        <span className="flex min-w-0 items-center gap-1.5">
                          <FreshIcon
                            className={`h-3.5 w-3.5 shrink-0 ${
                              freshness.tone === "over" ? "text-amber-600" : freshness.tone === "within" ? "text-emerald-600" : "text-zinc-400"
                            }`}
                            aria-hidden="true"
                          />
                          <span
                            className={`text-[12.5px] ${
                              freshness.tone === "over" ? "font-medium text-amber-800" : freshness.tone === "within" ? "text-zinc-700" : "text-zinc-500"
                            }`}
                          >
                            {freshness.label}
                          </span>
                          <span className="truncate font-mono text-[11.5px] text-zinc-400">{freshness.detail}</span>
                        </span>
                      </Cell>
                      <Cell label="Files" className="md:text-right">
                        <span className="font-mono text-[12.5px] text-zinc-800">{feed.filesSeen}</span>
                      </Cell>
                    </dl>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}

type CellProps = {
  label: string;
  className?: string;
  children: ReactNode;
};

function Cell({ label, className = "", children }: CellProps) {
  return (
    <div className={`min-w-0 ${className}`}>
      <dt className="text-[11px] text-zinc-500 md:sr-only">{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}
