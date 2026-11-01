import os,json,pathlib,urllib.request,urllib.error,datetime,base64,hashlib,concurrent.futures
R=pathlib.Path('assets/incoming/audio_voice_acting');R.mkdir(parents=True,exist_ok=True)
key=os.environ.get('ELEVENLABS_API_KEY','').strip()
if not key:
    import winreg
    with winreg.OpenKey(winreg.HKEY_CURRENT_USER,'Environment') as reg:key=winreg.QueryValueEx(reg,'ELEVENLABS_API_KEY')[0].strip()
roles={
'strawberry':'young adult woman, bright and brave, slightly clumsy warmth, clear mid pitch, light British-neutral accent',
'ruby':'tiny female jam spirit, sparkling and fast cheerful delivery, high light pitch, airy magical vocal quality, clear intelligible words',
'mint':'calm young adult woman, low soft voice, dry humor, slow precise words, cool but caring',
'cocoa':'big gentle adult man, deep warm voice with a smile and gentle laugh, sleepy relaxed pace',
'taro':'energetic young adult man, quick excited clear speech, a little scatterbrained, curious cartographer',
'yuzu':'warm cheerful young adult woman, sunny confident gardener, playful cute commander, decisive and friendly',
'grandma':'kind elderly woman, gentle wise voice, a little frail but firm, comforting royal kitchen grandmother',
'planter':'elderly man, tired regal voice, grief under pride, restrained emotional depth, weary dignity',
'hunger':'deep hollow male whisper, slow and hungry, mysterious fantasy presence but child-friendly, a single clear performer with resonant vocal texture',
'boss_c1':'original chapter one cursed creature voice, adult female contralto, sharp commanding protective queen, can soften into a gentle worried mother, child-friendly fantasy acting',
'boss_c2':'original chapter two cursed creature voice, adult masculine mid-low pitch, stern brittle commanding pride, can soften into vulnerable weary relief, child-friendly fantasy acting',
'boss_c3':'original chapter three root guardian voice, mature feminine low resonant pitch, ancient calm authority with grief, can soften into caring warmth, child-friendly fantasy acting'}
text="Hello! Let's bring the flavor back. I'm ready for a new adventure. Stay close, Ruby. Together, we can bring warmth back to every kitchen."
def save(p,obj):p.write_text(json.dumps(obj,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
def generate(item):
    speaker,description=item;record=R/'design'/f'{speaker}.json';record.parent.mkdir(exist_ok=True)
    if record.exists():return json.loads(record.read_text(encoding='utf-8'))
    if speaker=='strawberry':
        old=json.loads((R/'ACCESS_TEST.json').read_text(encoding='utf-8'));body=old['parameters'];result=old['result'];created=old['testedAtUtc']
    else:
        body={'voice_description':'Original fantasy game character. '+description+'. Natural clean English studio speech. No music, sound effects, reverb, or celebrity imitation.','model_id':'eleven_multilingual_ttv_v2','text':text,'auto_generate_text':False}
        req=urllib.request.Request('https://api.elevenlabs.io/v1/text-to-voice/design?output_format=mp3_44100_128',data=json.dumps(body).encode(),headers={'xi-api-key':key,'Content-Type':'application/json'},method='POST')
        try:
            with urllib.request.urlopen(req,timeout=150) as resp:result=json.load(resp)
        except urllib.error.HTTPError as e:raise RuntimeError(str(e.code)+' '+e.read().decode().replace(key,'[REDACTED]'))
        created=datetime.datetime.now(datetime.timezone.utc).isoformat()
        for i,p in enumerate(result['previews'],1):
            audio=base64.b64decode(p.pop('audio_base_64'));p['file']=f'design/{speaker}_take{i}.mp3';(R/p['file']).write_bytes(audio)
    rec={'speaker':speaker,'provider':'ElevenLabs','endpoint':'/v1/text-to-voice/design','createdAtUtc':created,'parameters':body,'result':result,'status':'awaiting_owner_voice_selection'}
    save(record,rec);print('Designed '+speaker+': '+str(len(result['previews']))+' alternatives',flush=True);return rec
with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:records=list(pool.map(generate,roles.items()))
save(R/'PROMPTS.json',{'provider':'ElevenLabs','scope':'A07 category1 only; owner must select voices before recording other categories','generations':records})
save(R/'VOICES.json',{'status':'awaiting_owner_selection','savedVoiceIds':{},'voices':[{ 'speaker':r['speaker'],'selected':None,'candidates':[{'take':i,'generated_voice_id':p['generated_voice_id'],'file':p['file']} for i,p in enumerate(r['result']['previews'],1)]} for r in records],'note':'Generated preview IDs are candidates, not saved persistent TTS voice IDs. Save only owner-selected candidates using POST /v1/text-to-voice. Chapter boss candidates are provisional chapter-level voices, not fifteen approved boss identities.'})
print('Completed 12 roles; persistent voices not created',flush=True)
