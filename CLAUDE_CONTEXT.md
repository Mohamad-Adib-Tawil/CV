# CLAUDE_CONTEXT — Mohamad Adib Tawil Online CV

**Project**: Personal CV website for Mohamad Adib Tawil (Flutter Developer / Mobile Engineer).  
**Nature**: Static HTML/CSS/JS site (NOT a Flutter app). Vanilla JS only — no frameworks, no build tools.  

## Critical Files

| File | Why Critical |
|------|-------------|
| `assets/js/cv-data.js` | ALL content lives here: `CV_DATA` object with `profile`, `stats`, `projects`, `downloads`, bilingual `translations`. Exact shape is contract for all rendering. |
| `assets/js/main.js` | 1027-line IIFE — entire runtime: theme, i18n, rendering, animations, export, download guard. Every function called from `DOMContentLoaded`. |
| `assets/css/styles.css` | 1184 lines, single stylesheet. CSS variables + 7 theme presets + dark mode + 5 breakpoints + RTL. |
| `index.html` / `se.html` | Two CV versions. `se.html` sets `window.CV_VERSION='se'` which triggers extended content in `cv-data.js`. |
| `downloads.html` / `downloads-se.html` | Download pages. `downloads-se.html` also sets `CV_VERSION='se'`. |

## Key Architecture

```
cv-data.js (data) → main.js (rendering) → DOM
                  → main.js (Word/ATS export) → Blob download
scripts/generate_cv.js (standalone) → DOCX via `docx` npm + PDF via Puppeteer
```

- **CV_VERSION switch**: `cv-data.js:424-586` checks `window.CV_VERSION`. If `'se'`, it overrides translations with multi-entry experience, additional-tech section, and alternate file paths.  
- **Rendering**: All content is data-driven. `applyLanguage()` calls 7 render functions in sequence.  
- **State**: Single `state = { currentLang, statsAnimated }` object. Persists via `localStorage` (keys: `theme`, `themePreset`, `lang`).  
- **Animations**: CSS animations + `IntersectionObserver` for reveal, stats counter, nav spy, typing effect, parallax.  
- **Export**: Client-side Word export via `Blob` with `application/msword` MIME type. ATS version has uppercase, keyword section, simpler layout.  

## Rules Summary

1. **Naming**: JS `camelCase`, CSS `kebab-case`, files `snake_case`, IDs `camelCase`.  
2. **No frameworks**: Vanilla JS + CSS only. No React, Vue, Tailwind, Bootstrap.  
3. **Security**: Always `escapeHtml()` before `innerHTML`. `rel="noopener"` on external links. No forms.  
4. **Accessibility**: Skip link, ARIA attributes, focus-visible, RTL via `dir`, `prefers-reduced-motion`.  
5. **Performance**: IntersectionObserver, `requestIdleCallback`, `passive: true`, `will-change`.  
6. **CSS**: All colors via `--variables`. Fluid typography via `clamp()`. Glassmorphism aesthetic.  
7. **No backend**: Zero server-side code. No API calls at runtime. CDN fonts + icons + analytics only.  

## Theme System

7 presets (Blue/Purple/Teal/Slate/RoyalGold/Silver/Midnight) via body classes (`theme-*`). Midnight forces dark mode. CSS also defines `theme-navy`/`theme-emerald` but JS normalizes them. `meta[name="theme-color"]` updates dynamically.

## Responsive Breakpoints

1200px (max-width lock), 1024px, 900px, 768px (major — header centers, nav collapses), 480px, 360px.

## RTL

Arabic sets `<html dir="rtl">`, switches font to Tajawal, flips layout via `html[dir="rtl"]` CSS selectors.

## CV Content Management

To update CV content: edit `translations.en` and `translations.ar` in `cv-data.js`. Also update SE overrides (lines 424-586). Plain text copies in `assets/cv/*.md` are secondary — update manually.

## Safe Zones

| Zone | Files |
|------|-------|
| **SAFE** | `assets/cv/*.md`, `cv.md`, `README.md`, `scripts/generate_cv.js`, `.claude/*`, `.gitkeep` |
| **CAUTION** | `index.html`, `se.html`, `downloads.html`, `downloads-se.html` (structure must match JS) |
| **CRITICAL** | `assets/js/cv-data.js`, `assets/js/main.js`, `assets/css/styles.css` |

## Workflow Primers

- **Add content**: edit `cv-data.js` translations → update HTML if new elements → add render function in `main.js` → cache-bust asset URLs  
- **Fix bug**: trace from `DOMContentLoaded` init chain → isolate to render/event/data/CSS layer  
- **Add theme**: `styles.css` class → `THEME_CLASSES` + `applyPreset()` switch in `main.js` → `<option>` in HTML  

## Known Issues

- No build system, tests, or PWA.  
- Download files are placeholders (`.gitkeep`). Place real PDFs/DOCXs in `assets/downloads/`.  
- `theme-navy` and `theme-emerald` CSS classes exist but are unused (JS normalizes them).  
- Cache busting via manual `?v=` param updates.
