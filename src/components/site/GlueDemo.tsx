import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { MessagesSquare, RefreshCw, Send, X } from "lucide-react";
import { DiscordPanel, DiscordMessage, BotMessage, renderContent } from "./discord";

type MemberMsg = {
  kind: "msg";
  id: number;
  name: string;
  color: string;
  time: string;
  text: string;
};
type GlueItem = { kind: "glue"; id: "glue" };
type FeedItem = MemberMsg | GlueItem;

const REFRESH_MESSAGES = 5;
const REFRESH_SECONDS = 15;

const POOL: Pick<MemberMsg, "name" | "color" | "text">[] = [
  { name: "Riley", color: "#3aa0ff", text: "just joined — this place is active!" },
  { name: "Kai", color: "#1fb877", text: "gg everyone, that was close" },
  { name: "Noor", color: "#d061ff", text: "where do I get the event role again?" },
  { name: "Theo", color: "#e08a2b", text: "lol nice clip 😂" },
  { name: "Vera", color: "#ff6b81", text: "anyone got the patch notes?" },
  { name: "Dex", color: "#52d0c8", text: "brb grabbing food" },
];

const SEED: FeedItem[] = [
  {
    kind: "msg",
    id: 1,
    name: "Riley",
    color: "#3aa0ff",
    time: "7:41 PM",
    text: "yo what's the plan for tonight?",
  },
  {
    kind: "msg",
    id: 2,
    name: "Kai",
    color: "#1fb877",
    time: "7:42 PM",
    text: "raid at 8, don't be late this time 😅",
  },
  { kind: "glue", id: "glue" },
];

function nowTime() {
  return new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function withGlueAtEnd(items: FeedItem[]): FeedItem[] {
  return [...items.filter((i) => i.kind !== "glue"), { kind: "glue", id: "glue" }];
}

export function GlueDemo() {
  const [feed, setFeed] = useState<FeedItem[]>(SEED);
  const [glued, setGlued] = useState<string | null>(
    "📌 Rules: be kind, no spam. Grab roles in #self-roles.",
  );
  const [gluedTime, setGluedTime] = useState("7:45 PM");
  const [draft, setDraft] = useState("");
  const [reposts, setReposts] = useState(0);
  const [sinceRefresh, setSinceRefresh] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(REFRESH_SECONDS);

  const nextId = useRef(100);
  const sinceRef = useRef(0); // messages since the last re-post (avoids stale closures)
  const deadlineRef = useRef(0); // timestamp when the 15s timer fires
  const scrollRef = useRef<HTMLDivElement>(null);

  // Keep the channel scrolled to the bottom as content changes.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [feed, reposts]);

  const repost = () => {
    setFeed((f) => withGlueAtEnd(f));
    setGluedTime(nowTime());
    sinceRef.current = 0;
    setSinceRefresh(0);
    setSecondsLeft(REFRESH_SECONDS);
    setReposts((r) => r + 1);
  };

  // Time-based re-post: fire once 15s elapse while messages are pending.
  useEffect(() => {
    if (!glued) return;
    const t = setInterval(() => {
      if (sinceRef.current <= 0) return;
      const remaining = deadlineRef.current - Date.now();
      if (remaining <= 0) repost();
      else setSecondsLeft(Math.max(1, Math.ceil(remaining / 1000)));
    }, 250);
    return () => clearInterval(t);
  }, [glued]);

  const glue = () => {
    const text = draft.trim();
    if (!text) return;
    setGlued(text);
    setGluedTime(nowTime());
    setDraft("");
    sinceRef.current = 0;
    setSinceRefresh(0);
    setReposts(0);
    setSecondsLeft(REFRESH_SECONDS);
    setFeed((f) => withGlueAtEnd(f));
  };

  const sendChat = () => {
    const pick = POOL[Math.floor(Math.random() * POOL.length)];
    setFeed((f) => [...f, { kind: "msg", id: nextId.current++, time: nowTime(), ...pick }]);
    if (!glued) return;
    // Don't refresh instantly — accumulate toward 5 messages / 15 seconds.
    const n = sinceRef.current + 1;
    sinceRef.current = n;
    if (n === 1) deadlineRef.current = Date.now() + REFRESH_SECONDS * 1000;
    setSinceRefresh(n);
    if (n >= REFRESH_MESSAGES) repost();
  };

  const unglue = () => {
    setGlued(null);
    setFeed((f) => f.filter((i) => i.kind !== "glue"));
    sinceRef.current = 0;
    setSinceRefresh(0);
    setReposts(0);
  };

  const pending = glued !== null && sinceRefresh > 0;

  return (
    <div className="glass overflow-hidden rounded-3xl p-1.5">
      <div className="rounded-[20px] bg-background/40 p-5 sm:p-7">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h3 className="text-xl font-semibold sm:text-2xl">See it in action</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Glue a message, then send some chatter — it re-sticks to the bottom on its own.
            </p>
          </div>
          {reposts > 0 && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blurple/10 px-3 py-1 text-xs font-semibold text-blurple">
              <RefreshCw className="h-3.5 w-3.5" />
              Re-posted {reposts}×
            </span>
          )}
        </div>

        <DiscordPanel channel="demo-lounge" className="ring-1 ring-border">
          <div
            ref={scrollRef}
            className="max-h-[440px] min-h-[300px] space-y-4 overflow-y-auto pr-1"
          >
            {feed.map((item) =>
              item.kind === "msg" ? (
                <DiscordMessage key={item.id} name={item.name} color={item.color} time={item.time}>
                  {item.text}
                </DiscordMessage>
              ) : glued ? (
                <motion.div
                  key={`glue-${reposts}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="rounded-lg bg-blurple/[0.05] px-2.5 py-2 ring-1 ring-blurple/20"
                >
                  <BotMessage time={`Today at ${gluedTime}`} muted>
                    <p>{renderContent(glued)}</p>
                  </BotMessage>
                </motion.div>
              ) : null,
            )}

            {!glued && (
              <p className="rounded-lg border border-dashed border-border px-3 py-4 text-center text-xs text-muted-foreground">
                Nothing glued yet — type a message below and hit “Glue”.
              </p>
            )}
          </div>
        </DiscordPanel>

        {/* Controls */}
        <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
          <div className="flex flex-1 items-center gap-2 rounded-full border border-border bg-foreground/5 px-4 py-2 focus-within:border-blurple/50">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && glue()}
              placeholder="Type a message to glue…"
              className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
            <button
              onClick={glue}
              disabled={!draft.trim()}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-gradient-to-r from-[#5865F2] to-[#66C2FF] px-4 py-1.5 text-xs font-semibold text-white transition-opacity disabled:opacity-40"
            >
              <Send className="h-3.5 w-3.5" />
              Glue
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={sendChat}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-foreground/5 px-4 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-foreground/10"
            >
              <MessagesSquare className="h-4 w-4" />
              Send a chat message
            </button>
            {glued && (
              <button
                onClick={unglue}
                aria-label="Unglue"
                className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
              >
                <X className="h-4 w-4" />
                Unglue
              </button>
            )}
          </div>
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span>
            Re-posts after{" "}
            <span className="font-semibold text-foreground">{REFRESH_MESSAGES} messages</span> or{" "}
            <span className="font-semibold text-foreground">{REFRESH_SECONDS}s</span>, whichever is
            first — tunable per channel with{" "}
            <code className="rounded bg-code-bg px-1.5 py-0.5 font-mono text-code-fg">
              /refreshconfig
            </code>
            .
          </span>
          {pending && (
            <span className="shrink-0 font-medium text-blurple">
              {sinceRefresh}/{REFRESH_MESSAGES} messages · {secondsLeft}s left
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
