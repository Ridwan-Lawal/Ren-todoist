"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useTasks } from "@/hooks/use-tasks";
import { useToday } from "@/hooks/use-today";
import { recordNavigation } from "@/components/ui/back-link";
import { NoticeProvider } from "@/components/ui/notice";
import { APP_NAME } from "@/lib/config";
import { getTodayView } from "@/lib/tasks/task-views";

const NAV = [
  { href: "/", label: "Today", short: "Today" },
  { href: "/projects", label: "Projects", short: "Projects" },
  { href: "/tasks", label: "All Tasks", short: "Tasks" },
] as const;

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

/** Number of tasks on Today, shown beside the nav item; undefined while loading. */
function useTodayCount(): number | undefined {
  const tasks = useTasks();
  const today = useToday();
  if (tasks.status !== "ready" || !today) return undefined;
  const { overdue, dueToday, undated } = getTodayView(tasks.items, today);
  return overdue.length + dueToday.length + undated.length;
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const todayCount = useTodayCount();

  useEffect(() => {
    recordNavigation();
  }, [pathname]);

  return (
    <NoticeProvider>
      <div className="md:flex">
        <aside className="hidden md:block md:w-60 md:shrink-0">
          <nav aria-label="Primary" className="sticky top-0 flex h-dvh flex-col border-r border-border px-3 py-10">
            <Link href="/" className="mb-8 flex items-center gap-2 rounded-md px-3 py-1">
              <span aria-hidden className="size-2 rounded-full bg-accent" />
              <span className="text-lg font-semibold tracking-tight">{APP_NAME}</span>
            </Link>
            <ul className="flex flex-col gap-0.5">
              {NAV.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={`relative flex min-h-9 items-center justify-between rounded-md px-3 text-sm transition-colors duration-150 ${
                        active
                          ? "bg-subtle font-medium text-foreground before:absolute before:inset-y-2 before:left-0 before:w-0.5 before:rounded-full before:bg-accent"
                          : "text-muted hover:bg-subtle/70 hover:text-foreground"
                      }`}
                    >
                      {item.label}
                      {item.href === "/" && todayCount !== undefined && todayCount > 0 && (
                        <span className="text-meta tabular-nums text-muted">
                          {todayCount}
                          <span className="sr-only"> tasks</span>
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        <main className="mx-auto w-full max-w-2xl px-4 pb-28 pt-8 md:px-10 md:pb-20 md:pt-16">{children}</main>

        <nav
          aria-label="Primary"
          className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-surface pb-[env(safe-area-inset-bottom)] md:hidden"
        >
          <ul className="grid grid-cols-3">
            {NAV.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`relative flex h-14 items-center justify-center text-sm transition-colors duration-150 ${
                      active
                        ? "font-medium text-foreground before:absolute before:inset-x-8 before:top-0 before:h-0.5 before:rounded-full before:bg-accent"
                        : "text-muted active:text-foreground"
                    }`}
                  >
                    {item.short}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </NoticeProvider>
  );
}
