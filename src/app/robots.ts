import type { MetadataRoute } from "next";
import { absoluteUrl, siteUrlConfigured } from "@/lib/site";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  // Without a real origin the canonical URLs and this sitemap would point at a
  // placeholder, so crawling is refused outright rather than half-configured.
  if (!siteUrlConfigured) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // These render nothing but the person's own local data. There is no
      // content to index and no reason to crawl them.
      disallow: ["/inbox/", "/today/", "/completed/", "/settings/"],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
