# Black Bulls — Hero Landing Page

A pixel-faithful implementation of the **Black Bulls** design agency hero from Figma
([node `19491:37232`](https://www.figma.com/design/1ncbtjvU0IrUy66eT3w38n/?node-id=19491-37232)).

Built as a dependency-free static page — plain HTML + CSS, no build step.

## Run it

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Structure

| File | Purpose |
| --- | --- |
| `index.html` | Page markup. The layout mirrors the Figma frame (1440px design canvas). |
| `styles.css` | All styling. Coordinates and gradients are translated directly from the design. |
| `assets/manifest.json` | Maps each design asset to its Figma export URL. |
| `scripts/fetch-assets.sh` | Vendors the assets locally (see below). |

## A note on assets

The images (bull photos, star textures, decorative vectors, glows) reference the
**Figma CDN URLs directly**. These exported URLs are only valid for ~7 days. The
build environment's network policy blocks `www.figma.com`, so the assets could not
be vendored into the repo automatically.

To make them permanent, from a machine with access to Figma:

```bash
./scripts/fetch-assets.sh
```

…then replace each `https://www.figma.com/api/mcp/asset/<id>` reference in
`index.html` and `styles.css` with the matching `assets/<filename>.png`
(mapping in `assets/manifest.json`).

## Fonts

Loaded from Google Fonts: **Plus Jakarta Sans** and **Ubuntu**. The design also
uses **Gilroy**, **SF Pro Display**, and **Tahoma**, which are not freely
distributable — these fall back to the closest available faces (see the
`--font-*` variables in `styles.css`). Drop in the licensed font files to match
the design exactly.
