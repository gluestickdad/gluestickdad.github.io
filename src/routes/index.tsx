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
import { Container, MEASURE, SECTION } from "@/components/site/Container";
import { ChatMockup } from "@/components/site/ChatMockup";
import { GlueDemo } from "@/components/site/GlueDemo";
import { Button } from "@/components/ui/button";
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
    body: "See every glued message across the server and clear them all in one command — and run /permcheck to spot a channel override before it breaks a glue.",
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
    perms: [
      "View Channels",
      "Send Messages",
      "Read History",
      "Embed Links",
      "Send Messages in Threads",
    ],
    note: "…plus a few more for reactions, stickers & future updates — all pre-selected for you. Run /permcheck anytime to verify.",
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
      <section className={`relative ${SECTION.hero}`}>
        <Container className="grid items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-foreground/5 px-3 py-1 text-xs font-medium text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-strong" />
              Built for modern Discord servers
            </span>
            {/* text-balance instead of a hardcoded <br />: the break point has
                to follow the column width, which changes at every breakpoint. */}
            <h1 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight text-balance sm:text-5xl lg:text-6xl">
              Keep your important messages{" "}
              <span className="text-accent-strong">always visible</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Glue Stick glues any message to the bottom of your Discord channel and keeps it there
              automatically — so rules, announcements, and key info never get lost in the scroll.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="xl" className="group">
                <a href={INVITE_URL} target="_blank" rel="noreferrer">
                  Add to Your Server
                  <ArrowRight className="transition-transform duration-200 group-hover:translate-x-0.5" />
                </a>
              </Button>
              <Button asChild size="xl" variant="outline">
                <Link to="/commands">View Commands</Link>
              </Button>
            </div>
          </motion.div>
          <div className="relative flex justify-center lg:justify-end">
            <ChatMockup />
          </div>
        </Container>
      </section>

      {/* Perfect for band */}
      <section className={SECTION.tight}>
        <Container>
          <div className={`${MEASURE.panel} glass rounded-xl px-6 py-6 text-center`}>
            <p className="text-sm text-muted-foreground sm:text-base">
              <span className="font-semibold text-foreground">Perfect for:</span> Server rules,
              announcements, important links, channel guidelines, and any message that needs to stay
              visible!
            </p>
          </div>
        </Container>
      </section>

      {/* Live demo */}
      <section className={SECTION.tight}>
        <Container>
          <div className={MEASURE.panel}>
            <GlueDemo />
          </div>
        </Container>
      </section>

      {/* Features */}
      <section className={SECTION.base}>
        <Container>
          <div className={`${MEASURE.intro} text-center`}>
            <h2 className="text-3xl font-bold sm:text-4xl">
              Everything you need to keep messages{" "}
              <span className="text-accent-strong">in place</span>
            </h2>
            <p className="mt-4 text-muted-foreground">
              Built for clarity, automation, and zero hassle.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="glass rounded-xl p-6 transition-colors duration-150 hover:border-primary/30"
              >
                <div className="mb-4 inline-grid h-11 w-11 place-items-center rounded-lg bg-primary/10 text-accent-strong">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Getting Started */}
      <section className={SECTION.base}>
        <Container>
          <div className={`${MEASURE.intro} text-center`}>
            <h2 className="text-3xl font-bold sm:text-4xl">Getting Started</h2>
            <p className="mt-4 text-muted-foreground">Up and running in under a minute.</p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {steps.map((s) => (
              <div key={s.n} className="glass flex flex-col rounded-xl p-6">
                <div className="mb-4 inline-grid h-10 w-10 place-items-center rounded-full bg-primary font-display text-sm font-bold text-primary-foreground">
                  {s.n}
                </div>
                <h3 className="text-lg font-semibold text-foreground">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                {"points" in s && s.points && (
                  <ul className="mt-4 space-y-2">
                    {s.points.map((p) => (
                      <li key={p} className="flex items-center gap-2 text-sm text-foreground/85">
                        <span className="grid h-4 w-4 shrink-0 place-items-center rounded-full bg-success/15 text-success">
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
                        className="inline-flex items-center gap-1.5 rounded-full border border-border bg-foreground/5 px-2.5 py-1 text-xs font-medium text-foreground/80"
                      >
                        <span className="h-1 w-1 rounded-full bg-success" />
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
                  <Button asChild variant="outline" size="sm" className="mt-auto w-fit">
                    <a href={s.cta.href} target="_blank" rel="noreferrer">
                      {s.cta.label} <ArrowRight className="h-3 w-3" />
                    </a>
                  </Button>
                )}
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Need Help */}
      <section className={SECTION.base}>
        <Container>
          <div className={`${MEASURE.panel} glass rounded-2xl p-8 text-center sm:p-12`}>
            <LifeBuoy className="mx-auto h-10 w-10 text-accent-strong" />
            <h2 className="mt-4 text-3xl font-bold sm:text-4xl">Need Help?</h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Having trouble or have questions? Join our support server for assistance, updates, and
              to connect with other users!
            </p>
            <Button asChild size="lg" variant="outline" className="mt-8">
              <a href={SUPPORT_URL} target="_blank" rel="noreferrer">
                Join Support Server
              </a>
            </Button>
          </div>
        </Container>
      </section>

      {/* Final CTA */}
      <section className={SECTION.base}>
        <Container>
          <div className={`${MEASURE.panel} text-center`}>
            <h2 className="text-3xl font-bold sm:text-4xl">
              Ready to <span className="text-accent-strong">glue your messages</span> in place?
            </h2>
            <Button asChild size="xl" className="group mt-8">
              <a href={INVITE_URL} target="_blank" rel="noreferrer">
                Add to Your Server
                <ArrowRight className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </a>
            </Button>
          </div>
        </Container>
      </section>
    </SiteLayout>
  );
}
