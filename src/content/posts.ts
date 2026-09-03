import type { FaqEntry } from "@/lib/faq";

export interface PostSection {
  heading: string;
  body: string[];
  list?: string[];
}

export interface Post {
  slug: string;
  title: string;
  /** Meta description and the excerpt shown on the index. Keep under 160. */
  description: string;
  published: string;
  updated?: string;
  tags: string[];
  readingMinutes: number;
  intro: string[];
  sections: PostSection[];
  /** Rendered on the page and emitted as FAQPage structured data. */
  faq?: FaqEntry[];
}

const POSTS: Post[] = [
  {
    slug: "offline-first-todo-app",
    title: "Why an offline-first to-do app is faster than a cloud one",
    description:
      "Cloud task apps wait on a network round trip before they feel finished. An offline-first app writes locally and is done. Here is what that changes in practice.",
    published: "2026-09-03",
    tags: ["Offline-first", "Performance", "Architecture"],
    readingMinutes: 5,
    intro: [
      "Open a typical cloud task app, type something, and press enter. The row appears immediately, because the app is optimistic about the result. Behind it, a request leaves your device, crosses whatever network you happen to be on, waits for a server, and comes back. Most of the time you never notice. On a train, in a lift, or on hotel wifi, you notice a great deal.",
      "An offline-first app inverts that. The write goes to storage on your device and the operation is genuinely complete. There is no request to fail, no spinner to reconcile, and no state where the interface has told you one thing while the truth is still in flight.",
    ],
    sections: [
      {
        heading: "Optimistic is not the same as instant",
        body: [
          "Optimistic updates hide latency; they do not remove it. The app shows the result it expects, then repairs the difference if the server disagrees. That repair is where the awkward moments live: a task that reappears after you completed it, an edit that silently loses to a newer one, a sync error surfaced minutes after the fact.",
          "When the local database is the source of truth, there is nothing to repair. The interface is not predicting an outcome, it is showing one.",
        ],
      },
      {
        heading: "What IndexedDB actually costs",
        body: [
          "Writing a task to IndexedDB is a local transaction measured in single-digit milliseconds. A network round trip to a nearby data centre is tens of milliseconds at best, and hundreds when mobile reception is poor. The gap is not subtle, and it compounds across a session where you capture a dozen things.",
          "Reads matter more than writes for perceived speed. An offline-first app holds the whole working set in memory after one load, so filtering, searching, and switching views never touch the network. Search feels instant because it is running over an array you already have.",
        ],
      },
      {
        heading: "Offline stops being a mode",
        body: [
          "Most apps treat offline as a degraded state, announced with a banner and a warning colour. That framing is backwards for a capture tool. The moments you most need to write something down are often the moments you have no signal.",
          "When local storage is the primary database and a service worker caches the application shell, there is no offline mode to enter. The app opens, accepts input, and works. Reconnecting changes nothing you can see.",
        ],
      },
      {
        heading: "The trade you are making",
        body: [
          "Offline-first is not free. Without a server, there is no synchronisation between devices, no shared lists, and no recovery if the device is lost and you have not exported a backup. Those are real costs and worth naming.",
          "For a personal capture tool the trade is usually worth it. The value is in getting a thought out of your head in under two seconds, and every network dependency works against that. Sync can be added later on top of a local-first data model. It is much harder to go the other way.",
        ],
      },
    ],
    faq: [
      {
        question: "Is an offline-first app slower to load the first time?",
        answer:
          "Only marginally, and only once. The first visit downloads the application shell and caches it with a service worker. Every launch after that reads from the cache and the local database, so it opens without touching the network at all.",
      },
      {
        question: "What happens to my data if I clear the browser storage?",
        answer:
          "It is deleted, because the browser storage is the database. This is the real cost of having no server. Export a backup file periodically if the data matters, which in DoTo is a single action in Settings.",
      },
    ],
  },

  {
    slug: "install-doto-as-an-app",
    title: "How to install DoTo as an app on iPhone, Android, and desktop",
    description:
      "DoTo is a progressive web app, so it installs from the browser with no app store. Step-by-step instructions for iOS, Android, Windows, and macOS.",
    published: "2026-09-03",
    tags: ["PWA", "Guide", "Mobile"],
    readingMinutes: 4,
    intro: [
      "DoTo is a progressive web app. There is no app store listing, no download, and no account. You open it in a browser once and install it from there, after which it behaves like any other app on the device: its own icon, its own window, and no browser chrome.",
      "Installing also unlocks a few things that only apply to installed apps, including the badge on the icon showing what is due and the ability to share text or links into DoTo from other apps.",
    ],
    sections: [
      {
        heading: "iPhone and iPad",
        body: [
          "Safari is required here. iOS only allows installation from Safari, so if you opened the link in Chrome or in an in-app browser, open it in Safari first.",
        ],
        list: [
          "Open DoTo in Safari.",
          "Tap the Share button in the toolbar, the square with an arrow pointing up.",
          "Scroll the list and tap Add to Home Screen.",
          "Confirm the name and tap Add.",
        ],
      },
      {
        heading: "Android",
        body: [
          "Chrome usually offers this on its own after a short visit, but you can always do it manually.",
        ],
        list: [
          "Open DoTo in Chrome.",
          "Tap the three-dot menu in the top right.",
          "Tap Install app, or Add to Home screen if that is what you see.",
          "Confirm.",
        ],
      },
      {
        heading: "Windows and macOS",
        body: [
          "Chrome and Edge both support installing web apps to the desktop. The installed window has no address bar and appears in your task switcher like a native application.",
        ],
        list: [
          "Open DoTo in Chrome or Edge.",
          "Look for the install icon at the right-hand end of the address bar.",
          "Alternatively, open the browser menu and choose Install DoTo.",
          "The app opens in its own window and can be pinned to the taskbar or dock.",
        ],
      },
      {
        heading: "What installing changes",
        body: [
          "The application shell is cached, so DoTo opens with no connection at all. Long-press or right-click the icon and you get shortcuts straight into Quick Capture, a new task, a new note, or Today.",
          "On platforms that support it, the icon carries a badge counting what is due today or already overdue. Anything captured for later is not counted, on the grounds that a badge which counts everything quickly becomes a badge you ignore.",
        ],
      },
    ],
    faq: [
      {
        question: "Do I need an account to install DoTo?",
        answer:
          "No. DoTo has no accounts at all. Installing it creates nothing on any server, because there is no server. The app and your data both live on your device.",
      },
      {
        question: "Will my tasks sync between my phone and my laptop?",
        answer:
          "Not automatically. Each installation keeps its own local database. You can move data between devices by exporting a backup file from Settings on one and importing it on the other.",
      },
      {
        question: "How do I uninstall DoTo?",
        answer:
          "Remove it the way you would any app: delete the icon on iOS or Android, or use the browser's app management page on desktop. Removing the app also removes its local data, so export a backup first if you want to keep it.",
      },
    ],
  },

  {
    slug: "quick-capture-habit",
    title: "Quick capture: the two-second habit that empties your head",
    description:
      "Most task systems fail at the moment of capture, not the moment of doing. Why the time between thought and saved note is the number that matters.",
    published: "2026-09-03",
    tags: ["Habits", "Productivity", "Capture"],
    readingMinutes: 5,
    intro: [
      "There is a specific failure that kills task systems, and it is not laziness. It is friction at the moment of capture. A thought arrives while you are doing something else. You open the app. It asks which project this belongs to, what priority it has, when it is due. By the time you have answered, the interruption has cost more than the thought was worth, so next time you do not bother.",
      "The fix is not more discipline. It is making capture cost so little that you do it without deciding to.",
    ],
    sections: [
      {
        heading: "The number that matters is time to saved",
        body: [
          "Measure your current tool honestly. From the instant a thought arrives to the instant it is safely recorded, how many seconds and how many decisions? If the answer is more than a couple of seconds or more than zero decisions, the tool is leaking.",
          "Every field a form demands before it will save is a decision you are forced to make at the worst possible time, while your attention is still on something else. Projects, priorities, and due dates are all useful. None of them are useful right now.",
        ],
      },
      {
        heading: "Capture first, organise later, or never",
        body: [
          "The order matters. Capture is cheap and must stay cheap. Organising is expensive and should be optional, done in a batch when you have attention to spare rather than piecemeal at the point of entry.",
          "In practice, a large share of captured items never need organising at all. They get done, or they turn out not to matter. Forcing every one of them through a filing step taxes the many for the sake of the few.",
        ],
      },
      {
        heading: "Let the text carry the structure",
        body: [
          "The compromise that works is to let structure come from what you already typed rather than from separate controls. Typing \"Call Ram tomorrow at 10\" gives a title, a date, and a time in one movement, because the sentence already contained them.",
          "The important part is that this stays optional. Typing \"Buy milk\" must save a task called Buy milk and nothing else. A parser that demands a particular phrasing is just a form with extra steps.",
        ],
      },
      {
        heading: "Trust is what makes it work",
        body: [
          "Capture only relieves mental load if you trust the inbox. That trust is built from small things: the item is visibly saved, it is still there tomorrow, search finds it later, and nothing silently disappears.",
          "This is why undo matters more than it appears to. If completing or deleting something is reversible, you stop being careful, and being careful is what slows you down.",
        ],
      },
    ],
    faq: [
      {
        question: "How is quick capture different from a notes app?",
        answer:
          "A notes app stores text. A capture system is built around the speed of getting text in and the certainty of finding it again. The difference shows in the details: a focused input on open, keyboard entry from anywhere, and a single inbox that does not ask you to choose a location first.",
      },
      {
        question: "Should I organise my inbox every day?",
        answer:
          "Not necessarily. Organise when the inbox stops being useful to scan, which for most people is far less often than daily. The point of capturing without filing is that filing becomes optional rather than a routine you can fall behind on.",
      },
    ],
  },

  {
    slug: "natural-language-dates",
    title: "How DoTo reads dates out of plain language",
    description:
      "What DoTo understands when you type tomorrow at 10, every monday, or next friday, and why parsing is never required to save something.",
    published: "2026-09-03",
    tags: ["Features", "Capture", "Dates"],
    readingMinutes: 4,
    intro: [
      "The fastest way to set a due date is to not set one. Typing the date as part of the sentence takes no extra interaction, no picker, and no second thought. DoTo reads what it recognises out of the text and leaves the rest alone as the title.",
      "This is deliberately a convenience rather than a requirement. If nothing is recognised, the whole line becomes the title and the item saves anyway.",
    ],
    sections: [
      {
        heading: "Dates it understands",
        body: [
          "Relative days and named weekdays are recognised, including the shorthand people actually type.",
        ],
        list: [
          "today, tomorrow, and the abbreviations tmrw, tmr, and tomo",
          "any weekday by name, such as friday",
          "next followed by a weekday, such as next monday",
        ],
      },
      {
        heading: "Times, including the ambiguous ones",
        body: [
          "Times work with or without a meridian. Written as 14:30 or 9am there is no ambiguity. A bare hour is more interesting: typing at 5 almost always means the evening, while at 9 almost always means the morning.",
          "DoTo resolves bare hours from one to six as the afternoon and everything else as written, because that matches how people actually speak. Hours from 13 to 23 are already unambiguous and are taken at face value.",
        ],
      },
      {
        heading: "Repeats",
        body: [
          "Recurrence is recognised from the same line. Daily, weekly, monthly, and yearly all work, as do the phrasings every day and every week. Naming a weekday, as in every monday, sets a weekly repeat pinned to that day.",
          "Completing a repeating task creates its next occurrence rather than advancing the same item, so the one you finished stays in Completed as a genuine record of what you did.",
        ],
      },
      {
        heading: "Tags",
        body: [
          "A word beginning with a hash becomes a tag and is removed from the title, so \"Pay the internet bill #home\" is titled Pay the internet bill and tagged home.",
          "A hash inside a URL is left alone. Pasting a link with an anchor does not invent a tag out of the fragment.",
        ],
      },
    ],
    faq: [
      {
        question: "What if I do not want DoTo to read a date out of my text?",
        answer:
          "Phrase it so there is no date token, or edit the item afterwards and clear the date. The parse is shown as a chip before you save, so you can always see what was understood before committing to it.",
      },
      {
        question: "Does natural language parsing need an internet connection?",
        answer:
          "No. The parser runs entirely on your device and involves no service of any kind. It works with the network switched off, like the rest of the app.",
      },
    ],
  },

  {
    slug: "local-first-privacy",
    title: "Your tasks should not live on someone else's server",
    description:
      "A to-do list is a detailed record of your life, obligations, and health. Local-first storage means that record never leaves the device it was written on.",
    published: "2026-09-03",
    tags: ["Privacy", "Local-first", "Data"],
    readingMinutes: 5,
    intro: [
      "People underestimate what a task list reveals. Read a year of someone's to-do items and you learn their employer, their finances, their family structure, their medical appointments, and the things they are avoiding. It is one of the most revealing documents a person produces, and it is usually stored on infrastructure they have no relationship with.",
      "Local-first is the position that this data has no reason to leave your device in the first place.",
    ],
    sections: [
      {
        heading: "The default is not neutral",
        body: [
          "Most task apps require an account before they will accept a single item. That is a product decision, not a technical necessity. Storing a list of short text strings does not require a server, and browsers have shipped a capable local database for well over a decade.",
          "The account exists because it enables sync, and because it converts a tool into a relationship with a company that can change its terms, its pricing, or its ownership.",
        ],
      },
      {
        heading: "What local-first actually means",
        body: [
          "It means the copy on your device is the real one, not a cache of a server copy. Everything works without a network because nothing depends on one. There is no account to compromise and no server-side breach that can expose your list, because there is no server-side.",
          "It also means no analytics inside the app, which is a smaller thing that adds up. Most productivity apps report which features you touch and how often you open them. A local-first app has nowhere to send that even if it wanted to.",
        ],
      },
      {
        heading: "The honest downsides",
        body: [
          "Clearing your browser storage deletes the data. Losing the device loses the data. There is no password reset because there is no password, and no support team who can recover anything for you.",
          "The mitigation is export. A single file containing everything, written to wherever you already keep important files, gives you the recovery story without giving anyone else your list. It is a manual step, and being manual is the point: nothing moves without you deciding it should.",
        ],
      },
      {
        heading: "Portability instead of lock-in",
        body: [
          "The test of whether a tool respects you is how easily you can leave. Data in a documented, plain format that exports in one action is data you still own. Data behind an API, an export queue, and a support ticket is not.",
          "Local-first makes this almost automatic. When the data is already on your machine in a readable format, leaving is a file copy rather than a negotiation.",
        ],
      },
    ],
    faq: [
      {
        question: "Is local-first storage secure?",
        answer:
          "It has a different risk profile rather than a strictly better one. There is no server to breach and no account to steal, which removes the largest category of risk. In exchange, the security of your data becomes the security of your device, so a device passcode and disk encryption matter.",
      },
      {
        question: "Can DoTo see my tasks?",
        answer:
          "No. There is no server, no account, and no analytics in the app. Your items are written to your browser's storage and stay there until you export or delete them.",
      },
    ],
  },

  {
    slug: "keyboard-first-task-management",
    title: "Keyboard-first task management: every DoTo shortcut",
    description:
      "A complete reference for operating DoTo without touching the mouse, from capture to completion, and the reasoning behind each binding.",
    published: "2026-09-03",
    tags: ["Keyboard", "Reference", "Productivity"],
    readingMinutes: 4,
    intro: [
      "A task tool that requires the mouse interrupts the thing you were doing twice: once to switch to it, and again to come back. Keyboard operation is not a power-user luxury here, it is what keeps the interruption short.",
      "DoTo is built so that everything reachable by gesture is also reachable by key, and everything reachable by key is discoverable from the shortcuts panel with the question mark.",
    ],
    sections: [
      {
        heading: "Getting things in",
        body: [
          "Capture is the only shortcut worth committing to memory immediately. It works from any view.",
        ],
        list: [
          "Ctrl or Cmd with K opens Quick Capture",
          "Typing a hash inside capture suggests tags you already use",
          "Typing an angle bracket switches the same field into command mode",
          "Enter saves and closes",
        ],
      },
      {
        heading: "Finding things again",
        body: [
          "Search is deliberately on a single unmodified key, because it is the second most common thing you do.",
        ],
        list: [
          "Slash, or Ctrl and Cmd with F, opens search",
          "Arrow keys move through results",
          "Enter opens the highlighted result",
        ],
      },
      {
        heading: "Operating on items",
        body: [
          "This is where most task apps run out of keyboard. Moving between views is easy; acting on what is in front of you usually is not.",
        ],
        list: [
          "J and K, or the arrow keys, move focus between items",
          "Space completes the focused item",
          "Enter opens it for editing",
          "Ctrl or Cmd with Z undoes the last completion or deletion",
        ],
      },
      {
        heading: "Moving around",
        body: [
          "Single letters switch views, chosen to match the first letter of each.",
        ],
        list: [
          "I for Inbox, T for Today, C for Completed, S for Settings",
          "Question mark shows the full shortcut list",
          "Escape closes the topmost open layer, one at a time",
        ],
      },
    ],
    faq: [
      {
        question: "Why does Space complete an item instead of opening it?",
        answer:
          "Completing is the primary action on a task and deserves the larger key. Enter opens the item for editing, which is the less frequent of the two. Space previously did both, which left no keyboard route to completion at all.",
      },
      {
        question: "Do the shortcuts work while I am typing in a field?",
        answer:
          "Single-letter shortcuts do not, so typing a title containing the letter t does not navigate away. Escape and the modifier combinations still work, and Ctrl with Z is left to the browser inside a text field so ordinary text undo behaves as expected.",
      },
    ],
  },
];

export const posts = [...POSTS].sort((a, b) =>
  b.published.localeCompare(a.published)
);

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}
