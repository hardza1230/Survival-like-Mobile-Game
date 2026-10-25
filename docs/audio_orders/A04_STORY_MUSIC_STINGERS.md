# A04 — เพลงหน้าแรก · เพลงฉากเรื่อง · เพลงร้าน/Lobby · เสียงคำการ์ตูน · ชนะ/แพ้ · ใบสั่งเสียง

สถานะ: 🟡 รอเสียง · เขียน 25 ต.ค. 2026 · ส่งที่ `assets/incoming/audio_story_music/`
กติการ่วมดู `A00_README.md` · เพลง = stereo loop ~−18 LUFS · สติงเกอร์/SFX = mono
เนื้อเรื่องอ้างอิง `docs/STORY_CANON.md` (มงกุฎบนต้นไม้แรกสาปอาณาจักรให้เป็นโมจิ · ความหิวกินรส · Ruby วิญญาณแยมของคุณยาย)

## ตอนนี้เป็นยังไง (ตรวจจากโค้ด v8.0.33)
- เพลงด่าน/มินิบอส/บอสครบ 15 ด่าน · เพลงเมนูมี `bgm_main`, Temple, Kitchen, Depths
- **หน้า TAP TO START** และ **Motion Comic 17 ฉาก** ใช้เพลงเมนูหลักต่อไปเรื่อย ๆ — ฉากเศร้า/ฉากบอส/ฉากจบใช้เพลงเดียวกันหมด
- Bazaar/หีบไม่มีเพลงของตัวเอง · คำการ์ตูน CRACK!/THUD!/POP!/SHATTER!/KRAK! ใช้ `Sfx.boom` อันเดียว · ตัวพิมพ์ข้อความในฉากเงียบ · ชนะ/แพ้ใช้เสียงเดิมตั้งแต่ v6

## รายการ
### A — เพลง (loop)
| key | ความยาว | อารมณ์ / ดนตรี | ใช้ตอน |
|---|---|---|---|
| `bgm_title` | 60–75 s · BPM ~84 | ธีมหลักของเกม อบอุ่น มหัศจรรย์ กล่องดนตรี + เครื่องสาย + ระฆังแก้ว ทำนองจำง่าย 4 ห้อง | หน้า TAP TO START + เปิดหนังสือ |
| `bgm_story_calm` | 60 s · BPM ~76 | นิทานก่อนนอน ครัวคุณยาย เปียโนเบา + ฟลุต | ฉากเรื่องสงบ (S00 เปิดเรื่อง, S02–S05 ความทรงจำ) |
| `bgm_story_tension` | 48 s · BPM ~96 | ลึกลับ ตึงเครียด ความหิวคืบคลาน เชลโลต่ำ + พิซซิกาโต้ + ลมหวีด (ยังน่ารัก ไม่สยอง) | ฉากรากทะลุพื้น S01, ฉากก่อนบอส S12/S14/S15 |
| `bgm_story_hope` | 60 s · BPM ~92 | ความหวัง เพื่อนกลับมา ทำนองธีมหลักในคีย์เมเจอร์สว่าง | ฉากปลดฮีโร่ S06–S09, ฉากหลังบอสบท S11/S13 |
| `bgm_story_finale` | 75 s · BPM ~88 | ยิ่งใหญ่ อบอุ่นที่สุด ธีมหลักเต็มวง + คณะร้องประสานเสียงแบบไม่มีคำ (ooh/aah) | ฉากจบเรื่อง S16 และ S17 (เปิด Delve) |
| `bgm_bazaar` | 48 s · BPM ~110 | ตลาดขนมคึกคัก แอคคอร์เดียน + ไซโลโฟน + ตบมือเบา ๆ | หน้า Bazaar / หีบ |

### B — สติงเกอร์ / SFX ฉากเรื่อง
| key | ความยาว | เสียง | ใช้ตอน |
|---|---|---|---|
| `sfx_pow_crack` | 400 ms | พื้นร้าว "แคร้ก!" การ์ตูน | คำการ์ตูน CRACK! |
| `sfx_pow_thud` | 350 ms | ตก "ตุ้บ!" นุ่มหนัก | THUD! |
| `sfx_pow_pop` | 300 ms | "ป๊อป!" ใส ๆ เด้ง | POP! / POOF! |
| `sfx_pow_shatter` | 600 ms | กระจก/น้ำแข็งแตกกระจาย | SHATTER! |
| `sfx_pow_krak` | 700 ms | รากไม้ใหญ่หักดังสนั่น | KRAK! |
| `sfx_type_tick` | 25–40 ms | ติ๊กพิมพ์ดีดไม้เบามาก (ใช้ซ้ำทุกตัวอักษร โค้ดจำกัด) | ข้อความฉากเรื่องพิมพ์ขึ้น / บอสพูด |
| `sfx_story_title` | 2.0 s | ลมพัดแผ่ว + โน้ตเปิดม่านยาว + ประกาย | การ์ดชื่อฉาก (MOCHITOPIA · STORY) |
| `sfx_book_open` | 1.8 s | หนังสือเก่าใหญ่ ตัวล็อกคลิก → ปกเปิด → กระดาษพลิกพรืด → แสงวิบวับ (จังหวะตาม `bookOpeningPlus` 1.5 s ล็อก, 2.3 s เปิด, 3.4 s พลิกกระดาษ) | เปิดหนังสือหลัง TAP TO START (แบ่งเป็น 3 ไฟล์ได้: `_clasp`, `_open`, `_riffle`) |
| `sfx_stage_victory` | 2.5 s | แฟนแฟร์ชนะด่าน (ธีมหลักสั้น) — แทนของเดิม | ผ่านด่าน |
| `sfx_stage_defeat` | 2.0 s | ทำนองเศร้าน่ารัก ลงเสียงต่ำ ไม่หดหู่ (ให้อยากลองใหม่) — แทนของเดิม | แพ้ |
| `sfx_chapter_clear` | 3.5 s | แฟนแฟร์ใหญ่จบบท (ยิ่งใหญ่กว่าผ่านด่าน) | ผ่านบอสท้ายบท (C1-5, C2-5, C3-5) |
| `sfx_box_reveal` | 4 ไฟล์ `_common/_rare/_epic/_legend` 300–900 ms | กล่องเปิดตามระดับความหายาก ใหญ่ขึ้นตามลำดับ | เปิดกล่องท้ายด่าน (`playBoxOpening`) |

**รวม 6 เพลง + 14 key สติงเกอร์ (ประมาณ 20 ไฟล์)**

## ข้อห้าม
- ห้ามเลียนแบบเพลงเกม/การ์ตูนที่มีอยู่ · ห้ามเนื้อร้องเป็นคำ (ร้องประสานแบบ ooh/aah ได้เฉพาะ finale)
- เพลงฉากเรื่องต้องเบากว่าเสียงคำการ์ตูนและข้อความ (มีที่ว่างให้ SFX)
- ธีมหลัก (`bgm_title`) ควรมีทำนองที่ `bgm_story_hope`, `bgm_story_finale`, `sfx_stage_victory` หยิบไปใช้ต่อได้ (เกมฟังเป็นเรื่องเดียวกัน)

## โน้ตฝั่งโค้ด
- `buildTitle` → `bgm_title` · `playMotionComic`: เพิ่ม `music` ต่อฉากใน `MOTION_COMICS` (calm/tension/hope/finale) เล่นตอนเปิด คืนเพลงเดิมตอนจบ · `buildBazaar`/`buildChestShop` → `bgm_bazaar` · `mcPow` เลือก `sfx_pow_*` ตามคำ (เดิม `Sfx.boom`) · ตัวพิมพ์ข้อความ `mcShot` + `bossSay` → `sfx_type_tick` (≤ 1 ครั้ง/2 ตัวอักษร) · `mcTitle`/`cineTitle` → `sfx_story_title` · `bookOpeningPlus` → `sfx_book_open*` ตามจังหวะ · `Sfx.victory`/`Sfx.dead` เปลี่ยนไฟล์ · `playBoxOpening` → `sfx_box_reveal_*`
- เพลงโหลดตอนต้องใช้ (lazy) ไม่โหลดตอนบูต · ใช้ `_playTrack` เดิม ห้ามเพลงซ้อน 2 เพลง

## ส่งมอบ
(ฝั่งเสียงกรอกตอนส่ง)

## Delivery v8.0.39 — 2026-10-25

Delivered 15 original ElevenLabs Sound Effects files (actual expanded table count), technical QA and runtime integration. Kit: `assets/incoming/audio_story_music/`; runtime: `assets/audio/story_music/`. Untouched donors, actual prompts/request metadata, MANIFEST and QA_REPORT retained. Owner phone listening/artistic review pending.

Six BGM files remain pending: owner enabled Sound Effects only. Existing music continues; no Music Generation request made. One combined 1.8s book_open was selected from the permitted alternatives.
