"""Pre-crop + enhance source photos so the Forge draws them 1:1 (no in-browser upscaling).
Modes per format:
  crop   - point/anchor or tag-free region crop (default)
  panel  - sharp 4:5 product panel over a blurred, darkened copy of the scene (wide/reel)
  split  - two photos side by side (or stacked) with a gold divider"""
import json, os
from PIL import Image, ImageChops, ImageEnhance, ImageFilter, ImageDraw, ImageOps

HERE = os.path.dirname(os.path.abspath(__file__))
cfg = json.load(open(os.path.join(HERE, 'concepts.json')))
PD = os.path.join(HERE, cfg['photoDir'])
OUT = os.path.join(HERE, 'prep'); os.makedirs(OUT, exist_ok=True)  # scratch output, not committed
FMT = {'p45': (1080, 1350), 'sq': (1080, 1080), 'reel': (1080, 1920), 'wide': (1920, 1080)}
DEF_A = {'p45': [0.5, 0.44], 'sq': [0.5, 0.42], 'reel': [0.5, 0.45], 'wide': [0.5, 0.42]}
GOLD = (227, 178, 100)
_cache = {}
RETOUCH = {}  # photo -> boxes to blur (other products' price tags), set per concept

def src(name):
    key = (name, tuple(map(tuple, RETOUCH.get(name, []))))
    if key not in _cache:
        im = ImageOps.exif_transpose(Image.open(os.path.join(PD, name))).convert('RGB')
        if RETOUCH.get(name):
            blur = ImageEnhance.Brightness(ImageEnhance.Color(im.filter(ImageFilter.GaussianBlur(18))).enhance(0.3)).enhance(0.8)
            m = Image.new('L', im.size, 0); d = ImageDraw.Draw(m)
            for b in RETOUCH[name]: d.rounded_rectangle(b, 14, fill=255)
            im = Image.composite(blur, im, m.filter(ImageFilter.GaussianBlur(6)))
        _cache[key] = im
    return _cache[key]

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

# Clear zone per format (frame px): below the header, above the text block / price card
BAND = {'p45': [40, 110, 1040, 1000], 'sq': [40, 105, 1040, 745],
        'reel': [30, 125, 1050, 1570], 'wide': [700, 95, 1500, 1030]}

def fit(photo, W, H, band, hero, ha=(0.5, 0.5), maxs=2.1, keep=False):
    """Scale/position the photo so `hero` (source px) sits fully inside `band` (frame px).
    Real pixels fill the frame wherever the photo has them; anything past the photo's
    edge is a blurred, darkened extension with a feathered seam."""
    im = src(photo); iw, ih = im.size
    bx0, by0, bx1, by1 = band; bw, bh = bx1 - bx0, by1 - by0
    hx0, hy0, hx1, hy1 = hero; hw, hh = hx1 - hx0, hy1 - hy0
    sc = min(bw / hw, bh / hh, maxs)
    def place(b0, bl, h0, hl, Wd, idim, a):
        pref = b0 + (bl - hl * sc) * a
        lo_i, hi_i = h0 * sc + Wd - idim * sc, h0 * sc      # keeps frame inside the photo
        p = pref if keep else min(max(pref, lo_i), hi_i) if lo_i <= hi_i else (lo_i + hi_i) / 2
        return min(max(p, b0), b0 + bl - hl * sc)           # hero never leaves the band
    px = place(bx0, bw, hx0, hw, W, iw, ha[0]); py = place(by0, bh, hy0, hh, H, ih, ha[1])
    fx0, fy0 = hx0 - px / sc, hy0 - py / sc; fx1, fy1 = fx0 + W / sc, fy0 + H / sc
    ix0, iy0, ix1, iy1 = max(0, fx0), max(0, fy0), min(iw, fx1), min(ih, fy1)
    dx0, dy0 = round((ix0 - fx0) * sc), round((iy0 - fy0) * sc)
    dx1, dy1 = round((ix1 - fx0) * sc), round((iy1 - fy0) * sc)
    real = enhance(im.resize((dx1 - dx0, dy1 - dy0), Image.LANCZOS, box=(ix0, iy0, ix1, iy1)), sc)
    if (dx0, dy0, dx1, dy1) == (0, 0, W, H): return real, sc
    fb = box_point(iw, ih, W / H, min(iw, (fx1 - fx0)), ((fx0 + fx1) / 2, (fy0 + fy1) / 2), (0.5, 0.5))
    out = ImageEnhance.Brightness(im.resize((W, H), Image.LANCZOS, box=fb).filter(ImageFilter.GaussianBlur(30))).enhance(0.5)
    rw, rh = dx1 - dx0, dy1 - dy0; E = 90
    mx_, my_ = Image.new('L', (rw, rh), 255), Image.new('L', (rw, rh), 255)
    dx_, dy_ = ImageDraw.Draw(mx_), ImageDraw.Draw(my_)
    for i in range(E):  # feather only the seams where the photo runs out
        v = round(255 * (i / E) ** 1.4)
        if dx0 > 0: dx_.line([(i, 0), (i, rh)], fill=v)
        if dx1 < W: dx_.line([(rw - 1 - i, 0), (rw - 1 - i, rh)], fill=v)
        if dy0 > 0: dy_.line([(0, i), (rw, i)], fill=v)
        if dy1 < H: dy_.line([(0, rh - 1 - i), (rw, rh - 1 - i)], fill=v)
    m = ImageChops.multiply(mx_, my_)
    out.paste(real, (dx0, dy0), m)
    return out, sc

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

HALF_BAND = {('p45', 'h'): [20, 110, 520, 1000], ('sq', 'h'): [20, 105, 520, 745],
             ('wide', 'h'): [40, 95, 920, 720], ('reel', 'h'): [20, 125, 520, 1570],
             ('reel', 'v'): [[30, 125, 1050, 935], [30, 25, 1050, 640]]}

def split(c, f, W, H):
    sp = c['split']; d = sp.get('dir', {}).get(f, 'h')
    hw, hh = (W // 2, H) if d == 'h' else (W, H // 2)
    im = Image.new('RGB', (W, H))
    use_fit = f in sp.get('fit', [])
    for i, half in enumerate(sp['halves']):
        if use_fit:
            band = (sp.get('bands', {}).get(f) or HALF_BAND[(f, d)])
            band = band[i] if isinstance(band[0], list) else band
            part, _ = fit(half['photo'], hw, hh, band, half['hero'], half.get('ha', [0.5, 0.5]), half.get('maxs', 2.1), half.get('keep', False))
        else:
            reg = half.get('regions', {}).get(f, half['region'])
            part = cut(half['photo'], box_region(hw / hh, reg, half.get('a', [0.5, 0.5])), hw, hh)
        im.paste(part, (i * hw, 0) if d == 'h' else (0, i * hh))
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
        elif mode == 'fit':
            im, sc = fit(c['photo'], W, H, o.get('band', c.get('band', {}).get(f, BAND[f])), o.get('hero', c['hero']),
                         o.get('ha', c.get('ha', [0.5, 0.5])), c.get('maxs', 2.1)); info = 'fit %.2fx' % sc
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
    RETOUCH.clear(); RETOUCH.update(c.get('retouch', {}))
    social(c)
    if 'win' in c:
        RETOUCH.clear(); RETOUCH.update(c['win'].get('retouch', {}))
        window(c)
RETOUCH.clear()
for c in cfg['carousel']:
    if c.get('photo'): social(c)

# Roundup background: the store aisle, blurred so the price list stays legible.
r = cfg['roundup']
s = src(r['photo'])
src(r['photo']).resize((1080, 1920), Image.LANCZOS, box=box_point(s.width, s.height, 1080 / 1920, 1330, (665, 1182), (.5, .5))) \
    .filter(ImageFilter.GaussianBlur(14)).save(os.path.join(OUT, 'roundup_bg.jpg'), quality=92)
print('done')
