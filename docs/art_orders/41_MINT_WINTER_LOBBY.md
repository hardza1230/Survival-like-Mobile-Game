# 41 — Mint winter magic and Lobby bubbles

Status: generated with built-in ImageGen and integrated in v7.9.88 on23 October2026; owner phone visual/FPS review pending.

Four assets /14 frames replace presentation added in v7.9.87: four-frame homing Crystal Impaler dash shard, eight-frame stationary Glacier Bloom snowstorm, painted speech and thought nine-slice panels. Ruby36 is already integrated; gear level limits use existing Forge art.

Source: `assets/incoming/mint_winter_update/`. Exact prompts: `PROMPTS.json`. Original generated RGBA images: `raw/`. Manifest, QA report, normalized PNG strips/panels and offline GIFs retained. See `DELIVERY_README.md` for frame dimensions, lazy-loading behavior, measured memory and runtime paths. Pack with `scripts/pack-mint-winter-art.py`.

The snowstorm preserves the generated alpha and empty center, anchored at its ground-wind center. Runtime samples frames from gameplay time and preserves all v7.9.87 damage, freeze, knockback, lifetime and shard-distance values. Low VFX and missing-asset fallbacks remain available.
