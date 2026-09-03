import type { RecurrenceRule } from "@/types";
import { addDays, addMonths, addWeeks, addYears } from "@/lib/utils/dates";

/**
 * A task overdue by several intervals should return with its next real due
 * date, not one that is still in the past, so the rule is applied repeatedly.
 * The cap stops a malformed interval from spinning.
 */
const MAX_ADVANCES = 500;

function advanceOnce(rule: RecurrenceRule, from: Date): Date {
  const interval = Math.max(1, Math.floor(rule.interval || 1));

  switch (rule.type) {
    case "daily":
      return addDays(from, interval);
    case "weekly": {
      const days = rule.daysOfWeek?.length ? [...rule.daysOfWeek].sort() : null;
      if (!days) return addWeeks(from, interval);
      // Step forward a day at a time to the next selected weekday, so a rule
      // such as "Mondays and Thursdays" lands on whichever comes next.
      for (let offset = 1; offset <= 7; offset++) {
        const candidate = addDays(from, offset);
        if (days.includes(candidate.getDay())) return candidate;
      }
      return addWeeks(from, interval);
    }
    case "monthly":
      return addMonths(from, interval);
    case "yearly":
      return addYears(from, interval);
    default:
      return addDays(from, interval);
  }
}

/**
 * The next due timestamp strictly after `after`, or null when the rule has
 * finished. Returns null rather than a past date so callers can simply stop.
 */
export function nextOccurrence(
  rule: RecurrenceRule,
  previousDue: number,
  after: number = Date.now()
): number | null {
  let cursor = new Date(previousDue);

  for (let i = 0; i < MAX_ADVANCES; i++) {
    cursor = advanceOnce(rule, cursor);
    const ts = cursor.getTime();
    if (rule.endDate !== undefined && ts > rule.endDate) return null;
    if (ts > after) return ts;
  }

  return null;
}
