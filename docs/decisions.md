# Accepted decisions

Condensed from two full ADRs (2026-05-12). The reasoning survives; the epic/story cross-references and alternatives matrices went with the rest of the BMAD scaffolding.

---

## Single author, optional co-author

**Accepted 2026-05-12.** The blog has one identity: Angel Crawford. Co-authorship is an optional per-post field, not a user-management system.

**Why:** the multi-author schema was built for a magazine that never existed. It cost a taxonomy, an author-card component, a `content/authors/` tree, and a permanent ambiguity about whose site this is — for zero actual second authors.

**What it means in practice:**

- `params.author` was consolidated into **`params.identity`** — one place for name, photo, bio, and social links. Templates read `$identity.*`.
- The `authors` taxonomy and `content/authors/` are **gone**. Do not reintroduce them.
- Frontmatter `author:` is optional and defaults to `params.identity.name`. An optional `coauthors:` array carries occasional guests.
- Co-authors render IndieWeb-aligned (`p-author h-card`), not as a separate author-page link.

This is the concrete form of the scope sentence in [`CLAUDE.md`](../CLAUDE.md). Any feature that needs per-author permissions, author archives, or author-scoped media contradicts it.

---

## Domain migration: article-time.de → angel-crawford.de

**Accepted 2026-05-12. Not yet executed** — see the sequencing note below.

**Why:** two domains split one identity. `angel-crawford.de` held a hand-made profile card with links; `article-time.de` held the blog. IndieWeb identity (`h-card`, `rel=me`, webmentions, Bridgy) only works properly when there is exactly one canonical personal URL. The blog is the thing worth pointing at, so the blog moves to the personal domain and absorbs the profile card.

**Blocked until:** the profile card (webcard) lives inside this repo. That is what the maintenance-mode page is being rebuilt into — once it exists here, `angel-crawford.de` is free and this migration becomes executable.

### Cutover checklist

Preparation:

- ~~Audit config, templates, data files, and frontmatter for hardcoded `https://article-time.de/...`.~~ **Done 2026-08-09** — full inventory below. The short version: nine places need the cutover edit, everything else either derives from `baseURL` or is deliberately historical.
- ~~Prepare the static parking page for `article-time.de`.~~ **Dropped 2026-08-09, Angel's call:** the domain was never really live, so there is nobody to redirect — it simply lapses later. No parking page, no step 9.
- Fate of the old profile-card repo: superseded by the blog's own profile page; archive or delete at Angel's leisure after the cutover — nothing depends on it any more.

Execution, in order:

1. Maintenance mode ON (precaution during the swap).
2. `baseURL` → `https://angel-crawford.de` in `config/production/config.yaml` **and** `config/maintenance/config.yaml`. (The audit corrected this step: `config/_default/` carries no baseURL at all, and `config/development/` is localhost — exactly two files hold the domain.)
3. `CNAME` at the repo root → `angel-crawford.de`.
4. Repo `Settings → Pages → Custom domain` → `angel-crawford.de`, wait for the green DNS check.
5. Release the old profile-card repo's binding on the domain.
6. Re-register the webmention.io endpoint for the new domain; update `<link rel="webmention">` if hardcoded.
7. Update Bridgy.fed domain verification.
8. ~~Umami: create the new site entry.~~ **Done 2026-08-09** — Angel switched the entry to `angel-crawford.de`; the new `website_id` is already in `config/_default/params.yaml`.
9. ~~Parking page.~~ Dropped — see Preparation.
10. Maintenance mode OFF.
11. Verify: Mastodon `rel="me"` still green, `indiewebify.me` passes h-card **and** h-entry on the new domain, blog loads. The old domain just stops being ours.

### Hardcoded-URL audit — done 2026-08-09

Swept for `article-time.de` as a domain literal (the theme *name* `article-time`
appears in dozens of comments and stays — history, not configuration). Three of
the nine hits were added in August 2026 by the webmention work, which is why
this audit ran again instead of trusting the May checklist.

**Must be edited at cutover, in the same commit where sensible:**

| Where | What | Note |
|---|---|---|
| `config/production/config.yaml:2` | `baseURL` | step 2 |
| `config/maintenance/config.yaml:9` | `baseURL` | step 2 |
| `static/CNAME` | the domain | step 3 |
| `themes/garden/layouts/_partials/_base/head.html:59` | `<link rel="webmention">` endpoint | step 6 — the path carries the domain (`webmention.io/<domain>/webmention`), so re-registering on webmention.io comes first |
| `themes/garden/layouts/_partials/widgets/webmentions.html:33` | `$endpoint` — feeds the send form's `action` **and** the visible "Endpoint: /webmention" link | one variable, one edit; added Aug 2026 (#251) |
| `tests/build/build-smoke.test.mjs:643, 647, 678` | pinned endpoint regexes + message | MUST move in the same commit as head.html or the suite goes red — that is the pin's job |
| `config/_default/params.yaml` → `identity.email` | the contact address (was hardcoded twice in Impressum/Datenschutz; both use the `{{</* mail */>}}` shortcode now, guarded against harvesters) | **resolved 2026-08-09** — Angel set `mail@angel-crawford.de`; nothing left for the cutover |
| `README.md:7` | live link | cosmetic |
| `schemas/frontmatter/*.schema.json:3` (×3) | `$id` URIs | identifiers, never fetched — re-point for consistency, zero runtime impact |

**Survives the cutover untouched, checked rather than assumed:**

- CSP `form-action` / `connect-src` allow `https://webmention.io` — host only,
  no domain path, still correct afterwards.
- Umami: **resolved 2026-08-09** — Angel pointed the entry at
  `angel-crawford.de`; the `website_id` in `config/_default/params.yaml` is
  already the current one. Nothing left to do at cutover.
- `data/*.json` — zero domain literals (fixture URLs are `*.example`).
- Content frontmatter — no absolute `permalink`/`canonicalURL` anywhere.
- `params.identity` — all relative paths; `identity.url` empty resolves to
  `baseURL` by design.
- No `static/robots.txt` exists; robots handling is the per-page meta.
- `.github/workflows/daily-rebuild.yml:182` — comment only.
- `docs/`, `CLAUDE.md`, `.claude/skills/`, JS file headers — historical
  references to the old name/domain. Do not edit retroactively; documents
  that describe the past are allowed to name it.

**Brand track — all resolved 2026-08-09:** the site title was already
`Angel Crawford` in every config; the footer slogan is Angel's new line in
`identity.slogan` (the six-year-old "Be a part of Article Time!" and its
FIXME died with it); the `identity.photo` stays `angel.webp` through the
cutover by Angel's call; and the mail address is `mail@angel-crawford.de`
via the guarded shortcode. Nothing on the brand side blocks #248 any more.

### Deliberately not doing 301 redirects

`article-time.de` has no meaningful backlink profile or search history worth preserving — the blog was never publicly launched. A parking page with a link is honest and costs nothing to maintain; a redirect layer would be permanent infrastructure for traffic that does not exist.

### h-card prerequisite — done

`layouts/page/profile.html` carries the `h-card` wrapper, `p-name`, `u-photo`, and a hidden canonical self-link (`u-url` + `rel="me"`). Validate against indiewebify.me as part of step 11 rather than re-deriving it.
