# Sound design — six commits

1. **UI foundation (v6.0.48, implemented):** four generated WAVs (click 75 ms, back 120 ms, confirm 170 ms, error 150 ms), semantic dispatch, one cue per menu tap, independent two-voice UI budget, mute/SFX volume and synthesis fallback. Shared Back, craft confirmation and explicit rejection banners connected. Remaining specialized outcomes belong to later commits.
2. **Craft roulette:** dedicated start/tick/stop/common/rare sounds; replace chest sounds; auto-roll stop and currency exhaustion.
3. **Affix changes:** capacity, numeric reroll, removal and reset sounds tied to actual success.
4. **Equipment:** equip, lock/unlock, enhance success/failure, dismantle and sell.
5. **Permanent progress:** cores, talents, promotion and distinct reward claims.
6. **Results:** Sugar counting, sequential reward reveals, important rewards; final mix pass.

Each step: generate deterministic assets, register audio keys, wire events, test mute/volume and repeated input, build, then create its own commit. Mobile listening review remains necessary. UI should not duck BGM. Later steps must use semantic cues explicitly rather than guessing from text labels.

Generator: `python scripts/gen_ui_sfx.py` (standard library only). Mono 44.1 kHz, signed 16-bit PCM, soft attack/release, peaks below clipping.
