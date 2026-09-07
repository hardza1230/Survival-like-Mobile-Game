# บันทึกความรู้: การย้ายเกมมือถือเป็นแนวนอนและ Fullscreen

เอกสารนี้สรุปเคสที่พบระหว่างการย้าย **Mochi Mayhem** จากแนวตั้งเป็นแนวนอนใน v2.3.0 และการแก้ไขรอบ v2.3.1 เพื่อใช้เป็นแนวทางออกแบบ ตรวจสอบ และป้องกัน regression ในครั้งถัดไป

## 1. ขอบเขตของปัญหา

หลังเปลี่ยนเกมเป็นแนวนอน ตัวเกมรันได้แต่ UI เดิมส่วนใหญ่ยังอิงสัดส่วนหน้าจอแนวตั้ง จึงเกิดปัญหาพร้อมกันหลายหน้า:

- มีขอบขาวซ้าย–ขวา รวมทั้งแถบสถานะและแถบนำทาง Android
- หน้าโหลดและหน้าแรกยังไม่เต็มจอ
- ตัวละครในเกมเล็กเกินไป โดยเฉพาะ Mint และ Cocoa เมื่อเทียบกับ Strawberry/Momo
- หน้า Pause มีแผงและปุ่มขนาดใหญ่ซ้อนกัน
- การ์ดเลือกสกิล 4 ใบมีข้อความ ดาว ไอคอน และข้อมูลคู่ Evolution ซ้อนกัน
- เมนูหลักยังเรียงแนวตั้ง ทำให้ทุกปุ่มเตี้ยและตัวหนังสือเล็ก
- หน้า Talent, Gear, Character และ Bestiary มีรายการล้นหรือถูกตัดด้านล่าง

แก่นของปัญหาไม่ใช่เพียง “ขยาย UI” แต่เป็นการใช้ layout แนวตั้งกับพื้นที่ทำงานแนวนอนที่มีความสูงจริงน้อยมาก

## 2. อาการ สาเหตุ และวิธีแก้

| เคส | สาเหตุจริง | แนวทางแก้ที่ใช้ |
|---|---|---|
| ขอบขาวซ้าย–ขวา | Canvas แบบ `FIT` รักษา aspect ratio จึงเกิด letterbox เมื่อสัดส่วน WebView ไม่ตรงกับเกม | ใช้ `Phaser.Scale.RESIZE` + `NO_CENTER` และกำหนด canvas เป็น `position: fixed; inset: 0; width: 100vw; height: 100dvh` |
| แถบระบบ Android ยังอยู่ | CSS/Phaser ซ่อน system bars ของ Android ไม่ได้ | เปิด immersive mode จาก native `MainActivity` ตั้งแต่ `onCreate()` และเรียกซ้ำเมื่อ window focus กลับมา |
| หน้าโหลดไม่เต็มจอ | Launch theme ยังใช้ค่าคนละชุดกับหน้าหลัก | ตั้ง fullscreen/transparent bars ทั้ง `AppTheme.NoActionBar` และ `AppTheme.NoActionBarLaunch` |
| Fullscreen เว็บไม่เริ่มอัตโนมัติ | Browser กำหนดให้ Fullscreen API ต้องเกิดหลัง user gesture | ขอ fullscreen เมื่อผู้เล่นแตะครั้งแรก ส่วน APK ใช้ native immersive ตั้งแต่เริ่มแอป |
| UI บีบและซ้อนกัน | ตำแหน่งเดิมใช้ `h * ratio` หลายชั้น เมื่อพื้นที่จริงประมาณ 768×345 CSS px ระยะห่างจึงหายไป | ออกแบบ layout ต่อหน้าใหม่ โดยยึดความสูงขั้นต่ำ และใช้หลายคอลัมน์แทน vertical stack |
| ตัวละครเล็ก/ขนาดไม่เท่ากัน | ขนาด canvas ของ sprite ไม่เท่ากับขนาด silhouette ที่มองเห็นจริง | กำหนด optical baseline 90px แล้วชดเชยรายตัว เช่น Mint ×1.08 และ Cocoa ×1.10 |
| UI เปลี่ยนขนาดแล้วเพี้ยน | Canvas เปลี่ยนตาม viewport แต่ UI ที่สร้างไว้ยังใช้พิกัดเก่า | ฟังทั้ง Phaser resize และ `visualViewport.resize` แล้ว rebuild UI ที่เป็น stateful เช่น Pause และ Level Up |
| ภาพหรือ input ไม่ตรงตำแหน่ง | v2.3.1 ใช้ `Scale.RESIZE` แต่ยังคูณ/หาร DPR แบบระบบเดิม ทำให้ UI ถูกขยายซ้ำ | ใช้ `W/H = scale.width/height`, pointer logical coordinate โดยตรง และใช้ `config.resolution` เพิ่มความคมชัด |

## 3. หลักการ Fullscreen บน Android

Fullscreen ของเว็บและ Fullscreen ของ APK เป็นคนละชั้น:

1. **Web/CSS:** ทำให้ DOM และ canvas กินพื้นที่ viewport ทั้งหมด
2. **Phaser:** ปรับ backing canvas และกล้องให้ตรงกับขนาด viewport
3. **Android native:** ซ่อน status/navigation bars จัดการ display cutout และทำให้ splash/launch theme เต็มจอ

ถ้าขาดชั้นใดชั้นหนึ่ง อาจยังเห็นขอบขาว แถบระบบ หรือพื้นที่ว่างแม้ canvas จะมีขนาด `100vw` แล้ว

### สิ่งที่ native ต้องดูแล

- ซ่อน status bar และ navigation bar แบบ `IMMERSIVE_STICKY`
- สำหรับ API 30+ ใช้ WindowInsets API
- รองรับจอมีรอยบากด้วย cutout mode `shortEdges`
- ตั้ง system bar ให้โปร่งใส
- เรียก immersive ซ้ำใน `onWindowFocusChanged`
- บังคับ orientation เป็น `landscape` ทั้ง manifest และ `setRequestedOrientation()` โดยไม่แสดงหน้าขอหมุนจอ
- ใช้ค่า fullscreen เดียวกันกับ launch/splash theme

> การแก้ `MainActivity`, theme หรือ manifest ต้องติดตั้ง APK ใหม่ การอัปเดต GitHub Pages อย่างเดียวไม่สามารถเปลี่ยน native shell ที่ติดตั้งอยู่ได้

## 4. กติกาออกแบบ UI แนวนอน

### ใช้พื้นที่จริง ไม่ใช้ความละเอียดภาพหน้าจอ

ภาพหน้าจออาจเป็น 1536×720 แต่พื้นที่ CSS ที่เกมเห็นจริงอาจเหลือประมาณ 768×345 เพราะ device pixel ratio และ system insets ดังนั้นต้องอ่านค่าจาก runtime และออกแบบจาก **CSS pixel working area**

ขนาดอ้างอิงขั้นต่ำสำหรับตรวจ layout:

- 768×345 CSS px
- 720×320 CSS px
- จอ 16:9 และจอยาว 20:9
- จอมี cutout และ navigation bar ทั้งแบบ gesture/3 ปุ่ม

### ห้ามพึ่ง `height × ratio` สำหรับรายการยาว

การวางปุ่มหลายปุ่มที่ `h * 0.35`, `h * 0.45`, ... ใช้ได้ในแนวตั้งแต่จะบีบตัวเองในแนวนอน ให้ใช้:

- grid 2–3 คอลัมน์
- ความสูงปุ่มขั้นต่ำที่อ่านและแตะได้
- gap คงที่ซึ่งลดได้ตาม breakpoint
- scroll เฉพาะหน้าที่ข้อมูลยาวจริง
- safe padding แยกจากขอบ canvas

### Layout ที่ใช้ใน v2.3.1

| หน้า | โครงแนวนอน |
|---|---|
| Hub | เมนู 2 คอลัมน์ ปุ่มสูงคงที่ |
| Stage Select | ด่าน 2 คอลัมน์ |
| Character Select | 2 คอลัมน์ × 3 แถว และย่อคำอธิบาย |
| Talent | การ์ดแนวนอน 3 ใบ + แถบเลื่อนขั้นด้านล่าง |
| Gear | ซ้ายเป็นตัวละคร/ช่องอุปกรณ์ ขวาเป็น inventory |
| Bestiary | 3 คอลัมน์ × 3 แถว |
| Pause | แถบสกิลที่ถืออยู่ด้านบน ปุ่ม 2 ปุ่มวางข้างกัน |
| Level Up | การ์ดแนวตั้ง 4 ใบ ข้อมูลสำคัญอยู่เหนือ fold |

## 5. การ์ดเลือกสกิล 4 ใบ

การ์ดต้องสื่อสารให้เข้าใจได้ในหนึ่ง glance โดยไม่บังคับให้ใส่ข้อความทุกอย่างลงในการ์ด

ลำดับข้อมูลที่ควรสงวนพื้นที่:

1. หมวด `ATTACK` หรือ `PASSIVE`
2. Artwork/ไอคอนหลัก
3. ชื่อ + Level
4. ผลของระดับนี้แบบสั้น
5. ดาว/ความคืบหน้า
6. คู่ Evolution พร้อมไอคอน

กติกาป้องกันข้อความซ้อน:

- จำกัดคำอธิบายจำนวนบรรทัดและตัดข้อความเกินพื้นที่
- ย่อข้อมูลคู่เป็น `คู่ Evolution + ชื่อ + ไอคอน`
- แยกพื้นที่ดาวกับพื้นที่ Evolution ชัดเจน
- คำนวณ text bounds ก่อนวางไอคอนท้ายบรรทัด
- hit zone ต้องตรงกับกรอบการ์ดจริงหลัง resize
- ทดสอบข้อความไทย เพราะ glyph สูงและตัดบรรทัดต่างจากอังกฤษ

## 6. ขนาดตัวละครและกล้อง

อย่าปรับ sprite ทุกตัวด้วย scale เดียวจากขนาดไฟล์ เพราะไฟล์อาจมี transparent padding ไม่เท่ากัน ให้เทียบจาก silhouette ที่มองเห็นจริง:

- ตั้งความสูงที่มองเห็นเป็น baseline เดียวกัน
- ชดเชย scale รายตัวหลังดูบนฉากจริง
- ตรวจเงา วง aura ฝุ่น และตำแหน่งเท้าหลังเปลี่ยน scale
- ตรวจทั้ง gameplay และ character preview เพราะใช้กล้อง/กรอบคนละแบบ

ใน v2.3.1 ใช้ baseline 90px พร้อมตัวคูณ Mint 1.08, Cocoa 1.10 และปรับ world camera `viewZoom` เป็น 0.84 เพื่อให้ตัวละครอ่านง่ายขึ้น

## 7. Phaser, DPR และกล้อง

- ใน `Scale.RESIZE`, `scale.width/height` และ pointer เป็น logical CSS pixel อยู่แล้ว
- Layout ใช้ `W/H = scale.width/height` และ input ใช้ pointer coordinate โดยตรง
- ความคมชัดใช้ `config.resolution=RENDER_DPR`; ห้ามคูณ game size หรือ camera zoom ด้วย DPR ซ้ำ
- UI และ world ควรอยู่คนละกล้อง/มีระบบ ignore ชัดเจน
- เมื่อสร้าง world object ใหม่ ต้องผูกเข้ากล้อง world ทันที เพราะ `camera.ignore(group)` ไม่ได้ครอบสมาชิกที่เพิ่มทีหลังเสมอไป
- การปรับ camera zoom เปลี่ยนขนาดที่ผู้เล่นมองเห็นของทั้งโลก ไม่ใช่เฉพาะตัวละคร จึงต้องตรวจศัตรู กระสุน hitbox และระยะมองพร้อมกัน

## 8. Checklist ก่อนปล่อยเวอร์ชัน

### Fullscreen และ orientation

- [ ] หน้า launch/splash เต็มจอก่อนโหลดเว็บ
- [ ] หน้าแรกไม่มีขอบขาวทั้งสี่ด้าน
- [ ] APK ซ่อน status/navigation bars
- [ ] แตะครั้งแรกบนเว็บแล้วขอ fullscreen ได้
- [ ] หมุนเครื่องหรือสลับแอปแล้วกลับมายังเป็น landscape/immersive
- [ ] UI ไม่ชน cutout หรือขอบ gesture

### ทุกหน้าของเกม

- [ ] Hub
- [ ] Stage Select
- [ ] Character Select
- [ ] Talent
- [ ] Gear
- [ ] Bestiary
- [ ] Gameplay HUD
- [ ] Pause
- [ ] Level Up 4 cards
- [ ] Boss cutscene
- [ ] Result/Game Over

ในแต่ละหน้าตรวจว่า:

- [ ] `right <= W` และ `bottom <= H` สำหรับทุกองค์ประกอบ
- [ ] ไม่มีข้อความซ้อนกันหรือล้นกรอบ
- [ ] ปุ่มอ่านง่ายและแตะได้จริง
- [ ] hit zone ตรงกับภาพ
- [ ] ตัวละคร ศัตรู กระสุน และ VFX มองเห็นชัดบนฉาก
- [ ] เปิด/ปิด overlay แล้วตำแหน่งไม่เปลี่ยน
- [ ] resize/re-enter scene แล้ว UI ไม่ถูกสร้างซ้ำ

### Matrix ทดสอบขั้นต่ำ

| Build | สัดส่วน | จุดตรวจ |
|---|---|---|
| Web | 16:9 | fullscreen หลัง first gesture, resize |
| Web | 20:9 | card/UI bounds, safe edges |
| APK | 16:9 | launch theme, immersive, back/resume |
| APK | 20:9/cutout | insets, navigation modes, touch zones |

## 9. สิ่งที่ CI ตรวจไม่ได้

Build ผ่านและ deploy สำเร็จยืนยันได้ว่าโค้ด compile/package ได้ แต่ไม่ยืนยันว่า UI อ่านง่ายหรือไม่ซ้อนกัน จึงต้องมี **visual QA บนอุปกรณ์จริง** ทุกครั้งที่แก้ layout, DPR, camera, fullscreen หรือ native Android shell

หลักฐานที่ควรเก็บต่อหนึ่ง release:

- ภาพหน้า launch และ Hub
- ภาพ gameplay ที่เห็น HUD ตัวละคร ศัตรู และกระสุน
- ภาพ Pause และ Level Up 4 cards
- ภาพหน้าเมนูย่อยที่มีข้อมูลมากที่สุดอย่างน้อยหนึ่งหน้า
- รุ่นเกม รุ่น APK รุ่น Android และขนาด CSS viewport ที่ทดสอบ

## 10. ลำดับวิเคราะห์เมื่อพบ UI พังอีกครั้ง

1. บันทึก `innerWidth`, `innerHeight`, DPR และ `visualViewport`
2. แยกว่าเป็นปัญหา DOM/canvas, Phaser camera หรือ Android system UI
3. วาด bounds ของ container/card/button ชั่วคราวเพื่อหาจุดล้น
4. ทดสอบที่ความสูงต่ำสุดก่อน แล้วค่อยทดสอบจอใหญ่
5. ตรวจ input/hit zone หลังภาพถูกต้อง
6. ตรวจทุก overlay ที่สร้าง UI ใหม่ เช่น Pause และ Level Up
7. หากแก้ native ให้สร้างและติดตั้ง APK ใหม่ก่อนสรุปผล

## 11. บทเรียนสำคัญ

- “เปลี่ยน orientation” ไม่เท่ากับ “ออกแบบ landscape” ทุกหน้าต้องมี layout ของตัวเอง
- Fullscreen บน Android ต้องแก้ native shell ร่วมกับ web canvas
- ความคมชัด ขนาดภาพ และขนาด layout ต้องแยกหน่วย DPR/CSS pixel ให้ถูก
- Sprite ที่ไฟล์เท่ากันอาจมองเห็นไม่เท่ากัน ต้องวัด optical size
- การ์ด 4 ใบต้องลดข้อความและจัดลำดับข้อมูล ไม่ใช่เพียงย่อการ์ดเดิม
- การทดสอบบนเครื่องจริงและภาพหน้าจอเป็น gate สำคัญพอ ๆ กับ build/CI
