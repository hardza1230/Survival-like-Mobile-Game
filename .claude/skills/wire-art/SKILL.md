---
name: wire-art
description: >
  Integrate a delivered Mochi Mayhem art batch (assets/incoming/<batch>/ from an art order in
  docs/art_orders/) into the runtime: verify files against MANIFEST, write a
  scripts/pack-<batch>.py that packs WebP into assets/art/<batch>/, register keys
  (ASSET_IMAGES / ASSET_SHEETS / ASSET_FX / TEMPLE_UI), choose lazy loading (stage / menu /
  hero, never boot), hook the art into the game with the old visuals kept as fallback, add a
  regression test, then release. Use when the user says art arrived / was delivered / "อาร์ตมาแล้ว",
  "ผูกอาร์ต", "wire art order N", "ใส่รูปเข้าเกม", or asks whether a batch has arrived.
---

# Wire a delivered art batch

Art arrives as source PNG32 in `assets/incoming/<batch>/` with `MANIFEST.json` (key, file,
bytes, sha256, frame size/count/columns, loop, anchor, background, nineSlice…), usually
`PROMPTS.json`, `QA_REPORT.json`, `DELIVERY_README.md`. The order that requested it is
`docs/art_orders/NN_*.md` and its last section has the code notes (which function, which key,
how big on screen). Read both fully before touching code. Read the MANIFEST's real field
names — they differ between batches (array vs `{assets:[…]}`, `file` vs `source`).

Owner rules: owner checks visuals/FPS on the phone (no screenshots to judge looks, no
headless balance runs); English in-game text; talk in Thai. Sesame (HEROES_WIP) art wiring is
frozen unless the owner says otherwise.

## 1. Check the delivery

- Every MANIFEST row has its file; bytes + sha256 match. Report missing/mismatched files to
  the owner instead of packing partial work (unless the order says rows are optional).
- Compare against the order's table: count, keys, frame grids. Note anything the delivery
  notes flag (e.g. "key X is already used by …").

## 2. Pack script `scripts/pack-<batch>.py`

Copy the closest existing script and keep its style (short, asserts first):

| Kind | Copy from | Pipeline |
|---|---|---|
| UI pieces / icons / panels with alpha | `pack-chest-shop.py`, `pack-lobby-ui.py` | sha/bytes assert → resize (50% of the 2× source is usual) → WebP q86–90 |
| VFX on black background | `pack-boss-vfx-c3.py`, `pack-hero-vfx-gaps.py` | luminance alpha (max channel ×1.35, unpremultiply, <8 → transparent), NORMAL blend in game; prints ready `ASSET_FX` lines incl. `fill` bbox |
| Frame sheets / character motion | `pack-lobby-hero-motion.py`, `pack-ruby-comic.py` | per-frame resize, one row or the source grid, WebP q88 |
| Card / talent icons | `pack-card-icons-2.py`, `pack-talent-icons.py` | 256 → 128 WebP q90 |
| Already-WebP candidates delivered | `pack-book-opening-plus.py` | copy after bytes/sha check |

- Keep `.webp` keys = MANIFEST keys; output `assets/art/<batch>/<key>.webp`.
- Print size per file and the total; mention decoded size (w·h·4) for big sheets.
- Run it with `python3 scripts/pack-<batch>.py` (Pillow is installed). Never edit the
  incoming sources.

## 3. Register keys in game.js

- `ASSET_IMAGES.key:'assets/art/<batch>/key.webp'` for stills; `ASSET_SHEETS` for square
  character sheets (`{url,frame,anim}`); `ASSET_FX` for flipbooks
  (`{url,fw,fh,frames,rate,anchor[,loop,fill]}`); `TEMPLE_UI.key:[cellW,cellH,cols,nineSlice]`
  for 9-slice/cell UI used by `tuPanel/tuImg/tuFrames`.
- **URLs must be literal `'assets/…'` strings** — `scripts/build-www.mjs` only ships assets
  it finds quoted in game.js. Built strings like `'assets/'+k` don't get copied.

## 4. Loading class (never boot)

Boot GPU is full (~300 MB). New art must be lazy (`artClass` decides):

- **Stage art** (enemies, boss VFX, in-run FX): push keys into `STAGE_SHEETS[i]` (or the
  existing loops at the `vfx_bNN_` / `counter_cCN_` line), or a per-hero `bpx_<hero>_` prefix.
- **Menu art**: add the folder to `LAZY_MENU_ART_RE` and load on demand like
  `loadChestArt` (`CHEST_KEYS` + `realTex` check + `ensureGroup(...,{all:true,quiet:true})` →
  rebuild the screen when done; clear the busy flag in the callback so it reloads after
  `texEvict`). One-shot heavy art (e.g. book opening) can be removed after use.
- Do not touch `bootKeep` unless the owner asks; check `tests/gpu-memory-budget.test.cjs`.

## 5. Hook it in

- Find the hook named in the order's code notes; use existing helpers: `heroFx`,
  `spawnFxAnim`, `fxBurst`, `bossKit/kitSize/kitLane/bossSig`, `tuPanel/tuImg/tuFrames`,
  `menuRasterPanel`, `realTex(k)`.
- **Always keep the old visual as fallback**: `if(this.realTex(k)){ …new art… } else { …old code… }`
  (or the helper's own missing-texture return). Missing art must never crash or blank a screen.
- Don't change damage, hitboxes, radii, timings or rewards — art is a visual overlay. Match
  on-screen size to the old visual (ground ovals: `size = radius*2/.9`).
- Throttle/pool anything that can spawn per hit (existing caps like ≤N per 100ms); clean up
  sprites/tweens on stage end, menu rebuild and `_artEpoch` change.
- Remove/hide loaded heavy textures if the order or memory budget says so.

## 6. Test

Add `tests/<batch>-art.test.cjs` and append it to `npm run check` in package.json. Copy the
pattern of `tests/winter-art.test.cjs` / `tests/ruby-comic.test.cjs`:
- MANIFEST sha/bytes of sources + packed files exist (WebP RIFF header).
- Keys/URLs present in game.js, loading class is stage/menu (not boot).
- Hook uses the art when loaded and the fallback when not (method-extract into a vm context
  with stubs; globals used by extracted methods need `typeof X!=='undefined'` fallbacks).

## 7. Docs

- `docs/art_orders/README.md` status row → wired in vX.
- The order file: mark integrated + any deviations (skipped rows, size changes).
- CLAUDE.md "ถัดไป" line for that order → "ผูกแล้ว vX · รอ QA มือถือ".
- Delivery block in the release (what was packed, bytes, loading class, hooks, fallbacks).

## 8. Release

Use the `release` skill (version bump, CHANGELOG, CI checks, deploy). In the Thai report tell
the owner exactly where to look on the phone to see each new piece, and what to watch (FPS,
size, timing).
