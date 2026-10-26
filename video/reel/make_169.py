"""Builds ../reel-16x9 from this 9:16 project: canvas size, landscape CSS overrides, and the few pixel values the
timelines carry (cursor targets, punch-in origins, the ping-pong axis). Re-run after editing any scene here."""
import glob, os, shutil

here = os.path.dirname(os.path.abspath(__file__))
dst = os.path.join(here, "..", "reel-16x9")
shutil.rmtree(dst, ignore_errors=True)
shutil.copytree(here, dst, ignore=shutil.ignore_patterns("renders", ".hyperframes", "audio", "make_169.py"))
os.chdir(dst)

for f in ["index.html"] + glob.glob("compositions/*.html"):
    s = open(f).read()
    s = s.replace('data-width="1080" data-height="1920"', 'data-width="1920" data-height="1080"')
    s = s.replace('data-resolution="portrait"', 'data-resolution="landscape"').replace("width=1080, height=1920", "width=1920, height=1080")
    s = s.replace("width: 1080px; height: 1920px;", "width: 1920px; height: 1080px;")
    open(f, "w").write(s)

BASE = """
    /* 16:9 */
    #root .ln { left: 120px; right: 120px; }
    #root .stk { left: 120px; right: 120px; top: 120px; height: 840px; display: flex; flex-wrap: wrap; align-items: baseline; align-content: center; column-gap: 0.22em; }
"""
CSS = {
    "s1-hook": """
    #s1-desain { top: 330px !important; font-size: 300px !important; }
    #s1-kode { top: 330px !important; font-size: 300px !important; }
    #s1-file { left: 330px !important; top: 760px !important; width: 120px !important; height: 120px !important; }
    #s1-rev { top: 120px !important; left: 120px !important; right: 120px !important; text-align: center; }
""",
    "s2-mark": """
    #s2-logo { left: 410px !important; top: 200px !important; width: 1100px !important; height: 319px !important; }
    #s2-l1 { top: 600px !important; font-size: 150px !important; text-align: center; }
    #s2-l2 { top: 890px !important; text-align: center; }
""",
    "s3-sketch": """
    #s3-top { top: 80px !important; font-size: 150px !important; }
    #s3-bot { top: 880px !important; font-size: 150px !important; }
    #s3-box { left: 410px !important; top: 225px !important; width: 1100px !important; height: 619px !important; }
""",
    "s4-craft": """
    #s4-cam { left: auto !important; right: 220px; width: 608px; height: 1080px; }
    #s4-shot, #s4-red { width: 100% !important; height: 100% !important; }
    #s4-band { left: 0 !important; right: auto !important; width: 1000px; top: 380px !important; height: 300px !important; padding: 60px 120px !important; }
    #s4-band .q { font-size: 56px; }
    #s4-t2 { top: 230px !important; right: auto !important; width: 960px; }
    #s4-cap { top: 650px !important; right: auto !important; width: 900px; }
    #s4-c .s4-cell { width: 380px !important; }
    #s4-c .s4-cell:nth-of-type(1) { left: 1080px !important; top: 130px !important; }
    #s4-c .s4-cell:nth-of-type(2) { left: 1460px !important; top: 130px !important; }
    #s4-c .s4-cell:nth-of-type(3) { left: 1080px !important; top: 560px !important; }
    #s4-c .s4-cell:nth-of-type(4) { left: 1460px !important; top: 560px !important; }
    .s4-cell svg { width: 300px !important; height: 300px !important; }
    .s4-num { top: 82px !important; font-size: 160px !important; }
""",
    "s5-dinasti": """
    #s5-band { right: auto !important; width: 860px; height: 1080px !important; }
    #s5-name { top: 300px !important; font-size: 240px !important; }
    #s5-sub { top: 530px !important; }
    #s5-facts { top: 610px !important; height: 92px !important; }
    .s5-f { font-size: 86px !important; }
    #s5-win { top: 0 !important; left: 860px !important; }
    .s5-seg { width: 1060px !important; }
""",
    "s6-dashboard": """
    #s6-name { top: 330px !important; right: auto !important; }
    #s6-sub { top: 520px !important; right: auto !important; }
    #s6-card { left: 1080px !important; top: 90px !important; width: 720px !important; height: 900px !important; }
    #s6-m { top: 220px !important; }
    #s6-roll { top: 420px !important; }
    #s6-l1 { top: 650px !important; } #s6-l2 { top: 730px !important; }
""",
    "s7-dzikri": """
    #s7-band { right: auto !important; width: 860px; height: 1080px !important; }
    #s7-name { top: 300px !important; font-size: 240px !important; }
    #s7-facts { top: 540px !important; height: 80px !important; }
    .s7-f { font-size: 76px !important; }
    #s7-win { top: 0 !important; left: 860px !important; }
    .s7-seg { width: 1060px !important; }
    #s7-n { left: 120px !important; top: 170px !important; font-size: 640px !important; }
    #s7-thumb { left: 1320px !important; top: 300px !important; width: 480px !important; height: 340px !important; }
    #s7-l { left: 520px !important; top: 300px !important; right: auto !important; }
    #s7-l .s7-lw:first-child { font-size: 260px !important; }
    #s7-l .s7-lw:last-of-type { font-size: 170px !important; }
""",
    "s8-why": """
    #s8-l1 { top: 170px !important; font-size: 190px !important; }
    #s8-eq { top: 300px !important; }
    #s8-l2 { top: 690px !important; font-size: 190px !important; }
    #s8-l3 { top: 940px !important; text-align: center; }
    #s8-band { right: auto !important; width: 860px; height: 1080px !important; }
    #s8-tt { top: 260px !important; }
    #s8-tt .w:first-child { font-size: 190px !important; }
    #s8-tt .w:last-of-type { font-size: 118px !important; }
    .s8-r { font-size: 70px !important; }
    #s8-roll { top: 600px !important; height: 70px !important; }
    #s8-win { top: 0 !important; left: 860px !important; }
    #s8-win img { width: 1060px !important; }
    .s8-big { top: 250px !important; }
    .s8-sub { top: 640px !important; font-size: 64px !important; }
""",
    "s9-founder": """
    #s9-name { top: 170px !important; }
    #s9-full { top: 450px !important; right: auto !important; }
    #s9-role { top: 530px !important; right: auto !important; }
    #s9-city { top: 590px !important; right: auto !important; }
    #s9-tile { left: 1000px !important; top: 120px !important; width: 800px !important; height: 840px !important; }
    #s9-mark { left: 250px !important; top: 160px !important; }
    #s9-q { top: 560px !important; font-size: 46px !important; }
""",
    "s10-cta": """
    #s10-chat { top: 80px !important; }
    #s10-num { top: 560px !important; }
    #s10-hint { top: 730px !important; }
    #s10-logo { left: 610px !important; top: 200px !important; width: 700px !important; height: 203px !important; }
    #s10-btn { left: 560px !important; right: 560px !important; top: 500px !important; }
    #s10-mail { top: 710px !important; }
    #s10-tag { top: 785px !important; }
""",
}
JS = {
    "s1-hook": [("keyframes: { y: [0, 340, 0, 340, 0, 340]", "keyframes: { x: [0, 1140, 0, 1140, 0, 1140]"),
                ('tl.fromTo("#s1-file", { y: 0 }', 'tl.fromTo("#s1-file", { x: 0 }')],
    "s2-mark": [('tl.set("#s2-logo", { x: 543, scale: 1.8 }, 0);', 'tl.set("#s2-logo", { x: 639, scale: 1.8 }, 0);')],
    "s4-craft": [('{ yPercent: 0, duration: 0.45, ease: "expo.out" }, 3.2);', '{ yPercent: 0, duration: 0.45, ease: "expo.out" }, 1.6);'),
                 ("stagger: 0.12 }, 3.4);", "stagger: 0.12 }, 1.8);"), ("{ scale: 1.35, y: 120,", "{ scale: 1.35, y: 60,")],
    "s6-dashboard": [("{ x: 1150, y: 1500 }, { x: 520, y: 1040,", "{ x: 2000, y: 1200 }, { x: 1420, y: 672,")],
    "s7-dzikri": [("{ y: -300 }, { y: -931,", "{ y: -400 }, { y: -1061,"), ('transformOrigin: "395px 1631px"', 'transformOrigin: "387px 1601px"')],
    "s8-why": [("(-y + 610)", "(-y + 540)")],
    "s10-cta": [("{ x: 1150, y: 1500 }, { x: 560, y: 520,", "{ x: 2000, y: 1200 }, { x: 960, y: 330,"),
                ("circle(0% at 560px 520px)", "circle(0% at 960px 330px)"), ("circle(150% at 560px 520px)", "circle(150% at 960px 330px)")],
}
for name, css in CSS.items():
    p = f"compositions/{name}.html"
    s = open(p).read()
    s = s.replace("  </style>", BASE + css + "  </style>", 1)
    for a, b in JS.get(name, []):
        assert a in s, (name, a)
        s = s.replace(a, b)
    open(p, "w").write(s)
print("ok")
