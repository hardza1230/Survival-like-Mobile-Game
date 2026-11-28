<!-- scripts/bump-version.mjs keeps the newest two release notes in this file (Latest + Previous); older ones move to docs/CLAUDE_HISTORY.md -->

# Latest delivery: v8.3.41 — Hero bar on the stage screen

- Owner asked for a hero-select scene (28 Nov) and chose a bar on the stage-select screen (no extra tap before a run).
- `stageHeroBar` (src/22): a face for every playable hero (`heroRevealed`), the chosen one ringed gold · tap a face = switch hero at once (`Save.data.character`) and rebuild · under the faces: name · tags · difficulty · ⚡ Power of the chosen hero · landscape uses one row.
- Faces crop `card_<hero>` with `LOBBY_FACE` (skins respected), load lazily and rebuild only while still on the stage screen; emoji fallback.
- Stage cards start below the bar. Hidden when only one hero is playable. Test `tests/stage-hero-bar-8341`.

# Previous delivery: v8.3.40 — Story draft 4: every hero is a Seedbearer

- Owner chose story theme 4 (28 Nov): the Heart Seed sprouts for anyone still brave, so every hero is an equal Seedbearer and new heroes fit without changing the main story. Player = Keeper; Strawberry's apprentice past moves to her personal episode; Mochi Garden is where the sprouts grow.
- `docs/STORY_CANON.md` is now draft 4 (old drafts 2–3 kept below as history).
- In-game text: stage intros/epilogues say "you"/"the Seedbearers" instead of Strawberry · `RUBY_STORY` C1-2…C1-5 no longer announce hero unlocks · opening comic gets a final "seed splits into sprouts" shot (existing art) · hero comics: "A sprout of the Heart Seed drifts down to them." · C3-3 mirror no longer reveals Strawberry · ending: the Seedbearers plant the seed together · C1-5 boss renamed **Hunger’s Mouth** (bestiary + achievement).
- Changed voiced lines stay silent until re-voiced: voice order `docs/audio_orders/A24_STORY_DRAFT4_REVOICE.md` (11 keys). `tests/story-motion-art` lists them in `REVOICE`; epilogue fixture updated.
