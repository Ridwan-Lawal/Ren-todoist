import type { StorageErrorKind } from "@/lib/storage/local-storage";
import { Button } from "./button";

export function ListSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div aria-hidden className="space-y-6 py-2">
      <div className="h-8 w-40 rounded-sm bg-subtle" />
      <div className="h-14 rounded-lg bg-subtle" />
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex gap-3">
          <div className="size-5 rounded-full bg-subtle" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-2/3 rounded-sm bg-subtle" />
            <div className="h-3 w-1/4 rounded-sm bg-subtle" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function EmptyState({
  title,
  description,
  hint,
  action,
}: {
  title: string;
  description?: string;
  /** Optional example, shown in a quiet monospace line. */
  hint?: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="animate-enter border-t border-border py-10">
      <p className="text-section font-semibold">{title}</p>
      {description && <p className="mt-1 max-w-sm text-body text-muted">{description}</p>}
      {hint && <p className="mt-4 text-meta text-muted">{hint}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function LoadError({
  what,
  kind,
  onRetry,
  onStartFresh,
}: {
  what: string;
  kind: StorageErrorKind;
  onRetry: () => void;
  onStartFresh: () => void;
}) {
  return (
    <div role="alert" className="rounded-lg border border-border bg-surface p-6">
      <p className="text-section font-semibold">We couldn&apos;t load your {what}.</p>
      <p className="mt-1 text-body text-muted">
        {kind === "unreadable"
          ? "The saved data looks damaged. Starting fresh keeps a backup copy of it."
          : "Your browser isn't allowing this app to use storage right now."}
      </p>
      <div className="mt-6 flex flex-wrap gap-2">
        <Button variant="primary" onClick={onRetry}>
          Try again
        </Button>
        {kind === "unreadable" && <Button onClick={onStartFresh}>Start fresh</Button>}
      </div>
    </div>
  );
}

/** Page title with an optional quiet line beneath and actions aligned right. */
export function PageHeader({
  title,
  meta,
  actions,
}: {
  title: React.ReactNode;
  meta?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <header className="mb-8 flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
      <div className="min-w-0">
        <h1 className="break-words text-page font-semibold">{title}</h1>
        {meta && <p className="mt-1.5 text-sm text-muted">{meta}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
    </header>
  );
}

/** Heading for a secondary section of a page (Completed, Upcoming). */
export function SectionHeading({ id, children, count }: { id?: string; children: React.ReactNode; count?: number }) {
  return (
    <h2 id={id} className="flex items-baseline gap-2 text-section font-semibold">
      {children}
      {count !== undefined && <span className="text-sm font-normal text-muted">{count}</span>}
    </h2>
  );
}

/** Small uppercase label above a group of tasks (Overdue, Today, No date). */
export function GroupLabel({ id, children, tone = "muted" }: { id?: string; children: React.ReactNode; tone?: "muted" | "danger" }) {
  return (
    <h3
      id={id}
      className={`mb-1 text-label font-semibold uppercase ${tone === "danger" ? "text-danger" : "text-muted"}`}
    >
      {children}
    </h3>
  );
}
