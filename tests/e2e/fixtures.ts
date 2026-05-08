// Shared fixture-directory constants for the growth-stage E2E tests.
// Keep in sync with the inline copy in `tests/e2e/build-and-serve.mjs`
// (.mjs/.ts boundary; the duplication is short — drift risk minimal).

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
