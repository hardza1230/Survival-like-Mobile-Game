# A08 — Unique skill voice lines (ราย Build) + Yuzu duo calls · ใบสั่งเสียง

สถานะ: ✅ เสียงครบ 53 ผูกเข้าเกมแล้ว · รอฟังตรวจ · 7 พ.ย. 2026 · ต่อจาก A07 (`A07_VOICE_ACTING.md`)
เครื่องมือ: **ElevenLabs TTS** ใช้ **เสียงที่บันทึกไว้แล้วของ A07** (voice ID ใน `assets/incoming/audio_voice_acting/VOICES.json` และ `assets/incoming/audio_voice_fix/` สำหรับ Cocoa/Sesame ที่แก้แล้ว) · ห้ามสร้างเสียงใหม่ ห้ามใช้เสียงสร้างด้วยโค้ด/Runway

## ทำไมต้องสั่ง
เจ้าของ (7 พ.ย.): **ใช้ Unique = มีเสียงทุกครั้ง** · โค้ด v8.1.36 ทำแล้ว (`VoiceActing.unique`) แต่ตอนนี้มีแค่ 2 ประโยคต่อฮีโร่ → ได้ยินซ้ำบ่อยมาก
ใบนี้เพิ่ม **3 ประโยคต่อ Build** ให้เข้ากับท่าของ Build นั้น · โค้ดหมุนประโยคราย Build + ประโยครวม 2 ประโยคเดิม (5 แบบต่อ Build) และไม่ซ้ำติดกัน

## รูปแบบไฟล์ (เหมือน A07)
- MP3 mono 44.1 kHz 128 kbps · peak ≤ −1 dBTP · ตัดความเงียบต้นไฟล์ ≤ 60 ms · **ยาว ≤ 1.3 วิ** (ท่าออกเร็ว ประโยคต้องจบก่อนท่าจบ)
- พูดแบบ **ตะโกนสั่งท่า มีพลัง** แต่ยังเป็นนิสัยตัวละคร (ไม่ใช่ทุกตัวต้องตะโกน: Mint = เย็น นิ่ง · Sesame = เบา ลึกลับ)
- ข้อความใน MANIFEST ต้อง **ตรงตัวอักษร** กับบทด้านล่าง (โค้ดใช้เป็นซับไตเติล) · ใช้ `’` ไม่ใช่ `'`

## หมวด 1 — Unique ราย Build (45 ไฟล์)
key `vo_<role>_unique_<path>_<n>` · role ของ Momo คือ `strawberry`

### Momo (`strawberry`) · ร่าเริง ซน มั่นใจ
| key | บท | ท่า |
|---|---|---|
| `vo_strawberry_unique_sniper_1` | Bullseye, berry style! | ยิงเมล็ดชาร์จนัดเดียว |
| `vo_strawberry_unique_sniper_2` | Hold still… gotcha! | |
| `vo_strawberry_unique_sniper_3` | One shot, all flavor! | |
| `vo_strawberry_unique_shotgun_1` | Berry blast! | กระจายเม็ดใกล้ ๆ |
| `vo_strawberry_unique_shotgun_2` | Up close and juicy! | |
| `vo_strawberry_unique_shotgun_3` | Pop pop POP! | |
| `vo_strawberry_unique_ricochet_1` | Bounce, little hearts! | หัวใจเด้งไปมา |
| `vo_strawberry_unique_ricochet_2` | Ping, ping, ping! | |
| `vo_strawberry_unique_ricochet_3` | Find them, hearts! | |

### Mint · ใจเย็น สั้น เท่ อบอุ่นข้างใน
| key | บท | ท่า |
|---|---|---|
| `vo_mint_unique_glacier_1` | Bloom, glacier. | ดอกน้ำแข็งบาน |
| `vo_mint_unique_glacier_2` | Stay frozen. | |
| `vo_mint_unique_glacier_3` | Cold, isn’t it? | |
| `vo_mint_unique_barrage_1` | Snowfall. | ห่าเกล็ดน้ำแข็ง |
| `vo_mint_unique_barrage_2` | Don’t move. | |
| `vo_mint_unique_barrage_3` | Let it snow. | |
| `vo_mint_unique_pierce_1` | Through you. | หอกน้ำแข็งทะลุ |
| `vo_mint_unique_pierce_2` | Ice lance. | |
| `vo_mint_unique_pierce_3` | One clean line. | |

### Cocoa · หมีสาวใจดี ขี้เซา แต่หมัดหนัก (เสียงผู้หญิงชุดที่แก้แล้ว)
| key | บท | ท่า |
|---|---|---|
| `vo_cocoa_unique_brawler_1` | Fire fists, go! | หมัดไฟรัว |
| `vo_cocoa_unique_brawler_2` | Toasty punches! | |
| `vo_cocoa_unique_brawler_3` | Hot cocoa, extra hot! | |
| `vo_cocoa_unique_titan_1` | Ground, shake! | กระแทกพื้น |
| `vo_cocoa_unique_titan_2` | Big bear stomp! | |
| `vo_cocoa_unique_titan_3` | Everybody, down! | |
| `vo_cocoa_unique_dashboxer_1` | Bear rush! | พุ่งชก |
| `vo_cocoa_unique_dashboxer_2` | Coming through! | |
| `vo_cocoa_unique_dashboxer_3` | Hug incoming! | |

### Taro · ตื่นเต้น ซุ่มซ่าม ชอบผจญภัย
| key | บท | ท่า |
|---|---|---|
| `vo_taro_unique_storm_1` | Chain lightning! | สายฟ้าโยงกัน |
| `vo_taro_unique_storm_2` | Jump, sparks, jump! | |
| `vo_taro_unique_storm_3` | Everyone gets a zap! | |
| `vo_taro_unique_tempest_1` | Sentries, on duty! | ตั้งป้อมฟ้า |
| `vo_taro_unique_tempest_2` | Guard this spot! | |
| `vo_taro_unique_tempest_3` | Zap anything weird! | |
| `vo_taro_unique_smite_1` | Lightning, right there! | ฟ้าผ่าเป้าเดียว |
| `vo_taro_unique_smite_2` | Spark strike! | |
| `vo_taro_unique_smite_3` | Bonk! …With thunder. | |

### Yuzu · หัวหน้าทีมจิ๋ว ภูมิใจในลูกทีม (path id ตามโค้ด)
| key | บท | ท่า (คู่หู) |
|---|---|---|
| `vo_yuzu_unique_citrusGuardian_1` | Pomelo, smash! | Pomelo |
| `vo_yuzu_unique_citrusGuardian_2` | Big peel, big punch! | |
| `vo_yuzu_unique_citrusGuardian_3` | Shield up, squad! | |
| `vo_yuzu_unique_zestSwarm_1` | Lime, take aim! | Lime |
| `vo_yuzu_unique_zestSwarm_2` | Right through them! | |
| `vo_yuzu_unique_zestSwarm_3` | Sharp and sour! | |
| `vo_yuzu_unique_juiceWorkshop_1` | Blood Orange, now! | Blood Orange |
| `vo_yuzu_unique_juiceWorkshop_2` | Stir up a storm! | |
| `vo_yuzu_unique_juiceWorkshop_3` | Seeds, find them! | |

## หมวด 2 — Sesame เพิ่ม (2 ไฟล์)
Sesame ไม่มี Build (Rune Invoker) และกดเวทบ่อย → ใช้ประโยครวมหมุน 4 แบบ · เสียงผู้หญิงเบา ลึกลับ (ชุดที่แก้แล้ว)
| key | บท |
|---|---|
| `vo_sesame_unique_3` | Mirror, remember. |
| `vo_sesame_unique_4` | Quietly… now. |

## หมวด 3 — Yuzu สั่งท่าประสาน (6 ไฟล์)
เล่นตอนท่าจบ (`duo_finish` ใน `yuzuParadeCast` ดีเลย์ 450 ms) · ≤ 0.9 วิ · พูดคู่กับประโยค Unique ไม่ได้ จึงเป็น **เสียงคู่หูตอบรับ** สั้น ๆ แบบพึมพำ/คำเดียว (ไม่มีซับ)
| key | ผู้พูด | บท |
|---|---|---|
| `vo_pomelo_duo_1` / `_2` | Pomelo (ใหญ่ ทุ้ม ใจดี) | "Hmph!" / "Pomelo… SMASH!" |
| `vo_lime_duo_1` / `_2` | Lime (เท่ ไว) | "Loosed." / "Got it!" |
| `vo_bloodorange_duo_1` / `_2` | Blood Orange (นักเวท ลึกลับ) | "Burn sweet." / "Seek." |
คู่หูยังไม่มีเสียง → ใช้ **ElevenLabs Voice Design** สร้าง 3 ตัวเลือกต่อตัว ให้เจ้าของเลือกก่อนอัด (ส่ง `vd_pomelo_1..3.mp3` ฯลฯ ใน `auditions/`)

## สรุป
| หมวด | ไฟล์ |
|---|---|
| 1 Unique ราย Build | 45 |
| 2 Sesame เพิ่ม | 2 |
| 3 Yuzu คู่หู (+ ออดิชันเสียง 9) | 6 |
| **รวม** | **53** (+9 ออดิชัน) |

## ส่งมอบ
`assets/incoming/audio_unique_a08/` + `MANIFEST.json` (key, file, bytes, sha256, duration_ms, speaker, voice_id, text ตรงตัวอักษร) + `PROMPTS.json` + `QA_REPORT.json` (peak, onset, duration ≤ 1.3 วิ)

## โน้ตสำหรับ AI ที่ผูกเสียง
- ไฟล์ไปที่ `assets/audio/acting/` แล้วเพิ่มแถวใน `A07_CATALOG` (url literal, text, role, duration) · หมวด 1–2 **ไม่ต้องแก้โค้ดเล่น**: `VoiceActing.unique()` หา `vo_<role>_unique_<path>_1..4` + `vo_<role>_unique_1..4` เองอยู่แล้ว
- อัปเดตจำนวนใน `tests/voice-acting-integration.test.cjs` (`Object.keys(C).length`)
- หมวด 3: เพิ่มเล่นเสียงคู่หูใน `yuzuParadeCast` ตอน duo_finish ผ่าน Sfx (ไม่ใช้ช่อง VoiceActing เพื่อไม่ตัดประโยค Yuzu) · เคารพปิดเสียงพากย์

## Partial delivery — 2026-11-07

47 hero Unique lines are generated and wired to the existing per-Build rotation, with exact text, saved voice IDs, retained ElevenLabs donors and measured technical QA in `assets/incoming/audio_unique_a08/`. Three original Voice Design options for each companion are available in `AUDITION.html`; none has been selected or saved for production, and the six companion responses are not generated or wired. Human listening for word accuracy, casting and performance remains pending.

## Completion — 2026-11-07

Owner delegated casting to the assistant. Candidate 1 for each companion is a provisional starting voice; six replies were generated and wired in v8.1.38. DuoVoice waits for hero dialogue, respects the voice setting and checks run/scene validity. All 53 lines pass measured technical QA; human listening remains outstanding.
