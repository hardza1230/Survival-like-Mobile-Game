# 10 · Recipe Atlas Journey Map (art scope)

The system is done (v6.19.0) and runs on code-drawn placeholders. Drop PNG/WebP files into `assets/art/atlas/` and add them to `ASSET_IMAGES` under the same key. The code switches to the real art automatically.

## Map structure (for art reference)
- Bottom: **Mochitopia hub** (start point)
- Ring 1 **Kitchen** (5 nodes, Chapter 1 stages) · warm/candy tones
- Ring 2 **Garden** (5 nodes, Chapter 2 stages) · fermented garden, purple/green
- Ring 3 **Throne** (5 nodes, Chapter 3 stages) · ashen gold/dark crown
- Top: **Pinnacle — The Hunger Beneath** (final boss)
- Screen is portrait 390×844 (mobile); map panel is ~360×600

## Assets to make
| key | size | transparent | description |
|---|---|---|---|
| `atlas_map_bg` | 768×1280 | no (opaque) | Vertical paper/parchment map: three cream-colored ring bands stacked bottom to top (Kitchen → Garden → Throne), a dark crown in the clouds at the top, a candy town at the bottom. Do NOT draw nodes/lines (the code draws them) · leave the middle of each band mostly empty |
| `atlas_hub` | 256×256 | yes | Mochi house/town icon (start point) |
| `atlas_pinnacle` | 256×256 | yes | Dark, ominous crown/mouth of hunger, purple-gold |
| `atlas_node_clear` | 128×128 | yes | Round stamp plate, bright gold rim (cleared) |
| `atlas_node_open` | 128×128 | yes | Round plate, mint rim, soft glow (open, not yet cleared) |
| `atlas_node_locked` | 128×128 | yes | Round plate, grey with fog over it (locked) |

## Style
- Follow `00_STYLE_GUIDE.md` (cute mochi, 2.5D pastel)
- The node center must stay empty (the code puts the stage emoji on top)
- No text baked into the images (all names/numbers are drawn at runtime)

## Optional later
- Per-stage node icons `atlas_node_s00`..`s14` (128×128 transparent) · these need an extra code hook
