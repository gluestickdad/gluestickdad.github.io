import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/site/LegalLayout";
import { SUPPORT_URL } from "@/lib/links";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/terms")({
  head: () =>
    seo({
      title: "Terms of Service — Glue Stick",
      description: "Terms governing use of the Glue Stick Discord bot.",
      path: "/terms",
    }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <LegalLayout title="Terms of Service" effectiveDate="June 20, 2026">
      <section>
        <h2>1. Acceptance of Terms</h2>
        <p>
          By inviting, accessing, or using the Glue Stick Discord bot ("the Service") in your
          server, you agree to be bound by these Terms of Service ("Terms"). If you do not agree to
          these Terms, you must not use the Service. We may update these Terms at any time, and your
          continued use of the Service constitutes acceptance of those changes.
        </p>
      </section>

      <section>
        <h2>2. Description of Service</h2>
        <p>
          Glue Stick is a utility bot for Discord that glues a chosen message to the bottom of a
          channel and keeps it visible by automatically re-posting it. The Service is provided "as
          is" and is subject to change, suspension, or termination at our discretion.
        </p>
      </section>

      <section>
        <h2>3. Privacy</h2>
        <p>
          Your use of the Service is also governed by our Privacy Policy, which is an integral part
          of these Terms and explains what we collect and how we use it. By using the Service, you
          also agree to that policy.
        </p>
      </section>

      <section>
        <h2>4. User Obligations and Conduct</h2>
        <ul>
          <li>
            <strong>Compliance:</strong> You must comply with{" "}
            <a href="https://discord.com/terms" target="_blank" rel="noreferrer">
              Discord's Terms of Service
            </a>{" "}
            and{" "}
            <a href="https://discord.com/guidelines" target="_blank" rel="noreferrer">
              Community Guidelines
            </a>{" "}
            at all times while using the Service.
          </li>
          <li>
            <strong>Lawful use:</strong> You agree not to use the Service for any purpose that is
            unlawful, harmful, or otherwise objectionable, including spamming, harassment, or the
            distribution of malicious content.
          </li>
          <li>
            <strong>Content responsibility:</strong> You are solely responsible for the content of
            messages you configure the bot to post. We do not endorse and are not responsible for
            any content posted by the bot at your direction.
          </li>
          <li>
            <strong>Permissions:</strong> You are responsible for granting the bot the permissions
            it needs to function. The bot cannot perform its duties without the required access.
          </li>
          <li>
            <strong>Reasonable use:</strong> You agree to use the Service reasonably and not to
            abuse its functionality through excessive commands, spam, or attempts to disrupt the
            Service.
          </li>
        </ul>
      </section>

      <section>
        <h2>5. Abuse and Enforcement</h2>
        <p>
          We reserve the right to investigate reports of abuse, harassment, or violations of these
          Terms. In doing so, we may share relevant user information with server administrators or
          other affected parties as outlined in our Privacy Policy. We may deny service, blacklist
          servers or users, suspend or terminate access, or remove glued content that we reasonably
          determine to be abusive, illegal, or in violation of these Terms.
        </p>
      </section>

      <section>
        <h2>6. Intellectual Property</h2>
        <p>
          The Service — including its name, branding, source code, and all associated materials — is
          the exclusive intellectual property of its developers. You may not copy, modify,
          distribute, or reverse-engineer the Service without express written permission. Content
          you submit via the bot remains yours; you grant us a limited license to store and re-post
          that content solely to operate the Service.
        </p>
      </section>

      <section>
        <h2>7. Service Availability and Modifications</h2>
        <p>
          We strive to maintain high availability but do not guarantee uninterrupted or error-free
          operation. The Service may be temporarily unavailable for maintenance, updates, or other
          reasons. We reserve the right to modify or discontinue features at any time without prior
          notice, and to implement usage limits or rate limiting to ensure fair access for all
          users.
        </p>
      </section>

      <section>
        <h2>8. Termination</h2>
        <p>
          You may stop using the Service at any time by removing the bot from your server. We may
          suspend or terminate access at our discretion, particularly for violations of these Terms
          or use we deem harmful to the Service or other users. Upon termination, data is handled in
          accordance with our Privacy Policy.
        </p>
      </section>

      <section>
        <h2>9. Disclaimer of Warranties &amp; Limitation of Liability</h2>
        <p>
          The Service is provided "as is" and "as available", without warranties of any kind,
          express or implied, including but not limited to merchantability, fitness for a particular
          purpose, and non-infringement. To the maximum extent permitted by law, the developers of
          Glue Stick shall not be liable for any direct, indirect, incidental, special,
          consequential, or exemplary damages — including, without limitation, loss of data, loss of
          profits, server disruption, or any other damages — arising out of or in connection with
          your use of, or inability to use, the Service, even if advised of the possibility of such
          damages. Your sole and exclusive remedy for dissatisfaction with the Service is to stop
          using it and remove the bot from your server.
        </p>
      </section>

      <section>
        <h2>10. Indemnification</h2>
        <p>
          You agree to indemnify and hold harmless the developers of Glue Stick from any claims,
          damages, liabilities, or expenses (including all legal fees) arising out of your use of
          the Service, your violation of these Terms, or your violation of any rights of another
          party.
        </p>
      </section>

      <section>
        <h2>11. Governing Law &amp; Disputes</h2>
        <p>
          These Terms are governed by and construed in accordance with applicable law, without
          regard to conflict-of-law principles. Any disputes arising from these Terms or your use of
          the Service will be resolved through the appropriate legal channels.
        </p>
      </section>

      <section>
        <h2>12. Contact</h2>
        <p>
          Questions about these Terms? Reach us via the{" "}
          <a href={SUPPORT_URL} target="_blank" rel="noreferrer">
            Glue Stick support server
          </a>
          .
        </p>
      </section>
    </LegalLayout>
  );
}
