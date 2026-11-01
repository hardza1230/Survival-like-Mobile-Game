# Current checkpoint — audio order A06 source delivery (1 Nov2026)

Owner requested all A06 sound effects using the already configured ElevenLabs API. Direct Sound Effects access was verified HTTP200 using process `ELEVENLABS_API_KEY`; no new connection or credential exchange is needed. Never print/store the key. This delivery tries current process environment first, with user-environment fallback.

Completed all **28 distinct table keys** in `docs/audio_orders/A06_NEW_FEATURES_SFX.md` (printed29 arithmetic total corrected). Three original ElevenLabs alternatives per key,84 donors including the previous access-test Forge Good donor. Delivered in `assets/incoming/audio_new_features/`:28 final MP3s, unchanged donors, exact prompts/timestamps/provider metadata/selection provenance, MANIFEST, QA_REPORT, local AUDITION page and three reproducible Python helpers. No synthetic sounds or Runway substitution.

All28 final cues decode as mono44.1kHz/128kbps, exact requested decoded duration, non-silent, leading silence≤0.045ms, true peak≤−1.2dBTP, max loudness-target error1.5LU. Total final audio20.25s /354,788bytes. LUFS-S is the max3s EBU R128 window with analysis-only tail padding. Processing only crop/fade/DC removal, optional compression and gain; selected with signal-quality metrics. **Semantic/phone listening remains owner review**; do not claim human audition. AUDITION compares Legend→Mythic→Ancient→Divine and Yuzu Grow→Forms2/3, plus all raw alternatives.

Source-only: game.js, runtime audio, registration, balance and GAME_VERSION unchanged from v8.0.90. Delivery lives in its containing commit on the vampire branch; publish/immutable-byte verification is recorded locally in `.git/a06-verified.json` when complete. Other agents keep working: fetch first, preserve their new docs/runtime, never force push.

Next: owner phone listening, then integrate literal runtime paths and existing Sfx/yuzuSound/taroSound call sites/throttles in A06. No fake paths; preserve old-cue fallbacks/mute/sliders. No Sesame work. Art61/62 are already wired in runtime84/85. Art63 and voice-order A07 are separate work, not included here.

Observed ElevenLabs prompt cap450characters; generator enforces it. Sound Effects min duration0.5s; donors add0.3s then trim to required0.25–1.8s. Synchronous responses exposed character-cost but no task ID in captured headers; recorded UTC+SHA provide provenance, never fabricate IDs. GitHub writes use connected exact-blob/tree route in AGENT_WORKFLOW; native push previously stalled in credential manager.
