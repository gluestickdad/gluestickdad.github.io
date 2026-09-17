import { Link } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";
import { Logo } from "./Logo";
import { Container } from "./Container";
import { SUPPORT_URL, VOTE_URL, INVITE_URL } from "@/lib/links";

const linkClass =
  "rounded-sm text-muted-foreground transition-colors duration-150 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background/60">
      <Container className="py-12 lg:py-16">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <Logo />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Glue Stick keeps your most important Discord messages glued to the bottom of the
              channel — always visible, never lost in the scroll.
            </p>
            {/* The site's one contact route — given its own line rather than
                sitting undifferentiated in the legal list. */}
            <a
              href={SUPPORT_URL}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-lg border border-border bg-foreground/5 px-3 py-2 text-sm font-medium text-foreground transition-colors duration-150 hover:bg-foreground/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <MessageCircle className="h-4 w-4 text-accent-strong" />
              Questions? Ask in our Discord
            </a>
          </div>
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Product
            </h2>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link to="/commands" className={linkClass}>
                  Commands
                </Link>
              </li>
              <li>
                <Link to="/docs" className={linkClass}>
                  Docs
                </Link>
              </li>
              <li>
                <a href={INVITE_URL} target="_blank" rel="noreferrer" className={linkClass}>
                  Invite
                </a>
              </li>
              <li>
                <a href={VOTE_URL} target="_blank" rel="noreferrer" className={linkClass}>
                  Vote for Us
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Legal & Support
            </h2>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link to="/privacy" className={linkClass}>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className={linkClass}>
                  Terms of Service
                </Link>
              </li>
              <li>
                <a href={SUPPORT_URL} target="_blank" rel="noreferrer" className={linkClass}>
                  Support Server
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Glue Stick. All rights reserved.
        </div>
      </Container>
    </footer>
  );
}
