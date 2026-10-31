// Isolated presentation/save/asset contracts; no browser or combat simulation.
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),crypto=require('node:crypto');
const src=fs.readFileSync('game.js','utf8');
const block=(a,b)=>{const i=src.indexOf(a),j=src.indexOf(b,i);assert(i>=0&&j>i,a);return src.slice(i,j);};
function method(n){const at=src.indexOf('\n  '+n+'(');assert(at>0,n);const next=/\n  [A-Za-z_]\w*\([^\n]*\)\s*\{/.exec(src.slice(at+1));assert(next,n);return src.slice(at+1,at+1+next.index);}
const ctx={Math,Save:{data:{}},STAGE_SHEETS:[],STAGE_DECOR:{},RUBY_STAGE_KEYS:[]};vm.createContext(ctx);
vm.runInContext(block('const ASSET_IMAGES = {','const SKILL_ICON =')+block('const YUZU_CARD_ICONS=','const BASIC_EVO_DESC=')+block('const BASIC_ATTACKS = {','// 🛤 Build Path')+block('const BASIC_PATHS={','// 🍯 Flavor Infusion')+block('const UNIQUE_CARDS=[','const CORE_UNLOCK_STAGE')+block('function recipeCards(','function recipeSeen(')+';this.a={ASSET_IMAGES,YUZU_CARD_ICONS,yuzuCardArt,YUZU_EVOLUTIONS,BASIC_ATTACKS,BASIC_PATHS,UNIQUE_MUTS,recipeCards};',ctx);
const a=ctx.a,Scene=vm.runInContext('class Scene{'+['cardArtKey','basicAttackInfo','stageArtKeys'].map(method).join('\n')+'}Scene',ctx);
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const manifest=JSON.parse(fs.readFileSync('assets/art/build_cards/yuzu59/MANIFEST.json'));
assert.equal(manifest.icons.length,48);assert.equal(new Set(manifest.icons.map(x=>x.sha256)).size,48,'every icon is distinct');
assert.equal(manifest.decodedBytes,48*96*96*4);
for(const r of manifest.icons){assert.equal(sha(fs.readFileSync(r.file)),r.sha256,r.id);assert.equal(sha(fs.readFileSync(r.source)),r.sourceSha256,r.source);assert.deepEqual(r.size,[96,96]);assert(Object.values(a.ASSET_IMAGES).includes(r.file),r.id+' registered');}
const covered=new Set(),pathIds=['citrusGuardian','zestSwarm','juiceWorkshop'];
const s=new Scene();s.character='yuzu';s.basicAttack={character:'yuzu'};s.textures={exists:k=>!!a.ASSET_IMAGES[k]};
for(const path of pathIds){
 s.basicAttack.path=path;
 const pt=a.BASIC_PATHS.yuzu.find(p=>p.id===path),info=s.basicAttackInfo();
 for(const u of [...info.upgrades,...info.mutations,...pt.upgrades,...a.UNIQUE_MUTS[path],pt]){
  const key=s.cardArtKey({type:'basic',key:u.id});assert(key,u.id+' art');covered.add(key);
 }
 const evo=s.cardArtKey({type:'basic',key:'evolution',evolution:true});assert(evo.includes('evo_'));covered.add(evo);
 const power=s.cardArtKey({type:'basic',key:'uq_power',uniqueCard:true,kind:'⭐ Unique'});assert(power.includes('unique_'));covered.add(power);
 const recipe=a.recipeCards('yuzu',path);assert.equal(recipe.length,7);
 for(const c of recipe){assert(a.ASSET_IMAGES[c.iconKey],c.id+' Recipe art');if(!c.uq)assert.equal(c.desc,pt.upgrades.find(u=>u.id===c.id).desc,'Recipe shows full effect');}
 const splash=info.upgrades.find(u=>u.id==='splash').desc;assert(!/orbs/i.test(splash));assert(splash.includes(path==='juiceWorkshop'?'Sigils':path==='citrusGuardian'?'10px':'Vaulting Shot'));
 assert.equal(info.evolution,a.YUZU_EVOLUTIONS[path].name);
}
for(const id of ['starter','m_zest','m_crew','m_rally','m_sour','m_splash','m_bite','f_harvest','f_parade']){const k=a.yuzuCardArt(null,id);assert(a.ASSET_IMAGES[k],id);covered.add(k);}
assert.equal(covered.size,49,'48original icons plus Seedling Sprout are consumed');
assert.equal(a.yuzuCardArt(null,'seedling'),'ic_yz_seedling');
assert(!/help.*up|falling|orbs|Juice Rain|Homing Hop/i.test(JSON.stringify([a.BASIC_ATTACKS.yuzu,a.BASIC_PATHS.yuzu,...pathIds.map(p=>a.UNIQUE_MUTS[p])])));
assert.equal(a.yuzuCardArt('zestSwarm','unknown'),null);
assert.equal(a.yuzuCardArt(null,'evolution'),null,'no fabricated pre-path evolution');
// Existing generic Unique / infusion / trade art and missing-art emoji fallback survive.
assert.equal(s.cardArtKey({type:'basic',key:'uq_cd',uniqueCard:true,kind:'⭐ Unique'}),'ic_uq_cd');
s.textures.exists=()=>false;assert.equal(s.cardArtKey({type:'basic',key:'power'}),null);
assert.equal(s.cardArtKey({type:'heal',key:'power'}),null);
s.character='momo';s.basicAttack.character='momo';s.textures.exists=k=>!!a.ASSET_IMAGES[k];assert.equal(s.cardArtKey({type:'basic',key:'power'}),null,'other heroes retain their own icon path');
// New art is only requested for a Yuzu stage, never added to all heroes' stage sheet lists.
ctx.ASSET_SHEETS={};ctx.ASSET_FX={};
s.character='yuzu';assert.equal(s.stageArtKeys(0).filter(k=>k.startsWith('yc59_')).length,45);
s.character='momo';assert.equal(s.stageArtKeys(0).filter(k=>k.startsWith('yc59_')).length,0);
assert(src.includes("if(k.startsWith('yc59_'))return"),'all new textures stage-lazy');
console.log('Yuzu59 cards: all48 distinct source-verified icons consumed,3path evolutions/buff art, Recipe full effects, updated arsenal text, native fallback/other heroes and stage-only loading passed');
