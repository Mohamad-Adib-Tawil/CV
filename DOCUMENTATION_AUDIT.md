# Documentation Audit — Mohamad Adib Tawil Online CV

**Scope of this audit**: `AGENT_START_HERE.md`, `CLAUDE_CONTEXT.md`, `ARCHITECTURE.md`, `AI_RULES.md`, `FILE_INDEX.md`, `UI_GUIDELINES.md`.
**Method**: Cross-reading the six AI-facing documents against each other. Source code was **not** scanned (per task constraint), so findings flag *where the docs disagree or fall short*, not where the code is wrong. Items that require source verification are marked **[verify in code]**.

---

## 1. Incorrect Assumptions

These are claims the docs present as fact that are internally inconsistent, imprecise, or likely to mislead a future agent.

| # | Claim | Where | Problem |
|---|-------|-------|---------|
| 1 | "Word export via `Blob` with `application/msword` MIME type" | `CLAUDE_CONTEXT.md` L28 | `application/msword` produces a legacy `.doc` (HTML-wrapped) file, **not** a real DOCX. Yet `FILE_INDEX.md` L28 and the export-flow notes call it "DOCX via Blob." A future agent will assume true OOXML `.docx` is generated client-side and may break the export trying to "fix" it. **[verify in code]** |
| 2 | "This project is small (~8 source files, ~3000 total lines)" | `AGENT_START_HERE.md` L57 | The three CRITICAL files alone total **2,812 lines** (main.js 1027 + cv-data.js 601 + styles.css 1184). Adding 4 HTML pages + `generate_cv.js` + markdown copies puts the project well past 3,000 lines and past 8 files. The "small / you have 90% of context" framing under-sells the surface area. |
| 3 | "`applyLanguage()` calls 7 render functions in sequence" | `CLAUDE_CONTEXT.md` L25 | `ARCHITECTURE.md` (Rendering Flow) names **8** render functions (renderNav, renderHeader, renderSectionTitles, renderContentSections, renderFooter, renderDownloadsPage, renderStats, renderProjects). The count "7" is unverifiable from the docs and contradicts the diagram. **[verify in code]** |
| 4 | "Mobile-first / responsive via `@media`" | `AI_RULES.md` L50 | Every documented breakpoint is expressed as `max-width` (`≤1024`, `≤900` … in `UI_GUIDELINES.md`), which is **desktop-first**, not mobile-first. The rule mislabels the actual strategy and could push an agent to author min-width queries that clash with the cascade. |
| 5 | "JS normalizes them" (theme-navy / theme-emerald) | `CLAUDE_CONTEXT.md` L42 | States normalization happens but not the target. `UI_GUIDELINES.md` L50 supplies the missing mapping (navy→royal, emerald→silver). One doc is incomplete on its own; an agent reading only the context file cannot act. |
| 6 | "Container max-width" values disagree | see §5 | `UI_GUIDELINES.md` says container `max 1100px`; `CLAUDE_CONTEXT.md` calls 1200px the "max-width lock." Both are presented as the authoritative width. |

---

## 2. Missing Architecture Details

Information an agent needs that is **absent from all six documents**:

1. **The actual page sections are never enumerated.** Every doc refers to "sections," "content sections," and `renderContentSections` generically, but no document lists *what sections exist* (e.g. About, Skills, Experience, Projects, Education, Contact). This is the single biggest gap — any structural or design task forces a full read of `index.html` + `main.js`.
2. **`CV_DATA` object shape is described by key names only.** We know `profile`, `stats`, `projects`, `downloads`, `translations` exist, but not the sub-fields of `profile` (name? title? email? availability?), the shape of a `projects[]` entry (image, url, tech, role?), or what a `stats[]` entry contains.
3. **Export internals undocumented.** `buildWordHtml`, `buildAtsHtml`, `downloadBlob` are named only in the `AGENT_START_HERE.md` task table. No description of their inputs/outputs, the ATS transform rules, or the MIME/extension produced.
4. **Dependency/install story for `generate_cv.js` is missing.** It `require()`s `docx` and `puppeteer`, but there is no mention of a `package.json`, lockfile, install command, or output filenames. An agent cannot run it without scanning.
5. **No DOM contract.** HTML element IDs are sampled (`statsGrid`, `themeToggle`, `langSelect`) but there is no complete ID inventory, even though "HTML structure must match JS" is repeatedly stated as a hard constraint.
6. **`updateContrast()` behavior under-specified.** `AI_RULES.md` L107 says it "adjusts if ratio < 4.5" but not *what* it adjusts (text color? background? which variables) or when it runs.
7. **Particle / parallax / typing effect parameters** are listed as features but never parameterized (counts, speeds, thresholds), so any tuning task requires source reading.

---

## 3. Missing Workflows

Workflows referenced or implied but not documented end-to-end:

1. **Local preview → verify → ship.** `AGENT_START_HERE.md` gives `npx serve -p 4200 .` but no guidance on how to confirm a change rendered correctly (no checklist, no "load both `index.html` and `se.html`").
2. **Cache-busting workflow.** "Cache busting via manual `?v=` param updates" is listed as a *known issue* but there is no step-by-step ("which files reference the version param, where to bump it").
3. **Adding a download file.** Docs say downloads are `.gitkeep` placeholders and "do not commit download files," but never describe the intended path/naming (`CV_*.*` vs `CV_SE_*.*`) as a procedure, nor how `initDownloadGuard` reacts to a present vs missing file.
4. **Keeping `index.html` and `se.html` in sync.** Repeatedly stated as mandatory ("must stay in sync") but there is no diff/sync procedure or list of what must match.
5. **Regenerating the plain-text `assets/cv/*.md` copies.** `CLAUDE_CONTEXT.md` L54 says update them "manually" — there is no workflow tying them to `cv-data.js`, and `generate_cv.js` is not stated to produce them.
6. **Running/validating `generate_cv.js`.** No documented invocation result, output location, or how its output relates to `assets/downloads/`.

---

## 4. Missing File Responsibilities

| File | Status in docs | Gap |
|------|----------------|-----|
| `welcome_banner.svg` | Listed **twice** in `FILE_INDEX.md` (L72–73) with two different descriptions ("SVG banner graphic" / "Welcome banner graphic") | Duplicate row; also no statement of *where/whether* it is referenced by any HTML page. |
| `cv.md` vs `assets/cv/*.md` | Both listed as LOW/safe | Relationship between root `cv.md` and the six `assets/cv/*.md` files is never explained (which is canonical?). |
| `package.json` / lockfile | Not mentioned | If `generate_cv.js` has npm deps, a manifest exists or is needed — undocumented either way. |
| `.gitignore` | Not mentioned | "Do NOT commit download files" implies an ignore rule; its existence/content is undocumented. |
| `.DS_Store` | "ignore" in `ARCHITECTURE.md` | Fine, but flags that the folder tree may be stale relative to git. |
| `downloads.html` / `downloads-se.html` | Responsibilities given | But the *shared* JS entry points they rely on (`renderDownloadsPage`, `initDownloadGuard`, export buttons) are not cross-linked from the file table. |

---

## 5. Contradictions Between Documents

| # | Topic | Doc A | Doc B | Contradiction |
|---|-------|-------|-------|---------------|
| 1 | **Responsive breakpoints** | `AI_RULES.md` L50 & `FILE_INDEX.md` L34: **5** breakpoints (1024, 900, 768, 480, 360) | `CLAUDE_CONTEXT.md` L47 & `UI_GUIDELINES.md` L137: **6** including **1200px** | The 1200px breakpoint is present in two docs and missing from two. An agent can't trust either count. |
| 2 | **Container max-width** | `UI_GUIDELINES.md` L83: `1100px` | `CLAUDE_CONTEXT.md` L47: "1200px (max-width lock)" | Two different authoritative widths. |
| 3 | **Export format** | `CLAUDE_CONTEXT.md` L28: `application/msword` (i.e. `.doc`) | `FILE_INDEX.md` L28: "DOCX via Blob" | `.doc` vs `.docx` — materially different formats. |
| 4 | **Render-function count** | `CLAUDE_CONTEXT.md` L25: "7 render functions" | `ARCHITECTURE.md` Rendering Flow: 8 named | Count mismatch (see §1.3). |
| 5 | **Responsive strategy label** | `AI_RULES.md` L50: "Mobile-first" | `UI_GUIDELINES.md`: all `max-width` (desktop-first) | Naming contradiction (see §1.4). |
| 6 | **`assets/cv/` file count** | `ARCHITECTURE.md` lists **6** `.md` files | `FILE_INDEX.md` lists the same 6 — consistent — but `CLAUDE_CONTEXT.md` L54 implies they are secondary copies while `cv.md` (root) is separate and unexplained | Soft contradiction about which markdown is canonical. |

---

## 6. Information That Would Force Future AI Agents to Re-Scan the Repository

These are the concrete "you will have to open the source anyway" gaps — the highest-value things to fix, because the doc set's stated purpose is to avoid repo scans.

1. **List of page sections + their anchor IDs** — needed for *any* layout, nav, or design task. (Currently impossible without reading `index.html`.)
2. **Complete `CV_DATA` schema** (field-by-field for `profile`, `stats[]`, `projects[]`, `downloads`, `translations.en/ar` keys) — needed for any content or rendering change.
3. **Ordered list of the actual render functions** and which DOM IDs each writes to — needed to trace any rendering bug.
4. **Full DOM-ID inventory** — needed because "HTML must match JS" is a hard rule but the contract isn't published.
5. **Export pipeline spec** (`buildWordHtml` / `buildAtsHtml` / `downloadBlob`: inputs, transforms, output MIME/extension) — needed for any export fix.
6. **`generate_cv.js` I/O**: command, dependencies/manifest, output file names and destination — needed to run document generation.
7. **`initDownloadGuard` behavior** (how it probes `assets/downloads/*`, what it does on 404) — needed for any download-link work.
8. **CV_VERSION override map**: exactly which translation keys/sections `cv-data.js` changes for `'se'` (docs cite lines 424–586 but not the *content* of the override) — needed to edit either CV without scanning.

---

## 7. Documentation Improvements (Recommended Actions)

Priority-ordered. None require source changes that aren't pure documentation.

**P0 — Resolve contradictions (cheap, high trust impact)**
1. Pick one authoritative **breakpoint list** and one **container max-width**; reconcile all four docs. State whether 1200px is a true `@media` query or just the container clamp.
2. Fix the **export-format** wording everywhere to match reality (`.doc`/`application/msword` *or* real `.docx`), once verified in code.
3. Correct the **render-function count** (7 vs 8) and label the responsive strategy correctly (desktop-first).

**P1 — Close the re-scan gaps from §6**
4. Add a **"Page Sections & Anchors"** table to `ARCHITECTURE.md` (section name → anchor ID → render function → data source).
5. Add a **`CV_DATA` schema reference** (a typed-shape block) to `FILE_INDEX.md` or a new `DATA_SCHEMA.md`.
6. Add a **DOM-ID contract** appendix (ID → element → writer function).
7. Document the **export pipeline** and **`generate_cv.js`** usage (command, deps, outputs) in `ARCHITECTURE.md`.

**P2 — Hygiene**
8. Remove the **duplicate `welcome_banner.svg` row** in `FILE_INDEX.md` and state where the SVG is used (or that it's unused).
9. Clarify the **`cv.md` vs `assets/cv/*.md`** canonical relationship.
10. Document `package.json`/lockfile and `.gitignore` (or note their absence).
11. Convert the three "known issues" (manual cache-bust, placeholder downloads, unused `theme-navy`/`theme-emerald`) into short **workflows/decisions** rather than loose notes.

**P3 — Maintainability**
12. Add a **single source-of-truth note** for facts duplicated across docs (line counts, breakpoints, theme list) so future edits update one place. Currently the same numbers are restated in 3–4 files, which is how the §5 contradictions arose.
13. Add a **"Verify your change" checklist** (load `index.html` *and* `se.html`, both languages, dark + one preset, mobile width) to `AGENT_START_HERE.md`.

---

### Audit Summary

The doc set is unusually thorough for a static site and succeeds at conveying philosophy (no frameworks, vanilla JS, glassmorphism, a11y, security). Its weaknesses are **factual drift between files** (breakpoints, widths, export format, function counts) and **missing concrete contracts** (section list, data schema, DOM IDs, export spec) — and it's precisely those missing contracts that defeat the stated goal of "don't re-scan the repo." Fixing §5 (contradictions) and §6 (re-scan triggers) would raise the doc set from *good narrative* to *reliable reference*.
