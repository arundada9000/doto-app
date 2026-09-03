import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { parseCapture, extractLink, extractTags } from "@/lib/utils/nlp";

// parseCapture resolves relative dates against the current time, so the clock
// is pinned. Thursday 3 September 2026, 12:00 local.
const NOW = new Date("2026-09-03T12:00:00");

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(NOW);
});

afterEach(() => {
  vi.useRealTimers();
});

describe("extractTags", () => {
  it("collects tags and lowercases them", () => {
    expect(extractTags("Buy milk #Groceries #urgent")).toEqual([
      "groceries",
      "urgent",
    ]);
  });

  it("deduplicates tags that differ only by case", () => {
    expect(extractTags("#work and #Work")).toEqual(["work"]);
  });

  it("ignores a URL fragment", () => {
    // The boundary before the hash is the whole point: without it every
    // anchored link would invent a tag.
    expect(extractTags("Read https://example.com#section today")).toEqual([]);
  });

  it("finds a tag at the very start of the text", () => {
    expect(extractTags("#inbox zero")).toEqual(["inbox"]);
  });

  it("returns nothing when there are no tags", () => {
    expect(extractTags("plain text")).toEqual([]);
  });
});

describe("parseCapture", () => {
  it("keeps plain text as the title and schedules nothing", () => {
    const result = parseCapture("Buy milk");
    expect(result.title).toBe("Buy milk");
    expect(result.dueAt).toBeUndefined();
    expect(result.recurrence).toBeUndefined();
    expect(result.tags).toEqual([]);
  });

  it("strips tags out of the title", () => {
    const result = parseCapture("Buy milk #groceries");
    expect(result.title).toBe("Buy milk");
    expect(result.tags).toEqual(["groceries"]);
  });

  it("reads a date and time and removes them from the title", () => {
    const result = parseCapture("Call Ram tomorrow at 10");
    expect(result.title).toBe("Call Ram");
    const due = new Date(result.dueAt as number);
    expect(due.getDate()).toBe(4);
    expect(due.getMonth()).toBe(8); // September
    expect(due.getHours()).toBe(10);
  });

  it("reads a bare morning hour as written", () => {
    const result = parseCapture("Standup at 9");
    expect(new Date(result.dueAt as number).getHours()).toBe(9);
  });

  it("reads a bare small hour as the afternoon", () => {
    // "at 5" means the evening in ordinary use, not five in the morning.
    const result = parseCapture("Gym at 5");
    expect(new Date(result.dueAt as number).getHours()).toBe(17);
  });

  it("respects an explicit meridian over the bare-hour heuristic", () => {
    const result = parseCapture("Flight at 5am");
    expect(new Date(result.dueAt as number).getHours()).toBe(5);
  });

  it("keeps the time when a date token follows it", () => {
    // The date is resolved after the time, and used to overwrite it outright.
    const result = parseCapture("Review notes tomorrow at 14:30");
    const due = new Date(result.dueAt as number);
    expect(due.getDate()).toBe(4);
    expect(due.getHours()).toBe(14);
    expect(due.getMinutes()).toBe(30);
  });

  it("reads a recurrence phrase", () => {
    const result = parseCapture("Water the plants every day");
    expect(result.recurrence).toEqual({ type: "daily", interval: 1 });
    expect(result.title).toBe("Water the plants");
  });

  it("reads a named weekday recurrence", () => {
    const result = parseCapture("Standup every monday");
    expect(result.recurrence?.type).toBe("weekly");
    expect(result.recurrence?.daysOfWeek).toEqual([1]);
  });

  it("falls back to the raw text when parsing consumes everything", () => {
    // "#alone" leaves an empty title once the tag is stripped, and an item
    // with no title at all would be worse than keeping the original.
    expect(parseCapture("#alone").title).toBe("#alone");
  });

  it("always returns a tags array", () => {
    expect(parseCapture("anything").tags).toEqual([]);
  });
});

describe("extractLink", () => {
  it("finds a bare http URL", () => {
    expect(extractLink("see https://example.com/docs now")).toBe(
      "https://example.com/docs"
    );
  });

  it("adds a scheme to a www address", () => {
    expect(extractLink("see www.example.com")).toBe("https://www.example.com");
  });

  it("drops trailing sentence punctuation", () => {
    expect(extractLink("read https://example.com/page.")).toBe(
      "https://example.com/page"
    );
  });

  it("returns null when there is no link", () => {
    expect(extractLink("no link here")).toBeNull();
  });
});
