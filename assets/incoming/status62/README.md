# Art order 62 — source delivery

17 final PNG32 assets: seven monster loops, six hero loops, three one-shots, and one 6×4 status-icon atlas with **19 occupied cells** (including Shock) and five empty cells. Source sheets have six equal frames in one horizontal row, 128px or160px as specified. No new Frozen loop: reuse the existing Mint freeze art at integration time.

`MANIFEST.json` contains exact hashes, dimensions, frame metadata, anchors and all19 icon subkeys. `PROMPTS.json` records17 separate built-in ImageGen calls; `REFINEMENTS.json` records two thinner-barrier edits. `sources/` preserves the selected unmodified ImageGen outputs. Only source art and the order-status row are delivered; no runtime assets/code/versions/registration changes.

Run `python assets/incoming/status62/prepare_sources.py` (Pillow + numpy) to reproduce mechanical packing and proofs. It removes donor grid gutters, preserves generated alpha (only near-invisible alpha≤3 noise becomes zero), packs row-major frames, and isolates icon beads by their largest opaque connected component to prevent neighboring-cell scraps. Mark/Stun are uniformly fitted into the overhead band. No replacement effects are drawn in code.

Black VFX stay opaque pure #000 here; proof conversion uses the existing max-RGB×1.35 alpha and straight-color convention. Transparent sheets retain their alpha. Body center is(0.5,0.5); the foot-ellipse reference point is(0.5,0.85), exposed separately in the manifest so the consumer can align it to actor feet. Avoid independently recentering individual animation phases.

`preview_monster.gif`, `preview_hero.gif` and `preview_oneshot.gif` composite the original ant48px, boss200px and Strawberry60px sprites on actual C1–C3 floors. They are **source-art proofs, not gameplay recordings**. Preview labels never appear in final art. `preview_icons_18_24.png` shows the actual18px/24px icon sizes. Five unused icon cells are alpha0.

`QA_REPORT.json` records per-frame center transparency and closing-loop deltas. Within the radius30% body-center disc, peripheral thin strokes occupy at most15.9% of pixels above35% alpha (max mean alpha13.62%); actor faces remain exposed in proofs. The largest loop closing-step/median-step ratio is1.5, with no growing intro/fading outro in loop sheets. Rendering budgets, lazy loading, status priorities, gameplay timing, stacking labels and fallback behavior remain integration work described in the art order. No Sesame work is included.
