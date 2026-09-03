import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { posts } from "@/content/posts";
import { absoluteUrl, siteName } from "@/lib/site";
import { SiteFooter, SiteHeader } from "@/components/marketing/SiteChrome";

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

        <header className="mx-auto max-w-3xl text-center">
          <p className="rise text-sm font-medium uppercase tracking-wider text-accent">
            Writing
          </p>
          <h1 className="rise rise-1 mt-3 text-4xl font-semibold leading-[1.08] tracking-tight text-text-primary md:text-6xl">
            {TITLE}
          </h1>
          <p className="rise rise-2 mt-5 text-lg leading-relaxed text-text-secondary">
            {DESCRIPTION}
          </p>
        </header>

        <ul className="mx-auto mt-16 flex max-w-3xl flex-col gap-5">
          {posts.map((post) => (
            <li key={post.slug} className="reveal">
              <Link
                href={`/blog/${post.slug}`}
                className="group flex flex-col gap-3 rounded-[var(--radius-xl)] bg-surface p-6 shadow-sm transition-shadow hover:shadow-md md:p-8"
              >
                <div className="flex flex-wrap items-center gap-2 text-xs text-text-tertiary">
                  <time dateTime={post.published}>
                    {formatDate(post.published)}
                  </time>
                  <span aria-hidden>&middot;</span>
                  <span>{post.readingMinutes} minute read</span>
                  {post.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-accent-soft px-2.5 py-0.5 font-medium text-accent"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <h2 className="text-xl font-semibold tracking-tight text-text-primary md:text-2xl">
                  {post.title}
                </h2>
                <p className="max-w-3xl text-[0.9375rem] leading-relaxed text-text-secondary">
                  {post.description}
                </p>
                <span className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
                  Read it
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </span>
              </Link>
            </li>
          ))}
        </ul>
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
