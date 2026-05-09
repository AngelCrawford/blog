// Maintenance mode build test — verifies `--environment maintenance` activates
// the maintenance partial AND prevents RSS/sitemap/taxonomy generation.
//
// The sentinel file at repo root is the production trigger (detected by
// daily-rebuild.yml); these tests skip the sentinel and pass `--environment
// maintenance` directly to assert the build's actual behaviour.

import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync, existsSync, rmSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const repoRoot = resolve(__dirname, "..", "..");
const testPublic = resolve(repoRoot, "public-test");
const homepagePath = resolve(testPublic, "index.html");

function buildWithEnvironment(environment) {
    // Clean slate so absence assertions (RSS/sitemap not built) are meaningful.
    rmSync(testPublic, { recursive: true, force: true });
    const result = spawnSync(
        "hugo",
        [
            "--logLevel", "error",
            "--environment", environment,
            "--destination", testPublic,
        ],
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
}

test("--environment maintenance renders maintenance partial on homepage", () => {
    const result = buildWithEnvironment("maintenance");
    assert.equal(result.status, 0, `Hugo build failed (exit ${result.status}). stderr:\n${result.stderr}`);
    assert.ok(existsSync(homepagePath), "Expected public-test/index.html to exist after build");

    const html = readFileSync(homepagePath, "utf8");

    assert.match(html, /<body class="kind-is-maintenance">/, "Expected maintenance body class");
    assert.match(html, /<main class="maintenance-page">/, "Expected .maintenance-page main element");
    assert.match(html, /Wartung läuft/, "Expected default maintenance title");
    assert.match(html, /Bin gleich wieder da\./, "Expected default maintenance message");
    assert.match(html, /<meta name="robots" content="noindex/, "Expected noindex meta during maintenance");
});

test("--environment maintenance suppresses Umami analytics script", () => {
    const result = buildWithEnvironment("maintenance");
    assert.equal(result.status, 0);

    const html = readFileSync(homepagePath, "utf8");

    assert.doesNotMatch(html, /umami\.is/, "Umami script must not load during maintenance");
    assert.doesNotMatch(html, /data-website-id=/, "Umami data-website-id must not appear during maintenance");
});

test("--environment maintenance disables RSS, sitemap, robots.txt, taxonomy", () => {
    const result = buildWithEnvironment("maintenance");
    assert.equal(result.status, 0);

    // disableKinds entries from config/maintenance/config.yaml — verify each
    // expected output file is absent. (RSS lives at index.xml, sitemap at
    // sitemap.xml, robots.txt at robots.txt, taxonomy listings under /authors/, /categories/.)
    assert.ok(!existsSync(resolve(testPublic, "index.xml")), "RSS feed (index.xml) must not be built during maintenance");
    assert.ok(!existsSync(resolve(testPublic, "sitemap.xml")), "sitemap.xml must not be built during maintenance");
    assert.ok(!existsSync(resolve(testPublic, "robots.txt")), "robots.txt must not be built during maintenance");
    assert.ok(!existsSync(resolve(testPublic, "authors")), "Author taxonomy listing must not be built during maintenance");
    assert.ok(!existsSync(resolve(testPublic, "categories")), "Category taxonomy listing must not be built during maintenance");
});

test("--environment maintenance still routes article URLs through maintenance partial", () => {
    const result = buildWithEnvironment("maintenance");
    assert.equal(result.status, 0);

    const articlesIndex = resolve(testPublic, "articles", "index.html");
    if (!existsSync(articlesIndex)) {
        // Section listings might be skipped in some site configurations; only assert when present.
        return;
    }
    const html = readFileSync(articlesIndex, "utf8");
    assert.match(html, /kind-is-maintenance/, "Article section landing should serve maintenance content");
    assert.doesNotMatch(html, /umami\.is/, "Articles must not load Umami during maintenance");
});

test("--environment production (baseline) renders the normal site, not the maintenance partial", () => {
    const result = buildWithEnvironment("production");
    assert.equal(result.status, 0);

    const html = readFileSync(homepagePath, "utf8");

    assert.doesNotMatch(html, /kind-is-maintenance/, "Maintenance class must not leak into normal builds");
    assert.doesNotMatch(html, /maintenance-page/, "Maintenance markup must not leak into normal builds");
    // Sanity: production build DOES emit RSS + sitemap.
    assert.ok(existsSync(resolve(testPublic, "index.xml")), "Production build must emit RSS feed");
    assert.ok(existsSync(resolve(testPublic, "sitemap.xml")), "Production build must emit sitemap.xml");
});
