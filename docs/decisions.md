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
- Prepare the static parking page for `article-time.de` — plain HTML, no Hugo: *"Diese Seite ist umgezogen nach angel-crawford.de."* plus a link.
- Decide the fate of the old profile-card repo: archive, delete, or repurpose as the parking-page source.

Execution, in order:

1. Maintenance mode ON (precaution during the swap).
2. `baseURL` → `https://angel-crawford.de` in `config/production/config.yaml` **and** `config/maintenance/config.yaml`. (The audit corrected this step: `config/_default/` carries no baseURL at all, and `config/development/` is localhost — exactly two files hold the domain.)
3. `CNAME` at the repo root → `angel-crawford.de`.
4. Repo `Settings → Pages → Custom domain` → `angel-crawford.de`, wait for the green DNS check.
5. Release the old profile-card repo's binding on the domain.
6. Re-register the webmention.io endpoint for the new domain; update `<link rel="webmention">` if hardcoded.
7. Update Bridgy.fed domain verification.
8. Umami: create the new site entry and cut analytics over; the `website_id` lives in `config/_default/params.yaml`.
9. Deploy the parking page on `article-time.de`.
10. Maintenance mode OFF.
11. Verify: Mastodon `rel="me"` still green, `indiewebify.me` passes h-card **and** h-entry on the new domain, blog loads, old domain parks.

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
| `content/pages/impressum.md:23`, `content/pages/datenschutz.md:133` | obfuscated mail address `mail [at] article-time [dot] de` | **needs Angel's decision**: does a mailbox exist on the new domain? A legal page with a dead address is worse than the old domain |
| `README.md:7` | live link | cosmetic |
| `schemas/frontmatter/*.schema.json:3` (×3) | `$id` URIs | identifiers, never fetched — re-point for consistency, zero runtime impact |

**Survives the cutover untouched, checked rather than assumed:**

- CSP `form-action` / `connect-src` allow `https://webmention.io` — host only,
  no domain path, still correct afterwards.
- Umami: `website_id` + `script_url` are bound to the Umami *site entry*, not
  to our config. Open decision, small: either edit the domain on the existing
  entry (keeps the `website_id`, zero config change — recommended, there are
  no pre-launch stats worth separating) or create a fresh entry and paste the
  new id into `config/_default/params.yaml`.
- `data/*.json` — zero domain literals (fixture URLs are `*.example`).
- Content frontmatter — no absolute `permalink`/`canonicalURL` anywhere.
- `params.identity` — all relative paths; `identity.url` empty resolves to
  `baseURL` by design.
- No `static/robots.txt` exists; robots handling is the per-page meta.
- `.github/workflows/daily-rebuild.yml:182` — comment only.
- `docs/`, `CLAUDE.md`, `.claude/skills/`, JS file headers — historical
  references to the old name/domain. Do not edit retroactively; documents
  that describe the past are allowed to name it.

**Brand-adjacent findings** (input for the still-open brand decisions, not
URL work): the site title is already `Angel Crawford` in every config; the
footer slogan replacement (`footer.html:46`, the FIXME) and the
`identity.photo` final asset remain the two open pieces — plus the mail
address above.

### Deliberately not doing 301 redirects

`article-time.de` has no meaningful backlink profile or search history worth preserving — the blog was never publicly launched. A parking page with a link is honest and costs nothing to maintain; a redirect layer would be permanent infrastructure for traffic that does not exist.

### h-card prerequisite — done

`layouts/page/profile.html` carries the `h-card` wrapper, `p-name`, `u-photo`, and a hidden canonical self-link (`u-url` + `rel="me"`). Validate against indiewebify.me as part of step 11 rather than re-deriving it.
