// v8.1.108 A12: 36 League / Trial / Forge / Memory / Patrol SFX — verified sources, installed files, ASSET_AUDIO keys, each key called at its hook.
const assert=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto');const s=fs.readFileSync('game.js','utf8');
function method(n){const at=s.indexOf('  '+n+'('),tail=s.slice(at+1),nx=/\n  [A-Za-z_]\w*\([^\n]*\)\s*\{/.exec(tail);assert(at>=0&&nx,n);return s.slice(at,at+1+nx.index);}
const M=JSON.parse(fs.readFileSync('assets/incoming/audio_a12/MANIFEST.json','utf8'));assert.equal(M.length,36);
for(const r of M){const src=fs.readFileSync('assets/incoming/audio_a12/'+r.file);assert.equal(crypto.createHash('sha256').update(src).digest('hex'),r.sha256,r.key);
  const dst='assets/audio/sfx/a12/'+r.key+'.mp3';assert(fs.readFileSync(dst).equals(src),dst);assert(s.includes("sfx_"+r.key+": '"+dst+"'"),r.key);}
const H={lg_breach_open:'hmOpen',lg_breach_collapse:'hmTick',lg_splinter_pick:'hmTick',lg_breach_chest:'hmChest',lg_hunger_stone:'hmSplinters',lg_hand_lord:'hmTick',lg_domain_open:'hdSetup',lg_breachlord:'hdLord',
 lg_jar_open:'fpOpen',lg_statue_wake:'fpThaw',lg_statue_refreeze:'fpVanish',lg_herald_horn:'hhTick',lg_gates_shut:'hhDown',lg_pot_ritual:'gpRound',lg_pot_flavor:'gpOnKill',lg_dish_served:'gpServe',
 lg_golem_part:'ggTick',lg_golem_bake:'ggBake',lg_golem_slam:'ggTick',lg_golem_crumble:'ggDown',lg_root_cut:'crTick',lg_siege_gate:'hsTick',lg_siege_break:'hsBurst',
 tr_curse_pick:'ultStartFight',tr_round_won:'ultRoundWon',tr_take:'ultTick',tr_risk:'ultTick',tr_fail:'ultFinish',ui_forge_row_up:'forgeUpgrade',ui_forge_ink_move:'forgeMove',ui_codex_up:'codexUpgrade',
 pt_pop:'patrolPop',pt_loot:'buildPatrol',pt_ambient_loop:'buildPatrol'};
for(const [k,fn] of Object.entries(H))assert(method(fn).includes("'"+k+"'"),k+' in '+fn);
assert(s.includes("this.a12?.('ui_domain_button'")&&s.includes("Sfx.menuCue?.('ui_memory_gain'"),'domain button + memory gain');
assert(method('patrolStop').includes("eventLoopStop?.('pt_ambient_loop')"),'ambient stops when leaving Patrol');
assert(method('gpRound').includes("this.a12?.('lg_pot_ritual',.5,.5)||Sfx.bossWarn?.()"),'old cue kept as fallback');assert(method('a12').includes('menuCue')&&method('a12').includes('orderCue'));
console.log('A12 audio: 36 verified SFX installed, registered and hooked (League, Trial, Forge, Memory, Patrol) passed');
