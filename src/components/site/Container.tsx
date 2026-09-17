import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * The page container. Navbar, Footer, every marketing section and the docs
 * shell all use this one width so content keeps a single left edge from the
 * top of the page to the bottom — previously sections ranged across
 * max-w-4xl/5xl/6xl/7xl and the alignment visibly drifted as you scrolled.
 *
 * Narrower measures nest INSIDE it and each have one job:
 *   MEASURE.panel  focal centred panels (the demo, the help card, final CTA)
 *   MEASURE.intro  centred section intro copy
 *   MEASURE.prose  long-form reading width (legal pages, docs articles)
 */
export const MEASURE = {
  panel: "mx-auto max-w-4xl",
  intro: "mx-auto max-w-2xl",
  prose: "max-w-[68ch]",
} as const;

/** Vertical rhythm for sections. 8pt scale — no other section paddings. */
export const SECTION = {
  /** Standard content section. */
  base: "py-16 lg:py-24",
  /** Short supporting band between two standard sections. */
  tight: "py-12 lg:py-16",
  /** Page hero. */
  hero: "pt-16 pb-20 lg:pt-24 lg:pb-28",
} as const;

export function Container({
  as: Tag = "div",
  className,
  children,
}: {
  as?: ElementType;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Tag className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)}>{children}</Tag>
  );
}
