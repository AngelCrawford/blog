![Hugo](https://img.shields.io/badge/Hugo-0.161.1-darkgreen) ![Platform](https://img.shields.io/badge/Platform-Windows-blue) ![Editor](https://img.shields.io/badge/Editor-Zed-green) ![Image Edit](https://img.shields.io/badge/Image_Edit-Gimp-purple) ![SVG Edit](https://img.shields.io/badge/SVG_Edit-Inkscape-darkorchid)

# Article Time

A personal Hugo blog being transformed into a **Digital Garden** — content that grows and evolves through reader engagement, where quality naturally rises and updates are rewarded with visibility.

- 🌐 Live: [article-time.de](https://article-time.de)
- 🌱 Languages: German / English

📖 **Operations runbook:** [`docs/technical/runbook.md`](docs/technical/runbook.md) — setup, tests, maintenance mode toggle, deploy. Read that for *how to do X*; this README is the project overview.

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

The `daily-rebuild` GitHub Actions workflow handles all deploys. There are three triggers:

| Trigger | When | What it deploys |
|---|---|---|
| **Tag push** (`v*`) | Manual `git push --follow-tags` after `git tag -a v0.X.0` | The tagged commit — this is the canonical "release" path |
| **Cron** (`0 2 * * *` UTC) | Daily, automatic | The **latest tag** (NOT main HEAD) with fresh engagement data |
| **`workflow_dispatch`** | Manual via `gh` or Actions UI | Whatever ref you pick (default `main`) — escape hatch for ad-hoc rebuilds |

**Code changes only reach production via a tagged release.** Direct pushes to `main` stay local — they don't trigger CI tests, they don't trigger a deploy. The next cron run rebuilds the latest tagged commit, not your WIP. The forcing function is: **tag = release**.

**Tests are a hard gate at deploy time.** Every release-triggering run (tag push, cron, workflow_dispatch) runs the full test suite (`npm test` = build-smoke + Playwright e2e) before the build/deploy steps. If tests fail, no deploy happens and the previously deployed site stays live and untouched.

**PRs run tests too** via `tests.yml` (`pull_request:` trigger). Direct push-to-main does NOT — that would just duplicate the deploy-time gate.

### Daily flow: WIP commits

For mid-epic work, ad-hoc fixes, doc updates — anything that should NOT go live yet:

```powershell
git add ...
git commit -m "..."
git push          # pushes commits to main; no CI, no deploy, just code on the repo
```

### Release flow: ship a version live

When an epic's stories are complete (or per-story for Epic 2's chained stories) and you're ready to ship:

```powershell
# 1. Tag the release commit locally (annotated tag, with a message)
git tag -a v0.X.0 -m "Epic X: <feature name>"

# 2. Push commits + tag in one go
git push --follow-tags
# → daily-rebuild triggers on the tag; tests run; deploy follows on green
# → branch push alone does nothing (test workflow is PR-only, daily-rebuild is tag-only)

# 3. Optional: GitHub Release with auto-generated notes (good for changelog)
gh release create v0.X.0 --generate-notes
```

`--follow-tags` sends the branch commits AND any annotated tags reachable from them in a single push. Without it you'd need `git push && git push origin v0.X.0` separately.

### Ad-hoc redeploy (without bumping version)

When you want to re-trigger a deploy without bumping a version (e.g., re-run after a CI flake, or refresh engagement data on demand):

```powershell
gh workflow run daily-rebuild.yml --ref main   # default ref is main
gh run watch                                   # optional: follow to completion
```

### Maintenance mode

Toggle a "Wartung läuft" page on every URL (RSS/sitemap/robots.txt are not regenerated; static-site so response stays HTTP 200 OK):

```powershell
# Toggle ON
"" | Out-File .maintenance -Encoding ASCII -NoNewline
git add -f .maintenance && git commit -m "Maintenance ON" && git push --follow-tags

# Toggle OFF
git rm .maintenance && git commit -m "Maintenance OFF" && git push --follow-tags
```

Full mechanism, customisable copy, and verification steps in [`docs/technical/runbook.md`](docs/technical/runbook.md#maintenance-mode).

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
