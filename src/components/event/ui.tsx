import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Badge({
  tone = "green",
  children,
  className,
}: {
  tone?: "green" | "yellow" | "gray";
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
        tone === "green" && "bg-accent text-accent-foreground",
        tone === "yellow" && "bg-warning-soft text-warning",
        tone === "gray" && "bg-surface-alt text-muted-foreground",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Section({
  children,
  alt = false,
  className,
}: {
  children: ReactNode;
  alt?: boolean;
  className?: string;
}) {
  return (
    <section className={cn("px-4 py-12 sm:px-6 sm:py-16", alt && "bg-surface-alt", className)}>
      <div className="mx-auto w-full max-w-5xl">{children}</div>
    </section>
  );
}

export function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="mb-8 max-w-2xl">
      <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{title}</h2>
      {subtitle ? <p className="mt-2 text-sm text-muted-foreground sm:text-base">{subtitle}</p> : null}
    </header>
  );
}

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

export const buttonStyles = {
  solid: cn(base, "bg-primary text-primary-foreground hover:bg-primary/90"),
  outline: cn(base, "border border-border bg-background text-accent-foreground hover:bg-accent/60"),
  ghost: cn(base, "border border-border bg-background text-foreground hover:bg-surface-alt"),
  disabled: cn(base, "cursor-not-allowed border border-border bg-surface-alt text-text-tertiary"),
};

export function ActionLink({
  href,
  variant = "solid",
  disabled,
  children,
  className,
}: {
  href: string;
  variant?: keyof typeof buttonStyles;
  disabled?: boolean;
  children: ReactNode;
  className?: string;
}) {
  if (disabled) {
    return (
      <span aria-disabled="true" className={cn(buttonStyles.disabled, className)}>
        {children}
      </span>
    );
  }
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noreferrer" : undefined}
      className={cn(buttonStyles[variant], className)}
    >
      {children}
    </a>
  );
}