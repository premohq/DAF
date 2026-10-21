#  Dante's Ad Forge

---

## What It Does

The Forge has three tabs:

### 1 · AI Studio (new)
Turns a plain bottle photo into a cinematic ad shot with Google's Nano Banana image models, right inside the Forge.

- **Upload the bottle** — the AI copies the bottle and label from your photo. No photo? Type the product name and it draws the bottle from memory (check the label). The product name fills in by itself from the photo (see [Bottle detection](#bottle-detection)).
- **Pick a scene** — Inferno, Gold Luxe, Ice Cold, Neon Night, Bar Top, Spotlight, Agave Sunset, or Studio White (a clean packshot for the classic window ads). Add extra direction if you want ("fresh limes beside it").
- **Pick the shape and model** — 4:5, 9:16 (Reels and the window screens), 16:9 or 1:1. With a Google key or Puter: Nano Banana 2 (fast) or Nano Banana Pro (most detailed); GPT Image 2.5 and Grok Imagine 2 through Puter; 1K, 2K or 4K. With Gemini, Gemini picks its own model and size.
- **Pick the engine:**
  | Engine | Cost | Setup | Use it for |
  |---|---|---|---|
  | **Gemini · DAF Helper add-on** (default) | Free within Gemini's daily image limit | Install the [add-on](#the-daf-helper-add-on) once and be signed in to Gemini | Everyday bottle art, with no tab switching |
  | Puter | Free monthly allowance per Puter account | Sign in once | Demos and proof of concept (Puter's terms cover personal, non-commercial use) |
  | Google key · Vertex AI express mode | Free for 90 days, no card | 2 minutes at [console.cloud.google.com/expressmode](https://console.cloud.google.com/expressmode) with a Gmail account that has never used Google Cloud | Real client work (Google's terms allow commercial use) |
  | Google key · AI Studio | Pay as you go, roughly 7–15¢ per image | Billing on an AI Studio key | After the free period |
- **Generate** 1, 2 or 4 takes, compare them, then hit **Use in Social ad** or **Use in Window ad**. Cinematic shots open the Window tab in the Cinematic look; Studio White shots open it in Classic. The bottle's name, size and price go along, so the ad text is already filled in. With Gemini, the button turns into **Stop** while it works, and **Start as soon as I add a bottle photo** makes the whole thing one step: drop the photo in, get the art.
- **No add-on, or on a phone?** "Copy prompt & open Gemini" copies the same prompt and opens the Gemini app. Attach the bottle, paste and send. Then right-click the picture, **Copy image**, come back and press **Ctrl+V** (or **Paste image**): it lands in AI Studio with no saving and re-uploading. **Add a finished image** still takes a file.

### The DAF Helper add-on
A small browser add-on in [`addon/`](addon/) that lets the Forge use Gemini without you touching Gemini. When you press Generate, it opens Gemini in a pinned tab in the background, attaches your bottle photo, types the prompt, waits for the picture, and hands the full-size image back to AI Studio. It also reads bottle labels for [Bottle detection](#bottle-detection).

**Install it once (about 2 minutes, on a computer with Chrome, Edge, Brave or Opera):**
1. In AI Studio, step 4 · Engine, press **Download the add-on** and unzip it somewhere you'll keep it.
2. Open `chrome://extensions` (Edge: `edge://extensions`) and turn on **Developer mode**.
3. Click **Load unpacked** and pick the `daf-helper` folder.
4. Make sure you're signed in at [gemini.google.com](https://gemini.google.com), then reload the Forge. AI Studio says **Add-on connected**.

**Good to know:**
- It runs on your own Gemini account, so it's free within Gemini's daily image limit, and each picture is a new chat in your Gemini history. Gemini's own picture rules and visible watermark apply, just like using Gemini by hand.
- The pinned Gemini tab is the add-on's worker. Close it any time; it comes back on the next job. **Open the Gemini tab** shows it, and **Show Gemini while it works** keeps it in front during a job.
- It only acts on the Forge's pages and on its own Gemini tab. It never reads your other tabs or your other Gemini chats.
- It drives Gemini's website the way you would by hand, not through an official Google API, so a redesign of Gemini's page can break it. When that happens the Forge shows Gemini's message or what step failed; download the add-on again once it's updated, and the hand route above always works.
- Phones can't run add-ons.

### Bottle detection
Upload a product photo in any tab and the Forge reads the label: brand, expression, type, bottle size, and a shelf price tag if one is clearly in the shot. It fills in AI Studio's product name, the Social ad's headline, line two, detail line and price, and the Window ad's size line, product name and price.

- It never overwrites what you typed. Only empty boxes, the page's sample text, or its own earlier fill get replaced. If you had typed something, it says what it found and offers **Use these instead**. Every fill has an **Undo**.
- It uses whichever AI is set up, fastest first: a Google key (Gemini Flash, which is in Google's free tier for AI Studio keys), the DAF Helper add-on, or Puter if you're already signed in. With none of them, it shows a tip instead.
- Turn it off with the **Fill in the name from the photo** checkbox in any photo box. The setting is shared by all three tabs.

### 2 · Social Media Ads
Builds Instagram-ready posts and Reels on a live canvas.

- **Pick a layout:**
  | Layout | What it is |
  |---|---|
  | One product | A product photo with its name and price (the classic Forge ad) |
  | Two products · split | Two photos side by side or stacked, with a gold line between them. One headline and price card, which makes a good "from" price |
  | Deals list | A weekly price list: up to 8 deals (name, detail, price, optional NEW / SALE / DEAL tag, prices like `2 for 41.99`) over a blurred store photo or the Inferno background. In the video the rows slide in one by one |
  | Closing slide | The last slide of a carousel or Story: the logo, where to find the store, and a 21+ line |
- **Upload a photo** — drag & drop, tap to pick, or paste (Ctrl+V). Drag to reposition, pinch or use the slider to zoom, one button to re-center the crop. In a split, drag either half to move its photo. With One product, the name, size and price fill in from the photo.
- **Whole product** — instead of filling the frame, the entire photo sits inside the safe area (below the logo, above the name and price) over a blurred, darkened copy of itself, so no bottle top gets cut off.
- **Blur a spot** — turn on the blur tool and drag a box over anything that shouldn't be in the ad, like other products' price tags. It gets blurred and muted. Undo and clear are one tap.
- **Enhance photo** — a light contrast, color and sharpening pass for phone photos.
- **Pick a format:**
  | Format | Size | Use it for |
  |---|---|---|
  | 4:5 Post | 1080×1350 | Instagram feed (recommended) |
  | 1:1 Square | 1080×1080 | Grid / general purpose |
  | 9:16 Reel | 1080×1920 | Reels & Stories |
  | 16:9 Wide | 1920×1080 | X / Facebook link posts |
- **Set the text** — badge (top right, Ember red or Gold), product name lines, subline, and the store address footer.
- **Price card** — toggle it on and punch in dollars and cents. Dark near-black card, thin gold keyline. Classy. No tacky chips. An optional caption sits above it in small gold capitals: 2 FOR, SALE, FROM, 1 LITER, or anything you type.
- **Export:**
  - **PNG** — full-resolution still, named automatically from the product.
  - **All four sizes · ZIP** — the 4:5, 1:1, 9:16 and 16:9 PNGs in one download, plus a caption.txt with the caption, short version and alt text.
  - **Video** — 4, 6, or 8 second animated cut with the ember/flame treatment, rendered frame by frame into a smooth 30 fps MP4 (falls back to real-time recording on browsers without WebCodecs).
  - **GIF** — encoded in-browser via gif.js. No audio, bigger files. Video is the move for Reels; add audio in the Instagram app before posting.
  - **Preview animation** — watch the loop before you commit.
- **Caption & hashtags** — writes the post for you from the ad's own text and price: a caption with the store line, "21+ only. Please drink responsibly." and hashtags, a short version for X, Stories and Threads, and alt text. "Another version" cycles through three takes per ad type (new arrival, deal, or pick). Copy buttons for each, an optional AI polish through Puter, and the caption keeps up with the ad until you edit it by hand.

### 3 · Window Display Ads
Replicates the exact format of the in-store window monitor ads.

- **Look:** Classic white (the product photo on white, exactly like the originals) or Cinematic (a full-screen scene — an AI Studio shot works best — behind the Dante's lockup, product lines and price).
- Upload (or paste) a product photo, zoom, and position it. The size line, product name and price fill in from the photo.
- **Orientation:** Landscape (3840×2160, carries the rotated layout the current window monitors use) or Portrait (2160×3840, for screens set up for vertical input).
- Product lines, credit line, and the big outlined price in the established window style — cents as a superscript, no decimal point. Just like the originals.
- **Fonts:** 21 to pick from, each shown in its own typeface: Baloo (the house style and the default), Anton, Bebas Neue, Oswald, Archivo Black, Alfa Slab, Zilla Slab, Ultra, Abril Fatface, Playfair, Rye, Lilita One, Titan One, Fredoka, Luckiest Guy, Bangers, Bungee, Righteous, Lobster, Pacifico and Permanent Marker. Each is sized to match Baloo, so switching fonts keeps the layout. The price follows the font too, unless you untick **Price uses this font too** (handy for script fonts). The choice is remembered on this device.
- Exports full monitor resolution PNG, drop-in compatible with the existing display files.
- **Loop video:** 6, 10, or 15 second seamless MP4 loops for the screens, 1080p or 4K, in the same orientation as the PNG. Embers drift, light sweeps across, the scene breathes and the price pulses, while the name and price stay readable. Change the price and re-export; no new AI image needed.

---

## The Brand System (Baked In)

You don't pick the look. The look picks you.

- **Logo:** the real Dante's Liquors logo, rebuilt as vector art: the plate with its corner screws, DANTE'S with the red apostrophe, LIQUORS, and the fire glass. The glass is traced from a clear photo of the real logo: a separate top-left flame with a curl, split from the body by an S-shaped gap that runs out both sides, a short slash cutting in on the right, one solid red with a thin darker rim, and a stem and foot that shade to maroon. The gaps are see-through, just like the PNG. It is drawn as shapes, so it stays sharp at any size, from the tab icon to 4K window screens. Dark ads get the white version (with a lighter stem so it doesn't disappear on black), white ads get the black one.
- **Logo files:** [`brand/`](brand/) has the logo as SVG (any size, for print and signage) and 4000px transparent PNG, black and white versions, plus the glass on its own.

- **Palette:** Ink `#0B0908` · Bone `#F6F1E7` · Ember `#C8102E` · Gold `#E3B264`
- **Type:** Anton (headlines), Oswald (body/UI), Zilla Slab (brand mark), Baloo 2 (window ads) — pulled from Google Fonts. The other window fonts load only when the Window tab opens.
- **Treatment:** Inferno full-bleed — radial ember glow rising from the bottom, floating ember particles, film-grade scrims, and flame accents. No inset boxes, no dead margins. The bottle IS the poster.
- **The Forge itself** is dressed as a mid-2000s website: centered page on a dark pinstripe, glossy fire banner and tabs, boxed sidebar modules with [–] toggles, and classic XP-style form controls. The ads keep the brand system above.

---

## How It Works Under the Hood

Everything is one self-contained `index.html`, plus the optional add-on in `addon/`:

- All rendering happens on an HTML5 `<canvas>` — the preview you see is the same pipeline the export uses, drawn at full output resolution.
- Photo positioning uses pointer events (drag to pan, pinch to zoom on touch) with clamped centering so the crop can never fall off the image.
- The ZIP of all four sizes is built in the page (stored, no compression library needed). Blurred spots and Enhance work on a copy of the photo; the original is never changed.
- Video export renders every frame on its own clock and encodes with WebCodecs (H.264, or VP9 where H.264 is missing) into an MP4 via mp4-muxer, loaded from jsDelivr on demand. Browsers without WebCodecs fall back to `canvas.captureStream()` + `MediaRecorder`.
- Window loops are seamless by construction: everything that moves repeats exactly once per loop.
- GIF export loads gif.js from a CDN on demand and encodes with web workers.
- AI Studio calls the AI straight from the browser: the DAF Helper add-on (your own Gemini tab), Puter.js (loaded from js.puter.com) or Google's API (Vertex AI express mode or AI Studio) with your key.
- The add-on is a Manifest V3 extension: a bridge script on the Forge's pages passes jobs to its background worker, which reloads its pinned Gemini tab to a new chat, injects the script that attaches the photo, types and sends, and returns the picture at full size (it asks Google's image server for the original). The page builds the add-on's ZIP itself from the files in `addon/`. Keys are kept in this browser only if you leave "Remember on this device" on. Add `?aitest=1` to the URL to try the Puter flow with sample images that use no credits.
- Zero backend. Photos stay in your browser — except in AI Studio, which sends the bottle photo and the prompt to the AI service you picked (Gemini, Puter or Google), and bottle detection, which sends a small copy of the product photo to that same AI to read the label (turn it off with its checkbox). The caption writer works offline; only "Polish the caption with AI" sends the caption text (never a photo) to Puter. Everything else that happens in the Forge stays in the Forge.

---

## Browser Notes

- **Chrome or Safari** recommended — best video export support.
- PNG export works everywhere.
- AI Studio needs an internet connection. Allow pop-ups for the site so the Puter sign-in window can open.
- The DAF Helper add-on works in Chrome, Edge, Brave and Opera on a computer. If you open the Forge as a file instead of from the website, also turn on **Allow access to file URLs** for the add-on in `chrome://extensions`.
- If a browser can't record video, the Forge tells you instead of pretending. Fuhgeddaboudit and switch to Chrome.

---*
