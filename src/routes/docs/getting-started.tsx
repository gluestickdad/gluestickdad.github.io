import { createFileRoute, Link } from "@tanstack/react-router";
import { Callout } from "@/components/docs/Callout";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { DocsHeading } from "@/components/docs/DocsHeading";
import { DocsPage } from "@/components/docs/DocsPage";
import { INVITE_URL } from "@/lib/links";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/docs/getting-started")({
  head: () =>
    seo({
      title: "Getting Started — Glue Stick Docs",
      description:
        "Invite Glue Stick, verify its permissions with /permcheck, and glue your first message — all in under a minute.",
      path: "/docs/getting-started",
    }),
  component: GettingStartedPage,
});

const TOC = [
  { id: "invite", label: "1. Invite the bot" },
  { id: "verify-permissions", label: "2. Verify permissions" },
  { id: "first-glue", label: "3. Glue your first message" },
  { id: "what-happens-next", label: "What happens next" },
  { id: "next-steps", label: "Next steps" },
];

const link = "text-sky underline-offset-4 hover:underline";

function GettingStartedPage() {
  return (
    <DocsPage
      title="Getting Started"
      lede="From invite to your first glued message in under a minute — no dashboard, no setup files."
      toc={TOC}
    >
      <DocsHeading id="invite">1. Invite the bot</DocsHeading>
      <p>
        <a href={INVITE_URL} target="_blank" rel="noreferrer" className={link}>
          Add Glue Stick to your server
        </a>{" "}
        — the invite link pre-selects every permission the bot needs, so you just pick a server and
        approve. You need Discord's <strong>Manage Server</strong> permission in that server to add
        bots.
      </p>

      <DocsHeading id="verify-permissions">2. Verify permissions</DocsHeading>
      <p>In the channel where you want a glued message, run:</p>
      <CodeBlock className="mt-3">/permcheck</CodeBlock>
      <p>
        Everything should come back green. If something is red — usually because a channel override
        hides the channel from the bot — fix it in the channel's permission settings, then run{" "}
        <code>/permcheck</code> again. See{" "}
        <Link to="/docs/permissions" className={link}>
          Permissions
        </Link>{" "}
        for what each one is used for.
      </p>

      <DocsHeading id="first-glue">3. Glue your first message</DocsHeading>
      <CodeBlock className="mt-3">
        /glue content:Welcome! Please read the rules before posting.
      </CodeBlock>
      <p>
        That's it — the bot posts your message and keeps it glued to the bottom of the channel. It
        posts silently, so nobody gets pinged when it refreshes.
      </p>
      <Callout variant="tip">
        Need paragraphs or line breaks? Use <code>/gluepara</code> instead. Want a title, color, and
        images? Use <code>/glueembed</code>. Both open a pop-up form.
      </Callout>

      <DocsHeading id="what-happens-next">What happens next</DocsHeading>
      <p>
        As people chat, Glue Stick refreshes your message so it stays the last thing in the channel.
        By default it refreshes after <strong>5 new messages</strong>, or{" "}
        <strong>15 seconds</strong> after the first new message — whichever comes first. If nobody
        is talking, it leaves the channel alone.
      </p>

      <DocsHeading id="next-steps">Next steps</DocsHeading>
      <ul>
        <li>
          Browse the full{" "}
          <Link to="/docs/commands" className={link}>
            command reference
          </Link>{" "}
          — editing, listing, and removing glues.
        </li>
        <li>
          Tune how quickly the glue refreshes per channel in{" "}
          <Link to="/docs/configuration" className={link}>
            Configuration
          </Link>
          .
        </li>
        <li>
          Decide{" "}
          <Link to="/docs/permissions" className={link}>
            who can use the commands
          </Link>{" "}
          — by default every member can.
        </li>
      </ul>
    </DocsPage>
  );
}
