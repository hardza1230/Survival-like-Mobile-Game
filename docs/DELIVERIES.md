<!-- scripts/bump-version.mjs keeps the newest two release notes in this file (Latest + Previous); older ones move to docs/CLAUDE_HISTORY.md -->

# Latest delivery: v8.2.74 — ⚫ Sesame less tanky

**Owner:** Sesame felt much tankier than other heroes → approved the proposed cut.
- Base HP bonus +34 → +15 (Cocoa +46 stays the tank).
- Blue Mantle card: damage reduction cap 45% → 25% (card text updated).
- Shields, mist and blue-orb regen stay (blue's identity).

# Previous delivery: v8.2.73 — Smoother Taro sentries

Four active Taro sentry, beacon and overcharge effects now use eight authored frames in taro-motion3c. Doubling the frame rates preserves existing animation periods. The new art stays lazy even for Taro at boot, and existing gameplay hooks, damage and targeting are unchanged. Source manifests, mechanical QA, reproducible packer and taro-motion3c runtime contract delivered. Owner phone review remains.
