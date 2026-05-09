# Engineering Backlog

This backlog collects cross-cutting or future action items that emerge from reviews and planning.

Routing guidance:

- Use this file for non-urgent optimizations, refactors, or follow-ups that span multiple stories/epics.
- Must-fix items to ship a story belong in that story's `Tasks / Subtasks`.
- Same-epic improvements may also be captured under the epic Tech Spec `Post-Review Follow-ups` section.
- Items routed to a not-yet-drafted future story belong in `docs/1-planning/epics.md` under that story as a **Pre-Spec Notes** entry — not here.
- **Done items are pruned, not preserved** — git log and GitHub PRs/issues are the historical record.

| Date | Story | Type | Status | Notes |
| ---- | ----- | ---- | ------ | ----- |
| 2026-05-09 | 2.5 | Tech-Debt | Open | **Impressum-Refresh nachziehen zu Datenschutz:** `content/pages/impressum.md` Email-Obfuskation (`<span class="ltrText/addSeparatorAt/addSeparatorDot/removeText">` mit HTML-Kommentaren) ist funktional defekt — kein Decoder-JS oder -CSS im Repo, rendert als Gibberish (`e d drofwarc-legna lREMOVE_ME!iam`). Außerdem inhaltlich obsolet: "ich speicher keine Daten" / "Verwende keinen Google Analytics Dienst" sind durch Hearts (Umami-Events) + Webmentions-Empfang in 2.5 redundant bzw. nicht mehr ganz akkurat. Optionen: (a) Decoder als shared partial mit datenschutz.md ergänzen, (b) auf [at]/[dot]-Fallback umstellen wie 2.5, (c) Impressum-Mini-Refresh-Story scoped (~30 min). Email-Ziel beachten: `mail@article-time.de` (siehe Memory `project_site_contact_email.md`). |
| 2026-05-09 | 2.4 | Privacy | Deferred | Datenschutz drops "personenbezogenen Daten" catch-all — new text only disclaims IP/Cookies; author names, URLs, and photos are personal data under DSGVO that the site processes and displays. Story 2.5 should restore an equivalent catch-all or list what is processed. |
| 2026-05-09 | 2.4 | Test | Deferred | Hardcoded slugs `rss-test` / `movie-test` in Story 2.4 smoke test assertions — renaming either article silently breaks the tests; consider dynamic slug lookup. |
| 2026-05-09 | 2.4 | Test | Deferred | AC #8 XSS smoke test validates only clean fixture data (no HTML payloads); the test cannot confirm Hugo auto-escape is active. Add adversarial fixture entry when Playwright is set up (Story 3.2 / Epic 9). |
| 2026-05-09 | 2.4 | Arch | Deferred | RelPermalink key mismatch risk — `index .Site.Data.webmentions_by_article .RelPermalink` silently returns nil if Story 3.2's data pipeline emits keys without trailing slash or with different case. Story 3.2 must document and enforce the key format convention. |
| 2026-05-09 | 2.3 | Test | Deferred | No automated test for `rel="me"` presence in head.html — link is explicitly temporary (Pre-Spec Note in epics.md Story 9.12 to remove shim when `params.social`-driven render lands); adding a test now creates churn when 9.12 removes the shim. |
| 2026-05-09 | 2.3 | Test | Deferred | Redundant full `hugo` production builds per test function in build-smoke.test.mjs — each test invokes a full site build independently; pre-existing pattern throughout the file, not introduced by this story. Consider a shared build fixture in a future test-infra cleanup story. |
| 2026-05-09 | 2.2 | Bug | Deferred | Multi-tab double Umami `heart` event: two open tabs on the same article can each fire `umami.track('heart', ...)` independently before `localStorage` disables the second. Inherent SSR+optimistic-UI constraint; acceptable per "hearts are signals not votes" policy. Revisit if Umami event counts appear inflated. |
| 2026-05-09 | 2.2 | UX | Open | **Design für Heart an allen Stellen:** unified visual treatment for the heart across all surfaces — article single page (sidebar pill), article card readonly indicator, log card interactive heart. Current state: single-page is a full pill, both card variants are flat icon+count to match adjacent format icons; no visual distinction between readonly vs interactive on cards. Decide on consistent affordances: how does interactive (log card) differ from readonly (article card)? Sizing/colour parity with surrounding `.formats` icons. Hover/active states on cards. Possibly extend to the `.hearted` post-click state (currently soft-red on the pill, no specific treatment on cards). |
