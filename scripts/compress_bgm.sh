#!/bin/sh
# ย่อ BGM เดิม → assets/audio/bgm/min/ (MP3 96k สเตอริโอ / ลูปสั้น 80k โมโน) · ต้องมี ffmpeg (pip install imageio-ffmpeg)
F=${FFMPEG:-$(python3 -c "import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())")}
cd "$(dirname "$0")/../assets/audio/bgm" && mkdir -p min
enc(){ "$F" -loglevel error -y -i "$1" -ac $3 -ar 44100 -b:a $4 -codec:a libmp3lame "min/$2.mp3"; }
enc "Main menu.mp3" bgm_main 2 96k; enc clockmakers_tea_break.mp3 bgm_stage1 2 96k
for i in 1 2 3 4 5; do enc bgm_boss$i.mp3 bgm_boss$i 2 96k; done
enc bgm_stage2_sink.wav bgm_stage2 1 80k; enc bgm_stage3_stove.wav bgm_stage3 1 80k
enc bgm_stage4_freezer.wav bgm_stage4 1 80k; enc bgm_stage5_oven.wav bgm_stage5 1 80k
