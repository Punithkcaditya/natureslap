# Ami Homestay — React

A responsive recreation of the supplied Ami Homestay reference, built with React, Vite, and Lucide icons. The original HTML and screenshot are preserved.

## Run locally

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. To produce a static production build, run `npm run build`. Output is written to `dist/`. Use `npm run preview` to inspect that build.

## Project files

- `src/main.jsx`: page sections, content, sliders, and dialogs.
- `src/styles.css`: responsive layout, colors, typography, and motion preferences.
- `public/assets/`: original images, logo, pattern, and self-hosted fonts recovered from the supplied HTML.
- `public/media/`: optimized copies of the client's photos and video poster images. Original uploads are preserved in `public/`.
- `src/client-media.json`: client photo and video paths used by the homepage galleries.
- `scripts/fetch-assets.py`: optional helper for re-downloading reference assets. Requires Python and curl; not needed to run or build the site.

## Before launch

This is a frontend preview. Booking and newsletter forms do not send data, charge money, reserve rooms, or persist subscriptions. Connect your booking and email services when ready.

Reference branding, room prices, testimonials, statistics, addresses, and phone numbers are demo content. Replace and verify these for your property, supply your contact email and social profile links, and replace the sample journal copy. Reference assets remain subject to their owners' licensing; confirm your permission before publishing.

## Client media

The homepage includes 20 supplied photos (including brochures) and 13 original MP4 clips. Property photos replace the hero, welcome, and activities imagery. The photo gallery expands to show all images and includes a full-size viewer. The video section provides a selectable playlist and native playback, sound, and fullscreen controls. Clips do not autoplay or preload their full content.

Phone screenshots have been cropped to their photograph area in the optimized copies. The originals are unchanged. These are standard videos; they have not been converted to 360-degree footage. Room cards and remaining reference branding still use demo content.

## GitHub Pages deployment

The workflow in `.github/workflows/deploy.yml` builds and publishes the site whenever `main` is pushed. In the GitHub repository, enable **Settings → Pages → Source → GitHub Actions** before the first deployment. The deployment job publishes the live URL in its environment output.

The build supports repository subpaths and copies only `public/assets/` and `public/media/`. Original ZIP archives, phone screenshots, local utilities, and reference files remain local and are excluded from Git and the deployed site.
