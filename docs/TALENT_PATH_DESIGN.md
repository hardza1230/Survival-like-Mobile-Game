# Talent เฉพาะสาย (Build Path Talent) — แบบร่างก่อนทำ

สถานะ: **อนุมัติแล้ว (Capstone เลือก 1 · 5 TP)** · commit 1 ✅ v6.55.39 · เขียน 4 ต.ค. 2026 (v6.55.23)

## ปัญหาตอนนี้
- ทุก Build Path (18 สาย) ใช้ 7 node ชุดเดียวกัน (`talentBranch`): Focus/Rhythm/Resolve/Precision/Second Wind/Guard/Mastery = ตัวเลขทั่วไป
- เลือกสายไหนก็ลงเหมือนกัน → ไม่รู้สึกว่าต้องเลือก ไม่เปลี่ยนวิธีเล่น

## หลักการใหม่
1. **ทุก node ผูกกลไกของสายนั้น** (ไม่มี +dmg ลอย ๆ) — ลง Sniper แล้ว Sniper เล่นต่างจริง
2. **ต้นไม้ต่อสาย = Root + 3 กิ่ง + Capstone 3 แบบ (เลือกได้ 1)**
   - Root (max 3) — เพิ่มจุดเด่นหลักของสาย · ต้อง ≥1 ถึงเปิดกิ่ง
   - กิ่ง A **Power** · กิ่ง B **Mechanic** · กิ่ง C **Survival** — กิ่งละ 2 node (node 2 ต้อง node 1 ≥2)
   - **Capstone 3 ตัว อยู่ปลายกิ่งละตัว · เลือกได้แค่ 1 ต่อสาย** (ลงตัวหนึ่ง = อีก 2 ตัวล็อก จนกว่าจะ Reset) ← ตัวบังคับให้เลือก
3. **ราคา** คงสูตรเดิม `talCost(r)=r+1` · Capstone = 5 TP (rank เดียว)
   - ลงครบทั้งต้น ≈ 6+ (3 กิ่ง×(6+6)) + 5 = ~47 TP → ที่ Lv20 (~20 TP รวม Core) ลงได้ราว Root + 1 กิ่งเต็ม + Capstone · ต้องเลือกกิ่ง
4. **Core column เดิม (CHAR_TALENTS) คงไว้** เป็นสแตตทั่วไปของตัวละคร
5. Talent สายทำงานเฉพาะรันที่เลือกสายนั้น (เหมือนเดิม) · เพิ่มป้ายบนการ์ดเลือกสายในรัน "🌟 Talents 7 pts" ให้รู้ว่าลงไว้สายไหน
6. **ย้ายเซฟ:** id node เดิม `b_<path>_*` คืน TP ทั้งหมดอัตโนมัติครั้งเดียว + แจ้ง "Talents reworked — points refunded"

สัญลักษณ์: (R) = มี hook เดิมใช้ได้ · (N) = ต้องเขียน hook ใหม่

---

## 🍓 Momo
### 🎯 Sniper — ยิงหนัก ทะลุ ล่าบอส
| | Node | ผลต่อ rank |
|---|---|---|
| Root | Steady Aim (3) | +10% ดาเมจเมล็ด Sniper (R dmg) |
| A1 | Hollow Point (3) | Headshot +5% โอกาส (N เพิ่มค่าเข้า headshot) |
| A2 | Trophy Hunter (3) | +12% vs elite/บอส (R big) |
| B1 | Fast Chamber (3) | ชาร์จ Unique เร็วขึ้น 10% (N snipe charge) |
| B2 | Overpenetration (3) | เมล็ดทะลุ: ตัวถัดไป +10% ดาเมจต่อตัวที่ทะลุ (N) |
| C1 | Camouflage (3) | ยืนนิ่ง ≥0.6s รับดาเมจ −6% (N still) |
| C2 | Scope Retreat (2) | Dash แล้วเมล็ดถัดไปการันตี Headshot (N) |
| Cap A | **One Shot** | Headshot ฆ่าศัตรูธรรมดาทันที, บอส ×4 |
| Cap B | **Railgun** | Unique ชาร์จเต็มยิง 2 ลำ (ลำที่ 2 หลัง 0.4s) |
| Cap C | **Ghillie** | ยืนนิ่ง 1.5s = ล่องหน (มอนเลิกไล่) จนกว่าจะยิง |

### 💥 Shotgun — ประชิด กระจาย
| | Node | ผล |
|---|---|---|
| Root | Wide Choke (3) | +6% ดาเมจระยะใกล้ (R pointblank ค่า) |
| A1 | Slug Mix (3) | เม็ดกลาง +20% ดาเมจ (N) |
| A2 | Close Quarters (3) | ใกล้ <120px เพิ่มอีก +10% (N) |
| B1 | Extra Shell (2) | +1 เม็ด (R buckshot) |
| B2 | Knockback (3) | เม็ดผลักศัตรู +20px (N) |
| C1 | Bulk Up (3) | +6% max HP (R) |
| C2 | Shell Shield (2) | ศัตรูใกล้ ≥5 ตัว รับดาเมจ −8% (N surround) |
| Cap A | **Dragon Breath** | เม็ดติดไฟ (burn 30%/2s) |
| Cap B | **Double Barrel** | ทุกนัดที่ 4 ยิงชุดซ้ำทันที |
| Cap C | **Recoil Dash** | ยิงแล้วถอยหลัง 40px + iframe 0.15s (cd 1.2s) |

### 💞 Ricochet — เด้งต่อ คุมฝูง
| | Node | ผล |
|---|---|---|
| Root | Rubber Seed (3) | +1 เด้งที่ rank 3, +4% ดาเมจต่อ rank (R carom/dmg) |
| A1 | Momentum (3) | ดาเมจต่อการเด้ง +6% (R gather) |
| A2 | Last Bounce (3) | เด้งสุดท้าย ×1.25 ต่อ rank (N) |
| B1 | Seek (3) | เด้งหาเป้าไกลขึ้น +20% (N bounce range) |
| B2 | Split Bounce (2) | 15% ต่อ rank แตก 2 เมล็ดตอนเด้ง (N) |
| C1 | Juice Sip (3) | ทุก 20 เด้ง ฮีล 1% (N) |
| C2 | Bouncy Skin (2) | โดนตี → ปล่อยเมล็ดเด้ง 2 ลูก (N) |
| Cap A | **Pinball** | ไม่จำกัดเด้งจนกว่าจะพลาด (สูงสุด 12) |
| Cap B | **Boomerang** | เด้งครบแล้วบินกลับหาผู้เล่น ตีทางกลับ |
| Cap C | **Sugar Loop** | เด้งผ่านใกล้ตัวเรา = โล่ 1 ชั้น (cd 6s) |

---

## 🌿 Mint
### 🧊 Freeze — แช่ ทุบ
| Root | Frostbite (3) | Chill สะสมเร็ว: ต้องการชั้นแช่ −1 ที่ rank 3 (N mintChill) |
| A1 | Deep Chill (3) | +10% vs ศัตรูแช่ (R frozen) |
| A2 | Shatter (3) | ฆ่าศัตรูแช่ = ระเบิดน้ำแข็ง r60 (N) |
| B1 | Long Winter (3) | แช่นาน +0.2s (N) |
| B2 | Icebound Echo+ (3) | คลื่น Chill ใหญ่ขึ้น 20% (R coldsnap) |
| C1 | Frost Armor (3) | ศัตรูแช่ใน 150px ทำให้เรารับดาเมจ −3%/ตัว เพดาน 15% (N) |
| C2 | Cold Blood (2) | โดนตี → แช่ตัวที่ตี 0.6s (N) |
| Cap A | **Absolute Zero** | บอสสะสม Chill ครบ = ช้า 50% 2s |
| Cap B | **Permafrost Field** | ศัตรูแช่ทิ้งพื้นน้ำแข็ง ชะลอตัวอื่น |
| Cap C | **Glacial Heart** | HP <30% = แช่ทุกตัวรอบ r220 (cd 25s) |

### 🌨️ Barrage — หอกหลายเล่ม
| Root | Volley (3) | −5% cd (R cd) |
| A1 | Crystal Payload (3) | สะเก็ด +10% (R splinter) |
| A2 | Focus Fire (3) | หอกที่โดนเป้าเดียวกันซ้ำ +8% (N) |
| B1 | Wide Volley (3) | กระจายกว้าง +15% (R) |
| B2 | Extra Lance (1) | +1 หอก (เกินเพดาน 3 ได้ 1) (R count) |
| C1 | Mint Breeze (3) | ยิงทุก 10 ครั้ง ฮีล 1% (N) |
| C2 | Lance Guard (2) | หอกลบกระสุนศัตรูที่ชน (N) |
| Cap A | **Hailstorm** | ทุก 3 วิ ฝนหอกตกรอบตัว 6 เล่ม |
| Cap B | **Splitting Ice** | สะเก็ดแตกซ้ำอีก 1 ชั้น |
| Cap C | **Blizzard Cloak** | ระหว่าง Gale ยิงหอกอัตโนมัติรอบทิศ |

### 🏹 Piercer — หอกหนัก ทะลุยาว
| Root | Heavy Lance (3) | +8% ดาเมจ (R dmg) |
| A1 | Shatterpoint (3) | +12% vs elite/บอส (R big) |
| A2 | Executioner (3) | +10% vs ศัตรู HP <30% (N) |
| B1 | Fracture Line (3) | +1 ทะลุ (R) |
| B2 | Long Reach (3) | ระยะ +10% (R range) |
| C1 | Steady Stance (3) | รับดาเมจ −4% ตอนยืนยิง (N still) |
| C2 | Recoil Step (2) | ยิงแล้ว dash cd −0.3s (N) |
| Cap A | **Skewer** | หอกทะลุตัวที่ 3+ ดาเมจ ×2 |
| Cap B | **Javelin Rain** | หอกตกพื้นแล้วระเบิดเส้นตรงยาว |
| Cap C | **Spear Wall** | หอกปักพื้น 2s กันศัตรูผ่าน |

---

## 🍫 Cocoa
### 🥊 Brawler — คอมโบเร็ว คลื่นกระแทก
| Root | Fast Hands (3) | −5% cd คอมโบ (R cd) |
| A1 | Shock Knuckles (2) | +1 คลื่น (R wave) |
| A2 | Rhythm Fist (3) | ท่าปิด (beat 5) ×1.15 (N) |
| B1 | Wide Wave (3) | คลื่นใหญ่ +15% (N) |
| B2 | Juggle (3) | Uppercut แช่นาน +0.15s (N) |
| C1 | Iron Skin (3) | HITS ≥10 รับดาเมจ −3% เพิ่ม (R cocoaGuard) |
| C2 | Bloodlust (2) | ท่าปิดฮีล 0.8% (N) |
| Cap A | **Hundred Fists** | ทุก 5 ท่าปิด = รัว 10 หมัดรอบตัว |
| Cap B | **Aftershock** | คลื่นทิ้งรอยแตกระเบิดตามหลัง 0.5s |
| Cap C | **Unbreakable** | ระหว่างคอมโบไม่โดนผลัก + −10% ดาเมจรับ |

### 🗿 Titan — ทุบหนัก ช้า
| Root | Heavy Bones (3) | +8% ดาเมจ (R dmg) |
| A1 | Giant Slayer (3) | +12% vs บอส (R big) |
| A2 | Crush (3) | ศัตรูมึน/แช่ +15% (R frozen) |
| B1 | Quake (3) | ขนาดกระแทก +10% (R range) |
| B2 | Tremor (3) | Slam ทำให้ช้า 30% 1s (N) |
| C1 | Mountain (3) | +8% max HP (R) |
| C2 | Stone Skin (2) | หลังทุบหนัก iframe 0.2s (N) |
| Cap A | **Colossus Smash** | ทุก 4 ท่า = Slam ×3 ใหญ่พิเศษ |
| Cap B | **Earthsplitter** | Slam เป็นเส้นแตกยาวไปข้างหน้า |
| Cap C | **Living Mountain** | ยิ่ง HP ต่ำยิ่งตัวใหญ่/อึด (สูงสุด −25% รับดาเมจ) |

### 🐾 Dash — วิ่งชนแล้วหนี
| Root | Light Feet (3) | ชาร์จ dash คืนเร็ว 6% (R) |
| A1 | Phantom Jab (3) | บัฟ dash +15% (R dashm) |
| A2 | Dash Strike (3) | Dash ผ่านศัตรูทำดาเมจ (N) |
| B1 | Blitz (2) | +1 ชาร์จ (R dashc) |
| B2 | Long Buff (3) | บัฟนาน +0.5s (N) |
| C1 | Slip (3) | Dash iframe +0.05s (N) |
| C2 | Escape Artist (2) | Dash ตอน HP <40% ฮีล 2% (cd 4s) (N) |
| Cap A | **Bear Rush** | Dash ครั้งที่ 3 ติดกัน = พุ่งยาวชนทุกตัว ×3 |
| Cap B | **Afterimage** | Dash ทิ้งเงาที่ต่อยต่อ 1.5s |
| Cap C | **Untouchable** | หลบด้วย dash ทันเวลา (โดนตอน iframe) = คืนชาร์จ |

---

## 🌰 Taro
### 🌩️ Chain — สายฟ้ากระจาย
| Root | Conductor (3) | +1 ชิ่งที่ rank 3, +4% ดาเมจ (N/R) |
| A1 | Static Build (3) | +8% (R dmg) |
| A2 | Overcharge (3) | ชิ่งไม่ลดดาเมจ −5%/rank (N) |
| B1 | Squall (2) | +1 จุดฟาด (R count) |
| B2 | Arc Reach (3) | ระยะชิ่ง +15% (N) |
| C1 | Grounded (3) | รับดาเมจ −3% (R taken) |
| C2 | Static Shield (2) | โดนตี → ช็อตตัวที่ตี (N) |
| Cap A | **Storm Web** | ศัตรูที่โดนชิ่ง 3 ครั้ง เชื่อมเส้นไฟฟ้ากัน 2s |
| Cap B | **Ball Lightning** | ทุก 6 วิ ลูกฟ้าลอยไล่ฝูง |
| Cap C | **Lightning Rod** | ยืนนิ่ง ดูดฟ้ารอบตัว = ช็อตทุกตัวที่เข้าใกล้ |

### 🔨 Smite — ฟาดหนักลูกเดียว
| Root | Judgment (3) | +12% vs บอส (R big) |
| A1 | Overload (3) | +10% (R dmg) |
| A2 | Charged Strike (3) | Taro Storm Charge เต็มเร็วขึ้น −1 stack (N) |
| B1 | Thunderclap (3) | ฟาดมีวงกระแทกเล็ก r40+ (N) |
| B2 | Stun Bolt (2) | ฟาดมึน 0.3s (ไม่ใช่บอส) (N) |
| C1 | Divine Ward (3) | หลังฟาดโดน รับดาเมจ −3% 2s (N) |
| C2 | Rift Step+ (2) | Rift Step passive ใหญ่ขึ้น 20% (R) |
| Cap A | **Wrath of Heaven** | Judgment Bolt ×10 แทน ×6 |
| Cap B | **Double Smite** | 25% ฟาดซ้ำทันที |
| Cap C | **Martyr** | HP <30% ทุกฟาดฮีล 1% |

### 🌪️ Tempest — ร่ายเร็วมาก
| Root | Gale (3) | −5% cd (R cd) |
| A1 | Far Strike (3) | +10% vs ไกล (R far) |
| A2 | Gust Crit (3) | +4% crit เฉพาะฟ้าผ่า (N) |
| B1 | Swirl (3) | ฟาดผลักศัตรูออก (N) |
| B2 | Eye of Storm (3) | ระยะร่าย +10% (R range) |
| C1 | Tailwind (3) | +4% ความเร็วเดิน (R) |
| C2 | Cyclone Guard (2) | กระสุนศัตรูใกล้ตัว 15% ถูกพัดออก (N) |
| Cap A | **Hurricane** | ทุก 8 วิ พายุหมุนรอบตัว 3s |
| Cap B | **Flash Cast** | ทุกการร่ายที่ 5 ไม่มี cd |
| Cap C | **Calm Center** | ยิ่งมีศัตรูใกล้ยิ่งร่ายเร็ว (สูงสุด −25% cd) |

---

## 🖤 Sesame
### 🌈 Prism — หลายลำ
| Root | Extra Facet (2) | +1 ลำ (R count) |
| A1 | Refraction (3) | +8% (R dmg) |
| A2 | Converge (3) | ลำโดนเป้าเดียวกัน 3+ ลำ ×1.2 (N) |
| B1 | Spread Angle (3) | มุมกว้าง +15% (N) |
| B2 | Rainbow Burn (3) | ลำทิ้งรอยแสงไหม้ 0.5s (N) |
| C1 | Glass Shell (3) | รับดาเมจ −3% (R taken) |
| C2 | Mirror Skin (2) | 10% สะท้อนกระสุน (R reflect) |
| Cap A | **Spectrum** | ลำแต่ละสีมีธาตุ (ไฟ/แช่/ช็อต) |
| Cap B | **Kaleidoscope** | ลำสะท้อนขอบจอ 1 ครั้ง |
| Cap C | **Prism Ward** | ลำหมุนรอบตัวกันศัตรูประชิด |

### 🔍 Focus — ลำเดียวหนัก
| Root | Steady Hand (3) | +8% (R dmg) |
| A1 | Burning Lens (3) | +12% vs บอส (R big) |
| A2 | Heat Up (3) | ยิงเป้าเดิมต่อเนื่อง +5%/วิ เพดาน +25%/rank (N) |
| B1 | Wide Lens (3) | ลำกว้าง +15% (N) |
| B2 | Pierce Light (2) | ลำทะลุ +1 (N) |
| C1 | Oath Focus+ (3) | passive ยืนนิ่ง +6% (R) |
| C2 | Blind (2) | ศัตรูโดนลำ 1s ยิงพลาด 30% (N) |
| Cap A | **Solar Flare** | Heat ครบ = ระเบิดแสงใหญ่ |
| Cap B | **Twin Lens** | ลำที่ 2 ตามเป้าที่ HP สูงสุด |
| Cap C | **Sanctuary Beam** | ยืนนิ่งยิงนาน 3s = โดมลดดาเมจ 30% |

### 🔭 Sentinel — ยิงไกล หนี
| Root | Longsight (3) | +10% vs ไกล (R far) |
| A1 | Sniper Light (3) | ลำยาว +10% (R range) |
| A2 | Marked (3) | ศัตรูไกลโดนลำ = รับดาเมจ +5%/rank 3s (N) |
| B1 | Watchtower (3) | ยืนนิ่ง ระยะ +10% (N) |
| B2 | Flare (2) | ทุก 6 วิ ยิงพลุ เผยศัตรูไกล +ดาเมจ (N) |
| C1 | Distance (3) | ศัตรูใน 100px ช้าลง 8% (N) |
| C2 | Retreat (2) | Dash cd −10% (R dashCdMul) |
| Cap A | **Horizon** | ศัตรูไกล >400 รับ ×2 |
| Cap B | **Orbital** | ทุก 5 วิ ลำแสงจากฟ้าลงเป้าไกลสุด |
| Cap C | **Keep Away** | ศัตรูประชิดถูกผลักออกทุก 2 วิ |

---

## 🍋 Yuzu
### 🐝 Swarm — ลูกสมุนเยอะ
| Root | Extra Pulp (2) | +1 Yuzling (R count) |
| A1 | Sharp Bite (3) | +8% ดาเมจลูกสมุน (R dmg) |
| A2 | Pack Hunt (3) | ลูกสมุน 3+ ตัวรุมเป้าเดียว +12% (N) |
| B1 | Zest Speed (3) | ลูกสมุนเร็ว +10% (N) |
| B2 | Respawn (3) | ลูกสมุนตายเกิดใหม่เร็ว 15% (N) |
| C1 | Bodyguard (3) | ลูกสมุนใกล้ตัว ลดดาเมจรับ 2%/ตัว เพดาน 12% (N) |
| C2 | Citrus Medic (2) | ลูกสมุนฆ่า 10 ตัว ฮีล 1% (N) |
| Cap A | **Queen Yuzling** | 1 ตัวเป็นราชินี ×3 ดาเมจ |
| Cap B | **Hive Mind** | ลูกสมุนแชร์เป้า ไล่ตัว HP สูงสุด |
| Cap C | **Living Wall** | ลูกสมุนเรียงวงกันศัตรู |

### 🛡️ Guardian — ยักษ์ตัวเดียว
| Root | Heavy Peel (3) | +12% (R dmg) |
| A1 | Crush Slam (3) | Slam +10% ขนาด (R range) |
| A2 | Boss Brawl (3) | +12% vs บอส (R big) |
| B1 | Taunt (3) | ยักษ์ดึงศัตรูรอบตัว r+15% (N) |
| B2 | Rind Armor (3) | ยักษ์อึด +20% (N) |
| C1 | Shelter (3) | ใกล้ยักษ์ รับดาเมจ −4% (N) |
| C2 | Juice Bond (2) | ยักษ์ตีโดน ฮีลเรา 0.3% (N) |
| Cap A | **Titan Fruit** | ทุก 10 วิ Slam ใหญ่ทั้งจอ |
| Cap B | **Twin Guardians** | ยักษ์ 2 ตัว ×0.6 ดาเมจ |
| Cap C | **Protector** | ดาเมจที่เราจะโดน 25% ยักษ์รับแทน |

### 🧀 Workshop — ซัพพอร์ต โซน
| Root | Sour Mixer (3) | โซนเปรี้ยว +8% (R) |
| A1 | Acid Brew (3) | โซนลดเกราะ (รับดาเมจ +4%/rank) (N) |
| A2 | Big Batch (3) | โซนใหญ่ +12% (N) |
| B1 | Fast Cook (3) | Cheese ทำงานเร็ว 10% (N) |
| B2 | Sticky Jam (3) | โซนชะลอ 10%/rank (N) |
| C1 | Snack Break (3) | Cheese ฮีล 0.5%/ครั้ง (N) |
| C2 | Cheese Shield (2) | ทุก 12 วิ โล่ 1 ชั้น (R _shield) |
| Cap A | **Master Chef** | โซนรวมกันเป็นโซนใหญ่ระเบิด |
| Cap B | **Assembly Line** | Cheese 2 ตัว |
| Cap C | **Comfort Food** | ยืนในโซนตัวเอง ฟื้น 1.5%/วิ |

---

## สรุปงาน
- node ทั้งหมด: 18 สาย × 10 = **180 node** (Root 18 · กิ่ง 108 · Capstone 54)
- ใช้ hook เดิม (R) ≈ 45% · ต้องเขียนใหม่ (N) ≈ 55% โดยเฉพาะ Capstone ทุกตัว
- UI: หน้า Talents แท็บสาย (`_talTab`) มีอยู่แล้ว → เปลี่ยนเลย์เอาต์เป็น Root บน · 3 คอลัมน์ · Capstone ล่าง (มีกุญแจ 🔒 เมื่อเลือกอีกตัวแล้ว)

## แผน commit (หลังอนุมัติ)
1. โครงข้อมูลใหม่ `PATH_TALENTS[path]` + กติกา Capstone เลือก 1 + migration คืน TP + UI ต้นไม้ใหม่ (node ยังเป็น R ล้วน, N ยังไม่ทำงาน แต่ซ่อนไว้)
2. Momo 3 สาย — hook N + Capstone ✅ (v6.55.40)
3. Mint 3 สาย ✅ (v6.55.41)
4. Cocoa 3 สาย ✅ (v6.55.42)
5. Taro 3 สาย
6. Sesame 3 สาย
7. Yuzu 3 สาย
8. ป้าย talent บนการ์ดเลือกสาย + test + จูนราคา/ค่าตัวเลข

## คำถามเจ้าของ
1. Capstone เลือกได้ 1 ต่อสาย — โอเคไหม หรืออยากให้ลงได้ทั้ง 3 แต่แพงมาก
2. ค่า Capstone 5 TP เหมาะไหม
3. มี node ไหนอยากเปลี่ยน/ตัด
