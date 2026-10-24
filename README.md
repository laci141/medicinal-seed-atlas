# Medicinal Seed Atlas

An evidence-rated atlas of 15 edible seeds: flashcards, a sortable nutrient table, soaking
timers and PubMed-linked research. Available in **Hungarian, Romanian, English and German**.

Every health claim carries its evidence level — from in-vitro work up to meta-analyses of
randomised trials — and links out to PubMed, the DOI and OpenAlex. Where no human trial
exists, the card says so instead of implying evidence that isn't there.

## What's inside

- **15 flashcards** — question on the front, answer plus a spec grid, warnings and citation
  on the back.
- **Comparison table** — all 15 seeds side by side per 100 g or per daily portion, in grams
  or as % of the daily value. Sort by any column; the highest value in each is starred.
- **Evidence window** per seed — what data exists, how to read it, the fibre and fat profile,
  absorption pairings, safety tags and the studies themselves.
- **Consumption guide** per seed — soaking time, amount, timing, and a soaking countdown that
  survives a page reload and can be exported to Google Calendar or an `.ics` file.
- **Breathing & beach panel** — an animated shoreline whose waves follow your breath, four
  patterns (box 4-4-4-4, 4-7-8, coherence 5.5, ocean 4-6), and a sleep timer that slowly
  dims the screen.
- **Daily tracker** with a streak, and a rotating evidence-based tip.

## Running it

There is no build step and no dependencies. Either:

- open `index.html` directly in a browser (double-click works — the scripts are plain
  `<script src>` tags, not ES modules), or
- serve the folder with any static server, e.g. `npx http-server -p 8080`.

Deploying is a matter of pushing the folder to GitHub Pages or Cloudflare Pages as-is.

## Layout

```
index.html          markup only
css/style.css       all styling, including the glass-panel effect
js/data.js          language-neutral: seed list, nutrient values, DV table, study IDs
js/app.js           all logic
js/lang/hu.js       ┐ one file per language: UI strings, seed content,
js/lang/ro.js       │ the evidence primer, tips, and the plain-language
js/lang/en.js       │ summary of each study
js/lang/de.js       ┘
```

Only the language you are reading is downloaded. Switching languages injects that file once
and re-renders; a language already loaded is never fetched again.

Adding a language means adding one file under `js/lang/` that calls `registerLanguage(code,
pack)`, then adding a button to the language switcher in `index.html`. No other file changes.

Correcting a nutrient figure or a study means editing `js/data.js` only — the numbers and the
PubMed IDs live there, and no translated text needs to be touched.

## Sources

- Nutrient values: [USDA FoodData Central](https://fdc.nal.usda.gov/), per 100 g.
- Daily values: FDA Daily Value for adults.
- Studies: [PubMed](https://pubmed.ncbi.nlm.nih.gov/) (NLM/NIH), with DOI and
  [OpenAlex](https://openalex.org/) links for citation counts.

The `REVIEWED` constant at the top of `js/data.js` is the date the content and references were
last checked; it is shown in the footer and under the comparison table.

## A note on what this is not

This is an educational reference, not medical advice. Several seeds carry real interactions —
psyllium with medication timing, fenugreek in pregnancy, flax with anticoagulants, unwashed
poppy seed with opiate traces — and these are flagged on the cards. Concentrated supplements
are a different matter from eating the seed, and warrant asking a doctor.
