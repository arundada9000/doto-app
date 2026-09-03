import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { dayKey, currentStreak, isToday, isOverdue } from "@/lib/utils/dates";

// Thursday 3 September 2026, 12:00 local.
const NOW = new Date("2026-09-03T12:00:00");
const DAY = 86_400_000;

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(NOW);
});

afterEach(() => {
  vi.useRealTimers();
});

const keyFor = (daysAgo: number) => dayKey(NOW.getTime() - daysAgo * DAY);

describe("dayKey", () => {
  it("gives the same key for two times on the same day", () => {
    expect(dayKey(new Date("2026-09-03T01:00:00").getTime())).toBe(
      dayKey(new Date("2026-09-03T23:00:00").getTime())
    );
  });

  it("gives different keys for different days", () => {
    expect(dayKey(new Date("2026-09-03T12:00:00").getTime())).not.toBe(
      dayKey(new Date("2026-09-04T12:00:00").getTime())
    );
  });

  it("does not confuse days whose numbers overlap", () => {
    // "2026-1-11" and "2026-11-1" must not collide.
    expect(dayKey(new Date("2026-01-11T12:00:00").getTime())).not.toBe(
      dayKey(new Date("2026-11-01T12:00:00").getTime())
    );
  });
});

describe("currentStreak", () => {
  it("is zero when nothing has been completed", () => {
    expect(currentStreak(new Set())).toBe(0);
  });

  it("counts consecutive days ending today", () => {
    const days = new Set([keyFor(0), keyFor(1), keyFor(2)]);
    expect(currentStreak(days)).toBe(3);
  });

  it("keeps yesterday's streak alive through an empty today", () => {
    // The day is not over yet, so a quiet morning must not read as a break.
    const days = new Set([keyFor(1), keyFor(2)]);
    expect(currentStreak(days)).toBe(2);
  });

  it("stops at a gap", () => {
    const days = new Set([keyFor(0), keyFor(1), keyFor(3), keyFor(4)]);
    expect(currentStreak(days)).toBe(2);
  });

  it("is zero when the most recent day is too long ago", () => {
    expect(currentStreak(new Set([keyFor(2), keyFor(3)]))).toBe(0);
  });

  it("counts a single day completed today", () => {
    expect(currentStreak(new Set([keyFor(0)]))).toBe(1);
  });
});

describe("isToday and isOverdue", () => {
  it("recognises today at any hour", () => {
    expect(isToday(new Date("2026-09-03T23:30:00").getTime())).toBe(true);
    expect(isToday(new Date("2026-09-04T00:30:00").getTime())).toBe(false);
  });

  it("does not treat an earlier hour today as overdue", () => {
    // Something due at 9am is still today's problem at noon, not overdue.
    expect(isOverdue(new Date("2026-09-03T09:00:00").getTime())).toBe(false);
  });

  it("treats a past day as overdue", () => {
    expect(isOverdue(new Date("2026-09-02T09:00:00").getTime())).toBe(true);
  });
});
