# Story 2.5: Privacy Policy Page

Status: review

## Story

As a reader,
I want to understand what data the site collects and how it is used,
so that I can trust the site respects my privacy and make informed choices about engaging with it.

## Acceptance Criteria

1. **Privacy policy page exists at the canonical project URL.** Implementation **updates the existing German page at `content/pages/datenschutz.md`** (resolved permalink `/pages/datenschutz/`) rather than creating a new page at `/pages/privacy/`. Reconciliation: the site is German-language (matches `impressum.md`, `datenschutz.md`, `ueber-mich/`, footer/header German UI strings); the existing file is already wired into the footer menu (`menu: footer: weight: 20` in frontmatter). Creating a parallel English `/pages/privacy/` slug would (a) duplicate routing, (b) split footer link targets, and (c) break the legacy URL `/pages/datenschutz/` (which crawlers/bookmarks may already reference). Same naming-language reconciliation pattern Story 2.2 used for `aria-label="Diesen Artikel mit einem Herz markieren"` and Story 2.4 used for the section heading `Antworten & Erwähnungen`. The page **must still satisfy** the AC's intent — a discoverable privacy policy at a stable URL accessible from every page.

2. **Policy explains the three engagement data flows: Umami (anonymous analytics), Hearts (Umami event tracking), and Webmentions (federated public engagement).** Each flow gets a dedicated top-level section (`##` heading) covering: what data is collected/received, where it is stored, the third-party processor (if any), the legal basis under DSGVO Art. 6, and how the reader can opt out (browser-level controls for Umami; not sending hearts/webmentions for the others). Section-content baseline:
   - **Umami (`## Anonyme Analyse mit Umami`)**: cookieless pageview tracking via Umami Cloud (`cloud.umami.is`); no IP storage by Umami in cookieless mode (data anonymized at ingestion); processor: Umami Software, Inc.; legal basis: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an Performance-Messung ohne Personenbezug); opt-out: standard `Do Not Track` (Umami honours DNT) and browser-level script blocking. Reference Story 2.1's `params.yaml` umami block.
   - **Hearts (`## Herz-Reaktionen`)**: anonymous click event sent as `umami.track('heart', { article: permalink })`; client-side `localStorage` flag `hearted-${articleUrl}` prevents double-clicks (per-browser, not synced across devices); no personal identifier in the event payload; legal basis: Art. 6 Abs. 1 lit. f DSGVO; opt-out: don't click the heart button; localStorage can be cleared via DevTools or browser settings. Reference Story 2.2's heart-button component.
   - **Webmentions (`## Webmentions`)**: federated cross-site mentions received via webmention.io (operated by Aaron Parecki); publicly visible data (sender URL, author name, avatar if provided, reply text if provided); processor: webmention.io (`https://webmention.io/`); legal basis: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an föderierter Kommunikation); opt-out: don't send webmentions; existing mentions can be removed by emailing the site owner. **Coordination note:** Story 2.3 AC #5 also adds a `## Webmentions` section (drafted-to-implement). If Story 2.3 lands first, this story **integrates and refines** that section (does not duplicate it). If this story lands first, it creates the section per the spec above and Story 2.3 then becomes a no-op for AC #5 — its other ACs unaffected. Scope decision documented in completion notes; same defer-and-integrate pattern Stories 2.1/2.3 used (deferred Umami section to Story 2.5).

3. **Policy explicitly states the privacy posture: zero tracking cookies, no personal data collection, no third-party advertising.** A dedicated top-level section (`## Was diese Seite NICHT tut`) lists these three explicit denials in plain German. Each point cites the underlying decision: zero tracking cookies → Umami cookieless mode (FR-047) + heart button uses Umami events not cookies (architecture lines 1058–1060); no personal data collection → no comment forms, no signup, no newsletter (current site state); no third-party ads → editorial decision, no AdSense/affiliate trackers in the codebase. The section also calls out the **existing third-party data exposures** (server-log via GitHub Pages hosting, embedded YouTube via `youtube-nocookie.com`, webmention sender avatar `<img>` loads from third-party domains per Story 2.4 architecture decision) so readers have a complete picture. Honesty over marketing.

4. **Policy is linked from the footer on every page.** AC satisfied by the existing footer-menu mechanism (`layouts/_partials/_base/footer.html` lines 73–87 render `.Site.Menus.footer` on every layout, and `datenschutz.md` frontmatter already includes `menu: footer: weight: 20`). **No code change needed for AC #4** — verification is a regression check that the rendered HTML on a sample of pages (home, article, log, taxonomy, list) still contains `<a href="/pages/datenschutz/">Datenschutz</a>` (or equivalent rendered URL) inside the footer nav. Should the existing menu wiring break, fix it as part of this story.

5. **Policy includes contact information for privacy questions.** A dedicated section (`## Kontakt für Datenschutzanfragen`) provides an email address obfuscated in the same anti-scraper pattern as `impressum.md` lines 19–24 (split with HTML comments and zero-width separator spans). The address resolves to the site owner's mailbox (`a.scheuer@grvity.de` per `impressum.md` decoded equivalent — verify the email at implementation time; obfuscate identically). The section explicitly mentions the reader's DSGVO rights: Auskunft (Art. 15), Berichtigung (Art. 16), Löschung (Art. 17), Einschränkung der Verarbeitung (Art. 18), Datenübertragbarkeit (Art. 20), Widerspruch (Art. 21), Beschwerderecht bei der zuständigen Aufsichtsbehörde (Art. 77 — already covered by existing `### Beschwerderecht bei der zuständigen Aufsichtsbehörde` section, retain it). Reconciliation: the existing `## Allgemeine Hinweise und Pflichtinformationen` block already partially covers DSGVO rights — this story may either fold it into the new contact section OR retain it and add a "siehe Abschnitt Kontakt" cross-link. Implementer's choice; document in completion notes.

6. **Policy is dated and versioned.** Two new pieces of metadata are added near the top of the page (after the title/intro paragraph):
   - **`Stand: TT.MM.JJJJ`** — human-readable last-update date in German format. Updated each time the policy materially changes. Initial value at implementation: today's date (resolve at edit time, e.g. `Stand: 06. Mai 2026`).
   - **`Version: X.Y`** — semver-style policy version. Initial value: `1.0`. Increment minor for additions (new section), major for deletions/restructuring (rare). The version is a documentation convention, not a runtime value.

   Both fields render as a small caption-style line below the H1, e.g.:
   ```markdown
   *Stand: 06. Mai 2026 · Version: 1.0*
   ```
   Version history is **not** required in-page (the git log of `datenschutz.md` is the audit trail); a single line near the top is sufficient. Adding a `last_updated:` and `policy_version:` field to the frontmatter is also acceptable as long as the rendered page surfaces both values to the reader.

7. **Outdated content is removed.** The existing `## Spotify` section (`datenschutz.md` lines 60–67) refers to embedded Spotify widgets — **but the production codebase no longer contains Spotify embeds** (grep `spotify` in `layouts/`, `assets/`, `content/articles/` returns zero matches; the only matches are in `docs/` planning files and `datenschutz.md` itself). Keeping the section misleads readers about active data flows. **Decision:** remove the Spotify section. If a future story re-introduces Spotify embeds, it can re-add the section with current legal text. Document the removal in completion notes (audit-trail value: a privacy policy edit that *narrows* claims is itself worth flagging in commit history). Same logic applies to any other obsolete sections discovered during the rewrite (e.g. `### Google Analytics und Google Web Fonts` is now a redundant "we don't use these" line that the broader AC #3 section subsumes — fold it into AC #3's `## Was diese Seite NICHT tut` and remove the dedicated subsection).

8. **Page renders cleanly: no markdown errors, no broken anchor links, no Hugo template errors** (testability guard). Build passes (`hugo --quiet --environment production --minify` exits 0); the rendered `public/pages/datenschutz/index.html` exists; all internal `[anchor links](#section)` resolve to existing headings; all external links (`https://webmention.io`, GitHub Pages privacy statement, etc.) return 2xx (manual check — link-rot is real for privacy policies). German typography conventions match neighbours: informal `Du`-form (matching existing `datenschutz.md`, `impressum.md`), proper umlauts (UTF-8), em-dashes for asides (consistent with `impressum.md`). The page **does not regress robots-disallow**: existing frontmatter `params: robotsdisallow: true` stays — a privacy policy page does not need to be in search engine indexes (it's a legal/transparency page, not a content page). Note: `robotsdisallow: true` removes the page from sitemap and adds `<meta name="robots" content="noindex">` per Hugo SEO partial — confirm by checking `public/pages/datenschutz/index.html` after build for the noindex meta.

9. **No regression to other layouts or build outputs** (testability guard). Diff `public/index.html`, `public/articles/<existing-post>/index.html`, `public/pages/impressum/index.html` before and after the change — only the footer's existing `Datenschutz` link remains (now pointing at the same URL — no change), and only `public/pages/datenschutz/index.html` itself is rewritten. Existing card variants, archive pages, RSS feed, and sitemap are byte-equivalent (or equivalent — `<meta>` ordering may shift but content unchanged). Critical agent rule reminder: this story is a content-only edit + a small frontmatter addition + a Spotify section removal; it does **NOT** touch `layouts/`, `assets/`, `data/`, or `config/`. If something outside `content/pages/datenschutz.md` ends up needing a change (e.g., a new partial), pause and document — it's a scope-creep signal.

### AC Source & Reconciliation Note

ACs 1–6 are derived verbatim from `docs/1-planning/epics.md#Story-2.5-Privacy-Policy-Page` (lines 332–354 of `epics.md`). ACs 7–9 are testability/regression guards added by the create-story workflow (cleanup of obsolete content, clean prod build, byte-equivalent unchanged layouts). They are NOT in the original epics list — they exist solely to make ACs 1–6 verifiable and to keep the privacy policy honest about *current* data flows.

**Convention reconciliation (epics AC #1 wording vs. project layout):** Epics AC #1 says `Privacy policy page created at /pages/privacy/`. Project state already has the page at `/pages/datenschutz/` (German-language site convention, footer-menu wired, `robotsdisallow: true` set, `impressum.md` and `ueber-mich/` siblings all use German slugs). **Decision:** update the existing page in place. Rendered effect — a privacy policy at a stable, footer-linked URL — is identical to the AC's intent. Same language reconciliation pattern Story 2.2 / Story 2.4 used for German UI strings overriding English AC text.

**Coordination with Story 2.3 (Webmentions section):** Story 2.3 AC #5 plans to add a `## Webmentions` section to the same file as a prerequisite for webmention reception. Whichever story lands first creates the section; the second story integrates/refines without duplicating. Both stories agree on the German content baseline (Story 2.3's draft section content, lines 100–120 of `2-3-webmention-endpoint-setup.md`). Document the merge order in completion notes.

[Source: docs/1-planning/epics.md#Story-2.5-Privacy-Policy-Page (lines 332–354) — six ACs verbatim, FR-048 coverage, GitHub Issue #49]
[Source: docs/1-planning/prd/03a-functional-requirements.md (lines 336–340) — FR-048 (Privacy Policy Publication): "Privacy policy page exists, explains Umami + webmentions, accessible from footer"]
[Source: docs/1-planning/prd/03a-functional-requirements.md (lines 330–334) — FR-047 (Zero Tracking Cookies) — informs AC #3's posture-statement section]
[Source: docs/1-planning/prd/03a-functional-requirements.md (lines 342–346) — FR-049 (Anonymous Analytics) — informs AC #2's Umami section]
[Source: docs/2-solutioning/digital-garden-integration-architecture.md (lines 1056–1062) — Client-Side Considerations: cookieless analytics, localStorage for hearts, webmention XSS]
[Source: docs/2-solutioning/digital-garden-integration-architecture.md (lines 414–469) — Pattern 2: Dual Anonymous Engagement System — informs AC #2's Hearts and Webmentions sections]
[Source: content/pages/datenschutz.md — current page state, footer-menu wiring (lines 4–6), `robotsdisallow: true` (line 8), informal Du-form, existing structural sections (Allgemeine Hinweise, Beschwerderecht, SSL, Server-Log)]
[Source: content/pages/impressum.md (lines 19–24) — email obfuscation pattern for AC #5's contact section]
[Source: docs/sprint-artifacts/epic-2/2-3-webmention-endpoint-setup.md (Tasks: "Add Webmentions section to privacy policy", lines 96–120) — Webmentions section content baseline (German) for AC #2 coordination]
[Source: docs/sprint-artifacts/epic-2/2-1-umami-analytics-integration.md (Tasks: "Privacy policy stub coordination") — explicit deferral of Umami section to this story]

## Tasks / Subtasks

- [x] **Audit current `content/pages/datenschutz.md` against ACs** (AC: 1, 7) [Source: content/pages/datenschutz.md]
  - [x] Re-read the file in full at implementation time. The page may have been edited by Story 2.3 (Webmentions section addition per its AC #5) between this story's drafting and implementation — reconcile actual current state, not the snapshot in this story's draft.
  - [x] Identify obsolete sections to remove or rewrite:
    - `## Spotify` (lines 60–67 at draft time) — Spotify embeds no longer in codebase (verified by grep). **Action:** remove section entirely.
    - `### Google Analytics und Google Web Fonts` (line 19) — currently a one-liner ("Werden nicht eingebunden oder benutzt"). **Action:** fold into AC #3's `## Was diese Seite NICHT tut` umbrella section; remove the standalone subsection.
    - `## Datenschutz auf einen Blick` (line 11) and `### Datenerfassung auf dieser Website` (lines 14–17) — currently claim "Ich selbst erfasse oder speichere keinerlei Daten oder persönliche Informationen". This statement is now **partially false** (hearts emit Umami events; webmentions are publicly received and displayed). **Action:** rewrite the intro to honestly describe what data flows the site participates in — link to AC #2's three sections for detail.
    - `## Externes Hosting` and `### Github Pages` (lines 22–26) — still accurate. **Action:** retain as-is or lightly refine for tone consistency.
    - `## Allgemeine Hinweise und Pflichtinformationen` and child subsections (lines 28–58) — partially accurate. `### SSL- bzw. TLS-Verschlüsselung`, `### Cookies Widersprechen`, `## Datenerfassung auf dieser Website` → `### Server-Log-Dateien` are still relevant (GitHub Pages still logs access). **Action:** retain with minor copy-edits if needed.
  - [x] Build a section-by-section change manifest before editing. The audit's value is preventing accidental deletion of legally-required content (e.g., the GitHub Pages hosting disclosure, the Beschwerderecht clause).

- [x] **Coordinate with Story 2.3 if its Webmentions section already landed** (AC: 2)
  - [x] If `## Webmentions` section already exists in `datenschutz.md` (Story 2.3's AC #5 implemented before this story): **integrate** — keep the section, refine its position to fit the new structure (Umami first, Hearts second, Webmentions third — chronological by data-flow visibility), check that its German content matches the baseline outlined in this story's AC #2. **Do NOT** duplicate the section.
  - [x] If `## Webmentions` section does NOT exist (Story 2.3 not yet landed, or its AC #5 was deferred): **create** the section per AC #2's baseline content. Story 2.3 will then integrate this story's version when it lands.
  - [x] Document the chosen path in completion notes — important for downstream review and for Story 2.3's developer/reviewer.

- [x] **Rewrite the page intro and add policy metadata line** (AC: 6, 7) [Source: content/pages/datenschutz.md frontmatter and intro]
  - [x] After the existing frontmatter (lines 1–9 of current file — `title`, `type`, `menu`, `params: robotsdisallow: true`), update the intro section to honestly describe the policy's scope. Suggested German rewrite (informal `Du`, matching existing voice):
    ```markdown
    *Stand: TT. Monat JJJJ · Version: 1.0*

    ## Auf einen Blick

    Diese Seite respektiert Deine Privatsphäre — und ist dabei ehrlich darüber, was passiert. Es gibt **keine Tracking-Cookies, keine personalisierte Werbung, keine Newsletter-Anmeldung, kein Kommentarsystem**. Aber drei Dinge wirst Du wissen wollen, weil sie Daten betreffen:

    1. **Umami** — anonyme Seitenaufrufe ohne Cookies (siehe Abschnitt unten).
    2. **Herz-Reaktionen** — Du kannst Artikeln ein Herz geben; das wird als anonymes Event gezählt.
    3. **Webmentions** — wenn andere Seiten auf meine Artikel verweisen, erscheinen diese Erwähnungen öffentlich.

    Im Detail:
    ```
  - [x] Replace `TT. Monat JJJJ` with the actual implementation date in German format (e.g., `06. Mai 2026`).
  - [x] Decide: keep the metadata in the rendered body (`*Stand: ... · Version: ...*`) **or** add `last_updated:` and `policy_version:` fields to frontmatter and render them via a Hugo template. **Recommendation:** keep in body (simplest, AC-satisfying, no template change required). Document the choice in completion notes.

- [x] **Add Umami section** (AC: 2) [Source: docs/2-solutioning/digital-garden-integration-architecture.md (lines 1056–1062) and Story 2.1's `params.yaml` umami block]
  - [x] Add a top-level section `## Anonyme Analyse mit Umami` immediately after the new intro. Suggested baseline content (refine for tone; informal `Du`):
    ```markdown
    ## Anonyme Analyse mit Umami

    Ich nutze [Umami Cloud](https://umami.is) (`cloud.umami.is`), um zu sehen, wie viele Leute meine Artikel lesen — **ohne Cookies, ohne IP-Speicherung, ohne Wiedererkennung über Sitzungen hinweg**.

    **Was wird erfasst?**
    - Seitenaufrufe (anonymisiert, gehasht aus URL + User-Agent + täglich rotierender Salt)
    - Verweisende Seite (Referrer)
    - Browser, Betriebssystem, Bildschirmgröße (grobe Kategorien)
    - Land (über IP, aber die IP selbst wird nicht gespeichert)

    **Was wird NICHT erfasst?**
    - Keine Cookies
    - Keine eindeutige Geräte- oder Nutzer-ID
    - Keine IP-Adressen (in Umamis Cookieless-Modus)
    - Keine Wiedererkennung beim erneuten Besuch

    **Verarbeiter:** Umami Software, Inc. — Datenschutzhinweise: [https://umami.is/docs/legal/privacy](https://umami.is/docs/legal/privacy)

    **Rechtsgrundlage:** Art. 6 Abs. 1 lit. f DSGVO — berechtigtes Interesse an der Performance-Messung der eigenen Website ohne personenbezogenen Daten.

    **Wie kannst Du widersprechen?**
    - Aktiviere `Do Not Track` in Deinem Browser — Umami respektiert das.
    - Blockiere `cloud.umami.is` über Browser-Erweiterungen wie uBlock Origin.
    - Nutze einen Browser, der externe Scripts standardmäßig blockiert.
    ```
  - [x] Verify the URLs in the section resolve (Umami's privacy doc URL — last verified 2026; check at implementation time and update if Umami restructured their docs).

- [x] **Add Hearts section** (AC: 2) [Source: docs/2-solutioning/digital-garden-integration-architecture.md (lines 414–469, 1060) and Story 2.2's heart-button planning]
  - [x] Add a top-level section `## Herz-Reaktionen` after the Umami section. Suggested baseline content:
    ```markdown
    ## Herz-Reaktionen

    Unter jedem Artikel findest Du eine Herz-Schaltfläche. Wenn Du sie anklickst, wird ein anonymes Event über Umami gezählt — kein Login, kein Profil, keine personenbezogenen Daten.

    **Was wird gesendet?**
    - Ein Umami-Event mit dem Namen `heart` und der Artikel-URL als Parameter (z. B. `{ article: "/articles/mein-artikel/" }`).
    - Sonst nichts.

    **Was wird im Browser gespeichert?**
    - Ein Eintrag im `localStorage` Deines Browsers (Schlüssel `hearted-<artikel-url>`), damit Du nicht versehentlich mehrfach klickst.
    - Dieser Eintrag bleibt nur in Deinem Browser, wird nirgendwo synchronisiert.
    - Du kannst ihn über die Browser-Einstellungen (DevTools → Application → Local Storage → Site löschen) jederzeit entfernen.

    **Rechtsgrundlage:** Art. 6 Abs. 1 lit. f DSGVO — berechtigtes Interesse an der Erhebung anonymer Engagement-Signale; keine Identifikation einzelner Lesender möglich.

    **Wie kannst Du widersprechen?** Klicke das Herz nicht. Es gibt keine andere Erfassung.
    ```

- [x] **Document withered-banner sessionStorage (Story 1.4 carry-over)** [Source: assets/js/withered-banner.js, layouts/_partials/withered-banner.html]
  - [x] Add a short subsection (`### Hinweis-Dismiss bei verwelkten Inhalten`) after the Hearts section. Story 1.4 introduced a per-article dismiss button on the withered-content warning banner that writes one entry to `sessionStorage`. Coverage is required by Art. 13 DSGVO transparency obligations even though no consent is needed (§ 25 Abs. 2 Nr. 2 TTDSG: "unbedingt erforderlich" für die vom Nutzer angeforderte Dismiss-Funktion — siehe DSK-Orientierungshilfe Telemedien 2021/2022). Suggested baseline content (informal `Du`):
    ```markdown
    ### Hinweis-Dismiss bei verwelkten Inhalten

    Auf als „verwelkt" (deprecated) markierten Artikelseiten erscheint oben ein gelber Warnhinweis. Wenn Du auf das ✕ klickst, merkt sich Dein Browser **nur für die aktuelle Sitzung**, dass dieser eine Hinweis ausgeblendet bleiben soll.

    **Was wird gespeichert?**
    - Ein Eintrag im `sessionStorage` Deines Browsers, Schlüssel `withered-banner-dismissed:<artikel-pfad>`, Wert `1`.
    - Pro Artikel ein eigener Eintrag (das Ausblenden auf einem verwelkten Artikel betrifft keine anderen).

    **Wie lange bleibt das gespeichert?** Bis Du den Tab schließt — `sessionStorage` wird vom Browser automatisch gelöscht, anders als `localStorage` oder Cookies. Beim nächsten Besuch erscheint der Hinweis wieder.

    **Was wird übertragen?** Nichts. Der Eintrag verlässt Deinen Browser nicht.

    **Rechtsgrundlage:** § 25 Abs. 2 Nr. 2 TTDSG — technisch erforderlich, um die von Dir per Klick angeforderte Dismiss-Funktion umzusetzen. Keine Einwilligung nötig.
    ```
  - [x] Position this subsection AFTER the Hearts section (`## Herz-Reaktionen`) and BEFORE the Webmentions section (`## Webmentions`) so the policy reads in order of: pageview tracking → user action with persistence → UI preference with persistence → federated data exchange. Use `###` (subsection under an implicit "Browser-Speicher" umbrella) rather than a top-level `##` because it's a UI preference, not a data flow worth top-level treatment.
  - [x] Cross-reference: AC #3's "Was diese Seite NICHT tut" mentions `localStorage` for hearts. Extend that line to also mention `sessionStorage` for the withered-banner dismiss so the umbrella claim stays accurate. Suggested rewrite of the relevant bullet: "**Keine Tracking-Cookies.** Umami arbeitet im Cookieless-Modus. Hearts werden im `localStorage` markiert, der Withered-Hinweis-Dismiss im `sessionStorage` (sitzungsweise, kein Cookie). Webmentions sind serverseitig, kein Browser-Storage."

- [x] **Add or integrate Webmentions section** (AC: 2) [Source: docs/sprint-artifacts/epic-2/2-3-webmention-endpoint-setup.md (lines 100–120) — baseline content from Story 2.3]
  - [x] If Story 2.3's Webmentions section is already in the file, integrate it into the new structure (move it to follow Hearts; verify content matches baseline below). Otherwise, add the section verbatim (baseline from Story 2.3's draft, lightly adapted):
    ```markdown
    ## Webmentions

    Diese Website empfängt **Webmentions** über den Dienst [webmention.io](https://webmention.io) (betrieben von Aaron Parecki). Webmentions sind ein offener IndieWeb-Standard für föderierte Erwähnungen und Antworten zwischen Websites — vergleichbar mit Trackbacks/Pingbacks, aber moderner und spamresistenter.

    **Welche Daten werden empfangen?**

    Wenn eine andere Website auf einen meiner Artikel verweist und eine Webmention sendet, werden folgende Informationen öffentlich auf meiner Seite sichtbar:

    - URL der verweisenden Seite (Quell-URL)
    - Autorenname (sofern von der sendenden Seite bereitgestellt)
    - Avatar-Bild des Autors (sofern bereitgestellt — wird direkt von der Domain des Senders geladen, dabei wird Deine IP an diese Domain übermittelt)
    - Antworttext oder Auszug der Erwähnung (sofern bereitgestellt)

    Es werden **keine** IP-Adressen, Cookies oder personenbezogenen Daten der Webmention-Sender oder der Lesenden bei mir gespeichert.

    **Verarbeitung durch webmention.io:** Der Dienst webmention.io empfängt die Webmentions stellvertretend und stellt sie über eine öffentliche API bereit. Verantwortlich für diesen Dienst ist Aaron Parecki. Datenschutzhinweise: [https://webmention.io/](https://webmention.io/).

    **Rechtsgrundlage:** Art. 6 Abs. 1 lit. f DSGVO — berechtigtes Interesse an föderierter Kommunikation und transparenter Diskussion zwischen Websites.

    **Wie kannst Du widersprechen?**
    - Sende keine Webmentions an Artikel auf dieser Seite.
    - Bestehende Webmentions können auf Anfrage entfernt werden — siehe Abschnitt **Kontakt für Datenschutzanfragen**.
    ```
  - [x] Note the explicit avatar-IP-leak disclosure (extends Story 2.3's baseline) — derived from Story 2.4's "Avatar Privacy and CSP Considerations" follow-up flag (`2-4-webmention-display-component.md` lines 557–572). This is the proper place for that disclosure per Story 2.4's decision to defer.

- [x] **Add "Was diese Seite NICHT tut" section** (AC: 3) [Source: existing AC #3 + FR-047]
  - [x] Add a top-level section after the three engagement sections. Suggested content:
    ```markdown
    ## Was diese Seite NICHT tut

    Damit es keine Missverständnisse gibt, hier eine Liste dessen, was diese Seite **nicht** macht:

    - **Keine Tracking-Cookies.** Umami arbeitet im Cookieless-Modus. Hearts werden im `localStorage` markiert, nicht in Cookies. Webmentions sind serverseitig, kein Browser-Storage.
    - **Keine personenbezogenen Daten.** Es gibt keine Anmeldung, keinen Newsletter, kein Kommentarsystem, kein Kontaktformular.
    - **Keine Werbung.** Keine Banner, keine Affiliate-Links mit Tracking, keine "Sponsored Content"-Einbindungen, kein Google AdSense.
    - **Kein Google Analytics.** Kein Google Tag Manager, keine Google Fonts (Schriftarten werden lokal eingebunden), keine Google reCAPTCHA.
    - **Kein Facebook-Pixel.** Keine Like-Buttons, keine Open-Graph-Pixel, keine Conversion-Tracker.

    Aber transparent: ein paar Dinge entstehen technisch automatisch:

    - **Server-Log beim Hoster (GitHub Pages):** GitHub speichert Zugriffslogs (siehe Abschnitt **Externes Hosting** weiter unten).
    - **Eingebundene YouTube-Videos:** Wenn ein Artikel ein YouTube-Video einbettet, wird `youtube-nocookie.com` genutzt (datenschutzfreundlicher Modus, keine Cookies bis zum Klick auf Play).
    - **Avatare bei Webmentions:** Werden direkt von den Servern der jeweiligen Sender geladen (siehe Abschnitt **Webmentions**).
    ```
  - [x] Verify the YouTube claim is current — if `csp.framesrc` in `params.yaml` still includes `https://www.youtube-nocookie.com` (line 20 at draft time, confirmed). If a future story switches to a different video host, update this section.

- [x] **Add or refine Contact section with DSGVO rights** (AC: 5) [Source: content/pages/impressum.md (lines 19–24) for email obfuscation pattern]
  - [x] Replace or augment the existing `## Allgemeine Hinweise und Pflichtinformationen` section with a clearer `## Kontakt für Datenschutzanfragen` section. Suggested content:
    ```markdown
    ## Kontakt für Datenschutzanfragen

    Bei Fragen zum Datenschutz oder zur Ausübung Deiner DSGVO-Rechte wende Dich bitte an:

    E-Mail (gegen Spam-Bots geschützt — bitte einmal manuell zusammensetzen):
    <span class="ltrText">
      <!-- gleiche Obfuskierung wie Impressum -->
    </span>

    **Deine Rechte unter der DSGVO:**

    - **Auskunftsrecht (Art. 15):** Welche Daten habe ich über Dich gespeichert? (Antwort vorab: keine personenbezogenen Daten — siehe Abschnitt **Was diese Seite NICHT tut**.)
    - **Recht auf Berichtigung (Art. 16):** Falls doch etwas falsch ist, kannst Du Korrektur verlangen.
    - **Recht auf Löschung (Art. 17):** Du kannst die Löschung Deiner Daten verlangen.
    - **Recht auf Einschränkung der Verarbeitung (Art. 18).**
    - **Recht auf Datenübertragbarkeit (Art. 20).**
    - **Widerspruchsrecht (Art. 21).**
    - **Beschwerderecht bei der Aufsichtsbehörde (Art. 77):** Du kannst Dich bei der zuständigen Datenschutzaufsichtsbehörde Deines Bundeslandes beschweren — Beschwerderecht besteht unbeschadet anderweitiger Rechtsbehelfe.
    ```
  - [x] Use the same email-obfuscation pattern as `impressum.md` (split with HTML comments and `<span class="addSeparatorAt">`/`<span class="addSeparatorDot">` separators). Either copy the existing pattern verbatim from `impressum.md` lines 20–24 or use a shared partial if one exists. **Note:** the obfuscation is decoded by `assets/js/gdpr.js` or a sibling script — verify the visible CSS classes match what the existing JS handles, otherwise the email won't render. If unclear at implementation time, re-use `impressum.md`'s exact pattern.
  - [x] **Decide whether to retain the existing `### Beschwerderecht bei der zuständigen Aufsichtsbehörde` subsection** (currently lines 29–30 of `datenschutz.md`): either fold the content into the new Contact section's bullet list (recommended — cleaner structure) or keep it as a redundant subsection (acceptable if implementer prefers minimal disturbance). Document the choice.

- [x] **Retain accurate technical sections** (AC: 7, 8) [Source: content/pages/datenschutz.md current state]
  - [x] Keep the following sections largely unchanged (they are still accurate as of implementation date):
    - `## Externes Hosting` → `### Github Pages` (server-log disclosure for GitHub Pages hosting).
    - `### SSL- bzw. TLS-Verschlüsselung`.
    - `### Cookies Widersprechen` (browser-level cookie management instructions).
    - `## Datenerfassung auf dieser Website` → `### Server-Log-Dateien` (Art. 6 Abs. 1 lit. f basis already cited correctly).
  - [x] Verify each retained section's German tone still matches the new content (informal `Du`, em-dashes vs hyphens, capitalization conventions). Light copy-editing is acceptable; legal substance must NOT change.
  - [x] Cross-check: the new structure should flow logically — overview, three engagement flows, posture statement, contact, hosting/server, encryption/browser controls. Section ordering matters for readability.

- [x] **Remove obsolete sections** (AC: 7) [Source: grep results showing Spotify is no longer in active use]
  - [x] Delete the entire `## Spotify` section (current lines 60–67). Add a one-line note in completion notes: "Removed Spotify section — no Spotify embeds in current codebase (verified by grep). If embeds re-introduced, re-add corresponding privacy disclosure."
  - [x] Delete the standalone `### Google Analytics und Google Web Fonts` line (line 19 — single sentence "Werden nicht eingebunden oder benutzt"). The `## Was diese Seite NICHT tut` section now covers this more comprehensively.
  - [x] Audit for any other obsolete claims discovered during the rewrite. Document each removal in completion notes.

- [x] **Verify footer link still resolves correctly** (AC: 4) [Source: layouts/_partials/_base/footer.html (lines 73–87), content/pages/datenschutz.md (frontmatter `menu: footer: weight: 20`)]
  - [x] Build the site (`hugo --quiet --environment production --minify`).
  - [x] Spot-check `public/index.html`, `public/articles/<existing-post>/index.html`, `public/pages/impressum/index.html`, `public/pages/ueber-mich/index.html` — each should contain a `<a href="/pages/datenschutz/">Datenschutz</a>` (or equivalent rendered URL) inside the footer's `<ul>` rendered by `.Site.Menus.footer`.
  - [x] If the link is missing (e.g., the menu wiring broke), check `datenschutz.md` frontmatter `menu: footer: weight: 20` is intact and not accidentally removed during the rewrite.
  - [x] **No code change expected** for AC #4 — this is purely a regression check.

- [x] **Add `Stand:` and `Version:` line to top of body** (AC: 6) [Source: AC #6]
  - [x] Verify the line appears near the top of the rendered page (immediately below the H1). Format: `*Stand: 06. Mai 2026 · Version: 1.0*` (italic, em-dash separator).
  - [x] Initial version is `1.0` for the comprehensive refresh introduced by this story (semver minor bump from any prior implicit `0.x` historical versions). Future material edits bump minor (`1.1`, `1.2`); restructurings bump major (`2.0`).
  - [x] At implementation time, replace `06. Mai 2026` with the actual edit date.

- [x] **Build and rendering verification** (AC: 8, 9) [Source: AC #8, #9]
  - [x] Run `hugo --quiet --environment production --minify` from project root → exit code 0; no template-execution errors, no missing-variable warnings, no unresolved partial references, no markdown rendering errors logged.
  - [x] Open `public/pages/datenschutz/index.html` in a browser → page renders with proper heading hierarchy (H1 + H2s + H3s), all internal anchor links resolve, all external links work (manual check on a sample — `https://webmention.io/`, GitHub Pages privacy URL, Umami privacy doc URL).
  - [x] Confirm `<meta name="robots" content="noindex">` is present in the rendered head (per existing `params: robotsdisallow: true`). The privacy policy page is intentionally not indexed by search engines.
  - [x] Diff `public/index.html` and `public/articles/<sample>/index.html` before and after — no unexpected changes outside the footer link target (which itself does not change, since the URL `/pages/datenschutz/` stays the same).
  - [x] Open the rendered email-obfuscated address in a browser with JS enabled and confirm it reveals correctly. If the existing JS-based unobfuscation logic is incompatible with the new section's HTML pattern, fall back to copying `impressum.md`'s exact HTML structure.

- [x] **Manual content review** (AC: 1, 2, 3, 5, 6 — qualitative)
  - [x] Read the entire rewritten page top-to-bottom as if you were a reader visiting for the first time. Check:
    - Does it answer "what data does this site collect?" honestly and completely in the first 3 paragraphs?
    - Does each engagement-flow section (Umami, Hearts, Webmentions) follow the same structure (what's collected, where it's stored, processor, legal basis, opt-out)?
    - Are all three opt-out instructions concrete and testable (not "you can opt out by configuring your browser" — actually say HOW)?
    - Is the contact section discoverable and the email decode-able without specialist knowledge?
    - Is the `Stand:` date current?
  - [x] Compare voice/tone to `impressum.md` and `ueber-mich/index.md` — informal `Du`, conversational, not legalese-heavy. The privacy policy should read like the rest of the site, not like a law firm template.
  - [x] Optional: have a second reader (Angel or another person) review for clarity and completeness. Privacy policies are user-facing legal documents — a second pair of eyes catches both legal gaps and reading-ease issues.

- [x] **Documentation and handoff**
  - [x] In completion notes, record:
    - The Story 2.3 coordination outcome (integrated existing section / created new section / not yet landed).
    - The version number set (default `1.0`).
    - Any obsolete sections removed beyond Spotify/Google.
    - The decision on whether `Stand:`/`Version:` is in body (recommended) or frontmatter.
    - The path of the email-obfuscation HTML pattern used (re-used from `impressum.md` or shared partial if one was created).
  - [x] Update `docs/todo.md` if there are follow-ups (e.g., "consider extracting email-obfuscation into a shared partial used by both `impressum.md` and `datenschutz.md`" — if duplicated copy-paste).
  - [x] Close GitHub Issue [#49](https://github.com/AngelCrawford/issues/49) when the story is `done` (umbrella issue per epics.md line 30, line 340).

## Dev Notes

### Architectural Context

Story 2.5 is a **content-only story** in Epic 2 — no template, partial, asset, or workflow changes. It updates the user-facing privacy policy at `content/pages/datenschutz.md` to reflect the engagement infrastructure that Stories 2.1 (Umami), 2.2 (Hearts), 2.3 (Webmention reception), and 2.4 (Webmention display) introduce. The story has **no code dependencies** on the other Epic 2 stories — the privacy policy describes data flows that are *planned* via the architecture and PRD, regardless of which stories have actually shipped to production at implementation time. Honesty about *intended* data flows in advance of go-live is acceptable (and arguably better than the alternative: shipping engagement infrastructure to production with an outdated privacy policy).

The page is `robotsdisallow: true` (frontmatter line 8), meaning Hugo emits `<meta name="robots" content="noindex">` and excludes the page from `sitemap.xml`. This is intentional — the privacy policy is a transparency/legal document for readers who navigate to it via the footer, not SEO content. The footer-menu wiring (`menu: footer: weight: 20`) places the link at the second position in the footer nav (after the homepage; same weight pattern as `impressum.md` at weight `30`).

[Source: docs/2-solutioning/digital-garden-integration-architecture.md (lines 1056–1062) — Client-Side Considerations: cookieless Umami, localStorage hearts, webmention XSS]
[Source: docs/2-solutioning/digital-garden-integration-architecture.md (lines 414–469) — Pattern 2: Dual Anonymous Engagement System (the data flows the policy describes)]
[Source: docs/2-solutioning/digital-garden-integration-architecture.md (lines 999–1064) — Security Architecture: GitHub Secrets, JAMstack security benefits, no server-side vulnerabilities]
[Source: content/pages/datenschutz.md (lines 1–67) — current page state and footer-menu wiring]

### Privacy Policy Information Architecture

Privacy policies break down into a small number of repeatable sections. The structure for this rewrite:

1. **Intro / Auf einen Blick** — one-paragraph honest summary; surfaces the three data flows in the first 100 words. Readers who want to skim get the answer.
2. **Three engagement-flow sections** (Umami, Hearts, Webmentions) — each follows the same template (what / where / processor / legal basis / opt-out). Parallel structure aids skim-reading.
3. **Posture statement** (`## Was diese Seite NICHT tut`) — explicit denials of common surveillance patterns. Useful for readers comparing against other sites' policies.
4. **Contact + DSGVO rights** — the actionable section. If the reader has a question or wants to exercise a right, they need the email address and a quick rights-list, not legalese.
5. **Hosting / server / encryption** — technical infrastructure details. Required by GDPR for transparency but lower-priority for most readers; goes near the bottom.

This ordering is **reader-prioritized** (most-impactful information first) rather than legalistic (definitions / scope / rights / etc. — typical of corporate templates). Justification: this site is a personal digital garden, not a SaaS product. Readers want clarity, not exhaustive legal cover. Format trade-off: slightly less defensible against an extremely pedantic auditor, much more useful to actual humans.

[Source: docs/1-planning/prd/03a-functional-requirements.md (lines 336–340) — FR-048 validation criteria]

### Email Obfuscation Pattern (re-use from impressum.md)

The site already uses a JavaScript-decoded email obfuscation pattern in `impressum.md` (lines 19–24). The pattern splits the address with HTML comments and uses `<span class="addSeparatorAt">` / `<span class="addSeparatorDot">` / `<span class="removeText">` markers that a sibling JS script presumably handles. **Do not reinvent**: copy the existing pattern verbatim, swapping in this story's destination address.

If at implementation time the JS that decodes the spans is found to NOT exist (e.g., the existing `impressum.md` decoder is broken or never landed), fall back to a simpler approach: render the email as `<a href="mailto:obfuscated@example.com">obfuscated@example.com</a>` with the visible address sufficiently obfuscated by Unicode tricks (e.g., insert zero-width spaces). Document the fallback in completion notes.

[Source: content/pages/impressum.md (lines 19–24) — existing pattern]

### Coordination with Story 2.3 (Webmentions section)

Story 2.3 (`docs/sprint-artifacts/epic-2/2-3-webmention-endpoint-setup.md`) AC #5 plans to add a `## Webmentions` section to this same file. Both stories are currently `drafted`/`ready-for-dev` (status as of this story's drafting); implementation order is determined by the dev agent's queue, not by either story's content.

**Two scenarios:**

1. **Story 2.3 lands first** (more likely — it's earlier in the epic's logical sequence): when this story implements, the `## Webmentions` section already exists in `datenschutz.md`. **Action:** integrate — keep the section, refine its position in the new structure (Umami → Hearts → Webmentions, chronological by data-flow visibility), verify content matches the baseline in this story's AC #2 task (Story 2.3's draft baseline already covers most of it; this story extends with the avatar-IP-leak disclosure flagged by Story 2.4 follow-up).

2. **This story lands first** (unlikely but possible if 2.3's external account-setup task blocks): create the section per this story's baseline. Story 2.3's AC #5 then becomes a verification-only step (section already exists, content matches its requirements) — it does NOT recreate the section.

In either case, **document the coordination outcome in completion notes** so a reviewer of either story understands the section's authorship.

[Source: docs/sprint-artifacts/epic-2/2-3-webmention-endpoint-setup.md (Tasks: "Add Webmentions section to privacy policy", lines 96–120) — Story 2.3's planned content]
[Source: docs/sprint-artifacts/epic-2/2-4-webmention-display-component.md (lines 567–569, 694) — Story 2.4 deferred avatar-IP-leak disclosure to this story]

### Out-of-Scope (deferred elsewhere)

- **Cookie banner UI** — Story 2.7 (`Cookie-Banner UI`) handles the visible session-storage-based banner that links **TO** this privacy policy. Story 2.7 has a hard prerequisite on this story (epics.md line 413: "Privacy Policy must exist for link target"). This story does NOT touch the banner partial; Story 2.7 owns it.
- **GDPR consent management** — `assets/js/gdpr.js` already exists in the codebase (per `digital-garden-integration-architecture.md` line 72). Wiring it for cookieless engagement (since there are no cookies to consent to) is not in scope — this story is content-only. Any JS changes are Story 2.7's territory.
- **Newsletter signup, comment system, contact form** — none exist on the site. The privacy policy correctly states "none of these exist" rather than describing data flows that don't apply.
- **Outgoing webmentions** — when the site sends webmentions to other sites whose articles it links to (vs. receiving them). Not in current architecture; would be Phase 3 (Epic 7 POSSE) if implemented. Until then, the policy doesn't need to discuss it.
- **Schema.org structured data on the privacy page** — privacy pages typically don't carry rich schema (no `Article`, no `Person`); the site's SEO partial likely emits a minimal `WebPage` schema. No edits needed.
- **Multilingual versions of the privacy policy** — site is German-only at this stage. An English-translated privacy policy would be a separate future story (probably Epic 9 or later).
- **Privacy policy version history page / changelog** — out of scope. The git log of `datenschutz.md` provides the audit trail. If a future regulatory requirement demands an in-page changelog, add it then.

### Critical Agent Rules (apply to this story)

From `digital-garden-integration-architecture.md` lines 762–771, evaluated for this content-only story:

1. **NEVER modify existing card variants** — N/A (no card edits).
2. **ALWAYS add new features to card footer** — N/A (no card edits).
3. **NEVER commit `data/*.json` files to main branch** — N/A (no data file edits).
4. **ALWAYS use the `popularity-score.html` partial** — N/A (no popularity rendering).
5. **NEVER use jQuery** — N/A (no JavaScript in this story).
6. **ALWAYS add `| default` when accessing data files** — N/A (no template edits).
7. **ALWAYS pin Hugo version in GitHub Actions** — N/A (no workflow edits).

All rules are N/A — confirms the scope is correctly limited to a single markdown file edit.

[Source: docs/2-solutioning/digital-garden-integration-architecture.md (lines 762–771) — Critical Agent Rules]

### Project Structure Notes

- **No new directories.** Single file edit at `content/pages/datenschutz.md`.
- **No template, partial, asset, config, or workflow changes.** If any such change is needed during implementation, pause and re-read the AC — it's a scope-creep signal.
- **No frontmatter schema changes** beyond optionally adding `last_updated:` and `policy_version:` (recommended path: in-body metadata line, no frontmatter changes — see AC #6 task).
- **Footer-menu wiring stays as-is** — `menu: footer: weight: 20` in frontmatter is the established pattern (`impressum.md` uses `weight: 30`); no menu config change.
- **`robotsdisallow: true` is correct and stays** — privacy policy is intentionally noindex.
- **Test infrastructure status:** Stories 1.1+ bootstrap `tests/build/` and `tests/e2e/`. At drafting time, those directories do not exist (Story 1.1 status: `ready-for-dev`). This story does NOT have automated tests — content-only changes are verified by build success + manual content review (AC #8 task) + footer-link regression check (AC #4 task). Do NOT add a test file in this story.
- **Diff-friendliness:** the rewrite is large enough that the resulting commit will look like a near-total rewrite of the file. That's expected and acceptable. Use a single commit (or two — "Remove obsolete sections" + "Rewrite with current data flows") for clean review.

[Source: docs/sprint-artifacts/epic-1/1-1-growth-stage-frontmatter-field.md — test infra layout (`ready-for-dev`, not landed yet)]
[Source: content/pages/impressum.md, content/pages/ueber-mich/index.md — sibling page conventions: German content, footer-menu wiring, informal Du-form, em-dash typography]

### Test Strategy

Aligned with the 1-day epics estimate (epics.md line 354). Scope is a single markdown file edit:

- **Build pass (primary):** `hugo --quiet --environment production --minify` exits 0. Confirms no markdown rendering errors, no broken Hugo template references, no frontmatter parse errors.
- **Manual content review (primary):** read the rewritten page top-to-bottom; verify each AC (1–6) is satisfied by an identifiable section; verify obsolete sections (Spotify, redundant Google one-liner) are removed; verify the `Stand:`/`Version:` line is current; verify the email obfuscation decodes correctly in a JS-enabled browser.
- **Footer-link regression (AC #4):** spot-check 4–5 representative pages (home, article, log, list, taxonomy) for the footer link. Spec out what "the link" looks like in HTML (`<a href="/pages/datenschutz/">Datenschutz</a>`) and grep the rendered files. Should be unchanged from pre-implementation state.
- **Diff-based no-regression check (AC #9):** `diff -r public-before public-after` (or the equivalent before/after build comparison). Only `public/pages/datenschutz/index.html` should differ; all other rendered pages should be byte-equivalent (or equivalent — `<meta>` ordering may shift but content unchanged).
- **External link resolution (AC #8 manual):** click each external URL in the new content (`https://webmention.io/`, `https://umami.is/...`, GitHub Pages privacy URL) and confirm 2xx response. Privacy policies are perpetual link-rot risks — leave a tickler in `docs/todo.md` to re-verify links every 6–12 months.
- **No automated tests added.** Test infrastructure (`tests/build/`, `tests/e2e/`) is not yet landed. If those exist at implementation time, **optionally** add: (1) a build-test assertion that `public/pages/datenschutz/index.html` contains the strings `"Umami"`, `"Hearts"` (or `"Herz-Reaktionen"`), and `"Webmention"` — proves the three engagement sections rendered; (2) a footer-link assertion that the rendered HTML contains `href="/pages/datenschutz/"` in `.footer nav`. Total: ~10 lines of test code. Skip if test infra absent.

### Learnings from Previous Story

**From Story 2.4 (Webmention Display Component) — Status: drafted (not yet implemented).**

The create-story workflow rule treats anything below `in-progress`/`review`/`done` as `"Previous story not yet implemented"`. Story 2.4 is `drafted`, so no implementation learnings (e.g., how the webmention partial behaves on production data, whether avatar CSP `imgsrc` needed widening) exist to forward.

**However, Story 2.4's draft contains directly load-bearing context for this story:**

- **Avatar privacy follow-up explicitly deferred to Story 2.5** (`2-4-webmention-display-component.md` lines 567–569 and 694): Story 2.4 acknowledged that webmention sender avatars are loaded from third-party domains (sender's blog, Mastodon instance, Gravatar, etc.), which leaks the reader's IP to those domains. Story 2.4 chose not to implement avatar caching/proxying (architectural complexity, image licensing) but **flagged the disclosure as a Story 2.5 responsibility**. **This story's AC #2 Webmentions section addresses this** with the explicit bullet: "Avatar-Bild des Autors (sofern bereitgestellt — wird direkt von der Domain des Senders geladen, dabei wird Deine IP an diese Domain übermittelt)".
- **Webmention reception infrastructure (Story 2.3) and display infrastructure (Story 2.4)** are both planned but not yet shipped. The privacy policy correctly describes them as intended data flows.
- **Story 2.3's draft already contains a `## Webmentions` section baseline** (`2-3-webmention-endpoint-setup.md` lines 100–120) that this story builds on. Coordination flag: see "Coordination with Story 2.3" section above.
- **Heart button design (Story 2.2)**: localStorage key format is `hearted-${articleUrl}` per architecture lines 446 and 466. The privacy policy's Hearts section reflects this exact key format so a reader who opens DevTools sees the same string.
- **Umami CSP allowance (Story 2.1)**: `cloud.umami.is` is in `csp.scriptsrc` and `csp.connectsrc` (params.yaml lines 25, 29). Privacy policy's Umami section references the same domain.

**Cross-epic / sibling-draft patterns to reuse:**

- **AC source separation (from Stories 2.1, 2.2, 2.3, 2.4 drafts)** — ACs from epics.md verbatim are clearly labeled (1–6); testability/regression guards (7–9) are added below and tagged as such. Same convention.
- **Heading language convention (from Stories 2.2, 2.3, 2.4 drafts)** — site UI is German; English AC text is intent, not literal. This story uses German headings throughout (`Anonyme Analyse mit Umami`, `Herz-Reaktionen`, `Webmentions`, `Was diese Seite NICHT tut`, `Kontakt für Datenschutzanfragen`).
- **Path/slug language reconciliation (NEW pattern in this story)** — Story 1.1's frontmatter field stayed English (technical convention), but content-page slugs follow site language: `/pages/datenschutz/` not `/pages/privacy/`, `/pages/impressum/` not `/pages/legal/`. This story honours the existing slug.
- **Defer-and-integrate pattern (from Stories 2.1, 2.3 drafts)** — Story 2.1 deferred Umami section to this story; Story 2.3 inline-added Webmentions section AND deferred broader refresh to this story. **This story integrates both.**
- **Honesty over marketing (NEW pattern, established by this story)** — the privacy policy explicitly describes existing third-party exposures (GitHub Pages logs, YouTube embeds, webmention sender avatars) rather than glossing over them with privacy-marketing language. Sets a precedent for future privacy/legal content edits.

**Pending review items (from previous stories):** None. No story in the project has reached `review` status yet, so no Senior Developer Review sections exist to forward.

[Source: docs/sprint-artifacts/sprint-status.yaml — current development_status (1-1 → 1-5: ready-for-dev; 2-1, 2-2, 2-3: ready-for-dev; 2-4: drafted; 2-5 was the next backlog story, now drafted)]
[Source: docs/sprint-artifacts/epic-2/2-4-webmention-display-component.md — sibling story; deferred avatar-IP disclosure to this story; established avatar privacy/CSP analysis pattern]
[Source: docs/sprint-artifacts/epic-2/2-3-webmention-endpoint-setup.md — sibling story; established webmention reception infrastructure, German Webmentions section content baseline, defer-and-integrate pattern]
[Source: docs/sprint-artifacts/epic-2/2-2-heart-button-component.md — sibling story; established hearts data flow (Umami event + localStorage), German UI convention]
[Source: docs/sprint-artifacts/epic-2/2-1-umami-analytics-integration.md — sibling story; explicitly deferred privacy-policy Umami section to this story; established cookieless analytics architecture]

### References

- [Source: docs/1-planning/epics.md (lines 332–354)] — Story 2.5 ACs (six ACs verbatim, FR-048 coverage, GitHub Issue #49, prerequisite/dependency = none)
- [Source: docs/1-planning/epics.md (lines 213–222)] — Epic 2 header (Engagement Infrastructure, FR-008–013/047–049)
- [Source: docs/1-planning/epics.md (lines 392–417)] — Story 2.7 (Cookie-Banner UI) prerequisite on this story (banner links to privacy policy)
- [Source: docs/1-planning/prd/03a-functional-requirements.md (lines 336–340)] — FR-048 (Privacy Policy Publication): "Privacy policy page exists, explains Umami + webmentions, accessible from footer"
- [Source: docs/1-planning/prd/03a-functional-requirements.md (lines 330–334)] — FR-047 (Zero Tracking Cookies) — informs AC #3
- [Source: docs/1-planning/prd/03a-functional-requirements.md (lines 342–346)] — FR-049 (Anonymous Analytics) — informs AC #2 Umami section
- [Source: docs/1-planning/prd/02-vision-and-goals.md (lines 53, 67, 127, 132)] — privacy as a core project value
- [Source: docs/1-planning/prd/07-implementation-phases.md (line 29)] — Phase 0 task referencing #49 ("Add privacy policy")
- [Source: docs/1-planning/prd/10-appendices.md (line 142)] — FR-048 → Epic 2 → Story 2.5 → Phase 1A → MVP traceability
- [Source: docs/2-solutioning/digital-garden-integration-architecture.md (lines 13–18)] — Privacy-first engagement architectural principle
- [Source: docs/2-solutioning/digital-garden-integration-architecture.md (lines 414–469)] — Pattern 2: Dual Anonymous Engagement System (data flows the policy describes)
- [Source: docs/2-solutioning/digital-garden-integration-architecture.md (lines 999–1064)] — Security Architecture (informs Hosting and Encryption sections)
- [Source: docs/2-solutioning/digital-garden-integration-architecture.md (lines 1056–1062)] — Client-Side Considerations: cookieless analytics, localStorage hearts, webmention XSS
- [Source: docs/2-solutioning/architecture.md (line 680)] — "Privacy: No data sent to third parties" — informs AC #3's posture statement
- [Source: docs/2-solutioning/solutioning-gate-check-report-2025-11-15.md (line 354)] — explicit mapping: Story 2.5 → Security Architecture (lines 999–1064)
- [Source: content/pages/datenschutz.md] — current page state (footer-menu wiring, `robotsdisallow`, informal Du, existing structural sections)
- [Source: content/pages/impressum.md (lines 19–24)] — email obfuscation pattern for AC #5
- [Source: layouts/_partials/_base/footer.html (lines 73–87)] — footer-menu rendering loop (AC #4 verification target)
- [Source: config/_default/params.yaml (lines 17–29)] — CSP config: `csp.framesrc: youtube-nocookie.com`, `csp.scriptsrc: cloud.umami.is`, `csp.connectsrc: cloud.umami.is, webmention.io` — informs sections about YouTube, Umami, Webmentions
- [Source: docs/sprint-artifacts/epic-2/2-1-umami-analytics-integration.md] — sibling story; deferred Umami section to this story
- [Source: docs/sprint-artifacts/epic-2/2-2-heart-button-component.md] — sibling story; established hearts data flow
- [Source: docs/sprint-artifacts/epic-2/2-3-webmention-endpoint-setup.md] — sibling story; Webmentions section content baseline
- [Source: docs/sprint-artifacts/epic-2/2-4-webmention-display-component.md] — sibling story; deferred avatar-IP disclosure to this story
- [https://umami.is/docs/legal/privacy](https://umami.is/docs/legal/privacy) — Umami's privacy policy (referenced from this story's Umami section)
- [https://webmention.io/](https://webmention.io/) — webmention.io homepage and privacy info (referenced from this story's Webmentions section)
- [https://help.github.com/de/github/site-policy/github-privacy-statement](https://help.github.com/de/github/site-policy/github-privacy-statement) — GitHub Privacy Statement (already linked from existing GitHub Pages section)
- [https://gohugo.io/content-management/menus/](https://gohugo.io/content-management/menus/) — Hugo menus documentation (relevant to AC #4 footer-menu mechanism)

## Dev Agent Record

### Context Reference

- docs/sprint-artifacts/epic-2/2-5-privacy-policy-page.context.xml (generated 2026-05-06)

### Agent Model Used

claude-opus-4-7[1m]

### Debug Log References

- Hugo build (`hugo --quiet --environment production --minify`) on rewritten `datenschutz.md`: exit 0, no template/markdown errors.
- Build-test suite (`node --test tests/build/build-smoke.test.mjs`): 51/51 pass after adding 5 new Story 2.5 assertions.
- Before/after `public/` diff (timestamp + CSS-fingerprint normalised): only `pages/datenschutz/index.html` differs. AC #9 satisfied.
- Footer-link spot-check on `index.html`, `pages/impressum/`, `pages/ueber-mich/`, `articles/test/`, `404.html` — all five contain `<a href="/pages/datenschutz/">Datenschutz</a>`.
- Sitemap (`public/sitemap.xml`) does NOT reference `/pages/datenschutz/` — `robotsdisallow: true` exclusion still active.
- Rendered head contains `<meta name="robots" content="noindex, nofollow, noarchive">` — noindex preserved.

### Completion Notes List

- **Story 2.3 coordination outcome:** Story 2.3 already landed its `## Webmentions` section (commit `4bf4735` "Webmentions design", lines 69–93 of pre-edit `datenschutz.md`). Per the integrate-or-create branch in the spec: integrated in place — kept Story 2.3's German baseline, repositioned the section AFTER `## Herz-Reaktionen` (chronological data-flow ordering), and extended the data-list bullet for avatars to include the IP-leak disclosure deferred from Story 2.4. The H3 sub-headings inside Story 2.3's draft (`### Welche Daten werden empfangen?`, `### Verarbeitung durch webmention.io`, `### Rechtsgrundlage`, `### Widerspruch / Löschung`) were collapsed to inline **bold** labels to match the parallel structure of the Umami and Hearts sections (what / where / processor / legal basis / opt-out).
- **Version set:** `1.0` (rendered as `*Stand: 09. Mai 2026 · Version: 1.0*` immediately under the title). Implementation date used: 2026-05-09.
- **Stand/Version placement:** Body italic line under H1, NOT frontmatter. Recommended path per the task's "simplest, AC-satisfying, no template change required" criterion.
- **Email obfuscation — fallback used.** The `impressum.md` HTML-comment + span-class pattern (`addSeparatorAt`, `addSeparatorDot`, `removeText`, `ltrText`) has NO decoder JS or CSS anywhere in the repository (`grep` of `assets/`, layouts, SCSS, anywhere — zero matches outside `impressum.md` and this story's planning docs). Without the decoder, the rendered output is gibberish to humans; the obfuscation is structurally broken. Per AC #5 task's documented fallback ("If at implementation time the JS that decodes the spans is found to NOT exist, fall back to a simpler approach"), used a text-based obfuscation: `a [dot] scheuer [at] grvity [dot] de` rendered as a blockquote, with one-line decode instructions. First attempt used HTML numeric entities (`&#97;` etc.) — Goldmark decodes those during markdown render so the rendered output was plain `a.scheuer@grvity.de`, defeating the goal. Switched to literal `[at]`/`[dot]` placeholders which survive both Goldmark and the Hugo minifier.
- **Email destination:** `mail@article-time.de` — confirmed by Angel as the public site contact address. (Initial draft used `a.scheuer@grvity.de` from the system context as a placeholder, then corrected post-review.) NOT the impressum address — the impressum's encoded address decodes to `mail@angel-crawford.de` IF the (missing) decoder reversed it via RTL bidi, but since the decoder doesn't exist the impressum address is unreachable in practice. The new privacy-page address is independently valid and lives on the project's primary domain.
- **Obsolete sections removed:** `## Spotify` (no Spotify embeds in current codebase, verified by `grep` of `layouts/`, `assets/`, `content/articles/` — zero matches), and `### Google Analytics und Google Web Fonts` (the new `## Was diese Seite NICHT tut` section subsumes the claim with broader context). Also dropped: legacy `## Datenschutz auf einen Blick` intro (replaced by `## Auf einen Blick` honest summary), legacy `### Datenerfassung auf dieser Website` (the "ich erfasse keine Daten" line that became partially false with hearts + webmentions), and the `## Allgemeine Hinweise und Pflichtinformationen` umbrella with its `### Beschwerderecht` child (DSGVO rights including Art. 77 are now folded into the new `## Kontakt für Datenschutzanfragen` section per the spec's recommended cleanup path).
- **Withered-banner sessionStorage subsection (Story 1.4 carry-over):** Added as `### Hinweis-Dismiss bei verwelkten Inhalten` between `## Herz-Reaktionen` and `## Webmentions`, citing § 25 Abs. 2 Nr. 2 TTDSG ("technisch erforderlich"). Extended the AC #3 "Was diese Seite NICHT tut" first bullet to mention `sessionStorage` alongside `localStorage`.
- **Diff-based no-regression check (AC #9):** Two production builds (before-edit baseline → `public-before/`, after-edit → `public-after/`) compared with `diff -rq` after stripping the build-time `Build Date: <timestamp>` string and the SCSS pipeline's `style.min.<HASH>.css` fingerprint (both pre-existing non-determinism — confirmed by a third no-source-change build that produced yet another CSS hash). With those two sources of timestamp noise normalised, the only file that differs is `pages/datenschutz/index.html` itself. Sitemap byte-equivalent. RSS feed byte-equivalent.
- **Tests added:** Five new Story-2.5-tagged tests in `tests/build/build-smoke.test.mjs` covering the three engagement-flow H2s, the posture + contact H2s with seven DSGVO-article citations, removal of Spotify and the legacy "Datenschutz auf einen Blick" heading, the noindex meta + sitemap exclusion, and the homepage footer link. Full suite: 51/51 passing.

### File List

- `content/pages/datenschutz.md` — rewritten end-to-end (modified)
- `tests/build/build-smoke.test.mjs` — appended Story 2.5 section with 5 tests (modified)
- `docs/sprint-artifacts/epic-2/2-5-privacy-policy-page.md` — Status, Tasks/Subtasks, Dev Agent Record, Change Log (modified)

## Change Log

| Date | Change | Author |
|---|---|---|
| 2026-05-09 | Implemented Story 2.5: rewrote `content/pages/datenschutz.md` end-to-end with `*Stand: 09. Mai 2026 · Version: 1.0*` metadata line, honest `## Auf einen Blick` summary, three engagement-flow sections (Umami / Hearts / Webmentions) with parallel structure (what / where / processor / legal basis / opt-out), `### Hinweis-Dismiss bei verwelkten Inhalten` subsection covering Story 1.4's sessionStorage usage (§ 25 Abs. 2 Nr. 2 TTDSG), avatar-IP-leak disclosure folded into Webmentions per Story 2.4 hand-off, `## Was diese Seite NICHT tut` posture statement, `## Kontakt für Datenschutzanfragen` with all seven DSGVO rights articles, retained Hosting/GitHub Pages/Server-Log/SSL/Cookies sections. Removed obsolete `## Spotify` (no Spotify embeds in codebase), `### Google Analytics und Google Web Fonts` standalone (subsumed by posture statement), legacy `## Datenschutz auf einen Blick` intro, legacy `### Datenerfassung` ("Ich erfasse keine Daten" — became partially false), and `## Allgemeine Hinweise und Pflichtinformationen` (DSGVO rights now in Contact). Email obfuscation via the documented fallback (`a [dot] scheuer [at] grvity [dot] de` blockquote with decode instructions) — impressum's HTML-span pattern has no decoder JS/CSS in the repo and renders as gibberish in practice; HTML numeric-entity attempt was decoded by Goldmark and rejected. Story 2.3's `## Webmentions` section integrated in place (Story 2.3 landed first in commit `4bf4735`), repositioned to follow Hearts. `robotsdisallow: true` retained — page noindex; sitemap excludes it. Added 5 build-smoke tests (`tests/build/build-smoke.test.mjs`); full suite 51/51 pass. Diff-based no-regression check: only `pages/datenschutz/index.html` differs after normalising build-timestamp + non-deterministic CSS fingerprint. | Dev (claude-opus-4-7[1m]) |
| 2026-05-06 | Initial draft created from `epics.md` Story 2.5 (FR-048, GitHub Issue #49), `prd/03a-functional-requirements.md` (FR-047 Zero Tracking Cookies, FR-048 Privacy Policy Publication, FR-049 Anonymous Analytics), `digital-garden-integration-architecture.md` (Pattern 2 Dual Anonymous Engagement lines 414–469; Security Architecture lines 999–1064; Client-Side Considerations lines 1056–1062), and sibling Stories 2.1–2.4 drafts. Reconciled epics AC #1 (`/pages/privacy/`) with project state (existing German page at `/pages/datenschutz/`, footer-menu wired) — same language reconciliation pattern Stories 2.2/2.4 used for German UI strings. ACs 1–6 verbatim from epics; ACs 7–9 added as testability/regression guards (cleanup of obsolete content like Spotify section, clean prod build, byte-equivalent unchanged layouts outside `datenschutz.md`). Coordination with Story 2.3's planned `## Webmentions` section documented as integrate-or-create depending on landing order. Avatar-IP-leak disclosure deferred from Story 2.4 picked up here per Story 2.4's explicit hand-off (`2-4-webmention-display-component.md` lines 567–569, 694). Information architecture chosen as reader-prioritized (intro, three engagement-flow sections in chronological visibility order, posture statement, contact + DSGVO rights, hosting/server) rather than legalistic, matching the digital-garden personal-site context. Email obfuscation pattern re-uses `impressum.md` lines 19–24 verbatim. `Stand:` and `Version:` metadata in body (recommended) over frontmatter to keep template untouched. `robotsdisallow: true` retained (privacy policy is intentionally noindex). Spotify section flagged for removal (no Spotify embeds in current codebase, verified by grep). Standalone Google Analytics one-liner subsumed into broader `## Was diese Seite NICHT tut` posture statement. No code, template, asset, or workflow changes — content-only edit to `content/pages/datenschutz.md`. Test strategy: build pass + manual content review + footer-link regression check + diff-based no-regression check + external link resolution. No automated tests added (test infra not yet landed). | SM (create-story workflow) |
| 2026-05-09 | Carry-over note added: Story 1.4 introduced a sessionStorage-backed dismiss button on the withered-content warning banner (`assets/js/withered-banner.js`). Per Art. 13 DSGVO transparency, this story should add a short `### Hinweis-Dismiss bei verwelkten Inhalten` subsection (placement: after Hearts, before Webmentions) plus extend the AC #3 "no tracking cookies" bullet to mention `sessionStorage`. No consent gate required (§ 25 Abs. 2 Nr. 2 TTDSG: technisch erforderlich für die nutzerangeforderte Dismiss-Funktion). | Dev (Story 1.4 carry-over) |
