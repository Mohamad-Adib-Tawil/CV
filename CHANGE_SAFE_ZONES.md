# Change Safe Zones — Mohamad Adib Tawil Online CV

## SAFE — Can Usually Be Modified Without Risk

| File | Why Safe |
|------|----------|
| `assets/cv/*.md` (all files) | Plain text copies of CV content; source of truth is `cv-data.js`. Safe to update, regenerate, or add new variants. |
| `cv.md` | Standalone markdown CV; no code depends on it. |
| `README.md` | Documentation only; no code reads this file. |
| `scripts/generate_cv.js` | Standalone Node.js tool; not loaded by any web page. Safe to modify generation logic. |
| `assets/downloads/.gitkeep` | Empty placeholder; safe to replace or remove. |
| `.claude/launch.json` | Claude Code IDE config only; safe to modify port or runtime. |
| `.claude/settings.local.json` | Claude Code permissions; safe to adjust tool access rules. |
| `welcome_banner.svg` | Static SVG asset; safe to replace or update. |

## CAUTION — Requires Understanding Dependencies Before Modifying

| File | Why Caution | Dependencies to Check |
|------|-------------|----------------------|
| `index.html` | HTML structure determines CSS selector availability and JS rendering targets. Adding/removing elements can break rendering functions or styles. | `main.js` render functions (e.g., `renderStats` expects `#statsGrid`), CSS selectors (e.g., `.stats-grid`, `.project-table`), `cv-data.js` data shape |
| `se.html` | Same as `index.html` but must stay in sync structurally. Section IDs, nav links, and class names must match between versions. | `index.html` structure, `main.js` rendering (especially `experienceEntries` vs `experienceList` branching at `main.js:338`) |
| `downloads.html` | File paths to `assets/downloads/CV_*.*` must match actual files. Download guard in `main.js` checks these paths via HEAD/GET fetch. | `main.js` `initDownloadGuard()`, `renderDownloadsPage()`, actual files in `assets/downloads/` |
| `downloads-se.html` | Same as `downloads.html` but for SE version with `CV_SE_*.*` path prefixes. | Same as `downloads.html` |
| `assets/css/styles.css` | Tightly coupled with HTML structure. Every selector targets specific classes/IDs in HTML. Changing class names, removing selectors, or altering layout can break the entire visual presentation. | All HTML files, especially section structure, nav classes, and responsive breakpoints |

## CRITICAL — Should Not Be Modified Without Deep Analysis

| File | Risk Level | Why Critical |
|------|------------|-------------|
| `assets/js/cv-data.js` | **CRITICAL** | This is the single source of truth for ALL content. It exposes a global `CV_DATA` object with exact shape: `{profile, downloads, stats, projects, translations}`. Any change to property names, nesting, or array structure will silently break all rendering functions in `main.js`. The CV_VERSION switching logic at line 424-586 is complex and modifies translations in place. |
| `assets/js/main.js` | **CRITICAL** | This 1027-line IIFE is the entire application runtime. Key mutation risks: (1) The `state` object at line 20 tracks currentLang and statsAnimated — renaming breaks dependent functions. (2) Render functions rely on exact element IDs (`#statsGrid`, `#projectsTableBody`, etc.). (3) The Word/ATS export functions (`buildWordHtml`, `buildAtsHtml`) generate complete HTML documents using hardcoded element references. (4) The `$()` helper wraps `getElementById` — removing or altering breaks everything. (5) The `initDownloadGuard()` at line 957 attaches click listeners to all download links. |

### Critical File Modification Protocol

If you MUST modify a CRITICAL file:

1. **Read `FILE_INDEX.md`** to understand all dependents
2. **Read the entire file** before editing (especially `main.js` at 1027 lines)
3. **Verify every function call path**: If you rename `renderNav`, update all callers
4. **Test all CV versions**: Flutter Developer AND Software Engineer paths
5. **Test all themes**: Especially Midnight (which forces dark mode at `main.js:499`)
6. **Test bilingual**: Switch to Arabic and verify RTL rendering
7. **Test download guards**: Verify HEAD/GET fallback logic
8. **Test export**: Word and ATS export should produce valid DOCX files
9. **Check `cv-data.js` shape**: Never add/remove top-level keys from `CV_DATA`
10. **Cache bust**: Update version query params on assets (`?v=YYYYMMDD-HHMM`)
