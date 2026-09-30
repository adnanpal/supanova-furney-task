import type { Run } from "../types/feedHealth";
import { formatDateTime } from "../utils/format";
import { RUN_STATUS_LABEL } from "../utils/status";

type RunSequenceProps = {
  runsDesc: Run[];
  size?: "sm" | "md";
  limit?: number;
  onSelect?: (run: number) => void;
};

export function RunSequence({ runsDesc, size = "sm", limit = 24, onSelect }: RunSequenceProps) {
  const ordered = runsDesc.slice(0, limit).reverse();
  const tick = size === "sm" ? "h-3.5 w-[5px]" : "h-6 w-2";

  return (
    <div className="flex items-end gap-[3px]" role="list" aria-label="Run outcomes, oldest to newest">
      {ordered.map((run, i) => {
        const failed = run.status === "fail";
        const latest = i === ordered.length - 1;
        const label = `Run #${run.run} · ${RUN_STATUS_LABEL[run.status]} · ${formatDateTime(run.started_at)} UTC`;
        const color = failed ? "bg-red-500" : "bg-emerald-500/60";
        const cls = `${tick} rounded-[2px] ${color} ${latest ? "outline outline-1 outline-offset-1 outline-zinc-400" : ""}`;

        return (
          <span role="listitem" key={run.run} className="flex">
            {onSelect ? (
              <button
                type="button"
                title={label}
                aria-label={label}
                onClick={() => onSelect(run.run)}
                className={`${cls} transition-transform hover:scale-y-110 focus-visible:outline-2 focus-visible:outline-blue-600`}
              />
            ) : (
              <span title={label} className={cls} />
            )}
          </span>
        );
      })}
    </div>
  );
}
