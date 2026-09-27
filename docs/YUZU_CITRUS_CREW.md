# Yuzu · Citrus Crew (v5.87)

Yuzu is the fifth story fighter, unlocked on clearing C2-5. Sesame is now a secret fighter: saves that already own Sesame retain the character, progress, equipment, talents and selection. New C2-5 clears unlock Yuzu instead. The existing Sesame data and combat code remain intact.

## In a run

- Signature Basic Attack: two invulnerable Yuzlings prioritize enemies closest to Yuzu within 420 pixels. Each Yuzling picks an unclaimed target when possible, so the crew spreads across a group; when targets are fewer than minions, the others converge on the nearest enemy. They never lose HP or pause from contact with enemies. They teleport back if stranded far from Yuzu. There are no extra physics bodies.
- Basic cards: Juicy Bite (5), Quick Feet (5), Growing Family (3), Zest Splash (3), Loyal Guard (3). Loyal Guard heals Yuzu while a minion is nearby. Growing Family powers up Guardian instead of adding bodies in that path.
- Build Path selection follows the existing level milestone. Zest Swarm adds two smaller attackers (up to nine with upgrades); Citrus Guardian merges the crew into one large heavy attacker; Juice Workshop adds animated Cheese support that heals Yuzu and attacks a nearby enemy. Each path has two exclusive cards.
- Mutation: Parting Gift, Pack Instinct or Second Serving; one choice at the existing mastery gate. Second Serving boosts every fourth bite by 50%. Evolution is The Citrus Court and strengthens the selected path. Unique Citrus Parade temporarily boosts the crew's damage and attack speed while keeping closest-target priority.
- Cheese is an invulnerable Workshop helper rather than a replacement for the citrus minion. Its existing eight-frame sprite sheet is retained.

## Art and runtime

Yuzu was revised in v5.88 into a human chibi fighter with an amber-haired citrus summoner silhouette, matching the other playable characters. Her selection portrait was also replaced. Yuzling and Cheese remain small companion creatures.

Generated transparent sheets were normalized to exactly 512×256, 4×2 frames of 128×128. Files: `assets/characters/yuzu_sheet.png`, `yuzling_sheet.png`, `cheese_sheet.png`; Yuzu portrait: `assets/character_cards/card_yuzu.png`. `ASSET_SHEETS` loads the three sheets, and the minions use short looping movement animations. Yuzu uses the game's existing 8-pose player animation conventions.

## Verification and remaining playtest

`npm run check`, `npm run build:www`, and a focused runtime harness covering Yuzling attacks, path roster changes, recovery and cleanup passed. Device playtest remains needed for touch UI, sprite scale, combat readability, attack damage pacing and visual effects among dense enemy waves. No device screenshot was available in this environment.
