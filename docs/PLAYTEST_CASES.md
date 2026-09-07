# ฐานความรู้เคส Playtest: Mochi Mayhem

เอกสารนี้รวบรวม feedback และบั๊กจากการทดสอบบนมือถือจริง เพื่อใช้เป็น regression list ก่อนปล่อยเกมแต่ละรุ่น รายละเอียดเชิงเทคนิคเรื่อง UI แนวนอนและ fullscreen อยู่ที่ [LANDSCAPE_FULLSCREEN_UI_KNOWLEDGE.md](./LANDSCAPE_FULLSCREEN_UI_KNOWLEDGE.md)

## วิธีใช้เอกสารนี้

- `ต้องตรวจซ้ำ` หมายถึงเคยมีรายงาน แม้แก้โค้ดแล้วก็ต้องทดสอบบนเครื่องจริง
- `ข้อกำหนด` หมายถึงทิศทางการออกแบบที่ผู้ใช้ยืนยันแล้ว
- `Known fix` หมายถึงมีวิธีแก้ที่เคยใช้สำเร็จและไม่ควรถอยกลับ
- เมื่อปิดเคส ให้บันทึกรุ่นเกม รุ่น APK อุปกรณ์ และภาพยืนยัน ไม่ลบประวัติเคส

## A. Gameplay และ Balance

| ID | เคส/ข้อกำหนด | สิ่งที่ต้องยืนยัน |
|---|---|---|
| BAL-01 | ผู้เล่นเก่งเร็วเกินไป | ความยากต้องยังมีแรงกดดันหลังเลือกสกิลหลายรอบ |
| BAL-02 | ความเร็วเดินตัวละครสูงเกินไป | เคลื่อนที่ควบคุมง่าย ไม่วิ่งพ้นการอ่านฉากหรือหลบได้ฟรีเกินไป |
| BAL-03 | เลเวลตัวละครขึ้นเร็วเกินไป | ช่วงห่างการเลเวลอัพเหมาะกับความยาวเวฟและไม่หยุดเกมถี่เกินไป |
| BAL-04 | ตัวเลือก/จำนวนสกิลมากจน build เก่งเกินไป | จำกัด power budget, จำนวนช่อง และโอกาสเกิดตัวเลือกซ้ำอย่างเหมาะสม |
| BAL-05 | ความแรงสกิลไม่สมดุล | เทียบ DPS, area coverage, crowd control, cooldown และเงื่อนไขใช้งาน ไม่ดูเฉพาะ damage ต่อครั้ง |
| BAL-06 | จบด่าน 1 ต้องปลดล็อกด่าน 2 ทันที | ตรวจ save flag, หน้าเลือกด่าน และกรณีกลับเข้าเกมใหม่ |

## B. ศัตรู กระสุน และบอส

| ID | เคส/ข้อกำหนด | Known fix / Regression check |
|---|---|---|
| ENM-01 | มดด่าน 1 สีกลืนกับพื้นจนมองไม่เห็น | เพิ่ม contrast ด้วยสี silhouette, rim/highlight หรือ shadow; ตรวจบนจอมือถือที่ความสว่างต่ำ |
| ENM-02 | มดบางตัวมีแถบสีดำใต้เท้าตั้งแต่ยังไม่โจมตี | แถบ telegraph/indicator ต้องซ่อนเป็นค่าเริ่มต้นและถูก destroy/reset เมื่อ recycle object จาก pool |
| ENM-03 | กระสุนมอนสเตอร์ด่าน 1 มองไม่ชัด | ใช้สีที่ตัดกับพื้น ขอบสว่าง/outline และขนาดอ่านได้; ตรวจระหว่าง VFX หนาแน่น |
| ENM-04 | ลูกศรชี้บอสไม่ต้องแสดงระยะเป็นเมตร | แสดงเฉพาะทิศ และซ่อนเมื่อบอสอยู่ในพื้นที่มองเห็น |
| ENM-05 | เลเวลอัพตรงกับบอสเข้า cutscene แล้ว state ชนกัน | ทำ transition queue/lock: cutscene กับ level-up เปิดพร้อมกันไม่ได้ และ resume time/physics เพียงครั้งเดียว |
| ENM-06 | ด่าน 2 ต้องเป็นฉากใหม่ มี monster และ boss ใหม่ | ห้าม reuse ชุดศัตรู/บอสเดิมเพียงเปลี่ยนสี; ตรวจ lore, silhouette, mechanic และ reward ของด่าน |

## C. Skills, VFX และ Cards

| ID | เคส/ข้อกำหนด | สิ่งที่ต้องยืนยัน |
|---|---|---|
| SKL-01 | Rework Sakura Aura ทั้ง VFX และ mechanic | เอฟเฟกต์ต้องอ่านจังหวะสะสม/ปล่อย Bloom ได้ และ mechanic ไม่ซ้ำกับ aura damage ธรรมดา |
| SKL-02 | เอา Chilli Nova ออกจากเกม | ไม่เหลือใน pool การ์ด, loadout, evolution, UI, save เก่า และ asset preload |
| SKL-03 | เพิ่ม Star Guard VFX sprite | ตรวจ spawn, animation, camera assignment, scale, cleanup และ object pooling |
| SKL-04 | Skill card ต้องบอกคู่ Evolution ชัดเจน | แสดงชื่อ/ไอคอนสกิลที่จับคู่กันโดยไม่ให้ข้อความทับพื้นที่ดาว |
| SKL-05 | Level Up เลือกจาก 4 การ์ด | ทุกใบกดได้ hit zone ตรง และ layout ไม่ล้นที่ 720×320 CSS px |
| SKL-06 | Artwork การ์ดต้องทำใหม่ทั้งหมด | ใช้ visual language เดียวกัน แยก Attack/Passive ชัด และ artwork ต้องสื่อ mechanic ไม่ใช่เพียง emoji |
| SKL-07 | รูปแบบการ์ดอ้างอิง Isekai Drifters | ใช้การ์ดแนวตั้งอ่านเร็ว: หมวด, ภาพ, ชื่อ, ผล, ระดับ/ดาว, คู่ Evolution |

## D. Character และ Sprite

| ID | เคส/ข้อกำหนด | Known fix / Regression check |
|---|---|---|
| CHR-01 | Mint และ Cocoa ต้องเป็นตัวละครเล่นได้ | ตรวจหน้าเลือกตัว, unlock/save, active, passive, preview และ gameplay |
| CHR-02 | ตัวละครใหม่เล็กและขนาดไม่เท่า Strawberry/Momo | ใช้ optical silhouette baseline ไม่ใช้ขนาด canvas; v2.3.1 ตั้ง baseline 90px, Mint ×1.08, Cocoa ×1.10 |
| CHR-03 | Sesame เลือกแล้วเกิด `p.play is not a function` | Animated VFX ต้องสร้างด้วย `physics.add.sprite` ไม่ใช่ `physics.add.image`; เพิ่ม smoke test เลือกตัวแล้วเริ่มเล่น |
| CHR-04 | สร้าง sprite สำหรับ character และ VFX | แยก sprite contract: frame size, anchor/feet, transparent padding, FPS, loop, atlas key และ camera layer |

## E. ภาพ ความคมชัด และ Performance

| ID | เคส/ข้อกำหนด | สิ่งที่ต้องตรวจ |
|---|---|---|
| VIS-01 | ภาพเกมดูไม่ชัดแม้ asset ยังไม่มาก | ตรวจ canvas backing resolution, DPR, texture filtering และ source asset resolution |
| VIS-02 | เกมควรลื่นกว่านี้ | profile frame time แยก update/render; ตรวจ overdraw, particles, object pooling, texture swaps และ allocation ใน update loop |
| VIS-03 | World object โผล่ซ้ำ/ค้างจากกล้อง UI | object ที่ spawn ใหม่ต้องเรียก `camWorld()` เพราะ `camera.ignore(group)` อาจไม่ครอบสมาชิกที่เพิ่มภายหลัง |
| VIS-04 | Pool เต็มแล้วเกม crash | ทุก `getFirstDead(false)`/`create()` ต้อง guard `null` หรือ recycle ตัวที่ยังมีชีวิตตามความสำคัญของ object |

## F. Landscape, Fullscreen และ UI

| ID | เคส/ข้อกำหนด | Known fix / Regression check |
|---|---|---|
| UI-01 | เกมต้องเป็นแนวนอน | Android ใช้ `landscape` แบบ native โดยไม่มีหน้าขอหมุน; PWA manifest ใช้ `orientation: landscape` |
| UI-02 | มีขอบขาวซ้าย–ขวา | Phaser `RESIZE` + canvas fixed `100vw × 100dvh`; ตรวจ body margin/background/overflow |
| UI-03 | ต้อง fullscreen ตั้งแต่หน้าโหลดใน APK | native immersive ใน `onCreate()` และ fullscreen ทั้ง main/launch theme |
| UI-04 | Browser ไม่ fullscreen อัตโนมัติ | Fullscreen API เรียกหลัง first user gesture ตามข้อจำกัด browser |
| UI-05 | Hub/menu ตัวเล็กและบีบ | ใช้ grid หลายคอลัมน์พร้อม minimum button height |
| UI-06 | Pause UI ซ้อนกัน | held-skill panel แยกพื้นที่ และปุ่ม action วางแนวนอน; rebuild หลัง resize |
| UI-07 | การ์ด 4 ใบมีข้อความ/ไอคอนซ้อน | จำกัดบรรทัด แยกโซน stars/evolution และตรวจ bounds ทุกใบ |
| UI-08 | Talent/Gear/Character/Bestiary ล้นจอ | ใช้ layout รายหน้าและทดสอบความสูง 320–345 CSS px |
| UI-09 | ตัวละคร gameplay ยังเล็ก | ตรวจ optical scale พร้อม world camera zoom, shadow, aura และ hitbox |
| UI-10 | v2.3.1 UI ขยายเกินจอ/ปุ่มด้านขวาหลุด | `Scale.RESIZE` ต้องใช้ CSS px โดยตรงและแยก DPR ไปไว้ที่ `config.resolution`; ห้ามหาร layout หรือ input ด้วย DPR ซ้ำ |

## G. State และ Lifecycle ที่ต้องระวัง

### Overlay priority

เมื่อหลาย event เกิดเฟรมเดียวกัน ให้ใช้ลำดับความสำคัญและ state lock เดียว:

1. Stage complete / game over
2. Boss cutscene
3. Level up
4. Pause
5. Gameplay

Overlay ใหม่ต้องตรวจ active overlay ก่อนเปิด และ event ที่ถูกพักต้องเข้า queue แทนการสร้าง UI ทับกัน

### Object pool reset contract

ทุก enemy/projectile/VFX ที่นำกลับมาใช้ต้อง reset อย่างน้อย:

- texture/frame/animation
- tint, alpha, visibility และ active
- scale, rotation และ depth
- velocity, acceleration และ body enable
- telegraph/black bar/child graphics
- timers, phase flags และ hit history
- camera assignment

เคสมดมีแถบดำทั้งที่ยังไม่โจมตีเป็นสัญญาณว่ามี child indicator หรือ state จาก object เดิมค้างใน pool

## H. Definition of Done สำหรับเคสจากภาพมือถือ

- [ ] ระบุอุปกรณ์/Android, รุ่นเกม, รุ่น APK และ CSS viewport
- [ ] ทำให้เกิดซ้ำได้หรือมีคำอธิบาย state ที่ชัดเจน
- [ ] แยกว่าปัญหาอยู่ที่ asset, layout, camera, state, pool หรือ native shell
- [ ] แก้แล้วตรวจหน้าที่เกี่ยวข้องทั้งหมด ไม่ตรวจเฉพาะภาพต้นเหตุ
- [ ] build web และ Android ผ่าน
- [ ] ติดตั้ง APK ใหม่เมื่อมี native change
- [ ] มีภาพยืนยันจากเครื่องจริงในสัดส่วนอย่างน้อย 16:9 และ 20:9
- [ ] เพิ่มเคสนี้ใน regression list หากมีโอกาสกลับมาเกิดซ้ำ
