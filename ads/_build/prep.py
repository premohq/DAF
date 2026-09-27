"""Pre-crop + enhance source photos so the Forge draws them 1:1 (no in-browser upscaling).
Modes per format:
  crop   - point/anchor or tag-free region crop (default)
  panel  - sharp 4:5 product panel over a blurred, darkened copy of the scene (wide/reel)
  split  - two photos side by side (or stacked) with a gold divider"""
import json, os
from PIL import Image, ImageEnhance, ImageFilter, ImageDraw, ImageOps

HERE = os.path.dirname(os.path.abspath(__file__))
cfg = json.load(open(os.path.join(HERE, 'concepts.json')))
PD = os.path.join(HERE, cfg['photoDir'])
OUT = os.path.join(HERE, 'prep'); os.makedirs(OUT, exist_ok=True)  # scratch output, not committed
FMT = {'p45': (1080, 1350), 'sq': (1080, 1080), 'reel': (1080, 1920), 'wide': (1920, 1080)}
DEF_A = {'p45': [0.5, 0.44], 'sq': [0.5, 0.42], 'reel': [0.5, 0.45], 'wide': [0.5, 0.42]}
GOLD = (227, 178, 100)
_cache = {}

def src(name):
    if name not in _cache:
        _cache[name] = ImageOps.exif_transpose(Image.open(os.path.join(PD, name))).convert('RGB')
    return _cache[name]

def box_point(iw, ih, R, cw, p, a):
    cw = min(cw, iw); ch = cw / R
    if ch > ih: ch = ih; cw = ch * R
    x0 = min(max(0, p[0] - a[0] * cw), iw - cw)
    y0 = min(max(0, p[1] - a[1] * ch), ih - ch)
    return (x0, y0, x0 + cw, y0 + ch)

def box_region(R, reg, a):
    rx0, ry0, rx1, ry1 = reg; rw, rh = rx1 - rx0, ry1 - ry0
    if rw / rh > R: ch = rh; cw = ch * R
    else: cw = rw; ch = cw / R
    x0 = rx0 + a[0] * (rw - cw); y0 = ry0 + a[1] * (rh - ch)
    return (x0, y0, x0 + cw, y0 + ch)

def enhance(im, scale):
    im = ImageEnhance.Contrast(im).enhance(1.05)
    im = ImageEnhance.Color(im).enhance(1.08)
    r = 1.1 + max(0, scale - 1) * 1.3
    return im.filter(ImageFilter.UnsharpMask(radius=r, percent=65, threshold=2))

def cut(photo, b, W, H):
    return enhance(src(photo).resize((W, H), Image.LANCZOS, box=b), W / (b[2] - b[0]))

def spec_box(photo, o, R, cw, p, a):
    s = src(photo)
    if 'region' in o: return box_region(R, o['region'], o.get('a', a))
    return box_point(s.width, s.height, R, o.get('cw', cw), o.get('p', p), o.get('a', a))

def single_box(c, f, R):
    o = c['crop'][f]
    cw = min(1330, c['cw'] * 1.6) if f == 'wide' else c['cw']
    return spec_box(c['photo'], o, R, cw, c['p'], DEF_A[f])

def feather(w, h, edge, axis):
    m = Image.new('L', (w, h), 255); d = ImageDraw.Draw(m)
    for i in range(edge):
        v = round(255 * (i / edge) ** 1.4)
        if axis == 'x': d.line([(i, 0), (i, h)], fill=v); d.line([(w - 1 - i, 0), (w - 1 - i, h)], fill=v)
        else: d.line([(0, i), (w, i)], fill=v); d.line([(0, h - 1 - i), (w, h - 1 - i)], fill=v)
    return m

def panel(c, f, W, H):
    b45 = single_box(c, 'p45', 0.8) if 'p45' in c['crop'] else None
    o = c['crop'][f]
    if 'panel_region' in o: b45 = box_region(0.8, o['panel_region'], o.get('a', [0.5, 0]))
    s = src(c['photo'])
    cx, cy, bh = (b45[0] + b45[2]) / 2, (b45[1] + b45[3]) / 2, b45[3] - b45[1]
    bgb = box_point(s.width, s.height, W / H, (W / H) * bh * (1.15 if W > H else 0.75), (cx, cy), (0.5, 0.5))
    bg = s.resize((W, H), Image.LANCZOS, box=bgb).filter(ImageFilter.GaussianBlur(26))
    bg = ImageEnhance.Brightness(bg).enhance(0.5)
    if W > H:
        ph = H; pw = round(ph * 0.8); x, y, ax = round(o.get('x', 0.60) * W - pw / 2), 0, 'x'
    else:
        pw = W; ph = round(pw / 0.8); x, y, ax = 0, round(o.get('y', 0.43) * H - ph / 2), 'y'
    pan = cut(c['photo'], b45, pw, ph)
    bg.paste(pan, (x, y), feather(pw, ph, 110, ax))
    return bg, b45

def split(c, f, W, H):
    sp = c['split']; d = sp.get('dir', {}).get(f, 'h')
    hw, hh = (W // 2, H) if d == 'h' else (W, H // 2)
    im = Image.new('RGB', (W, H))
    for i, half in enumerate(sp['halves']):
        reg = half.get('regions', {}).get(f, half['region'])
        b = box_region(hw / hh, reg, half.get('a', [0.5, 0.5]))
        im.paste(cut(half['photo'], b, hw, hh), (i * hw, 0) if d == 'h' else (0, i * hh))
    dr = ImageDraw.Draw(im)
    if d == 'h': dr.rectangle((W // 2 - 2, 0, W // 2 + 1, H), fill=GOLD)
    else: dr.rectangle((0, H // 2 - 2, W, H // 2 + 1), fill=GOLD)
    return im, d

def social(c):
    for f, (W, H) in FMT.items():
        o = c.get('crop', {}).get(f)
        if o is None: continue
        mode = o.get('mode', 'split' if 'split' in c else 'crop')
        if mode == 'split':
            im, d = split(c, f, W, H); info = 'split-' + d
        elif mode == 'panel':
            im, b = panel(c, f, W, H); info = 'panel %.2fx' % (1080 / (b[2] - b[0]) * (0.8 if W > H else 1))
        else:
            b = single_box(c, f, W / H); im = cut(c['photo'], b, W, H)
            info = 'crop %s %.2fx' % ([round(v) for v in b], W / (b[2] - b[0]))
        im.save(os.path.join(OUT, f"{c['id']}_{f}.jpg"), quality=97, subsampling=0)
        print(c['id'], f, info)

def window(c):
    w = c['win']
    # Window zone in the Forge master is 1780x2180: bake rounded corners + a soft shadow into a PNG.
    ZW, ZH, pad, rad = 1780, 2180, 34, 72
    s = src(c['photo'])
    if 'box' in w:
        b = w['box']; R = (b[2] - b[0]) / (b[3] - b[1])
        PH = ZH - pad * 2; PW = round(PH * R)
        if PW > ZW - pad * 2: PW = ZW - pad * 2; PH = round(PW / R)
    else:
        PW, PH = ZW - pad * 2, ZH - pad * 2
        b = box_region(PW / PH, w['region'], w.get('a', [0.5, 0.5])) if 'region' in w else \
            box_point(s.width, s.height, PW / PH, w['cw'], w['p'], [0.5, 0.5])
    im = cut(c['photo'], b, PW, PH)
    mask = Image.new('L', (PW, PH), 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, PW - 1, PH - 1), rad, fill=255)
    CW, CH = PW + pad * 2, PH + pad * 2
    canvas = Image.new('RGBA', (CW, CH), (0, 0, 0, 0))
    sh = Image.new('L', (CW, CH), 0)
    ImageDraw.Draw(sh).rounded_rectangle((pad, pad + 10, pad + PW, pad + PH + 10), rad, fill=110)
    canvas.paste(Image.new('RGBA', (CW, CH), (40, 28, 18, 255)), (0, 0), sh.filter(ImageFilter.GaussianBlur(16)))
    canvas.paste(im.convert('RGBA'), (pad, pad), mask)
    canvas.save(os.path.join(OUT, f"{c['id']}_window.png"))
    print(c['id'], 'window', [round(v) for v in b], (CW, CH))

for c in cfg['concepts']:
    social(c)
    if 'win' in c: window(c)
for c in cfg['carousel']:
    if c.get('photo'): social(c)

# Roundup background: the store aisle, blurred so the price list stays legible.
r = cfg['roundup']
s = src(r['photo'])
src(r['photo']).resize((1080, 1920), Image.LANCZOS, box=box_point(s.width, s.height, 1080 / 1920, 1330, (665, 1182), (.5, .5))) \
    .filter(ImageFilter.GaussianBlur(14)).save(os.path.join(OUT, 'roundup_bg.jpg'), quality=92)
print('done')
