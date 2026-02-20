# Portfolio Image Rearrangement Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rearrange portfolio images to achieve visual symmetry with left/right columns balanced and middle column standing taller

**Architecture:** Single data file update to redistribute images across three masonry columns based on calculated aspect ratios

**Tech Stack:** Next.js 14, JavaScript data file

---

## Task 1: Update Column Assignments

**Files:**
- Modify: `data/pieces.js:1-17`

**Step 1: Read current pieces.js**

Verify current structure and column assignments.

Run: `cat data/pieces.js`

**Step 2: Update column assignments for balanced layout**

Replace the entire pieces array with the new balanced arrangement:

```javascript
export const pieces = [
  // Left Column (col: 1) - 6.91 units
  { title: "Untitled I",             file: "IMG_0668.webp",       col: 1 },
  { title: "Threads",                file: "Threads.webp",        col: 1 },
  { title: "Untitled II",            file: "IMG_1039.webp",       col: 1 },
  { title: "Keep Grading",           file: "KeepGrading.jpg",     col: 1 },
  { title: "Ever Cosmic",            file: "EverCosmic.webp",     col: 1 },

  // Middle Column (col: 2) - 7.45 units (tallest)
  { title: "Kikagaku",               file: "KikagakuFramed.webp", col: 2 },
  { title: "Suspended",              file: "SuspendedJPG.webp",   col: 2 },
  { title: "Let It Be",              file: "LetitBe.webp",        col: 2 },
  { title: "Floating Head",          file: "Floater.webp",        col: 2 },
  { title: "The Mystic Tension",     file: "tmtNewsprint.webp",   col: 2 },

  // Right Column (col: 3) - 7.09 units
  { title: "Crippled Emotions",      file: "Crippled.webp",       col: 3 },
  { title: "Hekate",                 file: "Hekate.webp",         col: 3 },
  { title: "Primordial",             file: "Primo.webp",          col: 3 },
  { title: "Mystic Tension — Shirt", file: "tmtShirt.jpg",        col: 3 },
  { title: "Always Ace",             file: "AA.webp",             col: 3 },
];
```

**Step 3: Verify syntax**

Run: `node -c data/pieces.js`
Expected: No output (syntax valid)

**Step 4: Visual verification**

If dev server is not running:
Run: `npm run dev`

Open browser to dev server URL (likely http://localhost:3004 or check console output)

Scroll to bottom of page and verify:
- Left column ends with "Ever Cosmic" (shortest image)
- Middle column extends beyond, ending with "The Mystic Tension"
- Right column matches left height, ending with "Always Ace"
- Visual symmetry achieved with centered peak

**Step 5: Commit changes**

```bash
git add data/pieces.js
git commit -m "$(cat <<'EOF'
feat: rearrange portfolio images for visual balance

Redistributes 15 images across 3 columns to achieve:
- Left/right columns at equal heights (2.6% variance)
- Middle column standing 7% taller
- Centered peak composition when scrolling to bottom

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
EOF
)"
```

Expected: Clean commit with data/pieces.js modified

---

## Completion Checklist

- [ ] Column assignments updated in data/pieces.js
- [ ] Syntax validated with node -c
- [ ] Visual symmetry verified in browser
- [ ] Changes committed to git

## Testing Notes

This is a pure data/configuration change with no logic to unit test. Verification is visual:
1. All 15 images should still appear
2. Each image should be in its assigned column (1, 2, or 3)
3. Bottom of columns should show balanced heights with middle tallest

## Rollback Plan

If the visual balance is not satisfactory:
```bash
git revert HEAD
```

Then adjust column assignments based on user feedback.
