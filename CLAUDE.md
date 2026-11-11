# Version line

Current release: **8.1.84**. Next release:8.1.85. Fetch the deploy branch before new work.

# Latest delivery: v8.1.84 — League phase 5: Reforge row currencies + Recipe Ink move (phase 4 Siege skipped for now by owner)

Owner picked: 4 currencies, move (source loses mod), drops from League + normal drops (not Bazaar). CURRENCY += berryjam 🍓 / honeydrop 🍯 / starsugar ⭐ / recipeink 🖋️ (no icon art yet → prize_currency + d.tint). forgeRowCur(line): 0 transmute · 1 berryjam · 2 honeydrop · 3–5 starsugar; forgeUpPrice = row 1 forgePrice, else 1+floor(crafts/6). Add/Remove = Twist Cream forgePrice (unchanged). _forgePay(item,key,price) / _forgeDone(...,key). Move: 🖋️ button per filled non-bad row (tag mv_i) → forgeOpenMove → panel type 'move' (drawForgeMovePanel: items with an empty open row whose forgePool takes the mod) → forgeMove (1 Ink, source row null, Lv clamped to target forgeStarCap). Drops: CURRENCY_DROP_POOLS rare/epic/legend gain row currencies (common/Bazaar box stay Twist Cream); leagueCurrencyDrop on every LEAGUE_MISSIONS completion (1, full 2, Herald +1). Save._reforge84 starter gift (4/2/1/1) for played saves. Test tests/reforge-rows.test.cjs. Next: phase 4 Siege (Delve) when owner wants, phase 6 Golem, phase 7 Memory Book + art (incl. 4 currency icons).

# Previous delivery: v8.1.83 — League phase 3: Hunger Herald (C1-1) + Grandma's Pot (C1-3)

LEAGUE_MISSIONS const (sigSpawnAt _sigForce + 70s replay bounty). hungerHerald (Harbinger): hh* · Herald = sigSpawnAt elite ×1.3 (full hp ×1.5), e._herald, wanders via e._goTo (new point every 2.6–4s, biased away from player) · 2/3 gates spawn packs of 3/4 every 3.4/2.6s · kill Herald (sigOnKill → hhDown) = gates close + loot incl. forge currency (no noCur) · despawned Herald respawns at gate 0. C1-1 is fully planned (CH1_EARLY_WAVE_PLAN) so Herald shows only as the first replay bounty (`lead` + this._bountyLead in replayBountyTick). grandmasPot (Ritual idea A): gp* · recipe 🍓🍋🍫 (light 3+3 · full 3+2+2, 50% +⭐ from elites) · kills drop ingredients (42% + pity 4, 75% wanted) · walk over = carry (🧺 above player) · pot ring 100 = deposit needed ones · spoil 16s/12s · trickle spawns when <6 foes within 520 · nothing for 12s → Grandma tosses one · done = gpServe loot (⭐ ×1.6). C1-3 objectives ['grandmasPot','hunt','capture','purge'] lead → wave 0. Next: phase 4 Siege of the Hunger (Delve room).

## 1. โปรเจกต์
Mochi Mayhem — เกมมือถือ survival-like ธีมโมจิน่ารัก เป้าหมาย Google Play · เจ้าของทำงานบนมือถือ เป็นผู้กำกับ ให้ AI เขียนโค้ดทั้งหมด

## 2. การตัดสินใจที่ล็อกแล้ว (อย่าเปลี่ยนโดยไม่ถาม)
- **คุมธีมโดยรักษาเกมเดิม (27 ต.ค.):** เก็บโครงหน้า ตำแหน่งปุ่ม เส้นทาง ระบบ อาร์ตเดิม · ปรับแค่ฟอนต์/สีแผง/ขอบ/สถานะปุ่มให้เข้าชุด · ImageGen เฉพาะชิ้นที่ขาด · ภาพ42มุมใน docs/design/unified_theme เป็นแค่ภาพสำรวจ · เปลี่ยนโครงหน้า/ระบบต้องมีคำขอจากเจ้าของ
- Phaser 3 เว็บ → Capacitor → APK/AAB → Play Store
- **กฎเหล็ก: ยิ่งยาก รางวัลยิ่งดี** (Story ระดับเดียว · endgame ยากตามความลึก Delve `delveLoot` · Boss Rush ซ่อน)
- ผู้เล่นเป้าหมายแบบผสม: ต้นเกมง่ายน่ารัก · ระบบลึกค่อยเปิดหลัง Chapter 2–3 · ห้ามเพิ่มภาระช่วงต้น
- เสียง: ใช้ ElevenLabs ตามใบสั่งเสียง (v8.0.38–39 เจ้าของสั่ง ห้ามใช้เสียงสร้างด้วยโค้ด/Runway แทน)

## 3. โครงไฟล์
- `index.html` (โหลด phaser + game.js) · `game.js` = โค้ดเกมทั้งหมด (~21k บรรทัด) · `phaser.min.js` 3.80.1
- `assets/` รูป/เสียงจริง · คีย์อยู่ใน `ASSET_IMAGES` / `ASSET_SHEETS` / `ASSET_FX` / `ASSET_AUDIO` / `TEMPLE_UI` (URL ต้องเป็น literal `'assets/…'` เพราะ build-www คัดลอกเฉพาะที่เจอ) · อาร์ตเข้า `assets/incoming/<batch>/` → pack script `scripts/pack-*.py` → `assets/art/<batch>/` (ใช้ skill wire-art)
- โหลดอาร์ตใหม่แบบ lazy เสมอ (stage/menu/hero) ห้าม boot — งบ GPU บูตเต็ม ~300 MB
- `docs/art_orders/` ใบสั่งอาร์ต (README = ตารางสถานะ) · `docs/audio_orders/` ใบสั่งเสียง · `docs/LORE.md`/`STORY_CANON.md` เนื้อเรื่อง · `docs/HANDOFF_NEXT_AI.md`
- `tests/*.cjs` (method-extract vm tests; เมธอดใหม่ต้องเพิ่มในรายการ extract ของเทสที่เกี่ยว) · `npm run check` รวมทุกเทส
- Build: `scripts/build-www.mjs` → www/ (esbuild minify) · `.github/workflows/pages.yml` deploy GitHub Pages (live update ของ debug APK ผ่าน `server.url`) · `android.yml` debug APK · `release-aab.yml` signed AAB (`docs/RELEASE_SIGNING.md`)
- โน้ตเทคนิคยุคแรก (VFX flipbook, การตัด sprite, raw assets) อยู่ใน `docs/CLAUDE_HISTORY.md`

## 4. สถานะปัจจุบัน
- ดูเวอร์ชันที่ `GAME_VERSION` + บล็อก Latest delivery ด้านบน · ประวัติทุกเวอร์ชัน `docs/CLAUDE_HISTORY.md`
- ระบบหลักครบ: Story 3 Chapter 15 ด่าน → Mochi Delve/Pinnacle, Temple Weave/Depths/Rank Rewards, Gear+Merge (Common→Divine)+Forge (random mods, Twist Cream), Talent ราย Build, ฮีโร่ 6 ตัว ×3 Build (Sesame WIP), Rewards hub (Login/Daily/Awards)

### บั๊กที่เคยเจอ (กันพลาดซ้ำ)
- Scale.RESIZE คืน logical CSS px แล้ว — อย่าคูณ/หาร DPR เอง ใช้ `config.resolution=RENDER_DPR`
- scrollFactor(0) ไม่รับ camera zoom → UI ใช้ sf1 · `camera.ignore(group)` เป็น snapshot → ต้อง `this.camWorld(obj)` ทุกครั้งที่ spawn
- shape `setInteractive()` กดไม่ติดบนมือถือ → ใช้ tap zone ตรวจพิกัดเอง (`_zone` / `tapZones`)
- pool เต็ม → `getFirstDead` คืน null → ต้อง guard ทุกครั้ง
- `physics.world.timeScale` กลับด้าน (มาก = ช้า): gameSpeed ใช้ `1/s`, hitStop ใช้ค่ามาก
- Graphics ใน vm test stub อาจไม่มี `fillRect`/`setVisible`/`once` → ใช้ optional call หรือ property

## 5. ถัดไป
- League missions (เจ้าของ 11 พ.ย.) แผน 7 phase ใน `docs/design/OWNER_NOTES_POE_LEAGUES.md` · phase 1 Frozen Pantry v8.1.81 · phase 2 Hunger's Mouth + Creeping Roots v8.1.82 · phase 3 Herald + Grandma's Pot v8.1.83 · phase 5 Reforge v8.1.84 (phase 4 ยังไม่ทำ) · ใบสั่งอาร์ต 72 (15 ไฟล์ ภารกิจ League phase 1–3 + ไอคอน Honey Drop/Recipe Ink) รออาร์ต
- ภารกิจ 4 รอบ (เจ้าของ 10 พ.ย. ชอบทุกอัน): รอบ 1 v8.1.77 · รอบ 2 v8.1.78 · รอบ 3 v8.1.79 เสร็จ · รอบ 4 = ใบสั่งอาร์ต 71 (16 ไฟล์) รออาร์ต · เจ้าของอาจปรับความถี่แท่นเริ่ม/Overcharge หลังเล่นจริง
- ใบ 70 ฉาก Mochi Patrol (14 ไฟล์) · รออาร์ต · โค้ด buildPatrol ใช้ภาพชั่วคราว v8.1.70
- ใบ 69 สกินเต็มตัว Festival · ผูกแล้ว 7/68 (v8.1.73 pets HD/icons/banner) · ตัวฮีโร่ 61 ไฟล์ยังเป็น candidates (เจ้าของ 10 พ.ย.: ของติดตัว ปีก/ฮาโล/วง เลิกขายแยก → สกินเต็มตัว ทุกที่รวมในด่าน; ขายแยกเหลือ pet/trail/dash/pop) · รออาร์ต · โค้ด: ช่อง skin + heroTex(key) fallback + คืนด้ายของที่เลิกขาย
- ใบ 65 Daily Login 30 วัน ผูกแล้ว v8.1.43 · รอ QA มือถือ · A09 เสียง Ruby ในด่าน ผูกแล้ว v8.1.43
- Simple Forge เสร็จ v8.0.83 รอเจ้าของตรวจบนมือถือ (ราคา/ความรู้สึก 3 การ์ด)
- ใบสั่ง 62 สถานะติดตัว ผูกแล้ว v8.0.85 · รอ QA มือถือ
- อาร์ต 61 ฉากหลังล้มบอส ผูกแล้ว v8.0.84 · รอ QA มือถือ
- ใบสั่ง 63 ผูกครบ 8 แล้ว v8.0.95 · รอ QA มือถือ · A06 เสียง 28 ผูกแล้ว v8.0.91
- อาร์ตที่รอส่ง: 35 Yuzu Orchard, 36 Ruby (โค้ดใช้ภาพชั่วคราว), 49 กรอบโปรไฟล์, 50–54 เมนู (ผูกแล้ว v8.0.34 บางส่วน — ดู README) · เสียงชุด A04 เพลงรอสิทธิ์ Music Generation
- รอ QA บนมือถือของเจ้าของ: อาร์ตที่ผูกแล้วทุกชุด (ภาพ/FPS), บาลานซ์ Yuzu/Seedlings, Citrus Command, Rewards hub
- Sesame: เจ้าของอนุมัติ Rune Invoker ไม่มีสาย (2 Nov2026) · ดู `docs/design/SESAME_RUNE_INVOKER.md` · 10 เวท/การ์ดลูกแก้ว/อาร์ตและเสียงใหม่ v8.1.1 รอมือถือ · ถัดไปบาลานซ์/ความถนัดและ Talent ถาวร; ไม่ทำ Mirror Network ขั้น 2 ตามแผนเก่า
- GM (รหัส 1234) ปิดเองในแอปที่แพ็กไฟล์ (v8.1.67: เปิดเฉพาะ *.github.io / localhost:port) · **ก่อนขึ้น Google Play ตรวจว่า release ไม่ใช้ `server.url` ชี้ github.io** และต้องมีเซิร์ฟเวอร์ตรวจใบเสร็จ/คะแนน
- เจ้าของ: ไม่ต้องจำลองเล่น headless เพื่อจูนบาลานซ์ และไม่ต้องถ่ายภาพหน้าจอตรวจ UI — เจ้าของตรวจบนมือถือเอง (headless หาบั๊กได้)

## 6. เอกสาร
`docs/PLAYTEST_CASES.md` (feedback/บั๊กจากเครื่องจริง) · `docs/LANDSCAPE_FULLSCREEN_UI_KNOWLEDGE.md` · GDD/แผนรวมเป็น artifact เดิม (แก้ให้ publish ทับ)

## 7. เทส / build
`npm run check` ก่อน publish เสมอ · ลำดับปล่อยเวอร์ชันอยู่ใน skill release · เทสในเครื่อง `npx serve .` · เจ้าของทดสอบ flow/บาลานซ์/FPS บนมือถือเอง

## 8. คอนเวนชัน
- ทุกเวอร์ชัน: bump `GAME_VERSION` + CHANGELOG + บล็อก Latest delivery (ย้ายบล็อกเก่าสุดไป CLAUDE_HISTORY ให้เหลือ 2 บล็อก)
- commit ภาษาอังกฤษ ไม่ใส่ชื่อรุ่นโมเดล · คุยกับเจ้าของภาษาไทย
- ข้อความในเกมเป็นภาษาอังกฤษล้วน (comment ไทยได้) · ใช้ `’` ใน single-quoted literal · ห้ามอักษรไทยใน string
