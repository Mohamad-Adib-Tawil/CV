# Workflows — Mohamad Adib Tawil Online CV

---

## 1. Add New Feature (e.g., new section, new theme, new animation)

**Step 1**: Read `AI_RULES.md` to check if the feature violates any rules.

**Step 2**: If feature needs new data (e.g., a new section with text content):
1. Open `assets/js/cv-data.js`
2. Add data to both `translations.en` and `translations.ar` objects (same nesting structure)
3. If adding a new array (e.g., `certifications[]`), follow existing patterns (e.g., `skillsList`, `achievements`)

**Step 3**: If feature needs DOM elements:
1. Open the HTML file(s) — `index.html` and/or `se.html`
2. Add semantic HTML with appropriate `id` attributes for JS targeting
3. Use existing section pattern: `<section id="..."><h2 id="...Title"><i class="fas ..."></i> <span>...</span></h2>...</section>`
4. For bilingual text, use `<span id="...">` or `<p id="...">` for dynamic text replacement
5. Add nav links if needed (both to `.nav-links` and footer)

**Step 4**: If feature needs rendering logic:
1. Open `assets/js/main.js`
2. Add render function following existing patterns (e.g., `renderNav()`, `renderHeader()`)
3. Use `setText(id, value)` or `setHtml(id, value)` or `setHeadingText(id, value)` utilities
4. Call the new render function from `applyLanguage()` and `renderContentSections()` (or related)
5. Add any event listeners in a dedicated `init*()` function called from `DOMContentLoaded`

**Step 5**: If feature needs styling:
1. Open `assets/css/styles.css`
2. Use CSS variables for colors, `clamp()` for sizing, respect `prefers-reduced-motion`
3. Add responsive breakpoints following existing media query values

**Step 6**: Test:
- English AND Arabic
- All 7 themes (especially Midnight for dark lock-in)
- Desktop AND mobile (all breakpoints)
- With `prefers-reduced-motion: reduce`

---

## 2. Modify Existing Feature

**Step 1**: Identify which files own the feature:
- Content changes → `assets/js/cv-data.js`
- Rendering changes → `assets/js/main.js`
- Visual changes → `assets/css/styles.css`
- Structural changes → `index.html` and/or `se.html`

**Step 2**: For content changes:
- Find the exact key in `translations.en` and `translations.ar`
- Check if `cv-data.js` lines 424-586 (CV_VERSION switching) overrides it for SE version
- Modify both language dictionaries
- Update `assets/cv/*.md` files if keeping plain text in sync

**Step 3**: For rendering changes:
- Do NOT rename existing function names in `main.js`
- Do NOT change element ID references
- Do NOT break the `state` object shape

**Step 4**: Cache-bust: Update the `?v=` query parameter on all asset `<link>` and `<script>` tags (e.g., `?v=20260120-2244`).

---

## 3. Add Page (e.g., new CV version landing page)

**Step 1**: Create HTML file following `index.html` or `se.html` pattern.

**Step 2**: Set up CV version signal:
```html
<script>window.CV_VERSION = 'new-version';</script>
```

**Step 3**: In `assets/js/cv-data.js`, add a new branch in the CV_VERSION check block (around line 424) to override translations and file paths.

**Step 4**: Create corresponding download page following `downloads.html` pattern with matching `CV_VERSION`.

**Step 5**: Update the CV switch bar in all CV pages to include the new version tab.

**Step 6**: Add appropriate download file paths (e.g., `assets/downloads/CV_NEW_*.docx`).

---

## 4. Update UI (Change look and feel)

**Step 1**: If changing colors:
- Modify CSS variable values in `:root` block (`styles.css:2-20`)
- Modify `.dark-mode` overrides (`styles.css:22-32`)
- Update theme presets (`styles.css:34-107`) if needed
- Use a contrast checker; the JS `updateContrast()` heuristic will adjust if ratio < 4.5

**Step 2**: If changing fonts:
- Update Google Fonts `<link>` tags in all HTML files
- Update `body.style.fontFamily` logic in `main.js:445-448`
- Update font stacks in `styles.css:109-118`

**Step 3**: If changing layout:
- Modify the `.container` width/padding/margin
- Update grid templates for `.stats-grid`, `.footer-content`, etc.
- Adjust all responsive breakpoints

**Step 4**: If adding a new theme preset:
- Add CSS class in `styles.css` (e.g., `body.theme-coral { ... }`)
- Add theme name to `THEME_CLASSES` array in `main.js` (line 8-18)
- Add case to `applyPreset()` switch in `main.js`
- Add `<option>` to theme `<select>` in HTML

---

## 5. Fix Bug

**Step 1**: Identify which file:
- If content doesn't display → check `main.js` render function for the section (e.g., `renderStats` not finding `#statsGrid`)
- If content is wrong → check `cv-data.js` translation keys
- If styling broken → check `styles.css` selectors against current HTML structure
- If download links broken → check `initDownloadGuard()` + file paths in `cv-data.js`
- If theme/language not persisting → check `localStorage` read/write in `main.js`

**Step 2**: For JS bugs:
- Look in the `init*()` function chain at `main.js:1010-1026`
- Check if element exists with `$("id")` before operating
- Check if `dict` parameter has the expected property before accessing
- Verify `state` object is being read/written correctly

**Step 3**: Test fix against both CV versions by loading `index.html` and `se.html`.

---

## 6. Refactor Component

**Step 1**: Identify the scope:
- Extract new utility function → add to the top section of `main.js` (before line 60, after utility functions)
- Extract data → modify `cv-data.js`
- Extract CSS → add new CSS variables/classes in `styles.css`

**Step 2**: Common refactor patterns:
- Convert hardcoded HTML strings to data-driven rendering
- Extract repeated render logic into a single `renderList()`-style function
- Move repeated CSS values into `:root` variables

**Step 3**: Never refactor:
- The global `CV_DATA` export shape
- The `state` object keys
- The IIFE wrapper
- The `$()` helper

**Step 4**: After refactoring, verify no console errors in both EN and AR modes.
