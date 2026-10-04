# VFX art batch 2 — charge, wind and shield

Created and integrated 4 Oct 2026, runtime v6.55.7.

| PNG | Size | Runtime WebP | Usage |
|---|---|---|---|
| strawberry_charge_aura.png | 512×512 | assets/vfx/strawberry_charge_aura.webp | Sniper pre-shot flash and held Unique halo |
| strawberry_wind_cut.png | 768×256 | assets/vfx/strawberry_wind_cut.webp | Released Unique wind ribbon, rotates to shot angle |
| shell_bubble.png | 512×512 | assets/vfx/shell_bubble.webp | Protective bubble, follows player and hides at zero stacks |

Built-in imagegen prompts: a pink empty-center strawberry candy charge halo; a narrow horizontal pink/cream wind-cut ribbon; a translucent cyan bubble with glossy upper-left highlights and transparent center. All isolated on real transparent backgrounds without characters or labels. Production assets resized and encoded as WebP; PNGs retained here. NORMAL blend; opacity restrained on the shield to keep the character visible. No combat timing, damage or collision geometry changes.

Batch 1 is integrated in the same release. Shatter/Gale sheets remain 1280×640, 4×2 of 320px cells, eight frames, 20fps. Projectile overlays retain original collider geometry and pool cleanup.

Verified: source/runtime decoding, alpha, sheet size; automated charge cancellation, shield reuse/hide, wind art and transition cleanup; full check suite and web build. Device visual/performance review remains pending.

Remaining: batches 3–5, as recorded in ../vfx_mint/NEXT_BATCHES.md.
