# LensPeek — Project documentation

LensPeek is a **zero-framework**, browser-only photo inspector: drag‑and‑drop (or click‑to‑select) JPEG/PNG/etc. images, read **EXIF** metadata with `exif-js`, and render a simple gallery with per‑file summaries. Styling uses **SCSS** compiled to CSS; JavaScript is **vanilla ES modules** bundled with **esbuild** for the shipped `dist/` assets.

---

## Table of contents

1. [Features](#features)
2. [Tech stack](#tech-stack)
3. [Repository layout](#repository-layout)
4. [Runtime architecture](#runtime-architecture)
5. [Scripts & toolchain](#scripts--toolchain)
6. [Configuration & conventions](#configuration--conventions)
7. [Dependencies](#dependencies)
8. [Development workflow](#development-workflow)
9. [Build artifacts](#build-artifacts)
10. [HTML shell](#html-shell)
11. [JavaScript modules](#javascript-modules)
12. [Styles (SCSS)](#styles-scss)
13. [Browser support](#browser-support)
14. [Roadmap / known gaps](#roadmap--known-gaps)
15. [License](#license)

---

## Features

### Implemented

| Capability | Detail |
|------------|--------|
| **Drag and drop** | `#dropzone` highlights on `dragover`, accepts dropped files |
| **Click to browse** | Programmatic `<input type="file" multiple accept="image/*">` on zone click |
| **Image filtering** | Non‑image MIME types skipped in `showImages()` |
| **Gallery** | `#gallery` unhidden after first batch; cards built per image (`object URLs` via `URL.createObjectURL`) |
| **EXIF summary** | Camera make/model, lens model, focal length, aperture (`f/` number), ISO (async `FileReader` + `EXIF.readFromBinaryFile`) |
| **Graceful degradation** | If no EXIF block, placeholders like “No EXIF data” |

### Parsed but not shown in UI (yet)

The EXIF mapper in `src/scripts/exif-parser.js` also resolves **shutter speed**, **date**, and optional **GPS** lat/lng. The current gallery card template in `main.js` does **not** render these fields or a map tile.

### Placeholder markup

- **`#lightbox`** — `<dialog>` exists in `index.html` but has **no** open/close logic, content injection, or focus trap in JS.
- **`src/scripts/gallery.js`** — File is a stub (“Placeholder for future gallery logic”).

### Styling partly ahead of markup

SCSS refers to `.gallery`, `.card`, `.lightbox`, etc., for dark mode and responsive rules, but **base layout rules** for `.gallery`, `.card`, `.app` (beyond incidental dark‑mode hooks) may be incomplete—cards rely mostly on browser defaults until more layout CSS is added.

---

## Tech stack

| Layer | Choice |
|-------|--------|
| **Markup** | HTML5 semantic shell (`main`, `header`, `section`, `dialog`) |
| **Client JS** | ES modules, DOM APIs (`FileReader`, drag events) |
| **EXIF** | [`exif-js`](https://www.npmjs.com/package/exif-js) |
| **Styles** | SCSS → CSS (`sass`), design tokens in `_variables.scss` |
| **Bundling** | `esbuild` (single IIFE/script bundle entry: `src/scripts/main.js` → `dist/scripts/main.js`) |
| **Local dev server** | `serve` on port **3000** |

No React, Vue, or bundler-heavy framework—the app is deliberately minimal.

---

## Repository layout

```
LensPeek/
├── index.html              # App shell; loads dist CSS + bundled JS
├── package.json            # Scripts and dependencies
├── package-lock.json
├── README.md               # Short intro (may differ slightly from this doc)
├── PROJECT.md              # This file — full project reference
├── src/
│   ├── scripts/
│   │   ├── main.js        # Bootstrap: DOMContentLoaded, builds gallery
│   │   ├── drag-drop.js   # Dropzone wiring + click file picker
│   │   ├── exif-parser.js # Thin wrapper around exif-js
│   │   └── gallery.js      # Unused stub
│   └── styles/
│       ├── main.scss       # Layout, dropzone, dark mode, breakpoints
│       └── _variables.scss # Colors, spacing, radii
└── dist/                   # Generated — run `npm run build`
    ├── scripts/main.js      # Bundled bundle (commit as needed per team policy)
    └── styles/main.css      # Compiled + compressed CSS
```

`node_modules/` is npm output and is not listed here.

---

## Runtime architecture

```
User selects files (drop or dialog)
       │
       ▼
drag-drop.js → onFiles(file[])
       │
       ▼
main.js → showImages(files)
       │
       ├── filter image/* → createObjectURL → <img>
       │
       └── parseExifData(file) [exif-parser.js]
               │
               ├── FileReader.readAsArrayBuffer
               │
               └── EXIF.readFromBinaryFile → normalized fields → innerHTML meta block
```

- **Security note:** `innerHTML` is used with interpolated EXIF/file strings. Typical EXIF strings are benign; untrusted binaries are still user-local. For parity with CSP or hardening goals, migrating to `textContent`/`createElement` would be safer.

---

## Scripts & toolchain

From `package.json`:

| Script | Command | Purpose |
|--------|---------|---------|
| `dev` | `concurrently "npm:sass:watch" "npm:serve"` | Watch SCSS + static server |
| `build` | `sass:build` then `js:build` | Production-ish assets in `dist/` |
| `sass:watch` | `sass --watch src/styles:dist/styles` | Incremental CSS |
| `sass:build` | `sass src/styles:dist/styles --style compressed` | Minified CSS |
| `js:build` | `esbuild src/scripts/main.js --bundle --outfile=dist/scripts/main.js` | Single bundled module graph |
| `serve` | `serve . -p 3000` | Serves repo root (`index.html` at `/`) |

After clone: `npm install`, then `npm run dev` or `npm run build`.

---

## Configuration & conventions

- **Port:** `3000` (fixed in script; override by changing `serve` args or using another static server).
- **Entry HTML:** Loads `dist/styles/main.css` and `dist/scripts/main.js` — you must **`npm run build`** (or watch) before first open if `dist/` is empty.
- **BEM-ish class names:** e.g. `dropzone`, `dropzone__content`, `dropzone--active`, `app__header`, `card`, `card__image`, `card__meta`.

---

## Dependencies

### Production

| Package | Version (declared) | Role |
|---------|---------------------|------|
| `exif-js` | `^2.3.0` | Read EXIF from `ArrayBuffer` in the browser |

### Development

| Package | Role |
|---------|------|
| `sass` | SCSS compilation |
| `esbuild` | JS bundling |
| `serve` | Static file server |
| `concurrently` | Run watcher + server together |

---

## Development workflow

1. **`npm install`**
2. **`npm run dev`** — SCSS watcher writes to `dist/styles/`, HTTP server serves the project root.
3. Visit **`http://localhost:3000`** (path `/` loads `index.html`).
4. Before commit or static deploy **without** watch, run **`npm run build`** so `dist/` matches `src/`.

---

## Build artifacts

- **`dist/scripts/main.js`** — Bundled dependency graph (`exif-js` is part of the bundle).
- **`dist/styles/main.css`** — Compiled from `main.scss` (+ partials). May include `sourceMappingURL`.

Treat `dist/` as **derived output** unless your team policy requires committing built files for GitHub Pages or similar static hosts.

---

## HTML shell

`index.html` defines:

| Element ID / class | Role |
|--------------------|------|
| `main.app` | Page container |
| `header.app__header` | Title + subtitle |
| `section#dropzone.dropzone` | Interactive upload area |
| `section#gallery.gallery` | Image cards (starts `hidden`) |
| `dialog#lightbox.lightbox` | Reserved — not wired in JS |

The page loads **`dist`** assets only, not raw `src/`.

---

## JavaScript modules

### `main.js`

- Imports `setupDragAndDrop` and `parseExifData`.
- **`showImages(files)`** clears and repopulates `#gallery`, skips non‑images, creates `.card` with `.card__image` and `.card__meta`, appends parsed EXIF fields (filename, size, MIME, camera, lens, focal length, aperture, ISO).
- Logs full parsed object to `console` for debugging.

### `drag-drop.js`

- **`setupDragAndDrop(dropzoneId, onFiles)`**
  - `dragover`: `preventDefault`, adds `dropzone--active`.
  - `dragleave`: removes active class.
  - `drop`: `preventDefault`, reads `dataTransfer.files`, calls `onFiles`.
  - `click`: ephemeral file input, `multiple` + `accept="image/*"`, `onchange` forwards files.

### `exif-parser.js`

- **`parseExifData(file)`** returns a `Promise` resolving to `{ camera, lens, focalLength, aperture, iso, shutterSpeed, date, gps|null }`.
- Uses `FileReader.onload` → `EXIF.readFromBinaryFile`.

**Implementation note:** The camera string uses concatenation (`Make` + space + `Model`). If Make/Model can be partial, optional chaining / fallbacks may be desired.

---

## Styles (SCSS)

### `_variables.scss`

- **Light palette:** Primary blue `#3b82f6`, neutrals for text/bg/surface/border.
- **Dark palette:** Mirrored tones for `@media (prefers-color-scheme: dark)`.
- **Spacing scale:** `spacing-sm` through `spacing-xl`, shared `border-radius`.

### `main.scss`

- Resets-ish `body`, `h1`/`p` margins.
- **Breakpoint** `max-width: 700px`: stacks gallery (grid column tweak), adjusts padding — assumes `.gallery`/`.card` grid rules elsewhere or to be added.
- **Dark mode** overrides for `.app`, `.card`, `.lightbox`, `.dropzone`, meta panels.
- **`.dropzone`** dashed border, hover transitions, **`&--active`** drag state.

---

## Browser support

Any **modern evergreen** browser with:

- ES modules (`type="module"`)
- `FileReader`
- `<dialog>` (present in DOM for future lightbox—not yet used programmatically)

`exif-js` targets legacy JPEG EXIF markers; RAW or HEIC decoding is out of scope without extra libraries.

---

## Roadmap / known gaps

Suggested improvements aligned with markup and README aspirations:

1. Wire **`#lightbox`** — populate from clicked card; respect `<dialog>` `showModal`, Escape, focus, `aria-*`.
2. Show **GPS** static map (for example OpenStreetMap tiles) when `gps` exists.
3. Surface **shutter speed** and **date** from `parseExifData` in cards (data already mapped).
4. Flesh **`gallery.js`** — sort, filter, clear all, revoke `object URLs`.
5. Add **`README` demo GIF** (`docs/demo.gif`) if using the marketing snippet from existing README—or remove the dead image link from README.
6. Complete **gallery/card grid** base styles (`display: grid` on `.gallery`) for consistent masonry/card layout referenced in responsive rules.

---

## License

`package.json` declares **`ISC`**. Add a formal `LICENSE` file in-repo if distributing.

---

## Quick reference

| Resource | Location |
|----------|----------|
| Local dev | `http://localhost:3000` |
| Entry | `/index.html` |
| Styles source | `src/styles/main.scss` |
| Scripts source | `src/scripts/main.js` |

---

*Documentation reflects the codebase; update when features land.*
