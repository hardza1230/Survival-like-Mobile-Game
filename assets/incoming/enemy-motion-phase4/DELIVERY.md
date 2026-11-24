# Phase 4 enemy animation source delivery

Date: 2026-11-23. Branch: asset-delivery/enemy-motion-phase4. Based on source delivery b44e1c87, with deploy v8.2.73 fetched before production.

Source files only. The original atlases, game.js, runtime art, tests and release files are unchanged.

## Coverage and integration notes

- The roadmap appendix has 54 action rows representing 43 unique source ranges. Each shared attack/windup range is delivered once, with both actions and their separate original/suggested rates in MANIFEST.json. Reuse that clip for the original aliases when wiring.
- Three additional loops cover Acid, Dasher and Siege. Acid uses the active e_acid_animated six-frame walk rather than the old fallback. Siege is the original cannon idle/charge/fire/recoil loop even though its movement-state alias is walk.
- MB5 uses its current boss_ink816 body as reference. The active idle is six frames inside the twelve-frame atlas; the new eight-frame idle clip is separate so wind/strike/recover frames stay intact. Its reference idle rate is six FPS, so the new recommended rate is eight FPS.
- Keep the ten four-frame fallback enemy sheets unchanged. The current _animated sheets take priority where available.
- Do not replace a whole multi-action atlas with one of these clips. sourceKey, sourceFile, sourceFrames and actions identify the old segment. Load the separate clip only for that action and return to the prior idle/walk texture afterward.
- Keep gameplay hit windows, windup duration, projectiles, damage, speed, radii and rewards unchanged when wiring. Suggested rates preserve the reference clip duration; attack and windup may intentionally use different rates for the same art.
- Ground line and height are measured from the existing source segment. One shared transform per generated sheet retains relative pose registration; bodyHeightRatio is the median alpha silhouette height ratio, including attached equipment/effects, rather than a semantic anatomy measurement.
- Preserve enemy facing, origin, display size, hitboxes, lazy loading and old visual fallbacks. No asset is registered or loaded at boot by this delivery.
- PREVIEW.gif uses normalized timing for comparison and does not prescribe runtime speed. Mechanical QA does not replace the owner's phone review of appearance and motion.

## Delivered — updated 2026-11-24

47 of 47 PNG32 sheets / 376 frames delivered. No missing files. All retain the original mechanical criteria: exact grid, real RGBA alpha, nonempty distinct frames, >=4% transparent margins per axis (minimum 2px), median reference silhouette-height ratio 0.95–1.05. Original 45 delivered PNG SHA256 values are unchanged.

## Final two corrective sheets

The initial 2026-11-23 delivery had two reported exceptions after two attempts. On 2026-11-24 the owner explicitly requested finishing the remaining art. A fresh corrective request re-posed the wing/arm spread instead of shrinking the bodies or lowering QA thresholds. Both passed on the first generation in this fix run (cumulative attempt3).

- e_ant_drone__attack8.png — bodyHeightRatio 1.0134, minimum empty margin 7px, 96px native cells. Attack and windup reuse the same eight poses with separate original/suggested rates.
- c24_equinox__attack8.png — bodyHeightRatio 1.0000, minimum empty margin 19px, 256px native cells.

PROMPTS preserves the previous failed prompt records under previousAttempt and records the exact successful corrective prompts. QA_REPORT contains 47 passing entries, retaining the two old failure reasons as history. Current status: delivered complete, awaiting code integration and owner phone review. Runtime art and game logic remain unchanged.
