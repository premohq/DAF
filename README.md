# 🔥 Dante's Ad Forge

**The in-house ad machine for Dante's Liquors — Hollywood, FL, inside Sedano's Plaza.**

One HTML file. No installs, no accounts, no design software, no excuses. Open it, drop a bottle photo, and walk out with a finished ad in the full Inferno brand style — same fonts, same colors, same fight-poster attitude, every single time.

**Live tool:** https://premohq.github.io/dantes-ad-forge/

---

## What It Does

The Forge has two engines, split into tabs:

### 1 · Social Media Ads
Builds Instagram-ready posts and Reels on a live canvas.

- **Upload a photo** — drag & drop or tap to pick. Drag to reposition, pinch or use the slider to zoom, one button to re-center the crop.
- **Pick a format:**
  | Format | Size | Use it for |
  |---|---|---|
  | 4:5 Post | 1080×1350 | Instagram feed (recommended) |
  | 1:1 Square | 1080×1080 | Grid / general purpose |
  | 9:16 Reel | 1080×1920 | Reels & Stories |
  | 16:9 Wide | 1920×1080 | X / Facebook link posts |
- **Set the text** — badge (top right, Ember red or Gold), product name lines, subline, and the store address footer.
- **Price card** — toggle it on and punch in dollars and cents. Dark near-black card, thin gold keyline. Classy. No tacky chips.
- **Export:**
  - **PNG** — full-resolution still, named automatically from the product.
  - **Video** — 4, 6, or 8 second animated cut with the ember/flame treatment, recorded straight off the canvas. MP4 where the browser supports it (Safari / iPhone, newer Chrome), WebM otherwise.
  - **GIF** — encoded in-browser via gif.js. No audio, bigger files. Video is the move for Reels; add audio in the Instagram app before posting.
  - **Preview animation** — watch the loop before you commit.

### 2 · Window Display Ads
Replicates the exact format of the in-store window monitor ads.

- Upload a product photo, zoom, and position it.
- **Orientation:** Landscape (3840×2160, carries the rotated layout the current window monitors use) or Portrait (2160×3840, for screens set up for vertical input).
- Product lines, credit line, and the big outlined price in the established window style — cents as a superscript, no decimal point. Just like the originals.
- Exports full monitor resolution PNG, drop-in compatible with the existing display files.

---

## The Brand System (Baked In)

You don't pick the look. The look picks you.

- **Palette:** Ink `#0B0908` · Bone `#F6F1E7` · Ember `#C8102E` · Gold `#E3B264`
- **Type:** Anton (headlines), Oswald (body/UI), Zilla Slab (brand mark) — pulled from Google Fonts
- **Treatment:** Inferno full-bleed — radial ember glow rising from the bottom, floating ember particles, film-grade scrims, and flame accents. No inset boxes, no dead margins. The bottle IS the poster.

---

## How It Works Under the Hood

Everything is one self-contained `index.html`:

- All rendering happens on an HTML5 `<canvas>` — the preview you see is the same pipeline the export uses, drawn at full output resolution.
- Photo positioning uses pointer events (drag to pan, pinch to zoom on touch) with clamped centering so the crop can never fall off the image.
- Video export uses `canvas.captureStream()` + `MediaRecorder`, trying MP4 codecs first and falling back through VP9/VP8 WebM.
- GIF export loads gif.js from a CDN on demand and encodes with web workers.
- Zero backend. Nothing gets uploaded anywhere — photos never leave the browser. What happens in the Forge stays in the Forge.

---

## Running It

**Easiest:** use the live GitHub Pages link above. Done.

**Local:** clone the repo and open `index.html` in a browser. That's the whole install.

```
git clone https://github.com/premohq/dantes-ad-forge.git
```

Needs an internet connection the first time for Google Fonts and (only if you export a GIF) the gif.js CDN.

---

## Browser Notes

- **Chrome or Safari** recommended — best video export support.
- PNG export works everywhere.
- If a browser can't record video, the Forge tells you instead of pretending. Fuhgeddaboudit and switch to Chrome.

---

*Dante's Liquors · 2305 FL-7, Hollywood · Inside Sedano's Plaza*
