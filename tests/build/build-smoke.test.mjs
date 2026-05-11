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
//
// Test builds write to `public-test/` (not `public/`) so a developer can keep
// `hugo server` running on `public/` without colliding with the test build.
// On Windows, hugo's static-file copy fails with "directory not empty" if any
// file inside `public/articles/` is held open by another process — separating
// the output dirs eliminates that race entirely.

import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { copyFileSync, mkdirSync, rmSync, existsSync, readFileSync, writeFileSync, readdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const repoRoot = resolve(__dirname, "..", "..");
const fixturesDir = resolve(__dirname, "fixtures");
const testPublic = resolve(repoRoot, "public-test");
const hugoArgs = [
  "--logLevel",
  "error",
  "--environment",
  "production",
  "--destination",
  testPublic,
];

function runHugoWithFixture(fixtureFile, slug) {
  const tempSection = `_test_growth_stage_${slug}`;
  const tempDir = resolve(repoRoot, "content", tempSection);
  const tempIndex = resolve(tempDir, "index.md");

  mkdirSync(tempDir, { recursive: true });
  copyFileSync(resolve(fixturesDir, fixtureFile), tempIndex);

  try {
    // NOTE: --quiet suppresses errorf output, which we need to assert on.
    // We use --logLevel error to keep noise low while preserving error messages.
    const result = spawnSync("hugo", hugoArgs, {
      cwd: repoRoot,
      encoding: "utf8",
      shell: process.platform === "win32",
    });
    return {
      status: result.status,
      stdout: result.stdout || "",
      stderr: result.stderr || "",
    };
  } finally {
    if (existsSync(tempDir)) {
      rmSync(tempDir, { recursive: true, force: true });
    }
    // Hugo writes to ./public-test; not cleaning that up — `.gitignore` already excludes it.
  }
}

test("baseline: hugo build succeeds with no test fixtures (regression guard)", () => {
  const result = spawnSync("hugo", hugoArgs, {
    cwd: repoRoot,
    encoding: "utf8",
    shell: process.platform === "win32",
  });
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
    const result = spawnSync("hugo", hugoArgs, {
      cwd: repoRoot,
      encoding: "utf8",
      shell: process.platform === "win32",
    });
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

  const homeHtml = readFileSync(resolve(repoRoot, "public-test","index.html"), "utf8");
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
    "public-test",
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

  const indexJsonPath = resolve(repoRoot, "public-test","index.json");
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

  const homeHtml = readFileSync(resolve(repoRoot, "public-test","index.html"), "utf8");
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

  const homeHtml = readFileSync(resolve(repoRoot, "public-test","index.html"), "utf8");
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

  const notFoundHtml = readFileSync(resolve(repoRoot, "public-test","404.html"), "utf8");
  assert.doesNotMatch(
    notFoundHtml,
    /_test_withered_ac8/,
    "404 page recent-articles widget MUST NOT link to the withered fixture"
  );
});

// =============================================================================
// Story 1.4: Withered content warning banner.
// Drops withered fixtures into content/articles/_test_withered_<slug>/ via the
// existing runHugoWithArticleFixture helper, then asserts on the rendered
// `public/articles/_test_withered_<slug>/index.html` to confirm the banner
// markup is present (or correctly absent) per AC #1, #2, #5, #11, #12.
// AC #7 (build-time required-field validation) is exercised via the negative
// fixture withered-invalid.md run through the page-bundle helper used by
// Story 1.1's enum tests.
// =============================================================================

test("Story 1.4 AC #1+#2+#5: withered banner renders with date+reason+replacement", () => {
  const result = runHugoWithArticleFixture("withered-with-replacement.md", "banner");
  assert.equal(
    result.status,
    0,
    `Build should succeed with full withered fixture. stderr:\n${result.stderr}`
  );

  const articlePage = resolve(
    repoRoot,
    "public-test",
    "articles",
    "_test_withered_banner",
    "index.html"
  );
  assert.ok(existsSync(articlePage), `Article page should exist at ${articlePage}`);
  const html = readFileSync(articlePage, "utf8");

  assert.match(
    html,
    /class="withered-banner message is-warning"/,
    "Banner element with Bulma message+warning classes must be present"
  );
  assert.match(
    html,
    /role="alert"/,
    "Banner must declare role='alert' for assistive tech"
  );
  assert.match(
    html,
    /id="withered-banner-title"/,
    "Banner heading must be addressable via aria-labelledby"
  );
  assert.match(
    html,
    /<time datetime="2026-04-15">/,
    "Banner must include machine-readable withered_date in <time>"
  );
  // The site's German locale renders ":date_long" as "15. April 2026".
  assert.match(
    html,
    /15\. April 2026/,
    "Banner must render withered_date in long-form German"
  );
  assert.match(
    html,
    /class="withered-banner-reason">Beispiel: das alte Framework wird nicht mehr gepflegt\./,
    "Banner must include the withered_reason paragraph"
  );
  assert.match(
    html,
    /class="withered-banner-replacement">[\s\S]*?<a href="\/articles\/withered-replacement-target\/"[^>]*>Aktuelle Version ansehen/,
    "Banner must include a link to replacement_url"
  );
});

test("Story 1.4 AC #2+#6: withered-minimal omits reason and replacement", () => {
  const result = runHugoWithArticleFixture("withered-minimal.md", "minimal");
  assert.equal(
    result.status,
    0,
    `Build should succeed with minimal withered fixture. stderr:\n${result.stderr}`
  );

  const articlePage = resolve(
    repoRoot,
    "public-test",
    "articles",
    "_test_withered_minimal",
    "index.html"
  );
  assert.ok(existsSync(articlePage), `Article page should exist at ${articlePage}`);
  const html = readFileSync(articlePage, "utf8");

  assert.match(
    html,
    /class="withered-banner message is-warning"/,
    "Banner must still render for the minimal fixture"
  );
  assert.doesNotMatch(
    html,
    /class="withered-banner-reason"/,
    "Minimal fixture must NOT emit the reason paragraph (no empty placeholder)"
  );
  assert.doesNotMatch(
    html,
    /class="withered-banner-replacement"/,
    "Minimal fixture must NOT emit the replacement link wrapper"
  );
});

test("Story 1.4 AC #7: build fails when withered article lacks withered_date", () => {
  // Use runHugoWithArticleFixture so the fixture is placed under content/articles/
  // (Type=articles), matching the production template path that exercises
  // validate-growth-stage.html via baseof.html.
  const result = runHugoWithArticleFixture("withered-invalid.md", "withered_invalid");
  assert.notEqual(
    result.status,
    0,
    `Expected non-zero exit; got 0. stdout:\n${result.stdout}`
  );
  const combined = `${result.stdout}\n${result.stderr}`;
  assert.match(
    combined,
    /Missing withered_date/,
    "Error message should name the missing field"
  );
  assert.match(
    combined,
    /_test_withered_withered_invalid/,
    "Error message should reference the offending file path"
  );
});

// =============================================================================
// Story 1.3: Series widget — withered filtering in single.html
//
// Creates 2–3 temporary article page bundles that share a `series` value,
// runs a production Hugo build, and asserts the rendered series widget HTML.
//
// Covered scenarios:
//   A. Non-withered article: widget hides withered siblings, count excludes them.
//   B. Withered article (direct URL): widget marks it as active, count includes it.
//   C. All-non-withered series: widget shows every member, count is correct.
// =============================================================================

function articleFrontmatter({ title, date, growth_stage, series, withered_date } = {}) {
  const lines = [
    `title: "${title}"`,
    `date: ${date}`,
    `draft: false`,
    `summary: "Series smoke-test fixture."`,
  ];
  if (growth_stage) lines.push(`growth_stage: "${growth_stage}"`);
  if (withered_date) lines.push(`withered_date: "${withered_date}"`);
  if (series) lines.push(`series:\n  - "${series}"`);
  return `---\n${lines.join("\n")}\n---\nContent.\n`;
}

function runHugoWithSeriesFixtures(articles) {
  const dirs = articles.map((a) =>
    resolve(repoRoot, "content", "articles", `_test_series_${a.slug}`)
  );

  // Clean stale Hugo output from previous runs before building, not after —
  // tests read from public-test after this function returns.
  for (const a of articles) {
    const outDir = resolve(testPublic, "articles", `_test_series_${a.slug}`);
    if (existsSync(outDir)) rmSync(outDir, { recursive: true, force: true });
  }

  for (const [i, article] of articles.entries()) {
    mkdirSync(dirs[i], { recursive: true });
    writeFileSync(resolve(dirs[i], "index.md"), articleFrontmatter(article));
  }

  try {
    const result = spawnSync("hugo", hugoArgs, {
      cwd: repoRoot,
      encoding: "utf8",
      shell: process.platform === "win32",
    });
    return {
      status: result.status,
      stdout: result.stdout || "",
      stderr: result.stderr || "",
      slugs: articles.map((a) => a.slug),
    };
  } finally {
    for (const dir of dirs) {
      if (existsSync(dir)) rmSync(dir, { recursive: true, force: true });
    }
  }
}

function readArticlePage(slug) {
  return readFileSync(
    resolve(repoRoot, "public-test","articles", `_test_series_${slug}`, "index.html"),
    "utf8"
  );
}

function extractSeriesWidget(html) {
  // Pull out the <section class="series-sidebar">…</section> block only, so
  // assertions don't accidentally match the related-sidebar widget or other
  // parts of the page. Terminated at </section> (the partial's outermost
  // element) which scopes assertions cleanly even if nested <ol>/<section>
  // elements get added inside list items later.
  const match = html.match(/<section class="series-sidebar"[^>]*>[\s\S]*?<\/section>/);
  return match ? match[0] : "";
}

test("Story 1.3 series: withered siblings remain visible but marked in the series widget", () => {
  // Article A (evergreen) + Article B (withered) + Article C (evergreen) — all in one series.
  // On A's page: count=3 (all members), B visible with is-withered class and skull icon + tooltip.
  const result = runHugoWithSeriesFixtures([
    {
      slug: "s1a",
      title: "Series Smoke Part 1",
      date: "2026-04-01T00:00:00Z",
      growth_stage: "evergreen",
      series: "Smoke Series",
    },
    {
      slug: "s1b",
      title: "Series Smoke Part 2 Withered",
      date: "2026-04-02T00:00:00Z",
      growth_stage: "withered",
      withered_date: "2026-04-30",
      series: "Smoke Series",
    },
    {
      slug: "s1c",
      title: "Series Smoke Part 3",
      date: "2026-04-03T00:00:00Z",
      growth_stage: "evergreen",
      series: "Smoke Series",
    },
  ]);

  assert.equal(result.status, 0, `Build failed.\n${result.stderr}`);

  const widget = extractSeriesWidget(readArticlePage("s1a"));
  assert.ok(widget.length > 0, "Series widget must be present on s1a's page");

  assert.match(widget, /Smoke Series/, "Series name must appear in the widget");
  assert.match(
    widget,
    /3 Teile/,
    "Series count pill must include all 3 members (including withered)"
  );
  assert.match(
    widget,
    /\bis-withered\b/,
    "Withered sibling must carry the is-withered class"
  );
  assert.match(
    widget,
    /Series Smoke Part 2 Withered/,
    "Withered sibling title must still appear in the series widget"
  );
  assert.match(
    widget,
    /— verwelkt/,
    "Withered sibling link must carry the 'verwelkt' tooltip"
  );
  assert.match(
    widget,
    /Series Smoke Part 3/,
    "Non-withered sibling must appear in the series widget"
  );
  assert.match(
    widget,
    /<li class="series-sidebar__item is-current[^"]*">[\s\S]*?Series Smoke Part 1/,
    "Current non-withered article must be marked is-current"
  );
});

test("Story 1.3 series: withered article is marked active in its own series widget (regression)", () => {
  // Same three articles. On B's page (withered, direct URL):
  // - count must be 3 (current page is included even though withered)
  // - B must be is-current
  // - A and C must appear as links
  const result = runHugoWithSeriesFixtures([
    {
      slug: "s2a",
      title: "Series Smoke Part 1",
      date: "2026-04-01T00:00:00Z",
      growth_stage: "evergreen",
      series: "Smoke Series 2",
    },
    {
      slug: "s2b",
      title: "Series Smoke Part 2 Withered",
      date: "2026-04-02T00:00:00Z",
      growth_stage: "withered",
      withered_date: "2026-04-30",
      series: "Smoke Series 2",
    },
    {
      slug: "s2c",
      title: "Series Smoke Part 3",
      date: "2026-04-03T00:00:00Z",
      growth_stage: "evergreen",
      series: "Smoke Series 2",
    },
  ]);

  assert.equal(result.status, 0, `Build failed.\n${result.stderr}`);

  const widget = extractSeriesWidget(readArticlePage("s2b"));
  assert.ok(widget.length > 0, "Series widget must be present on s2b's page");

  assert.match(widget, /Smoke Series 2/, "Series name must appear in the widget");
  assert.match(
    widget,
    /3 Teile/,
    "Series count pill on the withered page itself must include all 3 members"
  );
  assert.match(
    widget,
    /class="series-sidebar__item is-current is-withered"/,
    "Withered current page must carry both is-current and is-withered classes"
  );
  assert.match(
    widget,
    /Series Smoke Part 2 Withered/,
    "Withered current page title must appear in the series widget"
  );
  assert.match(
    widget,
    /Series Smoke Part 1/,
    "Non-withered sibling Part 1 must appear as a link"
  );
  assert.match(
    widget,
    /Series Smoke Part 3/,
    "Non-withered sibling Part 3 must appear as a link"
  );
});

test("Story 1.3 series: all-non-withered series renders complete count and all members", () => {
  const result = runHugoWithSeriesFixtures([
    {
      slug: "s3a",
      title: "Clean Series Part 1",
      date: "2026-04-01T00:00:00Z",
      growth_stage: "evergreen",
      series: "Clean Series",
    },
    {
      slug: "s3b",
      title: "Clean Series Part 2",
      date: "2026-04-02T00:00:00Z",
      growth_stage: "seedling",
      series: "Clean Series",
    },
    {
      slug: "s3c",
      title: "Clean Series Part 3",
      date: "2026-04-03T00:00:00Z",
      growth_stage: "budding",
      series: "Clean Series",
    },
  ]);

  assert.equal(result.status, 0, `Build failed.\n${result.stderr}`);

  const widget = extractSeriesWidget(readArticlePage("s3b"));
  assert.ok(widget.length > 0, "Series widget must be present on s3b's page");

  assert.match(widget, /Clean Series/, "Series name must appear in the widget");
  assert.match(widget, /3 Teile/, "All-non-withered series must show count=3 (3 Teile)");
  assert.match(widget, /Clean Series Part 1/, "Part 1 must appear in the widget");
  assert.match(
    widget,
    /<li class="series-sidebar__item is-current[^"]*">[\s\S]*?Clean Series Part 2/,
    "Current page (s3b) must be is-current"
  );
  assert.match(widget, /Clean Series Part 3/, "Part 3 must appear in the widget");
});

test("Story 1.4 AC #11: non-withered articles render without the withered banner", () => {
  // Reuse the existing valid-evergreen fixture to confirm non-withered pages
  // are byte-clean of the banner markup.
  const result = runHugoWithArticleFixture("valid-evergreen.md", "evergreen14");
  assert.equal(
    result.status,
    0,
    `Build should succeed with evergreen fixture. stderr:\n${result.stderr}`
  );

  const articlePage = resolve(
    repoRoot,
    "public-test",
    "articles",
    "_test_withered_evergreen14",
    "index.html"
  );
  assert.ok(existsSync(articlePage), `Article page should exist at ${articlePage}`);
  const html = readFileSync(articlePage, "utf8");
  assert.doesNotMatch(
    html,
    /class="withered-banner/,
    "Non-withered article must NOT contain any withered-banner markup"
  );
});

// =============================================================================
// Story 1.5: Withered SEO & RSS Inclusion
//
// Drops withered / non-withered fixtures into content/articles/_test_withered_<slug>/,
// runs hugo, asserts on rendered RSS (public-test/index.xml), sitemap
// (public-test/sitemap.xml), and JSON-LD inside the article HTML.
//
// XML well-formedness is validated via structural probes (XML decl, root tags,
// no unescaped ampersands) — xmllint is intentionally NOT a dependency here.
// Hugo's templates produce well-formed output by construction whenever the
// build exits 0, so the probes are a regression guard rather than a parser.
// =============================================================================

const PUBLIC_TEST = resolve(repoRoot, "public-test");
const RSS_PATH = resolve(PUBLIC_TEST, "index.xml");
const SITEMAP_PATH = resolve(PUBLIC_TEST, "sitemap.xml");

function assertWellFormedXml(filePath, rootElement) {
  assert.ok(existsSync(filePath), `${filePath} should exist`);
  const xml = readFileSync(filePath, "utf8");
  assert.match(
    xml,
    /^<\?xml\s+version="1\.0"/,
    `${filePath} must start with an XML declaration`
  );
  assert.match(
    xml,
    new RegExp(`<${rootElement}[\\s>]`),
    `${filePath} must contain a <${rootElement}> root element`
  );
  assert.match(
    xml,
    new RegExp(`</${rootElement}>\\s*$`),
    `${filePath} must close with </${rootElement}>`
  );
  // Common XML well-formedness bug: unescaped ampersand. Allow the standard
  // entity refs and numeric character refs.
  const badAmp = xml.match(/&(?!(?:amp|lt|gt|apos|quot|#\d+|#x[0-9a-fA-F]+);)/);
  assert.equal(
    badAmp,
    null,
    `${filePath} contains an unescaped ampersand near: ${badAmp ? xml.slice(Math.max(0, badAmp.index - 20), badAmp.index + 30) : ""}`
  );
  return xml;
}

function extractJsonLd(html) {
  const match = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  if (!match) return null;
  return JSON.parse(match[1].trim());
}

// Extract the single <tag>…</tag> block that contains `marker`. Lazy regex like
// `<item>[\s\S]*?MARKER[\s\S]*?<\/item>` would over-match across sibling blocks
// (the leading `<item>` anchors at the FIRST occurrence, then expands through
// intervening blocks until MARKER is reached) — that's the bug this helper fixes.
function findBlock(xml, tag, marker) {
  const blocks = xml.match(new RegExp(`<${tag}>[\\s\\S]*?<\\/${tag}>`, "g")) || [];
  return blocks.find((b) => b.includes(marker)) || "";
}

test("Story 1.5 AC #1: withered RSS title carries [Verwelkt Mon. YYYY] suffix", () => {
  const result = runHugoWithArticleFixture("withered-with-replacement.md", "rss15a");
  assert.equal(result.status, 0, `Build failed:\n${result.stderr}`);
  const rss = assertWellFormedXml(RSS_PATH, "rss");
  // withered_date 2026-04-15 → German abbreviation "Apr. 2026"
  assert.match(
    rss,
    /<title>Withered With Replacement Fixture \[Verwelkt Apr\. 2026\]<\/title>/,
    "Withered RSS item title must include the [Verwelkt Mon. YYYY] suffix"
  );
});

test("Story 1.5 AC #2: withered RSS description prepends warning + 'Grund:' when reason present", () => {
  const result = runHugoWithArticleFixture("withered-with-replacement.md", "rss15b");
  assert.equal(result.status, 0, `Build failed:\n${result.stderr}`);
  const rss = assertWellFormedXml(RSS_PATH, "rss");
  // RSS feeds emit description as escaped HTML — ⚠️ and the German long-form
  // date pass through verbatim; <p>/<strong> are HTML-escaped by `| html`.
  assert.match(
    rss,
    /⚠️ Dieser Inhalt ist als veraltet markiert seit 15\. April 2026\./,
    "Description warning must include the long-form German withered_date"
  );
  assert.match(
    rss,
    /Grund: Beispiel: das alte Framework wird nicht mehr gepflegt\./,
    "Description must include withered_reason after 'Grund:' label"
  );
});

test("Story 1.5 AC #2: withered RSS description omits 'Grund:' when withered_reason absent", () => {
  const result = runHugoWithArticleFixture("withered-minimal.md", "rss15c");
  assert.equal(result.status, 0, `Build failed:\n${result.stderr}`);
  const rss = assertWellFormedXml(RSS_PATH, "rss");
  const item = findBlock(rss, "item", "Withered Minimal Fixture");
  assert.ok(item.length > 0, "Minimal fixture's RSS <item> must be present");
  assert.match(
    item,
    /⚠️ Dieser Inhalt ist als veraltet markiert seit 15\. April 2026\./,
    "Minimal fixture must still carry the date warning"
  );
  assert.doesNotMatch(
    item,
    /Grund:/,
    "Minimal fixture must NOT include the 'Grund:' label (no empty reason)"
  );
});

test("Story 1.5 AC #7: non-withered RSS items unchanged (no [Verwelkt suffix, no warning prepend)", () => {
  const result = runHugoWithArticleFixture("valid-evergreen.md", "rss15d");
  assert.equal(result.status, 0, `Build failed:\n${result.stderr}`);
  const rss = assertWellFormedXml(RSS_PATH, "rss");
  const item = findBlock(rss, "item", "Valid Evergreen Fixture");
  assert.ok(item.length > 0, "Evergreen fixture's RSS <item> must be present");
  assert.doesNotMatch(
    item,
    /\[Verwelkt/,
    "Non-withered RSS title must NOT carry the [Verwelkt …] suffix"
  );
  assert.doesNotMatch(
    item,
    /⚠️ Dieser Inhalt/,
    "Non-withered RSS description must NOT have the deprecation prepend"
  );
});

test("Story 1.5 AC #5: withered sitemap entry has <priority>0.3</priority>", () => {
  const result = runHugoWithArticleFixture("withered-with-replacement.md", "sm15a");
  assert.equal(result.status, 0, `Build failed:\n${result.stderr}`);
  const sm = assertWellFormedXml(SITEMAP_PATH, "urlset");
  const url = findBlock(sm, "url", "_test_withered_sm15a");
  assert.ok(url.length > 0, "Withered fixture URL must be present in sitemap");
  assert.match(
    url,
    /<priority>0\.3<\/priority>/,
    "Withered fixture must have <priority>0.3</priority>"
  );
});

test("Story 1.5 AC #4: withered sitemap <lastmod> equals withered_date", () => {
  const result = runHugoWithArticleFixture("withered-with-replacement.md", "sm15b");
  assert.equal(result.status, 0, `Build failed:\n${result.stderr}`);
  const sm = assertWellFormedXml(SITEMAP_PATH, "urlset");
  const url = findBlock(sm, "url", "_test_withered_sm15b");
  assert.ok(url.length > 0, "Withered fixture URL must be present in sitemap");
  // withered_date 2026-04-15 in site timezone Europe/Berlin
  assert.match(
    url,
    /<lastmod>2026-04-15T/,
    "Withered fixture <lastmod> must start with the withered_date ISO prefix"
  );
});

test("Story 1.5 AC #5+#7: non-withered sitemap entry inherits <priority>0.8</priority>", () => {
  const result = runHugoWithArticleFixture("valid-evergreen.md", "sm15c");
  assert.equal(result.status, 0, `Build failed:\n${result.stderr}`);
  const sm = assertWellFormedXml(SITEMAP_PATH, "urlset");
  const url = findBlock(sm, "url", "_test_withered_sm15c");
  assert.ok(url.length > 0, "Evergreen fixture URL must be present in sitemap");
  assert.match(
    url,
    /<priority>0\.8<\/priority>/,
    "Non-withered fixture must inherit the site-default <priority>0.8</priority>"
  );
});

test("Story 1.5 AC #4+#7: non-withered sitemap <lastmod> is NOT a withered_date", () => {
  const result = runHugoWithArticleFixture("valid-evergreen.md", "sm15d");
  assert.equal(result.status, 0, `Build failed:\n${result.stderr}`);
  const sm = assertWellFormedXml(SITEMAP_PATH, "urlset");
  const url = findBlock(sm, "url", "_test_withered_sm15d");
  assert.ok(url.length > 0, "Evergreen fixture URL must be present in sitemap");
  assert.doesNotMatch(
    url,
    /<lastmod>2026-04-15T/,
    "Non-withered <lastmod> must NOT match a withered_date"
  );
});

test("Story 1.5 AC #6: withered JSON-LD has creativeWorkStatus=Obsolete + dateModified=withered_date + description prefix with reason", () => {
  const result = runHugoWithArticleFixture("withered-with-replacement.md", "jsonld15a");
  assert.equal(result.status, 0, `Build failed:\n${result.stderr}`);
  const html = readFileSync(
    resolve(repoRoot, "public-test", "articles", "_test_withered_jsonld15a", "index.html"),
    "utf8"
  );
  const ld = extractJsonLd(html);
  assert.ok(ld, "JSON-LD block must be present and JSON-parseable");
  assert.equal(
    ld.creativeWorkStatus,
    "Obsolete",
    "creativeWorkStatus must equal 'Obsolete' for withered articles"
  );
  assert.match(
    ld.dateModified,
    /^2026-04-15T/,
    "dateModified must start with the withered_date ISO prefix"
  );
  assert.match(
    ld.description,
    /^Veraltet seit 15\. April 2026: Beispiel: das alte Framework wird nicht mehr gepflegt\. — /,
    "description must start with 'Veraltet seit DATE: REASON — ' prefix"
  );
});

test("Story 1.5 AC #6: withered-minimal JSON-LD description has no orphaned colon when reason absent", () => {
  const result = runHugoWithArticleFixture("withered-minimal.md", "jsonld15b");
  assert.equal(result.status, 0, `Build failed:\n${result.stderr}`);
  const html = readFileSync(
    resolve(repoRoot, "public-test", "articles", "_test_withered_jsonld15b", "index.html"),
    "utf8"
  );
  const ld = extractJsonLd(html);
  assert.ok(ld, "JSON-LD block must be present and JSON-parseable");
  assert.match(
    ld.description,
    /^Veraltet seit 15\. April 2026 — /,
    "description must format 'Veraltet seit DATE — ...' (no orphaned colon)"
  );
  assert.doesNotMatch(
    ld.description,
    /Veraltet seit 15\. April 2026:/,
    "description must NOT carry a colon between date and em-dash when reason absent"
  );
});

test("Story 1.5 AC #6+#7: non-withered JSON-LD has no creativeWorkStatus, no Veraltet prefix, dateModified is not a withered_date", () => {
  const result = runHugoWithArticleFixture("valid-evergreen.md", "jsonld15c");
  assert.equal(result.status, 0, `Build failed:\n${result.stderr}`);
  const html = readFileSync(
    resolve(repoRoot, "public-test", "articles", "_test_withered_jsonld15c", "index.html"),
    "utf8"
  );
  const ld = extractJsonLd(html);
  assert.ok(ld, "JSON-LD block must be present and JSON-parseable");
  assert.equal(
    ld.creativeWorkStatus,
    undefined,
    "Non-withered JSON-LD must NOT include creativeWorkStatus"
  );
  assert.doesNotMatch(
    ld.dateModified || "",
    /^2026-04-15T/,
    "Non-withered dateModified must NOT match a withered_date"
  );
  assert.doesNotMatch(
    ld.description || "",
    /^Veraltet seit/,
    "Non-withered description must NOT carry the German deprecation prefix"
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

  const homeHtml = readFileSync(resolve(repoRoot, "public-test","index.html"), "utf8");
  // At minimum, the homepage must still render the article-card markup;
  // the filter doesn't replace cards, only excludes withered ones.
  assert.match(
    homeHtml,
    /article class="card is-horizontal/,
    "Homepage must still render article cards after the withered filter"
  );
});

// =============================================================================
// Story 2.1: Umami Analytics Integration
//
// Asserts the Umami `<script async defer>` snippet is emitted in production
// builds (gated on hugo.IsProduction) and absent from development builds, and
// that the CSP meta tag in the production output continues to allow-list
// cloud.umami.is in both `script-src` and `connect-src` (regression guard
// against C-CSP-PROD-OVERRIDE: config/production/params.yaml replaces the
// _default CSP wholesale, so the allow-list must be present in BOTH files).
// =============================================================================

test("Story 2.1 AC #1+#3+#6: production homepage emits Umami script with async+defer+data-website-id", () => {
  const result = spawnSync("hugo", hugoArgs, {
    cwd: repoRoot,
    encoding: "utf8",
    shell: process.platform === "win32",
  });
  assert.equal(
    result.status,
    0,
    `Production build failed (exit ${result.status}). stderr:\n${result.stderr}`
  );

  const homeHtml = readFileSync(resolve(testPublic, "index.html"), "utf8");
  // The whole tag, on one logical block. Order of async/defer is not
  // guaranteed by Hugo's whitespace-control output, so match each attribute
  // independently within the matched script tag.
  const scriptTag = homeHtml.match(
    /<script[^>]*data-website-id="[^"]+"[^>]*src="https:\/\/cloud\.umami\.is\/script\.js"[^>]*>/
  );
  assert.ok(
    scriptTag,
    "Production homepage must render the Umami <script> tag pointing at cloud.umami.is/script.js"
  );
  assert.match(scriptTag[0], /\basync\b/, "Umami script tag must carry the `async` attribute");
  assert.match(scriptTag[0], /\bdefer\b/, "Umami script tag must carry the `defer` attribute");
  assert.doesNotMatch(
    scriptTag[0],
    /data-website-id=""/,
    "data-website-id must be non-empty (defensive `with` guard would otherwise skip emission)"
  );
});

test("Story 2.1 AC #7: production CSP <meta> allow-lists cloud.umami.is in script-src and connect-src", () => {
  const result = spawnSync("hugo", hugoArgs, {
    cwd: repoRoot,
    encoding: "utf8",
    shell: process.platform === "win32",
  });
  assert.equal(result.status, 0, `Production build failed.\n${result.stderr}`);

  const homeHtml = readFileSync(resolve(testPublic, "index.html"), "utf8");
  const cspMatch = homeHtml.match(
    /<meta http-equiv="Content-Security-Policy" content="([^"]+)"/
  );
  assert.ok(cspMatch, "CSP <meta> tag must be present in production output");
  const csp = cspMatch[1];

  const scriptSrc = csp.match(/script-src ([^;]+);/);
  assert.ok(scriptSrc, "CSP must contain a script-src directive");
  assert.match(
    scriptSrc[1],
    /https:\/\/cloud\.umami\.is/,
    "CSP script-src must allow-list https://cloud.umami.is (regression guard for C-CSP-PROD-OVERRIDE)"
  );

  const connectSrc = csp.match(/connect-src ([^;]+);/);
  assert.ok(connectSrc, "CSP must contain a connect-src directive");
  assert.match(
    connectSrc[1],
    /https:\/\/cloud\.umami\.is/,
    "CSP connect-src must allow-list https://cloud.umami.is"
  );
  // Umami split its infra: script CDN on cloud.umami.is, pageview POST endpoint
  // on api-gateway.umami.dev. Without BOTH in connect-src, the script loads but
  // every pageview is silently CSP-blocked (zero data in Umami dashboard).
  // First caught live on 2026-05-09 via browser-console CSP violation.
  assert.match(
    connectSrc[1],
    /https:\/\/api-gateway\.umami\.dev/,
    "CSP connect-src must allow-list https://api-gateway.umami.dev (Umami's pageview-reporting endpoint; without it, all events are silently dropped)"
  );
});

test("Story 2.1 AC #6: development build does NOT emit Umami script (hugo.IsProduction gate)", () => {
  const testPublicDev = resolve(repoRoot, "public-test-dev");
  const devArgs = [
    "--logLevel",
    "error",
    "--environment",
    "development",
    "--destination",
    testPublicDev,
  ];
  const result = spawnSync("hugo", devArgs, {
    cwd: repoRoot,
    encoding: "utf8",
    shell: process.platform === "win32",
  });
  assert.equal(
    result.status,
    0,
    `Development build failed (exit ${result.status}). stderr:\n${result.stderr}`
  );

  const homeHtml = readFileSync(resolve(testPublicDev, "index.html"), "utf8");
  assert.doesNotMatch(
    homeHtml,
    /cloud\.umami\.is\/script\.js/,
    "Development build must NOT emit cloud.umami.is/script.js (hugo.IsProduction gate)"
  );
});

// =============================================================================
// Story 2.3: Webmention Endpoint Setup
//
// Asserts the `<link rel="webmention">` discovery tag is emitted on every
// rendered page in BOTH production and development builds (no hugo.IsProduction
// gate — the link is HTML metadata, not a runtime fetch). Asserts the URL
// matches the webmention.io endpoint hardcoded in head.html, and that the tag
// is emitted EXACTLY ONCE per page (not duplicated through partial inclusion).
// =============================================================================

test("Story 2.3 AC #1+#7: production homepage emits <link rel=\"webmention\"> with webmention.io endpoint", () => {
  const result = spawnSync("hugo", hugoArgs, {
    cwd: repoRoot,
    encoding: "utf8",
    shell: process.platform === "win32",
  });
  assert.equal(
    result.status,
    0,
    `Production build failed (exit ${result.status}). stderr:\n${result.stderr}`
  );

  const homeHtml = readFileSync(resolve(testPublic, "index.html"), "utf8");
  const matches = homeHtml.match(
    /<link rel="webmention" href="https:\/\/webmention\.io\/article-time\.de\/webmention"\s*\/?>/g
  );
  assert.ok(
    matches,
    "Production homepage must render the <link rel=\"webmention\"> tag pointing at webmention.io/article-time.de/webmention"
  );
  assert.equal(
    matches.length,
    1,
    `Webmention <link> must appear EXACTLY ONCE per page (regression guard against partial-inclusion duplication); got ${matches.length}`
  );
});

test("Story 2.3 AC #1+#7: production article page also emits the webmention <link>", () => {
  const result = spawnSync("hugo", hugoArgs, {
    cwd: repoRoot,
    encoding: "utf8",
    shell: process.platform === "win32",
  });
  assert.equal(result.status, 0, `Production build failed.\n${result.stderr}`);

  const articlesDir = resolve(testPublic, "articles");
  if (!existsSync(articlesDir)) assert.fail("articles/ dir missing from build output — run a full production build first");
  const articleSlug = readdirSync(articlesDir)
    .filter((entry) => !entry.startsWith("_test_"))
    .find((entry) =>
      existsSync(resolve(articlesDir, entry, "index.html"))
    );
  assert.ok(articleSlug, "Expected at least one non-fixture article to render");

  const articleHtml = readFileSync(
    resolve(articlesDir, articleSlug, "index.html"),
    "utf8"
  );
  assert.match(
    articleHtml,
    /<link rel="webmention" href="https:\/\/webmention\.io\/article-time\.de\/webmention"\s*\/?>/,
    "Article page must render the webmention <link> tag (site-wide via head.html partial)"
  );
});

test("Story 2.3 AC #7: development build ALSO emits the webmention <link> (no hugo.IsProduction gate)", () => {
  const testPublicDev = resolve(repoRoot, "public-test-dev");
  rmSync(testPublicDev, { recursive: true, force: true });
  const devArgs = [
    "--logLevel",
    "error",
    "--environment",
    "development",
    "--destination",
    testPublicDev,
  ];
  const result = spawnSync("hugo", devArgs, {
    cwd: repoRoot,
    encoding: "utf8",
    shell: process.platform === "win32",
  });
  assert.equal(
    result.status,
    0,
    `Development build failed (exit ${result.status}). stderr:\n${result.stderr}`
  );

  const homeHtml = readFileSync(resolve(testPublicDev, "index.html"), "utf8");
  assert.match(
    homeHtml,
    /<link rel="webmention" href="https:\/\/webmention\.io\/article-time\.de\/webmention"\s*\/?>/,
    "Development build must ALSO emit the webmention <link> (HTML metadata is harmless in dev; intentionally NOT gated)"
  );
});

test("Story 2.3 AC #6: CSP connect-src still allow-lists https://webmention.io (regression guard)", () => {
  const result = spawnSync("hugo", hugoArgs, {
    cwd: repoRoot,
    encoding: "utf8",
    shell: process.platform === "win32",
  });
  assert.equal(result.status, 0, `Production build failed.\n${result.stderr}`);

  const homeHtml = readFileSync(resolve(testPublic, "index.html"), "utf8");
  const cspMatch = homeHtml.match(
    /<meta http-equiv="Content-Security-Policy" content="([^"]+)"/
  );
  assert.ok(cspMatch, "CSP <meta> tag must be present in production output");
  const connectSrc = cspMatch[1].match(/connect-src ([^;]+);?/);
  assert.ok(connectSrc, "CSP must contain a connect-src directive");
  assert.match(
    connectSrc[1],
    /https:\/\/webmention\.io/,
    "CSP connect-src must allow-list https://webmention.io (Phase 0 Task 4.0; required for Story 2.4 / 3.2 downstream consumers)"
  );
});

// =============================================================================
// Story 2.2: Heart Button Component
//
// Asserts the heart-button partial renders on article single pages and on log
// cards (logs have no detail pages — cascade.build.render: link in
// content/logs/_index.md), with the right `data-article` attribute and a
// non-failing data-file lookup (`| default 0`). Also asserts hearts.js is
// concatenated into the production footerBundle.js fingerprinted output.
// =============================================================================

test("Story 2.2 AC #1+#2+#6: production article page renders heart-button with data-article, aria-label, and count", () => {
  const result = spawnSync("hugo", hugoArgs, {
    cwd: repoRoot,
    encoding: "utf8",
    shell: process.platform === "win32",
  });
  assert.equal(
    result.status,
    0,
    `Production build failed (exit ${result.status}). stderr:\n${result.stderr}`
  );

  // Pick the first non-_test_ article that built into public-test/articles/.
  const articlesDir = resolve(testPublic, "articles");
  const articleSlug = readdirSync(articlesDir)
    .filter((entry) => !entry.startsWith("_test_"))
    .find((entry) =>
      existsSync(resolve(articlesDir, entry, "index.html"))
    );
  assert.ok(articleSlug, "Expected at least one non-fixture article to render");

  const articleHtml = readFileSync(
    resolve(articlesDir, articleSlug, "index.html"),
    "utf8"
  );

  // The native <button> (not the <noscript> fallback) must render. The class
  // attribute carries additional decorator classes since Story 2.2 ("button
  // round-button inset heart-button"), so match `heart-button` as a word in
  // any position of the class list — same pattern as the log-card heart test
  // below.
  const buttonTag = articleHtml.match(
    /<button\b[^>]*class="[^"]*\bheart-button\b[^"]*"[^>]*>/
  );
  assert.ok(
    buttonTag,
    "Article page must render <button class=\"... heart-button ...\"> (not just the <noscript> fallback)"
  );
  assert.match(
    buttonTag[0],
    /data-article="\/[^"]+\/"/,
    "heart-button must carry data-article=\"<RelPermalink>\" (trailing slash, leading slash)"
  );
  assert.match(
    buttonTag[0],
    /aria-label="[^"]+"/,
    "heart-button must carry an aria-label"
  );
  assert.match(
    buttonTag[0],
    /aria-pressed="false"/,
    "heart-button initial state must be aria-pressed=\"false\""
  );
  assert.match(
    buttonTag[0],
    /type="button"/,
    "heart-button must declare type=\"button\" (avoid implicit submit)"
  );

  // Count span must render with the data-file fallback (`| default 0`) — until
  // Story 3.1 lands, every article shows count "0".
  assert.match(
    articleHtml,
    /<span class="heart-count"[^>]*aria-live="polite"[^>]*>0<\/span>/,
    "heart-count must render with 0 fallback (Story 3.1 not yet shipped) and aria-live=\"polite\""
  );

  // <noscript> fallback must also render (graceful degradation, AC #5).
  assert.match(
    articleHtml,
    /<noscript>\s*<a class="heart-button heart-button-fallback"/,
    "heart-button must include a <noscript> fallback <a> for JS-disabled clients"
  );
});

test("Story 2.2 AC #1: production homepage renders interactive heart-button on log cards", () => {
  const result = spawnSync("hugo", hugoArgs, {
    cwd: repoRoot,
    encoding: "utf8",
    shell: process.platform === "win32",
  });
  assert.equal(result.status, 0, `Production build failed.\n${result.stderr}`);

  const homeHtml = readFileSync(resolve(testPublic, "index.html"), "utf8");

  // Logs have no detail pages, so the heart mounts on log cards as the
  // interactive `.is-card-heart` variant (compact, sits inside .formats next
  // to the lightbulb icon). Tolerant class-attribute regex — order of class
  // tokens isn't load-bearing.
  const logHearts = homeHtml.match(
    /<button\b[^>]*class="[^"]*\bheart-button\b[^"]*\bis-card-heart\b[^"]*"[^>]*data-article="[^"]*\/logs\/[^"]+\/"/g
  );
  assert.ok(
    logHearts && logHearts.length >= 1,
    `Homepage must render at least one interactive heart-button on a log card — found ${logHearts ? logHearts.length : 0}`
  );
});

test("Story 2.2 AC #1: production homepage renders readonly heart on article cards (action lives on single page)", () => {
  const result = spawnSync("hugo", hugoArgs, {
    cwd: repoRoot,
    encoding: "utf8",
    shell: process.platform === "win32",
  });
  assert.equal(result.status, 0, `Production build failed.\n${result.stderr}`);

  const homeHtml = readFileSync(resolve(testPublic, "index.html"), "utf8");

  // Article cards on the homepage show a readonly `.heart-readonly` <span>
  // (social-proof indicator only — the interactive button lives on the
  // article single page sidebar). Asserts at least one is rendered.
  const readonly = homeHtml.match(
    /<span\b[^>]*class="heart-readonly"[^>]*aria-label="[^"]+"/g
  );
  assert.ok(
    readonly && readonly.length >= 1,
    `Homepage must render at least one readonly heart on an article card — found ${readonly ? readonly.length : 0}`
  );

  // Readonly heart must NOT carry data-article (it's not interactive — no JS
  // wiring needed). Verifies hearts.js's `.heart-button:not(.heart-button-fallback)`
  // selector won't accidentally pick it up.
  for (const tag of readonly) {
    assert.doesNotMatch(
      tag,
      /data-article=/,
      "readonly heart must NOT carry data-article (no JS interaction)"
    );
  }
});

test("Story 2.2: hint caption renders ONLY on article single pages, not on cards", () => {
  const result = spawnSync("hugo", hugoArgs, {
    cwd: repoRoot,
    encoding: "utf8",
    shell: process.platform === "win32",
  });
  assert.equal(result.status, 0, `Production build failed.\n${result.stderr}`);

  // Pick a non-fixture article single page.
  const articlesDir = resolve(testPublic, "articles");
  const articleSlug = readdirSync(articlesDir)
    .filter((entry) => !entry.startsWith("_test_"))
    .find((entry) =>
      existsSync(resolve(articlesDir, entry, "index.html"))
    );
  assert.ok(articleSlug, "Expected at least one non-fixture article to render");

  const articleHtml = readFileSync(
    resolve(articlesDir, articleSlug, "index.html"),
    "utf8"
  );
  const homeHtml = readFileSync(resolve(testPublic, "index.html"), "utf8");

  assert.match(
    articleHtml,
    /<small class="heart-button-hint">/,
    "Article single page MUST render the 24h-cadence hint caption"
  );
  assert.doesNotMatch(
    homeHtml,
    /heart-button-hint/,
    "Homepage MUST NOT render the hint caption (cards are too dense for it)"
  );
});

test("Story 2.2 AC #3+#9: hearts.js is bundled into footerBundle.js (localStorage prefix smoke)", () => {
  const result = spawnSync("hugo", hugoArgs, {
    cwd: repoRoot,
    encoding: "utf8",
    shell: process.platform === "win32",
  });
  assert.equal(result.status, 0, `Production build failed.\n${result.stderr}`);

  // The script tag in baseof.html points at the fingerprinted bundle. Pick
  // the active footerBundle by reading the homepage's <script src=...> and
  // resolving the path on disk — avoids matching stale fingerprints from
  // earlier test builds that hugo doesn't clean up.
  const homeHtml = readFileSync(resolve(testPublic, "index.html"), "utf8");
  const scriptMatch = homeHtml.match(
    /<script[^>]*src="([^"]*footerBundle\.min\.[^"]+\.js)"/
  );
  assert.ok(scriptMatch, "Homepage must reference the fingerprinted footerBundle.min.<hash>.js");

  // The src is baseURL-relative (e.g. /blog/js/footerBundle.min.<hash>.js);
  // strip any leading path prefix and resolve against testPublic.
  const srcPath = scriptMatch[1];
  const bundleFilename = srcPath.split("/").pop();
  const bundlePath = resolve(testPublic, "js", bundleFilename);
  assert.ok(
    existsSync(bundlePath),
    `Active footerBundle file must exist at ${bundlePath}`
  );

  const bundle = readFileSync(bundlePath, "utf8");
  assert.match(
    bundle,
    /hearted-/,
    "footerBundle must contain the 'hearted-' localStorage key prefix from hearts.js"
  );
  assert.match(
    bundle,
    /umami\.track/,
    "footerBundle must contain the umami.track call from hearts.js"
  );
});

// =============================================================================
// Story 2.4: Webmention Display Component
//
// Asserts the webmentions partial renders on every article single page and that
// the data/webmentions_by_article.json fixture drives the four type-groups,
// the count line, the empty-state path, and the AC #6 link attributes.
// Mock fixture lives at data/webmentions_by_article.json with /articles/test/
// as the seeded permalink (renamed to .example before Story 3.2 lands).
// =============================================================================

// Derive fixture-targeted article slug from data/webmentions_by_article.json so
// renames of the fixture article propagate automatically (data file is the
// source of truth — the test no longer hardcodes the slug). The first key in
// the data file is treated as THE fixture target; if multiple fixture entries
// exist later, only the first one drives the fixture-targeted assertions.
const webmentionFixtureKeys = Object.keys(
  JSON.parse(
    readFileSync(
      resolve(repoRoot, "data", "webmentions_by_article.json"),
      "utf8"
    )
  )
);
if (webmentionFixtureKeys.length === 0) {
  throw new Error(
    "data/webmentions_by_article.json has no entries — Story 2.4 tests require at least one fixture entry"
  );
}
const webmentionFixtureKeySet = new Set(webmentionFixtureKeys);
const fixtureSlugMatch = webmentionFixtureKeys[0].match(
  /^\/articles\/([^/]+)\/?$/
);
if (!fixtureSlugMatch) {
  throw new Error(
    `Unexpected webmention fixture key format (expected /articles/<slug>/): ${webmentionFixtureKeys[0]}`
  );
}
const webmentionFixtureSlug = fixtureSlugMatch[1];

test("Story 2.4 AC #1+#11: production article page emits <section id=\"webmentions\"> exactly once", () => {
  const result = spawnSync("hugo", hugoArgs, {
    cwd: repoRoot,
    encoding: "utf8",
    shell: process.platform === "win32",
  });
  assert.equal(result.status, 0, `Production build failed.\n${result.stderr}`);

  const articlesDir = resolve(testPublic, "articles");
  const articleSlug = readdirSync(articlesDir)
    .filter((entry) => !entry.startsWith("_test_"))
    .find((entry) => existsSync(resolve(articlesDir, entry, "index.html")));
  assert.ok(articleSlug, "Expected at least one non-fixture article to render");

  const articleHtml = readFileSync(
    resolve(articlesDir, articleSlug, "index.html"),
    "utf8"
  );
  const sectionMatches = articleHtml.match(/id=("?)webmentions\1/g) || [];
  assert.equal(
    sectionMatches.length,
    1,
    `<section id="webmentions"> must appear EXACTLY ONCE per article; got ${sectionMatches.length}`
  );
});

test("Story 2.4 AC #2+#3+#7: fixture-targeted article renders all four type-group headings + count line", () => {
  const result = spawnSync("hugo", hugoArgs, {
    cwd: repoRoot,
    encoding: "utf8",
    shell: process.platform === "win32",
  });
  assert.equal(result.status, 0, `Production build failed.\n${result.stderr}`);

  const articleHtml = readFileSync(
    resolve(testPublic, "articles", webmentionFixtureSlug, "index.html"),
    "utf8"
  );

  // AC #2: four type-groups, in order, with count badges from the fixture
  // (replies × 2, repost × 1, mention × 2, like × 1).
  assert.match(articleHtml, /Antworten \(2\)/, "Replies group heading must show count 2");
  assert.match(articleHtml, /Reposts \(1\)/, "Reposts group heading must show count 1");
  assert.match(articleHtml, /Erwähnungen \(2\)/, "Mentions group heading must show count 2");
  assert.match(articleHtml, /Likes \(1\)/, "Likes group heading must show count 1");

  // AC #7: reactions tile appears in the sidebar info widget, links to
  // #webmentions, with German plural ("Antworten" — total mentions in
  // fixture). The container class moved from .webmention-count-line to the
  // tile system (data-tile="reactions") in the 2026-05-09 sidebar redesign.
  assert.match(
    articleHtml,
    /data-tile="reactions"/,
    "Reactions tile must render on fixture-targeted article"
  );
  assert.match(
    articleHtml,
    /href="#webmentions"/,
    "Reactions tile must link to #webmentions anchor"
  );
  assert.match(
    articleHtml,
    /6 Antworten/,
    "Reactions tile must show total count (6) with German plural ('Antworten' for >1)"
  );

  // AC #3 sample: avatar rendered for replies that have author_photo.
  assert.match(
    articleHtml,
    /class="webmention__avatar"/,
    "Avatar img element must render for entries with author_photo"
  );
  // Reply text rendered only on type=reply (fixture's replies have content).
  assert.match(
    articleHtml,
    /class="webmention__content">Schöner Artikel/,
    "Reply text must render inside .webmention__content for type=reply entries"
  );
});

test("Story 2.4 AC #5: non-fixture article renders empty-state and omits count line", () => {
  const result = spawnSync("hugo", hugoArgs, {
    cwd: repoRoot,
    encoding: "utf8",
    shell: process.platform === "win32",
  });
  assert.equal(result.status, 0, `Production build failed.\n${result.stderr}`);

  // Pick any rendered article whose URL is NOT in the webmention fixture —
  // the empty-state path doesn't depend on which non-fixture article we use,
  // so we derive it from the actual build output.
  const articlesDir = resolve(testPublic, "articles");
  const nonFixtureSlug = readdirSync(articlesDir)
    .filter((slug) => !slug.startsWith("_test_"))
    .filter((slug) => existsSync(resolve(articlesDir, slug, "index.html")))
    .filter((slug) => !webmentionFixtureKeySet.has(`/articles/${slug}/`))
    .sort()[0];
  assert.ok(
    nonFixtureSlug,
    "Expected at least one non-fixture article in public-test/articles/ for empty-state assertion"
  );
  const articleHtml = readFileSync(
    resolve(articlesDir, nonFixtureSlug, "index.html"),
    "utf8"
  );

  assert.match(
    articleHtml,
    /class="webmentions__empty">Noch keine Antworten\./,
    "Non-fixture article must render the German empty-state message"
  );
  assert.match(
    articleHtml,
    /data-tile="reactions"/,
    "Non-fixture article must render the reactions tile (always visible)"
  );
  assert.match(
    articleHtml,
    /reactions-empty/,
    "Non-fixture article must render the empty-state anchor inside the reactions tile"
  );
  assert.doesNotMatch(
    articleHtml,
    /webmentions__group/,
    "Non-fixture article must NOT render any type-group sections"
  );
});

test("Story 2.4 AC #6: every <a> inside .webmention block carries rel with noopener+noreferrer+external and target=\"_blank\"", () => {
  const result = spawnSync("hugo", hugoArgs, {
    cwd: repoRoot,
    encoding: "utf8",
    shell: process.platform === "win32",
  });
  assert.equal(result.status, 0, `Production build failed.\n${result.stderr}`);

  const articleHtml = readFileSync(
    resolve(testPublic, "articles", webmentionFixtureSlug, "index.html"),
    "utf8"
  );

  // Pull out every <a class="webmention__author"> and <a class="webmention__source">
  // tag and confirm each declares the required rel + target attributes.
  const links = articleHtml.match(
    /<a class="webmention__(?:author|source)"[\s\S]*?>/g
  ) || [];
  assert.ok(
    links.length > 0,
    "Webmention author/source links must be present on fixture-targeted article"
  );
  const requiredRelTokens = ["noopener", "noreferrer", "external"];
  for (const link of links) {
    const relMatch = link.match(/\srel="([^"]*)"/);
    assert.ok(relMatch, `Webmention link missing rel attribute: ${link}`);
    const relTokens = new Set(relMatch[1].split(/\s+/).filter(Boolean));
    for (const token of requiredRelTokens) {
      assert.ok(
        relTokens.has(token),
        `Webmention link rel missing "${token}" token: ${link}`
      );
    }
    assert.match(
      link,
      /target="_blank"/,
      `Webmention link missing target="_blank": ${link}`
    );
  }
});

test("Story 2.4 AC #6 patch: empty author_url and empty published render <span> fallbacks (not broken <a href=\"\"> or invalid <time>—</time>)", () => {
  // The fixture's last mention entry has empty author_url, empty url, and
  // empty published — exercising all three guards added during Story 2.5 review:
  // - empty author_url → <span class="webmention__author">
  // - empty url        → <span class="webmention__source"> (no <a href="">)
  // - empty published  → <span>—</span> (no invalid <time>—</time> without datetime)
  const result = spawnSync("hugo", hugoArgs, {
    cwd: repoRoot,
    encoding: "utf8",
    shell: process.platform === "win32",
  });
  assert.equal(result.status, 0, `Production build failed.\n${result.stderr}`);

  const articleHtml = readFileSync(
    resolve(testPublic, "articles", webmentionFixtureSlug, "index.html"),
    "utf8"
  );

  // Pull out the Mentions group (the second one — the fallback fixture entry
  // has type=mention) and assert the fallback <span> elements are present.
  assert.match(
    articleHtml,
    /<span class="webmention__author">Anonymous Sender<\/span>/,
    "Empty author_url must render <span class=\"webmention__author\">, not <a href=\"\">"
  );
  assert.match(
    articleHtml,
    /<span class="webmention__source">[\s\S]*?<\/span>/,
    "Empty url must render <span class=\"webmention__source\">, not <a class=\"webmention__source\" href=\"\">"
  );
  // Empty published must render <span>—</span>, not <time>—</time>.
  // <time> without datetime and with non-machine-readable content ("—") is
  // invalid HTML per the spec.
  assert.doesNotMatch(
    articleHtml,
    /<time>—<\/time>/,
    "Empty published must NOT render bare <time>—</time> (invalid HTML — <time> requires datetime or machine-readable text content)"
  );

  // Regression guard for the empty-href bug: no webmention-block <a> may have
  // an empty href. (`<a href="">` reloads the current page on click.)
  const webmentionBlocks = articleHtml.match(
    /<article class="webmention"[\s\S]*?<\/article>/g
  ) || [];
  for (const block of webmentionBlocks) {
    assert.doesNotMatch(
      block,
      /<a [^>]*\bhref=""/,
      `Webmention block must not contain <a href=""> — page-reload bug. Block: ${block.slice(0, 200)}…`
    );
  }
});

test("Story 2.4 AC #8: webmention reply content is auto-escaped (XSS guard, no safeHTML)", () => {
  // Hugo's default auto-escape on `{{ .content }}` means any HTML in the source
  // becomes literal text. The fixture intentionally seeds plain-text replies,
  // but this test asserts the rendering pipeline does not unwrap HTML — even
  // if Story 3.2's processing pipeline ever produced sanitized HTML, we want a
  // template-level regression guard that catches an accidental `| safeHTML`.
  const result = spawnSync("hugo", hugoArgs, {
    cwd: repoRoot,
    encoding: "utf8",
    shell: process.platform === "win32",
  });
  assert.equal(result.status, 0, `Production build failed.\n${result.stderr}`);

  const articleHtml = readFileSync(
    resolve(testPublic, "articles", webmentionFixtureSlug, "index.html"),
    "utf8"
  );

  // The fixture's reply content "Schöner Artikel! Ich sehe das ähnlich." has
  // no HTML, so we cannot directly assert escape behavior on it. Instead,
  // confirm the surrounding <p class="webmention__content"> never contains a
  // raw <script> or <iframe> — these are the only ways a regression to
  // safeHTML would manifest in production data.
  const contentBlocks = articleHtml.match(
    /<p class="webmention__content">[\s\S]*?<\/p>/g
  ) || [];
  for (const block of contentBlocks) {
    assert.doesNotMatch(
      block,
      /<(?:script|iframe|object|embed)\b/i,
      `Reply content block must NOT contain raw script-like tags: ${block}`
    );
  }
});

// =============================================================================
// Story 2.5: Privacy Policy Page
//
// Asserts the rewritten content/pages/datenschutz.md renders the three
// engagement-flow sections (Umami, Hearts, Webmentions), the "Was diese Seite
// NICHT tut" posture statement, the contact-with-DSGVO-rights section, that
// obsolete sections (Spotify, "Datenschutz auf einen Blick") were removed, that
// the page retains its noindex meta + sitemap exclusion (robotsdisallow: true),
// and that the footer link from a representative non-privacy page still resolves
// to /pages/datenschutz/ (AC #4 regression check).
// =============================================================================

test("Story 2.5 AC #2: privacy page renders Umami, Hearts, and Webmentions section headings", () => {
  const result = spawnSync("hugo", hugoArgs, {
    cwd: repoRoot,
    encoding: "utf8",
    shell: process.platform === "win32",
  });
  assert.equal(result.status, 0, `Production build failed.\n${result.stderr}`);

  const html = readFileSync(
    resolve(testPublic, "pages", "datenschutz", "index.html"),
    "utf8"
  );
  assert.match(
    html,
    /<h2 id="?anonyme-analyse-mit-umami"?[^>]*>\s*Anonyme Analyse mit Umami/,
    "Privacy page must render the Umami section H2"
  );
  assert.match(
    html,
    /<h2 id="?herz-reaktionen"?[^>]*>\s*Herz-Reaktionen/,
    "Privacy page must render the Hearts section H2"
  );
  assert.match(
    html,
    /<h2 id="?webmentions"?[^>]*>\s*Webmentions/,
    "Privacy page must render the Webmentions section H2"
  );
});

test("Story 2.5 AC #3+#5: privacy page renders posture statement and contact-with-DSGVO-rights sections", () => {
  const result = spawnSync("hugo", hugoArgs, {
    cwd: repoRoot,
    encoding: "utf8",
    shell: process.platform === "win32",
  });
  assert.equal(result.status, 0, `Production build failed.\n${result.stderr}`);

  const html = readFileSync(
    resolve(testPublic, "pages", "datenschutz", "index.html"),
    "utf8"
  );
  assert.match(
    html,
    /<h2 id="?was-diese-seite-nicht-tut"?[^>]*>\s*Was diese Seite NICHT tut/,
    "Privacy page must render the posture statement section (AC #3)"
  );
  assert.match(
    html,
    // `id` slug accepts both `für` and `fur` so the test survives Hugo slugify
    // changes / `removePathAccents: true` — the heading content remains the
    // authoritative assertion.
    /<h2 id="?kontakt-f[üu]r-datenschutzanfragen"?[^>]*>\s*Kontakt für Datenschutzanfragen/,
    "Privacy page must render the contact section (AC #5)"
  );
  // Each of the seven DSGVO rights articles must be cited (Art. 15-21 + Art. 77).
  for (const article of ["Art. 15", "Art. 16", "Art. 17", "Art. 18", "Art. 20", "Art. 21", "Art. 77"]) {
    assert.ok(
      html.includes(article),
      `Privacy page contact section must cite ${article}`
    );
  }

  // Email-obfuscation regression guard (Story 2.5 review patch): the literal
  // `[at]` / `[dot]` form must survive Goldmark intact — no mailto autolink,
  // no entity-decoded plain "@", no transformation to a clickable link. A
  // future Goldmark upgrade or markup-extras change that re-enables square-
  // bracket-aware linkification would silently defeat the obfuscation.
  assert.match(
    html,
    /mail \[at\] article-time \[dot\] de/,
    "Privacy page contact email must render literally as 'mail [at] article-time [dot] de' (obfuscation intact)"
  );
  assert.doesNotMatch(
    html,
    /mailto:mail@article-time\.de/,
    "Privacy page contact email must NOT be auto-linked to mailto:mail@article-time.de (would defeat obfuscation)"
  );
  assert.doesNotMatch(
    html,
    /\bmail@article-time\.de\b/,
    "Privacy page must NOT render the unobfuscated address 'mail@article-time.de' anywhere (markdown entity-decode regression)"
  );
});

test("Story 2.5 AC #7: privacy page no longer mentions Spotify (removed obsolete section)", () => {
  const result = spawnSync("hugo", hugoArgs, {
    cwd: repoRoot,
    encoding: "utf8",
    shell: process.platform === "win32",
  });
  assert.equal(result.status, 0, `Production build failed.\n${result.stderr}`);

  const html = readFileSync(
    resolve(testPublic, "pages", "datenschutz", "index.html"),
    "utf8"
  );
  assert.doesNotMatch(
    html,
    /Spotify/i,
    "Privacy page must NOT contain the obsolete Spotify section (no Spotify embeds in current codebase)"
  );
  // The standalone "Datenschutz auf einen Blick" intro was replaced by "Auf einen Blick".
  assert.doesNotMatch(
    html,
    /Datenschutz auf einen Blick/,
    "Privacy page must NOT carry the legacy intro heading 'Datenschutz auf einen Blick' (replaced by 'Auf einen Blick')"
  );
});

test("Story 2.5 AC #8: privacy page retains noindex meta and is excluded from sitemap (robotsdisallow: true)", () => {
  const result = spawnSync("hugo", hugoArgs, {
    cwd: repoRoot,
    encoding: "utf8",
    shell: process.platform === "win32",
  });
  assert.equal(result.status, 0, `Production build failed.\n${result.stderr}`);

  const html = readFileSync(
    resolve(testPublic, "pages", "datenschutz", "index.html"),
    "utf8"
  );
  assert.match(
    html,
    /<meta name="?robots"? content="noindex/,
    "Privacy page must emit a noindex robots meta (robotsdisallow: true frontmatter)"
  );

  const sitemapPath = resolve(testPublic, "sitemap.xml");
  assert.ok(existsSync(sitemapPath), "sitemap.xml must exist");
  const sitemap = readFileSync(sitemapPath, "utf8");
  assert.doesNotMatch(
    sitemap,
    /\/pages\/datenschutz\//,
    "sitemap.xml must NOT include /pages/datenschutz/ (robotsdisallow excludes it)"
  );
});

test("Story 2.5 AC #8 (regression guard): every page emitting noindex robots meta is excluded from sitemap.xml", () => {
  // Behavioural assertion across ALL pages with effective `robotsdisallow: true`,
  // not just /pages/datenschutz/. Catches regressions where the sitemap template's
  // `{{ if not .Params.robotsdisallow }}` gate breaks for other pages while the
  // head.html noindex meta keeps working (or vice versa).
  const result = spawnSync("hugo", hugoArgs, {
    cwd: repoRoot,
    encoding: "utf8",
    shell: process.platform === "win32",
  });
  assert.equal(result.status, 0, `Production build failed.\n${result.stderr}`);

  const sitemapPath = resolve(testPublic, "sitemap.xml");
  assert.ok(existsSync(sitemapPath), "sitemap.xml must exist");
  const sitemap = readFileSync(sitemapPath, "utf8");

  // Parse `<loc>https://host/path/</loc>` values into a Set of host-relative paths.
  const sitemapPaths = new Set(
    [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) =>
      m[1].replace(/^https?:\/\/[^/]+/, "")
    )
  );

  // Walk public-test/ for every rendered index.html, collect host-relative URLs
  // whose HTML emits the noindex robots meta.
  function* walkIndexHtml(dir) {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = resolve(dir, entry.name);
      if (entry.isDirectory()) {
        yield* walkIndexHtml(full);
      } else if (entry.isFile() && entry.name === "index.html") {
        yield full;
      }
    }
  }

  const noindexRegex = /<meta name="?robots"? content="noindex/;
  const noindexUrls = [];
  for (const file of walkIndexHtml(testPublic)) {
    const html = readFileSync(file, "utf8");
    if (noindexRegex.test(html)) {
      const rel = file
        .slice(testPublic.length)
        .replace(/\\/g, "/")
        .replace(/\/index\.html$/, "/");
      noindexUrls.push(rel === "" ? "/" : rel);
    }
  }

  // Sanity: if no noindex pages render at all, the test is a no-op (something
  // upstream silently broke noindex emission). Fail loudly instead.
  assert.ok(
    noindexUrls.length > 0,
    "Expected at least one rendered page with noindex robots meta — none found, test would be a no-op"
  );

  const leaks = noindexUrls.filter((url) => sitemapPaths.has(url));
  assert.deepEqual(
    leaks,
    [],
    `sitemap.xml leaks noindex pages (sitemap-exclusion gate broken for these): ${leaks.join(", ")}`
  );
});

test("Story 2.5 AC #4: footer on a representative non-privacy page still links to /pages/datenschutz/", () => {
  const result = spawnSync("hugo", hugoArgs, {
    cwd: repoRoot,
    encoding: "utf8",
    shell: process.platform === "win32",
  });
  assert.equal(result.status, 0, `Production build failed.\n${result.stderr}`);

  // Sample the homepage footer-menu region. Story 2.5 changed only markdown
  // content; the menu wiring must remain intact.
  const homeHtml = readFileSync(resolve(testPublic, "index.html"), "utf8");
  assert.match(
    homeHtml,
    /<a href="?\/pages\/datenschutz\/"?[^>]*>Datenschutz<\/a>/,
    "Homepage footer must still link to /pages/datenschutz/ (AC #4 regression guard)"
  );
});

// =============================================================================
// Story 2.7: Cookie-Banner UI
//
// Asserts the banner partial is rendered on indexable pages (home, articles),
// suppressed via `robotsdisallow: true` on transparency pages (datenschutz,
// impressum), that its vanilla-JS dismissal logic survives bundle concat +
// minify, and that the full ARIA wiring (role/aria-modal/labelledby/
// describedby/live) is intact on the rendered home banner.
// =============================================================================

test("Story 2.7 AC #1+#7: production homepage renders <div id=\"cookie-banner\" hidden ...> exactly once", () => {
  const result = spawnSync("hugo", hugoArgs, {
    cwd: repoRoot,
    encoding: "utf8",
    shell: process.platform === "win32",
  });
  assert.equal(result.status, 0, `Production build failed.\n${result.stderr}`);

  const homeHtml = readFileSync(resolve(testPublic, "index.html"), "utf8");
  const matches = homeHtml.match(/<div id="cookie-banner"\s+hidden/g) || [];
  assert.equal(
    matches.length,
    1,
    `Homepage must render the cookie-banner block EXACTLY ONCE; got ${matches.length}`
  );
});

test("Story 2.7 AC #1+#7: production article page also renders the cookie-banner block", () => {
  const result = spawnSync("hugo", hugoArgs, {
    cwd: repoRoot,
    encoding: "utf8",
    shell: process.platform === "win32",
  });
  assert.equal(result.status, 0, `Production build failed.\n${result.stderr}`);

  const articlesDir = resolve(testPublic, "articles");
  if (!existsSync(articlesDir)) {
    assert.fail("articles/ dir missing from build output — run a full production build first");
  }
  const articleSlug = readdirSync(articlesDir)
    .filter((entry) => !entry.startsWith("_test_"))
    .find((entry) => existsSync(resolve(articlesDir, entry, "index.html")));
  assert.ok(articleSlug, "Expected at least one non-fixture article to render");

  const articleHtml = readFileSync(
    resolve(articlesDir, articleSlug, "index.html"),
    "utf8"
  );
  assert.match(
    articleHtml,
    /<div id="cookie-banner"\s+hidden/,
    "Article page must render the cookie-banner block (site-wide via baseof.html partial)"
  );
});

test("Story 2.7 AC #7: cookie-banner is suppressed on suppress_banner pages (datenschutz, impressum)", () => {
  const result = spawnSync("hugo", hugoArgs, {
    cwd: repoRoot,
    encoding: "utf8",
    shell: process.platform === "win32",
  });
  assert.equal(result.status, 0, `Production build failed.\n${result.stderr}`);

  for (const slug of ["datenschutz", "impressum"]) {
    const pagePath = resolve(testPublic, "pages", slug, "index.html");
    assert.ok(existsSync(pagePath), `${slug} page must exist in build output`);
    const html = readFileSync(pagePath, "utf8");
    assert.ok(
      !html.includes('id="cookie-banner"'),
      `pages/${slug}/ must NOT render the cookie-banner block (suppress_banner: true gates it server-side)`
    );
  }
});

test("Story 2.7 AC #2+#4: cookie-banner-dismissed flag survives gdpr.js minification + concat into bundle.js", () => {
  const result = spawnSync("hugo", hugoArgs, {
    cwd: repoRoot,
    encoding: "utf8",
    shell: process.platform === "win32",
  });
  assert.equal(result.status, 0, `Production build failed.\n${result.stderr}`);

  // Resolve the active head-bundle filename from the homepage's <script src=...>
  // (avoids matching stale fingerprints from earlier test builds).
  const homeHtml = readFileSync(resolve(testPublic, "index.html"), "utf8");
  const scriptMatch = homeHtml.match(
    /<script[^>]*src="([^"]*bundle\.min\.[^"]+\.js)"/
  );
  assert.ok(scriptMatch, "Homepage must reference the fingerprinted bundle.min.<hash>.js (head bundle)");

  const srcPath = scriptMatch[1];
  const bundleFilename = srcPath.split("/").pop();
  const bundlePath = resolve(testPublic, "js", bundleFilename);
  assert.ok(existsSync(bundlePath), `Active head bundle must exist at ${bundlePath}`);

  const bundle = readFileSync(bundlePath, "utf8");
  assert.match(
    bundle,
    /cookie-banner-dismissed/,
    "Head bundle must contain the 'cookie-banner-dismissed' sessionStorage key from gdpr.js (Story 2.7)"
  );
});

test("Story 2.7 AC #6: rendered banner carries full ARIA wiring (role, modal, labelledby, describedby, live)", () => {
  const result = spawnSync("hugo", hugoArgs, {
    cwd: repoRoot,
    encoding: "utf8",
    shell: process.platform === "win32",
  });
  assert.equal(result.status, 0, `Production build failed.\n${result.stderr}`);

  const homeHtml = readFileSync(resolve(testPublic, "index.html"), "utf8");
  // Capture the opening <div id="cookie-banner" ...> tag (everything up to the
  // first '>' that closes it). Multiline because attributes wrap.
  const tagMatch = homeHtml.match(/<div id="cookie-banner"[\s\S]*?>/);
  assert.ok(tagMatch, "Homepage must render the cookie-banner opening tag");
  const tag = tagMatch[0];

  for (const needle of [
    'role="dialog"',
    'aria-modal="false"',
    'aria-labelledby="cookie-banner-title"',
    'aria-describedby="cookie-banner-text"',
    'aria-live="polite"',
  ]) {
    assert.ok(
      tag.includes(needle),
      `cookie-banner opening tag must include ${needle} (AC #6)`
    );
  }
});
