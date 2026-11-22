<!-- scripts/bump-version.mjs keeps the newest two release notes in this file (Latest + Previous); older ones move to docs/CLAUDE_HISTORY.md -->

# Latest delivery: v8.2.69 — 🔮 Sesame spells grow from orb cards

**Owner:** spell growth should come from the orb cards you upgrade (not from how often you cast), and reaching a point should change how the spell plays — otherwise the orb cards feel meaningless.
- **Level from cards:** `sesSpellLv(key, ranks)` = 1 + (sum of Ember/Gale/Tide ranks of the colors in the recipe ÷ number of colors), max 5 · cast counting removed · ★ in the recipe label follows it · Lv2–5 keep the v8.2.64 multitude table.
- **Lv4 twists:** Solar → burning ground 3s · Chakram → homes in + loops twice · Tidal Armor → reflects bullets into foes · Sunlance → shard burst on each hit · Steam Cannon → brief slow (non-boss) · Armament → flares bounce to a 2nd foe · Cyclone → drifts after the nearest foe · Serpent → steam breath on each bite · Mistwalk → +30% speed for 3s after the mist · Prismatic Blast → third ring.
- Orb card texts say what grows and the Rank 4 twist.
- Headless: all 10 spells cast at Lv5 for 90s, 0 errors.
- Test: `tests/sesame-mastery-8264.test.cjs` (card-level math + twist hooks).

# Previous delivery: v8.2.68 — Smoother hero hit reactions

Phase 3A converts the four-frame hurt sheets for Cocoa, Yuzu, Mint, Taro, and Sesame to eight-frame one-shots, for their default and Festival outfits. The update keeps the existing hit reaction windows and corresponding skin swap, frame size, body scale, and floor anchors. Momo’s two already-eight-frame hurt sheets remain the active art. The ten transparent sources, prompts, QA and preview are in assets/incoming/hero-hurt3a; pack script writes ten WebP atlases. Tests play all eight frames for both outfits, check the existing non-Cocoa and Cocoa hit windows, and verify that each run requests only its own hero and equipped skin.
