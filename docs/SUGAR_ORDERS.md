# Sugar Orders (v5.84.0)

A targeted use for Sugar in Mochi Bazaar. The player buys one order before a normal stage and receives its named material only after clearing a regular stage. Losing or leaving retains the order. Canceling before completion refunds the full price. No order is paid twice.

| Order | Cost | Normal | Hard | Hell |
| --- | ---: | ---: | ---: | ---: |
| Shovel Hunt | 🍬140 | ⛏️5 | ⛏️9 | ⛏️15 |
| Thread Hunt | 🍬120 | 🧶12 | 🧶22 | 🧶36 |
| Twist Cream Hunt | 🍬150 | 🟢2 | 🟢4 | 🟢6 |
| Wild Jam Hunt | 🍬200 | 🟠1 | 🟠2 | 🟠3 |

Rewards use `Math.round(base × DIFFS[].reward)` (Normal 1, Hard 1.85, Hell 3). The order is excluded from tutorial, Boss Rush, Endless, Rift, Recipe Maps and Pinnacle. The reward appears in the stage summary. All three difficulty tiers give increasing rewards; the targeted currency does not replace stage drops or difficulty rewards.

## Playtest checks

- Buy, cancel and buy again: Sugar returns exactly once; a second active order is refused.
- Clear a normal stage: one reward is credited, and the order is removed. A failure or quit preserves it.
- Verify Normal/Hard/Hell quantities and compare the Sugar cost with Bazaar direct purchases and Temple digging.
- Check the four-tab Bazaar layout on a narrow phone and the reward row in the stage summary.
