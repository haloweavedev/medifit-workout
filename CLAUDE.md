# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Medifit is a **static, no-build website** for browsing curated workout programs. It originated on Glitch (see `.glitchdotcom.json` — `appType: "static"`) and ships as three HTML pages plus one shared CSS file and one shared JS file. There is no package manager, no bundler, no test runner, and no server-side code.

## Running locally

Open `index.html` directly in a browser, or serve the directory with any static server:

```sh
python3 -m http.server 8000     # then visit http://localhost:8000
```

There are no build, lint, or test commands. Changes to `.html`, `.css`, or `.js` files are picked up by reloading the browser.

## Architecture

### Page model (3 pages, all sharing `style.css` + `script.js`)

- **`index.html`** — marketing landing page. Hero, features grid, CTA, footer.
- **`archive.html`** — program listing page. Hardcoded `.program-card` elements carry `data-level` / `data-duration` / `data-type` attributes that the client-side filter reads. Each card links to `workout.html?program=<program-id>`.
- **`workout.html`** — program detail page. Reads `?program=` from the URL, looks the id up in an in-script map, and rewrites the header/breadcrumb. Day tabs (`Day 1`–`Day 5`) toggle which `.workout-day` section is visible; for 3-day programs the script hides tabs 4–5.

### Single-script dispatch pattern

`script.js` is loaded on every page. The top-level `DOMContentLoaded` handler calls `initializeFilters()`, `initializeWorkoutPage()`, and `initializeVideoModal()` unconditionally — each function early-returns when its required DOM elements aren't present. Page routing is implicit: a function "runs" on a page only if that page contains the elements it queries for.

### Program/exercise data lives inline in `script.js`

There is no JSON file, no CMS, and no backend. Two in-script lookup tables drive everything:

- `getProgramData(programId)` — maps slug → `{title, level, duration, type, description}`.
- `getExerciseData(exerciseName)` — maps exercise slug → `{title, videoUrl, instructions[]}` consumed by the video modal.

When adding a new workout, you must touch **all three** of these in lockstep: (1) add a `.program-card` to `archive.html`, (2) add an entry to `getProgramData` in `script.js`, (3) add/extend `.workout-day` sections in `workout.html` and any new exercise entries in `getExerciseData`. The slug used in `archive.html`'s `href="workout.html?program=..."` is the contract between all three.

### `format.md` is the content spec, not code

`format.md` is a **client worksheet** describing the data model the workout content team uses to fill in programs (fields like Level, Duration, Type, Equipment, per-day repeaters, per-exercise repeaters). Treat it as the source of truth for what fields each program should expose if/when the inline JS lookups are replaced by structured data.

## Known issue: `script.js` is duplicated

`script.js` currently contains the same module concatenated multiple times — `getProgramData`, `initializeFilters`, `getExerciseData`, and even the `DOMContentLoaded` listener appear 6×, 2×, 2×, and 12× respectively. Later definitions silently override earlier ones, so behavior comes from the **last** copy in the file. Before editing any function in `script.js`, search for all occurrences and decide whether to deduplicate or edit only the final copy. A general cleanup pass deduplicating this file is appropriate as part of any larger script work.

## Conventions

- Images use `https://placehold.co/...` placeholders — these are intentional stand-ins, not bugs.
- Primary brand color is `#4a90e2` (navbar logo, primary buttons). The level badge uses green (`#28a745`) for Beginner and a distinct color for Advanced (`.program-badge.advanced`).
- Mobile nav uses a `.hamburger` element that toggles `.active` on `.nav-menu` — this is wired up in the first `DOMContentLoaded` handler.
