import { RotateCw, ServerCrash } from "lucide-react";
import { ENDPOINTS } from "../utils/api";

type ErrorStateProps = {
  message: string | null;
  onRetry: () => void;
};

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div role="alert" className="mx-auto mt-10 max-w-[560px] rounded-lg border border-zinc-200 bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
      <div className="flex gap-3 p-5">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-red-50 text-red-600">
          <ServerCrash className="h-4 w-4" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h2 className="text-[14px] font-semibold text-zinc-900">Can't reach the feed health server</h2>
          <p className="mt-1 text-[12.5px] leading-snug text-zinc-600">
            Health status can't be evaluated until both endpoints respond. Check that the backend is running, then retry.
          </p>
          {message && (
            <p className="mt-2 break-words font-mono text-[11.5px] text-red-700">{message}</p>
          )}
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-100 bg-zinc-50/70 px-5 py-3">
        <ul className="space-y-0.5 font-mono text-[11.5px] text-zinc-500">
          <li>GET {ENDPOINTS.health}</li>
          <li>GET {ENDPOINTS.runs}</li>
        </ul>
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex h-7 items-center gap-1.5 rounded-md bg-zinc-900 px-2.5 text-[12px] font-medium text-white transition-colors hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/50 focus-visible:ring-offset-1"
        >
          <RotateCw className="h-3.5 w-3.5" aria-hidden="true" />
          Retry
        </button>
      </div>
    </div>
  );
}
