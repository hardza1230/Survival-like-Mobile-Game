---
name: art-order
description: >
  Write a new Mochi Mayhem art order (docs/art_orders/NN_*.md) for the art AI: exact file
  list with keys, sizes, frame grids, on-screen size, what each image shows, delivery folder
  and MANIFEST fields, bans, and code notes for the AI that will wire it. Use when the owner
  asks for "ใบสั่งอาร์ต", "สั่งอาร์ต", "art order", "ทำรูปให้…", wants new art for a screen,
  hero, boss, VFX or story scene, or when a feature ships with placeholder visuals that need
  real art later. Not for wiring delivered art (use wire-art).
---

# Write an art order

An art order is the contract between the art AI (makes images, never sees game.js) and
the code AI (wires them later with the `wire-art` skill). The art AI only knows what the
order says, so it must be complete on its own: what each image is, exact size, frame grid,
where it shows and how big, what it must not contain. The code AI needs: keys, folder,
MANIFEST fields and which function/key the art replaces.

The order file is written in Thai (the owner reads it); keys, file names and prompts are English.

## 1. Gather before writing

- Read `docs/art_orders/00_STYLE_GUIDE.md` (world, ¾ top-down view, outlines, technical
  rules, base prompt) and the README table (`docs/art_orders/README.md`) for the next free
  number. Numbers are never reused (37 was cancelled and stays empty). If another session
  may be writing one, fetch the deploy branch first.
- Read the code that will show the art: find the current placeholder (emoji, canvas
  graphics, tinted generic sprite) and measure the real on-screen size (display width in px
  at 360×780), anchor, loop/once, timing, tint by code. Never guess sizes.
- Story/character art: check `docs/STORY_CANON.md`, `docs/CHARACTER_BIBLE.md`,
  `docs/art_orders/36_RUBY_MASCOT.md` (Ruby look) so characters stay on model.
- Reuse what exists: look in `assets/art/` and earlier orders; don't order art the game
  already has. Keep keys consistent with existing prefixes (`vfx_bNN_`, `lb_`, `tut_`, `ic_`,
  `cs_pup_`, `cs_fx_`, `bpx_<hero>_`…).
- Budget: boot GPU is full, so new art is stage- or menu-lazy. Estimate decoded size
  (w·h·4 per sheet after the usual 50% pack) and keep a batch reasonable (one screen ≈ <6 MiB
  decoded, a stage's VFX ≈ <1 MB WebP). Prefer sheets over many single images
  (README "กฎประหยัดโควต้า").

## 2. File skeleton (`docs/art_orders/NN_SHORT_NAME.md`)

Follow the shape of `38_TUTORIAL_UI.md` / `40_CHEST_SHOP.md` (small) or
`45_STORY_MOTION_COMIC.md` (big, batched):

```
# NN — <ชื่อชุด> · ใบสั่งงานอาร์ต

สถานะ: 🟡 รออาร์ต · เขียน <วันที่> · (โค้ดพร้อม vX ใช้ภาพชั่วคราว / ยังไม่มีโค้ด)
ส่งไฟล์ที่ `assets/incoming/<batch>/` พร้อม `MANIFEST.json`, `PROMPTS.json`, `QA_REPORT.json`
สไตล์ตาม `00_STYLE_GUIDE.md` · PNG32 alpha จริง · **ห้ามมีตัวหนังสือในภาพ**

## ระบบในเกม (อ้างอิง)        ← what the player does here, 2–5 lines, real in-game text if any
## ไฟล์ที่ต้องการ               ← one table per group A/B/C…
| ไฟล์ | ขนาด | ภาพ |        ← key.png · WxH or "N เฟรม × W (cols×rows)" · black bg? · what it shows · shown at Npx
**รวม N ไฟล์**
## ข้อห้าม                      ← no text, on-model rules, readability at the real size
## โน้ตฝั่งโค้ด                 ← function → key it replaces, loading class, fallback kept
## ส่งมอบ                       ← filled in by the art side when delivered
```

Per row, always state: exact pixel size and frame grid (frames equal size, left→right,
top→bottom, no gaps); loop or once; background (transparent alpha, or **solid black #000**
for glow VFX — code converts luminance to alpha); anchor/ground line for things standing on
the floor; 9-slice margins for stretchable panels (ask the art side to list them in
MANIFEST); the real on-screen size so it reads at that size; colours the code will tint
(draw those near-white/neutral).

## 3. MANIFEST expectations (say this in the order)

Each row: `key`, `file`, `bytes`, `sha256`, `width`, `height`, `frameWidth`, `frameHeight`,
`frameCount`, `columns`, `loop`, `anchor`, `background` (`transparent`/`black`), optional
`nineSlice` [l,t,r,b] and pivot points for puppets. Plus `PROMPTS.json` (exact prompts) and
`QA_REPORT.json` (alpha/size checks). The `wire-art` skill checks these.

## 4. Animation choices

- Short effects: flipbook strips (4–8 frames). Character idle: avoid full AI-redrawn frame
  loops — they "boil" (order 34 had to be turned off). Prefer one clean pose split into
  layers (body/head/arms/accessories with pivots) that code animates (sway, squash,
  bob), or keep frame-to-frame changes small with a fixed silhouette.
- Story scenes: layered motion-comic (background/mid/foreground + puppets + FX) per order 45.
- Every one-shot that returns to idle must start and end on the idle pose.

## 5. After writing

- Add a row to the README table (number, file, content, count, priority, 🟡 รออาร์ต).
- Add the order to CLAUDE.md "ถัดไป" (one line) and, if code already uses placeholders,
  say which vX has the hooks.
- Commit as docs-only (no version bump) via the `release` skill's Docs-only path.
- Tell the owner in Thai: what the order asks for (count, groups), where the art goes,
  and the one or two choices the owner should confirm (style reference, scope).
