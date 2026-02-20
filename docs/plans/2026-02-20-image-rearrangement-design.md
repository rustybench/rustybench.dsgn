# Portfolio Image Rearrangement Design

**Date:** 2026-02-20
**Goal:** Rearrange portfolio images to achieve visual symmetry and balance at the end of scroll

## Problem

The current masonry grid layout doesn't provide visual balance when scrolling to the bottom. The user wants the left and right columns to end at the same height, with the middle column standing slightly taller to create a centered peak effect.

## Analysis

### Current State
- 15 portfolio images distributed across 3 columns
- Column heights (based on aspect ratios):
  - Left: 7.28 units
  - Middle: 7.11 units
  - Right: 7.06 units
- No intentional symmetry in the layout

### Image Dimensions
Images vary in aspect ratio from 1.16:1 (EverCosmic) to 1.53:1 (8 tall images). This variation allows for precise height balancing across columns.

## Solution: Precise Mathematical Balance

Redistribute images to achieve:
- Left column: 6.91 units
- Middle column: 7.45 units (tallest, +7% above wings)
- Right column: 7.09 units
- Left/right asymmetry: only 2.6%

### New Arrangement

**Left Column (col: 1)** — 5 images, 6.91 units
1. Untitled I (IMG_0668.webp) - 1.53
2. Threads (Threads.webp) - 1.36
3. Untitled II (IMG_1039.webp) - 1.33
4. Keep Grading (KeepGrading.jpg) - 1.53
5. Ever Cosmic (EverCosmic.webp) - 1.16

**Middle Column (col: 2)** — 5 images, 7.45 units
1. Kikagaku (KikagakuFramed.webp) - 1.53
2. Suspended (SuspendedJPG.webp) - 1.33
3. Let It Be (LetitBe.webp) - 1.53
4. Floating Head (Floater.webp) - 1.53
5. The Mystic Tension (tmtNewsprint.webp) - 1.53

**Right Column (col: 3)** — 5 images, 7.09 units
1. Crippled Emotions (Crippled.webp) - 1.53
2. Hekate (Hekate.webp) - 1.36
3. Primordial (Primo.webp) - 1.33
4. Mystic Tension — Shirt (tmtShirt.jpg) - 1.53
5. Always Ace (AA.webp) - 1.34

## Implementation

### Scope
- Single file change: `data/pieces.js`
- Update `col` property for each image entry
- No changes to components, styling, or functionality

### Expected Outcome
- Visual symmetry when scrolling to bottom
- Left and right columns end at nearly equal heights
- Middle column creates subtle centered peak
- Masonry grid automatically reflows based on new assignments

## Trade-offs Considered

**Approach 1 (Selected): Precise Mathematical Balance**
- ✅ Achieves near-perfect left/right symmetry (2.6% difference)
- ✅ Clear middle prominence
- ✅ Optimal visual balance

**Approach 2: Minimal Middle Prominence**
- ❌ Larger left/right asymmetry (4.9% difference)
- ✅ More uniform overall appearance
- Not selected due to poorer symmetry

**Approach 3: No Change**
- ❌ No symmetry or balance improvements
- Not selected
