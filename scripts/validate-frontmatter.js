#!/usr/bin/env node
// Layer 2 — pre-commit frontmatter validator.
//
// Reads .md files staged for commit (filtered to content/articles/ and content/notes/)
// directly from the git index (git show :path) — NOT from the working tree — so
// validation matches exactly what will be committed, even if the working tree has
// unsaved changes. Extracts the YAML frontmatter, validates it against
// schemas/frontmatter/article.schema.json, and exits non-zero with a per-file error
// report on failure.
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

/* One schema per content kind: an article owes a summary and a Rubrik, a note
 * is a headless one-liner that owes neither. The path decides which applies. */
const SCHEMAS = [
  { match: /^content\/articles\/.+\.md$/, file: "schemas/frontmatter/article.schema.json", kind: "article" },
  { match: /^content\/notes\/.+\.md$/, file: "schemas/frontmatter/note.schema.json", kind: "note" },
  { match: /^content\/bookmarks\/.+\.md$/, file: "schemas/frontmatter/bookmark.schema.json", kind: "bookmark" },
];

for (const s of SCHEMAS) {
  if (!existsSync(resolve(repoRoot, s.file))) {
    console.error(`[validate-frontmatter] schema not found: ${s.file}`);
    process.exit(2);
  }
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

/* `content/logs/` stood here until August 2026 — the section was renamed to
 * notes long ago, so the validator had been silently skipping every note. */
const targets = staged
  .map((file) => ({ file, schema: SCHEMAS.find((s) => s.match.test(file)) }))
  .filter((t) => t.schema);

if (targets.length === 0) {
  // No content frontmatter to check — exit silently.
  process.exit(0);
}

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
const validators = new Map(
  SCHEMAS.map((s) => [
    s.file,
    ajv.compile(JSON.parse(readFileSync(resolve(repoRoot, s.file), "utf8"))),
  ])
);

/* SEO completeness is ADVISORY (#189). The schema blocks what breaks the site —
 * a missing summary errors at render time, a missing Rubrik leaves the card
 * without its one classification. Description length and keyword count are
 * craft, not correctness: warned about, never blocking, because a hook that
 * fails over 119 characters teaches --no-verify and then guards nothing. */
const DESC_MIN = 120;
const DESC_MAX = 158;
const KEYWORDS_MAX = 3;

function seoWarnings(data, kind) {
  const out = [];
  const seo = (data.params && (data.params.SEO || data.params.Seo)) || {};
  const desc = typeof seo.desc === "string" ? seo.desc.trim() : "";
  const keywords = Array.isArray(seo.keywords) ? seo.keywords : [];
  const tags = Array.isArray(data.tags) ? data.tags.filter(Boolean) : [];

  if (!desc) {
    out.push(`params.SEO.desc missing — search engines will fall back to ${kind === "note" ? "the note text" : "the summary"}`);
  } else if (desc.length < DESC_MIN || desc.length > DESC_MAX) {
    out.push(`params.SEO.desc is ${desc.length} characters (${DESC_MIN}–${DESC_MAX} reads best in results)`);
  }

  if (!keywords.length) {
    out.push(tags.length ? "params.SEO.keywords missing — falling back to tags" : "params.SEO.keywords missing, and there are no tags to fall back to");
  } else if (keywords.length > KEYWORDS_MAX) {
    out.push(`params.SEO.keywords has ${keywords.length} entries — one keyword per article, ${KEYWORDS_MAX} at most (CLAUDE.md)`);
  }

  if (!tags.length) out.push("tags missing — nothing links this to related content");

  return out;
}

let failed = false;
let warned = 0;

for (const { file, schema } of targets) {
  let raw;
  try {
    raw = execFileSync("git", ["show", `:${file}`], { encoding: "utf8" });
  } catch {
    // File removed from index between `git diff --cached` and now — skip.
    continue;
  }
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
  const validate = validators.get(schema.file);
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

  /* Warnings ride along even on a valid file — that is the point of them.
   * Bookmarks are exempt: their pages are robots-disallowed thin content
   * (webmention sources, not search targets), so SEO advice is pure noise. */
  const warnings = schema.kind === "bookmark" ? [] : seoWarnings(data, schema.kind);
  if (warnings.length) {
    warned += warnings.length;
    console.warn(`⚠ ${file}`);
    for (const w of warnings) console.warn(`    ${w}`);
  }
}

if (warned && !failed) {
  console.warn("");
  console.warn(`${warned} SEO hint(s) — the commit goes through; fix them when it suits.`);
}

if (failed) {
  console.error("");
  console.error("Frontmatter validation failed. Fix the issues above or bypass with `git commit --no-verify` (not recommended).");
  process.exit(1);
}

process.exit(0);
