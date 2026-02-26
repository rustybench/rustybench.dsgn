# Unified Card Backs Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace card back designs with portions of unified images (01.webp/02.webp) that piece together across the gallery.

**Architecture:** Calculate each card's global position in the masonry grid, pass position data to Card component, use CSS background-position to display the correct slice of unified images.

**Tech Stack:** Next.js, React, CSS background-position

---

## Task 1: Update index.js to pass position data

**Files:**
- Modify: `pages/index.js:68-81`

**Step 1: Calculate global card positions**

Add position calculation before the return statement in pages/index.js:

```javascript
// Calculate global positions for unified back design
const allPieces = [...col1, ...col2, ...col3];
const getCardPosition = (file) => {
  return allPieces.findIndex(p => p.file === file);
};
```

Expected: Helper function that returns 0-14 for each card based on its file.

**Step 2: Update Card components to receive position props**

Modify the Card components in the masonry columns to pass new props:

```javascript
<div className="col" ref={colRefs[0]}>
  {col1.map((p, index) => {
    const globalIndex = getCardPosition(p.file);
    const backImage = globalIndex < 8 ? '01' : '02';
    return (
      <Card
        key={p.file}
        title={p.title}
        file={p.file}
        isPriority={index < 2}
        cardIndex={globalIndex}
        backImage={backImage}
      />
    );
  })}
</div>
```

Apply the same pattern to col2 and col3.

**Step 3: Verify in browser**

Run: Development server should already be running
Action: Open browser DevTools, inspect Card components
Expected: See cardIndex (0-14) and backImage ('01' or '02') props passed to Cards

**Step 4: Commit**

```bash
git add pages/index.js
git commit -m "feat: pass position data to Card components for unified backs"
```

---

## Task 2: Update Card component to calculate background styling

**Files:**
- Modify: `components/Card.jsx:6-91`

**Step 1: Accept new props in Card component**

Update the Card function signature:

```javascript
export default function Card({ title, file, isPriority = false, cardIndex = 0, backImage = '01' }) {
```

Expected: Component now receives cardIndex and backImage props.

**Step 2: Calculate background position**

Add calculation after the existing useEffect, before the return statement:

```javascript
// Calculate background position for unified back design
const groupSize = backImage === '01' ? 8 : 7;
const indexInGroup = backImage === '01' ? cardIndex : cardIndex - 8;
const backgroundPositionY = groupSize > 1
  ? (indexInGroup / (groupSize - 1)) * 100
  : 50;

const backStyle = {
  backgroundImage: `url(/images/backside/${backImage}.webp)`,
  backgroundSize: 'cover',
  backgroundPosition: `center ${backgroundPositionY}%`,
  backgroundRepeat: 'no-repeat'
};
```

Expected: Each card calculates its unique background position (0-100%).

**Step 3: Apply styling to card-back**

Update the card-back div to use the calculated style:

```javascript
<div className="card-back" ref={backRef} style={backStyle}>
  {/* Remove the blurred background Image component */}
  <span className="return-hint">close</span>
</div>
```

Remove the entire Image component with className="back-blur" (lines 108-117).
Remove or keep the .future-overlay div (lines 118-122) - let's remove it for now to see the unified design clearly.

**Step 4: Test in browser**

Run: Development server should reload automatically
Action:
1. Click on a gallery image to flip it
2. Check if background image appears
3. Flip multiple cards to see if design pieces together

Expected: Card backs show portions of 01.webp or 02.webp based on position.

**Step 5: Commit**

```bash
git add components/Card.jsx
git commit -m "feat: implement unified back design with CSS background-position"
```

---

## Task 3: Clean up and adjust card-back styling

**Files:**
- Modify: `styles/globals.css` (find .card-back section)

**Step 1: Review current card-back styles**

Action: Read the .card-back CSS section in globals.css
Expected: See existing styles for the back face of cards.

**Step 2: Ensure card-back allows background images**

Verify or add these properties to .card-back:

```css
.card-back {
  /* existing styles... */
  position: relative;
  width: 100%;
  height: 100%;
  /* Remove any background-color that might obscure the image */
  /* Ensure overflow: hidden to contain the background */
  overflow: hidden;
}
```

**Step 3: Remove or update future-overlay styles**

If future-overlay styles exist and we removed the element, consider removing or commenting out those styles:

```css
/* .future-overlay {
  ... commented out for unified back design ...
} */
```

**Step 4: Test visual appearance**

Action: Flip several cards in browser, check visual quality
Expected:
- Background images fill the card back properly
- No visual artifacts or gaps
- "close" hint remains visible

**Step 5: Commit**

```bash
git add styles/globals.css
git commit -m "style: update card-back styles for unified design"
```

---

## Task 4: Test and refine background positioning

**Files:**
- Potentially adjust: `components/Card.jsx` (background calculation)

**Step 1: Visual alignment test**

Action: Flip all cards in the gallery (or as many as possible)
Check:
1. Do upper 8 cards show portions of 01.webp?
2. Do lower 7 cards show portions of 02.webp?
3. Does the design feel cohesive across cards?
4. Are there any obvious misalignments?

Expected: Unified design should be recognizable across flipped cards.

**Step 2: Adjust positioning if needed**

If cards don't align well, experiment with background-size:
- Try `background-size: 'auto 100%'` instead of `'cover'`
- Or try `background-size: '100% auto'`
- Adjust background-position formula if needed

Example adjustment:

```javascript
const backStyle = {
  backgroundImage: `url(/images/backside/${backImage}.webp)`,
  backgroundSize: '100% auto', // or 'auto 100%' or keep 'cover'
  backgroundPosition: `center ${backgroundPositionY}%`,
  backgroundRepeat: 'no-repeat'
};
```

**Step 3: Test on different viewport sizes**

Action: Resize browser window, test mobile viewport
Expected: Background positioning should adapt due to percentage-based values.

**Step 4: Commit any adjustments**

```bash
git add components/Card.jsx
git commit -m "refine: adjust background sizing for better alignment"
```

---

## Task 5: Polish and final testing

**Files:**
- Review all modified files

**Step 1: Check "close" hint visibility**

Action: Flip cards and verify "close" hint is visible and functional
Expected: White "close" text should be readable against unified background.

**Step 2: If needed, add contrast to close hint**

If visibility is an issue, update Card.jsx close hint styling:

```javascript
<span className="return-hint" style={{
  textShadow: '0 0 10px rgba(0,0,0,0.8)'
}}>close</span>
```

Or add to globals.css:

```css
.return-hint {
  text-shadow: 0 0 10px rgba(0,0,0,0.8);
}
```

**Step 3: Test flip interaction**

Action: Test clicking cards to flip/unflip multiple times
Expected:
- Smooth flip animation
- Background appears correctly on each flip
- No performance issues

**Step 4: Verify all 15 cards**

Action: Systematically flip each of the 15 gallery cards
Check: Each shows a unique portion of the unified design
Expected: No duplicate positions, no missing slices.

**Step 5: Final commit and test**

```bash
git add .
git commit -m "polish: finalize unified card back feature"
```

Run: Full manual test of entire gallery
Expected: Feature complete and working smoothly.

---

## Success Criteria Checklist

- [ ] All 15 cards receive correct position data (0-14)
- [ ] Upper 8 cards (0-7) use 01.webp as background
- [ ] Lower 7 cards (8-14) use 02.webp as background
- [ ] Each card shows a unique portion of its assigned image
- [ ] Background positioning creates cohesive unified design
- [ ] Flip animation works smoothly
- [ ] "close" hint remains visible and functional
- [ ] No console errors
- [ ] Works on desktop and mobile viewports
- [ ] Git history shows clean, atomic commits

---

## Notes

- If unified design doesn't look cohesive, may need to adjust background-size or positioning formula
- Consider adding "flip all cards" button in future iteration
- Could add hover hint like "flip to reveal unified design"
- The 8/7 split can be easily adjusted if user wants different distribution
