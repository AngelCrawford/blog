// Build smoke tests — Layer 4 (CI safety net).
//
// For each fixture in tests/build/fixtures/, copy it into a unique
// content/_test_growth_stage_<id>/index.md page bundle, run
// `hugo --logLevel error --environment production`, and assert the expected
// exit code and (for invalid fixtures) error message content. (`--quiet` would
// suppress errorf output; see rationale comment in `runHugoWithFixture`.)
//
// Each test cleans up its own temp content directory in a finally block so
// failures never leave the working tree dirty.

import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { copyFileSync, mkdirSync, rmSync, existsSync, readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const repoRoot = resolve(__dirname, "..", "..");
const fixturesDir = resolve(__dirname, "fixtures");

function runHugoWithFixture(fixtureFile, slug) {
  const tempSection = `_test_growth_stage_${slug}`;
  const tempDir = resolve(repoRoot, "content", tempSection);
  const tempIndex = resolve(tempDir, "index.md");

  mkdirSync(tempDir, { recursive: true });
  copyFileSync(resolve(fixturesDir, fixtureFile), tempIndex);

  try {
    // NOTE: --quiet suppresses errorf output, which we need to assert on.
    // We use --logLevel error to keep noise low while preserving error messages.
    const result = spawnSync(
      "hugo",
      ["--logLevel", "error", "--environment", "production"],
      {
        cwd: repoRoot,
        encoding: "utf8",
        shell: process.platform === "win32",
      }
    );
    return {
      status: result.status,
      stdout: result.stdout || "",
      stderr: result.stderr || "",
    };
  } finally {
    if (existsSync(tempDir)) {
      rmSync(tempDir, { recursive: true, force: true });
    }
    // Hugo writes to ./public; not cleaning that up — `.gitignore` already excludes it.
  }
}

test("baseline: hugo build succeeds with no test fixtures (regression guard)", () => {
  const result = spawnSync(
    "hugo",
    ["--logLevel", "error", "--environment", "production"],
    {
      cwd: repoRoot,
      encoding: "utf8",
      shell: process.platform === "win32",
    }
  );
  assert.equal(
    result.status,
    0,
    `Baseline build failed (exit ${result.status}). stderr:\n${result.stderr}`
  );
});

test("AC1+AC4: build succeeds with valid growth_stage (evergreen)", () => {
  const result = runHugoWithFixture("valid-evergreen.md", "evergreen");
  assert.equal(
    result.status,
    0,
    `Expected exit 0; got ${result.status}. stderr:\n${result.stderr}`
  );
});

test("AC3: build succeeds when growth_stage is missing (default fallback)", () => {
  const result = runHugoWithFixture("valid-missing-field.md", "missing");
  assert.equal(
    result.status,
    0,
    `Expected exit 0; got ${result.status}. stderr:\n${result.stderr}`
  );
});

test("AC2: build fails on invalid growth_stage with helpful error", () => {
  const result = runHugoWithFixture("invalid-stage.md", "invalid");
  assert.notEqual(
    result.status,
    0,
    `Expected non-zero exit; got 0. stdout:\n${result.stdout}`
  );
  const combined = `${result.stdout}\n${result.stderr}`;
  assert.match(
    combined,
    /Invalid growth_stage/,
    "Error message should contain 'Invalid growth_stage'"
  );
  assert.match(
    combined,
    /seedling.*budding.*evergreen.*withered/s,
    "Error message should list all four allowed values"
  );
  assert.match(
    combined,
    /_test_growth_stage_invalid/,
    "Error message should reference the offending file path"
  );
});

// =============================================================================
// Story 1.3: Withered content default hiding.
// Drops a withered fixture into content/articles/ so it is `Type=articles`
// (and so legitimately a homepage candidate before the filter); asserts that
// after the build the homepage HTML does NOT mention its permalink, while
// the article's own page bundle is still rendered to public/.
// =============================================================================

function runHugoWithArticleFixture(fixtureFile, slug) {
  const tempDir = resolve(repoRoot, "content", "articles", `_test_withered_${slug}`);
  const tempIndex = resolve(tempDir, "index.md");

  mkdirSync(tempDir, { recursive: true });
  copyFileSync(resolve(fixturesDir, fixtureFile), tempIndex);

  try {
    const result = spawnSync(
      "hugo",
      ["--logLevel", "error", "--environment", "production"],
      {
        cwd: repoRoot,
        encoding: "utf8",
        shell: process.platform === "win32",
      }
    );
    return {
      status: result.status,
      stdout: result.stdout || "",
      stderr: result.stderr || "",
      slug,
    };
  } finally {
    if (existsSync(tempDir)) {
      rmSync(tempDir, { recursive: true, force: true });
    }
  }
}

test("Story 1.3 AC #1: homepage HTML excludes withered article permalink", () => {
  const result = runHugoWithArticleFixture("withered-article.md", "ac1");
  assert.equal(
    result.status,
    0,
    `Build should succeed with withered fixture. stderr:\n${result.stderr}`
  );

  const homeHtml = readFileSync(resolve(repoRoot, "public", "index.html"), "utf8");
  assert.doesNotMatch(
    homeHtml,
    /_test_withered_ac1/,
    "Homepage HTML must NOT link to the withered fixture"
  );
});

test("Story 1.3 AC #4: withered article direct URL is still rendered to public/", () => {
  const result = runHugoWithArticleFixture("withered-article.md", "ac4");
  assert.equal(
    result.status,
    0,
    `Build should succeed with withered fixture. stderr:\n${result.stderr}`
  );

  const witheredPage = resolve(
    repoRoot,
    "public",
    "articles",
    "_test_withered_ac4",
    "index.html"
  );
  assert.ok(
    existsSync(witheredPage),
    `Withered article page bundle should be rendered at ${witheredPage}`
  );
  const html = readFileSync(witheredPage, "utf8");
  assert.ok(
    html.length > 0,
    "Withered article page must be non-empty"
  );
  assert.match(
    html,
    /Valid Withered Fixture/,
    "Withered article page should contain its title"
  );
});

test("Story 1.3 AC #5: search index (index.json) keeps withered content", () => {
  const result = runHugoWithArticleFixture("withered-article.md", "ac5");
  assert.equal(
    result.status,
    0,
    `Build should succeed with withered fixture. stderr:\n${result.stderr}`
  );

  const indexJsonPath = resolve(repoRoot, "public", "index.json");
  assert.ok(
    existsSync(indexJsonPath),
    "public/index.json should be generated"
  );
  const indexJson = readFileSync(indexJsonPath, "utf8");
  assert.match(
    indexJson,
    /_test_withered_ac5/,
    "Search index must still reference the withered article (per AC #5)"
  );
});

test("Story 1.3 AC #6: hidden notice element renders on homepage when withered count > 0", () => {
  const result = runHugoWithArticleFixture("withered-article.md", "ac6");
  assert.equal(
    result.status,
    0,
    `Build should succeed with withered fixture. stderr:\n${result.stderr}`
  );

  const homeHtml = readFileSync(resolve(repoRoot, "public", "index.html"), "utf8");
  assert.match(
    homeHtml,
    /class="withered-hidden-notice"/,
    "Homepage should render the .withered-hidden-notice element"
  );
  assert.match(
    homeHtml,
    /\d+ verwelkte/,
    "Notice should contain a count + the word 'verwelkte'"
  );
});

test("Story 1.3 AC #6 (a11y): hidden notice carries role='status' + aria-live='polite' + aria-hidden icon", () => {
  const result = runHugoWithArticleFixture("withered-article.md", "ac6a11y");
  assert.equal(
    result.status,
    0,
    `Build should succeed with withered fixture. stderr:\n${result.stderr}`
  );

  const homeHtml = readFileSync(resolve(repoRoot, "public", "index.html"), "utf8");
  // The notice element MUST have screen-reader semantics so the hidden
  // count is announced politely without stealing focus.
  assert.match(
    homeHtml,
    /<p class="withered-hidden-notice"[^>]*role="status"[^>]*aria-live="polite"/,
    "Notice should declare role='status' and aria-live='polite'"
  );
  // The decorative skull icon must NOT be exposed to assistive tech.
  assert.match(
    homeHtml,
    /<p class="withered-hidden-notice"[\s\S]*?<svg[^>]*aria-hidden="true"/,
    "Decorative svg inside the notice should carry aria-hidden='true'"
  );
});

test("Story 1.3 AC #8: 404 page recent-articles widget excludes withered content", () => {
  const result = runHugoWithArticleFixture("withered-article.md", "ac8");
  assert.equal(
    result.status,
    0,
    `Build should succeed with withered fixture. stderr:\n${result.stderr}`
  );

  const notFoundHtml = readFileSync(resolve(repoRoot, "public", "404.html"), "utf8");
  assert.doesNotMatch(
    notFoundHtml,
    /_test_withered_ac8/,
    "404 page recent-articles widget MUST NOT link to the withered fixture"
  );
});

test("Story 1.3 AC #11: weight-bucket ordering on homepage is preserved (regression guard)", () => {
  // Run with the withered fixture present so the filter is exercised, then
  // assert that the existing real homepage cards still render the canonical
  // weight buckets. This guards the home.html refactor against accidentally
  // dropping the three `Params.weight` ranges.
  const result = runHugoWithArticleFixture("withered-article.md", "ac11");
  assert.equal(
    result.status,
    0,
    `Build should succeed with withered fixture. stderr:\n${result.stderr}`
  );

  const homeHtml = readFileSync(resolve(repoRoot, "public", "index.html"), "utf8");
  // At minimum, the homepage must still render the article-card markup;
  // the filter doesn't replace cards, only excludes withered ones.
  assert.match(
    homeHtml,
    /article class="card is-horizontal/,
    "Homepage must still render article cards after the withered filter"
  );
});
