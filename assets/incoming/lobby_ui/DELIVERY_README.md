# Lobby UI source kit — order 33

26 PNG32 assets / 38 frames. Built-in ImageGen; warm honey/cream/plum direction from docs/art_orders/ref/33_lobby_ref_warm.webp. Exact final prompts and raw source hashes are in PROMPTS.json; final sizes, frame order, slice insets and SHA-256 in MANIFEST.json.

## Delivery contract

- Sources are 2x. Pack at50%; nineSlice insets are source pixels and must also be halved. All frame grids are explicit. BATTLE and arrows are vertical sheets; stars are vertical; shine is6x1; sparkle2x2.
- 2.33155MiB decoded after50%, below6MiB. Source-only: no new images are registered or loaded at boot. Follow order33 for runtime packing/Lobby lazy loading and fallback/tap tags.
- Icons have at least16px transparent margins. No image text. Currency plus, chevron and checkmarks are pictograms. Existing code draws labels, values, stage names and version.
- BATTLE has no Energy slot. Neutral cream flowers and honey only on reusable frames. Home's candy roof and Codex's berry bookmark are the explicitly requested icon subjects.
- Native painted endcaps remain fixed. Centers are uniform painted columns with transitions within protected caps. The small top-center stage star is omitted from the stretch texture: overlay a code-drawn four-point accent if desired, so it cannot stretch. Side star ornaments remain in protected endcaps.
- White12px on honey needs a dark1px outline. Dark brown #57300f is recommended for BATTLE. Plum panels support cream/white labels directly.
- Native-alpha shadows remain soft; power capsule alpha is85%. VFX have solid black background and require the existing brightness-derived alpha pipeline. Shine band is translated across6 equal cells; sparkle is centered with dim/medium/peak/medium progression.

## Verification

Run `python scripts/check-lobby-ui-source.py` from a checkout with Pillow, NumPy and DejaVu fonts. Checks all26 PNG streams and CRCs, sizes/frame grids, alpha, icon padding, SHA-256/bytes and decoded budget. Regenerates QA_REPORT.json and qa/ proofs.

The four page proofs are offline source-art compositions using actual stage_card_s01/s11 and card_momo, not browser screenshots or implemented runtime layout. They verify art fit at360x780 and412x915. Runtime interaction, load timing and phone FPS remain pending. Further QA:28/56px icon gallery, required stretch/text matrix, full state contact sheet. No gameplay simulation or runtime change was made.

UPLOAD_VERIFICATION.json records exact published bytes after upload. No claim that the game UI is already integrated.
