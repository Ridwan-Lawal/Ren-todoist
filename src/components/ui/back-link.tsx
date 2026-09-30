"use client";

import { useRouter } from "next/navigation";

let inAppNavigations = 0;

/** Called by the app shell on every route change, so BackLink knows history is ours. */
export function recordNavigation() {
  inAppNavigations += 1;
}

/** Goes back to wherever the user came from; falls back to `href` when the page was opened directly. */
export function BackLink({ href }: { href: string }) {
  const router = useRouter();
  return (
    <a
      href={href}
      onClick={(event) => {
        if (inAppNavigations > 1) {
          event.preventDefault();
          router.back();
        }
      }}
      className="-ml-2 mb-4 inline-flex min-h-11 items-center gap-1.5 rounded-md px-2 text-sm text-muted transition-colors duration-150 hover:text-foreground md:mb-6"
    >
      <span aria-hidden>←</span> Back
    </a>
  );
}
