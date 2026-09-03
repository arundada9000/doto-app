/**
 * Single source of truth for anything that needs an absolute URL: canonical
 * tags, the sitemap, and social card images. Override with NEXT_PUBLIC_SITE_URL
 * when building a preview deployment or moving to another domain.
 */
const PRODUCTION_ORIGIN = "https://doto-app.vercel.app";

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || PRODUCTION_ORIGIN
).replace(/\/+$/, "");

export const siteName = "DoTo";

export const siteTagline =
  "Capture it instantly. Organize it later. Finish it beautifully.";

export const siteDescription =
  "DoTo is a free, offline-first task and note app that opens straight into a capture box. Type a thought, press enter, and get on with your day. No account, no sync, no tracking: everything stays on your device.";

export function absoluteUrl(path = "/"): string {
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * The person behind the app, used for the credit on the landing page and for
 * the Person node in the structured data. Deliberately limited to details that
 * are already public: the phone number and the API keys from the source profile
 * have no place on a public page.
 */
export const author = {
  name: "Arun Neupane",
  alias: "arundada9000",
  role: "Frontend developer, CTO and Lead Architect at Sajilo Digital",
  location: "Butwal, Lumbini, Nepal",
  website: "https://arunneupane.vercel.app",
  email: "arunneupane0000@gmail.com",
  company: "Sajilo Digital Pvt. Ltd.",
  companyUrl: "https://sajilodigital.com.np",
  socials: [
    { label: "LinkedIn", url: "https://www.linkedin.com/in/arundada9000" },
    { label: "X", url: "https://x.com/arundada9000" },
    { label: "YouTube", url: "https://www.youtube.com/@arundada9000" },
    { label: "Instagram", url: "https://www.instagram.com/arundada9000" },
    { label: "Facebook", url: "https://www.facebook.com/arundada9000" },
  ],
} as const;
