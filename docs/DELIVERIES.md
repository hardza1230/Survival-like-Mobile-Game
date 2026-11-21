<!-- scripts/bump-version.mjs keeps the newest two release notes in this file (Latest + Previous); older ones move to docs/CLAUDE_HISTORY.md -->

# Latest delivery: v8.2.49 — ⚔️ Fix: Expedition hero grew bigger with every tap

- **Bug (owner, phone):** in Temple Expedition, rapid tapping made the hero (and the art inside the tap area) grow. The generic menu "press bounce" (`_pressBounce`) shrinks then pops everything inside the tapped zone. A new press during the 160 ms pop-back captured the already-enlarged scale as its base, so every tap compounded it. Measured headless: 12 fast taps took the hero from 0.82 to 1.04 scale.
- **Fix:**
  - The Expedition tap area is `noBounce`; it has its own hit feedback.
  - `_pressBounce` now remembers each object's pre-press transform (`_pbBase`) and reuses it for repeat presses, so no button can grow cumulatively.
  - Verified headless: the scale stays at 0.82 under rapid taps.
- Tests: new `exp-tap-scale-8249`.

# Previous delivery: v8.2.48 — 🕳️ Hunger Crack final hole: a real horde + tanks + Abyss Brute

- **Owner:** the last hole should pour out many monsters, including tough ones. Final hole only:
  - **Horde:** 4 waves (was 3) of 10 monsters each (Ch1: 6, was 4/6), streaming every 0.35 s (was 0.6). About 40 total (Ch1 ~24).
  - **Tanks:** wave 2 brings 1 tank, wave 3 brings 2.
  - **💜 Abyss Brute:** arrives with the Elite at the end. It is a tank at ×1.4 size and ×3 HP, purple-black, and drops 1 gear when killed.
  - **Spawn cap:** while the final hole runs, the live-monster cap gets +30 instead of +12, so the horde can really come out.
  - **Time / reward:** the final hole now times out at 60 s (was 45). Abyss chest Sugar ×1.5 (harder = better rewards).
- Constants: `HC_FINAL_*`, `HC_BRUTE`, `HC_CHEST_MUL`. New `hungerCrackBrute`; `hungerCrackCrawlAt` takes a type.
- Tests: `hunger-crack` extended. The capture QA bot completed with 0 errors.
