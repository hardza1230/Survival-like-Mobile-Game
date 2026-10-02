# 11 · Mochi Delve — infinite map (art order)

Replaces 10_ATLAS_MAP once v6.32 lands. Every key below has a code-drawn placeholder,
so the game is playable before any art arrives. Drop files into `assets/incoming/delve/`;
the code side converts/moves them to `assets/art/delve/` and adds them to `ASSET_IMAGES` under the same key.
Follow `00_STYLE_GUIDE.md` (cute mochi, 2.5D pastel). **No text baked into images.**

## How the map looks (reference for the artist)
- Portrait phone screen 390×844; map panel ≈360×600, pans/zooms freely.
- **Mochitopia** at the very top (depth 0). The world goes **down forever** = deeper = harder.
- **Left/right = flavor biomes** (wide vertical bands that curve slowly):
  🌶 Spicy · ❄️ Frosty · 🍬 Sweet · 🍋 Sour · 🍄 Fermented
- Nodes sit irregularly (not a neat grid), joined by winding tunnels. Fog hides far nodes.
- Every 10 floors: a single **Boss floor** node all paths funnel into. Rare **Candy City** landmarks.

## Assets — priority 1 (needed for the map to look finished)
| key | size | alpha | description |
|---|---|---|---|
| `delve_bg_spicy` | 1024×1024 | no | Chili-red cavern rock, ember cracks, warm glow. **Seamless top↔bottom** (tiles vertically). Low detail/contrast in the middle — nodes are drawn on top |
| `delve_bg_frosty` | 1024×1024 | no | Pale-blue ice cave, frosted sugar crystals. Seamless vertically |
| `delve_bg_sweet` | 1024×1024 | no | Pink candy/frosting cave, sprinkles in rock. Seamless vertically |
| `delve_bg_sour` | 1024×1024 | no | Lemon-yellow/green citrus cave, juicy drips. Seamless vertically |
| `delve_bg_fermented` | 1024×1024 | no | Purple-green mushroom/mold cave, soft spores. Seamless vertically |
| `delve_node_normal` | 256×256 | yes | Round stone plate, thick rim, empty center (code places icons on it). Must read clearly at 40px |
| `delve_node_vault` | 256×256 | yes | Gold treasure-chest plate |
| `delve_node_shrine` | 256×256 | yes | Small candy shrine plate, soft halo |
| `delve_node_elite` | 256×256 | yes | Dark plate with red spikes/skull motif |
| `delve_node_city` | 256×256 | yes | **Candy City** landmark: tiny mochi town on a plate, festive, must stand out from far away |
| `delve_node_boss` | 256×256 | yes | Big crown/maw plate, purple-gold, ominous (shown 1.4× larger) |
| `delve_home` | 512×512 | yes | **Mochitopia** — cozy mochi village on a floating plate, top of the map |

## Priority 2 (polish)
| key | size | alpha | description |
|---|---|---|---|
| `delve_fog` | 512×512 | yes | Soft dark fog/cloud, seamless on all edges, used as overlay on unexplored areas |
| `delve_path` | 64×256 | yes | Tunnel/rail strip, seamless along the long axis (code stretches it between nodes). Optional — code draws lines otherwise |
| `delve_cleared_mark` | 128×128 | yes | Small gold stamp/flag placed on cleared nodes |

## Priority 3 (later, optional)
- Boss-floor cards `delve_bossfloor_<flavor>` 768×432 opaque, one per flavor (shown in the prep screen).

## Example prompt (adapt per key)
> "Cute 2.5D pastel game asset, mochi candy world, round stone map node plate with thick rim and empty center, soft shading, transparent background, centered, no text, mobile game icon style"
> Backgrounds: "...seamless vertical tiling cave wall texture, top and bottom edges match, low contrast center, no characters, no text"

## Delivery & checklist
- Files: `assets/incoming/delve/<key>.png` (+ `MANIFEST.md` listing key, size, notes).
- Check: exact size · real alpha (no checkerboard baked in) · backgrounds tile vertically with no seam ·
  node icons readable at 40px on all 5 backgrounds · centers of node plates empty · no text.
