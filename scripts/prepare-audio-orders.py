"""Authored English sound design for audio orders A01-A05 (SFX access only)."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
STYLE = ' Original cute premium candy fantasy game audio, clear on phone speakers, dry immediate attack, gentle short tail, no harsh highs, no background music or speech, no imitation of any existing game, artist or recording.'
SETS = {
'menu_progress': '''
merge_select|75|One tiny candy placed onto a wooden tray, a soft clean plock.
merge_fuse|800|Two magical objects swoosh toward each other, collide in one soft rounded puff, followed by delicate sparkling dust. Entire gesture under one second, no casino sound.
merge_rarity_rare|500|A small bright glass bell plays two ascending notes. Modest reward.
merge_rarity_epic|700|Three violet crystal tones form a rich ascending chord with a little circling sparkle. Medium reward.
merge_rarity_legend|1100|A tiny warm horn flourish, golden bells and a lingering sparkle. Biggest reward of this set, warm rather than loud, finish within one second.
merge_keep_mod|200|A tiny magical gem slots into place with a satisfying click and clear little ting.
forge_pick|65|A fingertip gently taps one parchment recipe, one quiet papery click.
forge_add|350|A candy smith hammer strikes once, soft rounded metallic gong with tiny magical sparks.
forge_swap|350|Two short airy swishes, first removing a gem, second inserting its replacement, with a tiny locking tick.
forge_star_up|450|Three tiny ascending star chimes, clear musical rise and a soft sparkle finish.
forge_remove|250|One little spoon scoops soft candy out of a socket, followed by a small bubble pop.
forge_lucky|600|A bright lucky clover twinkle with little sleigh bells and one distinct high ping, unlike a hammer strike.
forge_no_points|200|One soft low dull wooden thunk, polite refusal, no alarm.
login_open|400|A parchment calendar unfolds with a soft papery rustle and one little bell.
login_claim|500|A rubber stamp presses firmly onto paper with a soft thup and delicate sparkles.
login_day7|900|A firm soft calendar stamp followed by a tiny warm celebratory weekly reward flourish.
dq_done|250|A pencil makes one satisfying check mark on paper, with a tiny soft tick.
dq_box_s|400|A small wooden candy box pops open, one little latch click and two light sparkles.
dq_box_m|550|A medium candy box opens with a rounded pop and three bright glass sparkles, larger than a small box.
dq_box_l|700|A large reward candy box opens with a resonant soft pop and a rich ascending sparkle chord.
dq_reroll|300|Two tiny candy dice roll briefly across a wooden tray and settle, dry soft rattling clicks.
dq_week|450|A golden token drops into a small wooden slot, round metallic clink and warm little ping.
aw_star|350|One golden star springs into place, bright rounded ding and a tiny bounce.
aw_title|800|A silk ribbon unfurls with a soft swish and a short proud warm magical flourish.
aw_claim_all|900|Five or six small reward chimes rise rapidly and resolve into one warm crystal chord. One compact gesture, no slot machine.
aw_secret|1000|A mysterious little box rattles, then pops open with soft purple magical sparkles. Playful mystery.
best_tier|500|An illustrated creature book page turns, followed by a clear little discovery bell.
best_new|350|A soft unveiling fwoop and a small bright discovery bell.
recipe_complete|800|A warm wax seal stamps onto parchment, followed by a gentle satisfying magical chord.
dig_lantern|600|A small lantern ignites with a soft flumph and settles into a warm quiet magical hum.
miners_collect|450|A small pouch of silky threads lands softly with a few tiny metal trinket jingles.
rank_pick|450|An ornate little rank medal presses into a fitted socket, firm click and warm resonant ping.
power_tick|40|One extremely quiet dry wooden tick, suitable for repeated number counting.
power_up|500|A short rising airy magical whoop with a soft bright sparkle at its peak.
stage_star_1|250|One small star lands with a low clear glass note.
stage_star_2|250|One small star lands with a medium high clear glass note, higher than the first star.
stage_star_3|250|One small star lands with a high clear glass note and a tiny extra sparkling flourish.
feature_unlock|900|A little velvet curtain opens with a soft swoosh and a wondrous shimmering magical reveal, no human voice.
feature_fly|500|A small magical icon glides through the air and lands with one tiny clear ting.
''',
'battle_events': '''
arena_warn|400|A clear but friendly two note warning bell, low then high, cuts through battle noise without shrillness.
arena_sweep|1200|A continuous broad flowing sweep of magical liquid intertwined with rustling roots, smooth even texture, seamless loop, no start or end accent.
arena_grid_burn|450|A small frying pan grid flares with a compact sizzling fwoosh, crisp immediate fire onset.
arena_freeze_breath|1000|A cool long gust whistles gently and ends in scattered tiny ice crystals.
arena_pillar_crack|400|One chunky ice pillar cracks and crumbles, crisp crystalline crunch, no glass shriek.
arena_pod_shield|800|A quiet continuous organic spore shield hum, softly pulsing magical airy tone, seamless loop with no onset accent.
arena_shield_break|500|A jelly glass magical shield shatters softly and releases a small airy puff.
arena_fog|2000|Quiet continuous low soft poisonous mist hissing, fluffy and unobtrusive, seamless ambience loop, no scary voices or rumbling sub bass.
arena_clock_tick|120|One dry wooden gear clock tick, compact and softly articulated.
arena_ring_close|1500|A thorny root ring contracts, woody creaks and soft friction rising in pitch toward one rounded finish.
arena_scythe|600|One broad heavy scythe sweeps through air, powerful clean low mid whoosh, no impact or gore.
arena_decoy_reveal|500|A hollow magical flower decoy vanishes into bubbles, soft poof and several tiny pops.
counter_spawn|350|A springy little wooden object bounces onto the ground with a distinct plonk and one tiny sparkle.
counter_kick|250|A satisfying firm rounded kick impact followed by a short airy launch whoosh.
counter_hit|600|A kicked object crashes against a chunky candy monster shell, heavy but soft comic impact and wobble, no voice or pain.
counter_fuse|900|A tiny mechanical fuse ticks faster and faster over less than one second, ends before explosion.
kill_freeze|150|A compact deep midrange cinematic impact, one soft weighty thung, audible without sub bass.
kill_slowmo|900|A smooth airy magical tape slowdown that bends downward and then springs back to normal, soft and short.
mission_tube_pop|450|A water bubble bursts at the top of a glass tube and a little bright completion bell rings.
wave_start|500|Two compact soft drum strikes with a short directional whoosh, announces a new wave.
quest_focus|600|A brief cinematic camera focus swoosh followed by a small clear pointing bell.
poison_tick|120|One very quiet soft sticky poison bubble pops, compact dry transient for frequent use.
bleed_tick|120|One very quiet thick red syrup droplet lands with a soft wet tick, no gore.
out_of_zone|500|Two gentle short rounded warning beeps, helpful rather than alarming.
ruby_pop_in|250|A tiny magical jam sprite pops into view with a springy bright ping.
ruby_alert|300|Two quick bright magical pings, friendly urgent attention, no human voice.
speed_change_x2|250|A small airy acceleration swoosh rising to a moderately high pitch.
speed_change_x3|250|A small airy acceleration swoosh rising to a higher pitch, more energetic than double speed.
speed_change_x4|250|A small airy acceleration swoosh rising to the highest pitch, compact and playful.
run_trait|700|A mysterious small curtain opens with a soft low shimmer and a few magic sparkles.
stage_title|1500|A gentle flowing gust reveals a stage title, one warm sustained glass bell tone with room for text.
tutorial_great|600|Tiny soft toy claps and a bright magical sparkle, encouraging success, no people.
''',
'story_music': '''
pow_crack|400|A wooden floor suddenly cracks, crisp cartoon splintering snap, one clear impact.
pow_thud|350|One soft heavy cartoon landing thud, round and cushioned, no voice.
pow_pop|300|One clear springy magical bubble pop with a short bright tail.
pow_shatter|600|A sheet of magical ice breaks into many delicate crystalline fragments, clear but not piercing.
pow_krak|700|One large gnarled wooden root breaks with a dramatic chunky crack and falling splinters, stylized cartoon impact.
type_tick|35|One extremely quiet dry wooden typewriter key tick, single tiny transient for repeated text typing.
story_title|2000|A soft breeze, one long warm magical curtain opening tone and delicate sparkles, airy narrative title reveal.
book_open|1800|An old large storybook opens: small brass clasp clicks, thick cover creaks open, parchment pages riffle, warm magical shimmer. Complete compact sequence.
stage_victory|2500|One original very short warm victory fanfare, toy horn and glass bells, ascending playful four note gesture and resolved final chord. Not a song, one reward stinger, no casino sound.
stage_defeat|2000|One original very short tender defeat stinger, small soft descending music box tones, gently encouraging another try, no despair.
chapter_clear|3500|One original grand but cute short chapter completion flourish, warm small brass and golden bells, ascending playful four note gesture and proud resolved chord. A single reward stinger, no song.
box_reveal_common|300|A plain little cardboard reward box opens with one soft papery pop.
box_reveal_rare|450|A little blue crystal reward box opens with a soft pop and two bright glass chimes.
box_reveal_epic|650|A violet magical reward box opens with a rounded pop and three rich crystal chimes.
box_reveal_legend|900|A golden magical reward box opens with a resonant soft pop, warm tiny horn and golden bell sparkle.
'''
}

def write_set(name, rows):
    folder = ROOT / 'assets/incoming' / ('audio_' + name)
    folder.mkdir(parents=True, exist_ok=True)
    result=[]
    for key, ms, prompt in rows:
        loop = key in ['sfx_arena_sweep','sfx_arena_pod_shield','sfx_arena_fog']
        result.append(dict(key=key,file=key+'.mp3',durationMs=ms,loop=loop,provider='ElevenLabs',prompt=prompt,generationDurationSeconds=max(.5,ms/1000),postprocess='Mechanical onset trim and tail fade only; mono 44.1kHz MP3 128kbps, decoded true peak <= -1dBTP; retain original donor. Loop seam crossfade for loop beds.'))
    (folder/'REQUESTS.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(name,len(result))

for name, text in SETS.items():
    rows=[]
    for line in text.strip().splitlines():
        key,ms,prompt=line.split('|',2)
        rows.append(('sfx_'+key,int(ms),prompt+STYLE))
    write_set(name,rows)

voices=[]
RUBY='A single original tiny female jam spirit, light bright rounded high register, warm and playful, soft toy-like timbre. '
VOICE_STYLE=' Isolated original cartoon creature vocal sound effect, one compact gesture, dry close recording, gentle tail, no understandable words in any language, no music, no imitation of any actor or existing character, no screaming or pain.'
for i, vowel in enumerate(['a tiny rising ee-like chirrup','a tiny round pu-like chirrup','a tiny soft ru-like chirrup','a tiny bright bi-like chirrup'],1):
    voices.append((f'vo_ruby_blip_{i}',75,RUBY+vowel+VOICE_STYLE))
for mood,ms,gesture in [('happy',400,'a tiny delighted giggle'),('alert',350,'one surprised questioning squeak'),('sad',450,'a soft tender sigh'),('cheer',500,'a joyful wordless rising cheer')]:
    voices.append(('vo_ruby_'+mood,ms,RUBY+gesture+VOICE_STYLE))
heroes={
 'momo':('A brave cheerful slightly clumsy young strawberry heroine with a bright warm voice. ',['a joyful wordless greeting chirp','a little determined effort squeak','a surprised playful mildly pouty grumble']),
 'mint':('A reserved kind ice mage with a soft low cool feminine voice. ',['a quiet polite questioning hum','one small composed sigh','a restrained gently annoyed wordless murmur']),
 'cocoa':('A friendly broad chocolate bear with a warm deep rounded resonant voice. ',['a jovial deep welcoming hoot','a short powerful but gentle effort grunt','a warm belly chuckle ending with a tiny comic sneeze']),
 'taro':('A hyperactive lightning candy hero with a fast bright energetic voice and tiny soft static crackles. ',['an excited wordless squeal with tiny electrical fizz','one tiny chirp and soft static tick','a rapid playful nonsensical babble with tiny electrical pops']),
 'yuzu':('A warm playful citrus pack leader with a soft cheerful youthful voice and one tiny fruit companion with a higher squeak. ',['a warm wordless call answered by a tiny companion squeak','one short warm playful hum','a little laugh answered by a tiny fruit creature chirrup'])}
for hero,(identity,gestures) in heroes.items():
    for kind,ms,gesture in zip(['greet','tap','poke'],[500,250,500],gestures):
        voices.append((f'vo_{hero}_{kind}',ms,identity+gesture+VOICE_STYLE))
for chapter,identity in [(1,'a grumbly kitchen ant nest monster, dry crackly medium low register'),(2,'a damp mushroom bee forest monster, soft buzzy low register'),(3,'an ancient enchanted crown monster, resonant mysterious rounded register, whimsical not frightening')]:
    for i,gesture in enumerate(['one tiny questioning murmur','one tiny descending grumble','one tiny emphatic rounded grunt'],1):
        voices.append((f'vo_boss_c{chapter}_blip_{i}',110 if chapter<3 else 120,'One original '+identity+', '+gesture+VOICE_STYLE))
voices.append(('vo_boss_defeat',700,'One original chunky candy monster makes a comic deflated wordless surrender groan, funny and soft, no pain.'+VOICE_STYLE))
write_set('voices',voices)
