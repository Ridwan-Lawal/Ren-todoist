"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { StorageError } from "@/lib/storage/local-storage";

type Notify = (message: string) => void;

const NoticeContext = createContext<Notify>(() => {});

/** A single calm, polite status message at the bottom of the screen. */
export function NoticeProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const notify = useCallback<Notify>((text) => {
    setMessage(text);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setMessage(null), 5000);
  }, []);

  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <NoticeContext.Provider value={notify}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-20 z-40 flex justify-center px-4 md:bottom-6"
      >
        {message && (
          <p className="animate-enter pointer-events-auto rounded-md bg-foreground px-4 py-3 text-sm text-surface shadow-popover">
            {message}
          </p>
        )}
      </div>
    </NoticeContext.Provider>
  );
}

/**
 * Runs a task/project operation and turns storage failures into a calm
 * message instead of an exception. Returns undefined when the action failed.
 */
export function useSafeAction() {
  const notify = useContext(NoticeContext);
  return useCallback(
    <T,>(action: () => T, failure = "We couldn't save this change. Try again."): T | undefined => {
      try {
        return action();
      } catch (error) {
        if (error instanceof StorageError) notify(failure);
        else if ((error as { reason?: string }).reason === "not-found") notify("That item is no longer available.");
        else throw error;
        return undefined;
      }
    },
    [notify],
  );
}
