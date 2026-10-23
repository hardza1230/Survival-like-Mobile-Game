# 38 — บทสอนผู้เล่นใหม่ (Tutorial) · ใบสั่งงานอาร์ต

ส่งไฟล์ที่ `assets/incoming/tutorial_ui/` พร้อม `MANIFEST.json`, `PROMPTS.json`, `QA_REPORT.json`
สไตล์ตาม `00_STYLE_GUIDE.md` (เส้นขอบเข้ม สีสด อ่านออกที่ขนาดเล็ก) · PNG32 พื้นโปร่งใสจริง · **ห้ามมีตัวหนังสือในภาพ** (โค้ดใส่ข้อความเอง)

## เรื่องย่อ (ใช้เป็นธีมภาพ)
บทสอนเกิดใน **Training Ground ใต้ตู้กับข้าว** ก่อนพื้นจะแตก (ต่อด้วยฉาก "Fall Below the Kitchen" ของ C1-1)
**Ruby** (โมจิทับทิม ไกด์ — ดูใบ 36) สอนผู้เล่นให้ปลุก Mochi Core ไปสู้กับ **The Great Hunger** ที่กำลังกินรสชาติของ Mochitopia
ศัตรูทิ้ง **"ขนมที่ถูกขโมย"** (= EXP) ผู้เล่นเก็บคืน → ภาพทุกชิ้นควรรู้สึกว่า "ไอเทม/ป้ายในครัว ขนม น้ำตาล" ไม่ใช่ UI ไซไฟ

## ข้อความจริงที่ขึ้นในเกม (อ้างอิงเพื่อทำภาพให้ตรง)
| ขั้น | id | หัวข้อ | 2 บรรทัด |
|---|---|---|---|
| 1 | welcome | Hi, I’m Ruby! | The Great Hunger is eating Mochitopia’s flavors. / Let’s get you ready to fight back! |
| 2 | move | Moving | Slide one finger to walk. / Lift it to stop. |
| 3 | attack | Attacking | Your Mochi Core fights on its own. / Just walk near the sour critters! |
| 4 | sweets | Sweets = EXP | Beaten foes drop stolen sweets. / Walk over them to take them back! |
| 5 | cards | Level Up! | Full EXP bar = 3 flavor cards. / Tap one to read, tap again to take it. |
| 6 | dash | Dash | Green button: zoom past danger. / It needs a moment to recharge. |
| 7 | unique | Your Unique | Pink button: your Core’s big attack. / It charges up again over time. |
| 8 | hp | Stay Healthy | HP at zero ends the stage. / Pink mochi hearts heal you. |
| 9 | ready | You’re Ready! | The pantry floor is cracking… / Go save Mochitopia’s flavor! |

## ไฟล์ที่ต้องการ

### A. ไอคอนประจำขั้น (9 ไฟล์ · 256×256 · โชว์จริง 72px มุมขวาบนของการ์ด)
| ไฟล์ | ภาพ |
|---|---|
| `tut_ic_welcome.png` | Ruby โบกมือ ถือช้อนไม้เล็ก ๆ |
| `tut_ic_move.png` | นิ้วการ์ตูนลากบนพื้นกระเบื้องครัว มีเส้นลูกศรโค้ง |
| `tut_ic_attack.png` | เกล็ดน้ำตาลสีชมพูพุ่งเข้าหามดเปรี้ยวตัวเล็ก |
| `tut_ic_sweets.png` | กองขนมแวววาว 3 ชิ้น (ลูกอม/มาการอง/เยลลี่) มีประกาย "ได้คืน" |
| `tut_ic_cards.png` | การ์ด 3 ใบเรียงพัด ใบกลางยกสูง มีกรอบทอง (ไม่มีตัวหนังสือ) |
| `tut_ic_dash.png` | รองเท้าบูทสตรอว์เบอร์รี + เส้นความเร็วสีเขียวมิ้นต์ |
| `tut_ic_unique.png` | ดาวชมพูใหญ่แตกประกาย บนปุ่มกลมสีชมพู |
| `tut_ic_hp.png` | หัวใจโมจิสีชมพู ยิ้ม มีผ้าพันแผลแปะ |
| `tut_ic_ready.png` | พื้นไม้ในตู้กับข้าวแตกร้าว มีแสงทองลอดขึ้นมา |

### B. ตัวชี้และวงสปอตไลต์ (2 ไฟล์)
| ไฟล์ | ขนาด | ภาพ |
|---|---|---|
| `tut_finger.png` | 128×128 | มือการ์ตูนชี้ (นิ้วชี้ขึ้น ปลายนิ้วอยู่ที่ x≈30%, y≈0 ของภาพ) สีครีม ขอบเข้ม — ใช้แทนอีโมจิ 👆 |
| `vfx_tut_ring.png` | 6×256 = 1536×256 (6 เฟรม เรียงแนวนอน) | วงแหวนน้ำตาลไอซิ่งสีเหลืองทอง หมุน/เต้นเป็นลูป ตรงกลางโปร่ง (ครอบปุ่ม Dash/Unique ได้พอดี) |

### C. กรอบการ์ดบทสอน (1 ไฟล์)
| ไฟล์ | ขนาด | ภาพ |
|---|---|---|
| `tut_card_frame.png` | 780×600 (ใช้จริง 50% = 390×300, ยืดแนวตั้งได้แบบ 9-slice) | แผ่นป้ายไม้/ขนมปังกรอบในครัว ขอบทองลูกไม้ไอซิ่ง ช่องว่างกลมด้านบนกลางสำหรับ Ruby · ภายในเรียบ สีเข้มพออ่านตัวหนังสือขาว · ระบุเส้น 9-slice (ซ้าย/บน/ขวา/ล่าง) ใน MANIFEST |

### D. ฉลองผ่านขั้น (1 ไฟล์)
| ไฟล์ | ขนาด | ภาพ |
|---|---|---|
| `vfx_tut_great.png` | 6×256 = 1536×256 (6 เฟรม เล่นครั้งเดียว) | ตราประทับลายดาวน้ำตาลเด้งออก + ประกายลูกกวาดกระจาย (ไม่มีตัวหนังสือ — โค้ดเขียน "Great job!" เอง) |

**รวม 13 ไฟล์**

## ข้อห้าม
- ไม่มีตัวหนังสือ/ตัวเลขในภาพ
- Ruby ต้องตรงกับใบ 36 (โมจิกลมชมพูทับทิม + อัญมณีบนหัว) อย่าวาดเป็นคนหรือเป็น Strawberry
- ไอคอนอ่านออกที่ 48px (รูปทรงชัด ไม่รกรายละเอียด)

## โน้ตฝั่งโค้ด (ทำหลังอาร์ตมาถึง)
- โค้ดพร้อมแล้ว v7.9.67: `showCoachIntro` ใช้ `tut_ic_<id>` ถ้ามี texture (ไม่มี = อีโมจิในหัวข้อ) · `buildCoachSpotlight` ใช้ `tut_finger` ถ้ามี
- ที่ต้องเพิ่มตอนผูก: แพ็ก WebP (ไอคอน 256→128) ใส่ `ASSET_IMAGES` (โหลดตอนเข้าบทสอนเท่านั้น ไม่ใช่บูต) · `tut_card_frame` → `TEMPLE_UI` + `tuPanel` แทนกรอบ graphics ใน `showCoachIntro` · `vfx_tut_ring` แทนวงกลมใน `buildCoachSpotlight` · `vfx_tut_great` เล่นตอนผ่านขั้นใน `tickTutorialCoach`
