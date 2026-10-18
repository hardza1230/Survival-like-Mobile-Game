# Art order 24 — Pause UI

19 modular PNG32 assets /43 frames. Real alpha, 82% veil center with continuous vignette, no source lettering or digits. Built-in ImageGen; final prompts and source filenames in PROMPTS.json. Source grids, states, dimensions, byte lengths and hashes in MANIFEST.json /QA_REPORT.json. Reserved pause_icon_sheet frame15 is fully transparent. Play glyph is pause_icon_sheet frame1 (zero-based), not the loot sheet mentioned accidentally in the button table.

Native generated gradients and edge ornaments retained. Manifest 9-slice caps protect the resume circle and relic separator/star. Reference comparison and both no-scroll screen assemblies are QA previews only; runtime labels are separate overlays. UI components remain reusable at other sizes.

QA: all19 PNGs decoded and CRC/zlib validated; alpha/size/grid/hash contracts pass. Exact corner checks for panel heights90/150/220 and relic widths320/392 pass. White11px text readability reviewed. See QA_screen_412x860.png, QA_screen_360x780.png, QA_reference_comparison.png and QA_nine_slice_and_text.png. Complete GitHub raw byte readback follows publication.

Incoming artwork only. Runtime packing/lazy loading, layout wiring, unchanged _pauseBtns touch regions, landscape arrangement, fallbacks and phone review remain the integration step. Source PNG sizes are not the future ~1MB runtime WebP budget.
