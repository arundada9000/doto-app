export type ItemType = "task" | "note" | "checklist";

export type ItemView = "inbox" | "today" | "completed";

export interface ChecklistEntry {
  id: string;
  text: string;
  completed: boolean;
  order: number;
}

export type RecurrenceType = "daily" | "weekly" | "monthly" | "yearly";

export interface RecurrenceRule {
  type: RecurrenceType;
  interval: number;
  daysOfWeek?: number[];
  endDate?: number;
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  data: Blob;
  createdAt: number;
}

export interface Item {
  id: string;
  type: ItemType;
  title: string;
  content?: string;
  checklist?: ChecklistEntry[];
  completed: boolean;
  createdAt: number;
  updatedAt: number;
  dueAt?: number;
  completedAt?: number;
  reminder?: number;
  recurrence?: RecurrenceRule;
  tags: string[];
  attachments: Attachment[];
  links: string[];
  order: number;
  isReminderSent?: boolean;
}

export type NewItem = Omit<Item, "id" | "createdAt" | "updatedAt" | "completed" | "order"> &
  Partial<Pick<Item, "id" | "createdAt" | "updatedAt" | "completed" | "order">>;

export type ThemeName =
  | "system"
  | "paper"
  | "midnight"
  | "ocean"
  | "forest"
  | "lavender"
  | "sunset"
  | "rose"
  | "graphite"
  | "nordic"
  | "solar"
  | "monochrome";

export type FontFamilyName = "system" | "serif" | "mono";

export interface Settings {
  theme: ThemeName;
  fontFamily: FontFamilyName;
  fontSize: number;
  soundEnabled: boolean;
  soundVolume: number;
  hapticEnabled: boolean;
  reduceMotion: boolean;
  autoTimezone: boolean;
}