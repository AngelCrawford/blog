![Hugo](https://img.shields.io/badge/Hugo-0.161.1-darkgreen) ![Platform](https://img.shields.io/badge/Platform-Windows-blue) ![Editor](https://img.shields.io/badge/Editor-Zed-green) ![Image Edit](https://img.shields.io/badge/Image_Edit-Gimp-purple) ![SVG Edit](https://img.shields.io/badge/SVG_Edit-Inkscape-darkorchid)

# Article Time

A private Hugo blog in the **IndieWeb**, single author, with *some* Digital Garden — content carries a growth stage and may wither, but this is a personal blog, not a platform or magazine.

- 🌐 Live: [article-time.de](https://article-time.de)
- 🌱 Languages: German / English

📖 **Scope and working rules:** [`CLAUDE.md`](CLAUDE.md). This README covers operations — setup, dev, tests, deploy, maintenance.

## Setup

Hugo Extended **0.161.1** is the pinned version — install it however you prefer (`scoop install hugo-extended`, `choco install hugo-extended`, or [gohugo.io/installation](https://gohugo.io/installation/)) and confirm with `hugo version`. Hugo Extended's embedded Dart Sass covers the `transpiler: "dartsass"` setting locally; CI installs `dart-sass` separately.

```powershell
# Dependencies (PurgeCSS + dev tooling; Bulma is vendored in the theme)
npm install

# First time only
npx playwright install chromium

# Verify end-to-end
npm test
```

The npm `prepare` script wires the pre-commit hook (`git config core.hooksPath .githooks`) automatically on install.

## Local Development

```powershell
# Dev server with live reload (uses config/development/)
hugo server

# Production-flavour build with PurgeCSS + minification
hugo server --environment production

# One-shot production build (output to public/)
hugo --environment production --minify
```

### Tests

```powershell
npm run test:build   # Hugo build smoke (node --test)
npm run test:e2e     # Playwright (chromium)
npm test             # Both, sequentially
```

CI runs the same commands on every release-triggering workflow. A failure blocks the deploy and the previously deployed site stays live and untouched. Architecture and the deliberate non-decisions are in [`docs/testing.md`](docs/testing.md).

### Frontmatter validation

Three layers, all driven by `schemas/frontmatter/article.schema.json`: editor (Zed YAML LSP via `.zed/settings.json`), pre-commit (`.githooks/pre-commit` → `scripts/validate-frontmatter.js`), and build (`layouts/_partials/_base/validate-growth-stage.html`). Details and the withered metadata fields: [`docs/authoring.md`](docs/authoring.md).

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

The `daily-rebuild` workflow detects the `.maintenance` sentinel and builds with `--environment maintenance`; the live site follows within ~3 minutes.

**Preview locally with the dev server, not a static build** — a static build emits absolute CSS paths like `/style.css` that don't resolve under `file://`, so opening `public-test/index.html` directly shows an unstyled page:

```powershell
hugo server --environment maintenance    # then open http://localhost:1313/
```

Note that a maintenance build rewrites `hugo_stats.json` with just the maintenance page's elements. That file is no longer tracked (PurgeCSS reads the theme templates directly since the move to `themes/`), so this is harmless — but don't re-add it to git.

Copy lives in `config/_default/params.yaml` under `maintenance:` (`title`, `message`, optional `expected_back`) and inherits into the maintenance environment.

How it fits together:

| File | Role |
|---|---|
| `config/_default/params.yaml` | `maintenance_mode: false` fallback + the copy |
| `config/maintenance/config.yaml` | `disableKinds` for RSS/sitemap/robotsTXT/taxonomy/term; mirrors prod `title` + `baseURL` |
| `config/maintenance/params.yaml` | `maintenance_mode: true` |
| `layouts/baseof.html` | Branches on `Site.Params.maintenance_mode` |
| `layouts/_partials/_base/maintenance.html` | Self-contained page: no Umami, no SEO partial, no JS |
| `.github/workflows/daily-rebuild.yml` | Detects the sentinel, switches `--environment` |

`tests/build/maintenance-mode.test.mjs` covers both modes and verifies normal builds don't leak maintenance markup.

## Asset updates — Remixicon cache-bust

Browsers need a trigger when the icon sprite or fonts change.

- **Sprite (`remixicon.symbol.svg`)** — replace the file in `static/fonts/remixicon/`, then bump `remixicon_version` (Unix-timestamp ms) in `config/_default/params.yaml`.
- **Font files** — replace them, then whitespace-bump `_icons.scss` to force a new CSS fingerprint so browsers re-fetch. Bumping `remixicon_version` too does no harm.

## Documentation

Scope and working rules live in [`CLAUDE.md`](CLAUDE.md) — the single source of truth for *what this project is* and *what it is not*.

- [`docs/testing.md`](docs/testing.md) — test architecture and deliberate non-decisions
- [`docs/authoring.md`](docs/authoring.md) — frontmatter validation, withered metadata
- [`docs/decisions.md`](docs/decisions.md) — accepted decisions (single author, domain migration)
- [`docs/ideas/`](docs/ideas/) — design references and mockups

Backlog and feature work are tracked in [GitHub Issues](https://github.com/AngelCrawford/blog/issues), not in files.

## Stack

### Includes
- [Bulma v1.0.4](https://bulma.io) with [PurgeCSS](https://purgecss.com)
- [Remix Icon](https://remixicon.com)
- [Google Fonts Montserrat & Montserrat Alternates](https://fonts.google.com/specimen/Montserrat) (self-hosted)
- [jQuery](https://jquery.com) (vendored)

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
