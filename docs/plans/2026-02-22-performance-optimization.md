# Portfolio Performance Optimization Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Eliminate performance lag by implementing smart lazy loading, Next.js Image optimization, and CSS animation improvements.

**Architecture:** Migrate to Next.js Image component for automatic optimization, implement priority loading for above-the-fold images, defer CardStackViewer mounting with Intersection Observer, and optimize animations with CSS compositing hints.

**Tech Stack:** Next.js 14, React 18, Intersection Observer API, CSS will-change

---

## Task 1: Verify Next.js Image Configuration

**Files:**
- Check: `next.config.js` (create if missing)
- Modify: `next.config.js` (if needed)

**Step 1: Check if next.config.js exists**

Run: `ls next.config.js`
Expected: File exists or "No such file" error

**Step 2: Create/update next.config.js for Image optimization**

If file doesn't exist, create `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
}

module.exports = nextConfig
```

If file exists and has no images config, add the images property.

**Step 3: Verify configuration**

Run: `cat next.config.js`
Expected: File contains images configuration

**Step 4: Commit**

```bash
git add next.config.js
git commit -m "config: add Next.js Image optimization settings

Enable AVIF and WebP format serving for automatic image optimization.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 2: Migrate Card Component to Next.js Image

**Files:**
- Modify: `components/Card.jsx:1,90-109`

**Step 1: Add Image import**

At line 1, add after existing imports:

```javascript
import { useEffect, useRef } from 'react';
import Image from 'next/image';
```

**Step 2: Add isPriority prop to component**

Update function signature at line 5:

```javascript
export default function Card({ title, file, isPriority = false }) {
```

**Step 3: Replace front image with Next.js Image**

Replace lines 94-96:

```javascript
<div className="card-front" ref={frontRef}>
  <Image
    src={src}
    alt={title}
    fill
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    style={{ objectFit: 'cover' }}
    priority={isPriority}
  />
  <span className="flip-hint">flip</span>
</div>
```

**Step 4: Replace back blur image with Next.js Image**

Replace line 99:

```javascript
<div className="card-back" ref={backRef}>
  <Image
    className="back-blur"
    src={src}
    alt=""
    fill
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    style={{ objectFit: 'cover' }}
    loading="lazy"
    aria-hidden="true"
  />
  <div className="future-overlay">
```

**Step 5: Update CSS for Image component containers**

The Image component with `fill` requires the parent to have `position: relative`. Verify in `styles/globals.css` that `.card-front` and `.card-back` have positioning.

Run: `grep -A5 "\.card-front\|\.card-back" styles/globals.css`
Expected: Should show `position: relative` or `position: absolute`

**Step 6: Test in browser**

Run: Navigate to http://localhost:3000
Expected: Cards render with images, no console errors

**Step 7: Commit**

```bash
git add components/Card.jsx
git commit -m "refactor: migrate Card component to Next.js Image

- Add isPriority prop for above-the-fold optimization
- Use fill layout with responsive sizes for masonry grid
- Front images respect priority prop
- Back images always lazy load (hidden until flip)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 3: Update Index Page with Priority Props

**Files:**
- Modify: `pages/index.js:44-51`

**Step 1: Pass isPriority prop to first 2 cards in each column**

Replace lines 44-51:

```javascript
<div className="col" ref={colRefs[0]}>
  {col1.map((p, index) => (
    <Card key={p.file} title={p.title} file={p.file} isPriority={index < 2} />
  ))}
</div>
<div className="col" ref={colRefs[1]}>
  {col2.map((p, index) => (
    <Card key={p.file} title={p.title} file={p.file} isPriority={index < 2} />
  ))}
</div>
<div className="col" ref={colRefs[2]}>
  {col3.map((p, index) => (
    <Card key={p.file} title={p.title} file={p.file} isPriority={index < 2} />
  ))}
</div>
```

**Step 2: Test priority loading**

Run: Open Chrome DevTools Network tab, refresh http://localhost:3000
Expected: First ~6 images load immediately, others load as you scroll

**Step 3: Commit**

```bash
git add pages/index.js
git commit -m "feat: add priority loading for above-the-fold cards

Pass isPriority={index < 2} to first 2 cards per column (~6 total).
This ensures immediate loading of visible content while deferring
below-the-fold images.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 4: Migrate StackCard Component to Next.js Image

**Files:**
- Modify: `components/gallery/StackCard.jsx:1,52`

**Step 1: Add Image import**

At line 1, add:

```javascript
import { useRef, useEffect } from 'react';
import Image from 'next/image';
```

**Step 2: Replace img tag with Next.js Image**

Replace lines 51-53:

```javascript
<div className="stack-card-inner">
  <Image
    src={image.src}
    alt={image.title}
    fill
    sizes="(max-width: 768px) 90vw, 300px"
    style={{ objectFit: 'cover' }}
    loading="lazy"
  />
</div>
```

**Step 3: Verify parent has position relative**

Run: `grep -A3 "\.stack-card-inner" styles/globals.css | grep position`
Expected: Should show `position: relative`

If not, we'll add it in the CSS optimization task.

**Step 4: Test stack cards**

Run: Scroll to CardStackViewer at http://localhost:3000
Expected: Stack images load lazily, no layout shift

**Step 5: Commit**

```bash
git add components/gallery/StackCard.jsx
git commit -m "refactor: migrate StackCard to Next.js Image

Use fill layout with lazy loading for all mockup gallery images.
These images are always below the fold, so always lazy loaded.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 5: Check and Update FullscreenViewer (If Needed)

**Files:**
- Check: `components/gallery/FullscreenViewer.jsx`

**Step 1: Read FullscreenViewer component**

Run: `cat components/gallery/FullscreenViewer.jsx`
Expected: Component code with image rendering

**Step 2: If component uses img tags, migrate to Image**

Look for `<img` tags. If found, follow same pattern as StackCard:
- Add `import Image from 'next/image'`
- Replace img tags with Image component using fill layout
- Use lazy loading

**Step 3: Test fullscreen viewer**

Run: Click on a spread card to open fullscreen
Expected: Images load properly, navigation works

**Step 4: Commit (if changes made)**

```bash
git add components/gallery/FullscreenViewer.jsx
git commit -m "refactor: migrate FullscreenViewer to Next.js Image

Use Next.js Image component for fullscreen gallery display.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 6: Optimize CSS Animations - Will-Change

**Files:**
- Modify: `styles/globals.css:385-395`

**Step 1: Add will-change to stack-card**

Find `.stack-card` rule (around line 385) and update:

```css
.stack-card {
  position: absolute;
  width: var(--card-w);
  height: var(--card-h);
  top: 50%;
  left: 50%;
  margin-left: calc(var(--card-w) / -2);
  margin-top: calc(var(--card-h) / -2);
  transition: transform 0.3s ease-out;
  contain: layout style paint;
  will-change: transform;
}
```

**Step 2: Verify the change**

Run: `grep -A12 "^\.stack-card {" styles/globals.css | grep "will-change"`
Expected: Shows "will-change: transform"

**Step 3: Commit**

```bash
git add styles/globals.css
git commit -m "perf: add will-change hint to stack cards

Add will-change: transform to create separate compositing layer
for stack card animations, reducing paint operations during
spread/collapse transitions.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 7: Optimize CSS Hover - Box-Shadow Instead of Border

**Files:**
- Modify: `styles/globals.css:413-416`

**Step 1: Replace border hover with box-shadow**

Find `.stack-card.spread:hover .stack-card-inner` rule (around line 413) and replace:

```css
.stack-card.spread:hover .stack-card-inner {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4),
              0 0 0 2px rgba(184, 150, 90, 0.9);
}
```

**Step 2: Ensure base box-shadow exists**

Check `.stack-card-inner` rule (around line 397) has base box-shadow:

```css
.stack-card-inner {
  /* ... existing styles ... */
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
  /* ... */
}
```

**Step 3: Test hover effect**

Run: Spread cards and hover over them at http://localhost:3000
Expected: Border highlight effect appears smoothly without jank

**Step 4: Commit**

```bash
git add styles/globals.css
git commit -m "perf: optimize hover effect with box-shadow

Replace border-width change (triggers layout) with box-shadow
(triggers paint only) for smoother hover animations on spread cards.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 8: Add position relative to stack-card-inner (If Needed)

**Files:**
- Modify: `styles/globals.css:397-407`

**Step 1: Check if position relative exists**

Run: `grep -A10 "^\.stack-card-inner {" styles/globals.css | grep position`
Expected: Shows "position: relative" or similar

**Step 2: If missing, add position relative**

Update `.stack-card-inner` rule:

```css
.stack-card-inner {
  width: 100%;
  height: 100%;
  border-radius: 5px;
  overflow: hidden;
  background: var(--bg2);
  border: 1px solid rgba(184, 150, 90, 0.3);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
  position: relative;
  contain: layout style paint;
}
```

**Step 3: Verify images render correctly**

Run: Check http://localhost:3000 stack cards
Expected: Images fill containers properly

**Step 4: Commit (if changes made)**

```bash
git add styles/globals.css
git commit -m "fix: add position relative for Next.js Image fill layout

Required for Image component with fill prop to position correctly.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 9: Add position relative to Card front/back (If Needed)

**Files:**
- Check: `styles/globals.css` (search for .card-front and .card-back)

**Step 1: Check card-front positioning**

Run: `grep -A10 "^\.card-front" styles/globals.css | grep position`
Expected: Shows position value

**Step 2: Check card-back positioning**

Run: `grep -A10 "^\.card-back" styles/globals.css | grep position`
Expected: Shows position value

**Step 3: If either missing position relative, add it**

Update the respective rule to include `position: relative;`

**Step 4: Verify cards render correctly**

Run: Check http://localhost:3000 masonry cards
Expected: Images fill card faces properly

**Step 5: Commit (if changes made)**

```bash
git add styles/globals.css
git commit -m "fix: ensure card faces have position relative

Required for Next.js Image fill layout in Card component.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 10: Implement CardStackViewer Deferred Loading

**Files:**
- Modify: `pages/index.js:1,14-59`

**Step 1: Add state for CardStackViewer visibility**

After line 16 (after isAboutOpen state), add:

```javascript
const [isAboutOpen, setIsAboutOpen] = useState(false);
const [showCardStack, setShowCardStack] = useState(false);
const stackPlaceholderRef = useRef(null);
```

**Step 2: Add Intersection Observer effect**

After the existing animation useEffect (after line 34), add:

```javascript
useEffect(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        setShowCardStack(true);
      }
    },
    { rootMargin: '200px' } // Start loading 200px before viewport
  );

  const placeholder = stackPlaceholderRef.current;
  if (placeholder) {
    observer.observe(placeholder);
  }

  return () => {
    if (placeholder) {
      observer.unobserve(placeholder);
    }
  };
}, []);
```

**Step 3: Update CardStackViewer render to be conditional**

Replace lines 55-56:

```javascript
{/* Card Stack Gallery - appears below masonry grid */}
{showCardStack ? (
  <CardStackViewer />
) : (
  <div
    ref={stackPlaceholderRef}
    className="card-stack-placeholder"
    style={{ minHeight: '100vh' }}
  />
)}
```

**Step 4: Test deferred loading**

Run: Open Chrome DevTools, refresh http://localhost:3000, watch Network tab
Expected: CardStackViewer images don't load until you scroll near them

**Step 5: Commit**

```bash
git add pages/index.js
git commit -m "feat: defer CardStackViewer loading until near viewport

Use Intersection Observer to only mount CardStackViewer when user
scrolls within 200px. Prevents loading 11 mockup images on initial
page load.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 11: Performance Verification

**Files:**
- Test: Browser DevTools

**Step 1: Test initial load performance**

Run: Open Chrome DevTools Network tab, disable cache, refresh http://localhost:3000
Expected: Only ~6 images load initially (priority images)

**Step 2: Test lazy loading**

Run: Slowly scroll down the page
Expected: Images load progressively as they enter viewport

**Step 3: Test card flip**

Run: Click a card to flip it
Expected: Back image loads on first flip, smooth animation

**Step 4: Test CardStackViewer deferred loading**

Run: Scroll to bottom of page
Expected: Stack mounts and images load when within 200px of viewport

**Step 5: Test stack spread animation**

Run: Click stack to spread into circle
Expected: Smooth 60fps animation, no jank

**Step 6: Test stack hover**

Run: Hover over spread cards
Expected: Smooth border highlight, no layout shift

**Step 7: Run Lighthouse audit**

Run: Chrome DevTools → Lighthouse → Analyze page load
Expected: Performance score 90+, good FCP, CLS near 0

**Step 8: Document results**

Create a brief note in `docs/plans/2026-02-22-performance-results.txt`:

```
Performance Optimization Results
Date: 2026-02-22

Before:
- Initial images loaded: ~30
- Performance issues: Initial load lag, card flip lag, stack spread lag

After:
- Initial images loaded: ~6 (priority only)
- Lighthouse Performance: [SCORE]
- First Contentful Paint: [TIME]
- Cumulative Layout Shift: [SCORE]
- Stack spread: Smooth 60fps
- Hover effects: No jank

Notes: [Any observations]
```

**Step 9: Commit results**

```bash
git add docs/plans/2026-02-22-performance-results.txt
git commit -m "docs: add performance optimization verification results

Document before/after metrics and Lighthouse scores.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Success Criteria

✅ Only ~6 priority images load on initial page load
✅ Below-the-fold images lazy load progressively
✅ Card back images lazy load on first flip
✅ CardStackViewer defers until user scrolls near it
✅ Stack spread animation runs at 60fps
✅ Hover effects trigger paint-only operations
✅ No layout shift (CLS near 0)
✅ Lighthouse Performance score 90+

---

## Rollback Plan

If issues arise:

```bash
# Revert to commit before optimization work
git log --oneline | head -20  # Find commit before Task 1
git revert <commit-hash>..HEAD
```

Or revert individual commits:

```bash
git revert <specific-commit-hash>
```
