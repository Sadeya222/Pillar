# Digital Pillars — Cinematic 3D Agency Website

A dark-mode, cinematic agency site built with React, Vite, Tailwind CSS, Three.js
(@react-three/fiber + drei), GSAP ScrollTrigger, and Lenis smooth scrolling.

## Features

- Interactive WebGL hero scene (mouse-reactive monolith, particle field, cinematic lighting)
- Floating glassmorphic data widgets with animated counters and SVG sparklines
- Four deep-dive service destinations with 3D cursor-tilt cards
- AI Assistant FAQ slide-over with pre-loaded question chips
- Glassmorphic testimonials grid
- GSAP scroll choreography + Lenis smooth scroll
- Mobile guardrails: simplified geometry and no tilt on coarse pointers
- Full `prefers-reduced-motion` static fallback

## Local Development

```bash
npm install
npm run dev       # start dev server
npm run build     # production build → dist/
npm run preview   # preview the production build locally
```

## Deploying to Vercel

The project is pre-configured via `vercel.json` (framework: Vite, output: `dist/`,
SPA rewrites, long-term asset caching, and security headers). No environment
variables are required.

### Option 1 — Git integration (recommended)

1. Push this repository to GitHub, GitLab, or Bitbucket.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
3. Vercel auto-detects Vite — accept the defaults and click **Deploy**.

Every push to the main branch creates a production deployment; pull requests get
preview deployments automatically.

### Option 2 — Vercel CLI

```bash
npm i -g vercel
vercel          # first run: link the project, creates a preview deployment
vercel --prod   # production deployment
```

## Build Settings (auto-detected)

| Setting          | Value           |
| ---------------- | --------------- |
| Framework preset | Vite            |
| Build command    | `npm run build` |
| Output directory | `dist`          |
| Install command  | `npm install`   |
| Node.js version  | 20.x (default)  |

## Project Structure

```
src/
├── App.tsx                      # Page composition, GSAP/Lenis orchestration
├── index.css                    # Design system + all component styles
├── components/
│   ├── HeroScene.tsx            # R3F WebGL scene + reduced-motion fallback
│   ├── AIAssistant.tsx          # FAQ slide-over dialog
│   └── MagneticButton.tsx       # Magnetic hover CTA
└── hooks/
    └── useMediaPreferences.ts   # pointer-type + reduced-motion detection
```
