/**
 * Post-build cleanup, run automatically by `bun run build`.
 *
 * The sitemap generator includes every crawled URL — including #hash links and
 * trailing-slash duplicates (e.g. /docs/) that the prerender filter already
 * skips. Strip those so each page has exactly one canonical sitemap entry,
 * and drop pages.json (internal build metadata Pages doesn't need).
 */
import { existsSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import path from "node:path";

const clientDir = path.resolve(import.meta.dir, "..", "dist", "client");
const sitemapPath = path.join(clientDir, "sitemap.xml");

const xml = readFileSync(sitemapPath, "utf8");
const kept: string[] = [];
let dropped = 0;

const cleaned = xml.replace(/<url>[\s\S]*?<\/url>/g, (block) => {
  const loc = /<loc>([^<]*)<\/loc>/.exec(block)?.[1] ?? "";
  const url = new URL(loc);
  const isHash = loc.includes("#");
  const isSlashDup = url.pathname.length > 1 && url.pathname.endsWith("/");
  if (isHash || isSlashDup) {
    dropped++;
    return "";
  }
  kept.push(loc);
  return block;
});

writeFileSync(sitemapPath, cleaned.replace(/\n\s*\n/g, "\n"));
console.log(`sitemap: kept ${kept.length} URLs, dropped ${dropped}`);

const pagesJson = path.join(clientDir, "pages.json");
if (existsSync(pagesJson)) {
  unlinkSync(pagesJson);
  console.log("removed pages.json");
}
