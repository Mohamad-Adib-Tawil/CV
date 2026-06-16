# File Index — Mohamad Adib Tawil Online CV

## Legend

| Importance | Meaning |
|-----------|---------|
| **CRITICAL** | Core logic; do not modify without deep analysis |
| **HIGH** | Important; understand dependencies before modifying |
| **MEDIUM** | Moderate impact; usually safe with caution |
| **LOW** | Safe to modify freely |

---

## HTML Pages

| File | Responsibility | Dependencies | Importance | Safe To Modify |
|------|---------------|--------------|------------|----------------|
| `index.html` | Main CV page for Flutter Developer version. Contains semantic HTML structure, SEO/OG tags, JSON-LD schemas, nav, header, sections, footer, and script loading. | `cv-data.js`, `main.js`, `styles.css`, Font Awesome, Google Fonts | **CRITICAL** | No — structural changes affect both CV versions |
| `se.html` | Main CV page for Software Engineer version. Same structure as `index.html` but with `window.CV_VERSION='se'`, additional section (`#additional-experience`), and different page title. | `cv-data.js`, `main.js`, `styles.css` | **CRITICAL** | No — must stay in sync with `index.html` |
| `downloads.html` | Download page for Flutter Developer CV. Contains download links, Word export buttons, plain text reference. | `cv-data.js`, `main.js`, `styles.css` | **HIGH** | With caution — links to `assets/downloads/CV_*.*` |
| `downloads-se.html` | Download page for Software Engineer CV. Same as `downloads.html` but with `CV_VERSION='se'` and SE file paths. | `cv-data.js`, `main.js`, `styles.css` | **HIGH** | With caution — links to `assets/downloads/CV_SE_*.*` |

## JavaScript Files

| File | Responsibility | Dependencies | Importance | Safe To Modify |
|------|---------------|--------------|------------|----------------|
| `assets/js/cv-data.js` | Single source of truth for ALL CV content. Contains `CV_DATA` object with `profile`, `stats`, `projects`, `downloads`, and bilingual `translations` (601 lines). Handles CV_VERSION switching. | None (self-contained) | **CRITICAL** | No — all content originates here |
| `assets/js/main.js` | Rendering engine. Self-executing IIFE that handles: theme system, language switching, DOM rendering, stats animation, particle effects, scroll spy, parallax, typing effect, Word export (DOCX via Blob), download availability guard, and snackbar system (1027 lines). | `cv-data.js`, `styles.css` | **CRITICAL** | No — core runtime behavior |

## CSS Files

| File | Responsibility | Dependencies | Importance | Safe To Modify |
|------|---------------|--------------|------------|----------------|
| `assets/css/styles.css` | All visual styles in one file (1184 lines). CSS variables, 7 theme presets, dark mode, responsive breakpoints (1024px, 900px, 768px, 480px, 360px), RTL support, print styles, animations, micro-interactions. | None | **CRITICAL** | No — tightly coupled with HTML structure |

## Scripts

| File | Responsibility | Dependencies | Importance | Safe To Modify |
|------|---------------|--------------|------------|----------------|
| `scripts/generate_cv.js` | Node.js CLI for generating DOCX (using `docx` npm package) and PDF (using Puppeteer). Reads `cv-data.js` via `require()`. | `cv-data.js`, `docx`, `puppeteer` | **LOW** | Yes — standalone tool, not used by web pages |

## Markdown / Text Assets

| File | Responsibility | Dependencies | Importance | Safe To Modify |
|------|---------------|--------------|------------|----------------|
| `assets/cv/CV_Text_EN_AR.md` | Bilingual plain text CV (reference for download) | None | **LOW** | Yes — content copy |
| `assets/cv/CV_Text_EN.md` | English plain text CV | None | **LOW** | Yes |
| `assets/cv/CV_Text_AR.md` | Arabic plain text CV | None | **LOW** | Yes |
| `assets/cv/CV_Remote_EN.md` | English remote CV variant | None | **LOW** | Yes |
| `assets/cv/CV_Remote_AR.md` | Arabic remote CV variant | None | **LOW** | Yes |
| `assets/cv/CV_Remote_EN_AR.md` | Bilingual remote CV variant | None | **LOW** | Yes |
| `cv.md` | Markdown CV file | None | **LOW** | Yes |
| `README.md` | Project README | None | **LOW** | Yes |

## Configuration Files

| File | Responsibility | Dependencies | Importance | Safe To Modify |
|------|---------------|--------------|------------|----------------|
| `.claude/launch.json` | Claude Code launch config (serves on port 4200) | None | **LOW** | Yes |
| `.claude/settings.local.json` | Claude Code permission rules | None | **LOW** | Yes |

## Download Assets

| File | Responsibility | Dependencies | Importance | Safe To Modify |
|------|---------------|--------------|------------|----------------|
| `assets/downloads/.gitkeep` | Placeholder to keep downloads directory in git | None | **LOW** | Yes |

## Other

| File | Responsibility | Dependencies | Importance | Safe To Modify |
|------|---------------|--------------|------------|----------------|
| `welcome_banner.svg` | SVG banner graphic | None | **LOW** | Yes |
| `welcome_banner.svg` | Welcome banner graphic | None | **LOW** | Yes |
