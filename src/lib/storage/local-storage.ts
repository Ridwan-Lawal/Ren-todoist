import { z } from "zod";

export const STORAGE_KEYS = {
  tasks: "todo-app:tasks",
  projects: "todo-app:projects",
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

export type StorageErrorKind = "unreadable" | "unavailable" | "write-failed";

export class StorageError extends Error {
  constructor(readonly kind: StorageErrorKind) {
    super(`Storage error: ${kind}`);
    this.name = "StorageError";
  }
}

const backupKey = (key: StorageKey) => `${key}:backup`;

// Parsed values are cached by their raw string so repeated reads of unchanged
// data return the same array reference (required by useSyncExternalStore).
const cache = new Map<StorageKey, { raw: string | null; data: unknown[] }>();

function getStorage(): Storage {
  try {
    return window.localStorage;
  } catch {
    throw new StorageError("unavailable");
  }
}

export function readCollection<T>(key: StorageKey, schema: z.ZodType<T>): T[] {
  const storage = getStorage();
  let raw: string | null;
  try {
    raw = storage.getItem(key);
  } catch {
    throw new StorageError("unavailable");
  }

  const cached = cache.get(key);
  if (cached && cached.raw === raw) return cached.data as T[];

  let data: T[];
  if (raw === null) {
    data = [];
  } else {
    let json: unknown;
    try {
      json = JSON.parse(raw);
    } catch {
      throw new StorageError("unreadable");
    }
    const result = z.array(schema).safeParse(json);
    if (!result.success) throw new StorageError("unreadable");
    data = result.data;
  }

  cache.set(key, { raw, data });
  return data;
}

export function writeCollection<T>(key: StorageKey, items: T[]): void {
  const storage = getStorage();
  const raw = JSON.stringify(items);
  try {
    storage.setItem(key, raw);
  } catch {
    throw new StorageError("write-failed");
  }
  cache.set(key, { raw, data: items });
  notify();
}

/** Copies an unreadable value to its backup key, then resets the collection. */
export function backupAndReset(key: StorageKey): void {
  const storage = getStorage();
  try {
    const raw = storage.getItem(key);
    if (raw !== null) storage.setItem(backupKey(key), raw);
    storage.removeItem(key);
  } catch {
    throw new StorageError("write-failed");
  }
  cache.delete(key);
  notify();
}

type Listener = () => void;
const listeners = new Set<Listener>();

function notify() {
  listeners.forEach((listener) => listener());
}

function handleStorageEvent(event: StorageEvent) {
  if (event.key === null || Object.values(STORAGE_KEYS).includes(event.key as StorageKey)) {
    notify();
  }
}

/** Subscribes to changes from this tab and from other tabs. */
export function subscribe(listener: Listener): () => void {
  if (listeners.size === 0) window.addEventListener("storage", handleStorageEvent);
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.removeEventListener("storage", handleStorageEvent);
  };
}
