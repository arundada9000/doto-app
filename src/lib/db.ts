import Dexie, { type Table } from "dexie";
import type { Item, Settings } from "@/types";

const DB_NAME = "doto-db";
const DB_VERSION = 1;

export interface SettingsRow {
  key: string;
  value: Settings;
}

const db = new Dexie(DB_NAME);

db.version(DB_VERSION).stores({
  items:
    "id, type, completed, createdAt, updatedAt, dueAt, *tags, order",
  settings: "key",
});

export const itemsTable: Table<Item, string> = db.table("items");
export const settingsTable: Table<SettingsRow, string> = db.table("settings");

export default db;
