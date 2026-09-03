import type { MetadataRoute } from "next";
import { posts } from "@/content/posts";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

/**
 * The landing page and the writing. App routes hold nothing but local data and
 * are excluded, so listing them would invite crawls of pages with no content.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const latest = posts[0]?.published;

  return [
    {
      url: absoluteUrl("/"),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: absoluteUrl("/blog"),
      lastModified: latest ? new Date(`${latest}T00:00:00Z`) : new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...posts.map((post) => ({
      url: absoluteUrl(`/blog/${post.slug}`),
      lastModified: new Date(`${post.updated ?? post.published}T00:00:00Z`),
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
  ];
}
