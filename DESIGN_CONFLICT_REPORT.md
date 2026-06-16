# Design Conflict Report — Proposal vs. Real Source Code

**Baseline of truth**: `SOURCE_TRUTH_MAP.md` (extracted from `index.html`, `main.js`, `styles.css`, `cv-data.js`).
**Compared against**: `CV_REDESIGN_PROPOSAL.md` and `IMPLEMENTATION_READINESS_REPORT.md`.
**Method**: every major claim classified **VERIFIED** / **PARTIALLY CORRECT** / **INCORRECT** / **UNKNOWN** against code. No code changed; no new UI proposed.

---

## 1. Claim-by-Claim Classification

### ✅ VERIFIED (matches real code)

| Claim (proposal) | Code evidence |
|---|---|
| Two CV versions share one engine; `se.html` sets `CV_VERSION='se'` | `cv-data.js:424–586`; `index.html` cv-switch-bar |
| Content is data-driven from `CV_DATA` (`profile, stats, projects, downloads, translations`) | `cv-data.js:588–594` |
| CSS-variable theming in `:root` + `.dark-mode` + theme classes | `styles.css:2,22,35–107` |
| Dark mode is the **default** | inline head script `index.html:20–30` |
| Midnight preset exists & forces dark on selection | `main.js:204,499–509`; `styles.css:78` |
| Glassmorphism via `backdrop-filter` on container/nav/sections | `styles.css:153,660,1009` |
| Type scale is narrow (h1 caps ~2.4rem, body ~0.95em) | `styles.css` clamp values + `:768` overrides |
| Gradient text via `.gradient-text` | `h1.gradient-text` in HTML; `gradientShift` keyframe |
| Decorative motion = particles + parallax + blobs + typing + float | `initParticles/initParallax/initTypingEffect` + `body::before/after` blobs + `.floating` |
| Projects render as a **table** that becomes cards at ≤900px | `main.js:239–279` table; `styles.css:834` tbody→grid |
| `prefers-reduced-motion` fully handled | `styles.css:921`; guards in particles/parallax |
| No inline handlers; IIFE; `escapeHtml` before innerHTML | `main.js` throughout |
| **`updateContrast()` can override the palette at runtime** (readiness false-confidence risk #1) | `main.js:142–156` sets inline `--dark-text` when contrast <4.5 — **CONFIRMED REAL** |
| **No mobile menu exists at ≤768px** (readiness risk #3) | `styles.css:850` `.nav-links{display:none}` + `:872` `.nav-download{display:none}`, no toggle in HTML/JS — **CONFIRMED, and worse: download link also vanishes** |
| Client export is `application/msword` / `.doc`, not real `.docx` (audit #1) | `main.js:750,900,907` — **CONFIRMED** |
| `theme-navy`/`theme-emerald` are unused/normalized | `main.js:171–181`; **not defined in CSS at all** — **CONFIRMED dead** |
| Stats count "3–4" | exactly **4** (`cv-data.js:26–59`) |
| 8 `render*` functions named in ARCHITECTURE diagram | exactly **8** exist (§2.2 of truth map) |

### ⚠️ PARTIALLY CORRECT (some mismatch)

| Claim | What's right | What's wrong |
|---|---|---|
| **"7 render functions called by `applyLanguage`"** (readiness) | 8 `render*` functions exist | `applyLanguage` calls **6** directly; `renderStats`/`renderProjects` are nested inside `renderContentSections`. Neither "7" nor "8 direct" is accurate. |
| **"6 documented breakpoints"** / readiness "real list disputed" | A 1200px breakpoint does exist | Real count is **7** width breakpoints, incl. an **undocumented 600px** one. Step 12 ("consolidate breakpoints") was scoped to a wrong list. |
| **Header "one primary + one secondary CTA"** (proposal §3.2) | CTAs exist | There are **5** CTA buttons today (View Work / Get in Touch / GitHub / Download PDF / Hire Me). Reducing to 2 = a **content/structure decision**, not pure restyle — touches the preservation constraint. |
| **"Midnight preset is closest match; re-skin via tokens"** | Token system + Midnight are real and low-risk | But `updateContrast()` will fight token changes (see VERIFIED risk). Token swap is **not** sufficient alone. |
| **Container max-width ~1100px** | Correct (1100px) | The "1200px max-width lock" framing was wrong; 1200px is the *trigger*, 1100px the cap (`styles.css:918`). |
| **SE experience uses `.exp-entry` timeline** | Selectors real (`main.js:342–348`) | Rendered into `#experienceContainer` which **does not exist in `index.html`** — only SE pages. Restyling it won't affect the Flutter page. |

### ❌ INCORRECT (not present / contradicted in code)

| Claim | Reality |
|---|---|
| **Proposal §3 section order: nav → header → stats → about → skills → experience → projects → footer** | **WRONG ORDER and MISSING SECTIONS.** Real order: summary → experience → **projects → skills** (skills come *after* projects) → **education → achievements → advanced-skills → services → languages** → footer. The proposal **omits 5 real sections** (education, achievements, advanced-skills, services, languages) and inverts skills/experience/projects. |
| **"~3–4 sections to restyle"** implied scope | There are **10 content sections**; a redesign touching "sections" is ~2.5× the assumed surface. |
| **"About / Summary" as a distinct section** | The section id is `#summary` only; there is no separate "About". Minor, but the proposal treated them as plannable distinctly. |
| **Projects already have a "table on desktop / cards on mobile" split to *unify*** — implying card markup exists | Cards are **pure CSS reflow of the same `<table>`** at ≤900px; there is **no card markup**. "Unify into a card grid" (step 7) therefore requires **rewriting `renderProjects` markup**, not merging two existing systems. Higher effort than stated. |

### ❓ UNKNOWN (cannot confirm from the 4 files read)

| Item | Why unknown |
|---|---|
| `se.html` / `downloads*.html` actual DOM (e.g. `#experienceContainer`, `#additional-experience`, export buttons) | Not opened this pass; only inferred from JS references. |
| `generate_cv.js` behavior, deps, outputs | Out of scope of these 4 files. |
| Whether `package.json` / `.gitignore` exist | Not inspected. |
| Exact lines 823–1184 of every minor `@media` rule's content | Breakpoint *list* confirmed; per-rule details partially sampled. |

---

## 2. Risks If the Redesign Is Applied As-Is

1. **`updateContrast()` will silently revert your text color.** Any new dark palette whose body bg/text contrast computes < 4.5 triggers an inline `--dark-text` override on `<html>`, defeating step 1. *Must be neutralized or satisfied before re-tokening.* **(Highest risk — confirmed real.)**
2. **Five sections would be left unstyled / inconsistent.** The proposal's section-by-section plan never accounts for education, achievements, advanced-skills, services, languages. Applying it as-is yields a redesigned top half and an untouched bottom half.
3. **"Projects card grid" is a markup rewrite, not a CSS swap.** Editing `renderProjects` (`main.js:239–279`) risks the `#projectsTableBody` contract, the `initRevealAnimations` selector (`.project-table`), and the ≤900px reflow CSS. Medium-high regression surface.
4. **Typing effect will conflict with hero restyle.** `initTypingEffect` destroys/retypes the `.gradient-text` H1; any hero redesign that assumes a static, gradient-clipped H1 will flicker or mis-render until that init is addressed.
5. **Removing motion touches both CSS and JS in lockstep.** Blobs (`body::before/after`), `.floating`, particles, parallax, typing live across `styles.css` *and* `main.js`. Partial removal (CSS only) leaves JS injecting `.particle` nodes and transforming `#header`.
6. **CTA reduction risks the content-preservation rule.** Going from 5 CTAs to 2 removes user-facing links (Hire Me, GitHub, etc.) — that is content removal, not presentation. Must be reframed as visual de-emphasis, not deletion.
7. **Breakpoint "consolidation" was planned against a wrong list.** Missing the 600px breakpoint (and miscounting) means step 12 could drop or double-handle a layout regime.
8. **Mobile nav fix is even more needed than stated.** At ≤768px both nav-links **and** the Download CV link disappear with no replacement — a real navigation dead-end, raising step 9's priority.

---

## 3. Blocked Assumptions (do not build on these without action)

| Assumption | Status | Unblock by |
|---|---|---|
| "Re-token palette = done" (step 1) | **BLOCKED** | First handle `updateContrast()` (main.js:142–156). |
| "Redesign is mostly CSS-only / token-level" | **BLOCKED for sections 4–10, projects, mobile nav, controls** | Confirm which steps need `main.js`/HTML edits (projects, mobile menu, controls, downloads). |
| "Section list per proposal §3" | **BLOCKED — wrong** | Replace with the 10-section list from `SOURCE_TRUTH_MAP.md §1.2`. |
| "Projects = merge two layouts" | **BLOCKED — false premise** | Treat as a `renderProjects` markup rewrite. |
| SE timeline / additional-exp restyle affects main page | **BLOCKED** | Verify in `se.html` (not yet read). |
| `.docx` client export exists | **BLOCKED — it's `.doc`** | Only touch if export is in scope; expect `application/msword`. |

---

## 4. Required Corrections Before Any UI Redesign

1. **Adopt the real 10-section list and order** (truth map §1.2) as the canonical layout target. Rewrite proposal §3 to cover education, achievements, advanced-skills, services, languages, and the actual skills-after-projects order.
2. **Resolve `updateContrast()` first.** Decide: satisfy the ≥4.5 contrast gate with the new palette, or adjust/disable the runtime override. This gates step 1 entirely.
3. **Reclassify "projects card grid" as a JS+HTML change** (rewrite `renderProjects` output + the `.project-table` reveal selector + ≤900px CSS), risk = Med-High.
4. **Pair every motion-removal step across CSS *and* JS** (`initParticles`, `initParallax`, `initTypingEffect`, blob pseudo-elements, `.floating`).
5. **Correct the breakpoint inventory to 7** (1200/1024/900/768/**600**/480/360) before any "consolidation."
6. **Re-frame CTA and download-format reductions as visual de-emphasis, not removal**, to honor the 100%-content-preservation constraint (no link deleted).
7. **Note the dead presets**: `theme-navy`/`theme-emerald` need no CSS work (inert); the 7 live theme classes are the real surface.
8. **Verify SE/downloads pages** (`se.html`, `downloads.html`, `downloads-se.html`) before touching experience-timeline, additional-experience, or export UI.

---

### Verdict
The proposal's **design *direction*** (calm, dark, restrained, fix mobile nav, demote motion) is **sound and well-supported by the code**, and its two headline risks (`updateContrast` override, missing mobile menu) are **confirmed real**. But its **layout model is factually wrong** — it omits half the page's sections and misorders the rest — and several "CSS-only" steps are actually **JS/HTML rewrites**. **Do not implement against the proposal's §3 as written.** Use `SOURCE_TRUTH_MAP.md` as the layout baseline, unblock `updateContrast()` first, and re-scope steps 7/9/12 to their true (higher) effort before any redesign work begins.

*No code was modified. No new UI was designed.*
