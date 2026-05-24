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
├─ downloads.html            # Download/export page
├─ assets/
│  ├─ css/
│  │  └─ styles.css          # Main stylesheet (used)
│  └─ js/
│     ├─ cv-data.js          # Shared content/data source
│     └─ main.js             # UI rendering, theming, interactions, exports
├─ scripts/
│  └─ generate_cv.js         # Optional DOCX/PDF generation script
└─ README.md
```

## Development Notes
- Content architecture: shared CV copy now lives in `assets/js/cv-data.js`, so homepage, downloads page, and exports pull from one source.
- i18n/RTL: The script sets `<html lang>` and `<html dir>` and dynamically renders translated sections from shared data.
- Theming: CSS variables with body classes like `theme-blue`, `theme-purple`, etc. `meta[name="theme-color"]` updates automatically.
- Accessibility: Skip link, ARIA attributes, reduced-motion handling.
- Counters: `.stat-number` elements use `data-target` for animated values.

## Customize
- Update CV content in `assets/js/cv-data.js`.
- Adjust rendering behavior and interactions in `assets/js/main.js`.
- Edit theme palettes and responsive layout rules in `assets/css/styles.css`.

## Printing
Use the browser’s print dialog (File → Print). The page includes optimized print CSS for A4.

## Deployment
- GitHub Pages: Serve the folder as a static site.
- Any static host (Netlify, Vercel, etc.) works out of the box.

## License
Personal portfolio/CV. You may reuse the structure with attribution.
