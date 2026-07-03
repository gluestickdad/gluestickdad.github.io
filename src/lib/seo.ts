import type { DetailedHTMLProps, MetaHTMLAttributes } from "react";

export const SITE_URL = "https://gluestickdad.github.io";

/** Shared social-card image; individual pages can override via `image`. */
export const DEFAULT_OG_IMAGE = "/og-image.png";

type SeoArgs = {
  title: string;
  description: string;
  /** Route path, e.g. "/" or "/docs/commands" — no trailing slash except the root. */
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
export function seo({ title, description, path, image = DEFAULT_OG_IMAGE }: SeoArgs) {
  const url = path === "/" ? `${SITE_URL}/` : `${SITE_URL}${path}`;
  const img = `${SITE_URL}${image}`;
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: url },
      { property: "og:image", content: img },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: img },
    ],
    links: [{ rel: "canonical", href: url }],
  };
}
