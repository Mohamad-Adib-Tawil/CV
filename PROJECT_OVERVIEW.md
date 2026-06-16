# Project Overview — Mohamad Adib Tawil Online CV

## Project Name
**CV** — Online Curriculum Vitae Website

## Purpose
A fast, bilingual (EN/AR), accessible online CV website that presents the professional profile of Mohamad Adib Tawil, a Flutter Developer / Mobile Application Engineer.

## Business Goal
Provide a professional, visually appealing, and shareable online CV that can be accessed from any device, supports dark mode / theme presets, and allows visitors to download PDF/DOCX versions of the CV.

## Main Features
- **Bilingual Support**: Full English / Arabic with proper RTL direction switching
- **Theme Preset System**: 7 themes (Blue, Purple, Teal, Slate, RoyalGold, Silver, Midnight)
- **Dark Mode**: Persistent toggle saved to `localStorage`
- **Animated Counters**: Stats section with scroll-triggered counter animation (experience, apps, downloads)
- **IntersectionObserver Animations**: Fade-in reveal on scroll for sections, nav spy for active link tracking
- **CV Version Switcher**: Tab bar switching between "Flutter Developer" and "Software Engineer" CV variants
- **Document Downloads**: Pre-linked DOCX/PDF download files with availability guard
- **Word Export**: Client-side DOCX export via Blob HTML generation (Word and ATS-compliant versions)
- **Print-Ready**: Optimized `@media print` stylesheet for A4 formatting
- **Particle Effect**: Lightweight idle background animation
- **SEO & OG Tags**: Structured data (JSON-LD Person + ItemList schema), Open Graph / Twitter Card tags
- **Analytics**: Plausible analytics integration

## User Roles
| Role | Description |
|------|-------------|
| **Visitor / Recruiter** | Views CV, switches language/themes, downloads documents |
| **Owner (Mohamad Adib Tawil)** | Maintains CV content in data files |

## Technologies Used
| Technology | Usage |
|-----------|-------|
| **HTML5** | Semantic markup with ARIA attributes |
| **CSS3** | Variables, gradients, animations, media queries, flexbox/grid |
| **Vanilla JavaScript (ES6+)** | All interactivity: IIFE pattern, DOM manipulation, localStorage |
| **Font Awesome 6** | Icon library |
| **Google Fonts** | Inter, Poppins, Tajawal (Arabic) |
| **Plausible** | Privacy-friendly analytics |
| **docx (npm)** | Node.js script for DOCX generation |
| **Puppeteer** | Node.js script for PDF generation |
| **JSON-LD** | Structured data for SEO |

## Current Project Maturity
- **Status**: Production-ready / actively maintained
- **Deployment**: GitHub Pages (`mohamad-adib-tawil.github.io/CV`)
- **Git History**: 20+ commits showing iterative improvements
- **Cache Busting**: Assets use versioned query params (e.g., `?v=20260411-1200`)

## Known Limitations
| Limitation | Details |
|------------|---------|
| **No Build System** | No bundler, minifier, or post-CSS processor |
| **Manual Asset Management** | PDF/DOCX files must be placed manually in `assets/downloads/` |
| **No Unit Tests** | Zero test files exist |
| **Single Author Content** | CV data is bound to one person; not designed for multi-user |
| **Node Script Not Integrated** | `scripts/generate_cv.js` is standalone, not connected to the web UI |
| **No Offline Support** | No service worker or PWA manifest |
| **Legacy Theme Classes** | CSS references `theme-navy` and `theme-emerald` but JS normalizes them to `theme-royal`/`theme-silver` |
