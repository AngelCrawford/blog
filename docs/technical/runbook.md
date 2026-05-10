# Operations Runbook

The operator's reference for `blog`: setup, tests, maintenance mode, deploy. README has the project overview; this file has the *how-to-do-X* details.

For deeper test strategy (layers, ASRs, Playwright architecture) see [`testing.md`](testing.md). For editor-side frontmatter validation see [`editor-setup.md`](editor-setup.md).

## Setup

```powershell
# Clone + install dependencies (Bulma + PurgeCSS + dev tooling).
npm install

# First-time only: install the Playwright chromium browser.
npx playwright install chromium

# Verify everything works end-to-end.
npm test
```

The npm `prepare` script wires up the pre-commit hook (`git config core.hooksPath .githooks`) automatically on first install.

### Hugo

Hugo Extended **0.161.1** is the pinned version. CI installs it via `peaceiris/actions-hugo`. Locally, install whichever way you prefer (`scoop install hugo-extended`, `choco install hugo-extended`, or download from [gohugo.io/installation](https://gohugo.io/installation/)) and confirm:

```powershell
hugo version  # → hugo v0.161.1+extended ...
```

The `transpiler: "dartsass"` setting in `layouts/_partials/_base/head.html` requires Dart Sass on PATH for production builds. CI installs it via `sudo snap install dart-sass`; locally, Hugo Extended's embedded Dart Sass is sufficient.

## Tests

```powershell
npm run test:build   # Hugo build smoke (node --test, ~100s, includes Hugo build per test)
npm run test:e2e     # Playwright homepage smoke (chromium)
npm test             # Both, sequentially
```

CI runs the same commands on every release-triggering workflow (tag push, cron, workflow_dispatch). Test failure blocks deploy — the previously deployed site stays live and untouched.

## Local development server

```powershell
# Dev server with live reload (uses config/development/).
hugo server

# Production-flavour build with PurgeCSS + minification.
hugo server --environment production

# One-shot static build (output to public/).
hugo --environment production --minify
```

## Maintenance mode

Activates a self-contained "Wartung läuft" page on every URL — no Umami, no scripts, no SEO partial, `<meta name="robots" content="noindex">`. RSS, sitemap, robots.txt, and taxonomy listings are not generated at all (Hugo `disableKinds`).

Static-site limitation: response stays HTTP 200 OK (GitHub Pages cannot 503).

### Toggle on

```powershell
# Create the sentinel file at the repo root, force-add it (it's gitignored
# implicitly via the workflow contract — it must NOT be committed for a
# normal repo state — but for the maintenance push, force-add it).
"" | Out-File -FilePath .maintenance -Encoding ASCII -NoNewline
git add -f .maintenance
git commit -m "Maintenance mode ON"
git push --follow-tags
```

The `daily-rebuild` workflow detects `.maintenance`, builds with `--environment maintenance`, deploys. Within ~3 minutes the live site shows the maintenance page.

To verify locally before pushing, use the dev server (the static build emits absolute CSS paths like `/style.css` that don't resolve under `file://` — opening `public-test/index.html` directly shows an unstyled page):

```powershell
hugo server --environment maintenance
# Open http://localhost:1313/ in a browser.
```

If you really want a static build to inspect on disk:

```powershell
hugo --environment maintenance --destination public-test
# Then serve it over HTTP, e.g.: python -m http.server 8000 --directory public-test
# Open http://localhost:8000/ in a browser (NOT the file:// URL — it strips the CSS).
```

### Toggle off

```powershell
git rm .maintenance
git commit -m "Maintenance mode OFF"
git push --follow-tags
```

Workflow detects the absence, builds with `--environment production`, deploys the normal site.

### Customising the message

Edit `config/_default/params.yaml`:

```yaml
maintenance:
  title: "Wartung läuft"
  message: "Bin gleich wieder da."
  expected_back: "Voraussichtlich zurück am 9. Mai um 18 Uhr"  # optional
```

Defaults inherit into the maintenance environment, so editing here affects both the `--environment maintenance` build (live) and any local preview. `expected_back` only renders when set to a non-empty string.

### How it works

| File | Role |
|---|---|
| `config/_default/params.yaml` | `maintenance_mode: false` (production fallback) + maintenance copy |
| `config/maintenance/config.yaml` | `disableKinds` for RSS/sitemap/robotsTXT/taxonomy/term; mirrors prod `title` + `baseURL` |
| `config/maintenance/params.yaml` | `maintenance_mode: true` (overrides default) |
| `layouts/baseof.html` | Branches on `Site.Params.maintenance_mode` → renders `_base/maintenance` partial |
| `layouts/_partials/_base/maintenance.html` | Self-contained doc: site title, dark theme, full main.scss, no Umami/SEO/JS |
| `.github/workflows/daily-rebuild.yml` | Detects `.maintenance` sentinel; switches `--environment` between `production` and `maintenance` |

Tests in `tests/build/maintenance-mode.test.mjs` cover both modes — homepage routing, Umami suppression, `disableKinds` outputs, and verify normal builds don't leak maintenance markup.

## Deploy

See README's "Deployment" section for the full release flow (tag push, cron, workflow_dispatch). One-line summary:

- **Tag = release.** `git tag -a v0.X.0 -m "..."` then `git push --follow-tags` ships the tagged commit through the daily-rebuild workflow.
- **Direct push to main does NOT deploy.** WIP commits stay local until you tag.
- **Daily cron rebuilds the latest tag**, not main HEAD — refreshes engagement data without re-shipping unreleased code.
