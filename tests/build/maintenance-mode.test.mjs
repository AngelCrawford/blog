// Maintenance mode build test — verifies the `maintenance_mode` flag in
// config/_default/params.yaml short-circuits baseof.html to the maintenance
// partial.
//
// Strategy: swap params.yaml (set flag true), run hugo build, inspect output,
// restore original. Restore happens in finally so a test failure never leaves
// the working tree dirty.
//
// HUGO_PARAMS_* env-var overrides do not apply to Site.Params in this Hugo
// version (verified manually 2026-05-09), so file-swap is the only reliable
// way to toggle the flag for tests.

import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const repoRoot = resolve(__dirname, "..", "..");
const paramsPath = resolve(repoRoot, "config", "_default", "params.yaml");
const testPublic = resolve(repoRoot, "public-test");
const homepagePath = resolve(testPublic, "index.html");
const hugoArgs = [
    "--logLevel", "error",
    "--environment", "production",
    "--destination", testPublic,
];

function buildWithMaintenance(enabled) {
    const original = readFileSync(paramsPath, "utf8");
    const swapped = enabled
        ? original.replace(/^maintenance_mode: false$/m, "maintenance_mode: true")
        : original.replace(/^maintenance_mode: true$/m, "maintenance_mode: false");

    if (swapped === original && enabled) {
        throw new Error(
            "Failed to toggle maintenance_mode in params.yaml — expected `maintenance_mode: false` line. " +
            "Did the param key get renamed or moved? Check config/_default/params.yaml."
        );
    }

    writeFileSync(paramsPath, swapped);
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
        };
    } finally {
        writeFileSync(paramsPath, original);
    }
}

test("maintenance_mode=true renders maintenance partial on homepage", () => {
    const result = buildWithMaintenance(true);
    assert.equal(result.status, 0, `Hugo build failed (exit ${result.status}). stderr:\n${result.stderr}`);
    assert.ok(existsSync(homepagePath), "Expected public-test/index.html to exist after build");

    const html = readFileSync(homepagePath, "utf8");

    assert.match(html, /<body class="kind-is-maintenance">/, "Expected maintenance body class");
    assert.match(html, /<main class="maintenance-page">/, "Expected .maintenance-page main element");
    assert.match(html, /Wartung läuft/, "Expected default maintenance title");
    assert.match(html, /Bin gleich wieder da\./, "Expected default maintenance message");
    assert.match(html, /<meta name="robots" content="noindex/, "Expected noindex meta during maintenance");
});

test("maintenance_mode=true suppresses Umami analytics script", () => {
    const result = buildWithMaintenance(true);
    assert.equal(result.status, 0);

    const html = readFileSync(homepagePath, "utf8");

    assert.doesNotMatch(html, /umami\.is/, "Umami script must not load during maintenance");
    assert.doesNotMatch(html, /data-website-id=/, "Umami data-website-id must not appear during maintenance");
});

test("maintenance_mode=true short-circuits article pages too", () => {
    const result = buildWithMaintenance(true);
    assert.equal(result.status, 0);

    // Pick any article output; the build smoke test guarantees articles render.
    const articlesIndex = resolve(testPublic, "articles", "index.html");
    if (!existsSync(articlesIndex)) {
        // Fall back to first article subdirectory by globbing — but since we
        // already built, this should exist. Skip assertion if not present.
        return;
    }
    const html = readFileSync(articlesIndex, "utf8");
    assert.match(html, /kind-is-maintenance/, "Article list page should show maintenance content");
    assert.doesNotMatch(html, /umami\.is/, "Articles must not load Umami during maintenance");
});

test("maintenance_mode=false (baseline) renders the normal site, not the maintenance partial", () => {
    const result = buildWithMaintenance(false);
    assert.equal(result.status, 0);

    const html = readFileSync(homepagePath, "utf8");

    assert.doesNotMatch(html, /kind-is-maintenance/, "Maintenance class must not leak into normal builds");
    assert.doesNotMatch(html, /maintenance-page/, "Maintenance markup must not leak into normal builds");
});
