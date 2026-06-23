import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { CommandExplorer } from "@/components/site/CommandExplorer";

export const Route = createFileRoute("/commands")({
  head: () => ({
    meta: [
      { title: "Commands — Glue Stick" },
      {
        name: "description",
        content:
          "Explore every Glue Stick slash command in a live Discord-style mockup — see exactly how each one runs.",
      },
      { property: "og:title", content: "Commands — Glue Stick" },
      {
        property: "og:description",
        content:
          "Explore every Glue Stick slash command in a live Discord-style mockup — see exactly how each one runs.",
      },
    ],
  }),
  component: CommandsPage,
});

function CommandsPage() {
  return (
    <SiteLayout>
      <section className="px-4 pt-20 pb-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <h1 className="text-4xl font-bold sm:text-5xl">
            Bot <span className="text-gradient">Commands</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Pick a command from the sidebar to see exactly how it runs in Discord — the slash
            options, any pop-up, and the bot's reply.
          </p>
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <CommandExplorer />
        </div>
      </section>
    </SiteLayout>
  );
}
