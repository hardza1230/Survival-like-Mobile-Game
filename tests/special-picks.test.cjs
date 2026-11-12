// v8.1.122 owner: Relic = treasure vault (objects on pedestals), Evolution = forge — not level-up cards. Same tap-twice confirm via lvlCards + onFocus.
const assert=require('node:assert/strict'),fs=require('node:fs');const s=fs.readFileSync('game.js','utf8');
function method(n){const at=s.indexOf('  '+n+'('),tail=s.slice(at+1),nx=/\n  [A-Za-z_]\w*\([^\n]*\)\s*\{/.exec(tail);assert(at>=0&&nx,n);return s.slice(at,at+1+nx.index);}
const ol=method('openLevelUp');assert(ol.includes('const vault=this._relicPick&&!this._chestReward&&opts.length>0&&opts.length<=3&&!this._inTutorial,forge=!vault&&opts.length===1&&opts[0]&&opts[0].evolution;'));
assert(ol.includes('if(vault&&this.drawRelicVault?.(opts,startY,t)){} else if(forge&&this.drawEvoForge?.(opts[0],startY,t)){} else'),'falls back to cards');
assert(method('highlightCard').includes('if(c&&c.onFocus){ c.onFocus(); return; }'));assert(method('pickCardAt').includes('if(this.levelChoiceHint&&!c.onFocus)'));
const rv=method('drawRelicVault');assert(rv.includes("realTex?.('vault80_bg')")&&rv.includes("realTex?.('vault80_pedestal')")&&rv.includes('this.lvlCards.push(card)')&&rv.includes("'Tap again to take “'"));
const ef=method('drawEvoForge');assert(ef.includes("realTex?.('forge80_anvil')")&&ef.includes("'Tap again to forge “'")&&ef.includes('!(this.lvlCards||[]).includes(card))return;'),'spark loop stops when the screen changes');
const ao=fs.readFileSync('docs/art_orders/80_SPECIAL_PICKS.md','utf8');for(const k of ['vault80_bg','vault80_pedestal','forge80_anvil','book80_spread','book80_page_glow','pathcard80_back'])assert(ao.includes(k),k);
for(const id of ['sniper','shotgun','ricochet','glacier','barrage','pierce','brawler','titan','dashboxer','storm','smite','tempest','prism','lens','sentinel']){assert(ao.includes('pathcard80_'+id+'.png'),id);assert(s.includes("{id:'"+id+"',"),'real path id '+id);}
console.log('special picks ok');
// v8.1.123 owner: Frozen Pantry paint = smaller liquid puddles that spread + wobble; equipment slots = rarity glow/gradient, no frame, smaller icons.
const fb=method('fpBlob');assert(fb.includes("const K='mm_puddle'")&&fb.includes('P.length<320')&&fb.includes("ease:'Cubic.easeOut'")&&fb.includes('rad=14+Math.random()*16'),'liquid puddles');
assert(method('fpTick').includes('q.setScale(q.bx*(1+.06*Math.sin(t*1.7+q.ph))'),'gentle wobble');
const bg=method('buildGear');assert(bg.includes('this.gearRarityFx?.(equippedArt,')&&bg.includes('this.gearRarityFx?.(item,x,iy,cw,ch)')&&!bg.includes('menuRarityFrame?.(item,x,iy,cw,ch)')&&bg.includes('setDisplaySize(ss*0.66,ss*0.66)'));
const rf=method('gearRarityFx');assert(rf.includes('fillGradientStyle')&&rf.includes("const K='mm_rglow'")&&rf.includes("gl.once?.('destroy',()=>this.tweens.killTweensOf(gl))"),'glow + gradient, tweens cleaned');
console.log('pantry paint + gear glow ok');
// v8.1.125 owner: Frozen Pantry paint = short phase, whole map frozen, hero does not attack.
assert(method('fpThaw').includes("S.phase='fight'; this._holdFire=false; S.global=false;")&&method('sigClear').includes('this._holdFire=false;')&&s.includes('if(!this._holdFire)for(const key in this.skills){')&&s.includes('T:full?10:12'),'hold fire + short paint');
console.log('pantry hold-fire ok');
// v8.1.126 owner: Chapter 2 and 3 stages get a lead (signature) mission too, like Chapter 1.
for(const t of ['defendNectar','cleanAir','creepingRoots','seasonCycle','breakRoots','seedRift','shakeTrees','mirrorPath','vaultAltar','lastLight'])assert(s.includes(t+"'],lead:'"+t+"'")||s.includes("lead:'"+t+"'"),'lead '+t);
assert(s.includes("objectives:['defendNectar','hunt','purge','capture'],lead:'defendNectar'"),'C2-1 Defend Nectar');
console.log('chapter 2-3 leads ok');
