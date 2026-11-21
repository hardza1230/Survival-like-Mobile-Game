# A20 — ฉากเข้าด่าน "Ruby พาไปด่านถัดไป" (ม่านชื่อด่าน · เสียงเดินทาง · Ruby แนะนำด่าน) · ใบสั่งเสียง

สถานะ: 🟡 รอเสียง · เขียน 21 พ.ย. 2026 · **เจ้าของอนุมัติบท Ruby ทั้งหมด 21 พ.ย.** · ยังไม่มีโค้ด (ตอนนี้ม่านชื่อด่านมีแค่ `sfx_stage_title` ตัวเดียวทุกด่าน)
ส่งที่ `assets/incoming/audio_a20/` พร้อม `MANIFEST.json` (key, file, text (เฉพาะเสียงพูด), bytes, sha256, duration_ms), `PROMPTS.json`, `QA_REPORT.json`
เครื่องมือ: **ElevenLabs** · SFX = Sound Effects · เสียงพูดใช้ **เสียง Ruby เดิมของ A07** (voice ID ใน `assets/incoming/audio_voice_acting/VOICES.json` key `ruby`) · ห้ามเสียงสร้างด้วยโค้ด/Runway · กติการ่วมดู `A00_README.md`

## ระบบในเกม (อ้างอิง)
ทุกครั้งที่กดเข้าด่าน (หลังฉากการ์ตูน Ruby ของด่าน 1–5 ถ้ามี) จะมี **ม่านดำชื่อด่าน** `rubyEntryCurtain`: บรรทัดเล็ก "CHAPTER 2 · STAGE 3" → ชื่อด่านตัวใหญ่ → คำโปรย (tagline) แล้วม่านเปิดเข้าด่าน · ครั้งแรก ~2.5 วิ · เล่นซ้ำ ~1.4 วิ
ด่าน 6–15 ไม่มีฉากการ์ตูนก่อนเข้า → ม่านนี้คือ "ช่วงที่ Ruby พาผู้เล่นเดินทางไปด่านต่อไป" แต่ตอนนี้เงียบเกือบทั้งหมด

| # | ด่าน | Chapter | คำโปรยในเกม |
|---|---|---|---|
| 1 | The Sour Ant Nest | 1 ครัว | Every hero starts with a fall. |
| 2 | The Rotting Drain | 1 | What the nest spills, the drains remember. |
| 3 | Chili Engine Room | 1 | Somewhere below, a fire is eating flavor. |
| 4 | Sugar Frost Prison | 1 | In the cold, someone is still waiting. |
| 5 | The Crown Oven of Hunger | 1 | The Hunger is awake. And it is listening. |
| 6 | The Fermented Canopy | 2 สวน | A root that runs can still grow. |
| 7 | Mycelium Marsh | 2 | Breathe while you still can. |
| 8 | Nectar Hive | 2 | The sweetest things are the first to be taken. |
| 9 | Four-Season Conservatory | 2 | Four seasons. One broken garden. |
| 10 | Root Throne | 2 | Every root leads somewhere. This one leads to a throne. |
| 11 | Ashen Seedfields | 3 บัลลังก์ | Nothing grows where the Crown has fed. |
| 12 | Hollow Orchard | 3 | Ripe on the outside. Empty within. |
| 13 | Glass Greenhouse Ruins | 3 | Glass remembers what people forget. |
| 14 | The Seed Vault | 3 | The last of every flavor sleeps here. |
| 15 | Throne of the First Seed | 3 | Take off the Crown. End the curse. |

## A. SFX ม่านเดินทาง (MP3 44.1 kHz · ไม่มีเสียงพูด/ดนตรีเต็มเพลง · โลกขนมหวาน)
| key | เสียง | ยาว | ใช้ตอน |
|---|---|---|---|
| `sfx_a20_curtain_in` | ผ้าม่านกำมะหยี่ปิดลง "ฟึ่บ" + กริ่งเล็ก | 0.6 วิ | ม่านดำขึ้น |
| `sfx_a20_steps` | เสียงเท้าเล็ก ๆ วิ่งตาม Ruby บนพื้นขนม 4–5 ก้าว + เสียงเยลลี่เด้ง (Ruby) | 1.2 วิ | ระหว่างตัวหนังสือขึ้น (ครั้งแรกเท่านั้น) |
| `sfx_a20_title_ch1` | สติงเกอร์ชื่อด่าน **ครัว**: ฝาหม้อกระทบ + มาริมบาขึ้น 3 โน้ต อบอุ่น | 1.4 วิ | ชื่อด่านโผล่ Chapter 1 (แทน `sfx_stage_title`) |
| `sfx_a20_title_ch2` | สติงเกอร์ **สวน**: ใบไม้ไหว + ระฆังลม + พิณขึ้น 3 โน้ต ลึกลับ | 1.4 วิ | Chapter 2 |
| `sfx_a20_title_ch3` | สติงเกอร์ **บัลลังก์**: ระฆังโบสถ์ต่ำ + เครื่องสายค้าง มืดแต่มีหวัง | 1.6 วิ | Chapter 3 |
| `sfx_a20_title_boss` | สติงเกอร์ด่านสุดท้ายของบท (5/10/15): กลองใหญ่ 2 ครั้ง + เสียงคำรามไกล ๆ | 1.8 วิ | ด่าน 5, 10, 15 (แทนสติงเกอร์ของบท) |
| `sfx_a20_curtain_out` | ม่านเปิดออก "วู้ช" ขึ้นสูง + ประกาย | 0.7 วิ | ม่านเปิดเข้าด่าน |

## B. Ruby แนะนำด่าน (MP3 mono 44.1 kHz 128 kbps · peak ≤ −1 dBTP · ตัดเงียบต้น ≤ 60 ms · **บทตรงทุกตัวอักษร** · ≤ 3.0 วิ)
เล่นบนม่าน **ครั้งแรกที่เข้าด่านนั้น** (ครั้งต่อไปใช้ชุด C) · โทน: เพื่อนตัวเล็กที่ตื่นเต้นพาเดินทาง ไม่ใช่ผู้บรรยาย
| key | บท | อารมณ์ |
|---|---|---|
| `vo_ruby_go_01` | Down we go — into the Sour Ant Nest! | ตื่นเต้น |
| `vo_ruby_go_02` | Hold your nose. The Rotting Drain is next! | ขำ ๆ |
| `vo_ruby_go_03` | Feel that heat? The Chili Engine Room! | ระวัง |
| `vo_ruby_go_04` | Brr… someone is trapped in the Frost Prison. | เศร้า อ่อนโยน |
| `vo_ruby_go_05` | The Crown Oven. Stay close to me. | กลัวแต่กล้า |
| `vo_ruby_go_06` | Up into the garden — the Fermented Canopy! | ดีใจ |
| `vo_ruby_go_07` | Mycelium Marsh. Don’t breathe the spores! | ระวัง |
| `vo_ruby_go_08` | The Nectar Hive smells so sweet… too sweet. | สงสัย |
| `vo_ruby_go_09` | Four seasons in one room? Let’s go see! | อยากรู้ |
| `vo_ruby_go_10` | The Root Throne. This is where it’s been hiding. | จริงจัง |
| `vo_ruby_go_11` | The Seedfields are all ash… we have to keep going. | เศร้า |
| `vo_ruby_go_12` | Hollow Orchard. Don’t trust the shiny fruit! | ระวัง |
| `vo_ruby_go_13` | Look at the glass — it’s showing old memories! | ทึ่ง |
| `vo_ruby_go_14` | The Seed Vault. Every lost flavor is in here! | หวัง |
| `vo_ruby_go_15` | The First Seed’s throne. Let’s end this — together. | เด็ดเดี่ยว อบอุ่น |

## C. Ruby เล่นซ้ำ (ม่านรอบสอง ๆ · สุ่ม 1 ใน 4 · ≤ 1.8 วิ)
| key | บท |
|---|---|
| `vo_ruby_go_again_1` | Back again? Let’s go! |
| `vo_ruby_go_again_2` | I remember this place! |
| `vo_ruby_go_again_3` | Ready when you are! |
| `vo_ruby_go_again_4` | One more time — stay sharp! |

**รวม 26 ไฟล์ (SFX 7 · เสียงพูด 19)**

## ข้อห้าม
- ห้ามเปลี่ยนคำในบท · ใช้ `’` และ `—` / `…` ตามบท · ห้ามเสียง Ruby แบบใหม่ (ต้องใช้ voice ID เดิม)
- สติงเกอร์ต้องจบเองภายในเวลาที่กำหนด (ไม่มีหาง reverb ยาวทับเพลงด่าน) · ห้ามเลียนเพลง/เสียงจากเกมที่มีอยู่จริง
- บทของ Ruby ต้องไม่ขัด `docs/STORY_CANON.md` (Ruby = วิญญาณแยม ผู้ช่วย · Crown/Hunger คือศัตรู · ไม่สปอยตอนจบ)

## โน้ตฝั่งโค้ด
- แพ็ก: SFX 96k → `assets/audio/sfx/a20/` · เสียงพูด 56k mono → `assets/audio/acting/` + เพิ่มใน `A07_CATALOG` (role `ruby`)
- `rubyEntryCurtain(idx)`: ม่านขึ้น → `curtain_in` · ครั้งแรก (`first`) → `steps` + `vo_ruby_go_NN` (NN = idx+1) · เล่นซ้ำ → `vo_ruby_go_again_*` (โอกาส ~50% ไม่ให้พูดทุกครั้ง) · `cineTitle` ตอนชื่อโผล่: `Sfx.orderCue('stage_title')` → `sfx_a20_title_ch1/2/3` (ด่าน 5/10/15 → `title_boss`) · ม่านเปิด → `curtain_out`
- ใช้ `VoiceActing.play(scene,key,valid)` ต้องส่ง valid = ม่านยังอยู่ (`()=>this._rubyEntry===c`) · ปิด Ruby ในตั้งค่า (`noRuby`) = ไม่พูด แต่ SFX ยังเล่น
- โหลด: SFX + เสียงของด่านนั้นตอนกดเข้าด่าน (พร้อม `ensureStageAudio`) · ไม่มีไฟล์ = เงียบ/เสียงเดิม (`sfx_stage_title`)
- งบขนาด: ~1.2 MB

## ส่งมอบ
(ฝั่งเสียงกรอกตอนส่ง)
