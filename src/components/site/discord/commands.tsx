import type { ReactNode } from "react";
import {
  BotMessage,
  DiscordButtons,
  DiscordEmbed,
  renderContent,
  BOT_AVATAR,
  type ModalField,
  type SlashOpt,
} from "./index";
import { INVITE_URL, SUPPORT_URL, VOTE_URL } from "@/lib/links";
import { ThemeBanner } from "@/components/site/ThemeBanner";

/**
 * Each command is a small script the CommandExplorer "plays" as a sequence of
 * actions: seed any pre-existing messages, type + send the command, open/fill a
 * modal, post replies, and — for the glue commands — flood the channel to show
 * it refresh. Kept faithful to the real bot in `commands/*.js`.
 */
export type Action =
  | { a: "seed"; node: ReactNode } // pre-existing message (instant)
  | { a: "seedGlue"; node: ReactNode } // pre-existing glued message (instant, tracked)
  | { a: "type" } // typewriter the command into the message bar
  | { a: "invoke" } // send -> show the slash invocation
  | { a: "modal"; title: string; fields: ModalField[]; submitLabel?: string }
  | { a: "msg"; node: ReactNode; ephemeral?: boolean }
  | { a: "glue"; node: ReactNode } // post a glued message (animated, tracked)
  | { a: "replaceGlue"; node: ReactNode } // delete tracked glue, post a new one
  | { a: "deleteGlue" } // animate-remove the tracked glue
  | { a: "flood"; count: number } // send `count` chat msgs, then refresh the glue
  | { a: "click"; label: string }; // "click" a button

export type CommandDef = {
  name: string; // "/glue"
  group: "core" | "utility";
  blurb: string;
  options?: SlashOpt[];
  script: Action[];
};

const B = ({ children }: { children: ReactNode }) => (
  <strong className="font-semibold text-foreground">{children}</strong>
);

const PERMS = [
  "View Channels",
  "Send Messages",
  "Message History",
  "Manage Messages",
  "Embed Links",
  "Add Message Reactions",
  "Use External Emojis",
];

function PermBlock() {
  return (
    <pre className="mt-1 overflow-x-auto rounded bg-code-bg p-2.5 font-mono text-[12px] leading-relaxed whitespace-pre-wrap text-foreground/80">
      {PERMS.map((p) => `${p}: 🟢`).join("\n")}
    </pre>
  );
}

const PARA = "📢 Weekly schedule\n• Mon — Game night\n• Wed — Movie watch\n• Fri — Community call";

const HELP_LIST = `/glue — Glue a message to a channel
/gluepara — Glue a multi-line message
/glueembed — Glue an embed message
/unglue — Remove a glued message
/editglue — Edit the currently glued message
/refreshconfig — Configure refresh settings
/listglues — List all glued messages
/clearallglues — Remove all glued messages
/invite · /vote · /support · /ping · /permcheck · /help`;

// Theme-aware banner used to show an image inside the /glueembed embed.
const EMBED_IMAGE = <ThemeBanner />;

/* ----------------------------------------------------- reusable messages */

const Glued = ({ time = "Today at 7:45 PM", children }: { time?: string; children: ReactNode }) => (
  <BotMessage time={time} muted>
    {children}
  </BotMessage>
);

export const COMMANDS: CommandDef[] = [
  {
    name: "/glue",
    group: "core",
    blurb: "Glue a message to a channel",
    options: [{ name: "content", value: "Welcome to the server!" }],
    script: [
      { a: "type" },
      { a: "invoke" },
      {
        a: "glue",
        node: (
          <Glued>
            <p>
              {renderContent("Welcome to the server! Read #rules and grab roles in #self-roles.")}
            </p>
          </Glued>
        ),
      },
      { a: "flood", count: 5 },
    ],
  },
  {
    name: "/gluepara",
    group: "core",
    blurb: "Glue a multi-line message",
    script: [
      { a: "type" },
      { a: "invoke" },
      {
        a: "modal",
        title: "Glue a Multi-Line Message",
        fields: [
          {
            label: "Message Content",
            paragraph: true,
            placeholder: "Type your multi-line message…",
            value: PARA,
          },
        ],
      },
      {
        a: "glue",
        node: (
          <Glued>
            <p className="whitespace-pre-line">{PARA}</p>
          </Glued>
        ),
      },
      { a: "flood", count: 5 },
    ],
  },
  {
    name: "/glueembed",
    group: "core",
    blurb: "Glue a rich embed",
    options: [{ name: "image", value: "banner.png" }],
    script: [
      { a: "type" },
      { a: "invoke" },
      {
        a: "modal",
        title: "Create Embed Message",
        fields: [
          { label: "Embed Title", placeholder: "Add a title", value: "🎉 Server Events" },
          {
            label: "Embed Description",
            paragraph: true,
            placeholder: "Add a description",
            value: "Everything happening this week — don't miss out!",
          },
          { label: "Embed Color (#RRGGBB)", placeholder: "#66C2FF", value: "#66C2FF" },
          { label: "Thumbnail URL", placeholder: "https://…", value: "glue-stick.jpeg" },
          { label: "Image URL", placeholder: "https://…", value: "banner.png" },
        ],
      },
      {
        a: "glue",
        node: (
          <Glued>
            <DiscordEmbed
              accent="#66C2FF"
              title="🎉 Server Events"
              description="Everything happening this week — don't miss out!"
              thumbnail={BOT_AVATAR}
              image={EMBED_IMAGE}
              fields={[
                { name: "When", value: "Fri · 8:00 PM UTC", inline: true },
                { name: "Where", value: renderContent("#events-voice"), inline: true },
              ]}
            />
          </Glued>
        ),
      },
      { a: "flood", count: 5 },
    ],
  },
  {
    name: "/editglue",
    group: "core",
    blurb: "Edit the glued message",
    script: [
      {
        a: "seedGlue",
        node: (
          <Glued time="Today at 7:30 PM">
            <p>{renderContent("Server rules: be kind, no spam, have fun!")}</p>
          </Glued>
        ),
      },
      { a: "type" },
      { a: "invoke" },
      {
        a: "msg",
        ephemeral: true,
        node: (
          <BotMessage time="Today">
            <p>Click the button below to open the editor for the glued message.</p>
            <DiscordButtons buttons={[{ label: "Edit Glued Message", style: "primary" }]} />
          </BotMessage>
        ),
      },
      { a: "click", label: "Edit Glued Message" },
      {
        a: "modal",
        title: "Edit Text Message",
        fields: [
          {
            label: "Message Content",
            paragraph: true,
            value: "Updated rules: be kind, no spam, and check #announcements!",
          },
        ],
      },
      {
        a: "replaceGlue",
        node: (
          <Glued>
            <p>{renderContent("Updated rules: be kind, no spam, and check #announcements!")}</p>
          </Glued>
        ),
      },
      {
        a: "msg",
        ephemeral: true,
        node: (
          <BotMessage time="Today">
            <p>Your Glued Message just got a makeover! Same channel, fresh vibes 💅</p>
          </BotMessage>
        ),
      },
    ],
  },
  {
    name: "/unglue",
    group: "core",
    blurb: "Remove a glued message",
    options: [{ name: "channel", value: "#rules" }],
    script: [
      {
        a: "seedGlue",
        node: (
          <Glued time="Today at 7:30 PM">
            <p>
              {renderContent("Welcome! Read #rules before posting and grab roles in #self-roles.")}
            </p>
          </Glued>
        ),
      },
      { a: "type" },
      { a: "invoke" },
      { a: "deleteGlue" },
      {
        a: "msg",
        ephemeral: true,
        node: (
          <BotMessage time="Today">
            <p>
              The glue holding the message in {renderContent("#rules")} has finally given up!. ☹
            </p>
          </BotMessage>
        ),
      },
    ],
  },
  {
    name: "/refreshconfig",
    group: "core",
    blurb: "Configure refresh timing",
    options: [{ name: "messagecount", value: "7" }],
    script: [
      {
        a: "seedGlue",
        node: (
          <Glued time="Today at 7:30 PM">
            <p>{renderContent("📌 Event tonight at 8 PM — react to join!")}</p>
          </Glued>
        ),
      },
      { a: "flood", count: 5 },
      { a: "type" },
      { a: "invoke" },
      {
        a: "msg",
        ephemeral: true,
        node: (
          <BotMessage time="Today">
            <p>
              Refresh settings updated for glued message in {renderContent("#general")}:
              <br />• Message Count: 7 messages (previously 5)
            </p>
            <p className="text-foreground/70">
              <B>How refresh works now:</B>
              <br />• Refreshes after 7 messages instead of 5
            </p>
          </BotMessage>
        ),
      },
      { a: "flood", count: 7 },
    ],
  },
  {
    name: "/listglues",
    group: "core",
    blurb: "List all glued messages",
    script: [
      { a: "type" },
      { a: "invoke" },
      {
        a: "msg",
        node: (
          <BotMessage time="Today">
            <DiscordEmbed
              accent="#0099ff"
              title="Glued messages in Cool Server"
              fields={[
                {
                  name: "1. Channel: #rules",
                  value: "Message: “Welcome! Read the rules.”",
                  inline: false,
                },
                {
                  name: "2. Channel: #announcements",
                  value: "Message: “Weekly schedule posted!”",
                  inline: false,
                },
                { name: "3. Channel: #welcome", value: "Message: “Say hi 👋”", inline: false },
              ]}
              footer="Page 1 of 1"
            />
            <DiscordButtons
              buttons={[
                { label: "Previous", style: "primary", disabled: true },
                { label: "Next", style: "primary", disabled: true },
              ]}
            />
          </BotMessage>
        ),
      },
    ],
  },
  {
    name: "/clearallglues",
    group: "core",
    blurb: "Remove all glued messages",
    script: [
      {
        a: "seedGlue",
        node: (
          <Glued time="Today at 7:30 PM">
            <p>{renderContent("Server rules: be kind, no spam, have fun!")}</p>
          </Glued>
        ),
      },
      { a: "type" },
      { a: "invoke" },
      {
        a: "msg",
        ephemeral: true,
        node: (
          <BotMessage time="Today">
            <p>
              <B>🚨 Adhesive Alert! 🚨</B>
              <br />
              <br />
              There are <B>3</B> glued messages in this server.
              <br />
              <br />
              Affected channels:
              <br />
              {renderContent("#rules")} {renderContent("#announcements")}{" "}
              {renderContent("#welcome")}
              <br />
              <br />
              Are you sure you want to unglue <B>all</B> glued messages?
            </p>
            <DiscordButtons
              buttons={[
                { label: "Confirm", style: "danger", emoji: "🧹" },
                { label: "Cancel", style: "secondary", emoji: "🛑" },
              ]}
            />
          </BotMessage>
        ),
      },
      { a: "click", label: "Confirm" },
      { a: "deleteGlue" },
      {
        a: "msg",
        ephemeral: true,
        node: (
          <BotMessage time="Today">
            <p>Successfully unglued 3 message(s). The channels are now adhesive-free! 🧼</p>
          </BotMessage>
        ),
      },
    ],
  },
  {
    name: "/help",
    group: "utility",
    blurb: "Browse all commands",
    script: [
      { a: "type" },
      { a: "invoke" },
      {
        a: "msg",
        node: (
          <BotMessage time="Today">
            <DiscordEmbed
              accent="#66C2FF"
              title="📌 Glue Stick Help"
              description="Here are the main commands and features of Glue Stick:"
              thumbnail={BOT_AVATAR}
              fields={[{ name: "Commands", value: HELP_LIST, inline: false }]}
              footer="For more detailed information, visit our support server."
            />
            <DiscordButtons
              buttons={[
                { label: "Invite Bot", emoji: "➕", href: INVITE_URL },
                { label: "Support Server", emoji: "🛠️", href: SUPPORT_URL },
                { label: "Vote on Top.gg", emoji: "🗳️", href: VOTE_URL },
              ]}
            />
          </BotMessage>
        ),
      },
    ],
  },
  {
    name: "/ping",
    group: "utility",
    blurb: "Latency & status",
    script: [
      { a: "type" },
      { a: "invoke" },
      {
        a: "msg",
        node: (
          <BotMessage time="Today">
            <DiscordEmbed
              accent="#00AE86"
              title="🏓 Pong!"
              description={"Response Time: 42ms\nAPI Latency: 88ms"}
            />
          </BotMessage>
        ),
      },
    ],
  },
  {
    name: "/permcheck",
    group: "utility",
    blurb: "Check bot permissions",
    script: [
      { a: "type" },
      { a: "invoke" },
      {
        a: "msg",
        node: (
          <BotMessage time="Today">
            <p>
              Glue Stick has the following permissions in this Channel ({renderContent("#general")}
              ):
            </p>
            <PermBlock />
            <p className="text-foreground/70">
              <B>
                Make sure that all of these are set to true in your server settings for Glue-Stick
                to function properly.
              </B>
            </p>
          </BotMessage>
        ),
      },
    ],
  },
  {
    name: "/invite",
    group: "utility",
    blurb: "Add the bot to a server",
    script: [
      { a: "type" },
      { a: "invoke" },
      {
        a: "msg",
        node: (
          <BotMessage time="Today">
            <DiscordEmbed
              accent="#66C2FF"
              title="Invite Glue Stick to Your Server! 🚀"
              description="Add Glue Stick to your Discord server and enjoy all its features!"
              thumbnail={BOT_AVATAR}
              fields={[
                {
                  name: "Why invite Glue Stick?",
                  value: "Enhance your server with our awesome features and commands!",
                  inline: false,
                },
                { name: "Quick invite", value: "Click here to invite", inline: false },
              ]}
              footer="Thanks for choosing Glue Stick!"
            />
            <DiscordButtons buttons={[{ label: "Invite Glue Stick", href: INVITE_URL }]} />
          </BotMessage>
        ),
      },
    ],
  },
  {
    name: "/support",
    group: "utility",
    blurb: "Join the support server",
    script: [
      { a: "type" },
      { a: "invoke" },
      {
        a: "msg",
        node: (
          <BotMessage time="Today">
            <DiscordEmbed
              accent="#66C2FF"
              title="Join the Glue Stick Support Server 🛠️"
              description="Need help or want to chat? Join our support server!"
              thumbnail={BOT_AVATAR}
              fields={[
                {
                  name: "Why join?",
                  value: "Get help, suggest features, and connect with other users!",
                  inline: false,
                },
                { name: "Quick access", value: "Click here to join", inline: false },
              ]}
              footer="We're here to help!"
            />
            <DiscordButtons buttons={[{ label: "Join Support Server", href: SUPPORT_URL }]} />
          </BotMessage>
        ),
      },
    ],
  },
  {
    name: "/vote",
    group: "utility",
    blurb: "Vote on top.gg",
    script: [
      { a: "type" },
      { a: "invoke" },
      {
        a: "msg",
        node: (
          <BotMessage time="Today">
            <DiscordEmbed
              accent="#66C2FF"
              title="Vote for Me! 🗳️"
              description={
                "Your support means the world to me! 💖\nClick the button below to vote."
              }
              thumbnail={BOT_AVATAR}
              fields={[
                {
                  name: "Why vote?",
                  value: "Voting helps more people discover and enjoy our bot!",
                  inline: false,
                },
                {
                  name: "Voting Cooldown",
                  value: "You can vote once every 12 hours.",
                  inline: false,
                },
              ]}
              footer="Thank you for your support!"
            />
            <DiscordButtons buttons={[{ label: "Vote Now", href: VOTE_URL }]} />
          </BotMessage>
        ),
      },
    ],
  },
];
