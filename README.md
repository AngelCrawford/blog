![Hugo](https://img.shields.io/badge/Hugo-0.161.1-darkgreen) ![Platform](https://img.shields.io/badge/Platform-Windows-blue) ![Editor](https://img.shields.io/badge/Editor-Zed-green) ![Image Edit](https://img.shields.io/badge/Image_Edit-Gimp-purple) ![SVG Edit](https://img.shields.io/badge/SVG_Edit-Inkscape-darkorchid)

# Article Time

A personal Hugo blog being transformed into a **Digital Garden** — content that grows and evolves through reader engagement, where quality naturally rises and updates are rewarded with visibility.

- 🌐 Live: [https://angelcrawford.github.io/blog/](https://angelcrawford.github.io/blog/) (custom domain `article-time.de` planned)
- 🌱 Languages: German / English

## Local Development

```powershell
# Install dependencies (Bulma + PurgeCSS + dev tooling via npm)
npm install

# Dev server with live reload
hugo server

# Production build (with PurgeCSS, minification)
hugo server --environment production

# One-shot production build (output to public/)
hugo --environment production --minify
```

### Tests

```powershell
npm run test:build   # Hugo build smoke (node --test, ~9s)
npm run test:e2e     # Playwright homepage smoke (chromium)
npm test             # Both, sequentially
```

First-time Playwright setup: `npx playwright install chromium`. CI runs the equivalent step automatically.

### Frontmatter validation

Three layers, all driven by the same JSON Schema (`schemas/frontmatter/article.schema.json`):

1. **Editor** — Zed YAML LSP via `.zed/settings.json` (see [`docs/technical/editor-setup.md`](docs/technical/editor-setup.md)).
2. **Pre-commit** — git hook + ajv (`.githooks/pre-commit` → `scripts/validate-frontmatter.js`). The npm `prepare` script wires it via `git config core.hooksPath .githooks` on first install.
3. **Build** — Hugo `errorf` in `layouts/_partials/_base/validate-growth-stage.html`.

Test strategy and what to add per upcoming story is documented in [`docs/technical/testing.md`](docs/technical/testing.md).

## Deployment

Live deploys run automatically via the `daily-rebuild` GitHub Actions workflow on cron `0 2 * * *` UTC. To trigger a deploy now (instead of waiting for the next scheduled run):

```powershell
# Trigger the deploy
gh workflow run daily-rebuild.yml --ref main

# Optional: follow it to completion
gh run watch
```

The deployed URL is whatever `baseURL` in [`config/production/config.yaml`](config/production/config.yaml) points at. Update that single file when switching between the GitHub Pages default (`https://angelcrawford.github.io/blog/`) and the planned custom domain (`https://article-time.de/`); the third-party-asset-monitor workflow (Story 2.6) reads the same value, so it retargets automatically.

## Architecture & Workflow

This project uses the [BMad Method](https://github.com/bmadcode/BMAD-METHOD) for AI-assisted development. Documentation lives in `docs/`:

- `docs/0-discovery/` — project overview, brainstorming, research
- `docs/1-planning/` — PRD, UX spec, epics
- `docs/2-solutioning/` — architecture, test design
- `docs/3-implementation/` — phase task breakdowns
- `docs/sprint-artifacts/` — sprint status, drafted stories

Key documents:
- 📐 [Integration Architecture](docs/2-solutioning/digital-garden-integration-architecture.md) — technical design
- 📋 [Epics & Stories](docs/1-planning/epics.md) — 9 epics, 48 stories
- 📝 [Sprint Status](docs/sprint-artifacts/sprint-status.yaml) — current implementation tracking

## Stack

### Includes
- [Bulma v1.0.4](https://bulma.io) with [PurgeCSS](https://purgecss.com)
- [Remix Icon](https://remixicon.com)
- [Google Fonts Montserrat & Montserrat Alternates](https://fonts.google.com/specimen/Montserrat) (self-hosted)
- [jQuery](https://jquery.com) (vendored — migration to vanilla JS planned, see `docs/todo.md`)

### Build & Deploy
- [Hugo Extended](https://gohugo.io) v0.161.1 with embedded Dart Sass
- GitHub Actions daily-rebuild workflow (cron `0 2 * * *` UTC)
- GitHub Pages deployment via `actions/deploy-pages@v4`
- `data-updates` branch for engagement-data audit trail (Phase 1A onwards)

# Thanks to

## Hugo Tutorials
* [Related Pages](https://www.pakstech.com/blog/hugo-related-pages/)
* [Series Links](http://www.joesacher.com/blog/2017/08/27/converting-series-to-taxonomy/)
* [Dynamic Search in a Static Hugo Website](https://blog.jeremylikness.com/blog/dynamic-search-in-a-static-hugo-website/)

## CSS, JS, jQuery, SVG
* [Firework.js](https://codepen.io/zystvan/details/LEbNRp)
* [Sky Background](https://codepen.io/ellimccale/pen/wxzJMx)
* [Hot Air Balloon](https://codepen.io/nicooprat/pen/ALANqj)
* [Santa Hat](https://codepen.io/bennettfeely/pen/mEjio)
* [Ghosty](https://codepen.io/uchardon/pen/eGjJap?editors=0100)
* [Bird](https://codepen.io/matchboxhero/pen/RLebOY)
* [SunriseSunsetJS](https://github.com/mourner/suncalc)

### Images
* [Hamburg skyline](https://www.shutterstock.com/image-vector/hamburg-skyline-471775031) | by [pixelliebe](https://www.shutterstock.com/g/pixelliebe) | Gekauft auf [shutterstock.com](https://shutterstock.com)
* [Kiel skyline](https://www.shutterstock.com/image-vector/kiel-skyline-german-city-581455954) | by [pixelliebe](https://www.shutterstock.com/g/pixelliebe) | Gekauft auf [shutterstock.com](https://shutterstock.com)
* [Favicon Generator](https://realfavicongenerator.net)
* [Unsplash](https://unsplash.com)
