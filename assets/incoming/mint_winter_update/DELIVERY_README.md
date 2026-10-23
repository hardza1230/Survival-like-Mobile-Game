# Winter magic and Lobby dialogue — ImageGen delivery

Created23 October2026 using the built-in ImageGen tool. All four original generated RGBA images and exact prompts are retained in `raw/` and `PROMPTS.json`. No renderer or procedural shapes substitute for the generated art. Runtime packing only crops/registers source frames, resizes and encodes them.

| Runtime key | Art | Frames | Runtime dimensions |
| --- | --- | --- | --- |
| fx_mint_dash_shard | Mint-cyan crystal, glint and flowing icy ribbon |4|512×128 strip;128×128 cells |
| fx_mint_snowstorm | Stationary falling snow, crystals and curling ground wind |8|2048×256 strip;256×256 cells |
| lb_dialog_speech | Ivory/gold speech panel |1|512×256;64px nine-slice |
| lb_dialog_thought | Pale blue cloud thought panel |1|512×256;64px nine-slice |

Runtime WebPs total293,070 bytes; decoded3,407,872 bytes (~3.25MiB). `MANIFEST.json` records original/runtime hashes, crops, frame grids and registration. `QA_REPORT.json` records full decode, dimensions and real-alpha checks. GIFs preview the source art outside the game; owner phone visual/FPS review remains pending.

Integration v7.9.88: shard overlay preserves projectile body/damage/homing and pool cleanup. Snowstorm is one persistent sprite sampled from gameplay time;4s lifetime, eight damage pulses and all balance values stay unchanged. Ground wind is anchored at y78% of the source cell, separate from the exact gameplay boundary. Low VFX keeps the existing lightweight fallback. FX decode only on entering a Mint stage. Painted panels share the existing menu-lazy Lobby load and retain text/touch behavior.

Ruby36 already uses its delivered ImageGen art; early gear restrictions reuse existing equipment/Forge art. No duplicate Ruby or gear kit was needed for this update.

Reproduce packing: `python scripts/pack-mint-winter-art.py` (Pillow). All original generated PNGs remain unchanged.
