# Campaign music C1-1 to C3-5 — 45-track handoff

Owner requested all regular-stage music by theme, plus FUN exciting miniboss/boss combat music. Delivered 15 normal + 15 miniboss + 15 boss loop MP3. Generated 44 new tracks; C3-1 normal reuses previous Ashen Seedfields trial (no duplicate paid generation). Files only: no runtime mapping changes; current game version 6.80.0.

Base commit 5f2abe541628934ca1945d3d849cde1e1267f2c4. Next AI must inspect latest game.js, AGENTS.md and CLAUDE.md before editing. This delivery does not replace ongoing game changes.

## Files

- assets/audio/bgm/elevenlabs_campaign/c1, c2, c3: 15 loop files per chapter.
- MANIFEST.json: exact audio key, literal path, chapter/stageIndex/globalStageNumber, kind, foe, durations and SHA256.
- PROMPTS_AND_JOBS.json: all prompts and generation parameters; model music_v2_5, instrumental.
- GENERATION_REPORT.json: paid generation response metadata + reused C3-1 source.
- TECHNICAL_QA.json: successful decode, non-silent, peaks/RMS, processing.
- Unprocessed generation sources archived outside repo in stage-music-all-sources.zip; only playback loops committed to avoid doubling asset weight. Existing old campaign music retained for fallback.

## Runtime integration required

1. Register 45 literal paths in ASSET_AUDIO. Repoint existing bgm_s01..bgm_s15 and bgm_m01..bgm_m15 to the corresponding new loop. Add bgm_b01..bgm_b15. build-www only copies literal referenced asset paths: a manifest alone does not ship playable assets.
2. Important: bgmKeyFor currently resolves stages per sNN, miniboss per mNN, but Boss falls back to chapter/shared bgm_boss1..5. Add per-stage boss resolution for bgm_bNN after the existing BGM_MODE=endgame branch and before chapter fallback. Keep legacy fallback logic and endgame music priority intact.
3. Use Sfx.playStageBgm / playMiniBgm / playBossBgm and existing _playTrack loop, mute, music slider and transition handling. No new AudioContext/HTML Audio layer.
4. C1-1 = stageIndex 0, global stageNum 1. C2-1 = 5/6. C3-1 = 10/11. C3-5 = 14/15. Do NOT map C3-1 to bgm_s03.
5. Respect existing lazy loaders ensureStageBgm/ensureBattleBgm (inspect current names) and cache/preload selection. Do not load all 45 MP3 before starting game; load only active stage/mini/boss needs. Verify boss intro, musicReady gating and resume after defeat/revive.
6. Return to normal theme after miniboss, Boss theme starts at actual encounter; no restart each attack/wave. Scene transitions/pause/mute/death stop or pause according to existing flow. Never overlap multiple full BGM voices.
7. Existing starting gain ~stage .30 / mini .33 / boss .34 plus music slider can be retained then tuned on device. Loops normalized toward -18 LUFS / -1.5 dBTP to leave room for gunshot/Unique SFX. Do not raise all music gain to 1.
8. Listen on phone for theme, excitement, transition loudness and 3+ full repeats. Generated tempo/key and musical seam are not proven by technical QA. MP3 decoder gapless behavior matters. Tweak loop boundary after audition if needed.
9. Runtime integration warrants version/changelog bump + npm check/relevant audio contract checks. Owner performs actual mobile playtest, no headless gameplay sims. Push live branch, verify Pages per repo rules.

## Loop preparation / QA limits

Normal/Boss requested 64s; Miniboss 48s. Music API has no seamless-loop switch. Decoded original audio, applied circular linear end/start crossfade approximately one requested-tempo bar (normal 2s, mini ~1.714s, boss 1.6s), with tiny 2ms boundary fades, encoded playback MP3 192k. Crossfade shortens duration. C3-1 retains earlier ~62s prepared loop. This reduces boundary discontinuity; it does NOT prove beat alignment or musical seamlessness. No listening approval claimed. All 45 decode and contain non-silent audio.

## Stage / encounter table

| Stage | Theme | Miniboss | Boss | Keys |
|---|---|---|---|---|
| C1-1 | The Sour Ant Nest | Ruby-Fang Guard | Emerald Acid Ant Empress | bgm_s01 / bgm_m01 / bgm_b01 |
| C1-2 | The Rotting Drain | Valve Maw, Pressure Warden | Clogmaw, Lord of Clogged Pipes | bgm_s02 / bgm_m02 / bgm_b02 |
| C1-3 | Chili Engine Room | Boiling Pan | Mr. Griddle | bgm_s03 / bgm_m03 / bgm_b03 |
| C1-4 | Sugar Frost Prison | Giant Ice Block | Ice Cream Golem | bgm_s04 / bgm_m04 / bgm_b04 |
| C1-5 | The Crown Oven of Hunger | Banquet Executioner | The Great Hunger | bgm_s05 / bgm_m05 / bgm_b05 |
| C2-1 | The Fermented Canopy | Sporewarden Mantis | Rootmother's Bud | bgm_s06 / bgm_m06 / bgm_b06 |
| C2-2 | Mycelium Marsh | Fungal Juggernaut | Mycelium Behemoth | bgm_s07 / bgm_m07 / bgm_b07 |
| C2-3 | Nectar Hive | Royal Stinger | Ferment Hornet Queen | bgm_s08 / bgm_m08 / bgm_b08 |
| C2-4 | Four-Season Conservatory | Season Keeper | Chronobloom Orchid | bgm_s09 / bgm_m09 / bgm_b09 |
| C2-5 | Root Throne | Ancient Root Knight | The True Rootmother | bgm_s10 / bgm_m10 / bgm_b10 |
| C3-1 | Ashen Seedfields | Scarecrow Reaper | The Harvest Colossus | bgm_s11 / bgm_m11 / bgm_b11 |
| C3-2 | Hollow Orchard | Husk Gardener | The Hollow Bloom | bgm_s12 / bgm_m12 / bgm_b12 |
| C3-3 | Glass Greenhouse Ruins | Prism Sentinel | The Glass Gardener | bgm_s13 / bgm_m13 / bgm_b13 |
| C3-4 | The Seed Vault | Vault Keeper | The Seedwarden | bgm_s14 / bgm_m14 / bgm_b14 |
| C3-5 | Throne of the First Seed | Crown Thorn Knight | The First Planter | bgm_s15 / bgm_m15 / bgm_b15 |

## Owner copy/paste request

อ่าน docs/audio_orders/CAMPAIGN_MUSIC_45_HANDOFF.md แล้วผูกเพลง 45 เพลงจาก assets/audio/bgm/elevenlabs_campaign/ กับ C1-1 ถึง C3-5 ใช้ Sfx เดิม เพิ่ม boss key รายด่านใน bgmKeyFor ให้ถูกต้อง คง endgame fallback และโหลดเฉพาะเพลงที่ใช้ ตรวจแล้ว push ตาม CLAUDE.md
