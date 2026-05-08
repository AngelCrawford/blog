# Editor Setup — Frontmatter Validation (Layer 1)

This blog uses a JSON Schema (`schemas/frontmatter/article.schema.json`) as the single source of truth for the frontmatter of `content/articles/**/*.md` and `content/logs/**/*.md`. The schema covers `growth_stage` (the digital-garden maturity field) plus all other existing frontmatter fields, so editor autocomplete and inline validation work for the whole frontmatter block.

There are three independent layers; this page documents Layer 1 only.

| Layer | Where | Authority |
|---|---|---|
| 1. Editor (this page) | Zed / VS Code / any YAML-LSP-aware editor | Productivity — bypass = trivial |
| 2. Pre-commit hook | `.githooks/pre-commit` → `scripts/validate-frontmatter.js` | Blocks invalid commits |
| 3. Hugo build | `layouts/_partials/_base/validate-growth-stage.html` (called from `layouts/baseof.html`) | Authoritative — bypass = none |

## Zed (workspace-configured)

`.zed/settings.json` already wires `schemas/frontmatter/article.schema.json` to `content/articles/**/*.md` and `content/logs/**/*.md` via the YAML language server. No per-machine setup needed beyond:

1. Install the **YAML** extension in Zed (`zed: extensions` → search "YAML" → install). The YAML LSP ships with that extension.
2. Reload the workspace.
3. Open a content file. Typing `growth_stage: bogus` should surface a red squiggle on the value.

**Caveat:** historically, YAML language servers validate `.yaml`/`.yml` files reliably but not always YAML frontmatter embedded in `.md` files. If editor feedback does not appear, use the inline modeline fallback below — and remember the pre-commit hook (Layer 2) is the actual safety net before code reaches the repo.

## VS Code / Other editors (modeline fallback)

Add this comment line directly under the `---` of any content file:

```yaml
---
# yaml-language-server: $schema=../../../schemas/frontmatter/article.schema.json
title: "..."
growth_stage: "evergreen"
```

Adjust the relative path to match the file's depth. The Red Hat YAML extension for VS Code reads this directive without any workspace config.

## Verifying it works

1. Open `content/articles/<any>/index.md` in your editor.
2. Change `growth_stage:` to an invalid value like `"foo"`.
3. Expect a red squiggle / "value is not in enum" diagnostic before save.
4. Restore the value.

If the editor stays silent, that's fine — Layer 2 (`git commit`) and Layer 3 (`hugo build`) will catch it.

## Adding a new schema field

Edit `schemas/frontmatter/article.schema.json`. All three layers (Zed, pre-commit, Hugo) pick up schema-only changes automatically — except `growth_stage` enum values, which Layer 3 hardcodes in `layouts/_partials/_base/validate-growth-stage.html`. Update both the schema enum AND the partial when changing growth-stage values.

## Withered metadata fields (Story 1.4)

When marking an article as `growth_stage: "withered"`, fill in these companion frontmatter fields:

| Field | Type | Required | Notes |
|---|---|---|---|
| `withered_date` | YYYY-MM-DD | **Yes when withered** | Renders as the deprecation date in the warning banner. Build fails (`errorf`) if missing. |
| `withered_reason` | string (≤280 chars) | Optional | One short paragraph explaining why the content was deprecated. Plain prose only — no markdown rendering. |
| `replacement_url` | URL or rel-path | Optional | Link to the replacement article (e.g. `/articles/new-version/`). Rendered as a labelled link in the banner. |

The article and log archetypes (`archetypes/articles/index.md`, `archetypes/logs/index.md`) include a commented-out block of these three fields right under `growth_stage` so you can uncomment and fill them in when the time comes. Both the JSON Schema (Layer 1+2) and the build-time partial (Layer 3) enforce the conditional-required rule.

The same `withered_date` and (optionally) `withered_reason` you add for the in-page banner also drive Story 1.5's off-site deprecation signals — RSS title suffix `[Verwelkt MMM. YYYY]`, RSS description warning prepend, sitemap `<priority>0.3</priority>` and `<lastmod>=withered_date`, and Schema.org `creativeWorkStatus: "Obsolete"` plus the German "Veraltet seit …" description prefix. No additional metadata required.
