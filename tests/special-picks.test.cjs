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
