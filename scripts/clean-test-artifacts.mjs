#!/usr/bin/env node
/**
 * Removes the scratch directories the test suites build into.
 *
 * Wired up as npm `posttest` hooks, which npm runs ONLY when the test command
 * succeeded. That is deliberate: on failure the Playwright report and the
 * rendered HTML in public-test/ are exactly what you need to debug, so they
 * survive. On success they are dead weight — tens of megabytes of duplicated
 * build output cluttering the file tree and slowing editor search.
 *
 * NOT touched:
 *   public/     the dev server's own output; yours, not the suite's
 *   resources/  Hugo's asset cache — deleting it makes every later build slower
 */
import { existsSync, readdirSync, rmSync, statSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const TARGETS = [
  "public-test", // Playwright's static server root
  "public-test-dev", // build-smoke: development-environment builds
  "public-test-fixture", // build-smoke: temporary-content builds
  "test-results", // Playwright per-test artifacts
  "playwright-report", // Playwright HTML report
];

function dirSize(dir) {
  let total = 0;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = resolve(dir, entry.name);
    try {
      if (entry.isDirectory()) total += dirSize(full);
      else if (entry.isFile()) total += statSync(full).size;
    } catch {
      // Raced with removal, or a dangling symlink. The size is cosmetic.
    }
  }
  return total;
}

const removed = [];
let freed = 0;

for (const name of TARGETS) {
  const dir = resolve(repoRoot, name);
  if (!existsSync(dir) || !statSync(dir).isDirectory()) continue;
  freed += dirSize(dir);
  rmSync(dir, { recursive: true, force: true });
  removed.push(name);
}

if (removed.length) {
  const mb = (freed / 1024 / 1024).toFixed(1);
  console.log(`cleaned ${removed.join(", ")} (${mb} MB)`);
}
