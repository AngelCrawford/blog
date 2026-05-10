# Story 2.8: Bridgy.fed Setup & Verification

Status: ready-for-dev

## Story

As a content creator,
I want Mastodon (and Fediverse) replies, boosts, and likes to flow into my site as webmentions,
so that federated engagement actually shows up in the webmention display, not just the small IndieWeb-blog subset.

## Acceptance Criteria

1. **Bridgy Fed account connected to a chosen Mastodon handle representing article-time.de.** The chosen Fediverse handle (e.g. `@article-time@mastodon.social`) and home instance are documented in `docs/technical/runbook.md` under a new `## Bridgy.fed (Fediverse Bridge)` section so a future operator (or future-Angel) knows where the bridge lives. **Mastodon-only for this story** (Bluesky out of scope per Out-of-Scope below). The story does **not** prescribe the instance — Angel picks at execution time and the chosen value is captured in the runbook entry + this story's Completion Notes. If a per-domain handle is preferred (`@me@article-time.de` via custom domain federation), document that path instead, but the simpler `@<handle>@<existing-instance>` route is the default.

2. **Domain verification with Bridgy Fed completed via `rel="me"` link** from `https://article-time.de/` to the chosen Mastodon profile URL. Implementation: add a second `<link rel="me" href="https://<instance>/@<handle>" />` line to `layouts/_partials/_base/head.html` immediately adjacent to the existing GitHub `rel="me"` shim (lines 56–62). The new Mastodon line uses the same 6-line "TEMPORARY / SUPERSEDED BY Story 9.12" comment pattern Story 2.3 established — Story 9.12's Pre-Spec Notes (epics.md lines 1686–1688) already flag the entire `rel="me"` block for replacement by a `params.social`-driven set, so adding one more shim now is consistent with the documented retirement path. Bridgy Fed's bidirectional verification (Mastodon profile metadata also lists `https://article-time.de` and auto-verifies via the green-check icon) is done at Mastodon-account level on the chosen instance, **not** in this repo. **`.well-known/webfinger` is NOT used** — Bridgy Fed's current docs (`https://fed.brid.gy/docs`) accept rel="me" verification and our static-host stack (GitHub Pages) has no special-cased webfinger serving; choosing rel="me" avoids a static-file dance. Document the chosen verification path in Completion Notes.

3. **End-to-end smoke test passes**: a public Mastodon post from the chosen handle mentions or links to a real article URL on `https://article-time.de/articles/<existing-post>/` and the resulting mention appears in the webmention.io dashboard for `article-time.de` within Bridgy's documented latency window (typically minutes; document the *actual* observed latency in Completion Notes — Bridgy's queue is unpredictable). Document in Completion Notes: (a) the test post URL on Mastodon, (b) the target article URL on article-time.de, (c) the observed latency (timestamp delta between Mastodon post time and webmention.io receipt time), (d) any errors encountered (e.g. Bridgy domain-verification failure, mention not delivered, malformed source URL).

4. **Privacy policy `## Webmentions` section in `content/pages/datenschutz.md` (current lines 85–108) extended to disclose Bridgy.fed as an additional processor.** Add a new bold-label sub-section `**Verarbeitung durch Bridgy.fed (für Fediverse-Erwähnungen):**` placed immediately after the existing `**Verarbeitung durch webmention.io:**` block (current line 100). German content (informal `Du`-form, matching the rest of the document). Disclose: (a) operator name — Ryan Barrett (matches the wording style used for "Aaron Parecki" on the existing webmention.io line); (b) data flow — `öffentliche Fediverse-Aktivität (Mastodon-Post, -Boost, -Like) → Bridgy.fed → webmention.io → diese Seite`; (c) link to Bridgy's privacy/info page (`https://fed.brid.gy/about` or `https://fed.brid.gy/docs`, whichever is the operator-facing landing — verify at implementation time); (d) note that Bridgy operates as an additional processor sitting between the originating Fediverse instance and webmention.io. **The existing line 108 caveat** ("Bei Erwähnungen, die über Drittplattformen weitergeleitet wurden (z. B. Mastodon-Boosts), ist eine Rücknahme per Link-Entfernung nicht immer möglich…") **already covers the opt-out caveat** — do not duplicate; leave it intact. Optionally add a one-clause cross-link from the new Bridgy paragraph back to that caveat for clarity.

5. **Runbook entry documents how to disconnect / pause the bridge.** New section `## Bridgy.fed (Fediverse Bridge)` added to `docs/technical/runbook.md` (insertion point: between `## Deploy` and end-of-file). Contents:
   - Which Mastodon handle + instance is registered with Bridgy Fed (consumes AC #1).
   - Which `rel="me"` link in `head.html` proves domain ownership (consumes AC #2).
   - **Disconnect procedure** for abuse / harassment / planned offline: open `https://fed.brid.gy/`, sign in with the Mastodon account, click "Disable" or remove the linked domain (Bridgy's UI labels these; verify at write-time and reproduce the exact button name verbatim). Document expected effect: incoming Fediverse mentions stop reaching webmention.io within ~minutes; any in-flight mentions are dropped (Bridgy does not queue indefinitely).
   - **Pause/unpause** if a different mechanism is offered (e.g. "Pause" without full disconnect).
   - **Opt-out for harassed mentions:** if a single Mastodon thread is generating unwanted mentions, the per-mention removal route is webmention.io's dashboard (not Bridgy) — link to Story 2.3's webmention.io account ops, or document the dashboard URL.
   - **Bridgy operational status link** for `https://status.brid.gy/` (consumes AC #7; if that URL is not live, use `https://fed.brid.gy/` as the fallback monitoring page and note the substitution).
   - Brief mention that Bridgy outages cause mentions to queue **at the originating Fediverse instance** (not at Bridgy) and may be lost if the instance evicts them — operator visibility requirement.

6. **CSP review confirms no allow-list additions required.** Re-read `config/_default/params.yaml` `csp.connectsrc` (current line 44) and `csp.imgsrc` (current line 37). Confirm: (a) `connectsrc` already contains `"https://webmention.io"` (Bridgy POSTs server-to-server to webmention.io — that's already covered, and even if it weren't, server-to-server calls don't trip the browser-side CSP); (b) `imgsrc` already contains `"https:"` which covers avatars served from arbitrary federated instances (mastodon.social, mastodon.online, fosstodon.org, etc.). **No CSP edits made by this story.** Treat this AC as a regression guard — diff `params.yaml` post-implementation: only the line referenced from AC #2 (head.html) and AC #4/#5 (content/docs) should differ.

7. **Bridgy operational status page link added to the runbook.** Already covered by AC #5's bullet list — listed as a separate AC for testability symmetry with the epics spec. Verification: `grep -n "status.brid.gy\|fed.brid.gy" docs/technical/runbook.md` returns at least one hit in the new section.

8. **No regression to existing head-emit or build outputs** (testability guard). Diff `public/index.html` and `public/articles/<sample-post>/index.html` before and after the change:
   - The only HTML difference should be **one new** `<link rel="me" href="https://<instance>/@<handle>" />` line inside `<head>`, adjacent to the existing GitHub `rel="me"` link.
   - Existing webmention `<link>`, GitHub `<link rel="me">`, Umami `<script>`, CSS bundle, JS bundle, SEO partial, RSS link, favicon links — all byte-identical.
   - `style.<hash>.css` and `bundle.<hash>.js` filenames unchanged (no SCSS/JS touched).
   - Sitemap unchanged. RSS feed unchanged. Other rendered HTML files have no diff except the one added line.

9. **No automated tests added in this story** (testability guard, scope-limit). Rationale: the new `rel="me"` Mastodon line is **explicitly temporary** and will be removed by Story 9.12 (per epics.md lines 1686–1688's documented retirement path), same as Story 2.3's GitHub shim. Adding a `rel="me"`-presence assertion now would create churn at 9.12. The infrastructure deliverable (Bridgy account + manual smoke test) is verified manually via AC #3, not via automated test. **If** Story 1.1's build-smoke test framework has landed and the team chooses to add a regression assertion that `rel="webmention"` is still emitted, that is acceptable scope — but is NOT required.

### AC Source & Reconciliation Note

ACs 1–7 are derived verbatim from `docs/1-planning/epics.md#Story-2.8-Bridgy.fed-Setup-Verification` (lines 421–453 of `epics.md`). ACs 8–9 are testability/regression guards added by the create-story workflow (no-regression to head/build outputs, no-new-tests scope-limit). They are NOT in the original epics list — they exist solely to make ACs 1–7 verifiable without test-infra-thrash.

**Convention reconciliation (AC #1 — Fediverse identity choice):** The epics AC names "Mastodon (or Bluesky)" but Out-of-Scope restricts to **Mastodon-only** for the initial story. This story follows the Out-of-Scope restriction. Bluesky bridging is captured as a follow-up note in Completion Notes if Angel decides to wire it later.

**Convention reconciliation (AC #2 — verification mechanism):** The epics AC says "rel='me' link **or** `.well-known/webfinger` — choose whichever Bridgy currently requires; document the chosen path." Decision: **rel="me"**. Reasons: (a) Bridgy Fed's current docs accept it; (b) GitHub Pages serves static files but `.well-known/` doesn't have any project precedent (would require a `static/.well-known/webfinger` file + JSON content-type negotiation that Hugo's static-file pipeline does not auto-set, requiring a custom `_headers` or wrapping route); (c) rel="me" matches the pattern Story 2.3 already established for webmention.io's IndieAuth verification; (d) Story 9.12's planned `params.social`-driven `rel="me"` set absorbs the Mastodon line cleanly, so the shim has a documented retirement path. Document the choice in Completion Notes.

**Convention reconciliation (AC #4 — Privacy policy section structure):** The existing `## Webmentions` section uses **bold-label paragraphs** (e.g. `**Verarbeitung durch webmention.io:**`) for sub-sections, NOT `###` headings. This is different from Story 2.3's draft (which used `### Verarbeitung durch webmention.io`) but matches the **as-shipped** state after Story 2.5's privacy-policy refresh consolidated the structure. The Bridgy sub-section added by this story follows the **as-shipped bold-label** convention, not the Story-2.3-draft `###` convention. Verify by re-reading `content/pages/datenschutz.md` at implementation time.

**Convention reconciliation (AC #5 — runbook location):** The epics AC names `docs/technical/runbook.md` as the documentation target. This file exists (132 lines, established by prior epics) and is the canonical operator reference per README line 10 ("Operations runbook"). Insert new section between `## Deploy` and EOF — same end-of-file pattern existing sections use. Do NOT create a separate `docs/technical/bridgy.md` or `docs/technical/operations.md` — runbook is the single-source-of-truth file per project convention.

**Convention reconciliation (no `params.yaml` block for Bridgy):** Bridgy's setup is **entirely external** — there is no API key, no domain config, no script URL the site renders. Unlike Umami (which has `params.umami.{website_id, script_url}` blocks because the site emits Umami's script tag) or webmention.io (which has its endpoint URL hardcoded in head.html), Bridgy is a server-to-server service that posts mentions to webmention.io without the site ever talking to it. **No `params.yaml` entry is needed or created.** The Mastodon handle URL is hardcoded into the `rel="me"` shim — same single-tenant pattern Story 2.3 used for the webmention endpoint URL.

[Source: docs/1-planning/epics.md (lines 421–453) — Story 2.8 seven ACs verbatim, FR-011 extension, prerequisite Story 2.3, soft-dep Story 3.2, Out-of-Scope restriction]
[Source: docs/1-planning/ux-design-specification.md (lines 711–712, 947, 1624) — Bridgy as planned infrastructure for "Mastodon → Webmention conversion"; this story closes the gap]
[Source: docs/2-solutioning/digital-garden-integration-architecture.md (line 431) — Data flow: `User Reply on Mastodon → Bridgy → webmention.io → Daily Fetch → JSON → Hugo Build → Display`]
[Source: docs/2-solutioning/digital-garden-integration-architecture.md (lines 192–195, 234–248, 974–998) — webmention.io public API spec; Bridgy is a producer for webmention.io, this story does not change the consumer side]
[Source: docs/sprint-artifacts/epic-2/2-3-webmention-endpoint-setup.md (lines 60–72, 219–229) — webmention `<link>` placement convention + IndieAuth `rel="me"` shim pattern + temporary-link comment block style]
[Source: docs/sprint-artifacts/epic-2/2-5-privacy-policy-page.md — as-shipped privacy-policy structure (bold-label sub-sections within `## Webmentions`); German `Du`-voice convention]
[Source: docs/1-planning/epics.md (lines 1660–1688) — Story 9.12 Pre-Spec Notes documenting the planned removal of all `head.html` `rel="me"` shims via `params.social`-driven set]
[Source: content/pages/datenschutz.md (lines 85–108) — existing `## Webmentions` section to extend (AC #4 target)]
[Source: layouts/_partials/_base/head.html (lines 51–62) — webmention `<link>` block + existing GitHub `rel="me"` shim (AC #2 insertion-adjacent point)]
[Source: docs/technical/runbook.md (lines 126–132) — `## Deploy` end-of-file position (AC #5 insertion-adjacent point)]
[Source: config/_default/params.yaml (lines 37, 44) — current `csp.imgsrc` and `csp.connectsrc` directives (AC #6 regression-check targets)]
[Source: https://fed.brid.gy/ — Bridgy Fed signup + setup flow (UI-driven, ~5 minutes per epics implementation note)]
[Source: https://fed.brid.gy/docs — Bridgy Fed operator documentation (verify at implementation time for the current setup procedure — Bridgy's UI evolves)]

## Tasks / Subtasks

- [ ] **Decide Fediverse identity for article-time.de** (AC: 1) [Source: epics.md "Implementation Note" line 446]
  - [ ] **Angel-decision point.** Pick one of:
    - **(a) Existing handle on a public instance** — recommended for lowest-friction: e.g. `@articletime@mastodon.social`, `@article-time@fosstodon.org`, or whatever instance Angel already has an account on. Cost: 0 (just pick an existing or fresh account). Tradeoff: instance choice ties site-engagement to that instance's uptime, moderation, and ToS.
    - **(b) Per-domain handle via Bridgy Fed's custom-domain bridging** (`@me@article-time.de`) — Bridgy Fed historically supported "bridge your domain as an ActivityPub actor" so other Fediverse users can `@-mention` `@article-time.de` directly. Cost: extra setup steps (DNS records, webfinger-style discovery). Tradeoff: stronger brand cohesion, more setup, more moving parts.
  - [ ] **Default recommendation if undecided: option (a).** It is the path the epics Implementation Note describes ("~5 minutes of clicks"). Option (b) is plausibly Story 7.x territory if the project ever needs a federated identity beyond the bridge.
  - [ ] **Capture the decision** in this story's Completion Notes and in the runbook entry (AC #5): handle, instance, public profile URL (e.g. `https://mastodon.social/@articletime`).
  - [ ] **Privacy note:** the chosen handle becomes the **public canonical Fediverse identity** for article-time.de. Anyone who follows or replies to it expects mentions to surface on the site. Treat the choice as user-facing (changing it later means orphaning prior bridge history).

- [ ] **[External / Angel] Create or confirm the Mastodon account** (AC: 1)
  - [ ] If option (a) was chosen and an account already exists on the target instance, **add the production site URL `https://article-time.de` to the account's profile metadata** (Mastodon: Edit Profile → Profile Metadata → Label: `Website`, Value: `https://article-time.de`). This is the back-direction part of `rel="me"` cross-verification; combined with AC #2's site-side `rel="me"` link, Mastodon's profile shows a green checkmark next to the website (visual confirmation of bidirectional verification).
  - [ ] If a fresh account is needed: pick an instance that allows public posts to be Bridgy-reachable (most public instances do — `mastodon.social`, `fosstodon.org`, `mastodon.online`, etc. all work; private/closed instances or instances that defederate widely may not). Set the display name, bio, and the website metadata field with `https://article-time.de`.
  - [ ] **Verify rel="me" cross-link** *after* the head.html change in Task 4 ships to production:
    1. Visit the Mastodon profile page in a logged-out browser.
    2. The website link (`https://article-time.de`) should show a green checkmark icon (or "Verified ownership" tooltip) next to it.
    3. If no checkmark appears: confirm the head.html change is live (`view-source:https://article-time.de/` should show the new `<link rel="me">` line), then trigger Mastodon to re-verify by editing & re-saving the profile metadata field.
  - [ ] **Save credentials** in the project's password manager (instance URL, handle, login email/password, app passwords if any).

- [ ] **Add Mastodon `rel="me"` link to `head.html`** (AC: 2, 8) [Source: layouts/_partials/_base/head.html lines 51–62 — existing webmention + GitHub rel="me" block]
  - [ ] Open `layouts/_partials/_base/head.html`.
  - [ ] **Insertion point:** immediately after the existing GitHub `rel="me"` block (currently line 62), before the Umami block (currently lines 64–73). The Mastodon line shares the same "TEMPORARY / SUPERSEDED BY Story 9.12" rationale as the GitHub line — keep them visually adjacent so a future reader (or 9.12's implementer) sees them as a single replaceable cluster.
  - [ ] **Snippet to add** (using the decided handle from Task 1; example shown for `@articletime@mastodon.social`):
    ```go-html-template
    {{- /* Mastodon identity — second rel="me" link for Bridgy.fed verification (Story 2.8).
           Mirrors the GitHub shim above: temporary, single-tenant, hardcoded URL.
           Bidirectional verification: this link points OUT to the Mastodon profile;
           the Mastodon profile metadata points BACK to https://article-time.de
           (Edit Profile → Profile Metadata → Website). Both halves must be in place
           for the green-check icon on Mastodon's profile rendering.
           TEMPORARY / SUPERSEDED BY: Story 9.12 (Social-Follow Icon Row) — same
           replacement path as the GitHub shim. When 9.12 lands, REMOVE this line
           together with the GitHub line above. */ -}}
    <link rel="me" href="https://mastodon.social/@articletime" />
    ```
  - [ ] **Replace the example URL** with the **actual** Mastodon profile URL from Task 1.
  - [ ] **No `hugo.IsProduction` gate** — discovery metadata, same as the webmention `<link>` and existing GitHub `rel="me"`.
  - [ ] **Whitespace cleanliness:** use `{{- /* … */ -}}` (both ends trimmed) to match the existing webmention/GitHub blocks' whitespace handling — Story 2.3's review fix `*/}}` → `*/ -}}`.
  - [ ] **Verify rendered HTML** locally: `hugo --quiet --environment production --destination public-test` → `grep "rel=\"me\"" public-test/index.html` → exactly **two** matches (GitHub + Mastodon), in order.
  - [ ] **AC #8 regression check:** spot-check `public-test/index.html` and `public-test/articles/<post>/index.html` against the pre-change build (`git stash` → build → `git stash pop` → build → diff). The only line difference should be the new Mastodon `<link>` line.

- [ ] **[External / Angel] Sign up at Bridgy Fed and verify the domain** (AC: 1, 2) [Source: https://fed.brid.gy/]
  - [ ] **Prerequisite:** Task 3 (head.html change) must be **deployed to production** at `https://article-time.de/` before Bridgy can verify the `rel="me"` link. The new line is in the static HTML at `<head>`, so it's visible to Bridgy's crawler the moment a tagged release ships. Tag a release and deploy via the standard daily-rebuild flow (per README.md Deployment section); confirm `view-source:https://article-time.de/` shows the new `<link rel="me">` line.
  - [ ] **Sign in** at `https://fed.brid.gy/` using the Mastodon account from Task 2.
  - [ ] **Connect the website:** Bridgy Fed's flow asks for the domain to bridge. Enter `article-time.de`. The flow either auto-verifies (Bridgy's crawler fetches the domain, finds the `rel="me"` link to the same Mastodon handle, confirms cross-ownership) or surfaces an error.
  - [ ] **If auto-verify fails**, the most common reasons are:
    - The `rel="me"` link on the site doesn't match the Mastodon profile URL Bridgy expects (case mismatch in handle? trailing slash? `https://mastodon.social/@articletime` vs `https://mastodon.social/users/articletime` — Mastodon supports both, prefer the `@handle` form).
    - The Mastodon profile metadata doesn't list `https://article-time.de` as the website (Task 2 step).
    - The site hasn't deployed yet (cron run is daily; if Angel needs faster turnaround, push a tag to trigger the workflow immediately).
  - [ ] **Confirm success:** Bridgy's dashboard for the bridged account shows `article-time.de` as a verified linked domain, with a status indicator (varies by Bridgy UI version — look for green/checkmark visual cues).
  - [ ] **Capture screenshots** of the Bridgy dashboard verified-state for the runbook (Task 6 doesn't strictly require them, but they help future-Angel diagnose drift).

- [ ] **[External / Angel] End-to-end smoke test** (AC: 3) [Source: epics.md AC #3]
  - [ ] **Prerequisites:** Task 4 (Bridgy verification) must be complete.
  - [ ] **Pick a real article URL** on the live site, e.g. `https://article-time.de/articles/<existing-post>/` (use any current article).
  - [ ] **From the bridged Mastodon account** (Task 2), post a public toot mentioning the article URL. Suggested copy: "Just published / re-reading: <article title> — <article URL>". The toot must be **public** (not Followers-Only, not DM) — Bridgy only bridges public Fediverse activity per its operator policy.
  - [ ] **Record the post timestamp** (the Mastodon UI shows it; or use the API: `https://<instance>/api/v1/statuses/<id>` returns `created_at`).
  - [ ] **Wait** for Bridgy's queue to deliver — typical latency is minutes, but can stretch to ~30 min under load. Refresh the webmention.io dashboard (`https://webmention.io/article-time.de/`) periodically.
  - [ ] **Confirm receipt:** the test mention appears in the webmention.io dashboard with source URL = the Mastodon toot URL (or Bridgy's translated source URL — Bridgy may rewrite the source from the Mastodon instance URL to its own bridge URL; both are acceptable) and target URL = the article URL.
  - [ ] **Record observed latency** in Completion Notes: `(webmention.io receipt time) − (Mastodon post time) = <N minutes>`.
  - [ ] **Troubleshooting if no mention appears within 30 minutes:**
    - Confirm the target article URL returns HTTP 200 (not 404, not redirect to home).
    - Confirm the article URL is in the toot as a parsed-link (Mastodon should render it as a clickable link, not as raw text).
    - Confirm Bridgy is currently up: `https://status.brid.gy/` (or `https://fed.brid.gy/` as fallback).
    - Confirm webmention.io is currently up: `https://webmention.io/`.
    - Check Bridgy's per-account log (Bridgy's dashboard usually shows recent activity / errors for the bridged account).
    - Confirm the Mastodon post is public (not Followers-Only). Bridgy will not bridge non-public posts.
  - [ ] **Boost / Reply / Like test (optional but recommended):** from a *different* Mastodon account (a second-Angel-account, or ask a friend), boost the test toot. A second webmention should appear at webmention.io within a similar latency window, attributed to the booster. This proves the loop works for the most-common Fediverse engagement (boost ≈ retweet ≈ like-with-amplification).
  - [ ] **Cleanup:** the test toot can stay published (real engagement is fine) or be deleted from Mastodon (webmention.io will eventually expire/remove it based on its own retention policy, currently ~indefinite).

- [ ] **Extend privacy policy `## Webmentions` section with Bridgy.fed disclosure** (AC: 4) [Source: content/pages/datenschutz.md lines 85–108]
  - [ ] Open `content/pages/datenschutz.md`.
  - [ ] **Insertion point:** immediately after the existing `**Verarbeitung durch webmention.io:**` paragraph (current line 100), before `**Rechtsgrundlage:**` (current line 102).
  - [ ] **Snippet** (German, `Du`-form, bold-label paragraph matching the existing structure):
    ```markdown
    **Verarbeitung durch Bridgy.fed (für Fediverse-Erwähnungen):** Wenn die Erwähnung über das Fediverse (z. B. Mastodon) kommt, läuft sie zusätzlich über den Dienst [Bridgy.fed](https://fed.brid.gy/) (betrieben von Ryan Barrett). Der Datenfluss ist: öffentliche Fediverse-Aktivität (Post, Boost, Like) → Bridgy.fed → webmention.io → diese Seite. Bridgy.fed sitzt als zusätzlicher Auftragsverarbeiter zwischen der ursprünglichen Fediverse-Instanz und webmention.io. Datenschutzhinweise: <https://fed.brid.gy/about>. Bei Erwähnungen, die über Bridgy.fed weitergeleitet wurden, greift der Hinweis zur Rücknahme weiter unten ebenfalls.
    ```
  - [ ] **Replace example URL** `https://fed.brid.gy/about` with the **actual operator-facing privacy/info page** if Bridgy's site uses a different URL at implementation time (verify at `https://fed.brid.gy/` — there is usually a "Privacy" or "About" link in the page footer).
  - [ ] **Do NOT modify** the existing line-108 caveat ("Bei Erwähnungen, die über Drittplattformen weitergeleitet wurden (z. B. Mastodon-Boosts)…"). That sentence already covers the opt-out reality for bridged mentions; the new Bridgy paragraph cross-references it via the closing clause "greift der Hinweis zur Rücknahme weiter unten ebenfalls."
  - [ ] **Verification:** the section now has three `**bold-label:**` paragraphs (Welche Daten / Verarbeitung durch webmention.io / Verarbeitung durch Bridgy.fed) followed by `**Rechtsgrundlage:**` and `**Wie kannst Du widersprechen?**`. Open `hugo server` → navigate to `/pages/datenschutz/` → confirm the new paragraph renders correctly (bold label, paragraph text, working link to fed.brid.gy).

- [ ] **Add `## Bridgy.fed (Fediverse Bridge)` section to runbook** (AC: 1, 5, 7) [Source: docs/technical/runbook.md lines 126–132 end-of-file]
  - [ ] Open `docs/technical/runbook.md`.
  - [ ] **Insertion point:** at end-of-file, after the `## Deploy` section's last line. Maintain the document's existing `##` heading hierarchy.
  - [ ] **Section template** (English to match the existing runbook; fill in the actual handle/instance from Task 1):
    ```markdown

    ## Bridgy.fed (Fediverse Bridge)

    Bridges public Fediverse activity (Mastodon replies, boosts, likes) into the webmention.io endpoint so federated engagement surfaces on the site. Set up in Story 2.8. Upstream of webmention.io; no site-side code beyond the `rel="me"` link in `head.html`.

    ### Bridged identity

    - **Mastodon handle:** `@<handle>@<instance>` (public profile: `https://<instance>/@<handle>`)
    - **rel="me" link** in `layouts/_partials/_base/head.html` proves domain ownership to Bridgy.
    - **Bridgy dashboard:** sign in at <https://fed.brid.gy/> using the Mastodon account.

    ### Operational status

    - Bridgy Fed status: <https://status.brid.gy/> (fall back to <https://fed.brid.gy/> if the status page is offline).
    - webmention.io status: <https://webmention.io/> (no formal status page — the dashboard is the canary).
    - When Bridgy is down, **mentions queue at the originating Fediverse instance**, not at Bridgy. Some instances will retry; others give up after ~24h. Bridge outages longer than a day may permanently lose mentions.

    ### Disconnect / pause the bridge

    Use cases: abuse, harassment campaign, planned maintenance, retiring the Fediverse identity.

    1. Open <https://fed.brid.gy/> in a browser and sign in with the Mastodon account.
    2. Locate the bridged-domain entry for `article-time.de` in the dashboard.
    3. Click the "Disable" (or equivalent) action — Bridgy stops forwarding new mentions to webmention.io within minutes.
    4. **In-flight mentions are dropped** — Bridgy does not queue indefinitely.
    5. To re-enable: sign in again and re-verify the domain. The `rel="me"` link must still be live in `head.html`.

    ### Removing a single offending mention (not a full disconnect)

    Bridgy delivers mentions to webmention.io, which is the authoritative store. **Per-mention removal happens at webmention.io, not Bridgy.** Sign in at <https://webmention.io/> and delete the offending entry from the dashboard. Next daily rebuild drops the entry from `data/webmentions_by_article.json` (once Story 3.2 lands; until then, the dashboard delete is the only effect).

    ### Sanity check after deploy

    1. Visit <https://article-time.de/> in a logged-out browser.
    2. View source. Confirm two `<link rel="me">` lines in `<head>`: the GitHub one (Story 2.3 shim) and the Mastodon one (Story 2.8). Both will be removed by Story 9.12 — until then, they coexist.
    3. The Mastodon profile metadata at `https://<instance>/@<handle>` should show the green-check icon next to `https://article-time.de`.
    ```
  - [ ] **Substitute** `<handle>` / `<instance>` placeholders with the actual values from Task 1.
  - [ ] **Verify** the `status.brid.gy` URL resolves at implementation time. If it does not, document the substitution in Completion Notes and use `https://fed.brid.gy/` as the fallback (still satisfies AC #7's "Bridgy operational status page link").
  - [ ] **No changes to README** — runbook is the operator-facing detail document; README links to it.

- [ ] **CSP regression check** (AC: 6) [Source: config/_default/params.yaml lines 37, 44]
  - [ ] Re-read `config/_default/params.yaml` after all other edits.
  - [ ] Confirm `csp.connectsrc` line 44 still contains `"https://webmention.io"` (it already does, untouched by this story).
  - [ ] Confirm `csp.imgsrc` line 37 still contains `"https:"` (it already does, untouched by this story).
  - [ ] **No CSP edits are made by this story.** AC #6 is a regression guard. Diff `params.yaml`: zero changes expected from this story.
  - [ ] **Why no CSP changes are needed:** Bridgy POSTs server-to-server to webmention.io (already in `connect-src`, though browser-side CSP doesn't apply to server-to-server calls anyway). Sender avatars served by federated instances (mastodon.social, fosstodon.org, …) load via `<img src="https://...">` and are covered by the existing `imgsrc: ["'self'", "data:", "https:"]` permissive entry. **Story 2.4's webmention display component** is the consumer of those avatars; this story doesn't change the consumer side.

- [ ] **Production build smoke test** (AC: 8, 9) [Source: head.html one-line change]
  - [ ] `hugo --quiet --environment production --destination public-test --minify` → exit code 0.
  - [ ] `grep -c "rel=\"me\"" public-test/index.html` → **2** (GitHub + Mastodon `rel="me"` links).
  - [ ] `grep -c "webmention.io/article-time.de/webmention" public-test/index.html` → **1** (existing webmention `<link>`, untouched).
  - [ ] `npm run test:build` runs the existing build-smoke suite — exit code 0 (no new tests added in this story).
  - [ ] `npm run test:e2e` runs Playwright homepage smoke — exit code 0 (no UI change, no regression).
  - [ ] **Optional manual diff (Critical Agent Rule #3 / regression guard):** `git stash` → `hugo --destination public-test-before` → `git stash pop` → `hugo --destination public-test-after` → `diff -r public-test-before public-test-after`. Expected diffs: (a) the new Mastodon `<link rel="me">` line in every rendered HTML page; (b) bundle.js / style.css hashes UNCHANGED (no SCSS/JS edits); (c) sitemap, RSS, and other generated outputs UNCHANGED.

- [ ] **Documentation** (testability + completion)
  - [ ] Inline comment block in `head.html` references Story 2.8 + FR-011 + Story 9.12 retirement path (per Task 3 snippet).
  - [ ] Completion Notes document: (a) chosen Fediverse handle + instance + public profile URL, (b) verification path chosen (rel="me", not webfinger), (c) Bridgy dashboard verified-state (date observed, screenshot if captured), (d) smoke-test results (test toot URL, target article URL, observed latency, any errors), (e) actual Bridgy privacy/info URL used in datenschutz.md (verify against `https://fed.brid.gy/about` or fallback), (f) any Out-of-Scope follow-ups noted for future (Bluesky bridging?).
  - [ ] **No `phase-0-task-breakdown.md` sub-paragraph added** — story file + sprint-status.yaml + git log are sufficient historical record (per `feedback_lean_tracking_docs.md` memory: docs/backlog.md and git log are the historical record).

## Dev Notes

### Architectural Context

Story 2.8 is the **eighth and final implementation story of Epic 2** (Engagement Infrastructure) and **closes the federated-engagement gap** identified during Story 2.5's review. It is the receive-side counterpart to Epic 7's outgoing POSSE (Mastodon posting) — the bridge that makes the webmention.io endpoint (Story 2.3) actually see non-IndieWeb traffic.

**Value of this story:** Without Bridgy.fed, the webmention.io endpoint set up in Story 2.3 only receives mentions from blogs that natively send webmentions — a tiny corner of the web (a few hundred IndieWeb sites). With Bridgy.fed bridged in, the same endpoint receives mentions from anywhere on the Fediverse (~25k Mastodon instances, ~10M+ active users) — orders-of-magnitude broader reach. The downstream stories (2.4 webmention display, 3.2 webmention processing) consume the same JSON store regardless of the mention's origin — Bridgy is invisible to them, but materially changes what data they see.

**Dataflow this story enables (extends Story 2.3's dataflow):**

```
                Story 2.3's dataflow:
External IndieWeb blog → webmention sender → webmention.io endpoint → (Story 3.2 fetch) → display

                Story 2.8 adds:
User reply/boost/like on Mastodon (or any Fediverse instance)
  → Bridgy.fed crawler picks up public Fediverse activity
  → Bridgy translates ActivityPub → webmention protocol
  → POSTs webmention to https://webmention.io/article-time.de/webmention
  → (same path as Story 2.3 from here on) → webmention.io stores → (Story 3.2 fetches) → display
```

**Why Bridgy.fed (and not self-hosted or some other bridge):**

- Bridgy.fed is the canonical IndieWeb bridge — Ryan Barrett (the maintainer) is a long-time IndieWeb contributor; the service has run continuously since well before the 2022 Mastodon surge.
- FREE, no rate limits, no auth required for the publisher side (we sign in with the Mastodon account being bridged, but article-time.de's webmention.io endpoint takes Bridgy's POSTs unauthenticated — same as it takes any other webmention sender's POSTs).
- Self-hosting an ActivityPub-to-webmention bridge requires running a persistent server with public HTTPS — this project is JAMstack on GitHub Pages and has no server runtime. Bridgy's hosted service eliminates the runtime requirement.
- Alternative considered: `bridge.activitypub.gay` (a smaller hobbyist bridge) — rejected: smaller user base, fragile, no operational status page, no compatibility with webmention.io's incoming format.
- Decision locked at architecture phase: `digital-garden-integration-architecture.md` line 431 shows Bridgy in the data flow without naming it as a separate story — this story is the explicit closure of that gap.

[Source: docs/2-solutioning/digital-garden-integration-architecture.md (line 431) — Data flow with Bridgy as the Mastodon→webmention.io bridge]
[Source: docs/2-solutioning/digital-garden-integration-architecture.md (lines 192–195, 974–998) — webmention.io is the receiver; Bridgy is a producer for it, same as any other webmention sender]
[Source: https://fed.brid.gy/ — Bridgy Fed signup and verification UI]

### Implementation: Infrastructure-Only Story, One-Line Code Change

The Hugo-side code change is **one line**: a second `<link rel="me" href="https://<instance>/@<handle>" />` added to `head.html` adjacent to the existing GitHub `rel="me"` shim from Story 2.3. Every other deliverable is content (privacy policy) or operator documentation (runbook).

**Why no `params.yaml` block:** unlike Umami (which configures `website_id` and `script_url` for the rendered Umami script) or webmention.io (which has its endpoint URL hardcoded in head.html for single-tenant simplicity), Bridgy has **nothing the site needs to render or call** — Bridgy is purely a server-to-server bridge upstream of webmention.io. The `rel="me"` URL to the Mastodon profile is single-tenant (one Mastodon handle for one site) and hardcoded same as the webmention endpoint URL. If the site ever multi-tenants or migrates to a different bridge, refactoring to a config block is a 5-minute follow-up; the current hardcoded approach matches the project's "small, single-tenant, single-author" reality.

**Why no JS / SCSS / data file change:** the user-facing display of bridged mentions is **identical** to the display of any other webmention — Story 2.4's webmention display component reads `data/webmentions_by_article.json` (populated by Story 3.2) and renders avatars + text + source URLs regardless of whether the mention came from an IndieWeb blog or from Mastodon-via-Bridgy. From the consumer side, Bridgy is invisible. This story doesn't touch Story 2.4's component.

**Why no test file change:** the `rel="me"` Mastodon link is **explicitly temporary** — Story 9.12's Pre-Spec Notes already flag the `rel="me"` block (including the new Mastodon line) for removal when the `params.social`-driven set lands. Adding a test now creates churn at 9.12 (test would have to be rewritten or deleted). Story 2.3's review reached the same conclusion for the GitHub shim and deliberately deferred — this story follows the same precedent.

[Source: layouts/_partials/_base/head.html (lines 51–62) — existing webmention + GitHub rel="me" block; Story 2.8 adds one adjacent line]
[Source: docs/sprint-artifacts/epic-2/2-3-webmention-endpoint-setup.md (lines 60–73, 224–229) — established the rel="me" shim pattern with documented retirement path]
[Source: docs/1-planning/epics.md (lines 1686–1688) — Story 9.12 Pre-Spec Notes documenting the full retirement of all head.html rel="me" lines]

### Bridgy.fed Verification — `rel="me"` vs `.well-known/webfinger`

The epics AC #2 leaves the verification mechanism open ("rel='me' link or `.well-known/webfinger` — choose whichever Bridgy currently requires"). This story **picks `rel="me"`**. Reasoning:

- **Bridgy Fed's current docs** (`https://fed.brid.gy/docs`) accept rel="me" verification as the default path for bridging an existing Mastodon account. Verify this is still the case at implementation time — Bridgy's docs evolve; if the current requirement has shifted to webfinger, fall back to the webfinger path (see below) and document the substitution in Completion Notes.
- **GitHub Pages serves static files**, but `.well-known/webfinger` requires a **specific content-type** (`application/jrd+json`) that Hugo's static-file pipeline does NOT auto-set. Implementing webfinger would require either: (a) a `static/.well-known/webfinger` file with a custom `_headers` config to override content-type (GitHub Pages supports `_headers` only via custom routing, which the project does not currently have); (b) a Hugo-rendered file via custom output format (complex, single-purpose); (c) a JavaScript-based webfinger response (impossible — webfinger is a server-side protocol). All three are 10x more work than adding one HTML `<link>` tag.
- **rel="me" matches existing pattern** Story 2.3 established for webmention.io's IndieAuth signup. Consistency wins.
- **Story 9.12 absorbs the cleanup** — the `params.social`-driven `rel="me"` set already plans to include a Mastodon entry. Adding the Mastodon shim now means 9.12's migration replaces N+1 hardcoded lines with one structured set, instead of replacing N hardcoded lines plus needing to introduce the Mastodon profile URL fresh.

**Fallback (if Bridgy requires webfinger at implementation time):**

1. Create `static/.well-known/webfinger` with JSON content per RFC 7033, listing the Mastodon profile as a `rel="self"` entry for the actor `acct:<handle>@article-time.de`.
2. The content-type issue means responses will be served as `text/plain` or `application/octet-stream` — Bridgy may or may not accept this. If it does not, GitHub Pages cannot serve webfinger correctly without custom routing, and this story is **blocked** until a deploy-layer change lands.
3. Document the block in Completion Notes and create a follow-up issue.

[Source: https://fed.brid.gy/docs — Bridgy Fed setup documentation (verify at implementation time)]
[Source: https://www.rfc-editor.org/rfc/rfc7033 — WebFinger protocol spec, for fallback path documentation only]

### Privacy Policy: Bridgy.fed as Additional Processor

AC #4 requires disclosing Bridgy.fed as a processor between the originating Fediverse instance and webmention.io. The disclosure is GDPR-relevant: the chain of processors for a bridged Mastodon mention is now `[Mastodon instance operator] → [Bridgy.fed / Ryan Barrett] → [webmention.io / Aaron Parecki] → [article-time.de]`. The existing `## Webmentions` section already discloses webmention.io as a processor; this story adds the **upstream** processor (Bridgy.fed) to make the chain explicit.

**Why this matters legally (TL;DR):** Art. 6 Abs. 1 lit. f DSGVO (legitimate interest in federated communication) is the legal basis for processing webmention sender data on the site. The legitimate-interest balancing test considers **proportionality** of the data flow. Disclosing only webmention.io (the endpoint receiver) without disclosing Bridgy (the upstream bridge) understates the chain — Fediverse users who didn't realize their post would be re-broadcast as a webmention have a stronger case for "this exceeds the data flow I expected." Full chain disclosure puts everyone on notice that public Fediverse posts can flow to article-time.de via the bridge, which is consistent with the public nature of Fediverse activity but should be transparent.

**Why bold-label paragraphs and not `### Sub-heading`:**

The existing `## Webmentions` section in `content/pages/datenschutz.md` uses bold-label paragraphs for its sub-sections (`**Welche Daten werden empfangen?**`, `**Verarbeitung durch webmention.io:**`, `**Rechtsgrundlage:**`, `**Wie kannst Du widersprechen?**`). Story 2.5's privacy-policy refresh consolidated this style across all sections. The new Bridgy paragraph follows the same convention. Do NOT use `###` headings — that would create a visual inconsistency with the rest of the section.

**Why no `**Rechtsgrundlage:**` paragraph for Bridgy specifically:** the existing `**Rechtsgrundlage:**` paragraph (current line 102) already cites Art. 6 Abs. 1 lit. f DSGVO ("berechtigtes Interesse an föderierter Kommunikation und transparenter Diskussion") which covers Bridgy as a processor of the same federated communication. Adding a Bridgy-specific Rechtsgrundlage would be redundant and would imply Bridgy has a separate legal basis (it doesn't — same legitimate-interest basis applies).

**Why no "Stand:" / "Last updated:" line is added in this story:** Story 2.5 owns the privacy-policy refresh as a whole and was the dedicated story for date/Stand metadata. This story's extension is a tactical content add, not a structural refresh. If Story 2.5 has already added a Stand line, this story's edit should bump the date (no AC requirement, but professional courtesy). If Story 2.5 has NOT added one, do not add one in this story — leave it for the dedicated refresh.

[Source: content/pages/datenschutz.md (lines 85–108) — existing `## Webmentions` section structure to extend]
[Source: docs/sprint-artifacts/epic-2/2-5-privacy-policy-page.md — Story 2.5 privacy-policy structural decisions, including bold-label-not-h3 convention]

### Runbook Section: One Operator's-Eye View

AC #5 and AC #7 together require the runbook to capture **what an operator needs to know** if they need to: pause the bridge for an abuse situation, recover from a Bridgy outage, or hand the project off to a successor maintainer. The new section serves all three:

- **Pause/disconnect** — explicit step-by-step for the most-common operational action.
- **Status visibility** — link to Bridgy's status page so the operator knows where to look during an outage.
- **Mention-level removal** — clarifies that per-mention deletion happens at webmention.io, not Bridgy (an easy point of confusion).
- **Sanity check after deploy** — three concrete checks the operator can run after any related code change.

**Why end-of-file insertion:** the runbook's existing sections (`## Setup`, `## Tests`, `## Local development server`, `## Maintenance mode`, `## Deploy`) follow a roughly chronological / use-frequency order (most-frequently-touched first). Bridgy.fed is a "set once, ignore for months, return only for abuse" operation — it belongs at the bottom alongside any other long-tail operational sections. Future operational sections (e.g. "Webmention.io account management", "Umami dashboard access") would slot adjacent.

**Why not a separate `docs/technical/bridgy.md` file:** per project convention (and `feedback_lean_tracking_docs.md` memory), single-source-of-truth files beat scattered docs. The runbook is the operator-facing detail document; new operational concerns extend it, not create siblings. The runbook is already linked from README line 10 as the canonical operator reference.

[Source: docs/technical/runbook.md (full file) — established structure to extend]
[Source: README.md (line 10) — runbook is the operator-facing detail document]

### CSP: Why Nothing Changes

AC #6 is the cleanest AC in this story: it's a **regression guard** that confirms no CSP changes are needed.

- Bridgy POSTs server-to-server to webmention.io. **Browser CSP does not apply to server-to-server calls** — only browser-initiated requests are subject to the page's CSP `connect-src`. Even if Bridgy were calling something else (it isn't), the site's CSP wouldn't be the gate.
- Sender avatars for bridged mentions are served by the **originating Mastodon instance** (mastodon.social, fosstodon.org, etc.). When Story 2.4 displays a bridged mention, the `<img src="https://mastodon.social/avatars/...">` tag triggers a browser-side fetch which IS subject to CSP. The current `imgsrc: ["'self'", "data:", "https:"]` is permissive enough to allow any HTTPS image source. **No changes needed.**
- A future stricter CSP (e.g. allowlist specific Mastodon instances) would require enumerating known Fediverse instance image hosts — but the Fediverse has tens of thousands of instances and no canonical list, so a strict allowlist is impractical. The permissive `https:` entry stays.

**Verification:** diff `config/_default/params.yaml` post-implementation — should be zero changes from this story. If a diff appears, something else got edited accidentally.

[Source: config/_default/params.yaml (lines 32–44) — current CSP definition]
[Source: docs/sprint-artifacts/epic-2/2-3-webmention-endpoint-setup.md (AC #6) — established pattern: CSP regression check, no edits]

### Out-of-Scope Boundaries

The epics spec explicitly lists three out-of-scope areas. Each has a clear reason:

- **Bridgy classic (Twitter)** — Twitter killed Bridgy's API access in 2023; the service is defunct. Don't attempt. If this story's implementer is on `https://brid.gy/` (classic) instead of `https://fed.brid.gy/` (Fediverse-specific), they're on the wrong site.
- **Bluesky bridging** — Bridgy Fed does support Bluesky (`bsky.brid.gy`), but bundling it into this story doubles the verification surface (Bluesky has its own custom-domain handle mechanism via DNS TXT records) and doubles the test surface (two end-to-end tests instead of one). Captured as a one-line "follow-up note in completion notes" per epics — if Angel decides Bluesky reach is worth the marginal effort, file as a separate story or add to backlog.
- **Outgoing POSSE (mein Blog → Mastodon-Posts)** — this is Epic 7's territory (Stories 7.1, 7.2). Story 2.8 is **incoming-only**: pulling Fediverse engagement into the site. Posting site content out to Mastodon is unrelated, has different API requirements (Mastodon OAuth, posting tokens, scheduling), and lives in a different epic.

[Source: docs/1-planning/epics.md (lines 448–451) — Out-of-Scope verbatim]

### Previous Story Intelligence (from prior-story reviews and learnings)

**From Story 2.3 (Webmention Endpoint Setup) — review feedback applied here:**

- **rel="me" comment-trim style:** Story 2.3's review found `*/}}` (un-trimmed right delimiter) at the end of Hugo comment blocks rendered as a stray `>` in HTML. Fix was `*/ -}}` (trim-right delimiter). The Mastodon `rel="me"` block in this story MUST use `*/ -}}` for the closing delimiter. Story 2.3's existing block already uses the correct form; mirror it.
- **No `hugo.IsProduction` gate for discovery metadata:** Story 2.3 explicitly does NOT gate the webmention `<link>` or the GitHub `rel="me"` shim on production. The Mastodon `rel="me"` link follows the same decision. Bridgy's crawler reads the production HTML at `https://article-time.de/`, not localhost; emitting in dev is harmless.
- **IndieAuth signup flow is brittle if rel="me" doesn't exist:** Story 2.3 hit this when webmention.io's signup demanded a `rel="me"` link before allowing account creation. The implementer initially planned to defer the link but had to add it mid-task. Bridgy.fed's flow is similar — if the Mastodon `rel="me"` link isn't live in production when Bridgy's verification runs, verification fails. **Sequence matters:** deploy the head.html change (Task 3) BEFORE running Bridgy signup (Task 4). Don't try to do them simultaneously.

**From Story 2.5 (Privacy Policy Page) — structural conventions:**

- The `## Webmentions` section uses bold-label sub-sections, not `###` headings. This story's privacy-policy extension follows the as-shipped style, not Story 2.3's draft style. Verify by re-reading `datenschutz.md` at implementation time.

**From Story 2.6 (Daily Rebuild Workflow) — operational documentation conventions:**

- The runbook's existing `## Maintenance mode` section established the pattern of "what + how + verification + edge cases" for operational documentation. The new `## Bridgy.fed` section follows the same structure (bridged identity → operational status → disconnect procedure → mention-level removal → sanity check after deploy).

**From Story 2.7 (Cookie-Banner UI) — coordinated changes across multiple files:**

- Story 2.7 touches `cookie-banner.html` (new partial), `gdpr.js` (new JS), `cookie-banner.scss` (new SCSS), and `baseof.html` (partial inclusion). It established the pattern of explicitly listing every file touched in the AC + Tasks block. Story 2.8 touches `head.html`, `datenschutz.md`, and `runbook.md` — same explicit-file-list pattern applies. No surprises for the implementer.

**From `feedback_third_party_drift.md` memory (Umami silently changed script URL):**

- Bridgy's UI evolves; the disconnect procedure today may not be the disconnect procedure in 6 months. The runbook entry includes **verification instructions** ("look for the 'Disable' button — Bridgy's UI labels these; verify at write-time and reproduce the exact button name verbatim") so the operator doesn't follow stale docs. Bake a 12-month "verify the runbook against current Bridgy UI" entry into the operator's mental model.

**From `feedback_lean_tracking_docs.md` memory (don't over-document):**

- This story does NOT create new files for tracking; it extends three existing files (head.html, datenschutz.md, runbook.md). No new docs/backlog entry. No phase-0-task-breakdown sub-paragraph. Completion Notes in this story file + sprint-status.yaml + git log are the historical record.

[Source: docs/sprint-artifacts/epic-2/2-3-webmention-endpoint-setup.md (Review Findings + Dev Notes) — rel="me" pattern + comment-trim style]
[Source: docs/sprint-artifacts/epic-2/2-5-privacy-policy-page.md — bold-label sub-section convention]
[Source: docs/sprint-artifacts/epic-2/2-6-daily-rebuild-github-actions-workflow.md (Dev Notes structure) — operational documentation pattern]
[Source: docs/sprint-artifacts/epic-2/2-7-cookie-banner-ui.md — multi-file change pattern]

### Git Intelligence Summary

Recent commits (latest 5) and their relevance to Story 2.8:

- `cefed85 (ci) Skip test gate + data generation in maintenance mode` — workflow change for maintenance-mode releases. Not relevant to Story 2.8 (no workflow changes here).
- `4c0fb81 Maintenance design done` — copy/styling for maintenance mode. Not relevant.
- `40c82e6 Backlog Work` — backlog grooming. Confirms that recent backlog sweeps haven't touched Bridgy / Fediverse items; this story is fresh territory.
- `fbd132d Merge pull request #206 from AngelCrawford/worktree-backlog-sweep` — backlog work, see above.
- `4ef0585 Review story 2-6 done` — Story 2.6 (daily-rebuild workflow) review-closure commit. Patterns from 2.6's runbook updates (see Maintenance Mode section) inform this story's runbook addition.

**Important note for the implementer:** there is an older commit `0385dd3 (feat) Story 2-8 Article info tile widget + ribbon/heart redesign` in the history. This is an **older Story 2-8 from a previous numbering** — the current Story 2-8 (Bridgy.fed Setup) was added during a renumber. The old "Article info tile widget" story was either renumbered or absorbed elsewhere. **Do not confuse the two.** Running `git log --oneline --all -- "**bridgy**" "**brid.gy**"` returns no commits, confirming Bridgy work has not yet started.

### Latest Tech Information (Bridgy.fed as of implementation time)

**Bridgy Fed setup is UI-driven**, not API-driven from this side. The setup steps documented at `https://fed.brid.gy/` (verify currency at implementation time):

1. Sign in with the Mastodon account being bridged.
2. Enter the domain to bridge.
3. Bridgy crawler verifies the `rel="me"` cross-link.
4. Domain is added to the bridged account's profile.

**The setup is ~5 minutes of clicks.** The story-card weight is in the surrounding work (decision-making, documentation, smoke test), not in the Bridgy UI flow itself.

**Bridgy Fed's data handling** (as of `https://fed.brid.gy/docs` at the time of this story's drafting — verify):

- Bridgy is HTTP-only public-API-only — no opaque backend channels.
- Bridge state is per-account at Bridgy; disable from Bridgy = bridge stops within minutes.
- Bridgy forwards public Fediverse activity only (no Followers-Only posts, no DMs).
- Bridgy queues internally only for brief retry windows — long outages mean lost mentions, not queued-and-eventually-delivered.

**No Bridgy SDK or library is used by this site.** Bridgy is an external service the site does not call. The only site-side artifact is the `rel="me"` HTML tag.

[Source: https://fed.brid.gy/ — Bridgy Fed signup page]
[Source: https://fed.brid.gy/docs — Bridgy Fed operator documentation]

### Project Context Reference

- **Project:** Article Time (German/English personal Hugo blog being transformed into a digital garden)
- **Tech stack:** Hugo 0.161.1 Extended; vanilla JS for new features (no jQuery — see Critical Agent Rule #5 in `digital-garden-integration-architecture.md` line 768); SCSS with Bulma + PurgeCSS; GitHub Pages hosting; GitHub Actions for daily-rebuild workflow.
- **Hosting:** GitHub Pages (static, no server runtime, no custom HTTP headers — relevant for the webfinger fallback discussion in Dev Notes).
- **Site URL:** `https://article-time.de` (single-tenant, single-domain).
- **Public contact:** `mail@article-time.de` (per `project_site_contact_email.md` memory — NOT Angel's @grvity.de work address; relevant if the runbook section references operator contact).
- **Author:** Angel Crawford (`AngelCrawford` on GitHub).
- **Languages:** Site copy is bilingual German/English; privacy policy is German-only (mandatory under DSGVO).
- **Critical Agent Rules** (from `digital-garden-integration-architecture.md` lines 762–771):
  - Rule #1 (don't modify card variants): N/A — no card edits in this story.
  - Rule #5 (no jQuery for new features): N/A — no new JS in this story.
  - Rules #2, #3, #4, #6, #7: not directly relevant; standard regression-and-style guards apply.

### Story Completion Status

Final status: **ready-for-dev**

When this story is implemented, the chain of effects is:

1. The site advertises a Mastodon `rel="me"` identity → Bridgy can verify the domain.
2. Bridgy is signed up and verified → Bridgy starts forwarding public Fediverse mentions to webmention.io.
3. webmention.io stores the bridged mentions → Story 3.2's processing script (when it lands) ingests them.
4. Story 2.4's display component renders them on article pages (when it has data — also gated on Story 3.2).

**This story is the producer-side closure** of Epic 2's federated-engagement loop. The consumer side (2.4 display, 3.2 processing) is already done or pending separately. Until 3.2's daily fetch runs, bridged mentions accumulate at webmention.io's dashboard but do not appear on the live site — **this is expected, not a defect of this story.** AC #3's smoke test verifies mentions reach the **webmention.io dashboard**, not the live site.

## Dev Agent Record

### Agent Model Used

claude-opus-4-7[1m] (Opus 4.7, 1M context) — story drafting via bmad-create-story workflow

### Debug Log References

### Completion Notes List

### File List

## Open Questions for Angel

1. **Fediverse identity choice (AC #1):** Existing Mastodon account on which instance, or new account on which instance? The story defaults to "Angel picks at implementation time" but the choice has long-term consequences (instance moderation, uptime, ToS) — worth a sanity check before signup.

2. **Bridgy info-URL for datenschutz.md (AC #4 Task 6):** The story uses `https://fed.brid.gy/about` as the example. Bridgy's site does have an info/about page; confirm the actual operator-facing privacy URL at implementation time (Bridgy may have a dedicated `/privacy` route or rely on the about page). If unclear, default to the about page and document the choice in Completion Notes.

3. **Bluesky bridging (Out-of-Scope but flagged):** The story explicitly skips Bluesky per epics. Worth confirming this is still the right call — Bluesky's federated bridge via `bsky.brid.gy` is a 30-minute follow-up if Angel wants the reach. If yes, file as a separate story or backlog item; do not bundle into 2.8.

4. **Status page URL (AC #5 Task 6):** The story uses `https://status.brid.gy/` as the operational status link. Verify this resolves at implementation time. If not, fall back to `https://fed.brid.gy/` and document the substitution.

5. **rel="me" vs webfinger (AC #2):** The story commits to rel="me" with documented reasoning. If Bridgy's current docs require webfinger, this story has a fallback path but it is blocked on a deploy-layer change (GitHub Pages can't easily serve webfinger content-type). Worth verifying Bridgy still accepts rel="me" before kicking off the story.
