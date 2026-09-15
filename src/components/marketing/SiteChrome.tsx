import Link from "next/link";
import type { ComponentType, SVGProps } from "react";
import { author, siteName } from "@/lib/site";
import { SiteHeader } from "./SiteHeader";
import { ScrollToTop } from "./ScrollToTop";
import {
  LinkedInIcon,
  XIcon,
  YouTubeIcon,
  InstagramIcon,
  FacebookIcon,
} from "./BrandIcons";

export { SiteHeader };

const SOCIAL_ICONS: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  LinkedIn: LinkedInIcon,
  X: XIcon,
  YouTube: YouTubeIcon,
  Instagram: InstagramIcon,
  Facebook: FacebookIcon,
};

/** Unchanging brand tile used across the marketing surfaces. */
export function BrandMark({ size = 26 }: { size?: number }) {
  return (
    <span
      aria-hidden
      className="inline-flex shrink-0 items-center justify-center rounded-[9px] bg-accent shadow-md"
      style={{ width: size, height: size }}
    >
      <svg
        width={size * 0.62}
        height={size * 0.62}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={3.2}
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
      <ScrollToTop />
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
            Find {author.name}
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

      <div className="border-t border-border-subtle">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-3 px-5 py-10 text-center md:px-8">
          <a
            href={author.website}
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2.5"
            aria-label={`DoTo is designed and developed by ${author.name}`}
          >
            <BrandMark size={22} />
            <span className="text-sm font-semibold tracking-tight text-text-primary">
              Designed &amp; developed by {author.name}
            </span>
          </a>
          <p className="max-w-md text-sm leading-relaxed text-text-tertiary">
            Frontend developer, CTO and Lead Architect at {author.company}.{" "}
            <a
              href={author.companyUrl}
              rel="noopener noreferrer"
              className="text-text-secondary underline-offset-4 transition-colors hover:text-accent hover:underline"
            >
              Visit Sajilo Digital
            </a>
          </p>
          <ul className="flex items-center gap-2.5" aria-label="Social links">
            {author.socials.map((social) => {
              const Icon = SOCIAL_ICONS[social.label] ?? LinkedInIcon;
              return (
                <li key={social.label}>
                  <a
                    href={social.url}
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border-subtle bg-surface text-text-secondary shadow-sm transition-all press hover:border-accent/40 hover:text-accent"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="border-t border-border-subtle">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-x-4 gap-y-2 px-5 py-5 text-xs text-text-tertiary md:px-8">
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