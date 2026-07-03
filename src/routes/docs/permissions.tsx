import { createFileRoute, Link } from "@tanstack/react-router";
import { Callout } from "@/components/docs/Callout";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { DocsHeading } from "@/components/docs/DocsHeading";
import { DocsPage } from "@/components/docs/DocsPage";
import { INVITE_URL } from "@/lib/links";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/docs/permissions")({
  head: () =>
    seo({
      title: "Permissions — Glue Stick Docs",
      description:
        "What each Discord permission is used for, how to verify them with /permcheck, and how to restrict who can use Glue Stick's commands.",
      path: "/docs/permissions",
    }),
  component: PermissionsPage,
});

const TOC = [
  { id: "how-it-works", label: "How permissions work" },
  { id: "essential", label: "Essential permissions" },
  { id: "also-requested", label: "Also requested in the invite" },
  { id: "permcheck", label: "Checking with /permcheck" },
  { id: "restricting-commands", label: "Restricting who can use commands" },
  { id: "lost-permissions", label: "When permissions go missing" },
];

const link = "text-sky underline-offset-4 hover:underline";

function PermTable({ rows }: { rows: [string, string][] }) {
  return (
    <div className="mt-4 overflow-x-auto rounded-lg border border-border">
      <table className="w-full min-w-[480px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-border bg-foreground/5 text-left">
            <th scope="col" className="px-3 py-2 font-semibold text-foreground">
              Permission
            </th>
            <th scope="col" className="px-3 py-2 font-semibold text-foreground">
              Used for
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([perm, why]) => (
            <tr key={perm} className="border-b border-border align-top last:border-0">
              <td className="whitespace-nowrap px-3 py-2 font-medium text-foreground">{perm}</td>
              <td className="px-3 py-2 text-foreground/85">{why}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PermissionsPage() {
  return (
    <DocsPage
      title="Permissions"
      lede="What Glue Stick asks for, what it actually uses each permission for, and how to control who can run its commands."
      toc={TOC}
    >
      <DocsHeading id="how-it-works">How permissions work</DocsHeading>
      <p>
        The{" "}
        <a href={INVITE_URL} target="_blank" rel="noreferrer" className={link}>
          invite link
        </a>{" "}
        pre-selects everything Glue Stick may need, so approving it is all the setup there is.
        Discord applies those permissions server-wide, but{" "}
        <strong>channel-level overrides always win</strong> — a channel that hides itself from the
        bot's role will break gluing there even if the server-wide grant looks fine.
      </p>

      <DocsHeading id="essential">Essential permissions</DocsHeading>
      <p>These are the permissions gluing actually depends on — without them, glues fail:</p>
      <PermTable
        rows={[
          ["View Channel", "See the channel so it can post and find its own glued message."],
          ["Send Messages", "Post the glued message and refresh it as chat moves."],
          [
            "Read Message History",
            "Locate its previous glued message so it can replace it instead of duplicating it.",
          ],
          ["Embed Links", "Post embed glues created with /glueembed."],
          ["Send Messages in Threads", "Maintain glued messages inside threads."],
        ]}
      />

      <DocsHeading id="also-requested">Also requested in the invite</DocsHeading>
      <p>
        The invite also asks for a few permissions that make optional features and future updates
        work without a re-invite — Attach Files, Add Reactions, Use External Emojis and Stickers,
        Manage Messages, Manage Threads, and a few others. Glue Stick never deletes anyone else's
        messages (it only ever removes <em>its own</em> glued posts, which needs no special
        permission), and it never mentions anyone on its own.
      </p>
      <Callout variant="tip">
        You can safely deny any of the non-essential permissions if your server prefers a minimal
        grant — gluing keeps working as long as the{" "}
        <a href="#essential" className={link}>
          essential five
        </a>{" "}
        are green.
      </Callout>

      <DocsHeading id="permcheck">Checking with /permcheck</DocsHeading>
      <CodeBlock className="mt-3">/permcheck</CodeBlock>
      <p>
        Run it in any channel to get a green/red checklist of the bot's effective permissions{" "}
        <em>in that specific channel</em> (including Send Messages in Threads when run inside a
        thread). It's the fastest way to spot a channel override that's breaking a glue.
      </p>

      <DocsHeading id="restricting-commands">Restricting who can use commands</DocsHeading>
      <Callout variant="warning" title="Commands are unrestricted by default">
        Glue Stick does not limit its commands to admins — out of the box,{" "}
        <strong>any member</strong> can run <code>/glue</code>, <code>/editglue</code>,{" "}
        <code>/unglue</code>, and even <code>/clearallglues</code>. If that doesn't suit your
        server, lock them down with Discord's built-in command permissions below.
      </Callout>
      <p>
        Discord lets server admins restrict any bot command to specific roles, members, or channels:
      </p>
      <ol>
        <li>
          Open <strong>Server Settings → Integrations → Glue Stick</strong>.
        </li>
        <li>
          Under <strong>Commands</strong>, pick a command (say, <code>/clearallglues</code>).
        </li>
        <li>
          Add role/member/channel overrides — for example, deny <code>@everyone</code> and allow
          your moderator role.
        </li>
      </ol>
      <p>
        Members without access simply won't see the command in their slash-command picker. Only
        exception: the <code>show_glued_by</code> option of <code>/listglues</code> is checked by
        the bot itself and always requires Administrator or server ownership.
      </p>

      <DocsHeading id="lost-permissions">When permissions go missing</DocsHeading>
      <p>
        If the bot loses access to a channel (deleted channel, revoked View Channel, and so on), it
        can't maintain the glue there. After a failed refresh, the glue is <strong>removed</strong>{" "}
        rather than endlessly retried. Once you restore the permissions, just glue the message again
        — and see the{" "}
        <Link to="/docs/faq" hash="stopped-refreshing" className={link}>
          FAQ entry
        </Link>{" "}
        if a glue seems to have vanished.
      </p>
    </DocsPage>
  );
}
