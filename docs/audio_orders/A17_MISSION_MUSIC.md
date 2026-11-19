# A17 — เพลงประจำภารกิจใหญ่ · ใบสั่งเสียง

สถานะ: 📦 ส่งแล้ว รอผูก · 19 พ.ย. 2026
ส่งที่ `assets/incoming/audio_a17/` พร้อม `MANIFEST.json` (key, file, bytes, sha256, duration_ms, bpm, loop_start_ms, loop_end_ms)
เครื่องมือ: **ElevenLabs Music** (เหมือนเพลงด่านชุด `bgm/elevenlabs_campaign/`) · ห้ามใช้เสียงสร้างด้วยโค้ด/Runway · กติการ่วมดู `A00_README.md`

## ทำไมต้องสั่ง
ภารกิจใหญ่เปลี่ยนวิธีเล่นทั้งเวฟ (หยุดเวลา · รอยแยกทั้งจอ · พิธีในวงแสง · การพนันคำสาป · ป้องกันวง · บอสรอยแยก) แต่ยังใช้เพลงด่านเดิมต่อไป จึงไม่รู้สึกว่ามี "เหตุการณ์ใหญ่" เกิดขึ้น

## รูปแบบไฟล์
MP3 stereo 44.1 kHz ≥ 192 kbps (ฝั่งโค้ดแพ็กเป็น 80k) · loudness ประมาณ −18 LUFS (เท่าเพลงด่าน) · **loop ต่อกันเนียน** (ระบุ `loop_start_ms`/`loop_end_ms` ถ้ามี intro) · ไม่มีเสียงร้องเป็นคำ (ฮัม/คอรัสไม่มีคำได้) · ธีมโลกขนมหวานน่ารัก ไม่น่ากลัวจนเด็กกลัว

## A. เพลง (loop)
| key | ยาว | BPM | อารมณ์ / ดนตรี | ใช้ตอน |
|---|---|---|---|---|
| `bgm_m_frozen_still` | 16–20 วิ | ~70 | เวลาหยุด: กล่องดนตรีน้ำแข็ง ระฆังแก้ว เสียงยืดช้า เหมือนโลกค้าง มีประกายระยิบ | Frozen Pantry ช่วงระบายสี (เวลาหยุด 10–12 วิ) |
| `bgm_m_frozen_fight` | 48 วิ | ~132 | กองทัพน้ำแข็งตื่น: กลองมาร์ชเร็ว + เครื่องสายพิซซิกาโต้ + เสียงน้ำแข็งกระทบเป็นจังหวะ ฮึกเหิม | Frozen Pantry หลังเวลาเดิน |
| `bgm_m_breach` | 48 วิ | ~118 | รอยแยกความหิว: ซินธ์ม่วงต่ำเต้นเป็นจังหวะหัวใจ + กลองหนัก + โน้ตระฆังผิดคีย์นิด ๆ ลึกลับ ตื่นเต้น | Hunger’s Mouth ตอนรอยแยกเปิด |
| `bgm_m_ritual` | 48 วิ | ~100 | พิธีหม้อคุณยาย: กลองมือ + มาริมบา + ฮัมคอรัสอบอุ่น เหมือนพิธีกรรมในครัว มีพลัง | Grandma’s Pot ตอนเข้าวงแสง |
| `bgm_m_trial` | 48 วิ | ~108 | ตาชั่งคำสาป: นาฬิกาเดินติ๊กเป็นจังหวะ + เชลโลตึง + พิซซิกาโต้ ลุ้นว่าจะเสี่ยงต่อไหม | Vault Altar / Sugar Crown Trial ช่วงสู้แต่ละรอบ |
| `bgm_m_siege` | 48 วิ | ~124 | ปิดล้อม: กลองศึก + แตรทองเหลืองต่ำ + คณะฮัม ป้องกันวงให้รอด | Siege of the Hunger (Delve) |
| `bgm_m_herald` | 48 วิ | ~116 | ทูตความหิว: แตรเดี่ยวหลอน ๆ ประกาศ + ซินธ์ฟ้าม่วงวาบ + เบสเต้น ไล่ล่า | Hunger Herald |
| `bgm_m_domain` | 60 วิ | ~138 | ทั้งถ้ำเป็นรอยแยก + Breachlord: ยิ่งใหญ่ มืดแต่ยังเป็นการ์ตูน คอรัสไม่มีคำ + กลองใหญ่ + ซินธ์ม่วง (หนักกว่าเพลงบอสด่าน) | Hunger’s Domain (Delve) ทั้งช่วงน้ำท่วมและบอส |

## B. สติงเกอร์ (ครั้งเดียว · mono ได้)
| key | ยาว | เสียง | ใช้ตอน |
|---|---|---|---|
| `sfx_m_mission_start` | 1.5 วิ | ฉาบเบา + โน้ตขึ้น 3 ตัว สดใส "เหตุการณ์มาแล้ว!" | เริ่มภารกิจใหญ่ (ก่อนเปลี่ยนเพลง) |
| `sfx_m_thaw_hit` | 2.0 วิ | น้ำแข็งแตกทั้งโดม + บูมต่ำ แล้วต่อเข้าจังหวะเพลงสู้ | Frozen Pantry ตอนเวลากลับมาเดิน |
| `sfx_m_mission_clear` | 2.0 วิ | แฟนแฟร์สั้นจบภารกิจใหญ่ (กลับสู่เพลงด่าน) | ภารกิจใหญ่สำเร็จ |

**รวม 11 ไฟล์ (เพลง 8 · สติงเกอร์ 3)**

## ข้อห้าม
- ห้ามมีเสียงร้องเป็นคำ · ห้ามเสียงแหลมบาดหู (เล่นซ้ำบนมือถือนาน) · ห้ามเลียนเพลงที่มีอยู่จริง
- เพลงต้อง loop ได้เนียน ไม่มีช่วงเงียบท้ายไฟล์

## โน้ตฝั่งโค้ด
- แพ็ก: เพลง 80k stereo → `assets/audio/bgm/missions_a17/` · สติงเกอร์ 96k → `assets/audio/sfx/a17/` (skill wire-art §2b) · ลงทะเบียนใน `ASSET_AUDIO` แบบ lazy ตามด่าน (ด่านที่มีภารกิจนั้นในการ์ดแจก / Delve)
- เพิ่ม `Sfx.playMissionBgm(type)`: map `frozenPantry→frozen_still` (ตอน `fpOpen`) แล้ว `frozen_fight` (ตอน `fpThaw` + `sfx_m_thaw_hit`) · `hungersMouth→breach` (`hmOpen`) · `grandmasPot→ritual` (ตอนเริ่มพิธี) · `vaultAltar/ultimatum→trial` (`ultStartFight`) · `hungerSiege→siege` · `hungerHerald→herald` · `hungerDomain→domain`
- จบภารกิจ (`completeWaveObjective` / `expireWaveObjective` / `clearWaveObjective`) → `sfx_m_mission_clear` ถ้าสำเร็จ แล้ว `Sfx.playStageBgm(stage)` (crossfade ~600 ms) · มินิบอส/บอสยังใช้เพลงบอสเดิมเสมอ (เพลงบอสชนะเพลงภารกิจ)
- ภารกิจเสริม (ซ้อน) **ไม่เปลี่ยนเพลง** · ไม่มีไฟล์ = เพลงด่านเดิม (fallback)
- งบขนาด: 8 เพลง × ~50 วิ ที่ 80k ≈ 4 MB รวมในแอป

## ส่งมอบ
- Date: 2026-11-19. Delivered all 11 files: 8 mission loops + 3 one-shot stingers, in `assets/incoming/audio_a17/`. Missing: none.
- Generated entirely with ElevenLabs Music, using the established campaign/story Music API route. Actual requests and song IDs are recorded in `PROMPTS.json`; local originals are cached under `.git/a17-raw/`.
- Included `MANIFEST.json` (exact keys, bytes, SHA-256, decoded duration, BPM target and loop bounds), `PROMPTS.json`, and compact per-file `QA_REPORT.json`.
- Independent readback passed 11/11: MP3 stereo 44.1 kHz / 192 kbps, exact decoded durations, -18.7 to -18.2 LUFS, true peak <= -1 dBTP, immediate stinger onsets, and non-silent loop endpoints. Music loops use approximately one-bar raised-cosine overlaps; Breach additionally has a 3 ms boundary de-click.
- BPM values are composition targets close to the order; approximate onset-envelope estimates are recorded separately in QA and are not a verified musical tempo. Musical continuity, timbre and final phone listening remain owner review.
- Source branch: `asset-delivery/audio-a17`. Source delivery only; no game.js, runtime code, tests or release changes. Code-side packing/wiring pending.
