# Plan — Per‑Project Detail Pages (Screenshots · Video · Downloads · Bio)

> **Author of intent:** Mohamad Adib Tawil (site owner). **Executor:** Claude Sonnet.
> **Goal:** When a visitor clicks a project on `index.html` (Flutter CV) or `se.html`
> (Software Engineer CV), open a dedicated, premium detail page for that app showing:
> screenshots gallery, a video, a **direct download** link, a **Google Play** link
> (plus App Store / GitHub / any link already written inside the project description),
> and a project **bio**.
> The look must match — and slightly elevate — the current "Signal" redesign
> (deep indigo canvas + electric cyan accent). This site is a flagship personal
> portfolio; quality bar is "ready to launch, worth ~$10k, represents me personally."

> **ملخص بالعربية:** نضيف صفحة تفاصيل واحدة قابلة لإعادة الاستخدام (`project.html`)
> تعرض أي مشروع حسب رقمه عبر الرابط (`project.html?id=lklk`). نضيف مجلداً لكل مشروع
> تحت `assets/projects/<slug>/` فيه `screenshots/` و `video/` (فارغة الآن، تملؤها لاحقاً).
> نوسّع بيانات المشاريع في `cv-data.js`، نجعل بطاقات المشاريع قابلة للنقر، ونضيف منطق
> العرض في `main.js` وتنسيقات في `styles.css`. كل شيء يحترم القواعد الحالية (بدون أطر،
> بدون build، ألوان عبر المتغيرات، ثنائي اللغة EN/AR، دعم RTL، الوضع الداكن).

---

## 0. Non‑negotiable constraints (read `AI_RULES.md` first)

These are pulled from `AI_RULES.md`. The implementation MUST obey them:

- **No frameworks, no build step.** Vanilla HTML/CSS/JS only. Deploy raw files.
- **`main.js` stays one IIFE.** Add functions inside the existing `(() => { ... })()`.
- **Colors only via CSS custom properties** (`--primary-color`, `--accent-color`,
  `--card-bg`, `--border-color`, `--tint-weak`, `--tint-strong`, spacing/radius tokens).
  Never hardcode a hex that bypasses the theme system.
- **No inline event handlers** (`onclick=`); attach listeners in JS.
- **`escapeHtml()` every dynamic text value** before `innerHTML`. The only field allowed
  to contain raw HTML is `project.description[lang]` (it already holds `<a>` links — this
  is the existing, accepted pattern in `renderProjects`).
- **External links** get `target="_blank" rel="noopener noreferrer"`.
- **File names:** `snake_case` / kebab for assets. **CSS classes:** `kebab-case`.
  **HTML element IDs:** `camelCase`. **CSS custom props:** `--kebab-case`.
- **Respect `prefers-reduced-motion`**, keep `loading="lazy"` + `decoding="async"` on
  below‑the‑fold images, keep proper heading order (h1→h2→h3), keep focus outlines.
- **RTL:** Arabic must mirror correctly (`html[dir="rtl"]`).

### ⚠️ Two documented rules this plan intentionally amends (owner‑authorized)

The owner has explicitly requested these changes, so update the docs in the same PR:

1. **Hard Rule #3** — "Do NOT modify `cv-data.js` structure (projects keys)."
   We are **additively extending** each project object with new **optional** keys
   (`slug`, `bio`, `media`, `links`). All existing keys (`id`, `name`, `tech`, `image`,
   `description`) stay untouched, so `renderProjects` keeps working unchanged.
   → After implementing, update `AI_RULES.md` Rule #3 to read: *"Existing project keys
   are stable; new optional keys may be added but never removed/renamed."* Also update
   `SOURCE_TRUTH_MAP.md` / `ARCHITECTURE.md` if they enumerate the project schema.

2. **Folder Rule** — "Do NOT create new top-level folders without documenting."
   We add `assets/projects/` (NOT top-level — it lives under `assets/`). Still, document
   it: add a row to the **Folder Rules** table in `AI_RULES.md` describing
   `assets/projects/<slug>/{screenshots,video}/` as the home for per‑project media.

---

## 1. Architecture decision — ONE template page, not five

**Do NOT create five separate HTML files.** That duplicates the entire `<head>`,
nav, footer, and theme bootstrap five times and rots immediately.

Instead build **a single `project.html`** that:
- reads the project id from the query string: `project.html?id=lklk`
- looks the project up in `window.CV_DATA.projects`
- renders the detail view from data (same data‑driven philosophy as `renderProjects`)
- shows a graceful "project not found" state + back link if the id is missing/invalid.

This is the cleanest fit for a no‑router, no‑build, data‑driven codebase, and "a new
page per app" from the visitor's point of view is fully satisfied
(`project.html?id=<slug>` is a distinct, shareable, SEO‑linkable URL per app).

`project.html` is shared by BOTH CVs — a card on `index.html` and the same card on
`se.html` link to the same detail page. A `from` param (`&from=se`) controls where the
"Back" button returns to.

---

## 2. Folder & file changes — overview

```
CV/
├── project.html                      ← NEW  (single reusable detail template)
├── assets/
│   ├── css/
│   │   └── styles.css                ← EDIT (append "Project detail page" section)
│   │   └── home.css                  ← EDIT (optional: signature tweaks for detail page)
│   ├── js/
│   │   ├── cv-data.js                ← EDIT (extend each project + add detailPage i18n)
│   │   └── main.js                   ← EDIT (add renderProjectDetail(), gate by page)
│   └── projects/                     ← NEW folder
│       ├── lklk/
│       │   ├── screenshots/.gitkeep
│       │   └── video/.gitkeep
│       ├── wolfera/
│       │   ├── screenshots/.gitkeep
│       │   └── video/.gitkeep
│       ├── codebook/
│       │   ├── screenshots/.gitkeep
│       │   └── video/.gitkeep
│       ├── office/
│       │   ├── screenshots/.gitkeep
│       │   └── video/.gitkeep
│       └── quran/
│           ├── screenshots/.gitkeep
│           └── video/.gitkeep
├── AI_RULES.md                       ← EDIT (amend Rule #3 + Folder Rules row)
└── (docs that enumerate the schema)  ← EDIT if present
```

> **Slugs MUST equal the existing `project.id` values** so URLs and folders line up:
> `lklk`*(note: current id is `"iklk"` — see §3 fix)*, `wolfera`, `codebook`, `office`, `quran`.

**Create the folders** (run from repo root):

```bash
for p in lklk wolfera codebook office quran; do
  mkdir -p "assets/projects/$p/screenshots" "assets/projects/$p/video"
  touch "assets/projects/$p/screenshots/.gitkeep" "assets/projects/$p/video/.gitkeep"
done
```

**File naming convention the owner will follow when adding media later** (document this
in the detail page intro and in `cv-data.js` comments):
- Screenshots: `screenshot-01.png`, `screenshot-02.png`, … (zero‑padded, ordered).
- Video: `demo.mp4` (H.264/AAC for broad support) + optional `poster.jpg`.
- Direct download (APK): `assets/projects/<slug>/<slug>-latest.apk` **OR** an external URL.

---

## 3. `assets/js/cv-data.js` — extend the data model

### 3a. Fix the LKLK id typo
Current first project has `id: "iklk"` but the brand is "LKLK". Change it to
`id: "lklk"` so the slug, folder, and URL are consistent. (Search the repo for `"iklk"`
to confirm nothing else references the old id — it isn't used anywhere structural.)

### 3b. Add optional keys to EACH project object
Keep every existing key. Append these (example shown for LKLK; replicate per project):

```js
{
  id: "lklk",
  name: "LKLK",
  tech: [...],                       // unchanged
  image: {...},                      // unchanged (used as the detail hero/app icon)
  description: { en: `...`, ar: `...` }, // unchanged (raw HTML links preserved)

  // ---- NEW (all optional; detail page degrades gracefully if absent) ----
  slug: "lklk",                      // === id; used for folder + ?id= URL
  bio: {
    en: "1–3 short paragraphs telling the story of the app: the problem, what you "
      + "built, the hard parts you solved, and the outcome. Plain text or simple HTML.",
    ar: "فقرة إلى ثلاث فقرات تحكي قصة التطبيق: المشكلة، وما بنيتَه، وأصعب ما حللته، "
      + "والنتيجة. نص عادي أو HTML بسيط."
  },
  links: {
    directDownload: "",              // e.g. "assets/projects/lklk/lklk-latest.apk" or external URL; "" hides the button
    playStore: "https://play.google.com/store/apps/details?id=com.bwmatbw.lklklivechatapp",
    appStore: "",                    // "" hides
    github: "",                      // "" hides
    website: ""                      // "" hides
  },
  media: {
    poster: "assets/projects/lklk/video/poster.jpg", // optional; falls back to image.src
    video: "assets/projects/lklk/video/demo.mp4",    // "" => video section hidden
    screenshots: [
      // Fill these in when files are added. Each item is per‑language alt + src.
      // { src: "assets/projects/lklk/screenshots/screenshot-01.png",
      //   alt: { en: "LKLK live room", ar: "غرفة LKLK المباشرة" } },
    ]
  }
}
```

> Pre‑populate `links.playStore` / `appStore` / `github` for every project by **reusing
> the URLs already embedded in each `description`** (LKLK→Play; Wolfera→GitHub+Play;
> Code Book→GitHub; Office Archiving→GitHub+Play; Quran→GitHub+Play+App Store).
> Leave `screenshots: []`, `video: ""`, `directDownload: ""` empty — the owner fills them.

### 3c. Add a `detailPage` i18n block to BOTH `translations.en` and `translations.ar`
Mirror the existing translation structure. Keys:

```js
detailPage: {
  back: "Back to CV",            // ar: "العودة إلى السيرة"
  overview: "Overview",          // ar: "نظرة عامة"
  screenshots: "Screenshots",    // ar: "لقطات الشاشة"
  video: "Video",                // ar: "فيديو"
  links: "Links & Downloads",    // ar: "الروابط والتنزيل"
  directDownload: "Direct Download", // ar: "تنزيل مباشر"
  playStore: "Google Play",      // ar: "Google Play"
  appStore: "App Store",         // ar: "App Store"
  github: "GitHub",              // ar: "GitHub"
  website: "Website",            // ar: "الموقع"
  techStack: "Tech Stack",       // ar: "التقنيات"
  comingSoon: "Coming soon",     // ar: "قريباً"  (shown when media not yet added)
  notFound: "Project not found", // ar: "المشروع غير موجود"
  notFoundBody: "This project doesn't exist. Return to the CV to browse all projects.",
                                 // ar: "هذا المشروع غير موجود. عُد إلى السيرة لتصفّح كل المشاريع."
}
```

---

## 4. `project.html` — the detail template

Clone the structural skeleton of `index.html` so the chrome is identical. Requirements:

- `<!-- project.html -->` first line comment (matches `index.html`/`se.html` style).
- Copy the `<head>` from `index.html` verbatim **except**: title/description/OG tags become
  generic ("Project — Mohamad Adib Tawil"); JS will overwrite `document.title` and the
  meta description per project after load.
- Keep the **dark‑mode bootstrap `<script>`** and font/FontAwesome `<link>`s.
- Link **both** stylesheets (so the signature identity applies):
  `styles.css?v=...` then `home.css?v=...`.
- `<body data-page="project" class="home-redesign">` — the `home-redesign` marker gives
  the page the indigo→cyan signature; `data-page="project"` triggers the new JS branch.
- Keep `cv-switch-bar`, `particles-container`, `theme-toggle`, `scroll-to-top`,
  the `top-nav` controls (theme preset + language selectors), so theme/lang switching
  works identically. The nav's section anchor links can be simplified to a single
  "Back to CV" link.
- `<main id="main"><div class="container"> … </div></main>` wrapper, then the same
  `<script src="cv-data.js">` + `<script src="main.js">` + analytics, all `defer`.

### Static DOM skeleton inside `.container` (JS fills the text/media):

```html
<a id="detailBackLink" class="detail-back" href="index.html#projects">
  <i class="fas fa-arrow-left" aria-hidden="true"></i> <span>Back to CV</span>
</a>

<article id="projectDetail" class="project-detail" hidden>
  <header class="detail-hero">
    <img id="detailIcon" class="detail-icon" width="96" height="96"
         decoding="async" alt="">
    <div class="detail-hero-info">
      <h1 id="detailName" class="gradient-text"></h1>
      <ul id="detailTech" class="detail-tech" aria-label="Tech stack"></ul>
      <div id="detailActions" class="detail-actions"></div> <!-- buttons injected -->
    </div>
  </header>

  <section id="detailOverview" class="detail-section">
    <h2><i class="fas fa-circle-info" aria-hidden="true"></i> <span id="overviewTitle"></span></h2>
    <div id="detailBio" class="detail-bio"></div>
    <div id="detailDescription" class="detail-description"></div> <!-- raw description HTML -->
  </section>

  <section id="detailScreens" class="detail-section">
    <h2><i class="fas fa-images" aria-hidden="true"></i> <span id="screensTitle"></span></h2>
    <div id="detailGallery" class="detail-gallery"></div>
  </section>

  <section id="detailVideoSection" class="detail-section">
    <h2><i class="fas fa-circle-play" aria-hidden="true"></i> <span id="videoTitle"></span></h2>
    <div id="detailVideo" class="detail-video"></div>
  </section>
</article>

<div id="projectNotFound" class="project-notfound" hidden>
  <h1 id="notFoundTitle"></h1>
  <p id="notFoundBody"></p>
  <a class="btn btn-primary" href="index.html#projects"><span id="notFoundBack"></span></a>
</div>
```

Sections whose data is empty (`screenshots: []`, `video: ""`) must be **hidden via JS**
(set `section.hidden = true`) rather than rendered empty — except show a small
"Coming soon" chip if you want to signal future content (owner preference: hide when empty).

---

## 5. `assets/js/main.js` — rendering logic

All additions go **inside the existing IIFE**, reusing existing helpers (`$`, `escapeHtml`,
`getDict`, `state`, theme/lang init). Do **not** duplicate theme/lang/scroll/particles
logic — those `init*` functions are page‑agnostic and already run on `DOMContentLoaded`.

### 5a. URL helpers
```js
const getQueryParam = (key) => new URLSearchParams(window.location.search).get(key);
```

### 5b. `renderProjectDetail()`
- Run only when `page === "project"`.
- `const id = getQueryParam("id");`
- `const from = getQueryParam("from") === "se" ? "se.html" : "index.html";`
- Set `#detailBackLink` href to `${from}#projects` and `#projectNotFound` back link too.
- `const project = data.projects.find((p) => (p.slug || p.id) === id);`
- If not found → reveal `#projectNotFound`, hide `#projectDetail`, set its i18n text, `return`.
- Else populate (all via existing helpers, `escapeHtml` everywhere except description/bio HTML):
  - `document.title = \`${project.name} — Mohamad Adib Tawil\`;` and update meta description.
  - `#detailIcon` src = `project.image.src`, alt = `project.image.alt[lang]`.
  - `#detailName` text = `project.name`.
  - `#detailTech` = `project.tech.map(t => \`<li class="tech-badge">${escapeHtml(t)}</li>\`)`.
  - `#detailBio` innerHTML = `project.bio?.[lang] || project.bio?.en || ""` (bio is owner‑authored, trusted; keep simple — if you want to be strict, treat as text via `escapeHtml`). Hide overview's bio block if empty.
  - `#detailDescription` innerHTML = `project.description[lang]` (raw, like `renderProjects`).
  - **Actions** (`#detailActions`): build one button per non‑empty `links.*`, in order:
    Direct Download (primary, `btn btn-primary`, `<i class="fas fa-download">`),
    then Google Play (`fab fa-google-play`), App Store (`fab fa-apple`),
    GitHub (`fab fa-github`), Website (`fas fa-globe`) — all `btn btn-secondary`,
    external ones `target="_blank" rel="noopener noreferrer"`.
    Direct download to a local APK should also carry the `download` attribute.
  - **Gallery** (`#detailGallery`): if `media.screenshots.length` → render each as a
    lazy `<img>` (`loading="lazy" decoding="async"`, alt per language) inside a button
    that opens a lightbox; else hide `#detailScreens`.
  - **Video** (`#detailVideoSection`): if `media.video` →
    `<video controls preload="none" poster="${media.poster || project.image.src}">
       <source src="${media.video}" type="video/mp4"></video>`; else hide the section.
  - Reveal `#projectDetail` (`hidden = false`).

### 5c. Lightbox (optional but recommended for the quality bar)
A minimal, dependency‑free overlay: click a screenshot → full‑size image in a fixed
overlay with a close button, `Esc` to close, focus trap, `role="dialog"
aria-modal="true"`. Respect `prefers-reduced-motion` (no transition when set).
Reuse the snackbar‑host creation pattern (build the node once, append to `body`).

### 5d. Wire titles + re‑render on language change
- In `renderProjectDetail`, set the section title spans from `dict.detailPage`.
- The existing `applyLanguage(lang)` calls a chain of `render*` functions. Add a guarded
  call: `if (page === "project") renderProjectDetail();` at the end of `applyLanguage`
  (or inside `renderContentSections` behind a `page === "project"` check) so switching
  EN/AR re‑renders the detail page in the new language **and** flips `dir="rtl"`.
- Call `renderProjectDetail()` once on `DOMContentLoaded` (it's invoked through
  `initLanguage → applyLanguage`, so no separate call is strictly needed — verify the
  order: `initLanguage()` runs in the `DOMContentLoaded` block; ensure the detail render
  happens after data + dict are ready).

### 5e. Make project cards clickable (in `renderProjects`, affects index.html + se.html)
Currently each project row is a static `<tr>`. Add a navigation affordance without
breaking the existing card markup or the in‑description links:
- Determine `from` from the page: `const fromParam = page === "home" && body... ` —
  simplest: detect via `window.CV_VERSION === 'se'` (se.html sets it) → `from=se`, else nothing.
- Add a **"View details"** link as the last element of each card's `.project-description`:
  ```js
  `<a class="project-details-link" href="project.html?id=${encodeURIComponent(project.slug || project.id)}${fromParam}">
     ${escapeHtml(dict.detailPage?.overview || "View details")} <i class="fas fa-arrow-right" aria-hidden="true"></i>
   </a>`
  ```
  (Use a clear label like "View details"/"التفاصيل" — consider adding a `viewDetails`
  key to the i18n nav/detailPage block instead of reusing `overview`.)
- **Do not** make the whole `<tr>` a nested anchor (the description already contains
  `<a>` store links — nested anchors are invalid HTML). A dedicated details link is correct.
- Keep `tabindex`/keyboard accessibility: it's a real `<a>`, so it works for free.

---

## 6. `assets/css/styles.css` — append a "Project detail page" section

Add at the end of the file (after existing project styles), all using tokens:

- `.detail-back` — pill back link (reuse `--tint-weak`, `--radius-pill`, hover lift).
- `.project-detail` + `.detail-hero` — flex row: app icon + title/tech/actions;
  wraps to column under the 768 breakpoint.
- `.detail-icon` — `var(--radius-md)`, `var(--shadow)`, `1px solid var(--border-color)`.
- `.detail-tech` — flex‑wrap list reusing `.tech-badge` look.
- `.detail-actions` — flex‑wrap button row; primary = filled accent gradient
  (`var(--accent-gradient)` exists on `home-redesign`), secondary = outline.
- `.detail-section` — card surface (`var(--card-bg)`, `var(--border-color)`,
  `var(--radius-md)`, `var(--space-5)` padding), fade‑in reuse `.fade-in`.
- `.detail-gallery` — responsive grid:
  `grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: var(--space-3);`
  Each screenshot button: rounded, `object-fit: cover`, hover lift + accent border.
  Phone screenshots are tall — use `aspect-ratio: 9/19.5` on the thumb for consistency,
  full image shown in lightbox.
- `.detail-video video` — `width:100%; border-radius: var(--radius-md);`
- `.lightbox` — fixed, `inset:0`, dark scrim (`rgba(0,0,0,.85)`), centered `img`
  (`max-width:92vw; max-height:90vh`), close button top‑right; `z-index` above snackbar.
- `.project-notfound` — centered empty state.
- `.project-details-link` — inline link with arrow, accent color, hover underline/slide.
- **RTL block:** `html[dir="rtl"] .detail-back i`, `.project-details-link i` flip with
  `transform: scaleX(-1)` or swap arrow direction; mirror paddings.
- **Reduced motion:** ensure transitions are covered by the existing global
  `@media (prefers-reduced-motion: reduce)` rule (it uses `*`), so no extra work unless
  you add JS‑driven animation.

`home.css` (optional): if you want the detail page hero to use the signature gradient
heading exactly like the home h1, scope a small rule to
`body.home-redesign[data-page="project"]`. Keep it minimal — most styling belongs in
`styles.css` so the page also looks correct if `home.css` is ever dropped.

> **Cache‑busting:** bump the `?v=` query on every edited asset link across
> `index.html`, `se.html`, and the new `project.html` (the repo already versions assets
> this way, e.g. `styles.css?v=20260120-2244`). Use a new timestamp.

---

## 7. Accessibility & SEO checklist (must pass)

- [ ] One `<h1>` per detail page (`#detailName`); sections use `<h2>`.
- [ ] App icon `<img>` has a meaningful `alt` (per language).
- [ ] Gallery images lazy‑loaded, alt text per language; decorative icons `aria-hidden`.
- [ ] Lightbox: `role="dialog" aria-modal="true"`, focus moves in on open and restores
      on close, `Esc` closes, background not scrollable while open.
- [ ] External links: `target="_blank" rel="noopener noreferrer"`.
- [ ] `document.title` + meta description updated per project (SEO + share previews).
- [ ] Optional: inject `SoftwareApplication` JSON‑LD per project (mirror the ItemList
      already in `index.html`) for richer search results.
- [ ] RTL verified for Arabic; `dir="rtl"` flips layout and arrows.
- [ ] Keyboard: details link, back link, buttons, gallery items, lightbox all reachable
      and operable; visible `:focus-visible` outlines preserved.

---

## 8. Verification (no build system — open files directly / static server)

1. Serve locally: `python3 -m http.server 8080` (from repo root) and open
   `http://localhost:8080/index.html`.
2. From `index.html` → Projects → click **View details** on each card → lands on
   `project.html?id=<slug>` with correct name, tech, bio, description, action buttons.
3. Repeat from `se.html` → details link carries `&from=se` → Back returns to `se.html#projects`.
4. Empty media: confirm Screenshots/Video sections are **hidden** (no empty boxes) until
   files exist. Drop a test `screenshot-01.png` + `demo.mp4` into one project's folders,
   add their entries to that project's `media` in `cv-data.js`, reload → gallery + video
   appear; lightbox opens/closes.
5. Toggle **theme presets** + **dark/light** + **EN/AR** on `project.html` → colors,
   typography, and RTL all update live, matching the home pages.
6. Invalid id (`project.html?id=nope`) → "Project not found" state + working back link.
7. Lighthouse / manual a11y pass: headings, contrast, focus order, reduced motion.
8. Confirm `renderProjects` on both home pages is unchanged except the added details link
   (existing thumbnails + in‑description store links still work).

---

## 9. Documentation updates (same PR)

- `AI_RULES.md`: amend **Hard Rule #3** (additive project keys allowed) and add a
  **Folder Rules** row for `assets/projects/<slug>/{screenshots,video}/`.
- `FILE_INDEX.md` / `ARCHITECTURE.md` / `SOURCE_TRUTH_MAP.md`: add `project.html`,
  the new JS function `renderProjectDetail`, and the extended project schema.
- Add a short "How to add a project's screenshots & video" note (file naming +
  the two `cv-data.js` lines to edit) so the owner can self‑serve later.
- Update the auto‑memory: edit `memory/cv-signature-redesign.md` (or add a new memory)
  noting the detail‑page system shipped and the `assets/projects/` convention.

---

## 10. Suggested execution order (for Sonnet)

1. `cv-data.js`: fix `iklk`→`lklk`; add `slug`/`bio`/`links`/`media` to all 5 projects
   (prefill known store URLs, leave media empty); add `detailPage` i18n to en + ar.
2. Create `assets/projects/<slug>/{screenshots,video}/.gitkeep` (§2 script).
3. `project.html`: build from the `index.html` skeleton (§4).
4. `main.js`: add `getQueryParam`, `renderProjectDetail`, lightbox, language re‑render
   hook, and the details link in `renderProjects` (§5). Stay inside the IIFE.
5. `styles.css`: append the detail‑page section (§6); bump `?v=` everywhere.
6. (Optional) `home.css` signature tweak for the detail hero.
7. Docs + memory updates (§9).
8. Verify everything in §8.

**Definition of done:** Clicking any project on either CV opens a polished, theme‑aware,
bilingual detail page; sections gracefully hide until the owner drops screenshots/video
into `assets/projects/<slug>/…` and adds the matching `media` entries; nothing on the
existing home pages regresses; docs and memory reflect the new system.
```