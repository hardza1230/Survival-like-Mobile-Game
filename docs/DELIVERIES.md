<!-- scripts/bump-version.mjs keeps the newest two release notes in this file (Latest + Previous); older ones move to docs/CLAUDE_HISTORY.md -->

# Latest delivery: v8.2.66 — Smoother mission creatures

Phase 2B expands nine mission monster movement loops from four to eight painted frames: Hunger Herald Healer, Booster and Possessor; Seed Rift Fast, Armored and Split carriers; Orchard Bee, Lantern Moth and Hunger Siege Sapper. The atlas frame size, walk or flap cycle duration, lazy stage groups, mission hooks and fallback sprites stay intact. Nine transparent PNGs, art prompts, QA and a preview live in assets/incoming/mission-motion2b. The dedicated contract checks source hashes, frame counts, original cycle duration and the mission load routes. Orders 85 and 87 source records are retained and their integration checks verify the new runtime paths.

# Previous delivery: v8.2.65 — Smoother Frozen Pantry army

All seven Frozen Pantry walk loops now use eight painted 128×128 frames with the original idle frame and foot line. Frame rate doubles per role to preserve its original cycle duration. Stage and roaming mission loading, fallback art, behavior and hitboxes retain the existing implementation. Source sheets with prompt and loop QA plus a preview are in assets/incoming/frozen-pantry. The updated contract verifies atlas dimensions, source checksums, the same walk cycle period, and the frozen and awake paths. This completes the first batch of phase 2 after checking the v8.2.64 updates. The next batch covers Herald minions and Seed Rift carriers.
