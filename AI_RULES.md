# AI Rules — Inferred from Codebase

> These rules are derived from existing patterns in the codebase. Future changes MUST follow them.

---

## Naming Rules

| Rule | Example from Codebase | Must NOT |
|------|----------------------|----------|
| Use `camelCase` for JS variables and functions | `applyThemeState`, `renderNav`, `fileSafeName` | Do NOT use snake_case or PascalCase for JS variables |
| Use `PascalCase` for objects used as constructors/namespaces | `CV_DATA`, `Document`, `Packer` | Do NOT mix conventions |
| Use `kebab-case` for CSS classes and HTML IDs | `theme-toggle`, `stat-number`, `cv-switch-bar` | Do NOT use camelCase or snake_case in CSS selectors |
| Use `BEM-like` naming for related components | `exp-entry`, `exp-entry-header`, `exp-entry-meta` | Do NOT use single-word ambiguous names |
| Use `snake_case` for file names | `cv-data.js`, `generate_cv.js`, `settings.local.json` | Do NOT use spaces or camelCase in file names |
| HTML `id` attributes: `camelCase` | `themeToggle`, `langSelect`, `statsGrid` | Do NOT use kebab-case for element IDs |
| CSS custom properties: `--kebab-case` | `--primary-color`, `--glass-bg`, `--tint-weak` | Do NOT use --camelCase for CSS variables |

## Folder Rules

| Rule | Rationale |
|------|-----------|
| All CSS in `assets/css/` — single file | Pipeline is trivial; no CSS bundler |
| All JS in `assets/js/` — two files only | No module system; data separated from logic |
| All plain text CVs in `assets/cv/` | Keeps content copies separate from source |
| All download files in `assets/downloads/` | Single location for generated documents |
| Scripts go in `scripts/` | Node.js tooling isolated from web-facing code |
| Per-project media lives in `assets/projects/<slug>/{screenshots,video}/` | `<slug>` === `project.id`/`project.slug`; screenshots `screenshot-01.png`…, video `demo.mp4` (+ optional `poster.jpg`), direct APK `<slug>-latest.apk` |
| Do NOT create new top-level folders without documenting the change | Project is flat and organized |

## Component Rules

| Rule | Source Pattern |
|------|---------------|
| Declarative rendering from data objects | `renderStats`, `renderProjects` read from arrays and generate HTML strings |
| Function-per-responsibility | Each rendering concern has its own function (e.g., `renderNav`, `renderHeader`, `renderFooter`) |
| Pass language dictionary as parameter | All render functions accept `dict` parameter for i18n |
| Use `$` as shorthand for `getElementById` | `const $ = (id) => document.getElementById(id);` |
| Do NOT use frameworks (React, Vue, etc.) | Current codebase is vanilla JS only |
| Do NOT add build steps | No bundler, no transpiler; deploy raw HTML/CSS/JS |
| Keep IIFE pattern for main.js | `(() => { ... })()` wrapping prevents global scope pollution |

## Styling Rules

| Rule | Source Pattern |
|------|---------------|
| Use CSS custom properties for theming | `--primary-color`, `--accent-color`, `--glass-bg` |
| All colors defined via variables, never hardcoded | Theme presets only change variable values |
| Use `clamp()` for fluid typography | `font-size: clamp(1.8rem, 1.2rem + 2vw, 2.4rem)` |
| Use `:root` for base variables, `.dark-mode` overrides for dark theme | Default → dark overrides → theme presets |
| Mobile-first / responsive via `@media` with breakpoints: 1024, 900, 768, 480, 360 | Separate breakpoints for each layout change |
| Always respect `prefers-reduced-motion` | `@media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }` |
| Glassmorphism aesthetic: `backdrop-filter: blur()`, semi-transparent backgrounds | `--glass-bg: rgba(255, 255, 255, 0.55)` |
| Do NOT use CSS frameworks (Tailwind, Bootstrap, etc.) | Pure CSS only |
| Do NOT add inline styles in JS except for dynamic values | `element.style.cssText = "..."` used only for snackbar host |

## State Rules

| Rule | Source Pattern |
|------|---------------|
| Persist user preferences in `localStorage` only | Theme, themePreset, lang |
| Use a single global `state` object for runtime state | `const state = { currentLang: "en", statsAnimated: false }` |
| No state management libraries | Pure JS object + localStorage |
| State is read on `DOMContentLoaded` and written on user interaction | No observers or reactivity |

## Reusability Rules

| Rule | Source Pattern |
|------|---------------|
| Utility functions for text/HTML manipulation | `setText(id, value)`, `setHtml(id, value)`, `setHeadingText(id, value)` |
| Utility functions for data transformation | `escapeHtml()`, `stripHtml()`, `compactUrl()`, `fileSafeName()` |
| Data-driven rendering | All content comes from arrays/maps in `cv-data.js`, not hardcoded in JS |
| Render functions that accept language dict | `renderNav(dict)`, `renderHeader(dict)`, etc. are called with the active dictionary |
| No duplicated rendering patterns | `renderList(selector, items)` handles any `<ul>` population |

## Performance Rules

| Rule | Source Pattern |
|------|---------------|
| Use `IntersectionObserver` for scroll-triggered animations | `initRevealAnimations()`, `initNavSpy()`, `initStatsAnimation()`, `initTypingEffect()` |
| Use `requestIdleCallback` for non-critical work | Particle creation uses `window.requestIdleCallback(createParticles)` |
| Use `passive: true` for scroll listeners | `window.addEventListener("scroll", onScroll, { passive: true })` |
| Use `will-change` for animated elements | `.floating`, `header` use `will-change: transform` |
| Lazy-load images below the fold | Project thumbnails use `loading="lazy"`, `decoding="async"` |
| Use `fetchpriority="high"` for hero image | Profile picture uses `fetchpriority="high"`, `loading="eager"` |
| Debounce or throttle scroll handlers when possible | Currently using direct passive listener (no debounce) — could be added |
| Do NOT add animation libraries | Vanilla CSS animations + JS IntersectionObserver |

## Security Rules

| Rule | Source Pattern |
|------|---------------|
| Always `escapeHtml()` user-facing dynamic content | `escapeHtml()` utility used in every `innerHTML` assignment |
| Use `rel="noopener noreferrer"` for external links | All `<a target="_blank">` links include these |
| Snackbar system uses `pointer-events: none` on host | Host container prevents click-jacking |
| No form inputs that accept user data | No XSS vectors present |
| Do NOT use `eval()`, `innerHTML` with unsanitized data | All dynamic HTML is constructed safely |
| Do NOT expose secrets or API keys | No backend secrets in client-side code |

## Accessibility Rules

| Rule | Source Pattern |
|------|---------------|
| Skip navigation link present | `<a class="skip-link" href="#main">Skip to main content</a>` |
| ARIA attributes for interactive elements | `aria-label`, `aria-pressed`, `aria-current`, `role="tablist"`, `role="tab"`, `aria-selected` |
| `aria-hidden="true"` on decorative icons | All `<i class="fas ...">` icons use `aria-hidden="true"` |
| Proper heading hierarchy | h1 → h2 → h3, no skipped levels |
| Color contrast check in JS | `updateContrast()` function dynamically adjusts if ratio < 4.5 |
| `prefers-reduced-motion` respected | Disables all animations and transitions |
| `:focus-visible` outlines on interactive elements | `a:focus-visible, button:focus-visible` styled distinctly |
| RTL support via `dir` attribute | `<html dir="rtl">` with CSS selectors for RTL adjustments |
| Visually hidden utility class | `.visually-hidden` for screen-reader-only content |
| Do NOT remove focus outlines | Never use `outline: none` without providing `:focus-visible` alternative |
| Do NOT rely on color alone for conveying information | Icons + text patterns used throughout |

## Must NOT Do — Hard Rules

| # | Rule |
|---|------|
| 1 | Do NOT add a JavaScript framework or build system |
| 2 | Do NOT add CSS frameworks |
| 3 | Do NOT remove/rename existing `cv-data.js` keys (profile, stats, projects, translations, downloads). New OPTIONAL keys MAY be added additively — e.g. each project now also has `slug`, `bio`, `links`, `media`, and each translation has a `detailPage` block (added for the project detail pages) |
| 4 | Do NOT break the IIFE pattern in `main.js` |
| 5 | Do NOT use inline event handlers in HTML (`onclick`, etc.) |
| 6 | Do NOT remove `aria-hidden="true"` from decorative icons |
| 7 | Do NOT hardcode colors that bypass CSS variable system |
| 8 | Do NOT introduce server-side rendering or backend |
| 9 | Do NOT commit download files to git (gitkeep is enough) |
| 10 | Do NOT change file naming conventions |
