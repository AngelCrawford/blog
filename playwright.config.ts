import { defineConfig, devices } from "@playwright/test";

// Minimal Playwright bootstrap (Story 1.1).
// Foundation for downstream visual regression / journey / a11y tests
// per docs/2-solutioning/test-design-system.md. Keep MINIMAL here:
// chromium-only, ONE smoke test. Story 1.2+ will expand.
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
// Why not `hugo server`: on Windows, Hugo's fsnotify watcher missed newly-created
// article subdirs even when fixtures existed before server start, leaving most
// fixture URLs as 404. Static export sidesteps the watch path entirely.
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
