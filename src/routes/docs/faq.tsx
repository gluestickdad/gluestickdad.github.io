import { createFileRoute } from "@tanstack/react-router";
import { DocsHeading } from "@/components/docs/DocsHeading";
import { DocsPage } from "@/components/docs/DocsPage";
import { FAQ_ITEMS } from "@/lib/docs/faq";
import { seo, jsonLd, SITE_URL } from "@/lib/seo";

export const Route = createFileRoute("/docs/faq")({
  head: () => {
    const s = seo({
      title: "FAQ — Glue Stick Docs",
      description:
        "Answers to common Glue Stick questions: refreshing problems, permissions, message limits, notification pings, and more.",
      path: "/docs/faq",
    });
    return {
      ...s,
      meta: [
        ...s.meta,
        jsonLd({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          url: `${SITE_URL}/docs/faq`,
          mainEntity: FAQ_ITEMS.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: f.plain },
          })),
        }),
      ],
    };
  },
  component: FaqPage,
});

const TOC = FAQ_ITEMS.map((f) => ({ id: f.slug, label: f.question }));

function FaqPage() {
  return (
    <DocsPage
      title="FAQ"
      lede="Common questions and troubleshooting. Can't find your answer? Ask in the support server."
      toc={TOC}
    >
      {FAQ_ITEMS.map((f) => (
        <section key={f.slug} className="border-b border-border pb-8 last:border-0">
          <DocsHeading id={f.slug} className="text-xl">
            {f.question}
          </DocsHeading>
          <div className="mt-2">{f.answer}</div>
        </section>
      ))}
    </DocsPage>
  );
}
