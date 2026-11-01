# A06 — เสียงฟีเจอร์ใหม่ v8.0.85–v8.0.90 (Forge สุ่ม mod · Merge Mythic/Ancient/Divine · Relic Synergy · สถานะติดตัว · Yuzu วิวัฒนาการ · Taro Sentry · Login 30 วัน · Depths) · ใบสั่งเสียง ElevenLabs

สถานะ: 🟡 รอเสียง · เขียน 1 พ.ย. 2026 · ส่งที่ `assets/incoming/audio_new_features/` → runtime `assets/audio/new_features/`
ทำด้วย **ElevenLabs Sound Effects** โดยตรงตามคำสั่งเจ้าของ (ห้ามเสียงสร้างด้วยโค้ด/Runway แทน) · กติการ่วมดู `A00_README.md` ทุกข้อ · ทั้งหมดเป็น SFX mono · **ไม่มีเสียงพูด เนื้อร้อง หรือเสียงคน**

## ตอนนี้เป็นยังไง (ตรวจจากโค้ด v8.0.90)
- **Forge (v8.0.87)** `_forgeDone` เล่น `forge_add` ตอนได้ mod ดี, **ยืม `forge_no_points` ตอนได้ mod เสีย 💀**, ยืม `forge_star_up` ตอนอัป Lv (ระบบดาวเลิกแล้ว), `forge_remove` ตอนลบแบบเสียเงิน (เสียงเดิมของการลบฟรี)
- **Merge** `mergeNow` เล่น `'merge_rarity_'+r.to` — มีแค่ rare/epic/legend → Mythic/Ancient/Divine **ไม่มีไฟล์ ตกไปเสียง `Sfx.craft()` เก่า**
- **Relic** มี `sfx_event_relic_acquire` แล้ว (ไม่สั่งใหม่) · ตอนครบคู่ Synergy (`gainRelic` → `RELIC_SYNERGIES`) **เงียบ**
- **สถานะติดตัว (ใบอาร์ต 62)** `tickStatusArt` เล่นภาพ `st_fx_apply` ตอนมอนติดสถานะ แต่ **ไม่มีเสียง** · ฮีโร่มี `sfx_poison_tick` / `sfx_bleed_tick` / `sfx_event_poison_apply` แล้ว (ไม่สั่งใหม่) · ล้างสถานะ/บาเรียแตกบนฮีโร่ **เงียบ**
- **Yuzu (v8.0.90)** `yuzuEvolveFx` ยืม `yz_grow` · aftershock ของ Pomelo, ลูกธนู 3 ดอกของ Lime, ระเบิดสุดท้ายของ Blood Orange storm **ยืม `yz_slam` / `yz_volley`**
- **Taro Sentry (v8.0.88)** `taroSound('deploy')` map ไป `taro_smite` (ยืม) · การ์ด Extra Sentry ไม่มีเสียงของตัวเอง
- **Login 30 วัน (v8.0.86)** วันทอง (7/14/21/28/30) ใช้ `login_day7` เหมือนกันหมด → วัน 30 ไม่ต่างจากวันอื่น
- **Depths** ปลดฟีเจอร์ใช้ `sfx_feature_unlock` ทั่วไป · Ancient Chest ล็อกถึงชั้น 15 (`DIG_ANCIENT_FLOOR`) **เงียบ**

## รายการเสียง
เป้าความดัง: วัดแบบ short-term loudness ของช่วงดังสุด (LUFS-S) · peak ≤ −1 dBTP ทุกไฟล์ · ตัดเงียบหัว < 5 ms · ปลายเฟดเองไม่ตัดกุด
คอลัมน์ "โค้ดเรียก" = จุดที่ฝั่งโค้ดจะผูก (ผ่าน `ASSET_AUDIO` + `Sfx.menuCue` / `Sfx.orderCue` / `Sfx.bp` / `yuzuSound` เดิม)

### A. Forge (เมนู)
| key | ไฟล์ | ยาว | ดัง | ElevenLabs prompt | โค้ดเรียก |
|---|---|---|---|---|---|
| `sfx_forge_roll_good` | `sfx_forge_roll_good.mp3` | 0.6 s | −16 LUFS-S | `cute candy forge, soft sugar hammer tap then a quick rising sparkle shimmer and a bright two-note glass chime, magical reward, playful, clean, no voice` | `_forgeDone` kind `'add'` (mod ดีที่สุ่มได้) แทน `forge_add` |
| `sfx_forge_roll_bad` | `sfx_forge_roll_bad.mp3` | 0.8 s | −17 LUFS-S | `comic ominous little cartoon sting, soft hammer tap then a descending wobbly bassoon-like toot and a tiny puff of smoke, spooky but cute and funny, candy world, no voice` | `_forgeDone` kind `'bad'` (💀) แทน `forge_no_points` |
| `sfx_forge_lv_up` | `sfx_forge_lv_up.mp3` | 0.5 s | −16 LUFS-S | `quick ascending three-note crystal arpeggio with a soft candy pop at the top and short glitter tail, level up, bright and cute, no voice` | `_forgeDone` kind `'up'` แทน `forge_star_up` |
| `sfx_forge_remove_paid` | `sfx_forge_remove_paid.mp3` | 0.5 s | −18 LUFS-S | `small spoon scoop pulling something out, soft bubbly pop, then two tiny coins clinking away, gentle and tidy, candy kitchen, no voice` | `forgeRemove` (ลบแบบจ่าย `forgePrice`) แทน `forge_remove` |

### B. Merge ระดับใหม่ (ต้องใหญ่ขึ้นตามลำดับ ต่อจาก `sfx_merge_rarity_legend` 1.1 s เดิม)
| key | ไฟล์ | ยาว | ดัง | ElevenLabs prompt | โค้ดเรียก |
|---|---|---|---|---|---|
| `sfx_merge_rarity_mythic` | `sfx_merge_rarity_mythic.mp3` | 1.3 s | −15 LUFS-S | `magical rarity reveal fanfare, short warm brass flourish with shimmering harp glissando and deep pink-purple crystal chord, sparkles, triumphant but cute candy fantasy, no voice` | `mergeNow` → `'merge_rarity_'+r.to` (มีอยู่แล้ว แค่เพิ่มไฟล์) |
| `sfx_merge_rarity_ancient` | `sfx_merge_rarity_ancient.mp3` | 1.5 s | −14 LUFS-S | `ancient treasure rarity reveal, low soft gong swell then golden bells and a bold short brass fanfare, dusty sparkle, grand and mysterious, cute fantasy game, no voice` | เหมือนบน |
| `sfx_merge_rarity_divine` | `sfx_merge_rarity_divine.mp3` | 1.8 s | −14 LUFS-S | `divine heavenly rarity reveal, rising airy shimmer into a radiant major chord of choir-like synth pad (no words) with bright bells and a big sparkling fanfare finish, epic but sweet candy fantasy, no voice` | เหมือนบน |

### C. Relic
| key | ไฟล์ | ยาว | ดัง | ElevenLabs prompt | โค้ดเรียก |
|---|---|---|---|---|---|
| `sfx_relic_synergy` | `sfx_relic_synergy.mp3` | 0.9 s | −16 LUFS-S | `two magical charms clicking together then a resonant linked chime and a swirling sparkle burst, combo unlocked, satisfying, candy fantasy, no voice` | `gainRelic` เมื่อเจอ `syn` ครบคู่ (ครั้งเดียว) · `relic_acquire` เดิมเล่นตามปกติก่อน |

### D. สถานะติดตัว (ในด่าน เล่นถี่ → สั้นและเบา)
| key | ไฟล์ | ยาว | ดัง | ElevenLabs prompt | โค้ดเรียก |
|---|---|---|---|---|---|
| `sfx_st_burn` | `sfx_st_burn.mp3` | 0.25 s | −22 LUFS-S | `tiny soft fire ignite whoosh, small candle flame puff, short and cute, no voice` | `tickStatusArt` ตอนสถานะใหม่ = burn (คู่กับ `st_fx_apply`) |
| `sfx_st_chill` | `sfx_st_chill.mp3` | 0.25 s | −22 LUFS-S | `tiny frosty sparkle tinkle, light icy breath, short and gentle, no voice` | `tickStatusArt` chill |
| `sfx_st_freeze` | `sfx_st_freeze.mp3` | 0.35 s | −20 LUFS-S | `quick crisp ice crackle locking solid with a small glassy clink, cute candy ice, short, no voice` | `tickStatusArt` / `applyFreeze` frozen |
| `sfx_st_shock` | `sfx_st_shock.mp3` | 0.25 s | −22 LUFS-S | `small electric crackle zap, tiny static sparks buzzing briefly, soft not harsh, short, no voice` | `tickStatusArt` shock (Taro Tempest / Static Shock) |
| `sfx_st_stun` | `sfx_st_stun.mp3` | 0.35 s | −21 LUFS-S | `cartoon dizzy stun, soft bonk then tiny circling bird tweets as short twinkle, comic and cute, no voice` | `tickStatusArt` stun |
| `sfx_st_mark` | `sfx_st_mark.mp3` | 0.3 s | −21 LUFS-S | `small target lock-on ping, soft high bell ding with a tiny whoosh, clear and short, no voice` | `tickStatusArt` mark (Titan Mark / Forge mark) |
| `sfx_st_sour` | `sfx_st_sour.mp3` | 0.3 s | −22 LUFS-S | `tiny sour juice splash with a fizzy bubbly pop, citrus squirt, cute and short, no voice` | `tickStatusArt` sour |
| `sfx_st_cleanse` | `sfx_st_cleanse.mp3` | 0.5 s | −19 LUFS-S | `gentle purifying sparkle wash, soft airy whoosh upward with a clean bright chime, relief, cute, no voice` | ฮีโร่หายพิษ/สถานะเสีย (จุดเดียวกับ FX one-shot "หายพิษ" ใบ 62) |
| `sfx_st_barrier_break` | `sfx_st_barrier_break.mp3` | 0.5 s | −18 LUFS-S | `candy glass bubble shield cracking and shattering into small sugary shards, crisp but soft, short tail, no voice` | บาเรียฮีโร่แตก (จุดเดียวกับ FX "Barrier แตก" ใบ 62) |

### E. Yuzu
| key | ไฟล์ | ยาว | ดัง | ElevenLabs prompt | โค้ดเรียก |
|---|---|---|---|---|---|
| `sfx_yz_evolve_f2` | `sfx_yz_evolve_f2.mp3` | 1.0 s | −16 LUFS-S | `cute creature transformation, swirling leaves and rising magical shimmer building up, then a bright pop and sparkling chime, evolving, playful fantasy, no voice` | `yuzuEvolveFx` เมื่อร่างใหม่ = 2 → `yuzuSound('evolve_f2')` แทน `grow` |
| `sfx_yz_evolve_f3` | `sfx_yz_evolve_f3.mp3` | 1.4 s | −15 LUFS-S | `powerful cute creature transformation, longer rising magical swirl with deep whoosh and building sparkles, then a big radiant burst with heroic short fanfare chord, final evolution, no voice` | `yuzuEvolveFx` ร่าง 3 |
| `sfx_yz_aftershock` | `sfx_yz_aftershock.mp3` | 0.6 s | −17 LUFS-S | `soft heavy ground rumble aftershock, thick fruit thump into the ground with rolling low tremor and pebbles, punchy but cute, no voice` | `yuzuCommandLand` 2 ครั้งหลังลง (350/700 ms) แทน `slam` |
| `sfx_yz_triple_arrow` | `sfx_yz_triple_arrow.mp3` | 0.5 s | −17 LUFS-S | `three quick bow arrows released in a fan almost together, sharp twangs and whooshing seed arrows, crisp, cute fantasy, no voice` | Lime Unique (ยิง 3 ดอกแบบพัด) แทน `volley` |
| `sfx_yz_storm_final` | `sfx_yz_storm_final.mp3` | 0.9 s | −15 LUFS-S | `big magical juice explosion, swirling sigil charge then a bursting splash boom with fizzy sparkles raining down, grand finale, cute candy fantasy, no voice` | `yuzuTickStorm` เมื่อ `fin` (ระเบิดสุดท้าย) แทน `slam` |

### F. Taro Sentry
| key | ไฟล์ | ยาว | ดัง | ElevenLabs prompt | โค้ดเรียก |
|---|---|---|---|---|---|
| `sfx_taro_deploy` | `sfx_taro_deploy.mp3` | 0.5 s | −18 LUFS-S | `small magical turret landing on ground with a soft thunk, then electric hum powering on and a tiny spark ping, cute candy gadget, no voice` | `taroSound('deploy')` → ลบ map ไป `smite` ให้เรียก `taro_deploy` |
| `sfx_taro_extra_sentry` | `sfx_taro_extra_sentry.mp3` | 0.6 s | −17 LUFS-S | `second magical turret popping into place beside another, quick double thunk and a rising electric chime, upgrade added, cute, no voice` | ตอนการ์ด Extra Sentry เพิ่มป้อมใหม่ (deploy ที่ทำให้จำนวนเกินเดิม) |

### G. Login 30 วัน / Depths (เมนู)
| key | ไฟล์ | ยาว | ดัง | ElevenLabs prompt | โค้ดเรียก |
|---|---|---|---|---|---|
| `sfx_login_day30` | `sfx_login_day30.mp3` | 1.6 s | −14 LUFS-S | `big treasure chest unlocking with heavy latch click, lid creaks open, golden coins and gems burst out with grand sparkling fanfare, month reward celebration, cute candy fantasy, no voice` | `loginPopup` claim เมื่อ `res.i` = วันที่ 30 (index 29) แทน `login_day7` |
| `sfx_dig_unlock` | `sfx_dig_unlock.mp3` | 1.0 s | −16 LUFS-S | `underground cave entrance opening, rumbling stone slide and pebbles, then a lantern lights up with warm chime and sparkles, new area unlocked, cute, no voice` | `featureReveal` / `featRevealNext` เมื่อฟีเจอร์ = `dig` (แทน `feature_unlock` เฉพาะ Depths) |
| `sfx_dig_ancient_locked` | `sfx_dig_ancient_locked.mp3` | 0.4 s | −20 LUFS-S | `small locked treasure chest rattling, chain and padlock jiggle, short dull clunk, not opening, cute and comic, no voice` | แตะแถว Ancient Chest ที่ยังล็อก (ชั้น < 15) ในหน้า Depths |
| `sfx_dig_ancient_open` | `sfx_dig_ancient_open.mp3` | 0.8 s | −17 LUFS-S | `ancient padlock clicking open with a deep satisfying clunk, chains falling away, mysterious golden shimmer, cute fantasy, no voice` | ลงถึงชั้น 15 ครั้งแรก (`d.depth` ข้าม `DIG_ANCIENT_FLOOR`) |

**รวม 29 key / 29 ไฟล์** (A 4 · B 3 · C 1 · D 9 · E 5 · F 2 · G 4)

ไม่สั่งเพราะมีแล้ว: `sfx_event_relic_acquire` (เก็บ Relic), `sfx_poison_tick` / `sfx_bleed_tick` / `sfx_event_poison_apply` (พิษ/เลือดฮีโร่), `sfx_login_claim` (รับวันปกติ), `sfx_feature_unlock` (ปลดฟีเจอร์อื่น)

## พารามิเตอร์ ElevenLabs
- Sound Effects: `duration_seconds` = ค่าคอลัมน์ "ยาว" (+0.2–0.5 s เผื่อตัด) · `prompt_influence` 0.5–0.7 · สร้าง 3–4 แบบต่อ key แล้วเลือก 1 · เก็บ donor ดิบไว้ใน `donors/`
- หลังได้ไฟล์: ตัด/เฟด/ปรับระดับแบบ mechanical เท่านั้น (ไม่ผสมเสียงสังเคราะห์เพิ่ม) · MP3 44.1 kHz mono 128–160 kbps
- ชุด B ต้องฟังแล้วรู้ลำดับ Legend < Mythic < Ancient < Divine ทันที · ชุด D ต้องแยกกันออกแม้เล่นพร้อมกันหลายตัว

## ข้อห้าม
- ห้ามเสียงพูด/คำ/เนื้อร้อง/เสียงหัวเราะคน · "choir-like" ใน Divine ต้องเป็นแพดไม่มีคำ
- ห้ามเลียนแบบเพลง ศิลปิน หรือเสียงเกมที่มีอยู่จริง (รวมเสียงวิวัฒนาการของเกม/อนิเมะดัง)
- ห้ามเสียงสล็อต/คาสิโน · ห้ามเสียงน่ากลัวจริงจัง (bad mod = "ตลกขำ ๆ" ไม่ใช่สยอง)
- ชุด D (สถานะ) ห้ามยาวเกิน 0.5 s และห้ามแหลมบาดหู — เล่นซ้อนบ่อยในด่าน

## โน้ตฝั่งโค้ด
- เพิ่มใน `ASSET_AUDIO` แบบ literal `'assets/audio/new_features/sfx_….mp3'` (build-www คัดลอกเฉพาะ path ที่เขียนตรง ๆ) · ไฟล์ไหนยังไม่มา **ห้ามลงทะเบียน path ปลอม** เสียงเดิมเล่นต่อเป็น fallback (`menuCue(...)||เดิม`)
- เมนู (A, B, G): `Sfx.menuCue` (จำกัด 2 เสียงซ้อน) · ในด่าน (C, D, F): `Sfx.orderCue` / `Sfx.bp` พร้อม gap — สถานะ D จำกัดรวม ≤ 3 เสียง/0.3 วิ (ใช้ตัวนับ `pops<6` ใน `tickStatusArt` เดิมเป็นฐาน) · Yuzu (E): `yuzuSound(name)` → `Sfx.bp('yz_'+name)`
- `_forgeDone`: แยก map kind → `forge_roll_good` / `forge_roll_bad` / `forge_lv_up` / `forge_remove_paid` แล้ว fallback ไป key เดิม
- `mergeNow`: ไม่ต้องแก้โค้ด แค่ลงทะเบียน `sfx_merge_rarity_mythic|ancient|divine`
- ใช้ mute/สไลเดอร์ SFX เดิม · ห้ามสร้าง AudioContext/HTML Audio ใหม่ · แก้เทสที่ extract เมธอดเหล่านี้ถ้าเพิ่ม helper
- เล่นเฉพาะตอนเกิดเหตุจริง (ไม่ใช่ตอนวาดหน้าใหม่)

## ส่งมอบ
ส่งที่ `assets/incoming/audio_new_features/` พร้อม
- `MANIFEST.json` (ต่อไฟล์: `key`, `file`, `bytes`, `sha256`, `durationMs`, `loop` (false ทั้งหมด), `peakDbtp`, `lufsS`)
- `PROMPTS.json` (prompt จริง, `duration_seconds`, `prompt_influence`, รหัสงาน/วันที่ ElevenLabs, donor ที่เลือก)
- `QA_REPORT.json` (decode ได้, ไม่เงียบ, peak ≤ −1 dBTP, ความยาวตรง ±15%, mono 44.1 kHz)
- `AUDITION.html` หรือรายการฟังเทียบชุด B/E (ไม่บังคับ)

(ฝั่งเสียงกรอกตอนส่ง)
