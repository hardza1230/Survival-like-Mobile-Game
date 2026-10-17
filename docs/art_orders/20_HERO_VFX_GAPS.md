# 20 — Hero VFX gaps (Chocolate · Strawberry · Mint · Taro) · ใบสั่งงานอาร์ต

สถานะ: ส่งต้นฉบับ 21 PNG32 / 100 เฟรมแล้ว 17 ต.ค. 2026 — รอแพ็กและผูก runtime (ดู `assets/incoming/hero_vfx_gaps/DELIVERY_README.md`) · ใบสั่งเดิม อิง runtime v7.8.44 · อ่าน `00_STYLE_GUIDE.md` ก่อน · ชุดสีตัวละครให้ตรงกับอาร์ตที่มีอยู่แล้วของแต่ละตัว (`assets/art/bp_fx/`, `assets/art/taro_*`)
ส่งไฟล์ที่ `assets/incoming/hero_vfx_gaps/` · PNG32 · ฝั่งโค้ดแพ็กเป็น WebP และผูกเอง (พร้อม `MANIFEST.json`: key, file, columns, rows, frameWidth, frameHeight, frameCount, background, loop, anchor)
VFX = **พื้นดำสนิท #000** (โค้ดแปลง alpha จากความสว่าง เล่น NORMAL blend) · เฟรมเรียงซ้าย→ขวา บน→ล่าง ไม่มีเส้นคั่น ไม่มีตัวหนังสือ · มุมกล้อง 3/4 top-down แบบเดียวกับเกม · ของที่ "อยู่บนพื้น" ให้วาดเป็นวงรีแบนมองจากบน

## ทำไมต้องทำ

สำรวจโค้ด v7.8.44 แล้ว ท่าที่ผู้เล่นเห็นบ่อยที่สุดหลายท่ายังเป็นวงกลม/จุด/เส้นจากโค้ด หรือใช้ภาพกลางที่ใช้ร่วมกันทั้งเกม (`vfx_ring`, `vfx_glow`, `burst()` จุดกระจาย, `vfxHitRing`) — เจ้าของเห็นชัดสุดที่ **Titan ทุบพื้นปกติ = วงกลมเฉย ๆ**
ของที่มีแล้วและ **ไม่ต้องทำ**: Fire Fist ทั้งชุด, Dash Boxer หมัด/เส้นต่อหมัด, Strawberry Shotgun/Ricochet/Sniper hit, Berry Blast, Mint lance/shatter/Impaler/Barrage/Glacier Bloom/Gale, Taro Arc/Spark/Sentry/Plasma/Storm Mark/Shock (Storm Mark icon อยู่ใบ 18 ชุด J)

ลำดับความสำคัญ: ⭐⭐⭐ = เห็นทุกไม่กี่วินาที · ⭐⭐ = ทุกครั้งที่ใช้ท่า · ⭐ = เสริม

## C — Chocolate (cocoa) · ชุดสีช็อกโกแลต `#5a3420` / คาราเมล `#ffcf80` / ครีม `#fff3dc`

| # | key / ไฟล์ | ⭐ | grid · เฟรม | ขนาดเฟรม | บนจอ | รายละเอียด / ใช้แทนอะไร |
|---|---|---|---|---|---|---|
| C1 | `vfx_cocoa_titan_slam.png` | ⭐⭐⭐ | 3×2 = 6 · ครั้งเดียว | 256 | 180–260px (โค้ดยืดตามรัศมีทุบ) | **Titan ทุบพื้นปกติ**: หมัดหมีกระแทกพื้น → วงคลื่นกระแทกช็อกโกแลตแผ่ออก + พื้นแตกเป็นแฉก + เศษช็อกโกแลต/ฝุ่นกระเด็น แล้วจาง · ใช้ซ้ำกับ Colossus ที่ Rage 0 และ Bear Grit Slam (ก่อนเลือก Build) · แทน `cocoaMark` วงกลม + โดนัทตก |
| C2 | `vfx_cocoa_slam_mark.png` | ⭐⭐⭐ | 1×4 = 4 · loop | 256 | = รัศมีทุบ | **วงเตือนตอนง้างทุบ** บนพื้น: วงรอยนิ้วหมี/ลายช็อกโกแลตละลายเรืองคาราเมล หดเข้าหาจุดกลางเหมือนนับถอยหลัง · แทน `strokeCircle` 2 วง |
| C3 | `vfx_cocoa_rage_preview.png` | ⭐⭐ | 2×2 = 4 · loop | 256 | 240–420px | **Rage ชาร์จ**: วงพลังบนพื้นแสดงขอบเขตทุบ เข้มขึ้นตามระดับ Rage (โค้ดคุม alpha/สี) ลายคลื่นความร้อนช็อกโกแลต ขอบแตก ๆ · แทนวง preview + วงใน |
| C4 | `vfx_cocoa_rage_target.png` | ⭐⭐ | 4×1 = 4 · loop | 128 | ~56px เหนือศัตรู | ป้ายเล็งบนหัวศัตรูที่อยู่ในระยะทุบ: กำปั้นหมีเล็ก ๆ สีคาราเมลกะพริบ · แทนวงกลมรอบมอนทุกตัว |
| C5 | `vfx_cocoa_crater.png` | ⭐⭐ | 4×1 = 4 · ครั้งเดียว | 256 | 200–320px | หลุมทุบ Colossus (Rage 1+): หลุมช็อกโกแลตยุบบนพื้น ขอบมีรอยร้าว แล้วค่อย ๆ จาง · แทนหลุมวงกลม + เส้นร้าวจากโค้ด |
| C6 | `vfx_cocoa_dash_buff.png` | ⭐⭐⭐ | 3×2 = 6 · ครั้งเดียว | 128 | ~110px รอบตัว | **บัพตอน Dash ทุกครั้ง**: ประกายคาราเมล + รอยเท้าหมีวาบรอบตัวแล้วจาง · แทน `vfxHitRing` + จุดกระจาย |
| C7 | `vfx_cocoa_dash_trail.png` | ⭐⭐ | 1×4 = 4 · loop | 256 × 64 (anchor ซ้ายกลาง) | ยืดตามระยะพุ่ง | **ทางพุ่ง Dash Boxer**: ริ้วช็อกโกแลตละลาย + ประกายครีม ต่อปลายได้ · แทนการใช้ภาพตัวละครโปร่ง ๆ เป็นทาง |
| C8 | `vfx_cocoa_landing_dust.png` | ⭐⭐ | 3×2 = 6 · ครั้งเดียว | 256 | ~160px | ลงพื้นหลัง Dash Boxer/Phantom Rush: ฝุ่นโกโก้พุ่งเป็นวง + รอยร้าวสั้น ๆ · แทนเส้นร้าว + จุดฝุ่น 8 จุด |

## S — Strawberry (momo) · ชมพู `#ff7aa8` / แดงสตรอว์เบอร์รี่ `#ff3d5e` / เขียวใบ `#7ed957`

| # | key / ไฟล์ | ⭐ | grid · เฟรม | ขนาดเฟรม | บนจอ | รายละเอียด / ใช้แทนอะไร |
|---|---|---|---|---|---|---|
| S1 | `vfx_momo_seed_pop.png` | ⭐⭐⭐ | 4×1 = 4 · ครั้งเดียว | 128 | 40–60px | **เมล็ดโดนศัตรู**: น้ำสตรอว์เบอร์รี่กระเซ็นเล็ก ๆ + เมล็ดสีทอง 3–4 เม็ด · ใช้ตอนยิงโดนก่อนเลือก Build (ตอนนี้ไม่มีภาพเลย) และ seed-pop · แทน `burst`/`vfxHitRing` |
| S2 | `vfx_momo_aim_line.png` | ⭐⭐ | 1×4 = 4 · loop | 512 × 32 (anchor ซ้ายกลาง) | ยืดตามระยะเล็ง | เส้นเล็ง Sniper / Perfect Shot: ลำแสงชมพูบาง ๆ มีจุดเมล็ดไหลไปตามเส้น ต่อปลายได้ |
| S3 | `vfx_momo_aim_cone.png` | ⭐⭐ | 1×4 = 4 · loop | 512 × 256 (พัด 60° ชี้ขวา origin ซ้ายกลาง) | ~420px | กรวยเล็ง Berry Blast: พัดโปร่งชมพูมีกลีบดอก/เมล็ดลอยในกรวย |
| S4 | `vfx_momo_dash.png` | ⭐⭐ | 3×2 = 6 · ครั้งเดียว | 128 | ~100px | Dash ของสตรอว์เบอร์รี่ (ตอนนี้ไม่มีเอฟเฟกต์): กลีบชมพู + ใบเขียวพุ่งกระจายด้านหลังแล้วจาง |

## M — Mint · มินต์ `#8ff0d6` / ฟ้าน้ำแข็ง `#9ad8ff` / ขาว

| # | key / ไฟล์ | ⭐ | grid · เฟรม | ขนาดเฟรม | บนจอ | รายละเอียด / ใช้แทนอะไร |
|---|---|---|---|---|---|---|
| M1 | `vfx_mint_chill_hit.png` | ⭐⭐⭐ | 4×1 = 4 · ครั้งเดียว | 128 | ~56px | **โดนทำให้ช้า (Chill)**: เกล็ดน้ำแข็งเล็ก ๆ ล้อมตัวศัตรู + ไอเย็น · เกิดถี่มาก → ภาพเบา โปร่ง · แทน `vfxHitRing`/`burst` |
| M2 | `vfx_mint_freeze.png` | ⭐⭐⭐ | 3×2 = 6 | 128 | ~70px บนศัตรู | **แช่แข็ง**: เฟรม 0–3 ก้อนน้ำแข็งก่อตัวครอบ, เฟรม 4 ค้าง (โค้ดหยุดเฟรมนี้ระหว่างแช่), เฟรม 5 แตก · แทนตัวหนังสือ "FROZEN" + จุด |
| M3 | `vfx_mint_needle_hit.png` | ⭐⭐ | 4×1 = 4 · ครั้งเดียว | 64 | ~30px | เข็มน้ำแข็งโดนเป้า: เศษน้ำแข็งแหลมแตกกระจาย |
| M4 | `vfx_mint_lance_charge.png` | ⭐⭐ | 2×2 = 4 · loop | 128 | ~70px ที่มือ | ชาร์จหอก: เกล็ดน้ำแข็งหมุนเข้าหาจุดกลาง เรืองฟ้า · แทน `vfx_glow` |
| M5 | `vfx_mint_aim_line.png` | ⭐ | 1×4 = 4 · loop | 512 × 32 (anchor ซ้ายกลาง) | ยืดตามระยะ | เส้นเล็ง Frost Lance: เส้นน้ำแข็งบางมีเกล็ดไหล ต่อปลายได้ |
| M6 | `vfx_mint_bloom_preview.png` | ⭐ | 2×2 = 4 · loop | 256 | = รัศมี Bloom | วงชาร์จ Glacier Bloom บนพื้น: ลายผลึกน้ำแข็งรูปดอกไม้ ขยายตามแรงชาร์จ (โค้ดคุมขนาด) |

## T — Taro · ม่วง `#b388ff` / ฟ้าสายฟ้า `#9ad8ff` / ขาว

| # | key / ไฟล์ | ⭐ | grid · เฟรม | ขนาดเฟรม | บนจอ | รายละเอียด / ใช้แทนอะไร |
|---|---|---|---|---|---|---|
| T1 | `vfx_taro_rift_step.png` | ⭐⭐⭐ | 3×2 = 6 · ครั้งเดียว | 128 | ~110px | **Dash (Rift Step)**: รอยแยกมิติสีม่วงเปิด-ปิด + ประกายสายฟ้าเล็ก ๆ (เล่นที่จุดเริ่มและจุดจบ) · แทนจุดกระจาย |
| T2 | `vfx_taro_shrapnel.png` | ⭐⭐ | 4×1 = 4 · ครั้งเดียว | 128 | ~80px | สายฟ้าแตกเป็นสะเก็ดตอนมอนตายในสาย Arc: ประกายสายฟ้า 3 แฉกพุ่งออกจากจุด · แทน `taroRing` เส้นจากโค้ด |

## U — Shared

| # | key / ไฟล์ | ⭐ | grid · เฟรม | ขนาดเฟรม | บนจอ | รายละเอียด / ใช้แทนอะไร |
|---|---|---|---|---|---|---|
| U1 | `vfx_unique_crescendo.png` | ⭐⭐ | 4×2 = 8 · ครั้งเดียว | 384 | ~300px รอบตัว | **ตอนกด Unique** (Strawberry / Mint / Taro): วงแสงพลังขาว-ทองระเบิดออกจากตัว มีประกายดาวและริบบิ้นแสง · **วาดโทนขาว-ทอง** โค้ดย้อมสีตามตัวละคร · แทน `vfx_ring` + `add.circle` + แฟลชจอ |

รวม **21 ไฟล์**

## Prompt

หัวร่วม (ต่อท้ายทุกชิ้น):
> cute pastel confectionery fantasy game VFX for Mochi Mayhem mobile game, seen from 3/4 top-down, readable silhouette at small size on mobile, centered, no text, no watermark, no UI frame, on solid pure black background

| ชิ้น | prompt เฉพาะ |
|---|---|
| C1 | VFX sprite sheet 6 frames 3x2, a giant cute bear paw punches the ground: chocolate shockwave ring bursts outward as a flat oval seen from above, the ground cracks in a star pattern, chocolate chunks and cocoa dust fly, then everything fades, caramel highlights |
| C2 | VFX sprite sheet 4 frames stacked vertically loop, flat oval warning ring on the ground seen from above made of melted chocolate with bear-paw pattern, glowing caramel rim shrinking inward like a countdown |
| C3 | VFX sprite sheet 4 frames 2x2 loop, wide flat oval aura on the ground seen from above showing a slam area, swirling hot chocolate heat waves with a cracked glowing caramel edge |
| C4 | VFX sprite sheet 4 frames in one row loop, tiny glowing caramel bear-fist target icon blinking, simple bold shape |
| C5 | VFX sprite sheet 4 frames in one row, a chocolate crater sinking into the ground seen from above with cracked rim, slowly fading |
| C6 | VFX sprite sheet 6 frames 3x2, caramel sparkles and small glowing bear paw prints flash in a ring around a center then fade |
| C7 | VFX sprite sheet 4 frames stacked vertically, each 256x64, horizontal streak of melted chocolate with cream sparkles flowing to the right, seamless left and right ends |
| C8 | VFX sprite sheet 6 frames 3x2, cocoa dust bursting outward in a flat oval ring on the ground with short cracks, fading |
| S1 | VFX sprite sheet 4 frames in one row, small strawberry juice splash with three or four golden seeds popping outward |
| S2 | VFX sprite sheet 4 frames stacked vertically loop, each 512x32, thin glowing pink aim beam with tiny seeds flowing along it to the right, seamless ends |
| S3 | VFX sprite sheet 4 frames stacked vertically loop, each 512x256, translucent pink 60-degree cone pointing right from the left-middle edge with floating petals and seeds |
| S4 | VFX sprite sheet 6 frames 3x2, pink petals and small green leaves bursting backward in a puff and fading |
| M1 | VFX sprite sheet 4 frames in one row, light translucent ring of tiny snowflakes and cold mist around a point, subtle |
| M2 | VFX sprite sheet 6 frames 3x2, ice crystal block forming around a small creature-sized space (frames 1-4), solid frozen block (frame 5), block cracking and shattering (frame 6), mint and icy blue |
| M3 | VFX sprite sheet 4 frames in one row, 64x64, tiny sharp ice splinters shattering outward |
| M4 | VFX sprite sheet 4 frames 2x2 loop, small snowflakes spiraling inward to a glowing icy blue point |
| M5 | VFX sprite sheet 4 frames stacked vertically loop, each 512x32, thin icy aim line with drifting frost flakes flowing to the right, seamless ends |
| M6 | VFX sprite sheet 4 frames 2x2 loop, flat oval frost flower pattern of ice crystals on the ground seen from above, mint and icy blue glow |
| T1 | VFX sprite sheet 6 frames 3x2, small violet dimensional rift tear opening and closing with tiny cyan lightning sparks |
| T2 | VFX sprite sheet 4 frames in one row, three short forks of violet and cyan lightning shooting outward from a point |
| U1 | VFX sprite sheet 8 frames 4x2, a radiant white-gold power burst ring expanding outward from a center with star sparkles and light ribbons, then fading |

## ฝั่งโค้ดจะผูกยังไง (โน้ตสำหรับ AI ที่ทำต่อ)

- แพ็กแบบ `scripts/pack-taro-unique-art.py` (lum×1.35 → alpha) · ใส่ `ASSET_FX` (โหลดตามฮีโร่: ตั้ง key ขึ้นต้น `bpx_<hero>_...` จะ lazy ตาม `artHero`) · ไอคอน/ภาพนิ่งไม่มีในใบนี้
- **เล่นแบบ `must`/force ไม่ถูกตัดตามโควตา `fxOk()`** สำหรับ ⭐⭐⭐ (ปัญหาเดิมของ Titan คือ `bpFx` ไม่ force)
- C1: `castCocoaRush` (titan pound, ทุกครั้งไม่ต้องรอ `landed`) · `castCocoaUnique` titan Rage 0 · Bear Grit Slam · C2: `cocoaMark` · C3/C4: `tickTitanRage` · C5: `titanRageImpact` · C6: `cocoaDashBuff`/`tickCocoaDash` · C7: `cocoaTrailHit` · C8: `cocoaLandingFx`
- S1: `hitEnemy` (pre-path) + `berrySplash` · S2: `tickSnipe`/`releaseSnipe` aim line · S3: Berry Blast aim · S4: dash (momo)
- M1: `mintChill` · M2: `glacierFrostHit` freeze (ค้างเฟรม 4 ระหว่างแช่) · M3: needle hit · M4: `castFrostLance` charge · M5: Frost Lance aim · M6: Glacier Bloom charge preview
- T1: `charPassiveOnDash` taro · T2: `taroAfterDirect` shrapnel
- U1: `uniqueCrescendo` (ย้อมสีตามตัวละคร)
- ทุกชิ้นต้องมี fallback เป็นภาพโค้ดเดิม · เช็ค FPS บนมือถือ (M1/S1 เกิดถี่ → จำกัดจำนวนพร้อมกัน)
