<!-- scripts/bump-version.mjs keeps the newest two release notes in this file (Latest + Previous); older ones move to docs/CLAUDE_HISTORY.md -->

# Latest delivery: v8.2.55 — Mission card polish and clearer battle effects

Orders 92 and 93 are integrated, with three additional painted sheets for Hunger Crack and Momo Shotgun. Mission cards share the Heart Seed back, foil sweep and flip flash. Hunt retains its actual danger footprint under the painted timer. Wisp swaps the escort area, tether and outside-zone shadows as the player crosses the boundary. Hunger Crack has separate fissure states and capped spawn bursts. Shotgun distinguishes the regular shot, Double Barrel opening shot and actual follow-up. The added runtime files total 539,250 bytes (9.59 MiB decoded across all groups) and load with the stage or Momo run. Existing damage, hit areas, wave and shot timing are preserved.

# Previous delivery: v8.2.54 — ✂️ ECRS round 2 (from real player data): fewer screens, fewer daily chores, Sugar gear chests, a calmer Chapter 1

- **Owner approved ECRS round 2 (22 Nov):** the analysis uses the code plus Supabase `run_stats` screen visits from about 10 real phones (13–22 Nov). Reward Inbox, Kitchen, Delve, Atlas, Play Stats, Ranking and Trade-in had 0 visits.
- **E1 · Reward Inbox removed** (`GEAR_INBOX_ON=false`):
  - When the bag is full, protected gear (Epic+, favourite or locked) goes straight into the bag, over the cap.
  - Normal gear is salvaged as before.
  - Old inbox items move into the bag once (`_inbox8254`). The lobby Mail button and menu rows are gone.
- **E2 · Mochi Miners retired** (`MINERS_ON=false`):
  - Upgrades were already gone with Depths, and it duplicated Expedition.
  - The Thread it had stored is paid out, and the old miner level becomes a permanent Expedition crumb bonus of +10% per level (`exp.mb`, `_miners8254`).
- **E3 · Expedition daily chest removed** (`EXP_DAILY_ON=false`). Daily chores go from 6 spots to 4. The Daily Quest "Defeat 30 Expedition foes" stays, and the button row becomes 2 wide buttons.
- **E4 · Play Stats / Combat Meter** settings rows only show with GM on (`DEV_STATS_ON=false`).
- **E5 · Ranking tab hidden** (`RANKING_ON=false`). The three Rewards tabs fill the row.
- **S1 (owner's choice) · Silver/Gold gear chests cost 🍬 Sugar, not 🧶 Thread** (`chestSugarCost`): Silver = 1.4× and Gold = 4× the Sugar Chest price at your item-level band. The gear tutorial gift, the no-gear refund and the lobby Thread pill (now opens the Wardrobe) all follow.
- **S4 · Chapter 1 is calmer** (`CH1_CALM_UNTIL=5`): no random run trait and no Mimic on the prize wheel until Chapter 2.
- **Found, waiting on the owner:** Thread still buys power through gear Enhance, Weave Rank up and Ancient perks. This must be fixed before real-money Thread opens (`docs/ECRS.md`, LAUNCH_RULES rule 4).
- **Checks:**
  - New test `ecrs2-8254`, including the Miners save migration on a fake save.
  - Headless touch: hub (no Mail), Rewards (3 tabs), Settings, Expedition, Bazaar (🍬 prices).
  - QA bots: capture done with 0 errors; qa-menus 25 screens with no new errors (only the older "Texture key already in use" console notes on the endgame screen).
