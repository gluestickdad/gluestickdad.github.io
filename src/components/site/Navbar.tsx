import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X, ExternalLink } from "lucide-react";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { Container } from "./Container";
import { Button } from "@/components/ui/button";
import { INVITE_URL, SUPPORT_URL, VOTE_URL } from "@/lib/links";

const navLinks = [
  { label: "Home", to: "/" as const, internal: true },
  { label: "Commands", to: "/commands" as const, internal: true },
  { label: "Docs", to: "/docs" as const, internal: true },
  { label: "Privacy", to: "/privacy" as const, internal: true },
  { label: "Terms", to: "/terms" as const, internal: true },
];

const externalLinks = [
  { label: "Support", href: SUPPORT_URL },
  { label: "Vote", href: VOTE_URL },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Hand-rolled disclosure, so Escape-to-close and focus restoration are wired
  // up here rather than coming free from Radix.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/70 backdrop-blur-xl">
      <Container className="flex h-16 items-center justify-between">
        <Logo />
        {/* Desktop nav switches on at lg, not md: seven links + the theme
            toggle + the CTA need ~886px, so between 768 and ~1000px the CTA
            was rendering past the right edge, cut off and unclickable. */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              activeProps={{ className: "text-foreground" }}
              inactiveProps={{ className: "text-muted-foreground hover:text-foreground" }}
              className="rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {l.label}
            </Link>
          ))}
          {externalLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors duration-150 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {l.label}
              <ExternalLink className="h-3 w-3" />
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-2 lg:flex">
          <ThemeToggle />
          <Button asChild>
            <a href={INVITE_URL} target="_blank" rel="noreferrer">
              Add to Your Server
            </a>
          </Button>
        </div>
        <div className="flex items-center gap-1 lg:hidden">
          <ThemeToggle />
          <button
            ref={triggerRef}
            aria-label="Toggle menu"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((s) => !s)}
            className="grid h-10 w-10 place-items-center rounded-lg text-foreground transition-colors duration-150 hover:bg-foreground/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </Container>
      {open && (
        <nav
          id="mobile-nav"
          aria-label="Mobile"
          className="border-t border-border bg-background/95 backdrop-blur-xl lg:hidden"
        >
          <Container className="flex flex-col gap-1 py-4">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors duration-150 hover:bg-foreground/5 hover:text-foreground"
              >
                {l.label}
              </Link>
            ))}
            {externalLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors duration-150 hover:bg-foreground/5 hover:text-foreground"
              >
                {l.label} <ExternalLink className="h-3 w-3" />
              </a>
            ))}
            <Button asChild className="mt-2">
              <a href={INVITE_URL} target="_blank" rel="noreferrer">
                Add to Your Server
              </a>
            </Button>
          </Container>
        </nav>
      )}
    </header>
  );
}
