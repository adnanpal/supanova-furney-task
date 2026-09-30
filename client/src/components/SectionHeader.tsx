import type { ReactNode } from "react";

type SectionHeaderProps = {
  id: string;
  title: string;
  description?: ReactNode;
  aside?: ReactNode;
};

export function SectionHeader({ id, title, description, aside }: SectionHeaderProps) {
  return (
    <div className="mb-2.5 flex flex-wrap items-end justify-between gap-x-4 gap-y-1">
      <div className="min-w-0">
        <h2 id={id} className="text-[14px] font-semibold tracking-[-0.005em] text-zinc-900">
          {title}
        </h2>
        {description && <p className="mt-0.5 text-[12.5px] text-zinc-500">{description}</p>}
      </div>
      {aside && <div className="text-[12px] text-zinc-500">{aside}</div>}
    </div>
  );
}
