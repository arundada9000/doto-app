import type { Metadata, Viewport } from "next";
import {
  Geist,
  Geist_Mono,
  Source_Serif_4,
  Nunito,
  Lora,
} from "next/font/google";
import { siteName, siteDescription, siteUrl } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const nunito = Nunito({
  variable: "--font-rounded",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  // Resolves every relative URL below, and the canonical tags on each route.
  metadataBase: new URL(siteUrl),
  title: {
    default: "DoTo - Capture it instantly",
    template: "%s · DoTo",
  },
  description: siteDescription,
  applicationName: "DoTo",
  keywords: [
    "offline todo app",
    "task app without an account",
    "quick capture app",
    "private notes app",
    "PWA task manager",
    "local-first to-do list",
  ],
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    siteName,
    title: "DoTo - Capture it instantly",
    description: siteDescription,
    url: "/",
    locale: "en",
  },
  twitter: {
    card: "summary_large_image",
    title: "DoTo - Capture it instantly",
    description: siteDescription,
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "DoTo",
  },
  icons: {
    icon: "/favicon.png",
    apple: "/icons/apple-touch-icon.png",
  },
  formatDetection: {
    telephone: false,
  },
  verification: {
    google: "y_iQncnrIS7Nycs-SFAgvF9aPPyozMkTeJhrDnmS2R0",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f5f7" },
    { media: "(prefers-color-scheme: dark)", color: "#101114" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-theme="light"
      className={`${geistSans.variable} ${geistMono.variable} ${sourceSerif.variable} ${nunito.variable} ${lora.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      {/* Direction contract — iOS glass & depth: translucent bar, squircle
          group cards, a floating device hero, springy motion. Replaces the
          flat grouped list with an Apple feature-page material world. */}
      <body
        className="min-h-full font-sans"
        style={{ fontFamily: "var(--font-geist-sans)" }}
      >
        {/*
          Marks the document as scripted before anything below it is parsed.
          Scroll-revealed sections ship in their hidden state, so without this
          flag a slow or failed bundle would leave the page blank below the
          fold. globals.css keeps that hidden state switched off until the
          attribute exists.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.setAttribute("data-js","on")`,
          }}
        />
        {children}
      </body>
    </html>
  );
}
