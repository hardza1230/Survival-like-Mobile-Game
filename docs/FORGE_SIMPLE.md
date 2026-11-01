# Simple Forge — spec (owner picked 1 Nov 2026, "Forge is the most confusing system")

> **v8.0.87 owner changes (supersede rules below):** Add = random mod (no 1-of-3), no row categories (any mod on any row, duplicates ok), ~20% bad mods (no upgrade), Remove costs the craft price, Lv instead of ★, rarities Mythic/Ancient/Divine (4/5/6 rows, Merge only).

Replaces the v8.0.33 Forge Points (Last Epoch) version. Implement as one release; keep save compatibility.

## Rules
1. **Two actions only** on the Forge page for the selected item:
   - **Add a mod** — only on an empty, open row. Shows **3 random mods** from that row's pool (`forgePool`/`FORGE_ROLLABLE`, slot rules unchanged) as cards; player taps 1. Mod is created at ★1 (lowest tier band, value rolled inside it). Cost: Twist Cream.
   - **Upgrade ★** — tap an existing mod row → +1 star (`tierForStar`, value re-rolled inside the new band). Cap = `forgeStarCap(item,mod)` (iLv-based) — the button shows the reason when capped, e.g. `Max ★3 at iLv 12 · next ★ at iLv 25`. Cost: Twist Cream.
   - **Remove** a mod stays (free, small 🗑 on the row, double-tap confirm). No Swap (remove + add instead).
2. **No Forge Points.** Drop the FP bar, `FP_ADD/SWAP/REMOVE`, `FP_LUCKY` (no lucky refund), `gearFP` checks. Keep `item.fp` on old saves untouched/ignored.
3. **One currency: Twist Cream (`transmute`).** Price per action on an item = `1 + floor(item.crafts/2)` (item.crafts++ on every add/upgrade; Merge resets crafts like it refilled FP). Crystal Glaze (`divine`) is retired: on load convert each Glaze → 3 Twist Cream once (`d._glazeMig`), remove Glaze from drops/Bazaar (`CURRENCY_DROP_POOLS` → transmute only, `CURRENCY_BUY`, Bazaar materials, login/daily rewards that give `divine`).
4. **Rows open by rarity only** (`RAR_LINES[grade]`); remove the iLv gate in `forgeLineOpen` (`affixCountCap`) for adding. iLv only limits stars. Merge stays the only way to get more rows.
5. **UI** (Power theme, art 57 icons `mod_add`, `star_up`, `mod_remove`; `pw_hero_forge` in the summary card, `pw_empty_forge` empty state):
   summary card (item art, name, rarity, iLv, 🟢 Twist Cream count) → `MOD ROWS` 1–3 cards (filled: mod line + ★ + `Upgrade ★ · 🟢n` pill or cap reason; empty open: `+ Add a mod · 🟢n` pill; locked by rarity: `Merge to open`) → Add opens a 3-card picker overlay (cards like the level-up cards, tap = buy). No pool list page.

## Code entry points
`_buildCraftBenchRaw` / `buildCraftBench` (page) · `forgeAct(kind)` (replace with `forgeAdd(line,modId)`, `forgeUpgrade(line)`, `forgeRemove(line)`) · `FP_MAX…FORGE_DROP_MUL`, `gearFP`, `forgeLineOpen`, `forgeStarCap`, `makeAffixAtStar`, `tierForStar` · `mergeGear` (reset crafts) · currency drops `forgeCurrency`, `CURRENCY_DROP_POOLS`, `CURRENCY_BUY`, `grantCurrencyReward` · gear tutorial `applyGearTut` steps 2–3 (now: open Forge → tap `+ Add a mod` → pick a card; keep the one-time +3 Twist Cream gift) · `powerTips` Forge tip if any.

## Tests to update
tests/affix-sound (forgeAct costs/lucky), forge-150, gear-level-limits (Forge guards), forge-redesign, gear tutorial paths in ruby-flow/gear-level-limits, scripts/check-forge-live-ui.cjs + build-forge-review.mjs (states), power-family (Forge page). Add tests/forge-simple: 3-choice add, star cap message, no FP, Glaze migration once, price growth, Merge reset, rarity-only rows.
