// Unit tests for schemas/frontmatter/article.schema.json via AJV.
//
// Covers the withered_* conditional-required rules (Story 1.4 backlog item)
// and the replacement_url URI-safety constraint (security backlog fix).
// Does NOT spawn Hugo or git — pure schema validation, fast and isolated.

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import Ajv from "ajv";
import addFormats from "ajv-formats";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const repoRoot = resolve(__dirname, "..", "..");

const schema = JSON.parse(
  readFileSync(resolve(repoRoot, "schemas/frontmatter/article.schema.json"), "utf8")
);
const noteSchema = JSON.parse(
  readFileSync(resolve(repoRoot, "schemas/frontmatter/note.schema.json"), "utf8")
);
const bookmarkSchema = JSON.parse(
  readFileSync(resolve(repoRoot, "schemas/frontmatter/bookmark.schema.json"), "utf8")
);
const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
const validate = ajv.compile(schema);
const validateNote = ajv.compile(noteSchema);
const validateBookmark = ajv.compile(bookmarkSchema);

/* The withered/URL cases below predate the required fields (#189) and were
 * written as bare fragments; MINIMUM keeps them valid on the axis they are
 * not testing, so each test still fails for exactly one reason. */
const MINIMUM = { title: "T", summary: "S", categories: ["Allgemein"] };

function check(data) {
  const ok = validate({ ...MINIMUM, ...data });
  return { ok, errors: validate.errors ? [...validate.errors] : [] };
}

function checkRaw(data) {
  const ok = validate(data);
  return { ok, errors: validate.errors ? [...validate.errors] : [] };
}

function checkNote(data) {
  const ok = validateNote(data);
  return { ok, errors: validateNote.errors ? [...validateNote.errors] : [] };
}

// ── growth_stage enum ───────────────────────────────────────────────────────

test("schema: seedling / budding / evergreen are accepted without withered_date", () => {
  for (const stage of ["seedling", "budding", "evergreen"]) {
    const { ok } = check({ title: "T", growth_stage: stage });
    assert.ok(ok, `'${stage}' must be accepted`);
  }
});

test("schema: unknown growth_stage value is rejected", () => {
  const { ok, errors } = check({ title: "T", growth_stage: "dead" });
  assert.ok(!ok, "Unknown growth_stage must fail");
  assert.ok(
    errors.some((e) => e.keyword === "enum"),
    "Error must be an enum violation"
  );
});

// ── withered conditional-required ──────────────────────────────────────────

test("schema: withered without withered_date is rejected", () => {
  const { ok, errors } = check({ title: "T", growth_stage: "withered" });
  assert.ok(!ok, "withered without withered_date must fail");
  assert.ok(
    errors.some(
      (e) => e.keyword === "required" && e.params?.missingProperty === "withered_date"
    ),
    "Error must name withered_date as the missing required property"
  );
});

test("schema: withered with valid withered_date is accepted", () => {
  const { ok } = check({ title: "T", growth_stage: "withered", withered_date: "2026-04-15" });
  assert.ok(ok, "withered + valid withered_date must pass");
});

test("schema: withered with invalid withered_date format is rejected", () => {
  const { ok } = check({ title: "T", growth_stage: "withered", withered_date: "15.04.2026" });
  assert.ok(!ok, "Non-ISO withered_date must fail");
});

test("schema: withered with optional withered_reason is accepted", () => {
  const { ok } = check({
    title: "T",
    growth_stage: "withered",
    withered_date: "2026-04-15",
    withered_reason: "Framework deprecated.",
  });
  assert.ok(ok, "withered + reason must pass");
});

test("schema: withered_reason over 280 chars is rejected", () => {
  const { ok } = check({
    title: "T",
    growth_stage: "withered",
    withered_date: "2026-04-15",
    withered_reason: "x".repeat(281),
  });
  assert.ok(!ok, "withered_reason > 280 chars must fail");
});

// ── replacement_url URI safety ──────────────────────────────────────────────

test("schema: replacement_url accepts root-relative path", () => {
  const { ok } = check({
    title: "T",
    growth_stage: "withered",
    withered_date: "2026-04-15",
    replacement_url: "/articles/new-version/",
  });
  assert.ok(ok, "Root-relative replacement_url must pass");
});

test("schema: replacement_url accepts https URL", () => {
  const { ok } = check({
    title: "T",
    growth_stage: "withered",
    withered_date: "2026-04-15",
    replacement_url: "https://example.com/new/",
  });
  assert.ok(ok, "https:// replacement_url must pass");
});

test("schema: replacement_url rejects javascript: URI", () => {
  const { ok } = check({
    title: "T",
    growth_stage: "withered",
    withered_date: "2026-04-15",
    replacement_url: "javascript:alert(1)",
  });
  assert.ok(!ok, "javascript: replacement_url must be rejected");
});

test("schema: replacement_url rejects data: URI", () => {
  const { ok } = check({
    title: "T",
    growth_stage: "withered",
    withered_date: "2026-04-15",
    replacement_url: "data:text/html,<h1>x</h1>",
  });
  assert.ok(!ok, "data: replacement_url must be rejected");
});

// ── required fields, #189 ───────────────────────────────────────────────────

test("schema: an article needs title, summary and a Rubrik", () => {
  const { ok, errors } = checkRaw({ title: "Nur ein Titel" });
  assert.equal(ok, false);
  const missing = errors.filter((e) => e.keyword === "required").map((e) => e.params.missingProperty);
  assert.deepEqual(missing.sort(), ["categories", "summary"]);
});

test("schema: an empty summary is not a summary", () => {
  const { ok } = checkRaw({ ...MINIMUM, summary: "" });
  assert.equal(ok, false);
});

test("schema: categories must hold at least one entry", () => {
  const { ok } = checkRaw({ ...MINIMUM, categories: [] });
  assert.equal(ok, false);
});

test("schema: the full minimum passes", () => {
  const { ok, errors } = checkRaw(MINIMUM);
  assert.equal(ok, true, JSON.stringify(errors));
});

// ── notes are headless and owe less ─────────────────────────────────────────

test("note schema: a title alone is enough — a note has no summary to give", () => {
  const { ok, errors } = checkNote({ title: "Log Testing" });
  assert.equal(ok, true, JSON.stringify(errors));
});

test("note schema: a note without a title is still rejected", () => {
  const { ok } = checkNote({ tags: ["log"] });
  assert.equal(ok, false);
});

test("note schema: the withered rules still apply to notes", () => {
  const { ok } = checkNote({ title: "T", growth_stage: "withered" });
  assert.equal(ok, false, "withered without withered_date must fail for notes too");
});

// ── bookmarks owe a target URL and nothing else ─────────────────────────────

function checkBookmark(data) {
  const ok = validateBookmark(data);
  return { ok, errors: validateBookmark.errors ? [...validateBookmark.errors] : [] };
}

test("bookmark schema: title plus bookmark_of is enough — no summary, no Rubrik, no growth stage", () => {
  const { ok, errors } = checkBookmark({ title: "T", bookmark_of: "https://example.com/post/" });
  assert.equal(ok, true, JSON.stringify(errors));
});

test("bookmark schema: bookmark_of is required — a bookmark without a target is not a bookmark", () => {
  const { ok } = checkBookmark({ title: "T" });
  assert.equal(ok, false);
});

test("bookmark schema: bookmark_of must be an absolute http(s) URL — a relative path cannot receive a webmention", () => {
  const { ok } = checkBookmark({ title: "T", bookmark_of: "/articles/local/" });
  assert.equal(ok, false);
});
