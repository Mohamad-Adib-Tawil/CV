# Source Truth Map — Mohamad Adib Tawil Online CV

**Authority**: This document is extracted **directly from source code**, not from any documentation file. It supersedes all prior `.md` docs where they disagree.
**Files read**: `index.html` (299 lines), `assets/js/main.js` (1027), `assets/css/styles.css` (1184), `assets/js/cv-data.js` (601).
**Note**: `se.html`, `downloads.html`, `downloads-se.html` were not opened in this pass; claims about SE-only DOM are inferred from JS references and marked accordingly.

---

## 1. DOM Structure (`index.html`, exact order)

### 1.1 Top-level body order
```
body[data-page="home"]
├── a.skip-link → #main
├── div.cv-switch-bar[role=tablist]          ← OUTSIDE <main>
│     └── div.cv-switch-inner
│           ├── a.cv-tab.active → index.html  ("Flutter Developer")
│           ├── div.cv-tab-divider
│           └── a.cv-tab → se.html            ("Software Engineer")
├── div.particles-container#particles          ← OUTSIDE <main> (JS injects particles)
├── button.theme-toggle#themeToggle            ← OUTSIDE <main>, fixed
├── button.scroll-to-top#scrollToTop           ← OUTSIDE <main>, fixed
└── main#main
      └── div.container
            ├── nav.top-nav.cv-nav
            ├── header#header
            ├── section#stats.stats-section
            ├── section#summary
            ├── section#experience
            ├── section#projects
            ├── section#skills
            ├── section#education
            ├── section#achievements
            ├── section#advanced-skills
            ├── section#services
            ├── section#languages
            └── footer.footer
```
**Inline head script** sets `dark-mode` on `<html>` unless `localStorage.theme === 'light'` → **dark is the default**.

### 1.2 Real content-section order (the canonical list)
1. `#stats` — `.stats-grid#statsGrid` (JS-rendered, empty in HTML)
2. `#summary` — `#summaryTitle`, `#summaryText`
3. `#experience` — `#experienceTitle`, `h3#experienceRole`, `ul#experienceList`
4. `#projects` — `table.project-table > tbody#projectsTableBody` (JS-rendered)
5. `#skills` — `ul.skill-list`
6. `#education` — `h2#educationTitle`, `h3`, `ul`
7. `#achievements` — `ul.achievement-list`
8. `#advanced-skills` — `#advancedSkillsTitle`, `ul.advanced-skill-list`
9. `#services` — `ul.service-list`
10. `#languages` — `#languagesText`

> **There are 10 content sections, not the 6–8 referenced in prior docs/proposal.** Order is **summary → experience → projects → skills → education → achievements → advanced-skills → services → languages** (skills come **after** projects).

### 1.3 Navigation (`nav.top-nav.cv-nav`)
- `.nav-links` — 9 anchors: `#navSummary #navExperience #navProjects #navSkills #navEducation #navAchievements #navAdvanced #navServices #navLanguages` (all `href="#..."`).
- `.nav-controls` — `a#navDownload` (→ downloads.html), `select#themePreset` (7 options: blue/purple/teal/slate/royal/silver/midnight), `select#langSelect` (en/ar).

### 1.4 Header (`header#header`)
- `img.profile-pic.floating` (avatar URL **hardcoded** in HTML).
- `h1.gradient-text` "Mohamad Adib Tawil".
- `#jobTitle.title`, `.header-flags > #availabilityBadge`.
- `.contact-info` — 3 `.contact-item` (email, LinkedIn, GitHub).
- `.cta-buttons` — **5 buttons**: View My Work, Get in Touch, GitHub, Download Resume (PDF), Hire Me (`#ctaWorkText/#ctaContactText/#ctaWebsiteText/#ctaDownloadText/#ctaHireText`).

### 1.5 Footer (`footer.footer > .footer-content`)
- Quick Links (`#footerQuickLinksTitle` + 5 links incl. download)
- Connect (`#footerConnectTitle` + 3 social icons)
- Info (`#footerInfoTitle`, `#employmentBadge`, `#headerBadges` JS-rendered, `#currentYear`)

### 1.6 SE-only DOM (inferred — NOT in index.html)
`main.js` references `#experienceContainer`, `#additionalTechContainer`, `#additionalTechTitle`, `#additional-experience`, plus nav `#navAdditionalExp`. These exist only when `experienceEntries`/`additionalTechExperience` are present (SE version). **In `index.html` they are absent**, so those render branches are inert here.

---

## 2. JavaScript Architecture (`main.js`)

### 2.1 Pattern
- Single **IIFE** `(() => { ... })()`. Aborts early if `window.CV_DATA` missing.
- `$ = (id) => document.getElementById(id)`.
- State: one object `state = { currentLang:"en", statsAnimated:false }`. Persistence: `localStorage` keys **`theme`, `themePreset`, `lang`** only.
- `page = body.dataset.page` ("home" here; "downloads" on download pages) — switches header subtitle source.

### 2.2 All functions (exact names, in file order)
**Utilities**: `escapeHtml`, `stripHtml`, `compactUrl`, `fileSafeName`, `setText`, `setHtml`, `setHeadingText`, `renderList`, `enableThemeTransition`, `updateThemeColorMeta`.
**Contrast**: `luminance`, `parseRGB`, `contrastRatio`, `updateContrast`.
**Theme**: `applyThemeState`, `normalizePreset`, `applyPreset`.
**Render**: `renderStats`, `renderProjects`, `renderNav`, `renderHeader`, `renderSectionTitles`, `renderContentSections`, `renderFooter`, `renderDownloadsPage`, `applyLanguage`.
**Stats anim**: `formatStatValue`, `animateCounter`.
**Init/motion**: `initTheme`, `initLanguage`, `initRevealAnimations`, `initNavSpy`, `initParallax`, `initScrollToTop`, `initParticles`, `initStatsAnimation`, `initTypingEffect`.
**Export**: `downloadBlob`, `buildProjectExportMarkup`, `buildWordHtml`, `buildAtsHtml`, `initExports`.
**Snackbar/guard**: `ensureSnackbarHost`, `showSnackbar`, `initDownloadGuard`, `initYear`.

### 2.3 Render system
- **String-template + `innerHTML`**, not a framework. All dynamic HTML built via `escapeHtml()` then assigned. (Project descriptions are intentionally **not** escaped — they contain trusted anchor HTML from `cv-data.js`.)
- `applyLanguage(lang)` is the orchestrator. It calls **6 render functions directly**: `renderNav → renderHeader → renderSectionTitles → renderContentSections → renderFooter → renderDownloadsPage`. `renderStats` and `renderProjects` are called **inside** `renderContentSections`. → **8 `render*` functions total; 6 invoked directly by `applyLanguage`.**
- `applyLanguage` also sets `html.lang`, `html.dir` (`rtl` for ar), and `body.style.fontFamily` (Tajawal for ar, Inter for en).

### 2.4 Init order (`DOMContentLoaded`)
`initTheme → initLanguage → initRevealAnimations → initNavSpy → initParallax → initScrollToTop → initParticles → initStatsAnimation → initYear → initTypingEffect → initExports → initDownloadGuard → updateThemeColorMeta → updateContrast → enableThemeTransition`.

### 2.5 Behaviors that constrain a redesign
- **`updateContrast()` mutates tokens at runtime**: if body bg/text contrast `< 4.5`, it sets an inline `--dark-text` on `<html>` (`#111111` or `#f5f5f5`); otherwise removes it. Runs on load, theme toggle, and preset change. **Any palette change must keep contrast ≥ 4.5 or this will override `--dark-text`.**
- **`initTypingEffect()`** wipes `h1.textContent` and retypes it char-by-char (100ms) when header enters viewport — operates on the `.gradient-text` H1.
- **`initParallax()`** translates `#header` on scroll (≤200px × 0.03), disabled under reduced-motion.
- **`initParticles()`** injects 30/20/12 `.particle` divs (by viewport ≥1200 / ≥768 / else) into `#particles`, skipped under reduced-motion.
- **`initNavSpy()`** observes sections at threshold 0.6, toggles `.active` + `aria-current` on `.top-nav a[href^='#']`.
- **`initStatsAnimation()`** count-up at threshold 0.5, guarded by `state.statsAnimated` (runs once).
- No inline event handlers; all listeners attached in JS (matches the no-inline-handler rule).

---

## 3. CV Data Schema (`cv-data.js`, as implemented)

UMD-ish IIFE exposing `window.CV_DATA` (also `module.exports`). Version switch: `window.CV_VERSION` (`'flutter'` default, `'se'` triggers overrides at lines 425–586).

```
CV_DATA = {
  profile: { name, email, linkedinUrl, githubUrl, avatarUrl, hireMailSubject },
  downloads: {
    files: { en:{docx,pdf}, ar:{docx,pdf} },   // SE overrides → CV_SE_* paths
    plainTextPath
  },
  stats: [ { icon, value:Number, label:{en,ar} } ],          // 4 items
  projects: [ { id, name, tech:[String], image:{src, alt:{en,ar}}, description:{en,ar} } ], // 5 items
  translations: {
    en: { nav, header, titles, footer, downloadsPage, summaryText,
          experienceRole, experienceList[], skillsList[],
          education:{heading, items[]}, achievements[], advancedSkills[],
          services[], languagesText },
    ar: { ...same shape... }
  }
}
```
Nested shapes:
- `nav`: summary, experience, projects, skills, education, achievements, advanced, services, languages, download (+ `additionalExp` in SE).
- `header`: jobTitle, availability, employment, badges[], ctaWork, ctaContact, ctaWebsite, ctaDownload, ctaHire.
- `titles`: summary…languages.
- `footer`: quickLinksTitle, connectTitle, infoTitle, quickLinks{summary,experience,projects,skills,download}.
- `downloadsPage`: backToCv, title, subtitle, downloadsTitle, downloadsIntro, englishLabel, arabicLabel, exportWord, exportATS, plainTextTitle, plainTextIntro, fileUnavailable, atsSummary, keywords[].

### 3.1 SE overrides (`CV_VERSION==='se'`) add per-language:
- `experienceEntries[]` ({role, period, location, items[]}) — replaces single-entry path.
- `additionalTechExperience` ({title, sections:[{title, items[]}]}).
- `nav.additionalExp`; rewrites jobTitle, experienceRole, summaryText, downloadsPage.subtitle/atsSummary; and `downloads.files.*` → `CV_SE_*`.

### 3.2 Used vs unused (verified by grep in `main.js`)
| Field | Status |
|-------|--------|
| `profile.name/email/linkedinUrl/githubUrl` | **Used** (export markup) |
| `profile.avatarUrl` | **Unused** by JS (avatar hardcoded in HTML) |
| `profile.hireMailSubject` | **Unused** by JS (mailto subject hardcoded in HTML) |
| `projects[].id` | **Unused** (rendering never reads it) |
| everything else | Used |

> The HTML also ships **hardcoded English content** in every section (summary text, skill list, etc.). On load, `applyLanguage` overwrites it. So content is duplicated between `index.html` and `cv-data.js`.

---

## 4. CSS Architecture (`styles.css`)

### 4.1 Real breakpoints (verbatim from `@media` rules)
| Query | Line | Effect (key) |
|-------|------|--------------|
| `min-width: 1200px` | 918 | `.container { max-width: 1100px }` |
| `max-width: 1024px` | 823 | layout tweaks |
| `max-width: 900px` | 831 | **project-table → grid cards** (`tbody{display:grid;1fr}`) |
| `max-width: 768px` | 841 | **nav-links + nav-download hidden; controls 2-col grid; header column; stats 1-col; CTA 2-up** |
| `max-width: 600px` | 1144 | (download/grid block) |
| `max-width: 480px` | 891 & 1047 | smaller type, mobile blob opacity/blur, floatMobile |
| `max-width: 360px` | 1181 | tightest layout |
| `prefers-reduced-motion: reduce` | 921 | kills all animation/transition |

> **7 distinct width breakpoints (1200/1024/900/768/600/480/360)** — including a **600px** breakpoint that no prior doc mentioned. The "5 or 6 breakpoints" claims are both wrong.

### 4.2 Layout system
- Mixed **flex + grid**. `.container` is the glass shell (`backdrop-filter: saturate(160%) blur(12px)`, max 1100px ≥1200px viewport). `.top-nav` flex + `backdrop-filter: blur(8px)`. `.stats-grid` grid (`auto-fit, minmax`). `.footer-content` grid. Sections styled via element selector with glass.

### 4.3 Theme system
- Base vars in `:root` (`--primary-color:#0066cc` …); `.dark-mode` overrides (default-on via head script).
- **Theme classes defined in CSS (7): `theme-blue, theme-purple, theme-teal, theme-slate, theme-midnight, theme-royal, theme-silver`.**
- **`theme-navy` and `theme-emerald` are NOT defined in CSS** — they appear only in JS `THEME_CLASSES` (removal list) and are mapped away by `normalizePreset`/`applyPreset` (navy→royal, emerald→silver). → **dead/inert preset names.**
- `meta[name=theme-color]` updated from computed `--primary-color`.

### 4.4 Animation system (keyframes + drivers)
| Keyframe | Used by |
|----------|---------|
| `blobMove` (30s) | `body::before` + `body::after` (background blobs; dimmed/blurred ≤480px) |
| `gradientShift` | gradient text/section bar effects |
| `pulse` | (availability/status pulse) |
| `float` (6s) | `.floating` (profile pic) + `.particle` (15s linear) |
| `floatMobile` | `.floating` on mobile (gentler) |
- JS-driven motion: parallax (`#header`), particles (`#particles`), typing (`h1`), reveal (`.fade-in`), nav-spy, stats count-up, scroll-to-top.

---

## 5. Export / Download System

- **Client-side export** (`downloads*.html` only — buttons `#exportWordBtn`, `#exportATSBtn`): `buildWordHtml`/`buildAtsHtml` produce **HTML strings**, wrapped in a `Blob` with **`type: "application/msword"`** and a **BOM (`﻿`)**, saved as **`*.doc`** (e.g. `Mohamad_Adib_Tawil_CV_EN.doc`, `..._CV_ATS_EN.doc`).
  - → **This is legacy Word HTML (`.doc`), NOT OOXML `.docx`.** Confirmed.
  - ATS variant: uppercase headings, KEYWORDS section, and a **hardcoded** job title "MID-LEVEL FLUTTER DEVELOPER" / "مطوّر Flutter متوسط المستوى" regardless of CV version.
- **Static file downloads**: `downloads.files.{en,ar}.{docx,pdf}` linked on download pages.
- **`initDownloadGuard`**: intercepts any `a[href*="assets/downloads/"]` ending in `.pdf/.doc/.docx`; probes with `HEAD` then ranged `GET`; if unavailable shows a snackbar (`downloadsPage.fileUnavailable`) instead of navigating. Files are placeholders today.
- **`generate_cv.js`** (not in this pass) is the separate Node DOCX/PDF generator; unrelated to the client export above.

---

### Canonical facts to rely on
- 10 content sections, order in §1.2. Skills after projects. Education/achievements/advanced-skills/services/languages **exist**.
- 8 `render*` functions; `applyLanguage` calls 6 directly. String-template/`innerHTML` rendering.
- 7 real width breakpoints incl. 600px. 7 CSS theme classes; navy/emerald dead.
- `updateContrast()` can override `--dark-text` at runtime (contrast ≥4.5 gate).
- Client export = `.doc` via `application/msword`, not `.docx`.
- localStorage keys: `theme`, `themePreset`, `lang`.
