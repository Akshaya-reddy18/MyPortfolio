import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AppFrameProps {
  children: ReactNode;
  className?: string;
}

/** Scrollable app body wrapper */
export function AppFrame({ children, className }: AppFrameProps) {
  return (
    <div className={cn("app-frame", className)}>
      {children}
    </div>
  );
}

interface AppSectionProps {
  title: string;
  eyebrow?: string;
  children: ReactNode;
  className?: string;
}

export function AppSection({ title, eyebrow, children, className }: AppSectionProps) {
  return (
    <section className={cn("app-section", className)}>
      {eyebrow && <p className="app-section__eyebrow">{eyebrow}</p>}
      <h2 className="app-section__title">{title}</h2>
      <div className="app-section__body">{children}</div>
    </section>
  );
}

interface AppCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  active?: boolean;
}

export function AppCard({ children, className, onClick, active }: AppCardProps) {
  const Tag = onClick ? "button" : "div";
  return (
    <Tag
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={cn(
        "app-card akshaya-glass-subtle",
        onClick && "app-card--interactive akshaya-focus-ring",
        active && "app-card--active",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

interface TagListProps {
  items: string[];
  variant?: "blue" | "purple" | "cyan";
  className?: string;
}

export function TagList({ items, variant = "blue", className }: TagListProps) {
  return (
    <ul className={cn("app-tag-list", className)}>
      {items.map((item) => (
        <li key={item} className={cn("app-tag", `app-tag--${variant}`)}>
          {item}
        </li>
      ))}
    </ul>
  );
}

interface AppEmptyProps {
  message: string;
}

export function AppEmpty({ message }: AppEmptyProps) {
  return (
    <div className="app-empty">
      <p className="akshaya-type-body-sm">{message}</p>
    </div>
  );
}
