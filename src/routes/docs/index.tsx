import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { DocsPage } from "@/components/docs/DocsPage";
import { INVITE_URL } from "@/lib/links";
import { DOCS_NAV } from "@/lib/docs/nav";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/docs/")({
  head: () =>
    seo({
      title: "Documentation — Glue Stick",
      description:
        "Everything you need to set up and use Glue Stick: getting started, the full command reference, permissions, configuration, and troubleshooting.",
      path: "/docs",
    }),
  component: DocsIndex,
});

function DocsIndex() {
  return (
    <DocsPage
      title="Documentation"
      lede="Everything you need to set up and use Glue Stick — from your first glued message to fine-tuning how it refreshes."
    >
      <p>
        Glue Stick keeps one message <strong>glued to the bottom of a channel</strong>: whenever
        chat moves on, the bot refreshes the message so it stays visible. Use it for rules,
        announcements, event links — anything people should always see.
      </p>

      <div className="mt-8 space-y-8">
        {DOCS_NAV.map((section) => (
          <div key={section.label}>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {section.label}
            </p>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              {section.pages
                .filter((p) => p.to !== "/docs")
                .map((p) => (
                  <Link
                    key={p.to}
                    to={p.to}
                    className="glass group rounded-xl p-5 transition-transform hover:-translate-y-0.5"
                  >
                    <span className="flex items-center justify-between font-semibold text-foreground">
                      {p.title}
                      <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                    </span>
                    <span className="mt-1.5 block text-sm text-muted-foreground">
                      {p.description}
                    </span>
                  </Link>
                ))}
            </div>
          </div>
        ))}
      </div>

      <p className="mt-10">
        New here? Start by{" "}
        <a
          href={INVITE_URL}
          target="_blank"
          rel="noreferrer"
          className="text-sky underline-offset-4 hover:underline"
        >
          adding Glue Stick to your server
        </a>
        , then follow{" "}
        <Link to="/docs/getting-started" className="text-sky underline-offset-4 hover:underline">
          Getting Started
        </Link>{" "}
        — you'll have your first glued message in under a minute.
      </p>
    </DocsPage>
  );
}
