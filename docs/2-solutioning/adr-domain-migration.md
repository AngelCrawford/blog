# ADR: Domain Migration article-time.de → angel-crawford.de

**Status:** Accepted
**Date:** 2026-05-12
**Decided:** 2026-05-12
**Owner:** Angel Crawford
**Related:** [`docs/1-planning/epics.md`](../1-planning/epics.md), Epic 2 (IndieWeb infrastructure)

---

## Context

The current Hugo project — described in [README](../../README.md) as
"A personal Hugo blog being transformed into a **Digital Garden**" — is
hosted on GitHub Pages and currently serves under `article-time.de`.
The domain was originally purchased for an unrelated project: a
multi-author online magazine ("Article Time"), a dream that has since
been deliberately set aside in favour of a personal, single-author
digital garden.

The project as currently shipped already implements the digital-garden
model technically (Growth Stages, Three-Tier Sorting, single-author
content, IndieWeb infrastructure planned in Epic 2 / Epic 7). What
mismatches is the **domain name**: `article-time.de` is a magazine
name, not a personal-identity domain.

Separately, `angel-crawford.de` exists as a static Hugo profile card
("Webcard"), also hosted on GitHub Pages. It carries the canonical
online identity of Angel Crawford — it is linked from WhatsApp,
Discord, Facebook, Mastodon, Instagram, Spotify, Reddit, EA Sims
Gallery, GitHub, CodePen, and Stack Overflow. The Mastodon account
at `norden.social/@Angel_Crawford_ftw` is rel="me"-verified against
this domain. The profile card already carries `rel="me"` on all silo
links — what it does NOT have is full h-card microformat markup, but
that gap is acceptable because the profile card will be replaced by
the blog's home page during cutover (see Phase 3).

The IndieWeb principle of "one domain = one identity" means these two
states are in tension: the personal-identity domain hosts only a
business card, while the personal-identity content lives under a
project-name domain.

**No public content has been published yet on `article-time.de`.** The
site has been in development; no blog posts are linked from external
sources, no SEO history exists to preserve, no Webmentions have been
received on permalinks that need to be carried forward. This makes
the migration radically simpler than a typical domain move.

---

## Decision

Migrate the digital garden from `article-time.de` to
`angel-crawford.de`. Both domains are hosted on GitHub Pages, so the
migration consists of two simple swaps:

1. Point the blog's GitHub Pages deployment at `angel-crawford.de`
   instead of `article-time.de` (CNAME file change + GitHub Pages
   settings).
2. Replace what currently serves at `article-time.de` with a static
   maintenance/parking page (a single HTML file).

The old profile card project on `angel-crawford.de` is retired in the
same act. No 301 redirects are needed (no inbound links to preserve).
No DNS work is needed (both domains already resolve via GitHub Pages
infrastructure).

### What this decision does NOT change

- **The project itself.** Code, Hugo theme, content, Epics, Stories,
  BMAD structure — all stay exactly as planned. The migration is a
  domain-level operation, not a re-architecture.
- **The transformation roadmap.** Epic 2 (engagement infrastructure),
  Epic 7 (POSSE), Epic 9 (polish) proceed as scheduled. They contain
  the IndieWeb work this ADR enables — they are not blocked by it.
- **The `article-time.de` registration.** The domain stays registered.
  It just stops serving the garden — it becomes a parking page.
- **The existing profile card on `angel-crawford.de`.** It is NOT
  touched during the build phase. It already serves its purpose (silo
  links + rel="me" for Mastodon verification) and will be replaced in
  one step during Phase 3, not gradually upgraded.

### What it DOES change

- The h-card eventually lives on `angel-crawford.de/` (the new home
  page = the blog's home page), not on a separate profile card domain.
- The Mastodon rel="me" verification target remains `angel-crawford.de`
  (already correct — no change needed there, only consistency
  reinforced).
- The Webmention endpoint registration with webmention.io moves to
  `angel-crawford.de` (currently `article-time.de` per Story 2.3 AC).
- Bridgy.fed account (Story 2.8) bridges Fediverse traffic to
  `angel-crawford.de`.

---

## Brand Identity Transition

The domain migration is the **outer** half of the identity-coherence
work. The **inner** half is the brand identity itself: the site
currently presents as "Article Time" (Site Title, hero brand text,
footer slogan, clock-logo), which is the magazine-project name, not
the personal-identity name. Domain coherence without brand coherence
would leave a residual mismatch — `angel-crawford.de` serving a site
titled "Article Time".

Brand transition is therefore scoped into the same migration, not
deferred. The transition is executed in the same Phase 2 / Phase 3
sequencing as the domain move, so cutover delivers a single coherent
identity in one window.

### What changes

- **Site Title:** `Article Time` → `Angel Crawford` (exact string
  decided in Story 9.14 AC6; tagline optional).
- **Footer slogan** (`layouts/_partials/_base/footer.html` lines
  18–19, "Du willst schreiben — ohne einen eignen Blog zu
  veröffentlichen? Be a part of Article Time!") → final copy decided
  in Story 9.14 AC6.
- **Logo asset:** `static/images/header/clock_small.webp` is the
  Article-Time clock-logo (brand artwork for the magazine concept).
  Replacement or removal decided in Story 9.14 AC6.
- **Personal avatar:** does not currently exist as a site asset. Must
  be produced/sourced and registered at `params.identity.photo` (per
  Story 9.13 AC7). Decided in Story 9.14 AC6.

### What stays

- **`params.author.name`** in the footer copyright block already
  resolves to "Angel Crawford" via the author param fallback chain
  (`footer.html` line 102). No change.
- **Mastodon handle** `norden.social/@Angel_Crawford_ftw` and all
  silo `rel="me"` links remain unchanged — they already target the
  person, not the brand.
- **Content** (articles, logs, taxonomies) — no rename pass over
  existing content; the brand transition is structural, not content.

### Tolerated interim mismatch

During Phase 1 (build) and most of Phase 2 (prep), the site continues
to present as "Article Time" while Story 9.13's h-card already
identifies "Angel Crawford" as the person behind the site. This is a
**tolerated mismatch** — IndieWeb-conformant (the h-card describes the
person, not the brand), and intentional: brand-asset work is staged
inside Story 9.14 (Prep), and the brand switch happens in lockstep
with the domain switch in Story 9.15 (Cutover) so there is no period
where the domain is `angel-crawford.de` while the brand says "Article
Time".

---

## Sequencing (Risk-Ordered)

Migration runs in **three phases**, ordered so the project work
finishes naturally before the irreversible "one big event" happens
last, with a safety net (the project already has Maintenance-Mode
toggle infrastructure — see `README.md` → Maintenance Mode).

### Phase 1 — Build IndieWeb infrastructure on the blog (Epic 2 / 7 / 9)

**Goal:** Complete all IndieWeb features as already planned in the
BMAD epics, while the blog continues to be served at `article-time.de`.

**Why first:** This is just normal Epic 2/7/9 work. The blog stays
on `article-time.de` throughout. No domain change yet. Stories 2.3
and 2.8 *will* need re-pointing in Phase 3, but they can be built and
tested under `article-time.de` first.

**Critical:** The h-card is built INTO the blog theme (home page
template, `layouts/_partials/_base/`) — NOT into the old profile card
on `angel-crawford.de`. The old profile card stays as-is throughout
this phase. It already has `rel="me"` on silo links, which is enough
to keep Mastodon verification working. Its lack of h-card markup is
intentional: it would be wasted work, since the profile card is
scheduled for replacement, not upgrade.

**Actions:** All Stories in Epic 2, plus Epic 7 if scheduled before
the cutover. **The current `article-time.de` configuration in Story
2.3 (`webmention.io/article-time.de/webmention`) is intentional during
this phase** — re-pointing happens in Phase 3.

**Outcome:** Garden is feature-complete on `article-time.de`. Blog
home page carries full h-card markup. Old profile card on
`angel-crawford.de` is untouched.

### Phase 2 — Cutover preparation

**Goal:** Have everything ready so Phase 3 is one tag push.

**Actions:**
- Prepare a static `index.html` for the future maintenance page on
  `article-time.de`. Plain HTML, no Hugo, no dependencies. Copy: e.g.
  "Diese Seite ist umgezogen nach angel-crawford.de." with a link.
- Audit Hugo config and templates for any hardcoded
  `https://article-time.de/...` strings. Hugo's `absURL` handles most
  via `baseURL`, but data files, partials, and content frontmatter can
  carry absolute URLs that won't auto-update.
- Locate the GitHub Pages custom-domain setting on the blog repo
  (`Settings → Pages → Custom domain`) and confirm the steps needed to
  change it.
- Locate the `CNAME` file in the blog repo (top-level, contains
  `article-time.de`) and confirm where to change it.
- Decide what happens with the old profile card repo: archive,
  delete, or convert to source for the maintenance page on
  `article-time.de`.

**Outcome:** Phase 3 has nothing to figure out — just to execute.

### Phase 3 — Cutover

**Goal:** Switch the blog to `angel-crawford.de`. Old profile card
retired. `article-time.de` becomes a parking page.

**Actions in order:**
1. Activate Maintenance-Mode on the live blog
   (`echo "" > .maintenance && git tag → push`). This is precautionary
   in case anyone hits the site during the swap.
2. Update `baseURL` in `config/_default/config.yaml` to
   `https://angel-crawford.de`.
3. Update the `CNAME` file in the blog repo from `article-time.de` to
   `angel-crawford.de`.
4. In the blog repo: `Settings → Pages → Custom domain` set to
   `angel-crawford.de`. Wait for "DNS check successful" green tick.
5. Retire the old profile card repo: either replace its content with
   the same blog build (if you went that route) or simply remove its
   custom-domain binding so `angel-crawford.de` resolves only to the
   blog.
6. Update webmention.io endpoint registration (re-register
   `angel-crawford.de`, update `<link rel="webmention">` target in
   blog templates if hardcoded).
7. Update Bridgy.fed domain verification.
8. Replace `article-time.de`'s deployment with the static
   maintenance/parking `index.html`. Concrete steps depend on your
   chosen route from Phase 2's "Decide what happens with the old
   profile card repo" — e.g. a new tiny repo with just the static
   HTML, with `article-time.de` set as its GitHub Pages custom domain.
9. Deactivate Maintenance-Mode on the blog.
10. Verify: Mastodon rel="me" still green, `indiewebify.me` passes
    h-card AND h-entry tests on `angel-crawford.de`, blog loads at new
    URL, `article-time.de` shows the parking page.

**Outcome:** Garden lives at `angel-crawford.de`. `article-time.de`
shows a static "moved" page. h-card and h-entry are unified under one
canonical identity. The old profile card is retired in the same act
that brings the blog home — no transitional state.

---

## Alternatives Considered

### Alternative 1 — Stay on article-time.de, accept the name as a brand

**Pro:** Zero migration effort.
**Con:** `angel-crawford.de` (with its many inbound silo links and
verified Mastodon) stays a separate, weakly-connected island.
Violates the IndieWeb one-identity principle. Long-term, this means
two identities to maintain.
**Rejected because:** The whole point of the IndieWeb work in Epic 2
and 7 is identity coherence. Keeping the magazine-name domain would
permanently dilute that work.

### Alternative 2 — Dual domains, one canonical

**Pro:** Both URLs work, lower-risk migration.
**Con:** GitHub Pages doesn't natively serve one build under two
custom domains. Would mean two separate repos or build pipelines.
Adds permanent operational complexity.
**Rejected because:** The cutover in Phase 3 is so simple (no content
to preserve, no redirects needed) that the dual-domain workaround
would cost more than the cutover itself.

### Alternative 3 — Upgrade the old profile card now, migrate later

**Pro:** Could give `angel-crawford.de` a valid h-card sooner.
**Con:** The old profile card is on Hugo 0.156.0, separate from this
repo. Editing it means juggling two projects in parallel. And it's
work that gets thrown away in Phase 3, when the blog's home page
takes over.
**Rejected because:** No real benefit. The old profile card's
existing `rel="me"` is sufficient to keep Mastodon verification
working. Full h-card on `angel-crawford.de` is needed only once the
blog moves there — which happens in one step, not in stages.

### Alternative 4 — Set up 301 redirects from article-time.de URLs

**Pro:** Standard SEO best practice for domain migrations.
**Con:** No content is currently published on `article-time.de`, no
links exist that need to be preserved. The 301 setup would be
ceremony with no value.
**Rejected because:** There is literally nothing to redirect.
*If* this changes (some content goes live on `article-time.de`
before Phase 3 happens), revisit this alternative — at that point a
small Hugo-Aliases-based redirect generation becomes worthwhile.

### Alternative 5 — Defer the domain question

**Pro:** No decision pressure now.
**Con:** The identity mismatch keeps blocking IndieWeb decisions
(which domain does webmention.io register? which one does Bridgy.fed
bridge to?) and the BMAD Epic 2 work will encode the answer either
way. Deferring means encoding the *wrong* answer (article-time.de) in
Stories 2.3 and 2.8, and re-doing it later.
**Rejected because:** Cheaper to decide now and let Epic 2/7 work
forward toward the correct end state.

---

## Consequences

### Positive
- IndieWeb identity becomes coherent under one canonical domain.
- All existing silo links (WhatsApp, Discord, etc.) automatically
  point at the right place — no link updates needed off-site.
- Mastodon rel="me" verification is preserved (same target domain).
- Future stories that touch IndieWeb infrastructure can assume
  `angel-crawford.de` as the canonical home.
- The old profile card project (Hugo 0.156.0) can be archived
  without further maintenance — no parallel work needed.
- No DNS work, no server config, no 301 redirect logic. The migration
  is essentially three text changes (`baseURL`, `CNAME`, custom-domain
  setting) plus two repo retirements.

### Negative
- One-time cutover risk (mitigated by Maintenance-Mode and Phase 2
  preparation). Risk is small because both endpoints are static GitHub
  Pages sites with simple swap mechanics.
- The `article-time.de` registration becomes a "parking page" cost
  item. Acceptable, since the original dream may still resurface
  later under a different shape.

### Neutral
- Epic 2 Stories 2.3 and 2.8 will be implemented with
  `article-time.de` initially, then re-pointed in Phase 3. The
  alternative — writing them with `angel-crawford.de` now and serving
  Webmention at a yet-to-exist endpoint — is worse. The re-point is a
  small, contained change.
- The old profile card on `angel-crawford.de` lacks h-card markup
  throughout Phase 1 and 2. This is acceptable: only Phase 3 makes
  `angel-crawford.de` the canonical home, and at that moment the
  h-card arrives with the blog home page.

---

## Implementation Tracking

This ADR adds three new Stories to Epic 9:

- **Story 9.13: Representative h-card in Base Layout** — foundation
  artifact (site-wide h-card identifying Angel Crawford as the person
  behind the site). Prereq for the cutover; built ahead of time so
  cutover does not have to ship h-card markup under maintenance-mode
  pressure. Verified at draft time: no h-card markup exists anywhere
  in the codebase, so this is first-time creation, not migration.
- **Story 9.14: Domain & Brand Migration Preparation** — Phase 2
  preparatory work plus brand-asset preparation (final Site Title,
  footer slogan, logo policy, personal avatar). Resolves Open
  Questions #1 and #3 below.
- **Story 9.15: Domain & Brand Migration Cutover** — Phase 3 cutover
  execution PLUS brand switch in the same commit. Final ship-blocker
  before declaring 1.0. On completion, this ADR's status flips to
  `Implemented`.

Story 9.13 is a Foundation Story (no prerequisites). Story 9.14
requires 9.13. Story 9.15 requires both 9.13 and 9.14.

Inventory of hardcoded `article-time.de` strings in the codebase
(produced by Story 9.14 AC2) will be appended to this section once
that story runs. The inventory is the work list for Story 9.15 AC8.

---

## Open Questions

1. **What happens to the old profile card repo?** Three options:
   archive read-only, delete entirely, or repurpose as the source repo
   for the future `article-time.de` parking page. Decide before
   Phase 3 starts.
2. **Maintenance-Mode copy.** Phase 3 briefly shows the maintenance
   page on the blog during the swap. Default copy is "Wartung läuft"
   per README; cutover-specific copy not strictly needed since the
   maintenance window should be short (minutes, not hours). Default is
   fine unless preferred otherwise.
3. **Parking page copy on `article-time.de` after cutover.** What
   should the static `index.html` say? Suggestion: short bilingual
   note that this domain is no longer the canonical home, with a link
   to `angel-crawford.de`. Finalise wording before Phase 2 ends.

---

## Follow-up task for Claude Code

**Verify h-card coverage in existing Epics before Phase 1 completes.**

The README references planned IndieWeb work, and Epic 9 contains
several related stories: Story 9.7 (Twitter Cards), Story 9.10 (Author
Box with Socials on Single-Page), Story 9.12 (Social-Follow Icon Row).
None of these is explicitly "render a full h-card microformat on the
home page", which is the central artefact this ADR depends on.

**Action items:**

1. Read the full Acceptance Criteria of Stories 9.10 and 9.12 in
   [`docs/1-planning/epics.md`](../1-planning/epics.md). Check whether
   either story's AC implicitly covers:
   - `class="h-card"` wrapper around the personal-identity block on
     the home page,
   - `class="p-name"` on the displayed name,
   - `class="u-photo"` on the profile image,
   - `class="p-note"` on the short bio,
   - `class="u-url"` with `rel="me"` on a link to `angel-crawford.de`
     itself (the canonical self-link).
2. Also check Story 9.2 (Schema.org Structured Data) — it is
   *different* from h-card (JSON-LD, not microformats) but their
   personal-identity fields overlap. Make sure the two don't
   contradict each other.
3. If coverage is complete: add a one-line note in the relevant
   story's completion notes pointing back to this ADR (so future
   readers see the connection).
4. If coverage is missing or partial: add a new story to Epic 9 with
   a working title like "Story 9.X: h-card on home page", with ACs
   covering the five microformat classes listed above plus
   `indiewebify.me` h-card validation. Place it before Story 9.13
   (Domain migration preparation) so the cutover in Phase 3 inherits
   a working h-card.

The blog-side h-card is the artefact that replaces the old profile
card on `angel-crawford.de` during Phase 3 cutover. Without it,
Phase 3 ships an h-card-less site under the personal-identity domain,
which would defeat the point of the migration.
