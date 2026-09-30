import { AlertTriangle, ArrowRight, Info, XCircle } from "lucide-react";
import type { Issue } from "../types/feedHealth";
import { SEVERITY_LABEL, TONE_RAIL, TONE_TEXT, severityTone } from "../utils/status";

type IssueRowProps = {
  issue: Issue;
};

export function IssueRow({ issue }: IssueRowProps) {
  const tone = severityTone(issue.severity);
  const Icon = issue.severity === "critical" ? XCircle : issue.severity === "warning" ? AlertTriangle : Info;

  return (
    <li className="relative grid gap-x-6 gap-y-3 px-4 py-3.5 pl-5 transition-colors hover:bg-zinc-50/70 lg:grid-cols-[minmax(240px,1.1fr)_minmax(0,1.5fr)_minmax(220px,1fr)]">
      <span aria-hidden="true" className={`absolute inset-y-0 left-0 w-[3px] ${TONE_RAIL[tone]}`} />

      <div className="min-w-0">
        <div className="flex items-center gap-2 text-[11px]">
          <span className={`inline-flex items-center gap-1 font-semibold uppercase tracking-[0.06em] ${TONE_TEXT[tone]}`}>
            <Icon className="h-3.5 w-3.5" aria-hidden="true" />
            {SEVERITY_LABEL[issue.severity]}
          </span>
          <span className="text-zinc-300" aria-hidden="true">/</span>
          <span className="font-mono font-medium uppercase tracking-[0.04em] text-zinc-700">{issue.subject}</span>
        </div>
        <h3 className="mt-1 text-[14px] font-medium text-zinc-900">{issue.title}</h3>
        {issue.message && (
          <p
            className={
              issue.messageIsError
                ? "mt-1 break-words font-mono text-[11.5px] leading-relaxed text-red-700"
                : "mt-0.5 text-[12.5px] text-zinc-600"
            }
          >
            {issue.message}
          </p>
        )}
      </div>

      <dl className="grid grid-cols-2 content-start gap-x-5 gap-y-2.5 sm:grid-cols-4">
        {issue.facts.map((fact) => (
          <div key={fact.label} className="min-w-0">
            <dt className="text-[11px] text-zinc-500">{fact.label}</dt>
            <dd
              className={`mt-0.5 truncate font-mono text-[13px] ${
                fact.emphasis ? `font-medium ${TONE_TEXT[tone]}` : "text-zinc-800"
              }`}
              title={fact.value}
            >
              {fact.value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="flex min-w-0 flex-col items-start gap-2 lg:border-l lg:border-zinc-100 lg:pl-5">
        <div>
          <p className="text-[11px] text-zinc-500">Investigate</p>
          <p className="mt-0.5 text-[12.5px] leading-snug text-zinc-700">{issue.nextStep}</p>
        </div>
        {issue.href && (
          <a
            href={issue.href}
            className="group inline-flex items-center gap-1 rounded text-[12px] font-medium text-blue-700 hover:text-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/40"
          >
            {issue.hrefLabel}
            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </a>
        )}
      </div>
    </li>
  );
}
