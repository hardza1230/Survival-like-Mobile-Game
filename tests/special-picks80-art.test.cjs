// v8.1.137 art order 80 wired: relic vault, evolution forge, recipe book (Mutation), painted Build Path cards.
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),crypto=require('node:crypto');
const src=fs.readFileSync('game.js','utf8'),kit='assets/incoming/special_picks80/',man=JSON.parse(fs.readFileSync(kit+'MANIFEST.json','utf8'));
assert.equal(man.length,21);
for(const r of man){const raw=fs.readFileSync(kit+r.file);assert.equal(raw.length,r.bytes,r.key);assert.equal(crypto.createHash('sha256').update(raw).digest('hex'),r.sha256,r.key);
  const out='assets/art/special_picks80/'+r.key+'.webp',w=fs.readFileSync(out);assert.equal(w.subarray(0,4).toString(),'RIFF');assert.equal(w.subarray(8,12).toString(),'WEBP');
  assert(src.includes("'"+out+"'"),r.key+' registered with a literal url');}
assert(src.includes("book80_page_glow:{url:'assets/art/special_picks80/book80_page_glow.webp',fw:288,fh:360,frames:6"));
// Loading class: stage (never boot); a run loads only the current hero's 3 path cards + back.
assert(/if\(\/\^\(\?:vault80\|forge80\|book80\|pathcard80\|pathuq82\)_\/\.test\(k\)\)return 'stage';/.test(src));   // v8.1.146 + order 82
assert(src.includes("keys.push('vault80_bg','vault80_pedestal','forge80_anvil','book80_spread','book80_page_glow',...((typeof BASIC_PATHS!=='undefined'&&BASIC_PATHS[hh])||[]).map(p=>'pathuq82_'+hh+'_'+p.id))"));   // v8.1.146: Build Path art = order 82 (flip cards off since v8.1.144)
// Hooks: book only with art and two Mutation options; painted cards only when all 3 + back are loaded; old cards otherwise.
assert(src.includes("opts.length===2&&opts.every(o=>o&&o.mutation)&&this.realTex?.('book80_spread')"));
assert(src.includes("opts.every(o=>o&&o.kind==='Build Path'&&this.realTex?.(pathCardKey(o.key)))&&this.realTex?.('pathcard80_back')"));
assert(src.includes("else if(book&&this.drawRecipeBook?.(opts,startY,t)){} else if(pcards&&this.drawPathCards?.(opts,startY,t)){} else"));
function method(n){const a=src.indexOf('  '+n+'('),m=/\n  [A-Za-z_]\w*\([^\n]*\)\s*\{/.exec(src.slice(a+1));assert(a>=0&&m,n);return src.slice(a,a+1+m.index);}
const C=vm.runInNewContext('class C{'+['drawRecipeBook','drawPathCards'].map(method).join('\n')+'\n}C',{Sfx:{card(){}},pathCardKey:id=>({glacier:'pathcard80_barrage',barrage:'pathcard80_glacier'})[id]||'pathcard80_'+id});
assert(src.includes("const PATHCARD_ART={glacier:'pathcard80_barrage',barrage:'pathcard80_glacier'};"),'owner: Glacier Bloom and Barrage pictures swapped');
const obj=()=>{const o=new Proxy({active:true,scaleX:1,scaleY:1,height:20,y:0,alpha:1},{get(t,k){return k in t?t[k]:(...a)=>{t[k+'Args']=a;return o;};},set(t,k,v){t[k]=v;return true;}});return o;};
const mk=(tex)=>{const s=new C(),added=[],calls=[];Object.assign(s,{W:360,H:740,lvlCards:[],lvlUp:{add:a=>added.push(...[].concat(a))},realTex:k=>tex.includes(k),add:{image:()=>obj(),text:()=>obj(),graphics:()=>obj(),sprite:()=>obj()},anims:{exists:()=>true},tweens:{add(){},killTweensOf(){}},time:{now:0,delayedCall:(ms,f)=>calls.push(f)}});return [s,calls];};
{const [s]=mk([]);assert.equal(s.drawRecipeBook([{mutation:1},{mutation:1}],100,null),false,'no art = old cards');assert.equal(s.drawPathCards([{},{},{}],100,null),false);}
{const [s]=mk(['book80_spread','book80_page_glow']),h=obj();assert.equal(s.drawRecipeBook([{title:'A',mutation:1,apply(){}},{title:'B',mutation:1,apply(){}}],100,h),true);assert.equal(s.lvlCards.length,2);assert(s.lvlCards[0].right<=s.lvlCards[1].left,'left page then right page');s.lvlCards[1].onFocus();}
{const [s,calls]=mk(['pathcard80_back','pathcard80_sniper']);const o=k=>({kind:'Build Path',key:k,title:k,apply(){}});assert.equal(s.drawPathCards([o('sniper'),o('shotgun'),o('ricochet')],100,obj()),true);assert.equal(s.lvlCards.length,3);assert.equal(calls.length,3,'three cards flip one by one');assert(s.levelCardReadyAt>=1200,'taps wait until the cards are face up');s.lvlCards[0].onFocus();}
console.log('Special picks art 80: 21 MANIFEST-verified WebP, stage-lazy with per-hero path cards, recipe book + flipping Build Path cards with old-card fallback passed');
