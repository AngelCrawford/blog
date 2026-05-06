# Story 2.3: Webmention Endpoint Setup

Status: ready-for-dev

## Story

As a content creator,
I want my site to receive webmentions from other blogs,
so that I can see federated engagement and replies.

## Acceptance Criteria

1. Webmention endpoint discovery link added to every page's `<head>`. Implementation places the snippet in `layouts/_partials/_base/head.html` (project convention — `baseof.html` includes the head partial via `{{ partial "_base/head" . }}` at line 3, so the rendered effect is identical to "added to `<head>`" in the epics AC). The exact tag matches the epics spec:
   ```html
   <link rel="webmention" href="https://webmention.io/article-time.de/webmention" />
   ```
   The tag is rendered on **every** page (home, articles, logs, taxonomy, list pages) — webmention discovery is a site-wide concern, not per-content-type. No `hugo.IsProduction` gate (the link is just discovery metadata; harmless and beneficial in dev where `<base href>` resolution still points readers' parsers at the production endpoint).

2. **Webmention.io account created and verified for `article-time.de` domain** via IndieAuth. The webmention.io account is created by signing in at https://webmention.io with the production domain and authenticating via one of the supported IndieAuth methods (e.g., `rel="me"` link to a verified profile such as Mastodon/GitHub/email). Account exists and the domain status shows "Verified" in the webmention.io dashboard. **This is a Phase 0-style external account-setup task, not a code change** — the dev (or product owner) performs the manual signup before code changes can be tested end-to-end. Reference: architecture's Implementation Checklist line 1519 of `digital-garden-integration-architecture.md` ("webmention.io account created for article-time.de").

3. **Test webmention received successfully** (manual end-to-end test). Procedure: deploy AC #1's `<link rel="webmention">` tag to production, then visit https://webmention.rocks (Aaron Parecki's official IndieWeb test endpoint) → pick a "Sender 1" or higher test → enter a permalink to a real article on `https://article-time.de/articles/<existing-post>/` → click "Send Webmention" → confirm webmention.io dashboard shows the test mention received within ~30 seconds. The mention will list the webmention.rocks page as the source and the article-time.de URL as the target. Acceptance: at least one test webmention from `webmention.rocks` appears in the webmention.io dashboard for `article-time.de`.

4. **Webmention.io API token stored in GitHub Secrets** as `WEBMENTION_IO_TOKEN`. The token is generated automatically when the webmention.io account is created (visible at the bottom of the webmention.io account settings page, labeled "Your API Key"). Stored via GitHub repo Settings → Secrets and variables → Actions → New repository secret. Token is consumed in Phase 1A by Story 3.2's `scripts/process-webmentions.js` (and any future authenticated webmention.io calls). Storing it now satisfies AC #4 and pre-positions the secret for downstream stories — even though the public `/api/mentions.jf2?domain=...` endpoint used by Story 3.2 (per `digital-garden-integration-architecture.md` lines 974–986) does NOT require the token. Pre-storing is harmless and matches the architecture's Implementation Checklist intent.

5. **Privacy policy explains webmentions.** The German privacy policy at `content/pages/datenschutz.md` is updated with a new top-level section `## Webmentions` covering: what webmentions are (federated cross-site mentions and replies, IndieWeb protocol), what data is publicly received (source URL, author name/avatar/handle if provided by the sender's site, reply text if any), the third-party processor (webmention.io operated by Aaron Parecki), the legal basis (Art. 6 Abs. 1 lit. f DSGVO — berechtigtes Interesse an federierter Kommunikation), how readers can opt out (don't send webmentions; existing mentions can be removed by emailing the site owner), and a link to https://webmention.io/. **Coordination note:** Story 2.5 (Privacy Policy Page) is the dedicated story for the full privacy-policy refresh covering Umami + hearts + webmentions together. **Decision authority:** the Webmentions section is added in **this** story to satisfy AC #5 verbatim from epics; Story 2.5 will integrate/expand it as part of the broader privacy-policy refresh (Umami, hearts, GDPR rights, contact, current-as-of date). This avoids the AC #5 stay-blocked-on-Story-2.5 problem and is the same approach Story 2.1 used (defer-to-Story-2.5 was flagged as acceptable for the Umami section but Story 2.5 had not been implemented; in this story we add the section directly because the deployment of webmention reception **without** any privacy-policy disclosure would be a documentation gap visible to GDPR-conscious readers).

6. **CSP allow-list already covers webmention.io** (Phase 0 Task 4.0 added `https://webmention.io` to `csp.connectsrc` in `params.yaml` line 29 — confirmed in current file state). This story does NOT modify CSP. AC is a regression guard: re-read `params.yaml` after editing — `csp.connectsrc` still contains `"https://webmention.io"`. Note: AC #1's `<link rel="webmention">` tag is HTML metadata, NOT a runtime fetch — the link itself does not trigger any CSP `connect-src` evaluation. The `webmention.io` `connect-src` allowance is for **outgoing** webmentions and any future client-side webmention-display fetches (e.g., Story 2.4's webmention display component, if it makes any browser-side API calls). Either way, no CSP edit needed here.

7. **No regression to existing head emit.** Existing CSP meta tag, CSS bundle, JS bundle (`bundle.js` from `jquery.js` + `gdpr.js`), preload links, favicon links, SEO partial output, and RSS link tag are byte-identical (or equivalent) to pre-change for both production and development builds. Build a representative page (e.g. `public/articles/<existing-post>/index.html`) before and after the change and diff — only the new `<link rel="webmention">` tag block should differ. The webmention link emits identically in both `hugo server` (development) and `hugo --environment production` builds (no `hugo.IsProduction` gate, intentionally — see AC #1 rationale).

8. **Build still succeeds cleanly.** `hugo --quiet --environment production --minify` exits 0 with no template-execution errors, no missing-variable warnings, no unresolved partial references. The new `<link>` tag has no Hugo template variables (the URL `https://webmention.io/article-time.de/webmention` is a literal — see AC #1 reconciliation note below) so it is structurally trivial; this AC is a regression guard against accidental edit damage in `head.html`.

### AC Source & Reconciliation Note

ACs 1–5 are derived verbatim from `docs/1-planning/epics.md#Story-2.3-Webmention-Endpoint-Setup` (lines 278–293 of `epics.md`). ACs 6–8 are testability/regression guards added by the create-story workflow (CSP regression, byte-equivalent unchanged head emit, clean prod build). They are NOT in the original epics list — they exist solely to make ACs 1–5 verifiable.

**Convention reconciliation (epics AC #1 wording vs. project layout):** Epics AC #1 says "added to `<head>`". Project convention places head content in `layouts/_partials/_base/head.html`, included from `baseof.html` line 3 via `{{ partial "_base/head" . }}`. The rendered HTML is identical. **Decision:** keep project convention (head.html partial) — same reconciliation pattern as Story 2.1.

**Hardcoded URL vs. config param:** The webmention endpoint URL `https://webmention.io/article-time.de/webmention` is hardcoded in the partial (per epics AC #1 verbatim). Alternative considered: pull it from a `webmention:` block in `params.yaml` (mirroring the `umami:` block from Story 2.1) for consistency. **Decision:** hardcode in this story (matches epics AC verbatim, simplest possible change for a 0.5-day story, single-domain project means the URL never varies). If the project ever multi-tenants or changes the webmention provider, refactoring to a config param is a 5-minute follow-up. Document the decision in completion notes.

[Source: docs/1-planning/epics.md#Story-2.3-Webmention-Endpoint-Setup (lines 278–299) — five ACs verbatim]
[Source: docs/1-planning/prd/03a-functional-requirements.md (lines 86–96) — FR-011 (Webmention Reception), FR-012 (Webmention Display) — only FR-011 in scope for this story]
[Source: docs/2-solutioning/digital-garden-integration-architecture.md (lines 192–195, 234–248, 974–998, 1519) — webmention.io API spec, Implementation Checklist]
[Source: docs/3-implementation/phase-0-task-breakdown.md (Task 4.0, lines 379–414) — CSP `connect-src` already includes `https://webmention.io`]

## Tasks / Subtasks

- [ ] **External: create webmention.io account for article-time.de** (AC: 2) [Source: https://webmention.io]
  - [ ] **Prerequisite check:** verify the production domain `article-time.de` is currently live and reachable over HTTPS (any 200-OK page is sufficient — the home page at `https://article-time.de/` will do).
  - [ ] **Verify IndieAuth requirement:** webmention.io's signup uses IndieAuth, which requires the signing-in domain to expose a `rel="me"` link in `<head>` or a discoverable IndieAuth-compatible profile. **Reality check:** the project's existing `<head>` does NOT yet emit `rel="me"` links to social profiles (no Mastodon/GitHub `<link rel="me">` is present). Two paths to satisfy IndieAuth:
    - **(a) GitHub OAuth fallback** — webmention.io supports GitHub as an authentication provider via OAuth (no `rel="me"` needed on the site itself). Sign in to webmention.io with the GitHub account that owns the article-time.de repo, then claim the domain by adding a `rel="me"` link to GitHub on the site (or use webmention.io's domain-verification fallback: a TXT record or a verification file at the site root).
    - **(b) Add a temporary `rel="me"` link to the site's head** pointing at a verified profile (e.g., Mastodon, GitHub user page) — this also serves as IndieWeb best practice (relMe links enable webmention.io and other IndieWeb services to verify ownership).
  - [ ] **Recommended: option (a) GitHub OAuth.** Reason: zero code change required for signup; the existing GitHub identity (`AngelCrawford`) is already authoritative for the repo and trivially proves domain ownership via DNS or repo-meta. If webmention.io requires a `rel="me"` link on the production site, fall back to option (b) and add a one-line `<link rel="me" href="https://github.com/AngelCrawford" />` to `head.html` as part of this task — note the addition in completion notes (it's beyond the literal AC scope but is a prerequisite enabler for AC #2).
  - [ ] **Sign up:** visit https://webmention.io → click Sign In → choose GitHub (or Mastodon if `rel="me"` already configured) → authenticate → enter `article-time.de` as the domain when prompted → confirm domain ownership flow.
  - [ ] **Verify domain status:** in the webmention.io dashboard, the domain `article-time.de` should appear with a "verified" badge (or equivalent). If not verified, follow the dashboard's verification instructions (typically: ensure `rel="me"` link on the site OR confirm the OAuth provider's identity matches the authoritative repo owner).
  - [ ] **Save credentials:** record the webmention.io account email/handle and the API key (visible in account settings) in the project's password manager / secret store. The API key (sometimes called "Your API Token") is required for AC #4.
  - [ ] **Document:** add a one-line note to `docs/3-implementation/phase-0-task-breakdown.md` (or its successor doc) under Phase 1A → Story 2.3 → "External setup complete" with the date and any relevant URLs (account dashboard URL, domain verification status). **OR** simply rely on this story's completion notes — pick whichever has lowest documentation friction.

- [ ] **Add `<link rel="webmention">` tag to `head.html`** (AC: 1, 7) [Source: layouts/_partials/_base/head.html]
  - [ ] Open `layouts/_partials/_base/head.html`.
  - [ ] **Insertion point:** add the new `<link rel="webmention">` tag **adjacent to the existing RSS link block** at lines 47–49 (immediately after the closing `{{- end -}}` on line 49, before the closing `</head>` on line 50). Reasoning: webmention discovery is HTML metadata in the same family as the RSS `<link>` and IndieWeb `rel="*"` family — grouping with the RSS link is the most semantically sensible location. **Alternative considered:** placing immediately after the SEO partial call (line 45). Either works; RSS-adjacent matches "discovery links" grouping.
  - [ ] Snippet to add (verbatim):
    ```go-html-template
    {{- /* Webmention endpoint — Story 2.3 (FR-011). Receives federated mentions via webmention.io. */}}
    <link rel="webmention" href="https://webmention.io/article-time.de/webmention" />
    ```
  - [ ] **No `hugo.IsProduction` gate.** The webmention link is HTML metadata, not a runtime fetch. Emitting it in development is harmless (browsers ignore it; webmention senders only consume the rendered production HTML). Gating would slightly increase template complexity without benefit.
  - [ ] **No template variables.** The URL is a literal string — `article-time.de` is the production domain and is unlikely to change. If the project later refactors all external-service URLs to `params.yaml` (e.g., adds a `webmention:` block parallel to `umami:`), this hardcoded value gets parameterised then. Out of scope for this story.
  - [ ] **Verify whitespace cleanliness:** Hugo's `{{-` (left-trim) and `-}}` (right-trim) controls produce clean diffs. The added block introduces one comment line + one `<link>` line, no extra blank lines. Acceptable: a single blank line above the comment for visual separation.

- [ ] **Manual: send test webmention from webmention.rocks** (AC: 3)
  - [ ] **Prerequisite:** AC #1's code change must be **deployed to production** (`https://article-time.de/`) before this test can succeed. webmention.rocks fetches the target URL and reads its `<link rel="webmention">` to discover where to send the mention; if the link is only on a dev preview, the test cannot complete. After merge → wait for the GitHub Pages deploy → confirm the new `<link>` appears in `view-source:https://article-time.de/`.
  - [ ] **Run the test:**
    1. Visit https://webmention.rocks
    2. Pick a test in the **Receiver** section — recommended: Test #1 ("Direct mention with text content").
    3. In the test page, fill in a real article URL from the live site, e.g. `https://article-time.de/articles/<existing-post>/` (use any current article — the post just needs to exist and be reachable).
    4. Click "Send Webmention".
    5. Wait ~10–30 seconds for webmention.io to receive and process.
    6. Open the webmention.io dashboard for `article-time.de`. The new test mention should appear in the mentions list, with source URL = `https://webmention.rocks/test/<n>` and target URL = the article URL.
  - [ ] **Acceptance:** at least one test webmention from `webmention.rocks` is visible in the webmention.io dashboard within ~30 seconds of sending.
  - [ ] **Troubleshooting (if no mention appears):**
    - Confirm the target URL returns HTTP 200 (not a 404 or redirect).
    - View source on the target URL → confirm `<link rel="webmention" href="https://webmention.io/article-time.de/webmention" />` is present in `<head>`.
    - Check webmention.io dashboard for any error/blocked status on the source.
    - Check CSP — though webmention.rocks → webmention.io is a server-to-server call (not subject to your site's CSP), the `<link>` tag itself must be reachable via the public HTML.

- [ ] **External: store WEBMENTION_IO_TOKEN in GitHub Secrets** (AC: 4) [Source: https://github.com/AngelCrawford/blog/settings/secrets/actions]
  - [ ] Get the API token from webmention.io: log in to webmention.io → Settings → "Your API Key" (or equivalent label) → copy the token.
  - [ ] Open the GitHub repo settings: https://github.com/AngelCrawford/blog/settings/secrets/actions → click "New repository secret".
  - [ ] **Secret name:** `WEBMENTION_IO_TOKEN` (uppercase, snake_case — matches the existing `UMAMI_API_KEY` and `UMAMI_WEBSITE_ID` secret naming convention).
  - [ ] **Secret value:** paste the API token from webmention.io.
  - [ ] Save. Verify the secret appears in the Actions secrets list (value will be redacted; only the name is visible).
  - [ ] **Verify in workflow context (defensive):** if `.github/workflows/daily-rebuild.yml` exists at this point, **do NOT** add `WEBMENTION_IO_TOKEN` to its `env:` block in this story — that integration belongs to Story 3.2 (Webmention Processing Script). Pre-storing the secret is sufficient. Document in completion notes that the secret is stored but not yet wired into any workflow.
  - [ ] **Naming reconciliation note:** the architecture document does NOT prescribe a secret name for the webmention.io token (lines 974–998 specify the public API does not require auth). Naming `WEBMENTION_IO_TOKEN` is a convention choice consistent with `UMAMI_API_KEY` and `UMAMI_WEBSITE_ID`. If Story 3.2's spec uses a different name, a one-line rename in GitHub repo settings is trivial. Document the chosen name in this story's completion notes for downstream stories to consume.

- [ ] **Add Webmentions section to privacy policy** (AC: 5) [Source: content/pages/datenschutz.md]
  - [ ] Open `content/pages/datenschutz.md`.
  - [ ] Add a new top-level section `## Webmentions` immediately after the existing `## Spotify` section (currently at lines 60–67). Insertion point: after line 67 (end of Spotify paragraph) and before the file end (line 68).
  - [ ] Suggested German content (adapt phrasing as needed; the existing privacy-policy voice is informal "Du" — match it):
    ```markdown
    ## Webmentions

    Diese Website empfängt **Webmentions** über den Dienst [webmention.io](https://webmention.io) (betrieben von Aaron Parecki). Webmentions sind ein offener IndieWeb-Standard für federierte Erwähnungen und Antworten zwischen Websites — vergleichbar mit Trackbacks/Pingbacks, aber moderner und spamresistenter.

    ### Welche Daten werden empfangen?

    Wenn eine andere Website auf einen meiner Artikel verweist und eine Webmention sendet, werden folgende Informationen öffentlich auf meiner Seite sichtbar:

    - URL der verweisenden Seite (Quell-URL)
    - Autorenname und Avatar (sofern von der sendenden Seite bereitgestellt)
    - Antworttext oder Auszug der Erwähnung (sofern von der sendenden Seite bereitgestellt)

    Es werden **keine** IP-Adressen, Cookies oder personenbezogenen Daten der Webmention-Sender bei mir gespeichert. Die Erfassung erfolgt einmal täglich durch einen automatischen Build-Prozess.

    ### Verarbeitung durch webmention.io

    Der Dienst webmention.io empfängt die Webmentions stellvertretend und stellt sie über eine öffentliche API bereit. Verantwortlich für diesen Dienst ist Aaron Parecki. Datenschutzhinweise zu webmention.io: [https://webmention.io/](https://webmention.io/).

    ### Rechtsgrundlage

    Die Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an federierter Kommunikation und Sichtbarkeit von Erwähnungen).

    ### Widerspruch / Löschung

    Du kannst eine Webmention zurückziehen, indem Du den Link auf der ursprünglich verweisenden Seite entfernst — die Webmention wird beim nächsten Build automatisch entfernt. Alternativ kannst Du mich per [Impressum](/impressum/) kontaktieren und um Löschung bitten.
    ```
  - [ ] **Coordination with Story 2.5:** Story 2.5 (Privacy Policy Page) is the dedicated story for a full privacy-policy refresh covering Umami + hearts + webmentions together. The Webmentions section added here is **the** authoritative initial copy — Story 2.5 may rephrase or restructure for consistency with Umami/hearts sections, but should not remove the substance. **Why add it here, not defer to 2.5:** AC #5 is the explicit text "Documentation added to privacy policy explaining webmentions" — deferring would leave the AC unsatisfied at the time of the test webmention reception (AC #3), creating a documentation/legal gap.
  - [ ] **Update doc date:** the existing `datenschutz.md` does not have a "Stand:" / "Last updated:" line — Story 2.5 will add one as part of the broader refresh. Do NOT add one in this story (out of scope, would be churn for Story 2.5 to redo).
  - [ ] **Phase 0 Task 5.1 reality-check:** the Phase 0 task breakdown (lines 703–715) already flagged that the privacy policy needs Umami/hearts/webmentions sections as part of Phase 1A. Adding the Webmentions section here ticks one of those three boxes; Stories 2.1 (deferred to 2.5) and 2.2 (deferred to 2.5) cover the other two — Story 2.5 will integrate all three when implemented.

- [ ] **CSP regression check** (AC: 6) [Source: config/_default/params.yaml line 29]
  - [ ] Re-read `config/_default/params.yaml` `csp.connectsrc` after editing — confirm it still contains `"https://webmention.io"` (line 29 currently has it from Phase 0 Task 4.0).
  - [ ] Build site once (`hugo --environment production`) and grep the rendered `public/index.html` for `Content-Security-Policy` — confirm `connect-src` still includes `https://webmention.io`.
  - [ ] **No CSP changes needed.** The `<link rel="webmention">` tag is HTML metadata, not a runtime fetch — no CSP directive applies to its emission. The pre-existing `connect-src` entry covers downstream stories (2.4 webmention display fetches if any, 3.2 webmention processing).

- [ ] **Production build smoke test** (AC: 1, 7, 8)
  - [ ] Run `hugo --quiet --environment production --minify` from project root → exit code 0, no warnings.
  - [ ] Open the resulting `public/index.html` (or any article page) → grep for `rel="webmention"` → present exactly once per page, with `href="https://webmention.io/article-time.de/webmention"`.
  - [ ] Run `hugo server --quiet` (development) → fetch `http://localhost:1313/` → `View Source` → confirm the `<link rel="webmention">` IS present (no `hugo.IsProduction` gate, by design).
  - [ ] Diff `public/articles/<existing-post>/index.html` before and after the change — only the new `<link rel="webmention">` block (and its preceding comment) should differ.

- [ ] **Manual end-to-end smoke test** (AC: 1, 3)
  - [ ] After deploy: open `https://article-time.de/` in a fresh browser tab → DevTools → Elements panel → expand `<head>` → confirm the new `<link rel="webmention" href="https://webmention.io/article-time.de/webmention" />` is rendered.
  - [ ] Run the webmention.rocks test (per AC #3 task above) and confirm the mention reaches the webmention.io dashboard.
  - [ ] **No CSP violations:** DevTools → Console → confirm zero CSP violations (the `<link>` tag itself shouldn't trigger any; this is a defensive check that the rendered HTML is intact).

- [ ] **Documentation**
  - [ ] Add inline code comment in `head.html` referencing this story (already included in the snippet above: `{{- /* Webmention endpoint — Story 2.3 (FR-011). ... */}}`).
  - [ ] Document in completion notes: the chosen IndieAuth path (option a GitHub OAuth or option b `rel="me"`), the GitHub Secret name (`WEBMENTION_IO_TOKEN`), and any deviations from the recommended path.
  - [ ] **OR** add a one-paragraph subsection to `docs/3-implementation/phase-0-task-breakdown.md` under "Phase 1A Stories Complete" — confirming webmention reception is live, noting webmention.io account email and the GitHub Secret name. Pick whichever has lowest friction at implementation time.

## Dev Notes

### Architectural Context

Story 2.3 is the **third implementation story of Epic 2** (Engagement Infrastructure) and the lightest in the epic alongside Story 2.1 (both 0.5-day effort). It establishes the **federated engagement foundation** that Story 2.4 (Webmention Display Component) reads from and Story 3.2 (Webmention Processing Script) fetches from. This story's value is mostly **enabling**: nothing visible changes for readers (the `<link rel="webmention">` is HTML metadata, not user-facing UI), but every downstream story in Epic 2 (display) and Epic 3 (processing/scoring) that touches webmention data assumes the link tag is live and the webmention.io account is verified.

**Dataflow this story enables:**

```
External blog → IndieWeb webmention sender → webmention.io endpoint
                                                    │
                          (article-time.de's <link rel="webmention"> tells
                           senders WHERE to deliver the webmention)
                                                    ↓
                          Mention stored at webmention.io for article-time.de
                                                    │
                          (24h later, Story 3.2's script fetches via API)
                                                    ↓
                          data/webmentions_raw.json → process → data/webmentions_by_article.json
                                                    │
                                                    ↓
                          Story 2.4's webmention display partial reads and renders
```

Until Stories 3.2 and 2.4 land, mentions sit in webmention.io's dashboard but do not appear on the live site. This is expected and not a defect of this story. AC #3's success criterion is "test mention appears in **webmention.io dashboard**" — NOT "appears on the live site". The latter is gated on Stories 2.4 and 3.2.

**Why webmention.io (not self-hosted, not Bridgy alone):**

- webmention.io is the canonical IndieWeb webmention receiver — Aaron Parecki (the maintainer) is the IndieWeb spec editor; the service has run continuously since 2014.
- FREE, no rate limits, no auth required for the public read API (`mentions.jf2?domain=...`).
- Self-hosting a webmention receiver requires running a server with public HTTPS — this project is JAMstack on GitHub Pages and has no server runtime.
- Bridgy (https://brid.gy) is complementary, not alternative — Bridgy bridges Mastodon/Twitter replies INTO webmentions, which are then received by webmention.io. Both are needed for the full federation; this story sets up webmention.io (the receiver), Bridgy integration is implicit (webmention.io accepts webmentions from any source, Bridgy included) and does not require separate signup for receiving.
- Decision locked at architecture phase: `digital-garden-integration-architecture.md` lines 192–195 list "webmention.io" as the External Service of choice for "Federated webmention receiving".

[Source: docs/2-solutioning/digital-garden-integration-architecture.md (lines 13–18) — Architectural principles: privacy-first engagement = anonymous hearts (Umami) + federated webmentions (IndieWeb)]
[Source: docs/2-solutioning/digital-garden-integration-architecture.md (lines 192–195) — External Services Inventory: webmention.io, public API, no auth, FREE]
[Source: docs/2-solutioning/digital-garden-integration-architecture.md (lines 234–248) — webmention.io API call signature]
[Source: docs/2-solutioning/digital-garden-integration-architecture.md (lines 250–294) — Daily Rebuild Data Flow showing webmention.io role]

### Implementation: Plain HTML `<link>` Tag, No Hugo Magic

The webmention discovery mechanism is a single `<link rel="webmention" href="...">` tag in `<head>`. No JavaScript, no template variables, no config block, no Hugo data file — just an HTML metadata tag. This is the simplest possible Hugo template change in the entire Phase 1A backlog.

**Why no `hugo.IsProduction` gate:** unlike Story 2.1's Umami script (which makes runtime calls to `cloud.umami.is`, hence the prod-only gate to keep dev pageviews out of analytics), the webmention `<link>` is **discovery metadata only** — webmention senders only ever consume the production HTML at `https://article-time.de/`, not localhost. Emitting it in dev is harmless and adds zero overhead.

**Why no `params.yaml` block:** unlike Umami (where `website_id` is configured for portability), the webmention.io endpoint URL `https://webmention.io/article-time.de/webmention` is a one-time hardcoded value tied to the production domain. The site is single-tenant; the URL never varies. If the project ever multi-tenants or migrates to a self-hosted webmention receiver, refactoring to a `webmention:` config block is a 5-minute follow-up. **Decision documented in AC Source & Reconciliation Note above.**

[Source: layouts/_partials/_base/head.html (lines 47–49) — RSS link block, insertion-adjacent point]
[Source: docs/sprint-artifacts/epic-2/2-1-umami-analytics-integration.md — Story 2.1 Umami pattern (config block + prod gate); this story differs by NOT needing either]

### IndieAuth Signup Flow — Practical Notes

webmention.io uses IndieAuth for account creation. IndieAuth is a decentralized authentication protocol that lets you sign in with your domain, using existing identity providers (GitHub, Mastodon, email, etc.) as proof. The signup flow expects either:

1. **`rel="me"` links on the production site** pointing to verified profiles (e.g., `<link rel="me" href="https://github.com/AngelCrawford" />`). The site claims ownership of the GitHub identity, and webmention.io trusts the GitHub OAuth response.
2. **OAuth fallback via GitHub directly** — webmention.io's signup page allows direct GitHub sign-in if the GitHub user has admin rights to the claimed domain (verified via DNS or repo metadata).

**Reality check:** the current `head.html` does NOT emit any `rel="me"` links. This is a minor gap in IndieWeb best practices — webmention.io is the immediate consumer, but other IndieWeb services (microformats parsers, h-card discovery) also benefit from `rel="me"` links. **For this story:** if IndieAuth requires the link, add `<link rel="me" href="https://github.com/AngelCrawford" />` to `head.html` as part of Task #2 ("Add `<link rel=webmention>` tag"). It's a 1-line addition adjacent to the webmention link and unblocks AC #2 without significantly expanding scope. Document the addition in completion notes.

**Alternative:** a future story (e.g., Epic 9 polish) can add a comprehensive `rel="me"` link set (Mastodon, Threads, GitHub, email) when the site's social-link infrastructure (Story 9.10 author-box, Story 9.12 social-follow-row) is built. This story does the **minimum** to enable webmention.io signup.

[Source: https://indieweb.org/IndieAuth — IndieAuth protocol overview]
[Source: https://webmention.io — webmention.io signup flow]

### API Token Storage — Why Now, Not Story 3.2

AC #4 says "Webmention.io API token stored in GitHub Secrets". The token is **not used by any code in this story** — Story 3.2's `scripts/process-webmentions.js` is the first consumer (and even then, only if it switches from the public anonymous API `mentions.jf2?domain=...` to an authenticated endpoint, which the architecture does not currently require — see `digital-garden-integration-architecture.md` lines 974–998: "Authentication: None (public API)").

**Why store it now:**

1. **Epics AC verbatim** — the AC explicitly says "stored in GitHub Secrets" as part of Story 2.3.
2. **Pre-positioning** — when Story 3.2 lands, the dev opens `daily-rebuild.yml`, references `${{ secrets.WEBMENTION_IO_TOKEN }}`, and ships. No "wait, where's the token?" detour. This matches the pattern Phase 0 Task 1.2 used for `UMAMI_API_KEY` (stored before Story 3.1 needed it).
3. **Future-proof against API changes** — webmention.io may introduce auth requirements for high-volume queries or new endpoints (e.g., the `feed.jf2` endpoint already supports `?token=` for filtering). Pre-stored token = pre-resilient.

**Naming:** `WEBMENTION_IO_TOKEN` matches the existing `UMAMI_API_KEY` and `UMAMI_WEBSITE_ID` convention. The architecture doc does not prescribe a name. If Story 3.2 chooses a different name later, GitHub repo Settings → Secrets allows trivial rename.

[Source: docs/2-solutioning/digital-garden-integration-architecture.md (lines 974–998) — webmention.io public API, no auth]
[Source: docs/3-implementation/phase-0-task-breakdown.md (Task 1.2, lines 65–88) — pattern: pre-store secrets before consuming stories]

### Privacy Policy: Add Section Now, Story 2.5 Integrates Later

AC #5 explicitly requires the privacy policy to explain webmentions. Story 2.5 (Privacy Policy Page) is the dedicated story for a full privacy-policy refresh (Umami + hearts + webmentions + GDPR rights + contact). **Decision:** add the Webmentions section in this story, let Story 2.5 integrate/expand as part of the broader refresh.

**Rationale (versus deferring entirely to 2.5):**

- AC #5 verbatim says "Documentation added to privacy policy" — deferring leaves the AC unsatisfied at the time AC #3's test webmention is received, creating a doc/legal gap visible to GDPR-conscious EU readers.
- The Umami section was deferred from Story 2.1 to Story 2.5 because Umami events are anonymous and cookieless, and the gap was lower-stakes (cookieless analytics is permissible without explicit policy disclosure in most EU jurisdictions). Webmentions are different: they involve **third-party data** (sender's name, URL, avatar) being **publicly displayed** on the site — this requires explicit GDPR disclosure of legal basis (Art. 6 Abs. 1 lit. f) and processor (webmention.io / Aaron Parecki).
- The added section is in German to match the existing `datenschutz.md` voice (informal "Du") and structure. Story 2.5 can rephrase for consistency with Umami/hearts sections without losing substance.

**What Story 2.5 will do:**

- Add Umami section (deferred from Story 2.1).
- Add Heart Events section (deferred from Story 2.2).
- Refresh and integrate the Webmentions section added in this story.
- Add explicit GDPR rights enumeration (Auskunft, Löschung, Widerspruch, Datenportabilität).
- Add a "Stand:" / "Last updated:" date line.
- Possibly restructure section ordering for thematic grouping.

[Source: docs/3-implementation/phase-0-task-breakdown.md (Task 5.1, lines 703–715) — Privacy policy gap analysis: Umami + hearts + webmentions sections needed for Phase 1A]
[Source: docs/sprint-artifacts/epic-2/2-1-umami-analytics-integration.md#Tasks (privacy-policy-stub-coordination) — Story 2.1 deferral pattern]
[Source: docs/sprint-artifacts/epic-2/2-2-heart-button-component.md (Out of Scope section) — Story 2.2 deferral pattern]
[Source: docs/1-planning/epics.md (lines 332–353) — Story 2.5 Privacy Policy Page scope]

### CSP Already Covers webmention.io (Phase 0)

Phase 0 Task 4.0 added `https://webmention.io` to `csp.connectsrc` in `config/_default/params.yaml` line 29:

```yaml
connectsrc: ["'self'", "https://cloud.umami.is", "https://webmention.io"]
```

**This story does NOT need to modify CSP.** AC #6 is a regression guard, not a change. Note the asymmetry vs. Story 2.1: Umami's runtime XHR to `cloud.umami.is/api/send` requires `connect-src` to include `cloud.umami.is`. Webmentions are different:

- The `<link rel="webmention">` tag is **HTML metadata** — no CSP directive applies. The browser does not fetch anything based on this link.
- Outgoing webmentions (this site sending mentions when you publish content with external links) would use `fetch()` or XHR from the build pipeline (server-side), NOT the browser — so CSP does not apply.
- Incoming webmentions are received **server-side** by webmention.io, never by article-time.de's HTML.

The pre-existing `connect-src` entry for `https://webmention.io` covers two future scenarios:

- Story 2.4 (Webmention Display) **if** it makes any client-side fetch to webmention.io's API for refresh/lazy-load (currently the architecture says no — it reads from `data/webmentions_by_article.json` baked at build time).
- Story 3.2's processing script if it ever needs to be moved to a serverless/edge function (out of project scope).

[Source: config/_default/params.yaml (line 29) — current CSP `connect-src`]
[Source: docs/3-implementation/phase-0-task-breakdown.md (Task 4.0, lines 379–414) — CSP fix history]
[Source: docs/2-solutioning/digital-garden-integration-architecture.md (lines 974–998) — webmention.io API: server-side calls only]

### File Map (planned changes)

**MODIFY:**
- `layouts/_partials/_base/head.html` — add 2-line block (`{{- /* … */}}` comment + `<link rel="webmention">`) just before `</head>` (after RSS link block)
- `content/pages/datenschutz.md` — add `## Webmentions` section after `## Spotify` (German, ~30 lines including subheaders)

**EXPLICITLY UNCHANGED:**
- `layouts/baseof.html` — no edits; partial inclusion at line 3 already routes through `head.html`
- `config/_default/params.yaml` — no edits; CSP already includes `webmention.io` (Phase 0 Task 4.0)
- `archetypes/*` — no frontmatter changes (webmentions are received per-URL, not per-content)
- `assets/js/*`, `assets/scss/*` — no JS/SCSS changes (this story is pure HTML metadata + config)
- `data/*.json` — no data file changes (the webmention data files come from Story 3.2, not this story)
- `.github/workflows/daily-rebuild.yml` — no edits in this story (Story 3.2 wires `WEBMENTION_IO_TOKEN` into the workflow)

**NEW:**
- *(none — pure config + template + content edits)*

**EXTERNAL (non-code) actions:**
- webmention.io account creation + IndieAuth verification for `article-time.de`
- GitHub repo Settings → Secrets: add `WEBMENTION_IO_TOKEN`
- Manual test webmention from webmention.rocks → verify in webmention.io dashboard

### Critical Agent Rules (apply to this story)

From `digital-garden-integration-architecture.md` lines 762–771 and project conventions:

1. **Hugo v0.146+ flat layouts** — no `_default/` subdirectory. Files: `layouts/baseof.html`, `layouts/_partials/_base/head.html`. Do NOT create `layouts/_default/baseof.html`.
2. **No new npm dependencies.** This story is pure HTML + config + content — zero JS/Node changes.
3. **CSP allow-list discipline.** Adding any new third-party host requires CSP `script-src` and (for runtime XHR) `connect-src` entries. Phase 0 already did this for webmention.io. Future engagement integrations (Bridgy, Mastodon API) will need the same pattern.
4. **No frontmatter pollution.** Webmention reception is a site-wide concern — do NOT add per-article frontmatter (e.g., `webmention_endpoint: ...`). The `<link>` is rendered identically for every page from `head.html`.
5. **Privacy-policy disclosure for any third-party data processor.** webmention.io is a third-party processor of public engagement data — explicit GDPR Art. 6 Abs. 1 lit. f disclosure is required (not optional).

[Source: docs/2-solutioning/digital-garden-integration-architecture.md (lines 762–771) — Critical Agent Rules]
[Source: layouts/baseof.html — flat-layout convention]

### Project Structure Notes

- **No new files** in `layouts/`, `assets/`, `content/`, or `tests/` — this story is exclusively two file edits (`head.html` template, `datenschutz.md` content).
- **Test infrastructure:** Stories 1.1 and onward bootstrap `tests/build/` (node test runner) and `tests/e2e/` (Playwright). At time of drafting, those directories do not exist (Story 1.1 status: `ready-for-dev`). **If Story 1.1 has landed when this story is implemented:** add one assertion to `tests/build/build-smoke.test.mjs` confirming the production HTML output contains `rel="webmention"` and the value matches the expected URL. **If Story 1.1 has NOT landed:** rely on the manual smoke + webmention.rocks end-to-end test. Do NOT block on Story 1.1 — manual smoke is sufficient for a 0.5-day story.
- **No SCSS, no JS bundle changes** — webmention discovery is pure HTML metadata.

[Source: docs/sprint-artifacts/epic-1/1-1-growth-stage-frontmatter-field.md (test infra layout — `ready-for-dev`, not landed yet)]
[Source: docs/sprint-artifacts/epic-2/2-1-umami-analytics-integration.md#Project-Structure-Notes (test layering convention)]

### Test Strategy

Lightweight, matching the 0.5-day scope:

- **Manual smoke (primary)** — DevTools Elements panel verification of the `<link rel="webmention">` tag + webmention.rocks end-to-end test + webmention.io dashboard verification. Cannot be automated cheaply: AC #2 (account verified) and AC #3 (test mention received) require external SaaS interaction; AC #4 (GitHub Secret stored) is a one-time configuration outside CI.
- **Production build assertion (optional automation)** — if Story 1.1's `tests/build/build-smoke.test.mjs` is in place, add one `node:test` assertion that runs `hugo --environment production`, reads `public/index.html`, and asserts `<link rel="webmention" href="https://webmention.io/article-time.de/webmention" />` is present. Total addition: ~5 lines of test code.
- **No Playwright e2e** — visiting the live site to assert the link tag is doable but has poor cost/value at this scope.
- **No axe-core** — the webmention link is invisible to readers; no a11y surface.
- **No CSP test** — pre-existing `connect-src` allowance was already validated by Phase 0 Task 4.0; AC #6 is a one-time grep regression check, not an automated test.

[Source: docs/2-solutioning/test-design-system.md — test architecture (smoke + Playwright + axe-core)]
[Source: docs/sprint-artifacts/epic-2/2-1-umami-analytics-integration.md#Test-Strategy — established lightweight test pattern for 0.5-day Epic 2 stories]

### Learnings from Previous Story

**Per the create-story workflow:** the previous story in sprint order is `2-2-heart-button-component` (status: `ready-for-dev`, not yet implemented — workflow rule treats anything below `in-progress`/`review`/`done` as `"Previous story not yet implemented"`). All Epic 1 stories (1.1 → 1.5) are `ready-for-dev`; Story 2.1 is `ready-for-dev`; Story 2.2 is `ready-for-dev`. None has reached `done` or `review`, so no implementation learnings exist to forward.

**Cross-epic / sibling-draft patterns to reuse (relevant to this story):**

- **`hugo.IsProduction` gate selectivity (from Story 2.1 + 2.2 drafts)** — Stories 2.1 (Umami) and 2.2 (Heart Button) gate runtime third-party calls on `hugo.IsProduction`. **This story differs:** the `<link rel="webmention">` is HTML metadata, not a runtime fetch — no gate needed. The pattern's principle is "gate calls-home, not metadata"; applied here, the answer is "don't gate".
- **CSP discipline (from Phase 0 + Story 2.1 + Story 2.2 drafts)** — `webmention.io` is already in `csp.connectsrc` (line 29 of `params.yaml`); this story does NOT modify CSP. AC #6 is a regression guard, mirroring Story 2.1 AC #7 and Story 2.2 AC #8.
- **`_base/` partials convention (from Stories 1.3, 1.4, 1.5, 2.1)** — head content lives in `layouts/_partials/_base/head.html`, included from `baseof.html`. This story edits the existing partial, no new file. Reconciliation of epics-AC wording ("added to `<head>`") with project layout (`head.html` partial) follows Story 2.1's pattern verbatim.
- **AC source separation (from Stories 2.1, 2.2 drafts)** — ACs from epics.md verbatim are clearly labeled; testability/regression guards are added below and tagged as such. This story follows: ACs 1–5 from epics, ACs 6–8 as guards.
- **Privacy-policy deferral vs. inline addition (from Stories 2.1, 2.2 drafts)** — Story 2.1 deferred Umami's policy update entirely to Story 2.5; Story 2.2 implicitly deferred hearts likewise. **This story differs:** AC #5 is explicit and substantive (third-party processor disclosure), so the section is added inline. The reason for divergence is documented in "Privacy Policy: Add Section Now, Story 2.5 Integrates Later" above.
- **Pre-stored secrets pattern (from Phase 0 Task 1.2)** — UMAMI_API_KEY was added to GitHub Secrets in Phase 0 before any story consumed it (Story 3.1 is the first consumer). This story mirrors that pattern: WEBMENTION_IO_TOKEN is stored now, consumed by Story 3.2 later.
- **External-account setup as a story task (precedent: Phase 0 Task 1.1 Umami)** — Phase 0 Task 1.1 created the Umami Cloud account before Story 2.1 needed it. **This story differs:** webmention.io account creation is **inside** Story 2.3 (per AC #2) rather than in a Phase 0 pre-task. The split is per the epics breakdown — webmention.io was not flagged as Phase 0 prerequisite, only "Phase 0 (webmention.io account setup)" is mentioned in the story's Prerequisites field. Treat it as a within-story task; if the account turns out to need additional `rel="me"` setup (see IndieAuth notes above), that minor expansion is in scope.

**Pending review items (from previous stories):** None. No story in the project has reached `review` status yet, so no Senior Developer Review sections exist to forward.

[Source: docs/sprint-artifacts/sprint-status.yaml — current development_status (1-1 → 1-5 in epic-1 are ready-for-dev; 2-1 is ready-for-dev; 2-2 is drafted; 2-3 was the next backlog story, now drafted)]
[Source: docs/sprint-artifacts/epic-2/2-1-umami-analytics-integration.md — sibling story; establishes Umami signup-as-Phase-0 pattern, CSP regression guard pattern, AC source separation]
[Source: docs/sprint-artifacts/epic-2/2-2-heart-button-component.md — sibling story; establishes Umami-events-consumption pattern, privacy-policy deferral pattern]
[Source: docs/sprint-artifacts/epic-1/1-5-withered-seo-rss-inclusion.md — pattern: capture sibling-story context even when none has been implemented]

### Out of Scope (deferred elsewhere)

- **Webmention display partial** — Story 2.4 (`_partials/widgets/webmentions.html`). Reads from `data/webmentions_by_article.json` (built by Story 3.2).
- **Webmention processing script** — Story 3.2 (`scripts/process-webmentions.js`). Fetches from webmention.io API via `mentions.jf2?domain=...`, groups by target URL.
- **Webmention count for popularity scoring** — Story 3.3 (Popularity Score Calculation). Consumes `data/webmentions_by_article.json` for the `(hearts × 1) + (webmentions × 3) + (weight × 2)` formula.
- **Bridgy integration for Mastodon/Twitter replies** — implicit via webmention.io (Bridgy sends webmentions to webmention.io); no separate signup needed in this project. Bridgy's setup is documented in IndieWeb wiki and is out of project scope unless a future story explicitly requires it.
- **Outgoing webmentions** (sending mentions when publishing articles that link to other sites) — possible future enhancement, NOT in epics.md. Could be a Phase 2 polish story or Epic 7's POSSE responsibility.
- **`rel="me"` links for full IndieWeb identity** — minimum viable `rel="me"` (one link to GitHub) may be needed for IndieAuth signup (see IndieAuth notes above). Comprehensive `rel="me"` set (Mastodon, Threads, GitHub, email) is Story 9.10 (author-box) or Story 9.12 (social-follow-row).
- **Pingbacks / Trackbacks** — legacy comment protocols, deprecated/spammy. Webmentions are the modern replacement. Not in scope.
- **Comment system** — explicitly replaced by webmentions (per `prd/03a-functional-requirements.md` line 399: "Comment system (using webmentions instead)"). No native comments will be added.
- **Self-hosted webmention receiver** — out of scope. Decision locked: webmention.io (managed service).
- **Webmention spam filtering** — webmention.io handles basic spam filtering server-side. Project-side filtering is out of scope unless a problem emerges in production.
- **Privacy-policy "Stand:"/last-updated line** — Story 2.5 owns this as part of the broader refresh.

### References

- [Source: docs/1-planning/epics.md (lines 278–299)] — Story 2.3 ACs (five ACs verbatim, FR-011 coverage, GitHub Issue #145)
- [Source: docs/1-planning/prd/03a-functional-requirements.md (lines 86–96)] — FR-011 (Webmention Reception), FR-012 (Webmention Display — out of scope for this story)
- [Source: docs/1-planning/prd/05-technical-architecture.md (Tech Stack: Engagement = webmention.io)] — engagement infrastructure decisions
- [Source: docs/2-solutioning/architecture.md] — base architecture (Hugo, Bulma, JAMstack, build pipeline)
- [Source: docs/2-solutioning/digital-garden-integration-architecture.md (lines 13–18)] — Architectural principles (privacy-first engagement)
- [Source: docs/2-solutioning/digital-garden-integration-architecture.md (lines 192–195)] — External Services Inventory (webmention.io, public API, FREE)
- [Source: docs/2-solutioning/digital-garden-integration-architecture.md (lines 234–248)] — webmention.io API call signature
- [Source: docs/2-solutioning/digital-garden-integration-architecture.md (lines 250–294)] — Daily Rebuild Data Flow (this story's role: site-side discovery enabling)
- [Source: docs/2-solutioning/digital-garden-integration-architecture.md (lines 414–432)] — Pattern 2: Dual Anonymous Engagement System (hearts + webmentions)
- [Source: docs/2-solutioning/digital-garden-integration-architecture.md (lines 762–771)] — Critical Agent Rules
- [Source: docs/2-solutioning/digital-garden-integration-architecture.md (lines 974–998)] — webmention.io API spec
- [Source: docs/2-solutioning/digital-garden-integration-architecture.md (line 1519)] — Implementation Checklist: webmention.io account created for article-time.de
- [Source: docs/3-implementation/phase-0-task-breakdown.md (Task 4.0, lines 379–414)] — CSP `connect-src` includes `https://webmention.io`
- [Source: docs/3-implementation/phase-0-task-breakdown.md (Task 5.1, lines 703–715)] — Privacy-policy gap: webmentions section needed for Phase 1A
- [Source: docs/sprint-artifacts/epic-2/2-1-umami-analytics-integration.md] — sibling story; establishes Umami account/signup pattern, head.html edit pattern, CSP regression guard pattern
- [Source: docs/sprint-artifacts/epic-2/2-2-heart-button-component.md] — sibling story; consumes Umami events; privacy-policy deferral pattern
- [Source: layouts/_partials/_base/head.html (lines 47–49)] — RSS link block (insertion-adjacent point for the webmention link)
- [Source: layouts/baseof.html (line 3)] — `{{ partial "_base/head" . }}` (head partial inclusion)
- [Source: config/_default/params.yaml (line 29)] — CSP `connect-src` includes `https://webmention.io` (regression guard target)
- [Source: content/pages/datenschutz.md] — privacy policy (Webmentions section addition target)
- [https://webmention.io/](https://webmention.io/) — webmention.io homepage and signup
- [https://webmention.rocks/](https://webmention.rocks/) — Aaron Parecki's webmention test endpoint (AC #3 verification)
- [https://indieweb.org/Webmention](https://indieweb.org/Webmention) — IndieWeb wiki: webmention protocol overview
- [https://indieweb.org/IndieAuth](https://indieweb.org/IndieAuth) — IndieAuth protocol (used by webmention.io signup)
- [W3C Webmention Recommendation](https://www.w3.org/TR/webmention/) — official spec (reference, not load-bearing)

## Dev Agent Record

### Context Reference

- docs/sprint-artifacts/epic-2/2-3-webmention-endpoint-setup.context.xml

### Agent Model Used

claude-opus-4-7[1m]

### Debug Log References

### Completion Notes List

### File List

## Change Log

| Date | Change | Author |
|---|---|---|
| 2026-05-06 | Initial draft created from `epics.md` Story 2.3 (FR-011, GitHub Issue #145), `prd/03a-functional-requirements.md` (FR-011 Webmention Reception), `digital-garden-integration-architecture.md` (External Services Inventory: webmention.io public API; Pattern 2 Dual Anonymous Engagement; Daily Rebuild Data Flow; Critical Agent Rules; Implementation Checklist line 1519), and `phase-0-task-breakdown.md` (CSP `connect-src` includes `webmention.io` from Task 4.0; privacy-policy gap analysis from Task 5.1). Reconciled epics AC #1 ("added to `<head>`") with project convention (`head.html` partial); both render identically (same reconciliation as Story 2.1). ACs 1–5 verbatim from epics; ACs 6–8 added as testability/regression guards (CSP regression, byte-equivalent unchanged head emit, clean prod build). Hardcoded webmention.io URL in partial flagged as deliberate over a `params.yaml` config block (single-tenant project, never varies; refactor to config is a 5-min follow-up if needed). No `hugo.IsProduction` gate (HTML metadata, not runtime call — differs from Story 2.1's Umami script which IS gated). IndieAuth signup flow documented with two paths (option a GitHub OAuth, option b add `rel="me"` to head); option a recommended; if option b is needed the 1-line `<link rel="me">` addition is flagged as in-scope to unblock AC #2. Privacy-policy section (`## Webmentions` German content, ~30 lines) added directly in this story rather than deferred to Story 2.5 (rationale: AC #5 verbatim text + GDPR Art. 6 Abs. 1 lit. f disclosure obligation for third-party processor processing public-facing data; differs from Story 2.1's Umami section which was deferred to Story 2.5 because cookieless analytics is lower-stakes). API token (`WEBMENTION_IO_TOKEN`) pre-stored in GitHub Secrets per AC #4 verbatim, even though Story 3.2's public API endpoint does not require auth — pre-positioning matches Phase 0 Task 1.2 pattern and is forward-resilient against API changes. Test strategy lightweight (manual DevTools + webmention.rocks end-to-end + webmention.io dashboard) given 0.5-day scope; one optional `tests/build/build-smoke.test.mjs` assertion if Story 1.1 has landed by implementation time. | SM (create-story workflow) |
