// v8.2.84: animation phases 5C (Ch3/Pinnacle boss VFX 28) + 5D (boss shots 11 + counter ring) + 6 (menu/Ruby/Expedition 15) + phase 4 fixes (Ant Drone, Equinox) · audio A20 (Ruby stage entry).
const fs=require('fs'),assert=require('assert'),crypto=require('crypto');const R=__dirname+'/../',src=fs.readFileSync(R+'game.js','utf8');
const M=JSON.parse(fs.readFileSync(R+'scripts/motion-phase5c-6.json','utf8'));let rows=0;
for(const [old,v] of Object.entries(M)){const b=fs.readFileSync(R+v.url);assert.equal(b.toString('latin1',8,12),'WEBP',v.url);
  if(!v.inPlace)assert(!src.includes("url:'"+old+"'"),'old sheet still registered '+old);
  const re=new RegExp("\\n\\s*([A-Za-z0-9_]+):\\{url:'"+v.url.replace(/[.*+?^${}()|[\]\\/]/g,'\\$&')+"'([^}]*)\\}");const m=re.exec(src);
  if(m){rows++;const body=m[2];if(/frames:/.test(body)){assert(body.includes('frames:'+v.frames),m[1]+' frames');assert(body.includes('fw:'+v.fw+',fh:'+v.fh),m[1]+' size');}}else assert(src.includes("'"+v.url+"'"),'registered '+v.url);}
assert.equal(Object.keys(M).length,55);assert.equal(rows,54);
for(const d of ['boss-motion-phase5c','boss-motion-phase5d','menu-motion-phase6'])for(const r of JSON.parse(fs.readFileSync(R+'assets/incoming/'+d+'/MANIFEST.json','utf8'))){const f=R+'assets/incoming/'+d+'/'+r.file;const b=fs.readFileSync(f);assert.equal(b.length,r.bytes,r.file);assert.equal(crypto.createHash('sha256').update(b).digest('hex'),r.sha256,r.file);}
// manual callers follow the new frame counts
assert(src.includes("const fd=(typeof ASSET_FX!=='undefined'&&ASSET_FX[m.key])||{},nf=Math.max(1,fd.frames||4),rt=fd.rate||8;"),'boss shot loop reads registry');
assert(src.includes("hs=n8?[1,2,3,4,5,6,7,0]:[1,2,3,0],ts=n8?[0,27.5,55,82.5,110,137.5,151.25,165]:[0,55,110,165]"),'Expedition rear strike 8 frames, same 165 ms');
assert(src.includes("const rn=this.textures.get('ruby_point')?.has?.('cell7')?8:4;")&&src.includes("delay:rn>=8?90:180"),'Ruby point 8 × 90 ms');
assert(src.includes("url:'assets/art/expedition91/ex91_back_momo.webp'"),'Expedition rear heroes stay in the menu-lazy folder');
// phase 4 fixes
for(const [k,u] of [['e_ant_drone_animated','motion-phase4/ch1_ants__drone_sheet.webp'],['c24_equinox_animated','motion-phase4/ch2_seasons__c24_equinox_sheet.webp']])assert(new RegExp('  '+k+":\\{url:'assets/art/"+u.replace(/[./]/g,'\\$&')+"'[^\\n]*attack:\\{frames:\\[16,17,18,19,20,21,22,23\\],rate:24\\}").test(src),k);
// A20 audio
const A=JSON.parse(fs.readFileSync(R+'assets/incoming/audio_a20/MANIFEST.json','utf8'));assert.equal(A.length,26);
for(const r of A){const out=R+'assets/audio/'+(r.kind==='voice'?'acting/':'sfx/a20/')+r.key+'.mp3';assert(fs.existsSync(out),out);
  if(r.kind==='voice')assert(src.includes('"'+r.key+'":{"url":"assets/audio/acting/'+r.key+'.mp3","text":'+JSON.stringify(r.text)),r.key);else assert(src.includes("  "+r.key+": 'assets/audio/sfx/a20/"+r.key+".mp3',"),r.key);}
assert(src.includes('this.rubyEntryAudio?.(c,idx,first);')&&src.includes("Sfx.orderCue?.('a20_curtain_out',.45,.3)"),'curtain in/out hooks');
assert(src.includes("const vo=first?'vo_ruby_go_'+String(idx+1).padStart(2,'0'):(Math.random()<.5?'vo_ruby_go_again_'+(1+Math.floor(Math.random()*4)):null);"),'first visit intro, repeat 50% short line');
assert(src.includes("boss=idx%5===4,ti=boss?'a20_title_boss':'a20_title_ch'+Math.min(3,(st.chapter||0)+1)"),'chapter / boss stinger');
console.log('Motion 5C/5D/6 + phase 4 fixes + A20: 55 sheets, manual callers, menu-lazy rear heroes, 26 stage-entry sounds passed');
