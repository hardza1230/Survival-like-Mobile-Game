# Sound design — six commits

1. **UI foundation (v6.0.48, implemented):** four generated WAVs (click 75 ms, back 120 ms, confirm 170 ms, error 150 ms), semantic dispatch, one cue per menu tap, independent two-voice UI budget, mute/SFX volume and synthesis fallback. Shared Back, craft confirmation and explicit rejection banners connected. Remaining specialized outcomes belong to later commits.
2. **Craft roulette (v6.0.49, implemented):** nine dedicated WAVs: start, tick, slowdown, common, rare, jackpot, near, cancel and exhaustion. Manual and auto reels follow visual ticks; results replace active reel voices. Removed layered chest/combat sounds from crafting. Stale Stop taps cannot trigger a second result. Independent two-voice budget, 45 ms tick throttle, mute/volume and synthesis fallback.
3. **Affix changes (v6.0.50, implemented):** four dedicated short cues for capacity, numeric reroll, removal and reset. Played after saved mutations; invalid/locked/missing-line actions produce no success cue, insufficient resources retain UI error. Confirmation taps retain confirmation feedback. Tests exercise actual action methods and currency/state outcomes.
4. **Equipment (v6.0.51, implemented):** eight dedicated WAVs: equip, lock, unlock, enhancement success/break/destruction, dismantle and sell. Current inventory, legacy equip/enhance and inbox dismantle are wired to successful return values. Uses the bounded menu-action voice player, SFX volume/mute and synthesis fallback; no BGM ducking.
5. **Permanent progress:** cores, talents, promotion and distinct reward claims.
6. **Results:** Sugar counting, sequential reward reveals, important rewards; final mix pass.

Each step: generate deterministic assets, register audio keys, wire events, test mute/volume and repeated input, build, then create its own commit. Mobile listening review remains necessary. UI should not duck BGM. Later steps must use semantic cues explicitly rather than guessing from text labels.

Generator: `python scripts/gen_ui_sfx.py` (standard library only). Mono 44.1 kHz, signed 16-bit PCM, soft attack/release, peaks below clipping.

Craft generator: `python scripts/gen_craft_sfx.py`. Clips 35–380 ms; no BGM ducking.

Equipment generator: `python scripts/gen_gear_sfx.py`; clips 120–320 ms.
