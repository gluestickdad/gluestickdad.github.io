import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Anchor-linkable docs heading. `scroll-mt-24` keeps the target clear of the
 * sticky navbar when jumped to from the TOC or a shared link.
 */
export function DocsHeading({
  id,
  level = 2,
  children,
  className,
}: {
  id: string;
  level?: 2 | 3;
  children: ReactNode;
  className?: string;
}) {
  const Tag = level === 2 ? "h2" : "h3";
  return (
    <Tag
      id={id}
      className={cn(
        "group scroll-mt-24 font-semibold text-foreground",
        level === 2 ? "mt-12 text-2xl" : "mt-8 text-lg",
        className,
      )}
    >
      {children}
      <a
        href={`#${id}`}
        aria-label="Link to section"
        className="ml-2 text-muted-foreground/0 transition-colors group-hover:text-muted-foreground hover:!text-sky focus-visible:text-muted-foreground"
      >
        #
      </a>
    </Tag>
  );
}
