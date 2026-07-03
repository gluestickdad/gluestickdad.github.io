import { createFileRoute, Link } from "@tanstack/react-router";
import { Callout } from "@/components/docs/Callout";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { DocsHeading } from "@/components/docs/DocsHeading";
import { DocsPage } from "@/components/docs/DocsPage";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/docs/configuration")({
  head: () =>
    seo({
      title: "Configuration — Glue Stick Docs",
      description:
        "How Glue Stick's refresh triggers work — message count and time thresholds — and how to tune them per channel with /refreshconfig.",
      path: "/docs/configuration",
    }),
  component: ConfigurationPage,
});

const TOC = [
  { id: "how-refreshing-works", label: "How refreshing works" },
  { id: "tuning", label: "Tuning with /refreshconfig" },
  { id: "per-channel", label: "Per-channel settings" },
  { id: "recommendations", label: "Recommended settings" },
];

const link = "text-sky underline-offset-4 hover:underline";

function ConfigurationPage() {
  return (
    <DocsPage
      title="Configuration"
      lede="Glue Stick decides when to refresh a message using two triggers you can tune per channel."
      toc={TOC}
    >
      <DocsHeading id="how-refreshing-works">How refreshing works</DocsHeading>
      <p>Every glued message has two thresholds, and whichever fires first wins:</p>
      <ul>
        <li>
          <strong>Message count</strong> (<code>messagecount</code>, default <strong>5</strong>) —
          as soon as this many new messages arrive, the glue immediately refreshes to the bottom.
        </li>
        <li>
          <strong>Time</strong> (<code>refreshtime</code>, default <strong>15 seconds</strong>) — if
          fewer messages than that arrive, the glue refreshes this many seconds after the{" "}
          <em>first</em> new message since the last refresh.
        </li>
      </ul>
      <p>
        So with defaults, a burst of chat refreshes the glue almost instantly, while a single stray
        message refreshes it within 15 seconds. If <strong>nothing</strong> is posted, no refresh
        happens at all — and if the glued message is already the last message in the channel, the
        bot skips the refresh entirely rather than bumping it redundantly.
      </p>
      <Callout variant="info">
        Refreshes are silent — members don't get notification pings when the glued message refreshes (unless
        the glued message itself contains mentions).
      </Callout>

      <DocsHeading id="tuning">Tuning with /refreshconfig</DocsHeading>
      <p>View the current settings for a channel:</p>
      <CodeBlock className="mt-3">/refreshconfig</CodeBlock>
      <p>Or change one or both thresholds:</p>
      <CodeBlock className="mt-3">/refreshconfig messagecount:10 refreshtime:60</CodeBlock>
      <ul>
        <li>
          <code>messagecount</code> accepts <strong>5–50</strong> messages.
        </li>
        <li>
          <code>refreshtime</code> accepts <strong>15–3600</strong> seconds (15 s to 1 hour).
        </li>
        <li>
          The optional <code>channel</code> argument lets you configure another glued channel
          without leaving the one you're in.
        </li>
      </ul>
      <p>
        After you change settings, the very next message in the channel triggers an immediate
        refresh so you can confirm the glue is alive. Full option details are in the{" "}
        <Link to="/docs/commands" hash="refreshconfig" className={link}>
          command reference
        </Link>
        .
      </p>

      <DocsHeading id="per-channel">Per-channel settings</DocsHeading>
      <ul>
        <li>
          Settings belong to the <strong>channel's glued message</strong>, not the server — every
          glued channel can have its own thresholds.
        </li>
        <li>
          Each channel holds exactly <strong>one</strong> glued message; gluing again replaces it
          (with default thresholds, so re-tune after re-gluing).
        </li>
        <li>
          Editing with <code>/editglue</code> keeps the channel's thresholds.
        </li>
        <li>Threads count as their own channels, with their own glue and settings.</li>
      </ul>

      <DocsHeading id="recommendations">Recommended settings</DocsHeading>
      <ul>
        <li>
          <strong>Busy general chat</strong> — raise both (e.g. <code>messagecount:15</code>,{" "}
          <code>refreshtime:60</code>) so the glue isn't refreshing constantly.
        </li>
        <li>
          <strong>Announcements / rules channels</strong> — the defaults are fine; traffic is low,
          so the glue rarely moves.
        </li>
        <li>
          <strong>Event or support channels</strong> — keep <code>messagecount</code> low so the key
          message snaps back quickly during activity spikes.
        </li>
      </ul>
    </DocsPage>
  );
}
