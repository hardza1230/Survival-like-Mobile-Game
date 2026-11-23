<!-- scripts/bump-version.mjs keeps the newest two release notes in this file (Latest + Previous); older ones move to docs/CLAUDE_HISTORY.md -->

# Latest delivery: v8.2.74 — 🎞️ Smoother hero & boss effects (97 sheets)

**Owner:** wire the new art. Source branches `asset-delivery/hero-motion-phase3`, `boss-motion-phase5a`, `boss-motion-phase5b` (stacked; also carries `enemy-motion-phase4`).
- **Wired — 97 whole-sheet upgrades (100 registry rows):** hero skill VFX phase 3 (40) · Chapter 1 boss warnings/waves/arena/counters (22) · Chapter 2 boss + C2-4 season VFX/projectiles/counters (35). 8 frames for loops/short actions, 12 for big actions · rate scaled so each plays in the same time.
- Pack: `scripts/pack-motion-phase3-5.py` → `assets/art/{hero-motion-phase3,boss-motion-phase5a,boss-motion-phase5b}/` (7.96 MB) + `scripts/motion-phase3-5.json` · hero folder in the lazy hero-art list.
- Fixed hard-coded frames: Yuzu seedling shot (`%4`), `mintOutlineFrame` (`%6`).
- Older art tests read `tests/lib/motion-legacy.cjs`; mint/battle/boss-vfx browser checks accept 6/8/12 frames.
- **Not wired yet:** enemy attack clips phase 4 (45) + boss body clips MB7–MB10 (6) — need atlas clip remapping.
- Test: `tests/motion-phase3-5.test.cjs`.


# Previous delivery: v8.2.73 — Smoother Taro sentries

Four active Taro sentry, beacon and overcharge effects now use eight authored frames in taro-motion3c. Doubling the frame rates preserves existing animation periods. The new art stays lazy even for Taro at boot, and existing gameplay hooks, damage and targeting are unchanged. Source manifests, mechanical QA, reproducible packer and taro-motion3c runtime contract delivered. Owner phone review remains.
