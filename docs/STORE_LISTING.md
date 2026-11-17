# Google Play Store Listing — Mochi Mayhem

ตรวจเอกสาร 18 ต.ค. 2026 · อิง runtime v7.8.55  
**ฉบับร่าง ยังไม่ใช่หลักฐานว่าเผยแพร่แล้ว** งาน Play Store พักไว้ตามแผนเดิม ก่อนใช้ต้องทบทวน build, cloud, privacy, monetization และข้อกำหนดใน Play Console ปัจจุบัน

## ข้อมูลแอป

- App name: Mochi Mayhem
- Package / App ID: `com.oheart.mochimayhem` (17 Nov 2026: `com.mochimayhem.game` was already taken on Google Play)
- Category ที่เสนอ: Games → Action หรือ Arcade
- Privacy Policy URL: https://hardza1230.github.io/Survival-like-Mobile-Game/privacy.html
- Contact email: heartloveu1825@gmail.com
- Content rating / Target audience: กรอกตามเนื้อหาจริงและผลแบบสอบถาม ไม่ถือว่าคาดเดาจากภาพการ์ตูนได้

## ✅ ฉบับใช้จริง (17 พ.ย. 2026 · v8.1.167) — คัดลอกไปวางใน Play Console → Main store listing

**App name (≤30):**
```text
Mochi Mayhem
```

**Short description (≤80):**
```text
Cute mochi survivor roguelike: auto-attack, build your hero, beat giant bosses!
```

**Full description (≤4000):**
```text
The world of Mochitopia is losing its flavor — and only a team of brave mochi heroes can bring it back!

Mochi Mayhem is a cute survivor-style roguelike. Move with one thumb while your hero attacks automatically. Collect sugar crystals, level up, and pick from three upgrade cards to build a different hero every run.

★ BUILD YOUR HERO
• Six mochi heroes, each with their own build paths: snipe with Strawberry, freeze with Mint, punch with Cocoa, call lightning with Taro, lead a citrus crew with Yuzu, or weave rune spells with Sesame
• Mix basic attacks, modifiers, relics and evolutions into your own combo
• Unique skills that charge up for big moments

★ SURVIVE THE SWARM
• Three story chapters and 15 hand-made stages
• Waves of monsters, elites and minibosses
• Missions in every stage: escort the Wisp, capture the zone, find the lost Wisps in the dark, shake the hollow trees and many more
• Giant bosses with their own attacks and story scenes

★ GROW STRONGER
• Gear with random mods, merging and forging
• Talents for every build and lasting upgrades in the Temple
• Daily login gifts, daily goals and achievements

★ ENDLESS CHALLENGE
• Mochi Delve: go deeper for harder rooms and better rewards
• Pinnacle bosses for the bravest builds
• The harder it gets, the better the loot

★ PLAY YOUR WAY
• Short runs, perfect for a quick break
• Play as a guest or sign in with Google to keep your save in the cloud
• Free to play · optional rewarded ads only

Dash, dodge and power up — can you save the flavor of Mochitopia?
```

**ภาพ (store/):**
| ช่องใน Play Console | ไฟล์ |
|---|---|
| App icon 512×512 | `store/appicon_512.png` |
| Feature graphic 1024×500 | `store/feature_graphic_1024x500.png` |
| Phone screenshots (2–8 · 9:16 · 1080×1920) | `store/screenshots_v8_1/01_lobby.png` … `06_heroes.png` (ถ่ายจาก v8.1.167 · 17 พ.ย.) |

ภาพหน้าจอชุดเก่า `store/screenshots/` (1 พ.ย.) เลิกใช้

---

## (เก่า) English short description draft

```text
Cute mochi survival action: build your hero, dodge swarms, and defeat bosses.
```

## (เก่า) English full description draft

```text
Mochi Mayhem: FLAVORBOUND brings candy-colored survival action to a world losing its flavor.

Move, dash, and dodge while your hero attacks automatically. Gather experience, choose upgrades, and shape your build as you face swarms, minibosses, and multi-phase bosses.

BUILD YOUR FLAVOR
Choose from six heroes: Strawberry, Mint, Cocoa, Taro, Yuzu, and Sesame. Each offers three build paths with signature attacks, talents, and Unique skills.

EXPLORE MOCHITOPIA
Fight through three story chapters and fifteen stages, then challenge Mochi Delve, Boss Rush, and Midnight Kitchen Endless.

GROW BETWEEN RUNS
Improve your gear, craft mods at the Affix Forge, weave lasting upgrades in the Temple, and combine WHEN, DO, and TWIST parts in the Kitchen Recipe system.

PLAY YOUR WAY
Try different heroes, upgrades, and difficulty settings to find a build that fits your style. Designed for portrait mobile play with on-screen movement, Dash, and Unique controls.
```

ร่างนี้ไม่รับรอง Cloud Save, telemetry, IAP, ราคา หรือสถานะโฆษณาก่อนตรวจ production configuration จริง และไม่โฆษณาว่า Forge ใช้ได้ครบ 150 effects (ปัจจุบัน 78 active / 72 planned)

## Graphic assets ที่มีใน repo

| Asset | ไฟล์ | สถานะ |
|---|---|---|
| App icon | `store/appicon_512.png` | มีไฟล์แล้ว; ทบทวนแบรนด์/ขนาดก่อนส่ง |
| Feature graphic | `store/feature_graphic_1024x500.png` | มีไฟล์แล้ว; ตรวจความตรงกับเกมปัจจุบัน |
| Phone screenshots | `store/screenshots/1_menu.png`, `2_gameplay.png`, `3_gameplay2.png`, `4_levelup.png` | มี 4 รูป; ต้องตรวจว่าเป็น UI/build ปัจจุบัน หรือแคปใหม่ |

การมีไฟล์ไม่ได้หมายถึงผ่าน visual review หรืออัป Play Console แล้ว ใช้ภาพจากเกมจริง ตรวจ HUD/ข้อความ/ขอบจอ และตรวจสเปกรับภาพปัจจุบันใน Console

## Checklist ก่อนกลับมาทำ release

- [ ] ยืนยัน signed AAB ผ่าน workflow และทดสอบ build นั้นจริง ดู [RELEASE_SIGNING.md](RELEASE_SIGNING.md)
- [ ] ทดสอบ Story/Endgame, touch, FPS และ save บน target devices
- [ ] ตรวจ Google linking / Cloud Save และ account deletion ตาม production flow จริง
- [ ] ตรวจว่า Share Play Stats เปิดหรือปิด, backend run_stats พร้อมหรือไม่ และข้อมูลใดถูกส่งจริง
- [ ] ทบทวน privacy.html ให้ตรงกับข้อมูล/SDK/บริการจริง แล้วใช้ข้อมูลเดียวกันกรอก Data safety
- [ ] ยืนยัน AdMob/IAP/ราคา/โฆษณาตามสิ่งที่จะเปิดจริง ไม่ใช้ข้อความ “ไม่มีโฆษณา” จากร่างเก่าอัตโนมัติ
- [ ] กรอก content rating, target audience, contact และแบบฟอร์มที่ Console แสดง
- [ ] ตรวจภาพทั้งชุดและข้อความ EN/TH ที่ต้องการใช้
- [ ] ตรวจเงื่อนไข testing และ release ของบัญชีใน Play Console ปัจจุบัน

ไม่มีการอัปสโตร์ ตั้ง secrets หรือแก้ production services ในงานปรับเอกสารครั้งนี้
