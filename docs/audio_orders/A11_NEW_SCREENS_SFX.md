# A11 — ใบรวมเสียงที่ยังขาดทั้งหมด (Sesame เวท · ฉากเงียบ · เสียงพากย์ที่หาย) · ใบสั่งเสียง

สถานะ: 🟢 ส่งครบ 67 · ผูกแล้ว v8.1.65 · รอเจ้าของฟังตรวจ
เครื่องมือ: **ElevenLabs** — SFX ใช้ Sound Effects (ต้นฉบับ) · เสียงพูดใช้ **เสียงที่บันทึกไว้แล้ว** ของ A07 (Ruby: `assets/incoming/audio_voice_acting/VOICES.json` key `ruby` · Sesame: ชุดแก้ใน `assets/incoming/audio_voice_fix/`) · ห้ามสร้างเสียงใหม่ ห้ามเสียงสร้างด้วยโค้ด/Runway

## สิ่งที่ตรวจพบ (9 พ.ย.)
- คีย์เสียงที่โค้ดเรียกมีไฟล์ครบ แต่ **ฟีเจอร์ใหม่หลายหน้าใช้แค่เสียงกดปุ่มกลาง** และหน้าเมนูเก่าบางหน้าเปิดเงียบ
- **Sesame:** 10 เวทใช้เสียงร่ายเดียวกัน · **ฉากรับ Sesame เข้าทีม (Motion Comic S10) ไม่มีประโยคเปิดตัว** ขณะที่ Mint/Cocoa/Taro/Yuzu มี
- **Ruby:** กล่องสอนแบบชี้ปุ่ม (ดาว 3 ดวง, Rank Reward) และประโยคจบภารกิจ ไม่มีไฟล์เสียง → ได้ยินแค่เสียงพึมพำ (v8.1.60 แก้โค้ดให้เล่นเสียงจริงทันทีที่ไฟล์มา)
- เพลงประกอบยังรอใบ A04 (ติดสิทธิ์ Music Generation) — ไม่อยู่ในใบนี้

## รูปแบบไฟล์
MP3 mono 44.1 kHz 128 kbps · peak ≤ −1 dBTP · ตัดเงียบต้นไฟล์ ≤ 40 ms · ข้อความเสียงพูดใน MANIFEST ต้องตรงตัวอักษร ใช้ `’`

---
## ส่วน A — Sesame (20)
### A1 — เสียงร่ายเวทราย Recipe (10 ไฟล์ · SFX)
| key | เวท | เสียง |
|---|---|---|
| `ses_cast_ppp` | Solar Cataclysm | ไฟคำราม + เสียงหวีดอุกกาบาตลงหนัก |
| `ses_cast_mmm` | Tempest Chakram | จักรลมหมุนตัด ซวบ ๆ 3 ครั้ง |
| `ses_cast_bbb` | Tidal Armor | คลื่นน้ำม้วนเป็นเกราะ ใสกังวาน |
| `ses_cast_ppm` | Sunlance | หอกแสงพุ่งเร็ว เสียงแหลมสั้น + ปัง |
| `ses_cast_ppb` | Magma Garden | ลาวาเดือดปุด ๆ แตกจากพื้น |
| `ses_cast_pmm` | Prismatic Armament | คริสตัลกระทบกันใส + พลังเพิ่ม (power-up) |
| `ses_cast_mmb` | Cyclone Confluence | พายุหมุนดูด ฮู่ววว เข้าหาศูนย์กลาง |
| `ses_cast_pbb` | Crystal Fault | คริสตัลแตกร้าวต่อเนื่อง 5 จังหวะสั้น |
| `ses_cast_mbb` | Mistwalk Aegis | หมอกพัด + โล่เวทเปิด นุ่มเบา |
| `ses_cast_pmb` | Prismatic Blast | วงระเบิดสามโทน บูม-กระเพื่อม |

### A2 — Sesame เรียกชื่อเวท (10 ไฟล์ · เสียงพูด · บทอนุมัติแล้ว)
key `vo_sesame_spell_<code>` · เล่นแทนประโยครวมตอนร่าย (โค้ดยังสลับกับ `vo_sesame_unique_*` ไม่ให้ซ้ำติดกัน)
| key | บท |
|---|---|
| `vo_sesame_spell_ppp` | Fall, little suns. |
| `vo_sesame_spell_mmm` | Spin, winds. |
| `vo_sesame_spell_bbb` | Tide, hold me. |
| `vo_sesame_spell_ppm` | Sunlance. |
| `vo_sesame_spell_ppb` | Bloom, magma. |
| `vo_sesame_spell_pmm` | Shine brighter. |
| `vo_sesame_spell_mmb` | Gather in. |
| `vo_sesame_spell_pbb` | Crack open. |
| `vo_sesame_spell_mbb` | Into the mist. |
| `vo_sesame_spell_pmb` | All three… now. |


---
## ส่วน B — ฉากที่ยังเงียบ (SFX 26)
### B1 — ร้านด้าย / Mochi Pass (4)
| key | เมื่อไหร่ | เสียง | ยาว |
|---|---|---|---|
| `ui_thread_buy` | ซื้อแพ็กด้ายสำเร็จ | ไหมม้วนคลาย + ระฆังแก้วใส 2 โน้ต | ≤1.2 วิ |
| `ui_thread_first_bonus` | ซื้อครั้งแรกได้ 2 เท่า | แบบเดียวกัน + ประกายวิบวับขึ้นเสียงสูง | ≤1.5 วิ |
| `ui_pass_claim` | กดรับด้ายรายวันของ Mochi Pass | กระดิ่งตั๋วเล็ก + ไหมลอย | ≤0.9 วิ |
| `ui_shop_soon` | กดซื้อตอนยังไม่เปิดขาย | ปิ๊บต่ำนุ่ม ๆ (ไม่ใช่ error แรง) | ≤0.5 วิ |

### B2 — Wardrobe / ของแต่ง (8)
| key | เมื่อไหร่ | เสียง | ยาว |
|---|---|---|---|
| `ui_wardrobe_open` | เปิด Wardrobe | ประตูตู้ไม้เล็กเปิด + ไม้แขวนกระทบ | ≤0.8 วิ |
| `ui_cos_buy` | ซื้อของแต่ง | ห่อของขวัญฉีก + ประกาย | ≤1.0 วิ |
| `ui_cos_equip` | สวม | ผ้าสะบัด + ดิ๊ง เบา | ≤0.5 วิ |
| `ui_cos_unequip` | ถอด | ผ้าสะบัดกลับ เสียงต่ำกว่า | ≤0.4 วิ |
| `ui_cos_dye` | กด 🎨 ย้อมสี | พู่กันจุ่มสี ป๊อปเบา | ≤0.4 วิ |
| `cos_dash_bubble` | พุ่งตอนสวม Bubble Dash | ฟองสบู่แตกกระจาย | ≤0.4 วิ |
| `cos_dash_confetti` | พุ่งตอนสวม Confetti Dash | ปืนกระดาษสีป็อป | ≤0.4 วิ |
| `cos_dash_cream` | พุ่งตอนสวม Whipped Cream Dash | วิปครีมพ่นฟู่ | ≤0.4 วิ |

### B3 — ทำเนียบ (3)
| key | เมื่อไหร่ | เสียง | ยาว |
|---|---|---|---|
| `ui_rank_open` | เปิดแท็บ Ranks | แตรเล็กประกาศ 3 โน้ต | ≤1.0 วิ |
| `ui_rank_top3` | อันดับของเราอยู่ใน 3 อันดับแรก | ฉาบเล็ก + เสียงเชียร์เบา (ไม่มีคำ) | ≤1.5 วิ |
| `ui_name_saved` | บันทึกชื่อสำเร็จ | ปากกาขีด + ติ๊ก | ≤0.5 วิ |

### B4 — ภารกิจ / ของตกพื้น (4)
| key | เมื่อไหร่ | เสียง | ยาว |
|---|---|---|---|
| `mission_bonus_get` | จบภารกิจโดยเป้ารอง ⭐ ยังอยู่ | ดาวกระทบ 3 ครั้งไล่ขึ้น | ≤1.0 วิ |
| `mission_loot_burst` | ของทะลักจากจุดภารกิจ | ฝาโหลขนมเด้ง + ของกระจาย | ≤0.9 วิ |
| `pickup_sugar_piece` | เก็บก้อน Sugar (เล่นถี่) | ลูกกวาดกระทบเบา ๆ ใส · มี 3 pitch (ไฟล์เดียว โค้ดสุ่ม pitch) | ≤0.25 วิ |
| `pickup_gear_rare` | เก็บกล่องอุปกรณ์ Rare ขึ้นไป | กล่องของขวัญสั่น + ประกายสูง | ≤0.8 วิ |

### B5 — หน้าเมนูที่ยังเงียบ (7)
| key | เมื่อไหร่ | เสียง | ยาว |
|---|---|---|---|
| `ui_codex_open` | เปิด Codex / Bestiary / Skill Archive | หนังสือเล่มหนาเปิด + หน้ากระดาษพลิก | ≤0.8 วิ |
| `ui_page_flip` | เปลี่ยนแท็บ/หน้าในสมุด | พลิกกระดาษ 1 หน้า | ≤0.3 วิ |
| `ui_map_open` | เปิดแผนที่ Delve / Atlas | กระดาษแผนที่คลี่ + ลมเบา | ≤0.8 วิ |
| `ui_stage_swipe` | เลื่อนเลือกด่าน (ลูกศรซ้าย/ขวาใน Lobby) | การ์ดเลื่อนสั้น | ≤0.3 วิ |
| `ui_bossrush_open` | เปิด Boss Rush | กลองหนัก 2 ครั้ง ดุดัน | ≤1.0 วิ |
| `ui_curse_open` | เปิดหน้าเลือก Curse/เตรียมตัว endgame | เสียงลึกลับต่ำ + ระฆังไกล | ≤1.2 วิ |
| `ui_pact_claim` | รับรางวัล Pact milestone | ตราประทับลงกระดาษ + ประกาย | ≤0.8 วิ |


---
## ส่วน C — เสียงพากย์ที่หาย (21)
### C1 — ประโยคที่หาย (6)
| key | ผู้พูด | บท | เล่นเมื่อ |
|---|---|---|---|
| `vo_ruby_objective_safe` | Ruby | We did it! Another little piece of flavor is safe. Nice work! | จบภารกิจในด่าน (`completeWaveObjective`) |
| `vo_ruby_guide_rank_1` | Ruby | Rank up! You earned a Rank Reward. | สอน Rank Reward ครั้งแรก |
| `vo_ruby_guide_rank_2` | Ruby | Tap Rank Rewards to pick one. It stays forever. | ต่อจากบรรทัดก่อน |
| `vo_ruby_guide_stars_1` | Ruby | Each floor has three stars: clear it, finish with 70% HP, and never fall below 30% HP. | สอนดาวครั้งแรกที่ Lobby (ยาวได้ ≤ 5.5 วิ) |
| `vo_ruby_guide_stars_2` | Ruby | New stars give bonus Sugar. Tap the stage box any time to replay a floor. | ต่อจากบรรทัดก่อน |
| `vo_sesame_unlock` | Sesame | I remember now… let’s go together. | ฉาก S10 Sesame เข้าทีม (เทียบ `vo_mint_unlock`) · ✅ เจ้าของอนุมัติบท 10 พ.ย. 2026 |

### C2 — Ruby บทสอนด่านแรก (15 · เพิ่ม 9 พ.ย. ตามเจ้าของถาม "เสียง Ruby ตอนสอนมีหรือยัง" → ยังไม่มีเลย)
บทคือข้อความในเกมอยู่แล้ว (`coachSteps`) · หน้าอธิบาย = เนื้อหาการ์ด (ขึ้นบรรทัดใหม่ = เว้นวรรค) · คำสั่งสั้น = หัวการ์ดตอนทำ · โค้ดพร้อมแล้ว v8.1.63 (หาเสียงจากข้อความ)
| key | บท |
|---|---|
| `vo_ruby_tut_welcome` | Hi, I’m Ruby! The Heart Seed broke your curse — you’re a person again! Let’s get you ready to save the others. |
| `vo_ruby_tut_move` | Slide one finger to walk. Lift it to stop. |
| `vo_ruby_tut_attack` | Your Heart Seed fights on its own. Just walk near the sour critters! |
| `vo_ruby_tut_sweets` | Beaten foes drop stolen sweets. Walk over them to take them back! |
| `vo_ruby_tut_cards` | Full EXP bar = 3 flavor cards. Tap one to read, tap again to take it. |
| `vo_ruby_tut_dash` | Green button: zoom past danger. It needs a moment to recharge. |
| `vo_ruby_tut_unique` | Pink button: your seed’s big attack. It charges up again over time. |
| `vo_ruby_tut_hp` | HP at zero ends the stage. Pink mochi hearts heal you. |
| `vo_ruby_tut_ready` | Training complete! Use your starter Sugar to upgrade one core, then enter the pantry. |
| `vo_ruby_tut_move_go` | Slide your finger to walk |
| `vo_ruby_tut_attack_go` | Defeat the enemies |
| `vo_ruby_tut_sweets_go` | Pick up the sweets |
| `vo_ruby_tut_cards_go` | Pick a card |
| `vo_ruby_tut_dash_go` | TAP Dash two times |
| `vo_ruby_tut_unique_go` | TAP your Unique |
ความยาว: หน้าอธิบาย ≤ 6 วิ · คำสั่งสั้น ≤ 1.8 วิ · น้ำเสียงใจดี ชัด ช้ากว่าปกติเล็กน้อย (ผู้เล่นใหม่)

✅ บท `vo_sesame_unlock` ได้รับอนุมัติจากเจ้าของแล้วเมื่อ 9 พ.ย. 2026 (บทอื่นในส่วน C เป็นข้อความที่อยู่ในเกมแล้ว)

---
## สรุป
| ส่วน | ไฟล์ |
|---|---|
| A Sesame เวท (SFX 10 + เสียงพูด 10) | 20 |
| B ฉากเงียบ SFX | 26 |
| C เสียงพากย์ที่หาย (C1 6 + C2 บทสอน 15) | 21 |
| **รวม** | **67** |

## ส่งมอบ
`assets/incoming/audio_a11/` (แยกโฟลเดอร์ย่อย `sesame/`, `sfx/`, `voice/` ได้) + `MANIFEST.json` (key, file, bytes, sha256, duration_ms, kind sfx/voice, speaker, voice_id, text) + `PROMPTS.json` + `QA_REPORT.json`

## โน้ตสำหรับ AI ที่ผูกเสียง
- **ส่วน A** — SFX → `assets/audio/sfx/sesame_a10/` + `ASSET_AUDIO` · เล่นใน cast ของแต่ละเวทแทน `ses811_cast` (ไม่มีไฟล์ = ใช้เดิม) · เสียงพูด → `assets/audio/acting/` + `A07_CATALOG` role `sesame` · `VoiceActing.unique()` ของ Sesame เลือก `vo_sesame_spell_<code>` 60% / ประโยครวม 40% · เว้นเสียงพูด ≥2.5 วิ
- **ส่วน B** — ไฟล์ไป `assets/audio/sfx/a11/` · `Sfx.menuCue?.(key,vol)` · จุดเรียก: B1 `threadBuy`/`Iap.grant`/`claimPass` · B2 `buildWardrobe` (เข้าจากหน้าอื่น)/`cosTap`/`Cos.nextDye`/`cosDashFx` · B3 `buildRanking`/`Board.top` (`myRank<=3`)/`boardRename` · B4 `completeWaveObjective` (`_ob>0`)/`missionLootBurst`/`collectLoot` sugar (throttle 60 ms, vol ≤0.35)/gear tier≥rare · B5 `buildBestiary`/`buildSkillArchive`/`buildItemCodex`/`buildAtlasMap`/ลูกศรด่าน Lobby/`buildBossRush`/`openEndgamePreparation`/`claimPactMilestones`
- **ส่วน C** — `assets/audio/acting/` + `A07_CATALOG` (text ตรงตัวอักษร → `rubySay`/`rubyGuide` หาเสียงจากข้อความเอง ไม่ต้องแก้โค้ด) · `vo_sesame_unlock`: ใส่ `voiceKey` ให้ shot สุดท้ายของ `MOTION_COMICS.s10` (อย่าเพิ่ม shot — เทส story-motion-art ล็อก 4 shots) · อัปเดตจำนวนใน `tests/voice-acting-integration.test.cjs`

## ส่งมอบ — 9 พ.ย. 2026

ส่ง 67 MP3 ที่ `assets/incoming/audio_a11/` จาก ElevenLabs พร้อมต้นฉบับ prompt, manifest, QA และ AUDITION.html · ผ่านการตรวจเทคนิคทุกไฟล์ · ยังไม่ผูก runtime หรือฟังตรวจเชิงศิลป์ · บท `vo_sesame_unlock` เจ้าของอนุมัติแล้ว · A04 มีเพลงครบ ผูกแล้ว และเจ้าของฟังรับแล้ว
