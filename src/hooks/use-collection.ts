"use client";

import { useSyncExternalStore } from "react";
import { StorageError, StorageErrorKind, subscribe } from "@/lib/storage/local-storage";

export type CollectionState<T> =
  | { status: "loading" }
  | { status: "ready"; items: T[] }
  | { status: "error"; kind: StorageErrorKind };

const LOADING = { status: "loading" } as const;

/**
 * Builds a hook that reads a collection through its service and re-renders on
 * any change (this tab or another). Snapshots are memoized so unchanged data
 * keeps the same reference.
 */
export function createCollectionHook<T>(read: () => T[]) {
  let lastItems: T[] | undefined;
  let lastReady: CollectionState<T> = LOADING;
  const errors = new Map<StorageErrorKind, CollectionState<T>>();

  function getSnapshot(): CollectionState<T> {
    try {
      const items = read();
      if (items !== lastItems) {
        lastItems = items;
        lastReady = { status: "ready", items };
      }
      return lastReady;
    } catch (error) {
      const kind = error instanceof StorageError ? error.kind : "unreadable";
      if (!errors.has(kind)) errors.set(kind, { status: "error", kind });
      return errors.get(kind)!;
    }
  }

  return function useCollection(): CollectionState<T> {
    return useSyncExternalStore(subscribe, getSnapshot, () => LOADING);
  };
}
