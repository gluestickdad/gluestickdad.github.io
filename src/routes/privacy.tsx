import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/site/LegalLayout";
import { SUPPORT_URL } from "@/lib/links";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/privacy")({
  head: () =>
    seo({
      title: "Privacy Policy — Glue Stick",
      description: "How Glue Stick collects, uses, and protects data.",
      path: "/privacy",
    }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy" effectiveDate="June 20, 2026">
      <section>
        <h2>1. Introduction</h2>
        <p>
          This Privacy Policy describes how Glue Stick ("we", "us", or "the bot") collects, uses,
          and protects information when you use the Glue Stick Discord bot ("the Service"). By
          inviting or using Glue Stick, you agree to the collection and use of information in
          accordance with this policy.
        </p>
      </section>

      <section>
        <h2>2. Information We Collect</h2>
        <p>To provide and improve the Service, we collect the following types of information:</p>

        <h3>2.1 Data for bot functionality</h3>
        <p>
          This is the data required for Glue Stick to perform its core function of gluing messages
          in a channel. It includes:
        </p>
        <ul>
          <li>
            <strong>Server and channel information</strong> — the Discord server (guild) ID and
            channel ID, so the bot knows where to post and maintain glued messages.
          </li>
          <li>
            <strong>Message content</strong> — the text or embed content of the messages you ask the
            bot to glue, and the resulting message IDs.
          </li>
          <li>
            <strong>User information</strong> — the Discord user ID of the person who creates,
            edits, or removes a glued message, for administrative and support purposes.
          </li>
          <li>
            <strong>Per-channel configuration</strong> — settings such as the message-count or
            time-interval thresholds you set for re-posting.
          </li>
        </ul>
        <p>
          We also maintain a basic history of glued messages, including who created and removed
          them, to ensure accountability and to help resolve support-related queries.
        </p>

        <h3>2.2 Data for internal analytics</h3>
        <p>
          To understand how the bot is growing and to improve the Service, we collect general,
          non-personal information about the servers it is in. This data is for internal use only
          and includes:
        </p>
        <ul>
          <li>Aggregated server data, such as server name, member count, and region.</li>
          <li>Command usage patterns and feature-utilization statistics.</li>
        </ul>
        <p>
          We do not collect personal messages, direct messages, or user content beyond what you
          explicitly submit to the bot via a slash command.
        </p>
      </section>

      <section>
        <h2>3. How We Use Information</h2>
        <ul>
          <li>
            To deliver the core glue functionality (re-posting glued messages, edits, removal).
          </li>
          <li>To respect your per-channel refresh configuration.</li>
          <li>To respond to user inquiries and provide support.</li>
          <li>To diagnose issues, improve reliability, and generate usage analytics.</li>
          <li>To ensure the security of the Service and prevent abuse or misuse.</li>
        </ul>
      </section>

      <section>
        <h2>4. Information Sharing</h2>
        <p>
          We do not sell, rent, or trade your data, and we do not share it with advertisers. We may
          share information only in the following circumstances:
        </p>
        <ul>
          <li>When necessary to operate the Service (for example, hosting infrastructure).</li>
          <li>
            When required by law or to protect the rights and safety of the Service and its users.
          </li>
          <li>With your explicit consent.</li>
          <li>
            With server owners or administrators when they report abuse, misuse, or violations of
            server rules involving the bot.
          </li>
        </ul>
        <p>
          Outside of these cases, data is only accessible to the Glue Stick team for the purpose of
          operating the bot.
        </p>
      </section>

      <section>
        <h2>5. Data Retention and Deletion</h2>
        <p>
          We retain data for as long as it is necessary to provide the bot's functionality. Removing
          a glued message with <code>/unglue</code>, or clearing all glues with{" "}
          <code>/clearallglues</code>, deletes the associated content from our storage. When the bot
          is removed from a server, we begin deleting that server's associated data within a
          reasonable timeframe.
        </p>
      </section>

      <section>
        <h2>6. Data Security</h2>
        <p>
          We take reasonable measures to protect stored data, including restricted access, encrypted
          transport, and routine review of our hosting environment. However, no method of
          transmission or storage is completely secure, and we cannot guarantee absolute security —
          so we encourage you to glue only content you are comfortable storing.
        </p>
      </section>

      <section>
        <h2>7. Third-Party Services</h2>
        <p>
          Glue Stick runs on top of the Discord API and may interact with hosting and listing
          services (such as top.gg for voting). These services operate under their own privacy
          policies and terms, which govern their handling of data.
        </p>
      </section>

      <section>
        <h2>8. Age Requirement</h2>
        <p>
          The Service is intended for use on Discord and is subject to Discord's minimum age
          requirements. You should not use Glue Stick if you do not meet the minimum age to use
          Discord in your location.
        </p>
      </section>

      <section>
        <h2>9. Changes to This Policy</h2>
        <p>
          We may update this policy from time to time. Material changes will be announced in our
          support server, and the effective date above will be updated accordingly. Continued use of
          the Service after changes take effect constitutes acceptance of the updated policy.
        </p>
      </section>

      <section>
        <h2>10. Contact</h2>
        <p>
          For questions or data requests, please reach us via the{" "}
          <a href={SUPPORT_URL} target="_blank" rel="noreferrer">
            Glue Stick support server
          </a>
          .
        </p>
      </section>
    </LegalLayout>
  );
}
