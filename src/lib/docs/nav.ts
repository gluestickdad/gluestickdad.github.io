import type { LinkProps } from "@tanstack/react-router";

export type DocsPage = {
  title: string;
  to: LinkProps["to"];
  description: string;
};

export type DocsSection = {
  label: string;
  pages: DocsPage[];
};

/** Sidebar structure for the /docs section. */
export const DOCS_NAV: DocsSection[] = [
  {
    label: "Start Here",
    pages: [
      {
        title: "Overview",
        to: "/docs",
        description: "What Glue Stick does and where to find everything.",
      },
      {
        title: "Getting Started",
        to: "/docs/getting-started",
        description: "Invite the bot, verify permissions, and glue your first message.",
      },
    ],
  },
  {
    label: "Reference",
    pages: [
      {
        title: "Commands",
        to: "/docs/commands",
        description: "Every slash command with syntax, options, limits, and examples.",
      },
      {
        title: "Permissions",
        to: "/docs/permissions",
        description: "What each permission is used for and how to restrict commands.",
      },
      {
        title: "Configuration",
        to: "/docs/configuration",
        description: "How refresh triggers work and how to tune them per channel.",
      },
    ],
  },
  {
    label: "Help",
    pages: [
      {
        title: "FAQ",
        to: "/docs/faq",
        description: "Common questions and troubleshooting.",
      },
      {
        title: "Support",
        to: "/docs/support",
        description: "Get help, report bugs, and vote for Glue Stick.",
      },
    ],
  },
];

/** Flattened page list in sidebar order — drives the prev/next pager and search. */
export const DOCS_PAGES: DocsPage[] = DOCS_NAV.flatMap((s) => s.pages);
