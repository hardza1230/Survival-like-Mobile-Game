# Yuzu: seed focus, card skill unlocks and Dash fix · v8.0.60

Owner picked critique items ก + ข + ง (29 Oct) and reported that frequent Dashes pulled the companion off its target.

## ก — Seed mark (player choice)
- Yuzu's seed aims at the nearest enemy inside a ±34° cone of the walking direction (player body velocity > 20). Standing still = the old auto target.
- Every seed hit marks that enemy for 4s (refreshed by the next hit). One mark at a time; pooled reuse/death clears it (`_yzSpawnId`).
- `yuzuEnemyPriority`: marked = 6, above mission targets (5), so the companion switches on its next .15s scan.
- `yuzuHit`: companion hits on the mark ×1.25 (Yuzu's own seeds get no bonus).
- Marker: one owned graphics object (`_yzMarkG`), four rotating gold arcs + a small arrow; removed in `clearYuzuCrew`.

## ข — Smaller starting kit, skills from path cards
Start: normal attack + one skill + Unique. Rank 1 of the matching existing card unlocks each extra skill (`yuzuHasSkill`); Evolution unlocks all. Card ids, ranks and Recipe Book entries are unchanged.

| Companion | Starts with | Card → unlock |
|---|---|---|
| Pomelo | Peel Combo, Pulp Slam (Rolling Pomelo at full growth, unchanged) | Wide Slam `y_giantslam` → Rind Breaker |
| Lime | Arrows, Zest Volley | Sour Snare `y_bigsplat` → Sour Trap · Swift Ranger `p_pulp` → Vaulting Shot · Ready Quiver `y_strongarm` → Pin & Pierce |
| Blood Orange | Flavor Sigil, Crimson Comet | Steeped Flavor `y_longroot` → Sour Garden · Bloom Reach `y_elder` → Spicy Bloom · Honey Alchemy `y_seedluck` → Honey Rescue |

## Dash
`yuzuRush` no longer cancels a fight: when the companion has a valid target or is mid action/motion it stays put (its normal tether brings it back if Yuzu runs far). A free companion still follows, at most once per 1.2s. Citrus Footprints and the Dash shield talent still trigger on every Dash.

## ง — Removed legacy code
`yuzuHurt / yuzuKnock / yuzuDown / yuzuRecovery / yuzuRegrow / yuzuMaxHp`, companion `hp/maxhp/down/revive/iframe/brew/hurt` fields, the 'Help' label, down/revive/hurt poses, the old Flavor Brew helper and the old bouncing orb projectile (`orb`, `infused` shots, `yuzuFinishInfusedShot`). Boss hazards no longer call `yuzuKnock`. Painted sheets are unchanged (unused cells only).

No balance numbers changed except the new ×1.25 mark bonus. Owner phone review pending.

## v8.0.61 — owner picked ก + ข1 + ง (second critique)
- ก Steady mark: `yuzuMark` keeps the current mark for at least 2s (`age`), and moves only after 2 seed hits in a row on the same new enemy (`pend`). A hit on the current mark refreshes it to 4s and resets the pending count.
- ข1 Priority: `yuzuEnemyPriority` order is mission 5 → active Wisp raider 4 → boss 3 → mini 2 → **mark 1.5** → elite/courier 1 → mob 0. The mark only lifts a mob/elite; a marked boss keeps 3. The ×1.25 companion bonus still applies to any marked enemy.
- ง Guarantee: `yuzuUnlockGuard(out,atk)` runs on every normal card roll. After the Build is picked, if a skill-unlock card (`y_bigsplat p_pulp y_strongarm y_giantslam y_longroot y_elder y_seedluck`) is still at rank 0 in the pool and one level-up passed without offering it, the next roll replaces a non-heal, non-path card (or any non-heal card) with one. Counter resets on companion change/clear.

## v8.0.62 — owner picked ก + ง + ค (third critique)
- ก `yuzuEnemyPriority` is back to the plain order (mark not included). New `yuzuFocusRank` = priority + mark 1.5, used only in `yuzuPickTarget` and `yuzuTarget`. Leash/pursuit range, `yuzuArsenalThink` gating (Pin/Garden/Breaker `rank>0`), `yuzuCluster` and Lime rain FX ignore the mark.
- ง Unlock cards at rank 0 get headline `🔓 Unlocks <skill>` (makeCard, Yuzu only, not after Evolution). Talents Trap Setter / Honey Notes / Slow Steep say which card they need.
- ค `RUBY_TIPS.yuzuAim`, shown once (`rubyOnce`) the first time a seed creates a mark.
- New Unique design draft: docs/YUZU_UNIQUE_V2.md (awaiting owner pick).
