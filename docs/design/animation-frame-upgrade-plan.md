# แผนอัปเกรดแอนิเมชันที่ใช้สี่เฟรม

ตรวจจาก runtime v8.2.57 commit `23673ac2` วันที่ 22 พฤศจิกายน 2026 สแกนคีย์ที่ประกาศ `frames:4` 224 คีย์ และภาพที่มีสี่ช่องจริงอีก 50 คีย์จากขนาด PNG/WebP และขนาดต่อเซลล์ รวม 274 คีย์ ส่วนแอนิเมชันช่วงย่อยที่ประกาศด้วยรายการเลขเฟรมแสดงท้ายเอกสาร แถวที่เป็นภาพสำรองยังขึ้นกับตัวเลือกในด่านและการโหลดอาร์ต

| เฟส | งาน | เกณฑ์เลือกเฟรม |
|---|---|---|
| 1 | Seed Rift และ Mirror Path จากชุดต้นฉบับ mission-vfx-next | Seed Rift 12 @24 FPS และ Mirror Path 8 @24 FPS เพื่อสื่อสองเหตุการณ์ต่างกัน |
| 2 | ภารกิจและกองทัพ Frozen Pantry | ลูปเดิน 8 เริ่มจาก Captain/General, Scout และ Lancer แล้วเก็บทหารชุดที่เหลือ รูปปั้นใช้เฟรมแรกเหมือนเดิม |
| 3 | ฮีโร่และ Yuzu | 8 สำหรับท่าที่เห็นประจำ 12 สำหรับท่าใหญ่ที่มีช่วงสะสม/ปล่อย/สลาย รักษาจังหวะออกดาเมจและเสียง |
| 4 | ศัตรูทั่วไปและคลิปย่อย | ใช้ชุดที่เล่นจริงของแต่ละบท ทำทีละกลุ่ม แยกคลิปจาก atlas ถ้าเฟรมเดียวกันถูกใช้กับท่าอื่น |
| 5 | บอสและตัวบอกอันตราย | 8 สำหรับลูปเตือน 12 สำหรับคลื่นกวาดและท่าใหญ่ ตรวจด้านปลอดภัยและทรงกระสุน เริ่มรีวิว C1 ก่อนทำบทอื่น |
| 6 | เมนู, Ruby และ Expedition | 8 สำหรับท่าที่เห็นการเปลี่ยนจริง ตรวจภาพสถานะกับ atlas ที่ใช้เลขเฟรมตรง ๆ |

เก็บจังหวะจริงจากผู้เรียกใช้ เช่น `frameRate`, `life`, การเล่นกลับ และ tween ก่อนเพิ่มเฟรม รูปเตือนต้องตรงขนาดพื้นที่อันตราย เฟรมใหม่ใช้ pivot และ baseline เดิม ถ้าแอนิเมชันเป็นลูปให้ตรวจเฟรมสุดท้ายต่อเฟรมแรก แต่ละเฟสเตรียม preview ที่ขนาดเล่นจริง ตรวจ alpha และขอบทุกเฟรม เช็กตัวเลือก Reduced Motion, lazy load, งบ GPU และขนาด build ก่อนรวมเข้าชุด

## ความคืบหน้า

- **เฟส 2A · Frozen Pantry** เพิ่มท่าเดิน 8 เฟรมครบทั้ง 7 บทบาทใน v8.2.65 โดยใช้ท่ายืนเฟรมแรกเดิมและเวลาเดินครบรอบเท่าเดิม พรีวิวอยู่ที่ [Frozen Pantry](../../assets/incoming/frozen-pantry/preview.gif)
- **เฟส 2B · มอนภารกิจอื่น** ลูกน้อง Hunger Herald 3 แบบ, Seed Rift carriers 3 แบบ, Bee, Moth และ Sapper รวม 9 แผ่นที่ 8 เฟรมใน v8.2.66 [พรีวิว](../../assets/incoming/mission-motion2b/preview.gif)
- **เฟส 2C · พร็อพและ VFX ในภารกิจ** ตรวจเส้นแสง ขวดพิษ ผลึก โคม และอุปกรณ์ในรายการเฟส 2 ตามจุดเรียกจริง
- แนวทางใบสั่งอาร์ตล่าสุดกำหนด 6 เฟรมสำหรับประกายกระทบขนาดเล็ก 8 สำหรับลูปเดิน และ 12 สำหรับท่าใหญ่ ช่องที่เรียกตามดัชนีเป็นภาพสถานะจะตรวจตามหน้าที่เดิม

## รายการคีย์รายเฟส

จำนวนด้านล่างนับเป็นคีย์อาร์ต ไม่ใช่จำนวนคลิปที่ต้องสั่งสร้าง ตัวเลข 8/12 คือข้อเสนอเฟรมต่อคลิป แถวสำรองและแผ่นภาพสถานะอยู่ในรายการเพื่อเช็กครบ

### เฟส 2 · 30 คีย์

| คีย์ | เป้าหมาย | เหตุผล/จุดตรวจ | ที่มา |
|---|---:|---|---|
| `ws92_tether` | 8 | ฟีดแบ็กภารกิจ/ลูปชัดขึ้น | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3575) |
| `hh87_booster` | 8 | ฟีดแบ็กภารกิจ/ลูปชัดขึ้น | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L4153) |
| `hh87_healer` | 8 | ฟีดแบ็กภารกิจ/ลูปชัดขึ้น | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L4153) |
| `hh87_possessor` | 8 | ฟีดแบ็กภารกิจ/ลูปชัดขึ้น | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L4153) |
| `hn87_poison_bottle` | 8 | ลูปขวด ต้องอัปเดตจุดเรียก start:0/end:3 | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L4153) |
| `sr87_carrier_armored` | 8 | ฟีดแบ็กภารกิจ/ลูปชัดขึ้น | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L4153) |
| `sr87_carrier_fast` | 8 | ฟีดแบ็กภารกิจ/ลูปชัดขึ้น | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L4153) |
| `sr87_carrier_split` | 8 | ฟีดแบ็กภารกิจ/ลูปชัดขึ้น | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L4153) |
| `st87_bee` | 8 | ฟีดแบ็กภารกิจ/ลูปชัดขึ้น | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L4153) |
| `ll85_moth` | 8 | ฟีดแบ็กภารกิจ/ลูปชัดขึ้น | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L4156) |
| `hs85_sapper` | 8 | ฟีดแบ็กภารกิจ/ลูปชัดขึ้น | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L4157) |
| `hh85_beam` | 8 | ฟีดแบ็กภารกิจ/ลูปชัดขึ้น | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L4158) |
| `fp_new_basic` | 8 | ฟีดแบ็กภารกิจ/ลูปชัดขึ้น | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L4160) |
| `fp_new_fast` | 8 | ฟีดแบ็กภารกิจ/ลูปชัดขึ้น | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L4161) |
| `fp_new_dasher` | 8 | ฟีดแบ็กภารกิจ/ลูปชัดขึ้น | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L4162) |
| `fp_new_shooter` | 8 | ฟีดแบ็กภารกิจ/ลูปชัดขึ้น | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L4163) |
| `fp_new_tank` | 8 | ฟีดแบ็กภารกิจ/ลูปชัดขึ้น | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L4164) |
| `fp_new_captain` | 8 | ฟีดแบ็กภารกิจ/ลูปชัดขึ้น | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L4165) |
| `fp_new_general` | 8 | ฟีดแบ็กภารกิจ/ลูปชัดขึ้น | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L4166) |
| `hm_splinter` | 8 | ฟีดแบ็กภารกิจ/ลูปชัดขึ้น | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L4172) |
| `gp_pot` | 8 | ฟีดแบ็กภารกิจ/ลูปชัดขึ้น | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L4181) |
| `gp_ingredients` | พัก | ยังต้องยืนยันเส้นทางใช้งานก่อนสั่งภาพ | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L4182) |
| `msn71_crystal` | 8 | ฟีดแบ็กภารกิจ/ลูปชัดขึ้น | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L4187) |
| `msn71_lantern` | 8 | ฟีดแบ็กภารกิจ/ลูปชัดขึ้น | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L4189) |
| `msn71_season_shrines` | คง 4 ช่อง | ดัชนีเลือกชนิด สถานะ หรือประกายคนละแบบ | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L4192) |
| `msn71_petals` | คง 4 ช่อง | ดัชนีเลือกชนิด สถานะ หรือประกายคนละแบบ | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L4193) |
| `msn71_bubble` | คง 4 สำรอง | ตัวเกมมีภาพวาดด้วยโค้ดเป็นเส้นทางหลักหรือเป็นทางเลือก | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L4194) |
| `ult_altar` | 8 | ฟีดแบ็กภารกิจ/ลูปชัดขึ้น | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L4197) |
| `ult_seed` | 8 | ฟีดแบ็กภารกิจ/ลูปชัดขึ้น | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L4199) |
| `gg_oven` | 8 | ฟีดแบ็กภารกิจ/ลูปชัดขึ้น | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L4202) |

### เฟส 3 · 72 คีย์

| คีย์ | เป้าหมาย | เหตุผล/จุดตรวจ | ที่มา |
|---|---:|---|---|
| `yzs_seed_shot` | 8 | ท่าหรือเอฟเฟกต์ต่อสู้สั้น | [แผ่น Sprite](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3224) |
| `yz_fx_slam` | 8 | ท่าหรือเอฟเฟกต์ต่อสู้สั้น | [แผ่น Sprite](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3298) |
| `yz_fx_rain` | 8 | ท่าหรือเอฟเฟกต์ต่อสู้สั้น | [แผ่น Sprite](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3299) |
| `yz_fx_infusion` | 8 | ท่าหรือเอฟเฟกต์ต่อสู้สั้น | [แผ่น Sprite](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3300) |
| `yz_fx_shield` | 8 | ท่าหรือเอฟเฟกต์ต่อสู้สั้น | [แผ่น Sprite](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3301) |
| `yz_49_peel` | 8 | ท่าหรือเอฟเฟกต์ต่อสู้สั้น ตรวจชุดเส้นขอบและทางสำรองของ Yuzu ก่อน | [แผ่น Sprite](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3302) |
| `yz_49_slam` | 12 | จังหวะสะสม/ปล่อย/สลายหรือคลื่นกวาดขนาดใหญ่ ตรวจชุดเส้นขอบและทางสำรองของ Yuzu ก่อน | [แผ่น Sprite](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3303) |
| `yz_49_volley` | 8 | ท่าหรือเอฟเฟกต์ต่อสู้สั้น ตรวจชุดเส้นขอบและทางสำรองของ Yuzu ก่อน | [แผ่น Sprite](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3304) |
| `yz_49_rain` | 12 | จังหวะสะสม/ปล่อย/สลายหรือคลื่นกวาดขนาดใหญ่ ตรวจชุดเส้นขอบและทางสำรองของ Yuzu ก่อน | [แผ่น Sprite](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3305) |
| `yz_49_sweet` | 8 | ท่าหรือเอฟเฟกต์ต่อสู้สั้น ตรวจชุดเส้นขอบและทางสำรองของ Yuzu ก่อน | [แผ่น Sprite](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3306) |
| `yz_49_sour` | 8 | ท่าหรือเอฟเฟกต์ต่อสู้สั้น ตรวจชุดเส้นขอบและทางสำรองของ Yuzu ก่อน | [แผ่น Sprite](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3307) |
| `yz_49_spicy` | 8 | ท่าหรือเอฟเฟกต์ต่อสู้สั้น ตรวจชุดเส้นขอบและทางสำรองของ Yuzu ก่อน | [แผ่น Sprite](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3308) |
| `yz_47_attacks` | คง 4 ช่อง | ดัชนีเลือกชนิด สถานะ หรือประกายคนละแบบ | [แผ่น Sprite](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3339) |
| `minion_yuzling` | 8 | ท่าหรือเอฟเฟกต์ต่อสู้สั้น | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3343) |
| `minion_cheese` | พัก | ยังต้องยืนยันเส้นทางใช้งานก่อนสั่งภาพ | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3344) |
| `char_cocoa_hurt` | 8 | ท่าหรือเอฟเฟกต์ต่อสู้สั้น | [แผ่น Sprite](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3383) |
| `char_yuzu_hurt` | 8 | ท่าหรือเอฟเฟกต์ต่อสู้สั้น | [แผ่น Sprite](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3386) |
| `char_mint_hurt` | 8 | ท่าหรือเอฟเฟกต์ต่อสู้สั้น | [แผ่น Sprite](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3388) |
| `char_taro_hurt` | 8 | ท่าหรือเอฟเฟกต์ต่อสู้สั้น | [แผ่น Sprite](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3390) |
| `char_sesame_hurt` | 8 | ท่าหรือเอฟเฟกต์ต่อสู้สั้น | [แผ่น Sprite](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3392) |
| `char_yuzu_hurt__summer` | 8 | ท่าหรือเอฟเฟกต์ต่อสู้สั้น | [แผ่น Sprite](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3395) |
| `char_mint_hurt__snow` | 8 | ท่าหรือเอฟเฟกต์ต่อสู้สั้น | [แผ่น Sprite](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3397) |
| `char_taro_hurt__star` | 8 | ท่าหรือเอฟเฟกต์ต่อสู้สั้น | [แผ่น Sprite](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3399) |
| `char_sesame_hurt__moon` | 8 | ท่าหรือเอฟเฟกต์ต่อสู้สั้น | [แผ่น Sprite](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3401) |
| `char_cocoa_hurt__chef` | 8 | ท่าหรือเอฟเฟกต์ต่อสู้สั้น | [แผ่น Sprite](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3500) |
| `sg92_pellet_trail` | คง 4 | อายุสั้นหรือวาบถี่มาก ตรวจในฉากจริงก่อนเพิ่มเฟรม | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3569) |
| `fx_mint_dash_shard` | 8 | ท่าหรือเอฟเฟกต์ต่อสู้สั้น | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3811) |
| `bpx_taro_plasma_ring` | 8 | ท่าหรือเอฟเฟกต์ต่อสู้สั้น | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3817) |
| `bpx_taro_plasma_hit` | 6 | ประกายสั้นตามกติกาใบสั่งอาร์ตล่าสุด ตรวจความถี่ในฉากจริง | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3819) |
| `bpx_taro_shock_aura` | 8 | ท่าหรือเอฟเฟกต์ต่อสู้สั้น | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3823) |
| `bpx_taro_arc_bolt` | คง 4 | อายุสั้นหรือวาบถี่มาก ตรวจในฉากจริงก่อนเพิ่มเฟรม | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3828) |
| `bpx_taro_arc_hit` | 6 | ประกายสั้นตามกติกาใบสั่งอาร์ตล่าสุด ตรวจความถี่ในฉากจริง | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3829) |
| `bpx_taro_arc_loop` | คง 4 | อายุสั้นหรือวาบถี่มาก ตรวจในฉากจริงก่อนเพิ่มเฟรม | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3830) |
| `bpx_taro_spark` | 8 | ท่าหรือเอฟเฟกต์ต่อสู้สั้น | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L4005) |
| `bpx_taro_spark_split` | 6 | ประกายสั้นตามกติกาใบสั่งอาร์ตล่าสุด ตรวจความถี่ในฉากจริง | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L4006) |
| `bpx_taro_spark_bounce` | 6 | ประกายสั้นตามกติกาใบสั่งอาร์ตล่าสุด ตรวจความถี่ในฉากจริง | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L4007) |
| `bpx_taro_spark_hit` | 6 | ประกายสั้นตามกติกาใบสั่งอาร์ตล่าสุด ตรวจความถี่ในฉากจริง | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L4008) |
| `bpx_taro_ball_field` | 8 | ท่าหรือเอฟเฟกต์ต่อสู้สั้น | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L4012) |
| `bpx_taro_ball_zap` | คง 4 | อายุสั้นหรือวาบถี่มาก ตรวจในฉากจริงก่อนเพิ่มเฟรม | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L4013) |
| `bpx_taro_ball_zap_hit` | 6 | ประกายสั้นตามกติกาใบสั่งอาร์ตล่าสุด ตรวจความถี่ในฉากจริง | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L4014) |
| `bpx_taro_sentry_idle` | 8 | ท่าหรือเอฟเฟกต์ต่อสู้สั้น | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L4016) |
| `bpx_taro_sentry_fire` | 8 | ท่าหรือเอฟเฟกต์ต่อสู้สั้น | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L4018) |
| `bpx_taro_beacon_idle` | 8 | ท่าหรือเอฟเฟกต์ต่อสู้สั้น | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L4020) |
| `bpx_taro_orb_zap` | 8 | ท่าหรือเอฟเฟกต์ต่อสู้สั้น | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L4022) |
| `bpx_taro_orb_launch` | 8 | ท่าหรือเอฟเฟกต์ต่อสู้สั้น | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L4023) |
| `bpx_taro_overcharge` | 8 | ท่าหรือเอฟเฟกต์ต่อสู้สั้น | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L4027) |
| `bpx_taro_tesla` | 8 | ท่าหรือเอฟเฟกต์ต่อสู้สั้น | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L4028) |
| `bpx_cocoa_fist` | 8 | ท่าหรือเอฟเฟกต์ต่อสู้สั้น | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L4082) |
| `bpx_cocoa_fireball` | 8 | ท่าหรือเอฟเฟกต์ต่อสู้สั้น | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L4083) |
| `bpx_cocoa_gauntlet` | 8 | ท่าหรือเอฟเฟกต์ต่อสู้สั้น | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L4085) |
| `bpx_cocoa_firepool` | 8 | ท่าหรือเอฟเฟกต์ต่อสู้สั้น | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L4087) |
| `bpx_cocoa_shadowfist` | 8 | ท่าหรือเอฟเฟกต์ต่อสู้สั้น | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L4090) |
| `bpx_cocoa_chainline` | 8 | ท่าหรือเอฟเฟกต์ต่อสู้สั้น | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L4091) |
| `bpx_momo_sniperhit` | 8 | ท่าหรือเอฟเฟกต์ต่อสู้สั้น | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L4096) |
| `bpx_momo_pellethit` | 6 | ประกายสั้นตามกติกาใบสั่งอาร์ตล่าสุด ตรวจความถี่ในฉากจริง | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L4097) |
| `bpx_cocoa_slam_mark` | 8 | ท่าหรือเอฟเฟกต์ต่อสู้สั้น | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L4100) |
| `bpx_cocoa_rage_preview` | 8 | ท่าหรือเอฟเฟกต์ต่อสู้สั้น | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L4101) |
| `bpx_cocoa_rage_target` | 8 | ท่าหรือเอฟเฟกต์ต่อสู้สั้น | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L4102) |
| `bpx_cocoa_crater` | 8 | ท่าหรือเอฟเฟกต์ต่อสู้สั้น | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L4103) |
| `vfx_xp_trail` | คง 4 | อายุสั้นหรือวาบถี่มาก ตรวจในฉากจริงก่อนเพิ่มเฟรม | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L4107) |
| `bpx_cocoa_dash_trail` | คง 4 สำรอง | ตัวเกมมีภาพวาดด้วยโค้ดเป็นเส้นทางหลักหรือเป็นทางเลือก | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L4110) |
| `bpx_momo_seed_pop` | 8 | ท่าหรือเอฟเฟกต์ต่อสู้สั้น | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L4111) |
| `bpx_momo_aim_line` | 8 | ท่าหรือเอฟเฟกต์ต่อสู้สั้น | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L4112) |
| `bpx_momo_aim_cone` | 8 | ท่าหรือเอฟเฟกต์ต่อสู้สั้น | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L4113) |
| `bpx_mint_chill_hit` | 8 | ท่าหรือเอฟเฟกต์ต่อสู้สั้น | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L4115) |
| `bpx_mint_needle_hit` | 8 | ท่าหรือเอฟเฟกต์ต่อสู้สั้น | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L4117) |
| `bpx_mint_lance_charge` | 8 | ท่าหรือเอฟเฟกต์ต่อสู้สั้น | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L4118) |
| `bpx_mint_aim_line` | 8 | ท่าหรือเอฟเฟกต์ต่อสู้สั้น | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L4119) |
| `bpx_mint_bloom_preview` | 8 | ท่าหรือเอฟเฟกต์ต่อสู้สั้น | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L4120) |
| `bpx_taro_shrapnel` | 8 | ท่าหรือเอฟเฟกต์ต่อสู้สั้น | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L4122) |
| `bpx_momo_bounce` | 8 | ท่าหรือเอฟเฟกต์ต่อสู้สั้น | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L4124) |
| `bpx_momo_link` | 8 | ท่าหรือเอฟเฟกต์ต่อสู้สั้น | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L4125) |

### เฟส 4 · 14 คีย์

| คีย์ | เป้าหมาย | เหตุผล/จุดตรวจ | ที่มา |
|---|---:|---|---|
| `c3_e_basic` | คง 4 สำรอง | มีรุ่น _animated ที่ถูกเลือกก่อน | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3276) |
| `c3_e_fast` | คง 4 สำรอง | มีรุ่น _animated ที่ถูกเลือกก่อน | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3277) |
| `c3_e_shooter` | คง 4 สำรอง | มีรุ่น _animated ที่ถูกเลือกก่อน | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3278) |
| `c3_e_bomber` | คง 4 สำรอง | มีรุ่น _animated ที่ถูกเลือกก่อน | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3279) |
| `c3_e_tank` | คง 4 สำรอง | มีรุ่น _animated ที่ถูกเลือกก่อน | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3280) |
| `mb5_banquet_executioner` | 8 | ลูปเคลื่อนที่ อ่านทิศและทรงตัว | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3422) |
| `e_void_crumb` | คง 4 สำรอง | ชุด _animated เป็นเป้าหมายก่อนถ้าโหลดได้ | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3423) |
| `e_crown_ripper` | คง 4 สำรอง | ชุด _animated เป็นเป้าหมายก่อนถ้าโหลดได้ | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3424) |
| `e_banquet_eye` | คง 4 สำรอง | ชุด _animated เป็นเป้าหมายก่อนถ้าโหลดได้ | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3425) |
| `e_maw_truffle` | คง 4 สำรอง | ชุด _animated เป็นเป้าหมายก่อนถ้าโหลดได้ | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3426) |
| `e_royal_oven_sentinel` | คง 4 สำรอง | ชุด _animated เป็นเป้าหมายก่อนถ้าโหลดได้ | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3427) |
| `e_acid` | 8 | ตรวจ key ที่เลือกตาม Chapter ก่อน ทำคลิปเดินที่ถูกเรียกจริง | [แผ่น Sprite](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3488) |
| `e_dasher` | 8 | ตรวจ key ที่เลือกตาม Chapter ก่อน ทำคลิปเดินที่ถูกเรียกจริง | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3490) |
| `e_siege` | 8 | ตรวจ key ที่เลือกตาม Chapter ก่อน ทำคลิปเดินที่ถูกเรียกจริง | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3491) |

### เฟส 5 · 126 คีย์

| คีย์ | เป้าหมาย | เหตุผล/จุดตรวจ | ที่มา |
|---|---:|---|---|
| `mb7_fungal_juggernaut` | แยกคลิป | ตรวจ index ท่าค้าง/ท่าตายก่อนเปลี่ยน ใช้ชุดบอสเส้นหมึกถ้ามี | [แผ่น Sprite](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3173) |
| `mb8_royal_stinger` | แยกคลิป | ตรวจ index ท่าค้าง/ท่าตายก่อนเปลี่ยน ใช้ชุดบอสเส้นหมึกถ้ามี | [แผ่น Sprite](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3173) |
| `mb9_season_keeper` | แยกคลิป | ตรวจ index ท่าค้าง/ท่าตายก่อนเปลี่ยน ใช้ชุดบอสเส้นหมึกถ้ามี | [แผ่น Sprite](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3173) |
| `proj_c24_frost_shard` | 8 | รักษารูปทรงและขอบเขตสกิล | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3473) |
| `proj_c24_autumn_leaf` | 8 | รักษารูปทรงและขอบเขตสกิล | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3474) |
| `mb10_ancient_root_knight` | 8/12 แยกคลิป | walk/idle/charge = 8 และ cleave = 12 คงช่องท่าค้างกับตายตาม index เดิม | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3485) |
| `bshot_anim817_01` | คง 4 สำรอง | ด่าน Story นี้ปิดการยิงของบอส ตรวจเส้นทาง Delve/Pinnacle ก่อน | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3661) |
| `bshot_anim817_02` | 8 | คงหัวกระสุนและเงารูปทรงเดิม เริ่มจากชนิดที่ปรากฏบ่อย | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3662) |
| `bshot_anim817_03` | 8 | คงหัวกระสุนและเงารูปทรงเดิม เริ่มจากชนิดที่ปรากฏบ่อย | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3663) |
| `bshot_anim817_04` | คง 4 สำรอง | ด่าน Story นี้ปิดการยิงของบอส ตรวจเส้นทาง Delve/Pinnacle ก่อน | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3664) |
| `bshot_anim817_05` | 8 | คงหัวกระสุนและเงารูปทรงเดิม เริ่มจากชนิดที่ปรากฏบ่อย | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3665) |
| `bshot_anim817_06` | 8 | คงหัวกระสุนและเงารูปทรงเดิม เริ่มจากชนิดที่ปรากฏบ่อย | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3666) |
| `bshot_anim817_07` | คง 4 สำรอง | ด่าน Story นี้ปิดการยิงของบอส ตรวจเส้นทาง Delve/Pinnacle ก่อน | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3667) |
| `bshot_anim817_08` | 8 | คงหัวกระสุนและเงารูปทรงเดิม เริ่มจากชนิดที่ปรากฏบ่อย | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3668) |
| `bshot_anim817_09` | 8 | คงหัวกระสุนและเงารูปทรงเดิม เริ่มจากชนิดที่ปรากฏบ่อย | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3669) |
| `bshot_anim817_10` | 8 | คงหัวกระสุนและเงารูปทรงเดิม เริ่มจากชนิดที่ปรากฏบ่อย | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3670) |
| `bshot_anim817_11` | คง 4 สำรอง | ด่าน Story นี้ปิดการยิงของบอส ตรวจเส้นทาง Delve/Pinnacle ก่อน | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3671) |
| `bshot_anim817_12` | 8 | คงหัวกระสุนและเงารูปทรงเดิม เริ่มจากชนิดที่ปรากฏบ่อย | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3672) |
| `bshot_anim817_13` | 8 | คงหัวกระสุนและเงารูปทรงเดิม เริ่มจากชนิดที่ปรากฏบ่อย | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3673) |
| `bshot_anim817_14` | 8 | คงหัวกระสุนและเงารูปทรงเดิม เริ่มจากชนิดที่ปรากฏบ่อย | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3674) |
| `bshot_anim817_15` | คง 4 สำรอง | ด่าน Story นี้ปิดการยิงของบอส ตรวจเส้นทาง Delve/Pinnacle ก่อน | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3675) |
| `bshot_anim817_pin` | 8 | คงหัวกระสุนและเงารูปทรงเดิม เริ่มจากชนิดที่ปรากฏบ่อย | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3676) |
| `vfx_c24_spring_heal` | 8 | รักษารูปทรงและขอบเขตสกิล | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3836) |
| `vfx_c24_summer_burn` | 8 | รักษารูปทรงและขอบเขตสกิล | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3837) |
| `vfx_c24_autumn_lane` | 8 | รักษารูปทรงและขอบเขตสกิล | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3840) |
| `vfx_c24_autumn_slash` | 12 | จังหวะสะสม/ปล่อย/สลายหรือคลื่นกวาดขนาดใหญ่ | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3841) |
| `vfx_c24_winter_patch` | 8 | รักษารูปทรงและขอบเขตสกิล | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3842) |
| `vfx_c24_vine_fan` | 8 | รักษารูปทรงและขอบเขตสกิล | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3844) |
| `vfx_c24_vine_slash` | 12 | จังหวะสะสม/ปล่อย/สลายหรือคลื่นกวาดขนาดใหญ่ | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3845) |
| `vfx_c24_solar_ring` | 12 | จังหวะสะสม/ปล่อย/สลายหรือคลื่นกวาดขนาดใหญ่ | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3846) |
| `vfx_c24_season_seal` | 8 | รักษารูปทรงและขอบเขตสกิล | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3848) |
| `vfx_b01_warn` | 8 | รักษารูปทรงและขอบเขตสกิล | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3870) |
| `vfx_b01_wave` | คง 4 สำรอง | ตัวเกมมีภาพวาดด้วยโค้ดเป็นเส้นทางหลักหรือเป็นทางเลือก | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3872) |
| `vfx_b01_lane` | คง 4 สำรอง | ตัวเกมมีภาพวาดด้วยโค้ดเป็นเส้นทางหลักหรือเป็นทางเลือก | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3873) |
| `vfx_b02_warn` | 8 | รักษารูปทรงและขอบเขตสกิล | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3874) |
| `vfx_b02_wave` | 12 | จังหวะสะสม/ปล่อย/สลายหรือคลื่นกวาดขนาดใหญ่ | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3876) |
| `vfx_b02_lane` | คง 4 สำรอง | ตัวเกมมีภาพวาดด้วยโค้ดเป็นเส้นทางหลักหรือเป็นทางเลือก | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3877) |
| `vfx_b03_warn` | 8 | รักษารูปทรงและขอบเขตสกิล | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3878) |
| `vfx_b03_wave` | 12 | จังหวะสะสม/ปล่อย/สลายหรือคลื่นกวาดขนาดใหญ่ | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3880) |
| `vfx_b03_lane` | คง 4 สำรอง | ตัวเกมมีภาพวาดด้วยโค้ดเป็นเส้นทางหลักหรือเป็นทางเลือก | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3881) |
| `vfx_b04_warn` | 8 | รักษารูปทรงและขอบเขตสกิล | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3882) |
| `vfx_b04_wave` | 12 | จังหวะสะสม/ปล่อย/สลายหรือคลื่นกวาดขนาดใหญ่ | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3884) |
| `vfx_b04_lane` | คง 4 สำรอง | ตัวเกมมีภาพวาดด้วยโค้ดเป็นเส้นทางหลักหรือเป็นทางเลือก | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3885) |
| `vfx_b05_warn` | 8 | รักษารูปทรงและขอบเขตสกิล | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3886) |
| `vfx_b05_wave` | 12 | จังหวะสะสม/ปล่อย/สลายหรือคลื่นกวาดขนาดใหญ่ | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3888) |
| `vfx_b05_lane` | คง 4 สำรอง | ตัวเกมมีภาพวาดด้วยโค้ดเป็นเส้นทางหลักหรือเป็นทางเลือก | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3889) |
| `vfx_b06_warn` | 8 | รักษารูปทรงและขอบเขตสกิล | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3890) |
| `vfx_b06_wave` | 12 | จังหวะสะสม/ปล่อย/สลายหรือคลื่นกวาดขนาดใหญ่ | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3892) |
| `vfx_b06_lane` | คง 4 สำรอง | ตัวเกมมีภาพวาดด้วยโค้ดเป็นเส้นทางหลักหรือเป็นทางเลือก | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3893) |
| `vfx_b07_warn` | 8 | รักษารูปทรงและขอบเขตสกิล | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3894) |
| `vfx_b07_wave` | 12 | จังหวะสะสม/ปล่อย/สลายหรือคลื่นกวาดขนาดใหญ่ | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3896) |
| `vfx_b07_lane` | คง 4 สำรอง | ตัวเกมมีภาพวาดด้วยโค้ดเป็นเส้นทางหลักหรือเป็นทางเลือก | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3897) |
| `vfx_b08_warn` | 8 | รักษารูปทรงและขอบเขตสกิล | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3898) |
| `vfx_b08_wave` | 12 | จังหวะสะสม/ปล่อย/สลายหรือคลื่นกวาดขนาดใหญ่ | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3900) |
| `vfx_b08_lane` | คง 4 สำรอง | ตัวเกมมีภาพวาดด้วยโค้ดเป็นเส้นทางหลักหรือเป็นทางเลือก | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3901) |
| `vfx_b09_warn` | 8 | รักษารูปทรงและขอบเขตสกิล | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3902) |
| `vfx_b09_wave` | 12 | จังหวะสะสม/ปล่อย/สลายหรือคลื่นกวาดขนาดใหญ่ | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3904) |
| `vfx_b09_lane` | คง 4 สำรอง | ตัวเกมมีภาพวาดด้วยโค้ดเป็นเส้นทางหลักหรือเป็นทางเลือก | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3905) |
| `vfx_b10_warn` | 8 | รักษารูปทรงและขอบเขตสกิล | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3906) |
| `vfx_b10_wave` | 12 | จังหวะสะสม/ปล่อย/สลายหรือคลื่นกวาดขนาดใหญ่ | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3908) |
| `vfx_b10_lane` | คง 4 สำรอง | ตัวเกมมีภาพวาดด้วยโค้ดเป็นเส้นทางหลักหรือเป็นทางเลือก | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3909) |
| `vfx_b02_suction` | 8 | รักษารูปทรงและขอบเขตสกิล | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3911) |
| `vfx_b02_bubble_cage` | 8 | รักษารูปทรงและขอบเขตสกิล | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3912) |
| `vfx_b03_grinder_blade` | 8 | รักษารูปทรงและขอบเขตสกิล | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3913) |
| `vfx_b03_fire_cross` | 8 | รักษารูปทรงและขอบเขตสกิล | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3914) |
| `vfx_b04_blizzard` | 8 | รักษารูปทรงและขอบเขตสกิล | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3916) |
| `vfx_b05_void_maw` | 8 | รักษารูปทรงและขอบเขตสกิล | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3918) |
| `vfx_b07_heartstorm` | 8 | รักษารูปทรงและขอบเขตสกิล | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3923) |
| `vfx_b08_dive_trail` | คง 4 สำรอง | ตัวเกมมีภาพวาดด้วยโค้ดเป็นเส้นทางหลักหรือเป็นทางเลือก | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3925) |
| `vfx_b10_crown_cage` | 8 | รักษารูปทรงและขอบเขตสกิล | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3926) |
| `vfx_b10_choir_note` | 8 | รักษารูปทรงและขอบเขตสกิล | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3927) |
| `counter_c21_pod` | 8 | รักษารูปทรงและขอบเขตสกิล | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3931) |
| `vfx_counter_ring` | 8 | รักษารูปทรงและขอบเขตสกิล | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3932) |
| `counter_c12_sponge` | 8 | รักษารูปทรงและขอบเขตสกิล | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3933) |
| `counter_c13_pan` | 8 | รักษารูปทรงและขอบเขตสกิล | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3934) |
| `counter_c14_ice` | 8 | รักษารูปทรงและขอบเขตสกิล | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3935) |
| `counter_c22_mushroom` | 8 | รักษารูปทรงและขอบเขตสกิล | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3936) |
| `counter_c23_honey` | 8 | รักษารูปทรงและขอบเขตสกิล | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3937) |
| `counter_c24_season_seed` | 8 | รักษารูปทรงและขอบเขตสกิล | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3938) |
| `counter_c25_root_seed` | 8 | รักษารูปทรงและขอบเขตสกิล | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3939) |
| `counter_c11_egg` | 8 | รักษารูปทรงและขอบเขตสกิล | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3941) |
| `vfx_b11_warn` | 8 | รักษารูปทรงและขอบเขตสกิล | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3943) |
| `vfx_b12_warn` | 8 | รักษารูปทรงและขอบเขตสกิล | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3945) |
| `vfx_b13_warn` | 8 | รักษารูปทรงและขอบเขตสกิล | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3947) |
| `vfx_b14_warn` | 8 | รักษารูปทรงและขอบเขตสกิล | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3949) |
| `vfx_b15_warn` | 8 | รักษารูปทรงและขอบเขตสกิล | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3951) |
| `vfx_bpin_warn` | 8 | รักษารูปทรงและขอบเขตสกิล | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3953) |
| `vfx_b12_wither_pull` | 8 | รักษารูปทรงและขอบเขตสกิล | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3956) |
| `vfx_b12_nectar_drip` | 8 | รักษารูปทรงและขอบเขตสกิล | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3957) |
| `vfx_b13_prism_beam` | 8 | รักษารูปทรงและขอบเขตสกิล | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3958) |
| `vfx_b14_vault_ring` | 8 | รักษารูปทรงและขอบเขตสกิล | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3959) |
| `vfx_b15_root_cage` | 8 | รักษารูปทรงและขอบเขตสกิล | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3960) |
| `vfx_bpin_maw` | 8 | รักษารูปทรงและขอบเขตสกิล | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3962) |
| `vfx_bpin_jaw_ring` | 8 | รักษารูปทรงและขอบเขตสกิล | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3963) |
| `counter_c33_mirror` | 8 | รักษารูปทรงและขอบเขตสกิล | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3964) |
| `counter_c35_crown_seed` | 8 | รักษารูปทรงและขอบเขตสกิล | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3965) |
| `vfx_b11_wave` | 12 | จังหวะสะสม/ปล่อย/สลายหรือคลื่นกวาดขนาดใหญ่ | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3966) |
| `vfx_b11_lane` | คง 4 สำรอง | ตัวเกมมีภาพวาดด้วยโค้ดเป็นเส้นทางหลักหรือเป็นทางเลือก | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3967) |
| `vfx_b12_wave` | 12 | จังหวะสะสม/ปล่อย/สลายหรือคลื่นกวาดขนาดใหญ่ | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3968) |
| `vfx_b12_lane` | คง 4 สำรอง | ตัวเกมมีภาพวาดด้วยโค้ดเป็นเส้นทางหลักหรือเป็นทางเลือก | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3969) |
| `vfx_b13_wave` | 12 | จังหวะสะสม/ปล่อย/สลายหรือคลื่นกวาดขนาดใหญ่ | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3970) |
| `vfx_b13_lane` | คง 4 สำรอง | ตัวเกมมีภาพวาดด้วยโค้ดเป็นเส้นทางหลักหรือเป็นทางเลือก | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3971) |
| `vfx_b14_wave` | 12 | จังหวะสะสม/ปล่อย/สลายหรือคลื่นกวาดขนาดใหญ่ | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3972) |
| `vfx_b14_lane` | คง 4 สำรอง | ตัวเกมมีภาพวาดด้วยโค้ดเป็นเส้นทางหลักหรือเป็นทางเลือก | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3973) |
| `vfx_b15_wave` | 12 | จังหวะสะสม/ปล่อย/สลายหรือคลื่นกวาดขนาดใหญ่ | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3974) |
| `vfx_b15_lane` | คง 4 สำรอง | ตัวเกมมีภาพวาดด้วยโค้ดเป็นเส้นทางหลักหรือเป็นทางเลือก | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3975) |
| `vfx_bpin_wave` | 12 | จังหวะสะสม/ปล่อย/สลายหรือคลื่นกวาดขนาดใหญ่ | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3976) |
| `vfx_bpin_lane` | คง 4 สำรอง | ตัวเกมมีภาพวาดด้วยโค้ดเป็นเส้นทางหลักหรือเป็นทางเลือก | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3977) |
| `vfx_b11_stampede_trail` | คง 4 สำรอง | ตัวเกมมีภาพวาดด้วยโค้ดเป็นเส้นทางหลักหรือเป็นทางเลือก | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3979) |
| `vfx_b14_last_seed` | 8 | รักษารูปทรงและขอบเขตสกิล | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3982) |
| `vfx_b15_crown_sweep` | 12 | จังหวะสะสม/ปล่อย/สลายหรือคลื่นกวาดขนาดใหญ่ | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3983) |
| `vfx_bpin_tongue` | 12 | จังหวะสะสม/ปล่อย/สลายหรือคลื่นกวาดขนาดใหญ่ | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3985) |
| `vfx_b01_burrow_shadow` | 8 | รักษารูปทรงและขอบเขตสกิล | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3987) |
| `vfx_b02_sludge_band` | 8 | รักษารูปทรงและขอบเขตสกิล | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3989) |
| `vfx_b04_frost_breath` | 12 | จังหวะสะสม/ปล่อย/สลายหรือคลื่นกวาดขนาดใหญ่ | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3991) |
| `vfx_b06_pod_shield` | 8 | รักษารูปทรงและขอบเขตสกิล | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3992) |
| `vfx_b07_fog_tile` | 8 | รักษารูปทรงและขอบเขตสกิล | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3993) |
| `vfx_b07_air_bubble` | 8 | รักษารูปทรงและขอบเขตสกิล | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3994) |
| `vfx_b09_clock_hand_long` | 8 | รักษารูปทรงและขอบเขตสกิล | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3995) |
| `vfx_b09_clock_hand_short` | 8 | รักษารูปทรงและขอบเขตสกิล | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3996) |
| `vfx_b10_root_band` | 8 | รักษารูปทรงและขอบเขตสกิล | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3997) |
| `arena_b04_ice_pillar` | คง 4 ช่อง | ใช้เฟรม 0 และขยายสไปรต์ด้วย tween | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3998) |
| `counter_c31_sheaf` | 8 | รักษารูปทรงและขอบเขตสกิล | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L4000) |
| `counter_c32_nectar` | 8 | รักษารูปทรงและขอบเขตสกิล | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L4001) |
| `counter_c34_vault_bomb` | 8 | รักษารูปทรงและขอบเขตสกิล | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L4002) |
| `counter_pin_meat` | 8 | รักษารูปทรงและขอบเขตสกิล | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L4003) |

### เฟส 6 · 32 คีย์

| คีย์ | เป้าหมาย | เหตุผล/จุดตรวจ | ที่มา |
|---|---:|---|---|
| `rar_frame` | คง 4 ช่อง | ดัชนีเลือกชนิด สถานะ หรือประกายคนละแบบ | [แผ่น UI](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L1991) |
| `rar_cell` | คง 4 ช่อง | ดัชนีเลือกชนิด สถานะ หรือประกายคนละแบบ | [แผ่น UI](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L1992) |
| `rar_gem` | คง 4 ช่อง | ดัชนีเลือกชนิด สถานะ หรือประกายคนละแบบ | [แผ่น UI](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L1993) |
| `l30_cell` | คง 4 ช่อง | ดัชนีเลือกชนิด สถานะ หรือประกายคนละแบบ | [แผ่น UI](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L2008) |
| `day_reward` | คง 4 ช่อง | ดัชนีเลือกชนิด สถานะ หรือประกายคนละแบบ | [แผ่น UI](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L2020) |
| `dig_hint_badge` | คง 4 ช่อง | ดัชนีเลือกชนิด สถานะ หรือประกายคนละแบบ | [แผ่น UI](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L2043) |
| `dig_miner` | คง 4 ช่อง | ดัชนีเลือกชนิด สถานะ หรือประกายคนละแบบ | [แผ่น UI](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L2044) |
| `ruby_point` | 8 | ขยับละเอียดขึ้น จัดลำดับหลังงานในด่าน | [แผ่น UI](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L2151) |
| `jr_slot` | คง 4 ช่อง | ดัชนีเลือกชนิด สถานะ หรือประกายคนละแบบ | [แผ่น UI](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L2312) |
| `jr_icon_ring` | คง 4 ช่อง | ดัชนีเลือกชนิด สถานะ หรือประกายคนละแบบ | [แผ่น UI](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L2317) |
| `temple_tab_sheet` | คง 4 ช่อง | ดัชนีเลือกชนิด สถานะ หรือประกายคนละแบบ | [แผ่น UI](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L2347) |
| `temple_buy_btn_sheet` | คง 4 ช่อง | ดัชนีเลือกชนิด สถานะ หรือประกายคนละแบบ | [แผ่น UI](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L2353) |
| `perk_btn_sheet` | คง 4 ช่อง | ดัชนีเลือกชนิด สถานะ หรือประกายคนละแบบ | [แผ่น UI](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L2361) |
| `vfx_lb_sparkle` | คง 4 สำรอง | ตัวเกมมีภาพวาดด้วยโค้ดเป็นเส้นทางหลักหรือเป็นทางเลือก | [แผ่น UI](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L2389) |
| `lvl_tpl_crest` | คง 4 ช่อง | ดัชนีเลือกชนิด สถานะ หรือประกายคนละแบบ | [แผ่น UI](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L2399) |
| `lvl_sparkle_sheet` | คง 4 ช่อง | ดัชนีเลือกชนิด สถานะ หรือประกายคนละแบบ | [แผ่น UI](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L2411) |
| `hud_speed_ring` | คง 4 ช่อง | ดัชนีเลือกชนิด สถานะ หรือประกายคนละแบบ | [แผ่น UI](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L2430) |
| `ex91_back_momo` | 8 | ท่าตีมุมหลังใช้ลำดับ 1,2,3,0 และ tween ให้พักเท้าตำแหน่งเดิม | [แผ่น Sprite](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3176) |
| `ex91_back_mint` | 8 | ท่าตีมุมหลังใช้ลำดับ 1,2,3,0 และ tween ให้พักเท้าตำแหน่งเดิม | [แผ่น Sprite](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3177) |
| `ex91_back_cocoa` | 8 | ท่าตีมุมหลังใช้ลำดับ 1,2,3,0 และ tween ให้พักเท้าตำแหน่งเดิม | [แผ่น Sprite](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3178) |
| `ex91_back_taro` | 8 | ท่าตีมุมหลังใช้ลำดับ 1,2,3,0 และ tween ให้พักเท้าตำแหน่งเดิม | [แผ่น Sprite](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3179) |
| `ex91_back_yuzu` | 8 | ท่าตีมุมหลังใช้ลำดับ 1,2,3,0 และ tween ให้พักเท้าตำแหน่งเดิม | [แผ่น Sprite](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3180) |
| `ex91_back_sesame` | 8 | ท่าตีมุมหลังใช้ลำดับ 1,2,3,0 และ tween ให้พักเท้าตำแหน่งเดิม | [แผ่น Sprite](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3181) |
| `vfx_lvl_card_in` | 8 | ขยับละเอียดขึ้น จัดลำดับหลังงานในด่าน | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3852) |
| `vfx_hub_firefly` | 8 | ขยับละเอียดขึ้น จัดลำดับหลังงานในด่าน | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3858) |
| `vfx_hub_moon_twinkle` | 8 | ขยับละเอียดขึ้น จัดลำดับหลังงานในด่าน | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3861) |
| `hub_btn_play_anim` | 8 | ขยับละเอียดขึ้น จัดลำดับหลังงานในด่าน | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3862) |
| `hub_btn_heroes_anim` | 8 | ขยับละเอียดขึ้น จัดลำดับหลังงานในด่าน | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3863) |
| `hub_btn_gear_anim` | 8 | ขยับละเอียดขึ้น จัดลำดับหลังงานในด่าน | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3864) |
| `hub_btn_activity_anim` | 8 | ขยับละเอียดขึ้น จัดลำดับหลังงานในด่าน | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3865) |
| `vfx_tr_edge_sparkle` | คง 4 สำรอง | ตัวเกมมีภาพวาดด้วยโค้ดเป็นเส้นทางหลักหรือเป็นทางเลือก | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3866) |
| `hub_btn_codex_anim` | 8 | ขยับละเอียดขึ้น จัดลำดับหลังงานในด่าน | [ทะเบียน](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3868) |

## คลิปสี่เฟรมในแผ่นใหญ่

ท่าโดนตีที่สั้นมากให้คง 4 ไว้ ท่าโจมตีหรือ wind-up ที่เรียกช่วงเดียวกันให้ประเมิน 8 เฟรมเป็นคลิปแยกก่อน เพื่อรักษาเฟรมเดิมของท่าโดนตีและท่าอื่น ส่วนยามรากโบราณมี idle, charge และ cleave ที่ลงทะเบียนในฟังก์ชันแยกและอยู่ในแผนเฟส 5 แล้ว

| คีย์ | คลิป | เฟรมปัจจุบัน | เป้าหมาย |
|---|---|---|---|
| [`e_void_crumb_animated`](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3240) | attack | 8, 9, 10, 11 | 8 แยกคลิป |
| [`e_maw_truffle_animated`](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3243) | attack | 8, 9, 10, 11 | 8 แยกคลิป |
| [`e_maw_truffle_animated`](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3243) | windup | 8, 9, 10, 11 | 8 แยกคลิป |
| [`e_royal_oven_sentinel_animated`](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3244) | attack | 8, 9, 10, 11 | 8 แยกคลิป |
| [`c3_e_basic_animated`](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3245) | attack | 8, 9, 10, 11 | 8 แยกคลิป |
| [`c3_e_bomber_animated`](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3248) | attack | 8, 9, 10, 11 | 8 แยกคลิป |
| [`c3_e_bomber_animated`](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3248) | windup | 8, 9, 10, 11 | 8 แยกคลิป |
| [`c3_e_tank_animated`](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3249) | attack | 8, 9, 10, 11 | 8 แยกคลิป |
| [`e_ice_wisp_animated`](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3251) | attack | 8, 9, 10, 11 | 8 แยกคลิป |
| [`e_ice_bomber_animated`](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3254) | attack | 8, 9, 10, 11 | 8 แยกคลิป |
| [`e_ice_bomber_animated`](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3254) | windup | 8, 9, 10, 11 | 8 แยกคลิป |
| [`e_ice_guardian_animated`](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3255) | attack | 8, 9, 10, 11 | 8 แยกคลิป |
| [`e_fire_ember_animated`](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3257) | attack | 8, 9, 10, 11 | 8 แยกคลิป |
| [`e_fire_bomber_animated`](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3260) | attack | 8, 9, 10, 11 | 8 แยกคลิป |
| [`e_fire_bomber_animated`](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3260) | windup | 8, 9, 10, 11 | 8 แยกคลิป |
| [`e_fire_golem_animated`](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3261) | attack | 8, 9, 10, 11 | 8 แยกคลิป |
| [`e_drain_slime_animated`](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3263) | attack | 8, 9, 10, 11 | 8 แยกคลิป |
| [`e_drain_bomber_animated`](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3266) | attack | 8, 9, 10, 11 | 8 แยกคลิป |
| [`e_drain_bomber_animated`](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3266) | windup | 8, 9, 10, 11 | 8 แยกคลิป |
| [`e_drain_tank_animated`](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3267) | attack | 8, 9, 10, 11 | 8 แยกคลิป |
| [`e_ant_worker_animated`](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3269) | attack | 8, 9, 10, 11 | 8 แยกคลิป |
| [`e_ant_soldier_animated`](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3272) | attack | 8, 9, 10, 11 | 8 แยกคลิป |
| [`e_ant_drone_animated`](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3273) | attack | 8, 9, 10, 11 | 8 แยกคลิป |
| [`e_ant_drone_animated`](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3273) | windup | 8, 9, 10, 11 | 8 แยกคลิป |
| [`c21_sprout_animated`](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3428) | attack | 8, 9, 10, 11 | 8 แยกคลิป |
| [`c21_fruit_pod_animated`](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3431) | attack | 8, 9, 10, 11 | 8 แยกคลิป |
| [`c21_fruit_pod_animated`](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3431) | windup | 8, 9, 10, 11 | 8 แยกคลิป |
| [`c21_root_beetle_animated`](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3432) | attack | 8, 9, 10, 11 | 8 แยกคลิป |
| [`c21_thorn_oracle_animated`](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3433) | attack | 8, 9, 10, 11 | 8 แยกคลิป |
| [`c22_drifter_animated`](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3435) | attack | 8, 9, 10, 11 | 8 แยกคลิป |
| [`c22_mold_sac_animated`](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3438) | windup | 8, 9, 10, 11 | 8 แยกคลิป |
| [`c22_mold_sac_animated`](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3438) | attack | 8, 9, 10, 11 | 8 แยกคลิป |
| [`c22_bulwark_animated`](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3439) | attack | 8, 9, 10, 11 | 8 แยกคลิป |
| [`c22_sporeling_animated`](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3441) | attack | 8, 9, 10, 11 | 8 แยกคลิป |
| [`c21_crown_sapling_animated`](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3447) | attack | 8, 9, 10, 11 | 8 แยกคลิป |
| [`mini_jelly_animated`](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3448) | attack | 8, 9, 10, 11 | 8 แยกคลิป |
| [`c3_elite_animated`](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3449) | attack | 8, 9, 10, 11 | 8 แยกคลิป |
| [`feast_target_animated`](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3450) | flee | 8, 9, 10, 11 | 8 แยกคลิป |
| [`mimic_chest_animated`](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3451) | attack | 8, 9, 10, 11 | 8 แยกคลิป |
| [`c23_drone_animated`](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3452) | attack | 8, 9, 10, 11 | 8 แยกคลิป |
| [`c23_honey_bomb_animated`](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3455) | windup | 8, 9, 10, 11 | 8 แยกคลิป |
| [`c23_honey_bomb_animated`](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3455) | attack | 8, 9, 10, 11 | 8 แยกคลิป |
| [`c23_wax_guard_animated`](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3456) | attack | 8, 9, 10, 11 | 8 แยกคลิป |
| [`c23_grub_animated`](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3458) | attack | 8, 9, 10, 11 | 8 แยกคลิป |
| [`c24_budling_animated`](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3462) | attack | 8, 9, 10, 11 | 8 แยกคลิป |
| [`c24_sunscarab_animated`](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3463) | attack | 8, 9, 10, 11 | 8 แยกคลิป |
| [`c24_stormfruit_animated`](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3466) | windup | 8, 9, 10, 11 | 8 แยกคลิป |
| [`c24_stormfruit_animated`](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3466) | attack | 8, 9, 10, 11 | 8 แยกคลิป |
| [`c24_equinox_animated`](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3467) | attack | 8, 9, 10, 11 | 8 แยกคลิป |
| [`c25_rootling_animated`](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3477) | attack | 8, 9, 10, 11 | 8 แยกคลิป |
| [`c25_thorn_charger_animated`](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3478) | attack | 8, 9, 10, 11 | 8 แยกคลิป |
| [`c25_seed_bomb_animated`](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3481) | windup | 8, 9, 10, 11 | 8 แยกคลิป |
| [`c25_seed_bomb_animated`](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3481) | attack | 8, 9, 10, 11 | 8 แยกคลิป |
| [`c25_bark_guard_animated`](https://github.com/hardza1230/Survival-like-Mobile-Game/blob/23673ac2dd68556b50c56662758cf9b1ecdbbb58/game.js#L3482) | attack | 8, 9, 10, 11 | 8 แยกคลิป |

### ระหว่างทำแต่ละเฟส

- ค้นจุดเรียก frame index, animation range และ atlas ที่ประกอบแบบไดนามิกของกลุ่มนั้นอีกครั้ง ตัวเลขในแผนเป็น snapshot ของทะเบียน ขนาดไฟล์และคลิปที่สแกนได้จากซอร์ส
- คงโหมดสำรองสำหรับเครื่องที่ยังโหลดอาร์ตไม่ครบ และทดสอบภาพวาดจากโค้ดจริงก่อนสั่ง ImageGen ในกลุ่มที่ใช้งานสลับกัน
