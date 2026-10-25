# Menu art orders 50–54 — runtime v8.0.34

44 reviewed ImageGen WebP sheets /143frames, 797,626 compressed bytes. Promoted without resampling from the 50% alpha previews. Reproduce with `python scripts/pack-menu-orders-50-54.py`; hashes, grids and source folders are in MANIFEST.json.

Original PNGs, prompts, provenance, QA and source manifests remain under assets/incoming/{merge_forge,login_daily,awards,codex_books,depths_rank}/.

game.js registers literal paths for build/cache hashing, half-size cell/slice metadata in MENU_ORDER_ART/TEMPLE_UI, and per-page lazy groups. These assets are excluded from combat-critical loading and can be evicted before a run. Login popup reloads its art after eviction, with a bounded retry interval.

Consumers: Equipment/Merge/Forge, Daily Login/Quests, Awards/Lobby title ribbon, Bestiary/Recipe Book, Temple Depths/Rank Rewards and Lobby miner pill. Existing rewards, progression and click targets remain. Paper surfaces use dark ink; absence of an image keeps the original drawing/emoji fallback.

Animated halo/miner loops and one-shot effects belong to their image/container lifetime; destroying a page removes their timers. Reduced motion uses still frames. Phone visual/FPS review remains with the owner; this integration uses source/data/lifecycle checks, not a gameplay simulation.
