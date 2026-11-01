# A06 — new feature sound effects

**28 final cues / 84 original ElevenLabs donors.** The brief's table contains28 unique keys (4 Forge +3 Merge +1 Relic +9 Status +5 Yuzu +2 Taro +4 Login/Depths); its printed29 total was an arithmetic typo. Every table row is delivered.

All sound content was generated directly with ElevenLabs Sound Effects (`eleven_text_to_sound_v2`). Three alternatives were generated per key; the earlier successful API access-test donor is reused as Forge Good take1. `donors/` keeps every unmodified MP3. `PROMPTS.json` records exact parameters, UTC timestamps, returned credit metadata, hashes, chosen donor and mechanical processing. The synchronous API did not return a task ID in the captured response headers; no job IDs are invented. Credentials are read from the environment and never saved.

Final files are44.1kHz mono128kbps MP3, decoded and checked for duration, leading silence, non-silence and true peak. `MANIFEST.json` contains final hashes, duration, selected donor, peak and measured LUFS-S. `QA_REPORT.json` contains all28 checks. Targets are within1.5LU; all final true peaks are≤−1.2dBTP. Short clips are zero-padded **only during analysis** to measure the maximum EBU R1283-second short-term window; silence padding is not stored in delivered cues.

Selection used retained event energy, low cutoff energy, restrained high-frequency content and the least adequate compression. Processing is mechanical crop, DC-offset removal, brief attack/tail fades, optional compression and gain. No synthesized layers or other-provider audio was added. This signal analysis is **not a claim of semantic listening**: phone-speaker listening and preference review remain with the owner.

Open `AUDITION.html` locally to hear final sets, compare all raw takes, compare existing Legend → Mythic → Ancient → Divine, and compare Yuzu Grow → Form2 → Form3. Raw donors are unmastered and may differ in level. The reference Legend/Grow cues come from existing game files, not new copies.

Reproduction: `generate_a06.py` resumes missing donor jobs from its ledger (requires the owner's environment key; it consumes credits only for missing jobs). `prepare_a06.py` selects and processes donors using ffmpeg/ffprobe and numpy. `build_audition.py` rebuilds the listening page. The generator enforces the observed450-character API prompt limit.

This is a **source delivery awaiting runtime integration**. No `game.js`, registration, runtime audio, balance, version or playback system was changed. Integration call sites and throttles remain in `docs/audio_orders/A06_NEW_FEATURES_SFX.md`.
