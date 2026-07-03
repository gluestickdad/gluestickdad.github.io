import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";

export type FaqItem = {
  slug: string;
  question: string;
  answer: ReactNode;
  /** Plain-text version of the answer, used by docs search. */
  plain: string;
};

const docsLink = "text-sky underline-offset-4 hover:underline";

export const FAQ_ITEMS: FaqItem[] = [
  {
    slug: "stopped-refreshing",
    question: "Why did my glued message stop refreshing?",
    answer: (
      <>
        <p>
          Almost always a permissions change. If Glue Stick loses <strong>View Channel</strong>,{" "}
          <strong>Send Messages</strong>, or <strong>Read Message History</strong> in a channel, it
          can no longer maintain the glue there — and after a failed refresh the glue is removed
          entirely so the bot doesn't keep retrying a channel it can't post in.
        </p>
        <p>
          Run <code>/permcheck</code> in the channel, restore anything shown in red, then glue the
          message again. See{" "}
          <Link to="/docs/permissions" className={docsLink}>
            Permissions
          </Link>{" "}
          for what each permission is used for.
        </p>
      </>
    ),
    plain:
      "Almost always a permissions change. If Glue Stick loses View Channel, Send Messages, or Read Message History it removes the glue after a failed refresh. Run /permcheck, restore permissions, then glue again.",
  },
  {
    slug: "who-can-use-commands",
    question: "Who can use the commands?",
    answer: (
      <>
        <p>
          By default, <strong>everyone</strong> — Glue Stick does not restrict its glue commands to
          admins, so any member can run <code>/glue</code>, <code>/editglue</code>,{" "}
          <code>/unglue</code>, and even <code>/clearallglues</code>.
        </p>
        <p>
          If that's too open for your server, Discord lets you restrict any command to specific
          roles or channels: <strong>Server Settings → Integrations → Glue Stick</strong>. The{" "}
          <Link to="/docs/permissions" className={docsLink}>
            Permissions page
          </Link>{" "}
          has a step-by-step guide.
        </p>
      </>
    ),
    plain:
      "By default everyone — any member can run /glue, /editglue, /unglue, and /clearallglues. Restrict commands per role or channel via Server Settings → Integrations → Glue Stick.",
  },
  {
    slug: "how-often-refresh",
    question: "How often does the glued message refresh?",
    answer: (
      <p>
        With default settings: as soon as <strong>5 new messages</strong> arrive, or{" "}
        <strong>15 seconds</strong> after the first new message — whichever happens first. If
        nothing is posted, the glue stays put and is never refreshed redundantly. Both values are
        tunable per channel with <code>/refreshconfig</code> — see{" "}
        <Link to="/docs/configuration" className={docsLink}>
          Configuration
        </Link>
        .
      </p>
    ),
    plain:
      "With defaults: after 5 new messages, or 15 seconds after the first new message, whichever comes first. Tunable per channel with /refreshconfig.",
  },
  {
    slug: "multiple-glues",
    question: "Can I glue more than one message in a channel?",
    answer: (
      <p>
        No — each channel holds exactly <strong>one</strong> glued message, and gluing again
        replaces it. There's no limit on how many <em>channels</em> can have a glue, though, and
        threads count as their own channels.
      </p>
    ),
    plain:
      "No — one glued message per channel; gluing again replaces it. No limit on the number of channels, and threads count separately.",
  },
  {
    slug: "line-breaks",
    question: "Why did my line breaks disappear?",
    answer: (
      <p>
        <code>/glue</code> is single-line by design — Discord slash-command text fields can't take
        line breaks, so any that sneak in are collapsed to spaces. Use <code>/gluepara</code>{" "}
        instead: it opens a pop-up form where line breaks are kept exactly as typed.
      </p>
    ),
    plain:
      "/glue is single-line by design; line breaks are collapsed to spaces. Use /gluepara, which opens a form that preserves line breaks.",
  },
  {
    slug: "notification-pings",
    question: "Does the glued message ping members every time it refreshes?",
    answer: (
      <p>
        No. Glued messages are posted <strong>silently</strong> — they don't trigger notification
        pings. The only exception is a glue that contains mentions (like <code>@role</code>), which
        Discord requires to be sent as a normal message.
      </p>
    ),
    plain:
      "No — glued messages are posted silently and don't ping. The exception is a glue containing mentions, which is sent as a normal message.",
  },
  {
    slug: "message-length",
    question: "What's the maximum message length?",
    answer: (
      <p>
        Text glues (<code>/glue</code> and <code>/gluepara</code>) can be up to{" "}
        <strong>2,000 characters</strong>. Embed glues allow a 256-character title plus a
        4,000-character description.
      </p>
    ),
    plain:
      "Text glues: 2,000 characters. Embed glues: 256-character title plus 4,000-character description.",
  },
  {
    slug: "reads-messages",
    question: "Does Glue Stick read my messages?",
    answer: (
      <p>
        No. The bot runs without Discord's message-content intent, so it <em>can't</em> read what
        anyone writes — it only counts how many messages have been posted since the last refresh to
        know when to refresh. The only content it stores is what you explicitly ask it to glue.
      </p>
    ),
    plain:
      "No — the bot runs without the message-content intent and only counts messages. The only content stored is what you explicitly glue.",
  },
  {
    slug: "update-in-progress",
    question: 'It says "Another update is in progress" — what does that mean?',
    answer: (
      <p>
        Glue operations in a channel run one at a time, so two people editing the same glue at the
        same moment don't clobber each other. Wait a few seconds and try again.
      </p>
    ),
    plain:
      "Glue operations in a channel run one at a time to prevent conflicts. Wait a few seconds and try again.",
  },
  {
    slug: "custom-emojis",
    question: "Do custom emojis work in glued messages?",
    answer: (
      <p>
        Yes — custom server emojis are preserved in glued messages. For emojis from <em>other</em>{" "}
        servers to render, Glue Stick needs the <strong>Use External Emojis</strong> permission
        (it's included in the invite and shown by <code>/permcheck</code>).
      </p>
    ),
    plain:
      "Yes — custom emojis are preserved. Emojis from other servers need the Use External Emojis permission, which /permcheck verifies.",
  },
];
