# Contributing to Retr-0

Thanks for helping make the web a little more beveled.

## Local setup

1. Install Node.js 20 or newer.
2. Run `npm install`.
3. Run `npm run typecheck` and `npm run build`.
4. Load `dist/` as an unpacked extension in Chrome.

Keep pull requests focused. A good change should explain the visual problem, the semantic signal used to solve it, and the sites or DOM fixtures checked manually.

## Guidelines

- Prefer semantic classifier rules and reusable tokens over site-specific selectors.
- Keep the visual layer scoped under `:root[data-retr0="on"]`.
- Preserve navigation, forms, keyboard behavior, ARIA, and accessible focus states.
- Do not add remote assets, analytics, tracking, or page-content uploads.
- Use local assets and document their license.
- Do not claim a site is compatible without testing it.

## Pull requests

Include a short test checklist and screenshots only when they are real captures. If the change affects a new UI surface, keep the Windows 98 visual language consistent with the popup and settings page.
