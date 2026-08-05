# Black Bulls — Design Agency

The Black Bulls landing page, rebuilt from scratch as a **React + Vite** app using
animated components from [react-bits](https://github.com/DavidHDev/react-bits).

> **Unrelated side project in this repo:** [`game/`](./game) contains a separate app —
> "امپراتوری چوسان", an AI-game-master country-management simulation. See
> [`game/README.md`](./game/README.md) to run it.

> The previous dependency-free HTML/CSS version is preserved under [`legacy/`](./legacy).

## Run it

```bash
npm install
npm run dev      # start the dev server (http://localhost:5173)
npm run build    # production build → dist/
npm run preview  # preview the production build
```

## Tech stack

| | |
| --- | --- |
| Framework | React 18 + Vite |
| Animations | [react-bits](https://github.com/DavidHDev/react-bits) (JS + CSS variant, vendored) |
| Motion engine | `motion` (the successor to framer-motion) |
| WebGL | `ogl` (used by the Particles background) |
| Styling | Plain CSS with design tokens (`src/index.css`), one CSS file per component |

## Structure

```
src/
├── main.jsx                 app entry
├── App.jsx                  page composition (section order)
├── index.css                global tokens, fonts, base styles
├── assets.js                Figma asset URLs (single place to swap them)
├── reactbits/               vendored react-bits components (verbatim)
│   ├── Particles/           hero starfield background  (ogl)
│   ├── ShinyText/           shimmering "Get Started"   (motion)
│   ├── GradientText/        animated gradient text     (motion)
│   ├── CountUp/             +300 clients counter        (motion)
│   ├── SpotlightCard/       cursor-tracking cards
│   └── BlurText/            scroll-reveal headings      (motion)
└── components/              page sections
    ├── Navbar/              fixed nav, blurs on scroll
    ├── Hero/                headline, info card, CTA, stats
    ├── Experience/          "Experience the World of Forex…"
    ├── EliteTrading/        4 feature SpotlightCards
    ├── HelpSelect/          "I need help in.." options
    ├── Services/            3 service cards with mockups
    ├── BookCta/             "Let's Book" call-to-action
    └── Footer/              tagline + newsletter
```

## How react-bits is used

react-bits ships as copy-paste components rather than an npm package, so the six
components we use are **vendored verbatim** under `src/reactbits/` (JS + CSS
variant). They only depend on `motion` and `ogl`, both installed via npm.

| Component | Where |
| --- | --- |
| `Particles` | Hero background starfield |
| `ShinyText` | Navbar "Get Started" |
| `BlurText` | "Experience the World of Forex…" heading reveal |
| `CountUp` | Hero "+300 Real clients" stat |
| `SpotlightCard` | Elite Trading + Services cards |
| `GradientText` | available for gradient accents |

To pull a fresh/updated version of any component, copy it from
`reactbits.dev` (or the [GitHub repo](https://github.com/DavidHDev/react-bits))
into the matching folder. react-bits is licensed **MIT + Commons Clause** —
free for use in this commercial product.

## A note on images

Hero/CTA imagery references the **Figma CDN export URLs** (see `src/assets.js`).
Those URLs expire ~7 days after they're generated. If images stop loading,
re-export them from Figma — or vendor them into `public/` — and update the paths
in `src/assets.js` (the single source of truth for asset locations).

## Fonts

Loaded from Google Fonts: **Plus Jakarta Sans** and **Ubuntu**. The original
design also used Gilroy / SF Pro / Tahoma (not freely distributable); the closest
free faces are used as the display/brand fonts. Drop in licensed font files to
match the design pixel-for-pixel.
