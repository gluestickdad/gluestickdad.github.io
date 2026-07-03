import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Pin,
  Terminal,
  RefreshCw,
  Image,
  SquarePen,
  ShieldCheck,
  LifeBuoy,
  Check,
} from "lucide-react";
import { SiteLayout } from "@/components/site/Layout";
import { ChatMockup } from "@/components/site/ChatMockup";
import { GlueDemo } from "@/components/site/GlueDemo";
import { INVITE_URL, SUPPORT_URL } from "@/lib/links";
import { seo, jsonLd, SITE_URL, DEFAULT_OG_IMAGE } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () => {
    const s = seo({
      title: "Glue Stick — Keep important Discord messages always visible",
      description:
        "Glue Stick is a Discord bot that glues any message to the bottom of a channel and keeps it there automatically.",
      path: "/",
    });
    return {
      ...s,
      meta: [
        ...s.meta,
        jsonLd({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "Glue Stick",
          url: SITE_URL,
          image: `${SITE_URL}${DEFAULT_OG_IMAGE}`,
          applicationCategory: "CommunicationApplication",
          operatingSystem: "Discord",
          description:
            "Glue Stick is a Discord bot that glues any message to the bottom of a channel and keeps it there automatically — so rules, announcements, and key info never get lost.",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        }),
      ],
    };
  },
  component: Index,
});

const features = [
  {
    icon: Pin,
    title: "Always at the bottom",
    body: "Pin rules, announcements, or links and Glue Stick automatically refreshes them to the bottom — never buried under new chat.",
  },
  {
    icon: Terminal,
    title: "Dead-simple commands",
    body: "Modern slash commands with no prefix to remember and no complicated UI — just type /glue with your message and it stays put.",
  },
  {
    icon: Image,
    title: "Text, paragraphs & embeds",
    body: "Glue a quick line, a formatted multi-line post, or a rich embed with its own title, image, and color.",
  },
  {
    icon: RefreshCw,
    title: "Configurable refresh",
    body: "Tune how often a glued message refreshes — after a set number of messages or a time interval, per channel.",
  },
  {
    icon: SquarePen,
    title: "Edit in place",
    body: "Update a glued message anytime with /editglue — no deleting, copying, or re-gluing required.",
  },
  {
    icon: ShieldCheck,
    title: "Built for admins",
    body: "See every glued message across the server and clear them all in one command, with permission checks built in.",
  },
];

const steps = [
  {
    n: 1,
    title: "Invite Glue Stick",
    body: "Add the bot to your server in two clicks — it's free and live in seconds, no setup or config.",
    points: ["Free to use", "Works in any text channel", "No dashboard to configure"],
    cta: { label: "Add to Your Server", href: INVITE_URL },
  },
  {
    n: 2,
    title: "Grant Permissions",
    body: "The invite link already requests everything Glue Stick needs — just approve it. The essentials it relies on:",
    perms: ["View Channels", "Send Messages", "Manage Messages", "Embed Links", "Read History"],
    note: "…plus a few more for threads, reactions & stickers — all pre-selected for you. Run /permcheck anytime to verify.",
  },
  {
    n: 3,
    title: "Use the Commands",
    body: "Glue, update, or remove messages with simple slash commands.",
    code: [
      { cmd: "/glue [message]", desc: "Create or update a glued message in the current channel" },
      { cmd: "/unglue", desc: "Remove the glued message from the current channel" },
      { cmd: "/clearallglues", desc: "Remove all glued messages from the entire server" },
    ],
  },
];

function Index() {
  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative px-4 pt-20 pb-24 sm:px-6 lg:px-8 lg:pt-28">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-foreground/5 px-3 py-1 text-xs font-medium text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-sky" />
              Built for modern Discord servers
            </span>
            <h1 className="mt-6 text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              Keep your important <br />
              messages <span className="text-gradient">always visible</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Glue Stick glues any message to the bottom of your Discord channel and keeps it there
              automatically — so rules, announcements, and key info never get lost in the scroll.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={INVITE_URL}
                target="_blank"
                rel="noreferrer"
                className="btn-glow group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#5865F2] to-[#66C2FF] px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.03]"
              >
                Add to Your Server
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>
              <Link
                to="/commands"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-foreground/5 px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-foreground/10"
              >
                View Commands
              </Link>
            </div>
          </motion.div>
          <div className="relative flex justify-center lg:justify-end">
            <div className="absolute -inset-10 -z-10 bg-gradient-to-tr from-[#5865F2]/20 to-[#66C2FF]/20 blur-3xl" />
            <ChatMockup />
          </div>
        </div>
      </section>

      {/* Perfect for band */}
      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="glass rounded-2xl px-6 py-5 text-center">
            <p className="text-sm text-muted-foreground sm:text-base">
              <span className="font-semibold text-foreground">Perfect for:</span> Server rules,
              announcements, important links, channel guidelines, and any message that needs to stay
              visible!
            </p>
          </div>
        </div>
      </section>

      {/* Live demo */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <GlueDemo />
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">
              Everything you need to keep messages <span className="text-gradient">in place</span>
            </h2>
            <p className="mt-4 text-muted-foreground">
              Built for clarity, automation, and zero hassle.
            </p>
          </div>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="glass group rounded-2xl p-6 transition-transform hover:-translate-y-1"
              >
                <div className="mb-4 inline-grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-[#5865F2]/30 to-[#66C2FF]/20 text-sky">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Getting Started */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">Getting Started</h2>
            <p className="mt-4 text-muted-foreground">Up and running in under a minute.</p>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {steps.map((s) => (
              <div key={s.n} className="glass flex flex-col rounded-2xl p-6">
                <div className="mb-4 inline-grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-[#5865F2] to-[#66C2FF] font-display text-sm font-bold text-white">
                  {s.n}
                </div>
                <h3 className="text-lg font-semibold text-foreground">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                {"points" in s && s.points && (
                  <ul className="mt-4 space-y-2">
                    {s.points.map((p) => (
                      <li key={p} className="flex items-center gap-2 text-sm text-foreground/85">
                        <span className="grid h-4 w-4 shrink-0 place-items-center rounded-full bg-sky/15 text-sky">
                          <Check className="h-3 w-3" strokeWidth={3} />
                        </span>
                        {p}
                      </li>
                    ))}
                  </ul>
                )}
                {"perms" in s && s.perms && (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {s.perms.map((p) => (
                      <span
                        key={p}
                        className="inline-flex items-center gap-1.5 rounded-full border border-border bg-foreground/5 px-2.5 py-0.5 text-[11px] font-medium text-foreground/80"
                      >
                        <span className="h-1 w-1 rounded-full bg-emerald-400" />
                        {p}
                      </span>
                    ))}
                  </div>
                )}
                {"note" in s && s.note && (
                  <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{s.note}</p>
                )}
                {"code" in s && s.code && (
                  <div className="mt-4 space-y-2">
                    {s.code.map((c) => (
                      <div
                        key={c.cmd}
                        className="rounded-lg border border-border bg-code-bg px-3 py-2"
                      >
                        <code className="font-mono text-xs text-code-fg">{c.cmd}</code>
                        <p className="mt-1 text-xs text-muted-foreground">{c.desc}</p>
                      </div>
                    ))}
                  </div>
                )}
                {"cta" in s && s.cta && (
                  <a
                    href={s.cta.href}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-auto inline-flex w-fit items-center gap-1 rounded-full bg-foreground/10 px-4 py-2 pt-2 text-xs font-semibold text-foreground hover:bg-foreground/15"
                  >
                    {s.cta.label} <ArrowRight className="h-3 w-3" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Need Help */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="glass relative overflow-hidden rounded-3xl p-10 text-center">
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#5865F2]/10 via-transparent to-[#66C2FF]/10" />
            <LifeBuoy className="mx-auto h-10 w-10 text-sky" />
            <h2 className="mt-4 text-2xl font-bold sm:text-3xl">Need Help?</h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              Having trouble or have questions? Join our support server for assistance, updates, and
              to connect with other users!
            </p>
            <a
              href={SUPPORT_URL}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-foreground/5 px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-foreground/10"
            >
              Join Support Server
            </a>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold sm:text-5xl">
            Ready to <span className="text-gradient">glue your messages</span> in place?
          </h2>
          <div className="mt-8">
            <a
              href={INVITE_URL}
              target="_blank"
              rel="noreferrer"
              className="btn-glow inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#5865F2] to-[#66C2FF] px-8 py-4 text-base font-semibold text-white transition-transform hover:scale-[1.03]"
            >
              Add to Your Server
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
