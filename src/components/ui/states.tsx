import type { StorageErrorKind } from "@/lib/storage/local-storage";
import { Button } from "./button";

export function ListSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div aria-hidden className="space-y-5 py-2">
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
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="py-6">
      <p className="text-base font-medium">{title}</p>
      {description && <p className="mt-1 text-sm text-muted">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
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
      <p className="font-medium">We couldn&apos;t load your {what}.</p>
      <p className="mt-1 text-sm text-muted">
        {kind === "unreadable"
          ? "The saved data looks damaged. Starting fresh keeps a backup copy of it."
          : "Your browser isn't allowing this app to use storage right now."}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button variant="primary" onClick={onRetry}>
          Try again
        </Button>
        {kind === "unreadable" && <Button onClick={onStartFresh}>Start fresh</Button>}
      </div>
    </div>
  );
}

export function PageHeader({ title, subtitle, children }: { title: string; subtitle?: string; children?: React.ReactNode }) {
  return (
    <header className="mb-8">
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-[28px] font-semibold leading-tight tracking-tight md:text-[32px]">{title}</h1>
        {children}
      </div>
      {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
    </header>
  );
}

export function SectionHeading({ children, count }: { children: React.ReactNode; count?: number }) {
  return (
    <h2 className="mb-2 flex items-baseline gap-2 text-lg font-semibold">
      {children}
      {count !== undefined && <span className="text-sm font-normal text-muted">{count}</span>}
    </h2>
  );
}
