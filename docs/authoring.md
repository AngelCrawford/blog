# Authoring content

`schemas/frontmatter/article.schema.json` is the single source of truth for the frontmatter of `content/articles/**/*.md` and `content/notes/**/*.md`. Three independent layers enforce it:

| Layer | Where | Authority |
|---|---|---|
| Editor | Zed / any YAML-LSP editor via `.zed/settings.json` | Productivity — trivially bypassed |
| Pre-commit | `.githooks/pre-commit` → `scripts/validate-frontmatter.js` | Blocks invalid commits |
| Build | `layouts/_partials/_base/validate-growth-stage.html` | Authoritative — no bypass |

**Zed:** install the YAML extension, reload the workspace. Typing `growth_stage: bogus` should surface a red squiggle. YAML language servers historically validate `.yaml` files more reliably than frontmatter embedded in `.md`, so silence in the editor is not a failure — the pre-commit hook is the real net.

**Other editors:** add a modeline under the opening `---`, path adjusted for the file's depth:

```yaml
# yaml-language-server: $schema=../../../schemas/frontmatter/article.schema.json
```

## Adding a schema field

Edit the JSON Schema — all three layers pick it up automatically. **Exception:** `growth_stage` enum values are hardcoded a second time in `layouts/_partials/_base/validate-growth-stage.html`. Change both.

## Withered metadata

When setting `growth_stage: "withered"`:

| Field | Type | Required | Notes |
|---|---|---|---|
| `withered_date` | `YYYY-MM-DD` | **yes** | Deprecation date in the banner. Build fails if missing. |
| `withered_reason` | string ≤280 chars | no | One short paragraph, plain prose — no markdown rendering. |
| `replacement_url` | URL or rel-path | no | e.g. `/articles/new-version/`. Rendered as a labelled link. |

The archetypes ship these three as a commented-out block under `growth_stage` — uncomment when needed.

The same fields drive the off-site deprecation signals with no extra metadata: RSS title suffix `[Verwelkt MMM. YYYY]`, RSS description warning, sitemap `<priority>0.3</priority>` + `<lastmod>`, and Schema.org `creativeWorkStatus: "Obsolete"`.

SEO and pre-launch checklists live in [`CLAUDE.md`](../CLAUDE.md).
