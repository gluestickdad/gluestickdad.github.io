import { useNavigate } from "@tanstack/react-router";
import { BookOpen, CircleHelp, SlashSquare } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { COMMAND_DOCS } from "@/lib/docs/commands";
import { FAQ_ITEMS } from "@/lib/docs/faq";
import { DOCS_PAGES, type DocsPage } from "@/lib/docs/nav";

/**
 * Client-side docs search (Ctrl/Cmd+K). cmdk fuzzy-matches over a static
 * index: docs pages, the command reference, and FAQ entries.
 */
export function DocsSearch({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const navigate = useNavigate();

  const go = (to: DocsPage["to"], hash?: string) => {
    onOpenChange(false);
    void navigate({ to, hash });
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search docs…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Pages">
          {DOCS_PAGES.map((p) => (
            <CommandItem key={p.to} value={`${p.title} ${p.description}`} onSelect={() => go(p.to)}>
              <BookOpen />
              <span>
                <span className="font-medium">{p.title}</span>
                <span className="ml-2 text-xs text-muted-foreground">{p.description}</span>
              </span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Commands">
          {COMMAND_DOCS.map((c) => (
            <CommandItem
              key={c.slug}
              value={`${c.name} ${c.summary}`}
              onSelect={() => go("/docs/commands", c.slug)}
            >
              <SlashSquare />
              <span>
                <span className="font-mono font-medium">{c.name}</span>
                <span className="ml-2 text-xs text-muted-foreground">{c.summary}</span>
              </span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="FAQ">
          {FAQ_ITEMS.map((f) => (
            <CommandItem
              key={f.slug}
              value={`${f.question} ${f.plain}`}
              onSelect={() => go("/docs/faq", f.slug)}
            >
              <CircleHelp />
              <span>{f.question}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
