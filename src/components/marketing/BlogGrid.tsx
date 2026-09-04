"use client";

import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { useMemo, useState } from "react";
import type { Post } from "@/content/posts";

const ALL = "All";

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

/**
 * Filterable blog list in the iOS grouped-list idiom: hairline separators,
 * rounded squircle card, press states. Filtering is instant over the whole
 * set, and the results cascade in with a spring.
 */
export function BlogGrid({ posts }: { posts: Post[] }) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(ALL);

  const tags = useMemo(() => {
    const set = new Set<string>();
    posts.forEach((p) => p.tags.forEach((t) => set.add(t)));
    return [ALL, ...Array.from(set)];
  }, [posts]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((p) => {
      const inTag = active === ALL || p.tags.includes(active);
      if (!inTag) return false;
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [posts, query, active]);

  return (
    <div className="mx-auto mt-12 max-w-3xl">
      <div className="flex flex-col gap-4">
        <label className="relative block">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary"
            aria-hidden
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search writing"
            className="w-full rounded-[calc(var(--radius-lg)*1.4)] border border-border-subtle bg-surface py-3 pl-11 pr-4 text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent focus:outline-none focus:ring-2 focus:ring-focus-ring"
          />
        </label>

        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setActive(tag)}
              className={`rounded-full px-3.5 py-1.5 text-sm transition-all press ${
                active === tag
                  ? "bg-accent font-medium text-text-onAccent shadow-sm"
                  : "border border-border-subtle bg-surface text-text-secondary hover:bg-hover hover:text-text-primary"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="mt-10 text-center text-sm text-text-tertiary">
          Nothing in writing matches that yet.
        </p>
      ) : (
        <ul className="mt-8 flex flex-col gap-4">
          {filtered.map((post, i) => (
            <li
              key={post.slug}
              className="motion-safe:animate-[ios-rise_680ms_cubic-bezier(0.16,1,0.3,1)_both] opacity-0"
              style={{ animationDelay: `${Math.min(i * 55, 480)}ms` }}
            >
              <Link
                href={`/blog/${post.slug}`}
                className="group flex flex-col gap-3 rounded-[calc(var(--radius-xl)*1.4)] border border-border-subtle bg-surface p-6 shadow-sm transition-transform press md:p-8"
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
      )}
    </div>
  );
}