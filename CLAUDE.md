# ⚠️ DEPLOY BRANCH — read first

The live game (GitHub Pages / APK live update) deploys ONLY from `claude/vampire-survival-mobile-game-yo9e8w`. Pushes to any other branch (session branches like `ccr-*` or `claude/*`) run the Pages workflow but it fails, so the game stays on the old version. Owner has approved this permanently: after committing, always push to the vampire branch too (`git push origin HEAD:claude/vampire-survival-mobile-game-yo9e8w`, fast-forward only; if it is not an ancestor, merge it in first, never force). Push the vampire branch ALONE (not in the same moment as the session branch): both runs share the Pages concurrency group, so the session-branch run cancels the vampire deploy (v7.0.0/7.0.1 got cancelled this way). Then confirm the "Deploy Web (GitHub Pages)" run for that branch succeeded and the in-game version matches `GAME_VERSION`.

# Art delivery 18 — Taro Spark + Ball Lightning

16 PNG32 sources delivered to assets/incoming/taro_spark_ball/ with manifest, prompts, QA and delivery notes. A/B/C were subsequently integrated in v7.8.25; phone visual/FPS review remains pending. See the current art order for runtime status.

# Art delivery 20 — Hero VFX gaps

21 PNG32 sources / 100 frames delivered to assets/incoming/hero_vfx_gaps/ with MANIFEST.json, PROMPTS.json, QA_REPORT.json and DELIVERY_README.md. Exact source dimensions/grids and PNG data checked. Runtime integration is complete: 21/21 wired in v7.8.45–46, including the restored C8 landing dust. Seam/apex/timing and phone visual/FPS review remain pending. Historical delivery paragraphs below retain their original per-version context.

# Art delivery 26 — Transition and card icons

82 PNG32 sources /90 frames delivered to assets/incoming/transition_card_icons/:77 distinct card icons plus5 transition assets. Manifest, built-in ImageGen prompts, technical QA, 24/90px icon galleries, hero-family review, tile pairs and both-direction offline transition previews included. Source decoded32.832MiB; runtime wiring, boot GPU budget and phone FPS pending. No game-version change; preserve current v7.8.67. All100 initial delivery files byte-verified from GitHub at1c770afb; exact proof in UPLOAD_VERIFICATION.json.

# Art delivery 25 — Hub motion

25 PNG32 assets /81 frames delivered to assets/incoming/hub_motion/:20 required A/B/C plus5 optional animated menu icons. User approved Python source-pixel extraction; original visible Momo/flower pixels preserved, AI only for occluded/new portions and VFX/icon/blink sources. Source placement0px, fully opaque interiors match original RGB exactly; backgrounds/alpha edges intentionally differ. Decode/CRC/grid/hash/alpha, blink, ±6deg joints, loop and source-memory checks reviewed; decoded28.208MiB <40MiB. Incoming only; runtime packing/loading, tweens, boot cap and phone FPS pending. All49 final delivery/follow-up files full-byte verified on GitHub at5dc47db; UPLOAD_VERIFICATION.json records exact proofs. Art23/24 already published and fully verified.

# Art delivery 24 — Pause UI

19 modular PNG32 assets /43 frames delivered to assets/incoming/pause_ui/. Native gradients/endcaps retained, real alpha, separate icons and runtime text. Both412x860 and360x780 no-scroll screen assemblies, corner stability at requested sizes and white11px text reviewed. Incoming only; runtime integration pending. Order23 complete, full31-file GitHub byte readback verified at3ffe1bc. Next: order25 Hub motion.

# Art delivery 23 — Level Up UI

20 PNG32 assets / 66 frames delivered to assets/incoming/levelup_cards_ui/ with manifest, final built-in ImageGen prompts and QA previews. All table rows delivered (summary corrected 19→20). 9-slice, four tint palettes, alpha and 11px text contrast checked. Incoming only; runtime integration pending. Next art: order 24 Pause, then order 25 Hub motion.

# Latest delivery: v7.9.17 — ECRS relics + duplicate cards (owner: ตามแนะนำ)

Relics: jam = Sticky Jam (relicJamTrail → puddle r70, 12 ticks×250ms via artDelay, pins non-boss once (frozen .5), damage() ×1.25 via inJamPool; max 4 pools) · chill = Cold Snap (damage(): every 6s → relicColdSnap freezes target + 110px non-boss 1s; _coldSnapAt) · shell also triggers on elite/mini/boss kill (trophy removed) · momentum, magnet removed (fusions f_quakeking→dashcharge, f_horizon→firstbite; Sticky Rush = jam+dashcharge) · TRADEOFFS t_glass, t_core removed · condRelicCard c_dash removed (p._cond.c_dash still works for gear). Cards: Yuzu p_feast Chain Feast = kill → 30%/rank next bite ready, p_pulp Quick Paws = swarm run +20%/rank · Cocoa p_footwork Hot Hands = every 8/6/4th fist explode 60 ×1.3 (_ffHot), p_blitz removed, Phantom Jab takes the combo hold (cocoaComboHold uses p_phantom) · Taro p_sentry_pulse Close Charge = sentries <260px of Taro tick ×(1+.12·lv) (pulse no longer ×.9^rank), p_squall Forked Arc removed · Sesame p_facet Prism Echo = every 4th/3rd cast re-fires at 50% after 300ms, p_swift Retreat Shot = charPassiveOnDash sets _sesRetreatT +2s → next beam ×(1+.3·lv) · Momo buckshot removed. Tests: charged-projectile jam case, taro-progression Forked Arc case, fixtures (cocoa-rework-baseline, taro t1/t5 hashes). Browser smoke 8 hero/path combos with relics + dashes: 0 errors. Still open from the ECRS list: CC2–CC5 (far/frozen/boss/execute layering), CR1 hero mods, CS1 Sesame mutations, RR1/RR2, RS1/CS2.

# Previous delivery: v7.9.16 — Clearer damage card wording (owner)

Owner asked how 'power' cards differ from '+damage'. One-attack multipliers (basic 'power' cards of every hero incl. taroAttackInfo, path fx:{dmg} cards Heavy Peel/Sour Mixer/Static Shards/Spark Power/Refraction/Steady Hand, talent _P({dmg}) nodes) now read '+N% <X> hit (multiplies)' + desc 'Multiplies with your “+% damage” total.'; dmgMul pool sources (Weave Attack Power, hero Talent dmg nodes, Path Focus, mod f_might) read '+N% all damage (adds up)'. Text only, no number changes. tests/talent-icons normalizes the new labels; cocoa-rework-baseline regenerated (non-Cocoa heroes + Taro basic).

# Previous delivery: v7.9.15 — Arena mechanics for every boss + card clean-up (owner)

arenaMech(b) (called via arenaMechDue at the top of drainBossAttack[boss]/chili/frost/rootmother/behemoth/chronobloom/trueRootmother and kitAttack[boss]) picks per stage: 1 Clogmaw arenaSweep h (+v in P2) + 🧽 · 2 Griddle arenaGrid checker/rows/cols + 🍳 · 3 Golem arenaPillars (hide behind a pillar from the breath, pillar breaks) + 🧊 · 5 Bud arenaPods (3 kickable pods, b._podShield → damage() ×0.3 until all kicked; 8s → nova) · 6 Behemoth arenaFog (moving clean-air bubble, 1→2) + 🍄 · 8 Chronobloom arenaHands (two rotating clock hands, segment hit) + 🌱 · 9 True Rootmother sweep h then v (+2 pods in P2) · 10 Colossus half-screen scythe on the player's side of the boss + 🌾 · 11 Hollow Bloom arenaDecoys (2 fake images + real boss dripping nectar, all fire) + 🍑 · 12 Glass Gardener 3 💎 mirror counters + beam path boss→mirrors (kick a mirror = shorter path + 3%) · 13 Seedwarden arenaRings (2/3 rotating shrinking rings with one gap) + 💣 · 14 First Planter grid/sweep/rings/crown pods by phase · Pinnacle jaws (rings) / tongue (sweep h+v) + 🍖. Tools: arenaTick/runArenaTicks (update), arenaView (camera worldView), arenaDmg (16+6·si, mini .9, Pinnacle 1.15), arenaEnd. Browser: all 13 × 3 phases ran, 0 errors. Cards (from a full audit): renames Loopback / Fade Burst (two Overloads), Static Shards (Arc Power ×2), Frost Stack (Deep Freeze/Deep Chill), Steady Draw (Momo vs Mint Heavy Draw), Deep Impale, Wide Pound, Sixth Slam, Finishing Blow, Split Light, Calm Mirror, Ice Breaker, Peel Pop, Last Squeeze, Giant Hunter, Thick Rind, Marksman’s Oath, Mochi Heart+; unused/fitting icons for s_slug/s_seek/s_return/p_heavydraw/p_executioner/p_froststack/p_chainshatter/p_ember/p_crater/p_slamwave/p_recharge/p_sentry_overload/p_sentry_link; SKILL_ICON.yuzling; text fixes (Hailstorm cap 2, Minty freeze, Sentinel style). Effect-duplicate cards listed for the owner to pick (not changed). Fixtures: cocoa-rework-baseline (non-Cocoa paths regenerated), taro-t5 damage hash.

# Previous delivery: v7.9.14 — Faster start (owner: loading got slow again)

Causes: 8 releases in a day (each new version waits for the full game.js via ?fresh= with no timeout) + v7.9.10 put journal/book in UI_ART_RE so the cached-start preloadAll waited for them. Fixes: UI_ART_RE drops journal|book (they stay lazy via MENU_GROUPS/LAZY_MENU_ART_RE + loadBook). sw.js ?fresh= = race network vs cached shell, FRESH_TIMEOUT 6000 (network keeps filling the cache → next launch is new). build-www.mjs minifies www/game.js with esbuild (import, else `npx --yes esbuild@0.24.2`, else ship full) then restores the exact `const GAME_VERSION = 'x'` text the pages.yml post-deploy check greps (esbuild merges consts → split with ';'). 2342→1979 KB raw, gzip 767→625 KB. Minified build passed the boss arena smoke + check-forge-live-ui 21 states. Source game.js is unchanged (tests read the source).

# Previous delivery: v7.9.13 — Boss arena mechanics pilot (owner picked pilot 3)

Owner wants skill-based boss mechanics like Terraria's Queen Bee. Following docs/BOSS_ARENA_MECHANICS.md P1+P2. Shared: arenaMechDue(b) (first 4.5s, then every 12/10/8.5s by phase, skipped while b._arenaBusy), bossStun(b,sec,label) (knock+atkCd), bossPctHit(b,pct) (damage() with _infTick so flat ATK is skipped; phase gate still applies), spawnCounter(b,x,y,{emoji,key,tint,life,onHit,drift,onArrive}) + tickArenaMech (dash kick = dashTime>0 or <.22s after dash, within 56px → flies to boss → onHit; unkicked 6s → warns 1s then small blast) + clearArenaMech (from clearBossObjects). Pilots hooked at the top of each attack fn: hiveRush (Hornet Queen C2-3: 3/4/5 side-to-side screen rushes at the player's row, lane warning 720/620/560ms, speed 1100/1250, then 🍯 jelly counter = 3% + stun + 40% slow 3.2s), antTunnel (Ant Empress C1-1: burrows (body off), shadow chases 2s then locks 700/560ms, erupts with hit + nova; phase 2 adds a fake shadow, the real one drips acid; 🥚 nest_eggs counter = 4% + stun), hungerFeast (Great Hunger C1-5: drainPull 4.2s 150/175/195 + 4/5 plates drifting into the mouth, each arrival heals 3%, kicking one = 3% + stun + pull ends). Browser: all three ran, kick → 3–5% boss HP + stun, 0 errors. Next after owner playtest: remaining 12 bosses + Pinnacle per the doc.

# Previous delivery: v7.9.12 — EXP stays on the ground (owner)

Owner: no flying EXP — the player must walk over it. settleStoryBudget no longer touches orbs (collected=0); leftover orbs keep their _storyBudget and pay through collectOrb. killEnemy boss branch no longer sets _vac on all orbs; onBossDown still pays any orbs left at stage end. tests/story-budget.test.cjs adds pick(s) (collect active orbs) before the settle assertions. Pickup magnets (vacuum item, Sweet field) unchanged.

# Previous delivery: v7.9.11 — Remaining boss kits + wave-end EXP visible (owner)

BOSS_KITS const (before BOSS_LINES) = data-driven kits: m2 Boiling Pan, m3 Giant Ice Block, m4 Banquet Executioner, m5 Sporewarden Mantis, m10–m14 C3 minis, b10–b14 C3 bosses, pin = Pinnacle (stage 14 + _pinnacleArt). Each kit {c tint, base, p2, p3, moves{n banner, h hint, pose, run(ctx) → cooldown}}; ctx helpers ring(n,gap,spd)/fan(a,n,step,spd)/lane(a,ms) (vfx_line telegraph)/haz/adds/T(delayed, b.active guard) + s (scene) for chargeTelegraph/bossNovaWave/drainPull/spawnBossObject. kitAttack(b) dispatched in _bossThinkCore before the generic pick for isBoss&&si≥10 or isMini&&si∈{2,3,4,5,10–14}; kitPose → c3BossPose / stage5Pose / chapter2Pose. Damage = old generic scale (shot 9+3·si, hazard 16+6·si, mini ×.9, Pinnacle ×1.15); phases use the generic 50%/25% thresholds. Browser: all 67 moves fired incl. delayed parts, 0 errors. settleStoryBudget: wave-end orbs still pay instantly (story-budget test) but now spawn a copy that tweens into the player (owner saw EXP vanish). Owner phone review pending; Candlewick/arena mechanics T1–T8 still open.

# Previous delivery: v7.9.10 — Art orders 27 (journal Equipment/Forge) + 28 (book transition) wired

scripts/pack-art-orders-27-28.py: 27 → assets/art/journal (50%/frame, 401 KB, 6.2 MiB decoded, lazy with gear/craft via MENU_GROUPS + LAZY_MENU_ART_RE), 28 → assets/art/book (80%/frame, 985 KB, 22 MiB). TEMPLE_UI gets jr_/bk_ cells (tuFrames/tuImg). Journal: JR_REQ all loaded → this._jrSkin (reset in buildMenuScreen, set in buildGear/_buildCraftBenchRaw); helpers jrOn/jrPanel (kMax caps corner size)/jrImg/jrIcon/jrText/jrFit/jrButton (primary with socket icon, secondary, accent, icon, pill, pill2, pager)/jrHeader/jrInkPass (JR_INK maps the old light text colours to ink; _jrKeep = text on dark pieces). _screenBg → jr_page_bg + jrHeader; heroButton → jrButton; forgeChrome/forgeButton map keys (panel/panel_on/row_pick/chip/slot/summary/footer, Tier = accent, ‹ › = pager); every site keeps the purple fallback. Book: BOOK_KEYS, loadBook (ensureGroup; also started during the stage summary), bookTurn (6 frames 320ms + shadow .4 + spine + dust envelope, flipX for Back) in menuTransition when bookReady, else the order 26 curtain; bookCover on every showMenu (closed 150ms + glow → 5 frames; tap skips via _bookSkip in handleTap; 1.4s safety). Browser: cover, page turn, Equipment/Forge 360×800 OK; check-forge-live-ui 21 states + npm check pass. Phone visual/FPS review pending.

# Previous delivery: v7.9.9 — Box opening + boss talk loop (owner)

playBoxOpening(list,done) runs at the end of onStageClear before showStageEpilogue: this.over overlay (veil .96, setVisible(true) — children must NOT use camUI or they vanish), grid ≤15 boxes ('chest' tinted by FIELD_DROP_TABLE tier colour, better tiers last, '+N more'), each shakes then reveals gear_<id> art + name (openRunBoxes now returns id/ilv); legend = Sfx.legend + flash; full-screen _rollBtns tap = open all; Continue → done. Skipped in tutorial / no boxes. Boss lines: BOSS_LINES[stage] = [intro, defeat, mini, [boss loop×3], [mini loop×2]] rewritten short/simple. bossSay types 38ms/char, holds max(3300,1800+len·70)ms (defeat 1800); tickBossSay loops lines 6–9s after the previous one ends (b._sayAt/_sayI reset at both boss spawns). Browser smoke: boxes revealed + Continue, C1-3 boss intro → Sizzle → Feel the heat → Stove, 0 errors.

# Previous delivery: v7.9.8 — EXP never lost (owner) + art order 29

dropOrb: ≥300 active orbs → value merges into the nearest orb within 90px of the same budget (tint/scale by new value); pool full → gainXp in every mode (was Story only). Boss kill (killEnemy isBoss) sets _vac on all orbs; onBossDown collects any left (paid to story budget) and gainXp. Browser check: 500 drops → 300 orbs holding 500 EXP, 0 errors. Art order 29 `docs/art_orders/29_EXP_ORBS.md`: 'Flavor Drops' 6 tiers (shape + colour, not the Sugar candy), shadow, pickup/big pickup/trail/merge VFX, HUD icon — awaits art.

# Art delivery 27 + 28 — Journal UI / book transition (20 Oct)

Order27: 30 PNG32 /69 atlas frames (all A1–F2 rows; old summary33 corrected) in assets/incoming/journal_gear_ui/. Order28:7 PNG32 /26 frames (old summary30 corrected) in assets/incoming/book_transition/. Built-in ImageGen sources, manifest/prompts/technical+visual QA, offline page assemblies at360x800/412x915, slice/tint/text samples and both-direction page/cover GIFs included. Original mockup refs unchanged. **Wired in v7.9.10 (see that delivery block).** Journal recommended50% pack (~6.239MiB decode); book80% per frame (~22.061MiB decode, full source34.473MiB exceeds24MB). Never preload these at boot. Keep curtain fallback and original hit tags. Delivery_README and UPLOAD_VERIFICATION.json record details and byte proof.

# Previous delivery: v7.9.7 — Forge ECRS set 2 (owner: R1+R2+S2+E2)

forgeLayout portrait gets the slots row back (36/42/46px) and a shorter footer (64/66/70). R1 _buildCraftBenchRaw slot strip: 6 chips (equipped or first item art, count badge), tap = that slot's equipped item, tap the active slot again = next item in that slot (tags fslot_<slot>, forgeSelectItem). E2 summary name tap no longer opens the item-info panel (gear_info removed; ⇄ list kept). S2 footer: currency block and hint line removed; primary button label carries the count ('Roll · emoji N', 'Auto until ✓ (n) · …', 'Pick a result above · …' while a choice is pending). R2 locked item → primary button '🔓 Unlock to craft' (tag unlock) toggles the lock in place. Also fixed: Auto button passed icon so forgeButton drew only the icon — label now shown. check-forge-live-ui 21 states + npm check pass.

# Previous delivery: v7.9.6 — Forge ECRS set 1 (owner: C1+C2+E1+S1)

_buildCraftBenchRaw: C1 one primary button — ticked targets (forgeAdvOpen) → 'Auto until ✓ (n)' tag auto → autoRollToTarget, else 'Roll' tag roll; separate Auto/auto_locked button removed (Tier +1 kept, wider buttons). C2 implicit/current lines/choice options use modLine + MOD_TIER_COLOR by tierStars (implicit IMPLICIT_COLOR). E1 per-row i buttons (current_info_/info_) and Odds removed; pool rows show 'chance% · modDesc ✓' + tier label. S1 pool rows 34px (RH), header 'Tap mods you want · Auto rolls until one lands' when advanced, target zones only when forgeAdvOpen. modLine tolerates defs without fmt. Tests: forge-redesign (no odds/info, target → auto, pool_next optional, colour consts in ctx) + scripts/check-forge-live-ui.cjs (target → auto, no odds) — 21 states pass.

# Previous delivery: v7.9.5 — Plain one-line mods (owner picked A, list approved)

MOD_EFFECT {forge id | implicit id: template with {v}} for the 36 rollable mods + 18 implicits; modLine(d,v) = template with d.fmt(v) (fallback label + fmt for retired mods). drawModCompare uses modLine and drops the description row when a template exists (fit ✓ stays in the line). modDesc(d) returns the template without {v} (capitalised) so Forge shows the name + the same plain wording. Wording tweaks vs the approved list where fmt already carries the unit/sign: Slow Recovery '{v} regen' (fmt '+x HP/s'), Fresh Meal '{v} max HP healed on kill', Quick Preparation '{v} faster skill cooldown', Emergency/Dash Guard/Boss Padding 'damage reduction …'. Browser smoke 360×800 OK.

# Previous delivery: v7.9.4 — Equipment ECRS E2 + R2 (owner)

E2: Save.drainGearInbox() claims Inbox items while the bag has room; buildGear calls it first and toasts '📦 N items moved from Inbox to your bag'. R2: bag header = title/filter · Sets · count · (📦N only when Inbox has items) · ♻ (Salvage weaker; armed → ⚠ + banner with totals) · ⚡ (Equip Best), 36×26 heroButtons; the old 36px bag-action row is gone (bagY row removed, y+=34), old 's'/'m' drawActions removed. equipment-redesign test expects '⚡' / '♻'. Browser smoke 360×800: inbox 3 → 0 (bag 33/100), header icons, no page errors.

# Previous delivery: v7.9.3 — Equipment ECRS set 2 (owner: R1+C3+S2)

buildGear actions: R1 unequipped item row 1 = ⚔ Equip | ⚒ Enhance (SL.e; Save.enhance(uid) works on bag items; risk warning line shows for any selected item); equipped = full-width Enhance. C3 lock = small 🔒/🔓 chip at the card's bottom-right (zone flagged lockChip); row 2 = 🧪 Craft | right slot: equipped → 🔒 Locked/🔓 Lock toggle, locked bag item → '🔓 Unlock to salvage', else ♻ Salvage (starter → 'Starter items are protected'). S2 conf(ck,label)/arm(ck): confirm keys (sal:uid crafted salvage, salw bulk, enh:uid:lv) rebuild the screen with '⚠ Tap again to confirm' on the button instead of a banner. equipment-redesign test finds the lock via lockChip. Browser smoke 360×800 OK.

# Previous delivery: v7.9.2 — Equipment ECRS set 1 (owner: C1+C2+E1+S1, bag stays 2 rows)

buildGear: E1 portrait removed → top bar _pwBox full width (name Lv + ATK/DEF, no delta colouring now) + 6 slots in one row (ss ≤64). C1 this.gearFilter: slot tap toggles filter (gearSlot=slot, page 0, selection reset); bag shows only that slot, sorted equipped first then gearCompareScore desc; header 'Gloves ✕' clears. invRows fixed 2. C2 when selected is not equipped and an item is equipped: 2-column compare card (EQUIPPED | THIS ITEM · tap again to equip: art, name, gearBaseStatText one line scaled, tier · Lv · +enh) + ATK/DEF delta line (gearADDelta, green/red/yellow); equipped item keeps the old single card. S1: tapping the already-selected unequipped bag cell equips it. tests/equipment-portrait.test.cjs removed (tested the deleted portrait crop). Browser smoke 360×800: filter, compare, 0 scroll at 360×640–412×915, no page errors.

# Previous delivery: v7.9.1 (was v7.8.104; owner asked for the 7.9 line) — New version on first launch (owner)

Cause: sw.js shellFetch races network vs cache with SHELL_TIMEOUT 3.5s; game.js is 2.3MB so slow phones got the cached old version and only saw the update on the 2nd open. Fix: index.html fetches version.json (2.5s cap) before appending game.js; if version ≠ localStorage mochi_last_ver (written by game.js at load) → src += '&fresh=<v>' + GameLoader 'Updating to v…'. sw.js: version.json network-only (cache fallback), ?fresh= requests wait for the network and update the shell cache (fallback cache on error). Also scripts/set-android-version.mjs versionCode = major·1e6+minor·1e3+patch (old formula failed at patch 100 → APK build broke since v7.8.100). Browser check (localhost SW): first/stale/normal loads OK, 0 errors.

# Previous delivery: v7.8.103 — Cloud Play Stats + save mismatch check (owner)

Supabase game_saves got column stats jsonb (migration game_saves_add_stats). Cloud.queueStats() (3s debounce, after Stats.end and every sync) updates stats = last 150 runs; pull reads stats → Stats.merge (dedupe by t|hero|stage, sorted). Save.save stamps savedAt + lastDev (Tele.id). Cloud.base()/setBase(rev) in localStorage mochi_cloud_base {uid,rev} = rev last synced (set on push success / adopt). syncCloud: same rev → setBase · base known: cloud==base → push, local==base → adopt, else ASK · no base: fresh save → adopt, remote.lastDev missing or this device → newer wins (legacy), other device → ASK. ASK = Save._cloudConflict + Cloud.hold (push/queuePush skip) → buildMenuScreen shows buildCloudConflict (two summary cards: stages/rank/sugar/heroes/items/last saved; Keep This Device = rev max+1 & push, Use Cloud = adoptCloud: reset to SAVE_DEFAULTS + load). Browser smoke with mocked Cloud: conflict shown, Use Cloud adopts, local-newer pushes silently, stats merged, 0 errors.

# Previous delivery: v7.8.102 — Boss lines on screen (owner: camera panned away, line not seen)

bossSay(text,who,ms) is now a UI text box (camUI, W/2·H·0.70, name line + quoted line, depth 130) instead of a world bubble. bossIntro schedules the intro line at 1750ms (camera on the boss, during cinematic) and sets b._said; minis still via tickBossSay; defeat line via bossLine(1). Smoke C1-3: line visible during cinematic, mini + defeat OK, 0 errors. Run trait (owner: no notice in replay — single banner slot was overwritten): traitTxt HUD line under kills (pad+74, emoji+name, shown with HUD only while _runTrait) + banner delay 2.3→4.6s. Equipment no scroll (owner): buildGear estimates _top(ss)+_below(rows) → invRows 3→2 if short, then shrinks slot cells ss (min 40); item card 78→64; action rows pinned at _actTop=max(y+60,h−92−warn); drawModCompare(…,maxY) compacts (drops desc lines, then '+N more mods'). Measured with 40 items + 4-mod item: 360×740/800, 390×844, 412×915 = 0 scroll; 360×640 still 61px.

# Previous delivery: v7.8.101 — Boss voices + Reroll/Banish removed (owner)

BOSS_LINES[stage] = [intro, defeat, mini] (15 stages, English). storyVoice() = story only (no recipe/rush/rift/tutorial/pinnacle). bossSay(text,follow,x,y,ms) world text bubble (font 13/viewZoom, depth 9000, one at a time, follows target); tickBossSay() in update after the state check — this.boss._said (reset at both this.boss=b) → intro/mini line once play resumes after the cinematic. Boss kill (killEnemy isBoss) shows defeat line 2.3s and delays onBossDown 1600→2400. Removed level-up 🎲 Reroll/🚫 Banish buttons + banish tap mode + REROLL_MAX/BANISH_MAX/rerollLeft/banishLeft + Rank Perks Spare Cards/Cull (banishedKeys stays {} for pools). Load deletes rankPerks keys not in RANK_PERKS → RP refunded (also fixes v7.8.88 vigor/might/ironWill points that were never refunded). Browser smoke C1-3: mini/boss/defeat lines shown, level-up opens, 0 errors.

# Previous delivery: v7.8.100 — Lens: Interest Curve (replay events) + Surprise (run traits)

RUN_TRAITS (swift: enemy spd ×1.15 + xpMul ×1.25 · sugar: enemy hp ×1.15 + sugarFindMul ×1.35 · frenzy: cdMul ×0.87 + dmgTakenMul ×1.15 · lucky: mini wheel upChance +0.25). rollRunTrait() in launchStageLoadout begin() after startStage — story only, stageIndex ≥ 2, not tutorial/recipe/bossRush/pinnacle/rift; banner after 2.3s; player part re-applied in applyMeta reset block; enemy part in spawnEnemy before maxhp. Replay: _replayMeter.nextEv 60–90s → triggerRecipeEvent(true) (treasure/shrine/rare elite/merchant if relic slot free; shrine ticks via tickReplayProgress; shrine buff removal keyed to _artEpoch). Browser smoke: replay C1-3 rolled Frenzy (cdMul 0.835) + merchant event, no errors.

# Previous delivery: v7.8.99 — Menus stop scrolling (owner)

setupMenuScroll: _mScrollMax only when content bottom > H+2 (the +24 padding made every page that reached the last 24px scroll a little: settings/news/kitchen/stats/codex/bestiary 7–19px). Achievements portrait: gap 5 when >10 rows, rh min 38 (14 rows fit 360×780). Browser measure of 25 menu screens + Special Cores at 360×780 and 390×844: all 0 scroll.

# Previous delivery: v7.8.98 — Portrait only (owner)

index.html #rotate-lock overlay: touch device (pointer:coarse) with innerWidth>innerHeight → 'Please turn your phone upright' + __g.loop.sleep(); back to portrait → wake; also retries screen.orientation.lock('portrait'). Desktop (fine pointer) unaffected. Native APK/AAB already portrait via scripts/set-android-landscape.mjs (name is old; it sets portrait) and manifest.webmanifest orientation portrait. Landscape layout code in game.js left in place (unused on phones now). Browser check: 844×390 touch → overlay + loop stopped; rotate → resumes.

# Previous delivery: v7.8.97 — Rewards merged into the wheel (owner picked A, Relic 30%)

openPrizeWheel opts: prizes (custom pool, no tier upgrade), title, relic (adds 🔮 slot weight base·WHEEL_RELIC_CHANCE/(1−0.30) after Mimic, always shown), bonusText(tier) (line under result), double (after land: '✓ Take it' | '🎲 Double or Nothing' via _rollBtns, DoN → openDoubleOrNothing(p,done)); done now gets (tier, winner). Miniboss collectChest: grantMiniChestBonus(finalTier,true) (quiet) + offerRelic only when won.id==='relic' (no more 'Relic slots full' banner). openBossLootCards = gold wheel (sugar 5, currency 5, shovel 4, thread 5, gear 3, jackpot 2.4 weights; old 3-card + reroll gone). Browser smoke: boss wheel → 2 buttons → done; mini wheel with relic slot resolves.

# Previous delivery: v7.8.96 — Hybrid audience: later Forge depth + Special Cores

forgeAdvOpen() = stageMastery[4] || unlockedStage≥5 (no save/stageMastery → open, keeps tests) gates Forge 'Tier +1' (tag tier → 'tier_locked' + banner) and Auto (tag auto → 'auto_locked'); Roll unchanged. Temple Special Cores tab scOpen = rank≥1 (locked label + toast). check-forge-live-ui passes locally. Next: reward screens merge (owner wants to keep the wheel) — awaiting owner pick.

# Previous delivery: v7.8.95 — Equipment ECRS 4,5,7,8,11 (owner)

buildGear: Bazaar bar removed (setBot = gby-4) · inventory sorted GEAR_SLOTS order → equipped first → itemLevel desc → grade · set button label = set emoji + short name + n/pieces (gearSetCounts uses data.gear which equipGearInstance keeps in sync — 2/3 vs 0/5 were different sets) · bag row under Inventory header (bagY): '♻ Salvage weaker' | '⚡ Equip Best'; bottom = Equip/Enhance + Craft|Lock|Salvage · MOD_TIER_COLOR by tierStars (★1 white, ★2 green, ★3 blue, ★4 purple, ★5 orange) colours mod line + star in drawModCompare (Forge screen unchanged).

# Previous delivery: v7.8.94 — Equipment ECRS 1,2,3,6,9,10 (owner)

buildGear detail: one rarity label (tl.name, was 'Epic · Rare' with craftState) · drawModCompare implicit line drops IMPLICIT_TIER ('Common') · gearAffixName returns base name (all screens) · ★ Favorite button removed, load migrates favorite→locked (checks on .favorite kept) · SL: row1 Equip/Enhance, row2 Craft 28% | Lock 18% | '♻ Salvage +N🧶 +N🍬', row3 '♻ Salvage weaker' | '⚡ Equip Best' (true 2-row needs item 7: move bag actions to the Inventory header) · '📦 Inbox N' label (zone widened, count moved left). Pending owner: 4 (Bazaar bar), 5 (Set 2/3 vs set line), 7, 8 (sort), 11 (★1 stars).

# Previous delivery: v7.8.93 — ECRS E: dead code removed (~600 lines) + R10/R11/S12

Removed unreachable: old skill/passive/awaken card pool (rollUpgrades now 1 line) and old starting-skill picker (openStartingSkillChoice keeps the Basic Attack route) · Bear Beat Rush (beat*, BEAT_*) · legacy Taro castTaroBeacon/castTaroSmiteBasic/castTempestBasic/taroFireNeedle/taroNeedleVisual/taroTempestDash · old Forge/Gear actions (annul/scour/promote, rerollAffix, setAffixes, setGearRarity, sell/dismantleGearInstance, equipGearBase, bazaarGambleGear, _playAffixRoulette, slot*, chestSpin) · Recipe/Atlas leftovers (rollRecipeDrops, drawRecipeBar/Panel, migrateRiftToRecipes, makeRecipe, atlas* helpers, pact*) · Tag Sets data (TAG_SETS/UP_TAGS/TAGS_OF/TAG_TIERS/tagCounts/upTags/tagList) · misc dead methods/consts and both if(false) lines. Kept as test markers: gearStatText, rollOneAffixLocked, CRAFT_AFFIX_CAP, POWER_TUNING, POWER_BASE_HIT, taroRefreshRod, taroBeaconProfile; SKILLDEFS still feeds the loadout/Codex. tests/taro-smite + taro-tempest (not in npm check, covered only the removed legacy Taro code) deleted; validator contracts updated. R10: achievement 'hell' → 'Pinnacle Breaker' (pinnacleKills≥1, old diffBest≥3 still counts). R11: diffBest no longer written. S12: Codex row subtitle 'Weapons, Relics, Items and Sets'. Browser smoke boot + 5 hero stage starts: no page errors.

# Previous delivery: v7.8.92 — Performance pass (owner list, verified first)

Verified each claim in code. Done: _guardsNow() per-frame guard list (damage() stage 6–9 was iterating all enemies per hit) · _bigsNow() per-frame boss/mini list for priorityBossTarget · creamWave squared distances · tickEnemyPresentation caches anim/signature strings on this._presC (anims.exists still live — sheets load lazily) · burst() pools dots (_burstPool ≤140) · drawDashRing redraws only when charge/position changes · drawOverheadStatus draws once at local origin, moves og.setPosition, redraws/setText only when hp/max/lv/xp change · RENDER_DPR Auto = 1.5 (was 2; High still 3, Low 1.25). Checked and left: popDmg already pooled + throttled (2 tweens is fine); drawUniqueRing (side calls inside, risky); XP bar glint animates every frame by design; full spatial grid not done (120 enemy iterate sites — big refactor, ask owner).

# Previous delivery: v7.8.91 — ECRS S: text fixes

Relic card headline = [synergy, fusion, d.headline].filter(Boolean) (was 'undefined…' which _cardHeadline dropped). 'chill' → 'freeze briefly' on frost tag set, m_coldarc, t_core (Chill = Mint stacks only). Sesame mutations: fortress '+25% beam width', retaliate '+25% beam damage' (castMirrorBeam). Rocket Gauntlet desc/banner: extra blasts go to every gauntlet aimed at a Boss/Mini (code picks target, not on-hit). startReplayRun banner explains replay rules (no objectives, Elite 8×, mini half/boss full). condRelicCard kind 'Instinct'; mixed relic screens title '🔮 SPECIAL PICK'. c_streak text already fixed in v7.8.88.

# Previous delivery: v7.8.90 — ECRS R: onboarding order

Build Path card at Lv5 (rollBasicAttackUpgrades; Relic stays 6/12/18, Infusion 13). Hub need[] Activities 2→0 (Daily open from start). gearTut split: steps 0–1 (gacha+equip) after Stage 1 (gift Sugar only), steps 2–3 (Forge) wait for stageMastery[1] and give 3 Twist Cream once (d._craftTutGift), step 4 (Talent) waits for stageMastery[2]. Temple tab row: Rank Perks · Special Cores (new tab → _templeSpecial) · Depths; Kitchen moved to gActivity rows (locked text/toast until kitchenOpen), its back = gActivity. Perks page Special Cores banner kept.

# Previous delivery: v7.8.89 — Boss Rush hidden (owner)

gActivity row 'bossrush' removed (comment left) and router s==='bossrush' → buildHub. buildBossRush/run code kept; re-add the row to bring it back.

# Previous delivery: v7.8.88 — ECRS consolidation (stat layers, currencies, conditions, status, fusion, achievements, names)

Permanent HP/DMG = Weave + hero Talents only: RANK_PERKS vigor/might/ironWill removed (RP refund automatic, PERK_TIER_REQ {2:2,3:5}), Ancient deepRoots = +1 regen only; no Weave compensation (owner may want it — removed max was HP ×1.30, DMG +25%, taken ×0.88). Currencies: Shards → Thread 1:1 (addShards/spendShards alias threads, load migration, Enhance/salvage/UI 🧶, Bazaar sell-shards + boss Gear Shards card removed); Scrolls → Thread (SCROLL_THREADS 15, Ancient = ANCIENT_THREAD_COST 60, mini-prize scroll removed); Forge CURRENCY = transmute 'Twist Cream' (all lines, craftCurrencyForLine) + divine; CUR_ALIAS alt/chaos→transmute, forgeMigrate merges on v1 saves, drop pools 95/5…70/30. condRelicCard only c_dash, c_streak 'Kill Streak' (desc max +40% = real), c_close (c_low/c_still/c_full/c_boss cut as dupes; _cond.c_boss still used by Bossbreaker Gloves). applyBurn/applyFreeze helpers used by infusions, tag ignite/chill, recipe fire/ice/freeze, modFreeze, relic chill, cocoa quakestun/minty, misc; tickInfusion no longer needs an Infusion (burn from ignite sources was silently never ticking). Fusion: relic cards show '🧬 + Evolution → name', Evolution card lists fusion relics. QUESTS removed → 5 new ACHIEVEMENTS (stage2/3/4, gear3, legend), questClaimed migrated via QUEST_TO_ACH. Renames: relic glass → Cracked Crystal, p_titanfist → Titan Fist, p_secondwind → Blood Mend, uq_giant_gloves → Bossbreaker Gloves. Also removed dead craftRecipe/claimFreeRecipe/RECIPE_CRAFT.

# Previous delivery: v7.8.87 — ECRS out-of-run cleanup

Removed: Overcap (talTotal no longer adds it, Save.overcap gone, Temple star text), Core Stones (Save.coreStones/addCoreStone, Dig legend, dead digResolve branch; Depth Gift gives +STONE_THREADS Thread; boss loot Core Stone card dropped; load refund kept), Sugar Orders (SUGAR_ORDERS, Save.sugarOrder/buy/cancel/complete, Bazaar orders branch, _orderReward + summary row; load refund kept), Pact tab + buildPact, buildAtlasTreeOld, Delve header Points, old Atlas board code after buildAtlasMap, recipebag route + buildRecipes, buildZoneModifiers/rerollZoneMods (zoneModMul/zoneModsUnlocked stay neutral). advanceDaily = DailyQ.tick only (ensureDaily kept for login claim); _dailyRun clear bonus block removed. unlockCoreCharacters no longer returns early on FIGHTER_PLAYTEST_ALL → data.chars records unlocks, 'family' achievement completable (roster still open via the flag).

# Previous delivery: v7.8.86 — Delve depth = difficulty for loot (owner picked ข)

delveLoot(d) = {tier: d≥10 'legend' else 'epic', mul: min(3, 1+0.05·d)}; currencyTierFor returns it in Delve (recipeMode && _amapNode && !_pinnacleRun); grantCurrencyReward multiplies n by mul there. Delve node panel line shows 'Epic/Legend loot ×mul'. Story still always diff 1; Boss Rush keeps its own 1–3 choice (Hell = legend from 2 bosses — not changed, owner may want a cap).

# Previous delivery: v7.8.85 — ECRS E-batch: reroll/banish back, Kitchen signatures, dead card branches

openLevelUp: plain card screens (no chest/relic/path/infusion/mutation/evolution/tutorial) get 🎲 Reroll (rerollLeft = REROLL_MAX 3 + perk reroll) and 🚫 Banish (banishLeft = BANISH_MAX 2 + perk banish) buttons under the cards (lvlActionBtns, hit-tested first in pickCardAt); banish mode → tap a basic card → banishedKeys['b:'+key] (all pools already respect it) → reroll. FR_SIGNATURES with cut effects remapped: hurt+cleanse Candy Armor, lowHp+freeze Brain Freeze, unique+shots Double Helping, timer10+vacuum Slow Simmer. Removed 6 if(false&&…) branches (Dual Infusion, Fusion card, mod/trade injection) and the damage() infusion2 proc. Not removed (owner-approved off, harmless, tests reference them): TAG_SETS/TAGS_OF/UP_TAGS/tagCounts data, rollRarity (fixed common). ECRS report pending owner: Story difficulty forced to 1 (Hard/Hell only Boss Rush/Pinnacle), perf top items, C/R/S lists.

# Previous delivery: v7.8.84 — Equipment remove 1–4 / add 1–4 + Forge 1–4 (owner)

Forge: randomCraftSelected → forgeRollOptions(item,line,pool,3) → item.forgeChoice={line,options,old}; chooseForgeSustain(i) now any line (pending.line) · forgeKeepCurrent discards · choice panel 3 options + Keep · divineFocusedLine = tier +1 only (cap affixBestTierForItem, cost forgeGlazeCost = 11−t) · autoRollToTarget: 3 candidates per currency, miss = no replace, FORGE_PITY 20 forces target · forgeLayout slots/items rows null (picker removed; summary icon ⇄ opens all-slot item list, forgeSelectItem sets gearSlot). Equipment: IMPLICIT_POOL slots drop role dupes (i_hp armor, i_spd boots, i_cd amulet, i_crit/i_critdmg gloves) · Save.salvageGearInstance (shards+sugar) replaces Sell/Dismantle buttons · gearCompareScore (boots m = speed+dashCd diff) for arrows · gearEquipBest (gearPowerDelta per slot) · gearWorseItems + ♻ All ▼ (computed on tap, double-tap confirm) · bottom row thirds: Salvage | All ▼ | Equip Best · gacha bar → Bazaar button (_bazTab gamble, band cycle as card alt) · auto-salvage toggle already existed in Inbox · removed dead rerollGearAffix, gearEnhCost, craftLockFor, MOD_LINE_MAX, TIER_LOCK_COST, GACHA_COST, LEGEND_FORGE_COST, AFFIX_REROLL_COST. Kept: legacy AFFIX_POOL (old saves), 72 planned FORGE_CATALOG rows (catalog test), base item desc/apply (gearInstanceStats path).

# Previous delivery: v7.8.83 — Equipment phase 2: slot roles (owner approved table)

gearBaseStats: ATK only weapon (100%) + ring (35%); Armor only armor slot; role fields f=(iLv−1)/99, uq=quality·(1+.05·enh): gloves crit (1+4f)·uq % + critDmg (5+25f)·uq %, armor hp (5+55f)·quality·enhance (table said 10→160 but that gave Power +37% at iLv90; 5→60 replaces the lost boots/amulet Armor ≈ Power ±5%), boots speed (3+5f)·uq % + dashCd (2+6f)·uq %, amulet skillCd (2+6f)·uq % (cdMul). applyGearBaseStats applies them (maxhp, critChance, critMul, baseSpeed, dashCdMul, cdMul); gearBaseStatText shows them. Recommended Power unchanged.

# Previous delivery: v7.8.82 — Equipment phase 1 (owner: readable mods)

FORGE_ROLLABLE (36 numbers: power 1,2,3,4,6,7,10,11,12,49,57 · sustain 13,14,15,16,17,18,20,21,63,64,115 · play 29,31,32,33,41,42,45,48,97,100,117,118,122,139) gates FORGE_DEFS.enabled → forgePool/rollAffixes/craftAffixPoolForItem; existing affixes of other mods still apply. tierStars(mod,t)=5−floor(t·5/n) (T0–2 ★5 … T9–10 ★1) via tierStarText in forgeTierRange (Forge), craft results/roulette/banners, drawModCompare, compare list; Odds popup grouped by star. FORGE_MOD_TAGS + forgeModFits(mod) vs WEAPON_TAGS[hero] → green ✓ in drawModCompare and Forge pool. Phase 2 (slot roles table) awaits owner.

# Previous delivery: v7.8.81 — Equipment short-term fixes (owner: do the recommended 1–5)

enhanceOdds destroy=0 everywhere (failure = −1 level, floor +3; Save.enhance destroy branch now unreachable) · gearBaseStats enhance +8%→+12%/lv (+10 ×2.2) · gearSetCompareText uses gearSetPieces(id).length (was hard-coded /3) · gearPool: set weapons of earlier chapters stay in the weapon pool · buildGearLandscape removed (it showed GEAR base desc that applyScaledGear never applies) → landscape uses buildGear with 10 inventory columns (menu scroll handles height; equipment test adds 844×390) · buildGearClean/gearCleanCfg/gearCleanList + router case removed (unreachable since v7.8.67). craftState rarity turned out not to be shown anywhere (no change). Medium/long-term proposals (slot roles, 30–40 readable mods, build-changing uniques, fewer Forge currencies) await owner.

# Previous delivery: v7.8.80 — Split Spark falloff + secondary procs at 1/4

Owner: split sparks should get weaker each split. taroSwarmProfile split .55→.45 (card p_spark_split .75→.65) → gen1 45%/gen2 20% (card 65%/42%); sparkChild hits roll .7–1.3 instead of taroLightningRoll .2–1.8. Owner picked ข for procs: modOnHit runs for Taro terminal sources with chance ×.25 (Overcharge, Living Tempest, hitBoom/hitChain; recursion still blocked by _modTick + modBoom ≤8/.25s), Chill relic 10%→2.5% on terminal. Still gated: modOnKill, relic dashcharge, gearCritArc, _uqCritBurst, forge hit counters.

# Previous delivery: v7.8.79 — Storm Mark homing = Unique sparks only + on-hit cards from Taro secondary hits

Owner picked ก: mark homing (projectile tick mk0) and TARO_MARK_BONUS/big re-hit (taroProjectileHit marked) only for p.storm sparks; normal sparks fly as usual. On-hit audit: TARO_SOURCE_POLICY terminal sources (sparkChild, sentry, beacon, repeat, splash, shrapnel, nova, bomb) skipped every on-hit proc → Sentry got nothing from Infusions/HP on Hit, Spark only on gen-0 sparks (children = 73% dmg). Now damage() runs infusionOnHit (Sweet/Sour/Spicy/Minty) + _tagIgnite/_tagChill for terminal too; forgeDamage HP on Hit (mod 17, 0.5s cd) moved to direct||terminal. Still gated for terminal (by design, recursion/spam): modOnHit hitBoom/hitChain (Taro m_over Overcharge, f_tempest Living Tempest), modOnKill, relic dashcharge/chill, gearCritArc, _uqCritBurst, forge hit counters/23. Reported to owner.

# Previous delivery: v7.8.78 — Gear arrows + Spark Unique growth cap

buildGear cells: ▲/▼ at bottom-left for non-equipped items from gearADDelta (ATK+DEF sum; green/red, yellow/orange when ATK and DEF move opposite ways). castStormBeacon: smite path uses min(2, taroUniqueGrowth) (owner: Storm Mark took 200k of a 500k boss; sim Lv30 dmgMul 1.07: one cast = 1717 on boss vs 23 for 3s of normal attacks — growth ×4.48 × 18 homing storm sparks + mark ×1.5). Plasma/Overdrive keep full growth.

# Previous delivery: v7.8.77 — Spark basic attack fewer/slower (owner)

taroSwarmProfile smite: count = min(10, floor(rawRoots+1)) (was +3 → start 2, Lv4+ 3 instead of 4/5), excess threshold same shift, interval = max(.45, unitC×1.3) (was max(.35, unitC)). Damage per spark unchanged.

# Previous delivery: v7.8.76 — Invisible Sparks + Storm Mark count

taroProjectileVisual no longer gated by taroVisualBudget (transient-fx cap 20 shared with hit/bounce art made new projectiles fx=null → damage without visuals); projectile tick re-creates a missing/destroyed fx. Projectile sprites stay bounded by caps (80 normal + 72 storm sparks, 60 orbs). Storm Mark spark storm: 18 sparks one ring (quiet), still ×0.5.

# Previous delivery: v7.8.75 — Recommended Power on the new curves

stageThreat uses storyHp/storyDmg (mobs) and _bStoryC (boss HP) + boss dmg floor 1.5× tank. Recommended Power C1-1…C3-5: 130 160 190 240 290 350 440 540 660 820 1010 1230 1580 2030 2610 (was 130 150 200 240 320 420 600 690 830 1030 1140 1350 1580 1860 2200).

# Previous delivery: v7.8.74 — Spark Unique nerf (owner: too strong)

castTaroSparkStorm(dm,ul,quiet): when called from Storm Mark (quiet) hit/blast ×0.5 (qm). Mark strike/blast, +50% mark bonus, TARO_MARK_TIME 2 unchanged. Standalone Spark Storm fallback (no target on screen) stays full.

# Previous delivery: v7.8.73 — Card text audit fixes

Audited every hero card (BASIC_ATTACKS / BASIC_PATHS / MODIFIERS / FUSIONS / TARO_PROGRESSION). Fixed stale text: Spark Build desc (no boss curve), Sentry Build 'up to 3', Static Arc Reach 'Spark damage', smite arc renamed High Voltage (was Charged Current, too close to p_judge Charged Sparks), Mint p_quiver = +18% shard dmg (Barrage already at 2-lance cap). Reported to owner, not changed: shared icons inside a path (Cocoa titan/dashboxer/brawler cards, Mint barrage/pierce/glacier, Momo s_draw/s_seek/s_return, Mint rime+chill, Taro sentry overload/link use basic icons), Yuzu basic cards no icons, Momo Petal Spread under Sniper.

# Previous delivery: v7.8.72 — Spark normal attack not firing (owner)

taroSpawnProjectile: spark cap was 36 counting every spark incl. split children (1→4) and storm sparks, so casts returned null. Now normal sparks cap 80 (storm sparks counted separately, cap 72); a full pool makes a gen-0 cast retire the oldest (lowest left) normal sparks; children still refused at cap (parent keeps flying).

# Previous delivery: v7.8.71 — Arc 0.2s again + Weave max card layout

TARO_ARC_HOP_MS back to 200 (owner; loop-back hop stays). buildUpgrade: maxed cores use temple_core_card_max geometry (medallion 130·k, text 250·k, right 213·k) instead of the normal sheet's (111/205/263) — icon/text/button looked skewed.

# Previous delivery: v7.8.70 — 360×780 UI audit fixes

Audited every menu screen + HUD/level-up/pause/defeat at 360×780 (browser screenshots). Fixed: drawRosterHeader min scale q=max(p,.44) (candy icon covered Sugar) + fitted currency/title text · temple header frame sized to the fitted title (was 11px under Back/chip) · _rowBtn subtitle single line with ellipsis (2-line wrap covered titles in Settings) · Reward Inbox content y 64→96 portrait + real bag cap in empty text · Daily: 100-pt chest clamped inside panel, shared label y, quest counter after the bar · Dig miners label fitted before Hire · Bazaar duplicate Sugar line removed · Achievements summary/top lower · Boss Rush list on a dark panel, locked colour lighter · level-up hint shorter ('tap a card twice to pick') and lvlTitleArt keeps text off the ribbon caps (W-120). Not changed: Delve map black fog band (unexplored), pause HP number overflow only with absurd HP.

# Previous delivery: v7.8.69 — Taro tuning (owner)

TARO_OVER_TIME 4→3 · Sentry/Beacon orbs no longer steer to bosses (v7.8.41 seek/linger block removed; TARO_ORB_SEEK/TURN/LINGER now unused) · Spark: permanent boss seek (TARO_SPARK_SEEK branch) removed; Storm Mark TARO_MARK_TIME 6→2, target only on camera view, homing only while the mark is on view (±40px), castTaroStormMark also calls castTaroSparkStorm(dm,ul,quiet) so sparks appear · smite arc card = Charged Current: damage ×(1+.10·min(6,arc)), pierce left as is (sparks are not consumed) · TARO_ARC_HOP_MS 200→350; loop-back jumps (single target, also boss focus j>0) use taroArcLoopHop: bolt curves out ~90–130px and back, damage on return (0.45 hop) · Plasma end → taroMagField(x,y,max): t.mag 10s (TARO_MAG_TIME), damage() ×TARO_MAG_MUL 1.25 inside, graphics depth 4, ticked from taroTickPlasma. Fixture hashes updated. Owner phone check pending.

# Previous delivery: v7.8.68 — Art order 26 wired (card icons + menu curtain)

scripts/pack-art-order-26.py: 73 card icons 256→128 WebP in assets/art/card_icons/ (CARD_ICON_KEYS pushed to every STAGE_SHEETS = stage-lazy), relic_dashcharge/firstbite/harvest/trophy → assets/art/icons/ (boot like other relics), transition → assets/art/transition/ (boot: tr_curtain 540×960 opaque, tr_edge 80×960, tr_emblem 256, ASSET_FX vfx_tr_edge_sparkle 4×128×256 loop + vfx_tr_puff 3×2×128, lum alpha NORMAL). cardArtKey(o) in drawReadableChoiceCard maps Modifier m_→ic_mod_, Fusion f_→ic_fus_, Trade-off t_→ic_trade_, Flavor Infusion→ic_inf_, mutation→ic_mut_<hero>_<id>, evolution→ic_evo_<hero>, cocoa dashp/drum→ic_cocoa_ (missing texture = old icon; Yuzu has none by design). menuTransition: tileSprite curtain + edge (flipX backward) + 2 sparkles + emblem shrink/spin then puff, 340ms; old flat wipe stays as fallback. Boot GPU cocoa 298.5/300 MB — no room left for more boot art. Phone visual/FPS QA pending.

# Previous delivery: v7.8.67 — Equipment bag + hub polish (owner)

buildGear portrait: inventory = Save.gearItemsForSlot(null) (all slots, starters hidden), 5 cols × 3 rows per page (this.gearInvPage), square cells = art + 'Lv' tag top-right (NEW dot, equipped green border + ✓, +N enhance); tapping a cell sets gearSlot = item.slot so Equip/Enhance act on its slot. Clean/Sell/Scrap row and the slot-label button removed (Set button sits next to the Inventory title; Clean screen still exists but has no entry). drawModCompare = mod list (implicit + mods, tier, free slots) with modDesc() line (Forge description or MOD_DESC). Enhance: warning line when od.brk/destroy>0; destroy risk needs a 2nd tap (_gearConfirm 'enh:uid:lv'). Hub: only Play uses the _anim sprite, all icons share iconSz and hubIconFit (alpha bbox via hubIconBox) so visible content is equal; settings cog 44→36 (tap zone stays 44).

# Previous delivery: v7.8.66 — Boss/miniboss scaling (owner picked A+B+C+D)

Story only (Recipe/Delve keep old formula). A: boss HP = STAGES[0].bossHp·2·1.75/0.9 (3578) × _bStoryC[i], _bStoryC = storyHp×1.127^i = [1,1.45,2.11,3.07,4.47,6.49,9.44,13.73,19.96,29.02,42.18,61.33,96.76,152.67,240.88] (×1.454/stage, ×1.578 into C3-3..5; anchored C1-1 and C3-2 to old values) — replaces realStageBossMul jumps (C2-1 was ×2.16). C2 bosses now 23–44% softer, C3-3/4/5 +25/59/93% (C3-5 862k Normal). B: mini HP = 25% of the stage boss base. C: mini uses the boss _bossScale (Normal fixed, Hard/Hell bossHpMul·diff). D: dmg floor mini ≥1.2×, boss ≥1.5× Tank contact dmg (18·1.3·storyDmg·pg·diff). stageThreat/recommended Power still old formula. Owner phone check pending.

# Previous delivery: v7.8.64–65 — Monster scaling pass (owner)

v7.8.64 siege base HP 260→72. v7.8.65 (owner picked 1–3 + C3-3..5 steeper): spawnEnemy story HP curve storyHp=[1,1.29,1.664,2.147,2.769,3.572,4.608,5.945,7.669,9.893,12.761,16.462,23.047,32.266,45.172] (×1.29/stage, ×1.40 into C3-3..5) and dmg storyDmg=[1,1.082,…,2.38,2.689,3.038,3.433] (×1.082, ×1.13) replace stageCurveValue+BALANCE.c2* hp/dmg multipliers in story (Recipe keeps the old formula); C3 speed ×1.08 like C2-5 · siege dmg 24→18 (= tank), xp 10→5 · spawnElite hp = 120·s with the mob curve (1.5× tank), elite dmg on storyDmg. Note: C1-2…C2-5 mobs are 5–15% softer than before (old curve was uneven), C3-3…C3-5 harder (C3-5 basic 920→1211 HP). Tests/fixtures updated (batch9 fixture regenerated from real spawns). Owner phone check pending.

# Previous delivery: v7.8.61–63 — Arc 0.2s hops, Root Throne cleanup, Spark Storm rings, Sentry Overdrive

TARO_ARC_HOP_MS 200 (owner) and the pre-path starter castTaroNeedle (Static Arc = Taro normal attack before a Build) now hops too · hub Gear/Codex icons static (anim frames wobble). v7.8.63: elites on stages 6/7/9 use c22_bulwark / c23_wax_guard / c25_bark_guard art (was generic purple e_tank) · v7.8.64 siege base HP 260→72 (90% of tank 80) on every stage incl. C2-4 · C2-5 spawnWaveEnemy: siege → basic 60% and ≤2 live Root Choir · Spark Storm TARO_STORM_COUNT 36 fixed (2 rings) · Sentry: TARO_BL_SPEED 110→145, base orb radius 85→105 (cap 140), TARO_SENTRY_MAX 3 (taroPlaceNode cap + castTaroSentry), TARO_ORB_CAP 60 · castTaroOvercharge = Sentry Overdrive: fill to 3, 8-orb ring per sentry, t.overRing=5+n / t.overDmg, for TARO_OVER_TIME 4s every pulse fires a radial ring and pulses ×1.5, no detonation. Owner phone check pending.

# Previous delivery: v7.8.58–60 — Hero feedback, art orders 23–25 wired, stage stars, menu wipe

v7.8.58: Spark sparks no longer consumed on hit (live until timer; blast via taroOrbFade) · Spark Storm = 2 clockwise rings (st.step=4π/count) · Arc hops delayed TARO_ARC_HOP_MS 200 per jump (85 in v7.8.58; owner asked slower in v7.8.61) (target picks unchanged; immediate when no this.time) · Mint Barrage lance cap 2 (mintVolleyProfile) · frostLanceFinisher (dash end: nearest ≤160px, 1.4× hit, heal 30% dealt ≤8% max HP) · Glacier Bloom freeze adds 2 Frost Burn stacks ('FROSTBITE') · Cocoa Rocket Gauntlet life 6s, homeSpeed 640, homeRange 1400 (bullet homing now honours b.homeSpeed/homeRange) · Phantom Rush +1 leap per Dash since last cast (max 5, gap .3→.15) · queueLevelUp: LEVEL UP text then cards after LEVELUP_DELAY_MS 650.
v7.8.59: scripts/pack-ui-orders-23-25.py → assets/art/{levelup,pause,hub_motion}. UI pieces share TEMPLE_UI/tuPanel (Object.assign). Level-up/pause keys (PLAY_UI_KEYS) load with every stage (STAGE_SHEETS), not at boot. Hub layers are boot (bootKeep ^hub_(momo|fg|sky|window|cloud)_|^vfx_hub_); hub_ui_background now = hub_bg_far (no Momo; old image kept at assets/art/hub_reference/background.webp). buildHubScene: root container in 1080×1920 canvas units scaled to the bg cover; HUB_LAYERS [key,x,y,w,h,originX,originY,anchorX,anchorY]; puppet sway/bob/blink via hubTween/hubEvery (cleaned in stopHubMotion). Boot GPU now cocoa 295/300 MB — tight. drawReadableChoiceCard uses lvl_card_base+accent (tinted), lvlSocket, lvlPill, lvlBadge, glow/ribbon/shine/sparkle art; highlightCard → lvl_card_select; lvlTitleArt + vfx_lvl_open; lvlConfirmFx; drawHeldBar chips. buildPauseArt (portrait, art loaded) replaces buildPause layout; old layout = fallback. Relic "undefined" headline fixed.
v7.8.60: STAGE_STARS (clear · end ≥70% HP · never <30% HP via _minHpPct in update) · evalStageStars at start of onStageClear (story only, before the clear heal) → Save.data.stageStars[idx] bitmask, new stars pay (30+10·idx)·diff.reward Sugar · stars on stage cards + summary · menuTransition curtain wipe on screen change (no menu alpha — world grid would flash).
Owner phone review pending for all of the above.

# Previous delivery: v7.8.57 — Boss attack VFX C1–C2 (art order 22) wired

59 sheets packed by scripts/pack-boss-vfx-c1-c2.py (lum×1.35 alpha) → assets/art/boss_vfx/ · ASSET_FX vfx_bNN_* (warn/wave/crown_cage/bubble_cage carry fill:[w,h] bbox) · loaded per stage: loop after STAGE_SHEETS pushes vfx_bNN_* into STAGE_SHEETS[NN-1]. Helpers: bossKit(kind) → 'vfx_bNN_kind' for stageIndex 0–9 if texture loaded · kitSize(k,r) → outer ring width = 2r (height ≥55% of width) · kitLane(img,{key,h}) overlays a lane sprite on an existing vfx_line image (hides it, copies pos/rot/size/alpha each postupdate → timing unchanged) · bossSig(name,…) = heroFx must · bossSigHold (pause at frame 4). Hooked: spawnHazard warn+impact, bossNovaWave wave, chargeTelegraph lane (+C2-3 dive_trail), aim lines in ant rush/chili belt/behemoth reaper/hunger cleave/rootmother scythe, frost bar marks, chili furnace fire_cross, hunger oven cross, and all 19 signatures. Radius/timing/damage untouched; proj_foe untouched; every hook falls back to the old visuals. Phone visual/FPS review pending.

# Previous delivery: v7.8.56 — Seasonal Wisp HP and Spark miniboss tuning

Owner reports C2-4 purple fan-shot enemy survives longer than minibosses. Seasonal Wisp uses siege HP: stage 8 only 260→130 before existing stage/wave scaling; five-shot fan, guard aura and other roles/stages unchanged. Spark (smite) miniboss damage ×.85 once in taroDealDamage, including Static Charge/Storm Mark; bosses/mobs/elites/Arc/Sentry unchanged. Owner phone comparison pending. Automated targeted adapters plus npm check and build:www verify implementation; deployment must be verified separately.

# Previous delivery: v7.8.55 — C2-4 Seasonal Harvest (owner picked A, replaces Season Storm trials)

Same objective type 'seasonCycle' (renamed Seasonal Harvest) · o.storm.harvest[4], SEASON_PETALS 12 · objOnKill → seasonHarvest: non-boss kill = 1 petal (Elite 3) into the current season; full season → spill 50% into the emptiest season · passed[k] when full (icons ✓, full season = no hazard) · all 4 full → complete · stormEndSeason no-op in harvest · HUD 'emoji Season n/12 · next season Ns · k/4 full' · storm keeps ≥10 live foes. Browser sim: first clear C2-4 finished (harvest → hunt → boss → reward).

# Previous delivery: v7.8.54 — Spark Static Charge 10→40 hits

Owner: after v7.8.51 (hit size + homing) Spark hit bosses so often that Static Charge strikes melted them (meter v7.8.52 C2-3★1: Royal Stinger mini 5.0s at 5634 DPS vs Arc 14s, Sentry 49s). TARO_STATIC_HITS 10→40 (mul stays 13). Also Season Storm clarity (owner only learned seasons rotate after ~10 runs): HUD = current season trial + seconds left, or next untested trial + wait; intro banner explains rotation; failed-trial banner says it returns in 30s with the easier goal; HUD text no longer prefixed with objective name (overflowed at 360px).

# Previous delivery: v7.8.53 — C2-4 Season Storm always finishes

Owner: C2-4 stuck. Repro (browser sim, first clear): Season Storm wave — Spring passes, Summer/Autumn/Winter allow max 1 hit, a failed trial only returns 40s later with the same rule, and reserves run out so the field is empty → endless loop. stormRule(i,o): each failure of that season adds +1 allowed hit (Spring −3 kills, min 4); storyCanSpawn seasonNeedsFoes also keeps ≥6 live foes during the storm. Replay of C2-4 reached the boss fine in sim.

# Previous delivery: v7.8.52 — Taro Sentry vs bosses (owner picked A+B+C)

A: Shock cap on boss/mini TARO_SHOCK_MAX_BIG 15 (+75%), mobs stay 5 · B: taroDischarge — every TARO_DISCHARGE_HITS 25 orb zaps on the same boss/mini (Sentry or Beacon orbs) → strike ×TARO_DISCHARGE_MUL 10 zap dmg × shock, beacon_strike art · C: every Sentry orb bursts on fade dmg×(1+overload) radius×1.4 (was only with Overload card). Browser A/B (lv1 Sentry, 15s, boss + 16 mobs): boss dmg 2289→5463 (×2.4), mob 9764→13116 (+34%). Owner to re-run C2-1★1 benchmark.

# Previous delivery: v7.8.51 — Taro Spark hits more (owner picked A+B)

Owner: Spark hit few monsters. A: hit test = enemy body halfWidth (or 35% display width) + TARO_SPARK_HIT_R 10·scale (was 30% of width ≈12px) · B: sparks without boss/mark steering curve toward the nearest not-yet-hit enemy within TARO_SPARK_HOME_R 180 at TARO_SPARK_HOME_TURN 2.4 rad/s. Browser A/B (24 static mobs, 6 casts): 16.7 → 28.5 hits per cast. Meter text adds 'spark: N hits per cast'. If clear becomes too strong, owner may want Spark per-hit damage −10–15%.

# Previous delivery: v7.8.50 — Temple polish (owner: art looked washed out, page scrolled)

veil over screen_temple_* .5→.22 · altar glows NORMAL blend behind the trio (ADD over it washed the cores out) · altH = min(190, h-26-(150+8+36+3·(106+gap)+8+btnH)) so Weave fits without scrolling · Perks cardH/aH shrink by (h-hs-312)/3 so it fits too · rank line text stroked.

# Previous delivery: v7.8.49 — Temple Weave UI (art order 21) wired

34 pieces packed by scripts/pack-temple-weave-ui.py → assets/art/temple/ui/ (bg 720×1280, UI 50% of 2× source, MANIFEST with scaled nineSlice) · lazy with upgrade/perks group (art/temple/). TEMPLE_UI const = [cellW,cellH,cols,nineSlice]. Helpers: tuHas / tuFrames (cellN + c{cell}_{0..8} slice frames) / tuImg / tuPanel (own 9-slice from images, corners scale k=h/cellH, canvas-safe — no Phaser NineSlice) / tuTab / tuHeader / tuSparkle. _screenBg skins header (back, title frame, currency chip) when artKey starts screen_temple_. buildUpgrade: altar trio + per-core glow (portrait with room), tabs, power bar, core cards (portrait only; landscape keeps graphics), stars, buy buttons, knot, Weave Up. buildRankPerks: tier banners/line, req chip, perk cards/pips/buttons, Special Cores banner + compass, Ancient 2 columns (page scrolls), reset button. drawBadgeDot uses ui_notify_dot when loaded. All with old graphics fallback. Phone visual QA pending.

# Previous delivery: v7.8.48 — Replay = kills only

Owner: no timer skip on replays. tickReplayProgress: mini only at kills ≥ goal/2, boss only at kills ≥ goal (REPLAY_TIME_CAP removed). storyCanSpawn adds replayNeedsFoes (meter not done & mode wave) so spawns never run out after the 340 quota.

# Previous delivery: v7.8.47 — Fuller replays

Owner: replays (stage already cleared) had fewer kills than the first clear → lower level at the boss. REPLAY_GOAL 140→240 meter (0.75/kill → ~320 kills ≈ first-clear 5-wave quota 322), REPLAY_QUOTA spawn budget 240→340, REPLAY_TIME_CAP 300s (was RECIPE_HUNGER_CAP 180; mini fallback at half). Completion reward unchanged (200).

# Previous delivery: v7.8.46 — C8 Cocoa landing dust wired

Owner re-uploaded vfx_cocoa_landing_dust.png (282,702 bytes, sha matches QA). Packed to bpx_cocoa_landing_dust (6×256, once); cocoaLandingFx plays it (must, width max(160, r*2/.9)) and returns before the old crack/dust graphics (kept as fallback). Order 20 now 21/21 wired; phone visual/FPS QA pending.

# Previous delivery: v7.8.45 — Hero VFX gaps (art order 20) wired

20 of 21 sheets packed to assets/art/hero_vfx/ (scripts/pack-hero-vfx-gaps.py, bpx_<hero>_* lazy per hero + shared vfx_unique_crescendo). New helper heroFx(key,x,y,w,{h,rot,must,hold,life,follow,tint,alpha,ts}) — w = on-screen width, ground ovals fill ~90% of frame so size = radius*2/.9. Cocoa: titan_slam on every Titan pound (must, not only landed) + Colossus Rage 0 + Bear Grit Slam; slam_mark replaces cocoaMark graphics; rage_preview/rage_target (≤12 pooled) in tickTitanRage (titanRageArtOff cleans up); crater in titanRageImpact lv≥1; dash_buff follows player; dash_trail segments in cocoaTrailHit. Momo: seed_pop (momoSeedPop throttled 4/100ms) on pre-path + path hits + berrySplash; aim_line / aim_cone via snipeArt in tickSnipe; dash petals via heroDashFx (called from ancientEchoDash). Mint: chill_hit throttled, freeze holds frame 4 while e.frozen>0 (mintFreezeFx + heroFxTick in update), needle_hit, lance_charge, Frost Lance aim line, Bloom preview. Taro: rift_step in charPassiveOnDash, shrapnel in taroAfterDirect (fixture hashes updated). U1 in uniqueCrescendo. Every hook keeps the old code visual as fallback. C8 landing_dust source restored to the full 282,702 bytes matching QA (SHA-256 d321f8e96200b46be1c53ae96739e1416e1b4fc0e6d242dd7851e16eea329e86); runtime integration remains pending and code fallback stays at the owner's request.

# Previous delivery: v7.8.44 — Share Play Stats phase 1 (owner device only)

Settings → 📡 Share Play Stats (st.share, default off). Stats.end → Tele.enqueue(row) → localStorage queue mochi_tele_q (max 40) → Tele.flush POSTs batches of 10 to CLOUD_URL/rest/v1/run_stats with the anon key (also flushed on showMenu). Row: install_id (random, mochi_install_id), v, hero, path, mode, stage, diff, result, sec, data{level,kills,wave,cause,dmgTaken,kit,cards,mx,device}. Supabase project mochi-mayhem was paused (Cloud Save was down) → restored 2026-10-17. Table SQL in docs/telemetry/run_stats.sql (insert-only RLS, size checks); migration via MCP was cancelled — table NOT created yet, awaiting owner. Phase 2 (store): default-on with notice, compact rows, sampling, Privacy Policy + Data safety.

# Previous delivery: v7.8.43 — Combat Meter one-run completeness

Owner wants to play each hero once. Added: card picks with level/time and the cards passed over (mxPick in pickCardAt), casts per skill (castSkill caller), Unique ready-but-unused seconds, game-speed share, avg mob lifetime/HP (e._mxBorn in spawnEnemy), biggest hit taken + source, last-5s damage taken by source, end-of-run player stats, loot (sugar/boxes/currency), objective name per wave, device UA/screen in the copy header.

# Previous delivery: v7.8.42 — Deeper Combat Meter for the all-hero benchmark

Owner plans to play every hero on the same stage with the same gear. Added: per-wave rows (time, DPS, kills, taken) incl. a 'boss' segment, boss/mini damage by source (bsrc), boss phase2/3 timings per fight, biggest hit, survival (min HP%, seconds under 30%, healed via HP-delta in mxTick), movement px, standing-still %, active-attack % (seconds with damage), XP/min (gainXp hook). Stats.toText appends a BENCH CSV block (one row per metered run: hero, build, stage, result, sec, run/hero Lv, power, kills/min, avg/peak DPS, boss & mini sec/DPS, taken/min, min HP%, healed, uniques, unique share%, FPS).

# Previous delivery: v7.8.41 — Taro boss tuning from Combat Meter (owner approved)

From C2-1★1 meter data (Arc boss 14.4s / Spark 24.7s / Sentry 57s+, Uniques 0–3%): Sentry/Beacon orbs steer to boss/mini within 360 (2.6 rad/s), slow to ×0.3 when within 0.7·radius, per-orb hit gap on big targets 0.18s (TARO_ORB_SEEK/TURN/LINGER/BIG_GAP). Static Charge ×8 → ×13. castStormBeacon multiplies dm by taroUniqueGrowth() = 1+0.12·(run level−1) for Plasma / Overcharge / Storm Mark; Storm Mark strike/blast base ×2, Overcharge boom base ×4. Targets: Sentry boss ~20–25s, mini ~15s; Spark boss ~18s; Uniques ~10% share. Arc untouched (needs other-hero baseline). Owner to re-run the same 3 builds on C2-1★1 and paste Copy last 3 runs.

# Previous delivery: v7.8.40 — Meter fixes + first Taro numbers

Level log now per level from this run's first frame (was reusing previous run's level). Fight names cleaned. First data (C2-1★1, same gear): Arc 1:56 win, boss 55.6k in 14.4s (3878 DPS), mini 13.0s, 111 kills/min · Spark 2:43 win, boss 24.7s (2255), mini 13.9s, 67/min, sparkChild 87% of dmg · Sentry died 3:46, boss 57s (983, 5% left), mini 55.2s (256), 66/min. Uniques only 0–3% of damage on all three. Balance proposal in chat, awaiting owner.

# Previous delivery: v7.8.39 — Copy last 3 runs

Owner pasted all 33 runs; chat cut it off and all were pre-meter. Play Stats now has two buttons: Copy last 3 runs (Stats.copy(3) → toText(last)) and Copy all.

# CLAUDE.md — สมองของโปรเจกต์ (อ่านไฟล์นี้ก่อนเริ่มงานทุกครั้ง)

> ไฟล์นี้คือ "ความจำถาวร" ของโปรเจกต์ ถ้าเปิดเซสชันใหม่/เพิ่ง `/clear` มา
> อ่านไฟล์นี้ให้จบก่อน จะได้ทำงานต่อได้ทันทีโดยไม่ต้องให้เจ้าของเล่าซ้ำ
> **เมื่อจบงานแต่ละก้อน ให้ปรับ "สถานะปัจจุบัน" และ "ถัดไป" ในไฟล์นี้ให้ตรงเสมอ**


## 1. โปรเจกต์คืออะไร
เกมมือถือแนว **survival-like** (ศัตรูรุมเป็นฝูง + สกิลยิงเอง + เลเวลอัพ) ชื่อ **Mochi Mayhem**
- ธีม: น่ารัก โมจิ (ไม่ใช่แวมไพร์ — เจ้าของเปลี่ยนแล้ว)
- เป้าหมาย: ขึ้น **Google Play Store** เพื่อหารายได้
- เงื่อนไขสำคัญ: เจ้าของทำงาน **บนมือถือเท่านั้น** และ **ให้ AI เขียนโค้ดทั้งหมด**
  (เจ้าของเป็นผู้กำกับ/โปรดิวเซอร์ ไม่เขียนโค้ดเอง)

## 2. การตัดสินใจที่ล็อกแล้ว (อย่าเปลี่ยนโดยไม่ถาม)
- **เอนจิน:** Phaser 3 (เกมเว็บ/HTML5, TypeScript/JS) — เลือกเพราะทำบนมือถือล้วนได้
  (โค้ดอยู่บนคลาวด์ของ Claude, เจ้าของแค่เปิดลิงก์เทสในเบราว์เซอร์มือถือ)
- **เส้นทางขึ้นสโตร์:** เกมเว็บ → ห่อเป็นแอปด้วย **Capacitor** → build APK ผ่าน cloud → Play Store
- **หลักการทำงาน:** ออกแบบ/จูนระบบให้สนุกก่อน (กราฟิกกล่อง ๆ) → ทำ UX → **ลงกราฟิก AI เป็นขั้นสุดท้าย**
  (เพราะกราฟิกแพง/ช้าสุด ทำก่อนแล้วรื้อ = เสียของ)
- **🏆 กฎเหล็ก (กฎหลักของเกม):** **ยิ่งยาก รางวัลยิ่งดี** · (19 ต.ค. เจ้าของเลือก: Story เล่นระดับเดียว · ความยาก endgame = ความลึก Delve → สกุลเงินดีขึ้น `delveLoot`; Boss Rush ซ่อนไว้ก่อน v7.8.89) — ทุกระบบรางวัลใหม่ต้องเคารพกฎนี้ (`DIFFS[].reward`, `diffMul()`)
- **🎯 ผู้เล่นเป้าหมาย (19 ต.ค. เจ้าของเลือก ค):** แบบผสม — หน้าตาน่ารักเล่นง่ายช่วงต้น · ความลึกแบบสายบิลด์ (Forge/Kitchen/Delve/Special Cores) ค่อย ๆ เปิดหลัง Chapter 2–3 · ฟีเจอร์ใหม่ต้องไม่เพิ่มภาระช่วงต้นเกม
- **🔊 เสียง/เพลง = สร้างด้วยโค้ด (เจ้าของตัดสินใจ ก.ย. 2026):** เอฟเฟกต์ใช้ `scripts/gen_sfx_jsfxr.cjs` (jsfxr) · เพลงใช้ `scripts/gen_bgm_synth.cjs` + `scripts/encode_mp3.py` · ไม่ต้องรอไฟล์จากเว็บ/เจ้าของ (sandbox เข้า pixabay/kenney ไม่ได้)
- **สาขา git:** `claude/vampire-survival-mobile-game-yo9e8w` (ชื่อเก่าติดมาจากธีมแวมไพร์)

- **v4.47.0 (Production raster pickups):** เปลี่ยน Heal Mochi, Gear Gift, stage gimmick 6 ชิ้น และพื้น Training Ground จาก SVG เป็น PNG raster จริง · pickup 256×256 โปร่งใส · พื้น 512×512 ทึบ · release gate ตรวจขนาด/alpha/PNG stream/การผูก runtime และห้าม SVG กลับเข้ามาใน `ASSET_IMAGES`

## 3. โครงไฟล์
- `index.html` — หน้าเกม (โหลด phaser.min.js + game.js)
- `game.js` — โค้ดเกมทั้งหมด (คลาส Boot วาดกราฟิกด้วย **Canvas 2D** `createCanvas`, คลาส Game = ฉากเล่น)
- `phaser.min.js` — เอนจิน Phaser 3.80.1 (vendored, มาจาก npm)
- `assets/` — รูปจริง (AI/วาดมือ) โหลดแทนกราฟิกโค้ด · `ASSET_IMAGES`=รูปนิ่ง · `ASSET_SHEETS`=สไปรต์ตัวละคร (จตุรัส) · `ASSET_FX`=VFX flipbook (game.js)
  · **VFX flipbook (v1.9.0):** `ASSET_FX`={key:{url,fw,fh,frames,rate,anchor}} เฟรมไม่ต้องจตุรัส · Boot.preload โหลด spritesheet + Boot.create สร้าง anim (repeat0) · helper `spawnFxAnim(key,x,y,{rotation,scaleX,scaleY,scale,anchor,depth,alpha})` = sprite เล่นครั้งเดียว **additive blend** (พื้นดำหาย+เรืองแสง) ทำลายตัวเองตอน animationcomplete · anchor 'left'=ยิงจากตัวออกไป(origin 0,0.5) 'center'=ระเบิดกลาง · **มีแล้ว (v1.9.x, ทุกตัว 8เฟรม พื้นดำ ADD):** `fx_beam`(352×366 fireBeam sx=len/fw sy=0.42·wide/15 anchor left) · `fx_boom`(explodeAt จรวด/ระเบิด center) · `fx_frostnova`(frost skill center) · `fx_vortex`(cloud skill center) · `fx_slash`(whirl skill, center+offset ตามเล็ง — strip นี้มีกรอบขาวคั่นเฟรม ตัดด้วย flood-fill ลบขาวจากขอบเฟรม) · `fx_levelup`(61×64 vfxLevelUp center) · `fx_thunder`(61×64 zap สายฟ้า anchor bottom — strip มีแถบขาวคั่นเฟรม ลบด้วย "ลบแถว/คอลัมน์สว่างเต็มความกว้าง" เพราะบอลต์แตะขอบ flood-fill ไม่ได้) · `fx_heal`(collectHeal center) · `fx_wave`(creamWave/สกิล wave center)
  · **anchor:** 'left'(origin 0,0.5 ยิงออกขวา) · 'center'(0.5,0.5) · 'bottom'(0.5,1 ห้อยจากบนลงจุด เช่นสายฟ้า)
  · **กติกาอาร์ต VFX จาก AI:** ขอ **พื้นดำสนิท (solid black bg)** · strip อนิเมชัน = เฟรมเรียงเท่า ๆ กัน · grid VFX นิ่งตัดด้วย `scripts/cutout_vfx_grid.cjs` (flood-fill ลบเทา)
  · **⚠️ blend = NORMAL ไม่ใช่ ADD (v1.9.5):** ADD ระเบิดเป็นขาวบนพื้นสว่าง (พื้นด่าน1พาสเทล) → เปลี่ยน spawnFxAnim เป็น NORMAL (opt `add:true` ถ้าอยาก ADD) · sheet ต้อง **alpha ตามความสว่าง** (lum×1.35) + **saturation gate** (chroma<15 && lum<200 → โปร่ง) ลบกรอบเทา/พื้นเทาที่ platform ย่อภาพติดมา
  · **platform ย่อ strip ~3x สูง** (เฟรมโดนบีบแนวตั้ง) → resize สูง ×3 คืนสัดส่วนก่อนประมวลผล
  · **VFX เพิ่ม (v1.9.5, W×192):** fx_chilinova(chili) fx_mine(mine) fx_donutimpact(meteorStrike) fx_bossnova(boss nova) fx_bossportal/fx_bosssummon(boss summon) fx_enrage(boss phase2 aura loop) · projectile รูปจริง proj_rocket/fork/boomer(คีย์เขียว) · texture 'bubble'(กระสุน bubble ลอย)
  · **มีแล้ว:** char_momo_sheet.png (สไปรต์ 8 เฟรม 128px `CF`: [0 idle,1 blink,2 squash,3 stretch,4 cheer,5 hurt,6 ko,7 cast])
  · **อนิเมชันศัตรู/บอส (v1.9.x):** `ASSET_SHEETS[k].anim={frames,rate,yoyo?}` → Boot.create สร้าง anim `k+'_walk'` (repeat -1) · `e_dasher`(88px มดวิ่ง4เฟรม) `e_siege`(110px ปืนคัพเค้ก4เฟรม) `boss5`(160px เชฟขม idle 3เฟรม IDLE/HOVER/ACTIVE yoyo) · spawnEnemy/spawnFinalBoss เล่น `key+'_walk'` ถ้ามี (ไม่มี=หยุด anim+setFrame0 กัน pool ค้าง) · **frame=native size เดิม → setScale/setCircle เดิมใช้ได้ ไม่ต้องแก้** · ตัดจาก `assets/raw/*` ด้วย `scripts/cut_enemy_sheets.cjs`/`cut_boss5_sheet.cjs` (bbox alpha + fit เซลล์จตุรัส bottom-center) · **atlas ต้นฉบับพื้น transparent (alpha) ไม่ใช่ขาว** — detect ด้วย alpha>60
  · **`assets/raw/`** = โฟลเดอร์รับอาร์ตดิบจากเจ้าของ (อัปผ่าน GitHub มือถือ เพราะรูปใหญ่ในแชทไฟล์ไม่ถึงเครื่อง) → AI ตัดลง `assets/` ตัวจริง
  · Boot.preload โหลด image/spritesheet → mk() ข้ามการวาดโค้ดถ้ามีรูป (`isArtKey`) · `setCharScale()` ปรับ `_pBase`=60/frame + body radius 24 คงที่ (โชว์เท่ากราฟิกเดิม 60px) + ตั้ง `_hasFrames`
  · **อนิเมชันเฟรม (`updatePose`+`poseFlash`)**: ปกติ=ยืน+กะพริบ · พุ่ง=stretch · ลงพื้น=squash · โดนตี=hurt · เคลียร์เวฟ=cheer · ตาย=ko · กดอัลติ=cast — ทำงานทับเจลลี่สปริง (frame=ท่า, scale=ความเด้ง ไม่ตีกัน)
  · ตัด/เลือกเฟรมจากตาราง AI: `scripts/cutout_sheet.mjs SRC OUT CELL COLS ROWS "idx,idx,..."` (เลือก/เรียงช่องที่ต้องการ)
  · เพิ่มรูปใหม่: ตัดพื้นใส/ตัดสตริป (scripts/cutout.mjs, cutout_sheet.mjs) → assets/ → เติม key · build-www คัดลอก assets/ (ระดับบนสุด non-recursive) · pages.yml trigger รวม assets/**
  · **v1.5.0 ลงกราฟิกจริงเพิ่ม (จาก assets/assets/ ที่เจ้าของอัปโหลด · ย่อ+แฟลตเข้า assets/ ด้วย Chromium canvas):** พื้นหลัง `bg1..bg5` (768px, `bgTile` TileSprite depth -100002 alpha0.9 tileScale1.6, gridBg fillAlpha=0 เหลือแต่เส้น, สลับ texture ใน startStage) · `e_dasher`(44) `e_siege`(76) แทนการย้อมสี · มินิบอส `mb1..mb5`(140, spawnMiniBoss ใช้ถ้ามี isArt) · ไอเทม `chest`(48) `crate`(48) `vac`(34) แทนกราฟิกโค้ด (mk() ข้ามเองเพราะ isArtKey) · ต้นฉบับดิบอยู่ `assets/assets/**`
  · **VFX (v1.5.0):** `fx_chili/fx_frost/fx_hazard`(256) + `fx_donut`(96) · helper `fxBurst(key,x,y,radius,dur,spin)` (image ขยาย+จาง แบน oval) · เสียบใน chili/frost/spawnHazard/meteorStrike (มี fallback วงโค้ดถ้าโหลดไม่ได้)
  · **v1.6.0:** ตัวละครใหม่ `char_taro/char_sesame`(128, รูปนิ่ง `_hasFrames`=false → เจลลี่อย่างเดียว) เพิ่มใน CHARACTERS+CHAR_ORDER (taro=nova/spd, sesame=freeze/hp+dmg) · VFX อัลติ `fx_ult_bomb/fx_ult_vortex`(256) เสียบใน useActive bomb/blackhole · ไอคอน `ic_*`(64) map `SKILL_ICON`/`PASS_ICON` (มีบางตัว) helper `iconKey(k,isPass)` เสียบใน buildSkillBar+drawHeldBar+openLevelUp (fallback อีโมจิ) · boss5 = อาร์ตเชฟขมใหม่ · **build-www.mjs ข้ามโฟลเดอร์ย่อยตอน copy (กัน EISDIR จาก assets/assets/)**
  · **v1.6.3:** ปุ่มเมนูเป็น **แบนโมเดิร์น** (เลิกใช้อาร์ตลูกกวาด `ui_btn_*` แล้ว) · helper `uiPillBtn(cont,cx,cy,w,h,color,emoji,label,fn)` วาดด้วย graphics: เงา+ไล่เฉด(`_lighten/_darken`)+กลอสบน+ขอบสว่าง+ไอคอนวงกลมซ้าย+ข้อความขาว · buildHub 4 ปุ่ม(pink/toast/grape/mint) fit-to-band 0.40–0.90 มีช่องว่างเสมอ · buildPause 2 ปุ่ม (fn=null แล้ว push `_pauseBtns` เอง)
  · **ยังไม่ได้ใช้ (เหลือใน assets/assets/):** `ui_card_frame` (พาเนลตกแต่งหลายช่อง มีโบว์/สตรอว์เบอร์รีตายตัว → 9-slice ไม่ได้ ต้องอาร์ตกรอบเรียบ ๆ), ไอคอนสกิลที่เหลือ (12 สกิล+6พรยังใช้อีโมจิ), sprite sheet เวอร์ชันอนิเมชัน (_sheet), heroes_taro_sesame_sheet — ดู docs/ART_BIBLE.md
- `docs/ART_BIBLE.md` — คัมภีร์อาร์ต/ดีไซน์ละเอียด (lore/สี/ตัวละคร/ศัตรู/บอส/สกิล/UI/ไอคอน/แอนิเมชัน) สำหรับ AI ทำอาร์ต
- `docs/LORE.md` — เนื้อเรื่องโลก Mochitopia
- **`docs/art_orders/` — ใบสั่งอาร์ตจริงแทนของชั่วคราว (ใช้ตัวนี้เป็นหลัก):** README (ตารางชุดงาน+สถานะ, ที่วางไฟล์ `assets/incoming/<batch>/` → ฝั่งโค้ดย้ายไป `assets/art/<batch>/` + ใส่ ASSET_IMAGES, MANIFEST template, ขั้นตอนตรวจ) · 00 style guide · 01 พื้น seamless 10 ด่าน · 02 decor รายด่าน · 03 ศัตรู Ch3 · 04 มินิ/บอส Ch3 · 05 ขุด · 06 ไอคอน perk/relic (relic_ ต้องเพิ่ม hook) · 07 ไอคอน Kitchen `fr_t_/fr_e_/fr_m_` (ต้องเพิ่ม hook) · 08 Pinnacle · 09 เมนู (การ์ดด่าน `stage_card_sNN`, พื้นหลังหน้า `screen_*`, ปุ่ม Hub `hub_btn_*`, ไทล์ `tile_<target>` — ทั้งหมดต้องเพิ่ม hook) · โฟลเดอร์รอรับ `assets/incoming/<batch>/` + `assets/art/<batch>/` สร้างไว้ครบ 20 batch (.gitkeep)
- `docs/` — เอกสารดีไซน์/แผนทั้งหมด (ART_BIBLE, LORE, CHARACTER_BIBLE, BALANCE_PLAN, POE_ECONOMY_PLAN, PLAYTEST_CASES, ART_ORDER_*, PROJECT_SUMMARY_TH ฯลฯ)
- `CLAUDE.md` — ไฟล์นี้
- **`docs/HANDOFF_NEXT_AI.md` — งานค้าง + ข้อเสนอแนะจากมุมผู้เล่น (AI ตัวใหม่อ่านต่อจาก CLAUDE.md)**
- **Build APK (Capacitor):** `package.json` + `capacitor.config.json` (appId com.mochimayhem.game, webDir www)
  + `scripts/build-www.mjs` (ประกอบ www/) + `.github/workflows/android.yml` (build บน GitHub Actions → APK artifact,
  push tag `v*` = ออก Release). โฟลเดอร์ `android/`,`www/`,`node_modules/` สร้างตอน build ไม่ commit.
  **APK สำหรับทดสอบเป็น debug** — workflow `release-aab.yml` มี signed AAB (`bundleRelease`) แล้ว ใช้ keystore/secrets ตาม `docs/RELEASE_SIGNING.md`; การตั้งค่าจริงและ signed release ยังไม่ยืนยัน
- **Live update (แก้แล้วไม่ต้องลง APK ใหม่):** `.github/workflows/pages.yml` deploy www → **GitHub Pages**
  + `capacitor.config.json` `server.url` = https://hardza1230.github.io/Survival-like-Mobile-Game/
  ⇒ Debug APK โหลดจาก Pages หลัง deploy สำเร็จ; การเปลี่ยน native shell อาจต้องลง APK ใหม่ · Release AAB ลบ server.url และ bundle เกมในแอป ไม่ใช้ Pages live update · เว็บมี service worker cache จึงต้องตรวจเวอร์ชันจริง
  · ต้องเปิด Pages ครั้งแรก: Settings→Pages→Source: GitHub Actions
  · **หมายเหตุ:** เพราะ server.url ชี้ Pages → APK ตัวใหม่ต้อง build หลังตั้ง Pages (ตัว build แรกสุดยังเป็นออฟไลน์)


## 4. สถานะปัจจุบัน (v7.9.17 · 20 ต.ค. 2026)
- เวอร์ชันล่าสุดดูที่ `GAME_VERSION` ใน game.js และบล็อก Latest delivery ด้านบน
- ระบบหลักครบ: Story 3 Chapter (15 ด่าน) → Endgame Mochi Delve (แผนที่ seed ต่อความลึก, บอส Delve, Pinnacle), Boss Rush, Kitchen Recipe, Temple Weave/Depths/Rank Perks, Gear, Talent ราย Build Path, ตัวละคร 6 ตัว แต่ละตัว 3 Build Path
- ล่าสุด (v7.8.45–60): ดาวรายด่าน 3 ดวง + แอนิเมชันสลับหน้าเมนู (v7.8.60) · อาร์ตใบ 23–25 (Level Up / Pause / เมนูเคลื่อนไหว) ผูกแล้ว (v7.8.59) · ปรับ Spark/Arc/Mint/Cocoa ตามเจ้าของ + หน่วงการ์ดเลเวลอัพ (v7.8.58) · อาร์ตท่าบอส C1–C2 ใบ 22 ผูกครบ 59 ไฟล์ (v7.8.57) · อาร์ต Hero VFX ใบ 20 ครบ 21/21 · อาร์ตหน้า Temple ใบ 21 ครบ 34 ชิ้น · Replay ฆ่าครบ ~320 ตัวถึงเจอบอส (ไม่มีตัดเวลา) · Taro Spark ระยะโดน+เลี้ยวหา / Static Charge 40 ครั้ง / มินิบอส ×0.85 · Taro Sentry Shock 15 ชั้นบนบอส + Discharge + ระเบิดตอนหมดอายุ · C2-4 เปลี่ยนเป็น Seasonal Harvest (เก็บกลีบ 4 ฤดู) + Seasonal Wisp HP ครึ่ง
- **รอเจ้าของเล่นทดสอบบนมือถือ:** Spark/Sentry/Arc benchmark ที่ C2-1★1 (ของชุดเดียวกัน), C2-4 Harvest, หน้า Temple ใหม่, Hero VFX FPS
- **รอเจ้าของตัดสินใจ:** Yuzu ทำใหม่ทั้งหมด (เสนอชุด Orchard Swarm / Zest Battery ตีไกล / Citrus Knights) · ท่าบอส/กลไกสนาม (ดูข้อ 5) · Supabase ตาราง run_stats ยังไม่สร้าง (docs/telemetry/run_stats.sql)
- รายละเอียดทุกเวอร์ชันเก่า: `docs/CLAUDE_HISTORY.md`

### บั๊กที่เคยเจอ & วิธีแก้ (กันพลาดซ้ำ)
- **UI ขยาย 2–2.5 เท่า/เมนูหลุดขอบใน v2.3.1:** `Scale.RESIZE` คืน logical CSS px อยู่แล้ว แต่โค้ดยังคูณ game size และหาร `W/H` ด้วย DPR ตามวิธีเก่า → layout เหลือพื้นที่ครึ่งเดียวแล้วกล้องขยายซ้ำ · แก้ด้วย logical CSS size + `config.resolution` (ข้างบน)
- **ภาพเบลอบนมือถือ (high-DPI):** อย่าขยาย logical game size เอง ให้ใช้ `config.resolution=RENDER_DPR` เพื่อเพิ่ม backing resolution โดยไม่เปลี่ยน layout/input
- **scrollFactor(0) ไม่รับ camera zoom** → UI ที่ตั้ง sf0 จะเรนเดอร์ 1:1 (มุมซ้ายบน) เมื่อกล้อง zoom; ต้องใช้ sf1
- **`camera.ignore(group)` เป็น snapshot** → กลุ่ม (enemies/bullets/orbs) ว่างตอน setup เลยไม่กันสมาชิกที่เกิดทีหลัง
  → ศัตรูเกิดใหม่เรนเดอร์บน uiCam ด้วย = "ภาพซ้อนค้าง". แก้ด้วยเรียก `this.camWorld(obj)` ทุกครั้งที่ spawn (spawnEnemy/getBullet/dropOrb/มินิ/บอส/elite/nova)
- **Phaser `setInteractive()` กับ shape (rectangle) กดไม่ค่อยติดบนมือถือ** → ใช้ "แตะที่ไหนก็ได้" +
  ตรวจตำแหน่งแตะเอง (ดู `pickCardAt`, pointerdown handler) แทน
- **scale config ห้ามใส่ `width:'100%'`** → ทำให้พิกัดแตะเพี้ยน ใช้ `Scale.RESIZE` เฉย ๆ
- **dash แรงไป = หลุดจอ** → คุมความเร็ว (~560) + `dashTime` สั้น + กล้อง lerp 0.16
- **เกมเด้ง `Cannot read properties of null (reading 'body')` ตอนของล้นจอ/x3 (v1.9.2):** pool เต็ม (maxSize) → `getFirstDead(false)` คืน null และ `create()` เกิน cap ก็คืน null → บรรทัดถัดมาอ่าน `X.body` = crash · **ทุก getFirstDead-or-create ต้อง guard `if(!X)return` (drop items/spawnEnemy/foeShot ข้ามได้) หรือ recycle `getFirstAlive()` (bullet/mini/boss ที่ห้ามข้าม)** · x3 ทำ physics step ถี่ = ของตาย/เกิดถี่ = pool เต็มง่ายขึ้น
- **ปุ่มเร่งเวลา x2/x3 เร่งแค่โจมตี (v1.9.x):** Arcade `physics.world.timeScale` **กลับด้าน** (ค่ามาก=step ห่าง=ช้าลง) การเคลื่อนที่ทุกอย่างใช้ velocity=physics → `setGameSpeed` ตั้ง `=s` ทำให้ช้าลง (ส่วน time/tween/dt เร็วขึ้น = เร่งแค่ timer/โจมตี) → แก้เป็น **`=1/s`** · hitStop ก็กลับด้าน (0.05=เร็ว 20x ไม่ freeze) → ใช้ค่ามาก (12) = freeze จริง


## 5. ถัดไป
- **ท่าบอส (18 ต.ค. ตรวจโค้ดแล้ว):** บอสหลัก C1–C2 ทั้ง 10 ตัวมีชุดท่าเฉพาะตัวแล้ว · **v7.9.11 ครบแล้ว:** บอส C3 ทั้ง 5 + Pinnacle + มินิ C1-3/4/5, C2-1, C3 ทั้ง 5 มีท่าเฉพาะใน BOSS_KITS (C1-2 มินิใช้ชุดของบอส Drain) · Delve Warden/Candlewick มีท่าเฉพาะ · ระบบกลางกลไกสนาม + Counter Object (`docs/BOSS_ARENA_MECHANICS.md`) **ครบทุกบอส v7.9.13 (นำร่อง 3) + v7.9.15 (อีก 12 + Pinnacle)** · รอเจ้าของเล่นปรับจังหวะ · Candlewick ในแผน (เดินจุดเทียน) ขัดกับของจริง (เดินดับเทียน) ต้องให้เจ้าของเลือก
- **ใบสั่งอาร์ต 22 (18 ต.ค.):** เอฟเฟกต์ท่าบอส C1–C2 59 ไฟล์ — บอส C1–C2 มีท่าเฉพาะแล้วแต่ใช้ภาพกลาง (vfx_telegraph/fx_bossnova/vfx_cream_ring/vfx_line ย้อมสี) · ส่งอาร์ตครบ 59 PNG32 / 278 เฟรมที่ `assets/incoming/boss_vfx_c1_c2/` พร้อม manifest/prompts/QA · **ผูกแล้ว v7.8.57** (59/59: `assets/art/boss_vfx/`, `scripts/pack-boss-vfx-c1-c2.py`, helper `bossKit/kitSize/kitLane/bossSig/bossSigHold`) · รอ QA ภาพ/FPS บนมือถือ
- **ใบสั่งอาร์ต 23 (18 ต.ค.) — ผูกแล้ว v7.8.59, รอ QA มือถือ:** หน้าเลือกการ์ด/Level Up 19 ไฟล์ (`docs/art_orders/23_LEVELUP_CARD_UI.md`) — ตอนนี้วาดด้วยโค้ดล้วน · รออาร์ตส่ง `assets/incoming/levelup_cards_ui/` · โน้ตผูกโค้ดอยู่ท้ายใบสั่ง (`drawReadableChoiceCard`/`highlightCard`/`drawHeldBar`/`openLevelUp`)
- **ใบสั่งอาร์ต 24 (18 ต.ค.) — ผูกแล้ว v7.8.59, รอ QA มือถือ:** หน้าหยุดเกม 19 ไฟล์ ตามภาพอ้างอิงเจ้าของ (`docs/art_orders/24_PAUSE_SCREEN_UI.md`, ref `docs/art_orders/ref/24_pause_ref.webp`) · รออาร์ตส่ง `assets/incoming/pause_ui/` · ผูกที่ `buildPause`
- **ใบสั่งอาร์ต 25 (18 ต.ค.) — ผูกแล้ว v7.8.59, รอ QA มือถือ:** หน้าเมนูหลักเคลื่อนไหว 20 ไฟล์ + 5 ทางเลือก (`docs/art_orders/25_HUB_MENU_MOTION.md`) — แยก `hub_ui_background` เป็นชั้น + โมโม่หุ่นเชิด (pivot ใน MANIFEST) + VFX · ระวังงบบูต GPU (cocoa 285/300 MB) · รออาร์ตส่ง `assets/incoming/hub_motion/` · ผูกที่ `buildHub`/`startHubAmbience`
- **ใบสั่งอาร์ต 26 — ผูกแล้ว v7.8.68, รอ QA มือถือ:** ม่านสลับหน้าเมนู 5 + ไอคอนการ์ด 77 · `docs/art_orders/26_TRANSITION_AND_CARD_ICONS.md`
- **ค้างจากเซสชัน 18 ต.ค.:** ยังไม่ได้ตรวจ UI แนวนอน · การ์ด Weave ที่เต็มยังไม่ได้ถ่ายภาพยืนยัน · รอเจ้าของเลือกเรื่องการ์ด (ไอคอนซ้ำในสาย, Petal Spread ใต้ Sniper, ชื่อ Overload ซ้ำ, Sesame Extra Pane/Facet ซ้ำ)
- Yuzu ทำใหม่: รอเจ้าของเลือกชุด build แล้วเขียนเอกสารออกแบบ + ใบสั่งอาร์ต
- รับ feedback หน้า Forge ใหม่ · Kitchen upkeep · Story C2–C3 · item mods · Delve
- งานค้างระยะยาว: มือถือ visual/FPS QA ของอาร์ตที่ส่งแล้ว (`docs/art_orders/16_CURRENT_ART_BACKLOG.md`), Play Store (พักไว้)
- **เจ้าของ: ไม่ต้องจำลองเล่น headless เพื่อจูนบาลานซ์ เจ้าของเทสเอง** (จำลองเพื่อหาบั๊กค้างได้)
- **เจ้าของ (18 ต.ค.): ไม่ต้องเปิดเกมถ่ายภาพหน้าจอตรวจ UI/อาร์ตเอง — เจ้าของตรวจบนมือถือเอง** (เพื่อความเร็ว) · ใช้ `npm run check` + อ่านโค้ดพอ · deploy ให้รอในเบื้องหลัง ไม่ต้องนั่งรอ

## 6. เอกสารออกแบบ (Artifacts — ความจำภาพ)
เอกสารเหล่านี้เผยแพร่เป็น artifact แล้ว (ถ้าต้องแก้ให้ publish ทับ URL เดิม):
- แผนรวม (stack + กราฟิก + รายได้ + Play Store)
- GDD/ระบบเกม + endgame + lore  ← ล่าสุด/สำคัญสุด
- Prototype เล่นได้ (mochi_play.html — ประกอบจาก phaser+game.js ในโฟลเดอร์ scratchpad ของเซสชัน)
- **ฐานเคส Playtest:** `docs/PLAYTEST_CASES.md` — รวม feedback/บั๊กจากเครื่องจริงด้าน balance, ศัตรู, skill/VFX/card, character, performance, state และ regression checklist
- **Playbook แนวนอน/Fullscreen:** `docs/LANDSCAPE_FULLSCREEN_UI_KNOWLEDGE.md` — รวมเคส v2.3.0–v2.3.1, สาเหตุ, วิธีแก้, layout รายหน้า และ checklist visual QA บนมือถือ

## 7. วิธีเทส / build
- เทสเร็ว: publish `game.js` รวมกับ phaser เป็น artifact HTML แล้วเปิดในเบราว์เซอร์มือถือ
  (ประกอบด้วย: head + `<script>`phaser.min.js`</script>` + `<script>`game.js`</script>`)
- เทสในเครื่อง: `npx serve .` แล้วเปิด index.html
- ตรวจโค้ด/asset contract ก่อน publish เสมอ: `npm run check`
- ทดสอบ flow, balance, touch controls, telegraph และ FPS บนมือถือจริงก่อนปล่อยเวอร์ชัน เพราะ automated validator ไม่แทน manual playtest

## 8. คอนเวนชัน
- **ทำงานสาขาเดียวเท่านั้น: `claude/vampire-survival-mobile-game-yo9e8w`** — commit บ่อย, push ด้วย `-u origin <branch>`
  · **⚠️ สำคัญ (v1.9.0):** GitHub Pages (live update) deploy ได้จาก **สาขานี้สาขาเดียว** เท่านั้น
    สาขาอื่น **deploy ล้มเหลวทุกครั้ง** (github-pages environment ไม่อนุญาต) → push ไปแล้วเกม live ไม่อัปเดต
  · ถ้าเซสชันถูกมอบหมายสาขาอื่นมา **ให้ย้ายมาทำบนสาขา vampire นี้เสมอ** (เจ้าของอนุมัติแล้ว "ทำขาเดียว")
    ไม่ต้อง mirror 2 สาขาอีกต่อไป
  · **รวมสาขาแล้ว (ล่าสุด):** เคยมีสาขาเซสชัน `claude/check-commit-version-i5326x` ที่มีของล่าสุด →
    รวมกลับเข้า vampire และลบทิ้งแล้ว เหลือ vampire สาขาเดียวเป็น source of truth
- **อย่าลืม bump `GAME_VERSION` + เพิ่ม `CHANGELOG` ใน game.js ทุกครั้งที่มีของใหม่** ไม่งั้นหน้าอัปเดตในเกมจะโชว์เวอร์ชันเดิม (เจ้าของดูเลขนี้เช็คว่าอัปเดตขึ้นไหม)
- commit message ภาษาอังกฤษ อธิบายชัด; อย่าใส่ชื่อรุ่นโมเดลในไฟล์/commit
- ภาษาที่คุยกับเจ้าของ: **ไทย**
- **🌐 ข้อความในเกม = ภาษาอังกฤษล้วน (v3.5.0):** เจ้าของเจาะตลาดโลก → **ทุก string ที่ผู้เล่นเห็นต้องเป็นอังกฤษ** (เมนู/การ์ด/แบนเนอร์/ชื่อศัตรู/บอส/story/CHANGELOG) · เขียนโค้ดใหม่ให้ข้อความ user-facing เป็นอังกฤษตั้งแต่แรก · **โค้ด comment เป็นไทยได้** (โน้ตพัฒนา ไม่ถึงผู้เล่น) · ใช้ typographic apostrophe `’` ในข้อความอังกฤษที่อยู่ใน single-quoted literal (กัน syntax พัง) · เช็ค: ไม่มี Thai char ใน quoted string (`node --check` + สแกน `[฀-๿]` ใน literal)


## อัปเดต v2.29.0 — Character Combat Profiles & Signature Weapons
- ตัวละครทั้ง 6 ตัวมี Combat Profile ใหม่ แยก HP, ATK, SPD, DEF, CRIT, CDR และบทบาท
- อาวุธประจำตัว: โมโม่=ปืนเมล็ดหัวใจ, มินต์=แกนลมเย็น, โกโก้=ถุงมือตราหมี, ตาโร่=เข็มทิศสายฟ้า, งาดำ=กระจกคำสัตย์, Berry Core=ปืนแกนแยม
- ผู้เล่นเริ่มด้วยอาวุธประจำตัวและเลือกอาวุธรอง 1 ชิ้น; อาวุธประจำตัวนับรวมในเพดานอาวุธ 4 ช่อง
- Weapon Mastery มีผลเฉพาะอาวุธประจำตัว และ resetStageLoadout() ต้องคืนอาวุธประจำตัวทุกด่าน
