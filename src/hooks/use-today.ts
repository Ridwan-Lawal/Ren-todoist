"use client";

import { useSyncExternalStore } from "react";
import { toDateKey } from "@/lib/utils/dates";

/** Re-evaluates when the tab becomes visible again and at the next local midnight. */
function subscribe(onChange: () => void) {
  let timer: ReturnType<typeof setTimeout>;
  const scheduleMidnight = () => {
    const now = new Date();
    const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    timer = setTimeout(() => {
      onChange();
      scheduleMidnight();
    }, midnight.getTime() - now.getTime() + 1000);
  };
  const onVisibility = () => {
    if (document.visibilityState === "visible") onChange();
  };

  scheduleMidnight();
  document.addEventListener("visibilitychange", onVisibility);
  return () => {
    clearTimeout(timer);
    document.removeEventListener("visibilitychange", onVisibility);
  };
}

/** The current local date as `YYYY-MM-DD`, or "" during server rendering. */
export function useToday(): string {
  return useSyncExternalStore(
    subscribe,
    () => toDateKey(new Date()),
    () => "",
  );
}
