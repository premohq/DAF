"""Copy renders from out/ into ../<concept>/: stills -> high-quality JPG, window files stay PNG,
then rebuild ../overview.jpg."""
import os, glob, shutil
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__)); OUT = os.path.join(HERE, 'out'); DST = os.path.dirname(HERE)
for f in sorted(glob.glob(f'{OUT}/*/*')):
    rel = os.path.relpath(f, OUT); d = os.path.join(DST, os.path.dirname(rel)); os.makedirs(d, exist_ok=True)
    base = os.path.basename(f)
    if base.startswith('window_'): Image.open(f).save(os.path.join(d, base), optimize=True)
    elif base.endswith('.png'): Image.open(f).convert('RGB').save(os.path.join(d, base[:-4] + '.jpg'), quality=93, subsampling=0, optimize=True)
    else: shutil.copy2(f, os.path.join(d, base))
files = sorted(glob.glob(f'{DST}/[01]*/feed_4x5.jpg')) + [f'{DST}/14_carousel/00_cover_feed_4x5.jpg', f'{DST}/14_carousel/99_closer_feed_4x5.jpg']
tw, th, g, cols = 360, 450, 10, 5; rows = (len(files) + cols - 1) // cols
S = Image.new('RGB', (cols * tw + (cols + 1) * g, rows * th + (rows + 1) * g), (11, 9, 8))
for i, f in enumerate(files):
    S.paste(Image.open(f).resize((tw, th), Image.LANCZOS), (g + (i % cols) * (tw + g), g + (i // cols) * (th + g)))
S.save(os.path.join(DST, 'overview.jpg'), quality=86)
