# Currency review and work log (2026-09-27)

## Delivered in v5.85.0

- Bazaar: pay 60 / 120 / 240 Sugar for up to three extra stock rotations each UTC day. Stock and sold slots reset atomically; the existing stage-clear restock remains.
- Stage entry: select 0–2 curses instead of a plain difficulty row. The number of curses sets Normal / Hard / Hell reward scaling and costs 150 Sugar per curse per attempt. Ironhide adds 35% HP, Sharp Fangs adds 25% damage, Crowded Nest adds 15% HP and more enemies. Clearing a stage unlocks another curse slot. Restarting a challenge charges a fresh ticket.
- Temple: ordinary core levels cost Sugar only. Overcap keeps its Core Stone requirement and costs Sugar, without Thread. Rank promotion costs Thread: `8 + 4r + 2r²`, where `r` is the current rank (8, 14, 24, 38, 56…). This keeps early promotions cheap and raises the later cost.
- Perk reset consumes `6 + 3r` Thread; Kitchen reset consumes `5 + 2r` Thread and returns every equipped part to inventory. Both require a second tap. Existing Kitchen part swaps still cost 20 Sugar.
- Kitchen: added two triggers (25 kills, 10 seconds), two effects (12% heal, rainbow area burst), and two signature pairs. These are obtainable from the existing random part pool.

## Currency economy in the current code

| Currency | Source | Main sink | Observation |
| --- | --- | --- | --- |
| Sugar | Kills, stage rewards, gear sales, cookbook, objectives | Temple cores, Bazaar, tickets, orders, digging | Many sinks now compete for the same early budget. Ticket pricing should be measured against stage earnings. |
| Weave Thread | Temple Depths, targeted Sugar Order | Rank promotion, Perk/Kitchen reset | Clear identity after moving core costs. Rank 0–2 costs 8/14/24, and the starter Depths gift is 40. |
| Core Stones | Temple Depths | Overcap | Specialized permanent upgrade material, alongside Sugar. |
| Spark Sugar / Twist Cream | Common/rare loot, Bazaar, orders for Twist | Add or reroll common/magic affixes | Readily available at lower stages. |
| Crown Icing / Wild Jam | Higher loot pools, Bazaar, order for Wild Jam | Magic→Rare capacity / Rare affix reroll | Wild Jam becomes a common demand once Rare crafting opens. |
| Wish Candy / Crystal Glaze | Epic/legend loot pools, Bazaar | Rare empty affix / value reroll (3 Glaze each) | Glaze has high effective use cost (960 Sugar at listed price), yet the forge does not preview the expected improvement. |
| Fading Gumdrop / Plain Dough | Loot pools, Bazaar | Targeted affix removal / full reset | Reset actions are irreversible and need clear preview of the affected item. |

The boss grants `2 + stageIndex + 2 × (difficulty−1)` crafting currencies, plus miniboss and ordinary-enemy drops. A successful ordinary kill has a 2.8% separate drop chance. Higher challenge tier changes the weighted loot pool, in addition to reward scaling. Bazaar buys currencies at listed prices and sells them at 60%. Sugar Orders give a targeted alternative for Twist Cream and Wild Jam.

## Recommended next work (not yet implemented)

1. **Instrument net income and spending** per stage, account age, and rank. Record aggregate counters locally, without player identity, for Sugar, Thread, and each orb. Balance with measured median sessions rather than the static price table.
2. **Show a before/after forge preview and exact cost** for every orb action, especially 3 Crystal Glaze. Explain that value rerolls preserve tier and may roll lower.
3. **Protect against excessive early Sugar pressure**: compare expected stage income with first core upgrades, a 150 ticket, 120–200 Sugar Order, and Bazaar refresh. Adjust the ticket or first refresh cost if normal progress is delayed.
4. **Give rare crafting currencies a target path** through later Orders or a capped exchange, once observed drop data shows scarcity. Do not add a guaranteed premium orb loop before measuring balance.
5. **Give a stock refresh preview** with the remaining daily count and note that purchased slots reopen. Consider an explicit purchase limit per item type if refresh farming becomes dominant.
6. **Audit reward consistency across modes**: boss rush and daily runs still set the internal difficulty tier directly; ensure their labels, rewards, and ticket exemptions are clear in the UI.

## Verification

`npm run check` and `npm run build:www` passed. Mobile layout and economy pacing still require device playtesting; no live player telemetry was available for this review.
