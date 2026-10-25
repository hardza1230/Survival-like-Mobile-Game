# Combat readability v8.0.35 — implementation complete

User approved all six recommendations. Implemented coral hostile bolts, clear-center warnings with exact 760ms countdown/radius, reused player ring/silhouette, lighter large friendly/boss VFX, bounded Elite/windup markers, quieter common loot and critical damage numbers. Seven ImageGen sprites and original/source/provenance/QA kit are in assets/art/combat_readability and assets/incoming/combat_readability; reproducible packer scripts/pack-combat-readability.py.

Validation: npm run check and npm run build:www passed; seven built sprites match manifest SHA256 and www/version.json is 8.0.35. Meaningful contracts cover projectile 128px physics parity, hazard radius/delay, object reuse and cleanup, cosmetic budgets, opacity and loot hierarchy. No gameplay/balance changes. No local gameplay/screenshots; owner phone review remains pending.

Next: publish tested tree on claude/vampire-survival-mobile-game-yo9e8w, verify immutable remote bytes, check deployment once and leave background deploy running. Preserve unrelated untracked art review files. Previous checkpoint 553bdff9c73307f8e303aade9f68e2525c697def.
