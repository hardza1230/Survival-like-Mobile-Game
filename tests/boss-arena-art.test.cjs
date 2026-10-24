// v8.0.21 ใบ 48: กลไกสนามบอส C1–C2 · ไฟล์ตรง MANIFEST · โหลดตามด่าน (ไม่บูต) · ทุกจุดยังมีภาพเดิมสำรอง
const fs=require('fs'),crypto=require('crypto'),assert=require('assert');
const src=fs.readFileSync(__dirname+'/../game.js','utf8'),root=__dirname+'/../',M=JSON.parse(fs.readFileSync(root+'assets/incoming/boss_arena_c1_c2/MANIFEST.json','utf8'));
assert.equal(M.length,12);
for(const r of M){const b=fs.readFileSync(root+'assets/incoming/boss_arena_c1_c2/'+r.file);assert.equal(b.length,r.bytes,r.file);assert.equal(crypto.createHash('sha256').update(b).digest('hex'),r.sha256,r.file);
  const dir=r.key.startsWith('arena_')?'counters':'boss_vfx',url='assets/art/'+dir+'/'+r.key+'.webp',w=fs.readFileSync(root+url);assert.equal(w.slice(0,4).toString(),'RIFF');assert.equal(w.slice(8,12).toString(),'WEBP');
  const m=new RegExp(r.key+":\\{url:'"+url.replace(/\//g,'\\/')+"',fw:"+(r.frameWidth/2)+",fh:"+(r.frameHeight/2)+",frames:"+r.frameCount).test(src);assert(m,'ASSET_FX '+r.key);}
assert(src.includes("/^(?:vfx|arena)_b(\\d\\d)_/.exec(k)")&&src.includes("if(k==='vfx_b06_pod_shield')STAGE_SHEETS[9]?.push(k)"),'stage-lazy (C2-5 also loads the pod shield)');
for(const [k,fb] of [['vfx_b01_burrow_shadow','this.add.ellipse(this.player.x'],['01_burrow_burst','vfxHitRing?.(s.x,s.y'],['vfx_b02_sludge_band','arenaSweep(b,{dir:\'h\',...SW})'],['vfx_b10_root_band','color:0x8a6a3a'],['vfx_b03_hot_tile','chk(0),chk(1),row'],['vfx_b04_frost_breath','this.add.circle(b.x,b.y,30,color,.12)'],['arena_b04_ice_pillar','this.add.rectangle(x,y,40,70'],['vfx_b06_pod_shield','b._podShield'],['vfx_b07_fog_tile','fog.fillRect(W.x-60'],['vfx_b07_air_bubble','fog.fillCircle(q.x,q.y,q.r)'],['vfx_b09_clock_hand_long','g.lineBetween(b.x,b.y'],['vfx_b09_clock_hand_short','g.lineBetween(b.x,b.y']])
  assert(src.includes("'"+k+"'")&&src.includes(fb),'hook + fallback '+k);
assert(!/bootKeep[^\n]*vfx_b0/.test(src),'not boot');
console.log('Boss arena art (order 48): 12 sources match MANIFEST, WebP registered at half size, stage-lazy (+C2-5 shield), hooks with fallbacks passed');
