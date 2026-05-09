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
| 2026-05-09 | 2.2 | Bug | Deferred | Multi-tab double Umami `heart` event: two open tabs on the same article can each fire `umami.track('heart', ...)` independently before `localStorage` disables the second. Inherent SSR+optimistic-UI constraint; acceptable per "hearts are signals not votes" policy. Revisit if Umami event counts appear inflated. |
| 2026-05-09 | 2.2 | UX | Open | **Design für Heart an allen Stellen:** unified visual treatment for the heart across all surfaces — article single page (sidebar pill), article card readonly indicator, log card interactive heart. Current state: single-page is a full pill, both card variants are flat icon+count to match adjacent format icons; no visual distinction between readonly vs interactive on cards. Decide on consistent affordances: how does interactive (log card) differ from readonly (article card)? Sizing/colour parity with surrounding `.formats` icons. Hover/active states on cards. Possibly extend to the `.hearted` post-click state (currently soft-red on the pill, no specific treatment on cards). |
| 2026-05-09 | 2.3 | UX | Open | **Design für Webmentions an allen Stellen:** unified visual treatment for webmention surfaces — article single page (full webmentions section with replies/likes/reposts), article cards (count indicator?), log cards, possibly a homepage-level recent-activity widget. Decide: do cards surface a webmention count at all (parallel to hearts), or are webmentions single-page-only? If shown on cards, how do they differ visually from hearts (icon, position, hover)? How are reply/like/repost types differentiated on the single page (separate sections, mixed timeline, facepile)? Sender avatar treatment (size, fallback, IP-leak disclosure already in privacy policy). Resolve before Story 2.4 (Webmention Display Component) ships. |
