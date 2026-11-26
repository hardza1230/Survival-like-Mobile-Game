# Selected-stage artwork readiness — 26 November 2026

Owner requested investigating fallback art and a twelve-frame loading transition. Local registered image/sheet/FX paths were checked; none were missing. This does not establish the owner phone’s network or GPU failure cause without device logs.

## Findings and changes

- `ensureGroup` previously called success after 20 seconds even with missing/placeholder images. Stage groups now use a strict barrier. Only real decoded textures satisfy it. Three request failures or 20 seconds without progress offer recovery; progressing downloads may take longer.
- `ensureStageArt` previously trusted global `_deferDone` and cached ready flags. Every entry now checks the selected dependency list again, including hero/costume, stage/boss/mission art and shared battle art/FX.
- The hero retry window and 45-second watchdog previously allowed forced entry with fallback art. They no longer bypass readiness. The watchdog detects a stalled preparation and offers Try again/Back, with stale callbacks invalidated.
- The stage callback previously started a broad `ensureDeferred` decode of other assets. That call was removed. Current-stage assets are pinned against LRU eviction, unrelated stages are released and strict loading uses at most four simultaneous downloads to reduce decoding spikes.
- Portal progression previously waited only for audio. It now awaits selected artwork first. Boss Rush uses the same strict artwork path.
- GPU warm-up draws the selected real textures behind the DOM loading cover in small batches. It no longer hides the cover before character/audio/stage setup finishes. Warm state is committed only after the preparation completes and includes costume identity.

- Animation definitions referencing a replaced placeholder are removed before the texture is replaced. Deferred/enemy animations are created from real artwork, preventing old fallback-frame references from surviving a successful download.

- Mission cards can draw or reroll missions after initial stage setup. Their final Continue action rechecks the chosen mission artwork behind the same cover before allowing the first combat wave.

## Transition asset

`assets/incoming/loading_transition836/` contains one original built-in ImageGen atlas, 1448×1086 RGBA, 4×3 cells, 362×362, 12 frames, opaque plum background. The honey/jam portal and mochi seed loop use a 103,918-byte WebP at `assets/art/entry/transition836.webp`. No painted frames were generated with code. DOM/CSS plays all twelve cells over 1.44 seconds, supports reduced motion, and avoids a new WebGL texture allocation. Existing stage art supplies a dim background. The progress/readiness text and recovery controls remain real UI.

## Validation

Tests exercise missing/placeholder files, healthy slow progress, repeated request errors, cancellation/stale callbacks, false cached-ready flags, selected-stage scope, pinned textures, transition hashes and atlas geometry. Browser checks exercise all twelve CSS frames, progress counts, retry/back, small-phone control bounds and reduced motion. Existing persistent asset caching remains unchanged. Phone listening/visual/performance review is owner-side.

## Delivery

v8.3.6 released on 26 November 2026, game commit `27abfaf2`. All 263 package checks and 12 browser contracts passed; shipped app 188.3 MB. [Pages deploy and visual passed](https://github.com/hardza1230/Survival-like-Mobile-Game/actions/runs/45757435659), [Android APK passed](https://github.com/hardza1230/Survival-like-Mobile-Game/actions/runs/45757435671). Live version/HTML/code and the deployed transition atlas SHA-256 verified. Owner phone review remains.
