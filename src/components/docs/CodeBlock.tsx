import { useState, type ReactNode } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Minimal slash-command highlighter — the docs only show Discord commands,
 * not real code, so a ~20-line tokenizer beats pulling in shiki/prism.
 */
function Token({ part }: { part: string }) {
  if (part.startsWith("/")) {
    return <span className="font-semibold text-sky">{part}</span>;
  }
  const opt = part.match(/^(\[?)([\w-]+):(.*)$/);
  if (opt) {
    const [, bracket, name, rest] = opt;
    return (
      <span>
        {bracket && <span className="text-muted-foreground">{bracket}</span>}
        <span className="text-[#8b95ff]">{name}:</span>
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

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(children);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable (permissions/insecure context) — button just no-ops.
    }
  };

  return (
    <div className={cn("relative rounded-lg border border-border bg-code-bg", className)}>
      <pre className="overflow-x-auto px-4 py-3 pr-12 font-mono text-[13px] leading-relaxed text-code-fg">
        <code>{highlight(children)}</code>
      </pre>
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? "Copied" : "Copy command"}
        className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-md border border-border bg-background/60 text-muted-foreground transition-colors hover:text-foreground"
      >
        {copied ? (
          <Check className="h-3.5 w-3.5 text-emerald-500" />
        ) : (
          <Copy className="h-3.5 w-3.5" />
        )}
      </button>
    </div>
  );
}
