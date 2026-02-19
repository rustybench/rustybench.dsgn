# Rustybench Portfolio — Rebuild Design
Date: 2026-02-19

## Problem / Need
Rebuild the working `portfolio.html` reference into a proper Next.js 14 project with clean, maintainable component architecture while preserving the dark luxury aesthetic and all interactive features exactly.

## Intended Outcome
A running Next.js 14 app (pages router) at `foliodear/` that matches `portfolio.html` visually and behaviorally — 3D card flip/tilt, golden cursor trail, staggered entrance, grain texture, responsive layout.

---

## Architecture

**Framework:** Next.js 14, pages router, JavaScript (no TypeScript), no Tailwind, no ESLint
**Package manager:** npm
**Extra dependencies:** none beyond create-next-app defaults

### Directory Structure

```
foliodear/
├── components/
│   ├── Navbar.jsx       — fixed 44px top bar
│   ├── Sidebar.jsx      — fixed 108px left column
│   ├── Card.jsx         — 3D flip/tilt card
│   └── CursorTrail.jsx  — canvas particle trail
├── data/
│   └── pieces.js        — 15 artwork entries
├── pages/
│   ├── _app.jsx         — CursorTrail mount point
│   ├── _document.jsx    — Google Fonts link tags
│   └── index.jsx        — masonry grid + staggered entrance
├── public/
│   └── images/          — 15 extracted artwork files
└── styles/
    └── globals.css      — tokens, fonts, grain overlay, scrollbar
```

---

## Components

### Navbar
- Fixed, `z-index: 997`, `height: 44px`
- Left 108px corner block: "Rustybench" auto-fit via `useEffect` resize loop
- Center: Work / About / Contact links, gold active underline
- Right: Instagram SVG, Behance SVG, © 2026

### Sidebar
- Fixed, `left: 0`, `top: 44px`, `width: 108px`, full remaining height
- Gold vertical accent line via `::before` at `left: 6px`
- Dim italic "scroll" text, `transform: rotate(-90deg)`, centered vertically

### Card
- Props: `title`, `file`
- Front: `next/image`, subtle "flip" hint on hover
- Back: same image blurred + darkened, "future mock-up" centered
- `useRef` on `.item` element; `useEffect` implements lerp tilt (±10°) + click-to-flip (0.75s cubic-bezier)
- `transformStyle: preserve-3d`, `backfaceVisibility: hidden` on both faces

### CursorTrail
- Canvas mounted to `document.body` via `useEffect` in `_app.jsx`
- 22-point golden (`rgba(184,150,90,…)`) particle trail
- `mix-blend-mode: screen`, `pointer-events: none`, `z-index: 998`
- Cleanup: remove canvas + cancel RAF on unmount

### index.jsx (Grid)
- Import `pieces` from `data/pieces.js`, split into 3 column arrays
- 3-column masonry: `display: grid`, `grid-template-columns: repeat(3, 1fr)`, `gap: 7px`
- Staggered entrance: column offset `ci * 0.03s` + item offset `ni * 0.07s` via `setTimeout` in `useEffect`
- After entrance settles (500ms): strip transition so flip/tilt are unaffected

---

## CSS Design Tokens

```css
--bg: #0e0c0a;  --bg2: #111009;
--gold: #b8965a;  --gold-dim: rgba(184,150,90,0.28);
--text: #d4c5a9;  --text-dim: rgba(212,197,169,0.38);
--nav-h: 44px;  --side-w: 108px;  --gap: 7px;
```

Grain: `body::before` SVG fractalNoise at 55% opacity
Scrollbar: thin, dark track, gold thumb
Google Fonts: Playfair Display, IM Fell English, Libre Baskerville (via `_document.jsx`)

---

## Image Handling
Extract all 15 base64-encoded images from `portfolio.html` using a Node script → save as proper files to `public/images/` with their original filenames (e.g., `Crippled.webp`, `Hekate.webp`, etc.).

---

## Responsive Breakpoints
- `< 900px` → 2-column grid
- `< 640px` → 1-column grid, sidebar hidden

---

## Build Sequence
1. Scaffold: `npx create-next-app@14 . --no-typescript --no-tailwind --no-eslint --use-npm`
2. Extract 15 images from portfolio.html → `public/images/`
3. `globals.css` — tokens, fonts, grain, scrollbar, base resets
4. `_document.jsx` — Google Fonts links
5. `Navbar.jsx` — layout + auto-fit useEffect
6. `Sidebar.jsx` — fixed column + gold accent
7. `Card.jsx` — tilt + flip via useRef/useEffect
8. `index.jsx` — masonry grid + data + staggered entrance
9. `CursorTrail.jsx` + mount in `_app.jsx`
10. Polish: responsive breakpoints, verify all tokens, scrollbar

---

## Verification
1. `npm run dev` → open localhost:3000
2. Visual comparison against `portfolio.html` in split view
3. Click each card → verify flip animation
4. Hover cards → verify tilt (±10°)
5. Move mouse → verify golden cursor trail
6. Resize to 900px → verify 2-column reflow
7. Resize to 640px → verify 1-column + sidebar hidden
