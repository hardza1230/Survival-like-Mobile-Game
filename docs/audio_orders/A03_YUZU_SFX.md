# A03 — Yuzu Citrus Companions · ElevenLabs SFX

สถานะ: ปรับตามแผนคู่หู v8.0.38 · รอเชื่อม ElevenLabs/ไฟล์เสียง · แทนรายการ Orchard Swarm เดิม ไม่ต้องทำเสียง Toss/Sprout/Elder แล้ว

ใช้ ElevenLabs โดยตรงตามคำสั่งเจ้าของ สร้างเสียงใหม่ ห้ามเลียนแบบเพลง ศิลปิน หรือเกมเดิม ไม่มีคำพูด ใช้กติกา A00 ทุกข้อ ส่ง assets/incoming/audio_yuzu/

| Key | ms | จังหวะ |
|---|---:|---|
| sfx_yz_seed | 120 | Yuzu seed shot |
| sfx_yz_bite | 120 | Yuzling bite |
| sfx_yz_pounce | 350 | Yuzling Pounce landing |
| sfx_yz_sweep | 220 | Pomelo sweep |
| sfx_yz_slam | 650 | Pomelo Pulp Slam |
| sfx_yz_roll | 600 | Rolling Pomelo |
| sfx_yz_rush | 350 | Companion Dash |
| sfx_yz_grow | 450 | Pomelo growth |
| sfx_yz_arrow | 150 | Lime seed arrow |
| sfx_yz_volley | 450 | Lime Zest Volley |
| sfx_yz_trap | 400 | Lime Sour Trap |
| sfx_yz_orb | 180 | Blood Orange aroma orb |
| sfx_yz_sweet | 450 | Sweet brew |
| sfx_yz_sour | 500 | Sour brew |
| sfx_yz_spicy | 400 | Spicy brew |
| sfx_yz_down | 300 | Companion falls |
| sfx_yz_revive | 450 | Companion revived |
| sfx_yz_fortress | 900 | Pomelo Fortress |
| sfx_yz_rain | 900 | Lime Rain of Rind |
| sfx_yz_infusion | 1100 | Blood Orange Grand Infusion |

รวม20keys/20files · Prompt ภาษาอังกฤษและระยะเป้าหมายอยู่ assets/incoming/audio_yuzu/REQUESTS.json · สร้างเก็บ donor แล้วตัด/ปรับระดับแบบ mechanical เท่านั้น ห้ามใช้เสียงสังเคราะห์ด้วยโค้ดแทน AI ตามคำสั่งล่าสุด

Runtime: yuzuSound(name,gap,volume) → Sfx.bp('yz_'+name) → sfx_yz_*; ใช้ mute/master SFX/การจำกัดเสียงเดิม ไม่สร้าง AudioContext ใหม่ เสียงยิง/กัดจำกัดเป็นกลุ่ม ไม่เล่นทุกดอกใน Volley ไฟล์ที่ยังไม่มาจะไม่ลงทะเบียน path ปลอม และเสียงเดิมสำรองยังอยู่

หลังได้ไฟล์จริง ส่ง MANIFEST.json (key,file,bytes,sha256,durationMs,loop,peakDbtp), PROMPTS.json (prompt/พารามิเตอร์/รหัสงานจริง), QA_REPORT.json (decode,ไม่เงียบ,peak,duration) · เจ้าของฟังบนมือถือขั้นสุดท้าย

## Delivery v8.0.39 — 2026-10-25

Delivered 20 original ElevenLabs Sound Effects files (actual expanded table count), technical QA and runtime integration. Kit: `assets/incoming/audio_yuzu/`; runtime: `assets/audio/yuzu/`. Untouched donors, actual prompts/request metadata, MANIFEST and QA_REPORT retained. Owner phone listening/artistic review pending.
