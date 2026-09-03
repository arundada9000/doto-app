export function startOfDay(d: Date): Date {
  const date = new Date(d);
  date.setHours(0, 0, 0, 0);
  return date;
}

export function startOfToday(): Date {
  return startOfDay(new Date());
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function isToday(ts: number): boolean {
  return isSameDay(new Date(ts), new Date());
}

export function isOverdue(ts: number): boolean {
  return ts < Date.now() && !isToday(ts);
}

export function addDays(d: Date, days: number): Date {
  const date = new Date(d);
  date.setDate(date.getDate() + days);
  return date;
}

export function addWeeks(d: Date, weeks: number): Date {
  const date = new Date(d);
  date.setDate(date.getDate() + weeks * 7);
  return date;
}

export function addMonths(d: Date, months: number): Date {
  const date = new Date(d);
  date.setMonth(date.getMonth() + months);
  return date;
}

export function addYears(d: Date, years: number): Date {
  const date = new Date(d);
  date.setFullYear(date.getFullYear() + years);
  return date;
}

export function formatRelative(ts: number, now: number = Date.now()): string {
  const diff = ts - now;
  const abs = Math.abs(diff);
  const minutes = Math.floor(abs / 60000);
  const hours = Math.floor(abs / 3600000);
  const days = Math.floor(abs / 86400000);

  if (diff < 0) {
    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return formatDate(ts);
  }

  if (minutes < 1) return "now";
  if (minutes < 60) return `in ${minutes}m`;
  if (hours < 24) return `in ${hours}h`;
  if (days < 7) return `in ${days}d`;
  return formatDate(ts);
}

export function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: new Date(ts).getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
  });
}

export function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}
