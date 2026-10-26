"""Velora reel soundtrack: music (synthesised, 120 BPM, A minor), SFX layer and male VO, mixed to one master.

Every cue time below is a picture event in the composition (see SPEC.md). Needs: pip install numpy scipy soundfile
pyloudnorm, and ffmpeg. Run:  python audio/build_audio.py  ->  assets/audio/mix.wav (+ stems in audio/stems/)
"""
import os, subprocess, sys
import numpy as np
import soundfile as sf
import pyloudnorm as pyln
from scipy.ndimage import maximum_filter1d
from scipy.signal import butter, lfilter, fftconvolve, resample_poly

SR = 44100
DUR = 100.0
N = int(SR * DUR)
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SFX_DIR = os.path.join(ROOT, "assets", "sfx")
rng = np.random.default_rng(7)  # seeded: the mix is identical on every build


def bus():
    return np.zeros((N, 2))


def place(b, sig, t, gain=1.0, pan=0.0):
    """Add a mono or stereo signal to bus b at time t (s). pan -1..1."""
    if sig.ndim == 1:
        l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
        sig = np.stack([sig * l * 1.414, sig * r * 1.414], 1)
    i = int(round(t * SR))
    if i >= N:
        return
    if i < 0:
        sig, i = sig[-i:], 0
    n = min(len(sig), N - i)
    b[i:i + n] += sig[:n] * gain


def tt(d):
    return np.arange(int(d * SR)) / SR


def lp(x, f, order=2):
    bb, a = butter(order, min(f, SR / 2 - 100) / (SR / 2), "low")
    return lfilter(bb, a, x, axis=0)


def hp(x, f, order=2):
    bb, a = butter(order, f / (SR / 2), "high")
    return lfilter(bb, a, x, axis=0)


def bp(x, lo, hi, order=2):
    bb, a = butter(order, [lo / (SR / 2), hi / (SR / 2)], "band")
    return lfilter(bb, a, x, axis=0)


def sweep_lp(x, f0, f1, block=512):
    """Lowpass whose cutoff glides f0 -> f1 (exponential) across x: filter sweeps for risers and builds."""
    out = np.zeros_like(x)
    zi = None
    nb = int(np.ceil(len(x) / block))
    for k in range(nb):
        f = f0 * (f1 / f0) ** (k / max(nb - 1, 1))
        bb, a = butter(2, min(f, SR / 2 - 200) / (SR / 2), "low")
        if zi is None:
            zi = np.zeros((max(len(a), len(bb)) - 1,) + x.shape[1:])
        seg = x[k * block:(k + 1) * block]
        out[k * block:(k + 1) * block], zi = lfilter(bb, a, seg, axis=0, zi=zi)
    return out


def hz(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def saw(f, d, detune=0.0):
    ph = np.cumsum(np.full(int(d * SR), f * 2 ** (detune / 1200) / SR)) + rng.random()
    return 2 * (ph % 1) - 1


def adsr(d, a=0.005, dec=0.1, s=0.7, r=0.1):
    n = int(d * SR)
    env = np.ones(n) * s
    na, nd, nr = int(a * SR), int(dec * SR), int(r * SR)
    env[:na] = np.linspace(0, 1, na) if na else env[:na]
    env[na:na + nd] = np.linspace(1, s, len(env[na:na + nd]))
    if nr:
        env[-nr:] *= np.linspace(1, 0, len(env[-nr:]))
    return env


# ---------------------------------------------------------------- instruments

def kick(d=0.5, punch=1.0):
    t = tt(d)
    f = 45 + 125 * np.exp(-t * 32)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 6.5)
    click = hp(rng.standard_normal(len(t)), 2500) * np.exp(-t * 400) * 0.5
    knock = np.sin(2 * np.pi * 185 * t) * np.exp(-t * 45) * 0.45  # the part a phone speaker can play
    return np.tanh((body + click + knock) * 1.6 * punch) * 0.9


def clap():
    t = tt(0.35)
    n = rng.standard_normal(len(t))
    env = np.zeros(len(t))
    for o in (0.0, 0.011, 0.022):
        i = int(o * SR)
        env[i:] += np.exp(-(t[: len(t) - i]) * (90 if o < 0.02 else 18))
    return bp(n * env, 900, 4200) * 0.55


def hat(open_=False):
    t = tt(0.3 if open_ else 0.06)
    return hp(rng.standard_normal(len(t)), 7500, 3) * np.exp(-t * (14 if open_ else 90)) * 0.3


def shaker():
    t = tt(0.05)
    return bp(rng.standard_normal(len(t)), 4500, 9500) * np.exp(-t * 70) * 0.18


def snare(g=1.0):
    t = tt(0.16)
    tone = np.sin(2 * np.pi * 190 * t) * np.exp(-t * 30) * 0.5
    noise = bp(rng.standard_normal(len(t)), 1500, 7000) * np.exp(-t * 26)
    return (tone + noise) * 0.45 * g


def sub(m, d):
    t = tt(d)
    f = hz(m)
    s = np.sin(2 * np.pi * f * t) + 0.18 * np.sin(4 * np.pi * f * t)
    return np.tanh(s * 1.3) * adsr(d, 0.004, 0.05, 0.85, 0.03) * 0.55


def midbass(m, d):
    x = (saw(hz(m), d) + saw(hz(m), d, 9)) * 0.5
    t = tt(d)
    x = sweep_lp(x, 1400, 260)
    return np.tanh(x * 2.2) * adsr(d, 0.004, 0.08, 0.6, 0.04) * 0.22


def pluck(m, d=0.3, bright=3200):
    x = saw(hz(m), d) * 0.6 + saw(hz(m), d, 7) * 0.4
    x = sweep_lp(x, bright, 500, 256)
    return x * np.exp(-tt(d) * 9) * 0.22


def pad(notes, d, cut=1500, a=0.6, r=0.9):
    out = np.zeros((int(d * SR), 2))
    for m in notes:
        for ch, det in ((0, -9), (1, 9)):
            out[:, ch] += saw(hz(m), d, det) + 0.6 * saw(hz(m), d, -det / 2)
    out = lp(out, cut, 2) * adsr(d, a, 0.2, 0.9, r)[:, None]
    return out * 0.06


def stab(notes, d=0.55):
    out = np.zeros((int(d * SR), 2))
    for m in notes + [n + 12 for n in notes]:
        for ch, det in ((0, -12), (1, 12)):
            out[:, ch] += saw(hz(m), d, det)
    out = sweep_lp(out, 5000, 700, 256)
    return out * np.exp(-tt(d) * 5)[:, None] * 0.07


def riser(d, f0=250, f1=7000):
    n = rng.standard_normal((int(d * SR), 2))
    x = sweep_lp(n, f0, f1)
    x = hp(x, 150)
    t = tt(d)
    ph = np.cumsum(180 * (6 ** (t / d))) / SR
    tone = np.sin(2 * np.pi * ph) * 0.25
    env = (t / d) ** 2.2
    return (x * 0.5 + tone[:, None]) * env[:, None] * 0.5


def impact(d=2.2, gain=1.0):
    t = tt(d)
    f = 30 + 70 * np.exp(-t * 5)
    boom = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 2.2)
    noise = lp(rng.standard_normal(len(t)), 1800) * np.exp(-t * 5) * 0.5
    return np.tanh((boom + noise) * 1.5) * 0.8 * gain


def rev_cymbal(d=1.5):
    t = tt(d)
    x = hp(rng.standard_normal(len(t)), 5000) * np.exp(-(d - t) * 3.5)
    return x * 0.25


def scribble(d):
    """Pencil on paper: band-limited noise with a jittery stroke envelope."""
    t = tt(d)
    n = bp(rng.standard_normal(len(t)), 2500, 7000)
    strokes = 0.55 + 0.45 * np.sin(2 * np.pi * 11 * t + 3 * np.sin(2 * np.pi * 2.3 * t))
    return n * strokes * adsr(d, 0.03, 0.1, 0.9, 0.08) * 0.22


def blip(m, d=0.18):
    t = tt(d)
    return (np.sin(2 * np.pi * hz(m) * t) + 0.3 * np.sin(4 * np.pi * hz(m) * t)) * np.exp(-t * 22) * 0.3


def reverb_ir(d=2.4, damp=3000):
    n = rng.standard_normal((int(d * SR), 2))
    t = tt(d)[:, None]
    return lp(n * np.exp(-t * 2.6), damp) * 0.06


IR = reverb_ir()


def verb(x):
    return fftconvolve(x, IR, axes=0)[: len(x)]


# ---------------------------------------------------------------- arrangement

BEAT = 0.5
CHORDS = [  # one per 2 s bar: Am, F, C, G
    dict(root=33, pad=[57, 60, 64], arp=[69, 72, 76, 81]),
    dict(root=29, pad=[53, 57, 60], arp=[65, 69, 72, 77]),
    dict(root=36, pad=[55, 60, 64], arp=[67, 72, 76, 79]),
    dict(root=31, pad=[55, 59, 62], arp=[67, 71, 74, 79]),
]


def chord(t):
    return CHORDS[int(t // 2) % 4]


def section(t):
    for end, name in [(4, "hook"), (6, "ping"), (10, "build1"), (24, "A"), (34, "B"), (66, "C"), (71.5, "break"),
                      (75, "build2"), (79.5, "claims"), (80, "gap"), (90, "D"), (92, "build3"), (98, "E"), (100, "end")]:
        if t < end:
            return name
    return "end"


GROOVE = {"hook", "A", "B", "C", "D", "E", "claims"}
GAPS = [(9.45, 10.0), (79.55, 80.0), (91.8, 92.0)]  # silence before each drop


def in_gap(t):
    return any(a <= t < b for a, b in GAPS)


drums, bass, music, send = bus(), bus(), bus(), bus()
kicks = []

for n in range(int(DUR / BEAT * 4)):  # 16th grid
    t = n * BEAT / 4
    s, pos = section(t), n % 16  # position in the 2 s bar
    if in_gap(t):
        continue
    on_beat = pos % 4 == 0
    groove = s in GROOVE or (s == "build2" and t >= 73)
    if on_beat and (groove or (s == "ping" and pos in (0, 8))):
        k = kick(punch=1.15 if s in ("D", "E") else 1.0)
        place(drums, k, t, 0.95)
        kicks.append(t)
    if groove and pos in (4, 12) and s != "claims":
        c = clap()
        place(drums, c, t, 1.15)
        place(send, c, t, 0.4)
    if groove and pos % 4 == 2:
        place(drums, hat(), t, 1.2, pan=0.25)
    if (s in ("B", "D", "E") or (s == "C" and t >= 54) or s == "ping") and pos % 4 != 2:
        place(drums, shaker(), t, 1.3, pan=-0.3)
    if s in ("C", "D", "E") and pos in (6, 14):
        place(drums, hat(True), t, 0.8, pan=0.35)
    if s == "break" and pos % 4 == 2:
        place(drums, hat(), t, 0.35, pan=0.2)
    # bass: offbeat 8ths on the root, octave pops at the end of the bar
    if s in GROOVE and pos % 4 == 2 and s != "claims":
        c = chord(t)
        m = c["root"] + (12 if pos == 14 and int(t // 2) % 2 else 0)
        place(bass, sub(m, 0.24), t, 0.6)
        place(bass, midbass(m + 12, 0.22), t, 1.3 if s in ("D", "E", "C") else 0.9)
    # arp: 16ths over chord tones
    if s in ("A", "B", "C", "D", "E") and not (s == "C" and 45 <= t < 54 and pos % 2):
        c = chord(t)
        order = [0, 1, 2, 1, 3, 2, 1, 2] if s != "B" else [0, 2, 3, 2, 1, 3, 2, 3]
        m = c["arp"][order[pos % 8]]
        p = pluck(m, 0.25, 4200 if s in ("D", "E") else 3000)
        place(music, p, t, 1.35, pan=0.35 if pos % 2 else -0.35)
        place(send, p, t, 0.25)

# fills into section changes: 16th snares on the last beat
for x in (24, 34, 45, 54, 66):
    for i in range(4):
        place(drums, snare(0.6 + 0.12 * i), x - 0.5 + i * 0.125, 0.8)
# snare rolls into the drops, accelerating
for a, b in ((8.0, 9.45), (73.0, 75.0), (90.0, 91.8)):
    t, step = a, 0.25
    while t < b:
        g = 0.4 + 0.6 * (t - a) / (b - a)
        place(drums, snare(g), t, 0.85)
        place(send, snare(g), t, 0.2)
        step = 0.25 if t < a + (b - a) * 0.45 else 0.125 if t < a + (b - a) * 0.8 else 0.0625
        t += step

# pads, bar by bar, with the section's brightness
CUT = {"hook": 800, "ping": 500, "build1": 900, "A": 1500, "B": 2000, "C": 1800, "break": 2600, "build2": 2200,
       "claims": 2000, "gap": 2000, "D": 2300, "build3": 2400, "E": 2600, "end": 2600}
for bar in range(50):
    t = bar * 2.0
    s = section(t + 0.01)
    if s in ("ping", "end"):
        continue
    gain = 1.6 if s == "break" else 1.2 if s.startswith("build") else 1.0
    if s == "C" and 45 <= t < 54:
        gain, cut = 0.8, 1100
    else:
        cut = CUT[s]
    p = pad(chord(t)["pad"], 2.6, cut)
    place(music, p, t, gain * 1.4)
    place(send, p, t, 0.5 * gain)
# break: half-time piano-like chord plucks
for bar in range(33, 37):
    t = bar * 2.0
    if t < 66 or t >= 74:
        continue
    for i, m in enumerate(chord(t)["pad"] + [chord(t)["pad"][0] + 12]):
        p = pluck(m + 12, 0.9, 2400)
        place(music, p, t + i * 0.04, 1.1, pan=-0.4 + i * 0.25)
        place(send, p, t, 0.5)
        place(music, pluck(m + 12, 0.9, 2400), t + 1.0 + i * 0.04, 0.8, pan=0.4 - i * 0.25)
# end chord: Am add9 rings out
p = pad([57, 60, 64, 71], 4.5, 2600, a=0.02, r=3.0)
place(music, p, 98.0, 2.0)
place(send, p, 98.0, 1.4)

# ping-pong: the file's arrivals become rising blips (S1 4.25–5.5)
for i, m in enumerate([69, 72, 76, 79, 81, 84]):
    t = 4.25 + i * 0.25
    place(music, blip(m), t, 1.0, pan=(-0.5 if i % 2 else 0.5))
    place(send, blip(m), t, 0.4)

# stabs on picture beats: the "3 sistem" count, "=" and the three claims
for t in (63.5, 64.0, 64.5, 68.5, 75.0, 76.5, 78.0):
    st = stab(chord(t)["pad"])
    place(music, st, t, 1.2)
    place(send, st, t, 0.6)
    if t >= 75:
        place(drums, kick(punch=1.2), t, 1.0)
        place(drums, clap(), t, 0.8)

# risers, reverse cymbals and impacts around the drops
place(music, riser(3.4), 6.0, 0.9)
place(music, rev_cymbal(1.2), 8.25, 1.0)
place(music, riser(3.4, 400, 9000), 71.5, 0.7)
place(music, riser(1.4, 600, 9000), 78.1, 0.6)
place(music, rev_cymbal(0.9), 79.0, 1.0)
place(music, riser(1.8, 500, 9000), 90.0, 0.8)
for t, g in ((0.0, 0.9), (6.0, 1.0), (10.0, 1.15), (80.0, 1.15), (92.0, 1.2), (98.0, 1.1)):
    place(music, impact(gain=g), t, 0.9)
    place(send, impact(gain=g), t, 0.3)

# sidechain: bass and music duck under every kick
sc = np.ones(N)
for k in kicks:
    i = int(k * SR)
    seg = tt(0.25)
    sc[i:i + len(seg)] = np.minimum(sc[i:i + len(seg)], 1 - 0.55 * np.exp(-seg / 0.07))
bass *= sc[:, None]
music *= (0.5 + 0.5 * sc)[:, None]

wet = verb(send)
MUSIC = drums * 1.0 + bass * 1.0 + music * 1.0 + wet * 0.9

# ---------------------------------------------------------------- SFX layer


def load(name, rate=1.0):
    """Decode a bundled SFX with ffmpeg; rate != 1 repitches it (asetrate) for take-to-take variety."""
    cmd = ["ffmpeg", "-v", "error", "-i", os.path.join(SFX_DIR, name + ".mp3"), "-af",
           f"asetrate={int(44100 * rate)},aresample=44100", "-ac", "2", "-f", "f32le", "-"]
    raw = subprocess.run(cmd, capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32).reshape(-1, 2).astype(np.float64)


def trim(x, d, fade=0.06):
    x = x[: int(d * SR)].copy()
    f = int(fade * SR)
    x[-f:] *= np.linspace(1, 0, f)[:, None]
    return x


sfx, sfx_send = bus(), bus()
W = [load("whoosh"), load("whoosh-short"), load("whoosh", 0.85), load("whoosh-short", 1.15)]
WC = trim(load("whoosh-cinematic"), 1.3)
POP = [load("pop"), load("pop", 1.12), load("pop", 0.9)]
CLICK, CLICKS = load("click"), load("click-soft")
KEY = [load("key-press"), load("key-press", 1.1), load("key-press", 0.92)]
GL = [trim(load("glitch-1"), 0.35), trim(load("glitch-2"), 0.35), trim(load("glitch-3"), 0.35)]
IMP = [trim(load("impact-bass-1"), 1.6), trim(load("impact-bass-2"), 1.8)]
SPARK = trim(load("sparkle"), 1.4)
wi = 0


def w(t, g=0.55, pan=0.0):
    global wi
    place(sfx, W[wi % len(W)], t - 0.12, g, pan)
    wi += 1


def cue(sig, t, g, pan=0.0, wet=0.0):
    place(sfx, sig, t, g, pan)
    if wet:
        place(sfx_send, sig, t, wet)


# S1 hook
w(1.0, 0.5)
for i, t in enumerate((2.0, 2.5, 3.0, 3.5)):
    cue(GL[i % 3], t, 0.42, pan=(-0.3 if i % 2 else 0.3))
w(4.0, 0.45)
cue(GL[1], 5.5, 0.45)
w(6.85, 0.6, -0.4)
# S2 mark
cue(scribble(0.95), 7.15, 1.0, wet=0.2)
for i in range(8):
    cue(KEY[i % 3], 8.05 + i * 0.07, 0.35, pan=-0.4 + i * 0.1)
cue(WC, 9.1, 0.4)
cue(SPARK, 10.05, 0.35, wet=0.3)
w(13.65, 0.4)
# S3 sketch -> server
w(14.05, 0.45)
cue(scribble(1.2), 14.3, 1.0, wet=0.15)
for i in range(12):
    cue(KEY[i % 3], 14.8 + i * 0.05, 0.22)
cue(WC, 16.4, 0.55)
w(17.0, 0.4)
w(18.5, 0.55)
w(20.0, 0.45, 0.3)
w(21.0, 0.45, -0.3)
for i, t in enumerate((22.0, 22.5, 23.0, 23.5)):
    cue(CLICKS, t, 0.7)
# S4 craft
w(24.0, 0.5)
cue(CLICK, 25.0, 0.6)
for i, t in enumerate((25.5, 26.0, 26.5)):
    cue(POP[i], t, 0.6, wet=0.15)
w(27.2, 0.4)
w(29.0, 0.5)
for i in range(16):
    cue(KEY[i % 3], 29.8 + i * 0.09, 0.28 - i * 0.008, pan=(-0.2 if i % 2 else 0.2))
cue(SPARK, 31.2, 0.4, wet=0.3)
# S5 DINASTI
cue(WC, 33.9, 0.55)
for i, t in enumerate((36.0, 38.0, 40.0, 42.0)):
    w(t, 0.5, (-0.3 if i % 2 else 0.3))
    cue(POP[i % 3], t + 0.15, 0.3)
# S6 dashboard
w(45.0, 0.5)
w(46.6, 0.35)
w(47.2, 0.2, 0.5)
cue(CLICK, 48.0, 0.85)
cue(WC, 48.15, 0.55)
for i in range(9):
    cue(KEY[i % 3], 49.25 + i * 0.25, 0.4)
cue(POP[0], 51.5, 0.6, wet=0.2)
# S7 Dzikri
w(54.0, 0.5)
for i, t in enumerate((55.5, 57.5, 59.5, 61.5)):
    w(t, 0.5, (-0.3 if i % 2 else 0.3))
w(62.25, 0.45)
for i, t in enumerate((63.5, 64.0, 64.5)):
    cue(POP[i], t, 0.55)
# S8 why
w(66.0, 0.5)
w(67.5, 0.45, -0.5)
w(67.75, 0.45, 0.5)
cue(IMP[0], 68.5, 0.6)
cue(WC, 71.4, 0.5)
for i in range(13):
    cue(CLICKS, 71.5 + i * 0.25, 0.35, pan=(-0.25 if i % 2 else 0.25))
for i, t in enumerate((75.0, 76.5, 78.0)):
    cue(IMP[i % 2], t, 0.5)
# S9 founder
w(80.0, 0.5)
w(81.0, 0.4)
for i in range(6):
    cue(KEY[i % 3], 81.1 + i * 0.06, 0.4)
cue(IMP[1], 81.5, 0.6)
w(82.5, 0.4)
cue(WC, 89.45, 0.6)
# S10 CTA
w(90.0, 0.45)
w(91.0, 0.5)
cue(IMP[0], 92.0, 0.55)
cue(POP[1], 92.25, 0.5)
w(92.8, 0.25, 0.5)
cue(CLICK, 93.5, 0.9)
cue(WC, 93.55, 0.5)
for i in range(8):
    cue(KEY[i % 3], 94.15 + i * 0.05, 0.3)
cue(SPARK, 94.6, 0.4, wet=0.3)
cue(POP[0], 95.1, 0.5)

SFX = sfx + verb(sfx_send) * 0.8

# ---------------------------------------------------------------- voice

def voice(path):
    x, sr = sf.read(path)
    assert sr == 24000
    x = np.interp(np.arange(int(len(x) * SR / sr)) / SR, np.arange(len(x)) / sr, x)
    x = hp(x, 70)
    x = x + lp(x, 220) * 0.6  # a little chest
    x = np.tanh(x * 1.8) / 1.8  # gentle saturation, evens the level
    return x / np.abs(x).max() * 0.9


VO, vo_send = bus(), bus()
v1 = voice(os.path.join(ROOT, "audio", "vo-velora.wav"))
v2 = voice(os.path.join(ROOT, "audio", "vo-velora-studio-dev.wav"))
place(VO, v1, 9.12, 1.0)
place(vo_send, v1, 9.12, 0.9)  # the name rings into the drop
place(VO, v2, 94.75, 1.0)
place(vo_send, v2, 94.75, 0.35)
VO = VO + verb(vo_send) * 1.2

# duck the music under the voice
duck = np.ones(N)
for a, d in ((9.12, len(v1) / SR), (94.75, len(v2) / SR)):
    i, j = int((a - 0.08) * SR), int((a + d + 0.25) * SR)
    duck[i:j] = 0.45
duck = np.convolve(duck, np.ones(2205) / 2205, mode="same")
MUSIC *= duck[:, None]

# ---------------------------------------------------------------- master

meter = pyln.Meter(SR)


def to_lufs(x, target):
    return x * 10 ** ((target - meter.integrated_loudness(x)) / 20)


MUSIC = to_lufs(MUSIC, -17.0)
SFX = to_lufs(SFX, -24.0)
VO = to_lufs(VO, -17.0)
mix = MUSIC + SFX + VO * 1.0

# end fade
f = int(1.6 * SR)
mix[-f:] *= np.linspace(1, 0, f)[:, None] ** 1.5


def limit(x, ceiling=0.79):
    """Lookahead true-peak limiter (≈ -2 dBTP, room for AAC): 4x-oversampled peaks, 2 ms window, 80 ms release."""
    a = np.abs(resample_poly(x, 4, 1, axis=0)).max(1)[: len(x) * 4].reshape(-1, 4).max(1)
    win = int(0.002 * SR)
    peak = maximum_filter1d(a, win, origin=-(win // 2))
    g = np.minimum(1, ceiling / np.maximum(peak, 1e-9))
    rel = np.exp(-1 / (0.08 * SR))
    out = np.empty_like(g)
    cur = 1.0
    for i in range(len(g)):  # one pass, release-only smoothing
        cur = g[i] if g[i] < cur else g[i] + (cur - g[i]) * rel
        out[i] = cur
    return x * out[:, None]


mix = hp(mix, 25)  # no DC, no sub-rumble below the kick
mix = mix + hp(mix, 3500) * 0.35  # high shelf: air for phone speakers
mix = to_lufs(mix, -14.0)
mix = limit(mix)
lufs = meter.integrated_loudness(mix)
os.makedirs(os.path.join(ROOT, "audio", "stems"), exist_ok=True)
os.makedirs(os.path.join(ROOT, "assets", "audio"), exist_ok=True)
sf.write(os.path.join(ROOT, "assets", "audio", "mix.wav"), mix.astype(np.float32), SR, subtype="PCM_16")
for name, x in (("music", MUSIC), ("sfx", SFX), ("vo", VO)):
    sf.write(os.path.join(ROOT, "audio", "stems", name + ".wav"), (x / max(1, np.abs(x).max())).astype(np.float32), SR, subtype="PCM_16")
print(f"mix: {lufs:.1f} LUFS, peak {20 * np.log10(np.abs(mix).max()):.1f} dBFS")
