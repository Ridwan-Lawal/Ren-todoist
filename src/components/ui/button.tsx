import { ComponentProps } from "react";

type Variant = "primary" | "secondary" | "ghost" | "destructive";
type Size = "md" | "sm";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-accent text-white hover:bg-accent-hover",
  secondary:
    "border border-border bg-surface text-foreground hover:bg-subtle aria-pressed:border-accent aria-pressed:text-accent",
  ghost: "text-muted hover:bg-subtle hover:text-foreground",
  destructive: "border border-border bg-surface text-danger hover:border-danger/40 hover:bg-danger/5",
};

const SIZES: Record<Size, string> = {
  md: "min-h-11 px-4 text-sm",
  sm: "min-h-9 px-3 text-sm",
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
