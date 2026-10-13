# Forge UI atlas
Approved ImageGen source: assets/incoming/forge_ui/source-atlas.png.
Production atlas: assets/art/forge_ui/atlas.png.
Both reference the same immutable PNG blob; no image was regenerated.
RGBA 1448x1086, twelve frames. Frame rectangles are FORGE_UI_FRAMES in game.js.
Built-in ImageGen prompt: create a transparent 4x3 candy UI atlas, text-free pink/plum/mint buttons and badges, two plum panel states, and Odds/Target/Auto/Info icons, matching the owner-approved Forge mockups.
Controls use nine ordinary cropped Images: source cap40px, destination corner10px; panels cap44px/corner12px. Native text remains independent of images. Icon/image scales preserve their aspect ratio.
Menu-only loading and freeing are configured in MENU_GROUPS, LAZY_MENU_ART_RE and MENU_ONLY_RE.
