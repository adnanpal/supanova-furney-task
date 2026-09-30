import type { Tone } from "../utils/status";

const DOT: Record<Tone, string> = {
  healthy: "bg-emerald-500 ring-emerald-500/15",
  warning: "bg-amber-500 ring-amber-500/20",
  critical: "bg-red-500 ring-red-500/20",
  neutral: "bg-zinc-400 ring-zinc-400/15",
};

const PILL: Record<Tone, string> = {
  healthy: "bg-emerald-50 text-emerald-700 ring-emerald-600/15",
  warning: "bg-amber-50 text-amber-800 ring-amber-600/25",
  critical: "bg-red-50 text-red-700 ring-red-600/20",
  neutral: "bg-zinc-100 text-zinc-600 ring-zinc-500/15",
};

const PILL_DOT: Record<Tone, string> = {
  healthy: "bg-emerald-500",
  warning: "bg-amber-500",
  critical: "bg-red-500",
  neutral: "bg-zinc-400",
};

type DotProps = { tone: Tone; className?: string };

export function StatusDot({ tone, className = "" }: DotProps) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block h-2 w-2 shrink-0 rounded-full ring-[3px] transition-colors ${DOT[tone]} ${className}`}
    />
  );
}

type PillProps = { tone: Tone; label: string };

export function StatusPill({ tone, label }: PillProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-[5px] px-1.5 py-[3px] text-[11.5px] font-medium leading-none ring-1 ring-inset transition-colors ${PILL[tone]}`}
    >
      <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${PILL_DOT[tone]}`} />
      {label}
    </span>
  );
}
