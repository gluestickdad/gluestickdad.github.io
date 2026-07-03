import { cn } from "@/lib/utils";

export type TocItem = {
  id: string;
  label: string;
  depth?: 2 | 3;
};

/** "On this page" anchor list; rendered SSR from explicit items (no DOM scanning). */
export function DocsToc({ items, showLabel = true }: { items: TocItem[]; showLabel?: boolean }) {
  return (
    <nav aria-label="On this page" className="text-sm">
      {showLabel && (
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          On this page
        </p>
      )}
      <ul className={cn("space-y-2 border-l border-border", showLabel && "mt-3")}>
        {items.map((t) => (
          <li key={t.id}>
            <a
              href={`#${t.id}`}
              className={cn(
                "-ml-px block border-l border-transparent pl-4 text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground",
                t.depth === 3 && "pl-7",
              )}
            >
              {t.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
