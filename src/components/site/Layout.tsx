import type { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { MobileCta } from "./MobileCta";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-x-clip">
      {/* Ambient background. overflow-hidden clips the wash to the viewport —
          without it a blurred layer overflows past a phone's right edge and
          causes horizontal scroll. The root's overflow-x-clip can't catch it
          because this layer is position:fixed (its containing block is the
          viewport, not the clipped ancestor). */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-60 dark:opacity-50" />
        {/* One restrained token-driven wash, replacing the two saturated
            blurple/cyan blobs. Enough to keep the grid from reading flat,
            not enough to register as an effect. */}
        <div className="absolute -top-40 left-1/2 h-[600px] w-[1100px] -translate-x-1/2 rounded-full bg-primary/5 blur-[160px] dark:bg-primary/10" />
        {/* Functional scrim: fades the grid out at the page foot so it doesn't
            end on a hard edge. Mechanism, not decoration. */}
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-background to-transparent" />
      </div>
      {/* Keyboard users would otherwise tab the whole navbar (and, in docs, the
          sidebar) on every page before reaching content. Visually hidden until
          focused. */}
      <a
        href="#main"
        className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-50 focus-visible:rounded-md focus-visible:bg-background focus-visible:px-4 focus-visible:py-2 focus-visible:text-sm focus-visible:font-medium focus-visible:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main" tabIndex={-1}>
        {children}
      </main>
      {/* pb clears the fixed mobile CTA so it never covers the last link row. */}
      <div className="pb-20 lg:pb-0">
        <Footer />
      </div>
      <MobileCta />
    </div>
  );
}
