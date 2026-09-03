import type { Metadata } from "next";
import Link from "next/link";
import {
  Zap,
  WifiOff,
  ShieldCheck,
  Keyboard,
  Repeat,
  Search,
  Bell,
  Palette,
} from "lucide-react";
import { FAQ } from "@/lib/faq";
import {
  absoluteUrl,
  siteDescription,
  siteName,
  siteTagline,
} from "@/lib/site";

export const metadata: Metadata = {
  title: "DoTo: the offline-first capture app for tasks and notes",
  description: siteDescription,
  alternates: { canonical: absoluteUrl("/") },
  openGraph: {
    type: "website",
    url: absoluteUrl("/"),
    title: "DoTo: the offline-first capture app for tasks and notes",
    description: siteDescription,
    siteName,
  },
};

const FEATURES = [
  {
    icon: Zap,
    title: "Capture in one keystroke",
    body: "Ctrl+K opens a focused box from anywhere. Type a thought, press enter, and it is saved. Nothing else is required before it lands.",
  },
  {
    icon: Repeat,
    title: "Understands plain language",
    body: "“Call Ram tomorrow at 10” becomes a task with a date and a time. “Every monday” makes it repeat. “Buy milk” just saves.",
  },
  {
    icon: WifiOff,
    title: "Works with no connection",
    body: "Everything lives in your browser and the app caches itself, so it opens on a plane exactly as it does at your desk.",
  },
  {
    icon: ShieldCheck,
    title: "No account, no tracking",
    body: "There is no server to sign in to and no analytics in the app. Export a backup whenever you like, or delete everything in one action.",
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
  {
    title: "Think",
    body: "Something occurs to you in the middle of doing something else.",
  },
  {
    title: "Capture",
    body: "One keystroke, a few words, done. No list to choose, no priority to set.",
  },
  {
    title: "Forget",
    body: "It is in the Inbox. You do not have to hold it in your head any more.",
  },
  {
    title: "Finish",
    body: "Return when it matters, tick it off, and feel the app agree with you.",
  },
];

export default function LandingPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-5 py-16 md:px-8 md:py-24">
      <StructuredData />

      <section className="max-w-3xl">
        <p className="text-sm font-medium uppercase tracking-wider text-accent">
          Offline-first capture
        </p>
        <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-tight text-text-primary md:text-6xl">
          {siteTagline}
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-text-secondary">
          {siteName} is a free task and note app that opens straight into a
          capture box. It is a place to put a thought down in one keystroke and
          stop carrying it, rather than another system to maintain. Everything
          stays on your device.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            href="/inbox"
            className="rounded-[var(--radius-md)] bg-accent px-5 py-3 text-[0.9375rem] font-medium text-text-onAccent transition-colors hover:bg-accent-hover"
          >
            Open DoTo
          </Link>
          <a
            href="https://github.com/"
            rel="noopener noreferrer"
            className="rounded-[var(--radius-md)] border border-border-subtle px-5 py-3 text-[0.9375rem] font-medium text-text-primary transition-colors hover:border-border-strong hover:bg-hover"
          >
            View the source
          </a>
          <span className="text-sm text-text-tertiary">
            No account required
          </span>
        </div>
      </section>

      <section className="mt-20" aria-labelledby="how">
        <h2
          id="how"
          className="text-2xl font-semibold tracking-tight text-text-primary"
        >
          The whole idea
        </h2>
        <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => (
            <li
              key={step.title}
              className="rounded-[var(--radius-lg)] border border-border-subtle bg-surface p-5"
            >
              <span className="text-xs font-semibold tabular-nums text-accent">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-2 text-base font-medium text-text-primary">
                {step.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-20" aria-labelledby="features">
        <h2
          id="features"
          className="text-2xl font-semibold tracking-tight text-text-primary"
        >
          What it does
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <article
              key={title}
              className="rounded-[var(--radius-lg)] border border-border-subtle bg-surface p-5"
            >
              <Icon className="h-5 w-5 text-accent" aria-hidden />
              <h3 className="mt-3 text-base font-medium text-text-primary">
                {title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">
                {body}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-20" aria-labelledby="privacy">
        <h2
          id="privacy"
          className="text-2xl font-semibold tracking-tight text-text-primary"
        >
          Your data does not go anywhere
        </h2>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-text-secondary">
          {siteName} has no server. Your tasks, notes, and attachments are held
          in your browser&apos;s own storage on the device you are using, and the
          app works with the network switched off. There is no sign-in, no
          analytics, and no advertising code. You can export everything to a
          single JSON file whenever you want it elsewhere, and erase all of it
          from Settings without asking anyone.
        </p>
      </section>

      <section className="mt-20" aria-labelledby="faq">
        <h2
          id="faq"
          className="text-2xl font-semibold tracking-tight text-text-primary"
        >
          Common questions
        </h2>
        <dl className="mt-6 divide-y divide-border-subtle border-y border-border-subtle">
          {FAQ.map((entry) => (
            <div key={entry.question} className="py-5">
              <dt className="text-base font-medium text-text-primary">
                {entry.question}
              </dt>
              <dd className="mt-1.5 max-w-3xl text-sm leading-relaxed text-text-secondary">
                {entry.answer}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <footer className="mt-20 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border-subtle pt-6 text-sm text-text-tertiary">
        <span>
          {siteName} is free and open source under the MIT licence.
        </span>
        <Link href="/inbox" className="text-accent hover:underline">
          Open the app
        </Link>
      </footer>
    </main>
  );
}

/**
 * SoftwareApplication describes the product, FAQPage makes the answers above
 * eligible to be quoted directly. Both are built from the same constants the
 * page renders, so they cannot drift from what a visitor actually reads.
 */
function StructuredData() {
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: siteName,
        url: absoluteUrl("/"),
        description: siteDescription,
        applicationCategory: "ProductivityApplication",
        operatingSystem: "Any browser, including iOS and Android as a PWA",
        isAccessibleForFree: true,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        featureList: FEATURES.map((f) => f.title),
        softwareRequirements: "A modern web browser",
        permissions: "Optional notification access for reminders",
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQ.map((entry) => ({
          "@type": "Question",
          name: entry.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: entry.answer,
          },
        })),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // Content is authored in this repo, not user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
