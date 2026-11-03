# Shared painted-outline battle VFX direction

Owner likes Sesame8.1.7 and asks whether the same linework/animation can cover Mint, Chocolate, Taro, Companions/Minions and other battle effects. This is the accepted visual direction and proposed delivery sequence. Implementation of the other hero art batches is pending; this document does not claim those assets exist.

## Reference and identity

Reference: assets/incoming/sesame_vfx817/preview.gif, the three original source PNGs and exact PROMPTS.json. Use original action-animation ink contours, sculpted elemental ribbons and clearly changing painted silhouettes. Keep Mochi Mayhem characters, candy fantasy, hero palettes and existing skill identities. This is a battle-effects family, not a redesign of the game or menus.

One readable sequence: anticipation → release/contact → residue/recovery. Authored shape changes must drive the animation; translation/rotation/scale support the frames. Dark outer contour, thinner inner lines, bright controlled core, colored body and restrained bloom. Keep protected/open centers for buffs. Place field layers behind actors and avoid opaque white overlays hiding characters. Boss danger cues retain their own priority and colors.

## Proposed batches

1. **Mint:** First batch implemented in8.1.9 (docs/design/MINT_OUTLINE819.md), owner phone review pending. Glacier Bloom becomes an ink-edged swirling snowstorm with falling ice, ground frost and a clear shatter finish. Crystal Impaler gets a pointed ice spear/trail, individual homing shard silhouettes and the final ice blast. Glacial colors stay white/cyan/deep navy; use angular ice cuts to distinguish it from Sesame's curling water. Preserve the existing player charge sprite animation rather than pasting a character PNG on top.
2. **Chocolate:** heavy Titan/Colossus landings use thick cocoa/cream impact arcs, short ground cracks and a widening dust ring. Rocket Gauntlet uses concentrated flame exhaust, chunky projectile silhouette and one readable explosion. Fire fists/Phantom Rush reuse the same impact language at smaller scale. Existing character/body moves remain recognizable.
3. **Taro:** angular lightning branches and clear hit nodes for chains, a contained spinning Spark/Ball Lightning core, controlled detonation, and compact sentry muzzle/beam/mark effects. Retain gold/violet electrical identity, distinct from Sesame flame/water.
4. **Yuzu Companions:** Pomelo gets heavy citrus impact crescents; Lime gets sharp green/gold arrow ribbons and a strong major-shot silhouette; Blood Orange gets bold fire/frost/lightning spell strokes. Large Companion skills receive the detailed animation.
5. **Minions and remaining battle effects:** simplify the Companion vocabulary into short small impacts, compact arrow/element bolts and restrained trails. Then audit Strawberry, enemy hits and boss effects for remaining style gaps. Small repeated attacks must not compete with hero Uniques or boss warning zones.

## Integration constraints

- VFX-only batches preserve damage, hitbox, duration, target selection, audio and authored attack-release timing. Any gameplay request is a separate explicit scope.
- Use existing clip timing/anchors where possible; choose frame count per motion rather than forcing every effect into the same grid. Typical large clips6–8 frames, small repeated effects3–4 frames. Source alpha and complete frame borders, exact prompts/manifests/previews retained.
- Hero/stage-lazy loading only, no boot additions. Reuse atlases and existing owned actor/flash/projectile budgets; no new per-hit timer storms. Pool repeated small effects and preserve pause/owner/epoch/death/shutdown cleanup, missing-art fallback and Low/reduced-motion behavior.
- Start with Mint as the representative ice/charge/field batch. Review its actual phone timing, clarity and FPS before expanding the remaining visual vocabulary. Contract tests can check frames, anchors, ownership and loading; they do not establish phone visual quality or performance.
