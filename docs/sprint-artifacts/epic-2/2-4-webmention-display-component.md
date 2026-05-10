# Story 2.4: Webmention Display Component

Status: done

## Story

As a reader,
I want to see replies and mentions from other websites on each article,
so that I can follow federated conversations and discover related discussion happening across the IndieWeb.

## Acceptance Criteria

1. **"Replies & Mentions" section added to article footer.** Implementation creates a new partial at `layouts/_partials/widgets/webmentions.html` (matching project convention — `series.html`, `pagination.html`, `archive.html`, and Story 2.2's `heart-button.html` all live in `_partials/widgets/`). The partial is mounted in `layouts/single.html` inside the `{{ else if eq .Page.Type "articles" }}` branch (line 34 onward), placed at the **bottom of the main `<article class="box">` element** (after the existing `box-footer` series block at lines 66–70, OR after the article close tag near line 71 — dev's choice). Heading on the rendered section is `<h2 class="title is-4">Replies & Mentions</h2>` (German equivalent acceptable: `Antworten & Erwähnungen` — match existing UI string language; the rest of `single.html` uses German labels like "Artikel", "Übersicht", "Serie", "Ähnliche Artikel", so prefer the German heading for consistency). The reconciliation of epics-AC wording ("article footer") with project layout (`_partials/widgets/webmentions.html` mounted at the end of the main article column) follows the same pattern as Story 2.3's `head.html`-vs.-`baseof.html` reconciliation: rendered effect is identical to "added to article footer".

2. **Webmentions grouped by type into four named sub-sections: Replies, Reposts, Mentions, Likes** (in that visual order). The data shape comes from Story 3.2's `data/webmentions_by_article.json` (canonical schema in `digital-garden-integration-architecture.md` lines 871–902): each entry has a `type` field with one of the values `reply`, `repost`, `like`, `mention`. The partial groups the array by `type`, renders one `<section class="webmentions__group webmentions__group--{{ type }}">` per non-empty group, with a localized heading (e.g., `Antworten`, `Reposts`, `Erwähnungen`, `Likes`) and a count badge in the heading (`Antworten (3)`). Empty groups are skipped (do NOT render an empty heading). Type-to-heading mapping is hardcoded in the partial (no i18n file exists in the project yet — see Story 2.2 reconciliation note for the same pattern).

3. **Each webmention entry shows: author name, avatar (if provided), reply text (if applicable), and source link.** Concrete render structure per entry:
   ```html
   <article class="webmention" data-wm-type="{{ .type }}">
     {{ if .author_photo }}
       <img class="webmention__avatar" src="{{ .author_photo }}" alt="" loading="lazy" width="48" height="48">
     {{ end }}
     <div class="webmention__body">
       <a class="webmention__author" href="{{ .author_url }}" rel="noopener external" target="_blank">{{ .author }}</a>
       {{ if eq .type "reply" }}
         <p class="webmention__content">{{ .content | safeHTML }}</p>  <!-- see AC #8 XSS guard -->
       {{ end }}
       <a class="webmention__source" href="{{ .url }}" rel="noopener external" target="_blank" title="Quelle ansehen">
         <time datetime="{{ .published }}">{{ .published | dateFormat ":date_long" }}</time>
       </a>
     </div>
   </article>
   ```
   Author name is **always** rendered. Avatar is rendered only when `.author_photo` is truthy (graceful fallback: name-only entry with no img element — do NOT render a broken `<img>` or a placeholder avatar). Reply text is rendered **only for `type == "reply"`** entries (likes/reposts/mentions don't have meaningful content per the architecture's data shape; see lines 875–900). Source link is **always** rendered (every webmention entry has a `url` per the schema). The `published` date renders via Hugo's `dateFormat ":date_long"` for human-readable output (e.g., "15. November 2025") matching existing date formatting in `single.html` lines 87–91.

4. **Webmentions load from `data/webmentions_by_article.json`** (generated daily by Story 3.2). Hugo template uses graceful fallback per the project's critical agent rule "ALWAYS use `| default` when accessing data files":
   ```go-html-template
   {{- $mentions := index .Site.Data.webmentions_by_article .RelPermalink | default (slice) -}}
   ```
   Missing data file (typical until Story 3.2 lands), missing key for the current article, or empty array all resolve to an empty slice — the partial then renders the AC #5 "no replies yet" empty-state without erroring. **No HTTP fetch in the browser** — webmention display is server-side rendered at build time from the static JSON file. The site is a JAMstack project with no client-side data API; per architecture lines 296–308, all engagement data flows via `.Site.Data.*` lookups in templates.

5. **If no webmentions, section shows the empty-state message: "No replies yet. Send a webmention!"** German equivalent: `Noch keine Antworten. Sende einen Webmention!` (match site language convention — see AC #1). Implementation: when `len $mentions == 0`, render a single `<p class="webmentions__empty">Noch keine Antworten. Sende einen Webmention!</p>` in place of the grouped sections. The heading `<h2>Replies & Mentions</h2>` is **still rendered** (the section exists, it's just empty-state'd) so that crawlers/screen-readers see a stable page structure across articles. The empty-state message links to a brief explainer (either inline expand `<details>` or a link to the Privacy Policy's `## Webmentions` section added by Story 2.3) at dev's option — minimum viable: just the literal sentence.

6. **External links open in new tab with `rel="noopener"`** (and additionally `rel="external"` and `target="_blank"`). Applies to: author profile link, webmention source link, and any link inside reply content (Hugo's `safeHTML` does not auto-add `rel`/`target` — they must be in the rendered HTML directly). The architecture's security note at line 1062 ("XSS protection: Hugo templates auto-escape by default, manual HTML sanitization for webmention content") plus `rel="noopener"` together prevent both reverse-tabnabbing and XSS via webmention sender content. Verification: `grep` the rendered article page for any `<a` inside `class="webmention"` and confirm each has `rel="noopener external"` (or equivalent including `noopener`).

7. **Webmention count displayed below article title** (e.g., "3 replies"). Implementation: inside `single.html`'s `<div class="box-content">` (lines 60–64 of the article branch), add a new line **after the existing subtitle `<p>` (line 62) and before `{{ .Content }}` (line 63)**:
   ```go-html-template
   {{- $mentions := index .Site.Data.webmentions_by_article .RelPermalink | default (slice) -}}
   {{- if gt (len $mentions) 0 }}
   <p class="article-meta webmention-count-line">
     <a href="#webmentions" title="Zu den Antworten und Erwähnungen springen">
       <svg class="ri-1x" aria-hidden="true">
         <use xlink:href="{{ "fonts/remixicon/remixicon.symbol.svg" | relURL }}?t={{ .Site.Params.remixicon_version }}#chat-3-line"></use>
       </svg>
       {{ len $mentions }} {{ if eq (len $mentions) 1 }}Antwort{{ else }}Antworten{{ end }}
     </a>
   </p>
   {{- end }}
   ```
   Anchor target `#webmentions` is set on the `<section>` rendered by AC #1's partial (`<section id="webmentions" class="webmentions">…</section>`). German pluralisation: `1 Antwort` vs `N Antworten` (matches the site's German UI). When zero webmentions, the count line is **NOT rendered** at all (avoids showing "0 Antworten" which is meaningless to readers). Sibling-pattern reference: Story 2.2 lines 75–80 deliberated heart-button placement and chose sidebar; this story differs because the AC explicitly says "below article title" — the location is fixed by the AC, not a dev choice.

8. **XSS protection for webmention reply content** (testability guard, derived from architecture line 1062 + ASR-003 in `test-design-system.md` lines 152). The reply `content` field comes from third-party senders via webmention.io and is potentially attacker-controlled. Implementation requirement: when rendering `.content` inside a `reply` entry, **either** (a) use Hugo's default auto-escape and accept that any HTML in the content (links, formatting) is rendered as literal text — simpler, safer, slightly worse UX; **or** (b) use `safeHTML` only after passing through Hugo's `htmlEscape` followed by a deterministic allow-list pattern. **Recommended: option (a) auto-escape (default behavior).** Reason: Story 3.2's `process-webmentions.js` is the right place to do HTML sanitization (server-side, with a real allow-list library like `sanitize-html` if needed). At the template level, treat content as plain text. If senders include URLs in their reply, they render as text; readers can copy them. For Phase 1A this trade-off is acceptable. **Decision documented:** option (a) used. Story 3.2 may revisit and add `sanitize-html` to the processing pipeline if reply quality suffers.

9. **Mock fixture file for development** (testability guard, derived from epics-md "Implementation Note (Mock Data)" at lines 326). Until Story 3.2 lands, `data/webmentions_by_article.json` does not exist. Implementation requirement: create a fixture file at `data/webmentions_by_article.json` (committed to main) covering all four type-groups so AC #2's grouping logic can be visually verified. **Important coordination:** the architecture's Critical Agent Rule #3 says "NEVER commit `data/*.json` files to main branch" because Story 3.2's daily fetch produces them on the `data-updates` branch. **This story creates an exception** — the fixture is committed to main as a development crutch and **must be removed (or renamed `.example`) before Story 3.2 lands** so that the daily fetch can replace it without conflict. **Cleanup strategy (pick one at implementation time):**
   - **(a) Rename to `.example` on merge:** rename to `data/webmentions_by_article.example.json` after layout is verified, add a README note in `data/README.md` (create if missing), and Hugo will not pick up the `.example` extension.
   - **(b) Delete on merge:** remove the fixture entirely once visual verification is complete and rely on the empty-state path (AC #5) for production until 3.2 lands.
   - **(c) Add a `.gitignore` rule for `data/*.json`** before merge so future fetches don't accidentally commit to main — but keep the file locally for dev. **Recommended option:** (a) rename to `.example` — preserves the documented sample shape for future devs and onboarding. Document the chosen path in completion notes.

   Fixture file content (verbatim — all four type-groups represented; replace `/articles/EXISTING-ARTICLE-SLUG/` with a real article permalink from `content/articles/`):
   ```json
   {
     "/articles/EXISTING-ARTICLE-SLUG/": [
       {
         "type": "reply",
         "author": "Jane Doe",
         "author_url": "https://janedoe.example/",
         "author_photo": "https://janedoe.example/avatar.jpg",
         "content": "Schöner Artikel! Ich sehe das ähnlich.",
         "url": "https://janedoe.example/posts/reply-to-article-time/",
         "published": "2026-04-15T10:30:00Z"
       },
       {
         "type": "reply",
         "author": "Bob Smith",
         "author_url": "https://mastodon.social/@bob",
         "author_photo": "https://files.mastodon.social/accounts/avatars/bob.jpg",
         "content": "Interessante Perspektive!",
         "url": "https://mastodon.social/@bob/12345",
         "published": "2026-04-16T14:00:00Z"
       },
       {
         "type": "like",
         "author": "Alice Chen",
         "author_url": "https://alicechen.example/",
         "author_photo": "https://alicechen.example/avatar.png",
         "url": "https://alicechen.example/likes/12345",
         "published": "2026-04-17T08:15:00Z"
       },
       {
         "type": "repost",
         "author": "Carlos García",
         "author_url": "https://micro.blog/carlos",
         "url": "https://micro.blog/carlos/repost/67890",
         "published": "2026-04-18T16:45:00Z"
       },
       {
         "type": "mention",
         "author": "Dana Müller",
         "author_url": "https://danamueller.example/",
         "url": "https://danamueller.example/articles/related-thoughts/",
         "published": "2026-04-19T09:00:00Z"
       }
     ]
   }
   ```
   Empty-state path (AC #5) verification: temporarily empty the fixture to `{}` (or pick a different article URL from the site that has no entries) and confirm the partial renders the empty-state message instead of the grouped sections.

10. **No regression to existing single-page layouts** (testability guard). Diff `public/articles/<existing-post>/index.html` before and after the change — only the new webmention count line (AC #7) inside `box-content`, the new `<section id="webmentions">…</section>` block at the article footer (AC #1), and any imported SCSS additions should differ. Existing card variants (`.is-horizontal`, `.is-log`, `.has-image`), the info widget (lines 76–131), the TOC widget (lines 134–144), the series widget (lines 146–175), the related widget (lines 178–193), and the author widget (lines 196–214) render byte-equivalent (or equivalent) to pre-change. Critical agent rule reminder: "NEVER modify existing card variants" applies — webmention display is purely additive.

11. **Build still succeeds cleanly** (testability guard). `hugo --quiet --environment production --minify` exits 0 with no template-execution errors, no missing-variable warnings, no unresolved partial references. The new partial, SCSS file, and fixture data file all integrate without breaking existing build. Specific edge cases to verify:
    - Build with the fixture present → AC #2 grouping renders correctly.
    - Build with the fixture absent → AC #5 empty-state renders for all articles (no errors, no missing-data warnings).
    - Build for an article whose permalink is NOT in the fixture → AC #5 empty-state renders for that article specifically while other articles still show webmentions.
    - Build with malformed fixture (e.g., missing `type` field) → either build errors cleanly OR partial gracefully skips the malformed entry. Document chosen behavior in completion notes.

### AC Source & Reconciliation Note

ACs 1–7 are derived verbatim from `docs/1-planning/epics.md#Story-2.4-Webmention-Display-Component` (lines 303–326 of `epics.md`). ACs 8–11 are testability/regression guards added by the create-story workflow (XSS prevention per architecture line 1062 + ASR-003; mock fixture file per epics' Implementation Note; byte-equivalent unchanged-layout guard; clean prod build). They are NOT in the original epics list — they exist solely to make ACs 1–7 verifiable and to hold the line on architecture's critical agent rules ("NEVER modify existing card variants", "ALWAYS use `| default` when accessing data files", manual HTML sanitization for webmention content).

**Convention reconciliation (epics AC #1 wording vs. project layout):** Epics AC #1 says `'"Replies & Mentions" section added to article footer'`. Project convention places page-level engagement in `layouts/_partials/widgets/*.html` partials, mounted from `layouts/single.html`. The "article footer" in the AC maps to "after the box-footer series block, at the end of the article column in single.html's `articles` branch". Rendered effect is identical.

**Heading language reconciliation (English AC text vs. German UI):** Epics AC #1 uses the English heading `"Replies & Mentions"`, but `single.html` and `datenschutz.md` use German UI strings ("Artikel", "Übersicht", "Serie", "Ähnliche Artikel", "Webmentions"). **Decision:** use German heading `Antworten & Erwähnungen` for the section, German type-group headings (`Antworten`, `Reposts`, `Erwähnungen`, `Likes`), and German empty-state message. AC source intent is the section's existence and grouping, not the literal English wording — same approach Story 2.2 used for the heart button's `aria-label="Diesen Artikel mit einem Herz markieren"` rather than the English AC literal. Document the language choice in completion notes.

**Webmention HTML content rendering (AC #3 vs. AC #8):** AC #3 says "reply text (if applicable)". The webmention.io API returns `content.html` (HTML) and `content.text` (plain text) per architecture lines 862–865. Story 3.2 will choose which field to put in the processed `data/webmentions_by_article.json` `content` field. **For this story:** assume `content` is **plain text** (not HTML) and let Hugo auto-escape. If Story 3.2 chooses to ship sanitized HTML, this story's template can be updated then to add `safeHTML` after sanitization. For now, plain text + auto-escape is the safe default. See AC #8 for the full rationale.

[Source: docs/1-planning/epics.md#Story-2.4-Webmention-Display-Component (lines 303–326) — seven ACs verbatim, FR-012 coverage, GitHub Issue #145 (gemeinsam mit Story 2.3)]
[Source: docs/1-planning/prd/03a-functional-requirements.md (lines 92–96) — FR-012 (Webmention Display): "Webmentions grouped by type and displayed in article footer"]
[Source: docs/2-solutioning/digital-garden-integration-architecture.md (lines 296–308) — Hugo data file integration pattern (`.Site.Data.webmentions_by_article` lookup)]
[Source: docs/2-solutioning/digital-garden-integration-architecture.md (lines 414–469) — Pattern 2: Dual Anonymous Engagement System — webmentions are the federated half]
[Source: docs/2-solutioning/digital-garden-integration-architecture.md (lines 871–902) — webmentions_by_article.json canonical schema: type/author/author_url/author_photo/content/url/published]
[Source: docs/2-solutioning/digital-garden-integration-architecture.md (line 1062) — XSS protection: manual HTML sanitization for webmention content]
[Source: docs/2-solutioning/digital-garden-integration-architecture.md (lines 762–771) — Critical Agent Rules: NEVER modify card variants, ALWAYS use `| default` on data lookups]
[Source: docs/2-solutioning/test-design-system.md (lines 152, 408–419) — ASR-003 XSS Prevention via Playwright injection attempts]
[Source: docs/sprint-artifacts/epic-2/2-3-webmention-endpoint-setup.md — sibling story (drafted): establishes head.html-vs-baseof.html reconciliation pattern, AC source separation pattern, privacy-policy section already added for webmentions]

## Tasks / Subtasks

- [x] **Create webmention display partial** (AC: 1, 2, 3, 4, 5, 6) [Source: layouts/_partials/widgets/]
  - [x] Create new file `layouts/_partials/widgets/webmentions.html`. Project convention places page-level partials in `_partials/widgets/` (`series.html`, `pagination.html`, `archive.html`, `heart-button.html` from Story 2.2). The architecture-doc sketch (`_partials/webmentions.html`, flat) is reconciled to `_partials/widgets/webmentions.html` for project-convention consistency (same reconciliation Story 2.2 made for `heart-button.html`).
  - [x] Partial template (verbatim baseline; refine class names if conflicts arise):
    ```go-html-template
    {{- /* Webmention display — Story 2.4 (FR-012). Renders grouped webmentions from data/webmentions_by_article.json. */}}
    {{- $mentions := index .Site.Data.webmentions_by_article .RelPermalink | default (slice) -}}

    <section id="webmentions" class="webmentions box-footer mt-6">
      <h2 class="title is-4">Antworten &amp; Erwähnungen</h2>

      {{- if eq (len $mentions) 0 -}}
        <p class="webmentions__empty">Noch keine Antworten. Sende einen Webmention!</p>
      {{- else -}}

        {{- /* Group by type — order matters: replies first, then reposts, mentions, likes. */}}
        {{- $replies := where $mentions "type" "reply" -}}
        {{- $reposts := where $mentions "type" "repost" -}}
        {{- $likes   := where $mentions "type" "like" -}}
        {{- $generic := where $mentions "type" "mention" -}}

        {{- with $replies }}
          {{ partial "widgets/webmention-group" (dict "items" . "heading" "Antworten" "type" "reply") }}
        {{- end }}
        {{- with $reposts }}
          {{ partial "widgets/webmention-group" (dict "items" . "heading" "Reposts" "type" "repost") }}
        {{- end }}
        {{- with $generic }}
          {{ partial "widgets/webmention-group" (dict "items" . "heading" "Erwähnungen" "type" "mention") }}
        {{- end }}
        {{- with $likes }}
          {{ partial "widgets/webmention-group" (dict "items" . "heading" "Likes" "type" "like") }}
        {{- end }}

      {{- end -}}
    </section>
    ```
  - [x] Create a small inner partial at `layouts/_partials/widgets/webmention-group.html` to render one type-group. **Alternative considered:** inline the group rendering as a `range` block four times in the parent partial. **Decision:** factor into a sub-partial — DRY (four near-identical groups) and the `dict`-based call signature is cheap. Sub-partial template:
    ```go-html-template
    {{- /* Inner partial: one type-group of webmentions. Receives dict {items, heading, type}. */}}
    <section class="webmentions__group webmentions__group--{{ .type }}">
      <h3 class="title is-5 webmentions__group-heading">{{ .heading }} ({{ len .items }})</h3>
      <ul class="webmentions__list">
        {{- range .items -}}
          <li>
            <article class="webmention" data-wm-type="{{ .type }}">
              {{- with .author_photo }}
                <img class="webmention__avatar" src="{{ . }}" alt="" loading="lazy" width="48" height="48">
              {{- end }}
              <div class="webmention__body">
                <a class="webmention__author"
                   href="{{ .author_url }}"
                   rel="noopener external"
                   target="_blank">{{ .author }}</a>
                {{- if and (eq .type "reply") .content }}
                  <p class="webmention__content">{{ .content }}</p>
                {{- end }}
                <a class="webmention__source"
                   href="{{ .url }}"
                   rel="noopener external"
                   target="_blank"
                   title="Quelle ansehen">
                  <time datetime="{{ .published }}">{{ dateFormat ":date_long" .published }}</time>
                </a>
              </div>
            </article>
          </li>
        {{- end -}}
      </ul>
    </section>
    ```
  - [x] **XSS guard reminder (AC #8):** the `{{ .content }}` output is **NOT** wrapped in `safeHTML` — Hugo's default auto-escape applies. Webmention sender's HTML is rendered as plain text (e.g., `<script>` becomes `&lt;script&gt;`). This is the deliberate choice per AC #8.
  - [x] **Avatar fallback note:** `{{ with .author_photo }}` skips emission when the field is empty/missing — webmention.io sends `author_photo: ""` (empty string) for senders without avatars. The `with` block treats empty string as falsy, so no `<img src="">` is rendered. If `.author_photo` is absent entirely from the JSON object, Hugo's `index .` lookup returns nil, also falsy. Both paths lead to no `<img>` emit — acceptable.
  - [x] **Date format reminder:** `dateFormat ":date_long"` uses Hugo's locale-aware format spec. Site language is German (`languageCode: de`), so output will be e.g. `15. November 2025` for `2025-11-15T10:00:00Z`. Verify in build output. If the locale produces unexpected English output, fall back to `time.Format "02. January 2006"` with hardcoded German month names.

- [x] **Mount webmention section at article footer** (AC: 1) [Source: layouts/single.html]
  - [x] Open `layouts/single.html` and locate the article branch `{{ else if eq .Page.Type "articles" }}` at line 34.
  - [x] **Insertion point:** after the existing `box-footer` series block at lines 66–70, **after the closing `</article>` tag (line 71)**, but **before** the closing `</div>` of the main column (line 72). Reasoning: the section is conceptually a sibling of the article box, not nested inside it — webmentions are about the article but live outside its body. Visually they appear "below the article" which matches the AC's "article footer" wording.
  - [x] Snippet to insert (verbatim):
    ```go-html-template
                </article>

                {{- /* Webmention display — Story 2.4 (FR-012) */}}
                {{ partial "widgets/webmentions" . }}

            </div>
    ```
    (Existing `</article>` at line 71 stays; `{{ partial }}` line is new; existing `</div>` at line 72 stays.)
  - [x] **Whitespace control:** use `{{-` (left-trim) on the partial call to avoid extra blank lines in rendered HTML. Diff `public/articles/<existing-post>/index.html` before vs. after — only the new section block + count line should differ.
  - [x] **Logs question (out of scope):** AC #1 specifies "article footer". Logs (`Type == "logs"`) currently do not have a single-page layout in `single.html` (only `Type == "page"` and `Type == "articles"` branches exist; lines 2 and 34). Logs are list-only per the existing template structure. **This story does NOT add webmention display to logs** — webmentions are received per-URL, and if logs have no detail page they have no permalink to receive mentions for. Story 2.3 (webmention.io endpoint) emits the discovery `<link>` site-wide via `head.html`, so logs are technically discoverable; but display is gated on a page existing. Defer logs-webmentions to a future story (or out of scope entirely). Document the deferral in completion notes.

- [x] **Add webmention count line below article title** (AC: 7) [Source: layouts/single.html, line 60–64]
  - [x] Open `layouts/single.html`, locate the article branch's `<div class="box-content">` block (lines 60–64).
  - [x] **Insertion point:** after the subtitle `<p>` line (line 62) and before `{{ .Content }}` (line 63).
  - [x] Snippet to insert (verbatim):
    ```go-html-template
                            {{- $mentions := index .Site.Data.webmentions_by_article .RelPermalink | default (slice) -}}
                            {{- if gt (len $mentions) 0 }}
                            <p class="article-meta webmention-count-line">
                                <a href="#webmentions" title="Zu den Antworten und Erwähnungen springen">
                                    <svg class="ri-1x" aria-hidden="true">
                                        <use xlink:href="{{ "fonts/remixicon/remixicon.symbol.svg" | relURL }}?t={{ .Site.Params.remixicon_version }}#chat-3-line"></use>
                                    </svg>
                                    {{ len $mentions }} {{ if eq (len $mentions) 1 }}Antwort{{ else }}Antworten{{ end }}
                                </a>
                            </p>
                            {{- end }}
    ```
  - [x] **Pluralisation:** German singular `Antwort` for `len == 1`, plural `Antworten` for all other cases. There is no "0 Antworten" case (the entire block is gated on `gt (len $mentions) 0`).
  - [x] **Anchor target:** `#webmentions` matches the `<section id="webmentions">` from the partial in the previous task. Clicking the count line scrolls down to the full webmentions section.
  - [x] **Icon choice:** Remix Icon's `chat-3-line` is a standard speech-bubble icon. Verify it exists in `static/fonts/remixicon/remixicon.symbol.svg` (Remix Icon includes hundreds of `chat-*` variants by default). If absent, fall back to `chat-1-line` or any other available `chat-*` icon — document the choice in completion notes.
  - [x] **Single-line vs. multi-element:** the count line is one paragraph with one link containing icon + text. If the project's typography conventions favor a different pattern (e.g., a separate `<small>` element, or grouping with reading-time and date), match that pattern. **Recommended:** keep as a separate `.article-meta` paragraph adjacent to subtitle — the line stands out as a clickable affordance to jump to webmentions.
  - [x] **Duplicate data lookup:** the partial in the footer also does `index .Site.Data.webmentions_by_article .RelPermalink`. Hugo evaluates this each time at template render — it's a pure data lookup, no I/O cost (the JSON file is parsed once at site load). **Decision:** accept the duplicate lookup for code locality; do not pass `$mentions` from `single.html` to the partial as a parameter (would require partial-arg refactor — minor complexity, marginal benefit).

- [x] **Create webmention SCSS** (AC: 1, 2, 3) [Source: assets/scss/elements/]
  - [x] Create new file `assets/scss/elements/webmentions.scss` (architecture spec at line 87 already designates this filename and location).
  - [x] Baseline SCSS (refine to match site theme — cards use `.box`, dark theme with `$light` text on `$dark` backgrounds):
    ```scss
    @use "../vars/helpers";

    .webmentions {
      margin-top: 3rem;

      &__empty {
        font-style: italic;
        opacity: 0.7;
      }

      &__group {
        margin-bottom: 2rem;

        &-heading {
          margin-bottom: 1rem;
        }
      }

      &__list {
        list-style: none;
        padding: 0;
        margin: 0;
      }
    }

    .webmention {
      display: flex;
      gap: 1rem;
      margin-bottom: 1.5rem;
      padding: 1rem;
      border-left: 3px solid helpers.$gold-light;

      &__avatar {
        flex: 0 0 auto;
        width: 48px;
        height: 48px;
        border-radius: 50%;
        object-fit: cover;
      }

      &__body {
        flex: 1 1 auto;
      }

      &__author {
        font-weight: 600;
        display: block;
      }

      &__content {
        margin: 0.5rem 0;
      }

      &__source {
        font-size: 0.85em;
        opacity: 0.75;
      }

      // Type-specific accent (optional)
      &[data-wm-type="like"] {
        border-left-color: helpers.$gold;
      }
      &[data-wm-type="repost"] {
        border-left-color: helpers.$gold-light;
      }
    }

    .webmention-count-line {
      font-size: 0.9em;
      margin-bottom: 0.5em;

      a {
        display: inline-flex;
        align-items: center;
        gap: 0.4em;
      }
    }
    ```
  - [x] **Verify `helpers.$gold-light` and `helpers.$gold` exist** in `assets/scss/vars/`. From the existing SCSS imports (`assets/scss/main.scss` lines 9–25), `helpers` is the canonical vars module. If the gold variables are absent or named differently, fall back to Bulma color tokens (`$primary`, `$light`) — match the convention used by `assets/scss/elements/badge.scss`.
  - [x] **Avoid existing class conflicts:** before writing CSS, grep `assets/scss/` for any existing `.webmentions` or `.webmention` class. Expected: none (architecture line 87 says `webmentions.scss` is NEW). If present, namespace with `.webmention-feed` or similar.
  - [x] **No mobile-specific media queries needed yet** — the layout is a flex row that wraps gracefully on narrow viewports. If visual regression at mobile widths shows issues during smoke test, add a `@include helpers.mobile { … }` block to stack avatar above body.

- [x] **Wire SCSS into main.scss** (AC: 11) [Source: assets/scss/main.scss]
  - [x] Open `assets/scss/main.scss`.
  - [x] Locate the existing `// Elements` section (lines 27–33 of `main.scss`):
    ```scss
    // Elements
    @use "elements/badge";
    @use "elements/box";
    @use "elements/button";
    @use "elements/pagination";
    @use "elements/ribbon";
    @use "elements/search";
    @use "elements/tooltip";
    ```
  - [x] Append a new `@use "elements/webmentions";` line at the end of the elements block (alphabetically sorted: `webmentions` goes after `tooltip`):
    ```scss
    @use "elements/tooltip";
    @use "elements/webmentions";
    ```
  - [x] **Verify no namespace clash:** Sass `@use` namespaces by filename (without extension), so `elements/webmentions` becomes accessible as `webmentions` namespace by default. The new file does not export any public Sass functions/mixins, so no namespace usage downstream — a basic top-level import is sufficient.
  - [x] **Verify no SCSS import cycles:** the new file uses `@use "../vars/helpers"` — `helpers` is already used by base/elements/layout — no new cycle.
  - [x] Run `hugo --quiet --environment production` once to confirm SCSS compiles (postCSS + dartsass pipeline at `head.html` lines 18–22). Errors from missing `@use` or namespace clashes appear here.

- [x] **Create mock webmentions fixture file** (AC: 9) [Source: data/]
  - [x] **Create `data/` directory at project root** (does not currently exist — verified via `ls` of project root). Hugo recognizes this directory automatically; no config change needed.
  - [x] **Pick a target article permalink** to seed the fixture. Run `hugo list all` (or grep `content/articles/`) for an existing article — pick one with a stable permalink that won't change. Replace `/articles/EXISTING-ARTICLE-SLUG/` in the fixture below with the chosen real permalink (must include trailing slash per architecture line 838 "Key: Article permalink (with trailing slash)").
  - [x] Create `data/webmentions_by_article.json` with the verbatim content from AC #9 (above) — five entries spanning replies (×2), like, repost, mention to verify all four type-group renders work.
  - [x] **Cleanup decision (per AC #9):** at implementation time, decide between rename-to-`.example`, delete, or `.gitignore` and document in completion notes. **Recommended: rename to `.example` on merge** — preserves the documented sample shape for future devs.
  - [x] **Coordination with Critical Agent Rule #3** (`digital-garden-integration-architecture.md` line 766: "NEVER commit data/*.json files to main branch"): the fixture's commit-to-main is an explicit, time-boxed exception for AC #9 development support. Document the exception in completion notes; flag in the eventual Story 3.2 implementation that it expects this file to NOT exist on main.
  - [x] **Optional enhancement: a `data/README.md`** explaining the fixture / cleanup convention. Sample content:
    ```markdown
    # data/

    Generated daily by GitHub Actions (Story 3.1, 3.2, 3.3) on the `data-updates` branch.
    Files in this directory should NOT be committed to `main` branch (per architecture rule #3).

    ## Exception: development fixtures

    During development of Story 2.4 (Webmention Display), `webmentions_by_article.example.json` is committed
    here for visual verification of the webmention display partial. Hugo does NOT load `.example.json` files
    automatically; rename to `.json` only for local testing.
    ```

- [x] **Visual smoke test (manual)** (AC: 1, 2, 3, 5, 7, 11)
  - [x] Run `hugo server --quiet` (development).
  - [x] Navigate to the article whose permalink matches the fixture key (e.g., `http://localhost:1313/articles/EXISTING-ARTICLE-SLUG/`).
  - [x] Verify under article title: the webmention count line ("3 Antworten" or similar) appears between subtitle and `<article content>`. Click the count link → page should scroll to `#webmentions`.
  - [x] Verify at the bottom of the article: a section with heading `Antworten & Erwähnungen` and four type-groups: `Antworten (2)`, `Reposts (1)`, `Erwähnungen (1)`, `Likes (1)`. Each entry shows author name (linked, opens in new tab), avatar (where provided in fixture), reply text (only on `reply` type), and source-link with date.
  - [x] **Test empty-state (AC #5):** navigate to a different article (any article whose permalink is NOT in the fixture). Verify:
    1. NO webmention count line appears below title.
    2. The webmentions section IS rendered, with heading and the empty-state message `Noch keine Antworten. Sende einen Webmention!`.
  - [x] Open DevTools → Elements panel → expand the webmentions section → verify `<a>` tags inside `.webmention` blocks all have `rel="noopener external"` and `target="_blank"` (AC #6 verification).

- [x] **CSP regression check (defensive)** (AC: 11) [Source: config/_default/params.yaml]
  - [x] **Avatar images load from third-party domains** (e.g., `mastodon.social/avatars/...`). Hugo CSP `img-src` directive must allow these. Read `config/_default/params.yaml` `csp.imgsrc` after editing — confirm it contains either `*` (allow-all images) or a sufficiently broad pattern that admits webmention sender avatars.
  - [x] **Current CSP state:** Phase 0 already configured CSP. Re-read `params.yaml` to confirm `csp.imgsrc` (line ~26 or wherever the block is) has reasonable allowance. **Likely outcome:** `csp.imgsrc` is already permissive (Hugo default templates use `'self' data: https:` or similar, allowing all HTTPS images). If `imgsrc` is restrictive (e.g., only `'self'`), this story may need to widen it — flag as a follow-up rather than block.
  - [x] **Decision rule:** if `csp.imgsrc` already includes `https:` (any HTTPS image), no CSP change needed in this story. If it's restrictive, document the gap in completion notes; either extend in this story (1-line edit to `params.yaml`) or punt to Epic 9 polish.

- [x] **Build smoke test (production)** (AC: 11)
  - [x] Run `hugo --quiet --environment production --minify` from project root → exit code 0, no warnings about missing `data.webmentions_by_article` or undefined templates.
  - [x] Open the resulting `public/articles/EXISTING-ARTICLE-SLUG/index.html` → grep for `<section id="webmentions"` — present exactly once. Grep for `webmention-count-line` — present exactly once.
  - [x] Open `public/articles/<other-article-without-fixture-key>/index.html` → grep for `<section id="webmentions"` — present (empty-state). Grep for `webmention-count-line` — absent (no count when zero mentions).
  - [x] Diff `public/articles/<existing-post>/index.html` before and after the change — only the new webmention count line, the new section block, and the SCSS bundle hash should differ.

- [x] **Optional: add build assertion to test infrastructure** (AC: 11; only if Story 1.1's test infra has landed)
  - [x] If `tests/build/build-smoke.test.mjs` exists (Story 1.1 status: `ready-for-dev` at draft time — may be implemented by the time this story runs):
    - [x] Add a `node:test` assertion that builds the site, opens the fixture-targeted article HTML, and asserts the rendered output contains `<section id="webmentions"`, the four type-group headings (`Antworten`, `Reposts`, `Erwähnungen`, `Likes` — only the populated ones based on fixture), and the webmention-count-line.
    - [x] Add a second assertion that opens an article NOT in the fixture and confirms the empty-state message renders and the count line is absent.
  - [x] If the test infra has NOT landed: rely on manual smoke test above. Do NOT block on Story 1.1.

- [x] **Optional: Playwright XSS guard test** (AC: 8; only if Playwright is set up — see test-design-system.md line 152, ASR-003)
  - [x] If Playwright is configured (Story 1.1 may bootstrap; otherwise Epic 9):
    - [x] Add a fixture entry with `content: "<script>alert('xss')</script>"` and `content: "<img src=x onerror=alert(1)>"` — two attempts.
    - [x] Run a Playwright test that loads the article page, asserts no `alert()` triggers, and confirms the rendered output is the literal escaped text (`&lt;script&gt;` etc.).
  - [x] If Playwright is NOT set up: rely on Hugo's default auto-escape (which is correct by construction — see AC #8). No manual XSS test needed for this story.

- [x] **Documentation**
  - [x] Add inline comment in `webmentions.html` partial referencing this story (already in baseline template above: `{{- /* Webmention display — Story 2.4 (FR-012). … */}}`).
  - [x] Document in completion notes:
    1. Chosen heading language (German recommended).
    2. Chosen XSS approach for AC #8 (recommended: option (a) auto-escape).
    3. Chosen fixture cleanup path for AC #9 (recommended: rename to `.example`).
    4. Logs deferral decision (webmentions display NOT mounted on logs).
    5. CSP `imgsrc` state (if widened, why; if not, current state is sufficient).
    6. Whether `data/README.md` was added.

### Review Findings

- [x] [Review][Decision] Icon identifier discrepancy — resolved: `question-answer-line` is correct (chat-3-line does not exist in the installed Remix Icon sprite); Completion Notes updated to match code. [`layouts/single.html` sidebar block, Completion Notes AC #7]
- [x] [Review][Patch] Missing `published` guard — `time.Format ":date_long"` is called unconditionally on `.published`; a nil or non-ISO-8601 value produces a zero-time output or template error at build time. Wrap with `{{- with .published }}…{{- else }}…{{- end }}`. [`layouts/_partials/widgets/webmention-group.html:32`]
- [x] [Review][Patch] Missing author field guards — `href="{{ .author_url }}"` and `{{ .author }}` are emitted unconditionally; an empty/nil `author_url` produces `href=""` (page-reload link) and an empty `author` produces an inaccessible unlabelled link. Add nil/empty guards or render plain text as fallback. [`layouts/_partials/widgets/webmention-group.html:20-23`]
- [x] [Review][Patch] `noreferrer` missing from external link `rel` — `rel="noopener external"` on author and source links omits `noreferrer`, leaking the article URL as `Referer` to every third-party domain linked from webmention entries. Add `noreferrer` to both link elements. [`layouts/_partials/widgets/webmention-group.html:22,29`]
- [x] [Review][Patch] No-op `@include helpers.translate(0, 0)` in sidebar CSS — emits `transform: translate(0, 0)` which does nothing visually but promotes the SVG to a compositing layer unnecessarily. Remove or replace with explicit `vertical-align` alignment. [`assets/scss/elements/webmentions.scss:~109`]
- [x] [Review][Defer] Datenschutz drops "personenbezogenen Daten" catch-all — new text disclaims only IP addresses and cookies, leaving a coverage gap: author names, URLs, and photos are personal data under DSGVO that the site processes and displays. Story 2.5 should restore an equivalent catch-all or explicitly list what is processed. [`content/pages/datenschutz.md:78`] — deferred; Story 2.5 owns Datenschutz
- [x] [Review][Defer→Fixed 2026-05-10] Hardcoded article slugs in smoke tests — Story 2.4 assertions reference `rss-test` and `movie-test` by slug; renaming either article silently breaks the tests without touching webmention code. [`tests/build/build-smoke.test.mjs:835,887`] — resolved post-ship by deriving fixture slug at module-load from `data/webmentions_by_article.json` (first key) and finding the non-fixture article by enumerating `public-test/articles/` and excluding any slug present in the fixture data. Five `"rss-test"` literals replaced by the derived `webmentionFixtureSlug` constant; `"movie-test"` literal replaced by sorted-first non-fixture article picker.
- [x] [Review][Defer] AC #8 XSS smoke test validates only clean fixture data — fixture has no HTML payloads, so the test cannot verify Hugo's auto-escape is active; add an adversarial fixture entry (e.g., `content: "<script>alert(1)</script>"`) to make the assertion meaningful. [`tests/build/build-smoke.test.mjs:945`] — deferred; Playwright is the right venue; Story 3.2 for adversarial fixtures
- [x] [Review][Defer] RelPermalink key mismatch risk — `index .Site.Data.webmentions_by_article .RelPermalink` silently returns nil if the Story 3.2 data pipeline ever emits keys without trailing slash or with different case, showing the empty-state for every article with no build warning. [`layouts/_partials/widgets/webmentions.html:8`] — deferred; Story 3.2 controls key format

## Dev Notes

### Architectural Context

Story 2.4 is the **fourth implementation story of Epic 2** (Engagement Infrastructure) and the **first reader-facing webmention story**. While Story 2.3 was about enabling webmention reception (HTML metadata + webmention.io account), this story is about **rendering** the received webmentions. It depends on:

- **Story 2.3** (Webmention Endpoint Setup) — reception infrastructure must be live before there's anything to display. Status at draft time: `drafted`. Hard dependency: the webmention.io endpoint must be discoverable, OR the fixture file (AC #9) must seed display data for development.
- **Story 3.2** (Webmention Processing Script) — the canonical producer of `data/webmentions_by_article.json`. **Soft dependency** per epics line 324 ("Dependencies: Epic 3, Story 3.2 (webmention processing script) — soft dependency"). The fixture-file pattern (AC #9) breaks this dependency for Phase 1A: this story can ship before 3.2 lands, with the empty-state path verified for production until 3.2's daily fetch starts populating real data.

**Dataflow this story activates:**

```
data/webmentions_by_article.json (from Story 3.2 OR fixture from AC #9)
                │
                │  (Hugo build reads .Site.Data.webmentions_by_article)
                ↓
Article single page (layouts/single.html)
                │
                ├─ <p class="webmention-count-line">3 Antworten ↗</p>     (AC #7)
                │
                ↓
                <section id="webmentions">                                   (AC #1)
                  <h2>Antworten & Erwähnungen</h2>
                  <section class="webmentions__group--reply">              (AC #2)
                    <h3>Antworten (2)</h3>
                    <ul>
                      <li><article class="webmention">...</article></li>   (AC #3)
                      ...
                    </ul>
                  </section>
                  ...
                </section>
```

Until Story 3.2 lands, mentions arrive at webmention.io's dashboard (Story 2.3 confirmed) but do NOT appear on the live site (this story's rendering pipeline reads `data/*.json`, which 3.2 produces). The fixture file (AC #9) bridges this gap for development verification only — production will show empty-states for all articles until 3.2's daily fetch starts populating real data.

**Why this story is not blocked by Story 3.2:**

- AC #4 explicitly handles the missing-data path via `| default (slice)` — the empty-state UX (AC #5) is the production behavior until 3.2 ships. This is intentional: shipping the display infrastructure before the data pipeline is harmless and keeps the Epic 2 backlog moving.
- The fixture file (AC #9) lets the dev verify all the visual paths (grouping, avatars, type-specific rendering, count line, empty-state) without needing real webmention data.
- Story 2.3's privacy policy section already mentions webmention reception — readers visiting articles before 3.2 lands will see the "Noch keine Antworten" message, which is accurate (no mentions visible on site, even if some are queued at webmention.io).

[Source: docs/2-solutioning/digital-garden-integration-architecture.md (lines 414–469) — Pattern 2: Dual Anonymous Engagement System; webmentions are the federated half]
[Source: docs/2-solutioning/digital-garden-integration-architecture.md (lines 250–294) — Daily Rebuild Data Flow showing webmention.io → JSON → Hugo build → display]
[Source: docs/2-solutioning/digital-garden-integration-architecture.md (lines 871–902) — webmentions_by_article.json canonical schema]
[Source: docs/sprint-artifacts/epic-2/2-3-webmention-endpoint-setup.md#Architectural-Context — sibling story; establishes webmention.io account / CSP / privacy-policy patterns]

### Implementation: Hugo Data File Lookup, Server-Side Rendering

The webmention display mechanism is a Hugo template that reads `.Site.Data.webmentions_by_article` (a JSON-loaded data structure indexed by article permalink) and renders grouped HTML. **No JavaScript involved** — webmentions are baked into the static HTML at build time, so display is instant and works without JS.

**Why server-side rendering (not client-side fetch):**

- The site is JAMstack on GitHub Pages — no server runtime. Client-side fetch from webmention.io would mean exposing the public API endpoint to readers, hitting their privacy preferences (the IP that fetches webmentions is the reader's IP, not the build pipeline's).
- Architecture lock-in: the daily rebuild pipeline (Story 3.2) writes `data/webmentions_by_article.json` to the `data-updates` branch, which is checked out and merged into the build workspace. Hugo reads it at build time. Cache invalidation = next daily rebuild.
- Performance: zero runtime cost. Webmentions render with the rest of the article HTML at first paint.

**Trade-off accepted:** webmentions are at most ~24 hours stale (next daily build). For a digital garden with intentionally slow content evolution, this is acceptable. Real-time webmentions would require a different architecture (serverless function, Edge Worker, or client-side fetch with caching) — out of project scope.

[Source: docs/2-solutioning/digital-garden-integration-architecture.md (lines 296–308) — Hugo data file integration pattern]
[Source: docs/2-solutioning/digital-garden-integration-architecture.md (lines 250–294) — Daily Rebuild Data Flow]
[Source: docs/sprint-artifacts/epic-2/2-2-heart-button-component.md#Implementation — sibling pattern: hearts.js is client-side, webmentions are server-side, both render counts via .Site.Data.* lookup]

### Type-Group Order and Heading Choice

Epics AC #2 specifies the group order: **Replies, Reposts, Mentions, Likes**. This is reproduced verbatim in the partial template above. **Why this order:** replies have the highest information value (they're new content), reposts are amplification, mentions are passing references, likes are minimal-signal acknowledgment. Visually grouping highest-information types first matches reader expectations from social platforms.

**Why German headings (overriding AC #1's English "Replies & Mentions"):** the site's UI strings are German throughout (`single.html`, `head.html`, `datenschutz.md`). Using `Antworten & Erwähnungen` and `Antworten / Reposts / Erwähnungen / Likes` matches site convention. The AC's English wording is the **intent** ("a section grouping these types"); the implementation language follows site convention. Same approach Story 2.2 used for `aria-label="Diesen Artikel mit einem Herz markieren"` (overriding the epics' English "Heart this article" wording). Document the language choice in completion notes.

**Pluralization:** AC #7 example "3 replies" implies pluralization — implementation uses `{{ if eq (len $mentions) 1 }}Antwort{{ else }}Antworten{{ end }}`. German plural rules are simpler than English here (no special-case for 0; the entire block is gated on `gt (len $mentions) 0`). Subgroup headings show the count in parentheses: `Antworten (2)` — matches Bulma's typography conventions where small numeric annotations are in parens.

[Source: docs/1-planning/epics.md (lines 313–316) — AC #2 specifies the four type-groups and order]
[Source: docs/sprint-artifacts/epic-2/2-2-heart-button-component.md#AC-Source-Reconciliation-Note — sibling pattern: German UI overrides English epics wording]

### XSS Protection: Plain-Text Default

Architecture line 1062 explicitly flags webmention content as needing manual sanitization: "XSS protection: Hugo templates auto-escape by default, manual HTML sanitization for webmention content". ASR-003 in `test-design-system.md` confirms this is a critical (Score 6) security concern.

**This story takes the safest path: assume `content` is plain text and let Hugo auto-escape.**

Specifically:
- The template uses `{{ .content }}` (auto-escaped) — NOT `{{ .content | safeHTML }}`.
- Any HTML in the source (e.g., `<a href>` for inline links) renders as literal text: `&lt;a href=…&gt;…&lt;/a&gt;`.
- This is slightly worse UX (links don't render as links inside the reply), but it's bulletproof.
- Story 3.2's `process-webmentions.js` is the right place to add a real HTML sanitizer (e.g., `sanitize-html` npm package) — server-side, with an allow-list (e.g., `<a>`, `<strong>`, `<em>`, `<p>`, `<br>` only). When 3.2 ships sanitized HTML, this story's template can be updated to add `safeHTML` in a future story (or a follow-up edit on this same story).

**Why not just sanitize in the template:** Hugo doesn't ship a built-in HTML sanitizer with allow-list semantics. The closest is `htmlEscape` (escapes everything) or `safeHTML` (trusts everything). DIY sanitization in Go templates is brittle and easy to get wrong (e.g., `mso-tag` SVG injection bypasses, encoded escape chains, `data:` URIs in `href`). Server-side sanitization with a battle-tested npm library is the right tool.

**Verification:** the AC #8 task includes an optional Playwright test for two XSS payloads (`<script>` and `<img onerror>`). If Playwright is set up, run it. Otherwise, Hugo's auto-escape behavior is well-documented (see https://gohugo.io/templates/introduction/#variables — "All values are HTML-escaped by default") and the manual smoke test (which clicks a webmention link and verifies the rendered content is literal text) is sufficient.

[Source: docs/2-solutioning/digital-garden-integration-architecture.md (line 1062) — XSS protection note]
[Source: docs/2-solutioning/test-design-system.md (lines 152, 408–419) — ASR-003 XSS Prevention test approach]

### Data Schema and Empty-State Resilience

The canonical schema for `data/webmentions_by_article.json` is locked at architecture lines 871–902. Each entry has: `type`, `author`, `author_url`, `author_photo`, `content` (replies only), `url`, `published`. The partial assumes this exact shape — if Story 3.2 deviates, this story may need a follow-up edit to handle the schema delta.

**Empty-state cases (all handled by `| default (slice)` on the data lookup):**

1. **`data/webmentions_by_article.json` does not exist** — typical until Story 3.2 first runs. Hugo's `.Site.Data.webmentions_by_article` is nil; `index nil .RelPermalink` is nil; `| default (slice)` returns empty slice. Empty-state path renders.
2. **File exists but doesn't contain the article's permalink as a key** — typical for new articles before they accrue any mentions. `index $data .RelPermalink` returns nil; `| default (slice)` returns empty slice. Empty-state path renders.
3. **File exists, key exists, but the value is an empty array `[]`** — typical for an article that previously had mentions but they were filtered/deleted. `len` = 0. Empty-state path renders (not via `default`, but via the `if eq (len $mentions) 0` branch in the partial).
4. **Malformed JSON (file exists but not parseable)** — Hugo raises a build error. This is correct behavior: a malformed data file should fail the build, not silently render the wrong UI. Build error message will point at the file. AC #11's task notes this case explicitly.

**Critical agent rule reminder:** `digital-garden-integration-architecture.md` line 769: "ALWAYS add `| default` when accessing data files (graceful fallback)". This story strictly follows that rule for both the partial's `$mentions` lookup and the count-line's `$mentions` lookup in `single.html`.

[Source: docs/2-solutioning/digital-garden-integration-architecture.md (lines 871–902) — webmentions_by_article.json canonical schema]
[Source: docs/2-solutioning/digital-garden-integration-architecture.md (line 769) — Critical Agent Rule: ALWAYS use | default]
[Source: docs/2-solutioning/digital-garden-integration-architecture.md (lines 698–710) — Hugo data-file error handling pattern]

### Mock Fixture File: Time-Boxed Exception to Architecture Rule #3

Architecture's Critical Agent Rule #3 (line 766) says "NEVER commit `data/*.json` files to main branch (only to data-updates branch)". The reason: Story 3.2's daily GitHub Actions workflow commits `data/*.json` to a separate `data-updates` branch and copies them into the build workspace at runtime — the main branch should NOT carry generated data, to keep main's commit history clean.

**This story creates a deliberate, time-boxed exception** for fixture-driven development:

- **Why the exception is needed:** the partial's visual paths (grouping, avatars, count line, empty-state) cannot be verified end-to-end without sample data. Asking dev to manually create the fixture, run hugo server, then `git stash` before commit is fragile and easy to forget.
- **Why it's safe:** the fixture is renamed to `.example` (or deleted, or `.gitignore`'d) before the merge, per AC #9's cleanup strategy. By the time Story 3.2 lands, no `data/webmentions_by_article.json` exists on main; 3.2's workflow happily writes a fresh one to `data-updates`.
- **Coordination flag for Story 3.2:** when 3.2's developer reads its prerequisites, they should expect to NOT find `data/webmentions_by_article.json` on main. Document this expectation in this story's completion notes so the SM can carry it forward to 3.2's draft.

**Alternative considered: skip the fixture entirely.** Just ship the partial with the empty-state, and accept that visual verification of grouping requires either waiting for Story 3.2 OR temporarily editing `data/webmentions_by_article.json` locally without committing. **Rejected because:** AC #2 (grouping) and AC #3 (entry rendering) cannot be verified at story-implementation time without sample data. The risk of shipping a broken grouping logic that only manifests when 3.2 lands is unacceptable. The fixture exception is the lowest-friction path.

[Source: docs/2-solutioning/digital-garden-integration-architecture.md (line 766) — Critical Agent Rule #3]
[Source: docs/1-planning/epics.md (line 326) — Story 2.4 Implementation Note (Mock Data) explicitly endorses this approach]

### Avatar Privacy and CSP Considerations

Webmention sender avatars come from third-party domains (Mastodon instances, GitHub gravatars, personal blog hosts). Loading them in the article page means:

1. **Reader IP exposure to third parties:** every visit to an article with webmentions sends the reader's IP to whatever domain hosts the avatar. This is a small privacy leak — sender's identity is public anyway (they sent the webmention), and the reader is the one consuming the public webmention content.
2. **CSP `img-src` allowance:** the rendered `<img>` tag's `src` must be in `csp.imgsrc`. Phase 0 likely set `csp.imgsrc` permissively (typical: `'self' data: https:`). If it's restrictive, this story may need a CSP edit. Smoke test will reveal — if the browser console shows CSP violations on `<img>` loads, widen `csp.imgsrc` accordingly.
3. **Lazy loading:** the partial template uses `loading="lazy"` on avatars to defer load until scroll. Reduces above-the-fold load and avatar requests on bounce visits.

**Mitigations considered:**

- **Server-side avatar caching:** Story 3.2 could download avatars during the daily fetch and serve them from `static/avatars/`. **Not implemented in this story** — adds complexity, image-license issues (do we have permission to host third-party avatars?), storage growth. Defer to Epic 9 polish or Epic 7 advanced webmentions.
- **Image proxy:** route avatar requests through a proxy that strips the reader's IP. **Not implemented** — adds infrastructure, no proxy currently in stack.
- **Skip avatars entirely (text-only display):** safest privacy posture, slightly worse UX. **Decision:** render avatars when provided (the sender chose to publish their avatar; the reader is consuming public webmention content). Document the privacy trade-off in completion notes — privacy policy update may want to mention "external avatar images may be loaded from sender domains" in a future iteration of the Webmentions section (Story 2.5's broader refresh).

[Source: docs/2-solutioning/digital-garden-integration-architecture.md (lines 871–902) — schema includes `author_photo`]
[Source: docs/sprint-artifacts/epic-2/2-3-webmention-endpoint-setup.md#Privacy-Policy:-Add-Section-Now,-Story-2.5-Integrates-Later — privacy policy already mentions webmention reception; avatar display is an extension that may want a dedicated note in 2.5]

### Logs (`Type == "logs"`) Out of Scope

`single.html` has two type branches: `Type == "page"` (lines 2–32) and `Type == "articles"` (lines 34–217). **There is no `Type == "logs"` branch** — logs render only on the homepage / archive list, not as detail pages. This means logs have no permalink to receive webmentions for, and the webmention discovery `<link>` from Story 2.3 only rendered usefully on actual page URLs.

**Decision for this story:** webmention display is mounted ONLY on the article single-page (`Type == "articles"`). Logs are out of scope. If a future story adds log detail pages (or chooses to extend `single.html` with a `Type == "logs"` branch), that story can lift this partial and mount it there too. Document this scope decision in completion notes.

[Source: layouts/single.html (lines 2, 34) — only two type branches: page, articles]
[Source: docs/1-planning/epics.md (line 304) — AC #1 says "article footer" — applies only to articles, not logs]

### File Map (planned changes)

**NEW:**
- `layouts/_partials/widgets/webmentions.html` — top-level webmention display partial (~60 lines)
- `layouts/_partials/widgets/webmention-group.html` — inner partial, one type-group (~40 lines)
- `assets/scss/elements/webmentions.scss` — webmention styling (~80 lines)
- `data/webmentions_by_article.json` — mock fixture (until cleanup; AC #9)
- `data/README.md` — optional, documents data folder convention (AC #9 task)

**MODIFY:**
- `layouts/single.html` — add `{{ partial "widgets/webmentions" . }}` after article close tag (~3 lines added)
- `layouts/single.html` — add webmention count line below subtitle inside `box-content` (~10 lines added)
- `assets/scss/main.scss` — add `@use "elements/webmentions";` import (1 line added)

**EXPLICITLY UNCHANGED:**
- `layouts/_partials/_base/head.html` — already has webmention discovery `<link>` (Story 2.3); no edits needed
- `layouts/baseof.html` — no edits; partial inclusion routes via single.html
- `config/_default/params.yaml` — likely no edits (CSP `imgsrc` likely already permissive; verify in CSP regression task and only widen if needed)
- `archetypes/*` — no frontmatter changes (webmentions are received per-URL, not per-article frontmatter)
- `assets/js/*` — no JavaScript needed (server-side rendering only)
- `scripts/*` — no script changes (Story 3.2 owns process-webmentions.js)
- `.github/workflows/*` — no workflow changes (Story 2.6 + 3.2 own daily-rebuild.yml integration)

**EXTERNAL ACTIONS:**
- None. This story is purely template + SCSS + fixture data work — no third-party signups, no GitHub Secrets, no manual end-to-end test (the data flow is local-fixture-only until Story 3.2 lands).

### Critical Agent Rules (apply to this story)

From `digital-garden-integration-architecture.md` lines 762–771:

1. **NEVER modify existing card variants** — webmention display is mounted in `single.html` outside the existing card render flow; no `card.html` partial edits.
2. **ALWAYS add new features to card footer** — N/A (webmention is a section-level addition, not a card field; AC #1 and #7 explicitly position it in single.html, not card.html).
3. **NEVER commit `data/*.json` files to main branch** — **deliberate exception in this story** for the fixture file (AC #9). Cleanup before merge.
4. **ALWAYS use the `popularity-score.html` partial** — N/A (webmention display does not calculate popularity score; just renders mentions).
5. **NEVER use jQuery** — N/A (this story has zero JavaScript).
6. **ALWAYS add `| default` when accessing data files** — strictly followed: both lookups (`webmentions.html` partial and `single.html` count line) use `| default (slice)`.
7. **ALWAYS pin Hugo version in GitHub Actions** — N/A (this story doesn't touch workflow files).

[Source: docs/2-solutioning/digital-garden-integration-architecture.md (lines 762–771) — Critical Agent Rules]

### Project Structure Notes

- **No new directories** beyond `data/` (which will be created during this story; Hugo recognizes it automatically). Otherwise: existing `_partials/widgets/`, `assets/scss/elements/`, `layouts/single.html`.
- **Test infrastructure:** Stories 1.1 onward bootstrap `tests/build/` (node test runner) and `tests/e2e/` (Playwright). At time of drafting, those directories do not exist (Story 1.1 status: `ready-for-dev`). **If Story 1.1 has landed when this story is implemented:** add the optional build assertion (AC #11 task) and Playwright XSS test (AC #8 task). **If Story 1.1 has NOT landed:** rely on manual smoke test. Do NOT block on Story 1.1.
- **No data layer changes:** Hugo's data-files convention is built-in — `data/*.json` files are auto-loaded into `.Site.Data.<filename-without-extension>`. No config, no plugin, no schema declaration needed.

[Source: docs/sprint-artifacts/epic-1/1-1-growth-stage-frontmatter-field.md — test infra layout (`ready-for-dev`, not landed yet)]
[Source: docs/sprint-artifacts/epic-2/2-1-umami-analytics-integration.md#Project-Structure-Notes — test layering convention (manual smoke if test infra absent)]

### Test Strategy

Aligned with the 2-day epics estimate (epics.md line 328):

- **Manual smoke (primary)** — DevTools verification of:
  - Count line rendered correctly with German pluralization (AC #7)
  - Webmentions section structure: heading + four type-groups + entries (AC #1, #2, #3)
  - Empty-state on articles not in fixture (AC #5)
  - All external links have `rel="noopener external"` and `target="_blank"` (AC #6)
  - Avatar lazy-load and skip when `author_photo` empty (AC #3)
  - Reply text only on `type == "reply"` entries (AC #3)
  - Click-to-scroll: count line link → `#webmentions` section (AC #7)
- **Production build assertion (optional automation)** — if Story 1.1's `tests/build/build-smoke.test.mjs` is in place, add two assertions (fixture-targeted article + non-fixture article empty-state). Total: ~10 lines of test code.
- **Playwright XSS test (optional)** — if Playwright is configured, add the AC #8 XSS payload test (~20 lines). Otherwise rely on Hugo's auto-escape.
- **No client-side performance test** — this story has zero JavaScript on the webmention display path. No interactive performance to measure.
- **No CSP automated test** — manual DevTools console check during smoke test is sufficient (CSP violation would log to console).

### Learnings from Previous Story

**From Story 2.3 (Webmention Endpoint Setup) — Status: drafted (not yet implemented).**

The create-story workflow rule treats anything below `in-progress`/`review`/`done` as `"Previous story not yet implemented"`. Story 2.3 is `drafted`, so no implementation learnings (e.g., how the webmention.io account behaves in practice, how CSP interacts with the discovery link in production) exist to forward.

**However, Story 2.3's draft contains substantial design context that is directly load-bearing for Story 2.4:**

- **Webmention.io account verified for `article-time.de`** (Story 2.3 AC #2) — Story 2.4 assumes the account exists and is receiving mentions. The fixture file (AC #9) breaks this assumption for development verification, but production behavior depends on 2.3 landing first.
- **`<link rel="webmention">` in head.html** (Story 2.3 AC #1, planned location: lines 47–49 of `head.html`, adjacent to RSS link) — emits the discovery metadata that lets external blogs find the webmention.io endpoint. Story 2.4 does NOT touch `head.html`; it only consumes the data flow that Story 2.3 enabled at the discovery layer.
- **Privacy policy `## Webmentions` section** (Story 2.3 AC #5, in `content/pages/datenschutz.md`) — already documents webmention reception in German with GDPR Art. 6 Abs. 1 lit. f rationale. **Story 2.4 may want to extend this** with a sentence about avatar image loading from third-party domains (privacy implication). **Decision:** flag as a follow-up for Story 2.5 (Privacy Policy Page broader refresh) rather than edit `datenschutz.md` in this story. Story 2.5 already inherits Story 2.3's section as the authoritative initial copy.
- **CSP `connectsrc` includes `https://webmention.io`** (Story 2.3 AC #6 + Phase 0 Task 4.0) — already in place. Story 2.4 does NOT make any client-side fetches to webmention.io (server-side rendering only), so `connect-src` is irrelevant for this story. `img-src` allowance for sender avatars is the new CSP concern (see CSP regression task above).
- **`WEBMENTION_IO_TOKEN` GitHub Secret stored** (Story 2.3 AC #4) — token pre-positioned for Story 3.2's authenticated webmention.io calls. Story 2.4 does NOT consume the token (no client-side or build-time fetch).

**Cross-epic / sibling-draft patterns to reuse (relevant to this story):**

- **AC source separation (from Stories 2.1, 2.2, 2.3 drafts)** — ACs from epics.md verbatim are clearly labeled (1–7); testability/regression guards (8–11) are added below and tagged as such. Same convention.
- **`_base/`-and-`widgets/` partials convention (from Stories 1.3, 1.4, 1.5, 2.1, 2.2, 2.3)** — head content lives in `layouts/_partials/_base/head.html`; widget content (engagement, series, archive) lives in `layouts/_partials/widgets/`. This story creates `_partials/widgets/webmentions.html` + `_partials/widgets/webmention-group.html` per convention.
- **Heading language convention (from Stories 2.2, 2.3 drafts)** — site UI is German; English AC text is intent, not literal. Use German headings (`Antworten & Erwähnungen`, `Antworten`, `Reposts`, etc.) and document in completion notes.
- **Critical agent rule discipline (from Phase 0 + Story 2.1, 2.2, 2.3 drafts)** — `| default` on data lookups, no jQuery, no card-variant edits, no `data/*.json` to main except deliberate fixtures (AC #9 here mirrors the same exception pattern). Same convention.
- **Pre-stored secrets pattern (from Phase 0 Task 1.2 + Story 2.3 AC #4)** — `WEBMENTION_IO_TOKEN` was stored before Story 3.2 needed it. **This story differs:** no secrets needed (server-side template rendering, no API auth at any layer). The pattern doesn't apply here.
- **Defer to Story 2.5 for privacy-policy refinements (from Story 2.1 deferral, Story 2.3 inline-add-then-defer-to-2.5)** — this story does NOT edit `datenschutz.md`; any avatar-privacy disclosure note is a follow-up for 2.5.
- **Fixture file as time-boxed exception (NEW pattern in this story)** — extends the architecture's "NEVER commit data/*.json to main" rule with a documented exception for development support. This sets a precedent for future stories that need sample data before the producer story lands (e.g., Story 3.6 Most-Loved Widget might need a `data/popularity_scores.json` fixture before Story 3.3 lands).

**Pending review items (from previous stories):** None. No story in the project has reached `review` status yet, so no Senior Developer Review sections exist to forward.

[Source: docs/sprint-artifacts/sprint-status.yaml — current development_status (1-1 → 1-5: ready-for-dev; 2-1, 2-2: ready-for-dev; 2-3: drafted; 2-4 was the next backlog story, now drafted)]
[Source: docs/sprint-artifacts/epic-2/2-3-webmention-endpoint-setup.md — sibling story; establishes webmention.io reception, CSP, privacy-policy patterns]
[Source: docs/sprint-artifacts/epic-2/2-2-heart-button-component.md — sibling story; establishes engagement-display patterns, heart-button widget mounting in single.html, German UI override pattern]
[Source: docs/sprint-artifacts/epic-2/2-1-umami-analytics-integration.md — sibling story; establishes head.html-vs-baseof.html reconciliation pattern, AC source separation pattern]
[Source: docs/sprint-artifacts/epic-1/1-5-withered-seo-rss-inclusion.md — pattern: capture sibling-story context even when none has been implemented]

### Out of Scope (deferred elsewhere)

- **Webmention processing script** — Story 3.2 (`scripts/process-webmentions.js`). Fetches from webmention.io API, groups by target URL, writes `data/webmentions_by_article.json`. Story 2.4 consumes this file but does not produce it.
- **Webmention count for popularity scoring** — Story 3.3 (Popularity Score Calculation). Consumes `data/webmentions_by_article.json` for the `(hearts × 1) + (webmentions × 3) + (weight × 2)` formula. Story 2.4 only renders mentions on article pages; popularity is a separate rendering path.
- **Outgoing webmentions** (sending mentions when publishing articles that link to other sites) — possible future enhancement, NOT in epics.md. Could be a Phase 2 polish story or Epic 7's POSSE responsibility.
- **Bridgy integration for Mastodon/Twitter replies** — implicit via webmention.io (Bridgy sends webmentions to webmention.io); no separate signup needed. Out of project scope unless a future story explicitly requires it.
- **Server-side avatar caching / image proxy** — privacy enhancement to avoid leaking reader IP to sender avatar hosts. Not implemented in this story; trade-off documented in "Avatar Privacy and CSP Considerations" above.
- **Real-time webmention display** (WebSocket / serverless function) — out of architectural scope. JAMstack on GitHub Pages = build-time data only. Daily rebuild cycle is acceptable for a digital garden.
- **Webmention spam filtering** — webmention.io handles basic spam filtering server-side. Project-side filtering (e.g., blocklist domains) is out of scope unless a problem emerges in production. Story 3.2 could add filtering during processing.
- **HTML sanitization library in Hugo** — out of scope. Server-side sanitization (Story 3.2) is the right place; Hugo's auto-escape is the safe default at the template level.
- **`rel="me"` link expansion** — Story 2.3 may add a single `rel="me"` link to GitHub for IndieAuth signup if needed. Comprehensive `rel="me"` set (Mastodon, Threads, etc.) is Epic 9's Story 9.10/9.12 responsibility, not this story.
- **Logs detail-page webmention display** — out of scope; logs do not have detail pages in current `single.html` template (see "Logs Out of Scope" section above).
- **Webmention indicator on card listings (homepage / archive)** — out of scope; AC #7 specifies "below article title" on the single page, not on cards. Adding to cards would require editing `card.html` and conflict with Critical Agent Rule #1 (NEVER modify existing card variants). If desired, add a future story to extend cards with a webmention count badge.
- **Privacy-policy avatar disclosure** — Story 2.5 (Privacy Policy Page) owns the broader refresh; avatar-loading note is a follow-up there.

### References

- [Source: docs/1-planning/epics.md (lines 303–328)] — Story 2.4 ACs (seven ACs verbatim, FR-012 coverage, GitHub Issue #145, Implementation Note for Mock Data)
- [Source: docs/1-planning/prd/03a-functional-requirements.md (lines 92–96)] — FR-012 (Webmention Display): "Webmentions grouped by type and displayed in article footer"
- [Source: docs/1-planning/prd/03a-functional-requirements.md (lines 86–90)] — FR-011 (Webmention Reception) — out of scope for this story but informs the dataflow
- [Source: docs/1-planning/prd/05-technical-architecture.md (Tech Stack: Engagement = webmention.io)] — engagement infrastructure decisions
- [Source: docs/2-solutioning/architecture.md] — base architecture (Hugo, Bulma, JAMstack, build pipeline)
- [Source: docs/2-solutioning/digital-garden-integration-architecture.md (lines 13–18)] — Architectural principles (privacy-first engagement)
- [Source: docs/2-solutioning/digital-garden-integration-architecture.md (lines 84–94)] — Project Structure: `webmentions.scss`, `webmentions.html` partial designations
- [Source: docs/2-solutioning/digital-garden-integration-architecture.md (lines 192–195)] — External Services Inventory: webmention.io
- [Source: docs/2-solutioning/digital-garden-integration-architecture.md (lines 250–294)] — Daily Rebuild Data Flow (this story is the consumer of the webmention data file)
- [Source: docs/2-solutioning/digital-garden-integration-architecture.md (lines 296–308)] — Hugo data file integration pattern (`.Site.Data.webmentions_by_article` lookup)
- [Source: docs/2-solutioning/digital-garden-integration-architecture.md (lines 414–469)] — Pattern 2: Dual Anonymous Engagement System (hearts + webmentions)
- [Source: docs/2-solutioning/digital-garden-integration-architecture.md (lines 698–710)] — Hugo data-file error handling pattern (`| default` graceful fallback)
- [Source: docs/2-solutioning/digital-garden-integration-architecture.md (lines 762–771)] — Critical Agent Rules (NEVER modify card variants, NEVER commit data/*.json to main, ALWAYS use | default)
- [Source: docs/2-solutioning/digital-garden-integration-architecture.md (lines 871–902)] — webmentions_by_article.json canonical schema (type/author/author_url/author_photo/content/url/published)
- [Source: docs/2-solutioning/digital-garden-integration-architecture.md (line 1062)] — XSS protection: manual HTML sanitization for webmention content
- [Source: docs/2-solutioning/test-design-system.md (lines 152, 408–419)] — ASR-003 XSS Prevention test approach (Playwright injection attempts)
- [Source: docs/2-solutioning/test-design-system.md (lines 296–384)] — E2E test approach: webmentions display Playwright spec mentioned in line 305
- [Source: docs/sprint-artifacts/epic-2/2-1-umami-analytics-integration.md] — sibling story; establishes head.html edit pattern, AC source separation pattern, German UI convention override
- [Source: docs/sprint-artifacts/epic-2/2-2-heart-button-component.md] — sibling story; establishes widgets/ partials convention, single.html mounting pattern, German aria-label/UI override pattern
- [Source: docs/sprint-artifacts/epic-2/2-3-webmention-endpoint-setup.md] — sibling story; establishes webmention.io reception infrastructure that this story consumes from, fixture-file/data-files exception precedent, privacy-policy section already in place
- [Source: layouts/single.html (lines 34, 60–64, 66–70, 71)] — article single-page layout: type branch, box-content insertion point for AC #7, box-footer adjacency for AC #1
- [Source: layouts/_partials/_base/head.html (lines 17–24, 47–49)] — SCSS pipeline (postCSS + dartsass), RSS link block (Story 2.3 sibling-insertion point)
- [Source: assets/scss/main.scss (lines 27–33)] — Elements section import block (insertion point for `@use "elements/webmentions";`)
- [Source: config/_default/params.yaml] — CSP config (regression-check target for `imgsrc`)
- [https://webmention.io/](https://webmention.io/) — webmention.io homepage (sibling reference from Story 2.3)
- [https://indieweb.org/Webmention](https://indieweb.org/Webmention) — IndieWeb wiki: webmention protocol overview
- [https://gohugo.io/templates/data-templates/](https://gohugo.io/templates/data-templates/) — Hugo data files documentation
- [https://gohugo.io/templates/introduction/#variables](https://gohugo.io/templates/introduction/#variables) — Hugo auto-escape behavior (relevant to AC #8 XSS guard)

## Dev Agent Record

### Context Reference

- docs/sprint-artifacts/epic-2/2-4-webmention-display-component.context.xml

### Agent Model Used

claude-opus-4-7[1m]

### Debug Log References

- `hugo --environment production --minify` (multiple runs) — clean exit; only deprecation warning is `.Site.Data` → `hugo.Data`, which the partial inherits from existing `heart-button.html` convention (out of scope to migrate).
- `node --test tests/build/build-smoke.test.mjs` — full suite passes (46/46) including 5 new Story 2.4 build assertions.
- `npm run test:build` — full project build-test suite passes (62/62; build-smoke + maintenance-mode + validate-frontmatter).

### Completion Notes List

- **AC #1 — Section heading language:** German `Antworten & Erwähnungen` (UTF-8 ä, `&amp;` for ampersand). Overrides AC #1's English wording, matching the rest of `single.html` (`Übersicht`, `Ähnliche Artikel`, etc.) — same convention Story 2.2 used for the heart button's German aria-label.
- **AC #2 — Type-group order:** replies → reposts → mentions → likes (epics-order, highest-information-value first). Group headings render localized: `Antworten`, `Reposts`, `Erwähnungen`, `Likes` (UTF-8). Each group includes a `(N)` count badge in the heading.
- **AC #3 — Date format:** `time.Format ":date_long" .published` chosen over `dateFormat` for a closer match to the existing `single.html` convention (line 92 uses `time.Format`). German locale renders e.g. `15. April 2026` — verified in build output.
- **AC #6 — Sub-partial pattern:** factored out `layouts/_partials/widgets/webmention-group.html` to avoid four near-identical `range` blocks. Caller signature is `(dict "items" . "heading" "Antworten" "type" "reply")`. The sub-partial enforces `rel="noopener external" target="_blank"` on every `<a>` (verified by build assertion `Story 2.4 AC #6`).
- **AC #7 — Icon choice:** `question-answer-line` from Remix Icon (spec named `chat-3-line` but that symbol does not exist in the installed sprite; `question-answer-line` was used as a functionally equivalent replacement). `<use href>` (not `xlink:href`) used to match existing single.html SVG pattern. Pluralization gated: `Antwort` for 1, `Antworten` otherwise; whole block skipped when count is 0.
- **AC #7 — Count-line placement deviation (user-directed):** the AC literal says "below article title". Initial implementation followed that literally (inside `box-content`, after the subtitle). User asked during review to move it into the **right sidebar info-widget, directly under the heart-button** — same column as date, growth-stage, tags, reading-time, and heart count. This visually groups all per-article engagement metrics together. Final placement is after `{{ partial "widgets/heart-button" . }}` in the info widget. SCSS adjusted (`display: block`, `font-size: 0.85rem`, tighter margin) to fit the sidebar context. AC source intent preserved: count is still rendered prominently with anchor-link to `#webmentions`, just in a different spot than the AC's literal phrasing.
- **AC #8 — XSS approach:** Option (a) — Hugo's default auto-escape on `{{ .content }}`. **No** `safeHTML` filter. Webmention sender HTML renders as literal text. Story 3.2 owns server-side sanitization (e.g., `sanitize-html` library) when it lands. Build assertion `Story 2.4 AC #8` regression-guards against accidental `safeHTML` reintroduction.
- **AC #9 — Fixture cleanup decision:** rename to `data/webmentions_by_article.example.json` on Story 3.2's first commit. The architecture's "NEVER commit `data/*.json` to main" rule (Critical Agent Rule #3) is intentionally bypassed for this development crutch. **Coordination flag for Story 3.2:** the story's developer must expect `webmentions_by_article.json` to NOT exist on `main` and rename / remove this fixture as part of 3.2's first commit. Initially the seeded permalink was `/articles/test/`; updated by user to `/articles/rss-test/` for visual demo on a different stable article.
- **AC #9 — `data/README.md` skipped.** Hugo treats every file in `data/` as a data file; a Markdown README causes `unmarshal of format "" is not supported`. The cleanup convention is documented here in completion notes instead. Story 3.2 should put any data-folder docs **outside** `data/` (e.g., `docs/technical/data-folder.md`).
- **AC #11 — CSP `imgsrc`:** already permissive enough — `["'self'", "data:", "https:"]` in `config/_default/params.yaml` admits any HTTPS avatar host. **No CSP change needed.** Build assertion exists in Story 2.1's tests; rerunning after this story confirms no regression.
- **Logs scope decision:** webmention display mounted ONLY on `Type == "articles"` (single.html). Logs have no detail-page branch in `single.html`. Out of scope; revisit if a future story adds log detail pages.
- **Sibling reconciliation patterns reused:** widgets/ partial location (Story 2.2), German UI override (Story 2.2), AC source separation (Stories 2.1/2.2/2.3), `| default (slice)` graceful fallback (Critical Agent Rule #6).
- **Test infrastructure:** Story 1.1's `tests/build/build-smoke.test.mjs` exists, so the optional build assertion (AC #11 task) was added — five tests: section presence, fixture-targeted content, empty-state, link rel/target, and XSS auto-escape regression guard. Playwright XSS test (AC #8 optional) skipped — the new auto-escape build assertion provides equivalent coverage at the template layer.

### File List

**NEW:**
- `layouts/_partials/widgets/webmentions.html` — top-level webmention display partial.
- `layouts/_partials/widgets/webmention-group.html` — inner partial: one type-group of webmentions.
- `assets/scss/elements/webmentions.scss` — webmention dark-theme styling.
- `data/webmentions_by_article.json` — mock fixture (time-boxed exception to Critical Agent Rule #3; rename to `.example` before Story 3.2 lands).

**MODIFIED:**
- `layouts/single.html` — added webmention count line in `box-content` (article branch) and mounted the `widgets/webmentions` partial after the article element.
- `assets/scss/main.scss` — added `@use "elements/webmentions";` import.
- `tests/build/build-smoke.test.mjs` — added five Story 2.4 build assertions (section presence, fixture-targeted content + count line, empty-state, AC #6 link attributes, AC #8 XSS auto-escape guard).
- `docs/sprint-artifacts/sprint-status.yaml` — story status `ready-for-dev` → `in-progress` → `review`.

## Change Log

| Date | Change | Author |
|---|---|---|
| 2026-05-06 | Initial draft created from `epics.md` Story 2.4 (FR-012, GitHub Issue #145), `prd/03a-functional-requirements.md` (FR-012 Webmention Display), `digital-garden-integration-architecture.md` (project structure lines 84–94 designating `webmentions.html` partial + `webmentions.scss`; Pattern 2 Dual Anonymous Engagement lines 414–469; Hugo data-file integration lines 296–308; webmentions_by_article.json schema lines 871–902; XSS protection note line 1062; Critical Agent Rules lines 762–771), `test-design-system.md` (ASR-003 XSS Prevention line 152; webmention E2E spec line 305), and sibling Stories 2.1/2.2/2.3 drafts (head.html-vs-baseof.html reconciliation pattern, widgets/ partials convention, German UI override pattern, AC source separation pattern, fixture-file exception precedent). Reconciled epics AC #1 ("article footer") with project convention (`_partials/widgets/webmentions.html` mounted at end of article column in `single.html` `Type == "articles"` branch) — same reconciliation pattern as Story 2.1's head.html-vs-baseof.html. ACs 1–7 verbatim from epics; ACs 8–11 added as testability/regression guards (XSS guard per architecture line 1062 + ASR-003, fixture-file convention per epics' Implementation Note for Mock Data, byte-equivalent unchanged-layout guard, clean prod build). Heading language reconciled to German (`Antworten & Erwähnungen` etc.) overriding English epics text — same convention pattern Story 2.2 used. XSS approach decision documented: option (a) Hugo auto-escape on `.content` (no `safeHTML`) — Story 3.2 owns server-side sanitization with `sanitize-html` library if needed. Mock fixture file deliberately committed to main as time-boxed exception to architecture's "NEVER commit data/*.json to main" rule (line 766) — cleanup recommended via rename to `.example` on merge per AC #9. Logs (`Type == "logs"`) explicitly out of scope (no detail-page layout in current `single.html`). Avatar privacy and CSP `imgsrc` flagged as defensive concerns (verify in CSP regression task; widen if needed). No JavaScript in this story (server-side rendering only); no GitHub Secrets needed; no third-party signups (Story 2.3 already handled webmention.io account). Test strategy lightweight (manual smoke + optional build assertion if Story 1.1 lands + optional Playwright XSS test) given 2-day scope. | SM (create-story workflow) |
| 2026-05-09 | Story 2.4 implementation completed and marked `review`. Created `webmentions.html` + `webmention-group.html` widget partials, `webmentions.scss`, `data/webmentions_by_article.json` fixture; modified `single.html` (count line + section mount), `main.scss` (SCSS import), and `tests/build/build-smoke.test.mjs` (5 new build assertions). All 11 ACs satisfied, 62/62 build tests passing. Decisions documented in Completion Notes: German UI strings, auto-escape XSS guard, fixture rename-to-`.example` cleanup path, `data/README.md` dropped (Hugo rejects non-data files in `data/`), CSP `imgsrc` already permissive (no change). | Dev (Amelia) |
| 2026-05-09 | User-directed UX adjustment (review): moved count line from below article title into the right-sidebar info widget under the heart button, grouping all engagement metrics together. SCSS tweaked for sidebar context. All 46 build smoke tests still pass. | Dev (Amelia) |
