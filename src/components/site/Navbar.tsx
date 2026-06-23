import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X, ExternalLink } from "lucide-react";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { INVITE_URL, SUPPORT_URL, VOTE_URL } from "@/lib/links";

const navLinks = [
  { label: "Home", to: "/" as const, internal: true },
  { label: "Commands", to: "/commands" as const, internal: true },
  { label: "Privacy", to: "/privacy" as const, internal: true },
  { label: "Terms", to: "/terms" as const, internal: true },
];

const externalLinks = [
  { label: "Support", href: SUPPORT_URL },
  { label: "Vote", href: VOTE_URL },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              activeProps={{ className: "text-foreground" }}
              inactiveProps={{ className: "text-muted-foreground hover:text-foreground" }}
              className="rounded-md px-3 py-2 text-sm font-medium transition-colors"
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
              className="inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
              <ExternalLink className="h-3 w-3" />
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          <a
            href={INVITE_URL}
            target="_blank"
            rel="noreferrer"
            className="btn-glow inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#5865F2] to-[#66C2FF] px-5 py-2 text-sm font-semibold text-white transition-transform hover:scale-[1.03]"
          >
            Add to Your Server
          </a>
        </div>
        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <button
            aria-label="Toggle menu"
            onClick={() => setOpen((s) => !s)}
            className="grid h-10 w-10 place-items-center rounded-md text-foreground hover:bg-foreground/5"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-border bg-background/95 backdrop-blur-xl md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4 sm:px-6">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
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
                className="inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
              >
                {l.label} <ExternalLink className="h-3 w-3" />
              </a>
            ))}
            <a
              href={INVITE_URL}
              target="_blank"
              rel="noreferrer"
              className="btn-glow mt-2 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#5865F2] to-[#66C2FF] px-5 py-2.5 text-sm font-semibold text-white"
            >
              Add to Your Server
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
