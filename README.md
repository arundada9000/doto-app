# DoTo

> **Capture it instantly. Organize it later. Finish it beautifully.**

DoTo is a premium offline-first PWA for quick capture and tasks. It is designed to be the fastest, most satisfying place to put down something you need to remember, whether that is a task, note, idea, checklist, reminder, link, or a fleeting thought.

This is not another bloated productivity suite. It is a frictionless personal capture system that happens to have tasks. The competitive advantage is exceptional UX: speed, responsiveness, thoughtful motion, and an extremely low-friction capture experience.

## Core Philosophy

**Think -> Capture -> Forget about it -> Return when needed -> Complete -> Feel satisfied**

The user should never be forced to organize something before capturing it. Capture first. Organization later.

## Features (V1)

**Capture**
- Instant-focus Quick Capture (Ctrl+K)
- Natural language parsing: type `Call Ram tomorrow at 10` and DoTo understands the title, date, and time
- Capture is never mandatory to interpret: type `Buy milk` and it simply saves
- Keyboard capture (`Ctrl+K`, `N`, `/`, `T`, `I`, `C`)
- PWA app shortcuts and share target

**Items**
- Unified items that evolve: a thought can become a task, then gain a checklist, due date, and reminder
- Tasks, notes, and checklists
- Due dates and times
- Recurring tasks
- Reminders
- Tags
- Attachments and links

**Views**
- Inbox: everything captured lands here, friction-free
- Today: a focused view of todays tasks and reminders
- Completed: a quiet record of everything finished
- Search: instant across tasks, notes, tags, and links

**Experience**
- Satisfying completion interactions with coordinated motion
- Subtle, configurable sound and haptic feedback
- 12 professionally designed themes
- Full keyboard, touch, and accessibility support
- Offline-first by design

## Tech Stack

- **Next.js 16** (App Router, static export)
- **TypeScript**
- **Tailwind CSS v4**
- **Zustand** for client state
- **Dexie.js** (IndexedDB) for offline persistence
- **Framer Motion** for animation
- **Lucide** for icons

## Architecture

DoTo is architecturally **offline-first and local-first**:

- All data is stored locally in the browser using IndexedDB (through Dexie). `localStorage` is never used as the primary database.
- The application shell is cached by a service worker (`public/sw.js`) so the app launches reliably without an internet connection.
- The app is built as a **static export** (`output: "export"`), meaning it can be hosted on any static web server or CDN.
- V1 requires **no account and no network** for core functionality. Online sync is intentionally not included and the data layer is designed to support it in a future version without a rewrite.

### Folder Structure

```
src/
  app/                    Routes (inbox, today, completed, settings), root layout, manifest
  components/
    capture/              Quick capture flow
    items/                Task, note, and list components
    layout/               App shell
    navigation/           Sidebar and bottom navigation
    search/               Search overlay
    ui/                   Base design-system components
    views/                Page-level views
  lib/
    stores/               Zustand stores (items, settings, app, toast)
    hooks/                useSound, useHaptics, keyboard shortcuts, etc.
    utils/                NLP parser, date helpers, motion, cn
  providers/              Theme, font, app bootstrap
  types/                  TypeScript data model
public/
  sw.js                   Service worker (offline shell)
  icons/                  App icons
```

### Design System

All visual values live as CSS custom properties in `src/app/globals.css`. Components consume tokens such as `--bg`, `--surface`, `--accent`, `--radius-md`, `--duration-base`, and so on through the Tailwind `@theme inline` mapping. Style intent:

- No hardcoded colors or fonts in components.
- 12 themes swap these tokens at runtime, one attribute change away.
- A custom theme creator can be added later without touching the UI.

## Getting Started

### Prerequisites

- Node.js 20+ and npm

### Install

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production build

```bash
npm run build
```

The static export is written to `out/`. Serve it from any static host.

### Lint

```bash
npm run lint
```

## Offline Usage

To test offline behavior, build and serve the app, then go offline in your DevTools Network panel. The application shell loads from the service worker cache and new items persist to IndexedDB immediately.

## Accessibility

Accessibility is a first-class feature. DoTo supports keyboard navigation with visible focus states, screen readers via semantic HTML and ARIA where necessary, sufficient color contrast, generous touch targets, and full `prefers-reduced-motion` support. The app remains fully usable without touch, sound, animation, or color.

## Privacy

DoTo is privacy-friendly by default. Basic usage requires no account, and all user data stays on the device. No advertising or tracking is built into the application.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE).
