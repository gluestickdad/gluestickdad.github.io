import { Link } from "@tanstack/react-router";
import { DOCS_NAV } from "@/lib/docs/nav";

/** Docs section nav; `onNavigate` lets the mobile sheet close itself on click. */
export function DocsSidebar({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav aria-label="Docs sections" className="space-y-6">
      {DOCS_NAV.map((section) => (
        <div key={section.label}>
          <p className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {section.label}
          </p>
          <ul className="mt-2 space-y-0.5">
            {section.pages.map((page) => (
              <li key={page.to}>
                <Link
                  to={page.to}
                  onClick={onNavigate}
                  activeOptions={{ exact: page.to === "/docs" }}
                  activeProps={{ className: "bg-foreground/10 text-foreground" }}
                  inactiveProps={{
                    className: "text-muted-foreground hover:bg-foreground/5 hover:text-foreground",
                  }}
                  className="block rounded-md px-3 py-1.5 text-sm font-medium transition-colors"
                >
                  {page.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}
