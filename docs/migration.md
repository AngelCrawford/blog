# Migration status — Bulma → Tailwind

**Where am I?** This page answers that. It is the only place that tracks the
Bulma-to-Tailwind migration; if it disagrees with your memory, believe this page.

Update it in the same commit that moves a component. A status line that lags
behind the code is worse than none.

---

## Right now

Both themes are composed: `theme: ["garden", "article-time"]`. A file created in
`themes/garden/` overrides its `article-time` counterpart immediately; everything
absent from `garden` keeps working unchanged. **The site is never broken between
steps** — that is the entire point of this arrangement.

- **Migrated: 2 of 37 templates.** The navigation area is *complete* — markup,
  styling and JavaScript all live in `garden`, and it is jQuery-free.
- Tailwind runs without Preflight and unlayered — see the rules in
  [`../CLAUDE.md`](../CLAUDE.md). Do not change either without reading them.
- jQuery still ships (285 KB of source) because four scripts depend on it.

## Templates

Move a template by creating it at the same path under `themes/garden/layouts/`.
Order below is roughly "most visible first" — pick by what you actually want to
redesign, not top to bottom.

| Template | Status |
|---|---|
| `_partials/_base/head.html` | ✅ garden — loads both stylesheets |
| `_partials/_base/navigation.html` | ✅ garden — plain scaffold, design still open |
| `_partials/card.html` | ⬜ article-time — 552 lines of SCSS, the biggest win |
| `_partials/_base/hero.html` | ⬜ article-time — **keep for now** (Angel wants it as is) |
| `_partials/_base/footer.html` | ⬜ article-time |
| `_partials/_base/cookie-banner.html` | ⬜ article-time |
| `_partials/_base/maintenance.html` | ⬜ article-time — becomes the webcard |
| `baseof.html`, `home.html`, `list.html`, `single.html` | ⬜ article-time |
| `page/archive.html`, `page/profile.html`, `404.html` | ⬜ article-time |
| `_partials/growth-badge.html`, `withered-*.html` | ⬜ article-time |
| `_partials/widgets/*.html` (9 files) | ⬜ article-time |
| `_markup/render-*.html` (3), `_shortcodes/*.html` (4) | ⬜ article-time — markup only, low priority |
| `_partials/_base/seo.html`, `validate-growth-stage.html` | ⬜ article-time — no styling, may never need moving |

## JavaScript

Rule: new code is vanilla, no exceptions. Port a script when its component moves.

| Script | jQuery calls | Status |
|---|---|---|
| `search.js` | — | ✅ garden, vanilla — fixed a duplicate-listener bug and an outside-click bug on the way |
| `main.js` | 32 | ⬜ |
| `header.js` | 16 | ⬜ tied to the hero |
| `gdpr.js` | 3 | ⬜ smallest, easiest next port |
| `firework.js`, `hearts.js`, `withered-banner.js`, `suncalc.js` | 0 | ✅ already vanilla |
| `navbar.js` | — | ✅ deleted, was dead code |

**Porting one script saves zero bytes.** jQuery only leaves the bundle when all
four are done, so treat it as a by-product of component work, not a project.

## Milestones

Three things unlock only when a whole class of work is finished. Ticking them
off is the real progress signal.

- [ ] **Preflight on.** When no template uses Bulma class names any more, add
      `@import "tailwindcss/preflight.css" layer(base);` and restore
      `@layer theme, base, components, utilities;` in
      `themes/garden/assets/css/main.css`. Tailwind runs at half strength
      until then.
- [ ] **Delete `themes/article-time/`.** When the template table has no ⬜ left.
      Also drop `sudo snap install dart-sass` from both workflows, delete
      `postcss.config.js`, and remove `postcss`, `postcss-cli` and
      `@fullhuman/postcss-purgecss` from `package.json`.
- [ ] **Delete `jquery.js`.** When the JS table has no ⬜ left. Remove it from
      the bundle in `head.html` too.

## Rules of thumb

1. **Never use a Bulma class name in a garden template.** `navbar`, `icon`,
   `input`, `control`, `field`, `card`, `box`, `title`, `content`, `hero`,
   `columns`, `column`. Reusing one drags Bulma's whole rule set back onto an
   element you are styling with utilities, and Bulma wins. This produced a
   visibly broken navigation once already.
2. **Check the JS contract before restyling.** Grep `themes/article-time/assets/js`
   for the IDs and classes the template carries. Keep them verbatim, style
   around them — or port the script in the same step and own both ends.
3. **`@source` every place class names live.** `themes/garden/layouts` is not
   enough: JavaScript that builds DOM nodes carries classes too, which is why
   `themes/garden/assets/js` is listed as well. Miss one and the feature works
   perfectly while looking completely unstyled.
4. **A script under `resources.ExecuteAsTemplate` is a Go template.** Never
   write an empty `{{`/`}}` action in it, comments included — that is a build
   error, not a comment.
5. **Never assemble a class name from a variable.** Tailwind extracts complete
   literal strings; a template writing `bg-` followed by `{{ .name }}` produces
   no rule at all, silently, and the element renders unstyled. Carry the
   finished class name as data instead — see how `page/styleguide.html` does it.
6. **One component per commit.** Migrated template, its styles, its JS if any,
   and this file updated together.
