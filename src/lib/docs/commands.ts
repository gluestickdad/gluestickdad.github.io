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
  /** Discord offers suggestions as you type, rather than a picker. */
  autocomplete?: boolean;
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
  /** Ordered steps, for commands that run as a multi-step button flow. */
  flow?: string[];
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
      "Replacing a glue keeps the channel's refresh settings — you don't need to re-tune them.",
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
        name: "Message Content",
        required: true,
        description: "Multi-line text, up to 2,000 characters. Line breaks are kept as typed.",
      },
      {
        name: "Suppress link previews?",
        required: false,
        description:
          "A dropdown — pick “Yes — hide link previews” to stop Discord expanding links into embed previews (default: No).",
      },
    ],
    botPermissions: ["View Channel", "Send Messages", "Read Message History"],
    limits: [
      "Maximum 2,000 characters.",
      "One glued message per channel — gluing again replaces the existing one.",
    ],
    notes: [
      "Use this instead of /glue whenever your message needs paragraphs or a list.",
      "Replacing a glue keeps the channel's refresh settings.",
    ],
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
      {
        name: "Embed Title (max 256 characters)",
        required: false,
        description: "Bold heading shown at the top of the embed.",
      },
      {
        name: "Embed Description (max 4000 characters)",
        required: false,
        description: "Embed body text. Line breaks are kept as typed.",
      },
      {
        name: "Embed Color (hex code #RRGGBB)",
        required: false,
        description: "The colored stripe down the left edge (default: #66C2FF).",
      },
      {
        name: "Thumbnail Image (optional)",
        required: false,
        description:
          "Small image in the embed's top-right corner. Upload the file directly in the form — PNG, JPEG, GIF or WebP.",
      },
      {
        name: "Main Image (optional)",
        required: false,
        description:
          "Full-width image under the description. Upload the file directly in the form — PNG, JPEG, GIF or WebP.",
      },
    ],
    botPermissions: ["View Channel", "Send Messages", "Read Message History", "Embed Links"],
    limits: [
      "At least one of title, description, thumbnail, or image is required.",
      "Title 256 characters, description 4,000 — and 6,000 combined across the whole embed, which is Discord's own limit.",
      "Two images maximum: one thumbnail and one main image.",
      "Images up to 10 MB. Anything larger is scaled down to fit rather than rejected — never cropped.",
      "One glued message per channel — gluing again replaces the existing one.",
    ],
    notes: [
      "Images are uploaded inside the form, not pasted as links, and are re-hosted permanently — the embed keeps working long after a normal Discord upload link would expire.",
      "If an image is resized, the bot tells you the before and after size.",
      "If an image fails to upload, the whole command is cancelled and nothing is glued — so you never end up with a half-finished embed.",
      "Embeds support a title, description, color, thumbnail and main image. Footers, authors and custom fields aren't available.",
      "Replacing a glue keeps the channel's refresh settings.",
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
    flow: [
      "Run /editglue in the channel holding the glue. The bot replies privately with a row of buttons.",
      "Press “Edit Glued Message” to open a form pre-filled with the current content — a text form for text glues, the embed builder for embed glues.",
      "Embed glues with images get extra red buttons: “Remove Thumbnail”, “Remove Image”, and “Remove Both Images” when both slots are filled.",
      "Removing asks you to confirm first. Confirming reposts the glue without that image; “Cancel” leaves everything untouched.",
      "Each run makes one change. After a removal, run /editglue again for another round.",
    ],
    botPermissions: ["View Channel", "Send Messages", "Read Message History", "Embed Links"],
    limits: [
      "Same caps as the original glue: 2,000 characters for text, and 256 / 4,000 / 6,000 combined for embeds.",
    ],
    notes: [
      "Leaving an image field blank keeps the existing image. That's why removing one is a button rather than a form field — a blank field can't mean both “keep” and “delete”.",
      "The channel's refresh settings are preserved.",
      "If someone re-glues the channel while you have the editor open, your edit is refused rather than applied to the wrong message — just run /editglue again.",
      "An image that fails to upload won't block the edit: your text changes still land and the previous image is kept.",
      "Removing an image that would leave the embed completely empty is refused — add a title or description first, or use /unglue.",
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
        type: "String",
        required: false,
        default: "current channel",
        autocomplete: true,
        description:
          "Which channel to unglue. Start typing and Discord suggests only channels that currently have a glued message (threads are marked with 🧵).",
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
      "The list is posted publicly in the channel. Adding show_glued_by:true replies privately to you instead.",
      "Results are paginated five per page with Previous/Next buttons (active for five minutes), and only the person who ran the command can page through them.",
      "Long messages are previewed up to 750 characters.",
      "Channels the bot can no longer view are footnoted rather than listed.",
      "A glue the bot can no longer post in is flagged with a warning and the date it will be removed — a glue that stays broken for 7 days is retired automatically, so this is the place to catch one before it's gone.",
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
      "/refreshconfig [channel:<glued channel>] [messagecount:<5–500>] [refreshtime:<15–86400>]",
    options: [
      {
        name: "channel",
        type: "String",
        required: false,
        default: "current channel",
        autocomplete: true,
        description:
          "Which glued channel to configure. Start typing and Discord suggests glued channels only.",
      },
      {
        name: "messagecount",
        type: "Integer",
        required: false,
        default: "5",
        range: "5–500",
        description: "Number of new messages that immediately triggers a refresh.",
      },
      {
        name: "refreshtime",
        type: "Integer",
        required: false,
        default: "15",
        range: "15–86400 seconds",
        description:
          "Seconds after the first new message before the glue refreshes. The maximum is 24 hours.",
      },
    ],
    notes: [
      "Run it with no options to see the channel's current settings.",
      "Settings are per channel, not server-wide, and they survive re-gluing.",
      "Changing the time applies to the cycle already in progress — shortening it can make a waiting glue refresh right away.",
      "If the channel has already passed the new message count and the glue is buried, it refreshes immediately. A quiet channel is left alone.",
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
    notes: ["Posted publicly in the channel, silently — nobody gets a notification ping."],
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
    notes: [
      "When the bot is sharded, it also reports which shard your server is on plus fleet-wide totals.",
    ],
  },
];
