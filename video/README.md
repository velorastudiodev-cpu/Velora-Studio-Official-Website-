# Velora reel (motion graphics, 1:40)

Final files: `renders/velora-v2-9x16-reels.mp4` (Instagram Reels) and `renders/velora-v2-16x9.mp4` (YouTube/landscape).

Source is a [HyperFrames](https://hyperframes.heygen.com) project in `reel/` (9:16). The 16:9 version is generated from it.

```bash
cd video/reel
npx hyperframes preview                 # edit in the browser (Studio)
npx hyperframes render -o renders/reel-9x16.mp4
python3 make_169.py                     # writes ../reel-16x9 from the 9:16 scenes
cd ../reel-16x9 && npx hyperframes render -o renders/reel-16x9.mp4
```

Sound: `reel/assets/audio/mix.wav` is the finished mix (music + SFX + voice, -14 LUFS). To change it, edit
`reel/audio/build_audio.py` and run it (`pip install numpy scipy soundfile pyloudnorm`, ffmpeg). The male voice
(`reel/audio/vo-*.wav`) was made with Kokoro TTS, voice `am_onyx`, phonemes `vəlˈɔːɹə` (ve-LO-ra).

Notes on what was built and why: `reel/SPEC.md`, `reel/REVIEW.md`.
