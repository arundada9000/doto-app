import type { Metadata } from "next";
import { posts } from "@/content/posts";
import { absoluteUrl, siteName } from "@/lib/site";
import { SiteFooter, SiteHeader } from "@/components/marketing/SiteChrome";
import { BlogGrid } from "@/components/marketing/BlogGrid";

const TITLE = "Writing on capture, offline-first apps, and getting things done";
// Shorter, so the tab and the search result are not cut off mid-phrase.
const META_TITLE = "Writing on capture and offline-first apps";
const DESCRIPTION =
  "Articles on offline-first architecture, quick capture habits, local-first privacy, and using DoTo well. No newsletter, no sign-up.";

export const metadata: Metadata = {
  title: META_TITLE,
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl("/blog") },
  openGraph: {
    type: "website",
    url: absoluteUrl("/blog"),
    title: META_TITLE,
    description: DESCRIPTION,
    siteName,
  },
};

export default function BlogIndex() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-5 py-16 md:px-8 md:py-24">
        <BlogListSchema />

        <header className="ambient relative mx-auto max-w-3xl text-center">
          <p className="ios-rise text-sm font-medium uppercase tracking-wider text-accent">
            Writing
          </p>
          <h1 className="ios-rise ios-rise-1 mt-3 text-4xl font-semibold leading-[1.08] tracking-tight text-text-primary md:text-6xl">
            {TITLE}
          </h1>
          <p className="ios-rise ios-rise-2 mt-5 text-lg leading-relaxed text-text-secondary">
            {DESCRIPTION}
          </p>
        </header>

        <BlogGrid posts={posts} />
      </main>
      <SiteFooter />
    </>
  );
}

export function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** Lets an engine see the whole index as an ordered set rather than guessing. */
function BlogListSchema() {
  const graph = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `${siteName} writing`,
    description: DESCRIPTION,
    url: absoluteUrl("/blog"),
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description,
      datePublished: post.published,
      url: absoluteUrl(`/blog/${post.slug}`),
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}