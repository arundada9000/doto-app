/**
 * Shared by the landing page and its FAQPage structured data, so the answers a
 * search or answer engine quotes are the same words a visitor reads. Answers
 * are written to stand alone, since they are often surfaced without the page
 * around them.
 */
export interface FaqEntry {
  question: string;
  answer: string;
}

export const FAQ: FaqEntry[] = [
  {
    question: "Is DoTo free?",
    answer:
      "Yes. DoTo is free to use, with no paid tier, no trial, and no account to create. The source is available, and you may study, modify, and share it for any non-commercial purpose. Selling it, or running it as a paid service, needs written permission from the author.",
  },
  {
    question: "Does DoTo work offline?",
    answer:
      "Yes, completely. DoTo stores everything on your device using IndexedDB and caches itself with a service worker, so it opens and works with no connection at all. Offline is the normal way it runs rather than a fallback mode.",
  },
  {
    question: "Where is my data stored?",
    answer:
      "Only in your browser, on the device you are using. DoTo has no server and no account, so nothing is uploaded, and there is no analytics or advertising code in the app. You can export everything to a JSON file at any time, and delete all of it from Settings.",
  },
  {
    question: "Can I use DoTo on my phone?",
    answer:
      "Yes. DoTo is a progressive web app, so you can install it from your browser and it behaves like an ordinary app, including an icon on your home screen, a badge showing what is due, and sharing text or links into it from other apps.",
  },
  {
    question: "Does DoTo understand dates typed in plain language?",
    answer:
      "Yes. Typing something like \"Call Ram tomorrow at 10\" sets the title, date, and time in one go, and \"every monday\" makes it repeat. Parsing is never required: typing \"Buy milk\" simply saves a task with no date attached.",
  },
  {
    question: "Does DoTo sync between devices?",
    answer:
      "Not in this version. DoTo is deliberately local first, and syncing would require an account and a server. The data layer is built so that synchronisation can be added later without rewriting the app, and your data can be moved between devices today by exporting and importing a backup file.",
  },
  {
    question: "How is DoTo different from other to-do apps?",
    answer:
      "Most task apps ask you to file something before you can save it: a project, a priority, a list. DoTo is built around capture, so the fastest path is always to type a thought and forget about it. Organising is optional and happens later, if at all.",
  },
  {
    question: "Can I use DoTo entirely with a keyboard?",
    answer:
      "Yes. Ctrl or Cmd with K opens capture from anywhere, slash opens search, J and K move between items, space completes the focused one, and Ctrl or Cmd with Z undoes a completion or deletion. Every action available by gesture is also reachable by keyboard.",
  },
];
