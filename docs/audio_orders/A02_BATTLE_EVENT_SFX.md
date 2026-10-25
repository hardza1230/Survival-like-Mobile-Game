# A02 — เสียงในด่าน: กลไกสนามบอส · Counter · ฆ่าบอส · ภารกิจ · สถานะ · Ruby · ปุ่มเร่ง · ใบสั่งเสียง

สถานะ: 🟡 รอเสียง · เขียน 25 ต.ค. 2026 · ส่งที่ `assets/incoming/audio_battle_events/`
กติการ่วมดู `A00_README.md` · ทั้งหมดเป็น SFX mono · **ต้องอ่านออกใต้เพลงบอสและเสียงยิงรัว ๆ** (คมแต่ไม่ดังแสบ)

## ตอนนี้เป็นยังไง (ตรวจจากโค้ด v8.0.33)
- กลไกสนามบอส (v7.9.13–15) ทั้ง 8 แบบ **เงียบหมด** มีแต่ภาพเตือน: น้ำเสียกวาดจอ, ช่องกระทะร้อน, เสาน้ำแข็ง/ลมหนาว, ฝักโล่, หมอกพิษ, เข็มนาฬิกา, วงแหวนหดตัว, เคียวครึ่งจอ
- Counter Object (ของที่ Dash เตะคืนใส่บอส): เกิด/เตือนก่อนระเบิด **เงียบ** · เตะใช้ `Sfx.select` · โดนบอสใช้ `Sfx.hit`
- ฆ่าบอสแบบหยุดภาพ + สโลว์ (v8.0.17) **เงียบ** · หลอดภารกิจเต็ม / ภารกิจสำเร็จ ใช้เสียงทั่วไป
- พิษ Hunt / เลือดออกตอนออกนอกวง Escort และ Capture **เงียบ** · Ruby โผล่พูดในด่านใช้ `Sfx.select` · ปุ่มเร่งเวลา **เงียบ** · Run Trait (ด่าน replay) เงียบ

## รายการเสียง
| key | ความยาว | เสียง | เล่นตอน |
|---|---|---|---|
| **กลไกสนามบอส** ||||
| `sfx_arena_warn` | 400 ms | สัญญาณเตือนน่ารักแต่ชัด (กระดิ่งสองโน้ตต่ำ-สูง) ใช้ร่วมทุกกลไก | ภาพเตือนกลไกขึ้น (ทุกแบบ) |
| `sfx_arena_sweep` | 1.2 s · loop ได้ | คลื่นน้ำ/รากไม้ไหลผ่านเป็นแถบยาว (กวาดซ้ายไปขวา) | น้ำเสียหรือรากกวาดจอ (C1-2, C2-5) |
| `sfx_arena_grid_burn` | 450 ms | กระทะฉ่า + ไฟลุกเป็นช่อง | ช่องร้อนติดไฟ (C1-3) |
| `sfx_arena_freeze_breath` | 1.0 s | ลมหนาวพัดหวีดยาวแล้วจบด้วยเกล็ดน้ำแข็ง | ลมหนาวของ Golem (C1-4) |
| `sfx_arena_pillar_crack` | 400 ms | เสาน้ำแข็งร้าวแตก "แกร๊ก" | เสาบังลมแล้วแตก |
| `sfx_arena_pod_shield` | 800 ms · loop ได้ | ฮัมโล่พลังสปอร์เบา ๆ | บอสมีโล่จากฝัก (C2-1) |
| `sfx_arena_shield_break` | 500 ms | กระจกเยลลี่แตก + ปล่อยลม | โล่หาย (เตะฝักครบ) |
| `sfx_arena_fog` | 2.0 s · loop | หมอกพิษฟู่ ๆ ต่ำ ๆ นุ่ม (เงียบพอให้วนได้นาน) | หมอกพิษเต็มจอ (C2-2) |
| `sfx_arena_clock_tick` | 120 ms | ติ๊กนาฬิกาเฟืองไม้ (ใช้ซ้ำ) | เข็มนาฬิกาหมุน (C2-4) — โค้ดเล่นทุก ~0.5 s |
| `sfx_arena_ring_close` | 1.5 s | วงแหวนรากหดเข้ามา เสียงเสียดสีไล่เสียงขึ้น | วงแหวนหดตัว (C3-3, Pinnacle) |
| `sfx_arena_scythe` | 600 ms | เคียวใหญ่ฟันครึ่งจอ "ฟ้าบ" ลมแรง | เคียวครึ่งจอ (C3-1) |
| `sfx_arena_decoy_reveal` | 500 ms | "ปุ๊บ" ตัวปลอมสลายเป็นฟอง | ตัวปลอม Hollow Bloom หาย |
| **Counter Object** ||||
| `sfx_counter_spawn` | 350 ms | ของเด้งลงพื้น "ปึ๋ง" + ประกายเล็ก (บอกว่าเตะได้) | ของ Counter โผล่ |
| `sfx_counter_kick` | 250 ms | เตะ "ป๊อก!" หนักแน่นสะใจ + วูบ | Dash เตะโดน |
| `sfx_counter_hit` | 600 ms | ชนบอสดังหนัก + บอสสะดุ้ง (ไม่ใช่เสียงคน) | ของที่เตะไปโดนบอส (บอสมึน) |
| `sfx_counter_fuse` | 900 ms | ติ๊ก ๆ เร่งขึ้นก่อนระเบิด | Counter ใกล้หมดเวลา (ก่อน 1 s) |
| **ฆ่าบอส / ภารกิจ** ||||
| `sfx_kill_freeze` | 150 ms | "ตึ้ง" หนักทุ้มตอนภาพหยุด | ฆ่าบอส/มินิ (เฟรมหยุด) |
| `sfx_kill_slowmo` | 900 ms | ลมเฉื่อยยืดเสียงลง (tape-stop นุ่ม) แล้วคืนตัว | ช่วงสโลว์หลังฆ่าบอส |
| `sfx_mission_tube_pop` | 450 ms | ฟองน้ำในหลอดแตก "ป๊อป" + ติ๊ง | หลอดภารกิจเต็ม/ภารกิจสำเร็จ |
| `sfx_wave_start` | 500 ms | กลองสั้น 2 ตี + ลม | เริ่มคลื่นใหม่ (ตอนชื่อคลื่นขึ้น) |
| `sfx_quest_focus` | 600 ms | กล้องวูบ "ฟึ่บ" + ระฆังชี้เป้า | กล้องพาไปดูเป้าภารกิจ |
| **สถานะ / เตือน** ||||
| `sfx_poison_tick` | 120 ms | ฟองพิษแตกเบา ๆ (ใช้ซ้ำ ทุก 0.5 s) | พิษ Elite Hunt |
| `sfx_bleed_tick` | 120 ms | หยดน้ำเชื่อมแดงหยดลง (ใช้ซ้ำ) | เลือดออกนอกวง Escort/Capture |
| `sfx_out_of_zone` | 500 ms | เตือนเบา ๆ สองครั้ง "ติ๊ด-ติ๊ด" | ออกนอกวงครั้งแรก |
| **Ruby / UI ในด่าน** ||||
| `sfx_ruby_pop_in` | 250 ms | ปิ๊ง! เด้งออกมาน่ารัก | กล่อง Ruby โผล่ในด่าน |
| `sfx_ruby_alert` | 300 ms | "เฮ้!" แบบไม่มีคำ (ปิ๊ง 2 ครั้งเร็ว) | Ruby เตือน (อารมณ์ alert) |
| `sfx_speed_change` | 3 ไฟล์ `_x2/_x3/_x4` 250 ms | วูบเร่ง สูงขึ้นตามความเร็ว | กดปุ่มเร่งเวลา |
| `sfx_run_trait` | 700 ms | ม่านลึกลับเปิด + ประกาย | Run Trait ประจำ replay โผล่ |
| `sfx_stage_title` | 1.5 s | ลมพัด + โน้ตยาวอบอุ่นตอนชื่อด่านขึ้น (มีจังหวะให้ข้อความ) | ชื่อด่านแบบภาพยนตร์ตอนเข้าด่าน |
| `sfx_tutorial_great` | 600 ms | ปรบมือเล็ก ๆ น่ารัก + ประกาย (ไม่มีคน) | บทสอนผ่านแต่ละขั้น |

**รวม 30 key (32 ไฟล์)**

## ข้อห้าม
- เสียงที่ใช้ซ้ำ (tick ต่าง ๆ) ต้องสั้นและเบา ไม่ล้า · loop ต้องต่อรอยเนียน
- ห้ามเสียงคนกรีดร้อง/เลือดสาด (เกมน่ารัก) · ห้ามเบสหนักที่กลบเพลงบอส

## โน้ตฝั่งโค้ด
- ผูกที่ `arenaSweep/arenaGrid/arenaPillars/arenaPods/arenaFog/arenaHands/arenaRings/arenaDecoys` + scythe ใน `arenaMech` (เล่น warn ตอนเริ่มเตือน, เสียงหลักตอนตีจริง; loop หยุดใน `arenaEnd`/`clearArenaMech`) · `spawnCounter`/`tickArenaMech` · `killSlowmo` · `completeWaveObjective`/`liquidTube` pop · `setupWaveObjective` · `questFocus` · `tickHuntCurse` · `captureBleed`/`tickPurifyWisp` · `rubyNext`/`rubyReact` · `speedPopup` · `rollRunTrait` · `rubyEntryCurtain`/`cineTitle` · `tutGreatFx`
- ใช้ cooldown ต่อ key และเพดานเสียงซ้อนเดิม · loop ใช้เสียงเดียวควบคุมได้ ห้ามซ้อนหลายตัว · หยุดทุก loop ตอนตาย/ออกด่าน/ปิดเสียง

## ส่งมอบ
(ฝั่งเสียงกรอกตอนส่ง)

## Delivery v8.0.39 — 2026-10-25

Delivered 32 original ElevenLabs Sound Effects files (actual expanded table count), technical QA and runtime integration. Kit: `assets/incoming/audio_battle_events/`; runtime: `assets/audio/battle_events/`. Untouched donors, actual prompts/request metadata, MANIFEST and QA_REPORT retained. Owner phone listening/artistic review pending.
