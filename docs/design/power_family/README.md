# Power family — Weave · Equipment · Merge · Forge in the Power page theme

Owner 1 Nov 2026: the Power page (v8.0.56) is the look he likes; redesign Weave, Equipment, Merge and Forge to the same theme. Systems, routes, costs, tags and save data stay as they are; only the page look and layout change.

## Shared look (taken from buildGearPower)

| Piece | Value |
|---|---|
| Background | `screen_gear_power_789` + plum veil (same as Power) on all 4 pages |
| Header | shared `_screenBg` header: Back pill · title (no emoji) · Sugar chip |
| Card | fill `0x261e30` α.97 · border 1px `0x6d536d` α.8 · radius 14 |
| Highlight card (best / selected) | fill `0x423039` · border 1.8px `0xf4d9a1` |
| Section header | caps, 11px bold, cream `#fff1e7`, left 14px, 26px above its cards (e.g. `YOUR CORES`, `EQUIPPED`) |
| Text | title 14–15px bold cream · sub 11–12px `#cfc1d4` · gain/value mint `#85d5b2` · warning `#ffc58a` |
| Icon | painted icon 40–48px left in the card (atlas `power57_icons`, fallback = current icon/emoji) |
| Action | right-side chevron `›` for routes; buttons = pill 34px, mint fill for the main action, plum for others |
| Spacing | page width min(w−28, 480) · gap 8 · cards 66–80px tall · min text 11px |

## Page layouts (portrait; landscape keeps current fallback)

**Weave** — summary card (painted rank crest, rank name, `Woven core power x/9`, Thread count) → `YOUR CORES` 3 rows (core medallion, name + level, current total, mint `+16 HP` gain, cost pill on the right; best value row highlighted) → `RANK UP` row (Weave Up, shows what is still needed) → two route tiles `Rank Rewards` · `Depths` (same 2×2 tile style as Power).

**Equipment** — summary card (hero name Lv, ATK / DEF, `⚡ Equip best` button) → `EQUIPPED` 6 slot cards in a 3×2 grid (painted empty-slot icons when nothing is equipped) → `BAG` header with count + ♻ salvage and Sets as small pills → item grid (same cells, rarity frames kept) → selected-item card (compare + Equip / Enhance / Merge / Craft buttons as pills).

**Merge** — summary card (MAIN item, rarity → next rarity, iLv) → `MATERIALS` 2 slot cards → `KEEP 1 MOD` rows (cards, selected = highlight) → `RESULT` card (mint text for gains) → main pill `🔗 Merge`.

**Forge** — summary card (item, rarity, iLv, 🔨 Forge Points bar in mint) → `MOD ROWS` cards (current mod, star tier, tap to pick) → `POOL` rows → bottom action pills Add / Swap / Star up / Remove with painted icons.

Code note: add shared helpers `pwCard(x,y,w,h,accent)`, `pwSection(label,y)`, `pwIcon(kind,x,y,size)` (atlas → fallback) next to `powerHubIcon`, then restyle each builder one page per release (Weave → Equipment → Merge → Forge). Keep every tap tag (`upgrade`, `gear_equip`, `gear_best`, `merge_go`, `pick_*`, `add`, `swap`, `up`, …) so tutorials still work.
