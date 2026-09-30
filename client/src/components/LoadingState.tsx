export function LoadingState() {
  return (
    <div role="status" aria-live="polite" className="space-y-5">
      <span className="sr-only">Loading feed health…</span>
      <div className="h-[104px] animate-pulse rounded-lg border border-zinc-200 bg-white">
        <div className="flex h-full">
          <div className="w-[320px] space-y-3 border-r border-zinc-100 p-4">
            <div className="h-2.5 w-20 rounded bg-zinc-100" />
            <div className="h-4 w-28 rounded bg-zinc-200/70" />
            <div className="h-2.5 w-48 rounded bg-zinc-100" />
          </div>
          <div className="hidden flex-1 grid-cols-6 md:grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-3 border-r border-zinc-100 p-4 last:border-r-0">
                <div className="h-2.5 w-16 rounded bg-zinc-100" />
                <div className="h-4 w-10 rounded bg-zinc-200/70" />
              </div>
            ))}
          </div>
        </div>
      </div>
      {[3, 3].map((rows, s) => (
        <div key={s} className="animate-pulse">
          <div className="mb-2.5 h-3 w-32 rounded bg-zinc-200/70" />
          <div className="divide-y divide-zinc-100 rounded-lg border border-zinc-200 bg-white">
            {Array.from({ length: rows }).map((_, i) => (
              <div key={i} className="flex h-[52px] items-center gap-6 px-4">
                <div className="h-2.5 w-24 rounded bg-zinc-100" />
                <div className="h-2.5 w-16 rounded bg-zinc-100" />
                <div className="h-2.5 w-28 rounded bg-zinc-100" />
                <div className="ml-auto h-2.5 w-10 rounded bg-zinc-100" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
