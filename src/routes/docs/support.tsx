import { createFileRoute, Link } from "@tanstack/react-router";
import { Bug, LifeBuoy, ThumbsUp } from "lucide-react";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { DocsHeading } from "@/components/docs/DocsHeading";
import { DocsPage } from "@/components/docs/DocsPage";
import { SUPPORT_URL, VOTE_URL } from "@/lib/links";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/docs/support")({
  head: () =>
    seo({
      title: "Support — Glue Stick Docs",
      description:
        "Get help with Glue Stick: join the support server, report bugs effectively, and vote to support development.",
      path: "/docs/support",
    }),
  component: SupportPage,
});

const TOC = [
  { id: "support-server", label: "Support server" },
  { id: "reporting-bugs", label: "Reporting bugs" },
  { id: "vote", label: "Vote for Glue Stick" },
];

const link = "text-sky underline-offset-4 hover:underline";

function SupportPage() {
  return (
    <DocsPage
      title="Support"
      lede="Stuck, found a bug, or have an idea? Here's where to go."
      toc={TOC}
    >
      <DocsHeading id="support-server">Support server</DocsHeading>
      <p>
        The fastest way to get help is the official support server — assistance, update
        announcements, and other Glue Stick users:
      </p>
      <a
        href={SUPPORT_URL}
        target="_blank"
        rel="noreferrer"
        className="btn-glow mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#5865F2] to-[#66C2FF] px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.03]"
      >
        <LifeBuoy className="h-4 w-4" />
        Join the Support Server
      </a>
      <p>
        You can also grab the invite from inside Discord anytime with <code>/support</code>.
      </p>

      <DocsHeading id="reporting-bugs">
        <Bug className="mr-2 inline h-5 w-5 text-sky" aria-hidden />
        Reporting bugs
      </DocsHeading>
      <p>A report we can reproduce is a report we can fix. Before posting, grab two things:</p>
      <ol>
        <li>
          The output of <code>/permcheck</code> in the affected channel — most "bugs" turn out to be
          a red line here (see{" "}
          <Link to="/docs/faq" hash="stopped-refreshing" className={link}>
            the FAQ
          </Link>
          ).
        </li>
        <li>The bot's latency, to rule out a Discord hiccup:</li>
      </ol>
      <CodeBlock className="mt-3">/ping</CodeBlock>
      <p>Then post in the support server with:</p>
      <ul>
        <li>What you did (the exact command and options).</li>
        <li>What you expected, and what actually happened.</li>
        <li>The channel type (regular channel or thread) and roughly when it happened.</li>
      </ul>

      <DocsHeading id="vote">
        <ThumbsUp className="mr-2 inline h-5 w-5 text-sky" aria-hidden />
        Vote for Glue Stick
      </DocsHeading>
      <p>
        Votes on top.gg help other servers discover the bot — it's free and you can{" "}
        <a href={VOTE_URL} target="_blank" rel="noreferrer" className={link}>
          vote once every 12 hours
        </a>
        . Inside Discord, <code>/vote</code> gives you the same link.
      </p>
    </DocsPage>
  );
}
