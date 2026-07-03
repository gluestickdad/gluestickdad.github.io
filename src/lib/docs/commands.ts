/**
 * Single source of truth for the /docs/commands reference. Kept faithful to
 * the real bot implementation in `../commands/*.js` — verify there before
 * changing any option, default, or limit.
 */

export type CommandOption = {
  name: string;
  type: "String" | "Boolean" | "Integer" | "Channel";
  required: boolean;
  default?: string;
  range?: string;
  description: string;
};

export type ModalField = {
  name: string;
  required: boolean;
  description: string;
};

export type CommandExample = {
  command: string;
  effect: string;
};

export type CommandGroup = "gluing" | "managing" | "utility";

export type CommandDoc = {
  slug: string;
  name: string;
  group: CommandGroup;
  summary: string;
  syntax: string;
  options?: CommandOption[];
  /** Fields of the pop-up form, for commands that open a modal. */
  modalFields?: ModalField[];
  /** Permissions the bot needs in the channel for this command to work. */
  botPermissions?: string[];
  limits?: string[];
  notes?: string[];
  examples?: CommandExample[];
};

export const COMMAND_GROUPS: { id: CommandGroup; label: string }[] = [
  { id: "gluing", label: "Gluing Messages" },
  { id: "managing", label: "Managing Glues" },
  { id: "utility", label: "Utility & Info" },
];

export const COMMAND_DOCS: CommandDoc[] = [
  // ------------------------------------------------------------- gluing
  {
    slug: "glue",
    name: "/glue",
    group: "gluing",
    summary: "Glue a single-line text message to the bottom of the current channel.",
    syntax: "/glue content:<message> [suppress_embeds:<True|False>]",
    options: [
      {
        name: "content",
        type: "String",
        required: true,
        description:
          "The message to glue. Line breaks are collapsed into spaces — use /gluepara for multi-line messages.",
      },
      {
        name: "suppress_embeds",
        type: "Boolean",
        required: false,
        default: "False",
        description: "Prevent Discord from expanding links in the message into embed previews.",
      },
    ],
    botPermissions: ["View Channel", "Send Messages", "Read Message History"],
    limits: [
      "Maximum 2,000 characters.",
      "One glued message per channel — gluing again replaces the existing one.",
    ],
    notes: [
      "The glued message is posted silently (no notification ping) unless it contains mentions.",
      "Custom server emojis are preserved.",
    ],
    examples: [
      {
        command: "/glue content:Welcome! Please read the rules in #rules before posting.",
        effect:
          "Glues the reminder to the bottom of the channel and keeps refreshing it as chat moves.",
      },
      {
        command: "/glue content:Vote for us: https://top.gg/... suppress_embeds:True",
        effect: "Glues the link without Discord rendering a large preview embed under it.",
      },
    ],
  },
  {
    slug: "gluepara",
    name: "/gluepara",
    group: "gluing",
    summary: "Glue a multi-line message using a pop-up form that preserves line breaks.",
    syntax: "/gluepara",
    modalFields: [
      {
        name: "Message content",
        required: true,
        description: "Multi-line text, up to 2,000 characters. Line breaks are kept as typed.",
      },
      {
        name: "Suppress link previews?",
        required: false,
        description:
          "Choose Yes to stop Discord expanding links into embed previews (default: No).",
      },
    ],
    botPermissions: ["View Channel", "Send Messages", "Read Message History"],
    limits: [
      "Maximum 2,000 characters.",
      "One glued message per channel — gluing again replaces the existing one.",
    ],
    notes: ["Use this instead of /glue whenever your message needs paragraphs or a list."],
    examples: [
      {
        command: "/gluepara",
        effect: "Opens the form; submitting glues the formatted multi-line message to the channel.",
      },
    ],
  },
  {
    slug: "glueembed",
    name: "/glueembed",
    group: "gluing",
    summary: "Glue a rich embed with its own title, description, accent color, and images.",
    syntax: "/glueembed",
    modalFields: [
      { name: "Title", required: false, description: "Embed title, up to 256 characters." },
      {
        name: "Description",
        required: false,
        description: "Embed body text, up to 4,000 characters. Line breaks are kept.",
      },
      {
        name: "Color",
        required: false,
        description: "Hex accent color in #RRGGBB form (default: #66C2FF).",
      },
      {
        name: "Thumbnail image",
        required: false,
        description: "Small image shown in the embed's top-right corner (file upload).",
      },
      {
        name: "Large image",
        required: false,
        description: "Full-width image shown under the description (file upload).",
      },
    ],
    botPermissions: ["View Channel", "Send Messages", "Read Message History", "Embed Links"],
    limits: [
      "At least one of title, description, thumbnail, or image is required.",
      "One glued message per channel — gluing again replaces the existing one.",
    ],
    notes: [
      "Uploaded images are re-hosted permanently, so the embed keeps working even after the original upload expires.",
    ],
    examples: [
      {
        command: "/glueembed",
        effect: "Opens the embed builder; submitting glues the finished embed to the channel.",
      },
    ],
  },

  // ----------------------------------------------------------- managing
  {
    slug: "editglue",
    name: "/editglue",
    group: "managing",
    summary: "Edit the glued message in the current channel without re-gluing it.",
    syntax: "/editglue",
    botPermissions: ["View Channel", "Send Messages", "Read Message History"],
    notes: [
      "Opens a pop-up form pre-filled with the current content — text form for text glues, the full embed builder for embed glues.",
      "For embed glues, leave the image fields blank to keep the existing images.",
      "The channel's refresh settings are preserved.",
    ],
    examples: [
      {
        command: "/editglue",
        effect:
          "Opens the editor for this channel's glued message; submitting updates it in place.",
      },
    ],
  },
  {
    slug: "unglue",
    name: "/unglue",
    group: "managing",
    summary: "Remove the glued message from a channel.",
    syntax: "/unglue [channel:<glued channel>]",
    options: [
      {
        name: "channel",
        type: "Channel",
        required: false,
        default: "current channel",
        description:
          "Which channel to unglue. Autocomplete only lists channels that currently have a glued message (threads are marked with 🧵).",
      },
    ],
    botPermissions: ["View Channel", "Send Messages", "Read Message History"],
    examples: [
      { command: "/unglue", effect: "Removes the glued message from the current channel." },
      {
        command: "/unglue channel:#announcements",
        effect: "Removes the glued message from #announcements without leaving your channel.",
      },
    ],
  },
  {
    slug: "listglues",
    name: "/listglues",
    group: "managing",
    summary: "List every glued message in the server.",
    syntax: "/listglues [show_glued_by:<True|False>]",
    options: [
      {
        name: "show_glued_by",
        type: "Boolean",
        required: false,
        default: "False",
        description:
          "Also show who glued each message. Requires Administrator or server ownership.",
      },
    ],
    notes: [
      "Results are paginated five per page with Previous/Next buttons (active for five minutes).",
      "Channels the bot can no longer view are footnoted rather than listed.",
      "Server-only — cannot be used in DMs.",
    ],
    examples: [
      { command: "/listglues", effect: "Shows every glued message with its channel and content." },
    ],
  },
  {
    slug: "clearallglues",
    name: "/clearallglues",
    group: "managing",
    summary: "Remove every glued message in the server at once.",
    syntax: "/clearallglues",
    notes: [
      "Shows a confirmation listing all affected channels before anything is deleted — nothing happens until you press Confirm.",
      "Like all glue commands, this is not permission-restricted by default. See the Permissions page to limit who can run it.",
    ],
    examples: [
      {
        command: "/clearallglues",
        effect: "Asks for confirmation, then removes the glued message from every channel.",
      },
    ],
  },
  {
    slug: "refreshconfig",
    name: "/refreshconfig",
    group: "managing",
    summary: "View or tune how quickly a channel's glued message refreshes.",
    syntax:
      "/refreshconfig [channel:<glued channel>] [messagecount:<5–50>] [refreshtime:<15–3600>]",
    options: [
      {
        name: "channel",
        type: "Channel",
        required: false,
        default: "current channel",
        description: "Which glued channel to configure (autocomplete lists glued channels only).",
      },
      {
        name: "messagecount",
        type: "Integer",
        required: false,
        default: "5",
        range: "5–50",
        description: "Number of new messages that immediately triggers a refresh.",
      },
      {
        name: "refreshtime",
        type: "Integer",
        required: false,
        default: "15",
        range: "15–3600 seconds",
        description: "Seconds after the first new message before the glue refreshes.",
      },
    ],
    notes: [
      "Run it with no options to see the channel's current settings.",
      "Settings are per channel, not server-wide.",
      "After changing settings, the very next message triggers an immediate refresh so you can see the effect.",
      "See the Configuration page for exactly how the two triggers interact.",
    ],
    examples: [
      { command: "/refreshconfig", effect: "Shows the current refresh settings for this channel." },
      {
        command: "/refreshconfig messagecount:10 refreshtime:60",
        effect:
          "Refreshes after 10 new messages, or 60 seconds after the first new message — whichever happens first.",
      },
    ],
  },

  // ------------------------------------------------------------ utility
  {
    slug: "permcheck",
    name: "/permcheck",
    group: "utility",
    summary: "Check Glue Stick's permissions in the current channel.",
    syntax: "/permcheck",
    notes: [
      "Shows a green/red checklist: View Channels, Send Messages, Message History, Manage Messages, Embed Links, Add Reactions, and Use External Emojis — plus Send Messages in Threads when run inside a thread.",
      "Run this first whenever a glue isn't behaving — missing permissions are the most common cause.",
      "Server-only — cannot be used in DMs.",
    ],
    examples: [
      {
        command: "/permcheck",
        effect: "Posts the permission checklist for the current channel.",
      },
    ],
  },
  {
    slug: "help",
    name: "/help",
    group: "utility",
    summary: "Show the in-Discord command overview with invite, support, and vote buttons.",
    syntax: "/help",
  },
  {
    slug: "invite",
    name: "/invite",
    group: "utility",
    summary: "Get the link to add Glue Stick to another server.",
    syntax: "/invite",
  },
  {
    slug: "vote",
    name: "/vote",
    group: "utility",
    summary: "Get the top.gg voting link — you can vote once every 12 hours.",
    syntax: "/vote",
  },
  {
    slug: "support",
    name: "/support",
    group: "utility",
    summary: "Get an invite to the Glue Stick support server.",
    syntax: "/support",
  },
  {
    slug: "ping",
    name: "/ping",
    group: "utility",
    summary: "Check the bot's response time and API latency.",
    syntax: "/ping",
  },
];
