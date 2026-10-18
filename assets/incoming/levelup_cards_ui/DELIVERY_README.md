# Art order 23 — Level Up cards UI

20 PNG32 assets / 66 frames, covering every table row. The order summary originally said 19; its listed groups total 20. Built-in image_gen, one asset per call; exact prompts in PROMPTS.json. MANIFEST.json defines cell grids, states, 9-slice caps, tint masks and file hashes. C5 uses frameTintable [false,true].

UI has real alpha. VFX has opaque pure-black source for later luminance conversion. B2 backing alpha is 60%; C2/C3 and C5 frame 1 are exact grayscale. Nine-slice stretch axes are normalized while retaining generated corner artwork; text centers and overlay holes are canonicalized. E2 padding is cropped per cell. Generated raws remain preserved locally.

QA previews: QA_nine_slice.png, QA_tint_palettes.png and both source galleries. Technical contracts passed for all 20 files. White 11px contrast and exact corner identity recorded in QA_REPORT.json. Complete GitHub byte readback is recorded separately after publication.

Incoming art only. Runtime packing to ~1.5 MB, luminance-to-alpha conversion, animation timing, fallback behavior, unchanged hit areas and phone review belong to the integration step in the order. No game version change in this delivery.
