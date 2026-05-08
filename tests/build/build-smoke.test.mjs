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
import { copyFileSync, mkdirSync, rmSync, existsSync, readFileSync, writeFileSync } from "node:fs";
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
  // Pull out the <div class="serie widget ..."> block only, so assertions don't
  // accidentally match the related-articles widget or other parts of the page.
  // Terminated at </ol>\s*</div> rather than bare </ol> to survive nested <ol>
  // elements that may be added inside list items in the future.
  const match = html.match(/<div class="serie widget[^"]*">[\s\S]*?<\/ol>\s*<\/div>/);
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

  assert.match(
    widget,
    /Smoke Series \(3\)/,
    "Series count must include all members, including withered"
  );
  assert.match(
    widget,
    /class="is-withered"/,
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
    /<li class="is-active">[\s\S]*?Series Smoke Part 1/,
    "Current non-withered article must be marked is-active"
  );
});

test("Story 1.3 series: withered article is marked active in its own series widget (regression)", () => {
  // Same three articles. On B's page (withered, direct URL):
  // - count must be 3 (current page is included even though withered)
  // - B must be is-active
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

  assert.match(
    widget,
    /Smoke Series 2 \(3\)/,
    "Series count on the withered page itself must include all members"
  );
  assert.match(
    widget,
    /class="is-active is-withered"/,
    "Withered current page must carry both is-active and is-withered classes"
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

  assert.match(widget, /Clean Series \(3\)/, "All-non-withered series must show count=3");
  assert.match(widget, /Clean Series Part 1/, "Part 1 must appear in the widget");
  assert.match(
    widget,
    /<li class="is-active">Clean Series Part 2/,
    "Current page (s3b) must be is-active"
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
