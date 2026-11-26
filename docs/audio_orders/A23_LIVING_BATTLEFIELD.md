# A23 — Living battlefield audio library

Owner approved all five groups and runtime integration on 26 November 2026.
Use ElevenLabs Sound Effects and existing saved voices only. No new voice designs.

| Group | Masters | Runtime | Content |
|---|---:|---:|---|
| Combat Patterns | 60 | 60 | 10 patterns × warning / arrival / release × 2 variations |
| Side events | 32 | 32 | 8 event identities × open / progress / complete / close |
| Stage ambience | 45 | 15 | 15 stages × 3 variations, approximately 90 seconds each |
| Monster families | 64 | 64 | 8 families × spawn / attack / hurt / disperse × 2 variations |
| Saved character voices | 48 | 48 | Ruby + 6 heroes × 6 reactions, 3 companions × 2 replies |
| Boss room ambience | 15 | 3 | 15 individual 30-second rooms; one representative per chapter ships |
| Total | **264** | **222** | 42 alternate ambience masters remain in the source library |

## Delivery specification

- `assets/incoming/audio_a23/` contains MP3 mono 44.1 kHz 128 kbps masters, MANIFEST.json, PROMPTS.json, QA_REPORT.json, CREDIT_REPORT.json and AUDITION.html.
- True peak ≤ −1 dBTP. Leading silence ≤ 40 ms for one-shot SFX and ≤ 60 ms for voices. No leading-silence limit for continuous ambience.
- Ambience uses three original 30-second ElevenLabs segments per master, joined and looped with short crossfades. No generated tones or procedural audio synthesis.
- Ambience target −24 LUFS, stable quiet texture, no speech or music. Master duration approximately 90 seconds.
- Runtime uses a crossfaded 20-second excerpt per stage at 96 kbps; voices at 56 kbps, other SFX at 96 kbps. Alternate ambience takes stay source-only.
- Existing female Cocoa and soft mysterious female Sesame voices are retained. Ruby uses the A07 voice; companions use the saved A08 voices.

## Integration

- Literal URLs in ASSET_AUDIO; voice URLs in A23_VOICES. Never load A23 at boot or through broad background prefetch.
- `ensureStageAudio` selects the current stage ambience and monster family, plus battle/event cues, and evicts other stage audio.
- Combat Director formations play warning/arrival/release accents. Automatic side events play open/progress/completion or neutral closing cues.
- Existing League cues route to the new corresponding event sounds, retaining the original cue when unavailable. Hunger Crack and Nectar have dedicated hooks.
- Monster sounds are nearby-only and globally throttled by family. Bosses, minibosses and dummies retain their existing sounds.
- VoiceActing retains mute/voice settings, scene/player validity, dialogue priority and bark spacing. Existing Unique and companion reply pools include new lines.
- Ambience stops on existing pause, card, death and teardown paths, resumes during active play, and plays more softly during boss fights.
- No damage, spawn timing, mission rules, rewards or progression changes.

## Credit accounting

Initial owner screenshot balance 53,036 credits. Production ceiling 51,510, leaving a buffer for the account.
The API key does not allow `user_read`, so current balance cannot be verified. Record provider `character-cost` and request IDs per generation. Never enable overage or modify billing.

## ส่งมอบ

26 พ.ย. 2026 · ส่งครบ 264 ไฟล์ ไม่มีไฟล์ขาด · ตรวจขนาด/รูปแบบ/ความยาว/ความดัง/ความเงียบต้นเสียงและรอยต่อลูปผ่าน · ผูก 222 ไฟล์ใน v8.3.5 อีก 42 ไฟล์เก็บสำรองใน incoming · ใช้ 51,504 เครดิต เหลือประมาณ 1,532 จากภาพตั้งต้น · รอเจ้าของฟังบนมือถือ

ยืนยันการปล่อย v8.3.5 แล้ว · commit `50c3e335` · [Pages deploy + visual ผ่าน](https://github.com/hardza1230/Survival-like-Mobile-Game/actions/runs/45728918915) · [Android APK ผ่าน](https://github.com/hardza1230/Survival-like-Mobile-Game/actions/runs/45728918910) · 262 package checks + 11 browser checks ผ่าน · แอป 188.2 MB · ตรวจเวอร์ชันสดและ SHA-256 เสียงตัวแทน 9 ไฟล์ตรงกับ runtime
