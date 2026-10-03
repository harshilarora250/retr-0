# Retr-0

**Turn the modern web into Windows 98.**

Retr-0 is an open-source Chrome extension that locally translates modern websites into a Windows 98-inspired interface. It classifies semantic elements and applies reusable treatments for controls, panels, dialogs, navigation, tables, forms, cursors, and more while leaving page functionality intact.

> Screenshot and GIF slots are intentionally reserved for real captures. No fabricated product screenshots are included.

## Features

- Semantic visual transformation instead of a one-size-fits-all gray filter
- Windows 98 Retro and Modern 98 modes
- Meaningful global intensity control
- Persistent global settings and domain-level exclusions
- MutationObserver support for dynamic content and SPA navigation
- Local Windows 98-inspired cursor assets
- First-load magic-wand transformation sweep
- Popup and expanded settings page in the same visual system
- Privacy-first, local-only processing

## Installation

Retr-0 is currently installed as an unpacked Manifest V3 extension:

```sh
npm install
npm run build
```

Then open `chrome://extensions`, enable **Developer mode**, choose **Load unpacked**, and select the generated `dist/` directory.

## Development

```sh
npm run typecheck  # strict TypeScript checks
npm run build      # production extension build
npm run build:site # copy the landing/docs site to dist-site/
```

The content engine is intentionally separate from the extension UI:

```text
extension/
  background/       MV3 service worker
  content/          classifier, transformer, theme, observer, adapters
  public/           manifest, styles, local assets, popup/settings HTML
  popup/            popup behavior
  settings/         expanded settings behavior
  shared/           storage, types, DOM utilities
website/            landing page and documentation
```

## How it works

The content layer uses semantic HTML, ARIA roles, class-name signals, and computed visual cues to classify elements. It applies idempotent `retr0-kind-*` classes and lets the scoped design system handle the visual treatment. CSS custom properties represent the palette, bevels, mode, and intensity. New DOM nodes are transformed incrementally, and history navigation is observed for single-page applications.

Retr-0 does not rebuild pages, intercept requests, execute arbitrary website JavaScript, or send content to a service.

## Compatibility

Retr-0 is designed for ordinary static pages, React/Vue/Next-style applications, dynamic menus, infinite-scroll content, dark pages, and highly rounded modern interfaces. Browser-internal `chrome://` pages cannot be styled by extensions. Some sites with closed shadow DOMs, strict isolation, or unusual rendering systems may need a future site adapter.

## Privacy

Retr-0 has no account, analytics, advertising, tracking, backend, or remote content processing. Settings use Chrome sync storage. Page transformation happens locally in the browser.

## Roadmap

- Add real capture-based compatibility fixtures for common sites
- Expand site adapters without coupling them to the generic transformer
- Add automated DOM fixture tests and visual regression snapshots
- Publish signed Chrome Web Store builds
- Add optional user-selectable cursor packs

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md), [SECURITY.md](SECURITY.md), and [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md). Retr-0 is released under the [MIT License](LICENSE).
