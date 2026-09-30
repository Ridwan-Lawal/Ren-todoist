"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NoticeProvider } from "@/components/ui/notice";
import { APP_NAME } from "@/lib/config";

const NAV = [
  { href: "/", label: "Today", short: "Today" },
  { href: "/projects", label: "Projects", short: "Projects" },
  { href: "/tasks", label: "All Tasks", short: "Tasks" },
] as const;

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <NoticeProvider>
      <div className="md:flex">
        <aside className="hidden md:block md:w-56 md:shrink-0">
          <nav
            aria-label="Primary"
            className="sticky top-0 flex h-dvh flex-col gap-1 border-r border-border px-4 py-8"
          >
            <p className="mb-6 px-3 text-lg font-semibold tracking-tight">{APP_NAME}</p>
            {NAV.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150 ${
                    active ? "bg-subtle text-accent" : "text-muted hover:bg-subtle hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="mx-auto w-full max-w-2xl px-4 pb-28 pt-8 md:px-8 md:pb-16 md:pt-14">{children}</main>

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
                    className={`flex h-14 items-center justify-center text-sm font-medium ${
                      active ? "text-accent" : "text-muted"
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
