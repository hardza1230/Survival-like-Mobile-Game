# 19 — C2-4 Four-Season Conservatory · ใบสั่งงานอาร์ต

สถานะ: ร่าง 16 ต.ค. 2026 อิง runtime v7.8.29 · อ่าน `00_STYLE_GUIDE.md` ก่อน
ส่งไฟล์ที่ `assets/incoming/c24_seasons_vfx/` · PNG32 · ฝั่งโค้ดแพ็กเป็น WebP และผูกเอง
VFX = **พื้นดำสนิท #000** (โค้ดแปลง alpha จากความสว่าง เล่น NORMAL blend) · ศัตรู/ของ = alpha จริง · เฟรมเรียงซ้าย→ขวา บน→ล่าง ไม่มีเส้นคั่น ไม่มีตัวหนังสือ

## มีแล้ว (ไม่ต้องทำ)

พื้น `floor_c24` · ของตกแต่ง 8 ชิ้น (`decor_c24/`) · ศัตรูมีอนิเมชัน 7 ตัว (`ch2_seasons/`: budling, sunscarab, leafblade, frostbell, stormfruit, equinox, season wisp) · มินิบอส Season Keeper · บอส Chronobloom Orchid 8 ท่า

## ยังวาดด้วยโค้ดทั้งหมด (ใบนี้)

ด่านนี้มี Season Storm (ฤดูเปลี่ยนทุก 10 วิ: ใบไม้ผลิ → ร้อน → ใบไม้ร่วง → หนาว) และท่าบอส 6 แบบ ทุกอย่างเป็นเส้น/วงกลมจากโค้ด อ่านยากบนพื้นหินเข้ม (ดูภาพเจ้าของ: เห็นแค่กลีบดอกไม้ตกแต่ง ไม่รู้ว่าฤดูไหนอันตรายอะไร)

ชุดสี: ใบไม้ผลิ ชมพู `#ff9fcf` · ร้อน ส้มทอง `#ffb12b` · ใบไม้ร่วง ส้มแดง `#ff7040` · หนาว ฟ้า `#8fdcff` · นาฬิกา/Time Break ทอง `#ffd166`

### A — Season Storm (บททดสอบฤดู)

| # | key / ไฟล์ | ชนิด | grid · เฟรม | ขนาดเฟรม | บนจอ | รายละเอียด |
|---|---|---|---|---|---|---|
| A1 | `vfx_c24_season_shift_spring.png` · `_summer` · `_autumn` · `_winter` (4 ไฟล์) | VFX ดำ | ไฟล์ละ 4×2 = 8 · ครั้งเดียว | 512 | เต็มจอ (ขอบจอ) | ตอนเปลี่ยนฤดู: กรอบขอบจอบาง ๆ ของฤดูใหม่ไหลเข้ามา (กลีบซากุระ / แสงแดด / ใบไม้ / เกล็ดหิมะ) **กลางจอโปร่งทั้งหมด** ไม่บังสนาม |
| A2 | `vfx_c24_spring_heal.png` | VFX ดำ | 4×1 = 4 · ครั้งเดียว | 128 | ~60px บนศัตรู | ศัตรูถูกฟื้นเลือดตอนใบไม้ผลิ: กลีบชมพู + ใบเขียวหมุนขึ้นรอบตัว (ให้ผู้เล่นรู้ว่าต้องรีบฆ่า) |
| A3 | `c24_bloom_sprout_sheet.png` | ศัตรู alpha | 4×2 = 8 (เดิน 6 + โดนตี 1 + ตาย 1) | 256 | ~44px | **ศัตรูใหม่ Bloom Sprout** (เกิดตอนบททดสอบใบไม้ผลิ ต้องฆ่า 10 ตัว): ต้นอ่อนโมจิชมพูมีดอกตูมบนหัว ตัวเล็กวิ่งเร็ว หน้าบึ้งน่ารัก · สไตล์เดียวกับ c24_budling แต่สีชมพูสดกว่า แยกออกจากฝูงได้ |
| A4 | `vfx_c24_summer_burn.png` | VFX ดำ | 4×1 = 4 · loop | 256 | 80–140px ใต้ตัวผู้เล่น | วงแดดเผาใต้เท้าตอนยืนนิ่งในฤดูร้อน (มองจากบน วงรีแบน) ขอบส้มทองค่อย ๆ หด · โค้ดคุมความสว่างตามเวลานิ่ง |
| A5 | `vfx_c24_summer_ignite.png` | VFX ดำ | 3×2 = 6 · ครั้งเดียว | 256 | ~140px | วงแดดระเบิดใส่ผู้เล่น (ยืนนิ่งเกิน 1.4 วิ): เปลวแดดพุ่งขึ้นเป็นวง |
| A6 | `vfx_c24_autumn_lane.png` | VFX ดำ | 1×4 = 4 · loop | 1024 (กว้าง) × 96 (สูง) | ยืดยาวข้ามจอ | **เส้นเตือนลมใบไม้ร่วง** แนวนอน: แถบใบไม้ส้มปลิวโปร่ง ๆ บอกแนวที่จะโดนฟัน · ยืดได้ไม่แตก ต่อปลายได้ |
| A7 | `vfx_c24_autumn_slash.png` | VFX ดำ | 1×4 = 4 · ครั้งเดียว | 1024 × 128 | ยืดยาวข้ามจอ | ตอนลมฟันจริง: ใบไม้คมพุ่งเป็นแนวเส้นสว่างแรง ส้ม-ทอง |
| A8 | `vfx_c24_winter_patch.png` | VFX ดำ | 4×1 = 4 · loop | 256 | 128px (วงรัศมี 64) | แผ่นน้ำแข็งเตือนบนพื้น (วงรีแบน มองจากบน) ลายเกล็ดหิมะ ขอบฟ้าหดเข้าเหมือนนับถอยหลัง |
| A9 | `vfx_c24_winter_freeze.png` | VFX ดำ | 3×2 = 6 · ครั้งเดียว | 256 | ~140px | แผ่นน้ำแข็งแตกเป็นหนามน้ำแข็งพุ่งขึ้น |
| A10 | `ui_c24_season_icons.png` | UI alpha | 4×2 = 8 | 64 | 22px บน HUD | ไอคอนฤดู 4 อัน (แถวบน = ยังไม่ผ่าน สีจาง · แถวล่าง = ผ่านแล้ว สว่างมีขอบทอง) แทนอีโมจิ 🌸☀️🍂❄️ ใน HUD |
| A11 | `vfx_c24_trial_pass.png` | VFX ดำ | 3×2 = 6 · ครั้งเดียว | 256 | ~180px รอบตัว | ผ่านบททดสอบฤดู: ดอกไม้/แสงฤดูนั้นบานรอบตัวแล้วจาง · โค้ดย้อมสีตามฤดู (วาดโทนขาวทอง) |

### B — บอส Chronobloom Orchid

| # | key / ไฟล์ | ชนิด | grid · เฟรม | ขนาดเฟรม | บนจอ | รายละเอียด |
|---|---|---|---|---|---|---|
| B1 | `vfx_c24_vine_fan.png` | VFX ดำ | 1×4 = 4 · loop | 512 × 256 (พัด 60° ชี้ขวา origin ซ้ายกลาง) | ~500px | **Vine Cleave** เตือน: พัดเถาวัลย์เขียวโปร่ง ชี้ขวา |
| B2 | `vfx_c24_vine_slash.png` | VFX ดำ | 4×1 = 4 · ครั้งเดียว | 512 × 256 | ~500px | Vine Cleave ฟันจริง: เถาวัลย์หนามกวาดทั้งพัด |
| B3 | `vfx_c24_solar_ring.png` | VFX ดำ | 4×1 = 4 · ครั้งเดียว | 256 | 120–200px | **Solar Bloom**: วงดอกทานตะวันแดดเตือนบนพื้น แล้วสว่างวาบ (เฟรม 0–2 เตือน, 3 ระเบิด) |
| B4 | `proj_c24_frost_shard.png` | กระสุน alpha | 4×1 = 4 · loop | 64 | ~28px | **Frost Crown**: กระสุนเกล็ดน้ำแข็งหัวแหลม หันขวา |
| B5 | `proj_c24_autumn_leaf.png` | กระสุน alpha | 4×1 = 4 · loop | 64 | ~26px | **Autumn Spiral**: ใบเมเปิลหมุนเป็นกระสุน |
| B6 | `vfx_c24_time_break.png` | VFX ดำ | 4×2 = 8 · ครั้งเดียว | 512 | ~700px | **TIME BREAK**: หน้าปัดนาฬิกาทองใหญ่บนพื้น เข็มหมุนย้อน แล้วแตกเป็นคลื่นกระแทก 2 ระลอก |
| B7 | `vfx_c24_season_seal.png` | VFX ดำ | 2×2 = 4 · loop | 256 | ~240px | หลัง Time Break: 3 ฤดูถูกผนึก (กำแพงแสงฤดู) เหลือช่องปลอดภัย 1 ฤดู · ทำเป็นเสี้ยววงแหวน 90° โทนขาว โค้ดย้อมสีและหมุนวาง |
| B8 | `vfx_c24_metamorph.png` | VFX ดำ | 4×2 = 8 · ครั้งเดียว | 512 | ~420px | บอสเปลี่ยนเฟส: กลีบดอกกล้วยไม้คลี่บาน + ฟันเฟืองนาฬิกาหมุนรอบ |

## Prompt

หัวร่วม (ต่อท้ายทุกชิ้น):
> cute pastel confectionery fantasy game VFX for Mochi Mayhem mobile game, Four-Season Conservatory inside a shattered glass greenhouse, seen from 3/4 top-down, readable silhouette at small size, centered, no text, no watermark, no UI frame

| ชิ้น | prompt เฉพาะ |
|---|---|
| A1 | VFX sprite sheet 8 frames 4x2, thin decorative screen-edge frame of {cherry blossom petals / golden sun motes / falling maple leaves / snowflakes} drifting in from all four edges then settling, completely empty transparent center, on solid pure black background (make one file per season) |
| A2 | VFX sprite sheet 4 frames in one row, pink petals and small green leaves spiraling upward around a point, gentle healing magic, on solid pure black background |
| A3 | game enemy sprite sheet 8 frames 4x2, tiny angry cute pink mochi sprout monster with a closed flower bud on its head and two leaf arms, frames 1-6 running cycle facing right, frame 7 hurt, frame 8 wilting defeat, consistent size and ground line, transparent alpha background, no shadow |
| A4 | VFX sprite sheet 4 frames in one row loop, flat oval ring of scorching sunlight on the ground seen from above, orange-gold rim, faint heat shimmer inside, on solid pure black background |
| A5 | VFX sprite sheet 6 frames 3x2, ring of sunfire flames erupting upward from the ground then fading, orange and gold, on solid pure black background |
| A6 | VFX sprite sheet 4 frames stacked vertically, each 1024x96, long horizontal translucent band of drifting orange autumn leaves crossing the frame, warning lane, seamless left and right ends, on solid pure black background |
| A7 | VFX sprite sheet 4 frames stacked vertically, each 1024x128, a fast razor-sharp gust of glowing maple leaves slicing across the whole frame, bright orange-gold streak, seamless ends, on solid pure black background |
| A8 | VFX sprite sheet 4 frames in one row loop, flat oval frost patch on the ground seen from above, snowflake pattern, pale blue rim shrinking inward like a countdown, on solid pure black background |
| A9 | VFX sprite sheet 6 frames 3x2, frost patch shattering into upward ice spikes, pale blue and white, on solid pure black background |
| A10 | UI icon sheet 8 frames 4x2, each 64x64, four season emblems: cherry blossom, sun, maple leaf, snowflake; top row dim and desaturated, bottom row bright with a golden outline, transparent alpha background |
| A11 | VFX sprite sheet 6 frames 3x2, a ring of white-gold flowers blooming outward around a center and fading into sparkles, on solid pure black background |
| B1 | VFX sprite sheet 4 frames stacked vertically, each 512x256, translucent green thorny vine fan of 60 degrees pointing right from the left-middle edge, warning telegraph, on solid pure black background |
| B2 | VFX sprite sheet 4 frames in one row, each 512x256, thorny green vines sweeping across a 60-degree fan pointing right, sharp slash, on solid pure black background |
| B3 | VFX sprite sheet 4 frames in one row, sunflower-shaped solar warning ring on the ground seen from above; frames 1-3 glowing brighter, frame 4 bright flash burst, on solid pure black background |
| B4 | game projectile sprite sheet 4 frames in one row loop, small sharp ice crystal shard flying right with frosty sparkle trail, transparent alpha background |
| B5 | game projectile sprite sheet 4 frames in one row loop, spinning orange maple leaf with a soft glow, transparent alpha background |
| B6 | VFX sprite sheet 8 frames 4x2, giant golden clock face appearing flat on the ground seen from above, hands spin backwards, then it shatters into two expanding golden shockwave rings, on solid pure black background |
| B7 | VFX sprite sheet 4 frames 2x2 loop, a 90-degree arc segment of a glowing white magical barrier wall seen from above, shimmering, on solid pure black background |
| B8 | VFX sprite sheet 8 frames 4x2, giant orchid petals unfolding outward with golden clockwork gears rotating around them, magical transformation burst, on solid pure black background |

## ฝั่งโค้ดจะผูกยังไง (โน้ตสำหรับ AI ที่ทำต่อ)

- A1: `tickSeasonArena` ตอนเปลี่ยน `s.idx` เล่นแทน `screenFlash` · A2: spring regen ใน `tickSeasonArena`/`tickSeasonObjective` (คุมจำนวนต่อวินาที)
- A3: key `c24_bloom_sprout_animated` ใช้กับศัตรูที่บททดสอบใบไม้ผลิเติมเอง (v7.8.29 ตอนนี้ใช้ `basic`)
- A4–A9: แทนวงกลม/เส้นใน `tickSeasonObjective` (summer still ring, autumn `c.lines`, winter `c.patches`) · A10: `stormHudText` / HUD objective · A11: `stormEndSeason` ตอนผ่าน
- B1–B8: `chronobloomAttack` (cleave / solar / crown / spiral / time break) และ `chronobloomMetamorph`
- ทุกชิ้นต้องมี fallback เป็นภาพโค้ดเดิม · เช็ค FPS บนมือถือตอนฤดูหนาว+ฝูงเต็ม


---

## ส่งอาร์ต —16 ต.ค.2026

สร้างและเก็บครบ **22 ไฟล์ /126เฟรม** ที่ `assets/incoming/c24_seasons_vfx/`: A1 แยก4ฤดู, A2–A11 และ B1–B8 พร้อม `MANIFEST.json`, `PROMPTS.json`, `QA_REPORT.json`, `DELIVERY_README.md` · **ยังไม่ผูกเข้าเกมตามขอบเขตงานนี้**

ตรวจขนาด/กริด/PNG32/alpha/ความสมบูรณ์ของข้อมูลภาพและ hash แล้ว · กลางขอบจอทั้ง32เฟรมเป็นดำสนิท · Bloom Sprout ใช้เดิน0–5 โดนตี6 ตาย7; HUD แถวบน0–3ยังไม่ผ่าน แถวล่าง4–7ผ่านแล้ว · รอตรวจการแปลง alpha, รูปทรงเขตอันตราย, จังหวะภาพ/การยืด/รอยต่อ และมือถือ visual/FPS ตอนผูก

> ✅ ผูกในเกมแล้ว v7.8.32 (`assets/art/c24_seasons/`, สคริปต์ `scripts/pack-c24-season-art.py`) · กลไกเดิม ภาพใหม่ทั้งหมดมี fallback · เหลือเจ้าของตรวจภาพ/FPS บนมือถือ
