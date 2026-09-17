import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import type { ReactNode } from "react";

import appCss from "../styles.css?url";
import { ThemeProvider, NO_FLASH_SCRIPT } from "../lib/theme";
import { NotFound } from "../components/site/NotFound";
import { Button } from "../components/ui/button";

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Button
            onClick={() => {
              router.invalidate();
              reset();
            }}
          >
            Try again
          </Button>
          <Button asChild variant="outline">
            <Link to="/">Go home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Glue Stick — Keep important Discord messages always visible" },
      {
        name: "description",
        content:
          "Glue Stick is a Discord bot that glues any message to the bottom of a channel and keeps it there automatically — so rules, announcements, and key info never get lost.",
      },
      { name: "author", content: "Glue Stick" },
      {
        property: "og:title",
        content: "Glue Stick — Keep important Discord messages always visible",
      },
      {
        property: "og:description",
        content:
          "Glue any message to the bottom of a Discord channel so it never gets lost in the scroll.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://gluestickdad.github.io/" },
      // Social-preview images must be absolute URLs (the deploy domain).
      { property: "og:image", content: "https://gluestickdad.github.io/og-image.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://gluestickdad.github.io/og-image.png" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: `${import.meta.env.BASE_URL}favicon.ico`, sizes: "48x48" },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: `${import.meta.env.BASE_URL}favicon-32x32.png`,
      },
      { rel: "apple-touch-icon", href: `${import.meta.env.BASE_URL}apple-touch-icon.png` },
      { rel: "manifest", href: `${import.meta.env.BASE_URL}site.webmanifest` },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFound,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Apply the saved/OS theme before paint to avoid a flash. */}
        <script dangerouslySetInnerHTML={{ __html: NO_FLASH_SCRIPT }} />
        {/* Raw JSX (not head()): head() meta dedupes by name and would drop one of the pair.

            These are the sRGB equivalents of --background in styles.css
            (:root and .dark respectively). The browser chrome can't read oklch
            custom properties, so they're hand-converted and will NOT follow
            automatically — if --background changes, update both here and the
            background_color/theme_color in public/site.webmanifest. */}
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#f8fafd" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#080d18" />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        {/* Framer Motion serialises `initial` into the prerendered markup, so without JS
            those elements stay at opacity:0 forever — on the homepage that hides the h1,
            the lede, both CTAs, the mockup and every feature card. Reveal them when
            scripting is unavailable. Keep in sync with the `initial` props in
            routes/index.tsx, ChatMockup.tsx and GlueDemo.tsx. */}
        <noscript>
          <style>{`[style*="opacity:0"]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
        <Outlet />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
