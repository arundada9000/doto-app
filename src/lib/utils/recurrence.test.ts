import { describe, it, expect } from "vitest";
import { nextOccurrence } from "@/lib/utils/recurrence";
import type { RecurrenceRule } from "@/types";

const at = (iso: string) => new Date(iso).getTime();

// Thursday 3 September 2026, 15:00 local.
const NOW = at("2026-09-03T15:00:00");
const DUE_WED_9AM = at("2026-09-02T09:00:00");

const daily: RecurrenceRule = { type: "daily", interval: 1 };

describe("nextOccurrence", () => {
  it("returns the next date strictly in the future", () => {
    // Wednesday 9am plus one day is Thursday 9am, which has already passed at
    // 15:00, so the series must move on to Friday rather than hand back a
    // date that is already overdue.
    expect(nextOccurrence(daily, DUE_WED_9AM, NOW)).toBe(
      at("2026-09-04T09:00:00")
    );
  });

  it("catches up on a task overdue by months in one step", () => {
    expect(nextOccurrence(daily, at("2026-06-01T09:00:00"), NOW)).toBe(
      at("2026-09-04T09:00:00")
    );
  });

  it("keeps the original time of day", () => {
    const result = nextOccurrence(daily, at("2026-09-02T06:45:00"), NOW);
    const date = new Date(result as number);
    expect(date.getHours()).toBe(6);
    expect(date.getMinutes()).toBe(45);
  });

  it("honours an interval greater than one", () => {
    expect(nextOccurrence({ type: "daily", interval: 3 }, DUE_WED_9AM, NOW)).toBe(
      at("2026-09-05T09:00:00")
    );
  });

  it("advances a week when no weekdays are named", () => {
    expect(
      nextOccurrence({ type: "weekly", interval: 1 }, DUE_WED_9AM, NOW)
    ).toBe(at("2026-09-09T09:00:00"));
  });

  it("lands on the next named weekday", () => {
    // daysOfWeek uses Date.getDay(), so 1 is Monday.
    expect(
      nextOccurrence(
        { type: "weekly", interval: 1, daysOfWeek: [1] },
        DUE_WED_9AM,
        NOW
      )
    ).toBe(at("2026-09-07T09:00:00"));
  });

  it("skips a named weekday that has already passed today", () => {
    // Thursday 9am is a match but is behind NOW, so Monday is next.
    expect(
      nextOccurrence(
        { type: "weekly", interval: 1, daysOfWeek: [1, 4] },
        DUE_WED_9AM,
        NOW
      )
    ).toBe(at("2026-09-07T09:00:00"));
  });

  it("advances by month and by year", () => {
    expect(
      nextOccurrence({ type: "monthly", interval: 1 }, DUE_WED_9AM, NOW)
    ).toBe(at("2026-10-02T09:00:00"));
    expect(
      nextOccurrence({ type: "yearly", interval: 1 }, DUE_WED_9AM, NOW)
    ).toBe(at("2027-09-02T09:00:00"));
  });

  it("ends the series past its end date", () => {
    expect(
      nextOccurrence(
        { ...daily, endDate: at("2026-09-02T00:00:00") },
        DUE_WED_9AM,
        NOW
      )
    ).toBeNull();
  });

  it("treats a zero or negative interval as one rather than spinning", () => {
    expect(nextOccurrence({ type: "daily", interval: 0 }, DUE_WED_9AM, NOW)).toBe(
      at("2026-09-04T09:00:00")
    );
  });
});
