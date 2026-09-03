import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
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
