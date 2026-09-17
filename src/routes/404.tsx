import { createFileRoute } from "@tanstack/react-router";
import { NotFound } from "@/components/site/NotFound";
import { seo } from "@/lib/seo";

/**
 * A real prerendered 404 document.
 *
 * GitHub Pages serves dist/client/404.html for any unknown URL. The deploy
 * workflow used to copy index.html into that slot, which meant a broken URL
 * served the full homepage markup — crawlers and no-JS visitors saw homepage
 * content at a 404, and everyone else got a flash of the wrong page before the
 * router corrected it. The workflow now copies this route's output instead.
 *
 * noindex: this page exists to be served at many URLs, none of which should
 * ever appear in search results.
 */
export const Route = createFileRoute("/404")({
  head: () => {
    const s = seo({
      title: "Page not found — Glue Stick",
      description: "The page you're looking for doesn't exist or has been moved.",
      path: "/404",
    });
    return {
      ...s,
      meta: [...s.meta, { name: "robots", content: "noindex, follow" }],
    };
  },
  component: NotFound,
});
