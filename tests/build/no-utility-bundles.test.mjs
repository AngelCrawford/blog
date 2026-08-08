// Catches the mistake that put 933 lines of hand-written CSS into a Tailwind
// project: a class that is nothing but a pile of utilities with a name.
//
// THE RULE IT ENFORCES is docs/design.md's own, and it was never applied when
// the design system was ported. Write a component when — and only when — one of
// these is true:
//
//   1. the same decision would repeat and could drift, or
//   2. utilities cannot express it.
//
// (2) is machine-checkable, and that is what this test does. A rule fails if
//   * its selector is a single bare class — no pseudo-element, no combinator,
//     no attribute, nothing that reaches another element, AND
//   * every one of its declarations is a property Tailwind has a utility for.
//
// Such a rule can be written at the call site instead, and should be: layout in
// the markup is layout you can see without opening a second file.
//
// (1) is a judgement call and stays with the reader. That is what ALLOWED is
// for — every entry needs a reason, and "it felt tidier" is not one. Adding to
// that list is a decision; leaving a bundle in the file by accident is not, and
// this test is here so the difference stays visible.

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CSS = resolve(__dirname, "..", "..", "themes/garden/assets/css/components.css");

/* Classes that ARE a pile of utilities and stay one anyway, each because the
 * decision genuinely repeats. The count is the point: if it grows, the file is
 * drifting back towards a private framework. */
const ALLOWED = {
  "gd-h1": "the gradient title. Its two pseudo-elements read `data-heading`; the base rule is what they hang on.",
  "gd-h2": "carries the fading section rule as ::after.",
  /* `gd-h3` WAS HERE, with the reason "used at ten call sites; the heading
   * rhythm is not a per-call decision". Twelve, actually — and every one of
   * them in the styleguide. I counted matches without looking at which file
   * they were in, which is the same shortcut that put the whole vocabulary in
   * this file to begin with. The class is gone; the styleguide writes the five
   * utilities out. An entry on this list has to name where the repetition is,
   * not just that there is some. */
  "gd-lined-title": "two pseudo-element rules to either side of the text.",
  "gd-round-button-lg": "sets a custom property the base rule computes from.",
  "gd-round-button-full": "the same, for the icon box.",
  "at-prose": "the container for two dozen descendant rules over generated Markdown, where no class can be put on anything.",
  "at-widget-list": "sets `--at-marker`, which three different list markers read.",
  "at-ghost": "hook for the SVG turbulence filter rule beneath it.",
  "at-footer-sea": "its own box is seven utilities, but the two ::before/::after skyline reflections hang on it — the class IS the hook, and splitting box from pseudos across two files hides the component.",
};

/* THE LIST HAD A HOLE AND THE HOLE COST A CLUSTER: `float` was missing, so
 * `.at-figure-float` — float, width, margin, nothing else — sailed through the
 * first audit and had to be caught by a person. Everything a remaining rule
 * could plausibly bundle is listed now.
 *
 * DELIBERATELY NOT LISTED: the background-*, animation-* and filter families.
 * The header and sea chrome (skies, clock, birds, reflections) is CSS by
 * recorded decision — keyframes, url() backgrounds, layered pseudos — and
 * putting those properties here would only grow ALLOWED without ever catching
 * a real bundle. This guard hunts layout and typography piles, which is where
 * the mistake actually happened. Widening it later is one line here. */
const UTILITY_PROPERTIES = new Set([
  "display", "flex", "flex-direction", "flex-wrap", "flex-shrink", "flex-grow", "flex-basis",
  "align-items", "align-self", "justify-content", "justify-items", "order", "float", "clear",
  "gap", "row-gap", "column-gap",
  "grid-template-columns", "grid-template-rows", "place-items",
  "margin", "margin-top", "margin-right", "margin-bottom", "margin-left", "margin-inline",
  "padding", "padding-top", "padding-right", "padding-bottom", "padding-left",
  "width", "height", "min-width", "max-width", "min-height", "max-height", "aspect-ratio",
  "position", "top", "right", "bottom", "left", "inset", "z-index",
  "font-size", "font-weight", "font-family", "line-height", "letter-spacing",
  "text-align", "text-transform", "text-decoration", "text-underline-offset",
  "text-shadow", "text-wrap",
  "color", "background-color", "border-radius", "opacity", "overflow", "overflow-wrap",
  "white-space", "font-variant-numeric", "object-fit", "list-style", "vertical-align",
  "cursor", "appearance", "container-type", "pointer-events", "visibility",
  "border", "border-color", "border-top", "border-right", "border-bottom", "border-left",
  "box-shadow", "outline", "outline-offset",
  "transform", "rotate", "translate", "scale",
  "transition", "transition-property", "transition-duration", "transition-timing-function",
  "will-change", "caret-color",
]);

/* Strip comments first: one containing a brace would split a rule in half. */
const css = readFileSync(CSS, "utf8").replace(/\/\*[\s\S]*?\*\//g, "");

/* At-rules are skipped whole. A breakpoint override IS a utility candidate in
 * principle, but `max-[840px]:pt-[14px]` at four call sites is worse than one
 * line here, and that is a judgement this test should not be making. */
const topLevel = css
  .replace(/@(?:media|container|supports)[^{]*\{(?:[^{}]|\{[^{}]*\})*\}/g, "")
  .replace(/@keyframes[^{]*\{(?:[^{}]|\{[^{}]*\})*\}/g, "");

const BARE_CLASS = /^\.[a-z][a-z0-9-]*$/;

test("components.css: no class is just a pile of utilities", () => {
  const offenders = [];

  for (const [, rawSelector, body] of topLevel.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const selector = rawSelector.replace(/\s+/g, " ").trim();
    if (!BARE_CLASS.test(selector)) continue;
    if (selector.startsWith("@")) continue;

    const name = selector.slice(1);
    if (name in ALLOWED) continue;

    const properties = body
      .split(";")
      .map((d) => d.split(":")[0].trim())
      .filter(Boolean);
    if (!properties.length) continue;

    /* A custom property is a hand-off to another rule — never a bundle. */
    if (properties.some((p) => p.startsWith("--"))) continue;

    if (properties.every((p) => UTILITY_PROPERTIES.has(p))) {
      offenders.push(`  .${name}\n      ${properties.join(", ")}`);
    }
  }

  assert.equal(
    offenders.length,
    0,
    `${offenders.length} class(es) in components.css declare nothing a utility could not:\n\n` +
      offenders.join("\n") +
      "\n\nWrite them at the call site instead. If one genuinely repeats often\n" +
      "enough to drift — docs/design.md's first test — add it to ALLOWED in this\n" +
      "file with the reason, in the same commit."
  );
});

test("components.css: every ALLOWED entry still describes a rule that exists", () => {
  const stale = Object.keys(ALLOWED).filter(
    (name) => !new RegExp(`(^|\\n)\\.${name}\\s*[,{]`).test(topLevel)
  );
  assert.deepEqual(
    stale,
    [],
    `${stale.length} ALLOWED entr(y|ies) name a class components.css no longer has:\n\n` +
      stale.map((n) => `  .${n}`).join("\n") +
      "\n\nDelete them. An exception that describes nothing is how a list like this\n" +
      "stops being read."
  );
});
