# ADR: Multi-Author Schema → Single + Optional Co-Author

**Status:** Accepted
**Date:** 2026-05-12
**Decided:** 2026-05-12
**Owner:** Angel Crawford
**Related:** [`adr-domain-migration.md`](./adr-domain-migration.md) (Identity
Unification), [`docs/1-planning/epics.md`](../1-planning/epics.md)
(Stories 9.2, 9.10, 9.13)

---

## Context

The current Hugo project carries a **multi-author content model**
inherited from the original "Article Time" magazine concept:

- **Taxonomy:** `config/_default/config.yaml` defines
  `taxonomies.author: authors`, generating per-author bio pages under
  `/authors/<slug>/`.
- **Content directory:** `content/authors/` holds two author terms:
  - `angel/_index.md` — Angel Crawford (real, with birthdate, socials,
    website, full bio).
  - `jdksaj/_index.md` — test fixture "HJKHJ Udsanhjs" pointing at a
    Bruce Willis Wikipedia URL.
- **Frontmatter:** articles/logs use `authors: [...]` (array of
  taxonomy term slugs). Across the four content files in the repo,
  three are single-author (`["angel"]`); the fourth
  (`content/articles/test/index.md`) is multi-author
  (`["jdksaj", "angel"]`) and is itself test content.
- **Templates:** `layouts/single.html:212` branches on
  `.Params.authors`. `layouts/_partials/_base/seo.html:111` and
  `footer.html:102` resolve the site-default author via
  `.Site.Params.author.name`.
- **Known drift:** Story 9.2 (Schema.org Structured Data) Pre-Spec
  Notes flag a *BlogPosting multi-author duplicate-key bug* in
  `seo.html`. Story 9.10 (Author-Box) AC4 specifies "Multiple authors:
  all displayed; if more than 3, collapse with '+N more' toggle" — UI
  scaffolding for a multi-author future that, in this project's
  reality, has only ever produced one test fixture.

Separately, the [Domain & Brand Migration ADR](./adr-domain-migration.md)
(Accepted 2026-05-12) establishes the site as a **personal,
single-author digital garden** under `angel-crawford.de`. Story 9.13
introduces `params.identity` (`name`, `photo`, `note`, `url`) as the
canonical h-card identity source.

This leaves the project carrying two parallel author identity
abstractions:

1. **Site-owner identity** — `params.author.name`,
   `params.identity.*`, footer copyright, JSON-LD `author` field.
2. **Per-article author taxonomy** — `authors: [...]` frontmatter,
   `content/authors/<slug>/`, taxonomy-driven Author-Box.

The IndieWeb principle "one h-card per person, linked between sites"
makes the internal taxonomy redundant for the realistic case (one
site, one main author, occasional co-authors who have their own
sites). Mainstream feed readers do **not** consume h-entry-internal
author taxonomies, so the abstraction provides no downstream value.

---

## Decision

Replace the multi-author taxonomy model with a **single-author default
plus optional co-authors** model:

### Frontmatter schema

```yaml
# Optional. Defaults to params.identity.name.
author: "Some Name"

# Optional. Array of co-author objects.
coauthors:
  - name: "Co-Author Name"
    url: "https://co-author-site.example"
```

- `author:` field is **optional**; absence resolves to
  `params.identity.name` (the site owner).
- `coauthors:` field is **optional**; absence renders no co-author
  block. Each entry is an **object** with `name` (required) and `url`
  (optional). The object form is forward-compatible: future fields
  like `photo`, `bio`, or `mastodon` can be added without a schema
  break.

### Author taxonomy removed

- `taxonomies.author: authors` removed from
  `config/_default/config.yaml`.
- `content/authors/` directory removed (all three files:
  `_index.md`, `angel/_index.md`, `jdksaj/_index.md`).
- No more auto-generated `/authors/<slug>/` pages. The site owner's
  bio lives via `params.identity` (and, if longer-form, on the home
  page itself or a dedicated `/about/` page).

### `params.author` → `params.identity` consolidation

- `params.author.*` removed.
- `params.identity` becomes the canonical single source for
  site-owner identity. Story 9.13 introduces the minimum shape
  (`name`, `photo`, `note`, `url`); this ADR extends it for the
  footer/JSON-LD use case (see § What changes below).
- `params.default_author_name` fallback chain in
  `footer.html` line 102 collapses to a single
  `params.identity.name` reference.

### Co-author rendering convention (IndieWeb-aligned)

- Main author rendered as h-entry's `p-author h-card` block, content
  from `params.identity`.
- Each co-author rendered inside the same h-entry as an additional
  `p-author h-card` block (microformats2 allows multiple `p-author`
  entries per h-entry). Co-author `name` → `p-name`; `url` (when
  present) → `u-url`.

### What this decision does NOT change

- **IndieWeb h-card on home page** (Story 9.13) — unchanged; the
  per-article author markup added here is `p-author` inside h-entry,
  distinct from the homepage `h-card`.
- **Mastodon / Bridgy / webmention infrastructure** — per-person
  identity is unchanged; Angel's Fediverse identity is unaffected.
- **Test fixture content** (`content/articles/test/`) — retained
  (per Angel's request to keep a working co-author render case);
  frontmatter is migrated to the new schema (see § What changes).

---

## What changes

| Surface | Before | After |
|---------|--------|-------|
| `config/_default/config.yaml` taxonomies block | `author: authors` listed | line removed |
| `content/authors/` | 3 files (taxonomy term pages) | directory removed |
| Article/log frontmatter | `authors: ["angel"]` or `["jdksaj", "angel"]` | field removed when single-author = site owner; `coauthors: [{name, url}]` when relevant |
| `layouts/single.html` line 212 | `{{- if .Params.authors -}}` taxonomy branch | reads `params.identity` for main author; renders `coauthors` block when frontmatter has it |
| `layouts/_partials/_base/seo.html` line 111 | `.Site.Params.author.name` for JSON-LD `author` | `.Site.Params.identity.name`; coauthor (if present) becomes additional JSON-LD `author` (BlogPosting allows array) — duplicate-key bug becomes structurally impossible |
| `layouts/_partials/_base/footer.html` line 102 | `or .Site.Params.author.name .Site.Params.default_author_name .Site.Title` fallback chain | `.Site.Params.identity.name` (single source) |
| `config/_default/params.yaml` | `params.author.name` (and possibly more) | `params.identity` block with `name`, `photo`, `note`, `url`, `bio`, `socials` (replaces the `content/authors/angel/_index.md` fields needed by footer/seo/Author-Box) |

### `params.identity` final shape (proposed)

```yaml
identity:
  name: "Angel Crawford"
  photo: "/images/identity/angel.webp"   # final path TBD in Story 9.14 AC6
  note: "<short bio — 1-2 sentences>"     # for h-card p-note
  url: ""                                  # leave empty → Hugo resolves to baseURL
  bio: |
    <longer bio — multiple paragraphs>     # for Author-Box / about page
  socials:
    - name: "Website"
      src: "https://angel-crawford.de"
      icon: "link"
    - name: "Instagram"
      src: "https://instagram.com/AngelCrawford"
      icon: "instagram"
    # ... existing socials from content/authors/angel/_index.md
```

### Test fixture migration

```yaml
# content/articles/test/index.md — before:
authors: ["jdksaj", "angel"]

# after:
coauthors:
  - name: "HJKHJ Udsanhjs"
    url: "https://en.wikipedia.org/wiki/Bruce_Willis"
# (author: field omitted → defaults to params.identity.name = "Angel Crawford")
```

This preserves Angel's testing requirement (Frage 3) without keeping
the dead `content/authors/jdksaj/` taxonomy term.

---

## Alternatives Considered

### Frontmatter shape

- **Variante A** (`author` string + `coauthor` single string) —
  rejected: forces re-schema if ever >1 co-author needed, even
  though that's rare.
- **Variante C** (keep `authors:` array, semantic `[0] = main`) —
  rejected: convention-only, doesn't reduce template complexity,
  perpetuates the "multi-author template branch" that this ADR
  aims to retire.
- **Variante D** (`author` always implicit, no override) — rejected:
  inflexible for the legitimate (if rare) "guest post by X" case.
- **Sub-variant B1** (`coauthors:` array of strings) — rejected: no
  URL field → no `u-url` in h-entry → IndieWeb-arm. Defeats half
  the IndieWeb work in Epic 2/7.
- **Sub-variant B3** (hybrid string/object with `reflect.IsMap`
  branch) — rejected: template complexity for marginal authoring
  effort saving; the object form is one extra `name:` line.

### Author taxonomy

- **Keep taxonomy** — rejected: redundant with homepage h-card per
  the Domain & Brand Migration ADR; feed readers don't consume
  internal author taxonomies; carrying it perpetuates the
  duplicate-identity-abstraction problem.
- **Replace with `/about/` page** — partially adopted: the home page
  already carries the canonical h-card (Story 9.13); a separate
  `/about/` page is a content-side choice, NOT a schema/taxonomy
  decision. Open for follow-up.

### Identity consolidation

- **Keep `params.author` and `params.identity` separate** — rejected:
  two truths for the same fact (site owner). Future-Angel will
  inevitably forget which one to update.
- **Use `params.author` as canonical, deprecate `params.identity`** —
  rejected: Story 9.13's `params.identity` is the IndieWeb-aligned
  name ("identity" = the IndieWeb concept; "author" = a per-content
  role).

---

## Consequences

### Positive

- **Schema matches reality.** One main author, occasional optional
  co-author with their own external IndieWeb identity.
- **Story 9.2 BlogPosting multi-author duplicate-key bug becomes
  structurally impossible.** With at most one main author + optional
  coauthor array → emit a single JSON-LD `author` value (or an array
  of two), never a duplicate top-level key.
- **Story 9.10 Author-Box simplified.** No taxonomy term lookup, no
  "+N more" collapse, no per-author bio resolution. Main author from
  `params.identity`; co-author block inline from frontmatter.
- **One identity source.** `params.identity` is the single truth for
  site-owner data — footer, JSON-LD, h-card, Author-Box all read
  from it.
- **IndieWeb conformance per article.** Each `p-author` block
  carries proper microformat classes; co-author `u-url` enables
  the IndieWeb-canonical pattern of cross-site identity linking.
- **Less code surface.** Three template files simplified; one
  taxonomy abstraction removed; one content directory removed.

### Negative

- **Schema migration touches the four existing content files.** All
  current `authors:` frontmatter lines must be edited. Trivial work
  (search-and-replace per file), but it's an irreversible step.
- **Three templates refactored.** `single.html`, `seo.html`,
  `footer.html`. The seo.html refactor incidentally fixes Story
  9.2's flagged bug, so that's net-positive — but it does mean Story
  9.2's Pre-Spec Note becomes obsolete and should be cleaned up.
- **Story 9.10 AC4 needs rewrite.** "+N more" collapse logic
  evaporates; replaced by simpler "main + optional co-author block".
- **Story 9.13 (h-card) gains a coordination point.** `params.identity`
  shape is finalized here, not in 9.13 alone. Whichever story is
  implemented first must respect the joint shape.

### Neutral

- **Test fixture `jdksaj`** is preserved as a co-author entry in
  `content/articles/test/index.md`, but no longer has its own
  taxonomy page (no bio, no Bruce-Willis-Wikipedia metadata). The
  test article's co-author URL points to the same Wikipedia link
  via the new `coauthors[0].url` field — functionally equivalent
  for testing the render path.
- **`params.default_author_name`** disappears as a fallback. The
  `or X Y .Site.Title` chain in `footer.html` collapses to a single
  reference because `params.identity.name` is always populated.

---

## Implementation Tracking

This ADR adds **one new Story** to Epic 9 plus **two
existing-story spec edits**:

### New: Story 9.16 — Multi-Author Schema Migration

**Working title:** "Author schema migration — multi-author taxonomy →
single + optional coauthor"

**Scope (all atomic in one PR):**

1. Introduce `params.identity` block in
   `config/_default/params.yaml` (final shape per § What changes
   above). If Story 9.13 already shipped a partial `params.identity`,
   extend it; otherwise create it.
2. Remove `taxonomies.author: authors` from
   `config/_default/config.yaml`.
3. Delete `content/authors/` directory (three files).
4. Migrate four content frontmatters (`articles/test/`,
   `articles/rss-test/`, `logs/log-test-2/`, `logs/log-testing/`)
   from `authors: [...]` to the new schema. Three drop the field
   entirely; the test article gets a `coauthors: [{name, url}]`
   block.
5. Refactor `layouts/single.html` line 212 author render block.
6. Refactor `layouts/_partials/_base/seo.html` line 111 JSON-LD
   author field; emit array form when coauthor present.
7. Refactor `layouts/_partials/_base/footer.html` line 102
   copyright line.
8. Remove `params.author` and `params.default_author_name` from
   `config/_default/params.yaml` if present.
9. Build-smoke regression: re-run the existing test suite; expect
   no failures unless they specifically asserted on the old schema.

**Prerequisites:** None (Foundation Story).

**Coordination with Story 9.13:** Story 9.16 is implemented BEFORE
Story 9.13. `params.identity` shape is defined here once; Story 9.13
pulls from the already-defined block when wiring the h-card. As a
result, Story 9.13 loses Foundation-Story status (gains hard
prerequisite on 9.16).

**Effort:** ~1 day.

### Edits: Story 9.2 (Schema.org Structured Data)

Pre-Spec Note "BlogPosting multi-author duplicate-key bug" becomes
**obsolete** once Story 9.16 lands. Action: when Story 9.2 is
implemented after 9.16, drop that Pre-Spec Note from the story spec
and add a one-line completion note referencing this ADR ("multi-author
duplicate-key risk eliminated structurally by ADR multi-author →
coauthor, Story 9.16; not a concern in 9.2's scope").

### Edits: Story 9.10 (Author-Box with Socials)

AC4 ("Multiple authors: all displayed; if more than 3, collapse with
'+N more' toggle") is **obsolete**. Replace with:

> **AC4 (revised):** Box displays the main author (from
> `params.identity`) on every article. If the article frontmatter has
> a `coauthors:` array, render an additional co-author block per
> entry (name + optional u-url link). No collapse/toggle UI required
> — `coauthors` is bounded to small N in practice.

Plus AC2 ("Box displays: avatar, name, bio …social links from term
frontmatter") needs adjustment: main author data sources from
`params.identity` (avatar, name, bio, socials), NOT from taxonomy
terms (which no longer exist). Co-author block displays name + url
only (no avatar/bio — those live on the co-author's own site).

---

## Resolved Open Questions

All questions raised at draft time resolved on 2026-05-12.

1. **Story sequencing.** Story 9.16 is implemented **before** Story
   9.13. This gives `params.identity` a single canonical definition
   point. Story 9.13 loses its Foundation-Story status and gains
   Story 9.16 as a hard prerequisite.
2. **Bio location.** Short bio in `params.identity.bio` (h-card
   `p-note`-compatible, 1–2 sentences). Long-form bio on a separate
   `content/pages/about.md` page (mirrors the existing
   angel-crawford.de profile-card content). Home-page h-card and
   footer use the short bio from `params.identity`; the long bio is
   reachable via an `/about/` link.
3. **Birthdate.** Not stored in `params.identity`. Lives only as
   free-form content on the `/about/` page (alongside other long-bio
   context).
4. **Retired `/authors/` URLs.** Removed without backwards
   compatibility — no redirects, no 301s. Site is currently in
   maintenance mode (no external indexing of those URLs); the "no
   inbound links to preserve" stance from
   [`adr-domain-migration.md`](./adr-domain-migration.md) applies
   identically.

---

## Follow-up tasks for Claude Code

None at draft time. Implementation Tracking above maps cleanly onto
existing/new stories; no separate discovery work needed before
Angel accepts/rejects this ADR.
