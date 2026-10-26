# Review — Velora reel v2

**v2 changes (owner: more sound, male AI voice saying "Velora", better editing, plus 16:9):**
- Soundtrack composed in code (audio/build_audio.py): 120 BPM, A minor, Am–F–C–G; drops at 10 s (logo),
  80 s (founder), 92 s (CHAT); breakdown under "Kenapa Velora"; risers, reverse cymbals, snare rolls,
  impacts; ping-pong revisions play as rising blips; stabs on the "3 sistem" count and the three claims.
  No catalog music was reachable (HeyGen not signed in; Pixabay/Openverse/HuggingFace blocked).
- SFX layer ~120 cues (bundled Pixabay set, repitched per take + synthesised pencil scribbles).
- Voice: Kokoro am_onyx (deep male, local, from GitHub release), phonemes ve-LO-ra. "Velora" rings into the
  10 s drop; "Velora Studio Dev." on the end card. Music ducks under both.
- Master: -14.2 LUFS, peak -1.5 dBFS, high-passed at 25 Hz, high shelf for phone speakers.
- Picture: every cut retimed to the beat grid; lime/ink flash frames and shakes on the drops; glitch kicks on
  the pains. Global motion blur tried and removed: it blended the two images on every hard cut.
- 16:9 project: /home/user/velora-reel-169, generated from these scenes by make_169.py (re-run after edits).

## v1 notes

**Built:** storyline A "Dari sketsa sampai server" (STORYLINES.md). Left out: B "Satu orang, empat peran"
(needs the founder's photo) and C "Chat WhatsApp" (most of it would be invented dialogue).

**Shape (100 s, 1080×1920, 30 fps):** hook 0–7 · logo build 7–14 · sketch→real DINASTI 14–24 ·
UI/UX + Website Engineering 24–34 · DINASTI case 34–45 · dashboard 45–54 · Dzikri + "3 sistem" 54–66 ·
kenapa Velora 66–80 · founder 80–90 · CTA + end card 90–100.

**Truth:** every screen is a real screenshot (DINASTI, dashboard login, Dzikri, Velora site). Redline
numbers (358 × 201, 16, 50) are measured from the Velora page in CSS px. Lighthouse 100/100/100/100 is the
Velora site, desktop. "500+ pelanggan" is not used; DINASTI facts are what its site shows.

**Measured:** `hyperframes check` — 0 errors. Kept warnings: the dashboard slot roll (9 words at ~0.19 s each,
on purpose; the same list is printed in full right after), one contrast sample taken mid-roll in S8.
Contact sheets looked at for ~38 moments.

**Not checked:** sound is placed from bundled SFX and measured only, not heard. No music: HeyGen is not signed
in and HuggingFace (MusicGen) is blocked here. A silent copy is delivered for Instagram's own music.

**Weakest shot:** S6 dashboard — the only real screen is the login card, so the "what it edits" beat is type,
not UI. With dashboard screenshots it should show the cash/margin chart and the content editor.

**Pitfalls hit (for the next edit):** the measuring page fell back to a system font until the woff2 was loaded
as a data URL; `.hyperframes/preview/*.html` caches the compiled page — delete it after editing a scene file.
