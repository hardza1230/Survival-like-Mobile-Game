# A01 — เสียงหน้าเมนูใหม่ (Merge · Forge Points · Login · Daily · Awards · Codex · Depths · Rank · Power) · ใบสั่งเสียง

สถานะ: 🟡 รอเสียง · เขียน 25 ต.ค. 2026 · ส่งที่ `assets/incoming/audio_menu_progress/`
กติการ่วมดู `A00_README.md` · ทั้งหมดเป็น SFX mono

## ตอนนี้เป็นยังไง (ตรวจจากโค้ด v8.0.33)
- Merge และ Forge Points ใช้เสียงวงล้อ Forge เก่า (`Sfx.craft('jackpot'/'rare'/'reroll')`) — ระบบสุ่มถูกตัดไปแล้ว เสียงจึงไม่ตรงความหมาย
- ล็อกอินรายวัน/รับรางวัล Awards ใช้เสียง progress ทั่วไป · Claim all เล่นเสียงเดียวกับรับทีละอัน
- Depths ตะเกียงยืมเสียง "เจอของ" · เก็บ Miners · เลือกรางวัลยศ · Power ตัวเลขวิ่ง · ดาวท้ายด่าน · Bestiary ขึ้นขั้น · Recipe Book ครบสูตร → **เงียบ** หรือยืมเสียงอื่น

## รายการเสียง
| key | ความยาว | เสียง | เล่นตอน |
|---|---|---|---|
| **Merge** ||||
| `sfx_merge_select` | 60–90 ms | ป๊อกเบา ๆ เหมือนวางลูกกวาดลงถาด | แตะเลือก/ยกเลิกวัตถุดิบ |
| `sfx_merge_fuse` | 700–900 ms | ของ 2 ชิ้นวิ่งเข้าหากัน (วูบไล่เสียงขึ้น) → ชนกันดัง "ปุ๊ง" นุ่ม + ประกายระยิบ | กด Merge (ช่วงวัตถุดิบพุ่งเข้าหาของหลัก) |
| `sfx_merge_rarity_rare` | 500 ms | ระฆังแก้วสองโน้ตสว่าง | ผลเป็น Rare |
| `sfx_merge_rarity_epic` | 700 ms | คอร์ดคริสตัลม่วง 3 โน้ต + ประกายวน | ผลเป็น Epic |
| `sfx_merge_rarity_legend` | 1.1 s | แตรเล็กสั้นอบอุ่น + ระฆังทอง + ประกายยาว (ใหญ่สุดของชุด แต่ไม่เกิน 1.2 s) | ผลเป็น Legend |
| `sfx_merge_keep_mod` | 200 ms | ติ๊ง "ใส่ช่อง" แบบล็อกเข้า | ตอน mod ที่เลือกเก็บไปลงช่องใหม่ |
| **Forge Points** ||||
| `sfx_forge_pick` | 50–80 ms | แตะกระดาษสูตรเบา ๆ | เลือก mod ในรายการ |
| `sfx_forge_add` | 300–400 ms | ค้อนขนมตี "ก๊อง" นุ่ม + ประกาย | Add mod สำเร็จ |
| `sfx_forge_swap` | 350 ms | ปัดออก–ใส่ใหม่ (วูบสั้นสองจังหวะ) | Swap สำเร็จ |
| `sfx_forge_star_up` | 450 ms | ดาวขึ้นเสียงสูงไล่ 3 โน้ต | Star up สำเร็จ |
| `sfx_forge_remove` | 250 ms | ช้อนตักออก + ฟองแตกเบา | Remove |
| `sfx_forge_lucky` | 600 ms | กระดิ่งโชคดี + เสียงใบโคลเวอร์ "ปิ๊ง" สดใส (ต้องแยกออกจาก add ชัด) | 🍀 Lucky (ไม่เสียแต้ม) |
| `sfx_forge_no_points` | 200 ms | "ตึ่ง" ต่ำ ทื่อ ๆ ไม่น่ากลัว | แต้มตีไม่พอ (แยกจาก error ทั่วไป) |
| **Login 7 วัน** ||||
| `sfx_login_open` | 400 ms | กระดาษปฏิทินคลี่ + กระดิ่งเล็ก | ป๊อปอัปเปิด |
| `sfx_login_claim` | 500 ms | ตราประทับ "ปึ้ก" นุ่ม + ประกาย | รับรางวัลวันนี้ (วัน 1–3, 5–6) |
| `sfx_login_day7` | 900 ms | ตราประทับ + แฟนแฟร์สั้นฉลองสัปดาห์ | รับวันที่ 7 (ก่อนหีบทองเปิด) |
| **Daily Quests** ||||
| `sfx_dq_done` | 250 ms | ติ๊กถูกเบา ๆ เหมือนขีดรายการ | เควสต์ครบ (ตอนเห็นในหน้า Daily) |
| `sfx_dq_box` | 3 ไฟล์ `_s/_m/_l` 400/550/700 ms | กล่องเปิดเล็ก/กลาง/ใหญ่ (ใหญ่ขึ้นตามขนาด) | เปิดกล่อง 3/6/8 |
| `sfx_dq_reroll` | 300 ms | ลูกเต๋าขนมกลิ้งสั้น | สุ่มเควสต์ใหม่ |
| `sfx_dq_week` | 450 ms | เหรียญทองตกลงช่อง | ได้ 1 วันในแถบสัปดาห์ |
| **Awards** ||||
| `sfx_aw_star` | 350 ms | ดาวทองเด้ง "ติ้ง" (pitch โค้ดไล่ตาม ★1–★5 ได้) | รับดาว 1 ขั้น |
| `sfx_aw_title` | 800 ms | ริบบิ้นคลี่ + แฟนแฟร์สั้น | ได้ฉายา (ดาวสุดท้าย) |
| `sfx_aw_claim_all` | 900 ms | ติ้ง ๆ ๆ ไล่เร็ว 5–6 เม็ดแล้วจบด้วยคอร์ด | Claim all (เล่นครั้งเดียว แทนการเล่นหลายรอบ) |
| `sfx_aw_secret` | 1.0 s | กล่องลึกลับสั่น → เปิดดัง "ป๊อป" + ประกายม่วงลึกลับ | ปลดรางวัลลับ |
| **Codex** ||||
| `sfx_best_tier` | 500 ms | หน้าสมุดภาพสัตว์พลิก + ติ๊ง | มอนสเตอร์ขึ้นขั้น (2/3) |
| `sfx_best_new` | 350 ms | "ฟุ่บ" ค้นพบ + กระดิ่งเล็ก | เจอมอนสเตอร์ใหม่ (แถวหน้าสรุปด่าน) |
| `sfx_recipe_complete` | 800 ms | ตราขี้ผึ้งประทับ + คอร์ดอบอุ่น | ครบสูตรของ Build |
| **Depths / Rank / Power** ||||
| `sfx_dig_lantern` | 600 ms | จุดตะเกียง "ฟึ่บ" + แสงฮัมเบา ๆ | ใช้ 🔦 Light |
| `sfx_miners_collect` | 450 ms | ถุงไหมตกลง + กรุ๊งกริ๊ง | เก็บ Thread จาก Miners (Lobby) |
| `sfx_rank_pick` | 450 ms | ตรา/เหรียญยศกดเข้าช่อง | เลือกรางวัลยศ |
| `sfx_power_tick` | 30–50 ms | ติ๊กเบามาก (ใช้ซ้ำได้ 8–10 ครั้ง) | ตัวเลข Power วิ่งขึ้น (โค้ดจำกัดจำนวนครั้ง) |
| `sfx_power_up` | 500 ms | "วู้บ" สั้นขึ้นสูง + ประกาย | ตอนป้าย +N ⚡ เด้ง |
| **ทั่วไป** ||||
| `sfx_stage_star` | 3 ไฟล์ `_1/_2/_3` ~250 ms | ดาวลงทีละดวง โน้ตสูงขึ้นทีละขั้น (ดวง 3 มีประกายเพิ่ม) | ดาวท้ายด่าน |
| `sfx_feature_unlock` | 900 ms | ม่านเปิด + "ว้าว" ประกาย (ไม่มีเสียงคน) | การ์ด NEW ปลดฟีเจอร์ |
| `sfx_feature_fly` | 500 ms | วูบลอยไปตามทาง + ติ๊งตอนถึง | ไอคอนฟีเจอร์บินไปที่ปุ่ม |

**รวม 32 key (36 ไฟล์ เพราะ `sfx_dq_box` ×3 และ `sfx_stage_star` ×3)**

## ข้อห้าม
- ห้ามแฟนแฟร์ยาวเกิน 1.2 s (เล่นบ่อย) · ห้ามเสียงเหมือนเครื่องสล็อต/คาสิโน (ระบบสุ่มเลิกแล้ว)
- เสียงชุด Merge Rare/Epic/Legend ต้องฟังแล้วรู้ระดับทันที (ใหญ่ขึ้นตามลำดับ)

## โน้ตฝั่งโค้ด
- เพิ่ม key ใน `ASSET_AUDIO` + เมธอดใน `Sfx` (เช่น `Sfx.menuCue(k)`) ใช้ตัวเล่นเสียงเมนูเดิม (จำกัด 2 เสียงซ้อน, ไม่ลดเสียงเพลง)
- จุดผูก: `buildMerge`/`mergeNow` · `forgeAct` (ตาม kind + lucky + แต้มไม่พอ) · `loginPopup` · `buildDaily` กล่อง/reroll · `awClaim` / `awClaimAll` / รางวัลลับ · `bestiaryKey` ขึ้นขั้น / แถวหน้าสรุป · `recipeNote` ครบ · `digLightAt` · `minersCollect` · `setRankPick` · `buildGearPower` นับเลข · `evalStageStars` / หน้าสรุป · `featRevealNext`
- เล่นเฉพาะตอนทำสำเร็จจริง (ไม่ใช่ตอนวาดหน้าใหม่) · เสียงเดิมเป็น fallback

## ส่งมอบ
(ฝั่งเสียงกรอกตอนส่ง)

## Delivery v8.0.39 — 2026-10-25

Delivered 39 original ElevenLabs Sound Effects files (actual expanded table count), technical QA and runtime integration. Kit: `assets/incoming/audio_menu_progress/`; runtime: `assets/audio/menu_progress/`. Untouched donors, actual prompts/request metadata, MANIFEST and QA_REPORT retained. Owner phone listening/artistic review pending.

Actual table expands to39 files (35 named rows +2 extra Daily box variants +2 extra stage star variants); previous summary understated the count.
