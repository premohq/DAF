DAF Helper — the add-on for Dante's Ad Forge
=============================================

What it does
  In the Forge's AI Studio, "Generate" sends your bottle photo and the prompt to
  Gemini in a pinned tab in the background, waits for the picture and brings it
  back into the Forge. No tab switching, no copy/paste, no saving and re-uploading.
  The Forge also uses it to read bottle labels, to write captions with Gemini, and
  in the Batch tab to make the art for many bottles in a row.

  It uses your own Gemini account, so it is free within Gemini's daily limits.
  Each job opens a new chat, so the chats also show up in your Gemini history.

Install (one time, about 2 minutes; Chrome, Edge, Brave or Opera on a computer)
  1. Unzip this folder somewhere you'll keep it (for example Documents/daf-helper).
  2. Open chrome://extensions  (Edge: edge://extensions, Brave: brave://extensions).
  3. Turn on "Developer mode".
  4. Click "Load unpacked" and choose the daf-helper folder.
  5. Open https://gemini.google.com once and make sure you are signed in.
  6. Reload the Forge. AI Studio shows "Add-on connected".

Updating
  When the Forge says a newer add-on is out: download it again from AI Studio,
  unzip it over the old daf-helper folder, then press the reload arrow on the
  DAF Helper card in chrome://extensions.

Good to know
  - Don't delete or move the folder afterwards; the browser runs the add-on from it.
  - The pinned Gemini tab is the add-on's worker. You can close it; it comes back
    on the next job.
  - If a job seems stuck, press "Open the Gemini tab" in the Forge to watch it, or
    tick "Show Gemini while it works".
  - Gemini's website changes from time to time. If the add-on stops finding
    Gemini's buttons, download the latest version from the Forge and load it again.
  - The add-on only acts on pages of Dante's Ad Forge and on its own Gemini tab.
    It never reads your other tabs or your other Gemini chats.
