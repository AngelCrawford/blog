import { defineConfig, devices } from "@playwright/test";

// Minimal Playwright bootstrap (Story 1.1).
// Foundation for downstream visual regression / journey / a11y tests
// per docs/2-solutioning/test-design-system.md. Keep MINIMAL here:
// chromium-only, ONE smoke test. Story 1.2+ will expand.
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? "list" : "list",
  use: {
    baseURL: "http://localhost:1313",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "hugo server --port 1313 --bind 127.0.0.1 --buildDrafts=false --logLevel error",
    url: "http://localhost:1313",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    stdout: "ignore",
    stderr: "pipe",
  },
});
