# Version line

Current release: **8.1.94**. Next release:8.1.95. Fetch the deploy branch before new work.

# Latest delivery: v8.1.94 — distinct level-up cards (art order 75)

Eight ImageGen sources verified and packed by scripts/pack-levelup75.py (192 KB WebP, 5.22 MB decoded only during play). The Normal, Mutation, Relic and Unique templates share the existing 9-slice layout with a distinct crest. Special frame FX animate at 8 fps and stay still under reduced motion. The old card art and drawn panel are fallbacks. No changes to card selection or effects. tests/levelup75-art.test.cjs covers source integrity, stage-lazy assets, categories and fallbacks.

# Previous delivery: v8.1.93 — art orders 70–74 wired (63 files)

scripts/pack-missions71-74.py: MANIFEST sha check → WebP q88 (black bg → luminance alpha, frames ≥512 halved except hm_rim) → assets/art/{league72,missions71,trial74,league73,patrol70}/ + menu icons moved to assets/art/menu74/ (ic_memory renamed ic_memory_book: key already used). Index assets/art/missions71_74_index.json. Mission art = ASSET_FX, artClass 'stage' (prefix fp|hm|hh|gp|gg|hs|ult|msn71 / cr_root_), loaded per stage by missionArtKeys(idx) inside stageArtKeys (Delve adds hm/hs/ult). Menu art (menu74, patrol70) = ASSET_IMAGES/ASSET_SHEETS menu-lazy; menuGroupRe adds menu74 everywhere, patrol70 on patrol/gActivity/hub. Helpers: artSpr/sigArt (sprite or old emoji), artIsSpr, artFx (one-shot, NORMAL blend), artFollow/artFollowTick/artFollowClear (overlay on special enemies: herald, golem, warlord, hand lord, Breachlord, stalker captain; base enemy alpha .01, restored on clear). Patrol: patrolScene (sky crop + mid/ground tileSprite parallax), patrolFoe (pt_foes row anims), patrolPop, pt_loot, pt_dim. Delve map tk → amap_trial/amap_siege. Codex badge/memory icon on Bestiary Codex button. Test tests/missions71-74-art.test.cjs.

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
- League missions (เจ้าของ 11 พ.ย.) แผน 7 phase ใน `docs/design/OWNER_NOTES_POE_LEAGUES.md` · phase 1 Frozen Pantry v8.1.81 · phase 2 Hunger's Mouth + Creeping Roots v8.1.82 · phase 3 Herald + Grandma's Pot v8.1.83 · phase 5 Reforge v8.1.84 · phase 6 Golem v8.1.85 · phase 4 Siege v8.1.86 · phase 7 Memory Book v8.1.87 (ครบทุก phase) · อาร์ตใบ 70–74 ผูกแล้ว v8.1.93 · รอ QA มือถือ
- ใบสั่งอาร์ต 75 ผูกแล้ว v8.1.94 · รอ QA มือถือ · 76 (มอน Breach) · 77 (ท่าโจมตี/ตายศัตรูพิเศษ) · 78 (VFX ภารกิจ 15) · ใบเสียง A12 (36 SFX ภารกิจ/Trial/Forge/Patrol) · **เจ้าของ: AI ฝั่งอาร์ตผูกเองตามหัวข้อ "ผูกเข้าเกม" ในแต่ละใบ** · รออาร์ต
- ภารกิจ 4 รอบ (เจ้าของ 10 พ.ย. ชอบทุกอัน): รอบ 1 v8.1.77 · รอบ 2 v8.1.78 · รอบ 3 v8.1.79 เสร็จ · รอบ 4 = ใบสั่งอาร์ต 71 (16 ไฟล์) รออาร์ต · เจ้าของอาจปรับความถี่แท่นเริ่ม/Overcharge หลังเล่นจริง
- ใบ 70 ฉาก Mochi Patrol (14 ไฟล์) · รออาร์ต · โค้ด buildPatrol ใช้ภาพชั่วคราว v8.1.70
- ใบ 69 สกินเต็มตัว Festival · v8.1.90 เข้าเกมแบบทดลองแล้ว 5 ฮีโร่ (ผ่าน scripts/qa-skin69.py) · Mint รอแก้ 4 ชีต · เดิม: ผูกแล้ว 7/68 (v8.1.73 pets HD/icons/banner) · ตัวฮีโร่ 61 ไฟล์ยังเป็น candidates (เจ้าของ 10 พ.ย.: ของติดตัว ปีก/ฮาโล/วง เลิกขายแยก → สกินเต็มตัว ทุกที่รวมในด่าน; ขายแยกเหลือ pet/trail/dash/pop) · รออาร์ต · โค้ด: ช่อง skin + heroTex(key) fallback + คืนด้ายของที่เลิกขาย
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
