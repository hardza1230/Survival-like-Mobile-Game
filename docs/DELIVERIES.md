<!-- scripts/bump-version.mjs keeps the newest two release notes in this file (Latest + Previous); older ones move to docs/CLAUDE_HISTORY.md -->

# Latest delivery: v8.2.64 — 🔮 Sesame Spell Mastery + serpent minion

**Owner:** Sesame's spells should grow during a run (more of them, not just stronger), the water dragon should feel a bit like a minion, and Prismatic Armament (PMM) should be felt.
- **Spell Mastery (per run):** each recipe counts its casts · 3/7/12/18 casts = Lv2–5 · ★ in the recipe label · "Name LvN!" pop · area +5%/Lv (hitbox and art).
- **Multitude:** Solar Cataclysm 3→7 meteors · Tempest Chakram 3→5 arms · Sunlance +1 (Lv2) / +2 (Lv4) fanned lances · Steam Cannon 3→5 bursts · Cyclone Lv5 second cyclone · Prismatic Blast Lv3+ second ring · Tidal Armor shield 20→36% + Lv5 burst when it breaks · Armament 6→8s · Mistwalk longer + Lv5 lure (enemies chase the spot you left).
- **🐉 Tidal Serpent minion:** swims around Sesame between bites, bites the nearest foe every 0.9s for 6s (+1s/Lv, max 10s), explodes at the end · Lv3 = 2 serpents, Lv5 = 3 (smaller).
- **Prismatic Armament:** spell icon above Sesame's head with a countdown ring · basic attack fires +2 flares in a wide fan while armed (per-flare bonus 1.4 → 1.15).
- Same caps as before (≤ 8 spell actors, ≤ 12 fx) · Lv1 casts behave exactly as before.
- Tests: `tests/sesame-mastery-8264.test.cjs` · `sesame-runes` serpent/armament checks updated.

# Previous delivery: v8.2.63 — 👻 Phantom Rush costs your Dashes

**Owner:** Phantom Rush (Cocoa · Dash Boxer) was too strong and could be used too often → spend Dash charges + refund cap.
- **Spends all Dash charges:** needs ≥ 1 charge ("Need a Dash" otherwise) · +1 leap per charge spent (max +5) · replaces the old "Dash before casting" bonus · Dash is empty after the cast (free shadow Dashes still there to dodge).
- **Free shadow-mode Dashes no longer cut the cooldown.**
- **Refund cap 40%:** Dash refunds, kill refunds and Ghost Refund together cut at most 40% of the cooldown per cast (20s → 12s fastest) · Unique Cooldown gear still applies · other paths unchanged (`phRefund`).
- Tests: `tests/phantom-rush-8263.test.cjs` · cocoa-builds + Taro doDash fixtures updated for the intended change.
