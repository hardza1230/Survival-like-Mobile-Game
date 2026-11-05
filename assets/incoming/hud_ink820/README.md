# Compact ink battle HUD

Original transparent ImageGen atlas and actual prompt/provenance are retained. Four source-derived assets and runtime WebP skins replace existing HUD keys; no baked text or numbers. The source is mechanically trimmed at alpha-clear cuts, uniformly halved and packed without masks or repainting. QA records source rectangles, source/output hashes and decoded size. `preview.png` shows the source art on #261e30.

The live fluid, HP colors, values and progress are drawn by game code and are not baked into these images. All four skins remain stage-only. See `docs/design/BATTLE_HUD_820.md` for layout and verification.
