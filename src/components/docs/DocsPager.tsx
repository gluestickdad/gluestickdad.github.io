import { Link, useLocation } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { DOCS_PAGES } from "@/lib/docs/nav";

/** Previous/next page footer, derived from the sidebar order. */
export function DocsPager() {
  const pathname = useLocation({ select: (l) => l.pathname });
  const normalized = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  const idx = DOCS_PAGES.findIndex((p) => p.to === normalized);
  if (idx === -1) return null;

  const prev = idx > 0 ? DOCS_PAGES[idx - 1] : undefined;
  const next = idx < DOCS_PAGES.length - 1 ? DOCS_PAGES[idx + 1] : undefined;

  return (
    <nav
      aria-label="Docs pages"
      className="mt-14 flex flex-wrap justify-between gap-3 border-t border-border pt-6"
    >
      {prev ? (
        <Link
          to={prev.to}
          className="group inline-flex items-center gap-2 rounded-lg border border-border px-4 py-3 text-sm transition-colors hover:bg-foreground/5"
        >
          <ArrowLeft className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-x-0.5" />
          <span>
            <span className="block text-xs text-muted-foreground">Previous</span>
            <span className="font-medium text-foreground">{prev.title}</span>
          </span>
        </Link>
      ) : (
        <span />
      )}
      {next && (
        <Link
          to={next.to}
          className="group inline-flex items-center gap-2 rounded-lg border border-border px-4 py-3 text-right text-sm transition-colors hover:bg-foreground/5"
        >
          <span>
            <span className="block text-xs text-muted-foreground">Next</span>
            <span className="font-medium text-foreground">{next.title}</span>
          </span>
          <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </nav>
  );
}
