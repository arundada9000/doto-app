# Changelog

Notable changes to DoTo. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project aims
to follow [Semantic Versioning](https://semver.org/spec/v2.0.0.html) once it
reaches a first release.

## [Unreleased]

### Added

- Redesigned the marketing surfaces around an iOS glass-and-depth language:
  a translucent frosted header that raises under scroll, an interactive
  Android-style spring menu, and a hero with a cursor-tilted floating device
  frame
- An animated capture demo that types the plain-language sentence and reveals
  the parsed chips, looping calmly and honouring reduced motion
- Scroll-reveal entrances for marketing sections that fall back to visible
  content without JavaScript and respect `prefers-reduced-motion`
- A filterable blog index with tag chips and live search
- A hairline reading-progress bar at the top of each article
- Pinch-zoom re-enabled at the viewport (previously locked to `maximumScale: 1`)
- A statically rendered landing page and six articles under `/blog`, with
  `SoftwareApplication`, `FAQPage`, `BlogPosting`, `BreadcrumbList`, `Person`,
  and `WebSite` structured data generated from the page content
- OpenGraph and Twitter cards, a build-time social image, canonical URLs,
  `robots.txt`, and a sitemap
- Install screenshots in the manifest for both form factors
- Scroll-driven CSS animation on the public pages, with no client JavaScript
- Reminders are delivered while the app is open, as a system notification where
  permission allows and always as an in-app toast with sound and haptic
- Recurring tasks create their next occurrence when completed
- Undo stack with `Ctrl/Cmd + Z`, covering completion as well as deletion
- Tag autocomplete in Quick Capture, drawn from tags already in use
- Voice capture where the browser supports speech recognition
- Smart paste: a multi-line paste can become separate items or one checklist,
  and images paste straight into attachments
- Command mode in Quick Capture, entered by typing `>`
- Keyboard operations on items: `J`/`K` to move, `Space` to complete, `Enter`
  to open, and arrow keys through search results
- Drag to reorder the unsorted Inbox, from a grip handle
- One-tap carry-over for overdue items on Today
- Daily streak on Today, and a distinct sound and ring pulse when the day is
  cleared
- Attachments open full size, with a download for other file types
- PWA share target, and an application badge counting what is due
- Storage meter that warns before the device is full
- Reset settings to defaults, leaving tasks and notes untouched
- `prefers-reduced-transparency` support
- Vitest, covering the parser, recurrence, and date logic

### Changed

- Licence moved from MIT to a non-commercial licence: free to use, study,
  modify, and share, with selling reserved to the author

### Fixed

- Every app icon had opaque black corners, and the maskable icon was a byte
  copy of the standard one, so it had no safe zone for launcher masking
- Manifest shortcuts omitted the trailing slash the export serves, so all four
  resolved to a redirect or a 404
- The offline navigation fallback served the marketing page to anyone opening
  the app without a connection
- Completion effects never played: they were owned by the item row, which
  unmounts the moment the item leaves the list, and were clipped by it
- `Escape` closed no modal, because the typing guard ran before it and every
  modal autofocuses a text field
- `Call Ram tomorrow at 10` saved as midnight: a bare hour did not parse, and a
  date token overwrote the time that had been parsed before it
- Attachment object URLs were created during render and never revoked, holding
  every image in memory for the life of the page
- The collapsing header fought the scroll position on a nearly full page,
  making the list impossible to scroll
- The recurrence editor discarded weekdays that capture had understood
- Capture parsed tags but discarded them, saving every item untagged
- Buttons showed the default cursor, since Tailwind v4 no longer sets one
