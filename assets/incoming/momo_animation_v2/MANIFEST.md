# Momo animation v2 — review prototypes

Five generated images were split into fixed 128×128 frames at a common scale per action. This batch is for visual review and is not connected to the game runtime.

| Action | Frames | Layout | Review |
|---|---:|---|---|
| Idle | 8 | 4×2 | Clean cell edges; subtle breathing/blinks |
| Run | 12 | 4×3 | Clean cell edges; check loop cadence in preview |
| Attack | 8 | 4×2 | Pink shot effect crosses the row-two first vertical boundary; needs cleanup before runtime |
| Dash | 8 | 4×2 | Motion streak crosses the row-two first vertical boundary; needs cleanup before runtime |
| Hurt | 8 | 4×2 | Clean cell edges; visible hit and recovery |

Each `momo_<action>_<count>f.png` is a sprite sheet. Each matching GIF is an animation preview. The original generated sheets remain in the conversation's generated images; runtime `char_momo` remains unchanged.
