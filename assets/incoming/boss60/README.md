# Art order 60 — source delivery

20 final PNG32 assets: four opaque pure-black body-move flipbooks and 16 genuine-alpha, right-facing boss shots. Exact frame sizes, counts, byte lengths and SHA-256 hashes are in `MANIFEST.json`. `sources/` preserves the 20 separate, unmodified built-in ImageGen outputs. `PROMPTS.json` records the exact prompts; repository references were inspected visually, not supplied as image inputs.

Run `python assets/incoming/boss60/prepare_sources.py` from the repository root to reproduce packing and proofs (Pillow + numpy). This helper writes only inside this incoming directory. It crops/resizes/reorders generated images, without drawing replacement art. The VFX donor grids become single-row atlases; one common scale is used for every phase so growth/fading is retained.

## Integration handoff

- Deliverables are **not wired**. No runtime, gameplay, collision, registration or version changes are included.
- Body VFX stay opaque black here. Preview extraction matches the existing packer's **max RGB channel × 1.35** alpha and straight-alpha color recovery.
- **Skydrop frames 0–3 are low-gray shadow-density masks. Dark-tint these four frames separately after alpha extraction.** The GIF demonstrates this intended consumption; applying normal bright tint would show a light warning patch instead. Frames 4–7 use ordinary VFX extraction. Warning/impact timing remains the consumer's responsibility.
- All bullet noses face right. Preserve the painted dark rim and genuine alpha when making runtime WebPs. Shots are checked at the requested 60px display width.
- Deep violet/fuchsia and cranberry rose distinguish the requested purple/pink attacks from pale EXP drops and candy pickups. Ice/glass use horizontal pointed silhouettes rather than upright collectible diamonds.

`preview_body_moves_floor.gif` and `preview_bullets_floor.gif` are art composites on unchanged C1/C2/C3 stage floor textures, **not gameplay recordings or timing tests**. Labels exist only in proofs. Floor paths/hashes and complete decoding/dimension/alpha/cell-edge results are in `QA_REPORT.json`. `preview_alpha_128_60.png` also exposes every bullet edge on neutral gray at source and display size.
