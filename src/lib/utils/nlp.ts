import { startOfDay, addDays } from "@/lib/utils/dates";
import type { RecurrenceRule } from "@/types";

export interface ParsedCapture {
  title: string;
  dueAt?: number;
  reminder?: number;
  recurrence?: RecurrenceRule;
}

const DAY_NAMES = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

function parseTime(text: string): { hour: number; minute: number } | null {
  const trimmed = text.trim().toLowerCase();

  const hourMinute = trimmed.match(/^\d{1,2}[:.]\d{2}\s*(am|pm)?$/);
  if (hourMinute) {
    const [h, m] = hourMinute[0].replace(".", ":").split(":");
    let hour = parseInt(h, 10);
    const minute = parseInt(m, 10);
    const meridian = hourMinute[0].match(/(am|pm)$/)?.[0];
    if (meridian === "pm" && hour < 12) hour += 12;
    if (meridian === "am" && hour === 12) hour = 0;
    return { hour, minute };
  }

  const hourOnly = trimmed.match(/^(\d{1,2})\s*(am|pm)$/);
  if (hourOnly) {
    let hour = parseInt(hourOnly[1], 10);
    const meridian = hourOnly[2];
    if (meridian === "pm" && hour < 12) hour += 12;
    if (meridian === "am" && hour === 12) hour = 0;
    return { hour, minute: 0 };
  }

  const wordTime = trimmed.match(/^(noon|midnight|morning|afternoon|evening|night)$/);
  if (wordTime) {
    switch (wordTime[1]) {
      case "noon":
      case "afternoon":
        return { hour: 12, minute: 0 };
      case "midnight":
      case "night":
        return { hour: 21, minute: 0 };
      case "morning":
        return { hour: 9, minute: 0 };
    }
  }

  return null;
}

function nextDayOfWeek(dayIndex: number, from: Date): Date {
  const current = from.getDay();
  let diff = dayIndex - current;
  if (diff <= 0) diff += 7;
  return addDays(startOfDay(from), diff);
}

function parseDateToken(token: string, ref: Date): number | null {
  const t = token.trim().toLowerCase();

  if (t === "today") return startOfDay(ref).getTime();
  if (t === "tomorrow") return addDays(startOfDay(ref), 1).getTime();
  if (t === "tmrw") return addDays(startOfDay(ref), 1).getTime();
  if (t === "tomo") return addDays(startOfDay(ref), 1).getTime();
  if (t === "tmr") return addDays(startOfDay(ref), 1).getTime();
  if (t === "yesterday") return addDays(startOfDay(ref), -1).getTime();

  const weekday = DAY_NAMES.findIndex((name) => t === name || t === name + "s");
  if (weekday >= 0) return nextDayOfWeek(weekday, ref).getTime();

  const nextWeekday = t.match(/^next\s+(\w+)$/);
  if (nextWeekday) {
    const idx = DAY_NAMES.findIndex((name) => nextWeekday[1] === name || nextWeekday[1] === name + "s");
    if (idx >= 0) return addDays(nextDayOfWeek(idx, ref), 7).getTime();
  }

  return null;
}

function parseRecurrence(token: string): RecurrenceRule | null {
  const t = token.trim().toLowerCase();

  if (t === "daily" || t === "everyday" || t === "every day") {
    return { type: "daily", interval: 1 };
  }
  if (t === "weekly" || t === "every week") {
    return { type: "weekly", interval: 1 };
  }
  if (t === "monthly" || t === "every month") {
    return { type: "monthly", interval: 1 };
  }
  if (t === "yearly" || t === "annually" || t === "every year") {
    return { type: "yearly", interval: 1 };
  }

  const weekday = DAY_NAMES.findIndex((name) => t === name || t === "every " + name);
  if (weekday >= 0) {
    return { type: "weekly", interval: 1, daysOfWeek: [weekday] };
  }

  return null;
}

function applyTime(baseTs: number, timeText: string): number {
  const time = parseTime(timeText);
  if (!time) return baseTs;
  const base = new Date(baseTs);
  base.setHours(time.hour, time.minute, 0, 0);
  return base.getTime();
}

/**
 * Parse a raw capture string into structured parts.
 * Recognizes date tokens, time-of-day, and recurrence phrases.
 * Anything unrecognized stays in the title.
 */
export function parseCapture(raw: string): ParsedCapture {
  const ref = new Date();
  let text = raw.trim();

  let title = text;
  let dueAt: number | undefined;
  let recurrence: RecurrenceRule | undefined;

  const dateTokens = [
    "today",
    "tomorrow",
    "tmrw",
    "tomo",
    "tmr",
    "yesterday",
    "sunday",
    "mondays",
    "tuesdays",
    "wednesdays",
    "thursdays",
    "fridays",
    "saturdays",
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];

  // Try recurrence phrases first (e.g. "every day", "weekly", "every monday")
  const recurPhrases = [
    "every day",
    "every week",
    "every month",
    "every year",
    "weekly",
    "daily",
    "monthly",
    "yearly",
    "annually",
    "every monday",
    "every tuesday",
    "every wednesday",
    "every thursday",
    "every friday",
    "every saturday",
    "every sunday",
  ];

  for (const phrase of recurPhrases.sort((a, b) => b.length - a.length)) {
    if (text.toLowerCase().includes(phrase)) {
      const rule = parseRecurrence(phrase);
      if (rule) recurrence = rule;
      text = text
        .replace(new RegExp(`\\b${phrase}\\b`, "gi"), " ")
        .replace(/\s+/g, " ")
        .trim();
    }
  }

  // Handle "next monday" etc.
  const nextMatch = text.match(/\bnext\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i);
  if (nextMatch) {
    const ts = parseDateToken(nextMatch[0], ref);
    if (ts) dueAt = ts;
    text = text.replace(nextMatch[0], " ").replace(/\s+/g, " ").trim();
  }

  // Extract a trailing time token like "at 10", "10am", "5pm"
  const timeAtMatch = text.match(/\b(at\s+)?(\d{1,2}([:.]\d{2})?\s*(am|pm)?|noon|midnight|morning|afternoon|evening|night)\b/i);
  if (timeAtMatch) {
    const timeStr = timeAtMatch[0].replace(/^at\s+/i, "");
    const base = dueAt ?? startOfDay(ref).getTime();
    dueAt = applyTime(base, timeStr);
    const pattern = timeAtMatch[0].replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    text = text
      .replace(new RegExp(`\\b${pattern}\\b`, "i"), " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  // Extract a lone date token
  for (const token of dateTokens) {
    const re = new RegExp(`\\b${token}\\b`, "i");
    if (re.test(text)) {
      const ts = parseDateToken(token, ref);
      if (ts) {
        dueAt = ts;
        text = text.replace(re, " ").replace(/\s+/g, " ").trim();
      }
    }
  }

  title = text.trim();

  return {
    title: title || raw.trim(),
    dueAt,
    recurrence,
  };
}

const URL_PATTERN =
  /\b(?:https?:\/\/|www\.)[^\s<>"']+/i;

export function extractLink(text: string): string | null {
  const match = URL_PATTERN.exec(text);
  if (!match) return null;
  let url = match[0].replace(/[),.;]+$/, "");
  if (!/^https?:\/\//i.test(url)) url = `https://${url}`;
  return url;
}
