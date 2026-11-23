<!-- scripts/bump-version.mjs keeps the newest two release notes in this file (Latest + Previous); older ones move to docs/CLAUDE_HISTORY.md -->

# Latest delivery: v8.2.75 — 🎞️ Smoother enemy attacks + boss bodies (51 clips)

**Owner:** continue with phase 4. Sources `assets/incoming/enemy-motion-phase4` (45) + the boss body rows of `boss-motion-phase5b` (6).
- **Enemy clips (45):** attack / windup / flee / walk now 8 frames for Chapter 1–2 regulars, elites, Mimic and Feast target · rates from the manifest (same play time).
- **Boss bodies (6):** MB5/7/8/9 idle 8 frames (`BOSS_BODY816_MAP.idle8`, idle cycle stays 1 s) · Root Knight idle 8 / walk+charge 8 / cleave 12.
- **How:** `scripts/pack-motion-phase4.py` appends the new frames after each atlas's old frames (49 atlases → `assets/art/motion-phase4/`, 11.4 MB, +3.4 MB vs old) so idle/walk/hurt/death indices never move; registry action lists/`anim.start` point at the new frames.
- Not delivered by the art side (kept as before): `e_ant_drone` attack, `c24_equinox` attack.
- Stage-lazy loading unchanged (0 new keys at boot). Live check: C2-1 attack clips 8 frames @24 fps.
- Old animation tests read `tests/lib/motion-legacy.cjs`; `check-boss-body-ui` allows appended idle frames. Test: `tests/motion-phase4.test.cjs`.

# Previous delivery: v8.2.74 — 🎞️ Smoother hero & boss effects (97 sheets)

**Owner:** wire the new art. Source branches `asset-delivery/hero-motion-phase3`, `boss-motion-phase5a`, `boss-motion-phase5b` (stacked; also carries `enemy-motion-phase4`).
- **Wired — 97 whole-sheet upgrades (100 registry rows):** hero skill VFX phase 3 (40) · Chapter 1 boss warnings/waves/arena/counters (22) · Chapter 2 boss + C2-4 season VFX/projectiles/counters (35). 8 frames for loops/short actions, 12 for big actions · rate scaled so each plays in the same time.
- Pack: `scripts/pack-motion-phase3-5.py` → `assets/art/{hero-motion-phase3,boss-motion-phase5a,boss-motion-phase5b}/` (7.96 MB) + `scripts/motion-phase3-5.json` · hero folder in the lazy hero-art list.
- Fixed hard-coded frames: Yuzu seedling shot (`%4`), `mintOutlineFrame` (`%6`).
- Older art tests read `tests/lib/motion-legacy.cjs`; mint/battle/boss-vfx browser checks accept 6/8/12 frames.
- **Not wired yet:** enemy attack clips phase 4 (45) + boss body clips MB7–MB10 (6) — need atlas clip remapping.
- Test: `tests/motion-phase3-5.test.cjs`.
