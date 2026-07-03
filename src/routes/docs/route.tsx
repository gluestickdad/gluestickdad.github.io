import { createFileRoute, Outlet } from "@tanstack/react-router";
import { DocsLayout } from "@/components/docs/DocsLayout";
import { SiteLayout } from "@/components/site/Layout";

/** Layout route: wraps every /docs page in the site chrome + docs shell. */
export const Route = createFileRoute("/docs")({
  component: DocsSection,
});

function DocsSection() {
  return (
    <SiteLayout>
      <DocsLayout>
        <Outlet />
      </DocsLayout>
    </SiteLayout>
  );
}
