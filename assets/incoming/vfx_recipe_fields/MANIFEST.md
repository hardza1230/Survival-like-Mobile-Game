# Recipe fields — VFX batch 4

Release v6.55.9. Eight transparent 320×320 PNG sources, matching lossless WebP runtime assets in assets/vfx. Generated together, split into independent images with 24px gutters. Upper-left lighting, candy 2.5D style; NORMAL blend.

| File | Runtime effect |
|---|---|
| recipe_shock.png | shock |
| recipe_burst.png | burst |
| recipe_freeze.png | freeze |
| recipe_sour.png | sour |
| recipe_cleanse.png | cleanse |
| recipe_burn.png | burn |
| recipe_hole.png | hole |
| recipe_immune.png | immune |

Pulse effects expand/fade for 360ms. Burning ground retains 3 seconds; pulling hole retains 2 seconds. Original damage, radius, freeze, pull and immunity values preserved. Tracked objects/tweens and recipe zones clear on run transitions. Automated checks and web build required; phone visual review pending.
