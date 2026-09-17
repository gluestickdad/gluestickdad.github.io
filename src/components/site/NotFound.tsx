import { Link } from "@tanstack/react-router";
import { SiteLayout } from "./Layout";
import { Container, MEASURE } from "./Container";
import { Button } from "@/components/ui/button";

/**
 * Shared by the router's notFoundComponent and the prerendered /404 route that
 * GitHub Pages serves for unknown URLs. Rendered inside SiteLayout so a lost
 * visitor still gets the nav, the footer and a way back — it used to render
 * bare, with nothing to click.
 */
export function NotFound() {
  return (
    <SiteLayout>
      <section className="py-24 lg:py-32">
        <Container>
          <div className={`${MEASURE.intro} text-center`}>
            <p className="font-display text-sm font-semibold tracking-wider text-accent-strong uppercase">
              Error 404
            </p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">Page not found</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              The page you're looking for doesn't exist or has been moved. The links below cover
              everything on the site.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg">
                <Link to="/">Go home</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/docs">Read the docs</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/commands">Browse commands</Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </SiteLayout>
  );
}
