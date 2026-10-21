# 32 — ไอคอนการ์ดรอบ 2 (Unique / Unique Mutation / การ์ดสายใหม่ / Relic ใหม่) · ใบสั่งงานอาร์ต

สถานะ: 🟡 กำลังผลิต · ส่งแล้ว10/51 PNG32 · 21ต.ค.2026 · source-only
ส่งไฟล์ที่ `assets/incoming/card_icons_2/` พร้อม `MANIFEST.json`, `PROMPTS.json`, `QA_REPORT.json` (ตรวจขนาดไฟล์และ hash หลังอัปทุกไฟล์)

## ทำไมต้องทำ

- หลังใบ 26 (ไอคอนการ์ด 77 ชิ้น) มีการ์ดใหม่และการ์ดที่เปลี่ยนผลอีกหลายใบ (v7.9.17–v7.9.23)
- **การ์ด ⭐ Unique 5 ใบ** และ **⭐ Unique Mutation 24 ใบ** ยังแสดงเป็นอีโมจิ (ไม่มีไอคอนเลย)
- **การ์ดสายใหม่ 15 ใบ** ยืมไอคอนของการ์ดอื่น บางใบยืมจากการ์ดที่ถูกลบไปแล้ว (เช่น Forked Arc, Spark Power, Blitz) ผู้เล่นเลยเห็นภาพที่ไม่ตรงกับผล
- **Relic ใหม่ 2 ชิ้น** (Kill Streak, Last Stand) ยังใช้อีโมจิ
- ไม่รวม Sesame และ Yuzu (ยังพัฒนาไม่เสร็จ ตามกฎของเจ้าของ)

## กติกาภาพ (เหมือนใบ 26)

- **PNG32 256×256 ไฟล์ละ 1 ไอคอน** · โปร่งใสจริง (ไม่มี halo ดำหรือขาว) · ไม่มีตัวหนังสือ ไม่มีกรอบ ไม่มีพื้นหลังสี่เหลี่ยม
- เว้นขอบ **≥16px** ทุกด้าน · ภาพหลักอยู่กลางเฟรม
- **อ่านออกที่ 24px** (แถบการ์ดที่ถือ) และสวยที่ **90px** (การ์ดเลเวลอัพ)
- สไตล์เดียวกับ `assets/art/build_paths/*.webp` และ `assets/art/icons/relic_*.webp`: ของชิ้นเดียวอ้วนกลม เส้นขอบเข้ม 2–3px แสงขอบสว่าง เงานุ่ม สีอิ่ม
- ใช้ **สีประจำฮีโร่** เป็นสีหลักของไอคอน: Momo `#ff8fb5` · Mint `#8fd0ff` · Cocoa `#f5bd7c` · Taro `#d3a1ff` · ⭐ Unique กลาง = ทอง `#ffc94a`
- **ส่วน A (Unique กลาง):** มีดาวทองเล็ก ๆ หรือประกายทองที่มุมขวาบน เพื่อบอกว่าเป็นการ์ด Unique
- **ส่วน B (Unique Mutation):** ใช้ภาพสกิล Unique ของสายนั้นเป็นหลัก + **เกลียว DNA/เถาเล็ก ๆ สีทอง** พันมุมล่าง (แบบเดียวกับ `ic_mut_*` ในใบ 26) · สองใบในสายเดียวกันต้องดูต่างกันชัดในขนาด 24px
- **ส่วน C (การ์ดสาย):** ไม่มีดาวหรือ DNA · ต้องดูต่างจากไอคอนสายหลัก `ic_path_<path>` ของสายนั้น
- ห้ามใช้สัญลักษณ์ % ตัวเลข หรือลูกศรตัวหนังสือแทนความหมาย ให้ใช้รูปของ

## A — การ์ด ⭐ Unique กลาง (ใช้ได้ทุกฮีโร่) · 5 ไฟล์

| # | ไฟล์ | ⭐ | การ์ด · ผล | ภาพ |
|---|---|---|---|---|
| A1 | `ic_uq_power.png` | ⭐⭐⭐ | Unique Power · +20% Unique damage ต่อระดับ | ดาวทองใหญ่เปล่งแสง มีกำปั้น/สายฟ้าเล็กพุ่งออกจากกลางดาว |
| A2 | `ic_uq_cd.png` | ⭐⭐⭐ | Quick Recharge · −10% Unique cooldown | นาฬิกาทรายทอง ทรายไหลเร็ว มีดาวเล็กอยู่ในทราย |
| A3 | `ic_uq_kill.png` | ⭐⭐ | Kill Charge · ฆ่าศัตรูแล้ว Unique ชาร์จเร็วขึ้น | หัวกะโหลกโมจิน่ารัก (ไม่น่ากลัว) มีสายพลังทองไหลเข้าดาว |
| A4 | `ic_uq_echo.png` | ⭐⭐ | Unique Echo · 0.4 วิหลังใช้ Unique ระเบิดรอบตัว | ดาวทองกลาง มีวงคลื่นทอง 2 ชั้นแผ่ออก |
| A5 | `ic_uq_ready.png` | ⭐⭐ | Ready Rush · Unique พร้อมใช้ = เดินเร็วและตีเร็วขึ้น | รองเท้าปีกทอง มีดาวทองเรืองอยู่ด้านหลัง |

## B — ⭐ Unique Mutation (เลือกได้ 1 ใบต่อรัน) · 24 ไฟล์

ชื่อไฟล์ `ic_uqm_<id>.png` · ใช้สีประจำฮีโร่ + DNA ทอง

| # | ไฟล์ | ⭐ | ฮีโร่ · สาย | การ์ด · ผล | ภาพ |
|---|---|---|---|---|---|
| B1 | `ic_uqm_snipe_refund.png` | ⭐⭐ | Momo · Sniper | Hunter’s Rhythm · ยิงชาร์จโดน 3+ ตัว คืนคูลดาวน์ 35% | เป้าเล็งชมพูมีกระสุนเมล็ดทะลุ 3 จุด + ลูกศรวนกลับ (เป็นรูปวงโค้ง) |
| B2 | `ic_uqm_snipe_guard.png` | ⭐⭐ | Momo · Sniper | Steady Breath · ยิงชาร์จเต็มแล้วฮีล 5% + ได้โล่ | เป้าเล็งชมพูมีหัวใจและฟองโล่ใส |
| B3 | `ic_uqm_blast_stun.png` | ⭐⭐ | Momo · Shotgun | Shell Shock · Berry Blast ทำให้มึน 1 วิ | กระสุนเบอร์รี่แตก มีดาววนมึนรอบ |
| B4 | `ic_uqm_blast_rain.png` | ⭐⭐ | Momo · Shotgun | Seed Rain · 0.6 วิหลังยิงมีเมล็ด 8 ลูกแตกออก | เมฆชมพูเล็กโปรยเมล็ดหัวใจลงมา |
| B5 | `ic_uqm_reb_shield.png` | ⭐⭐ | Momo · Ricochet | Sugar Shell · Rebound ให้โล่ด้วย (สูงสุด 2) | ฟองโล่น้ำตาลใส 2 ชั้นซ้อน มีเมล็ดเด้งอยู่ข้างใน |
| B6 | `ic_uqm_reb_double.png` | ⭐⭐ | Momo · Ricochet | Double Rebound · Rebound รอบสองที่ 50% | เมล็ดชมพู 2 ลูก ลูกหลังจางกว่า มีเส้นเด้งเป็นซิกแซก |
| B7 | `ic_uqm_bloom_field.png` | ⭐⭐ | Mint · Glacier | Permafrost · ทิ้งพื้นน้ำแข็ง 4 วิ | ดอกน้ำแข็งบานบนแผ่นน้ำแข็งพื้นแตกลาย |
| B8 | `ic_uqm_bloom_heal.png` | ⭐⭐ | Mint · Glacier | Cold Heart · ฮีล 2% ต่อศัตรูที่แข็ง | หัวใจน้ำแข็งฟ้าใส มีเกล็ดหิมะเล็กรอบ |
| B9 | `ic_uqm_lance_mines.png` | ⭐⭐ | Mint · Pierce | Glacial Wake · พุ่งหอกแล้วทิ้งระเบิดน้ำแข็ง 3 ลูก | หอกน้ำแข็งพุ่ง มีผลึกน้ำแข็ง 3 ก้อนเรียงตามทาง |
| B10 | `ic_uqm_lance_guard.png` | ⭐⭐ | Mint · Pierce | Frost Armor · หลังพุ่งหอก ลดดาเมจ 40% 3 วิ | โล่น้ำแข็งหกเหลี่ยม มีหอกพาดด้านหลัง |
| B11 | `ic_uqm_gale_blades.png` | ⭐⭐ | Mint · Barrage | Gale Blades · ใบมีดลมฟันรอบตัวทุก 0.5 วิ | ใบไม้มินต์ 3 ใบหมุนเป็นวงใบพัดคม |
| B12 | `ic_uqm_gale_tail.png` | ⭐⭐ | Mint · Barrage | Tailwind · +30% ความเร็วโจมตี | ลมหมุนฟ้าพัดลูกธนูน้ำแข็งให้พุ่ง มีเส้นความเร็ว |
| B13 | `ic_uqm_rocket_ring.png` | ⭐⭐ | Cocoa · Brawler | Rocket Ring · หมัดไฟ 8 อันบินออกเป็นวง | วงกำปั้นไฟเล็ก 8 อันล้อมรอบกำปั้นใหญ่ |
| B14 | `ic_uqm_rocket_heat.png` | ⭐⭐ | Cocoa · Brawler | Heat Up · 4 วิ หมัดทุกหมัดระเบิด | ถุงมือหมีร้อนแดงมีเปลวไฟลุกและเส้นความร้อน |
| B15 | `ic_uqm_rage_after.png` | ⭐⭐ | Cocoa · Titan | Aftershocks · คลื่นกระแทกเพิ่มอีก 2 วง | กำปั้นทุบพื้น มีรอยแตกและคลื่นวงตามมา 3 ชั้น |
| B16 | `ic_uqm_rage_guard.png` | ⭐⭐ | Cocoa · Titan | Unshaken · หลังทุบ ลดดาเมจ 50% 3 วิ | หินช็อกโกแลตแข็งรูปโล่ มีรอยหมัดตรงกลาง |
| B17 | `ic_uqm_phantom_refund.png` | ⭐⭐ | Cocoa · Dash Boxer | Ghost Refund · ฆ่าระหว่าง Phantom Rush ลดคูลดาวน์ | ผีหมีโปร่งแสงกำนาฬิกาเล็ก |
| B18 | `ic_uqm_phantom_slam.png` | ⭐⭐ | Cocoa · Dash Boxer | Final Slam · จบ Phantom Rush แล้วทุบใหญ่ | เงาหมีหลายตัวรวมเป็นกำปั้นเดียวทุบลง |
| B19 | `ic_uqm_plasma_wide.png` | ⭐⭐ | Taro · Arc | Wide Field · Plasma Field ไกลขึ้น 35% | ลูกพลาสมาม่วงมีวงสนามไฟฟ้ากว้างแผ่ออก |
| B20 | `ic_uqm_plasma_twin.png` | ⭐⭐ | Taro · Arc | Twin Field · สนามที่สองตามมา 60% | ลูกพลาสมาม่วง 2 ลูกซ้อน ลูกหลังจางกว่า |
| B21 | `ic_uqm_mark_jump.png` | ⭐⭐ | Taro · Spark | Leaping Mark · เป้าตาย ตราย้ายไปเป้าใหม่ 1 ครั้ง | ตราสายฟ้าม่วงกระโดดเป็นเส้นโค้งไปอีกจุด |
| B22 | `ic_uqm_mark_nova.png` | ⭐⭐ | Taro · Spark | Mark Nova · ตราจบแล้วระเบิดวงใหญ่ | ตราสายฟ้าม่วงระเบิดเป็นวงแสงใหญ่ |
| B23 | `ic_uqm_over_long.png` | ⭐⭐ | Taro · Sentry | Long Overdrive · Overdrive นานขึ้น 1.5 วิ | ป้อม Sentry ม่วงกับนาฬิกาทรายเล็กด้านข้าง |
| B24 | `ic_uqm_over_finale.png` | ⭐⭐ | Taro · Sentry | Finale Burst · จบ Overdrive ทุกป้อมยิงวงคู่ | ป้อม Sentry ม่วงยิงพลุวงแสงออกรอบตัว |

## C — การ์ดสายใหม่ที่ยังยืมไอคอนอื่น · 15 ไฟล์

ชื่อไฟล์ `ic_path_<id>.png` · ตอนนี้ใช้ไอคอนในวงเล็บ (บางอันมาจากการ์ดที่ลบไปแล้ว)

| # | ไฟล์ | ⭐ | ฮีโร่ · สาย | การ์ด · ผล (ตอนนี้ใช้) | ภาพ |
|---|---|---|---|---|---|
| C1 | `ic_path_p_arc_shock.png` | ⭐⭐ | Taro · Arc | Static Shock · ศัตรูที่โดน Arc รับดาเมจเพิ่ม 4%/ระดับ 2 วิ (`ic_path_storm`) | ก้อนเยลลี่ศัตรูมีประกายไฟฟ้าม่วงเกาะตัว |
| C2 | `ic_path_p_arc_twin.png` | ⭐⭐⭐ | Taro · Arc | Double Arc · ทุก Arc ที่ 4/3 ยิงสองครั้ง (`ic_path_p_squall` — การ์ดที่ลบแล้ว) | สายฟ้าม่วงสองเส้นขนานคู่ |
| C3 | `ic_path_p_arc_ground.png` | ⭐⭐ | Taro · Arc | Grounding · Arc ฆ่าแล้วฮีล 0.4%/ระดับ (`ic_taro_reserve_cell`) | สายฟ้าลงหลักดิน มีหัวใจเล็กเขียวลอยขึ้น |
| C4 | `ic_path_p_spark_shock.png` | ⭐⭐⭐ | Taro · Spark | Static Sparks · ศัตรูที่โดน Spark รับดาเมจเพิ่ม 3%/ระดับ (`ic_path_p_overload` — การ์ดที่ลบแล้ว) | ประกายไฟลูกเล็กหลายลูกเกาะเยลลี่ศัตรู |
| C5 | `ic_path_p_sentry_ward.png` | ⭐⭐ | Taro · Sentry | Sentry Ward · ใกล้ป้อม 160px ลดดาเมจ 5%/ระดับ (`ic_taro_wide_conductor`) | ป้อม Sentry ม่วงกางโล่โดมไฟฟ้าใส |
| C6 | `ic_path_p_sentry_pulse.png` | ⭐⭐ | Taro · Sentry | Close Charge · ป้อมใกล้ Taro 260px ยิงเร็วขึ้น 12%/ระดับ (`ic_taro_rapid_pulse`) | ป้อม Sentry กับหมวกพ่อมดเล็ก ต่อกันด้วยสายไฟฟ้าสั้น |
| C7 | `ic_path_p_static.png` | ⭐ | Taro · Arc | Static Shards · Arc ฆ่าแล้วเศษไฟฟ้ากระเด็นไปตัวอื่น (มีไฟล์ `assets/art/build_paths/p_static.webp` อยู่แล้วแต่วาดตอนการ์ดยังเป็น Static Arc Power) | ผลึกไฟฟ้าแตกเป็นเศษ 3 ชิ้นกระเด็นออก |
| C8 | `ic_path_p_bar_wide.png` | ⭐⭐ | Mint · Barrage | Wide Bloom · พื้นที่ระเบิดน้ำแข็งกว้างขึ้น 20%/ระดับ (`ic_path_barrage`) | ดอกน้ำแข็งบานกว้าง กลีบยาวออกนอก |
| C9 | `ic_path_p_bar_chain.png` | ⭐⭐ | Mint · Barrage | Shard Chain · 25%/ระดับ ระเบิดซ้ำที่ตัวใกล้ 60% (`ic_card_m_shard`) | ผลึกน้ำแข็ง 2 ก้อนต่อกันด้วยเส้นโซ่น้ำแข็ง |
| C10 | `ic_path_p_bar_echo.png` | ⭐⭐⭐ | Mint · Barrage | Lance Echo · ทุกชุดที่ 4/3 ยิงซ้ำ 0.25 วิ (`ic_mod_exec` — ภาพการ์ดประหาร ไม่ตรง) | ลูกธนูน้ำแข็ง 2 ชุด ชุดหลังโปร่งแสงเป็นเงาสะท้อน |
| C11 | `ic_path_r_spark.png` | ⭐⭐⭐ | Momo · Ricochet | Heart Spark · เด้งแล้ว 15%/ระดับ ปล่อยไฟฟ้าหัวใจ (`ic_path_buckshot` — การ์ดที่ลบแล้ว) | เมล็ดหัวใจชมพูมีประกายไฟฟ้าชมพูแตกออก |
| C12 | `ic_path_p_streak.png` | ⭐⭐⭐ | Cocoa · Brawler | Hot Streak · หมัดโดน +2%/ระดับ ซ้อน 10 ชั้น (`ic_path_p_blitz` — การ์ดที่ลบแล้ว) | กำปั้นไฟมีขีดไฟเรียงต่อกันด้านหลังเหมือนคอมโบ |
| C13 | `ic_path_p_leapstun.png` | ⭐⭐ | Cocoa · Dash Boxer | Leap Stun · กระโดดชนแล้วมึน 0.4 วิ/ระดับ (ไม่ใช่บอส) (`ic_path_p_longleap`) | หมีกระโดดลงพื้น มีดาวมึนวนรอบจุดตก |
| C14 | `ic_path_p_footwork.png` | ⭐ | Cocoa · Brawler | Hot Hands · หมัดที่ 8/6/4 ระเบิดไฟ (มีไฟล์ `assets/art/build_paths/p_footwork.webp` อยู่แล้วแต่วาดตอนเป็น Footwork) | กำปั้นหมีร้อนแดงระเบิดไฟวงเล็ก |
| C15 | `ic_path_p_recharge.png` | ⭐⭐ | Cocoa · Dash Boxer | Leap Mend · กระโดดเจอเป้าแล้วฮีล 1.5%/ระดับ (`ic_cocoa_drum`) | รอยเท้าหมีกระโดด มีหัวใจเขียวลอยขึ้น |

## D — Relic ใหม่ · 2 ไฟล์

สไตล์เดียวกับ `assets/art/icons/relic_*.webp` (ของวิเศษชิ้นเดียว มีแสงรอบ)

| # | ไฟล์ | ⭐ | Relic · ผล | ภาพ |
|---|---|---|---|---|
| D1 | `relic_streak.png` | ⭐⭐ | Kill Streak 🔥 · +3% ดาเมจต่อการฆ่าต่อเนื่อง (สูงสุด +40%) | คบเพลิงขนมหวานไฟส้มลุกโชน มีขีดนับเล็ก ๆ ที่ด้าม |
| D2 | `relic_laststand.png` | ⭐⭐ | Last Stand 🛡️ · HP ต่ำกว่า 35% รับดาเมจน้อยลง 30% | โล่บิสกิตแตกร้าวแต่ยังยืน มีหัวใจครึ่งดวงเรืองแสงตรงกลาง |

## E — วาดใหม่ (ทางเลือก) · 6 ไฟล์

การ์ดเหล่านี้ **มีไอคอนอยู่แล้ว** แต่ผลเปลี่ยนไปใน v7.9.19–21 ภาพเดิมเลยไม่ตรง · ใช้ชื่อไฟล์เดิม (ทับไฟล์ใบ 26)

| # | ไฟล์ | ⭐ | การ์ด · ผลใหม่ | ภาพ |
|---|---|---|---|---|
| E1 | `ic_mod_spray.png` | ⭐ | Petal Kick · Dash ยิงเมล็ด 6 ลูกเป็นวงที่เด้งได้ | รองเท้าเตะ มีเมล็ดชมพู 6 ลูกเป็นวง |
| E2 | `ic_mod_rage.png` | ⭐ | Rolling Rage · Dash สะสม +6% สูงสุด 5 ชั้น โดนตีแล้วหาย | ลูกบอลหมีกลิ้ง มีขีดสะสม 5 ขีด |
| E3 | `ic_mod_judge.png` | ⭐ | Static Buildup · ตีตัวเดิมครบ 6 ครั้ง ช็อตและมึน | ขีดไฟฟ้า 6 ขีดเรียงเป็นวงรอบเป้า |
| E4 | `ic_mod_shatter.png` | ⭐ | Ice Breaker · ฆ่าศัตรูที่แข็งแล้วแตกกระจายแช่แข็งรอบ ๆ | ก้อนน้ำแข็งแตกกระจาย มีเกล็ดพุ่งออก |
| E5 | `ic_mod_focus.png` | ⭐ | Storm Battery · ฆ่าครบ 15 ตัว ตีครั้งต่อไป ×5 | แบตเตอรี่ไฟฟ้าม่วงชาร์จเต็ม มีสายฟ้าบนหัว |
| E6 | `ic_fus_skyjudge.png` | ⭐ | Sky Judge · ทุก 4 วิ ฟ้าผ่าศัตรูที่ HP มากสุดในจอ | เมฆม่วงผ่าสายฟ้าใหญ่ลงเป้าเล็ง |

ก่อนวาด E ให้เปิดไฟล์เดิมใน `assets/art/card_icons/` ดูก่อน ถ้าภาพเดิมยังพอสื่อความหมายได้ ข้ามไฟล์นั้นได้ และให้ระบุไว้ใน QA_REPORT

รวม **ต้องมี 46 ไฟล์** (A 5 · B 24 · C 15 · D 2) + **ทางเลือก 6 ไฟล์** (E) = สูงสุด 52 ไฟล์

## ลำดับความสำคัญ

1. **รอบ 1:** A1–A5 (ขึ้นทุกรันเมื่อใช้ Unique ครบ 3 ครั้ง) · C2 C4 C10 C11 C12 (ยืมไอคอนการ์ดที่ลบแล้ว หรือภาพไม่ตรงชัดเจน)
2. **รอบ 2:** B1–B24 · D1 D2
3. **รอบ 3:** C ที่เหลือ · E (ทางเลือก)

## MANIFEST.json (array ต่อไฟล์)
```json
{ "key": "ic_uq_power", "file": "ic_uq_power.png", "width": 256, "height": 256,
  "group": "A", "card": "uq_power", "hero": "shared", "background": "transparent",
  "sha256": "...", "bytes": 0 }
```
- ส่วน B ใส่ `"card": "<mutation id>"` และ `"path": "<sniper|…|tempest>"`
- ส่วน E ใส่ `"replaces": "assets/art/card_icons/<file>.webp"` หรือ `"skipped": true` พร้อมเหตุผล

## ส่งมอบ / QA

- `PROMPTS.json` = prompt จริงที่ใช้สร้างทุกไฟล์
- `QA_REPORT.json`: ขนาด 256×256 · โหมดสี RGBA · alpha มีค่าโปร่งจริงที่มุม · bbox เว้นขอบ ≥16px · sha256 + bytes ตรง MANIFEST
- หน้าเทียบ (preview PNG):
  - แผ่นรวมทุกไอคอนที่ **24px** และ **90px** บนพื้นการ์ดสว่างและมืด
  - คู่ Mutation ในสายเดียวกันวางเทียบกันที่ 24px (ต้องแยกออก)
  - ส่วน C วางเทียบกับไอคอนสายหลัก `ic_path_<path>` ของสายนั้น
- อัปแล้วอ่านไฟล์กลับจาก GitHub ตรวจ bytes/hash ให้ตรงทุกไฟล์

## โน้ตฝั่งโค้ด (ทำหลังได้อาร์ต)

- pack 256→128 WebP lossless ตามสคริปต์ใบ 26 (`scripts/pack-art-order-26.py`) · ตรวจ sha กับ MANIFEST ก่อน
- A/B/C/E → `assets/art/card_icons/` และต่อท้าย `CARD_ICON_KEYS` (โหลดตามด่าน ไม่ใช่ตอนบูต)
- D → `assets/art/icons/relic_streak.webp`, `relic_laststand.webp` (บูตแบบ relic อื่น · งบ GPU บูตตึง ถ้าเกินให้ย้ายไปโหลดตามด่าน)
- `cardArtKey(o)`: การ์ด `UNIQUE_CARDS` → `ic_uq_<key ตัด uq_>` · Unique Mutation → `ic_uqm_<id>`
- การ์ดสาย C: เปลี่ยน `iconKey` ของการ์ดนั้นเป็น `ic_path_<id>` (C7/C14 ทับ `assets/art/build_paths/p_static.webp` / `p_footwork.webp` ไม่ต้องแก้คีย์)
- ถ้าไม่มี texture → ใช้อีโมจิ/ไอคอนเดิมเหมือนตอนนี้ (fallback)
- ไม่แตะการ์ด Sesame/Yuzu
