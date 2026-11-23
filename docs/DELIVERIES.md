<!-- scripts/bump-version.mjs keeps the newest two release notes in this file (Latest + Previous); older ones move to docs/CLAUDE_HISTORY.md -->

# Latest delivery: v8.2.76 — 🍓 Shotgun no longer melts bosses up close

**Owner:** Strawberry Shotgun pressed against a boss was far too strong ("the boss melts") → approved A + B.
- **A:** bosses and minibosses no longer take the ×2 point-blank pellet bonus inside 120px (now ×(1+close bonus), the same as 120–200px). Regular foes keep ×2.8.
- **B:** in one blast, pellets 7+ that hit the same boss/miniboss deal half (`SG_BOSS_FULL_PELLETS=6`, per-blast id `b.sgBlast`).
- Expected boss damage up close ≈ −60%; Shotgun is still the strongest close-range build.
- Test: `tests/shotgun-boss-8276.test.cjs` · `strawberry-builds` boss expectation and the Taro `castSkill` hash updated.

# Previous delivery: v8.2.75 — 🎞️ Smoother enemy attacks + boss bodies (51 clips)

**Owner:** continue with phase 4. Sources `assets/incoming/enemy-motion-phase4` (45) + the boss body rows of `boss-motion-phase5b` (6).
- **Enemy clips (45):** attack / windup / flee / walk now 8 frames for Chapter 1–2 regulars, elites, Mimic and Feast target · rates from the manifest (same play time).
- **Boss bodies (6):** MB5/7/8/9 idle 8 frames (`BOSS_BODY816_MAP.idle8`, idle cycle stays 1 s) · Root Knight idle 8 / walk+charge 8 / cleave 12.
- **How:** `scripts/pack-motion-phase4.py` appends the new frames after each atlas's old frames (49 atlases → `assets/art/motion-phase4/`, 11.4 MB, +3.4 MB vs old) so idle/walk/hurt/death indices never move; registry action lists/`anim.start` point at the new frames.
- Not delivered by the art side (kept as before): `e_ant_drone` attack, `c24_equinox` attack.
- Stage-lazy loading unchanged (0 new keys at boot). Live check: C2-1 attack clips 8 frames @24 fps.
- Old animation tests read `tests/lib/motion-legacy.cjs`; `check-boss-body-ui` allows appended idle frames. Test: `tests/motion-phase4.test.cjs`.
