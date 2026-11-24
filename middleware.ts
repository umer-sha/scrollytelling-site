import { NextResponse, type NextRequest } from "next/server";

/**
 * Anti-scraping layer (runs on Vercel's edge before any file is served).
 *  1. Known scraper / AI-training bots and scripted HTTP clients get 403 (search engines are allowed).
 *  2. /media/* (all photos + videos) is served only to pages of THIS site: no hotlinking, no direct
 *     address-bar opens, no cross-site embeds, no header-less scripts.
 * Add or remove bot names in BLOCKED_UA.
 */
const BLOCKED_UA =
  /(gptbot|chatgpt-user|oai-searchbot|ccbot|claudebot|claude-web|anthropic-ai|bytespider|perplexitybot|amazonbot|applebot-extended|diffbot|imagesiftbot|omgili|petalbot|semrush|ahrefs|mj12bot|dotbot|dataforseo|scrapy|httrack|webcopier|teleport|wget|curl\/|python-requests|python-urllib|aiohttp|httpx|go-http-client|java\/|okhttp|libwww|node-fetch|undici|axios|got \(|headlesschrome|phantomjs|puppeteer|playwright)/i;

const deny = (msg = "Forbidden") =>
  new NextResponse(msg, { status: 403, headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, noai, noimageai" } });

export function middleware(req: NextRequest) {
  const ua = req.headers.get("user-agent") ?? "";
  const { pathname } = req.nextUrl;
  const isMedia = pathname.startsWith("/media/");

  if (BLOCKED_UA.test(ua)) return deny();

  if (isMedia) {
    if (!ua) return deny();
    const dest = req.headers.get("sec-fetch-dest");
    const site = req.headers.get("sec-fetch-site");
    // opened directly / in a frame instead of used by a page
    if (dest && ["document", "iframe", "frame", "embed", "object"].includes(dest)) return deny();
    if (site) {
      if (site !== "same-origin" && site !== "same-site") return deny();
    } else {
      // older browsers: fall back to the Referer
      const ref = req.headers.get("referer");
      let ok = false;
      try {
        ok = !!ref && new URL(ref).host === req.headers.get("host");
      } catch {}
      if (!ok) return deny();
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt).*)"],
};
