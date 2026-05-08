#!/usr/bin/env node
// Layer 2 — pre-commit frontmatter validator.
//
// Reads .md files staged for commit (filtered to content/articles/ and content/logs/),
// extracts the YAML frontmatter, validates it against schemas/frontmatter/article.schema.json,
// and exits non-zero with a per-file error report on failure.
//
// Skip-aware: exits 0 silently when no relevant files are staged. Bypass via `git commit --no-verify`.

import { execFileSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";
import { resolve, relative } from "node:path";
import process from "node:process";

import Ajv from "ajv";
import addFormats from "ajv-formats";
import matter from "gray-matter";

const repoRoot = process.cwd();
const schemaPath = resolve(repoRoot, "schemas/frontmatter/article.schema.json");

if (!existsSync(schemaPath)) {
  console.error(`[validate-frontmatter] schema not found: ${relative(repoRoot, schemaPath)}`);
  process.exit(2);
}

let stagedRaw;
try {
  stagedRaw = execFileSync(
    "git",
    ["diff", "--cached", "--name-only", "--diff-filter=ACM"],
    { encoding: "utf8" }
  );
} catch (err) {
  console.error("[validate-frontmatter] failed to enumerate staged files:", err.message);
  process.exit(2);
}

const staged = stagedRaw
  .split(/\r?\n/)
  .map((line) => line.trim())
  .filter(Boolean);

const targets = staged.filter(
  (file) =>
    /^content\/articles\/.+\.md$/.test(file) ||
    /^content\/logs\/.+\.md$/.test(file)
);

if (targets.length === 0) {
  // No content frontmatter to check — exit silently.
  process.exit(0);
}

const schema = JSON.parse(readFileSync(schemaPath, "utf8"));
const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
const validate = ajv.compile(schema);

let failed = false;

for (const file of targets) {
  const absPath = resolve(repoRoot, file);
  if (!existsSync(absPath)) {
    // File may have been moved/removed between `git diff --cached` and now — skip.
    continue;
  }

  const raw = readFileSync(absPath, "utf8");
  let parsed;
  try {
    parsed = matter(raw);
  } catch (err) {
    console.error(`✖ ${file}`);
    console.error(`    Frontmatter parse error: ${err.message}`);
    failed = true;
    continue;
  }

  const data = parsed.data || {};
  const ok = validate(data);

  if (!ok) {
    failed = true;
    console.error(`✖ ${file}`);
    for (const err of validate.errors || []) {
      const where = err.instancePath || "(root)";
      console.error(`    ${where} ${err.message}`);
      if (err.params && err.keyword === "enum") {
        console.error(`      allowed: ${JSON.stringify(err.params.allowedValues)}`);
      }
    }
  }
}

if (failed) {
  console.error("");
  console.error("Frontmatter validation failed. Fix the issues above or bypass with `git commit --no-verify` (not recommended).");
  process.exit(1);
}

process.exit(0);
