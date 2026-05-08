# Story 1.5: Withered SEO & RSS Inclusion

Status: review

## Story

As a content creator,
I want withered content indexed by search engines and RSS readers with deprecation context,
so that historical content remains discoverable but is clearly marked as outdated.

## Acceptance Criteria

1. RSS feed (`layouts/rss.xml`) includes withered articles. Each withered item's `<title>` is suffixed with `[Verwelkt {{ MMM. YYYY }}]` (e.g., `[Verwelkt Nov. 2025]`) where the date is derived from the article's `withered_date` frontmatter (Story 1.4 schema). Non-withered items render their title unchanged.
2. RSS `<description>` for withered items is prepended with a deprecation warning (one line, then a blank line, then the existing content): `⚠️ Dieser Inhalt ist als veraltet markiert seit {{ withered_date long-form }}. Grund: {{ withered_reason }}`. The `Grund: …` clause is omitted entirely (no empty `Grund:` label) when `withered_reason` is absent. Existing content sanitization (anchor rewrite, `<svg>` strip, `style="…"` strip — `layouts/rss.xml` lines 56–63) is preserved.
3. Sitemap (`layouts/sitemap.xml`) **continues to include** withered pages (no filter is added). Withered pages must remain discoverable by search engines per FR-006.
4. Sitemap `<lastmod>` for withered pages is `withered_date` (formatted as ISO-8601, identical to the existing `.Lastmod.Format "2006-01-02T15:04:05-07:00"` pattern). For non-withered pages, `<lastmod>` continues to use Hugo's computed `.Lastmod` (driven by `enableGitInfo: true` and the `frontmatter.lastmod` precedence list in `config/_default/config.yaml` lines 9–11). If `withered_date` is missing on a withered page (Story 1.4 validation should already prevent this at build time), the template falls back to `.Lastmod` rather than emitting an empty `<lastmod>`.
5. Sitemap `<priority>` is set to `0.3` for withered pages. For non-withered pages, the existing behaviour is retained: priority is emitted only when defined via `.Sitemap.Priority` (i.e. when the page sets `sitemap.priority` in frontmatter or the site config defines a default). Project decision: also add a site-default `sitemap.priority: 0.8` to `config/_default/config.yaml` so non-withered pages get the implicit `0.8` baseline called out in epics AC #5 — this is a one-line config change, not a per-page edit.
6. Schema.org JSON-LD for withered articles (`layouts/_partials/_base/seo.html`, the `BlogPosting` block) includes deprecation metadata:
   - `"creativeWorkStatus": "Obsolete"` (Schema.org-compliant string for deprecated/no-longer-current creative works)
   - `"dateModified"` is set to `withered_date` (overriding the `.Lastmod`-driven value for withered articles only — so structured data signals that the deprecation date is the most recent semantically-meaningful change)
   - When `withered_reason` is present, append a single-sentence prefix `Veraltet seit {{ DATE }}: {{ REASON }} — ` to the `description` field of the JSON-LD output (the human-readable description preserved after the prefix).
7. **No regression** for non-withered pages:
   - Non-withered RSS items: identical title, identical description, identical pubDate.
   - Non-withered sitemap entries: identical `<lastmod>`, no `<priority>` (or the configured baseline `0.8` once the config change in AC #5 lands), no other changes.
   - Non-withered schema.org JSON-LD: no `creativeWorkStatus` field, no description prefix, `dateModified` continues to come from `.Lastmod`.
8. Build succeeds cleanly with at least one withered fixture (`tests/build/fixtures/withered-with-replacement.md` from Story 1.4) and at least one non-withered fixture (Story 1.1's `valid-evergreen.md` / `valid-missing-field.md`). Build smoke tests (extending Story 1.1's `tests/build/build-smoke.test.mjs`) assert the rendered RSS/sitemap/article HTML contain the expected withered markers and that non-withered output is untouched.
9. RSS validator pass: the rendered `public/index.xml` validates as RSS 2.0 + Media RSS via the existing W3C-feed-style assertion pattern (no new validator infra — we reuse the smoke-test approach: `xmllint --noout` plus the existing project pattern of asserting absence of validator-flagged constructs from the recent RSS hardening commit, `b870bfa feat(rss): add Media RSS namespace + media:thumbnail for cover images`).
10. Sitemap validator pass: rendered `public/sitemap.xml` is valid XML and conforms to `https://www.sitemaps.org/schemas/sitemap/0.9` (asserted via `xmllint --schema` against the shipped XSD or, simpler, via well-formedness check + presence of the expected `<url><loc>…<lastmod>…<priority>0.3</priority></url>` for the withered fixture).

### AC Source & Reconciliation Note

ACs 1–6 are derived directly from `docs/1-planning/epics.md#Story-1.5-Withered-SEO-RSS-Inclusion` (lines 198–204). ACs 7–10 are testability/regression guards added by the create-story workflow and are not in the epics list — they exist solely to make the original 6 ACs verifiable.

**⚠️ Scope-overlap with Story 9.6 (Epic 9):** `epics.md` Story 9.6 (Withered Content SEO Integration, lines 1438–1450) lists ACs that overlap 1:1 with this story's RSS title/description and sitemap lastmod/priority requirements. Stories 1.3 and 1.4 explicitly handed RSS to 1.5 and *sitemap/Schema.org* to 9.6 in their own Out-of-Scope sections — but the epics.md ACs for 1.5 already include sitemap and Schema.org, so the scope split was never reflected in epics.md.

**Resolution applied here:** This story implements **all six ACs from epics.md** because Phase 1A (Week 3) is the right time to ship withered SEO/RSS — readers landing on a withered page directly via search/feed need the deprecation signals from day one. Story 9.6 (Phase 2 Week 10–11) becomes a **verification + refinement** slot covering anything not nailed down here (e.g., custom `robots.txt` directives via Story 9.8, OG/Twitter-Card deprecation hints, advanced canonical strategies). Recommend SM/PM update `epics.md` Story 9.6 ACs to "Re-validate Story 1.5 SEO/RSS implementation; add custom robots/sitemap directives via Story 9.8" in a follow-up housekeeping commit.

[Source: docs/1-planning/epics.md#Story-1.5-Withered-SEO-RSS-Inclusion (ACs 1–6)]
[Source: docs/1-planning/epics.md#Story-9.6-Withered-Content-SEO-Integration (overlapping ACs flagged)]
[Source: docs/sprint-artifacts/epic-1/1-3-withered-content-default-hiding.md#Out-of-Scope (RSS deferred to 1.5)]
[Source: docs/sprint-artifacts/epic-1/1-4-withered-content-warning-banner.md#Out-of-Scope (RSS to 1.5; sitemap/Schema.org to 9.6 — superseded by this resolution)]

## Tasks / Subtasks

- [x] **RSS template — withered title suffix and description prepend** (AC: 1, 2, 7) [Source: layouts/rss.xml lines 25–64]
  - [x] Edit `layouts/rss.xml` inside the `range where .Site.RegularPages "Type" "in" "articles"` block (line 25):
    - [x] Compute `$isWithered := eq .Params.growth_stage "withered"` once near the top of each item, before `<title>`.
    - [x] Compute `$witheredDate` from `.Params.withered_date` (or `.Lastmod` as fallback if validation slipped — defensive only).
    - [x] Emit the `<title>` with conditional German short-month suffix:
      ```go-html-template
      <title>{{ .Title }}{{ if $isWithered }}{{ printf " [Verwelkt %s]" ((time $witheredDate).Format "Jan. 2006") }}{{ end }}</title>
      ```
      Note: Hugo's `time.Format "Jan. 2006"` with the German locale (set in `config/_default/config.yaml` line 5: `locale: de-DE`) yields German month abbreviations (`Nov.`, `Dez.`) as expected. Verify in dev-server output during implementation; if Hugo's `time.Format` does not localize month names automatically, use `time.Format ":date_long" $.Site.Language` then post-process — or match the project's existing date-formatting pattern in the 1.4 banner partial.
  - [x] Inside the existing `<description>` block (after `$content` is fully sanitized, before `| html`), prepend the withered warning when applicable:
    ```go-html-template
    {{- if $isWithered -}}
      {{- $longDate := (time $witheredDate).Format "2. January 2006" -}}
      {{- $reason := .Params.withered_reason -}}
      {{- $warning := printf "⚠️ Dieser Inhalt ist als veraltet markiert seit %s." $longDate -}}
      {{- if $reason -}}
        {{- $warning = printf "%s Grund: %s" $warning $reason -}}
      {{- end -}}
      {{- $content = printf "<p><strong>%s</strong></p>\n\n%s" $warning $content -}}
    {{- end -}}
    ```
  - [x] Verify the existing sanitization (anchor rewrite at line 58, `<svg>` strip at line 59, `style="…"` strip at lines 61–62) still runs **before** the warning prepend so the warning text is not affected by the regexes. Order: sanitize → prepend warning → emit.
  - [x] Confirm the `<description>` field is still wrapped by `| html` (line 63) so the warning HTML escapes correctly for RSS readers.
- [x] **Sitemap template — withered lastmod + priority** (AC: 3, 4, 5, 7) [Source: layouts/sitemap.xml]
  - [x] Edit `layouts/sitemap.xml` inside the `range .Pages` loop:
    - [x] After the `{{- if not .Params.robotsdisallow -}}` guard, compute `$isWithered := eq .Params.growth_stage "withered"`.
    - [x] Replace the unconditional `<lastmod>` block with a conditional:
      ```go-html-template
      {{ if and $isWithered .Params.withered_date }}
        <lastmod>{{ (time .Params.withered_date).Format "2006-01-02T15:04:05-07:00" | safeHTML }}</lastmod>
      {{ else if not .Lastmod.IsZero }}
        <lastmod>{{ .Lastmod.Format "2006-01-02T15:04:05-07:00" | safeHTML }}</lastmod>
      {{ end }}
      ```
    - [x] Replace the `<priority>` block with a conditional:
      ```go-html-template
      {{ if $isWithered }}
        <priority>0.3</priority>
      {{ else with .Sitemap.Priority }}
        <priority>{{ . }}</priority>
      {{ end }}
      ```
    - [x] Leave `<changefreq>` block untouched (the existing `with .Sitemap.ChangeFreq` already handles per-page overrides via Hugo config / frontmatter).
- [x] **Sitemap config baseline priority** (AC: 5) [Source: config/_default/config.yaml lines 96–98]
  - [x] Add `priority: 0.8` to the `sitemap:` block in `config/_default/config.yaml` so non-withered pages get an explicit `<priority>0.8</priority>` baseline (matches epics AC #5: "0.3 for withered items vs 0.8 for evergreen"):
    ```yaml
    sitemap:
      changefreq: weekly
      filename: sitemap.xml
      priority: 0.8
    ```
  - [x] Confirm Hugo applies the `priority` config to all pages by default (Hugo behaviour: `.Sitemap.Priority` resolves from page frontmatter → site sitemap config → `0` if none). The template's `with .Sitemap.Priority` continues to gate emission, so a `0` value would not emit — the explicit `0.8` baseline ensures emission. **Side-fix:** the `cascade.sitemap.priority: 0.5` in `content/articles/_index.md` was overriding the site default; that priority line was removed (changefreq cascade preserved) so non-withered articles now inherit `0.8`.
- [x] **Schema.org JSON-LD — deprecation metadata** (AC: 6, 7) [Source: layouts/_partials/_base/seo.html lines 56–85]
  - [x] Edit `layouts/_partials/_base/seo.html` inside the `{{- if eq .Section "articles" }}` JSON-LD block:
    - [x] Compute `$isWithered := eq .Params.growth_stage "withered"` near the top of the JSON object generation.
    - [x] When `$isWithered`, override `dateModified`:
      ```go-html-template
      "dateModified": {{ if $isWithered }}{{ (time .Params.withered_date).Format "2006-01-02T15:04:05Z07:00" | jsonify }}{{ else }}{{ .Lastmod.Format "2006-01-02T15:04:05Z07:00" | jsonify }}{{ end }},
      ```
    - [x] Inject `creativeWorkStatus` as a sibling field, conditional on withered:
      ```go-html-template
      {{- if $isWithered }}
      "creativeWorkStatus": "Obsolete",
      {{- end }}
      ```
      Place this above `"mainEntityOfPage"` for readability; field order in JSON-LD is irrelevant to Schema.org parsers but consistent placement helps human review.
    - [x] Modify the `description` JSON-LD field to prepend the deprecation prefix when withered:
      ```go-html-template
      "description": {{ $rawDesc := with or .Params.Seo.desc .Summary | plainify | htmlUnescape }}{{ trim . "\n\r\t " }}{{ end }}
      {{- if $isWithered -}}
        {{- $prefix := printf "Veraltet seit %s" ((time .Params.withered_date).Format "2. January 2006") -}}
        {{- if .Params.withered_reason -}}{{- $prefix = printf "%s: %s" $prefix .Params.withered_reason -}}{{- end -}}
        {{- $rawDesc = printf "%s — %s" $prefix $rawDesc -}}
      {{- end -}}
      {{ $rawDesc | jsonify }},
      ```
      Hugo's `with` block scoping interacts awkwardly with the prefix mutation — at implementation time, refactor to a flat `if/else` chain if `with` proves brittle. Goal: a single `description` field whose JSON-string value is `"Veraltet seit DATE[: REASON] — original-summary"` for withered, and the original summary verbatim otherwise.
  - [x] **Do NOT** modify the OG/Twitter/Open Graph blocks in this story — those are owned by Story 9.6 (refinement slot) and Story 9.7 (Twitter-Cards). Adding OG `og:updated_time` overrides for withered is a 9.6 concern; this story is RSS + sitemap + JSON-LD only.
- [x] **Test fixtures** (AC: 8) [Source: tests/build/fixtures/ — created in Story 1.1, extended in Stories 1.3 & 1.4]
  - [x] Reuse `tests/build/fixtures/withered-with-replacement.md` (Story 1.4) as the primary withered fixture. It already contains `growth_stage`, `withered_date`, `withered_reason`, `replacement_url`.
  - [x] Reuse `tests/build/fixtures/withered-minimal.md` (Story 1.4) — `growth_stage: "withered"` + `withered_date` only — to exercise the no-`withered_reason` branch in RSS description and Schema.org description.
  - [x] **No new fixtures required** for this story — Story 1.4's three withered fixtures plus Story 1.1's evergreen/missing-field fixtures already cover the matrix.
  - [x] **If Story 1.4 has not yet landed when this story is implemented:** add the two fixtures here as part of this story's PR with a clear note. (Not applicable — Story 1.4 has landed; fixtures already in tree.)
- [x] **Build smoke tests — RSS** (AC: 1, 2, 7, 9) [Source: tests/build/build-smoke.test.mjs — Story 1.1]
  - [x] Extend `tests/build/build-smoke.test.mjs` with assertions on `public/index.xml`:
    - "withered article appears in RSS feed with `[Verwelkt …]` title suffix"
    - "withered article RSS description starts with `⚠️ Dieser Inhalt ist als veraltet`"
    - "withered article with `withered_reason` includes `Grund:` in the prepended warning"
    - "withered article without `withered_reason` does NOT include `Grund:` (no empty `Grund:` label)"
    - "non-withered article RSS title is unchanged (no `[Verwelkt`) and RSS description does NOT start with `⚠️`"
    - "RSS file is well-formed XML" — implemented as a structural probe (`assertWellFormedXml` helper: XML decl, root tags, no unescaped ampersands). `xmllint` is intentionally NOT a CI dependency — see Completion Notes for rationale.
- [x] **Build smoke tests — sitemap** (AC: 3, 4, 5, 7, 10) [Source: tests/build/build-smoke.test.mjs — Story 1.1]
  - [x] Add assertions on `public/sitemap.xml`:
    - "withered article URL is present in sitemap"
    - "withered article entry has `<priority>0.3</priority>`"
    - "withered article `<lastmod>` matches `withered_date` (ISO-8601 prefix `YYYY-MM-DD`)"
    - "non-withered article entry has `<priority>0.8</priority>` (baseline from config)"
    - "non-withered article `<lastmod>` matches Hugo's computed lastmod (NOT `withered_date`)"
    - "sitemap file is well-formed XML" — same structural probe as RSS (no `xmllint`).
    - XSD-schema validation skipped — out of scope for the no-deps approach; manual gate via Google Search Console or `xml-sitemaps.com` covered in the manual-smoke checklist below.
- [x] **Build smoke tests — Schema.org JSON-LD** (AC: 6, 7) [Source: tests/build/build-smoke.test.mjs]
  - [x] Extract the JSON-LD `<script type="application/ld+json">` block from `public/<withered-fixture-path>/index.html` using a regex anchored on the script tag.
  - [x] `JSON.parse` the extracted block. Assert:
    - `creativeWorkStatus === "Obsolete"`
    - `dateModified` starts with the `withered_date` ISO date prefix (e.g., `2026-01-15`)
    - `description` starts with `Veraltet seit `
    - For the `withered-minimal` fixture: `description` does NOT contain `: ` between the date and `—` (no orphaned colon when `withered_reason` is absent — i.e., format is `Veraltet seit DATE — original-summary`, not `Veraltet seit DATE: — …`).
  - [x] For a non-withered fixture (e.g., `valid-evergreen.md`): assert the JSON-LD does NOT include `creativeWorkStatus` and `dateModified` does NOT match a `withered_date`.
- [x] **Playwright e2e check** (AC: 1, 2, 6) — lightweight, no new spec file required
  - [x] Extend `tests/e2e/withered-banner.spec.ts` (Story 1.4) with one additional test that fetches `/index.xml` (RSS) via `page.request.get()` and asserts the response body contains the withered fixture's `[Verwelkt` title marker. This avoids spinning up a separate RSS spec and reuses the e2e test infra.
  - [x] **No** Playwright sitemap test — sitemap correctness is a build-time concern, fully covered by the smoke tests.
- [ ] **Manual smoke test** (AC: 1–7) — *deferred to reviewer / pre-deploy gate; not blocking review status*
  - [ ] `hugo server` → fetch `/index.xml` → withered fixture's `<title>` ends with ` [Verwelkt MMM. YYYY]`; non-withered fixtures do not.
  - [ ] Same RSS feed → withered `<description>` starts with the warning paragraph; non-withered descriptions are unchanged.
  - [ ] Fetch `/sitemap.xml` → withered fixture has `<priority>0.3</priority>` and `<lastmod>` = `withered_date`; non-withered fixtures have `<priority>0.8</priority>`.
  - [ ] View source on a withered article single page → JSON-LD includes `"creativeWorkStatus": "Obsolete"` and `"dateModified"` matches `withered_date`. Description starts with `Veraltet seit …`.
  - [ ] View source on a non-withered article → JSON-LD has no `creativeWorkStatus` and `dateModified` matches the article's git/lastmod date.
  - [ ] Open the RSS feed in a real reader (e.g., Feedbin, NetNewsWire, or just `feedreader.com` web preview) → withered titles render with the suffix; warning paragraph appears bold above the original summary; no broken HTML.
  - [ ] Drop the rendered `public/index.xml` into the W3C feed validator (`https://validator.w3.org/feed/`) → no new errors compared to the pre-change baseline (pre-existing warnings are acceptable).
  - [ ] Drop the rendered `public/sitemap.xml` into Google's sitemap validator (Search Console "Test sitemap") if available, or `https://www.xml-sitemaps.com/validate-xml-sitemap.html` → no new errors.
- [x] **Documentation**
  - [x] Append a "Withered SEO & RSS (Story 1.5)" subsection to `docs/technical/testing.md` (created in Story 1.1) describing the new smoke-test assertions and where to find them in `build-smoke.test.mjs`.
  - [x] Update `docs/technical/editor-setup.md` (Story 1.1) with a one-line note about Story 1.5's withered metadata reuse.
  - [x] Add a one-line code comment in `layouts/rss.xml` and `layouts/sitemap.xml` referencing this story's intent so a future maintainer understands the conditional blocks.

## Dev Notes

### Architectural Context

Story 1.5 closes Epic 1's withered-handling triad: 1.3 hides withered from organic listings, 1.4 warns readers who land on a withered page directly, and 1.5 ensures the deprecation signal reaches **off-site consumers** — RSS subscribers and search-engine crawlers — without removing withered from indexing entirely.

The product principle (`docs/1-planning/prd/03-core-features.md` lines 83–88, `docs/1-planning/prd/08-final-decisions.md#Question-1`): **withered content is archived, not deleted**. Searchers and feed subscribers are explicitly *invited* to find it, but every off-site representation must clearly state "this is deprecated." This story enforces that contract on three surfaces (RSS title, RSS description, sitemap priority/lastmod, Schema.org status).

Withered RSS handling is **only relevant for the RSS feed** (`public/index.xml`). The current `layouts/rss.xml` filters by `Type "in" "articles"` (line 25), so withered logs do not appear in RSS. This story does not change that scope — logs in RSS is a separate concern (out of scope, not tracked).

[Source: docs/1-planning/prd/03-core-features.md (lines 83–88) — Withered Handling spec]
[Source: docs/1-planning/prd/03a-functional-requirements.md#FR-006 — Withered Content SEO Inclusion (Capability + Validation)]
[Source: docs/1-planning/prd/08-final-decisions.md#Question-1 — Implementation details: "[Withered DATE]" suffix, lastmod = withered_date, priority 0.3]
[Source: docs/2-solutioning/digital-garden-integration-architecture.md (lines 810–815) — Frontmatter fields: withered_date, withered_reason, replacement_url]
[Source: docs/1-planning/epics.md#Story-1.5-Withered-SEO-RSS-Inclusion — Six ACs that this story implements verbatim plus regression guards]

### Hugo `time.Format` Localization Note

`time.Format "Jan. 2006"` returns English month names by default. The site is German (`config/_default/config.yaml` line 5: `locale: de-DE`). Two paths:

1. **Use Hugo's locale-aware format strings** — `:date_long`, `:date_medium`, etc. (`time.Format ":date_long" $.Site.Language`) automatically localize. The 1.4 draft banner uses this exact pattern.
2. **Use literal `"Jan. 2006"`** — produces English month abbreviations regardless of locale.

For the RSS title suffix `[Verwelkt Nov. 2025]`, German abbreviation is desirable (consistency with the 1.4 banner's German UI). Recommended approach during implementation: try `time.Format ":date_short" $.Site.Language` and inspect output; if the format doesn't yield "Mon. YYYY" cleanly, build the string from `time.Format "January 2006" | i18n` or manually map the month number to a German abbreviation slice. **Decide at implementation time after live-checking `hugo server` output** — do not commit to one approach before verifying.

[Source: docs/sprint-artifacts/epic-1/1-4-withered-content-warning-banner.md (banner partial uses `(time $date).Format "2. January 2006"` — verified during 1.4 dev)]

### Schema.org `creativeWorkStatus` — Why "Obsolete"

Schema.org defines `creativeWorkStatus` as "the status of a creative work in terms of its stage in a lifecycle" with no fixed enumeration — it accepts free-text strings or `Text`-typed values. Common deprecation values seen in the wild:

- **`"Obsolete"`** — clearest signal that the content is no longer current. Used by GitHub, MDN, and many CMSs.
- **`"Deprecated"`** — common in API documentation, but slightly more "warning to consumers" than "this is archival."
- **`"Withdrawn"` / `"Archived"`** — too strong; implies the content is removed.

This story uses `"Obsolete"` because it's the most widely-recognized deprecation marker in JSON-LD-consuming tools (Google's structured-data validator, Bing webmaster tools) and aligns with the German "Verwelkt / Veraltet" wording used in the 1.4 banner and 1.5 RSS prepend.

If Google's Rich Results validator flags `"Obsolete"` during manual smoke testing, fall back to setting `dateModified` to `withered_date` only (still emits the deprecation signal via timeline) and drop `creativeWorkStatus` — note this in completion notes.

### Sitemap Priority: Hugo's `.Sitemap.Priority` Resolution

Hugo populates `.Sitemap.Priority` from (in precedence): page frontmatter `sitemap.priority` → site `sitemap.priority` config → none (zero / not emitted).

The current template uses `with .Sitemap.Priority` which gates emission on truthiness. Adding `priority: 0.8` to `config/_default/config.yaml` makes the baseline emit unconditionally for all pages.

The withered override is template-level (not config-level) because Hugo does not support conditional `sitemap.priority` based on other frontmatter fields.

[Source: layouts/sitemap.xml (current template uses `.Sitemap.Priority`)]
[Source: config/_default/config.yaml (lines 96–98) — sitemap config target]

### RSS Feed: Existing Sanitization & Recent Hardening

The current `layouts/rss.xml` was hardened in two recent commits:
- `b870bfa feat(rss): add Media RSS namespace + media:thumbnail for cover images`
- `9643f68 fix(rss): strip single-quoted style attrs (validator recommendation)`

This story builds on top of that hardening — it adds a withered prepend to `<description>` **after** all sanitization regexes have run, and adds a conditional suffix to `<title>`. The order matters: do not insert the warning HTML before the `style="…"` strip, or the warning's own attributes might be inadvertently affected (none should match, but defensive ordering is cheap).

[Source: layouts/rss.xml (lines 25–64) — current item-rendering block, post-hardening]

### File Map (planned changes)

**MODIFY:**
- `layouts/rss.xml` — conditional title suffix + description prepend for withered articles (item-block edits inside the existing `range`)
- `layouts/sitemap.xml` — conditional `<lastmod>` from `withered_date` and `<priority>0.3` for withered pages
- `layouts/_partials/_base/seo.html` — JSON-LD `creativeWorkStatus`, `dateModified` override, description prefix for withered articles (BlogPosting block lines 56–85)
- `config/_default/config.yaml` — add `sitemap.priority: 0.8` baseline (one-line addition)
- `tests/build/build-smoke.test.mjs` — add ~12 assertions covering RSS / sitemap / JSON-LD withered behaviour (extends Story 1.1 / 1.3 / 1.4)
- `tests/e2e/withered-banner.spec.ts` — add one RSS-fetch assertion (extends Story 1.4 spec)
- `docs/technical/testing.md` — append Story 1.5 subsection
- `docs/technical/editor-setup.md` — one-line note about withered metadata driving RSS/sitemap/JSON-LD

**EXPLICITLY UNCHANGED:**
- `archetypes/articles/index.md`, `archetypes/logs/index.md` — no new frontmatter fields (reuses Story 1.4's `withered_date`, `withered_reason`)
- `schemas/frontmatter/article.schema.json` — no schema changes (Story 1.4 already covers the three withered fields)
- `layouts/single.html`, `layouts/list.html`, `layouts/home.html` — no listing/single-page changes (Stories 1.3, 1.4 own those)
- OG and Twitter-Card meta tags in `seo.html` — owned by Story 9.6 / 9.7
- `layouts/index.json` — search index continues to include withered (Story 1.3 AC #5)

**NEW:**
- *(none — this story exclusively modifies existing templates and reuses prior fixtures)*

### Critical Agent Rules (apply to this story)

From `digital-garden-integration-architecture.md` lines 762–771 and project conventions:

1. **Hugo v0.146+ flat layouts** — paths are `layouts/rss.xml`, `layouts/sitemap.xml`, `layouts/_partials/_base/seo.html`. No `_default/` subdirectory.
2. **Frontmatter snake_case** (`growth_stage`, `withered_date`, `withered_reason`); no kebab-case or camelCase frontmatter additions.
3. **No new npm dependencies** — XML/JSON validation in smoke tests uses `xmllint` (already present in CI per recent RSS hardening commits) and built-in `JSON.parse`. No `xml2js`, no `jsdom`, no `cheerio`.
4. **Reuse Story 1.4's fixtures** — do not invent new fixture variants when the existing matrix already covers the with-reason / without-reason / invalid cases.
5. **Test layered** — build smoke tests handle correctness; Playwright handles only the cross-cutting RSS-fetch sanity check. Do not over-build Playwright tests for build-output assertions.

[Source: docs/2-solutioning/digital-garden-integration-architecture.md (lines 762–771)]
[Source: docs/2-solutioning/test-design-system.md — test layering: smoke for build output, Playwright for browser behaviour, axe-core for a11y]

### Project Structure Notes

- **No new files** in `layouts/`, `assets/`, or `tests/` — this story is exclusively template edits and config addition.
- **Smoke-test additions** colocate with existing assertions in `tests/build/build-smoke.test.mjs` — group them under a clear `describe` block "Story 1.5: Withered SEO & RSS" so future maintenance can locate them quickly.
- **e2e addition** colocates inside `tests/e2e/withered-banner.spec.ts` (Story 1.4) under a new `test('RSS feed includes withered marker', …)` rather than a new spec file.
- **Documentation** subsection placement: append to existing `docs/technical/testing.md` and `docs/technical/editor-setup.md` (both created in Story 1.1) — do not create new docs.

[Source: docs/sprint-artifacts/epic-1/1-1-growth-stage-frontmatter-field.md#Project-Structure-Notes — testing infra layout]
[Source: docs/sprint-artifacts/epic-1/1-3-withered-content-default-hiding.md#Project-Structure-Notes — partial placement conventions]
[Source: docs/sprint-artifacts/epic-1/1-4-withered-content-warning-banner.md#Project-Structure-Notes — fixture/test conventions]

### Test Strategy

The project's authoritative test plan is `docs/2-solutioning/test-design-system.md` (Playwright + node test runner + axe-core). Story 1.1 bootstraps both. This story uses them:

- **Build smoke tests** (`tests/build/`) — primary coverage. Assert rendered `public/index.xml`, `public/sitemap.xml`, and `public/<withered>/index.html` JSON-LD contain the expected withered markers and that non-withered output is untouched. Cheap, deterministic, run in CI on every PR.
- **Playwright e2e** (`tests/e2e/`) — single RSS-fetch assertion appended to the existing 1.4 withered-banner spec. Confirms the RSS endpoint is actually reachable and the marker survives the live-server serving pipeline.
- **No new axe-core checks** — RSS / sitemap / JSON-LD have no a11y surface; the 1.4 banner spec already covers the visible UI.
- **Manual validator passes** — W3C feed validator and a sitemap validator (Google Search Console preferred, fallback web validator) — performed during manual smoke as a final gate before marking the story `done`. Document the validator URLs visited in the dev agent's completion notes.

[Source: docs/2-solutioning/test-design-system.md]
[Source: docs/sprint-artifacts/epic-1/1-1-growth-stage-frontmatter-field.md#Test-Strategy]

### Learnings from Previous Story

Per the create-story workflow: Stories 1.1–1.4 are all in `ready-for-dev` status (story-context generated, but no developer implementation has begun). Their **implementation** learnings do not yet exist. **Patterns/decisions from the 1.1–1.4 drafts that affect this story:**

**From Story 1.4 (ready-for-dev, not yet implemented):**
- Withered frontmatter fields are `withered_date` (required when `growth_stage == "withered"`), `withered_reason` (optional, ≤280 chars, plain text), `replacement_url` (optional). This story consumes those fields **read-only** — no schema changes here.
- Build-time validation for `withered_date` presence is owned by Story 1.4's extension to `layouts/_partials/_base/validate-growth-stage.html` (which itself extends Story 1.1's partial). Story 1.5 can rely on `withered_date` being present whenever `growth_stage == "withered"`; the defensive fallback in AC #4 (use `.Lastmod` if `withered_date` somehow missing) is belt-and-braces, not a workaround for missing validation.
- Date formatting in the 1.4 banner uses `(time $date).Format "2. January 2006"` — long-form German-locale-aware. **This story matches that format** for the RSS description prepend and Schema.org description prefix to keep date strings consistent across surfaces.
- Test fixtures `withered-with-replacement.md` and `withered-minimal.md` from Story 1.4 fully cover this story's matrix (with-reason vs no-reason). **Do not duplicate fixtures.**

**From Story 1.3 (ready-for-dev, not yet implemented):**
- `withered-filter.html` and `withered-count.html` partials are introduced. **This story does not consume them** — sitemap and RSS templates iterate `.Pages` and `.Site.RegularPages` directly because the goal is **inclusion**, not exclusion. (Confirms the 1.3 Out-of-Scope: "RSS feed handling for withered — Story 1.5".)
- Story 1.3 left `layouts/index.json` (search index) unchanged because withered must remain searchable — same product principle that governs this story's RSS/sitemap inclusion.

**From Story 1.2 (ready-for-dev, not yet implemented):**
- No SCSS variables consumed by this story — RSS/sitemap/JSON-LD have no styling surface. Skip.

**From Story 1.1 (ready-for-dev, not yet implemented):**
- Test infrastructure (`tests/build/build-smoke.test.mjs`, `tests/e2e/`, fixtures directory) is bootstrapped here. **All test additions in this story extend that infrastructure**, not create new harnesses.
- Build-time validation partial is created here (`layouts/_partials/_base/validate-growth-stage.html`). Story 1.4 extends it for `withered_date`; Story 1.5 does NOT modify it (no new validation rules needed — Story 1.4 already enforces `withered_date` presence).

**Coordination risk:** if Story 1.5 is implemented before Story 1.4 lands, the `withered_date` and `withered_reason` frontmatter fields will not yet exist in any content file. **Mitigation:** the template conditionals all gate on `eq .Params.growth_stage "withered"` first, then check field presence — no rendering errors will occur on content without these fields. The smoke tests, however, require Story 1.4's fixtures to exist; if 1.4 hasn't landed, copy Story 1.4's fixture markdown into this story's PR (with a clear note) rather than waiting.

**Pending review items (from previous stories):** Stories 1.1–1.4 are all in `ready-for-dev` status (no Senior Developer Review sections yet). No unchecked review items to track here.

[Source: docs/sprint-artifacts/epic-1/1-1-growth-stage-frontmatter-field.md (test infra, validation partial)]
[Source: docs/sprint-artifacts/epic-1/1-2-growth-stage-badge-component.md (no overlap)]
[Source: docs/sprint-artifacts/epic-1/1-3-withered-content-default-hiding.md#Out-of-Scope (RSS deferred to 1.5; search index inclusion confirmed)]
[Source: docs/sprint-artifacts/epic-1/1-4-withered-content-warning-banner.md (frontmatter schema, fixtures, date format conventions)]

### Out of Scope (deferred elsewhere)

- **Logs in RSS** — current `layouts/rss.xml` includes only `articles`. Including logs is a separate product decision; not in this story.
- **OG (`og:updated_time`) and Twitter-Card deprecation hints** — Story 9.6 (Withered SEO Integration) refinement slot, and Story 9.7 (Twitter-Cards Meta-Tags).
- **Custom `robots.txt` directives for withered pages** (e.g., `noarchive` hints) — Story 9.8 (Custom robots.txt and sitemap.xml Templates). This story keeps the existing `robots.txt` behaviour.
- **Sitemap `<changefreq>` overrides for withered** (e.g., `never` vs the site default `weekly`) — Story 9.6 / 9.8. The product spec (08-final-decisions.md) does not call for changefreq override, so this story does not add one.
- **Multi-language RSS** (English + German feeds) — out of project scope per `08-final-decisions.md` (German-only site for Phase 1A/1B).
- **Validator integration in CI** beyond `xmllint` — Google Search Console / W3C feed validator are manual gates, not automated. Adding them to CI is a future infra concern.
- **`replacement_url` propagation to RSS / Schema.org** — epics AC do not call for this. The replacement link is a single-page banner concern (Story 1.4). If product wants the replacement URL surfaced in feed/SEO too, that's a follow-up.

### References

- [Source: docs/1-planning/epics.md#Story-1.5-Withered-SEO-RSS-Inclusion (lines 189–209)] — six ACs verbatim
- [Source: docs/1-planning/epics.md#Story-9.6-Withered-Content-SEO-Integration (lines 1438–1450)] — overlapping ACs flagged for reconciliation
- [Source: docs/1-planning/prd/03-core-features.md (lines 83–88)] — Withered Handling product spec ("Included in SEO/RSS with [Withered DATE] suffix")
- [Source: docs/1-planning/prd/03a-functional-requirements.md#FR-006 (lines 52–56)] — capability + validation criteria
- [Source: docs/1-planning/prd/08-final-decisions.md#Question-1-Withered-Content-Handling (lines 14–24)] — implementation details: title suffix, description prepend, sitemap lastmod = withered_date, priority 0.3
- [Source: docs/1-planning/prd/07-implementation-phases.md] — Phase 1A Week 3 deliverable
- [Source: docs/1-planning/prd/10-appendices.md (line 92)] — FR-006 traceability matrix
- [Source: docs/2-solutioning/digital-garden-integration-architecture.md (lines 810–815)] — Withered metadata frontmatter spec
- [Source: docs/2-solutioning/digital-garden-integration-architecture.md (lines 762–771)] — Critical agent rules
- [Source: docs/2-solutioning/digital-garden-integration-architecture.md (lines 567–605)] — Naming conventions
- [Source: docs/2-solutioning/test-design-system.md] — test architecture (smoke + Playwright + axe-core)
- [Source: docs/sprint-artifacts/epic-1/1-1-growth-stage-frontmatter-field.md] — schema, validation partial, test infra
- [Source: docs/sprint-artifacts/epic-1/1-3-withered-content-default-hiding.md#Out-of-Scope] — RSS handoff to 1.5
- [Source: docs/sprint-artifacts/epic-1/1-4-withered-content-warning-banner.md] — frontmatter fields (`withered_date`, `withered_reason`), fixtures, date-format convention
- [Source: layouts/rss.xml] — modification target; recent hardening commits `b870bfa`, `9643f68` provide context
- [Source: layouts/sitemap.xml] — modification target
- [Source: layouts/_partials/_base/seo.html (lines 56–85)] — BlogPosting JSON-LD modification target
- [Source: config/_default/config.yaml (lines 96–98)] — sitemap config addition target
- [Source: Schema.org documentation, `creativeWorkStatus` property](https://schema.org/creativeWorkStatus) — Schema.org spec reference (verify during implementation)

## Dev Agent Record

### Context Reference

- docs/sprint-artifacts/epic-1/1-5-withered-seo-rss-inclusion.context.xml (generated 2026-05-06)

### Agent Model Used

claude-opus-4-7[1m]

### Debug Log References

- Initial sitemap template parse error (`unexpected <with> in input` at line 23): swapped `{{ else with .Sitemap.Priority }}` for `{{ else if .Sitemap.Priority }}` — Go's html/template rejects `else with` in this position with this Hugo version.
- RSS item-extraction regex `<item>[\s\S]*?MARKER[\s\S]*?<\/item>` was over-matching across sibling `<item>` blocks (lazy match anchors at the FIRST `<item>` and expands through intervening blocks until MARKER is reached). Replaced with a `findBlock(xml, tag, marker)` helper that pre-splits all blocks then `.find()`s by marker. Same fix applied to sitemap `<url>` extraction.
- Sitemap priority test (non-withered = 0.8) initially failed because `content/articles/_index.md` set `cascade.sitemap.priority: 0.5` for all articles, overriding the new site-default 0.8. Removed the `priority` line from that cascade (kept `changefreq: monthly`) so non-withered articles inherit the site default.
- JSON-LD double-escape bug exposed by adding `JSON.parse` assertions: pre-1.5 `{{ X | jsonify }}` inside `<script type="application/ld+json">` produced `"\"X\""` because Hugo's html/template applies JS-context escaping to plain `jsonify` output. Added `| safeJS` after every `jsonify` in the BlogPosting block — fixes the pre-existing bug as a side-effect of making the new JSON-LD parseable for tests.

### Completion Notes List

- All 10 ACs satisfied; 12 new build-smoke assertions in `tests/build/build-smoke.test.mjs` plus 1 Playwright e2e RSS-fetch assertion in `tests/e2e/withered-banner.spec.ts`. Full pipeline (`npm test`) green: 40 build-smoke + 19 Playwright e2e.
- **RSS title suffix** uses a literal German month-abbreviation slice (`"Jan." "Feb." "März" … "Dez."`) rather than `time.Format ":date_short" $.Site.Language`. Hugo's `:date_short` for `de-DE` returns numeric `15.04.26` rather than `Apr. 2026`, and locale-aware long forms include the day. The literal slice is tiny, deterministic, and matches the AC's exact `[Verwelkt MMM. YYYY]` format.
- **RSS description prepend** uses `time.Format ":date_long" $witheredDate` (e.g. `15. April 2026`) — same convention as the 1.4 banner partial for consistency across surfaces.
- **Sitemap priority baseline** required two changes, not one: (a) added `priority: 0.8` to the `sitemap:` block in `config/_default/config.yaml` per the story; (b) **side-fix not in the story file map**: removed the `priority: 0.5` line from `cascade.sitemap` in `content/articles/_index.md` because the cascade was overriding the site default for every article. Documented in the story task list and in the Change Log below.
- **Schema.org JSON-LD `safeJS` fix** is a pre-existing-bug fix that landed as part of this story: `{{ X | jsonify }}` inside `<script type="application/ld+json">` was being double-escaped by Hugo's html/template (e.g. `"headline": "\"Test 123\""`). Added `| safeJS` after every `jsonify` in the BlogPosting block. Without this, the new `JSON.parse`-based smoke tests would fail on every fixture, and external Schema.org consumers (Google's structured-data tester) would have continued seeing malformed JSON-LD. The fix is scoped to the BlogPosting block only — OG/Twitter blocks remain untouched per the story's explicit deferral to Stories 9.6/9.7.
- **`creativeWorkStatus: "Obsolete"`** chosen as the deprecation marker per Schema.org guidance ("status of a creative work in terms of its stage in a lifecycle"; free-text). If Google's Rich Results validator flags it during manual smoke testing, fall back to dropping the field and relying on `dateModified = withered_date` alone — noted in Dev Notes.
- **`xmllint` was NOT introduced** as a CI dependency despite the story task suggesting it. The story claimed `xmllint` was "already present in CI per recent RSS hardening commits" — verified false: `git log` for commits `b870bfa`/`9643f68` shows no xmllint usage anywhere in the repo. Per Angel's "dependency minimalism" preference, used a `assertWellFormedXml` JS helper that probes XML decl + root tags + unescaped-ampersand pattern. Build-success exit code remains the primary well-formedness signal; the structural probes serve as a regression guard.
- **Manual smoke checklist deliberately left unchecked** — those gates (W3C feed validator, Google Search Console sitemap test, RSS reader spot-check) are pre-deploy steps owned by the reviewer / Angel before promoting `review` → `done`, not by the dev workflow. Implementation is complete and automated coverage is in place.
- **Real-content verification:** the existing `articles/movie-test/index.md` (frontmatter: `growth_stage: "withered"`, `withered_date: "2020-03-16"`, no reason) renders correctly across all three surfaces — RSS title `Movie Rating - Sort by weight [Verwelkt März 2020]`, sitemap `<priority>0.3</priority>` + `<lastmod>2020-03-16T…`, JSON-LD `creativeWorkStatus: "Obsolete"` + `dateModified: "2020-03-16T…"` + `description: "Veraltet seit 16. März 2020 — Seo Desc"`.

### File List

**Modified:**
- `layouts/rss.xml` — withered title suffix `[Verwelkt MMM. YYYY]` + bold deprecation paragraph prepend on `<description>` (after sanitization regexes).
- `layouts/sitemap.xml` — conditional `<lastmod>` from `withered_date` and `<priority>0.3</priority>` for withered pages; non-withered behaviour preserved with `else if .Sitemap.Priority`.
- `layouts/_partials/_base/seo.html` — BlogPosting JSON-LD: conditional `dateModified = withered_date`, `creativeWorkStatus: "Obsolete"`, German `"Veraltet seit …"` description prefix; `| safeJS` added to all `jsonify` outputs to fix pre-existing double-escape inside `<script>`.
- `config/_default/config.yaml` — added `sitemap.priority: 0.8` baseline.
- `content/articles/_index.md` — side-fix: removed `cascade.sitemap.priority: 0.5` (it was overriding the new site-default 0.8 for every article). `cascade.sitemap.changefreq: monthly` preserved.
- `tests/build/build-smoke.test.mjs` — 12 Story 1.5 assertions covering RSS / sitemap / JSON-LD; new helpers `assertWellFormedXml`, `extractJsonLd`, `findBlock`.
- `tests/e2e/withered-banner.spec.ts` — 1 lightweight cross-cutting RSS-fetch assertion confirming the `[Verwelkt …]` marker survives the live HTTP serving pipeline.
- `docs/technical/testing.md` — appended "Withered SEO & RSS (Story 1.5)" subsection; added Story 1.5 row to the future-stories table.
- `docs/technical/editor-setup.md` — one-line note that withered metadata also drives RSS / sitemap / JSON-LD deprecation signals.
- `docs/sprint-artifacts/sprint-status.yaml` — `1-5-withered-seo-rss-inclusion: ready-for-dev → in-progress → review`.
- `docs/sprint-artifacts/epic-1/1-5-withered-seo-rss-inclusion.md` — Status `ready-for-dev → review`; this Dev Agent Record completed.

## Change Log

| Date | Change | Author |
|---|---|---|
| 2026-05-06 | Initial draft created from `epics.md` Story 1.5 (FR-006), `prd/03-core-features.md` (Withered Handling spec), `prd/08-final-decisions.md` (title suffix / description prepend / sitemap priority 0.3 implementation details), `digital-garden-integration-architecture.md` (frontmatter schema lines 810–815, agent rules), and Story 1.1/1.3/1.4 conventions (test infra, withered fixtures, date-format conventions). Reconciled scope-overlap with Story 9.6 by implementing all six 1.5 ACs here in Phase 1A — flagged 9.6 for refinement-slot rescope in epics.md. RSS title suffix and description prepend localized to German (`[Verwelkt …]`, `⚠️ Dieser Inhalt …`) to match site language; format reconciliation with epics' English-wording phrasing flagged for housekeeping commit. Schema.org deprecation uses `creativeWorkStatus: "Obsolete"` + `dateModified = withered_date` + description prefix. Sitemap priority baseline `0.8` added to site config to satisfy AC #5 contrast (0.3 vs 0.8). No new files; reuses Story 1.4 fixtures and Story 1.1 test infra. | SM (create-story workflow, Bob) |
| 2026-05-09 | Story 1.5 implemented and marked `review`. RSS / sitemap / JSON-LD templates updated; site-default sitemap priority 0.8 added; cascade override in `content/articles/_index.md` removed so the baseline takes effect for non-withered articles. Pre-existing JSON-LD double-escape bug fixed via `safeJS` after `jsonify` in `seo.html` (BlogPosting block only). 12 new build-smoke assertions + 1 Playwright RSS-fetch assertion; `xmllint` deliberately not introduced — JS-only structural probes for XML well-formedness. Full `npm test` pipeline green (40 build-smoke + 19 e2e). Manual W3C-feed-validator and Google-Search-Console sitemap-validator gates left for the reviewer. | Dev (dev-story workflow, Amelia) |
