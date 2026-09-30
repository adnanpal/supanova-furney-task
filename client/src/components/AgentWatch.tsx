import { Activity, Ban, Network, Repeat, Split, Clock, Telescope } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { agentSignals, type SignalIcon } from "../data/agentSignal";
import type { Summary } from "../utils/feedHealth";
import { getSignalEvidence } from "../utils/agentEvidence";
type AgentWatchProps = {
  summary: Summary;
  thresholdDays: number;
};
const ICONS: Record<SignalIcon, LucideIcon> = {
  activity: Activity,
  ban: Ban,
  repeat: Repeat,
  split: Split,
  clock: Clock,
  network: Network
};
export function AgentWatch({
  summary,
  thresholdDays
}: AgentWatchProps) {
  return <section aria-labelledby="agent-watch-heading" className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 px-4 py-3">
        <div className="flex items-center gap-2">
          <Telescope className="h-4 w-4 text-blue-700" aria-hidden="true" />
          <h2 id="agent-watch-heading" className="text-[14px] font-semibold text-zinc-900">
            Beyond thresholds
          </h2>
          <span className="rounded-[4px] border border-dashed border-zinc-300 px-1.5 py-0.5 text-[11px] text-zinc-500">
            Proposal · not monitored today
          </span>
        </div>
        <p className="text-[12px] text-zinc-500">What an agent should watch that a freshness threshold can't catch</p>
      </div>

      <div className="grid lg:grid-cols-[minmax(280px,360px)_1fr]">
        <div className="border-b border-zinc-200 p-4 lg:border-b-0 lg:border-r">
          <blockquote className="text-[15px] font-medium leading-relaxed tracking-[-0.01em] text-zinc-800">
            Freshness says whether something <span className="text-zinc-400">arrived</span>. An agent could determine
            whether what arrived <span className="text-blue-700">looks normal</span>.
          </blockquote>

          <div className="mt-4 space-y-2">
            <div className="rounded-md border border-zinc-200 p-3">
              <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-zinc-500">Threshold check · today</p>
              <p className="mt-1 font-mono text-[12.5px] text-zinc-800">ageDays ≤ {thresholdDays}</p>
              <p className="mt-1 text-[12px] leading-snug text-zinc-600">
                One number per feed, evaluated in isolation. Resets the moment any file lands.
              </p>
            </div>
            <div className="rounded-md border border-blue-200 bg-blue-50/40 p-3">
              <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-blue-700">Agent watch · proposed</p>
              <p className="mt-1 font-mono text-[12.5px] text-zinc-800">is this feed behaving like itself?</p>
              <p className="mt-1 text-[12px] leading-snug text-zinc-600">
                Compares each feed with its own history across runs — volume, cadence, failures, and routing.
              </p>
            </div>
          </div>

          <p className="mt-3 text-[11.5px] leading-snug text-zinc-500">
            Observations on each signal are derived from the current run history. No agent is running.
          </p>
        </div>

        <ul className="grid gap-px bg-zinc-100 sm:grid-cols-2">
          {agentSignals.map(signal => {
          const Icon = ICONS[signal.icon];
          const evidence = getSignalEvidence(signal.evidenceKey, summary);
          return <li key={signal.id} className="flex flex-col gap-2 bg-white p-4">
                <div className="flex items-center gap-2">
                  <span className="grid h-6 w-6 place-items-center rounded-[5px] bg-zinc-100 text-zinc-600">
                    <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                  <h3 className="text-[13px] font-medium text-zinc-900">{signal.title}</h3>
                </div>
                <p className="text-[12.5px] leading-snug text-zinc-600">{signal.description}</p>
                <p className="text-[12px] leading-snug text-zinc-500">
                  <span className="text-zinc-400">Threshold misses it: </span>
                  {signal.thresholdGap}
                </p>
                <p className={`mt-auto flex items-start gap-1.5 border-t border-zinc-100 pt-2 text-[11.5px] leading-snug ${evidence.observed ? "text-zinc-800" : "text-zinc-400"}`}>
                  <span aria-hidden="true" className={`mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full ${evidence.observed ? "bg-blue-600" : "bg-zinc-300"}`} />
                  <span>
                    <span className="sr-only">{evidence.observed ? "Observed in current data: " : "Not observable yet: "}</span>
                    {evidence.text}
                  </span>
                </p>
              </li>;
        })}
        </ul>
      </div>
    </section>;
}