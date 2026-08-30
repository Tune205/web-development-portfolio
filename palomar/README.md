# Palomar Labs — landing page

Standalone pixel-accurate recreation of the Palomar Labs marketing landing page:
fixed navbar + full-viewport video hero only.

## Stack

- React + TypeScript + Vite
- Tailwind CSS
- `lucide-react` icons (`ChevronDown`, `ArrowRight`, `Triangle`)

## Run

```bash
npm install
npm run dev      # dev server
npm run build    # typecheck + production build to dist/
npm run preview  # serve the production build
```

## Structure

- `index.html` — page title and the Helvetica Neue Light / Google Fonts links
- `src/index.css` — global reset, body font, `fade-up` / `fade-down` keyframes and stagger delays
- `src/App.tsx` — `Navbar`, `Hero`, `TrustedBy`
- `tailwind.config.js` — `brand` colors and the six font families
