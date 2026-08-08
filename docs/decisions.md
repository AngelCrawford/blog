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

- Audit config, templates, data files, and frontmatter for hardcoded `https://article-time.de/...`. `absURL` handles most of it via `baseURL`, but data and content do not auto-update.
- Prepare the static parking page for `article-time.de` — plain HTML, no Hugo: *"Diese Seite ist umgezogen nach angel-crawford.de."* plus a link.
- Decide the fate of the old profile-card repo: archive, delete, or repurpose as the parking-page source.

Execution, in order:

1. Maintenance mode ON (precaution during the swap).
2. `baseURL` → `https://angel-crawford.de` in `config/_default/config.yaml` (check `config/maintenance/` and `config/production/`, which mirror it).
3. `CNAME` at the repo root → `angel-crawford.de`.
4. Repo `Settings → Pages → Custom domain` → `angel-crawford.de`, wait for the green DNS check.
5. Release the old profile-card repo's binding on the domain.
6. Re-register the webmention.io endpoint for the new domain; update `<link rel="webmention">` if hardcoded.
7. Update Bridgy.fed domain verification.
8. Umami: create the new site entry and cut analytics over; the `website_id` lives in `config/_default/params.yaml`.
9. Deploy the parking page on `article-time.de`.
10. Maintenance mode OFF.
11. Verify: Mastodon `rel="me"` still green, `indiewebify.me` passes h-card **and** h-entry on the new domain, blog loads, old domain parks.

### Deliberately not doing 301 redirects

`article-time.de` has no meaningful backlink profile or search history worth preserving — the blog was never publicly launched. A parking page with a link is honest and costs nothing to maintain; a redirect layer would be permanent infrastructure for traffic that does not exist.

### h-card prerequisite — done

`layouts/page/profile.html` carries the `h-card` wrapper, `p-name`, `u-photo`, and a hidden canonical self-link (`u-url` + `rel="me"`). Validate against indiewebify.me as part of step 11 rather than re-deriving it.
