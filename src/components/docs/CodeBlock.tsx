import { useEffect, useRef, useState, type ReactNode } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Minimal slash-command highlighter — the docs only show Discord commands,
 * not real code, so a ~20-line tokenizer beats pulling in shiki/prism.
 */
function Token({ part }: { part: string }) {
  if (part.startsWith("/")) {
    return <span className="font-semibold text-accent-strong">{part}</span>;
  }
  const opt = part.match(/^(\[?)([\w-]+):(.*)$/);
  if (opt) {
    const [, bracket, name, rest] = opt;
    return (
      <span>
        {bracket && <span className="text-muted-foreground">{bracket}</span>}
        {/* Option names read as neutral-strong rather than a second accent hue:
            the command itself already owns the blurple. */}
        <span className="font-medium text-foreground">{name}:</span>
        <span
          className={rest.startsWith("<") ? "italic text-muted-foreground" : "text-foreground/85"}
        >
          {rest}
        </span>
      </span>
    );
  }
  if (/^[[<]/.test(part)) {
    return <span className="italic text-muted-foreground">{part}</span>;
  }
  return <span className="text-foreground/85">{part}</span>;
}

function highlight(command: string): ReactNode[] {
  return command
    .split(/(\s+)/)
    .map((part, i) => (/^\s+$/.test(part) ? part : <Token key={i} part={part} />));
}

/** Command block with syntax tinting and a copy-to-clipboard button. */
export function CodeBlock({ children, className }: { children: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  const resetRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clear on unmount, and before re-arming, so a rapid second click doesn't get
  // its "Copied" state cancelled early by the first click's timer.
  useEffect(() => () => clearTimeout(resetRef.current ?? undefined), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(children);
      setCopied(true);
      clearTimeout(resetRef.current ?? undefined);
      resetRef.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable (permissions/insecure context) — button just no-ops.
    }
  };

  return (
    <div className={cn("relative rounded-lg border border-border bg-code-bg", className)}>
      {/* tabIndex: a long command scrolls horizontally, so keyboard users need
          to be able to focus the box to scroll it (WCAG 2.1.1). */}
      <pre
        tabIndex={0}
        className="overflow-x-auto px-4 py-3 pr-12 font-mono text-[13px] leading-relaxed text-code-fg"
      >
        <code>{highlight(children)}</code>
      </pre>
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? "Copied" : "Copy command"}
        className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-md border border-border bg-background/60 text-muted-foreground transition-colors hover:text-foreground"
      >
        {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
      </button>
      {/* The aria-label change alone isn't announced, since focus doesn't move. */}
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? "Copied to clipboard" : ""}
      </span>
    </div>
  );
}
