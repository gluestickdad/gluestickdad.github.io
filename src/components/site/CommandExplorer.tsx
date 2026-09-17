import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Hash, Menu, Plus, RefreshCw, RotateCcw, Search, SmilePlus, X } from "lucide-react";
import {
  BotAvatar,
  DiscordMessage,
  DiscordModal,
  Ephemeral,
  SlashInvocation,
  type ModalField,
} from "./discord";
import { COMMANDS, type CommandDef } from "./discord/commands";
import { Skeleton } from "@/components/ui/skeleton";

/*
 * DESIGN-SYSTEM EXEMPTION, same as src/components/site/discord/.
 *
 * Everything inside the panel below — the server rail, command sidebar, channel
 * header and message bar — reproduces Discord's own window chrome, so it keeps
 * Discord's radii (rounded / rounded-[16px]) and type scale rather than the
 * site ramp. Only the OUTER shell (the glass rounded-2xl wrapper) follows the
 * system. Don't fold the inner chrome into the site's radius ramp.
 */

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/**
 * Holds the message shapes while a newly-picked command's script starts up.
 * Switching commands clears the chat and waits ~250ms before the first beat;
 * without this the panel flashes empty, which reads as a broken click.
 */
function ChatSkeleton() {
  return (
    <div className="space-y-4" aria-hidden>
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex gap-3">
          <Skeleton className="h-9 w-9 shrink-0 rounded-full" />
          <div className="min-w-0 flex-1 space-y-2 py-0.5">
            <Skeleton className="h-3 w-28" />
            <Skeleton className={i === 1 ? "h-3 w-3/5" : "h-3 w-4/5"} />
          </div>
        </div>
      ))}
    </div>
  );
}

const FLOOD = [
  { name: "Riley", color: "var(--discord-name-blue)", text: "just joined — this place is active!" },
  { name: "Kai", color: "var(--discord-name-green)", text: "gg everyone, that was close" },
  {
    name: "Noor",
    color: "var(--discord-name-purple)",
    text: "where do I get the event role again?",
  },
  { name: "Theo", color: "var(--discord-name-orange)", text: "lol nice clip 😂" },
  { name: "Vera", color: "var(--discord-name-pink)", text: "anyone got the patch notes?" },
  { name: "Dex", color: "var(--discord-name-teal)", text: "brb grabbing food" },
  { name: "Mara", color: "var(--discord-name-magenta)", text: "who's on for the event tonight?" },
];

type ChatItem = { id: number; node: ReactNode; ephemeral?: boolean; glue?: boolean };
type ModalState = {
  title: string;
  fields: ModalField[];
  submitLabel?: string;
  filled: boolean;
} | null;
type Caption = { text: string; spin?: boolean } | null;

const invocationText = (cmd: CommandDef) =>
  cmd.name +
  (cmd.options?.length ? "  " + cmd.options.map((o) => `${o.name}: ${o.value}`).join("  ") : "");

/** Final (non-animated) reduction of a script, used for SSR/first paint. */
function staticChat(cmd: CommandDef): ChatItem[] {
  let id = 0;
  const items: ChatItem[] = [];
  const removeGlue = () => {
    const idx = items.findIndex((x) => x.glue);
    if (idx >= 0) items.splice(idx, 1);
  };
  for (const ac of cmd.script) {
    if (ac.a === "seed") items.push({ id: id++, node: ac.node });
    else if (ac.a === "seedGlue" || ac.a === "glue")
      items.push({ id: id++, node: ac.node, glue: true });
    else if (ac.a === "invoke")
      items.push({ id: id++, node: <SlashInvocation command={cmd.name} options={cmd.options} /> });
    else if (ac.a === "msg") items.push({ id: id++, node: ac.node, ephemeral: ac.ephemeral });
    else if (ac.a === "replaceGlue") {
      removeGlue();
      items.push({ id: id++, node: ac.node, glue: true });
    } else if (ac.a === "deleteGlue") removeGlue();
  }
  return items;
}

/* --------------------------------------------------------------- sidebar */

const matches = (c: CommandDef, q: string) =>
  !q ||
  c.name.toLowerCase().includes(q.toLowerCase()) ||
  c.blurb.toLowerCase().includes(q.toLowerCase());

function Sidebar({
  query,
  setQuery,
  selected,
  onPick,
  className = "",
}: {
  query: string;
  setQuery: (q: string) => void;
  selected: string;
  onPick: (name: string) => void;
  className?: string;
}) {
  const core = COMMANDS.filter((c) => c.group === "core" && matches(c, query));
  const utility = COMMANDS.filter((c) => c.group === "utility" && matches(c, query));

  const Group = ({ label, items }: { label: string; items: CommandDef[] }) =>
    items.length === 0 ? null : (
      <div>
        <p className="px-2 pb-1 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <div className="space-y-0.5">
          {items.map((c) => (
            <button
              key={c.name}
              type="button"
              onClick={() => onPick(c.name)}
              // Without aria-current the selection is conveyed by background colour alone.
              aria-current={c.name === selected ? "true" : undefined}
              className={`flex w-full items-center gap-1.5 rounded px-2 py-1.5 text-left text-sm transition-colors ${
                c.name === selected
                  ? "bg-foreground/10 font-medium text-foreground"
                  : "text-foreground/65 hover:bg-foreground/5 hover:text-foreground"
              }`}
            >
              <span className="font-mono text-muted-foreground">/</span>
              <span className="truncate">{c.name.slice(1)}</span>
            </button>
          ))}
        </div>
      </div>
    );

  return (
    <div className={`flex flex-col bg-discord-elevated ${className}`}>
      <div className="flex items-center gap-2 border-b border-border/60 px-3.5 py-3 text-sm font-semibold text-foreground">
        <BotAvatar size={22} />
        Glue Stick
      </div>
      <div className="px-2.5 py-2.5">
        {/* The input is borderless, so the focus ring goes on the wrapper. */}
        <div className="flex items-center gap-1.5 rounded bg-discord-bg px-2 py-1.5 ring-1 ring-border focus-within:ring-2 focus-within:ring-ring">
          <Search className="h-3.5 w-3.5 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search commands"
            aria-label="Search commands"
            className="w-full bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto px-2 pb-4">
        <Group label="Core — Glue Management" items={core} />
        <Group label="Utility & Info" items={utility} />
        {core.length === 0 && utility.length === 0 && (
          /* aria-live: filtering to zero results is otherwise silent. */
          <p className="px-2 pt-2 text-xs text-muted-foreground" role="status">
            No commands match “{query}”.
          </p>
        )}
      </div>
    </div>
  );
}

/* --------------------------------------------------------------- explorer */

export function CommandExplorer() {
  const [selected, setSelected] = useState("/glue");
  const [query, setQuery] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const cmd = COMMANDS.find((c) => c.name === selected) ?? COMMANDS[0];

  const [chat, setChat] = useState<ChatItem[]>(() => staticChat(COMMANDS[0]));
  const [inputText, setInputText] = useState("");
  const [modal, setModal] = useState<ModalState>(null);
  const [caption, setCaption] = useState<Caption>(null);
  const [gen, setGen] = useState(0);

  const idRef = useRef(1000);
  const runRef = useRef(0);
  const glueRef = useRef<ReactNode>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const drawerRef = useRef<HTMLDivElement>(null);
  const drawerTriggerRef = useRef<HTMLButtonElement>(null);

  // The drawer is hand-rolled rather than a Radix Sheet, so Escape-to-close,
  // initial focus and focus restoration have to be wired up explicitly.
  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDrawerOpen(false);
    };
    document.addEventListener("keydown", onKey);
    // Move focus into the drawer so the next Tab stays in context.
    drawerRef.current?.querySelector<HTMLElement>("input, button")?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      drawerTriggerRef.current?.focus();
    };
  }, [drawerOpen]);

  // Keep the channel scrolled to the bottom as the script plays.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [chat, modal, caption]);

  const play = useCallback(async (c: CommandDef) => {
    const myRun = ++runRef.current;
    const dead = () => myRun !== runRef.current;
    const push = (item: Omit<ChatItem, "id">) =>
      setChat((prev) => [...prev, { id: idRef.current++, ...item }]);
    const dropGlue = () => setChat((prev) => prev.filter((x) => !x.glue));

    glueRef.current = null;
    setModal(null);
    setCaption(null);
    setInputText("");
    setChat([]);
    setGen((g) => g + 1);
    await sleep(250);
    if (dead()) return;

    for (const ac of c.script) {
      if (dead()) return;
      switch (ac.a) {
        case "seed":
          push({ node: ac.node });
          await sleep(220);
          break;
        case "seedGlue":
          glueRef.current = ac.node;
          push({ node: ac.node, glue: true });
          await sleep(450);
          break;
        case "type": {
          const text = invocationText(c);
          for (let i = 1; i <= text.length; i++) {
            if (dead()) return;
            setInputText(text.slice(0, i));
            await sleep(26);
          }
          await sleep(350);
          break;
        }
        case "invoke":
          setInputText("");
          push({ node: <SlashInvocation command={c.name} options={c.options} /> });
          await sleep(480);
          break;
        case "modal":
          setModal({
            title: ac.title,
            fields: ac.fields,
            submitLabel: ac.submitLabel,
            filled: false,
          });
          await sleep(750);
          if (dead()) return;
          setModal((m) => (m ? { ...m, filled: true } : m));
          await sleep(950);
          if (dead()) return;
          setModal(null);
          await sleep(400);
          break;
        case "msg":
          push({ node: ac.node, ephemeral: ac.ephemeral });
          await sleep(800);
          break;
        case "glue":
          glueRef.current = ac.node;
          push({ node: ac.node, glue: true });
          await sleep(850);
          break;
        case "replaceGlue":
          dropGlue();
          await sleep(450);
          if (dead()) return;
          glueRef.current = ac.node;
          push({ node: ac.node, glue: true });
          await sleep(750);
          break;
        case "deleteGlue":
          dropGlue();
          glueRef.current = null;
          await sleep(600);
          break;
        case "click":
          setCaption({ text: `Clicked “${ac.label}”` });
          await sleep(850);
          if (dead()) return;
          setCaption(null);
          await sleep(200);
          break;
        case "flood": {
          const n = ac.count;
          setCaption({ text: `Refreshes after ${n} messages · 0/${n}`, spin: true });
          for (let i = 0; i < n; i++) {
            if (dead()) return;
            const m = FLOOD[i % FLOOD.length];
            push({
              node: (
                <DiscordMessage name={m.name} color={m.color} time={`7:${46 + i} PM`}>
                  {m.text}
                </DiscordMessage>
              ),
            });
            setCaption({ text: `Refreshes after ${n} messages · ${i + 1}/${n}`, spin: true });
            await sleep(620);
          }
          if (dead()) return;
          await sleep(250);
          if (glueRef.current) {
            const node = glueRef.current;
            setChat((prev) => [
              ...prev.filter((x) => !x.glue),
              { id: idRef.current++, node, glue: true },
            ]);
          }
          setCaption({ text: "Refreshed to keep it visible" });
          await sleep(1100);
          if (dead()) return;
          setCaption(null);
          break;
        }
      }
    }
  }, []);

  // Auto-play whenever the selected command changes (and on mount).
  useEffect(() => {
    const c = COMMANDS.find((x) => x.name === selected) ?? COMMANDS[0];
    play(c);
    return () => {
      runRef.current++; // cancel an in-flight script on change/unmount
    };
  }, [selected, play]);

  const pick = (name: string) => {
    setSelected(name);
    setDrawerOpen(false);
  };

  return (
    <div className="glass relative overflow-hidden rounded-2xl">
      <div className="flex h-[600px] lg:h-[660px]">
        {/* Server rail (desktop) */}
        <div className="hidden w-14 shrink-0 flex-col items-center gap-3 bg-discord-elevated py-3 lg:flex">
          <div className="overflow-hidden rounded-[16px] ring-2 ring-primary">
            <BotAvatar size={40} />
          </div>
          <span className="h-0.5 w-7 rounded-full bg-foreground/15" />
          <span className="h-10 w-10 rounded-[16px] bg-foreground/10" />
          <span className="h-10 w-10 rounded-[16px] bg-foreground/10" />
        </div>

        {/* Command sidebar (desktop) */}
        <Sidebar
          query={query}
          setQuery={setQuery}
          selected={selected}
          onPick={pick}
          className="hidden w-60 shrink-0 border-r border-border/60 lg:flex"
        />

        {/* Main chat area */}
        <div className="flex min-w-0 flex-1 flex-col bg-discord-bg">
          <div className="flex items-center gap-2 border-b border-border/60 px-3 py-3 sm:px-4">
            <button
              type="button"
              ref={drawerTriggerRef}
              aria-label="Open command list"
              aria-expanded={drawerOpen}
              onClick={() => setDrawerOpen(true)}
              className="grid h-8 w-8 place-items-center rounded text-foreground/60 hover:bg-foreground/5 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <Hash className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-semibold text-foreground">commands-demo</span>
            <span className="ml-1 hidden truncate text-xs text-muted-foreground sm:inline">
              — how {cmd.name} runs
            </span>
            <button
              type="button"
              onClick={() => play(cmd)}
              className="ml-auto inline-flex shrink-0 items-center gap-1.5 rounded-full bg-foreground/5 px-3 py-1.5 text-xs font-medium text-foreground/70 transition-colors hover:bg-foreground/10"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Replay
            </button>
          </div>

          {/* Chat (scrolls) + modal overlay.
              aria-hidden: this is an animated picture of Discord, not real
              content. A flood injects a dozen fake messages a second apart,
              which is unusable noise for a screen reader — and /docs/commands
              is the accessible equivalent, linked from this page. The sr-only
              line below is the replacement description. */}
          <div className="relative flex-1 overflow-hidden">
            <p className="sr-only" role="status">
              Animated demo of {cmd.name}: {cmd.blurb}. For a text description of every command, see
              the command reference in the docs.
            </p>
            <div ref={scrollRef} aria-hidden="true" className="h-full overflow-y-auto p-4 sm:p-5">
              {chat.length === 0 && <ChatSkeleton />}
              <div key={gen} className="space-y-4">
                <AnimatePresence initial={false}>
                  {chat.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -16, transition: { duration: 0.28 } }}
                      transition={{ duration: 0.25 }}
                      className={
                        item.glue
                          ? "rounded-lg bg-primary/[0.05] px-2.5 py-2 ring-1 ring-primary/20"
                          : ""
                      }
                    >
                      {item.glue ? (
                        item.node
                      ) : item.ephemeral ? (
                        <Ephemeral>{item.node}</Ephemeral>
                      ) : (
                        item.node
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>

                {caption && (
                  <div className="flex justify-center pt-1">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-accent-strong">
                      {caption.spin && <RefreshCw className="h-3.5 w-3.5 animate-spin" />}
                      {caption.text}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <AnimatePresence>
              {modal && (
                <motion.div
                  className="absolute inset-0 z-10 grid place-items-center bg-black/40 p-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div
                    initial={{ scale: 0.96, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.96, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <DiscordModal
                      title={modal.title}
                      fields={modal.fields}
                      submitLabel={modal.submitLabel}
                      filled={modal.filled}
                    />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Message bar (shows the command being typed) */}
          <div className="border-t border-border/60 p-3">
            <div className="flex items-center gap-2 rounded-lg bg-discord-elevated px-3 py-2.5">
              <Plus className="h-4 w-4 shrink-0 text-muted-foreground" />
              <div className="min-w-0 flex-1 truncate text-sm">
                {inputText ? (
                  <span className="font-mono text-foreground/90">
                    {inputText}
                    <span className="ml-px animate-pulse">|</span>
                  </span>
                ) : (
                  <span className="text-muted-foreground">Message #commands-demo</span>
                )}
              </div>
              <SmilePlus className="ml-auto h-4 w-4 shrink-0 text-muted-foreground" />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile slide-over command list */}
      <AnimatePresence>
        {drawerOpen && (
          <motion.div
            className="absolute inset-0 z-20 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label="Command list"
          >
            {/* Backdrop is presentational — Escape and the Close button are the
                keyboard-accessible ways out (see the keydown effect above). */}
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setDrawerOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              ref={drawerRef}
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "tween", duration: 0.2 }}
              className="absolute inset-y-0 left-0 w-64"
            >
              <Sidebar
                query={query}
                setQuery={setQuery}
                selected={selected}
                onPick={pick}
                className="h-full"
              />
              <button
                type="button"
                aria-label="Close"
                onClick={() => setDrawerOpen(false)}
                className="absolute right-2 top-3 grid h-8 w-8 place-items-center rounded text-foreground/60 hover:bg-foreground/10"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
