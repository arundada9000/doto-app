import Link from "next/link";
import { author, siteName } from "@/lib/site";

/**
 * Header and footer for the marketing surfaces. Deliberately server rendered
 * with no interactivity, so these pages ship no JavaScript at all.
 */
export function SiteHeader() {
  return (
    <header
      data-translucent="bg"
      className="sticky top-0 z-20 border-b border-border-subtle/60 bg-bg/80 backdrop-blur-xl"
    >
      <div className="mx-auto flex w-full max-w-6xl items-center gap-6 px-5 py-3.5 md:px-8">
        <Link
          href="/"
          className="flex items-center gap-2.5 text-[0.95rem] font-semibold tracking-tight text-text-primary"
        >
          <BrandMark />
          {siteName}
        </Link>

        <nav className="ml-auto flex items-center gap-5 text-sm">
          <Link
            href="/blog"
            className="text-text-secondary transition-colors hover:text-text-primary"
          >
            Writing
          </Link>
          <Link
            href="/inbox"
            className="rounded-full bg-accent px-4 py-1.5 font-medium text-text-onAccent transition-colors hover:bg-accent-hover"
          >
            Open app
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function BrandMark({ size = 26 }: { size?: number }) {
  return (
    <span
      aria-hidden
      className="inline-flex shrink-0 items-center justify-center rounded-[7px] bg-accent"
      style={{ width: size, height: size }}
    >
      <svg
        width={size * 0.62}
        height={size * 0.62}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-text-onAccent"
      >
        <path d="M20 6 9 17l-5-5" />
      </svg>
    </span>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border-subtle">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-12 md:grid-cols-[1.4fr_1fr_1fr] md:px-8">
        <div>
          <Link
            href="/"
            className="flex items-center gap-2.5 text-[0.95rem] font-semibold tracking-tight text-text-primary"
          >
            <BrandMark size={24} />
            {siteName}
          </Link>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-text-secondary">
            A capture system that happens to have tasks. Free to use, works
            offline, and keeps everything on your device.
          </p>
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">
            App
          </h2>
          <ul className="mt-3 flex flex-col gap-2 text-sm">
            <li>
              <FooterLink href="/inbox">Open DoTo</FooterLink>
            </li>
            <li>
              <FooterLink href="/blog">Writing</FooterLink>
            </li>
            <li>
              <FooterLink href="/blog/install-doto-as-an-app">
                Install guide
              </FooterLink>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">
            Built by {author.name}
          </h2>
          <ul className="mt-3 flex flex-col gap-2 text-sm">
            <li>
              <FooterLink href={author.website} external>
                Portfolio
              </FooterLink>
            </li>
            {author.socials.map((social) => (
              <li key={social.label}>
                <FooterLink href={social.url} external>
                  {social.label}
                </FooterLink>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-x-4 gap-y-2 border-t border-border-subtle px-5 py-5 text-xs text-text-tertiary md:px-8">
        <span>
          &copy; {new Date().getFullYear()} {author.name}. Free to use.
          Selling it needs written permission.
        </span>
        <a
          href={author.companyUrl}
          rel="noopener noreferrer"
          className="ml-auto transition-colors hover:text-text-secondary"
        >
          {author.company}
        </a>
      </div>
    </footer>
  );
}

function FooterLink({
  href,
  children,
  external,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  const className =
    "text-text-secondary transition-colors hover:text-text-primary";
  if (external) {
    return (
      <a href={href} rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
