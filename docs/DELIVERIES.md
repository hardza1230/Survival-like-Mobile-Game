<!-- scripts/bump-version.mjs keeps the newest two release notes in this file (Latest + Previous); older ones move to docs/CLAUDE_HISTORY.md -->

# Latest delivery: v8.2.48 — 🕳️ Hunger Crack final hole: a real horde + tanks + Abyss Brute

- **Owner:** the last hole should pour out many monsters, including tough ones. Final hole only:
  - **Horde:** 4 waves (was 3) of 10 monsters each (Ch1: 6, was 4/6), streaming every 0.35 s (was 0.6). About 40 total (Ch1 ~24).
  - **Tanks:** wave 2 brings 1 tank, wave 3 brings 2.
  - **💜 Abyss Brute:** arrives with the Elite at the end. It is a tank at ×1.4 size and ×3 HP, purple-black, and drops 1 gear when killed.
  - **Spawn cap:** while the final hole runs, the live-monster cap gets +30 instead of +12, so the horde can really come out.
  - **Time / reward:** the final hole now times out at 60 s (was 45). Abyss chest Sugar ×1.5 (harder = better rewards).
- Constants: `HC_FINAL_*`, `HC_BRUTE`, `HC_CHEST_MUL`. New `hungerCrackBrute`; `hungerCrackCrawlAt` takes a type.
- Tests: `hunger-crack` extended. The capture QA bot completed with 0 errors.

# Previous delivery: v8.2.47 — 🧊 Fix: Ice Cage Sealing (C1-4 boss) columns now really hit

- **Bug (owner, phone):** the Ice Cream Golem's "Ice Cage Sealing" drew 6 full-height column warnings, but only a small circle (r45) at the player's row did damage, so standing in a lit column usually did nothing. New `iceCageSlam(x,py,d)`: when the bars slam (760 ms), each warned column flashes and hits anywhere along it (half-width 30, ±490 px) once, plus a short slow. The one gap column stays safe. The old hazard circle and bar art are kept. Damage per hit is unchanged.
- Tests: new `ice-cage-8247`.
