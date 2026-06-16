# SOURCE TRUTH MAP
**Authority**: Extracted directly from source code. Supersedes all prior documentation.
**Files read**: `index.html` (299L), `se.html` (299L), `downloads.html` (127L), `downloads-se.html` (128L), `assets/js/main.js` (1027L), `assets/css/styles.css` (1184L), `assets/js/cv-data.js` (601L).

---

## 1. DOM STRUCTURE

### 1.1 All Four Pages — Shared Outer Shell
All pages share this `<body>` structure (differences noted per page):

```
<html lang="en"> [class="dark-mode" injected before paint by inline script]
  <head>
    [meta, OG/Twitter tags, JSON-LD schemas, CDN CSS, font links, styles.css]
    [inline script 1]: dark-mode class on <html> unless localStorage.theme === 'light'
    [inline script 2 — se.html + downloads-se.html only]: window.CV_VERSION = 'se'
  </head>
  <body data-page="home|downloads">
```

### 1.2 `index.html` — Flutter CV (`data-page="home"`)

```
body
├── a.skip-link[href="#main"]
├── div.cv-switch-bar[role=tablist]          ← sticky, top:0, z-index:400, OUTSIDE <main>
│     └── div.cv-switch-inner
│           ├── a.cv-tab.active → index.html  ("Flutter Developer") [aria-selected=true]
│           ├── div.cv-tab-divider
│           └── a.cv-tab → se.html            ("Software Engineer")  [aria-selected=false]
├── div.particles-container#particles         ← fixed, z-index:-1, JS injects .particle divs
├── button.theme-toggle#themeToggle           ← fixed, top:15px, right:15px, z-index:1000
├── button.scroll-to-top#scrollToTop          ← fixed, bottom:20px, right:20px, z-index:999
└── main#main
      └── div.container
            ├── nav.top-nav.cv-nav[aria-label="Primary"]
            │     ├── div.nav-links
            │     │     ├── a#navSummary      → #summary
            │     │     ├── a#navExperience   → #experience
            │     │     ├── a#navProjects     → #projects
            │     │     ├── a#navSkills       → #skills
            │     │     ├── a#navEducation    → #education
            │     │     ├── a#navAchievements → #achievements
            │     │     ├── a#navAdvanced     → #advanced-skills
            │     │     ├── a#navServices     → #services
            │     │     └── a#navLanguages    → #languages
            │     └── div.nav-controls
            │           ├── a#navDownload.nav-download → downloads.html
            │           ├── div.theme-switcher → select#themePreset (7 options)
            │           └── div.lang-switcher  → select#langSelect (en/ar)
            │
            ├── header#header
            │     ├── img.profile-pic.floating [hardcoded avatar URL, fetchpriority=high]
            │     └── div.header-info
            │           ├── h1.gradient-text "Mohamad Adib Tawil" [hardcoded]
            │           ├── div#jobTitle.title
            │           ├── div.header-flags
            │           │     └── span#availabilityBadge.availability-badge
            │           ├── div.contact-info
            │           │     ├── div.contact-item [email]
            │           │     ├── div.contact-item [LinkedIn]
            │           │     └── div.contact-item [GitHub]
            │           └── div.cta-buttons  [5 buttons]
            │                 ├── a.btn.btn-primary [View Work → #projects]
            │                 ├── a.btn.btn-secondary [Get in Touch → mailto]
            │                 ├── a.btn.btn-secondary [GitHub]
            │                 ├── a.btn.btn-secondary [Download Resume → downloads.html]
            │                 └── a.btn.btn-secondary [Hire Me → mailto with subject]
            │
            ├── section#stats.stats-section
            │     └── div#statsGrid.stats-grid  [JS-rendered; empty in HTML]
            │
            ├── section#summary
            │     ├── h2#summaryTitle
            │     └── p#summaryText [hardcoded EN text, overwritten by JS]
            │
            ├── section#experience
            │     ├── h2#experienceTitle
            │     ├── h3#experienceRole      [Flutter version: single h3]
            │     └── ul#experienceList      [Flutter version: list rendered by JS]
            │       NOTE: NO #experienceContainer in index.html (SE-only)
            │
            ├── section#projects
            │     └── div[overflow-x:auto]
            │           └── table.project-table
            │                 ├── thead > tr > th×2 ("Project", "Description")
            │                 └── tbody#projectsTableBody [JS-rendered; empty in HTML]
            │
            ├── section#skills
            │     ├── h2#skillsTitle
            │     └── ul.skill-list [hardcoded EN items, overwritten by JS]
            │
            ├── section#education
            │     ├── h2#educationTitle
            │     ├── h3 [hardcoded full education string]
            │     └── ul [hardcoded items, overwritten by JS]
            │
            ├── section#achievements
            │     ├── h2#achievementsTitle
            │     └── ul.achievement-list [hardcoded, overwritten by JS]
            │
            ├── section#advanced-skills
            │     ├── h2#advancedSkillsTitle
            │     └── ul.advanced-skill-list [hardcoded, overwritten by JS]
            │
            ├── section#services
            │     ├── h2#servicesTitle
            │     └── ul.service-list [hardcoded, overwritten by JS]
            │
            ├── section#languages
            │     ├── h2#languagesTitle
            │     └── p#languagesText
            │
            └── footer.footer
                  └── div.footer-content (CSS grid 3 columns)
                        ├── div.footer-section
                        │     ├── h3#footerQuickLinksTitle
                        │     └── nav.footer-nav
                        │           ├── a#footerSummaryLink
                        │           ├── a#footerExperienceLink
                        │           ├── a#footerProjectsLink
                        │           ├── a#footerSkillsLink
                        │           └── a#footerDownloadLink → downloads.html
                        ├── div.footer-section
                        │     ├── h3#footerConnectTitle
                        │     └── div.social-links (email, LinkedIn, GitHub)
                        └── div.footer-section
                              ├── h3#footerInfoTitle
                              ├── div.footer-flags
                              │     ├── span#employmentBadge.employment-badge
                              │     └── div#headerBadges.header-badges [JS-rendered]
                              └── p.footer-text © <span#currentYear>
```

**SECTION ORDER (canonical, 10 sections):**
1. `#stats` (stats-section — not a normal section element)
2. `#summary`
3. `#experience`
4. `#projects`
5. `#skills`
6. `#education`
7. `#achievements`
8. `#advanced-skills`
9. `#services`
10. `#languages`

---

### 1.3 `se.html` — Software Engineer CV (`data-page="home"`)

**Differences from `index.html`:**
- `<script>window.CV_VERSION = 'se';</script>` is the FIRST script in `<head>`.
- `cv-tab.active` is on the SE tab; Flutter tab is inactive.
- `#navDownload` → `downloads-se.html` (not `downloads.html`).
- `#jobTitle` default text: "Software Engineer & Flutter Developer".
- `mailto` subject: "Hiring%20-%20Software%20Engineer%20%26%20Flutter%20Developer".
- CTA download → `downloads-se.html`.
- `section#experience` has `<div id="experienceContainer"></div>` (empty, JS fills it).
- `section#experience` has NO `h3#experienceRole` and NO `ul#experienceList`.
- Adds `a#navAdditionalExp → #additional-experience` (10th nav link).
- Adds `section#additional-experience` AFTER `#languages`:
  ```
  section#additional-experience
    ├── h2#additionalTechTitle
    └── div#additionalTechContainer  [JS-rendered, empty]
  ```
- Footer `#footerDownloadLink` → `downloads-se.html`.

**SE section order (11 sections):**
1. `#stats`, 2. `#summary`, 3. `#experience`, 4. `#projects`, 5. `#skills`,
6. `#education`, 7. `#achievements`, 8. `#advanced-skills`, 9. `#services`,
10. `#languages`, 11. `#additional-experience`

---

### 1.4 `downloads.html` / `downloads-se.html` (`data-page="downloads"`)

**Key differences from CV pages:**
- NO `cv-switch-bar`, NO `.particles-container`, NO `#scrollToTop`.
- Nav is a plain `.top-nav` (NOT `.cv-nav`): two links (`#downloadsBackLink` back to CV, GitHub).
- Header: `h1#downloadsPageTitle`, `#jobTitle` (subtitle), 3 contact items. NO availability badge, NO CTA buttons, NO `.floating` on avatar (`width=120`, NOT 140).
- Body has 2 `<section>` elements (no IDs): Downloads section + Plain Text section.
- Export buttons: `#exportWordBtn`, `#exportATSBtn` are in this page ONLY.
- Download links: `#downloadEnglishDocx`, `#downloadEnglishPdf`, `#downloadArabicDocx`, `#downloadArabicPdf`.
- `downloads-se.html`: adds `window.CV_VERSION = 'se'`; back link → `se.html#summary`; file hrefs use `CV_SE_*` paths; footer quick links → `se.html#*`.

---

## 2. CV DATA SCHEMA (`cv-data.js`)

### 2.1 Module Pattern
IIFE: `(function(global) { ... })(typeof window !== 'undefined' ? window : globalThis)`.
Also exports via `module.exports` for Node.js (`generate_cv.js`).

### 2.2 Top-Level Structure
```javascript
CV_DATA = {
  profile,      // object
  downloads,    // object
  stats,        // array[4]
  projects,     // array[5]
  translations  // object {en, ar}
}
```

### 2.3 `profile` object
```javascript
{
  name:           "Mohamad Adib Tawil",
  email:          "mohamad.adib.tawil@gmail.com",
  linkedinUrl:    "https://...",
  githubUrl:      "https://...",
  avatarUrl:      "https://avatars.githubusercontent.com/...",  // UNUSED by main.js
  hireMailSubject:"Hiring - Flutter Developer"                   // UNUSED by main.js
}
```

### 2.4 `downloads` object
```javascript
{
  files: {
    en: { docx: "assets/downloads/CV_EN.docx", pdf: "assets/downloads/CV_EN.pdf" },
    ar: { docx: "assets/downloads/CV_AR.docx", pdf: "assets/downloads/CV_AR.pdf" }
  },
  plainTextPath: "assets/cv/CV_Text_EN_AR.md"
}
// SE override replaces paths to CV_SE_EN.* / CV_SE_AR.*
```

### 2.5 `stats` array (4 items)
```javascript
[
  { icon: "fas fa-calendar-alt", value: 3,    label: {en: "Years Experience",    ar: "..."} },
  { icon: "fas fa-mobile-alt",   value: 5,    label: {en: "Apps Developed",      ar: "..."} },
  { icon: "fas fa-download",     value: 5000, label: {en: "Total Downloads",     ar: "..."} },
  { icon: "fas fa-star",         value: 3,    label: {en: "Years Contract Work", ar: "..."} }
]
```

### 2.6 `projects` array (5 items)
```javascript
[
  {
    id:          String,          // UNUSED by main.js rendering
    name:        String,
    tech:        String[],
    image: {
      src:       String,          // URL
      alt:       { en: String, ar: String }
    },
    description: { en: String, ar: String }  // Contains raw HTML (<a> tags) — NOT escaped
  }
]
// Projects: LKLK, Wolfera, Code Book, Office Archiving, Quran Ahmed Karasi
```

### 2.7 `translations` object
```javascript
translations = {
  en: {
    nav: { summary, experience, projects, skills, education,
           achievements, advanced, services, languages, download },
    header: { jobTitle, availability, employment, badges[], ctaWork, ctaContact,
              ctaWebsite, ctaDownload, ctaHire },
    titles: { summary, experience, projects, skills, education,
              achievements, advanced, services, languages },
    footer: {
      quickLinksTitle, connectTitle, infoTitle,
      quickLinks: { summary, experience, projects, skills, download }
    },
    downloadsPage: { backToCv, title, subtitle, downloadsTitle, downloadsIntro,
                     englishLabel, arabicLabel, exportWord, exportATS, plainTextTitle,
                     plainTextIntro, fileUnavailable, atsSummary, keywords[] },
    summaryText:    String,
    experienceRole: String,
    experienceList: String[],
    skillsList:     String[],
    education:      { heading: String, items: String[] },
    achievements:   String[],
    advancedSkills: String[],
    services:       String[],
    languagesText:  String
  },
  ar: { ...same shape... }
}
```

### 2.8 SE Version Overrides (`window.CV_VERSION === 'se'`, lines 425–586)
Mutations applied to `translations.en` and `translations.ar` in place:
- `header.jobTitle` → "Software Engineer & Flutter Developer"
- `experienceRole` → updated string
- `summaryText` → longer SE-specific summary
- `downloadsPage.subtitle` → SE subtitle
- `downloadsPage.atsSummary` → SE ATS summary
- **Adds** `nav.additionalExp` (10th nav key)
- **Adds** `experienceEntries[]` — array of `{role, period, location, items[]}` (3 entries)
- **Adds** `additionalTechExperience` — `{title, sections:[{title, items[]}]}`
- `downloads.files.*` paths → `CV_SE_EN.*` / `CV_SE_AR.*`

### 2.9 Unused Fields (confirmed by grep in main.js)
| Field | Reason unused |
|-------|--------------|
| `profile.avatarUrl` | Avatar hardcoded in all HTML files |
| `profile.hireMailSubject` | Mailto subject hardcoded in HTML |
| `projects[].id` | `renderProjects` never reads `.id` |

---

## 3. JAVASCRIPT SYSTEM (`main.js`)

### 3.1 Module Pattern
Single IIFE `(() => { ... })()`. Aborts immediately if `window.CV_DATA` is absent (line 4).
`$ = (id) => document.getElementById(id)` — shorthand used throughout.

### 3.2 State
```javascript
const state = {
  currentLang: "en",      // mutated by applyLanguage()
  statsAnimated: false     // set true by initStatsAnimation(); prevents re-run
}
// localStorage keys: "theme" ("light"|"dark"), "themePreset" (preset name), "lang" ("en"|"ar")
// page context: body.dataset.page === "home" | "downloads"
```

### 3.3 Complete Function List (in file order)

**Utilities (pure / no DOM side effects):**
| Function | Purpose |
|----------|---------|
| `escapeHtml(value)` | HTML entity encoding for safe innerHTML |
| `stripHtml(value)` | Remove all tags, collapse whitespace |
| `compactUrl(value)` | Strip `https?://` and trailing slash |
| `fileSafeName(value)` | Replace spaces with underscores |

**DOM Helpers (light DOM reads/writes):**
| Function | Purpose |
|----------|---------|
| `setText(id, value)` | `element.textContent = value` |
| `setHtml(id, value)` | `element.innerHTML = value` (used only where content is trusted) |
| `setHeadingText(id, value)` | Sets textContent while preserving child `<i>` icon |
| `renderList(selector, items)` | Populates a `<ul>` with escaped `<li>` items |

**Theme Side-Effect Functions:**
| Function | Purpose | Side effects |
|----------|---------|--------------|
| `enableThemeTransition()` | Adds `.theme-transition` to body for 300ms | Adds/removes body class |
| `updateThemeColorMeta()` | Reads `--primary-color`, updates `<meta name="theme-color">` | Writes meta |
| `luminance(r,g,b)` | WCAG relative luminance | None |
| `parseRGB(value)` | Parses `rgb()` string to array | None |
| `contrastRatio(rgb1,rgb2)` | WCAG contrast ratio | None |
| `updateContrast()` | If body contrast < 4.5, sets inline `--dark-text`; else removes it | **Mutates `:root` CSS variable inline** |
| `applyThemeState(isDark)` | Toggles `.dark-mode` on `<html>`, updates toggle icon + aria-pressed | Mutates html class, icon, aria |
| `normalizePreset(preset)` | Maps legacy "navy"→"royal", "emerald"→"silver", null→"blue" | None |
| `applyPreset(preset)` | Removes all `THEME_CLASSES`, adds correct `theme-*` to body; calls `updateThemeColorMeta` + `updateContrast` | Mutates body class |

**Render Functions (all write to DOM):**
| Function | Reads from | Writes to |
|----------|-----------|-----------|
| `renderStats(lang)` | `data.stats[]` | `#statsGrid` innerHTML |
| `renderProjects(lang)` | `data.projects[]` | `#projectsTableBody` innerHTML |
| `renderNav(dict)` | `dict.nav` | `#navSummary` … `#navAdditionalExp` (11 IDs) textContent |
| `renderHeader(dict)` | `dict.header`, `page` var | `#jobTitle`, `#availabilityBadge`, `#employmentBadge`, 5 CTA spans, `#headerBadges` |
| `renderSectionTitles(dict)` | `dict.titles` | 9 heading IDs (`#summaryTitle` … `#languagesTitle`) |
| `renderContentSections(dict)` | `dict.*`, calls renderStats+renderProjects | All content sections |
| `renderFooter(dict)` | `dict.footer` | 8 footer IDs |
| `renderDownloadsPage(dict)` | `dict.downloadsPage`, `data.downloads` | 10+ download page IDs |

**`applyLanguage(lang)` — The Render Orchestrator:**
```
applyLanguage(lang)
  → state.currentLang = lang (or "en" if unknown)
  → html.lang = lang
  → html.dir = "rtl" | "ltr"
  → body.style.fontFamily = Tajawal or Inter
  → renderNav(dict)
  → renderHeader(dict)
  → renderSectionTitles(dict)
  → renderContentSections(dict)
      → setText(summaryText, languagesText)
      → [if experienceEntries] → writes #experienceContainer (SE version)
      → [else] → setText(experienceRole) + innerHTML on #experienceList
      → [if additionalTechExperience] → writes #additionalTechTitle + #additionalTechContainer
      → renderList(".skill-list", ...)
      → renderList(".achievement-list", ...)
      → renderList(".advanced-skill-list", ...)
      → renderList(".service-list", ...)
      → querySelector("#education h3").textContent
      → querySelector("#education ul").innerHTML
      → renderStats(state.currentLang)
      → renderProjects(state.currentLang)
  → renderFooter(dict)
  → renderDownloadsPage(dict)  [noop on CV pages — IDs not present]
```
Total render functions: **8**. Directly called by `applyLanguage`: **6** (renderStats and renderProjects are nested inside renderContentSections).

**Animation / Init Functions:**
| Function | Mechanism | What it does |
|----------|-----------|-------------|
| `initTheme()` | localStorage + event listeners | Reads saved theme+preset, calls applyThemeState+applyPreset, wires toggle button + preset select |
| `initLanguage()` | localStorage + event listener | Reads saved lang, calls applyLanguage, wires lang select |
| `initRevealAnimations()` | IntersectionObserver (threshold:0.1) | Observes `section, .project-table, header`; adds `.fade-in` after 100ms delay |
| `initNavSpy()` | IntersectionObserver (threshold:0.6) | Observes sections mapped from nav links; toggles `.active` + `aria-current` |
| `initParallax()` | scroll listener (passive) | Translates `#header` by `scrollY * 0.03` (max 200px); skipped under reduced-motion |
| `initScrollToTop()` | scroll listener | Shows `#scrollToTop` when `pageYOffset > 300`; smooth scroll on click |
| `initParticles()` | requestIdleCallback | Creates 30/20/12 `.particle` divs in `#particles` (by viewport ≥1200/≥768/<768); skipped under reduced-motion |
| `initStatsAnimation()` | IntersectionObserver (threshold:0.5) | Triggers count-up on `.stats-section` entry; guarded by `state.statsAnimated` |
| `initYear()` | Direct DOM | Sets `#currentYear` to `new Date().getFullYear()` |
| `initTypingEffect()` | IntersectionObserver (threshold:0.5) | Wipes `h1.textContent`, retypes char-by-char at 100ms/char when `#header` enters view |

**Export Functions:**
| Function | Purpose |
|----------|---------|
| `downloadBlob(html, filename)` | Creates `Blob({type:"application/msword"})` with BOM, triggers `<a download>` |
| `buildProjectExportMarkup(lang)` | Returns `<h3>+<p>` per project (stripHtml on description) |
| `buildWordHtml(lang)` | Full Word-compatible HTML document string |
| `buildAtsHtml(lang)` | ATS-formatted HTML; hardcodes "MID-LEVEL FLUTTER DEVELOPER" label |
| `initExports()` | Wires `#exportWordBtn` → `.doc` download, `#exportATSBtn` → ATS `.doc` |

**Download Guard / Snackbar:**
| Function | Purpose |
|----------|---------|
| `ensureSnackbarHost()` | Lazy-creates `#snackbarHost` div + inline CSS injection |
| `showSnackbar(message, type, timeout)` | Appends `.snackbar.{type}` to host, animates in/out |
| `initDownloadGuard()` | Intercepts `a[href*="assets/downloads/"]` ending in `.pdf/.doc/.docx`; HEAD probes → shows snackbar if 404/unavailable |

### 3.4 `DOMContentLoaded` Init Chain (exact order)
```
initTheme()
initLanguage()          ← triggers first full render
initRevealAnimations()
initNavSpy()
initParallax()
initScrollToTop()
initParticles()
initStatsAnimation()
initYear()
initTypingEffect()
initExports()
initDownloadGuard()
updateThemeColorMeta()
updateContrast()
enableThemeTransition()
```

### 3.5 `THEME_CLASSES` Array (used for removal before applying new class)
```javascript
["theme-blue","theme-purple","theme-teal","theme-slate",
 "theme-navy","theme-emerald","theme-midnight","theme-royal","theme-silver"]
```
Note: `theme-navy` and `theme-emerald` are in this removal list but have **no CSS definitions** — they are dead names from a refactor, normalized to `theme-royal` and `theme-silver` respectively.

---

## 4. CSS SYSTEM (`styles.css`)

### 4.1 CSS Custom Properties (`:root` base values)
```css
--primary-color:  #0066cc
--secondary-color:#004d99
--accent-color:   #28a745
--light-bg:       #f9f9f9
--dark-text:      #333
--light-text:     #666
--border-color:   #e0e0e0
--card-bg:        #ffffff
--shadow:         0 8px 20px rgba(0,0,0,0.08)
--transition:     all 0.3s ease
--glass-bg:       rgba(255,255,255,0.55)
--glass-border:   rgba(255,255,255,0.35)
--blob-1:         radial-gradient(...)
--blob-2:         radial-gradient(...)
--tint-weak:      rgba(0,102,204,0.08)
--tint-strong:    rgba(0,102,204,0.12)
```

### 4.2 `.dark-mode` Overrides (on `<html>`)
```css
--light-bg:    #121212
--dark-text:   #e0e0e0
--light-text:  #a0a0a0
--border-color:#333333
--card-bg:     #1e1e1e
--shadow:      0 8px 20px rgba(0,0,0,0.3)
--glass-bg:    rgba(30,30,30,0.55)
--glass-border:rgba(255,255,255,0.08)
color-scheme:  dark
```

### 4.3 Theme Presets (on `<body>`)
| Class | primary | secondary | accent |
|-------|---------|-----------|--------|
| `theme-blue` | `#2563eb` | `#93c5fd` | `#06b6d4` |
| `theme-purple` | `#7c3aed` | `#c4b5fd` | `#d946ef` |
| `theme-teal` | `#0d9488` | `#5eead4` | `#22d3ee` |
| `theme-slate` | `#334155` | `#94a3b8` | `#0ea5e9` |
| `theme-midnight` | `#60a5fa` | `#a78bfa` | `#22d3ee` |
| `theme-royal` | `#d4af37` | `#374151` | `#b8860b` |
| `theme-silver` | `#6b7280` | `#cbd5e1` | `#d1d5db` |

Each preset also overrides `--blob-1`, `--blob-2`, `--tint-weak`, `--tint-strong`.
**`theme-navy` and `theme-emerald` have NO CSS definitions.** They are ghost names normalized in JS.

### 4.4 Real Breakpoints (all `@media` rules, in file order)
| Line | Query | Key Effect |
|------|-------|-----------|
| 823 | `max-width: 1024px` | Container → 1000px wide; nav-links full-width; stats 2-col |
| 831 | `max-width: 900px` | **Projects table → grid cards** (tbody becomes grid, thead hidden, tds become blocks) |
| 841 | `max-width: 768px` | Nav-links hidden; nav-download hidden; controls 2-col grid; header column; stats 1-col; CTA 50/50 |
| 891 | `max-width: 480px` | Smaller type; blobs opacity→0.25/blur→30px; floatMobile keyframe; CTA full-width |
| 918 | `min-width: 1200px` | Container max-width: 1100px |
| 921 | `prefers-reduced-motion: reduce` | All animations/transitions killed |
| 1047 | `max-width: 480px` | cv-tab padding/font reduction; cv-tab icon hidden |
| 1144 | `max-width: 600px` | contact-info → grid `auto-fit minmax(120px,1fr)`; CTA gap 26px |
| 1181 | `max-width: 360px` | contact-info → 2-col; smaller link text |

**Real breakpoint set (7 distinct widths): 1200/1024/900/768/600/480/360**
The 600px breakpoint was undocumented in all prior docs.

### 4.5 Layout System
| Component | Layout |
|-----------|--------|
| `.container` | Block, max-width 1100px (≥1200px), fluid otherwise |
| `nav.cv-nav` | Flex, `justify-content: space-between` |
| `.nav-links` | Flex, `flex: 1 1 620px`, wrap |
| `.nav-controls` | Flex, `flex: 0 1 auto`, wrap |
| `header` | Flex, wrap, `align-items: center`, `gap: 24px` |
| `.contact-info` | Flex, wrap |
| `.cta-buttons` | Flex, wrap |
| `.stats-grid` | CSS Grid, `auto-fit minmax(200px,1fr)` |
| `section` (content) | Block (no special layout) |
| `.skill-list / .achievement-list / .advanced-skill-list / .service-list` | CSS Grid, `gap: 14px` |
| `.project-table` | HTML `<table>`; ≤900px → CSS forces `display:block/grid` on tbody |
| `.project-description` | Flex, row, `align-items: flex-start` |
| `.exp-entry-header` | Flex, `justify-content: space-between`, wrap |
| `.footer-content` | CSS Grid, `auto-fit minmax(200px,1fr)` |
| `.cv-switch-bar` | Flex, `justify-content: center` |
| `.social-links` | Flex |

### 4.6 Animation System
**CSS Keyframes:**
| Name | Duration | Used by |
|------|----------|---------|
| `blobMove` | 30s infinite | `body::before` (top-left) + `body::after` (bottom-right, delay 8s) |
| `gradientShift` | 3s infinite | `.gradient-text` — hue-rotate 0→10→0deg |
| `pulse` | 2s infinite | `.availability-badge` — shadow pulse |
| `float` | 6s (profile) / 15s linear (particles) | `.floating` (profile pic), `.particle` |
| `floatMobile` | (≤480px override) | `.floating` — gentler, -6px only |

**JS-driven Animations:**
| Init function | Driver | Trigger |
|---------------|--------|---------|
| `initRevealAnimations` | IntersectionObserver 0.1 | Adds `.fade-in` on `section`, `.project-table`, `header` |
| `initNavSpy` | IntersectionObserver 0.6 | Toggles `.active` on nav links |
| `initParallax` | `scroll` (passive) | `#header transform translateY` |
| `initStatsAnimation` | IntersectionObserver 0.5 | count-up on `.stat-number` |
| `initTypingEffect` | IntersectionObserver 0.5 | Types `h1` char-by-char |
| `initParticles` | requestIdleCallback | Injects `.particle` divs |

**Reveal mechanism:** `section`, `header`, and `.project-table` start with `opacity:0; transform:translateY(20px)` in CSS; `.fade-in` class overrides to `opacity:1; transform:translateY(0)`.

### 4.7 Notable CSS Behaviors
- `.container::before` — 5px gradient top bar (primary→accent), `z-index:1`.
- `body::before / body::after` — fixed blobs, `z-index:-2`, 50vmax, blur 60px.
- `section:hover { transform: translateY(-4px) }` — ALL sections lift on hover.
- `.project-table tr:hover { transform: perspective(1000px) rotateX(1deg) }` — 3D row tilt.
- `.stat-card:hover { transform: translateY(-8px) perspective(1000px) rotateX(2deg) }`.
- `.skill-list li:hover { transform: translateY(-4px) perspective(900px) rotateX(2deg) }`.
- `.social-links a:hover { transform: translateY(-5px) rotate(10deg) }`.
- `h1:hover::after { width:100% }` — underline sweep animation.
- `.btn:hover::before { width:100% }` — gradient direction swap via pseudo-element.
- `#experience ul` — has left-border timeline line + circle bullets (CSS only, NOT a separate class).
- `.exp-entry-header` — SE-specific two-column meta layout.
- `html[dir="rtl"]` — 15+ RTL selectors flipping layout, text-align, padding directions.

### 4.8 Mobile Nav Behavior at ≤768px (confirmed)
```css
.cv-nav .nav-links { display: none; }      /* ALL nav links vanish */
.cv-nav .nav-download { display: none; }   /* Download CV link also vanishes */
.cv-nav .nav-controls {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  width: 100%;
}
```
**There is NO hamburger button, NO mobile menu toggle, NO replacement navigation in the codebase.** At ≤768px, in-page navigation relies entirely on scrolling.

---

## 5. EXPORT / DOWNLOAD SYSTEM

### 5.1 Client-side Word Export (downloads pages only)
- `buildWordHtml(lang)` → produces Office-namespace HTML string.
- `buildAtsHtml(lang)` → ATS-optimized HTML; hardcodes "MID-LEVEL FLUTTER DEVELOPER" title.
- `downloadBlob(html, filename)` → `Blob(["﻿", html], {type:"application/msword"})`.
- **Output format: `.doc` (legacy Word HTML wrapped in BOM).** NOT `.docx` (OOXML).
- Filenames: `Mohamad_Adib_Tawil_CV_EN.doc`, `..._CV_ATS_EN.doc`, etc.
- ATS version does NOT use `dict.experienceEntries` — it always uses `dict.experienceList`. This means the ATS export on the SE page produces flat single-entry output.

### 5.2 Static File Downloads
- Links on downloads pages point to `assets/downloads/CV_EN.docx`, `.pdf`, etc.
- `initDownloadGuard()` intercepts these links, probes with `HEAD` (then `GET Range:0-0` fallback), shows snackbar if unavailable.
- Files are placeholder `.gitkeep` — not committed. Must be placed manually.

### 5.3 `generate_cv.js` (Node.js, standalone)
- Not analyzed in this pass (different runtime). Requires `docx` + `puppeteer` npm packages. Reads `CV_DATA` via `require()`.

---

## 6. NETWORK REQUESTS AT RUNTIME
1. Font Awesome CSS — `cdnjs.cloudflare.com`
2. Google Fonts — `fonts.googleapis.com` (Inter, Poppins, Tajawal)
3. Profile avatar — `avatars.githubusercontent.com` (hardcoded in HTML)
4. Project images — `play-lh.googleusercontent.com`, `raw.githubusercontent.com` (lazy-loaded)
5. Download probes — `assets/downloads/*` via `fetch` HEAD/GET (only on click)
6. Analytics — `plausible.io/js/script.js` (CV pages only, `data-domain` attribute)
