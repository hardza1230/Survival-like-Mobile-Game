// v8.2.85: A21 hero attack + material/critical hit variations (69) — random variant per event, no immediate repeat, old cue as fallback.
const fs=require('fs'),vm=require('vm'),assert=require('assert'),crypto=require('crypto');const R=__dirname+'/../',src=fs.readFileSync(R+'game.js','utf8');
const M=JSON.parse(fs.readFileSync(R+'assets/incoming/audio_combat_a21/MANIFEST.json','utf8'));assert.equal(M.length,69);
for(const r of M){const b=fs.readFileSync(R+'assets/incoming/audio_combat_a21/'+r.file);assert.equal(b.length,r.bytes);assert.equal(crypto.createHash('sha256').update(b).digest('hex'),r.sha256);
  assert(fs.existsSync(R+'assets/audio/sfx/a21/'+r.key+'.mp3'),r.key);assert(src.includes("  "+r.key+": 'assets/audio/sfx/a21/"+r.key+".mp3',"),r.key);}
const grab=n=>{const i=src.indexOf('\n  '+n+'(');assert(i>0,n);return src.slice(i+3,src.indexOf('\n',i+1));};
const C=vm.runInNewContext(src.match(/const A21_FAMS=[^\n]*\n/)[0]+src.match(/const A21_REF=[^\n]*\n/)[0]+'({A21_FAMS,A21_REF})',{});
const cached=new Set(['sfx_a21_momo_sniper_1','sfx_a21_momo_sniper_2','sfx_a21_momo_sniper_3']),played=[];
const ctx={Math,window:{__g:{cache:{audio:{exists:k=>cached.has(k)}}}},A21_FAMS:C.A21_FAMS,A21_REF:C.A21_REF};
const S=vm.runInNewContext('({'+grab('a21Pick')+'\n'+grab('a21')+'\n_ok(){return true;},playFile(k){this.played.push(k);return true;},muted:false,sv:1,played:[]})',ctx);
let last=null;for(let i=0;i<30;i++){const k=S.a21Pick('momo_sniper');assert(k&&k!==last,'no immediate repeat');last=k;}
assert.equal(S.a21Pick('cocoa_titan'),null,'not loaded → old cue');assert.equal(S.a21('cocoa_titan'),false);
assert(src.includes("const fam=typeof A21_REF!=='undefined'?(A21_REF[key]||(key==='sfx_shoot'&&this.hero==='momo'?'momo_ricochet':null)):null; if(fam){ const v=this.a21Pick(fam); if(v){ key=v; rate=1; } }"),'old cue remapped in playFile');
assert(src.includes("if(this.a21Pick&&this.a21('critical',.34,0))return;"),'critical replaces crit + accent');
assert(src.includes("if(!big){ if(!Sfx.a21?.('hit_'+this.a21Mat(e),.22,.085))Sfx.pop(); }"),'material hit on kill, fallback pop');
assert(src.includes("if(kind==='spark'&&Sfx.a21?.('taro_spark',.3,.25))return true;")&&src.includes("if(!shot.echo)Sfx.a21?.('sesame_flare',.26,.12);"),'Taro spark / Sesame flare');
const mat=vm.runInNewContext('({stageIndex:0,'+grab('a21Mat')+'})',{});
assert.equal(mat.a21Mat({}),'mochi');assert.equal(mat.a21Mat({_a21Armor:true}),'armor');mat.stageIndex=3;assert.equal(mat.a21Mat({}),'ice');mat.stageIndex=7;assert.equal(mat.a21Mat({}),'plant');mat.stageIndex=12;assert.equal(mat.a21Mat({}),'crystal');
assert(src.includes("e._a21Armor=type==='tank'||type==='siege';"));
console.log('Audio A21 combat: 69 variants registered, random no-repeat pick, fallback, crit/material/spark/flare hooks passed');
