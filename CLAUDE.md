# Version line

Current release: **8.1.37**. Next release:8.1.38. Fetch the deploy branch before new work.

# Latest delivery: v8.1.37 — Unique voice variety (A08)

47 original ElevenLabs lines use the existing saved character voices: three lines for each of 15 Builds plus two Sesame lines. All are lazy-loaded and selected by the existing Unique voice rotation. Mono 44.1kHz/128kbps, measured at most 1.3s and −1dBTP; exact captions and donor provenance in assets/incoming/audio_unique_a08. Nine companion voice auditions are prepared; six companion responses and integration await the owner’s casting decision. Human listening remains outstanding.

# Previous delivery: v8.1.36 — Unique voice every cast + A08 voice order (owner)

uniqueCastFx → VoiceActing.unique(scene): ignores the 12s bark throttle, cuts the hero’s own playing line (never Ruby/story), rotates vo_<role>_unique_<path>_1..4 + vo_<role>_unique_1..4 without back-to-back repeats, keeps _unique_ clips cached. Test in voice-acting-integration. docs/audio_orders/A08_UNIQUE_VOICE_LINES.md orders 45 per-Build lines, 2 Sesame, 6 Yuzu companion duo calls (needs Voice Design) — catalog rows only, no playback code needed except duo calls.

# Previous delivery: v8.1.35 — every Lobby tap switches the voiced line + title theme on loading (owner)

Owner: tapping fast didn't change the voice. lobbyTapSay no longer waits for VoiceActing.busy(); each tap stops the current clip and speaks the next 'says' line. 150ms debounce (_lobbyTapAt) so one touch can't skip two lines. Owner: loading music = track 2 only: index.html LoaderMusic now plays story_music/bgm_title.mp3 (was Forgotten Wind); StoryMusic.play skips bgm_a04_bgm_title while LoaderMusic.playing() so it continues seamlessly; menuMusic non-A04 screens call playMainBgm when the loader is still playing.

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
- Simple Forge เสร็จ v8.0.83 รอเจ้าของตรวจบนมือถือ (ราคา/ความรู้สึก 3 การ์ด)
- ใบสั่ง 62 สถานะติดตัว ผูกแล้ว v8.0.85 · รอ QA มือถือ
- อาร์ต 61 ฉากหลังล้มบอส ผูกแล้ว v8.0.84 · รอ QA มือถือ
- ใบสั่ง 63 ผูกครบ 8 แล้ว v8.0.95 · รอ QA มือถือ · A06 เสียง 28 ผูกแล้ว v8.0.91
- อาร์ตที่รอส่ง: 35 Yuzu Orchard, 36 Ruby (โค้ดใช้ภาพชั่วคราว), 49 กรอบโปรไฟล์, 50–54 เมนู (ผูกแล้ว v8.0.34 บางส่วน — ดู README) · เสียงชุด A04 เพลงรอสิทธิ์ Music Generation
- รอ QA บนมือถือของเจ้าของ: อาร์ตที่ผูกแล้วทุกชุด (ภาพ/FPS), บาลานซ์ Yuzu/Seedlings, Citrus Command, Rewards hub
- Sesame: เจ้าของอนุมัติ Rune Invoker ไม่มีสาย (2 Nov2026) · ดู `docs/design/SESAME_RUNE_INVOKER.md` · 10 เวท/การ์ดลูกแก้ว/อาร์ตและเสียงใหม่ v8.1.1 รอมือถือ · ถัดไปบาลานซ์/ความถนัดและ Talent ถาวร; ไม่ทำ Mirror Network ขั้น 2 ตามแผนเก่า
- เจ้าของ: ไม่ต้องจำลองเล่น headless เพื่อจูนบาลานซ์ และไม่ต้องถ่ายภาพหน้าจอตรวจ UI — เจ้าของตรวจบนมือถือเอง (headless หาบั๊กได้)

## 6. เอกสาร
`docs/PLAYTEST_CASES.md` (feedback/บั๊กจากเครื่องจริง) · `docs/LANDSCAPE_FULLSCREEN_UI_KNOWLEDGE.md` · GDD/แผนรวมเป็น artifact เดิม (แก้ให้ publish ทับ)

## 7. เทส / build
`npm run check` ก่อน publish เสมอ · ลำดับปล่อยเวอร์ชันอยู่ใน skill release · เทสในเครื่อง `npx serve .` · เจ้าของทดสอบ flow/บาลานซ์/FPS บนมือถือเอง

## 8. คอนเวนชัน
- ทุกเวอร์ชัน: bump `GAME_VERSION` + CHANGELOG + บล็อก Latest delivery (ย้ายบล็อกเก่าสุดไป CLAUDE_HISTORY ให้เหลือ 2 บล็อก)
- commit ภาษาอังกฤษ ไม่ใส่ชื่อรุ่นโมเดล · คุยกับเจ้าของภาษาไทย
- ข้อความในเกมเป็นภาษาอังกฤษล้วน (comment ไทยได้) · ใช้ `’` ใน single-quoted literal · ห้ามอักษรไทยใน string
