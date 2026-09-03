import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getPost, posts, type Post } from "@/content/posts";
import { absoluteUrl, author, siteName } from "@/lib/site";
import { SiteFooter, SiteHeader } from "@/components/marketing/SiteChrome";
import { formatDate } from "@/app/blog/page";

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  const url = absoluteUrl(`/blog/${post.slug}`);
  return {
    title: post.metaTitle ?? post.title,
    description: post.description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: post.title,
      description: post.description,
      siteName,
      publishedTime: post.published,
      modifiedTime: post.updated ?? post.published,
      authors: [author.name],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const index = posts.findIndex((p) => p.slug === post.slug);
  const next = posts[index + 1] ?? posts[0];

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-5 py-14 md:px-8 md:py-20">
        <ArticleSchema post={post} />

        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-text-secondary transition-colors hover:text-text-primary"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          All writing
        </Link>

        <article className="mt-8">
          <header className="prose-measure">
            <div className="rise flex flex-wrap items-center gap-2 text-xs text-text-tertiary">
              <time dateTime={post.published}>{formatDate(post.published)}</time>
              <span aria-hidden>&middot;</span>
              <span>{post.readingMinutes} minute read</span>
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-accent-soft px-2.5 py-0.5 font-medium text-accent"
                >
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="rise rise-1 mt-4 text-3xl font-semibold leading-[1.12] tracking-tight text-text-primary md:text-5xl">
              {post.title}
            </h1>
          </header>

          <div className="prose-measure mt-8 flex flex-col gap-5">
            {post.intro.map((paragraph, i) => (
              <p
                key={i}
                className="rise rise-2 text-[1.0625rem] leading-[1.75] text-text-secondary"
              >
                {paragraph}
              </p>
            ))}
          </div>

          {post.sections.map((section) => (
            <section key={section.heading} className="prose-measure reveal mt-12">
              <h2 className="text-xl font-semibold tracking-tight text-text-primary md:text-2xl">
                {section.heading}
              </h2>
              <div className="mt-4 flex flex-col gap-5">
                {section.body.map((paragraph, i) => (
                  <p
                    key={i}
                    className="text-[1.0625rem] leading-[1.75] text-text-secondary"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
              {section.list && (
                <ul className="mt-5 flex flex-col gap-2.5">
                  {section.list.map((entry) => (
                    <li
                      key={entry}
                      className="flex gap-3 text-[1.0625rem] leading-[1.7] text-text-secondary"
                    >
                      <span
                        aria-hidden
                        className="mt-[0.65em] h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                      />
                      {entry}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}

          {post.faq && post.faq.length > 0 && (
            <section className="prose-measure reveal mt-14">
              <h2 className="text-xl font-semibold tracking-tight text-text-primary md:text-2xl">
                Questions
              </h2>
              <dl className="mt-6 overflow-hidden rounded-[var(--radius-xl)] bg-surface shadow-sm">
                {post.faq.map((entry, i) => (
                  <div key={entry.question}>
                    {i > 0 && <div className="ml-6 h-px bg-border-subtle" />}
                    <div className="px-6 py-5">
                      <dt className="font-medium text-text-primary">
                        {entry.question}
                      </dt>
                      <dd className="mt-1.5 text-[0.9375rem] leading-relaxed text-text-secondary">
                        {entry.answer}
                      </dd>
                    </div>
                  </div>
                ))}
              </dl>
            </section>
          )}
        </article>

        <aside className="reveal mt-16 rounded-[var(--radius-xl)] bg-surface p-7 shadow-md md:p-9">
          <h2 className="text-lg font-semibold tracking-tight text-text-primary">
            Try it while the idea is fresh
          </h2>
          <p className="mt-2 max-w-2xl text-[0.9375rem] leading-relaxed text-text-secondary">
            DoTo opens straight into a capture box. No account, no sign-up, and
            it works with the network switched off.
          </p>
          <Link
            href="/inbox"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-[0.9375rem] font-medium text-text-onAccent transition-colors hover:bg-accent-hover"
          >
            Open DoTo
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </aside>

        {next.slug !== post.slug && (
          <nav className="mt-10 border-t border-border-subtle pt-6">
            <p className="text-xs uppercase tracking-wider text-text-tertiary">
              Read next
            </p>
            <Link
              href={`/blog/${next.slug}`}
              className="group mt-2 inline-flex items-baseline gap-2 text-lg font-medium text-text-primary"
            >
              {next.title}
              <ArrowRight
                className="h-4 w-4 shrink-0 self-center text-accent transition-transform group-hover:translate-x-0.5"
                aria-hidden
              />
            </Link>
          </nav>
        )}
      </main>
      <SiteFooter />
    </>
  );
}

/**
 * Article for the piece itself, Person for the author, BreadcrumbList so the
 * path shows in results, and FAQPage where the post has questions. All built
 * from the post data, so nothing can describe content that is not on the page.
 */
function ArticleSchema({ post }: { post: Post }) {
  const url = absoluteUrl(`/blog/${post.slug}`);
  const graph: Record<string, unknown>[] = [
    {
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description,
      datePublished: post.published,
      dateModified: post.updated ?? post.published,
      inLanguage: "en",
      keywords: post.tags.join(", "),
      wordCount:
        post.intro.join(" ").split(/\s+/).length +
        post.sections.reduce(
          (total, s) =>
            total +
            s.body.join(" ").split(/\s+/).length +
            (s.list?.join(" ").split(/\s+/).length ?? 0),
          0
        ),
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      url,
      author: {
        "@type": "Person",
        name: author.name,
        alternateName: author.alias,
        url: author.website,
        jobTitle: author.role,
        sameAs: author.socials.map((s) => s.url),
      },
      publisher: {
        "@type": "Organization",
        name: author.company,
        url: author.companyUrl,
      },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: siteName,
          item: absoluteUrl("/"),
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Writing",
          item: absoluteUrl("/blog"),
        },
        { "@type": "ListItem", position: 3, name: post.title, item: url },
      ],
    },
  ];

  if (post.faq?.length) {
    graph.push({
      "@type": "FAQPage",
      mainEntity: post.faq.map((entry) => ({
        "@type": "Question",
        name: entry.question,
        acceptedAnswer: { "@type": "Answer", text: entry.answer },
      })),
    });
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }),
      }}
    />
  );
}
