import { nanoid } from "nanoid";
import { itemsTable, settingsTable } from "@/lib/db";
import { useItemsStore } from "@/lib/stores/itemsStore";
import type { Item, Settings, Attachment } from "@/types";

export interface SerializedAttachment
  extends Omit<Attachment, "data"> {
  data: string;
}

export interface ExportItem extends Omit<Item, "attachments"> {
  attachments: SerializedAttachment[];
}

export interface ExportFile {
  app: "doto";
  version: 1;
  exportedAt: number;
  items: ExportItem[];
  settings: Settings | null;
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

function base64ToBlob(dataUrl: string, fallbackType: string): Blob {
  const [meta, base64] = dataUrl.split(",");
  const mime = /data:([^;]+)/.exec(meta ?? "")?.[1] ?? fallbackType;
  const binary = atob(base64 ?? "");
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}

export async function buildExport(): Promise<ExportFile> {
  const items = await itemsTable.orderBy("order").toArray();
  const settingsRow = await settingsTable.get("settings");

  return {
    app: "doto",
    version: 1,
    exportedAt: Date.now(),
    items: await Promise.all(
      items.map(async (item) => ({ ...item, attachments: await encodeAttachments(item.attachments ?? []) }))
    ),
    settings: settingsRow?.value ?? null,
  };
}

async function encodeAttachments(
  attachments: Attachment[]
): Promise<SerializedAttachment[]> {
  return Promise.all(
    attachments.map(async (a) => ({ ...a, data: await blobToBase64(a.data) }))
  );
}

function decodeAttachments(attachments: SerializedAttachment[]): Attachment[] {
  return (attachments ?? []).map((a) => {
    const data = a.data;
    return {
      ...a,
      data: base64ToBlob(data, a.type),
    };
  });
}

export function downloadExport(data: ExportFile) {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `doto-backup-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function parseImport(text: string): ExportFile | null {
  try {
    const data = JSON.parse(text) as ExportFile;
    if (data?.app !== "doto" || !Array.isArray(data.items)) return null;
    return data;
  } catch {
    return null;
  }
}

export async function applyImport(data: ExportFile) {
  const items: Item[] = data.items.map((item) => ({
    ...item,
    attachments: decodeAttachments(item.attachments ?? []),
  }));
  await useItemsStore.getState().replaceAll(items);

  if (data.settings) {
    await settingsTable.put({ key: "settings", value: data.settings });
  }
}

export async function wipeAllData() {
  await itemsTable.clear();
  await settingsTable.clear();
  await useItemsStore.getState().clearAll();
}

export function mergeMissingItemIds(items: Item[]): Item[] {
  return items.map((item) => (item.id ? item : { ...item, id: nanoid() }));
}