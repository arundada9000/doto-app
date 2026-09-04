"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { BrandMark } from "./SiteChrome";
import { siteName } from "@/lib/site";

const NAV = [
  { href: "/blog", label: "Writing" },
  { href: "/blog/install-doto-as-an-app", label: "Install" },
];

/**
 * iOS glass header. Stays translucent and pinned; gains a shadow once the
 * page is scrolled; the mobile nav springs out from under it.
 */
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50">
      <div
        className="glass transition-shadow duration-300"
        style={{
          boxShadow: scrolled ? "var(--shadow-md)" : "none",
        }}
      >
        <div className="mx-auto flex w-full max-w-6xl items-center gap-6 px-5 py-3 md:px-8">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-[0.95rem] font-semibold tracking-tight text-text-primary"
          >
            <BrandMark />
            {siteName}
          </Link>

          <nav className="ml-auto hidden items-center gap-1 text-sm md:flex">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-3.5 py-1.5 text-text-secondary transition-colors hover:bg-hover hover:text-text-primary"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/inbox"
              className="ml-2 inline-flex items-center rounded-full bg-accent px-4 py-1.5 font-medium text-text-onAccent transition-transform press hover:bg-accent-hover"
            >
              Open app
            </Link>
          </nav>

          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="ml-auto flex h-9 w-9 items-center justify-center rounded-full bg-hover text-text-primary md:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 top-[57px] z-40 md:hidden">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-overlay/30"
            onClick={() => setOpen(false)}
          />
          <div className="relative mx-4 mt-2 overflow-hidden rounded-[calc(var(--radius-lg)*1.6)] bg-surface shadow-lg">
            <nav className="flex flex-col p-2 text-base">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-[calc(var(--radius-lg)*1.3)] px-4 py-3.5 text-text-primary transition-colors hover:bg-hover"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/inbox"
                onClick={() => setOpen(false)}
                className="mt-1 inline-flex items-center justify-center rounded-full bg-accent px-4 py-3 font-medium text-text-onAccent transition-transform press hover:bg-accent-hover"
              >
                Open app
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}