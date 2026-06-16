# ARCHITECTURE MAP
**Source**: Extracted directly from source code. No documentation files used.

---

## 1. HOW THE APP BOOTS

### 1.1 Script Loading Strategy
All four pages load scripts at bottom of `<body>` with `defer`:
```html
<script src="assets/js/cv-data.js?v=20260411-1200" defer></script>
<script src="assets/js/main.js?v=20260411-1200" defer></script>
```
`defer` preserves order: `cv-data.js` always executes before `main.js`.

### 1.2 Before-Paint Initialization (inline scripts in `<head>`)
Two synchronous inline scripts run before the page paints:

**Script A (all 4 pages) — Dark mode flash prevention:**
```javascript
(function() {
  try {
    if (localStorage.getItem('theme') !== 'light') {
      document.documentElement.classList.add('dark-mode');
    }
  } catch (_) {
    document.documentElement.classList.add('dark-mode');  // fallback if localStorage blocked
  }
})();
```
Result: `dark-mode` is applied to `<html>` before CSS renders → **no flash of light theme**.

**Script B (se.html + downloads-se.html only) — Version flag:**
```javascript
window.CV_VERSION = 'se';
```
This must come BEFORE `cv-data.js` loads so the override block executes correctly.

### 1.3 `cv-data.js` Execution
When deferred, `cv-data.js` runs and:
1. Defines local constants: `profile`, `downloads`, `stats`, `projects`, `translations`.
2. Checks `window.CV_VERSION`: if `'se'`, mutates `translations.en` and `translations.ar` in place, and reassigns `downloads.files`.
3. Assembles `CV_DATA = { profile, downloads, stats, projects, translations }`.
4. Assigns `window.CV_DATA = CV_DATA` (and `module.exports` for Node).

### 1.4 `main.js` Execution
IIFE executes immediately after `cv-data.js`. Guards at top:
```javascript
const data = window.CV_DATA;
if (!data) { return; }  // abort if cv-data.js didn't load
```
Then defines all functions (no execution yet). Waits for:

### 1.5 `DOMContentLoaded` Event — Full Init Chain
```
DOMContentLoaded fires
│
├── initTheme()
│     ├── read localStorage: "theme" (default: anything != "light" = dark)
│     ├── read localStorage: "themePreset" → normalizePreset() (default: "blue")
│     ├── applyThemeState(isDark)     → toggles .dark-mode on <html>
│     ├── applyPreset(preset)         → adds theme-* to body, calls updateThemeColorMeta + updateContrast
│     ├── wire presetSelect.change    → applyPreset + localStorage
│     └── wire themeToggle.click      → applyThemeState + updateContrast + localStorage
│
├── initLanguage()
│     ├── read localStorage: "lang" (default: "en")
│     ├── applyLanguage(lang)         → TRIGGERS FULL DOM RENDER (see §3)
│     └── wire langSelect.change      → applyLanguage + localStorage
│
├── initRevealAnimations()   → IntersectionObserver on sections/header/.project-table
├── initNavSpy()             → IntersectionObserver on sections linked from nav
├── initParallax()           → scroll listener on #header
├── initScrollToTop()        → scroll listener for show/hide + click handler
├── initParticles()          → requestIdleCallback → injects .particle divs
├── initStatsAnimation()     → IntersectionObserver on .stats-section
├── initYear()               → sets #currentYear textContent
├── initTypingEffect()       → IntersectionObserver on #header → types h1
├── initExports()            → wires #exportWordBtn + #exportATSBtn (downloads pages)
├── initDownloadGuard()      → intercepts assets/downloads/* link clicks
├── updateThemeColorMeta()   → ensures meta[theme-color] is correct after render
├── updateContrast()         → runtime contrast check; may set inline --dark-text
└── enableThemeTransition()  → adds .theme-transition to body, removes after 300ms
```

---

## 2. HOW SECTIONS ARE RENDERED

### 2.1 Render Trigger
Every render is triggered by `applyLanguage(lang)`. This fires:
- Once on load (inside `initLanguage`).
- Every time the user changes the language select.

### 2.2 Render Pipeline (full detail)
```
applyLanguage(lang)
│
├── state.currentLang = lang
├── html.lang = lang
├── html.dir = "rtl" | "ltr"
├── body.style.fontFamily = Tajawal (ar) | Inter (en)
│
├── renderNav(dict)
│     └── Iterates navMap array [11 [id, key] pairs]
│         setText(id, dict.nav[key]) for each existing key
│         (navAdditionalExp only exists in SE translations)
│
├── renderHeader(dict)
│     ├── page === "downloads" ? dict.downloadsPage.subtitle : dict.header.jobTitle
│     │     → setText("jobTitle", ...)
│     ├── setText("availabilityBadge", dict.header.availability)
│     ├── setText("employmentBadge", dict.header.employment)
│     ├── setText("ctaWorkText" / "ctaContactText" / "ctaWebsiteText" / "ctaDownloadText" / "ctaHireText")
│     └── #headerBadges.innerHTML = dict.header.badges.map(b => <span class="badge">...)
│
├── renderSectionTitles(dict)
│     └── setHeadingText() for 9 section h2 IDs (preserves <i> icon)
│
├── renderContentSections(dict)
│     ├── setText("summaryText", dict.summaryText)
│     ├── setText("languagesText", dict.languagesText)
│     │
│     ├── [SE: if dict.experienceEntries exists]
│     │     #experienceContainer.innerHTML = entries.map(entry =>
│     │       <div class="exp-entry">
│     │         <div class="exp-entry-header">
│     │           <h3>role</h3>
│     │           <div class="exp-entry-meta">
│     │             <span class="exp-period">period</span>
│     │             <span class="exp-location">location</span>
│     │           </div>
│     │         </div>
│     │         <ul><li>...</li></ul>
│     │       </div>
│     │     )
│     │
│     ├── [Flutter: else]
│     │     setText("experienceRole", dict.experienceRole)
│     │     #experienceList.innerHTML = items.map(i => <li>escapeHtml(i)</li>)
│     │
│     ├── [SE: if dict.additionalTechExperience]
│     │     setHeadingText("additionalTechTitle", ...)
│     │     #additionalTechContainer.innerHTML = sections.map(sec =>
│     │       <div class="additional-tech-section">
│     │         <h3>title</h3>
│     │         <ul><li>...</li></ul>
│     │       </div>
│     │     )
│     │
│     ├── renderList(".skill-list", dict.skillsList)
│     ├── renderList(".achievement-list", dict.achievements)
│     ├── renderList(".advanced-skill-list", dict.advancedSkills)
│     ├── renderList(".service-list", dict.services)
│     ├── querySelector("#education h3").textContent = dict.education.heading
│     ├── querySelector("#education ul").innerHTML = dict.education.items.map(...)
│     ├── renderStats(state.currentLang)
│     │     └── #statsGrid.innerHTML = data.stats.map(stat =>
│     │           <div class="stat-card">
│     │             <i class="...icon..." aria-hidden>
│     │             <div class="stat-number" data-target="value">0|formatted</div>
│     │             <div class="stat-label">label</div>
│     │           </div>
│     │         )
│     └── renderProjects(state.currentLang)
│           └── #projectsTableBody.innerHTML = data.projects.map(project =>
│                 <tr>
│                   <td class="project-name">
│                     name
│                     <div class="project-tech">
│                       <span class="tech-badge">tech</span>...
│                     </div>
│                   </td>
│                   <td>
│                     <div class="project-description">
│                       <img src=... alt=... class="project-thumb" loading="lazy">
│                       <p>description</p>  ← RAW HTML (not escaped, contains <a> links)
│                     </div>
│                   </td>
│                 </tr>
│               )
│
├── renderFooter(dict)
│     └── setText() for 8 footer IDs
│
└── renderDownloadsPage(dict)
      ├── setText / setHeadingText for 8 download page IDs
      ├── setHtml("downloadsIntro", ...) ← trusted HTML with <code>
      ├── Constructs plain-text link with escapeHtml path
      └── Sets href on 4 download anchors from data.downloads.files
```

### 2.3 What's hardcoded (NOT rendered by JS)
- `h1` text "Mohamad Adib Tawil" (but overwritten char-by-char by `initTypingEffect`)
- Profile picture `src` and `alt` attributes
- Contact info email/LinkedIn/GitHub href values
- CTA button href values
- Footer social link hrefs
- JSON-LD schema data in `<head>`

---

## 3. DATA FLOW

```
cv-data.js                         main.js                           DOM
──────────                         ───────                           ───
CV_DATA.profile    ─────────────→  buildWordHtml / buildAtsHtml
CV_DATA.downloads  ─────────────→  renderDownloadsPage
                                   initDownloadGuard
CV_DATA.stats      ─────────────→  renderStats(lang)  ───────────→  #statsGrid
CV_DATA.projects   ─────────────→  renderProjects(lang) ──────────→  #projectsTableBody
                                                                       (table rows)
CV_DATA.translations
  .en / .ar
  [selected by applyLanguage]
  ↓
  dict = getDict(state.currentLang)
  ↓
  dict.nav          ─────────────→  renderNav()  ──────────────────→  nav link texts
  dict.header       ─────────────→  renderHeader()  ───────────────→  jobTitle, badges, CTA spans
  dict.titles       ─────────────→  renderSectionTitles()  ─────────→  h2 texts
  dict.summaryText  ─────────────→  renderContentSections()  ───────→  #summaryText
  dict.experienceEntries OR                                            #experienceContainer OR
  dict.experienceRole +
  dict.experienceList ──────────→  renderContentSections()  ───────→  #experienceRole + #experienceList
  dict.skillsList   ─────────────→  renderList(".skill-list")  ──────→  ul.skill-list
  dict.achievements ─────────────→  renderList(".achievement-list")
  dict.advancedSkills ───────────→  renderList(".advanced-skill-list")
  dict.services     ─────────────→  renderList(".service-list")
  dict.education    ─────────────→  renderContentSections()  ───────→  #education h3 + ul
  dict.languagesText ────────────→  renderContentSections()  ───────→  #languagesText
  dict.additionalTechExperience ─→  renderContentSections()  ───────→  #additionalTechContainer
  dict.footer       ─────────────→  renderFooter()  ───────────────→  footer texts
  dict.downloadsPage ────────────→  renderDownloadsPage()  ─────────→  download page texts/links

localStorage
  .theme          ──→  applyThemeState()  →  html.classList toggle .dark-mode
  .themePreset    ──→  applyPreset()      →  body.classList swap theme-* class
  .lang           ──→  applyLanguage()    →  full re-render
```

---

## 4. LANGUAGE SWITCHING

**Trigger**: `langSelect.change` event → `applyLanguage(event.target.value)`.

**What changes on language switch:**
1. `state.currentLang` updated.
2. `html.lang` attribute set (`"en"` or `"ar"`).
3. `html.dir` set (`"ltr"` or `"rtl"`).
4. `body.style.fontFamily` swapped (Inter → Tajawal for Arabic).
5. Full re-render pipeline runs: all 6 direct render functions called.
6. `localStorage.lang` saved.

**RTL layout changes (CSS-driven, not JS):**
- `html[dir="rtl"] body` → `text-align: right`
- `html[dir="rtl"] header` → `flex-direction: row-reverse`
- `html[dir="rtl"] .profile-pic` → margin swap (left instead of right)
- `html[dir="rtl"] .contact-item` → `flex-direction: row-reverse`
- `html[dir="rtl"] .project-table th,td` → `text-align: right`
- `html[dir="rtl"] ul` → `padding-right: 20px; padding-left: 0`
- `html[dir="rtl"] .top-nav` → `direction: rtl`
- `html[dir="rtl"] .exp-entry-meta` → `text-align: left`
- `html[dir="rtl"] .footer .social-links` → `direction: ltr` (keeps icon order natural)

**What does NOT change on language switch:**
- Profile picture (hardcoded `src`).
- Contact href values (email, LinkedIn, GitHub).
- CTA button hrefs.
- Theme / dark mode state.
- Stats count-up (guarded by `state.statsAnimated` — does not re-run).
- Particles.

---

## 5. THEME SWITCHING

### 5.1 Dark/Light Toggle
```
themeToggle.click
  → isDark = !html.classList.contains('dark-mode')
  → applyThemeState(isDark)
       → html.classList.toggle('dark-mode', isDark)
       → themeIcon class: fa-sun (dark) | fa-moon (light)
       → themeToggle.aria-pressed: "true" | "false"
  → localStorage.theme = "dark" | "light"
  → updateContrast()
       → reads body computed backgroundColor + color
       → if contrastRatio < 4.5:
           html.style.setProperty('--dark-text', '#111111' | '#f5f5f5')
         else:
           html.style.removeProperty('--dark-text')
```

### 5.2 Preset Selection
```
presetSelect.change
  → nextPreset = normalizePreset(event.target.value)
       → "navy" → "royal"
       → "emerald" → "silver"
       → null/undefined → "blue"
  → enableThemeTransition()   [.theme-transition for 300ms]
  → applyPreset(nextPreset)
       → body.classList.remove(...THEME_CLASSES)  [all 9 names]
       → body.classList.add("theme-" + nextPreset)
       → if nextPreset === "midnight": special case — also forces dark mode
  → localStorage.themePreset = nextPreset
  → updateThemeColorMeta()
  → updateContrast()
```

### 5.3 Midnight Preset Special Behavior
When midnight is selected:
- `applyPreset` adds `theme-midnight` to body.
- The change handler also calls `applyThemeState(true)` and saves `theme: "dark"`.
- On load: if saved preset is midnight AND `dark-mode` not already on `<html>`, forces dark.
- **Midnight does NOT prevent light mode** — if the user later clicks the theme toggle, light mode activates while `theme-midnight` CSS class stays.

### 5.4 Theme Variable Cascade (specificity order)
```
:root { base vars }
  ↓ overridden by:
.dark-mode { on <html> — dark surface vars }
  ↓ overridden by:
body.theme-* { preset colors + blobs + tints }
  ↓ overridden by:
html.style (inline) { --dark-text if contrast failed }
```

---

## 6. CV VERSION SWITCHING ARCHITECTURE

```
index.html               se.html
    │                        │
    │                   window.CV_VERSION = 'se'  ← script runs first
    │                        │
    ▼                        ▼
cv-data.js executes
  _cvVersion = window.CV_VERSION || 'flutter'
  if (_cvVersion === 'se') {
    mutate translations.en & translations.ar in-place
    mutate downloads.files paths
  }
  → window.CV_DATA = assembled object
                         │
                         ▼
                     main.js executes
                     applyLanguage() checks:
                       dict.experienceEntries → SE path
                       dict.additionalTechExperience → SE path
                       dict.nav.additionalExp → SE nav item

                     DOM differences:
                       index.html: #experienceRole + #experienceList
                       se.html:    #experienceContainer (empty div, JS fills)
                                   #additional-experience section
                                   #additionalTechTitle + #additionalTechContainer
                                   #navAdditionalExp in nav
```

The `.cv-switch-bar` tabs are static HTML (not JS-rendered) — `index.html` hard-codes Flutter as `.active`, `se.html` hard-codes SE as `.active`.

---

## 7. PAGE DIFFERENCES MATRIX

| Feature | index.html | se.html | downloads.html | downloads-se.html |
|---------|-----------|---------|----------------|-------------------|
| `CV_VERSION` | undefined ('flutter') | 'se' | undefined | 'se' |
| `data-page` | "home" | "home" | "downloads" | "downloads" |
| cv-switch-bar | ✅ Flutter active | ✅ SE active | ❌ | ❌ |
| #particles | ✅ | ✅ | ❌ | ❌ |
| #scrollToTop | ✅ | ✅ | ❌ | ❌ |
| nav type | `.cv-nav` (9+1 links + controls) | `.cv-nav` (9+2 links + controls) | plain `.top-nav` (2 links) | plain `.top-nav` (2 links) |
| #experienceContainer | ❌ | ✅ (empty) | ❌ | ❌ |
| #experienceRole + #experienceList | ✅ | ❌ | ❌ | ❌ |
| #additional-experience section | ❌ | ✅ | ❌ | ❌ |
| Export buttons (#exportWordBtn etc) | ❌ | ❌ | ✅ | ✅ |
| Download links | ❌ | ❌ | CV_EN/AR | CV_SE_EN/AR |
| Back link | — | — | → index.html | → se.html |
| Analytics | ✅ | ✅ | ❌ | ❌ |
| avatar img width | 140px | 140px | 120px | 120px |
| `.floating` on avatar | ✅ | ✅ | ✅ | ✅ |

---

## 8. FUNCTION DEPENDENCY GRAPH

```
DOMContentLoaded
├── initTheme()
│     ├── normalizePreset()
│     ├── applyThemeState() → [icon update, aria]
│     └── applyPreset()
│           ├── updateThemeColorMeta()
│           └── updateContrast()
│                 ├── luminance()
│                 ├── parseRGB()
│                 └── contrastRatio()
│
├── initLanguage()
│     └── applyLanguage()
│           ├── getDict()
│           ├── renderNav()
│           │     └── setText()
│           ├── renderHeader()
│           │     ├── setText()
│           │     └── setHtml() (for badges)
│           ├── renderSectionTitles()
│           │     └── setHeadingText()
│           ├── renderContentSections()
│           │     ├── setText()
│           │     ├── setHtml() / innerHTML (experience, additional-tech)
│           │     ├── renderList()
│           │     │     └── escapeHtml()
│           │     ├── renderStats()
│           │     │     └── escapeHtml(), formatStatValue()
│           │     └── renderProjects()
│           │           └── escapeHtml()
│           ├── renderFooter()
│           │     └── setText()
│           └── renderDownloadsPage()
│                 ├── setText(), setHeadingText(), setHtml()
│                 └── escapeHtml()
│
├── initRevealAnimations()  [IntersectionObserver — independent]
├── initNavSpy()            [IntersectionObserver — independent]
├── initParallax()          [scroll listener — independent]
├── initScrollToTop()       [scroll listener — independent]
├── initParticles()         [requestIdleCallback — independent]
├── initStatsAnimation()    [IntersectionObserver — reads .stat-number data-target]
│     └── animateCounter()
│           └── formatStatValue()
├── initYear()              [direct DOM — independent]
├── initTypingEffect()      [IntersectionObserver — reads/writes h1.textContent]
├── initExports()
│     ├── buildWordHtml()
│     │     ├── getDict(), escapeHtml(), compactUrl(), buildProjectExportMarkup()
│     │     └── → downloadBlob()
│     └── buildAtsHtml()
│           ├── getDict(), escapeHtml(), compactUrl(), buildProjectExportMarkup()
│           └── → downloadBlob()
├── initDownloadGuard()
│     └── showSnackbar()
│           └── ensureSnackbarHost()
├── updateThemeColorMeta()  [direct DOM]
├── updateContrast()        [direct DOM, may mutate :root inline style]
└── enableThemeTransition() [body class + setTimeout]
```
