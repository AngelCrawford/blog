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
// `hugo server` running on `public/` while the suite builds. Fixture builds use
// `public-test-fixture/` and dev-environment builds `public-test-dev/`, so the
// three never clobber each other's output between assertions.
//
// (Historically the split was mandatory: on Windows/NTFS hugo's static-file copy
// fails with "directory not empty" when another process holds a file open. The
// repo now lives on ext4 under WSL2 and CI runs on Linux, so that constraint is
// gone — the separation is kept purely for test isolation.)

import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { copyFileSync, mkdirSync, rmSync, existsSync, readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
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

// Fixture builds (runHugoWithFixture) write to a SEPARATE destination so they
// never clobber the shared production output in `public-test` that the
// output-assertion tests read.
const fixtureArgs = [
  "--logLevel",
  "error",
  "--environment",
  "production",
  "--destination",
  resolve(repoRoot, "public-test-fixture"),
];

// Memoized build runner. The suite runs serially (`--test-concurrency 1`), so
// the first call for a given args set runs `hugo` once and every later call
// with the same args reuses the cached result — collapsing ~30 identical
// production builds into a single one. Fixture builds vary their content per
// call and therefore bypass this (they call spawnSync directly).
const buildCache = new Map();
function runBuild(args) {
  const key = args.join(" ");
  if (!buildCache.has(key)) {
    buildCache.set(
      key,
      spawnSync("hugo", args, {
        cwd: repoRoot,
        encoding: "utf8",
        shell: process.platform === "win32",
      })
    );
  }
  return buildCache.get(key);
}

// For content-mutating tests (those that drop temp fixtures into content/ before
// building and then read public-test): build FRESH so the temp content is
// present, then drop the memoized production build so the next runBuild() makes
// a clean public-test again. Lets these tests keep reading public-test unchanged.
function freshBuild() {
  const result = spawnSync("hugo", hugoArgs, {
    cwd: repoRoot,
    encoding: "utf8",
    shell: process.platform === "win32",
  });
  buildCache.delete(hugoArgs.join(" "));
  return result;
}

function runHugoWithFixture(fixtureFile, slug) {
  const tempSection = `_test_growth_stage_${slug}`;
  const tempDir = resolve(repoRoot, "content", tempSection);
  const tempIndex = resolve(tempDir, "index.md");

  mkdirSync(tempDir, { recursive: true });
  copyFileSync(resolve(fixturesDir, fixtureFile), tempIndex);

  try {
    // NOTE: --quiet suppresses errorf output, which we need to assert on.
    // We use --logLevel error to keep noise low while preserving error messages.
    // Builds to a separate destination (fixtureArgs) and bypasses runBuild —
    // each fixture has different content, so these must not be memoized.
    const result = spawnSync("hugo", fixtureArgs, {
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
  const result = runBuild(hugoArgs);
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
    const result = freshBuild();
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
  const result = runBuild(hugoArgs);
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
  const result = runBuild(hugoArgs);
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
  const result = runBuild(devArgs);
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
  const result = runBuild(hugoArgs);
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

test("Story 2.3 AC #7: development build ALSO emits the webmention <link> (no hugo.IsProduction gate)", () => {
  const testPublicDev = resolve(repoRoot, "public-test-dev");
  // No teardown here: both dev tests share the same memoized runBuild(devArgs)
  // output; deleting it would leave the second test with no files to read.
  const devArgs = [
    "--logLevel",
    "error",
    "--environment",
    "development",
    "--destination",
    testPublicDev,
  ];
  const result = runBuild(devArgs);
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
  const result = runBuild(hugoArgs);
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
// Asserts the heart-button partial renders on article single pages and on note
// cards (notes have no detail pages — cascade.build.render: link in
// content/notes/_index.md), with the right `data-article` attribute and a
// non-failing data-file lookup (`| default 0`). Also asserts hearts.js is
// concatenated into the production footerBundle.js fingerprinted output.
// =============================================================================

test("Story 2.2 AC #1+#2+#6: production article page renders heart-button with data-article, aria-label, and count", () => {
  const result = runBuild(hugoArgs);
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
  // any position of the class list — same pattern as the note-card heart test
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

test("Story 2.2 AC #3+#9: hearts.js is bundled into footerBundle.js (localStorage prefix smoke)", () => {
  const result = runBuild(hugoArgs);
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
const fixtureSlugMatch = webmentionFixtureKeys[0].match(
  /^\/articles\/([^/]+)\/?$/
);
if (!fixtureSlugMatch) {
  throw new Error(
    `Unexpected webmention fixture key format (expected /articles/<slug>/): ${webmentionFixtureKeys[0]}`
  );
}
const webmentionFixtureSlug = fixtureSlugMatch[1];

test("Story 2.4 AC #6: every <a> inside .webmention block carries rel with noopener+noreferrer+external and target=\"_blank\"", () => {
  const result = runBuild(hugoArgs);
  assert.equal(result.status, 0, `Production build failed.\n${result.stderr}`);

  const articleHtml = readFileSync(
    resolve(testPublic, "articles", webmentionFixtureSlug, "index.html"),
    "utf8"
  );

  // Pull out every <a class="webmention__author"> and <a class="webmention__source">
  // tag and confirm each declares the required rel + target attributes.
  const links = articleHtml.match(
    /<a class="webmention__(?:author|source)[^"]*"[\s\S]*?>/g
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

test("Story 2.4 AC #8: webmention reply content is auto-escaped (XSS guard, no safeHTML)", () => {
  // Hugo's default auto-escape on `{{ .content }}` means any HTML in the source
  // becomes literal text. The fixture intentionally seeds plain-text replies,
  // but this test asserts the rendering pipeline does not unwrap HTML — even
  // if Story 3.2's processing pipeline ever produced sanitized HTML, we want a
  // template-level regression guard that catches an accidental `| safeHTML`.
  const result = runBuild(hugoArgs);
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
    /<p class="webmention__content[^"]*">[\s\S]*?<\/p>/g
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

test("Story 2.5 AC #8 (regression guard): every page emitting noindex robots meta is excluded from sitemap.xml", () => {
  // Behavioural assertion across ALL pages with effective `robotsdisallow: true`,
  // not just /pages/datenschutz/. Catches regressions where the sitemap template's
  // `{{ if not .Params.robotsdisallow }}` gate breaks for other pages while the
  // head.html noindex meta keeps working (or vice versa).
  const result = runBuild(hugoArgs);
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
  const result = runBuild(hugoArgs);
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
  const result = runBuild(hugoArgs);
  assert.equal(result.status, 0, `Production build failed.\n${result.stderr}`);

  const homeHtml = readFileSync(resolve(testPublic, "index.html"), "utf8");
  const matches = homeHtml.match(/<div id="cookie-banner"\s+hidden/g) || [];
  assert.equal(
    matches.length,
    1,
    `Homepage must render the cookie-banner block EXACTLY ONCE; got ${matches.length}`
  );
});

test("Story 2.7 AC #7: cookie-banner is suppressed on suppress_banner pages (datenschutz, impressum)", () => {
  const result = runBuild(hugoArgs);
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

test("Story 2.7 AC #2+#4: cookie-banner-dismissed flag survives gdpr.js minification + concat into the bundle", () => {
  const result = runBuild(hugoArgs);
  assert.equal(result.status, 0, `Production build failed.\n${result.stderr}`);

  // Resolve the active bundle from the homepage's <script src=…> rather than
  // globbing js/ — that would match stale fingerprints from earlier builds.
  //
  // THE BUNDLE THIS LOOKED FOR USED TO BE A DIFFERENT ONE. gdpr.js rode a
  // render-blocking `bundle.min.<hash>.js` in <head>, which existed only
  // because it needed jQuery loaded first. It is vanilla now and sits in the
  // deferred footerBundle with everything else; jQuery is deleted. Hence also
  // the second assertion: there must be exactly one script, and it must defer.
  const homeHtml = readFileSync(resolve(testPublic, "index.html"), "utf8");
  // Local scripts only. The production build also emits Umami's, which is
  // third-party, `async defer`, and not this test's business.
  const scripts = [...homeHtml.matchAll(/<script[^>]*\ssrc="(\/[^"]+)"[^>]*>/g)];
  assert.equal(
    scripts.length,
    1,
    `Expected exactly one first-party script on the homepage, found ${scripts.length}: ` +
      scripts.map((m) => m[1]).join(", ")
  );
  assert.match(
    scripts[0][0],
    /\sdefer\b/,
    "The one script on the page must be deferred — nothing renders-blocks any more"
  );

  const srcPath = scripts[0][1];
  assert.match(
    srcPath,
    /footerBundle\.min\.[^/]+\.js$/,
    `Expected the fingerprinted footerBundle, got ${srcPath}`
  );

  const bundlePath = resolve(testPublic, "js", srcPath.split("/").pop());
  assert.ok(existsSync(bundlePath), `Active bundle must exist at ${bundlePath}`);

  const bundle = readFileSync(bundlePath, "utf8");
  assert.match(
    bundle,
    /cookie-banner-dismissed/,
    "Bundle must contain the 'cookie-banner-dismissed' sessionStorage key from gdpr.js (Story 2.7)"
  );
  assert.doesNotMatch(
    bundle,
    /jQuery|\bjquery\b/i,
    "jQuery is deleted — nothing may drag it back into the bundle"
  );
});

// =============================================================================
// PurgeCSS regression guard — BEHAVIOUR, not byte budget.
//
// The production build runs PurgeCSS (postcss.config.js, gated on
// HUGO_ENVIRONMENT=production, which `hugo --environment production` sets for
// the postcss subprocess). Rather than asserting an absolute size (fragile —
// would trip on legitimate CSS growth), we assert that PurgeCSS DID ITS JOB:
// Bulma component classes the site never uses (.breadcrumb/.tabs/.panel-block)
// must be stripped. They exist in the full ~870 KB dev bundle but must be
// absent here. If PurgeCSS silently stops running, full Bulma ships and they
// reappear — independent of how much custom CSS is added.
// =============================================================================

test("PurgeCSS strips unused Bulma component classes from production CSS", () => {
  const result = runBuild(hugoArgs);
  assert.equal(result.status, 0, `Production build failed.\n${result.stderr}`);

  // Newest fingerprinted bundle (Hugo never GCs old ones in public-test, so a
  // few accumulate — all are purged; pick the most recent deterministically).
  const cssFiles = readdirSync(testPublic)
    .filter((f) => /^style\.min\..*\.css$/.test(f))
    .map((f) => resolve(testPublic, f));
  assert.ok(
    cssFiles.length >= 1,
    "Expected a fingerprinted style.min.*.css in public-test"
  );
  const newest = cssFiles.sort(
    (a, b) => statSync(b).mtimeMs - statSync(a).mtimeMs
  )[0];
  const css = readFileSync(newest, "utf8");

  for (const unused of ["breadcrumb", "tabs", "panel-block"]) {
    assert.doesNotMatch(
      css,
      new RegExp(`\\.${unused}\\b`),
      `Unused Bulma class ".${unused}" is present in production CSS — PurgeCSS appears not to be running (the full ~870 KB Bulma bundle is shipping).`
    );
  }
});
