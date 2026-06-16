# Instructions for AI Agents Working on This Repository

You are an AI agent tasked with modifying or understanding the **Mohamad Adib Tawil Online CV** repository. Follow these steps strictly.

---

## Step 1: Read CLAUDE_CONTEXT.md

**File**: `CLAUDE_CONTEXT.md`

This is a highly compressed summary (~1500 words) of the entire project. Reading it first gives you the full mental model in the fewest tokens.

**What you will learn**: Project nature, critical files, architecture, rules summary, theme system, responsive behavior, safe zones, workflows, known issues.

---

## Step 2: Read AI_RULES.md

**File**: `AI_RULES.md`

This contains strict development rules inferred from the codebase. Read this before making ANY changes.

**What you will learn**: Naming conventions, folder structure rules, component patterns, styling rules, state management rules, performance requirements, security requirements, accessibility requirements, and a list of things you MUST NOT do.

---

## Step 3: Read FILE_INDEX.md

**File**: `FILE_INDEX.md`

This indexes every important file with its responsibility, dependencies, importance level (CRITICAL / HIGH / MEDIUM / LOW), and whether it is safe to modify.

**What you will learn**: Which files are safe to edit freely and which require deep analysis before touching.

---

## Step 4: Read Only Files Related to Your Task

Do NOT scan the entire repository. Use the file index to identify exactly which files you need.

| Task | Files to Read/Modify |
|------|---------------------|
| Change CV content | `assets/js/cv-data.js` (bilingual translations + SE overrides) |
| Change how content renders | `assets/js/main.js` (render functions) |
| Change visual appearance | `assets/css/styles.css` |
| Change page structure | `index.html` and/or `se.html` |
| Add new theme | `styles.css` + `main.js` (THEME_CLASSES + applyPreset) |
| Add new section | `cv-data.js` + HTML file(s) + `main.js` (render function) |
| Fix export | `main.js` (buildWordHtml, buildAtsHtml, downloadBlob) |
| Fix download links | `main.js` (initDownloadGuard) + `cv-data.js` (downloads paths) |
| Generate PDF/DOCX | `scripts/generate_cv.js` (standalone Node tool) |

---

## Step 5: Avoid Repository-Wide Scans Unless Necessary

This project is small (~8 source files, ~3000 total lines). You do NOT need to scan every file. The documents you have already read (`CLAUDE_CONTEXT.md`, `AI_RULES.md`, `FILE_INDEX.md`) give you 90% of the context you need.

Only read additional files if:
- You need the exact content of a specific function or variable
- You need to verify an assumption about current behavior
- You are making a structural change that touches multiple files

---

## Step 6: Preserve the Existing Architecture

This project uses:
- **No frameworks** (no React, Vue, Angular, Tailwind, Bootstrap)
- **No build system** (no webpack, vite, gulp, npm scripts for frontend)
- **No module bundler** (no import/export — uses IIFE + global object pattern)
- **No backend** (pure static site)
- **No test framework** (no Jest, Vitest, etc.)

Do NOT introduce any of these unless explicitly asked.

---

## Step 7: Follow Existing Conventions

| Convention | Rule |
|-----------|------|
| JS variables | `camelCase` |
| CSS classes/IDs | `kebab-case` |
| File names | `snake_case` |
| HTML element IDs | `camelCase` |
| CSS variables | `--kebab-case` |
| JS functions | `camelCase` with verb-prefix (render*, init*, apply*, update*) |
| Data structure | All content in `CV_DATA` object, bilingual via `translations.{en, ar}` |
| Rendering | Data-driven, functions accept `dict` parameter |
| Security | `escapeHtml()` before every `innerHTML` assignment |
| Persistence | `localStorage` only (keys: theme, themePreset, lang) |

---

## Quick Reference

```bash
# Preview locally (uses npx serve on port 4200)
npx serve -p 4200 .

# Generate DOCX/PDF
node scripts/generate_cv.js
```
