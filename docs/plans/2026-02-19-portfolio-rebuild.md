# Rustybench Portfolio — Next.js Rebuild Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rebuild `portfolio.html` as a clean Next.js 14 (pages router) project with modular components, preserving every visual and interactive detail.

**Architecture:** Spec-driven from `handoff.md`; `portfolio.html` is a visual reference only. Global CSS classes (no CSS Modules) to stay faithful to the reference. Images extracted via Node script from the base64-embedded HTML.

**Tech Stack:** Next.js 14, React 18, plain JavaScript, global CSS, Google Fonts via `_document.jsx`

---

## Task 1: Scaffold Next.js 14

**Files:**
- Create: entire Next.js project in `/Users/rustybench/DsgnSprint/foliodear/`

**Step 1: Scaffold**

```bash
cd /Users/rustybench/DsgnSprint/foliodear
npx create-next-app@14 . --js --no-tailwind --no-eslint --use-npm --no-app --no-src-dir --import-alias "@/*"
```

When prompted "Ok to proceed?", press **y**. When asked about the directory not being empty, answer **yes** to continue. For "Would you like to use TypeScript?" → **No**. For "Would you like to use ESLint?" → **No**. For "Would you like to use Tailwind CSS?" → **No**. For "Would you like your code inside a `src/` directory?" → **No**. For "Would you like to use App Router?" → **No**.

**Step 2: Verify**

```bash
npm run dev
```
Expected: Next.js dev server running on http://localhost:3000 with the default page.

**Step 3: Clean up default files**

Delete the boilerplate content that was auto-generated — we'll replace `pages/index.js`, `styles/globals.css`, and `pages/_app.js` entirely in later tasks. Also remove `styles/Home.module.css` and `public/vercel.svg` and `public/next.svg` if they exist:

```bash
rm -f styles/Home.module.css public/vercel.svg public/next.svg
```

**Step 4: Create required directories**

```bash
mkdir -p components data public/images
```

**Step 5: Commit**

```bash
git init
git add -A
git commit -m "chore: scaffold Next.js 14 pages router project"
```

---

## Task 2: Extract Images from portfolio.html

**Files:**
- Create: `scripts/extract-images.mjs` (temp script, delete after use)
- Populate: `public/images/` with 15 image files

**Step 1: Write the extraction script**

Create `scripts/extract-images.mjs`:

```js
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const html = readFileSync(join(root, 'portfolio.html'), 'utf8');
mkdirSync(join(root, 'public/images'), { recursive: true });

// Each card has 2 images (front + back-blur, same source).
// Extract all base64 data URIs in document order.
const regex = /src="data:image\/([^;]+);base64,([A-Za-z0-9+/=\r\n]+?)"/g;
const all = [];
let m;
while ((m = regex.exec(html)) !== null) {
  all.push({ ext: m[1], data: m[2].replace(/\s/g, '') });
}

// Take every other image (index 0, 2, 4 … = the card-front images)
const fronts = all.filter((_, i) => i % 2 === 0);

const filenames = [
  'Crippled.webp', 'Hekate.webp', 'KikagakuFramed.webp', 'SuspendedJPG.webp', 'tmtShirt.jpg',
  'EverCosmic.webp', 'IMG_0668.webp', 'LetitBe.webp', 'Threads.webp', 'KeepGrading.jpg',
  'Floater.webp', 'IMG_1039.webp', 'Primo.webp', 'tmtNewsprint.webp', 'AA.png',
];

fronts.forEach(({ data }, i) => {
  const name = filenames[i];
  if (!name) return;
  const buf = Buffer.from(data, 'base64');
  writeFileSync(join(root, 'public/images', name), buf);
  console.log(`✓ ${name} (${(buf.length / 1024).toFixed(0)} KB)`);
});
console.log(`Done — ${fronts.length} images extracted.`);
```

**Step 2: Run it**

```bash
node scripts/extract-images.mjs
```

Expected output: 15 lines like `✓ Crippled.webp (42 KB)`, then `Done — 15 images extracted.`

**Step 3: Verify**

```bash
ls public/images/
```
Expected: 15 files matching the handoff table.

**Step 4: Commit**

```bash
git add public/images/ scripts/extract-images.mjs
git commit -m "feat: extract artwork images from portfolio.html reference"
```

---

## Task 3: globals.css — Tokens, Fonts, Grain, Scrollbar

**Files:**
- Modify: `styles/globals.css`

**Step 1: Replace globals.css entirely**

```css
/* ── FONTS & RESETS ── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg:           #0e0c0a;
  --bg2:          #111009;
  --border:       rgba(180, 150, 100, 0.1);
  --border-strong:rgba(180, 150, 100, 0.2);
  --gold:         #b8965a;
  --gold-dim:     rgba(184, 150, 90, 0.28);
  --text:         #d4c5a9;
  --text-dim:     rgba(212, 197, 169, 0.38);
  --text-muted:   rgba(212, 197, 169, 0.18);
  --nav-h:        44px;
  --side-w:       108px;
  --gap:          7px;
}

html, body {
  height: 100%;
  background: var(--bg);
  color: var(--text);
  font-family: 'Libre Baskerville', serif;
  overflow: hidden;
}

/* ── GRAIN TEXTURE ── */
body::before {
  content: '';
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 999;
  opacity: 0.55;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.045'/%3E%3C/svg%3E");
}

/* ── SCROLLBAR ── */
::-webkit-scrollbar { width: 3px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }
* { scrollbar-width: thin; scrollbar-color: var(--border) transparent; }

/* ── NAVBAR ── */
.navbar {
  position: fixed; top: 0; left: 0; right: 0;
  height: var(--nav-h);
  background: var(--bg2);
  border-bottom: 1px solid var(--border-strong);
  display: flex; align-items: stretch;
  z-index: 100;
}
.navbar-corner {
  width: var(--side-w); min-width: var(--side-w);
  border-right: 1px solid var(--border-strong);
  display: flex; align-items: center; justify-content: center;
  padding: 0 8px; position: relative; flex-shrink: 0;
}
.navbar-corner::before {
  content: ''; position: absolute; top: 0; bottom: 0; left: 6px;
  width: 1px;
  background: linear-gradient(to bottom, transparent, var(--gold-dim), transparent);
  pointer-events: none;
}
.navbar-name {
  font-family: 'Playfair Display', serif;
  font-weight: 900; font-style: italic;
  color: var(--text); letter-spacing: -0.03em; line-height: 1;
  width: 100%; text-align: center; font-size: 11.5px;
  white-space: nowrap; overflow: hidden;
}
.navbar-links {
  flex: 1; display: flex; align-items: stretch; padding: 0 4px;
}
.navbar-links a {
  text-decoration: none; color: var(--text-muted);
  font-family: 'IM Fell English', serif; font-style: italic;
  font-size: 11px; letter-spacing: 0.06em;
  padding: 0 16px; display: flex; align-items: center;
  border-right: 1px solid var(--border);
  transition: color 0.2s, background 0.2s;
  position: relative;
}
.navbar-links a:first-child { border-left: 1px solid var(--border); }
.navbar-links a:hover { color: var(--text); background: rgba(184, 150, 90, 0.04); }
.navbar-links a.active { color: var(--gold); }
.navbar-links a.active::after {
  content: ''; position: absolute; bottom: 0; left: 16px; right: 16px;
  height: 1px; background: var(--gold); opacity: 0.5;
}
.navbar-right {
  display: flex; align-items: center;
  border-left: 1px solid var(--border); margin-left: auto;
}
.navbar-right a {
  text-decoration: none; color: var(--text-muted);
  padding: 0 16px; height: 100%; display: flex; align-items: center;
  border-right: 1px solid var(--border); transition: color 0.2s;
}
.navbar-right a:hover { color: var(--gold); }
.navbar-right a svg { display: block; }
.navbar-copy {
  font-size: 8px; color: var(--text-muted);
  letter-spacing: 0.1em; font-style: italic; padding: 0 14px; opacity: 0.5;
}

/* ── LAYOUT ── */
.layout {
  display: flex; height: 100vh; width: 100vw; padding-top: var(--nav-h);
}

/* ── SIDEBAR ── */
.sidebar {
  width: var(--side-w); min-width: var(--side-w);
  height: calc(100vh - var(--nav-h));
  display: flex; flex-direction: column;
  border-right: 1px solid var(--border-strong);
  background: var(--bg2);
  position: relative; overflow: hidden; flex-shrink: 0;
}
.sidebar::before {
  content: ''; position: absolute; top: 0; bottom: 0; left: 6px;
  width: 1px;
  background: linear-gradient(to bottom, transparent, var(--gold-dim) 30%, var(--gold-dim) 70%, transparent);
  pointer-events: none;
}
.sidebar-scroll-text {
  position: absolute; bottom: 60px; left: 50%;
  transform: translateX(-50%) rotate(-90deg);
  transform-origin: center center;
  font-family: 'IM Fell English', serif; font-style: italic;
  font-size: 9px; letter-spacing: 0.35em; text-transform: lowercase;
  color: rgba(212, 197, 169, 0.12);
  white-space: nowrap; pointer-events: none; user-select: none;
}

/* ── MAIN SCROLLABLE AREA ── */
.main {
  flex: 1; height: calc(100vh - var(--nav-h));
  overflow-y: auto; padding: var(--gap);
  scrollbar-width: thin; scrollbar-color: var(--border) transparent;
}
.main::-webkit-scrollbar { width: 3px; }
.main::-webkit-scrollbar-track { background: transparent; }
.main::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }

/* ── MASONRY GRID ── */
.masonry {
  display: grid; grid-template-columns: repeat(3, 1fr);
  gap: var(--gap); align-items: start;
}
.col { display: flex; flex-direction: column; gap: var(--gap); }

/* ── CARD ── */
.item {
  position: relative; cursor: pointer;
  perspective: 1000px; border-radius: 2px;
  transform-style: preserve-3d;
  opacity: 0; translate: 0 12px;
  transition: opacity 0.45s ease, translate 0.45s ease;
}
.item.visible { opacity: 1; translate: 0 0; }

.card-front, .card-back {
  width: 100%; border-radius: 2px; overflow: hidden;
  backface-visibility: hidden; -webkit-backface-visibility: hidden;
  transition: opacity 0s;
}
.card-front { position: relative; display: block; }
.card-front img { display: block; width: 100%; height: auto; }
.card-back {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  background: #090806;
  display: flex; align-items: center; justify-content: center;
}
.back-blur {
  position: absolute; inset: 0; width: 100%; height: 100%;
  object-fit: cover;
  filter: blur(7px) brightness(0.22) saturate(0.3);
  transform: scale(1.1);
}
.future-overlay {
  position: relative; display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: 10px; z-index: 1;
}
.fo-rule { width: 28px; height: 1px; background: rgba(184, 150, 90, 0.4); }
.fo-text {
  font-family: 'IM Fell English', serif; font-style: italic;
  font-size: 12px; letter-spacing: 0.18em;
  color: rgba(212, 197, 169, 0.65);
}
.flip-hint {
  position: absolute; bottom: 8px; right: 8px;
  font-family: 'IM Fell English', serif; font-style: italic;
  font-size: 8px; letter-spacing: 0.12em;
  color: rgba(212, 197, 169, 0.55);
  opacity: 0; transition: opacity 0.25s 0.1s;
  pointer-events: none; z-index: 2;
}
.item:hover .flip-hint { opacity: 1; }
.return-hint {
  position: absolute; bottom: 8px; right: 8px;
  font-family: 'IM Fell English', serif; font-style: italic;
  font-size: 8px; letter-spacing: 0.12em;
  color: rgba(212, 197, 169, 0.4);
  opacity: 0; transition: opacity 0.25s 0.1s;
  pointer-events: none; z-index: 2;
}
.item.flipped .return-hint { opacity: 1; }
.item.flipped .flip-hint  { opacity: 0; }

/* ── RESPONSIVE ── */
@media (max-width: 900px) {
  .masonry { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 640px) {
  .masonry { grid-template-columns: 1fr; }
  .sidebar { display: none; }
}
```

**Step 2: Verify**

```bash
npm run dev
```
Open http://localhost:3000 — background should be `#0e0c0a` dark. No errors in console.

**Step 3: Commit**

```bash
git add styles/globals.css
git commit -m "feat: add CSS design tokens, grain texture, and component styles"
```

---

## Task 4: _document.jsx — Google Fonts

**Files:**
- Modify: `pages/_document.js` (rename to `.jsx` if needed, or edit in place)

**Step 1: Replace `pages/_document.js`**

```jsx
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700;1,900&family=IM+Fell+English:ital@0;1&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
```

**Step 2: Verify**

Reload http://localhost:3000 — check DevTools Network tab: Google Fonts should be loading. Text should render in serif.

**Step 3: Commit**

```bash
git add pages/_document.js
git commit -m "feat: load Google Fonts via _document"
```

---

## Task 5: Navbar Component

**Files:**
- Create: `components/Navbar.jsx`

**Step 1: Create `components/Navbar.jsx`**

```jsx
import { useEffect, useRef } from 'react';

export default function Navbar() {
  const nameRef   = useRef(null);
  const cornerRef = useRef(null);

  useEffect(() => {
    const name   = nameRef.current;
    const corner = cornerRef.current;
    if (!name || !corner) return;
    let size = 20;
    name.style.fontSize = size + 'px';
    const padding = 16;
    while (name.scrollWidth > corner.clientWidth - padding && size > 6) {
      size -= 0.25;
      name.style.fontSize = size + 'px';
    }
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-corner" ref={cornerRef}>
        <span className="navbar-name" ref={nameRef}>Rustybench</span>
      </div>

      <div className="navbar-links">
        <a href="#" className="active">Work</a>
        <a href="#">About</a>
        <a href="#">Contact</a>
      </div>

      <div className="navbar-right">
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
            <circle cx="12" cy="12" r="5"/>
            <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none"/>
          </svg>
        </a>
        <a href="https://behance.net" target="_blank" rel="noopener noreferrer" aria-label="Behance">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7.5 11.5c1.1 0 2-.9 2-2s-.9-2-2-2H4v4h3.5zm.3 2H4v4.5h3.8c1.3 0 2.2-.9 2.2-2.2 0-1.3-1-2.3-2.2-2.3zm6.2-2c-1.5 0-2.5 1-2.7 2.5h5.4c-.1-1.5-1.1-2.5-2.7-2.5zM2 4h8.5c2 0 3.5 1.3 3.5 3.2 0 1.2-.6 2.2-1.5 2.7 1.2.4 2 1.5 2 2.8 0 2.2-1.7 3.8-4 3.8H2V4zm12.5 1.5h6v1.2h-6V5.5zm1.5 5.5c2.5 0 4 1.7 4 4.2 0 .3 0 .5-.1.8h-7.8c.2 1.5 1.2 2.3 2.8 2.3.8 0 1.6-.3 2.1-.9l1.5.9c-.8 1-2 1.7-3.6 1.7-2.5 0-4.4-1.8-4.4-4.5 0-2.7 1.9-4.5 4.5-4.5z"/>
          </svg>
        </a>
        <span className="navbar-copy">© 2026</span>
      </div>
    </nav>
  );
}
```

**Step 2: Verify**

Import and render in `pages/index.js`:
```jsx
import Navbar from '../components/Navbar';
export default function Home() {
  return <Navbar />;
}
```
Open http://localhost:3000 — fixed navbar at top, "Rustybench" fitted in the corner, nav links in center, icons on right.

**Step 3: Commit**

```bash
git add components/Navbar.jsx
git commit -m "feat: add Navbar component with auto-fit name text"
```

---

## Task 6: Sidebar Component

**Files:**
- Create: `components/Sidebar.jsx`

**Step 1: Create `components/Sidebar.jsx`**

```jsx
export default function Sidebar() {
  return (
    <aside className="sidebar">
      <span className="sidebar-scroll-text">scroll</span>
    </aside>
  );
}
```

**Step 2: Verify**

Update `pages/index.js` temporarily:
```jsx
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
export default function Home() {
  return (
    <>
      <Navbar />
      <div className="layout">
        <Sidebar />
        <main className="main"><p style={{color:'white'}}>content</p></main>
      </div>
    </>
  );
}
```
Open http://localhost:3000 — fixed sidebar (108px) with gold vertical line and dim "scroll" text.

**Step 3: Commit**

```bash
git add components/Sidebar.jsx
git commit -m "feat: add Sidebar component with gold accent line"
```

---

## Task 7: Card Component

**Files:**
- Create: `components/Card.jsx`

**Step 1: Create `components/Card.jsx`**

```jsx
import { useEffect, useRef } from 'react';
import Image from 'next/image';

const TILT_MAX = 10;

export default function Card({ title, file }) {
  const itemRef  = useRef(null);
  const frontRef = useRef(null);
  const backRef  = useRef(null);

  useEffect(() => {
    const card  = itemRef.current;
    const front = frontRef.current;
    const back  = backRef.current;
    if (!card || !front || !back) return;

    let flipped  = false;
    let raf      = null;
    let cx = 0, cy = 0, tx = 0, ty = 0, hovering = false;
    const lerp = (a, b, t) => a + (b - a) * t;

    back.style.transform = 'rotateY(180deg)';
    card.style.transformStyle = 'preserve-3d';
    front.style.backfaceVisibility = 'hidden';
    back.style.backfaceVisibility  = 'hidden';

    function setTransform() {
      if (flipped) {
        card.style.transform = `perspective(1000px) rotateX(${cy.toFixed(2)}deg) rotateY(${(cx + 180).toFixed(2)}deg)`;
      } else {
        card.style.transform = `perspective(1000px) rotateX(${cy.toFixed(2)}deg) rotateY(${cx.toFixed(2)}deg)`;
      }
    }

    function tick() {
      cx = lerp(cx, tx, 0.1);
      cy = lerp(cy, ty, 0.1);
      setTransform();
      const settled = Math.abs(cx - tx) < 0.01 && Math.abs(cy - ty) < 0.01;
      if (!settled || hovering) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = null;
      }
    }

    function onEnter() {
      hovering = true;
      card.style.transition = 'transform 0s';
      if (!raf) raf = requestAnimationFrame(tick);
    }

    function onMove(e) {
      const r = card.getBoundingClientRect();
      tx =  ((e.clientX - (r.left + r.width  / 2)) / (r.width  / 2)) * TILT_MAX;
      ty = -((e.clientY - (r.top  + r.height / 2)) / (r.height / 2)) * TILT_MAX;
    }

    function onLeave() {
      hovering = false;
      tx = 0; ty = 0;
      card.style.transition = 'transform 0s';
      if (!raf) raf = requestAnimationFrame(tick);
    }

    function onClick() {
      tx = 0; ty = 0; cx = 0; cy = 0;
      hovering = false;
      if (raf) { cancelAnimationFrame(raf); raf = null; }
      flipped = !flipped;
      card.classList.toggle('flipped', flipped);
      card.style.transition = 'transform 0.75s cubic-bezier(0.4,0.2,0.2,1)';
      setTransform();
      setTimeout(() => { card.style.transition = 'transform 0s'; }, 780);
    }

    card.addEventListener('mouseenter', onEnter);
    card.addEventListener('mousemove',  onMove);
    card.addEventListener('mouseleave', onLeave);
    card.addEventListener('click',      onClick);

    return () => {
      card.removeEventListener('mouseenter', onEnter);
      card.removeEventListener('mousemove',  onMove);
      card.removeEventListener('mouseleave', onLeave);
      card.removeEventListener('click',      onClick);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const src = `/images/${file}`;

  return (
    <div className="item" ref={itemRef}>
      <div className="card-front" ref={frontRef}>
        <img src={src} alt={title} loading="lazy" />
        <span className="flip-hint">flip</span>
      </div>
      <div className="card-back" ref={backRef}>
        <img className="back-blur" src={src} alt="" aria-hidden="true" />
        <div className="future-overlay">
          <div className="fo-rule" />
          <span className="fo-text">future mock-up</span>
          <div className="fo-rule" />
        </div>
        <span className="return-hint">close</span>
      </div>
    </div>
  );
}
```

> Note: Using a plain `<img>` tag instead of `next/image` to avoid needing image dimension props, matching the reference HTML exactly.

**Step 2: Verify**

Add one card to `pages/index.js`:
```jsx
import Card from '../components/Card';
// inside the layout:
<main className="main">
  <Card title="Crippled Emotions" file="Crippled.webp" />
</main>
```
Open http://localhost:3000 — card should show image, tilt on hover, flip on click.

**Step 3: Commit**

```bash
git add components/Card.jsx
git commit -m "feat: add Card component with 3D flip and tilt interactions"
```

---

## Task 8: Data File + Index Page (Masonry Grid)

**Files:**
- Create: `data/pieces.js`
- Modify: `pages/index.js`

**Step 1: Create `data/pieces.js`**

```js
export const pieces = [
  { title: "Crippled Emotions",      file: "Crippled.webp",       col: 1 },
  { title: "Hekate",                 file: "Hekate.webp",         col: 1 },
  { title: "Kikagaku",               file: "KikagakuFramed.webp", col: 1 },
  { title: "Suspended",              file: "SuspendedJPG.webp",   col: 1 },
  { title: "Mystic Tension — Shirt", file: "tmtShirt.jpg",        col: 1 },
  { title: "Ever Cosmic",            file: "EverCosmic.webp",     col: 2 },
  { title: "Untitled I",             file: "IMG_0668.webp",       col: 2 },
  { title: "Let It Be",              file: "LetitBe.webp",        col: 2 },
  { title: "Threads",                file: "Threads.webp",        col: 2 },
  { title: "Keep Grading",           file: "KeepGrading.jpg",     col: 2 },
  { title: "Floating Head",          file: "Floater.webp",        col: 3 },
  { title: "Untitled II",            file: "IMG_1039.webp",       col: 3 },
  { title: "Primordial",             file: "Primo.webp",          col: 3 },
  { title: "The Mystic Tension",     file: "tmtNewsprint.webp",   col: 3 },
  { title: "Always Ace",             file: "AA.png",              col: 3 },
];
```

**Step 2: Replace `pages/index.js`**

```jsx
import { useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import { pieces } from '../data/pieces';

const col1 = pieces.filter(p => p.col === 1);
const col2 = pieces.filter(p => p.col === 2);
const col3 = pieces.filter(p => p.col === 3);

export default function Home() {
  const colRefs = [useRef(null), useRef(null), useRef(null)];

  useEffect(() => {
    const cols = colRefs.map(r => r.current);
    cols.forEach((col, ci) => {
      if (!col) return;
      col.querySelectorAll('.item').forEach((item, ni) => {
        const delay = ci * 0.03 + ni * 0.07;
        setTimeout(() => {
          item.classList.add('visible');
          setTimeout(() => {
            item.style.transition = 'transform 0s';
            item.style.opacity    = '1';
            item.style.translate  = '0 0';
          }, 500);
        }, delay * 1000);
      });
    });
  }, []);

  return (
    <>
      <Navbar />
      <div className="layout">
        <Sidebar />
        <main className="main">
          <div className="masonry">
            <div className="col" ref={colRefs[0]}>
              {col1.map(p => <Card key={p.file} title={p.title} file={p.file} />)}
            </div>
            <div className="col" ref={colRefs[1]}>
              {col2.map(p => <Card key={p.file} title={p.title} file={p.file} />)}
            </div>
            <div className="col" ref={colRefs[2]}>
              {col3.map(p => <Card key={p.file} title={p.title} file={p.file} />)}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
```

**Step 3: Verify**

```bash
npm run dev
```
Open http://localhost:3000 — all 15 cards should appear in 3 columns with staggered fade-in entrance. Cards tilt and flip correctly.

**Step 4: Commit**

```bash
git add data/pieces.js pages/index.js
git commit -m "feat: add masonry grid with all 15 artworks and staggered entrance"
```

---

## Task 9: CursorTrail Component

**Files:**
- Create: `components/CursorTrail.jsx`
- Modify: `pages/_app.js`

**Step 1: Create `components/CursorTrail.jsx`**

```jsx
import { useEffect } from 'react';

const TRAIL_COUNT = 22;

export default function CursorTrail() {
  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:998;mix-blend-mode:screen;';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    function resize() {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const mouse = { x: -999, y: -999 };
    const trail = Array.from({ length: TRAIL_COUNT }, () => ({ x: -999, y: -999 }));

    function onMove(e) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }
    window.addEventListener('mousemove', onMove);

    let frame = 0;
    let raf;

    function tick() {
      raf = requestAnimationFrame(tick);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = trail.length - 1; i > 0; i--) {
        trail[i].x = trail[i - 1].x;
        trail[i].y = trail[i - 1].y;
      }
      trail[0].x += (mouse.x - trail[0].x) * 0.28;
      trail[0].y += (mouse.y - trail[0].y) * 0.28;

      for (let i = 0; i < trail.length; i++) {
        const t     = i / trail.length;
        const alpha = 0.55 * (1 - t) * (1 - t);
        if (alpha < 0.005) continue;
        const size = 5 * (1 - t * 0.7);
        const wx   = trail[i].x + Math.sin(frame * 0.04 + i) * 0.6;
        const wy   = trail[i].y + Math.cos(frame * 0.03 + i) * 0.6;
        const grad = ctx.createRadialGradient(wx, wy, 0, wx, wy, size * 2.2);
        grad.addColorStop(0,   `rgba(184,150,90,${(alpha * 0.9).toFixed(3)})`);
        grad.addColorStop(0.4, `rgba(160,110,60,${(alpha * 0.5).toFixed(3)})`);
        grad.addColorStop(1,   'rgba(100,60,20,0)');
        ctx.beginPath();
        ctx.ellipse(
          wx, wy,
          size * (1 + Math.sin(frame * 0.07 + i) * 0.15),
          size * (0.55 + Math.cos(frame * 0.05 + i) * 0.1),
          Math.sin(i * 0.8) * 0.8,
          0, Math.PI * 2
        );
        ctx.fillStyle = grad;
        ctx.fill();
      }
      frame++;
    }
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      canvas.remove();
    };
  }, []);

  return null;
}
```

**Step 2: Replace `pages/_app.js`**

```jsx
import '../styles/globals.css';
import CursorTrail from '../components/CursorTrail';

export default function App({ Component, pageProps }) {
  return (
    <>
      <CursorTrail />
      <Component {...pageProps} />
    </>
  );
}
```

**Step 3: Verify**

```bash
npm run dev
```
Open http://localhost:3000, move the mouse — golden glowing particle trail should follow the cursor with a glow effect.

**Step 4: Commit**

```bash
git add components/CursorTrail.jsx pages/_app.js
git commit -m "feat: add golden cursor trail canvas animation"
```

---

## Task 10: Final Polish & Verification

**Files:**
- No new files; verify all existing

**Step 1: Check Next.js config for image domains (if needed)**

If the browser console shows Next.js image errors, open `next.config.js` and verify it doesn't block `public/images/`. Since we're using plain `<img>` tags, this should not be an issue.

**Step 2: Visual checklist**

Open http://localhost:3000 and verify against `portfolio.html` opened in a side tab:

- [ ] Background is dark `#0e0c0a`
- [ ] Grain texture overlay visible
- [ ] Navbar fixed at top, 44px, correct fonts and colors
- [ ] "Rustybench" name auto-fits in corner block
- [ ] Sidebar visible left, gold vertical accent line
- [ ] "scroll" text dim and rotated in sidebar
- [ ] 15 cards in 3 columns, staggered fade-in on load
- [ ] Card hover: tilt ±10°
- [ ] Card click: smooth 0.75s flip to blurred back with "future mock-up"
- [ ] Card click again: flip back
- [ ] "flip" hint visible on hover (bottom-right corner)
- [ ] Cursor trail: golden particles follow mouse
- [ ] Grain overlay at 55% opacity

**Step 3: Responsive check**

- [ ] Resize to 900px → 2-column grid
- [ ] Resize to 640px → 1-column grid, sidebar hidden

**Step 4: Build check**

```bash
npm run build
```
Expected: No errors. Pages built successfully.

**Step 5: Final commit**

```bash
git add -A
git commit -m "feat: complete Rustybench portfolio rebuild in Next.js 14"
```

---

## Verification Summary

| Check | Command / Action |
|-------|-----------------|
| Dev server | `npm run dev` → http://localhost:3000 |
| Card flip | Click any card |
| Card tilt | Hover any card and move mouse |
| Cursor trail | Move mouse across page |
| Responsive 2-col | Resize browser to 900px |
| Responsive 1-col | Resize browser to 640px |
| Production build | `npm run build` |
