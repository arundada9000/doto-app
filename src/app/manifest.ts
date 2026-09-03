import type { MetadataRoute } from "next";
import { siteDescription } from "@/lib/site";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  // share_target and screenshots are valid manifest members that the Next.js
  // type does not model, so the object is widened once here rather than
  // loosening the whole return type.
  const extras = {
    // A stable identity for the installed app, independent of start_url.
    id: "/inbox/",
    share_target: {
      action: "/inbox/",
      method: "GET",
      params: { title: "title", text: "text", url: "url" },
    },
    // Richer install prompts on Android and desktop Chrome. Both form factors
    // must be present or the wide shots are ignored on phones.
    screenshots: [
      {
        src: "/screenshots/today-wide.png",
        sizes: "1600x820",
        type: "image/png",
        form_factor: "wide",
        label: "Today, with the day's progress and what is still due",
      },
      {
        src: "/screenshots/inbox-narrow.png",
        sizes: "1080x1920",
        type: "image/png",
        form_factor: "narrow",
        label: "The Inbox, where everything you capture lands",
      },
      {
        src: "/screenshots/capture-narrow.png",
        sizes: "1080x1920",
        type: "image/png",
        form_factor: "narrow",
        label: "Quick Capture reading a date out of plain language",
      },
    ],
  } as Partial<MetadataRoute.Manifest>;

  return {
    ...extras,
    name: "DoTo - Capture it instantly",
    short_name: "DoTo",
    description: siteDescription,
    // The landing page lives at "/", so an installed app opens the Inbox
    // instead of the marketing page every launch.
    start_url: "/inbox/",
    scope: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#f4f5f7",
    theme_color: "#f4f5f7",
    lang: "en",
    dir: "ltr",
    categories: ["productivity", "utilities"],
    icons: [
      // "any" carries transparent corners for browser tabs and task switchers.
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      // "maskable" is full bleed: launchers crop to their own shape.
      {
        src: "/icons/maskable-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    // Trailing slashes matter: the export is built with trailingSlash, so a
    // shortcut to "/inbox?capture=1" would resolve to a redirect or a 404.
    shortcuts: [
      {
        name: "Quick Capture",
        short_name: "Capture",
        description: "Capture something new instantly",
        url: "/inbox/?capture=1",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "New Task",
        short_name: "Task",
        description: "Create a new task",
        url: "/inbox/?capture=1&type=task",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "New Note",
        short_name: "Note",
        description: "Create a new note",
        url: "/inbox/?capture=1&type=note",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "Today",
        short_name: "Today",
        description: "See what is due today",
        url: "/today/",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
    ],
  };
}
