# Rustybench Portfolio — Claude Code Handoff
Generated from working portfolio.html

---

## 1. IMAGE FILES
Copy these from your uploads to `public/images/` in the Next.js project.

| Title | Filename |
|-------|----------|
| Crippled Emotions | Crippled.webp |
| Hekate | Hekate.webp |
| Kikagaku | KikagakuFramed.webp |
| Suspended | SuspendedJPG.webp |
| Mystic Tension — Shirt | tmtShirt.jpg |
| Ever Cosmic | EverCosmic.webp |
| Untitled I | IMG_0668.webp |
| Let It Be | LetitBe.webp |
| Threads | Threads.webp |
| Keep Grading | KeepGrading.jpg |
| Floating Head | Floater.webp |
| Untitled II | IMG_1039.webp |
| Primordial | Primo.webp |
| The Mystic Tension | tmtNewsprint.webp |
| Always Ace | AA.png |

---

## 2. DATA FILE
Create `data/pieces.js`:

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

---

## 3. CSS VARIABLES & TOKENS
Paste into `styles/globals.css` or a Tailwind config:

```css
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
```

Google Fonts to load:
- Playfair Display (400, 700, 900 — italic variants)
- IM Fell English (regular + italic)
- Libre Baskerville (400, 700 + italic)

---

## 4. LAYOUT STRUCTURE
Three components to build:

### `components/Navbar.jsx`
- Fixed top bar, height 44px
- Left corner block: 108px wide, right border, contains "Rustybench" fitted text
- Center: Work / About / Contact links with gold active underline
- Right: Instagram icon, Behance icon, © 2026

### `components/Sidebar.jsx`
- Fixed left column, 108px wide, full height minus navbar
- Gold accent line running vertically at left edge (6px in)
- "scroll" text rotated -90deg, very dim, centered vertically

### `components/Card.jsx`
- Receives: title, file (image path)
- Front: Next.js Image component, "flip" hint on hover
- Back: same image blurred + darkened, "future mock-up" text centered
- Implements tilt + flip (see JS blocks below)

---

## 5. FLIP + TILT JS
Port this into `Card.jsx` as a `useEffect` with `useRef` on the card element:

```js
// Single transform on .item handles both.
// Flip: rotateY(180deg) added to current tilt transform.
// Tilt: lerped rotateX/Y applied when not flipped.

const TILT_MAX = 10;

document.querySelectorAll('.item').forEach(card => {
  const front = card.querySelector('.card-front');
  const back  = card.querySelector('.card-back');
  let flipped = false;
  let raf = null;
  let cx = 0, cy = 0, tx = 0, ty = 0, hovering = false;
  const lerp = (a, b, t) => a + (b - a) * t;

  // Position back correctly from the start
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

  card.addEventListener('mouseenter', () => {
    hovering = true;
    // only suppress opacity/translate, not flip
    card.style.transition = 'transform 0s';
    if (!raf) raf = requestAnimationFrame(tick);
  });

  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    tx = ((e.clientX - (r.left + r.width  / 2)) / (r.width  / 2)) * TILT_MAX;
    ty = -((e.clientY - (r.top  + r.height / 2)) / (r.height / 2)) * TILT_MAX;
  });

  card.addEventListener('mouseleave', () => {
    hovering = false;
    tx = 0; ty = 0;
    card.style.transition = 'transform 0s';
    if (!raf) raf = requestAnimationFrame(tick);
  });

  card.addEventListener('click', () => {
    tx = 0; ty = 0; cx = 0; cy = 0;
    hovering = false;
    if (raf) { cancelAnimationFrame(raf); raf = null; }
    flipped = !flipped;
    card.style.transition = 'transform 0.75s cubic-bezier(0.4,0.2,0.2,1)';
    setTransform();
    setTimeout(() => { card.style.transition = 'transform 0s'; }, 780);
  });
});
```

In React, replace:
- `document.querySelectorAll('.item')` → single card ref
- `card` → `cardRef.current`
- Event listeners go inside `useEffect(() => { ... }, [])`
- Return cleanup: `cancelAnimationFrame(raf)`

---

## 6. CURSOR TRAIL JS
Port into `_app.jsx` or a `CursorTrail` component as a `useEffect`:

```js
(function() {
  const TRAIL_COUNT = 22;

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

  let mouse = { x: -999, y: -999 };
  let trail = Array.from({ length: TRAIL_COUNT }, () => ({ x: -999, y: -999, alpha: 0, size: 0 }));

  window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  let frame = 0;
  function tickTrail() {
    requestAnimationFrame(tickTrail);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = trail.length - 1; i > 0; i--) {
      trail[i].x = trail[i-1].x;
      trail[i].y = trail[i-1].y;
    }
    trail[0].x = trail[0].x + (mouse.x - trail[0].x) * 0.28;
    trail[0].y = trail[0].y + (mouse.y - trail[0].y) * 0.28;

    for (let i = 0; i < trail.length; i++) {
      const t = i / trail.length;
      const alpha = 0.55 * (1 - t) * (1 - t);
      if (alpha < 0.005) continue;
      const size = 5 * (1 - t * 0.7);
      const wx = trail[i].x + Math.sin(frame * 0.04 + i) * 0.6;
      const wy = trail[i].y + Math.cos(frame * 0.03 + i) * 0.6;
      const grad = ctx.createRadialGradient(wx, wy, 0, wx, wy, size * 2.2);
      grad.addColorStop(0,   `rgba(184,150,90,${alpha * 0.9})`);
      grad.addColorStop(0.4, `rgba(160,110,60,${alpha * 0.5})`);
      grad.addColorStop(1,   `rgba(100,60,20,0)`);
      ctx.beginPath();
      ctx.ellipse(wx, wy, size * (1 + Math.sin(frame*0.07+i)*0.15), size * (0.55 + Math.cos(frame*0.05+i)*0.1), Math.sin(i*0.8)*0.8, 0, Math.PI*2);
      ctx.fillStyle = grad;
      ctx.fill();
    }
    frame++;
  }
  tickTrail();
})();
```

In React:
- Create canvas via `useRef`
- Append to `document.body` inside `useEffect`
- Clean up: remove canvas on unmount

---

## 7. STAGGERED ENTRANCE JS
Port into the masonry grid component:

```js
(function() {
  const cols = document.querySelectorAll('.col');
  cols.forEach((col, ci) => {
    col.querySelectorAll('.item').forEach((item, ni) => {
      const delay = ci * 0.03 + ni * 0.07;
      setTimeout(() => {
        item.classList.add('visible');
        // after entrance done, strip transition so flip/tilt are unaffected
        setTimeout(() => {
          item.style.transition = 'transform 0s';
          item.style.opacity = '1';
          item.style.translate = '0 0';
        }, 500);
      }, delay * 1000);
    });
  });
})();
```

In React:
- Use `useEffect` after mount
- Apply `visible` class via state or direct ref manipulation

---

## 8. FIT NAVBAR NAME JS
Port into `Navbar.jsx`:

```js
(function() {
  const name = document.querySelector('.navbar-name');
  const corner = document.querySelector('.navbar-corner');
  if (!name || !corner) return;
  let size = 20;
  name.style.fontSize = size + 'px';
  const padding = 16;
  while (name.scrollWidth > corner.clientWidth - padding && size > 6) {
    size -= 0.25;
    name.style.fontSize = size + 'px';
  }
})();
```

In React:
- `useRef` on the name span and corner div
- Run inside `useEffect` on mount

---

## 9. GRAIN TEXTURE
The grain is a CSS `body::before` SVG filter overlay. In Next.js add to `globals.css`:

```css
body::before {
  content: '';
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 999;
  opacity: 0.55;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.045'/%3E%3C/svg%3E");
}
```

---

## 10. PROMPTS FOR CLAUDE CODE (in order)

**Prompt 1 — Scaffold**
"Create a Next.js 14 project using the pages router (not app router). Install nothing extra yet. Set up folders: components/, data/, styles/, public/images/."

**Prompt 2 — Globals**
"Set up globals.css with the CSS variables and Google Fonts import listed in the handoff doc. Background color #0e0c0a, no default margins."

**Prompt 3 — Navbar**
"Build a Navbar component using the layout spec in the handoff. Fixed top, 44px tall, 108px corner block containing Rustybench fitted to width via useEffect, nav links in the center, icon links on the right."

**Prompt 4 — Sidebar**
"Build a Sidebar component: 108px wide, full height minus navbar, dark background, gold vertical accent line via ::before, dim italic 'scroll' text rotated -90deg centered vertically."

**Prompt 5 — Card**
"Build a Card component that takes title and file props. Front shows the image, back shows the same image blurred and darkened with 'future mock-up' centered. Implement the tilt and flip logic from the handoff JS block using useRef and useEffect."

**Prompt 6 — Grid**
"Build the index page with a 3-column masonry grid using the pieces data file. Import Card. Add the staggered entrance effect."

**Prompt 7 — Cursor trail**
"Add a CursorTrail component that renders a canvas over the whole page using the cursor trail JS from the handoff. Mount it in _app.jsx."

**Prompt 8 — Polish**
"Check all CSS variables are applied correctly, scrollbar styling, responsive breakpoints at 900px (2 col) and 640px (1 col, sidebar hidden)."
