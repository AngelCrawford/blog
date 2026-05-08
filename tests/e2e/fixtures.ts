// Shared fixture-directory constants for the growth-stage E2E tests.
// Keep in sync with the inline copy in `tests/e2e/build-and-serve.mjs`
// (.mjs/.ts boundary; the duplication is 5 constant strings — drift risk minimal).

export const FIXTURE_DIRS = {
    seedling: "_test_growth_stage_seedling",
    budding: "_test_growth_stage_budding",
    evergreen: "_test_growth_stage_evergreen",
    withered: "_test_growth_stage_withered",
    default: "_test_growth_stage_default",
} as const;
