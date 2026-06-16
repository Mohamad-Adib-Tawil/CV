# RISK REPORT
**Source**: Extracted directly from source code. No documentation files used.
**Purpose**: Identify every function, pattern, or system that carries meaningful risk of unexpected behavior, regression, or side effects — particularly during any future modification work.

---

## RISK LEVEL DEFINITIONS
- **CRITICAL** — Can silently corrupt state or produce invisible failures that are hard to debug.
- **HIGH** — Will cause visible breakage if touched without understanding all dependencies.
- **MEDIUM** — Requires care; can break a subset of functionality.
- **LOW** — Worth knowing but unlikely to cause serious problems.

---

## 1. CRITICAL RISKS

### R-01 `updateContrast()` — Runtime CSS Variable Override
**File**: `main.js:142–156`
**Risk level**: CRITICAL

```javascript
const updateContrast = () => {
  const ratio = contrastRatio(parseRGB(bodyBg), parseRGB(bodyColor));
  if (ratio < 4.5) {
    themeRoot.style.setProperty("--dark-text", target);  // inline on <html>
    return;
  }
  themeRoot.style.removeProperty("--dark-text");
};
```

**What makes it dangerous:**
- Sets `--dark-text` as an **inline style on `<html>`**, which has the highest specificity in the cascade — overrides all CSS file rules.
- Called 3 times: on `initTheme()`, on every `themeToggle.click`, and on every `applyPreset()`.
- The check uses computed `backgroundColor` and `color` on `<body>`, so the check is theme-dependent and evaluated after DOM paint.
- If a new color palette is applied via `:root` variable changes but the computed contrast reads < 4.5 (which is likely on a dark canvas with a mid-gray text), this function silently overwrites `--dark-text` with `#111111` or `#f5f5f5`.
- **The override persists across language switches and theme preset changes** until the next `updateContrast()` call removes it.
- **Cannot be disabled** without modifying `main.js`.

**When it triggers**: Any dark canvas (`#0B0D10`, `#121212`, etc.) where the initial body `color` computed value fails the 4.5:1 ratio — extremely common in dark mode.

**Safe mitigation**: Ensure `--dark-text` in the new CSS produces a contrast ratio ≥ 4.5 against the new `--light-bg`, so `updateContrast()` runs silently and removes any inline override.

---

### R-02 `initTypingEffect()` — Destructive H1 Mutation
**File**: `main.js:708–747`
**Risk level**: CRITICAL

```javascript
const originalText = heading.textContent || "";
heading.textContent = "";        // ← wipes the H1 immediately
// then retypes char-by-char at 100ms/char
```

**What makes it dangerous:**
- Wipes `h1.textContent` **synchronously** when `#header` enters the viewport.
- The H1 has class `.gradient-text` which applies `-webkit-text-fill-color: transparent` and a CSS animation (`gradientShift`). After wipe, the H1 is empty until the typing completes.
- Language switching calls `applyLanguage()` which does NOT reset the typing effect. If the user switches language before typing finishes, `setText()` or `setHeadingText()` would update the H1, but the effect has already wired an observer that fires once.
- The observer calls `observer.unobserve(target)` after first trigger — so if the page reloads state, it won't re-type.
- **There is no `prefers-reduced-motion` guard** on the typing effect specifically — the CSS `@media (prefers-reduced-motion: reduce) { * { animation: none !important } }` kills CSS animations but NOT the JS typing loop.
- On Arabic, `applyLanguage()` sets `body.style.fontFamily = Tajawal`, but `initTypingEffect()` may run while the font is still loading, producing a font-swap flicker mid-type.

---

### R-03 Trusted HTML in `renderProjects()` — Intentional but fragile
**File**: `main.js:248–249`
**Risk level**: CRITICAL (if `cv-data.js` is edited carelessly)

```javascript
const description = project.description[lang] || project.description.en;
// ...
<p>${description}</p>   // ← NOT escaped; raw HTML injected
```

**What makes it dangerous:**
- All other `innerHTML` assignments use `escapeHtml()`. `renderProjects` intentionally does NOT escape descriptions because they contain `<a>` tags (Play Store / GitHub links).
- This is a **designed XSS vector** that is safe only because `cv-data.js` is developer-controlled.
- If `cv-data.js` is ever edited to pull descriptions from user input or an external source, this becomes a real XSS vulnerability.
- Future developers must know this is intentional, or they may "fix" it by escaping descriptions (breaking the links) or accidentally add unsafe content here.

---

## 2. HIGH RISKS

### R-04 `initTypingEffect()` Races with `applyLanguage()`
**File**: `main.js:708–747`, `main.js:439–456`
**Risk level**: HIGH

The typing effect runs once (IntersectionObserver, fires when header enters view). However:
- `applyLanguage()` is re-called on every language switch.
- `applyLanguage()` calls `renderHeader(dict)` → `setText("jobTitle", ...)` etc. but does NOT reset or re-fire the typing effect.
- The H1 content is set by the typing effect (which reads `h1.textContent` at the moment it fires), not by `renderHeader`.
- **If the user switches language WHILE the typing is in progress**, the H1 will contain partially-typed text that doesn't match the new language's name (the name is the same in both languages, so this specific case is benign — but the timing coupling is fragile).
- If someone later adds a second H1 or changes when `initTypingEffect` fires, this race condition becomes visible.

---

### R-05 Projects Render Writes Raw HTML Containing Absolute URLs
**File**: `main.js:252–278`, `cv-data.js:61–142`
**Risk level**: HIGH (content integrity)

Project descriptions contain hardcoded absolute URLs:
- `https://play.google.com/store/apps/details?id=...`
- `https://github.com/Mohamad-Adib-Tawil/...`
- `https://apps.apple.com/app/id6759857104`

These are embedded in HTML strings inside `cv-data.js`. They are injected directly into `<p>` without escaping. If any URL changes or a project is added with a malformed string, the resulting HTML may break layout silently.

---

### R-06 `renderList()` Uses CSS Class Selector — Not ID
**File**: `main.js:93–101`
**Risk level**: HIGH

```javascript
const element = document.querySelector(selector);
// Called as:
renderList(".skill-list", dict.skillsList);
renderList(".achievement-list", dict.achievements);
renderList(".advanced-skill-list", dict.advancedSkills);
renderList(".service-list", dict.services);
```

`querySelector` returns the **first matching element**. If a second element with `class="skill-list"` is added to the page (e.g. in a downloads or SE context), `renderList` would silently target the wrong element.

---

### R-07 `initStatsAnimation` — `data-target` Read After `renderStats()`
**File**: `main.js:680–706`
**Risk level**: HIGH

The stats IntersectionObserver callback reads `data-target` attributes from `.stat-number` elements:
```javascript
const statNumbers = document.querySelectorAll(".stat-number");
statNumbers.forEach(stat => {
  animateCounter(stat, parseInt(stat.getAttribute("data-target"), 10));
});
```
These elements are created by `renderStats()`. If `renderStats()` has not executed before the observer fires (which is unlikely but possible on very fast scrolls or immediate viewport position), or if a language switch re-renders stats while animation is still running, the animation could reset or double-fire.
The `state.statsAnimated` guard prevents re-runs, but it also means the animation **never re-runs after language switch**, even though `renderStats()` resets the DOM to "0".

---

### R-08 CV Version Switch is Page-Navigation, Not State Toggle
**File**: `index.html:70–78`, `se.html:69–79`
**Risk level**: HIGH (sync requirement)

The CV switch bar tabs are static `<a>` tags navigating between `index.html` ↔ `se.html`. They are NOT toggled by JS. This means:
- **Any structural change to one HTML file must be mirrored in the other** — there is no shared template.
- If `se.html` gains a new section or ID, `index.html` does not automatically get it.
- If `main.js` adds a new render function that writes to an ID present in `se.html` but not `index.html`, it silently fails on the Flutter page (getElementById returns null).
- The JS guard in `renderNav` handles this: `if (dict.nav[key] != null) setText(id, ...)` — missing keys are ignored. But missing DOM IDs are also silently ignored by `setText` (it checks `element && value != null`).

---

### R-09 `#headerBadges` + `#employmentBadge` — Footer Placement
**File**: `index.html:282–284`, `se.html:281–284`
**Risk level**: HIGH (unexpected location)

Both `#headerBadges` (renders badge pills from `dict.header.badges`) and `#employmentBadge` are located in the **footer**, not in the header, despite being part of `dict.header`:
```html
<div class="footer-flags">
  <span id="employmentBadge" class="employment-badge">...</span>
  <div id="headerBadges" class="header-badges" ...></div>
</div>
```
`renderHeader()` writes to these IDs. Any agent not reading the full HTML will assume badges are in the `header` element. They are not.

---

### R-10 ATS Export Hardcodes Job Title Regardless of CV Version
**File**: `main.js:858–861`
**Risk level**: HIGH

```javascript
const target = luminance(r, g, b) > 0.5 ? "#111111" : "#f5f5f5";
// ... and in buildAtsHtml:
currentLang === "ar"
  ? escapeHtml("مطوّر Flutter متوسط المستوى")
  : escapeHtml("MID-LEVEL FLUTTER DEVELOPER")
```

The ATS export always produces "MID-LEVEL FLUTTER DEVELOPER" — even when generated from `se.html` (Software Engineer version). This is a content-correctness bug, not a display bug.

Similarly, `buildAtsHtml` uses `dict.experienceList` for the experience section — but on the SE version, `dict.experienceList` is the Flutter-version list (the SE version replaces it with `dict.experienceEntries`). The ATS export for SE therefore contains the Flutter experience list.

---

## 3. MEDIUM RISKS

### R-11 `initNavSpy()` Threshold 0.6 — May Skip Sections
**File**: `main.js:556–593`
**Risk level**: MEDIUM

Sections with content shorter than 60% of the viewport will never satisfy the 0.6 threshold and will never be highlighted as active. Short sections (`#languages`, `#stats`) may be skipped by nav spy. Currently mitigated by section defaults that have reasonable content.

---

### R-12 `enableThemeTransition()` Called at End of Init
**File**: `main.js:1025`
**Risk level**: MEDIUM

`enableThemeTransition()` is called LAST in the `DOMContentLoaded` chain, which also means the `.theme-transition` class (causing 300ms animation) is added and removed at a point when all renders are done. However, `applyLanguage()` (which fires during `initLanguage()`) runs before `enableThemeTransition()`. This means the initial render has no transition — correct behavior. But it also means the first subsequent theme/lang change might catch `enableThemeTransition()` still from the `initTheme()` call for preset changes. These races are unlikely but exist.

---

### R-13 `initDownloadGuard()` — `HEAD` Probe Can Fail Silently
**File**: `main.js:957–1000`
**Risk level**: MEDIUM

The guard does:
1. `fetch(href, { method: "HEAD" })` — catches errors to inner try/catch.
2. Falls back to `GET Range:0-0`.
3. If both fail with a network error (not a 404, but a CORS/network error), `available` stays `false` and shows the "file unavailable" snackbar even if the file might actually exist.

The file paths are relative (`assets/downloads/CV_EN.pdf`), so CORS is not an issue when served from the same origin. But in offline or cached scenarios, `fetch` may throw.

---

### R-14 `body.style.fontFamily` Set Inline by `applyLanguage()`
**File**: `main.js:445–449`
**Risk level**: MEDIUM

```javascript
body.style.fontFamily = state.currentLang === "ar"
  ? "'Tajawal', 'Poppins', Arial, sans-serif"
  : "'Inter', 'Poppins', Arial, sans-serif";
```

This sets `fontFamily` as an **inline style on `<body>`**, overriding the CSS `body { font-family: ... }` declaration. If any CSS rule targets `body { font-family: ... }` with specificity matching or above `:root`, the inline style still wins because it's higher specificity. Any CSS redesign that tries to change the font at the `body` level will be silently overridden by this line on every language switch.

---

### R-15 Hardcoded Content in HTML (Stale on Load)
**File**: `index.html:166–258`, `se.html:167–257`
**Risk level**: MEDIUM

Both CV pages embed hardcoded English content for every section (summary text, skill list items, education text, etc.) directly in the HTML. `applyLanguage("en")` overwrites this with identical (or slightly updated) content from `cv-data.js`. This means:
- There are **two sources of truth** for English content — HTML and `cv-data.js`. They can drift.
- If someone updates the HTML hardcoded text but not `cv-data.js`, the JS overwrites on load.
- The reverse: updating `cv-data.js` but not HTML means crawlers/SSR see the old HTML version.
- Current HTML appears to be an older snapshot (e.g., `#experience ul` has 6 items in HTML; `translations.en.experienceList` has 7 items).

---

### R-16 `.project-table` Inline `overflow-x: auto` Wrapper
**File**: `index.html:184`, `se.html:178`
**Risk level**: MEDIUM

```html
<div style="overflow-x: auto;">
  <table class="project-table">...</table>
</div>
```

This `style` attribute wraps the table. If the projects section is redesigned (e.g., converting to a card grid), this wrapper div must be removed/restructured — it's a semantic container tied to the current table layout. It does not have a class or ID, making it harder to target with CSS without descendant selectors.

---

## 4. LOW RISKS

### R-17 `project.id` — Defined but Never Used
**File**: `cv-data.js:62–141`
**Risk level**: LOW

Each project object has an `id` field (e.g. `"iklk"`, `"wolfera"`). `main.js` never references it. If rendered as HTML IDs (e.g. `<tr id="project-iklk">`), they would enable anchor links to specific projects. Currently wasted.

---

### R-18 `profile.avatarUrl` and `profile.hireMailSubject` — Unused in main.js
**File**: `cv-data.js:7–10`
**Risk level**: LOW

Both fields exist in `cv-data.js` but are hardcoded in HTML. If the HTML is ever regenerated from data (e.g. by extending `generate_cv.js` or by a future template system), these fields are the correct source. Currently they can drift from the HTML values.

---

### R-19 `theme-navy` and `theme-emerald` in `THEME_CLASSES` Array
**File**: `main.js:8–18`
**Risk level**: LOW

The removal loop (`body.classList.remove(...THEME_CLASSES)`) runs before every preset change. It includes `theme-navy` and `theme-emerald`. Since those classes have no CSS definitions, adding them to the removal list is harmless but confusing — they cannot be "removed" from a meaningful state because they were never applied.

---

### R-20 `se.html` Experience Section Has No Fallback
**File**: `se.html:172–174`
**Risk level**: LOW

```html
<section id="experience">
  <h2 id="experienceTitle">...</h2>
  <div id="experienceContainer"></div>
</section>
```

If `cv-data.js` is loaded without `CV_VERSION='se'` on `se.html` (e.g., if the inline script is removed), `dict.experienceEntries` will be undefined. `renderContentSections` falls through to the `else` branch:
```javascript
setText("experienceRole", dict.experienceRole);
const experienceList = $("experienceList");  // returns null — no #experienceList in se.html
```
The result: experience section shows no content (empty `#experienceContainer`, silent `#experienceList` null).

---

### R-21 `downloads.html` Footer has Only 3 Quick Links (vs 5 in CV pages)
**File**: `downloads.html:99–105`
**Risk level**: LOW

`downloads.html` footer `renderFooter()` will call `setText("footerExperienceLink", ...)` but that ID does not exist in `downloads.html` (`renderFooter` tries to set IDs that may not exist — `setText` silently skips nulls). This means the "Experience" quick link is missing from the downloads footer — intentional but uneven.

---

### R-22 Two Duplicate `@media (max-width: 480px)` Blocks
**File**: `styles.css:891` and `styles.css:1047`
**Risk level**: LOW

The stylesheet has two separate `@media (max-width: 480px)` blocks — one at line 891 (main responsive rules) and one at line 1047 (cv-tab adjustments). Both are valid and cascaded correctly (later rules win for ties), but the split makes it harder to reason about what applies at 480px without reading both locations.

---

## 5. SYNC REQUIREMENTS (the "must never drift" list)

These relationships have no automated enforcement — they must be maintained manually:

| Constraint | Files involved | Consequence of drift |
|-----------|---------------|---------------------|
| `index.html` and `se.html` structural parity | Both HTML files | JS writes to IDs that don't exist; silent empty sections |
| CV downloads links match `data.downloads.files.*` | `downloads.html`, `cv-data.js` | Download links point to wrong files |
| `#projectsTableBody` exists in both CV pages | `index.html`, `se.html`, `main.js` | `renderProjects` fails silently |
| `#statsGrid` exists in all CV pages | HTML, `main.js` | `renderStats` fails silently |
| `initStatsAnimation` reads `.stat-number[data-target]` set by `renderStats` | `main.js` | `animateCounter` receives NaN |
| Script version `?v=` params in all 4 HTML files | All HTML files | Stale cached JS/CSS served |
| `window.CV_VERSION = 'se'` must be FIRST script in `se.html`/`downloads-se.html` | `se.html`, `downloads-se.html` | cv-data.js reads undefined; SE overrides skipped |

---

## 6. MODIFICATION SAFETY GUIDE

For any future agent making changes, use this lookup:

| Intended change | Safe? | Risk items to check |
|----------------|-------|---------------------|
| Add/change CSS token (`:root` var) | ✅ Generally safe | R-01 (contrast check will run; ensure ratio ≥ 4.5) |
| Change `--dark-text` value | ⚠️ Caution | R-01 will override it if ratio < 4.5 |
| Add new CSS class | ✅ Safe | None |
| Edit `body { font-family }` | ⚠️ Caution | R-14 (inline override wins on language switch) |
| Add breakpoint | ✅ Safe | Verify no duplication of 480px split (R-22) |
| Modify glassmorphism (backdrop-filter) | ✅ Safe | None |
| Remove blob / particle CSS | ⚠️ Partial | Must also disable `initParticles()` in JS (R-05 analogue) |
| Edit `cv-data.js` content fields | ✅ Safe | Ensure project descriptions remain valid HTML (R-03) |
| Add `cv-data.js` top-level field | ⚠️ Caution | R-08: must update `main.js` to use it |
| Edit `renderProjects()` markup | ⚠️ HIGH | R-03 (don't add escaping to description `<p>`); also affects `initRevealAnimations` selector |
| Edit `renderStats()` markup | ⚠️ Caution | R-07 (`data-target` attr required for animation) |
| Add section to `index.html` | ⚠️ HIGH | R-08: must mirror in `se.html`; must add nav link + render function |
| Add section to `se.html` only | ✅ SE-only | Confirm JS handles null IDs gracefully (it does) |
| Disable `initTypingEffect()` | ✅ Safe | R-02 resolved; no other dependency |
| Disable `initParallax()` | ✅ Safe | None |
| Disable `initParticles()` | ✅ Safe | None |
| Modify `applyLanguage()` call chain | ⚠️ HIGH | R-04, R-07 (stats animation guard), R-14 |
| Add new theme preset | ⚠️ Caution | Add to CSS, JS `THEME_CLASSES`, HTML `<select>`, `applyPreset` switch |
| Modify export (`buildWordHtml`) | ⚠️ Caution | R-10: ATS hardcodes role; SE experienceEntries not used |
