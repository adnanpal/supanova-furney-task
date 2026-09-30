import { ChevronRight, Inbox, RotateCw } from "lucide-react";
import type { DataSource } from "../types/feedHealth";
import { formatClock, formatDateTime } from "../utils/format";

type AppHeaderProps = {
  dataSource: DataSource;
  referenceTime?: string;
  thresholdDays?: number;
  fetchedAt: Date | null;
  refreshing: boolean;
  refreshError: string | null;
  onRefresh: () => void;
};

export function AppHeader({
  dataSource,
  referenceTime,
  thresholdDays,
  fetchedAt,
  refreshing,
  refreshError,
  onRefresh,
}: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white">
      <div className="mx-auto flex h-12 max-w-[1360px] items-center gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="grid h-6 w-6 shrink-0 place-items-center rounded-[5px] bg-zinc-900 text-white">
            <Inbox className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
          <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1.5 text-[13px]">
            <span className="text-zinc-500">Inbox</span>
            <ChevronRight className="h-3.5 w-3.5 text-zinc-300" aria-hidden="true" />
            <span className="hidden text-zinc-500 sm:inline">Operations</span>
            <ChevronRight className="hidden h-3.5 w-3.5 text-zinc-300 sm:inline" aria-hidden="true" />
            <span className="truncate font-medium text-zinc-900" aria-current="page">
              Feed health
            </span>
          </nav>
        </div>

        <div className="ml-auto flex items-center gap-3 text-[12px] text-zinc-500">
          {referenceTime && (
            <span className="hidden items-center gap-1.5 lg:flex">
              Evaluated
              <span className="font-mono text-zinc-800">{formatDateTime(referenceTime)} UTC</span>
            </span>
          )}
          {thresholdDays !== undefined && (
            <>
              <span className="hidden h-3.5 w-px bg-zinc-200 lg:block" aria-hidden="true" />
              <span className="hidden items-center gap-1.5 md:flex">
                Threshold
                <span className="font-mono text-zinc-800">{thresholdDays}d</span>
              </span>
            </>
          )}
          <span className="hidden h-3.5 w-px bg-zinc-200 md:block" aria-hidden="true" />
          {dataSource === "live" ? (
            <span className="flex items-center gap-1.5" title={fetchedAt ? `Fetched ${formatClock(fetchedAt)}` : undefined}>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
              Live
            </span>
          ) : (
            <span className="rounded-[4px] bg-amber-50 px-1.5 py-0.5 font-medium text-amber-800 ring-1 ring-inset ring-amber-600/25">
              Sample data
            </span>
          )}
          {refreshError && (
            <span role="status" className="hidden text-red-700 sm:inline" title={refreshError}>
              Refresh failed
            </span>
          )}
          <button
            type="button"
            onClick={onRefresh}
            disabled={refreshing}
            className="inline-flex h-7 items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-2.5 text-[12px] font-medium text-zinc-800 transition-colors hover:border-zinc-300 hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/40 disabled:opacity-60"
          >
            <RotateCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} aria-hidden="true" />
            <span className="hidden sm:inline">{refreshing ? "Refreshing" : "Refresh"}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
