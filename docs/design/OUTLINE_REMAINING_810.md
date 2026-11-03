# Remaining hero outline VFX — implemented in 8.1.10

Owner explicitly requested 2026-11-03: finish Chocolate → Taro → Yuzu (Companions and smallest Minions) → Strawberry without stopping between batches. Mint8.1.9 and Sesame8.1.7 already delivered. Preserve playable identities and existing gameplay/audio. Earlier phone review gate superseded; phone visual/FPS claims remain pending actual review.

## Delivered

| Hero | Selected sources | Clips / authored frames | Runtime bytes |
|---|---:|---:|---:|
| Chocolate |3|12 /72|3,625,238|
| Taro |2|8 /48|2,559,608|
| Yuzu |3|12 /72|4,196,614|
| Strawberry |3|12 /72|3,458,572|

Total11source atlases,44clips/264frames,13,840,032runtime bytes/69,206,016decoded bytes across all heroes. Only selected-hero art loads, always deferred at boot. Yuzu-specific fire/frost/lightning aliases reuse Cocoa/Mint/Taro images, no source duplication. Selected sources, exact prompts/reference roles, SHA256 manifests, alpha/border/distinct-frame QA and source-frame PNG/GIF previews live in assets/incoming/<hero>_outline810. Mechanical pack scripts generate assets/art/<hero>_outline810.

Chocolate: Titan landing/shockwave/rage/crater, fire fist/fireball/rocket/explosion, shadow fist/dash wake/ring/punch. Taro: angular arcs/hits/Spark/burst, Ball Lightning core/field, plasma and descending strike. Yuzu: Pomelo slam/peel/roll/guardian, Lime arrow/volley/pierce/trap, Blood Orange comet/sigil/bloom/honey. Minions get compact role-specific arrows/elemental shots and short fighter accents. Strawberry: sniper/pellet/seed impact, pinball, charged/normal seeds, Dash/bounce/link, muzzle/Berry Blast/scope.

## Runtime contracts

Battle-outline alias selection falls back to previous art when unavailable. Common six-frame clocks use existing gameplay dt and preserve original mapped clip periods, one completion event and loop ownership. Low/reduced holds a peak pose. Scene/player/basic/epoch changes and projectile pool cleanup destroy overlays. Taro strike remains bottom anchored, dash wakes left anchored. Yuzu retains its shared4-sprite/420px major FX cap; Minion hits3/120ms, projectile caps48/24 retained. Strawberry normal seed overlays share48effect budget. Existing character sprites, Taro sentry bodies and stack-count markers, functional Sniper aim guides and all combat geometry/damage/AI/cards/audio unchanged.

Production adapter tests verify assets, ownership, fallback, pause, event completion, hold/fade/pool semantics, Yuzu sixframes and role shots. Static real Canvas gallery exercises47texture routes/282loaded frames in six layouts; it does not run combat or judge appearance. Existing checks still apply. Owner phone review: one build per hero, major/compact scale, telegraph visibility, pause/Low/reduced and busy-scene FPS.
