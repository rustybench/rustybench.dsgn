# Portfolio Card Stack Viewer - Design Handoff

> **Note:** This component will work **alongside** the existing masonry grid portfolio. Both views will coexist, offering different ways to browse the artwork.

## Overview

This design implements an interactive card stack viewer with fullscreen gallery capabilities. The interaction model differs from the current grid layout:

- **Initial State:** Cards are stacked in the center of the screen
- **Spread Interaction:** Clicking spreads cards horizontally across the viewport
- **Fullscreen View:** Clicking a card opens a fullscreen image viewer with navigation
- **Thumbnail Strip:** Bottom navigation for quick access to all images

The design maintains the same dark luxury aesthetic as the existing portfolio (#0e0c0a background, #b8965a gold accents) for visual consistency.

---

## Design Tokens

### Colors

```css
:root {
  /* Backgrounds */
  --bg: #0e0c0a;                        /* Main background - deep charcoal */

  /* Accents */
  --gold: #b8965a;                      /* Primary gold accent */
  --gold-dim: rgba(184, 150, 90, 0.22); /* Dimmed gold for subtle accents */

  /* Text */
  --text: #d4c5a9;                      /* Primary text - warm beige */
  --text-muted: rgba(212, 197, 169, 0.28); /* Muted text for hints */

  /* Component Sizing */
  --card-w: 150px;                      /* Card width in stacked mode */
  --card-h: 200px;                      /* Card height in stacked mode */
}
```

**Usage Notes:**
- `--bg`: Matches current portfolio background exactly
- `--gold`: Same accent color used throughout existing design
- `--text`: Consistent with current text styling
- Card dimensions are optimized for desktop viewing (responsive adjustments needed)

### Typography

**Font Families:**
```css
/* Loaded from Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=IM+Fell+English:ital@0;1&display=swap');
```

**Primary Font:** `"IM Fell English", serif`
- Used for: Body text, labels, UI elements
- Weight: 400 (regular)
- Style: Matches existing portfolio typography

**Display Font:** `"Playfair Display"`
- Used for: Titles, headings
- Weights: 400, 700, 900
- Italic: Available for emphasis

**Typography Scale:**
- Hint text: `11px`, letter-spacing: `0.2em`
- Card labels: `9px`, letter-spacing: `0.12em`
- Fullscreen title: `12px`, letter-spacing: `0.22em`
- Fullscreen counter: `9px`, letter-spacing: `0.3em`

**Text Transformations:**
- All uppercase not used (relies on letter-spacing for elegance)
- Italic used sparingly for hints and labels

### Spacing & Layout

**Scene Dimensions:**
- Container: Fixed viewport (100vw × 100vh)
- Stack area: 700px × 700px centered

**Card Spacing:**
- Border radius: `5px`
- Stacked offset: Minimal (creates subtle stack effect)
- Spread gap: Calculated dynamically based on viewport width

**Padding Values:**
- Label padding: `28px 8px 10px` (gradient overlay)
- Button padding: Implicit from `44px × 44px` or `36px × 36px` sizing
- Thumbnail gap: `8px`

**Z-Index Layers:**
```css
/* Stacking context */
grain-texture: 9999    /* Top layer - texture overlay */
fullscreen: 500        /* Fullscreen viewer */
cards-spread: 100      /* Individual cards when spread */
cards-base: 50         /* Cards in normal state */
backdrop: 1            /* Fullscreen backdrop */
```

### Shadows & Effects

**Card Shadows:**
```css
/* Default state */
box-shadow: 0 6px 28px rgba(0, 0, 0, 0.7);

/* Spread hover state */
box-shadow: 0 28px 70px rgba(0, 0, 0, 0.95);
```

**Fullscreen Image:**
```css
box-shadow: 0 60px 140px rgba(0, 0, 0, 0.95);
```

**Grain Texture:**
- SVG fractal noise filter
- Opacity: `0.5`
- `baseFrequency`: `0.85`
- `numOctaves`: `4`
- Applied as fixed overlay across entire viewport

**Blend Modes:**
- Not used in this design (cards use standard blending)

---

## Layout Structure

### Page Architecture

```
<body>
  └── Grain Texture (::before pseudo-element)
  └── <div class="scene">
      └── <div class="stack">
          ├── <div class="hint">click to open</div>
          └── <div class="card"> (×N cards)
              ├── <img>
              └── <div class="card-label">
  └── <div class="fullscreen">
      ├── <div class="fs-backdrop">
      ├── <div class="fs-btn prev">
      ├── <div class="fs-btn next">
      ├── <div class="fs-close">
      ├── <div class="fs-content">
      │   └── <img class="fs-img">
      ├── <div class="fs-strip"> (thumbnail navigation)
      │   └── <div class="fs-thumb"> (×N thumbnails)
      └── <div class="fs-bar">
          ├── <div class="fs-title">
          └── <div class="fs-counter">
</body>
```

### Component Hierarchy

**Scene (.scene)**
- Purpose: Fixed viewport container
- Positioning: `position: fixed; inset: 0`
- Flex center: `display: flex; align-items: center; justify-content: center`

**Stack (.stack)**
- Purpose: Houses the card stack
- Dimensions: `700px × 700px`
- Centers cards with flex layout
- `pointer-events: none` (cards have pointer-events enabled individually)

**Card (.card)**
- Purpose: Individual portfolio piece
- Default state: Stacked at center (`transform: translate(-50%, -50%)`)
- Spread state: Positioned horizontally with calculated transforms
- Hover: Elevated shadow, label fade-in

**Fullscreen (.fullscreen)**
- Purpose: Overlay viewer for large images
- States: `default` (hidden) | `.active` (visible)
- Z-index: `500` (above all cards)
- Flex centered content

**Hint (.hint)**
- Purpose: Instructional text ("click to open")
- Positioned below card stack
- Fades out when cards spread: `.scene.open .hint { opacity: 0 }`

### Responsive Breakpoints

**Note:** The original mockup does not include explicit responsive breakpoints. Recommended breakpoints for implementation:

```css
/* Desktop (default) */
@media (min-width: 1200px) { /* Current styles */ }

/* Tablet */
@media (max-width: 1199px) {
  .stack { width: 600px; height: 600px; }
  --card-w: 120px;
  --card-h: 160px;
}

/* Mobile */
@media (max-width: 768px) {
  .stack { width: 100vw; height: 100vh; }
  --card-w: 90px;
  --card-h: 120px;
  /* Consider vertical stack instead of horizontal spread */
}
```

---

## Components

### Card Component

**Purpose:** Displays individual artwork as an interactive card

**States:**
1. **Stacked** (default)
   - Positioned at center of `.stack`
   - Slight stacking offset for visual depth
   - Shadow: `0 6px 28px rgba(0,0,0,0.7)`
   - Label hidden (`opacity: 0`)

2. **Spread** (`.card.spread`)
   - Positioned horizontally across viewport
   - Transform calculated per card index
   - Transition: `0.55s cubic-bezier(0.34, 1.15, 0.64, 1)`

3. **Spread + Hover** (`.card.spread:hover`)
   - Elevated shadow: `0 28px 70px rgba(0,0,0,0.95)`
   - Z-index boost: `100`
   - Label visible (`opacity: 1`)

**HTML Structure:**
```html
<div class="card" data-index="0">
  <img src="..." alt="Artwork title">
  <div class="card-label">Artwork Title</div>
</div>
```

**Styling (key CSS):**
```css
.card {
  position: absolute;
  width: var(--card-w);
  height: var(--card-h);
  border-radius: 5px;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 6px 28px rgba(0, 0, 0, 0.7);
  user-select: none;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  transition: transform 0.55s cubic-bezier(0.34, 1.15, 0.64, 1),
              box-shadow 0.3s,
              opacity 0s,
              filter 0s;
}

.card img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
}

.card-label {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 28px 8px 10px;
  background: linear-gradient(to top, rgba(10, 8, 6, 0.95), transparent);
  font-style: italic;
  font-size: 9px;
  letter-spacing: 0.12em;
  color: var(--text);
  opacity: 0;
  transition: opacity 0s;
  text-align: center;
  pointer-events: none;
}

.card.spread {
  transition: transform 0.55s cubic-bezier(0.34, 1.15, 0.64, 1), box-shadow 0.3s;
}

.card.spread:hover {
  box-shadow: 0 28px 70px rgba(0, 0, 0, 0.95);
  z-index: 100 !important;
}

.card.spread:hover .card-label {
  opacity: 1;
}
```

**Interactions:**
- **Click (stacked):** Spreads all cards horizontally
- **Click (spread):** Opens fullscreen viewer for clicked card
- **Hover (spread):** Shows label, elevates shadow

**React Conversion Notes:**
```jsx
// Component structure
function Card({ image, title, index, isSpread, onClick }) {
  const [isHovered, setIsHovered] = useState(false);

  // Calculate transform based on spread state and index
  const getTransform = () => {
    if (!isSpread) return 'translate(-50%, -50%)';
    // Spread logic: distribute cards horizontally
    const spacing = calculateSpacing(totalCards, viewportWidth);
    const offset = (index - totalCards / 2) * spacing;
    return `translate(calc(-50% + ${offset}px), -50%)`;
  };

  return (
    <div
      className={`card ${isSpread ? 'spread' : ''}`}
      style={{ transform: getTransform(), zIndex: index }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img src={image} alt={title} />
      <div className="card-label">{title}</div>
    </div>
  );
}
```

---

### Fullscreen Viewer

**Purpose:** Large-format image viewing with navigation controls

**States:**
1. **Closed** (default)
   - `opacity: 0`, `pointer-events: none`
   - Content scaled down: `transform: scale(0.96)`

2. **Active** (`.fullscreen.active`)
   - `opacity: 1`, `pointer-events: all`
   - Backdrop fades in
   - Content scales to `scale(1)`
   - Transitions: Staggered (backdrop → content)

**HTML Structure:**
```html
<div class="fullscreen" id="fullscreen">
  <div class="fs-backdrop" id="fsBackdrop"></div>
  <div class="fs-btn prev" id="fsPrev">←</div>
  <div class="fs-btn next" id="fsNext">→</div>
  <div class="fs-close" id="fsClose">×</div>
  <div class="fs-content">
    <img class="fs-img" id="fsImg" src="" alt="">
  </div>
  <div class="fs-strip" id="fsStrip">
    <!-- Thumbnails dynamically inserted -->
  </div>
  <div class="fs-bar">
    <div class="fs-title" id="fsTitle"></div>
    <div class="fs-counter" id="fsCounter"></div>
  </div>
</div>
```

**Styling (key CSS):**
```css
.fullscreen {
  position: fixed;
  inset: 0;
  z-index: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  opacity: 0;
}

.fullscreen.active {
  pointer-events: all;
  opacity: 1;
}

.fs-backdrop {
  position: absolute;
  inset: 0;
  background: #0e0c0a;
  opacity: 0;
  transition: opacity 0.55s ease;
}

.fullscreen.active .fs-backdrop {
  opacity: 1;
}

.fs-content {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: scale(0.96);
  transition: opacity 0.45s ease 0.15s, transform 0.55s cubic-bezier(0.34, 1.1, 0.64, 1) 0.1s;
}

.fullscreen.active .fs-content {
  opacity: 1;
  transform: scale(1);
}

.fs-img {
  max-width: 88vw;
  max-height: 88vh;
  object-fit: contain;
  display: block;
  border-radius: 3px;
  box-shadow: 0 60px 140px rgba(0, 0, 0, 0.95);
}
```

**Features:**
- Image constrained to `88vw × 88vh` (maintains viewport padding)
- Previous/Next navigation buttons
- Close button (top-right)
- Thumbnail strip (bottom)
- Title and counter (bottom center)

**Interactions:**
- **Click backdrop:** Close viewer
- **Click prev/next:** Navigate images
- **Click thumbnail:** Jump to specific image
- **Keyboard (recommended):** Arrow keys, Escape

**React Conversion Notes:**
```jsx
function FullscreenViewer({ images, isOpen, currentIndex, onClose, onNavigate }) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyboard = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onNavigate('prev');
      if (e.key === 'ArrowRight') onNavigate('next');
    };

    document.addEventListener('keydown', handleKeyboard);
    return () => document.removeEventListener('keydown', handleKeyboard);
  }, [isOpen, onClose, onNavigate]);

  if (!isOpen) return null;

  return (
    <div className="fullscreen active">
      <div className="fs-backdrop" onClick={onClose} />
      <button className="fs-btn prev" onClick={() => onNavigate('prev')}>←</button>
      <button className="fs-btn next" onClick={() => onNavigate('next')}>→</button>
      <button className="fs-close" onClick={onClose}>×</button>
      <div className="fs-content">
        <img className="fs-img" src={images[currentIndex].src} alt={images[currentIndex].title} />
      </div>
      <ThumbnailStrip images={images} currentIndex={currentIndex} onClick={(idx) => onNavigate(idx)} />
      <div className="fs-bar">
        <div className="fs-title">{images[currentIndex].title}</div>
        <div className="fs-counter">{currentIndex + 1} / {images.length}</div>
      </div>
    </div>
  );
}
```

---

### Navigation Controls

**Purpose:** Navigate between images in fullscreen mode

**Components:**

1. **Previous Button** (`.fs-btn.prev`)
   - Position: `left: 32px`, centered vertically
   - Symbol: `←` (left arrow)

2. **Next Button** (`.fs-btn.next`)
   - Position: `right: 32px`, centered vertically
   - Symbol: `→` (right arrow)

3. **Close Button** (`.fs-close`)
   - Position: `top: 28px; right: 32px`
   - Symbol: `×` (multiplication sign)

**Styling:**
```css
.fs-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid rgba(184, 150, 90, 0.13);
  background: rgba(14, 12, 10, 0.5);
  color: rgba(212, 197, 169, 0.3);
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-family: sans-serif;
  transition: color 0.2s, border-color 0.2s, background 0.2s;
}

.fs-btn:hover {
  color: var(--gold);
  border-color: var(--gold-dim);
  background: rgba(14, 12, 10, 0.8);
}

.fs-btn.prev { left: 32px; }
.fs-btn.next { right: 32px; }

.fs-close {
  position: absolute;
  top: 28px;
  right: 32px;
  z-index: 2;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid rgba(184, 150, 90, 0.13);
  background: rgba(14, 12, 10, 0.5);
  color: rgba(212, 197, 169, 0.3);
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-family: sans-serif;
  transition: color 0.2s, border-color 0.2s;
}

.fs-close:hover {
  color: var(--gold);
  border-color: var(--gold-dim);
}
```

**Interactions:**
- Click: Trigger navigation or close action
- Hover: Gold accent, increased opacity

**React Conversion Notes:**
- Use semantic `<button>` elements
- Add `aria-label` for accessibility
- Handle disabled states (first/last image)

---

### Thumbnail Strip

**Purpose:** Quick navigation to any image in the collection

**HTML Structure:**
```html
<div class="fs-strip" id="fsStrip">
  <div class="fs-thumb" data-index="0">
    <img src="..." alt="">
  </div>
  <!-- Repeated for each image -->
</div>
```

**Styling:**
```css
.fs-strip {
  position: absolute;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  align-items: center;
  z-index: 2;
}

.fs-thumb {
  width: 36px;
  height: 48px;
  border-radius: 3px;
  overflow: hidden;
  opacity: 0.3;
  cursor: pointer;
  border: 1px solid transparent;
  transition: opacity 0.2s, border-color 0.2s, transform 0.2s;
  flex-shrink: 0;
}

.fs-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.fs-thumb:hover {
  opacity: 0.7;
  transform: translateY(-3px);
}

.fs-thumb.active {
  opacity: 1;
  border-color: rgba(184, 150, 90, 0.5);
}
```

**States:**
- **Default:** Low opacity (`0.3`)
- **Hover:** Medium opacity (`0.7`), slight lift
- **Active:** Full opacity (`1`), gold border

**Interactions:**
- Click: Jump to selected image
- Hover: Preview indication

**React Conversion Notes:**
```jsx
function ThumbnailStrip({ images, currentIndex, onClick }) {
  return (
    <div className="fs-strip">
      {images.map((img, idx) => (
        <div
          key={idx}
          className={`fs-thumb ${idx === currentIndex ? 'active' : ''}`}
          onClick={() => onClick(idx)}
        >
          <img src={img.thumbnail || img.src} alt={img.title} />
        </div>
      ))}
    </div>
  );
}
```

---

## JavaScript Logic

### State Management

**Global State:**
```javascript
// Core state variables
let currentIndex = 0;           // Currently viewed image in fullscreen
let isSpread = false;          // Whether cards are spread or stacked
let isFullscreenOpen = false;  // Whether fullscreen viewer is active
```

**State Transitions:**
1. **Stacked → Spread**
   - Triggered by: Click on any card (when stacked)
   - Actions:
     - Set `isSpread = true`
     - Add `.open` class to `.scene`
     - Add `.spread` class to all `.card` elements
     - Calculate and apply spread transforms

2. **Spread → Fullscreen**
   - Triggered by: Click on specific card (when spread)
   - Actions:
     - Set `isFullscreenOpen = true`
     - Set `currentIndex` to clicked card index
     - Add `.active` class to `.fullscreen`
     - Update fullscreen image/title/counter

3. **Fullscreen → Spread**
   - Triggered by: Close button, backdrop click, or Escape key
   - Actions:
     - Set `isFullscreenOpen = false`
     - Remove `.active` class from `.fullscreen`

**React Conversion:**
```jsx
// Recommended state structure
const [viewState, setViewState] = useState('stacked'); // 'stacked' | 'spread' | 'fullscreen'
const [currentIndex, setCurrentIndex] = useState(0);
const images = [...]; // Image data array

// State transition handlers
const handleSpread = () => setViewState('spread');
const handleOpenFullscreen = (index) => {
  setCurrentIndex(index);
  setViewState('fullscreen');
};
const handleCloseFullscreen = () => setViewState('spread');
```

### Event Handlers

**1. Card Click Handler**
```javascript
// Vanilla JS example from mockup
cards.forEach((card, index) => {
  card.addEventListener('click', () => {
    if (!isSpread) {
      // Spread all cards
      spreadCards();
    } else {
      // Open fullscreen for this card
      openFullscreen(index);
    }
  });
});
```

**2. Spread Animation**
```javascript
function spreadCards() {
  isSpread = true;
  scene.classList.add('open');

  cards.forEach((card, index) => {
    card.classList.add('spread');

    // Calculate horizontal position
    const totalCards = cards.length;
    const viewportWidth = window.innerWidth;
    const cardWidth = 150; // var(--card-w)
    const spacing = Math.min(200, viewportWidth / (totalCards + 1));
    const startX = (viewportWidth - (totalCards - 1) * spacing) / 2;
    const x = startX + (index * spacing) - viewportWidth / 2;

    card.style.transform = `translate(${x}px, -50%)`;
    card.style.zIndex = index;
  });
}
```

**3. Fullscreen Navigation**
```javascript
function openFullscreen(index) {
  currentIndex = index;
  isFullscreenOpen = true;

  const fullscreen = document.getElementById('fullscreen');
  const img = document.getElementById('fsImg');
  const title = document.getElementById('fsTitle');
  const counter = document.getElementById('fsCounter');

  fullscreen.classList.add('active');
  img.src = mockups[index].src;
  title.textContent = mockups[index].title;
  counter.textContent = `${index + 1} / ${mockups.length}`;

  updateThumbnails();
}

function navigate(direction) {
  if (direction === 'prev') {
    currentIndex = (currentIndex - 1 + mockups.length) % mockups.length;
  } else if (direction === 'next') {
    currentIndex = (currentIndex + 1) % mockups.length;
  }

  updateFullscreenContent(currentIndex);
}
```

**4. Thumbnail Click**
```javascript
thumbnails.forEach((thumb, index) => {
  thumb.addEventListener('click', () => {
    currentIndex = index;
    updateFullscreenContent(index);
  });
});

function updateFullscreenContent(index) {
  const img = document.getElementById('fsImg');
  const title = document.getElementById('fsTitle');
  const counter = document.getElementById('fsCounter');

  img.src = mockups[index].src;
  title.textContent = mockups[index].title;
  counter.textContent = `${index + 1} / ${mockups.length}`;

  // Update active thumbnail
  thumbnails.forEach((t, i) => {
    t.classList.toggle('active', i === index);
  });
}
```

**React Event Handler Examples:**
```jsx
// Card click
const handleCardClick = (index) => {
  if (viewState === 'stacked') {
    setViewState('spread');
  } else if (viewState === 'spread') {
    setCurrentIndex(index);
    setViewState('fullscreen');
  }
};

// Navigation
const handleNavigate = (direction) => {
  if (direction === 'prev') {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  } else if (direction === 'next') {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  } else if (typeof direction === 'number') {
    setCurrentIndex(direction); // Direct index jump
  }
};

// Keyboard
useEffect(() => {
  if (viewState !== 'fullscreen') return;

  const handleKeydown = (e) => {
    if (e.key === 'Escape') handleCloseFullscreen();
    if (e.key === 'ArrowLeft') handleNavigate('prev');
    if (e.key === 'ArrowRight') handleNavigate('next');
  };

  document.addEventListener('keydown', handleKeydown);
  return () => document.removeEventListener('keydown', handleKeydown);
}, [viewState]);
```

### Animation Sequences

**Card Spread Animation:**
- Duration: `0.55s`
- Easing: `cubic-bezier(0.34, 1.15, 0.64, 1)` (slight overshoot for liveliness)
- Properties: `transform`, `box-shadow`
- Stagger: All cards animate simultaneously (parallel, not sequential)

**Fullscreen Open:**
1. **Backdrop fade-in:** `0.55s ease`
2. **Content scale + fade:** `0.55s cubic-bezier(0.34, 1.1, 0.64, 1)` with `0.1s` delay
3. **Total duration:** ~0.65s

**Fullscreen Close:**
- Reverse of open animation
- No delay on close for snappier feel

**Hover Transitions:**
- Shadow: `0.3s` ease
- Label opacity: Instant (`0s`) to avoid flicker
- Thumbnail lift: `0.2s` ease

### Utility Functions

**Calculate Spread Spacing:**
```javascript
function calculateSpacing(cardCount, viewportWidth, cardWidth = 150) {
  const maxSpacing = 200; // Comfortable spacing
  const minSpacing = cardWidth + 20; // Minimum gap
  const availableWidth = viewportWidth * 0.9; // Use 90% of viewport
  const idealSpacing = availableWidth / (cardCount - 1);

  return Math.max(minSpacing, Math.min(maxSpacing, idealSpacing));
}
```

**Clamp Index:**
```javascript
function clampIndex(index, length) {
  return ((index % length) + length) % length;
}
```

**Generate Thumbnails:**
```javascript
function generateThumbnails(images, container) {
  container.innerHTML = '';
  images.forEach((img, index) => {
    const thumb = document.createElement('div');
    thumb.className = 'fs-thumb';
    thumb.dataset.index = index;
    thumb.innerHTML = `<img src="${img.src}" alt="${img.title}">`;
    thumb.addEventListener('click', () => jumpToImage(index));
    container.appendChild(thumb);
  });
}
```

---

## Image Assets

### Image List

Based on the mockup, the following image was identified:

| # | Title | Suggested Filename | Notes |
|---|-------|-------------------|-------|
| 1 | Atomic Pedal | `atomic-pedal.webp` | Base64 embedded in original HTML |

**Note:** The original HTML contained one visible base64 image. For full implementation, you'll need to provide:
- High-resolution source images
- Properly sized thumbnails (36×48px for strip)
- Consistent aspect ratios or object-fit handling

### Data Structure

**Recommended format:**
```javascript
export const galleryImages = [
  {
    id: 'atomic-pedal',
    title: 'Atomic Pedal',
    src: '/images/atomic-pedal.webp',
    thumbnail: '/images/thumbs/atomic-pedal.webp', // Optional
    width: 4000,  // Optional - for aspect ratio
    height: 6000, // Optional - for aspect ratio
  },
  // Add more images...
];
```

**Integration with current portfolio:**
You could reuse the existing `pieces` array from `/data/pieces.js` with minimal adaptation:

```javascript
import { pieces } from '../data/pieces';

// Convert to gallery format
const galleryImages = pieces.map((piece, index) => ({
  id: `piece-${index}`,
  title: piece.title,
  src: `/images/${piece.file}`,
  thumbnail: `/images/${piece.file}`, // Or generate thumbnails
}));
```

---

## Implementation Guide

### Phase 1: Setup

**Step 1: Create component structure**
```bash
mkdir -p components/gallery
touch components/gallery/CardStackViewer.jsx
touch components/gallery/Card.jsx
touch components/gallery/FullscreenViewer.jsx
touch components/gallery/ThumbnailStrip.jsx
```

**Step 2: Add CSS tokens to globals.css**
```css
/* Add to existing :root in styles/globals.css */
:root {
  /* Existing variables... */

  /* Gallery-specific */
  --card-w: 150px;
  --card-h: 200px;
}
```

**Step 3: Load fonts (if not already loaded)**
The fonts are already loaded in the current portfolio via Google Fonts in `/pages/_document.js`. No changes needed.

### Phase 2: Components

**Build order:**
1. **Card component** - Simplest, no dependencies
2. **ThumbnailStrip** - Simple list component
3. **FullscreenViewer** - Composition of navigation + thumbnails
4. **CardStackViewer** - Top-level orchestrator

**Testing approach:**
- Build each component in isolation with mock data
- Test state transitions independently
- Integration test with full image set

### Phase 3: Interactions

**Step 1: Implement spread animation**
- Start with CSS-only transition
- Add JavaScript for dynamic positioning
- Test with varying viewport sizes

**Step 2: Wire up fullscreen**
- Implement open/close
- Add keyboard navigation
- Test image switching

**Step 3: Polish details**
- Hover states
- Loading states for images
- Smooth transitions between states

### Phase 4: Polish

**Animation tuning:**
- Adjust easing curves if needed
- Fine-tune transition durations
- Ensure 60fps performance

**Accessibility:**
- Add ARIA labels
- Ensure keyboard navigation
- Test with screen readers

**Responsive:**
- Add mobile breakpoints
- Consider vertical stack on mobile
- Touch gesture support

---

## React Conversion Notes

### Recommended Component Structure

```
components/gallery/
├── CardStackViewer.jsx      # Main orchestrator
├── Card.jsx                 # Individual card
├── FullscreenViewer.jsx     # Fullscreen overlay
├── ThumbnailStrip.jsx       # Thumbnail navigation
└── NavigationButton.jsx     # Reusable nav button
```

**Component responsibilities:**
- `CardStackViewer`: State management, layout
- `Card`: Rendering, hover states
- `FullscreenViewer`: Modal overlay, navigation orchestration
- `ThumbnailStrip`: Thumbnail rendering, active state
- `NavigationButton`: Prev/Next/Close buttons

### State Hooks Needed

**CardStackViewer:**
```jsx
const [viewState, setViewState] = useState('stacked'); // 'stacked' | 'spread' | 'fullscreen'
const [currentIndex, setCurrentIndex] = useState(0);
const [images] = useState(galleryImages); // Or fetch from props/API
```

**Card:**
```jsx
const [isHovered, setIsHovered] = useState(false);
// Transform calculated in parent, passed as prop
```

**FullscreenViewer:**
```jsx
// Receives state from parent
// Local UI state only:
const [isImageLoaded, setIsImageLoaded] = useState(false);
```

**ThumbnailStrip:**
```jsx
// Stateless - receives currentIndex from parent
```

### Side Effects

**Keyboard navigation:**
```jsx
useEffect(() => {
  if (viewState !== 'fullscreen') return;

  const handleKeydown = (e) => {
    if (e.key === 'Escape') handleClose();
    if (e.key === 'ArrowLeft') handlePrev();
    if (e.key === 'ArrowRight') handleNext();
  };

  document.addEventListener('keydown', handleKeydown);
  return () => document.removeEventListener('keydown', handleKeydown);
}, [viewState, currentIndex]);
```

**Body scroll lock (when fullscreen open):**
```jsx
useEffect(() => {
  if (viewState === 'fullscreen') {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }

  return () => {
    document.body.style.overflow = '';
  };
}, [viewState]);
```

**Image preloading (optional optimization):**
```jsx
useEffect(() => {
  // Preload adjacent images when in fullscreen
  if (viewState !== 'fullscreen') return;

  const preloadIndexes = [
    (currentIndex + 1) % images.length,
    (currentIndex - 1 + images.length) % images.length,
  ];

  preloadIndexes.forEach((idx) => {
    const img = new Image();
    img.src = images[idx].src;
  });
}, [currentIndex, viewState, images]);
```

### Performance Considerations

**1. Use useMemo for expensive calculations:**
```jsx
const spreadTransforms = useMemo(() => {
  if (viewState !== 'spread') return {};

  const spacing = calculateSpacing(images.length, window.innerWidth);
  return images.reduce((acc, _, index) => {
    acc[index] = calculateTransform(index, images.length, spacing);
    return acc;
  }, {});
}, [viewState, images.length]);
```

**2. Virtualize thumbnails (if >20 images):**
```jsx
// Consider react-window for large image sets
import { FixedSizeList } from 'react-window';
```

**3. Lazy load images:**
```jsx
<img
  src={image.src}
  loading="lazy"
  alt={image.title}
/>
```

**4. Use useCallback for event handlers:**
```jsx
const handleCardClick = useCallback((index) => {
  if (viewState === 'stacked') {
    setViewState('spread');
  } else if (viewState === 'spread') {
    setCurrentIndex(index);
    setViewState('fullscreen');
  }
}, [viewState]);
```

**5. Optimize re-renders:**
```jsx
// Memoize Card component
const Card = memo(({ image, index, isSpread, onClick }) => {
  // ...
}, (prevProps, nextProps) => {
  return prevProps.index === nextProps.index &&
         prevProps.isSpread === nextProps.isSpread;
});
```

---

## Prompts for Implementation

### Phase 1: Core Components

**Prompt 1: Create Card Component**
```
Create a React Card component for the portfolio gallery with the following requirements:

- Accept props: { image, title, index, isSpread, onClick }
- Three visual states: stacked (default), spread, spread+hover
- Styling:
  - Card dimensions: 150px × 200px
  - Border radius: 5px
  - Shadow: 0 6px 28px rgba(0,0,0,0.7) default, 0 28px 70px rgba(0,0,0,0.95) on hover
  - Label gradient overlay at bottom (hidden by default, visible on spread+hover)
- Transitions:
  - Transform: 0.55s cubic-bezier(0.34, 1.15, 0.64, 1)
  - Shadow: 0.3s ease
- Image should use object-fit: cover to fill card
- Label: 9px font-size, 0.12em letter-spacing, italic, centered
```

**Prompt 2: Create FullscreenViewer Component**
```
Create a React FullscreenViewer component with:

- Props: { images, isOpen, currentIndex, onClose, onNavigate }
- Structure:
  - Dark backdrop (#0e0c0a)
  - Centered image (max-width: 88vw, max-height: 88vh)
  - Prev/Next navigation buttons (44×44px circles, left/right sides)
  - Close button (36×36px circle, top-right)
  - Thumbnail strip at bottom
  - Title and counter below thumbnails
- Animations:
  - Backdrop fade-in: 0.55s ease
  - Content scale from 0.96 to 1.0: 0.55s cubic-bezier(0.34, 1.1, 0.64, 1) with 0.1s delay
- Keyboard support:
  - Escape: close
  - Arrow Left: previous image
  - Arrow Right: next image
- Clicking backdrop should close viewer
```

**Prompt 3: Create ThumbnailStrip Component**
```
Create a React ThumbnailStrip component:

- Props: { images, currentIndex, onClick }
- Render thumbnails horizontally with 8px gap
- Thumbnail dimensions: 36px × 48px
- States:
  - Default: opacity 0.3
  - Hover: opacity 0.7, translateY(-3px)
  - Active: opacity 1, border: 1px solid rgba(184,150,90,0.5)
- Clicking thumbnail calls onClick with index
- Use flexbox with flex-shrink: 0 to prevent thumbnail compression
```

### Phase 2: State Management

**Prompt 4: Create CardStackViewer Component**
```
Create a React CardStackViewer component that orchestrates the card stack gallery:

- State:
  - viewState: 'stacked' | 'spread' | 'fullscreen'
  - currentIndex: number (for fullscreen)
- Props: { images } where images = [{ id, title, src, thumbnail? }]
- Logic:
  - Stacked mode: Cards centered with minimal offset
  - Spread mode: Cards distributed horizontally across viewport
    - Calculate spacing based on viewport width
    - Use transform to position each card
  - Fullscreen mode: Show FullscreenViewer overlay
- Click behavior:
  - Stacked → click any card → spread all cards
  - Spread → click specific card → open fullscreen for that card
- Render:
  - Scene container (fixed viewport)
  - Stack container (700×700px centered)
  - Hint text "click to open" (hidden when spread)
  - All Card components
  - FullscreenViewer (when viewState === 'fullscreen')
```

### Phase 3: Integration

**Prompt 5: Create Gallery Page**
```
Create a new page /pages/gallery.jsx that:

- Imports CardStackViewer
- Fetches or imports gallery images (reuse pieces array from data/pieces.js)
- Renders CardStackViewer with full viewport layout
- Includes the grain texture overlay (copy from existing portfolio)
- Uses same fonts as current portfolio (IM Fell English, Playfair Display)
- Maintains dark luxury aesthetic (#0e0c0a background, #b8965a gold)
```

**Prompt 6: Add Navigation Between Views**
```
Add a toggle or navigation element to switch between:

- Current masonry grid view (pages/index.js)
- New card stack gallery view (pages/gallery.js)

Options:
1. Add a toggle button to Navbar component
2. Add gallery link to About modal
3. Create a floating FAB (Floating Action Button) to switch views

Ensure smooth navigation and maintain design consistency.
```

### Phase 4: Polish

**Prompt 7: Add Responsive Behavior**
```
Make the CardStackViewer responsive:

- Desktop (1200px+): Current styles
- Tablet (768-1199px):
  - Reduce stack size to 600×600px
  - Card dimensions: 120×160px
- Mobile (<768px):
  - Full viewport stack
  - Card dimensions: 90×120px
  - Consider vertical card arrangement instead of horizontal spread
  - Simplify fullscreen to use more viewport space (95vw × 95vh)
  - Reduce thumbnail size to 28×37px
```

**Prompt 8: Add Loading States**
```
Enhance FullscreenViewer with loading states:

- Show skeleton loader while image loads
- Fade in image when loaded (use onLoad event)
- Optional: Blur-up effect (show tiny blurred thumbnail while high-res loads)
- Prevent navigation spam (debounce or disable buttons during transitions)
```

---

## Testing Checklist

### Functionality
- [ ] Cards stack correctly on initial load
- [ ] Click spreads cards horizontally
- [ ] Individual card click opens fullscreen
- [ ] Fullscreen shows correct image/title/counter
- [ ] Previous/Next navigation works
- [ ] Thumbnail strip shows all images
- [ ] Clicking thumbnail jumps to image
- [ ] Close button returns to spread view
- [ ] Keyboard navigation works (arrows, escape)
- [ ] Clicking backdrop closes fullscreen

### Visual
- [ ] Grain texture overlay present
- [ ] Card shadows match spec
- [ ] Hover effects smooth
- [ ] Labels appear/disappear correctly
- [ ] Spread animation feels smooth
- [ ] Fullscreen fade-in looks polished
- [ ] Gold accent colors consistent with main portfolio
- [ ] Fonts render correctly

### Performance
- [ ] Spread animation runs at 60fps
- [ ] Large images don't block interaction
- [ ] No layout shift during state transitions
- [ ] Smooth scrolling in thumbnail strip (if many images)

### Responsive
- [ ] Works on desktop (1920×1080)
- [ ] Works on laptop (1366×768)
- [ ] Works on tablet (768×1024)
- [ ] Works on mobile (375×667)

### Accessibility
- [ ] Keyboard navigation functional
- [ ] Focus states visible
- [ ] Alt text on images
- [ ] ARIA labels on buttons
- [ ] Screen reader announces state changes

---

## Notes

- This component is designed to **coexist** with the current masonry grid portfolio
- Shares the same design system for visual consistency
- Can reuse existing image data from `/data/pieces.js`
- Consider adding a view toggle in the navigation bar
- Mobile UX may benefit from a different interaction model (e.g., swipe gestures)
- Image optimization recommended (WebP format, responsive images)
- Consider lazy loading for large galleries (>20 images)

---

**End of Handoff Document**

*This document provides all necessary information to implement the card stack viewer component. For implementation questions or clarifications, refer to the original HTML mockup or consult the development team.*
