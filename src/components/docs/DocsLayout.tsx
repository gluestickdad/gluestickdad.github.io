import { useEffect, useState, type ReactNode } from "react";
import { PanelLeft, Search } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { DocsSearch } from "./DocsSearch";
import { DocsSidebar } from "./DocsSidebar";

function SearchButton({ onOpen, className }: { onOpen: () => void; className?: string }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className={cn(
        "flex items-center gap-2 rounded-lg border border-border bg-foreground/5 px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground",
        className,
      )}
    >
      <Search className="h-3.5 w-3.5" />
      <span>Search docs…</span>
      <kbd className="ml-auto rounded border border-border bg-background px-1.5 font-mono text-[10px] text-muted-foreground">
        Ctrl K
      </kbd>
    </button>
  );
}

/**
 * Shell for every /docs page: sticky sidebar on desktop, a slide-over sheet on
 * mobile, and the Ctrl/Cmd+K search dialog.
 */
export function DocsLayout({ children }: { children: ReactNode }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Mobile docs bar, stuck just below the h-16 main navbar */}
      <div className="sticky top-16 z-40 -mx-4 flex items-center gap-2 border-b border-border bg-background/80 px-4 py-2 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:hidden">
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger
            aria-label="Open docs navigation"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-foreground/5 px-3 py-2 text-sm font-medium text-foreground"
          >
            <PanelLeft className="h-4 w-4" />
            Menu
          </SheetTrigger>
          <SheetContent side="left" className="w-72 overflow-y-auto">
            <SheetHeader className="text-left">
              <SheetTitle>Documentation</SheetTitle>
            </SheetHeader>
            <div className="mt-4">
              <DocsSidebar onNavigate={() => setSidebarOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>
        <SearchButton onOpen={() => setSearchOpen(true)} className="flex-1" />
      </div>

      <div className="flex gap-8 py-10 lg:py-14">
        <aside className="hidden w-60 shrink-0 lg:block">
          <div className="sticky top-24 max-h-[calc(100vh-8rem)] space-y-5 overflow-y-auto pb-4">
            <SearchButton onOpen={() => setSearchOpen(true)} className="w-full" />
            <DocsSidebar />
          </div>
        </aside>
        <div className="min-w-0 flex-1">{children}</div>
      </div>

      <DocsSearch open={searchOpen} onOpenChange={setSearchOpen} />
    </div>
  );
}
