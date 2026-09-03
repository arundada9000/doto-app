export interface StorageEstimate {
  usedBytes: number;
  quotaBytes: number;
  /** 0 to 1. Null when the browser will not report a quota. */
  ratio: number | null;
}

/** Warn once the device is this full, while there is still room to export. */
export const STORAGE_WARN_RATIO = 0.8;

export async function estimateStorage(): Promise<StorageEstimate | null> {
  if (typeof navigator === "undefined" || !navigator.storage?.estimate) {
    return null;
  }
  try {
    const { usage = 0, quota = 0 } = await navigator.storage.estimate();
    return {
      usedBytes: usage,
      quotaBytes: quota,
      ratio: quota > 0 ? usage / quota : null,
    };
  } catch {
    return null;
  }
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB"];
  let value = bytes / 1024;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${value < 10 ? value.toFixed(1) : Math.round(value)} ${units[unit]}`;
}
