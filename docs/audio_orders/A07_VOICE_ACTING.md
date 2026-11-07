# A07 — เสียงพากย์ตัวละคร (แบบ Path of Exile) · ใบสั่งเสียง · ร่าง 1 รอเจ้าของดู

สถานะ: ✅ ผูกเกมแล้ว · เจ้าของฟังแล้วโอเค · ตรวจและเพิ่มจุดเล่น v8.1.39
เครื่องมือ: **ElevenLabs Voice Design** (ออกแบบเสียงตัวละครละ 1 เสียง ใช้ทั้งเกม) + **Text to Speech** (รุ่น multilingual v2 / v3 ใส่อารมณ์ได้) · ภาษาอังกฤษ
อ้างอิงเรื่อง: `docs/STORY_CANON.md` (ร่าง 3) · กติการ่วม `A00_README.md` (ไฟล์ mono 44.1 kHz · peak ≤ −1 dBTP · ตัดเงียบหัว < 20 ms)

## แนวคิด (เหมือน PoE)
- ตัวละครพูด **สั้น** (0.6–3 วิ) แทรกตอนเล่น ไม่หยุดเกม · เสียงซ้อนกันไม่ได้ (คิวเดียว ถ้ามีเสียงพากย์กำลังเล่น ตัวใหม่ข้าม)
- จำกัดความถี่: ประโยคการต่อสู้ของฮีโร่ ≥ 12 วิ/ครั้ง · ประโยคเดิมไม่ซ้ำภายใน 3 ครั้ง · มีหลายเวอร์ชันต่อเหตุการณ์ (`_1…_3`)
- เพลง/SFX ลดเสียงลง 30% ระหว่างพากย์ (ducking มีอยู่แล้วในโค้ด `duckBgm`)
- ตัวหนังสือในเกมต้อง **ตรงคำต่อคำ** กับเสียงพากย์ · ปิดได้ใน Settings (Voice) — เสียงพึมพำ A05 ยังใช้ตอนปิด
- **Sesame:** เจ้าของยืนยันให้ทำเสียงผู้หญิงนุ่มลึกลับ และเอาป้าย In development ออก

---

## หมวด 1 — ออกแบบเสียง (Voice Design · ทำก่อนทุกหมวด)
ส่งไฟล์ตัวอย่างเสียงละ 1 ไฟล์ `vd_<ตัวละคร>.mp3` (ประโยค "Hello! Let's bring the flavor back.") ให้เจ้าของฟังเลือกก่อน แล้วจึงอัดหมวดอื่นด้วย voice ID เดิม

| key | ตัวละคร | ออกแบบเสียง (prompt Voice Design) |
|---|---|---|
| `strawberry` | Strawberry · ตัวเอก ลูกมือคุณยาย | young woman, bright and brave, slightly clumsy warmth, clear mid pitch, light British-neutral accent |
| `ruby` | Ruby · ภูตแยมทับทิม | tiny girl spirit, sparkly, fast and cheerful, high pitch, a little echo of magic (no effects, just airy tone) |
| `mint` | Mint · หมอยา เย็นชาใจดี | calm young woman, low soft voice, dry humor, slow precise words |
| `cocoa` | Cocoa · ทหารยามตัวโต | big-hearted strong woman, warm feminine low-mid voice, gentle sleepy humor |
| `taro` | Taro · นักทำแผนที่ | energetic young man, fast talker, excited, a bit scatterbrained |
| `yuzu` | Yuzu · ชาวสวนส้ม หัวหน้าฝูง | warm cheerful young woman, bossy-cute commander, sunny |
| `grandma` | คุณยาย · หัวหน้าครัวหลวง | kind elderly woman, gentle, wise, a little frail but firm |
| `planter` | The First Planter | old man, tired regal voice, grief under pride |
| `hunger` | The Great Hunger | deep hollow whisper, many voices layered, slow, hungry (ไม่น่ากลัวเกินเด็ก) |
| `boss_c1` / `boss_c2` / `boss_c3` | เสียงบอสรายบท (ถ้าไม่ทำแยกรายตัว) | ดูหมวด 4 — แนะนำทำแยกรายตัว 15 เสียง |

---

## หมวด 2 — ฉากเรื่อง (Story / Cutscene)
ใช้บทจาก `MOTION_COMICS` (s00–s17), `RUBY_STORYBOOK`, ฉากหลังล้มบอส (ใบ 61) · คำบรรยาย (narrator) ใช้เสียง **Ruby** เล่า
| กลุ่ม | จำนวนโดยประมาณ | เสียง | ที่มาบท |
|---|---|---|---|
| ฉากเปิดเกม s00–s01 | ~14 ประโยค | Ruby (เล่า) + Strawberry | `MOTION_COMICS.s00/s01` cap |
| ฉากเปิด/ปิดบท s11 s13 s16 | ~12 | Ruby, Grandma, Planter | cap |
| สมุดเรื่อง Ruby 5 ตอน | ~15 | Ruby | `RUBY_STORYBOOK` text |
| ตอนจบ (หลัง C3-5) | ~8 | Planter, Strawberry, Ruby, Grandma | ฉากจบ (ร่าง 3) |
**รวม ~49 ไฟล์** · key `vo_story_<scene>_<shot>.mp3`

---

## หมวด 3 — Ruby ในด่าน
| กลุ่ม | จำนวน | ตัวอย่างบท (ตรงกับเกม) | key |
|---|---|---|---|
| เรื่องต้นด่าน 15 ด่าน (`RUBY_STORY`) | 15 | "You found the Heart Seed and became a person again! I'm Ruby." | `vo_ruby_story_00…14` |
| คำแนะนำภารกิจ (`RUBY_TIPS` say) | 17 | "Stand inside the ring!" · "A Miniboss! Beat it to spin the reward wheel!" | `vo_ruby_tip_<key>` |
| บทสอน / แนะนำระบบใหม่ (`FEAT_LINE`, `rubyGuide`) | ~20 | "Depths is open! Use shovels to dig under the temple." | `vo_ruby_guide_<key>` |
**รวม ~52 ไฟล์**

---

## หมวด 4 — บอส (สองเสียง: คำสาป / ตัวจริง)
บอสแต่ละตัวมี 2 โทนในเสียงเดียวกัน: **Cursed** (ถูกสาป แข็ง ดุ) กับ **True** (ตัวจริงหลุดออกมา อ่อนโยน) · 15 บอส × 7 = 105 ไฟล์
| เหตุการณ์ | ต่อบอส | ตัวอย่าง (ราชินีมด C1-1) | key |
|---|---|---|---|
| เปิดฉาก (Cursed) | 1 | "Stay away from my eggs!" | `vo_b01_intro` |
| ระหว่างสู้ (Cursed) | 3 | "Ants, attack!" | `vo_b01_fight_1…3` |
| ตัวจริงหลุด (True) — **บทใหม่ต้องเขียน** | 2 | "…no, my little ones, run…" | `vo_b01_slip_1…2` |
| คำสุดท้าย (True · ฉากหลังล้มบอส) | 1 | "The orders are quiet… please, keep the eggs warm." | `vo_b01_release` |
บทมีอยู่แล้วใน `BOSS_LINES` (intro/fight) และ `BOSS_STORIES.release` · บท "ตัวจริงหลุด" 30 ประโยคต้องเขียนใหม่ (รอเจ้าของอนุมัติก่อนอัด)
บอส C1-5 / C2-5 / C3-5 (ปาก The Hunger / แม่ราก / ผู้ปลูก) ใช้เสียงเฉพาะของตัวเอง · The Hunger พูดตอน C1-5 ("I will wake again…")

---

## หมวด 5 — ฮีโร่ในการต่อสู้ (Combat Barks)
5 ฮีโร่ × 8 เหตุการณ์ × 2 เวอร์ชัน = **80 ไฟล์** · ประโยคสั้นมาก (≤ 1.5 วิ)
| เหตุการณ์ | เมื่อไหร่เล่น | ตัวอย่าง (Cocoa) |
|---|---|---|
| `start` | เข้าด่าน | "Alright… let's punch something." |
| `unique` | ใช้สกิล Unique | "Bear hug!" |
| `levelup` | เลเวลอัป (สุ่ม 30%) | "Getting stronger." |
| `evolve` | Evolution ของ Build | "Now we're talking!" |
| `boss` | บอสโผล่ | "That one's big. Good." |
| `lowhp` | HP < 25% (ครั้งเดียว/ด่าน) | "Ow… okay, careful now." |
| `revive` | ฟื้นจาก Last Breath | "Not done yet!" |
| `win` | ชนะด่าน | "Nap time. Earned it." |
key `vo_<hero>_<event>_1…2` · บทของทุกฮีโร่ต้องเขียนตามนิสัยใน `LOBBY_LINES` (เจ้าของตรวจก่อนอัด)

---

## หมวด 6 — ฮีโร่ตอนปลดล็อก + Lobby
| กลุ่ม | จำนวน | บท | key |
|---|---|---|---|
| ปลดล็อกฮีโร่ (`HERO_INTROS`) | 4 (Mint/Cocoa/Taro/Yuzu) | เขียนใหม่ให้มีนิสัย (ข้อเสนอเดิม: Cocoa "Free! …Can I nap first? Kidding. Mostly.") | `vo_<hero>_unlock` |
| Lobby พูด (`LOBBY_LINES` แบบ says) | 15 (3/ตัว) | "Chill. I've got your back." (Mint) | `vo_<hero>_lobby_1…3` |
**รวม 19 ไฟล์** · เสียงพึมพำ A05 (greet/tap/poke) ยังใช้ต่อ

---

## สรุปจำนวน
| หมวด | ไฟล์ | บทพร้อม / ต้องเขียน |
|---|---|---|
| 1 ออกแบบเสียง | 12 (ตัวอย่าง) | พร้อม |
| 2 ฉากเรื่อง | ~49 | พร้อม (ปรับตามร่าง 3) |
| 3 Ruby ในด่าน | ~52 | พร้อม |
| 4 บอส | 105 | 75 พร้อม · 30 ต้องเขียน |
| 5 ฮีโร่ต่อสู้ | 80 | ต้องเขียนทั้งหมด |
| 6 ปลดล็อก + Lobby | 19 | 15 พร้อม · 4 ต้องเขียนใหม่ |
| **รวม** | **~317** | |
ขนาดไฟล์โดยประมาณ ~9–12 MB (MP3 mono 96 kbps) → โหลดแบบ lazy ตามด่าน/ฉาก ห้าม boot

## ลำดับทำที่แนะนำ
1. หมวด 1 → เจ้าของฟังเลือกเสียง
2. หมวด 4 (คำสุดท้ายบอส 15) + หมวด 2 → คุ้มที่สุดทางอารมณ์
3. หมวด 3 → 6 → 5

## ส่งมอบ
`assets/incoming/audio_voice_acting/<หมวด>/` + `MANIFEST.json` (key, file, bytes, sha256, duration_ms, speaker, text **ตรงตัวอักษรกับบท**) + `VOICES.json` (voice ID ต่อตัวละคร) + `PROMPTS.json`

## Delivery — category 1 voice casting

Direct ElevenLabs Voice Design access verified HTTP200. Delivered12 roles, each with3 original candidates (36 processed audition MP3s plus36 unchanged provider previews) in `assets/incoming/audio_voice_acting/`. Open `AUDITION.html` to compare. `vd_<speaker>.mp3` means candidate1, not an approved selection. No persistent voices have been saved; `VOICES.json` records generated preview IDs separately from future saved TTS IDs.

Voice Design requires at least100 characters, so auditions begin with the requested sentence and continue with the exact shared script recorded in MANIFEST/PROMPTS. Chapter boss voices are provisional options permitted by the brief, not15 approved individual identities. Technical decode/mono44.1kHz128kbps/peak/leading-silence checks passed. Owner performance and word-accuracy listening remains pending. Categories2–6, new dialogue approval and runtime integration remain outstanding.


## Partial delivery update — 2026-11-06

Owner delegated provisional casting. Candidate 1 was selected as a provisional default for all 12 roles and saved as reusable ElevenLabs voices; no subjective listening or performance judgment was performed. 144 original TTS lines were generated from existing game text: 13 opening motion-comic captions, 15 Ruby stage lines, 15 Ruby storybook pages, 14 tips, 12 feature guides, 15 lobby lines and 60 boss reply/fight/release lines. Original donors, actual requests, saved voice IDs, final files and technical QA are in `assets/incoming/audio_voice_acting/`; `LISTEN_DIALOGUE.html` previews them. Spoken-text accuracy and character fit still require human listening. These files are source-only and not connected to the game. Chapter boss voices are shared provisional identities except Hunger and Planter. Three symbol-containing tips, remaining story shots, newly written boss slip lines and hero barks/unlock lines remain outstanding.

## Delivery update — 2026-11-07

Owner authorized recording the draft combat, boss-slip and unlock lines. Added 80 combat barks, 30 boss-slip lines, 4 unlock lines, 47 remaining existing main-comic shots, 30 boss-memory lines and 15 pre-existing BOSS_LINES alternative fight lines: 350 dialogue masters total. Saved provisional voices, donors, exact request texts, manifests and per-file decoded true peak / onset checks are retained in `assets/incoming/audio_voice_acting/`. All remain source-only: no in-game text, events, playback, ducking or voice settings were changed. Three icon-containing Ruby tips still need a spoken-text/display decision. The alternative third fight line exists in BOSS_LINES but current story combat uses BOSS_STORIES.fight; don’t claim it currently plays. Text-to-speech word accuracy, performance, casting and mobile mix have not been human-reviewed.

## Integration update — 2026-11-07

Owner confirmed Cocoa is female and requested Sesame as a soft mysterious female voice. Created three audition previews each and selected take 1 provisionally, re-recorded 20 Cocoa lines, generated 19 Sesame lines, corrected 63 boss lines where story gender was explicit, and recorded three previously missing Ruby target tips with matching displayed words. Full requests, donors, master hashes, provisional cast and audio QA: `assets/incoming/audio_voice_fix/`. The runtime uses the corrected masters, never the historical male Cocoa files. Main-comic and boss dialogue, Ruby stage/tips/book/tutorial, matching lobby speech and situational hero barks use lazily loaded voice with on-screen text and single-channel ownership. Some generated files have no current matching game event and remain available in the catalogue; selection still needs human listening. A04 six tracks are connected to title, story moods and bazaar.

## Owner listening — 2026-11-08

Owner listened and accepted the current audio. Further revisions remain possible if an issue is found in play.

## Playback audit — 2026-11-08

Owner accepted the audio and requested unused takes be wired where appropriate. Four hero unlock clips now have their own matching comic shots. Boss defeat comics now present both matching Ruby memory lines before the release and onward scenes. Main-story shots use their own vo_story_sNN_N clip when the displayed text matches, rather than accidentally selecting an identically worded storybook take; the storybook retains its own clips. Combat barks are selected dynamically by hero/event; boss slips and the third fight variants are also dynamically selected. Some early Ruby stage-intro and old Heart Seed storybook takes remain registered as legacy fallbacks: the current opening motion comic replaces those older presentations, so injecting them into combat or repeating the story would conflict with the current flow. Voice playback remains subject to existing scene, mute and single-channel guards.
