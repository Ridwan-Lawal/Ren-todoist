"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { StorageError } from "@/lib/storage/local-storage";

type Notify = (message: string) => void;

const NoticeContext = createContext<Notify>(() => {});
const AnnounceContext = createContext<Notify>(() => {});

/** Announces a message to screen readers without showing anything. */
export function useAnnounce() {
  return useContext(AnnounceContext);
}

/** A single calm, polite status message at the bottom of the screen. */
export function NoticeProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const notify = useCallback<Notify>((text) => {
    setMessage(text);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setMessage(null), 5000);
  }, []);

  useEffect(() => () => clearTimeout(timer.current), []);

  const announce = useCallback<Notify>((text) => {
    // Clearing first makes repeated identical messages announce again.
    setAnnouncement("");
    requestAnimationFrame(() => setAnnouncement(text));
  }, []);

  return (
    <NoticeContext.Provider value={notify}>
      <AnnounceContext.Provider value={announce}>
        {children}
        <p role="status" aria-live="polite" className="sr-only">
          {announcement}
        </p>
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
      </AnnounceContext.Provider>
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
