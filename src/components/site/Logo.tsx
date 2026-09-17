import { Link } from "@tanstack/react-router";
import { AVATAR_PNG, AVATAR_WEBP } from "./discord";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      to="/"
      className={`group inline-flex items-center gap-2.5 rounded-lg transition-opacity duration-150 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${className}`}
    >
      <span className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-lg ring-1 ring-border">
        {/* Above the fold on every route — no lazy loading here. */}
        <picture>
          <source type="image/webp" srcSet={AVATAR_WEBP} />
          <img
            src={AVATAR_PNG}
            // Decorative: the wordmark beside it already says "GlueStick", so a
            // real alt would make a screen reader announce the name twice.
            alt=""
            width={36}
            height={36}
            className="h-full w-full object-cover"
          />
        </picture>
      </span>
      <span className="font-display text-lg font-bold tracking-tight text-foreground">
        Glue<span className="text-accent-strong">Stick</span>
      </span>
    </Link>
  );
}
