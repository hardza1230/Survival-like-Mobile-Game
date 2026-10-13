# Recovery completed — v7.8.3

This checkpoint is superseded by docs/FORGE_SINGLE_SCREEN.md. The original ImageGen atlas was reused; candidate reconstruction, full checks/build, 21 real-browser UI cases and deployment succeeded. The checkpoint below is historical.

# Affix Forge single-screen implementation checkpoint

Owner approved the three mockups and detailed plan on 13 Oct 2026, then requested completing and checking each step in order.

## Confirmed
- ImageGen production atlas generated and inspected: 12 transparent UI sprites (primary, secondary, choice, equipped, chip, chip_on, panel, panel_on, odds, target, auto, info).
- Atlas processing inspected as a contact sheet; packed sprites total 420,820 bytes.
- Geometry checked at 320x568, 360x640, 390x844, 430x932, 691x1536, 768x1024 and 844x390.
- 390x844 geometry: header 8/48, slots 64/52, owned items 124/62, summary 194/64, mods 268/214, pool 492/246, footer 748/82.
- Candidate renderer and action tests passed for seven viewport sizes, row selection, locks, pending Sustain choices, sparse mods, tracked targets, inventory paging, Equip and modal isolation.
- Existing Forge 150 economy/migration/runtime tests passed against candidate.

## Blocking environment failure
After initiating final compact-layout refinements and npm run check, the exec-server transport disconnected. Subsequent command and file reads did not return. Full validation and live visual QA are NOT confirmed. No candidate runtime code was deployed. The current runtime stays v7.8.2.

## Recovery
Source atlas is assets/incoming/forge_ui/source-atlas.png (RGBA 1448x1086).
The uncommitted candidate was in scratch game/game.js, tests/forge-redesign.test.cjs, tests/menu-scroll-layout.test.cjs, scripts/pack-forge-ui.py and assets/art/forge_ui/. Check whether these survived before reconstructing; do not regenerate the atlas.

Packing regions in source coordinates:
primary (30,136,374,311); secondary (379,136,724,311); choice (727,136,1077,311); equipped (1094,166,1422,285);
chip (30,469,374,600); chip_on (379,469,724,600); panel (728,384,1081,679); panel_on (1082,384,1430,679);
odds (88,778,334,1013); target (408,751,695,1040); auto (781,776,1025,1008); info (1131,772,1378,1020).
Keep alpha-connected components above alpha160 with area>500; dilate 2px to preserve antialiasing, trim to alpha bounds and export lossless WebP. Preserve original source. Nine-slice using nine ordinary cropped Images, not WebGL-only Phaser NineSlice. Source edge40px for controls /44px for panels; destination corner10px /12px.

## Candidate design / implementation
- forgeLayout / forgeTierRange are pure helpers before Currency block.
- forgeChrome / forgeText / forgeIcon / forgeButton draw raster controls and native NunitoUI text.
- forgeResetPick / forgeSelectItem / forgeOpenPanel manage menu state.
- _buildCraftBenchRaw replaces old tall renderer; drawForgePanel hosts paginated Odds, details, families, gear and compact Sustain choices.
- Use real equipped instance UID for mint tags, pink outline for selected item.
- Current Tier band is read from actual mod.tiers, not mockup values.
- Three items per page with paging in the same strip, real pool paging and tracked targets retained.
- Family pages six at a time; compact screens use a family panel in the same route.
- Possible results are 44px rows, at most capacity allowed by pool rectangle.
- Sustain choice replaces result pool; very short pool opens two paid choices in a panel.
- _screenBg optional fourth drawHeader=false for Forge custom compact header.
- setupMenuScroll('craft') must reset to zero, unlike gear/other long menus; retain scrolling tests for gear and add explicit Forge non-scroll assertion.
- Register fg_ui_* assets, menu group and lazy classification; include existing hr_ic_melee/control/precision in equipment asset selection.
- Existing crafting costs, saves, Roulette and Auto Stop logic remain; runtime catalog stays 150/78 active/72 gated.

## Pending
- Confirm final refinements applied (compact profile h<680, landscape slots36/summary44/mods164, Utility header24 to fit two rows, result highlights for Sustain/Tier).
- Read final test log; resolve any failure.
- Render and inspect actual menu in all three states, verify real font bounds and all button hit areas.
- npm run check and npm run build:www.
- Add final delivery/handoff docs, bump GAME_VERSION and changelog.
- Commit and push vampire branch with expected-head lease; verify Pages and live version.
