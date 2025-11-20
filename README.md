# Mohamad Adib Tawil — Online CV

A fast, bilingual (EN/AR) online CV built with semantic HTML, accessible UI, theming presets, and print-friendly styles.

## Features
- **Language switcher**: English / العربية with proper RTL handling.
- **Theme presets**: Blue, Purple, Teal, Slate, RoyalGold, Silver, Midnight (dark-focused).
- **Dark mode**: Toggle and persisted preference.
- **Animated stats**: Counters for experience, apps, downloads, ratings.
- **Performance-friendly**: IntersectionObserver animations, reduced-motion respect, idle particle effects.
- **SEO/OG tags**: Ready for sharing cards.
- **Print-ready**: Clean A4 layout via `@media print`.

## Quick Start
Just open `index.html` in a browser.

## Project Structure
```
CV/
├─ index.html                # Main page markup
├─ assets/
│  ├─ css/
│  │  └─ styles.css          # Main stylesheet (used)
│  └─ js/
│     └─ main.js             # Interactivity, i18n, theming, counters
├─ styles.css                # Legacy/unused stylesheet (kept for reference)
└─ README.md
```

Note: `CV/styles.css` at the root is not referenced by `index.html`. The active stylesheet is `assets/css/styles.css`.

## Development Notes
- i18n/RTL: The script sets `<html lang>` and `<html dir>` and dynamically updates text content and lists.
- Theming: CSS variables with body classes like `theme-blue`, `theme-purple`, etc. `meta[name="theme-color"]` updates automatically.
- Accessibility: Skip link, ARIA attributes, reduced-motion handling.
- Counters: `.stat-number` elements use `data-target` for animated values.

## Customize
- Update personal info and links in `index.html` header.
- Adjust skills, achievements, and service lists via `assets/js/main.js` i18n dictionaries.
- Edit theme palettes in `assets/css/styles.css` under theme classes.

## Printing
Use the browser’s print dialog (File → Print). The page includes optimized print CSS for A4.

## Deployment
- GitHub Pages: Serve the folder as a static site.
- Any static host (Netlify, Vercel, etc.) works out of the box.

## License
Personal portfolio/CV. You may reuse the structure with attribution.
