# Playtest feedback — 27 September 2026

Source: owner's numbered playtest notes. Branch: `claude/vampire-survival-mobile-game-yo9e8w`. Status here distinguishes code changes from mobile playtest validation.

| # | Feedback | Work and acceptance check | Status |
| --- | --- | --- | --- |
| 1 | Strawberry fan misses a boss up close; weak burst | Tighten pellets toward large nearby targets; verify 10 volleys against a real boss | Code v5.82; mobile check pending |
| 2 | Ricochet fun but too slow | 25% more frequent shots; check crowd and single target | Code v5.82; mobile check pending |
| 3 | Sniper too weak | Charge 0.34s, ×3.2 seed, piercing and slower cycle; check boss time to kill | Code v5.82; mobile check pending |
| 4 | Sniper unique should charge explosive damage repeatedly | Charged Berry Barrage targets strongest enemy for 3–4 pulses | Code v5.82; mobile check pending |
| 5 | Mint rapid lance plus extra lance too strong and causes lag | Max 3 lances in Barrage, damage ×0.62, rate bonus 22%; compare with other paths and FPS | Code v5.83; mobile check pending |
| 6 | Other Mint paths lack distinct identity | Glacier: control and frozen targets; Pierce: heavy boss hit. Review actual feel and make their effects more visible | Pending design/playtest |
| 7 | Does Strawberry explosion card work? | Juicy Burst was skipped by the piercing hit branch; now splashes on each pierced enemy too; verify with normal and Sniper/Evolution | Bug fixed v5.83; mobile check pending |
| 8 | Do Mint cards work? | Audited `pathMods` and `castFrostLance`: Splinter Volley was lost at the three-lance cap after Evolution; it now adds 20% shard damage there. Check the other named cards in play | One inert case fixed v5.83; mobile check pending |
| 9 | Cocoa paths feel similar | Compare Brawler shockwaves, Titan boss hits, Dash Boxer mobility in combat; strengthen signature mechanics | Pending |
| 10 | Cocoa Beat Rush needs Auto and less finger strain | AUTO button in minigame yields a shorter, lower-power rush; manual chain/swipe windows shortened | Code v5.83; mobile check pending |
| 11 | Clean Air narrow, slow, long, overlaps Escort | Radius 96→145, travel speed 46→82, required time ~72%→45% of wave with 20s floor; focus on chasing moving safety ring | Code v5.83; mobile check pending |
| 12 | Escort feels odd | Wisp follows within 220px, travels 120px/s, channels sooner; goal text now emphasizes defending it from raiders | First pass v5.83; mobile check pending |
| 13 | Temple upgrades difficult because shovels scarce | Keep daily ten and stage rewards; offer 5 more for 120 Sugar, max three purchases/day | Code v5.83; economy check pending |
| 14 | More uses for money | Shovel purchase is a repeatable capped Sugar sink; assess other sinks after observing balances | First pass v5.83; economy check pending |
| Extra | Make Build Path choice obvious with names | Named paths, role line and one-path instruction | Code v5.81–5.82 |

## Next playtest

Use the same stage and difficulty to compare each path. Record stage, difficulty, path, card ranks, boss hit count, time to kill, and FPS. Test the mobile touch area for AUTO; try Clean Air and Escort on Chapter 2. Check current Sugar and shovel balances before changing shop price. Report any Mint card by its in-game name when its effect still appears missing.
