import type { ReactNode } from "react";
import { SiteLayout } from "./Layout";
import { Container, MEASURE, SECTION } from "./Container";

export function LegalLayout({
  title,
  effectiveDate,
  children,
}: {
  title: string;
  effectiveDate: string;
  children: ReactNode;
}) {
  return (
    <SiteLayout>
      <section className={SECTION.base}>
        <Container>
          <div className={MEASURE.prose}>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{title}</h1>
            <p className="mt-3 text-sm text-muted-foreground">Effective date: {effectiveDate}</p>
            {/* Body typography comes from the shared prose-site utility in
                styles.css; only the link colour is set here. */}
            <div className="prose-site mt-10 space-y-10 [&_a:hover]:underline [&_a]:text-accent-strong">
              {children}
            </div>
          </div>
        </Container>
      </section>
    </SiteLayout>
  );
}
