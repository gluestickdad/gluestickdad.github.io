import { createFileRoute, Link } from "@tanstack/react-router";
import { Callout } from "@/components/docs/Callout";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { DocsHeading } from "@/components/docs/DocsHeading";
import { DocsPage } from "@/components/docs/DocsPage";
import type { TocItem } from "@/components/docs/DocsToc";
import {
  COMMAND_DOCS,
  COMMAND_GROUPS,
  type CommandDoc,
  type CommandOption,
} from "@/lib/docs/commands";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/docs/commands")({
  head: () =>
    seo({
      title: "Command Reference — Glue Stick Docs",
      description:
        "Every Glue Stick slash command — /glue, /gluepara, /glueembed, /editglue, /unglue, /refreshconfig and more — with syntax, options, limits, and examples.",
      path: "/docs/commands",
    }),
  component: CommandsReferencePage,
});

const TOC: TocItem[] = COMMAND_GROUPS.flatMap((g) => [
  { id: g.id, label: g.label },
  ...COMMAND_DOCS.filter((c) => c.group === g.id).map((c) => ({
    id: c.slug,
    label: c.name,
    depth: 3 as const,
  })),
]);

const GROUP_INTROS: Record<string, string> = {
  gluing: "Three ways to glue a message to the bottom of a channel.",
  managing: "Edit, list, remove, and tune the glues you've created.",
  utility: "Diagnostics and links, available anywhere.",
};

function OptionsTable({ options }: { options: CommandOption[] }) {
  return (
    <>
      <div className="mt-4 overflow-x-auto rounded-lg border border-border">
        <table className="w-full min-w-[560px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border bg-foreground/5 text-left">
              <th scope="col" className="px-3 py-2 font-semibold text-foreground">
                Option
              </th>
              <th scope="col" className="px-3 py-2 font-semibold text-foreground">
                Type
              </th>
              <th scope="col" className="px-3 py-2 font-semibold text-foreground">
                Default
              </th>
              <th scope="col" className="px-3 py-2 font-semibold text-foreground">
                Description
              </th>
            </tr>
          </thead>
          <tbody>
            {options.map((o) => (
              <tr key={o.name} className="border-b border-border align-top last:border-0">
                <td className="whitespace-nowrap px-3 py-2 font-mono text-[13px] text-foreground">
                  {o.name}
                  {o.required && (
                    <span className="text-amber-500" aria-label="required">
                      {" "}
                      *
                    </span>
                  )}
                </td>
                <td className="px-3 py-2 text-muted-foreground">{o.type}</td>
                <td className="whitespace-nowrap px-3 py-2 text-muted-foreground">
                  {o.default ?? "—"}
                  {o.range && <span className="block text-xs">({o.range})</span>}
                </td>
                <td className="min-w-56 px-3 py-2 text-foreground/85">{o.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {options.some((o) => o.required) && (
        <p className="mt-1.5 text-xs text-muted-foreground">* required</p>
      )}
    </>
  );
}

function CommandSection({ cmd }: { cmd: CommandDoc }) {
  return (
    <section className="border-b border-border pb-10 last:border-0">
      <DocsHeading id={cmd.slug} level={3} className="font-mono text-xl">
        {cmd.name}
      </DocsHeading>
      <p>{cmd.summary}</p>
      <CodeBlock className="mt-4">{cmd.syntax}</CodeBlock>

      {cmd.options && <OptionsTable options={cmd.options} />}

      {cmd.modalFields && (
        <>
          <p className="mt-5 text-sm font-semibold text-foreground">Pop-up form fields</p>
          <ul>
            {cmd.modalFields.map((f) => (
              <li key={f.name}>
                <span className="font-medium text-foreground">{f.name}</span>
                {!f.required && <span className="text-muted-foreground"> (optional)</span>} —{" "}
                {f.description}
              </li>
            ))}
          </ul>
        </>
      )}

      {cmd.botPermissions && (
        <div className="mt-5 flex flex-wrap items-center gap-1.5 text-sm">
          <span className="text-muted-foreground">Bot needs:</span>
          {cmd.botPermissions.map((p) => (
            <span
              key={p}
              className="inline-flex items-center rounded-full border border-border bg-foreground/5 px-2.5 py-0.5 text-xs font-medium text-foreground/80"
            >
              {p}
            </span>
          ))}
        </div>
      )}

      {cmd.limits && (
        <>
          <p className="mt-5 text-sm font-semibold text-foreground">Limits</p>
          <ul>
            {cmd.limits.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
        </>
      )}

      {cmd.notes && (
        <>
          <p className="mt-5 text-sm font-semibold text-foreground">Notes</p>
          <ul>
            {cmd.notes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        </>
      )}

      {cmd.examples && (
        <>
          <p className="mt-5 text-sm font-semibold text-foreground">
            {cmd.examples.length > 1 ? "Examples" : "Example"}
          </p>
          {cmd.examples.map((e) => (
            <div key={e.command} className="mt-3">
              <CodeBlock>{e.command}</CodeBlock>
              <p className="mt-1.5 text-sm text-muted-foreground">{e.effect}</p>
            </div>
          ))}
        </>
      )}
    </section>
  );
}

function CommandsReferencePage() {
  return (
    <DocsPage
      title="Command Reference"
      lede="Every Glue Stick slash command with syntax, options, limits, and examples. Prefer to see them in action? Try the interactive demo on the Commands page."
      toc={TOC}
    >
      <Callout variant="info" title="Who can run these?">
        Every member, by default — Glue Stick doesn't gate its commands behind Discord permissions.
        If you want <code>/glue</code> or <code>/clearallglues</code> limited to moderators, set
        per-command restrictions in your server settings — see{" "}
        <Link
          to="/docs/permissions"
          hash="restricting-commands"
          className="text-sky underline-offset-4 hover:underline"
        >
          Restricting who can use commands
        </Link>
        .
      </Callout>

      {COMMAND_GROUPS.map((group) => (
        <div key={group.id}>
          <DocsHeading id={group.id}>{group.label}</DocsHeading>
          <p className="text-muted-foreground">{GROUP_INTROS[group.id]}</p>
          <div className="mt-2 space-y-10">
            {COMMAND_DOCS.filter((c) => c.group === group.id).map((cmd) => (
              <CommandSection key={cmd.slug} cmd={cmd} />
            ))}
          </div>
        </div>
      ))}
    </DocsPage>
  );
}
