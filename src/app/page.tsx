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
  ChevronRight,
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

/**
 * Tinted tiles in the manner of a grouped iOS list, where colour separates one
 * row from the next rather than decorating it.
 */
const FEATURES = [
  {
    icon: Zap,
    tone: "bg-accent",
    title: "Capture in one keystroke",
    body: "Ctrl+K opens a focused box from anywhere. Type, press enter, and it is saved.",
  },
  {
    icon: Repeat,
    tone: "bg-secondary-color",
    title: "Understands plain language",
    body: "Call Ram tomorrow at 10 becomes a task with a date and a time. Buy milk just saves.",
  },
  {
    icon: WifiOff,
    tone: "bg-info",
    title: "Works with no connection",
    body: "Everything lives in your browser, so it opens on a plane as it does at your desk.",
  },
  {
    icon: ShieldCheck,
    tone: "bg-success",
    title: "No account, no tracking",
    body: "No server to sign in to and no analytics. Export a backup, or erase it all in one action.",
  },
  {
    icon: Keyboard,
    tone: "bg-accent",
    title: "Built for the keyboard",
    body: "Move with J and K, complete with space, undo with Ctrl+Z. Every gesture has a key.",
  },
  {
    icon: Search,
    tone: "bg-warning",
    title: "Search across everything",
    body: "Titles, notes, tags, links, checklists, and attachments, filtered as you type.",
  },
  {
    icon: Bell,
    tone: "bg-error",
    title: "Reminders and repeats",
    body: "Recurring tasks create their next occurrence the moment you finish the last one.",
  },
  {
    icon: Palette,
    tone: "bg-secondary-color",
    title: "Sixteen themes",
    body: "Every colour and radius is a token, so themes swap instantly and stay legible.",
  },
];

const STEPS = [
  { title: "Think", body: "Something occurs to you mid-way through something else." },
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
        <section className="ambient relative overflow-hidden">
          <div className="mx-auto w-full max-w-5xl px-5 pb-14 pt-20 text-center md:px-8 md:pb-20 md:pt-32">
            <p className="rise inline-flex items-center gap-2 rounded-full bg-surface px-4 py-1.5 text-[0.8125rem] font-medium text-text-secondary shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-secondary-color" />
              Free, offline-first, no account
            </p>

            <h1 className="rise rise-1 mx-auto mt-8 max-w-4xl text-[clamp(2.75rem,7.5vw,5.5rem)] font-semibold leading-[1.03] tracking-[-0.035em] text-text-primary">
              Capture it instantly.
            </h1>
            <p className="rise rise-2 mx-auto mt-6 max-w-xl text-[1.0625rem] leading-relaxed text-text-secondary md:text-xl">
              A place to put a thought down in one keystroke and stop carrying
              it. Works with no connection. Nothing leaves your device.
            </p>

            <div className="rise rise-3 mt-10 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/inbox"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-[0.9375rem] font-medium text-text-onAccent transition-colors hover:bg-accent-hover"
              >
                Open DoTo
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link
                href="/blog/install-doto-as-an-app"
                className="inline-flex items-center gap-1 rounded-full px-5 py-3.5 text-[0.9375rem] font-medium text-accent transition-opacity hover:opacity-70"
              >
                How to install it
                <ChevronRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </div>

          <div className="mx-auto w-full max-w-6xl px-5 pb-20 md:px-8 md:pb-28">
            <div className="rise rise-4 drift overflow-hidden rounded-[var(--radius-xl)] bg-surface shadow-lg">
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
        </section>

        {/* Stats */}
        <Section>
          <dl className="mx-auto grid max-w-4xl grid-cols-2 gap-y-10 text-center md:grid-cols-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="reveal">
                <dt className="text-4xl font-semibold tracking-[-0.02em] text-text-primary md:text-5xl">
                  {stat.value}
                </dt>
                <dd className="mx-auto mt-2 max-w-[10rem] text-sm leading-snug text-text-tertiary">
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>
        </Section>

        {/* Steps */}
        <Section>
          <SectionHead
            eyebrow="How it works"
            title="Four moves, and none of them is filing."
          />
          <ol className="mx-auto mt-14 grid max-w-5xl gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, i) => (
              <li key={step.title} className="reveal text-center">
                <span className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-accent-soft text-[0.8125rem] font-semibold tabular-nums text-accent">
                  {i + 1}
                </span>
                <h3 className="mt-4 text-lg font-medium text-text-primary">
                  {step.title}
                </h3>
                <p className="mx-auto mt-2 max-w-[16rem] text-[0.9375rem] leading-relaxed text-text-secondary">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </Section>

        {/* Capture demo */}
        <Section>
          <SectionHead
            eyebrow="Capture"
            title="Type the sentence. Keep the structure."
            lede="A due date is fastest when you never open a picker. DoTo reads what it recognises out of the line you already typed, and leaves the rest as the title."
          />
          <div className="reveal mx-auto mt-14 max-w-2xl overflow-hidden rounded-[var(--radius-xl)] bg-surface shadow-md">
            <div className="p-7 md:p-9">
              <p className="text-xs uppercase tracking-wider text-text-tertiary">
                You type
              </p>
              <p className="mt-3 font-mono text-lg text-text-primary md:text-xl">
                Call Ram tomorrow at 10 #work
              </p>
            </div>
            <div className="h-px bg-border-subtle" />
            <div className="p-7 md:p-9">
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
          <p className="reveal mx-auto mt-6 max-w-2xl text-center text-sm text-text-tertiary">
            Never required. Type{" "}
            <span className="font-medium text-text-secondary">Buy milk</span> and
            you get a task called Buy milk.
          </p>
        </Section>

        {/* Features, as a grouped list */}
        <Section>
          <SectionHead
            eyebrow="What it does"
            title="Small on the surface, complete underneath."
          />
          <div className="mx-auto mt-14 grid max-w-5xl gap-5 md:grid-cols-2">
            <FeatureGroup features={FEATURES.slice(0, 4)} />
            <FeatureGroup features={FEATURES.slice(4)} />
          </div>
        </Section>

        {/* Screens */}
        <Section>
          <SectionHead
            eyebrow="The interface"
            title="Made to be lived in."
            lede="Every surface uses the same design tokens, so a theme change is one attribute and the app stays legible in all sixteen."
          />
          <div className="mx-auto mt-14 grid max-w-3xl gap-8 sm:grid-cols-2">
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
        </Section>

        {/* Privacy */}
        <Section>
          <div className="reveal mx-auto max-w-3xl text-center">
            <p className="text-sm font-medium uppercase tracking-wider text-accent">
              Privacy
            </p>
            <h2 className="mt-4 text-[clamp(1.9rem,4.5vw,3.25rem)] font-semibold leading-[1.08] tracking-[-0.025em] text-text-primary">
              Your list never leaves the device it was written on.
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-[1.0625rem] leading-relaxed text-text-secondary">
              {siteName} has no server. Your tasks, notes, and attachments are
              held in your browser&apos;s own storage, and the app works with the
              network switched off. No sign-in, no analytics, no advertising
              code. Export everything to a single file whenever you want it
              elsewhere, and erase all of it without asking anyone.
            </p>
            <Link
              href="/blog/local-first-privacy"
              className="mt-7 inline-flex items-center gap-1 text-[0.9375rem] font-medium text-accent transition-opacity hover:opacity-70"
            >
              Why this matters more than it sounds
              <ChevronRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </Section>

        {/* Writing */}
        <Section>
          <SectionHead eyebrow="Writing" title="Notes from building it." />
          <ul className="mx-auto mt-14 grid max-w-5xl gap-5 md:grid-cols-3">
            {posts.slice(0, 3).map((post) => (
              <li key={post.slug} className="reveal">
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex h-full flex-col rounded-[var(--radius-xl)] bg-surface p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  <p className="text-xs text-text-tertiary">
                    {post.readingMinutes} minute read
                  </p>
                  <h3 className="mt-2 text-[1.0625rem] font-medium leading-snug text-text-primary">
                    {post.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-text-secondary">
                    {post.description}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent">
                    Read it
                    <ChevronRight
                      className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                      aria-hidden
                    />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="reveal mt-10 text-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1 text-[0.9375rem] font-medium text-accent transition-opacity hover:opacity-70"
            >
              All writing
              <ChevronRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </Section>

        {/* Maker */}
        <Section>
          <div className="reveal mx-auto max-w-3xl rounded-[var(--radius-xl)] bg-surface p-8 text-center shadow-md md:p-12">
            <p className="text-sm font-medium uppercase tracking-wider text-accent">
              Built by
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-text-primary md:text-3xl">
              {author.name}
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-[1.0625rem] leading-relaxed text-text-secondary">
              {author.role}, based in {author.location}. Self-taught, working
              mostly in React, Next.js, and TypeScript, on systems that solve
              local problems: offline-first disaster reporting, case management
              for the Nepal Police, and a WebAuthn platform for a national NGO.
            </p>
            <p className="mx-auto mt-4 max-w-2xl text-[1.0625rem] leading-relaxed text-text-secondary">
              DoTo came out of the same interest. An app that works with no
              signal, keeps your data yours, and does not ask for an account
              before it will accept a sentence.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-[0.9375rem]">
              <a
                href={author.website}
                rel="noopener noreferrer"
                className="font-medium text-text-primary transition-colors hover:text-accent"
              >
                Portfolio
              </a>
              {author.socials.map((social) => (
                <a
                  key={social.label}
                  href={social.url}
                  rel="noopener noreferrer"
                  className="text-text-secondary transition-colors hover:text-accent"
                >
                  {social.label}
                </a>
              ))}
            </div>
          </div>
        </Section>

        {/* FAQ */}
        <Section>
          <SectionHead eyebrow="Questions" title="The things people ask." />
          <dl className="mx-auto mt-14 max-w-3xl overflow-hidden rounded-[var(--radius-xl)] bg-surface shadow-sm">
            {FAQ.map((entry, i) => (
              <div key={entry.question} className="reveal">
                {i > 0 && <div className="ml-6 h-px bg-border-subtle" />}
                <div className="px-6 py-6 md:px-8">
                  <dt className="font-medium text-text-primary">
                    {entry.question}
                  </dt>
                  <dd className="mt-2 text-[0.9375rem] leading-relaxed text-text-secondary">
                    {entry.answer}
                  </dd>
                </div>
              </div>
            ))}
          </dl>
        </Section>

        {/* Close */}
        <section className="px-5 py-28 text-center md:px-8 md:py-40">
          <h2 className="reveal mx-auto max-w-3xl text-[clamp(2rem,5.5vw,3.75rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-text-primary">
            {siteTagline}
          </h2>
          <div className="reveal mt-10">
            <Link
              href="/inbox"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-8 py-4 text-[0.9375rem] font-medium text-text-onAccent transition-colors hover:bg-accent-hover"
            >
              Open DoTo
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
          <p className="reveal mt-5 text-sm text-text-tertiary">
            No account. Works offline. Free to use.
          </p>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}

/** Consistent vertical rhythm, so every band of the page breathes the same. */
function Section({ children }: { children: React.ReactNode }) {
  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-20 md:px-8 md:py-28">
      {children}
    </section>
  );
}

function SectionHead({
  eyebrow,
  title,
  lede,
}: {
  eyebrow: string;
  title: string;
  lede?: string;
}) {
  return (
    <div className="reveal mx-auto max-w-2xl text-center">
      <p className="text-sm font-medium uppercase tracking-wider text-accent">
        {eyebrow}
      </p>
      <h2 className="mt-4 text-[clamp(1.75rem,4vw,2.75rem)] font-semibold leading-[1.1] tracking-[-0.025em] text-text-primary">
        {title}
      </h2>
      {lede && (
        <p className="mt-5 text-[1.0625rem] leading-relaxed text-text-secondary">
          {lede}
        </p>
      )}
    </div>
  );
}

/** A grouped list: one rounded card, hairline dividers inset from the icons. */
function FeatureGroup({
  features,
}: {
  features: (typeof FEATURES)[number][];
}) {
  return (
    <div className="overflow-hidden rounded-[var(--radius-xl)] bg-surface shadow-sm">
      {features.map(({ icon: Icon, tone, title, body }, i) => (
        <div key={title} className="reveal">
          {i > 0 && <div className="ml-[4.25rem] h-px bg-border-subtle" />}
          <article className="flex gap-4 px-5 py-5">
            <span
              aria-hidden
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] ${tone}`}
            >
              <Icon className="h-[1.15rem] w-[1.15rem] text-text-onAccent" />
            </span>
            <div className="min-w-0">
              <h3 className="text-[0.9375rem] font-medium text-text-primary">
                {title}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-text-secondary">
                {body}
              </p>
            </div>
          </article>
        </div>
      ))}
    </div>
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
      <div className="overflow-hidden rounded-[var(--radius-xl)] bg-bg shadow-md">
        <Image src={src} alt={alt} width={1080} height={1920} className="w-full" />
      </div>
      <figcaption className="mt-4 text-center text-sm text-text-tertiary">
        {caption}
      </figcaption>
    </figure>
  );
}

/**
 * SoftwareApplication describes the product, FAQPage makes the answers
 * eligible to be quoted, Person attributes it, and WebSite ties the origin
 * together. All are built from the same constants the page renders.
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
        operatingSystem:
          "Any modern browser, installable on iOS, Android, Windows and macOS",
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
