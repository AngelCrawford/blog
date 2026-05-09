// Shared fixture-directory constants for the growth-stage E2E tests.
// Keep in sync with the inline copy in `tests/e2e/build-and-serve.mjs`
// (.mjs/.ts boundary; the duplication is short — drift risk minimal).

import { test as base } from "@playwright/test";

export const FIXTURE_DIRS = {
    seedling: "_test_growth_stage_seedling",
    budding: "_test_growth_stage_budding",
    evergreen: "_test_growth_stage_evergreen",
    withered: "_test_growth_stage_withered",
    default: "_test_growth_stage_default",
} as const;

// Withered-banner-specific fixtures (Story 1.4). Created alongside the
// growth-stage fixtures by `build-and-serve.mjs`; cleaned up by
// `global-teardown.ts`. The existing `withered` fixture above doubles as the
// "minimal banner" case (date only, no reason, no replacement).
export const WITHERED_BANNER_FIXTURES = {
    full: "_test_withered_banner_full",
    replacementTarget: "_test_withered_banner_replacement_target",
} as const;

// Extended Playwright test fixture: every test that imports `test` from this
// file automatically blocks third-party analytics requests at the browser
// network level (Umami split-infra: cloud.umami.is for the script, plus
// api-gateway.umami.dev where the script POSTs pageviews).
//
// Why we need this:
//   - E2E tests build with `--environment production` so PurgeCSS runs (catches
//     over-purge regressions). That same environment emits the Umami <script>
//     tag into the rendered HTML.
//   - When Playwright loads a page in chromium, the browser executes the
//     script and fires real pageview POSTs to api-gateway.umami.dev — which
//     polluted the production analytics with fixture URLs (e.g.
//     /articles/_test_withered_banner_full/) on 2026-05-09.
//
// Why block in the browser, not in the Hugo template:
//   - Build-smoke tests assert the Umami <script> tag IS present in production
//     HTML (a correctness check we want to keep). Hiding it under a "test"
//     environment would invalidate that assertion.
//   - Browser-level abort drops the request before it leaves the test runner;
//     production behaviour is unchanged.
//
// Spec files should import `{ test, expect }` from "./fixtures" rather than
// "@playwright/test" to inherit this behaviour automatically.
export const test = base.extend({
    page: async ({ page }, use) => {
        await page.route(
            /(cloud\.umami\.is|api-gateway\.umami\.dev)/,
            (route) => route.abort()
        );
        await use(page);
    },
});

export { expect } from "@playwright/test";
