import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { DocsPager } from "./DocsPager";
import { DocsToc, type TocItem } from "./DocsToc";

/**
 * Body-copy defaults for docs prose, mirroring LegalLayout. Inline `code` is
 * scoped with :not(pre)>code so CodeBlock's <pre><code> is left alone; links
 * are styled explicitly at the call site, not here.
 */
const PROSE =
  "mt-8 text-[15px] leading-relaxed text-foreground/85 [&_p]:mt-3 " +
  "[&_ul]:mt-3 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-6 " +
  "[&_ol]:mt-3 [&_ol]:list-decimal [&_ol]:space-y-1.5 [&_ol]:pl-6 " +
  "[&_strong]:text-foreground " +
  "[&_:not(pre)>code]:rounded [&_:not(pre)>code]:bg-code-bg [&_:not(pre)>code]:px-1.5 " +
  "[&_:not(pre)>code]:py-0.5 [&_:not(pre)>code]:font-mono [&_:not(pre)>code]:text-[0.85em] " +
  "[&_:not(pre)>code]:text-code-fg";

/** Standard docs article: h1 + lede, optional TOC (inline < xl, right rail ≥ xl), pager. */
export function DocsPage({
  title,
  lede,
  toc,
  children,
}: {
  title: string;
  lede?: string;
  toc?: TocItem[];
  children: ReactNode;
}) {
  const hasToc = toc !== undefined && toc.length > 0;
  return (
    <div className="flex gap-10">
      <article className="min-w-0 flex-1">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
        {lede && <p className="mt-3 max-w-2xl text-lg text-muted-foreground">{lede}</p>}
        {hasToc && (
          <Collapsible className="mt-6 rounded-lg border border-border xl:hidden">
            <CollapsibleTrigger className="flex w-full items-center justify-between px-4 py-2.5 text-sm font-medium text-foreground [&[data-state=open]>svg]:rotate-180">
              On this page
              <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform" />
            </CollapsibleTrigger>
            <CollapsibleContent className="border-t border-border px-4 py-3">
              <DocsToc items={toc} showLabel={false} />
            </CollapsibleContent>
          </Collapsible>
        )}
        <div className={PROSE}>{children}</div>
        <DocsPager />
      </article>
      {hasToc && (
        <aside className="hidden w-52 shrink-0 xl:block">
          <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
            <DocsToc items={toc} />
          </div>
        </aside>
      )}
    </div>
  );
}
