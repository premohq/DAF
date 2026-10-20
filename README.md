#  Dante's Ad Forge

---

## What It Does

The Forge has three tabs:

### 1 · AI Studio (new)
Turns a plain bottle photo into a cinematic ad shot with Google's Nano Banana image models, right inside the Forge.

- **Upload the bottle** — the AI copies the bottle and label from your photo. No photo? Type the product name and it draws the bottle from memory (check the label).
- **Pick a scene** — Inferno, Gold Luxe, Ice Cold, Neon Night, Bar Top, Spotlight, Agave Sunset, or Studio White (a clean packshot for the classic window ads). Add extra direction if you want ("fresh limes beside it").
- **Pick the shape and model** — 4:5, 9:16 (Reels and the window screens), 16:9 or 1:1. Nano Banana 2 (fast) or Nano Banana Pro (most detailed); GPT Image 2.5 and Grok Imagine 2 are also available through Puter. 1K, 2K or 4K.
- **Pick the engine:**
  | Engine | Cost | Setup | Use it for |
  |---|---|---|---|
  | Puter | Free monthly allowance per Puter account | Sign in once | Demos and proof of concept (Puter's terms cover personal, non-commercial use) |
  | Google key · Vertex AI express mode | Free for 90 days, no card | 2 minutes at [console.cloud.google.com/expressmode](https://console.cloud.google.com/expressmode) with a Gmail account that has never used Google Cloud | Real client work (Google's terms allow commercial use) |
  | Google key · AI Studio | Pay as you go, roughly 7–15¢ per image | Billing on an AI Studio key | After the free period |
- **Generate** 1, 2 or 4 takes, compare them, then hit **Use in Social ad** or **Use in Window ad**. Cinematic shots open the Window tab in the Cinematic look; Studio White shots open it in Classic.
- **Out of allowance?** "Copy prompt & open Gemini" copies the same prompt and opens the free Gemini app. Attach the bottle, paste, download the result, then bring it back with **Add a finished image**.

### 2 · Social Media Ads
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
  - **Video** — 4, 6, or 8 second animated cut with the ember/flame treatment, rendered frame by frame into a smooth 30 fps MP4 (falls back to real-time recording on browsers without WebCodecs).
  - **GIF** — encoded in-browser via gif.js. No audio, bigger files. Video is the move for Reels; add audio in the Instagram app before posting.
  - **Preview animation** — watch the loop before you commit.

### 3 · Window Display Ads
Replicates the exact format of the in-store window monitor ads.

- **Look:** Classic white (the product photo on white, exactly like the originals) or Cinematic (a full-screen scene — an AI Studio shot works best — behind the Dante's lockup, product lines and price).
- Upload a product photo, zoom, and position it.
- **Orientation:** Landscape (3840×2160, carries the rotated layout the current window monitors use) or Portrait (2160×3840, for screens set up for vertical input).
- Product lines, credit line, and the big outlined price in the established window style — cents as a superscript, no decimal point. Just like the originals.
- Exports full monitor resolution PNG, drop-in compatible with the existing display files.
- **Loop video:** 6, 10, or 15 second seamless MP4 loops for the screens, 1080p or 4K, in the same orientation as the PNG. Embers drift, light sweeps across, the scene breathes and the price pulses, while the name and price stay readable. Change the price and re-export; no new AI image needed.

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
- Video export renders every frame on its own clock and encodes with WebCodecs (H.264, or VP9 where H.264 is missing) into an MP4 via mp4-muxer, loaded from jsDelivr on demand. Browsers without WebCodecs fall back to `canvas.captureStream()` + `MediaRecorder`.
- Window loops are seamless by construction: everything that moves repeats exactly once per loop.
- GIF export loads gif.js from a CDN on demand and encodes with web workers.
- AI Studio calls the AI straight from the browser: Puter.js (loaded from js.puter.com) or Google's API (Vertex AI express mode or AI Studio) with your key. Keys are kept in this browser only if you leave "Remember on this device" on. Add `?aitest=1` to the URL to try the Puter flow with sample images that use no credits.
- Zero backend. Photos stay in your browser — except in AI Studio, which sends the bottle photo and the prompt to the AI service you picked (Puter or Google). Everything else that happens in the Forge stays in the Forge.

---

## Browser Notes

- **Chrome or Safari** recommended — best video export support.
- PNG export works everywhere.
- AI Studio needs an internet connection. Allow pop-ups for the site so the Puter sign-in window can open.
- If a browser can't record video, the Forge tells you instead of pretending. Fuhgeddaboudit and switch to Chrome.

---*
