# LensPeek

LensPeek is a zero-framework photo inspector:  
Drag-n-drop images in the browser → get an instant gallery with camera/lens **EXIF** data, GPS mini-maps, and a responsive masonry layout—built entirely with semantic HTML5, BEM-style SCSS, and vanilla ES modules.

<p align="center">
  <img src="docs/demo.gif" width="700" alt="LensPeek demo animation">
</p>

## Features
- **Drag & drop UX** – highlight zone, multi-file upload, no page refresh.
- **Custom EXIF parser** – ~250 LOC, no third-party libs.
- **GPS awareness** – plots coordinates on OpenStreetMap static tiles when available.
- **Responsive CSS Grid** – auto-fit masonry, lazy-loaded thumbnails.
- **Accessible lightbox** – `<dialog>` element, keyboard & screen-reader friendly.
- **Dark / light mode** – respects `prefers-color-scheme`.

## Tech stack
| Layer      | Details |
| ---------- | --------------------------------------------------------- |
| Mark-up    | HTML5 (`<figure>`, `<figcaption>`, `<dialog>`)            |
| Styling    | SCSS → BEM (`.card`, `.card__meta`, `.card--has-map`), CSS Grid |
| Logic      | Vanilla JS ES2023 modules, FileReader API, Geolocation API |
| Tooling    | `npm` scripts – `sass`, `esbuild`, `serve`                |

## Quick start
```bash
git clone https://github.com/<you>/lenspeek.git
cd lenspeek
npm install
npm run dev            # local server + watch
npm run build          # compile SCSS & bundle JS to /dist
```

Full project reference (structure, scripts, gaps vs planned features): [PROJECT.md](./PROJECT.md).
