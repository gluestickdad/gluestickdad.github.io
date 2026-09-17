import type { DetailedHTMLProps, MetaHTMLAttributes } from "react";

export const SITE_URL = "https://gluestickdad.github.io";

/** Shared social-card image; individual pages can override via `image`. */
export const DEFAULT_OG_IMAGE = "/og-image.png";

type SeoArgs = {
  title: string;
  description: string;
  /**
   * Route path as TanStack declares it, e.g. "/" or "/docs/commands".
   * Write it WITHOUT a trailing slash; `seo()` adds one for the canonical and
   * og:url, because that is the form GitHub Pages actually serves (it 301s
   * /docs/commands -> /docs/commands/). scripts/postbuild.ts normalises the
   * sitemap the same way — the two must stay in agreement.
   */
  path: string;
  /** Site-root-relative image path for social cards. */
  image?: string;
};

/**
 * JSON-LD structured data as a head() meta entry. The router renders
 * `"script:ld+json"` into a <script type="application/ld+json"> tag, but its
 * meta types only know standard <meta> attributes — hence the cast.
 */
export function jsonLd(
  data: Record<string, unknown>,
): DetailedHTMLProps<MetaHTMLAttributes<HTMLMetaElement>, HTMLMetaElement> {
  return { "script:ld+json": data } as unknown as DetailedHTMLProps<
    MetaHTMLAttributes<HTMLMetaElement>,
    HTMLMetaElement
  >;
}

/**
 * Per-route head() metadata: title/description, canonical URL, Open Graph and
 * Twitter tags. Meta entries dedupe against the root route by name/property
 * with the deepest route winning; `links` do NOT dedupe, so the canonical tag
 * must only ever be emitted here, never in __root.tsx.
 */
/** Intrinsic size of DEFAULT_OG_IMAGE — see scripts/generate-assets.ts. */
const OG_IMAGE_WIDTH = "1200";
const OG_IMAGE_HEIGHT = "630";
const OG_IMAGE_ALT = "Glue Stick — a Discord bot that keeps key messages pinned to the bottom.";

/**
 * BreadcrumbList structured data. Google renders breadcrumbs directly in search
 * results, so every docs page declares its position in the Home > Docs > Page
 * hierarchy. `items` are ordered root-first; URLs use the same trailing-slash
 * form as the canonical.
 */
export function breadcrumbs(items: { name: string; path: string }[]) {
  return jsonLd({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.path === "/" ? `${SITE_URL}/` : `${SITE_URL}${item.path.replace(/\/$/, "")}/`,
    })),
  });
}

/**
 * seo() plus a BreadcrumbList for a /docs page. `breadcrumb` is the page's own
 * short name in the trail (e.g. "Commands"); /docs itself omits the leaf.
 */
export function docsSeo({ breadcrumb, ...args }: SeoArgs & { breadcrumb: string }) {
  const s = seo(args);
  const trail = [
    { name: "Home", path: "/" },
    { name: "Docs", path: "/docs" },
  ];
  if (args.path !== "/docs") trail.push({ name: breadcrumb, path: args.path });
  return { ...s, meta: [...s.meta, breadcrumbs(trail)] };
}

export function seo({ title, description, path, image = DEFAULT_OG_IMAGE }: SeoArgs) {
  const url = path === "/" ? `${SITE_URL}/` : `${SITE_URL}${path.replace(/\/$/, "")}/`;
  const img = `${SITE_URL}${image}`;
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: url },
      { property: "og:image", content: img },
      // Declaring intrinsic size lets scrapers lay the card out without
      // fetching the image first, which avoids a blank card on first share.
      { property: "og:image:width", content: OG_IMAGE_WIDTH },
      { property: "og:image:height", content: OG_IMAGE_HEIGHT },
      { property: "og:image:alt", content: OG_IMAGE_ALT },
      { property: "og:site_name", content: "Glue Stick" },
      { property: "og:locale", content: "en_US" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: img },
      { name: "twitter:image:alt", content: OG_IMAGE_ALT },
    ],
    links: [{ rel: "canonical", href: url }],
  };
}
