// v8.2.31 wire orders 88 (Pact Relic icons), 89 (Mission Atlas UI), 90 (mission event FX) and A18 (Ruby + SFX)
const fs=require('fs'),path=require('path'),crypto=require('crypto'),assert=require('assert');const root=path.join(__dirname,'..');
const src=fs.readFileSync(path.join(root,'game.js'),'utf8');
let n=0;for(const [b,out,cnt] of [['relics88','relics88',8],['atlas89','atlas89',5],['events90','events90',7]]){const M=JSON.parse(fs.readFileSync(path.join(root,'assets/incoming',b,'MANIFEST.json')));assert.equal(M.length,cnt,b);
  for(const r of M){const buf=fs.readFileSync(path.join(root,'assets/incoming',b,r.file));assert.equal(crypto.createHash('sha256').update(buf).digest('hex'),r.sha256,r.key);
    const w=fs.readFileSync(path.join(root,'assets/art',out,r.key+'.webp'));assert.equal(w.slice(8,12).toString(),'WEBP',r.key);assert(src.includes("assets/art/"+out+"/"+r.key+".webp'"),'registered '+r.key);n++;}}
assert.equal(n,20);
const A=JSON.parse(fs.readFileSync(path.join(root,'assets/incoming/audio_a18/MANIFEST.json')));assert.equal(A.length,18);
for(const r of A){const vo=r.key.startsWith('vo_'),dst=path.join(root,vo?'assets/audio/acting':'assets/audio/sfx/a18',r.key+'.mp3');assert(fs.existsSync(dst),dst);
  if(vo){const ck=r.key.startsWith('vo_ruby_react_')?r.key+'_1':r.key;assert(src.includes('"'+ck+'":{"url":"assets/audio/acting/'+r.key+'.mp3","text":'+JSON.stringify(r.text)),'catalog '+ck);}else assert(src.includes(r.key+": 'assets/audio/sfx/a18/"+r.key+".mp3'"),'audio '+r.key);}
// loading class: relics88 + ev90 stage · ma89 menu-lazy · never boot
assert(src.includes("if(/assets\\/art\\/relics8[18]\\//.test(u))return 'stage'; if(/^ev90_/.test(k))return 'stage'; if(/^ma89_/.test(k))return 'menu';"));assert(src.includes('patrol70|atlas89'));
assert(src.includes("keys.push(...Object.keys(ASSET_FX).filter(k=>k.startsWith('ev90_'))"),'ev90 loads with every stage');
// hooks keep fallbacks
for(const h of ["this.arrowArt?.(this.objectiveArrow,'_objArrowImg',0,26","this.arrowArt?.(A,'_sideArrowImg',1,20,null)","this.goldShimAdd?.(e)","goldShimTick()","this.artFx?.('ev90_gold_burst'","this.artFx?.('ev90_double_clear'","boss&&this.realTex?.('ev90_boss_chip')?'ev90_boss_chip':'ui87_side_chip'","this.realTex?.('ev90_reroll')","'ev90_curses',fi","this.realTex?.('ma89_nodes')&&this.realTex?.('ma89_node_frame')","'ma89_nodes',k*2+c","renderer?.type===Phaser.WEBGL","VoiceActing?.play?.(this,'vo_ruby_tip_atlas',()=>",
  "rubyVoiceReact?.('golden'","rubyVoiceReact?.('double'","rubyVoiceReact?.('bossmission'","rubyVoiceReact?.('newmission'","rubyVoiceReact?.('reroll'","rubyVoiceReact?.('curse'","rubyVoiceReact?.('jackpot'",
  "a18_golden_wave","a18_double_clear","a18_boss_mission","a18_mission_impact","a18_curse","a18_atlas_star","a18_atlas_pick","a18_atlas_remove","a18_jackpot","a18_reroll"])assert(src.includes(h),h);
console.log('Orders 88/89/90 + A18: 20 WebP + 18 audio, stage/menu-lazy, hooks with fallbacks passed');
