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
import { copyFileSync, mkdirSync, rmSync, existsSync } from "node:fs";
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
