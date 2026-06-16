# UI Guidelines — Extracted from Codebase

## Colors

### CSS Variable System
All colors are defined as CSS custom properties in `:root` and overridden by theme classes.

| Variable | Purpose | Default Value |
|----------|---------|--------------|
| `--primary-color` | Main brand color, links, headings | `#0066cc` |
| `--secondary-color` | Secondary text, muted accents | `#004d99` |
| `--accent-color` | Highlights, hover states, decorations | `#28a745` |
| `--light-bg` | Page background | `#f9f9f9` |
| `--dark-text` | Primary text color | `#333` |
| `--light-text` | Secondary/muted text | `#666` |
| `--border-color` | Dividers, table borders | `#e0e0e0` |
| `--card-bg` | Card surfaces | `#ffffff` |
| `--shadow` | Card shadows | `0 8px 20px rgba(0,0,0,0.08)` |
| `--glass-bg` | Glassmorphism backgrounds | `rgba(255, 255, 255, 0.55)` |
| `--glass-border` | Glass borders | `rgba(255, 255, 255, 0.35)` |
| `--tint-weak` | Subtle tinted backgrounds | `rgba(0,102,204,0.08)` |
| `--tint-strong` | Stronger tinted backgrounds | `rgba(0,102,204,0.12)` |

### Dark Mode Overrides
Applied via `.dark-mode` class on `<html>`:

| Variable | Dark Value |
|----------|-----------|
| `--light-bg` | `#121212` |
| `--dark-text` | `#e0e0e0` |
| `--light-text` | `#a0a0a0` |
| `--border-color` | `#333333` |
| `--card-bg` | `#1e1e1e` |
| `--shadow` | `0 8px 20px rgba(0,0,0,0.3)` |
| `--glass-bg` | `rgba(30, 30, 30, 0.55)` |
| `--glass-border` | `rgba(255, 255, 255, 0.08)` |

### Theme Presets

| Theme | Primary | Secondary | Accent |
|-------|---------|-----------|--------|
| **Blue** (default) | `#2563eb` | `#93c5fd` | `#06b6d4` |
| **Purple** | `#7c3aed` | `#c4b5fd` | `#d946ef` |
| **Teal** | `#0d9488` | `#5eead4` | `#22d3ee` |
| **Slate** | `#334155` | `#94a3b8` | `#0ea5e9` |
| **RoyalGold** | `#d4af37` | `#374151` | `#b8860b` |
| **Silver** | `#6b7280` | `#cbd5e1` | `#d1d5db` |
| **Midnight** | `#60a5fa` | `#a78bfa` | `#22d3ee` |

**Note**: CSS also defines `theme-navy` and `theme-emerald` but JS normalizes them to `royal` and `silver` respectively (`main.js:171-181`).

## Typography

### Font Families
| Usage | Font Stack |
|-------|-----------|
| Body (English) | `'Inter', 'Poppins', 'Roboto', sans-serif` |
| Body (Arabic) | `'Tajawal', 'Poppins', Arial, sans-serif` |

### Font Sizes (Fluid via `clamp()`)
| Element | Size |
|---------|------|
| h1 | `clamp(1.8rem, 1.2rem + 2vw, 2.4rem)` |
| h2 | `clamp(1.2rem, 1rem + 1vw, 1.6rem)` |
| h3 | `clamp(1rem, 0.95rem + 0.5vw, 1.2rem)` |
| .title | `clamp(1rem, 0.9rem + 0.5vw, 1.25rem)` |
| body/paragraph | `0.95em` |
| List items | `0.95em` |

### Font Weights
| Usage | Weight |
|-------|--------|
| h1 | 700 |
| h2 | 700 (implicit via browser default) |
| h3 | 700 (implicit) |
| Navigation items | 500 |
| Buttons | 500 |
| Stats numbers | 700 |

## Layout System

### Container
- Max width: `1100px` (desktop), `width: min(1100px, calc(100% - 32px))`
- Centered via `margin: clamp(12px, 2vw, 20px) auto`
- Glassmorphism effect: `backdrop-filter: saturate(160%) blur(12px)`
- Border radius: `20px`
- Top gradient bar: `height: 5px`, `linear-gradient(90deg, var(--primary-color), var(--accent-color))`

### Navigation
- **Sticky top**: `position: sticky; top: 12px; z-index: 50`
- **Glass effect**: `background: var(--glass-bg); backdrop-filter: blur(8px)`
- Flexbox layout with `justify-content: space-between`
- Mobile: columns at 768px, nav-links hidden, controls in 2-column grid

### Stats Section
- CSS Grid: `grid-template-columns: repeat(auto-fit, minmax(200px, 1fr))`
- Collapses to 2 columns at 1024px, 1 column at 768px

### Footer
- CSS Grid: `grid-template-columns: repeat(auto-fit, minmax(200px, 1fr))`
- Three sections: Quick Links, Connect, Info

## Design Patterns

### Glassmorphism
- Semi-transparent backgrounds (`rgba(...)` with .55 opacity)
- `backdrop-filter: blur(12px)` or `blur(8px)`
- Border with semi-transparent color (`1px solid var(--glass-border)`)
- Used on: `.container`, `.top-nav`, `section`, `.footer`

### Gradient Effects
- **Text**: `.gradient-text` uses `-webkit-background-clip: text` with `linear-gradient(135deg, var(--primary-color), var(--accent-color))`
- **Buttons**: `.btn` uses `linear-gradient(90deg, var(--primary-color), var(--accent-color))`
- **Section top bar**: `.container::before` with 90deg gradient
- **Stats numbers**: Same gradient text technique

### Animated Background Blobs
- `body::before` and `body::after` create blurred radial gradients
- 30s animation cycle with `translate()` and `scale()`
- Reduced intensity on mobile (`opacity: 0.25`, `filter: blur(30px)`)

### Hover Micro-interactions
| Element | Interaction |
|---------|------------|
| Profile pic | `scale(1.05)` + deeper shadow |
| Sections | `translateY(-4px)` + enhanced shadow + perspective rotation |
| List items | `translateX(5px)` + bullet `scale(1.3)` |
| Buttons | `translateY(-3px)` + gradient direction swap via `::before` |
| Social icons | `translateY(-5px) rotate(10deg)` |
| Project rows | Perspective `rotateX(1deg)` with arrow icon reveal |
| Stat cards | `translateY(-8px)` + perspective rotation |

## Responsive Behavior

| Breakpoint | Key Changes |
|------------|-------------|
| **>1200px** | Container max 1100px |
| **≤1024px** | Nav-links full width, stats 2 columns |
| **≤900px** | Project table becomes card layout (thead hidden, tbody grid) |
| **≤768px** | Header centers (flex column), nav-links hidden, controls 2-col grid, stats 1 column, CTA buttons flex-basis 50% |
| **≤480px** | Smaller fonts, thinner shadows, particle opacity reduced, floating animation gentler, CTA buttons full width |
| **≤360px** | Contact grid 2 columns, smaller link font |

## Reusable UI Blocks

| Block | CSS Class | Used In |
|-------|-----------|---------|
| **Primary Button** | `.btn .btn-primary` | CTA section, download page |
| **Secondary Button** | `.btn .btn-secondary` | CTA section |
| **Contact Chip** | `.contact-item` | Header |
| **Stat Card** | `.stat-card` | Stats section |
| **Tech Badge** | `.tech-badge` | Project table |
| **Glass Section** | `section` (styled via element selector) | All content sections |
| **Toggle Button** | `.theme-toggle` | Fixed dark mode toggle |
| **Scroll to Top** | `.scroll-to-top` | Fixed bottom-right |
| **Skill/List Card** | `.skill-list li`, `.achievement-list li`, etc. | Various lists |
| **Project Table** | `.project-table` | Projects section |
| **Navigation Items** | `.top-nav a` | Main navigation |
| **CV Switch Tabs** | `.cv-tab` + `.cv-tab.active` | CV version switcher |
| **Experience Entry** | `.exp-entry` + `.exp-entry-header` + `.exp-entry-meta` | SE experience timeline |
| **Availability Badge** | `.availability-badge` | Header |
| **Employment Badge** | `.employment-badge` | Footer |
