import { defineConfig, devices } from "@playwright/test";

// Minimal Playwright bootstrap. Chromium-only, kept deliberately small —
// see docs/testing.md for what runs where.
//
// Port choice (1314, NOT 1313): the dev's own `hugo server` typically runs on
// 1313 — we don't want `npm test` to either steal that port or collide with it.
// Tests run against an isolated static server on 1314.
//
// `webServer.command` runs `tests/e2e/build-and-serve.mjs` which:
//   1. Writes per-stage fixtures into `content/articles/_test_growth_stage_*`
//   2. Runs `hugo --environment production` (PurgeCSS active → over-purge
//      regressions are caught)
//   3. Serves `public/` via a tiny Node static server (no deps)
// `globalTeardown` removes the fixtures.
//
// Why static export and not `hugo server`: the export runs with
// `--environment production`, so PurgeCSS is exercised and over-purge regressions
// surface before deploy. `hugo server` runs in dev mode and skips it.
export default defineConfig({
  testDir: "./tests/e2e",
  globalTeardown: require.resolve("./tests/e2e/global-teardown.ts"),
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? "list" : "list",
  use: {
    baseURL: "http://localhost:1314",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "node tests/e2e/build-and-serve.mjs",
    url: "http://localhost:1314",
    env: { PORT: "1314" },
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
    stdout: "pipe",
    stderr: "pipe",
  },
});
