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

## Delivered

2026-11-23: 45 of 47 sheets / 360 frames delivered, every delivered sheet passes exact dimensions/grid, real RGBA alpha, nonempty distinct frames, >=4% transparent safety margins (at least 2px), and median silhouette height ratio 0.95–1.05. Reference attack/windup aliases are recorded separately from the asset count.

## Missing after two attempts

- e_ant_drone__attack8.png — ('height ratio', 0.9060402684563759); two generation attempts; not delivered.
- c24_equinox__attack8.png — ('height ratio', 0.9236453201970444); two generation attempts; not delivered.

Generation stops for these files under the owner’s two-attempt rule. Keep their existing atlas clips until a future approved fix. No failed PNG is included in the delivery. QA_REPORT.json contains all 47 outcomes, and PROMPTS.json includes the actual final attempt for both missing files.
