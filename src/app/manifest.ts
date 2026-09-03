import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  // share_target is a valid manifest member that the Next.js type does not
  // model, so the object is widened once here rather than loosened throughout.
  const shareTarget = {
    share_target: {
      action: "/inbox/",
      method: "GET",
      params: { title: "title", text: "text", url: "url" },
    },
  } as Partial<MetadataRoute.Manifest>;

  return {
    ...shareTarget,
    name: "DoTo - Capture it instantly",
    short_name: "DoTo",
    description:
      "A frictionless personal capture system that happens to have tasks. Capture it instantly. Organize it later. Finish it beautifully.",
    // The landing page lives at "/", so an installed app opens the Inbox
    // instead of the marketing page every launch.
    start_url: "/inbox/",
    scope: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#f4f5f7",
    theme_color: "#f4f5f7",
    lang: "en",
    categories: ["productivity", "utilities"],
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icons/maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "Quick Capture",
        short_name: "Capture",
        description: "Capture something new instantly",
        url: "/inbox?capture=1",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "New Task",
        short_name: "Task",
        description: "Create a new task",
        url: "/inbox?capture=1&type=task",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "New Note",
        short_name: "Note",
        description: "Create a new note",
        url: "/inbox?capture=1&type=note",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "Today",
        short_name: "Today",
        description: "View todays tasks and reminders",
        url: "/today",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
    ],
  };
}
