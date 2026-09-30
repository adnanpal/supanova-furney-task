const DAY_MS = 86_400_000;
const HOUR_MS = 3_600_000;

function dateOnly(value: string): Date {
  return new Date(`${value.slice(0, 10)}T00:00:00Z`);
}

export function formatDate(value: string | null): string {
  if (!value) return "Never";
  const date = dateOnly(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function formatDateTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "UTC",
  });
}

export function formatClock(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

export function formatAge(days: number | null): string {
  if (days === null) return "—";
  if (days <= 0) return "Today";
  return plural(days, "day");
}

export function formatSince(from: string, reference: string): string {
  const diff = new Date(reference).getTime() - new Date(from).getTime();
  if (Number.isNaN(diff)) return "";
  if (diff < 0) return "after reference";
  const hours = Math.floor(diff / HOUR_MS);
  if (hours < 1) return "<1h before ref.";
  if (hours < 48) return `${hours}h before ref.`;
  return `${Math.floor(hours / 24)}d before ref.`;
}

export function daysBetween(fromDate: string, to: string): number | null {
  const start = dateOnly(fromDate).getTime();
  const end = new Date(to).getTime();
  if (Number.isNaN(start) || Number.isNaN(end)) return null;
  return Math.max(0, Math.floor((end - start) / DAY_MS));
}

export function plural(count: number, singular: string, pluralForm = `${singular}s`): string {
  return `${count} ${count === 1 ? singular : pluralForm}`;
}

export function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
