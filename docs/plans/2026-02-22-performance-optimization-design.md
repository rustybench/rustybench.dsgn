# Portfolio Performance Optimization Design

**Date:** 2026-02-22
**Status:** Approved

## Context

The portfolio website is experiencing performance lag in three key areas:
1. Initial page load (slight delay)
2. Card flip animations (3D transform lag)
3. Card stack gallery (significant lag when spreading to circular form and hovering over mockups)

Currently, the site loads ~30 images on initial page load without optimization:
- 17 portfolio pieces in masonry grid (each with front/back images = 34 images)
- 11 mockup images in CardStackViewer
- Only Card front images have `loading="lazy"` - back images and stack images don't
- All images load as full-resolution files without format optimization
- CardStackViewer mounts immediately even though it's below the fold

## Approach: Smart Lazy Loading + Animation Tuning

This approach balances performance improvements with implementation effort by leveraging Next.js built-in optimizations.

## Design

### 1. Image Optimization Strategy

**Migration to Next.js Image Component:**

Convert `<img>` tags to Next.js `<Image>` component in:
- `components/Card.jsx` (lines 95, 99) - both front and back images
- `components/gallery/StackCard.jsx` (line 52) - mockup images
- `components/gallery/FullscreenViewer.jsx` - if images present

**Benefits:**
- Automatic WebP/AVIF format serving to supporting browsers
- Responsive image size generation
- Built-in lazy loading (except with `priority={true}`)
- Layout shift prevention

**Image Priority Strategy:**
- Above-the-fold cards (first ~6): `priority={true}` for immediate load
- Below-the-fold cards: default lazy loading
- Card back images: Always lazy (only visible after flip)
- StackCard mockups: Always lazy (below the fold)

**Sizing Approach:**
Use `fill` layout with `object-fit: cover` to maintain current responsive masonry behavior.

### 2. Lazy Loading Implementation

**Card Component (`components/Card.jsx`):**
- Convert both front and back images to `<Image>` components
- Pass `isPriority` prop to Card component
- Front image: `priority={isPriority}`, lazy load otherwise
- Back image: Always lazy load (hidden until flip)

**Index Page (`pages/index.js`):**
- Pass `isPriority={index < 2}` to first 2 cards in each column
- Ensures ~6 above-the-fold images load immediately
- Remaining ~24 images lazy load progressively

**StackCard Component (`components/gallery/StackCard.jsx`):**
- Convert to `<Image>` component with default lazy loading
- Always below the fold, so always lazy loaded

### 3. Animation Performance Optimization

**CSS Will-Change Hints:**

Add to `.stack-card` in `styles/globals.css`:
```css
.stack-card {
  /* existing styles */
  will-change: transform;
}
```

Creates separate compositing layer for transform optimizations.

**Conditional Will-Change:**
Only apply during transitions to avoid overuse. Add `.stack-card.transitioning` class during spread/collapse animations.

**Border Hover Optimization:**

Replace border-width change (triggers layout) with box-shadow (triggers paint only):

Replace in `styles/globals.css` (lines 413-416):
```css
.stack-card.spread:hover .stack-card-inner {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4),
              0 0 0 2px rgba(184, 150, 90, 0.9);
}
```

Remove `border-color` and `border-width` changes - use box-shadow for visual border effect without layout recalculation.

### 4. Component Loading Strategy

**Defer CardStackViewer:**

Prevent mounting CardStackViewer until user scrolls near it using Intersection Observer.

In `pages/index.js`:
```javascript
const [showCardStack, setShowCardStack] = useState(false);

useEffect(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        setShowCardStack(true);
      }
    },
    { rootMargin: '200px' } // Load 200px before viewport
  );

  const placeholder = document.querySelector('.card-stack-placeholder');
  if (placeholder) observer.observe(placeholder);

  return () => observer.disconnect();
}, []);
```

Conditional render:
```javascript
{showCardStack ? <CardStackViewer /> :
  <div className="card-stack-placeholder" style={{minHeight: '100vh'}} />}
```

**Benefits:**
- Prevents loading 11 images until needed
- Defers complex component mounting
- Maintains layout with placeholder (no content jumping)

## Expected Performance Improvements

1. **Initial Load:**
   - From ~30 images to ~6 priority images
   - 80% reduction in initial image payload
   - Faster First Contentful Paint (FCP)

2. **Card Flip:**
   - Smoother animations with proper compositing layers
   - Reduced paint operations

3. **Stack Spread (Biggest Improvement):**
   - Component deferred until scroll
   - GPU-accelerated transforms with will-change
   - Hover effects use paint-only operations (box-shadow vs border-width)
   - 60fps animations expected

## Trade-offs

- Need to convert `<img>` to `<Image>` components
- Slight style adjustments for Image component constraints
- Add intersection observer logic to index page
- First-time users see placeholder briefly when scrolling to stack

## Verification

After implementation:
1. Test initial page load in Chrome DevTools Network tab - verify only ~6 images load initially
2. Scroll through masonry - verify images lazy load progressively
3. Flip cards - verify back images lazy load on first flip
4. Scroll to CardStackViewer - verify it mounts and loads images when near viewport
5. Spread stack to circular form - verify smooth 60fps animation
6. Hover over spread cards - verify smooth border/shadow effect

Performance metrics to check:
- Lighthouse Performance score (target: 90+)
- First Contentful Paint (FCP) - should improve significantly
- Cumulative Layout Shift (CLS) - should remain 0 with proper Image sizing
- Total page weight on initial load - should reduce by ~70-80%
