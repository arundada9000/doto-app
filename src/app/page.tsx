import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  Zap,
  WifiOff,
  ShieldCheck,
  Keyboard,
  Repeat,
  Search,
  Bell,
  Palette,
  ArrowRight,
  Hash,
  Clock,
} from "lucide-react";
import { FAQ } from "@/lib/faq";
import { posts } from "@/content/posts";
import {
  absoluteUrl,
  author,
  siteDescription,
  siteName,
  siteTagline,
} from "@/lib/site";
import { SiteFooter, SiteHeader } from "@/components/marketing/SiteChrome";

const TITLE = "DoTo: the offline-first capture app for tasks and notes";

export const metadata: Metadata = {
  title: TITLE,
  description: siteDescription,
  alternates: { canonical: absoluteUrl("/") },
  openGraph: {
    type: "website",
    url: absoluteUrl("/"),
    title: TITLE,
    description: siteDescription,
    siteName,
  },
};

const STATS = [
  { value: "0", label: "accounts to create" },
  { value: "100%", label: "of your data on device" },
  { value: "16", label: "themes to choose from" },
  { value: "1", label: "keystroke to capture" },
];

const FEATURES = [
  {
    icon: Zap,
    title: "Capture in one keystroke",
    body: "Ctrl+K opens a focused box from anywhere. Type a thought, press enter, and it is saved. Nothing else is required before it lands.",
  },
  {
    icon: Repeat,
    title: "Understands plain language",
    body: "Call Ram tomorrow at 10 becomes a task with a date and a time. Every monday makes it repeat. Buy milk just saves.",
  },
  {
    icon: WifiOff,
    title: "Works with no connection",
    body: "Everything lives in your browser and the app caches itself, so it opens on a plane exactly as it does at your desk.",
  },
  {
    icon: ShieldCheck,
    title: "No account, no tracking",
    body: "There is no server to sign in to and no analytics in the app. Export a backup whenever you like, or erase everything in one action.",
  },
  {
    icon: Keyboard,
    title: "Built for the keyboard",
    body: "Move with J and K, complete with space, undo with Ctrl+Z. Every gesture has a keyboard route, and every action has a visible one.",
  },
  {
    icon: Search,
    title: "Search across everything",
    body: "Titles, notes, tags, links, checklist entries, and attachment names, filtered as you type and navigable with the arrow keys.",
  },
  {
    icon: Bell,
    title: "Reminders and repeats",
    body: "Due dates, times, reminders, and recurring tasks that create their next occurrence the moment you finish the last one.",
  },
  {
    icon: Palette,
    title: "Sixteen themes",
    body: "Every colour, font, and radius is a design token, so themes swap instantly and the app stays legible in all of them.",
  },
];

const STEPS = [
  { title: "Think", body: "Something occurs to you in the middle of something else." },
  { title: "Capture", body: "One keystroke, a few words, done. No list to choose." },
  { title: "Forget", body: "It is in the Inbox. Stop holding it in your head." },
  { title: "Finish", body: "Return when it matters, and tick it off." },
];

export default function LandingPage() {
  return (
    <>
      <SiteHeader />
      <StructuredData />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border-subtle">
          <div
            aria-hidden
            className="hero-grid pointer-events-none absolute inset-0 opacity-70"
          />
          <div className="relative mx-auto w-full max-w-6xl px-5 pb-16 pt-16 md:px-8 md:pb-24 md:pt-28">
            <p className="rise inline-flex items-center gap-2 rounded-full border border-border-subtle bg-surface px-3.5 py-1.5 text-xs font-medium text-text-secondary">
              <span className="h-1.5 w-1.5 rounded-full bg-secondary-color" />
              Free, offline-first, no account
            </p>

            <h1 className="rise rise-1 mt-6 max-w-4xl text-[clamp(2.5rem,7vw,5rem)] font-semibold leading-[1.02] tracking-[-0.03em] text-text-primary">
              Capture it instantly.
              <br />
              <span className="text-text-tertiary">Organize it later.</span>
              <br />
              Finish it beautifully.
            </h1>

            <p className="rise rise-2 mt-7 max-w-2xl text-lg leading-relaxed text-text-secondary md:text-xl">
              {siteName} is a task and note app that opens straight into a
              capture box. Put a thought down in one keystroke and stop carrying
              it. Everything stays on your device.
            </p>

            <div className="rise rise-3 mt-9 flex flex-wrap items-center gap-3">
              <Link
                href="/inbox"
                className="inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-accent px-6 py-3.5 text-[0.9375rem] font-medium text-text-onAccent transition-colors hover:bg-accent-hover"
              >
                Open DoTo
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link
                href="/blog/install-doto-as-an-app"
                className="rounded-[var(--radius-md)] border border-border-subtle bg-surface px-6 py-3.5 text-[0.9375rem] font-medium text-text-primary transition-colors hover:border-border-strong"
              >
                Install as an app
              </Link>
            </div>

            <div className="rise rise-4 mt-16 drift">
              <div className="overflow-hidden rounded-[var(--radius-xl)] border border-border-subtle bg-surface shadow-lg">
                <Image
                  src="/screenshots/today-wide.png"
                  alt="The DoTo Today view, showing the day's progress ring, a streak, an overdue task, and the tasks still due"
                  width={1600}
                  height={820}
                  priority
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="border-b border-border-subtle bg-surface">
          <dl className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-px overflow-hidden px-5 py-10 md:grid-cols-4 md:px-8">
            {STATS.map((stat) => (
              <div key={stat.label} className="reveal px-2">
                <dt className="text-3xl font-semibold tracking-tight text-text-primary md:text-4xl">
                  {stat.value}
                </dt>
                <dd className="mt-1 text-sm text-text-tertiary">{stat.label}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Capture demo */}
        <section
          className="mx-auto w-full max-w-6xl px-5 py-20 md:px-8 md:py-28"
          aria-labelledby="capture"
        >
          <div className="grid gap-12 md:grid-cols-[1fr_1.1fr] md:items-center">
            <div className="reveal">
              <p className="text-sm font-medium uppercase tracking-wider text-accent">
                Capture
              </p>
              <h2
                id="capture"
                className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-text-primary md:text-[2.75rem]"
              >
                Type the sentence. Keep the structure.
              </h2>
              <p className="mt-5 text-[1.0625rem] leading-relaxed text-text-secondary">
                A due date is fastest when you never open a picker. DoTo reads
                what it recognises out of the line you already typed and leaves
                the rest as the title.
              </p>
              <p className="mt-4 text-[1.0625rem] leading-relaxed text-text-secondary">
                It is a convenience, never a requirement. Type{" "}
                <span className="font-medium text-text-primary">Buy milk</span>{" "}
                and you get a task called Buy milk.
              </p>
              <Link
                href="/blog/natural-language-dates"
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
              >
                What it understands
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>

            <div className="reveal rounded-[var(--radius-lg)] border border-border-subtle bg-surface p-6 md:p-8">
              <p className="text-xs uppercase tracking-wider text-text-tertiary">
                You type
              </p>
              <p className="mt-3 font-mono text-lg text-text-primary md:text-xl">
                Call Ram tomorrow at 10 #work
              </p>

              <div className="my-7 h-px bg-border-subtle" />

              <p className="text-xs uppercase tracking-wider text-text-tertiary">
                DoTo saves
              </p>
              <div className="mt-4 flex items-start gap-3">
                <span
                  aria-hidden
                  className="mt-0.5 h-6 w-6 shrink-0 rounded-full border-2 border-border-strong"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-[0.9375rem] text-text-primary">Call Ram</p>
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    <Chip icon={<Clock className="h-3 w-3" />}>
                      Tomorrow, 10:00
                    </Chip>
                    <Chip icon={<Hash className="h-3 w-3" />}>work</Chip>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Steps */}
        <section
          className="border-y border-border-subtle bg-surface"
          aria-labelledby="how"
        >
          <div className="mx-auto w-full max-w-6xl px-5 py-20 md:px-8 md:py-24">
            <h2
              id="how"
              className="reveal max-w-2xl text-3xl font-semibold tracking-tight text-text-primary md:text-[2.75rem]"
            >
              The whole idea, in four moves
            </h2>
            <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {STEPS.map((step, i) => (
                <li key={step.title} className="reveal">
                  <span className="text-xs font-semibold tabular-nums text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-3 text-lg font-medium text-text-primary">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-[0.9375rem] leading-relaxed text-text-secondary">
                    {step.body}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Features */}
        <section
          className="mx-auto w-full max-w-6xl px-5 py-20 md:px-8 md:py-28"
          aria-labelledby="features"
        >
          <h2
            id="features"
            className="reveal max-w-2xl text-3xl font-semibold tracking-tight text-text-primary md:text-[2.75rem]"
          >
            Small on the surface, complete underneath
          </h2>
          <div className="mt-12 grid gap-px overflow-hidden rounded-[var(--radius-lg)] border border-border-subtle bg-border-subtle sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map(({ icon: Icon, title, body }) => (
              <article key={title} className="reveal bg-surface p-6">
                <Icon className="h-5 w-5 text-accent" aria-hidden />
                <h3 className="mt-4 text-[0.9375rem] font-medium text-text-primary">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                  {body}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* Screens */}
        <section
          className="border-y border-border-subtle bg-surface"
          aria-labelledby="screens"
        >
          <div className="mx-auto w-full max-w-6xl px-5 py-20 md:px-8 md:py-24">
            <div className="reveal max-w-2xl">
              <h2
                id="screens"
                className="text-3xl font-semibold tracking-tight text-text-primary md:text-[2.75rem]"
              >
                Made to be lived in
              </h2>
              <p className="mt-4 text-[1.0625rem] leading-relaxed text-text-secondary">
                Every surface uses the same design tokens, so a theme change is
                one attribute and the app stays legible in all sixteen.
              </p>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              <Screen
                src="/screenshots/inbox-narrow.png"
                alt="The DoTo Inbox on a phone, showing captured tasks and the bottom navigation"
                caption="The Inbox, where everything lands"
              />
              <Screen
                src="/screenshots/capture-narrow.png"
                alt="Quick Capture open over the Inbox, showing a parsed date and tag"
                caption="Quick Capture, reading the line as you type"
              />
            </div>
          </div>
        </section>

        {/* Privacy */}
        <section
          className="mx-auto w-full max-w-6xl px-5 py-20 md:px-8 md:py-28"
          aria-labelledby="privacy"
        >
          <div className="reveal max-w-4xl">
            <p className="text-sm font-medium uppercase tracking-wider text-accent">
              Privacy
            </p>
            <h2
              id="privacy"
              className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-text-primary md:text-[2.75rem]"
            >
              Your list never leaves the device it was written on.
            </h2>
            <p className="mt-6 text-[1.0625rem] leading-relaxed text-text-secondary">
              {siteName} has no server. Your tasks, notes, and attachments are
              held in your browser&apos;s own storage, and the app works with the
              network switched off. There is no sign-in, no analytics, and no
              advertising code. Export everything to a single file whenever you
              want it elsewhere, and erase all of it from Settings without asking
              anyone.
            </p>
            <Link
              href="/blog/local-first-privacy"
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
            >
              Why this matters more than it sounds
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </section>

        {/* Writing */}
        <section
          className="border-y border-border-subtle bg-surface"
          aria-labelledby="writing"
        >
          <div className="mx-auto w-full max-w-6xl px-5 py-20 md:px-8 md:py-24">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2
                id="writing"
                className="reveal text-3xl font-semibold tracking-tight text-text-primary md:text-[2.75rem]"
              >
                Writing
              </h2>
              <Link
                href="/blog"
                className="text-sm font-medium text-accent hover:underline"
              >
                All articles
              </Link>
            </div>
            <ul className="mt-10 grid gap-6 md:grid-cols-3">
              {posts.slice(0, 3).map((post) => (
                <li key={post.slug} className="reveal">
                  <Link href={`/blog/${post.slug}`} className="group block">
                    <p className="text-xs text-text-tertiary">
                      {post.readingMinutes} minute read
                    </p>
                    <h3 className="mt-2 text-lg font-medium leading-snug text-text-primary">
                      {post.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                      {post.description}
                    </p>
                    <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
                      Read it
                      <ArrowRight
                        className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                        aria-hidden
                      />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Maker */}
        <section
          className="mx-auto w-full max-w-6xl px-5 py-20 md:px-8 md:py-24"
          aria-labelledby="maker"
        >
          <div className="reveal grid gap-10 rounded-[var(--radius-lg)] border border-border-subtle bg-surface p-8 md:grid-cols-[1.3fr_1fr] md:p-12">
            <div>
              <p className="text-sm font-medium uppercase tracking-wider text-accent">
                Built by
              </p>
              <h2
                id="maker"
                className="mt-3 text-2xl font-semibold tracking-tight text-text-primary md:text-3xl"
              >
                {author.name}
              </h2>
              <p className="mt-4 text-[1.0625rem] leading-relaxed text-text-secondary">
                {author.role}, based in {author.location}. Self-taught, working
                mostly in React, Next.js, and TypeScript, on systems that solve
                local problems: offline-first disaster reporting, case management
                for the Nepal Police, and a WebAuthn platform for a national NGO.
              </p>
              <p className="mt-4 text-[1.0625rem] leading-relaxed text-text-secondary">
                DoTo came out of the same interest as the rest of it. An app that
                works with no signal, keeps your data yours, and does not ask for
                an account before it will accept a sentence.
              </p>
            </div>

            <div className="flex flex-col gap-3 md:border-l md:border-border-subtle md:pl-10">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">
                Elsewhere
              </h3>
              <a
                href={author.website}
                rel="noopener noreferrer"
                className="text-[0.9375rem] font-medium text-text-primary transition-colors hover:text-accent"
              >
                Portfolio
              </a>
              {author.socials.map((social) => (
                <a
                  key={social.label}
                  href={social.url}
                  rel="noopener noreferrer"
                  className="text-[0.9375rem] text-text-secondary transition-colors hover:text-accent"
                >
                  {social.label}
                </a>
              ))}
              <a
                href={`mailto:${author.email}`}
                className="mt-2 text-[0.9375rem] text-text-secondary transition-colors hover:text-accent"
              >
                {author.email}
              </a>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section
          className="border-t border-border-subtle bg-surface"
          aria-labelledby="faq"
        >
          <div className="mx-auto w-full max-w-6xl px-5 py-20 md:px-8 md:py-24">
            <h2
              id="faq"
              className="reveal text-3xl font-semibold tracking-tight text-text-primary md:text-[2.75rem]"
            >
              Common questions
            </h2>
            <dl className="mt-10 grid gap-x-12 md:grid-cols-2">
              {FAQ.map((entry) => (
                <div
                  key={entry.question}
                  className="reveal border-t border-border-subtle py-6"
                >
                  <dt className="font-medium text-text-primary">
                    {entry.question}
                  </dt>
                  <dd className="mt-2 text-[0.9375rem] leading-relaxed text-text-secondary">
                    {entry.answer}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Close */}
        <section className="mx-auto w-full max-w-6xl px-5 py-24 text-center md:px-8 md:py-32">
          <h2 className="reveal mx-auto max-w-3xl text-[clamp(2rem,5vw,3.5rem)] font-semibold leading-[1.05] tracking-[-0.02em] text-text-primary">
            {siteTagline}
          </h2>
          <div className="reveal mt-9 flex flex-wrap justify-center gap-3">
            <Link
              href="/inbox"
              className="inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-accent px-6 py-3.5 text-[0.9375rem] font-medium text-text-onAccent transition-colors hover:bg-accent-hover"
            >
              Open DoTo
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
          <p className="reveal mt-4 text-sm text-text-tertiary">
            No account. Works offline. Free to use.
          </p>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}

function Chip({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-2.5 py-1 text-xs font-medium text-accent">
      {icon}
      {children}
    </span>
  );
}

function Screen({
  src,
  alt,
  caption,
}: {
  src: string;
  alt: string;
  caption: string;
}) {
  return (
    <figure className="reveal">
      <div className="overflow-hidden rounded-[var(--radius-lg)] border border-border-subtle bg-bg">
        <Image src={src} alt={alt} width={1080} height={1920} className="w-full" />
      </div>
      <figcaption className="mt-3 text-sm text-text-tertiary">
        {caption}
      </figcaption>
    </figure>
  );
}

/**
 * SoftwareApplication describes the product, FAQPage makes the answers
 * eligible to be quoted, Person attributes it, and WebSite ties the whole
 * origin together. All are built from the same constants the page renders.
 */
function StructuredData() {
  const person = {
    "@type": "Person",
    "@id": absoluteUrl("/#author"),
    name: author.name,
    alternateName: author.alias,
    url: author.website,
    jobTitle: author.role,
    email: author.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Butwal",
      addressRegion: "Lumbini",
      addressCountry: "NP",
    },
    worksFor: {
      "@type": "Organization",
      name: author.company,
      url: author.companyUrl,
    },
    sameAs: author.socials.map((s) => s.url),
  };

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      person,
      {
        "@type": "WebSite",
        "@id": absoluteUrl("/#website"),
        url: absoluteUrl("/"),
        name: siteName,
        description: siteDescription,
        inLanguage: "en",
        publisher: { "@id": absoluteUrl("/#author") },
      },
      {
        "@type": "SoftwareApplication",
        "@id": absoluteUrl("/#app"),
        name: siteName,
        url: absoluteUrl("/"),
        description: siteDescription,
        applicationCategory: "ProductivityApplication",
        applicationSubCategory: "Task management",
        operatingSystem: "Any modern browser, installable on iOS, Android, Windows and macOS",
        browserRequirements: "Requires JavaScript and IndexedDB",
        isAccessibleForFree: true,
        author: { "@id": absoluteUrl("/#author") },
        creator: { "@id": absoluteUrl("/#author") },
        screenshot: [
          absoluteUrl("/screenshots/today-wide.png"),
          absoluteUrl("/screenshots/inbox-narrow.png"),
        ],
        featureList: FEATURES.map((f) => f.title),
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        permissions: "Optional notification access for reminders",
      },
      {
        "@type": "FAQPage",
        "@id": absoluteUrl("/#faq"),
        mainEntity: FAQ.map((entry) => ({
          "@type": "Question",
          name: entry.question,
          acceptedAnswer: { "@type": "Answer", text: entry.answer },
        })),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
