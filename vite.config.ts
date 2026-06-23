import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Vite config for the TanStack Start app.
// Plugin order matters: tsConfigPaths + tailwind first, tanstackStart before viteReact.
export default defineConfig({
  base: process.env.VITE_BASE_PATH ?? "/",
  plugins: [
    // Resolves the "@/*" path alias declared in tsconfig.json.
    tsConfigPaths(),
    // Tailwind CSS v4.
    tailwindcss(),
    // TanStack Start. MUST come before viteReact().
    // - server.entry points SSR at our custom wrapper (src/server.ts), which
    //   renders a friendly 500 page when h3 swallows an in-handler throw.
    // - prerender renders every route to static HTML at build time so the site
    //   can be served as static files on GitHub Pages. crawlLinks follows the
    //   Navbar/Footer <Link>s to reach /commands, /privacy and /terms.
    //
    // Build output: dist/client holds the prerendered static site (with the
    // public/ assets + .nojekyll); that folder is what the Pages workflow ships.
    tanstackStart({
      server: { entry: "./src/server.ts" },
      prerender: { enabled: true, crawlLinks: true },
    }),
    viteReact(),
  ],
});
