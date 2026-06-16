# CV REDESIGN SPEC
**Mohamad Adib Tawil — Premium Developer Portfolio**

**Authority basis**: This spec is derived exclusively from `SOURCE_TRUTH_MAP.md`, `ARCHITECTURE_MAP.md`, and `RISK_REPORT.md`. Every design decision maps to a real DOM ID, real CSS selector, or real render function. No content, data structure, or section is changed, removed, or invented.

**Design-only**: No code. No implementation. This is a developer-facing specification.

**Architecture compliance — hard guardrails honored throughout:**
- All 10 sections (index.html) / 11 sections (se.html) preserved in real DOM order.
- `CV_DATA` schema untouched — this is a pure presentation re-skin.
- Rendering stays string-template + `innerHTML`; selectors/IDs preserved or additively extended.
- **R-01** (`updateContrast()` overrides `--dark-text` inline): all token pairs engineered to ≥ 4.5:1 so the override never fires.
- **R-14** (`applyLanguage()` sets `body.style.fontFamily` inline): font system designed to live INSIDE those two declared stacks.
- **R-02** (`initTypingEffect()` wipes H1): hero treatment designed to survive/replace it cleanly.
- **R-08** (index/se structural parity): every layout rule must apply identically to both pages.

---

## PART 1 — UI AUDIT

### 1.1 Current State Summary (from source)
The current UI is a **glassmorphism-on-animated-blobs** aesthetic: translucent `.container`, every `section` with `--glass-bg` + `backdrop-filter`, two fixed background blobs (`blobMove` 30s), a particle field (12–30 nodes), parallax header, char-by-char H1 typing, and pervasive 3D-perspective hover tilts (`rotateX`) on cards, rows, stats, and skills.

### 1.2 Visual Problems
| # | Problem | Source evidence |
|---|---------|-----------------|
| P-1 | **Surface uniformity kills hierarchy** — `.container`, `.top-nav`, every `section`, `.footer`, `.stat-card`, `.stats-section` all use the same `--glass-bg` + blur. Nothing is foreground vs background. | `styles.css` §section, §.footer, §.stats-* all share `--glass-bg` |
| P-2 | **Gradient overload** — `.gradient-text` (animated hue-rotate) on H1; same primary→accent gradient on stat numbers, `.btn`, `.tech-badge`, `.container::before`, social links, h2::before. The gradient stops meaning "important." | 8+ gradient usages |
| P-3 | **Motion noise** — blobs + particles + parallax + typing + `gradientShift` + `pulse` run simultaneously. Reads as "demo," not "senior engineer." | `blobMove`, `.particle`, `initParallax`, `initTypingEffect`, `pulse` |
| P-4 | **Perspective hovers feel gimmicky** — `rotateX(1deg/2deg)` on table rows, stat cards, skill list items. | `styles.css:494, 592, 758` |
| P-5 | **Compressed type scale** — h1 caps at 2.4rem, body 0.95em, h2 1.6rem max. No dramatic hero, no clear step system. | `styles.css:246, 379, 422` |
| P-6 | **Projects as a 2-column table** — `Project | Description` table doesn't read as a portfolio; thumbnails, tech badges, and links are cramped into table cells. | `renderProjects` table markup |

### 1.3 UX Issues
| # | Issue | Source evidence |
|---|-------|-----------------|
| U-1 | **5 CTAs in the header, equal weight** — View Work, Get in Touch, GitHub, Download Resume, Hire Me. No primary action wins. | `index.html:149–155` |
| U-2 | **Badges orphaned in footer** — `dict.header.badges` ("Remote from Syria", "Google Play published"…) render into `#headerBadges` which lives in the **footer**, far from the identity they describe. | R-09; `index.html:282–284` |
| U-3 | **No mobile navigation** — at ≤768px `.nav-links` AND `.nav-download` are `display:none` with no replacement. In-page nav relies on scrolling. | `styles.css:850, 863` |
| U-4 | **Stats animate once, never reset visibly** — after a language switch, `renderStats` resets DOM to "0" but `state.statsAnimated` guard blocks re-animation, risking a frozen "0". | R-07 |
| U-5 | **Theme/lang/preset controls dominate the nav** — 7-option preset select + lang select sit at top equal-weight with primary nav. | `index.html:104–125` |

### 1.4 Visual Hierarchy Issues
- No single focal point on first paint — header, stats, and nav compete (all glass).
- Section headers (`h2`) are visually similar to `h3` and body due to compressed scale.
- The `#stats` band and the header carry equal visual weight; stats should *support* identity, not rival it.

### 1.5 Mobile Issues
- U-3 (no nav) is the most severe.
- Blobs/particles only *dimmed* (opacity 0.25, blur 30px) at ≤480px — still rendered, still GPU cost.
- Perspective hovers are pointer-only; dead weight on touch.
- 7 breakpoints (incl. an isolated 600px contact-grid rule) signal per-width patching rather than a system.

---

## PART 2 — NEW DESIGN DIRECTION

### 2.1 Design Philosophy
**"Quiet confidence."** The work is senior, shipped, and quantified — the UI should get out of its way. Borrow from:
- **Linear** — near-black canvas, one decisive accent, hairline borders, surfaces defined by elevation not translucency, motion that is felt not seen.
- **Apple** — ruthless reduction; whitespace as the primary compositional tool; one idea per viewport.
- **Stripe** — a real type scale with dramatic hero-to-body contrast; documentation-grade legibility.
- **SaaS systems** — tokenized everything; an 8pt spatial grid; components, not one-offs.

**The single rule**: *Color and motion are reserved for meaning.* If something is highlighted, it is because it is interactive or it is the one thing that matters in that region.

### 2.2 Visual Identity
| Attribute | Direction |
|-----------|-----------|
| Mood | Engineered, calm, precise, premium |
| Surface | Solid elevated panels on a deep neutral canvas; **hairline borders**, not glass blur |
| Accent | **One** indigo accent + one muted success-green (status only) |
| Texture | Flat with soft, low-spread shadows; optional 1px top hairline instead of the gradient bar |
| Motion | Fade + 8–12px rise, ≤220ms, ease-out. Nothing loops. |
| Personality cue | A subtle monospace touch for metadata (dates, periods, tech) to signal "developer" |

### 2.3 Layout System
- **Single centered column**, max content width **820–880px** for reading sections; **1080px** for the shell (`.container` stays, re-skinned). Keep the existing `max-width: 1100px` cap.
- **8pt spatial grid.** All spacing is a token multiple of 4/8.
- **Vertical rhythm**: 96px between major sections on desktop, 56px on mobile — whitespace does the separation work that glass borders used to.
- **Asymmetric hero** (text-left / avatar-right on desktop), everything else single-column and left-aligned for scan speed.
- **Intrinsic responsiveness**: prefer `minmax`/`auto-fit` grids and fluid `clamp()` so fewer hard breakpoints are needed (consolidate toward 3: ~1080, ~768, ~480; retire the isolated 600px rule by folding it into 768/480).

### 2.4 Spacing System (tokens)
```
--space-1: 4px     --space-5: 24px    --space-9:  64px
--space-2: 8px     --space-6: 32px    --space-10: 96px
--space-3: 12px    --space-7: 40px    --space-11: 128px
--space-4: 16px    --space-8: 48px
```
Section padding: `--space-7` (desktop) / `--space-5` (mobile).
Inter-section gap: `--space-10` (desktop) / `--space-8` (mobile).
Card padding: `--space-5`. Card gap in grids: `--space-4`.

### 2.5 Typography System
**Constraint (R-14):** `applyLanguage()` hard-sets `body.style.fontFamily` to one of two stacks. The redesign **must operate within them** — do not fight the inline style. Use the existing stacks; tune weights/sizes/spacing only.
- EN stack (unchanged): `'Inter', 'Poppins', Arial, sans-serif`
- AR stack (unchanged): `'Tajawal', 'Poppins', Arial, sans-serif`
- **Mono accent** (metadata only — dates, tech badges, periods): add a system mono stack via a *scoped class*, NOT on `body` (so it survives the inline override): `font-family: ui-monospace, 'SF Mono', 'JetBrains Mono', Menlo, monospace;`

**Type scale (fluid, expanded for hierarchy):**
| Token | Role | Size (clamp) | Weight | Tracking |
|-------|------|--------------|--------|----------|
| `--fs-display` | Hero H1 | `clamp(2.5rem, 1.8rem + 3vw, 3.75rem)` | 700 | -0.02em |
| `--fs-h2` | Section title | `clamp(1.5rem, 1.2rem + 1.2vw, 2rem)` | 650 | -0.01em |
| `--fs-h3` | Sub/role | `clamp(1.1rem, 1rem + 0.4vw, 1.3rem)` | 600 | -0.01em |
| `--fs-lead` | Summary lead | `clamp(1.05rem, 1rem + 0.3vw, 1.2rem)` | 400 | 0 |
| `--fs-body` | Body/list | `1rem` (16px) | 400 | 0 |
| `--fs-meta` | Dates/tech/labels | `0.8125rem` | 500 | 0.01em |
- **Line-height**: 1.15 display, 1.3 headings, 1.65 body/lists.
- **Measure**: cap reading sections at ~68ch.
- **Arabic**: line-height +0.05, slightly larger body (Tajawal runs smaller); preserve all RTL flips already in `styles.css`.

### 2.6 Color System
**Dark-first** (current default via inline head script is preserved). Light mode remains via the existing `.dark-mode` absence path.

**R-01 compliance**: Each `--light-bg` / `--dark-text` pair below is chosen to compute **≥ 4.5:1**, so `updateContrast()` finds the page already compliant and **removes** any inline `--dark-text` override (never imposes `#111`/`#f5f5f5`).

**Dark theme (default) — token map onto existing variable names:**
| Existing var | New value | Contrast note |
|--------------|-----------|---------------|
| `--light-bg` (canvas) | `#0B0D10` | base |
| `--card-bg` (elevated) | `#14181E` | +1 elevation |
| `--dark-text` (primary) | `#E6E9EE` | ~14:1 on canvas ✅ |
| `--light-text` (muted) | `#9AA1AC` | ~5.4:1 on canvas ✅ |
| `--border-color` (hairline) | `rgba(255,255,255,0.09)` | — |
| `--primary-color` (accent) | `#6E7BFF` (indigo) | ~5.1:1 on canvas ✅ |
| `--accent-color` (secondary) | `#8B95FF` (used sparingly) | — |
| `--glass-bg` | `#14181E` (now SOLID, blur removed) | — |
| `--glass-border` | `rgba(255,255,255,0.09)` | — |
| status green | `#3FB984` | availability/employment pills |

**Light theme (`:root` defaults, no `.dark-mode`):**
| Var | Value |
|-----|-------|
| `--light-bg` | `#FBFBFD` |
| `--card-bg` | `#FFFFFF` |
| `--dark-text` | `#1A1D23` (~15:1 ✅) |
| `--light-text` | `#5A616B` (~5.6:1 ✅) |
| `--border-color` | `rgba(0,0,0,0.08)` |
| `--primary-color` | `#4F5BD5` (~5.3:1 ✅) |

**Accent usage budget (per viewport):** active nav state, one primary CTA, stat numbers, link hover, focus ring. Nothing else.

**Retire/repurpose:**
- `--blob-1` / `--blob-2`: set to `transparent` (kills blobs without removing the vars — preset CSS stays valid).
- `.gradient-text` animated hue-rotate: replace with solid `--dark-text` for the hero (or a single static, non-animated gradient if a gradient moment is desired). This also neutralizes the visual cost of **R-02**.
- The 7 theme presets remain functional but **Midnight becomes the canonical default look**; the picker is demoted (Part 4.5).

---

## PART 3 — NEW LAYOUT STRUCTURE

> Section order, IDs, and count are **unchanged** (R-08). Treatment changes only. Order below is the real DOM order from `SOURCE_TRUTH_MAP.md §1.2 / §1.3`.

### 3.0 Utility Bar — `.cv-switch-bar` (sticky top, outside `<main>`)
- **Purpose**: persona switch (Flutter ⇄ SE).
- **Treatment**: slim solid bar, hairline bottom border (drop `backdrop-filter: blur(14px)`). The active `.cv-tab` uses accent fill; inactive is muted text. Keep `role=tablist` semantics.
- **Desktop**: centered segmented control (current structure works).
- **Mobile**: unchanged structure; keep icon-hidden rule at ≤480px.
- **Label clarity**: keep the existing tab text exactly ("Flutter Developer" / "Software Engineer") — no content change.

### 3.1 Navigation — `nav.top-nav.cv-nav`
- **Purpose**: in-page jump + nav-spy active state.
- **Treatment**: solid sticky bar, hairline border (drop glass blur). Links are quiet text; active state = accent underline or pill (mirror to `[aria-current="true"]`, already styled). Controls (`#themePreset`, `#langSelect`, `#navDownload`) grouped to the right and visually demoted (see 4.5).
- **Desktop**: links left, controls right (current flex `space-between`).
- **Mobile (≤768px)**: **NEW — add a disclosure menu** to fix U-3. Spec in Component System §4.5. Must be added identically to `index.html` and `se.html` (R-08), wired in `main.js` with no inline handlers (architecture rule), and must include the Download CV link that currently vanishes.

### 3.2 Header / Hero — `header#header`
- **Purpose**: identity → role → status → one primary action.
- **Treatment**:
  - `h1` (`#` is `.gradient-text`): switch to solid `--dark-text`, `--fs-display`, weight 700. *Note R-02:* `initTypingEffect` will still type it char-by-char; recommend either (a) keep typing but on a solid-color H1 (clean), or (b) disable `initTypingEffect()` for a static hero. Either is presentation-safe.
  - `#jobTitle`: `--fs-h3`, `--light-text`.
  - **Relocate the badge meaning visually**: the badge content rendered into `#headerBadges` currently sits in the footer (R-09/U-2). **Do not move the DOM** (R-08 risk) — instead, design the footer badge cluster as an intentional "at a glance" footer strip, AND surface the single most important status (`#availabilityBadge`, which IS in the header) as a prominent status pill (dot + label, status-green). This honors the DOM while fixing the perceived orphaning.
  - **CTA hierarchy (U-1)**: keep all 5 anchors (no removal). Re-rank by style: `#ctaWork`'s button = the **only** `.btn-primary` (solid accent); the other four become quiet `.btn-secondary` (ghost/hairline). This is pure visual de-emphasis — every link/href preserved.
  - Avatar (`.profile-pic.floating`): clean 2px ring in `--border-color`, subtle scale-on-hover only; replace `float`/`floatMobile` loop with stillness (set `.floating` animation to none, or leave keyframe and null the animation in the redesign — no JS change needed).
- **Desktop**: two-column — `.header-info` left (`flex: 1 1 320px` already), avatar right. Current `flex-wrap` supports this.
- **Mobile**: single column, avatar above name (current `flex-direction: column` at 768px), CTAs full-width stacked with the primary on top.

### 3.3 Stats — `section#stats.stats-section` → `#statsGrid`
- **Purpose**: quantified credibility, *supporting* the hero.
- **Treatment**: thin horizontal band of 4 understated cells; accent **only** on the number (`.stat-number` — drop the gradient-text, use solid accent). Hairline dividers between cells; remove `rotateX` hover. Keep the `data-target` attribute (R-07 — `animateCounter` depends on it).
- **R-07 fix (presentation-level)**: render the initial number as the formatted target (not "0") so that if the animation is guarded/blocked, the value is still correct. The count-up becomes an enhancement, not a dependency.
- **Desktop**: single row of 4 (`repeat(4, 1fr)` or keep `auto-fit minmax`).
- **Mobile**: 2×2 grid (avoid the current 1-col stretch).

### 3.4 Summary — `section#summary` (`#summaryText`)
- **Purpose**: narrative positioning, the one paragraph that frames everything.
- **Treatment**: no card chrome — let the lead paragraph breathe on the canvas at `--fs-lead`, `--light-text`, measure ~68ch. This is the "one idea per viewport" moment.
- **Desktop/Mobile**: constrained text column, generous top/bottom space.

### 3.5 Experience — `section#experience`
- **Flutter (index.html)**: `#experienceRole` (h3) + `#experienceList` (ul).
- **SE (se.html)**: `#experienceContainer` rendered as `.exp-entry` blocks with `.exp-entry-header` / `.exp-entry-meta` / `.exp-period` / `.exp-location`.
- **Treatment**: a **clean vertical timeline** (the existing `#experience ul::before` left-rail line is a good base — refine it to a hairline). Dates/periods in **mono `--fs-meta`**, muted. Drop glass; entries separated by hairline (`.exp-entry + .exp-entry` border-top already exists). Bullet markers = small accent dots (already present in CSS) — thin them.
- **Desktop**: meta (period/location) in a right-aligned column, role+bullets left (current `.exp-entry-header` `space-between` supports this).
- **Mobile**: stack meta above bullets; keep RTL flips (`html[dir="rtl"] .exp-entry-*`).

### 3.6 Projects — `section#projects` → `table.project-table` / `#projectsTableBody`
- **Purpose**: shipped proof with thumbnails, tech, and store/repo links.
- **Treatment**: **convert the visual presentation from table-cells to a card grid.** Two implementation-safe paths (developer chooses):
  - **(A) CSS-only** — keep the `<table>` markup and `renderProjects` untouched; use the existing ≤900px pattern (`display:block/grid`, `thead{display:none}`) as the **default at all widths**, styled up into proper cards. Lowest risk, no JS change.
  - **(B) Markup change** — rewrite `renderProjects` output to semantic cards. Higher fidelity but touches JS. **If chosen, honor R-03**: the description `<p>` must remain **unescaped** (it contains trusted `<a>` store links) — do NOT add `escapeHtml` to it. Also update the `initRevealAnimations` selector (`.project-table`) if the class is removed, and remove the inline `overflow-x:auto` wrapper (R-16).
- **Card anatomy** (either path): thumbnail (`.project-thumb`, square, radius 12px) → name (`.project-name`, accent) → tech row (`.tech-badge`, mono, **solid muted chips, drop the gradient**) → description with inline links.
- **Desktop**: 2-up grid (`auto-fit minmax(320px, 1fr)`).
- **Mobile**: 1-up (matches current ≤768px `.projects-grid` intent).

### 3.7 Skills / Achievements / Advanced Skills / Services
`section#skills` (`.skill-list`), `#achievements` (`.achievement-list`), `#advanced-skills` (`.advanced-skill-list`), `#services` (`.service-list`).
- **Purpose**: scannable capability/credibility lists.
- **Treatment**: these already share one CSS group (grid, `gap:14px`, card-like `li`). Re-skin uniformly: solid `--card-bg` surface, hairline border, **remove the `translateY(-4px) perspective rotateX(2deg)` hover** → replace with a quiet border-brighten + 2px lift. Bullet `\2022` in accent, restrained.
- **Desktop**: 2-column grid where item count warrants (`auto-fit minmax(280px, 1fr)`).
- **Mobile**: single column (current 768px rule stacks them).

### 3.8 Education — `section#education` (`#education h3` + `#education ul`)
- **Treatment**: single quiet block; institution/degree as `h3`, coursework/project as a clean list. Dates in mono meta. No card chrome needed; hairline separator above.

### 3.9 Languages — `section#languages` (`#languagesText`)
- **Treatment**: minimal — a single line/pair of language proficiency. Could render as two quiet inline pills, but **content string is unchanged**; pill-splitting must be CSS-only (no parsing/altering the text).

### 3.10 Additional Experience — `section#additional-experience` (SE only)
`#additionalTechTitle` + `#additionalTechContainer` (`.additional-tech-section` blocks).
- **Treatment**: same list grammar as Skills (§3.7); grouped sub-sections with hairline separation (`.additional-tech-section + .additional-tech-section` margin already exists).
- **Only renders on se.html** — must look native to the SE page; absent on index.html (no DOM, JS skips silently — R-20 acknowledged).

### 3.11 Footer — `footer.footer`
- **Purpose**: secondary nav, social, status meta.
- **Treatment**: calm 3-column grid (Quick Links / Connect / Info) on hairline-separated canvas. `#employmentBadge` + `#headerBadges` cluster (the orphaned badges, R-09) reframed as an intentional **"highlights" strip** — small mono pills, muted. Social icons (`.social-links`): drop the `rotate(10deg)` hover → simple color/opacity shift.
- **Desktop**: 3 columns (`auto-fit minmax(200px,1fr)` exists).
- **Mobile**: stacked.

---

## PART 4 — COMPONENT SYSTEM

### 4.1 Card System
| Token | Value |
|-------|-------|
| Background | `--card-bg` (solid) |
| Border | `1px solid --border-color` (hairline) |
| Radius | `12px` (down from 20/16) |
| Shadow (rest) | `0 1px 2px rgba(0,0,0,0.20)` |
| Shadow (hover) | `0 4px 16px rgba(0,0,0,0.28)` |
| Hover transform | `translateY(-2px)` — **no perspective/rotate** |
| Padding | `--space-5` |
| Transition | `transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease` |
Applies to: `.stat-card`, project cards, `.skill-list li` group, `.exp-entry`, `.additional-tech-section`.

### 4.2 Section Header (`h2` + `h2::before` + `h2 i`)
- `--fs-h2`, weight 650, `--dark-text`.
- Replace the dot+border-bottom combo with: a **small accent left-tick** (keep `h2::before` but make it a 3px×18px accent bar) and a thin full-width hairline under the title.
- Keep the Font Awesome `<i>` icon (`h2 i`) but mute to `--light-text`, smaller. Preserve `aria-hidden` (architecture rule).
- `setHeadingText()` preserves the `<i>` — design must keep the icon as first child.

### 4.3 Skill / List Display System
- Shared across `.skill-list / .achievement-list / .advanced-skill-list / .service-list` (one CSS group — change once, applies to all four).
- Each `li`: solid surface, hairline, radius 12px, accent bullet, `--fs-body`, line-height 1.5.
- Hover: border-brighten + 2px lift (no rotateX).
- Grid: `auto-fit minmax(280px, 1fr)`, gap `--space-4`.
- **Tech badges** (`.tech-badge`): mono `--fs-meta`, solid `--border-color` chip with `--light-text`, radius 8px. Drop the gradient fill.

### 4.4 Project Layout System
- Card grid (Part 3.6). Card = thumbnail + title + mono tech chips + description-with-links.
- `.project-thumb`: 96–120px square, radius 12px, hairline border, `loading="lazy"` preserved.
- Links inside description: accent text, underline-on-hover (the global `a::after` sweep can be simplified to a static underline).
- Reveal: fade+rise via existing `.fade-in` mechanism.

### 4.5 Navigation System
**Desktop top-nav:**
- Quiet text links; active = accent pill or 2px accent underline (drive from existing `.active` + `[aria-current="true"]` selectors — both already styled identically).
- **Controls demotion**: wrap `#themePreset` + `#langSelect` + `#navDownload` in a compact cluster. Theme/lang selects = small, icon-led, `--card-bg` surface, hairline. `#navDownload` styled as a quiet secondary button.

**NEW Mobile menu (≤768px) — fixes U-3:**
- Add a disclosure button (hamburger) into `.cv-nav` — **identically in index.html and se.html** (R-08).
- Toggles a vertical sheet containing: all `.nav-links` anchors **+ the Download CV link** (which currently disappears).
- Wire open/close in `main.js` via `addEventListener` (no inline `onclick` — architecture rule); manage `aria-expanded` on the button and focus trap on the sheet.
- Respect `prefers-reduced-motion` for the open/close animation.
- This is the one **additive structural change**; it must not alter any section, content, or `CV_DATA`.

**Nav-spy**: keep `initNavSpy` (threshold 0.6). Note R-11 — very short sections (`#languages`) may not trigger; acceptable, or lower their observer reliance by ensuring adequate min-height via spacing.

---

## PART 5 — INTERACTION DESIGN

### 5.1 Hover States (premium, restrained)
| Element | New hover |
|---------|-----------|
| Cards (all) | `translateY(-2px)` + border-brighten + soft shadow. No rotate. |
| Nav links | text → `--dark-text`, accent underline grows. |
| Primary CTA | brightness +6%, `translateY(-1px)`. |
| Secondary CTA | border + text → accent. |
| Links in body | static underline appears (simplify `a::after` sweep). |
| Social icons | opacity/color shift only (drop `rotate(10deg)`). |
| Avatar | `scale(1.03)`, subtle shadow. |
| Stat cells | none (or faint border-brighten) — stats are data, not buttons. |

### 5.2 Scroll Behavior
- **Reveal**: keep `initRevealAnimations` (IntersectionObserver 0.1) → `.fade-in`. Refine the base state to `opacity:0; translateY(10px)` and `.fade-in` to settle — single consistent grammar for every `section`, `header`, project group.
- **Nav-spy**: keep, with accent active state.
- **Parallax (`initParallax`)**: **retire** — set header transform to none. (Disable the JS init or null its effect; presentation-safe, removes P-3 noise.)
- **Scroll-to-top** (`#scrollToTop`): keep; restyle as a quiet circular button, accent on hover, appears after 300px (unchanged threshold).

### 5.3 Animations (subtle, premium)
**Keep:** section reveal (fade+rise), stats count-up (as enhancement only, R-07), nav-spy transitions, theme transition.
**Retire/neutralize:** `blobMove` (blobs → transparent), `.particle` field (disable `initParticles`), `float`/`floatMobile` (still avatar), `gradientShift` (solid hero), `pulse` (static availability pill or a single gentle fade), perspective hovers, parallax.
**Global timing:** ≤220ms, `ease-out`. Nothing loops. Honor the existing `@media (prefers-reduced-motion: reduce) { * { animation:none; transition:none } }` — and remember **JS loops (typing) are NOT covered by it** (R-02): prefer a static hero so reduced-motion is truly respected.

### 5.4 Theme Transitions
- Keep `enableThemeTransition()` (`.theme-transition` 300ms scoped transition) for dark/light and preset swaps — it's already well-scoped.
- **R-01 discipline**: because every token pair is ≥4.5:1, `updateContrast()` will *remove* its inline `--dark-text` on every run — the design never gets hijacked. Verify each of the 7 presets against the dark canvas; if any preset's `--primary-color` (e.g. Silver `#d1d5db` accent, Royal gold) drops below 4.5:1 for text usages, restrict that preset's accent to non-text roles only.
- Preset picker demoted but functional; **Midnight = canonical default** visual.

---

## PART 6 — DESIGN TOKENS (consolidated)

```
/* ---- Color: Dark (default) ---- */
--light-bg:      #0B0D10;   --card-bg:     #14181E;
--dark-text:     #E6E9EE;   --light-text:  #9AA1AC;
--border-color:  rgba(255,255,255,0.09);
--primary-color: #6E7BFF;   --accent-color:#8B95FF;
--glass-bg:      #14181E;    /* now solid */
--glass-border:  rgba(255,255,255,0.09);
--status-green:  #3FB984;
--blob-1: transparent; --blob-2: transparent;
--shadow:       0 1px 2px rgba(0,0,0,0.20);
--shadow-hover: 0 4px 16px rgba(0,0,0,0.28);

/* ---- Color: Light (:root, no .dark-mode) ---- */
--light-bg: #FBFBFD; --card-bg: #FFFFFF;
--dark-text: #1A1D23; --light-text: #5A616B;
--border-color: rgba(0,0,0,0.08); --primary-color: #4F5BD5;

/* ---- Spacing (8pt) ---- */
--space-1..11: 4,8,12,16,24,32,40,48,64,96,128 px

/* ---- Radius ---- */
--radius-sm: 8px;  --radius-md: 12px;  --radius-pill: 999px;

/* ---- Type ---- */
--fs-display: clamp(2.5rem,1.8rem+3vw,3.75rem)/700/-0.02em
--fs-h2:      clamp(1.5rem,1.2rem+1.2vw,2rem)/650/-0.01em
--fs-h3:      clamp(1.1rem,1rem+0.4vw,1.3rem)/600
--fs-lead:    clamp(1.05rem,1rem+0.3vw,1.2rem)/400
--fs-body:    1rem/400
--fs-meta:    0.8125rem/500/0.01em  (mono, scoped class)
--lh-display:1.15 --lh-head:1.3 --lh-body:1.65

/* ---- Motion ---- */
--ease: cubic-bezier(0.22,0.61,0.36,1);
--dur-fast:120ms --dur:180ms --dur-slow:220ms

/* ---- Focus ---- */
--focus-ring: 2px solid var(--accent-color); offset 2px;  /* preserve existing :focus-visible */
```

---

## PART 7 — IMPLEMENTATION GUIDELINES (developer-facing)

### 7.1 Do-not-break checklist (from RISK_REPORT)
1. **R-01**: Verify every `--light-bg`/`--dark-text` pair and every preset accent used as text computes ≥ 4.5:1. Test by loading and confirming `<html>` has **no** inline `--dark-text` after `updateContrast()`.
2. **R-14**: Keep all font work inside the two declared stacks; use a **scoped class** for mono meta, never `body`.
3. **R-02**: Prefer a static, solid-color hero. If keeping `initTypingEffect`, ensure the H1 color is solid (not transparent gradient) so the retype is clean and reduced-motion users aren't subjected to a JS loop.
4. **R-07**: Render stat numbers as the formatted target value (not "0"); treat count-up as enhancement.
5. **R-03**: If rewriting `renderProjects`, keep the description `<p>` **unescaped**.
6. **R-08**: Apply every layout/markup change to **both** `index.html` and `se.html`; keep `?v=` cache-bust params in sync across all 4 HTML files.
7. **R-09**: Do not relocate `#headerBadges`/`#employmentBadge` in the DOM — restyle in place as a footer highlights strip.
8. **Architecture**: no inline event handlers; keep IIFE; keep `escapeHtml` on all dynamic content except the intentional project description.

### 7.2 Recommended sequencing (lowest risk first)
| Phase | Work | Files | Risk |
|-------|------|-------|------|
| 1 | Re-token color (dark+light, presets), spacing, radius, shadows | `styles.css` `:root`/`.dark-mode`/`theme-*` | Low (gated by R-01 check) |
| 2 | Typography scale + mono meta class | `styles.css` | Low |
| 3 | Replace glass → solid hairline surfaces; null blobs/particles CSS; radius 12px | `styles.css` | Low–Med |
| 4 | Calm motion: still avatar, solid hero, drop perspective hovers; disable `initParticles`/`initParallax`; static/animated-once availability | `styles.css` + `main.js` (init toggles only) | Med |
| 5 | Stats band + R-07 initial value; CTA re-rank (1 primary/4 secondary) | `styles.css` (+ tiny `renderStats` value tweak) | Med |
| 6 | Projects card grid — **path A (CSS-only) preferred** | `styles.css` | Med |
| 7 | Experience timeline + Additional-Exp (SE) polish | `styles.css` | Low–Med |
| 8 | **Mobile nav menu** (additive) — both pages, JS toggle, a11y | `index.html`+`se.html`+`main.js`+`styles.css` | High |
| 9 | Footer highlights strip; downloads page hierarchy | HTML + `styles.css` | Med |
| 10 | Breakpoint consolidation (retire isolated 600px; toward 1080/768/480) | `styles.css` | Med |
| 11 | Cross-check: index+se, EN+AR(RTL), dark+light+all 7 presets, 360→1440 widths | all | QA gate |

### 7.3 Acceptance criteria
- 100% of sections, content, links, and `CV_DATA` keys present and unchanged.
- No inline `--dark-text` override after load on any theme/preset (R-01 proof).
- Mobile (≤768px) has working in-page navigation including Download CV (U-3 fixed).
- One primary CTA; all 5 CTAs still functional (U-1 fixed, nothing removed).
- Zero looping animations; reduced-motion fully honored (no JS typing loop).
- Identical layout behavior on `index.html` and `se.html` (R-08).
- All 7 presets pass contrast for text-role accent usage.

---

### One-line essence
Keep the architecture and 100% of the content; trade glass-on-blobs + gradient-everything + perpetual motion for a **solid, dark, Linear-grade system** — one accent, a real type scale, hairline surfaces, an 8pt grid, a project card grid, and a working mobile menu — implemented token-first and gated by the `updateContrast()` contrast rule so the design can never be silently overridden.
