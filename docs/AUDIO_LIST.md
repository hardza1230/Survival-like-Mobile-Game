# รายการเสียง Mochi Mayhem (v4.98)

วิธีส่งไฟล์: อัปโหลดเข้า `assets/raw/audio/` ผ่าน GitHub บนมือถือ แล้วบอก AI ว่า "ใส่เสียงให้หน่อย"
ถ้ายังไม่มีไฟล์ใหม่ เกมจะใช้ไฟล์เดิมหรือเสียงสังเคราะห์แทนเอง ไม่พัง

รูปแบบไฟล์: `.ogg`, `.mp3` หรือ `.wav` ได้หมด (AI จะแปลงและย่อให้เอง)
- เอฟเฟกต์: สั้น 0.05–1.5 วิ ไม่มีช่วงเงียบหน้า-หลัง
- เพลง: 1–3 นาที ต่อวนได้เนียน (loop)

สถานะ: 🤖 สร้างด้วย jsfxr แล้ว (v4.99 · `scripts/gen_sfx_jsfxr.cjs`, public domain) ใช้งานได้แต่เปลี่ยนเป็นไฟล์ดีกว่าได้ · ✅ มีไฟล์แล้ว · 🔁 มีแต่ควรเปลี่ยนให้ดีขึ้น · ⬜ ยังไม่มี (ใช้เสียงสังเคราะห์อยู่)

## A. เอฟเฟกต์ที่ได้ยินบ่อย (สำคัญสุด)

| # | คีย์ | ใช้ตอน | ฟีลที่ต้องการ | สถานะ | แหล่งแนะนำ |
|---|---|---|---|---|---|
| 1 | `sfx_hit` | กระสุนโดนมอน / มอนตาย | ป๊อปนุ่ม ๆ เหมือนโมจิแตก สั้นมาก | 🔁 | Kenney Impact Sounds, jsfxr "Hit" |
| 2 | `sfx_xp` | เก็บ EXP (เกมไล่โน้ตสูงขึ้นให้เอง) | ติ๊งใส ๆ แบบเหรียญ/กระดิ่งเล็ก | 🔁 | jsfxr "Pickup/Coin" |
| 3 | `sfx_shoot` | Momo ยิงเมล็ด | ปุ๊บเบา ๆ ไม่แหลม (ได้ยินถี่มาก) | ✅ | jsfxr "Laser" ปรับให้ทุ้ม |
| 4 | `sfx_crit` | ตีคริติคอล | ตีแน่น ๆ + ประกายสูง | 🤖 | Kenney Impact "heavy" |
| 5 | `sfx_kill_big` | ฆ่า Elite / มินิบอส | ตูมหนัก + เสียงแตกกระจาย | 🤖 | Sonniss / Kenney "explosion small" |
| 6 | `sfx_hurt` | ผู้เล่นโดนตี | "อุ๊ย" สั้น ๆ หรือเสียงยางบีบ | 🤖 | Freesound "squeak" CC0 |
| 7 | `sfx_dash` | Dash | วืด + เด้งเยลลี่ | ✅ | — |
| 8 | `sfx_heal` | เก็บหัวใจฟื้นเลือด | กระดิ่ง 3 โน้ตขึ้น อบอุ่น | 🤖 | jsfxr "Powerup" |
| 9 | `sfx_magnet` | เก็บแม่เหล็กดูดออร์บ | วูบดูดเข้า | 🤖 | Kenney Sci-fi "whoosh" |

## B. สกิลตัวละคร

| # | คีย์ | ใช้ตอน | ฟีลที่ต้องการ | สถานะ |
|---|---|---|---|---|
| 10 | `sfx_frost` | Mint หอกน้ำแข็ง | น้ำแข็งแตกกริ๊ง | ✅ |
| 11 | `sfx_thunder` | Taro ฟ้าผ่า | ซ่า-เปรี้ยง สั้น | 🤖 |
| 12 | `sfx_punch` | Cocoa ต่อย | ตุบหนักแบบถุงมือนวม | 🤖 |
| 13 | `sfx_beam` | Sesame ลำแสงกระจก | วิ้งใส ๆ แบบคริสตัล | 🤖 |
| 14 | `sfx_ult_bomb` | อัลติ / ระเบิด | ตูมใหญ่ | ✅ |
| 15 | `sfx_burn` | Spicy Infusion ติดไฟ | ฟู่เบา ๆ | 🤖 |

## C. UI / ความคืบหน้า

| # | คีย์ | ใช้ตอน | ฟีลที่ต้องการ | สถานะ |
|---|---|---|---|---|
| 16 | `sfx_btn` | กดปุ่มเมนู | ป๊อกนุ่ม | ✅ |
| 17 | `sfx_levelup` | เลเวลอัพ | แฟนแฟร์สั้น 1 วิ | ✅ |
| 18 | `sfx_card` | เลือกการ์ด / Build Path | ฟึ่บ + ติ๊ง | 🤖 |
| 19 | `sfx_chest` | เปิดกล่อง / ได้ Relic | ฝาเปิด + ประกาย | ✅ |
| 20 | `sfx_legend` | ดรอป Legend / ของหายาก | คอร์ดเวทมนตร์ยาว 1.5 วิ | 🤖 |
| 21 | `sfx_boss_warn` | บอสกำลังมา | ไซเรนทุ้ม / กลองใหญ่ | 🔁 |
| 22 | `sfx_victory` | ชนะด่าน | แฟนแฟร์ 2 วิ | 🤖 |
| 23 | `sfx_defeat` | ตาย | โน้ตลงเศร้า ๆ น่ารัก | 🤖 |

## D. เพลง (BGM)

มีครบแล้วทุกช่อง แต่ไฟล์ใหญ่มาก (รวม ~43 MB — บอส 1 ไฟล์เดียว 7.7 MB) → AI ควรย่อเป็น ogg/mp3 96kbps เหลือ ~1–2 MB ต่อเพลง

| คีย์ | ใช้ตอน | สถานะ |
|---|---|---|
| `bgm_main` | เมนูหลัก | ✅ |
| `bgm_stage1-5` | ด่าน Chapter 1 | ✅ (Chapter 2–3 ใช้ซ้ำ) |
| `bgm_boss1-5` | บอส | ✅ |
| `bgm_ch2` | ด่าน Chapter 2 (สวนหมัก/เห็ด/รัง) | ⬜ |
| `bgm_ch3` | ด่าน Chapter 3 (ทุ่งเมล็ด/บัลลังก์) | ⬜ |
| `bgm_endgame` | Recipe Maps / Pinnacle | ⬜ |

### Prompt สั่ง AI ทำเพลง (Suno/Udio)

- **Chapter 2:** `cute fantasy game music, mysterious enchanted garden, pizzicato strings, marimba, soft synth pads, bouncy groove, 120 bpm, loopable, instrumental, no vocals`
- **Chapter 3:** `epic but cute fantasy battle music, ancient seed throne, orchestral strings, choir pads, glockenspiel, driving drums, 135 bpm, loopable, instrumental, no vocals`
- **Endgame:** `midnight kitchen fantasy, jazzy chiptune fusion, playful bass, 128 bpm, loopable, instrumental, no vocals`
- **เพลงชนะ (สั้น):** `short cute victory jingle, bells and brass, 6 seconds, happy fanfare, instrumental`

⚠️ ใช้แพ็กเกจที่อนุญาตเชิงพาณิชย์ และเช็กเงื่อนไขล่าสุดก่อนขึ้น Play Store

## ลำดับแนะนำ
1. #1 `sfx_hit` กับ #2 `sfx_xp` — ได้ยินบ่อยสุด เปลี่ยนแล้วฟีลเปลี่ยนทันที
2. #4–6 crit / kill_big / hurt
3. เพลง Chapter 2–3
4. ที่เหลือ
