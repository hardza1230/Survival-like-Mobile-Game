<!-- scripts/bump-version.mjs keeps the newest two release notes in this file (Latest + Previous); older ones move to docs/CLAUDE_HISTORY.md -->

# Latest delivery: v8.2.70 — ▶ Missions start by themselves

**Owner:** change "Start mission" to automatic.
- `MISSION_AUTO_START=true`: no Start mission button · the mission card shows and the mission begins after 1.2 s (`missionArm`) · set false to bring the button back.
- Bots: missions s5 (Defend Nectar ✓) and s9 (Break Roots ✓) start and finish with no tap · 0 errors.
- Note for owner: the yellow hexagon around heroes is the Forge **Barrier** status (`st_p_barrier`), most likely from the "Overflow Cream" gear mod (overheal → timed barrier).

# Previous delivery: v8.2.69 — 🔮 Sesame spells grow from orb cards

**Owner:** spell growth should come from the orb cards you upgrade (not from how often you cast), and reaching a point should change how the spell plays — otherwise the orb cards feel meaningless.
- **Level from cards:** `sesSpellLv(key, ranks)` = 1 + (sum of Ember/Gale/Tide ranks of the colors in the recipe ÷ number of colors), max 5 · cast counting removed · ★ in the recipe label follows it · Lv2–5 keep the v8.2.64 multitude table.
- **Lv4 twists:** Solar → burning ground 3s · Chakram → homes in + loops twice · Tidal Armor → reflects bullets into foes · Sunlance → shard burst on each hit · Steam Cannon → brief slow (non-boss) · Armament → flares bounce to a 2nd foe · Cyclone → drifts after the nearest foe · Serpent → steam breath on each bite · Mistwalk → +30% speed for 3s after the mist · Prismatic Blast → third ring.
- Orb card texts say what grows and the Rank 4 twist.
- Headless: all 10 spells cast at Lv5 for 90s, 0 errors.
- Test: `tests/sesame-mastery-8264.test.cjs` (card-level math + twist hooks).
