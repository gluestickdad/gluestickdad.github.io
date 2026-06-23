import type { ReactNode } from "react";
import { BellOff, Check, ExternalLink, EyeOff, Hash } from "lucide-react";

/**
 * Lightweight Discord-style UI primitives shared by the home-page chat mockup,
 * the live "glue" demo, and the command previews. Surfaces use theme-aware
 * tokens (--discord-bg / --discord-elevated) so they read in light and dark.
 */

export const BOT_AVATAR = `${import.meta.env.BASE_URL}glue-stick-avatar.jpeg`;
export const BOT_NAME = "Glue Stick";

/* ------------------------------------------------------------------ badges */

export function AppBadge() {
  return (
    <span className="inline-flex items-center gap-0.5 rounded bg-[#5865F2] px-1 py-px text-[9px] font-bold uppercase leading-none tracking-wide text-white">
      <Check className="h-2.5 w-2.5" strokeWidth={3} />
      App
    </span>
  );
}

/* ----------------------------------------------------------------- avatars */

export function BotAvatar({ size = 40 }: { size?: number }) {
  return (
    <img
      src={BOT_AVATAR}
      alt={BOT_NAME}
      width={size}
      height={size}
      style={{ width: size, height: size }}
      className="shrink-0 rounded-full object-cover"
    />
  );
}

export function UserAvatar({
  name,
  color,
  size = 40,
}: {
  name: string;
  color: string;
  size?: number;
}) {
  return (
    <span
      className="grid shrink-0 place-items-center rounded-full text-xs font-bold text-white"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${color}, #5865F2)`,
      }}
    >
      {name.slice(0, 1).toUpperCase()}
    </span>
  );
}

/* ---------------------------------------------------------------- mentions */

export function Mention({ kind, children }: { kind: "channel" | "user"; children: ReactNode }) {
  return (
    <span className="rounded bg-blurple/15 px-1 font-medium text-blurple [a&]:hover:underline">
      {kind === "channel" ? <Hash className="mb-0.5 mr-px inline h-3 w-3" /> : "@"}
      {children}
    </span>
  );
}

/** Renders message text, turning #channel and @mention tokens into chips. */
export function renderContent(text: string): ReactNode[] {
  return text.split(/(#[\w-]+|@[\w-]+)/g).map((part, i) => {
    if (/^#[\w-]+$/.test(part))
      return (
        <Mention key={i} kind="channel">
          {part.slice(1)}
        </Mention>
      );
    if (/^@[\w-]+$/.test(part))
      return (
        <Mention key={i} kind="user">
          {part.slice(1)}
        </Mention>
      );
    return <span key={i}>{part}</span>;
  });
}

/* ---------------------------------------------------------------- messages */

export function DiscordMessage({
  name,
  color,
  time,
  children,
}: {
  name: string;
  color: string;
  time: string;
  children: ReactNode;
}) {
  return (
    <div className="flex gap-3">
      <UserAvatar name={name} color={color} size={36} />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-semibold" style={{ color }}>
            {name}
          </span>
          <span className="text-[10px] text-foreground/45">{time}</span>
        </div>
        <div className="text-sm leading-relaxed text-foreground/90">{children}</div>
      </div>
    </div>
  );
}

/** A message posted by the Glue Stick bot (avatar + name + APP badge). */
export function BotMessage({
  time = "Today",
  muted = false,
  children,
}: {
  time?: string;
  /** Show the bell-slash icon, as on a glued (suppressed-notification) post. */
  muted?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="flex gap-3">
      <BotAvatar size={36} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-semibold text-[#5865F2] dark:text-[#a5b0ff]">
            {BOT_NAME}
          </span>
          <AppBadge />
          <span className="text-[10px] text-foreground/45">{time}</span>
          {muted && <BellOff className="h-3 w-3 text-foreground/35" />}
        </div>
        <div className="mt-0.5 space-y-2 text-sm leading-relaxed text-foreground/90">
          {children}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ embeds */

export type EmbedField = { name: string; value: ReactNode; inline?: boolean };

export function DiscordEmbed({
  accent = "#5865F2",
  author,
  title,
  description,
  fields,
  thumbnail,
  image,
  footer,
}: {
  accent?: string;
  author?: { name: string; icon?: string };
  title?: ReactNode;
  description?: ReactNode;
  fields?: EmbedField[];
  thumbnail?: string;
  image?: ReactNode;
  footer?: string;
}) {
  return (
    <div
      className="max-w-md overflow-hidden rounded-[4px] bg-discord-elevated"
      style={{ borderLeft: `4px solid ${accent}` }}
    >
      <div className="px-3.5 py-2.5">
        <div className="flex gap-3">
          <div className="min-w-0 flex-1 space-y-2">
            {author && (
              <div className="flex items-center gap-2 text-xs font-semibold text-foreground/80">
                {author.icon && (
                  <img src={author.icon} alt="" className="h-5 w-5 rounded-full object-cover" />
                )}
                {author.name}
              </div>
            )}
            {title && (
              <div className="text-sm font-semibold text-[#5865F2] dark:text-[#a5b0ff]">
                {title}
              </div>
            )}
            {description && (
              <div className="text-[13px] leading-relaxed whitespace-pre-line text-foreground/80">
                {description}
              </div>
            )}
            {fields && fields.length > 0 && (
              <div className="grid gap-x-4 gap-y-2 sm:grid-cols-2">
                {fields.map((f, i) => (
                  <div key={i} className={f.inline === false ? "sm:col-span-2" : ""}>
                    <div className="text-xs font-semibold text-foreground">{f.name}</div>
                    <div className="mt-0.5 text-[13px] whitespace-pre-line text-foreground/75">
                      {f.value}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {thumbnail && (
            <img src={thumbnail} alt="" className="h-16 w-16 shrink-0 rounded-md object-cover" />
          )}
        </div>
        {image && <div className="mt-2 overflow-hidden rounded-md">{image}</div>}
        {footer && <div className="pt-2 text-[11px] text-foreground/45">{footer}</div>}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------- panel */

/** A Discord channel panel: optional window chrome + channel header. */
export function DiscordPanel({
  channel,
  chrome = true,
  className = "",
  children,
}: {
  channel?: string;
  chrome?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`overflow-hidden rounded-xl bg-discord-bg ${className}`}>
      {chrome && (
        <div className="flex items-center gap-1.5 border-b border-border/60 px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-400/80" />
          {channel && (
            <span className="ml-3 inline-flex items-center text-xs font-medium text-foreground/55">
              <Hash className="mr-0.5 h-3.5 w-3.5" />
              {channel}
            </span>
          )}
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  );
}

/* --------------------------------------------------- slash command run bits */

export type SlashOpt = { name: string; value: string };

/** The faded "‹you› used /command option: value" interaction header. */
export function SlashInvocation({
  command,
  options,
  user = "you",
}: {
  command: string;
  options?: SlashOpt[];
  user?: string;
}) {
  return (
    <div className="flex items-center gap-2 text-xs text-foreground/55">
      <span className="grid h-4 w-4 shrink-0 place-items-center rounded-full bg-foreground/15 text-[8px] font-bold text-foreground/70">
        {user.slice(0, 1).toUpperCase()}
      </span>
      <span className="leading-snug">
        <span className="font-medium text-foreground/70">{user}</span> used{" "}
        <span className="rounded bg-blurple/15 px-1 font-medium text-blurple">{command}</span>
        {options?.map((o) => (
          <span key={o.name} className="ml-1.5">
            <span className="text-foreground/45">{o.name}:</span>{" "}
            <span className="text-foreground/70">{o.value}</span>
          </span>
        ))}
      </span>
    </div>
  );
}

/** Wrapper for Discord's "only you can see this" ephemeral responses. */
export function Ephemeral({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-md bg-foreground/[0.04] px-3 py-2.5 ring-1 ring-border/60">
      <div className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-foreground/40">
        <EyeOff className="h-3 w-3" /> Only you can see this
      </div>
      {children}
    </div>
  );
}

/* ----------------------------------------------------------------- buttons */

export type BtnStyle = "primary" | "secondary" | "success" | "danger";
export type DiscordBtn = {
  label: string;
  style?: BtnStyle;
  emoji?: string;
  link?: boolean;
  /** Real URL — renders the button as a working link. */
  href?: string;
  disabled?: boolean;
};

const btnClass: Record<BtnStyle, string> = {
  primary: "bg-[#5865F2] text-white",
  secondary: "bg-[#4e5058] text-white",
  success: "bg-[#248046] text-white",
  danger: "bg-[#da373c] text-white",
};

export function DiscordButtons({ buttons }: { buttons: DiscordBtn[] }) {
  return (
    <div className="flex flex-wrap gap-2 pt-1.5">
      {buttons.map((b, i) => {
        const cls = `inline-flex items-center gap-1.5 rounded-[3px] px-3 py-1.5 text-xs font-medium ${
          btnClass[b.style ?? "secondary"]
        } ${b.disabled ? "opacity-50" : ""}`;
        const inner = (
          <>
            {b.emoji && <span className="text-sm leading-none">{b.emoji}</span>}
            {b.label}
            {(b.link || b.href) && <ExternalLink className="h-3 w-3 opacity-80" />}
          </>
        );
        return b.href && !b.disabled ? (
          <a
            key={i}
            href={b.href}
            target="_blank"
            rel="noreferrer"
            className={`${cls} transition-opacity hover:opacity-90`}
          >
            {inner}
          </a>
        ) : (
          <span key={i} className={cls}>
            {inner}
          </span>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------- modal */

export type ModalField = {
  label: string;
  value?: string;
  placeholder?: string;
  paragraph?: boolean;
};

export function DiscordModal({
  title,
  fields,
  submitLabel = "Submit",
  filled = true,
}: {
  title: string;
  fields: ModalField[];
  submitLabel?: string;
  /** When false, show placeholders instead of the filled-in values. */
  filled?: boolean;
}) {
  return (
    <div className="w-full max-w-sm overflow-hidden rounded-lg bg-discord-elevated shadow-xl ring-1 ring-border">
      <div className="border-b border-border/60 px-4 py-3 text-sm font-semibold text-foreground">
        {title}
      </div>
      <div className="space-y-3 px-4 py-3">
        {fields.map((f, i) => (
          <div key={i}>
            <div className="mb-1 text-[10px] font-bold uppercase tracking-wide text-foreground/55">
              {f.label}
            </div>
            <div
              className={`rounded bg-discord-bg px-2.5 py-1.5 text-[13px] ring-1 ring-border ${
                f.paragraph ? "min-h-[44px]" : ""
              }`}
            >
              {f.value && filled ? (
                <span className="whitespace-pre-line text-foreground/80">{f.value}</span>
              ) : (
                <span className="text-foreground/35">{f.placeholder}</span>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-end gap-2 border-t border-border/60 px-4 py-3">
        <span className="rounded px-3 py-1.5 text-xs font-medium text-foreground/55">Cancel</span>
        <span className="rounded bg-[#5865F2] px-3 py-1.5 text-xs font-medium text-white">
          {submitLabel}
        </span>
      </div>
    </div>
  );
}
