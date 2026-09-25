# Portfolio — mobile app

An [Expo](https://expo.dev) (SDK 57) version of the portfolio website, built with
Expo Router. It uses the site's fonts, colour palette, images and copy.

## Screens

| Tab | What's there |
| --- | --- |
| **Home** | Hero, about/bio, a swipeable featured-projects carousel, services, the gradient "Get in touch" CTA and the footer links |
| **Work** | All featured projects in a scrolling list, plus a link to GitHub |
| **Contact** | The "Start a Project" form with validation. Sending opens the phone's mail app with the message filled in, because there's no backend |

## Run it

```bash
cd mobile
npm install
npx expo start      # scan the QR code with Expo Go, or press i / a / w
```

Other scripts:

```bash
npm run typecheck   # tsc --noEmit
npx expo export --platform web   # static web build in dist/
```

## Where things live

```
src/app/              routes (Expo Router)
  _layout.tsx         loads fonts, root stack
  (tabs)/             Home / Work / Contact tabs
src/components/       typography, contact CTA, footer
src/constants/
  theme.ts            colours + fonts (mirrors ../css/globals.css)
  portfolio.ts        all copy, links and projects (edit this to update content)
assets/fonts, assets/images   copied from ../public
```

To add a project, drop its image in `assets/images/work/` and add an entry to
`projects` in `src/constants/portfolio.ts`.

## Shipping to the stores

Use EAS: `npx eas-cli@latest build --platform all` and then `eas submit`.
The bundle ID / package name is set in `app.json`
(`np.info.prashantkoirala.portfolio`). Change it before your first build if
you want a different one. The app icon and splash image are still the Expo
defaults in `assets/`.
