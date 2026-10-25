# Combat readability v8.0.35 — delivered

User approved all six combat-art recommendations. Delivered seven ImageGen alpha sprites and wired coral hostile bolts, clear-center accurate warnings, reused player ring/silhouette, lighter large VFX, bounded Elite/windup cues, quieter common loot and critical damage numbers. No gameplay/balance/reward tuning.

Runtime published: 6294b6e2333c266cb9503155cc4f3ee3f8e0a15e on claude/vampire-survival-mobile-game-yo9e8w. Immutable remote readback verified all 32 changed files (5,890,000 bytes), including image decode. npm run check and npm run build:www passed. All seven built sprites match manifest SHA256 and built version is 8.0.35.

Source/provenance/QA: assets/incoming/combat_readability; runtime: assets/art/combat_readability; reproducible packer: scripts/pack-combat-readability.py; scope: docs/art_orders/COMBAT_READABILITY_8_0_35.md. Contracts cover projectile 128px body/velocity parity, hazard radius/760ms, object reuse/cleanup, cosmetic budgets, opacity and loot hierarchy.

Deployment checked once after publication: Pages run 40159120693 and Android run 40159120688 were in_progress; live website still 8.0.34 at that check. Let deployment continue in background; do not repeatedly wait. Owner phone visual/FPS review remains pending; no local gameplay/screenshots performed. Preserve unrelated untracked art review files.
