# Testing Strategy

This is the **operational** test guide for `blog`. The authoritative test plan — including ASR-001..ASR-008, the visual-regression strategy, and the rationale for every tool choice — lives in [`docs/2-solutioning/test-design-system.md`](../2-solutioning/test-design-system.md). Read that first if you need the *why*; this page covers the *how* and *what runs where*.

## Layers

| Layer | Tool | What it covers | When it runs |
|---|---|---|---|
| Build smoke | `node --test` + Hugo | Hugo build pass/fail under valid / invalid / missing-field frontmatter | `npm run test:build` (local + CI) |
| E2E smoke | Playwright (chromium) | Homepage HTTP 200, Hugo generator meta present (Hugo-update canary) | `npm run test:e2e` (local + CI) |
| Pre-commit | git hook + ajv | JSON-Schema validation of staged content frontmatter | every `git commit` |
| Build (Hugo) | Hugo `errorf` | `growth_stage` enum enforcement | every Hugo build |

`npm test` runs the build smoke suite then the e2e suite. Both are required for branch protection on `main`.

## Running locally

```bash
# Build smoke only (fast, ~9s).
npm run test:build

# E2E only — Playwright's webServer config will spin up `hugo server`
# automatically if it isn't already running.
npm run test:e2e

# Full pipeline.
npm test
```

If you've never run Playwright on this machine before, install the browser once:

```bash
npx playwright install chromium
```

CI runs the equivalent `npx playwright install --with-deps chromium` step.

## What goes where

`tests/build/` — Node-test-runner suites that spawn Hugo via `child_process.spawnSync`. Use this layer when:
- You need to assert build-time behavior (errorf trips, partial outputs, exit codes).
- Putting a `.md` fixture in `tests/build/fixtures/` and copying it into a temp `content/_test_*/` folder is enough to exercise the path.

`tests/e2e/` — Playwright specs. Use this layer when:
- The behavior is browser-observable (DOM, navigation, headers).
- You want to catch regressions from Hugo upgrades or template refactors.
- You need visual or accessibility checks (Story 1.2+ will add `toHaveScreenshot()` and `axe-core`).

`scripts/validate-frontmatter.js` — pre-commit script. Edit the JSON Schema at `schemas/frontmatter/article.schema.json`; the script auto-picks up changes.

## Adding tests in future stories

Per `test-design-system.md`:

| Story / Epic | Test additions |
|---|---|
| Story 1.2 (badge component) | Visual regression for badge rendering across all four growth stages (Playwright `toHaveScreenshot`) |
| Story 1.4 (warning banner) | E2E assertion that withered pages emit the warning banner |
| Epic 5 (filter UI) | Journey test: load list, click filter, verify filtered results; client-side JS coverage |
| Epic 9 (a11y audit) | `@axe-core/playwright` integrated into the e2e suite |

Don't pre-build the full matrix in earlier stories — add tests when the feature ships.

## Local GitHub Actions debugging (optional)

`act` (https://github.com/nektos/act) lets you run `.github/workflows/test.yml` locally with Docker:

```bash
act -j build-smoke
act -j e2e
```

Listed as optional in `test-design-system.md` because the CI feedback loop is short. Reach for `act` if a job behaves differently in CI than locally.
