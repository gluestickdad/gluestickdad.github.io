import { Link } from "@tanstack/react-router";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`group inline-flex items-center gap-2.5 ${className}`}>
      <span className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-xl ring-1 ring-border shadow-[0_8px_24px_-10px_#5865F2] transition-transform group-hover:scale-105">
        <img
          src={`${import.meta.env.BASE_URL}glue-stick-avatar.jpeg`}
          alt="Glue Stick"
          width={36}
          height={36}
          className="h-full w-full object-cover"
        />
      </span>
      <span className="font-display text-lg font-bold tracking-tight text-foreground">
        Glue<span className="text-gradient">Stick</span>
      </span>
    </Link>
  );
}
