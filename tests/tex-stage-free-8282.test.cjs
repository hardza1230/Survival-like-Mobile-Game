// v8.2.82 owner: after playing a while the game shows fallback art (memory full) → free other stages' art before the next stage + free memory when a load fails.
const fs=require('fs'),assert=require('assert');const src=fs.readFileSync(__dirname+'/../game.js','utf8');
const m=n=>{const i=src.indexOf('\n  '+n+'(');assert(i>0,n);let k=src.indexOf('\n',i+1);while(src.startsWith('\n    ',k))k=src.indexOf('\n',k+1);return src.slice(i,k);};
assert(m('texStageKeep').includes('this.stageRequiredKeys(idx)')&&m('stageRequiredKeys').includes('this.stageArtKeys(idx)')&&m('stageRequiredKeys').includes('!deferredImage(k)')&&m('stageRequiredKeys').includes('!STAGE_SHEET_KEYS.has(k)'),'keeps the selected manifest including shared battle art');
assert(m('texFreeStages').includes("c==='stage'&&!keep.has(k)"),'frees only other stages');
assert(m('ensureStageArt').indexOf('this.texFreeStages?.(idx)')<m('ensureStageArt').indexOf('this.ensureGroup('),'other-stage art is freed before queueing the selected manifest');
assert(src.includes('this.texFreeStages?.(i);'),'boss rush next boss');
assert(src.includes('this.menu.removeAll(true); this.texFreeForRun(idx);')&&m('texFreeForRun').includes("(!!keep&&c==='stage'&&!keep.has(k))"),'run start frees other stages');
assert(m('texMemRelief').includes('TEX_BUDGET_MB*.7')&&m('texMemRelief').includes('<3000'),'relief to 70% budget, throttled');
assert(src.includes("this.load?.on?.('loaderror',f=>{ if(f&&f.type!=='audio'&&this.texMemRelief?.()>0)"),'failed image load frees memory');
console.log('Texture stage free 8.2.82: other stages freed before the next stage, load failure frees memory passed');
