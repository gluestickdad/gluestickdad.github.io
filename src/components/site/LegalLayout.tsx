import type { ReactNode } from "react";
import { SiteLayout } from "./Layout";

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
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[760px]">
          <h1 className="text-4xl font-bold sm:text-5xl">{title}</h1>
          <p className="mt-3 text-sm text-muted-foreground">Effective date: {effectiveDate}</p>
          <div className="mt-10 space-y-10 text-[15px] leading-relaxed text-foreground/85 [&_h2]:mt-2 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-foreground [&_p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-6 [&_a]:text-sky [&_a:hover]:underline [&_code]:rounded [&_code]:bg-code-bg [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.85em] [&_code]:text-code-fg">
            {children}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
