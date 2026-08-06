# Testing

The *how* and *what runs where*. Per-story acceptance-criteria catalogues used to live here; the tests themselves are the source of truth for that, so this page keeps only the architecture and the decisions that would otherwise get re-litigated.

## What belongs in the suite

One rule decides it:

> **Would a redesign legitimately break this assertion?**

If yes — it asserts DOM structure, CSS class names, or page prose — it does not belong in the build suite. Either move it to e2e, or drop it. If no — build gates, RSS, sitemap, JSON-LD, CSP, output escaping, bundling — it stays, because it protects behaviour that survives any visual change.

This matters more than usual here: the site is mid-migration to a design-system theme, and a suite that fails every time a class name moves stops being a safety net and becomes a reason not to touch the design.

## Layers

| Layer | Tool | Covers | Runs |
|---|---|---|---|
| Build smoke | `node --test` + Hugo | Build pass/fail, rendered HTML/XML assertions | `npm run test:build` |
| E2E smoke | Playwright (chromium) | Browser-observable behaviour, Hugo-upgrade canary | `npm run test:e2e` |
| Pre-commit | git hook + ajv | JSON-Schema validation of staged frontmatter | every `git commit` |
| Build gate | Hugo `errorf` | `growth_stage` enum, `withered_date` required-when-withered | every Hugo build |

```bash
npm run test:build
npm run test:e2e         # first time: npx playwright install chromium
npm test                 # both, sequentially
```

Tests are a hard gate at deploy time — a failure means no deploy and the previously deployed site stays live.

## What goes where

- **`tests/build/`** — Node suites that spawn Hugo via `spawnSync`. Use for build-time behaviour (errorf trips, exit codes, rendered output) where a `.md` fixture in `tests/build/fixtures/` copied into a temp `content/_test_*/` bundle is enough.
- **`tests/e2e/`** — Playwright specs. Use when the behaviour is browser-observable (DOM, navigation, headers, JS).
- **`scripts/validate-frontmatter.js`** — pre-commit. Edit `schemas/frontmatter/article.schema.json`; the script picks up changes automatically.

## E2E architecture: static export, not `hugo server`

`webServer.command` runs `tests/e2e/build-and-serve.mjs`, which writes fixture page bundles, runs `hugo --environment production --destination public-test`, and serves `public-test/` on port **1314**. `global-teardown.ts` removes the fixtures afterwards; `.gitignore` excludes the `_test_*` prefixes as a backstop.

Why this beats `hugo server`:

- **PurgeCSS is exercised** — `hugo server` runs in dev mode and skips PurgeCSS. The static export runs production, so over-purge regressions surface before deploy. This is the reason that still carries weight.
- **No watcher in the path** — fixtures are written before hugo runs, so nothing depends on file-change detection.

Three separate build destinations keep the suites from clobbering each other: `public-test/` (shared production output the assertion tests read), `public-test-fixture/` (temporary-content builds), `public-test-dev/` (development-environment builds). Port 1314 rather than 1313 so tests never collide with a developer's own `hugo server`.

> **Historical note:** the split away from `public/` was originally mandatory — on Windows/NTFS, Hugo's static-copy step dies with `unlinkat ...\public\articles: The directory is not empty` when another process holds a file open, and its fsnotify watcher missed newly-created article subdirectories. The repo now lives on ext4 under WSL2 and CI runs on Linux, so neither applies. The isolation is kept because it is genuinely useful, not because it is forced.

## Deliberately not done

- **No visual-regression snapshots (`toHaveScreenshot()`).** Cross-machine font rendering (Windows ClearType vs headless chromium on Ubuntu) causes sub-pixel drift and flaky baselines. Structural assertions (`data-stage`, `<svg use[xlink:href]>`, `title` regex, viewport-conditional visibility) cover the same ground. Revisit only if a real regression slips past.
- **No `@axe-core/playwright`.** Current a11y assertions are single-pattern attribute checks (`role`, `aria-live`, `aria-hidden`) — not worth a devDependency until a broader audit is actually on the table.
- **No `xmllint` in CI.** Hugo's templates produce well-formed XML by construction whenever the build exits 0; `assertWellFormedXml` in the build suite is a regression guard, not a parser.

## Gotchas worth remembering

- **Use `.RelPermalink`, not `.Permalink`, for script/style `src`.** `Permalink` emits the production absolute URL, which the page's `script-src 'self'` CSP blocks whenever the page is served from another origin (e.g. the e2e server on `localhost:1314`). A blocked jQuery bundle silently cascades: `main.js` throws `$ is not defined` and every later IIFE never attaches.
- **Withered filtering goes through the partials.** `withered-filter.html` and `withered-count.html` are the only place the predicate lives. Anything that lists pages and must hide withered content uses them rather than re-inlining the condition — consumers today include `home.html`, `list.html`, `page/archive.html`, `widgets/archive.html`, `_base/footer.html`, `404.html`, `single.html`, `card.html`.
