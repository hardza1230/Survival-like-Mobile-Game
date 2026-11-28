<!-- scripts/bump-version.mjs keeps the newest two release notes in this file (Latest + Previous); older ones move to docs/CLAUDE_HISTORY.md -->

# Latest delivery: v8.3.40 — Story draft 4: every hero is a Seedbearer

- Owner chose story theme 4 (28 Nov): the Heart Seed sprouts for anyone still brave, so every hero is an equal Seedbearer and new heroes fit without changing the main story. Player = Keeper; Strawberry's apprentice past moves to her personal episode; Mochi Garden is where the sprouts grow.
- `docs/STORY_CANON.md` is now draft 4 (old drafts 2–3 kept below as history).
- In-game text: stage intros/epilogues say "you"/"the Seedbearers" instead of Strawberry · `RUBY_STORY` C1-2…C1-5 no longer announce hero unlocks · opening comic gets a final "seed splits into sprouts" shot (existing art) · hero comics: "A sprout of the Heart Seed drifts down to them." · C3-3 mirror no longer reveals Strawberry · ending: the Seedbearers plant the seed together · C1-5 boss renamed **Hunger’s Mouth** (bestiary + achievement).
- Changed voiced lines stay silent until re-voiced: voice order `docs/audio_orders/A24_STORY_DRAFT4_REVOICE.md` (11 keys). `tests/story-motion-art` lists them in `REVOICE`; epilogue fixture updated.

# Previous delivery: v8.3.39 — All heroes open from the start, with play-style tags and difficulty
Owner 28 Nov: heroes should not be tied to stages (more heroes are coming) — unlock everyone from the start and label them. `HEROES_ALL_OPEN=true` (`src/07-…`): `Save.unlockCoreCharacters` gives every save all heroes, `heroRevealed` no longer waits for the rescue scene, the Heroes tab opens from the start (`FEATURE_OPEN.char=0`), hero details say "Available ✓". `HERO_TAGS` + `heroTagLine` / `heroDiffLine` show play-style tags and difficulty on the preview panel and the details popup: Strawberry Ranged · Crit (Easy), Mint Ranged · Crowd control (Normal), Cocoa Melee · Tank (Normal), Taro Ranged · Area damage (Normal), Yuzu Companion · Support (Normal), Sesame Ranged · Spell combos (Hard). The C1 rescue scenes still play as story at their stages (STORY_CANON note). Tests: `hero-unlock-ch1`, `hero-roster`.
