import { ComponentProps } from "react";

type Variant = "primary" | "secondary" | "ghost" | "destructive" | "ghost-destructive";
type Size = "md" | "sm";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-accent text-white hover:bg-accent-hover active:bg-accent-hover/90",
  secondary:
    "border border-border bg-surface text-foreground hover:bg-subtle active:bg-border/60 aria-pressed:border-accent aria-pressed:text-accent",
  ghost: "text-muted hover:bg-subtle hover:text-foreground active:bg-border/60",
  "ghost-destructive": "text-danger/90 hover:bg-danger/5 hover:text-danger active:bg-danger/10",
  destructive: "border border-border bg-surface text-danger hover:border-danger/40 hover:bg-danger/5 active:bg-danger/10",
};

const SIZES: Record<Size, string> = {
  md: "min-h-11 px-4 text-sm",
  sm: "min-h-11 px-3 text-sm md:min-h-9",
};

export function buttonClasses(variant: Variant = "secondary", size: Size = "md") {
  return `inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors duration-150 disabled:pointer-events-none disabled:opacity-50 ${VARIANTS[variant]} ${SIZES[size]}`;
}

export function Button({
  variant = "secondary",
  size = "md",
  className = "",
  type = "button",
  ...props
}: ComponentProps<"button"> & { variant?: Variant; size?: Size }) {
  return <button type={type} className={`${buttonClasses(variant, size)} ${className}`} {...props} />;
}
