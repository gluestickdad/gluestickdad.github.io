import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { INVITE_URL } from "@/lib/links";

/** Reveal once the first screenful has scrolled away. */
const THRESHOLD_RATIO = 0.6;

/**
 * Bottom-anchored invite CTA for phones.
 *
 * The navbar's CTA is hidden below lg, so once the top of the page scrolls away
 * there is no way to invite the bot until the footer. This fills that gap.
 *
 * Deliberately keyed to scroll position rather than to a sentinel element in
 * the home-page hero: the bar has to work on all eleven routes, and a sentinel
 * only the landing page renders would silently do nothing on the other ten.
 */
export function MobileCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setVisible(window.scrollY > window.innerHeight * THRESHOLD_RATIO);
    };
    const onScroll = () => {
      // Coalesce to one read per frame; scroll fires far more often than that.
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update(); // settle correctly on load and after in-page navigation
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      aria-hidden={!visible}
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/90 backdrop-blur-xl transition-opacity duration-200 motion-reduce:transition-none lg:hidden ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="px-4 py-3">
        <Button asChild size="lg" className="w-full">
          {/* tabIndex -1 while hidden so it stays out of the tab order. */}
          <a href={INVITE_URL} target="_blank" rel="noreferrer" tabIndex={visible ? 0 : -1}>
            Add to Your Server
          </a>
        </Button>
      </div>
    </div>
  );
}
