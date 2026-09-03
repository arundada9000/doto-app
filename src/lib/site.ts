/**
 * Single source of truth for anything that needs an absolute URL: canonical
 * tags, the sitemap, and social card images.
 *
 * Set NEXT_PUBLIC_SITE_URL at build time to the real origin. The fallback keeps
 * builds working before a domain is chosen, and is deliberately obvious rather
 * than a plausible-looking address that could ship unnoticed.
 */
const FALLBACK_ORIGIN = "https://doto.example";

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || FALLBACK_ORIGIN
).replace(/\/+$/, "");

/** True once a real origin has been supplied, used to gate indexing. */
export const siteUrlConfigured = Boolean(process.env.NEXT_PUBLIC_SITE_URL);

export const siteName = "DoTo";

export const siteTagline =
  "Capture it instantly. Organize it later. Finish it beautifully.";

export const siteDescription =
  "DoTo is a free, offline-first task and note app that opens straight into a capture box. Type a thought, press enter, and get on with your day. No account, no sync, no tracking: everything stays on your device.";

export function absoluteUrl(path = "/"): string {
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}
