import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { Container, MEASURE } from "@/components/site/Container";
import { CommandExplorer } from "@/components/site/CommandExplorer";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/commands")({
  head: () =>
    seo({
      title: "Commands — Glue Stick",
      description:
        "Explore every Glue Stick slash command in a live Discord-style mockup — see exactly how each one runs.",
      path: "/commands",
    }),
  component: CommandsPage,
});

function CommandsPage() {
  return (
    <SiteLayout>
      <section className="pt-16 pb-8 lg:pt-24">
        <Container>
          <div className={`${MEASURE.intro} text-center`}>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Bot <span className="text-accent-strong">Commands</span>
            </h1>
            <p className="mt-4 text-muted-foreground">
              Pick a command from the sidebar to see exactly how it runs in Discord — the slash
              options, any pop-up, and the bot's reply. Prefer written details?{" "}
              <Link
                to="/docs/commands"
                className="text-accent-strong underline-offset-4 hover:underline"
              >
                Read the full command reference
              </Link>
              .
            </p>
          </div>
        </Container>
      </section>

      <section className="pb-16 lg:pb-24">
        <Container>
          <CommandExplorer />
        </Container>
      </section>
    </SiteLayout>
  );
}
