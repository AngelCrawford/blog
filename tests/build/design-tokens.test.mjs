// Guards the gap between the design system and the stylesheet that ships.
//
// DIRECTION MATTERS AND IS EASY TO GET BACKWARDS.
//
//   .claude/skills/design/tokens/*.css   the DECIDED state — the design system
//   themes/garden/assets/css/main.css    the SHIPPED state — what the site does
//
// The skill leads, main.css follows. A difference is therefore not automatically
// a bug: it is usually a decision that has not been migrated yet, and the whole
// point of this file is to keep that list short, named, and impossible to
// forget. What it must catch is the other thing — a value quietly changing on
// one side while the other keeps the old one and nobody notices.
//
// Three checks, deliberately asymmetric:
//
//   1. Tokens both sides define must agree, EXCEPT the ones listed in
//      PENDING_ADOPTION below. That list is the migration backlog for values.
//   2. A token only main.css has means the skill is behind — it should have been
//      re-pulled. Only LIVE_ONLY covers the legitimate case.
//   3. Tokens only the skill has are new design vocabulary awaiting adoption.
//      NOT_YET_ADOPTED pins the exact set, so it shrinks as the migration lands
//      and cannot silently grow after a /design-sync re-pull.
//
// Every failure below names both values and what to do about it. When you resolve
// one, DELETE its entry here in the same commit — a stale exception is worse than
// no exception, so the test fails on those too.

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..", "..");

const LIVE_CSS = resolve(repoRoot, "themes/garden/assets/css/main.css");
const SKILL_TOKENS = resolve(repoRoot, ".claude/skills/design/tokens");

// ── The backlog ─────────────────────────────────────────────────────────────

/* Values the design system decided and main.css has not taken over yet.
 * Both sides are recorded so that a change to EITHER one breaks the test —
 * an exception that no longer describes reality is not an exception. */
const PENDING_ADOPTION = {
  "--color-accent-shadow": {
    skill: "hsl(25 50% 24%)",
    live: "hsl(35 48% 17%)",
    note:
      "Duotone-icon shadow, warmer and lighter after the August 2026 session. " +
      "Adopt together with the offsets: the skill also moves .gd-icon-shadow " +
      "from drop-shadow(0.03em 0.055em) to (0.06em 0.1em) and introduces " +
      "--gd-duo-offset-x/-y on .gd-icon-duo. Colour alone would land half the change.",
  },
};

/* Tokens main.css legitimately has alone. `initial` is not a value — it deletes
 * a step from Tailwind's default scale, which the skill has no equivalent for. */
const LIVE_ONLY = {
  "--text-xs": "initial", // 12px removed from the scale on purpose
};

/* New vocabulary the design system introduced that production does not have
 * yet. This list IS the adoption backlog; it should only ever get shorter. */
const NOT_YET_ADOPTED = [
  "--border-hairline",
  "--border-hairline-quiet",
  "--duration-base",
  "--duration-fast",
  "--duration-slow",
  "--ease-out",
  "--focus-ring",
  "--font-icon",
  "--measure",
  "--page-bg",
  "--page-max",
  "--radius-pill",
  "--radius-tile",
  "--rule-gold",
  "--shadow-card",
  "--shadow-domed",
  "--shadow-pressed",
  "--spacing-1",
  "--spacing-2",
  "--spacing-3",
  "--spacing-4",
  "--surface-card",
  "--surface-tile",
  "--text-body",
  "--text-heading",
  "--text-link",
  "--text-link-hover",
  "--text-meta",
  "--tracking-heading",
  "--tracking-label",
  "--weight-body",
  "--weight-bold",
  "--weight-strong",
];

// ── Parsing ─────────────────────────────────────────────────────────────────

/* Strip block comments BEFORE matching declarations. Without this a comment
 * containing a colon merges into the previous value and the test reports drift
 * that is not there — it happened while writing this file. */
const stripComments = (css) => css.replace(/\/\*[\s\S]*?\*\//g, "");

function declarations(css) {
  const out = {};
  for (const [, name, value] of stripComments(css).matchAll(
    /(--[a-z0-9-]+)\s*:\s*([^;{}]+);/gi
  )) {
    out[name] = value.replace(/\s+/g, " ").trim();
  }
  return out;
}

/* main.css keeps its tokens in `@theme static { … }`. Slice by brace counting
 * rather than regex: the block contains nested rules and long comments. */
function themeBlock(css) {
  const start = css.indexOf("@theme static");
  assert.notEqual(start, -1, "main.css no longer contains an `@theme static` block");
  const open = css.indexOf("{", start);
  let depth = 0;
  for (let i = open; i < css.length; i++) {
    if (css[i] === "{") depth++;
    else if (css[i] === "}" && --depth === 0) return css.slice(open + 1, i);
  }
  throw new Error("Unbalanced braces in main.css `@theme static` block");
}

assert.ok(
  existsSync(SKILL_TOKENS),
  `Missing ${SKILL_TOKENS}.\n` +
    "The design skill has to be committed for this test to mean anything — it is\n" +
    "the source of truth these values are checked against. Commit\n" +
    ".claude/skills/design/, or delete this test if that is not the plan."
);

const live = declarations(themeBlock(readFileSync(LIVE_CSS, "utf8")));
const skill = {};
for (const file of readdirSync(SKILL_TOKENS).sort()) {
  if (file.endsWith(".css")) {
    Object.assign(skill, declarations(readFileSync(resolve(SKILL_TOKENS, file), "utf8")));
  }
}

// ── 1. Shared tokens must agree ─────────────────────────────────────────────

test("tokens: no undeclared divergence between the design system and main.css", () => {
  const surprises = [];
  for (const name of Object.keys(live)) {
    if (!(name in skill) || live[name] === skill[name]) continue;
    if (name in PENDING_ADOPTION) continue;
    surprises.push(`  ${name}\n    skill: ${skill[name]}\n    main.css: ${live[name]}`);
  }
  assert.equal(
    surprises.length,
    0,
    `${surprises.length} token(s) differ without being on the backlog:\n\n` +
      surprises.join("\n") +
      "\n\nEither bring main.css in line with the design system, re-pull the skill\n" +
      "via /design-sync, or add the token to PENDING_ADOPTION with a note saying\n" +
      "what still has to move with it."
  );
});

test("tokens: every PENDING_ADOPTION entry still describes reality", () => {
  const stale = [];
  for (const [name, expected] of Object.entries(PENDING_ADOPTION)) {
    if (!(name in skill) || !(name in live)) {
      stale.push(`  ${name} — no longer defined on both sides`);
    } else if (live[name] === skill[name]) {
      stale.push(`  ${name} — adopted (both are now ${live[name]})`);
    } else if (skill[name] !== expected.skill || live[name] !== expected.live) {
      stale.push(
        `  ${name} — values moved since the exception was written\n` +
          `    recorded: skill ${expected.skill} / main.css ${expected.live}\n` +
          `    actual:   skill ${skill[name]} / main.css ${live[name]}`
      );
    }
  }
  assert.equal(
    stale.length,
    0,
    `${stale.length} stale exception(s) in PENDING_ADOPTION:\n\n` +
      stale.join("\n") +
      "\n\nDelete the resolved entries, or update them to the current values."
  );
});

// ── 2. main.css must not be ahead of the design system ──────────────────────

test("tokens: main.css defines nothing the design system is missing", () => {
  const ahead = Object.keys(live).filter(
    (name) => !(name in skill) && LIVE_ONLY[name] !== live[name]
  );
  assert.deepEqual(
    ahead,
    [],
    `main.css defines token(s) the design system does not know:\n\n` +
      ahead.map((n) => `  ${n}: ${live[n]}`).join("\n") +
      "\n\nThis means the skill is stale. Re-pull it via /design-sync so the design\n" +
      "system stays the place decisions are made — or add the token to LIVE_ONLY\n" +
      "if it is a Tailwind mechanism rather than a design value."
  );
});

// ── 3. The adoption backlog is pinned ───────────────────────────────────────

test("tokens: the not-yet-adopted list matches the design system exactly", () => {
  const actual = Object.keys(skill)
    .filter((name) => !(name in live))
    .sort();
  const expected = [...NOT_YET_ADOPTED].sort();

  const added = actual.filter((n) => !expected.includes(n));
  const gone = expected.filter((n) => !actual.includes(n));

  assert.deepEqual(
    actual,
    expected,
    "The design system's unadopted tokens no longer match NOT_YET_ADOPTED.\n\n" +
      (added.length
        ? `New in the design system (${added.length}) — adopt into main.css, or add here:\n` +
          added.map((n) => `  ${n}: ${skill[n]}`).join("\n") +
          "\n\n"
        : "") +
      (gone.length
        ? `Now in main.css (${gone.length}) — remove from NOT_YET_ADOPTED, the backlog shrank:\n` +
          gone.map((n) => `  ${n}`).join("\n") +
          "\n\n"
        : "") +
      `${actual.length} of the design system's tokens are still unadopted.`
  );
});
