# Contributing to DoTo

Thank you for considering a contribution. DoTo is a carefully crafted product, and every change should preserve the product philosophy:

> Capture it instantly. Organize it later. Finish it beautifully.

## Principles

- **UX is the product.** Fix weak UX rather than accepting "technically works."
- **Never hardcode visual values.** Use the design-token system in `src/app/globals.css`. Users can change fonts, text size, and more in Settings.
- **Keep it lightweight.** Do not add productivity bloat, gamification, or unnecessary complexity.
- **Accessibility and motion** are first-class. Respect `prefers-reduced-motion` and keep everything usable without touch, sound, animation, or color.

## Development workflow

1. Fork and clone the repository.
2. Install dependencies with `npm install`.
3. Run the development server with `npm run dev`.

## Making changes

- Write code that matches the existing style and typing conventions.
- Run `npm run lint` and `npm run build` before opening a pull request. The production build must pass with a clean TypeScript check.
- Update the work tracker if you complete a phase or a meaningful chunk of work.

## Commit conventions

Commits should be small, focused, and describe a single meaningful stage. Use the imperative mood (for example, "Add quick capture dialog" rather than "Added ...").

## Pull requests

- Keep changes scoped and reviewable.
- Describe what the change does and why, and how you verified it (lint, build, manual testing across mobile and desktop).
- Include relevant before/after details for any UX changes.

## Questions

Open an issue for bug reports, feature proposals, or design discussions before writing code.
