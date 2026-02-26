# Unified Card Back Design

**Date:** 2026-02-26
**Status:** Approved
**Approach:** CSS Background Position

## Overview

Implement a unified design system for the card backs in the main masonry gallery. When cards are flipped, their backs will display portions of two unified images (01.webp and 02.webp) that piece together to create a cohesive visual design across the gallery.

## User Requirements

- Main masonry grid (15 images) should have flippable cards
- Click individual images to flip them in place
- Card backs show portions of unified design images
- Upper cards display slices of 01.webp
- Lower cards display slices of 02.webp
- The unified design reveals itself as more cards flip

## Technical Approach

### Selected: Approach 1 - CSS Background Position

Use 01.webp and 02.webp as background images with calculated `background-position` values to show the correct slice for each card.

**Advantages:**
- Simple and performant
- No additional image files needed
- Easy to adjust and fine-tune
- Flexible for layout changes

**Alternatives considered:**
- Pre-sliced image tiles (more files, less flexible)
- Canvas-based slicing (unnecessary complexity)

## Architecture

### Data Flow

1. `pages/index.js` calculates each card's position (0-14)
2. Pass position data to `Card` component
3. `Card` determines background image and position
4. Apply calculated styles to `.card-back`

### Position Calculation

```
Total cards: 15
- Indices 0-7 (8 cards) → 01.webp
- Indices 8-14 (7 cards) → 02.webp
```

### Background Positioning Strategy

For each group:
- Use `background-size: cover` to fill card back
- Calculate `background-position-y` as percentage
- Formula: `(cardIndex / (groupSize - 1)) * 100%`
- Distributes image evenly across group

## Implementation Details

### Files to Modify

1. **pages/index.js**
   - Flatten pieces array to get global indices
   - Pass `cardIndex`, `totalCards`, and `backImage` props to Card

2. **components/Card.jsx**
   - Accept new position props
   - Calculate background styling based on position
   - Apply to `.card-back` element

3. **styles/globals.css** (if needed)
   - Adjust card-back styles for new background approach

### Card Component Changes

**New props:**
- `cardIndex`: Number (0-14) - card's position in gallery
- `totalCards`: Number (15) - total cards in gallery
- `backImage`: String ('01' or '02') - which unified image to use

**Background calculation:**
```javascript
const groupSize = backImage === '01' ? 8 : 7;
const indexInGroup = backImage === '01' ? cardIndex : cardIndex - 8;
const backgroundPositionY = (indexInGroup / (groupSize - 1)) * 100;
```

### Styling Changes

**Remove:**
- Blurred background image of front artwork
- "future mock-up" text overlay (experimental - can keep if desired)

**Keep:**
- "close" hint for UX
- Flip animation and interaction
- Card structure and dimensions

**Add:**
- Background image (01.webp or 02.webp)
- Calculated background-position styling

## Edge Cases & Considerations

### Visual Behavior
- Individual flipped cards show abstract portions
- Design becomes clear as more cards flip
- Consider adding "flip all" hint (future enhancement)

### Responsive Design
- Percentage-based positioning should adapt to screen sizes
- Test on mobile where grid may reflow differently
- May need adjustments for different aspect ratios

### Future Flexibility
- Easy to change card distribution (8/7 split)
- Simple to swap unified design images
- Could add "flip all" button feature later
- Could add animation when certain number of cards flip

## Assets

**Required images:**
- `/public/images/backside/01.webp` ✓ (exists)
- `/public/images/backside/02.webp` ✓ (exists)

## Success Criteria

- ✓ Cards flip on click (already works)
- Cards display correct portion of unified design
- Upper 8 cards show portions of 01.webp
- Lower 7 cards show portions of 02.webp
- Background positions align to create cohesive design
- No performance degradation
- Works on mobile and desktop

## Next Steps

1. Implement position calculation in index.js
2. Update Card component with new props
3. Calculate and apply background styling
4. Test visual alignment of unified design
5. Adjust positioning if needed
6. Test responsive behavior
7. Consider removing or keeping "future mock-up" overlay
