# Equipment v2 — Phase 4 progression

## Item Level bands

| Chapter | Item Level | Best affix tier | Loot identity |
|---|---:|---:|---|
| 1 Pantry | 1–20 | T4 | starter fundamentals |
| 2 Rotten Drain | 21–40 | T4 | tempo and utility |
| 3 Chili Engine | 41–60 | T3 | heavy offense |
| 4 Sugar Freezer | 61–80 | T2 | control and critical |
| 5 Crown Oven | 81–100 | T1 | bounded hybrid endgame |

Item Level adds a slot-specific bonus capped at Item Level 100. It never multiplies every stat at once, so a lower-level item with a strong affix combination can remain useful without becoming permanent best-in-slot.

## Acquisition rules

- Field drops roll Item Level from stage/chapter and difficulty.
- Gacha, forge and Bazaar use the highest unlocked chapter.
- Item bases can repeat. Each copy has its own UID, Item Level, affixes, craft state, enhancement, favorite and lock flags.
- Chapter loot pools prefer the current chapter and fall back to unlocked earlier bases only when a rarity has no current-chapter candidate.
- Craft Bench always targets one selected UID; locked items cannot be modified.

## Weapon line

The weapon roster expands from 6 to 22 bases. Every chapter has common/rare/epic/legend chase options while Chapter 1 retains the starter set. Icons are transparent 256×256 SVG assets; rarity frames remain UI-driven so the same art can be reused across grades and states.

## Final inventory lifecycle (v4.1.0)

- The backpack holds 24 unequipped instances. Equipped items do not consume backpack capacity.
- Overflow rewards enter a five-slot Reward Inbox.
- Players can claim an inbox item after freeing backpack space, or dismantle Common/Rare inbox items into shards.
- Auto-dismantle modes are Off, Common, and Common + Rare. They apply only when the backpack is full.
- Favorite, locked, equipped, Epic and Legendary items are never auto-dismantled.
- When a protected Epic/Legend arrives to a full inbox, an eligible Common/Rare inbox item is salvaged first; if none exists, the protected reward is preserved as temporary protected overflow.
