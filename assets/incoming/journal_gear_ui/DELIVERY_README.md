# Art order 27 — Journal Equipment / Affix Forge

Delivered 20 October 2026. **30 PNG32 sources / 69 atlas frames**, including the reserved transparent icon cell. Every named row A1–F2 in the order is present. The earlier total 33 was an arithmetic error (5+5+11+6+1+2 = 30).

- `MANIFEST.json`: exact source grids, per-frame dimensions, nine-slice caps, tintable frame indexes, hashes and recommended runtime frame sizes.
- `PROMPTS.json`: built-in ImageGen generation and correction prompts, source provenance, and technical crop/resize/packing notes. No procedural replacement artwork.
- `QA_REPORT.json`, `LAYOUT_CHECKS.json`: source checks and **offline art assemblies**, not runtime touch or layout certification.
- `previews/ASSET_GALLERY.jpg`: every delivered asset and state. `previews/SLICE_TINT_TEXT_QA.jpg`: panel heights 60/180/420, rows 300/392, five grade tints, 11px ink / 13px cream samples.
- `previews/equipment_360x800.png`, `equipment_412x915.png`, `forge_360x800.png`, `forge_412x915.png`: four offline assemblies using existing gear icons; preview text is drawn separately, never embedded in source art.
- `UPLOAD_VERIFICATION.json`: remote delivery byte proof after publication.

## Integration contract

Incoming art only; **runtime remains v7.9.9**. Pack to `assets/art/journal/` at **50% per-frame size**, WebP quality 85 or similar. Trial encoding totals about 0.39 MB; decoded allocation about **6.239 MiB**. Preserve frame boundaries when resizing sheets. Do not preload at boot: add only to the lazy gear/craft group through `equipmentAssetNeeded` / `menuGroupRe`.

Use the original order's mapping to `buildGear`, `_buildCraftBenchRaw`, `drawModCompare`, `forgeChrome`, `forgeButton`, `heroButton` and `drawAction`. Share the kit between both pages. Keep all existing hit zones and tags. Set paper text to one ink token `#3b2416`; selected wine rows and dark buttons use cream. Pale equipped pill uses ink. Keep the prior skin as fallback until needed textures are ready.

Nine-slice caps are **source pixels** per frame, ordered left/top/right/bottom. Scale caps uniformly to the intended display size (for the offline samples: min of target/source ratios and the base corner scale); reduce corner scale uniformly when a small panel would otherwise have negative center size. Do not stretch decorative corners, slice across atlas rows or use one cap scale for both a 1500px button and an 800px panel. `jr_btn_primary` left cap retains the empty icon socket; fill it with a separate runtime icon.

`jr_bag_cell` frame 0 has a neutral grayscale border and a warm dark well; `jr_star` frame 0 is neutral for tinting. Only frame 0 is tintable in those sheets. `jr_icon_sheet` order is the art-order order, zero-based 0–14, with cell 15 completely transparent. Pager states are normal/enabled/disabled, all point right; flipX for left.

Original owner references remain unchanged at [Equipment](../../../docs/art_orders/ref/27_equipment_ref.webp) and [Forge](../../../docs/art_orders/ref/27_forge_ref.webp). Neither full-page reference is a runtime texture replacement.

Pending after source delivery: runtime integration, fallback/load-lifecycle checks, no-scroll tests against real dynamic content, existing Forge regression suite and owner phone visual/FPS review.
