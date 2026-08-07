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

- **Migrated: 4 of 37 templates.** `head`, navigation, `baseof.html` and the
  header — markup, styling and JavaScript all in `garden`, all jQuery-free.
- **The design system's vocabulary is fully adopted** — see below. Templates are
  now the only thing left; no component still needs its CSS invented.
- Tailwind runs without Preflight. Everything garden owns is in a cascade layer,
  the utilities deliberately are not — see the rules in
  [`../CLAUDE.md`](../CLAUDE.md). Do not change either without reading them.
- **jQuery is down to one dependant.** `gdpr.js`, three calls. The footer bundle
  no longer contains a single `$(`; jQuery now sits in the head bundle purely to
  serve the cookie banner. Porting it deletes 285 KB.

## Vocabulary

Counting templates alone stopped being the useful metric in August 2026: a whole
pass landed without a single row in the table below moving. The design system
under `.claude/skills/design/` is where decisions are made; `garden` is where
they ship. That gap is closed apart from the two rows marked below.

| What | Status |
|---|---|
| Tokens | ✅ all 33 adopted. `design-tokens.test.mjs` holds an **empty** backlog and fails if it refills |
| `css/base.css` | ✅ the Preflight stand-in, `layer(base)` |
| `css/components.css` | ✅ `gd-*` plus the `at-*` vocabulary, `layer(components)` |
| Webfonts | ✅ Montserrat, Montserrat Alternates and remixicon registered in garden |
| Header chrome | ✅ `at-header`, `at-city`, `at-clock`, `at-stars`, `at-birds`, `at-balloon`, `at-wordmark` — derived from `hero.scss`, not from the skill |
| Footer chrome | ⬜ `at-footer-sea` — moves with the footer, same rule: copy from `footer.scss` |
| `body`, `a`, `:focus-visible` | ⬜ element-level base rules. They did **not** come with `baseof.html`: in the `base` layer they outrank Bulma, so they would restyle every unmigrated template at once. They land when Preflight does |

Two deliberate divergences from the skill, both commented at the rule:

- `.at-card` gains `display: grid; grid-template-rows: 1fr auto`. Upstream the
  React component sets it inline; Hugo has no component, so leaving it at the
  call site means retyping it at all five of them.
- `.at-sr-only` is skipped — Tailwind already emits `sr-only`.

**The vocabulary ships before the markup that uses it.** That is roughly 22 KB
(9 KB gzipped) of currently unused CSS. The trade is that every remaining
migration is markup work rather than another design round, and
[`/pages/styleguide/`](../themes/garden/layouts/page/styleguide.html) renders
every class so none of it is shipping unseen.

## Templates

Move a template by creating it at the same path under `themes/garden/layouts/`.
Order below is roughly "most visible first" — pick by what you actually want to
redesign, not top to bottom.

| Template | Status |
|---|---|
| `_partials/_base/head.html` | ✅ garden — loads both stylesheets |
| `_partials/_base/navigation.html` | ✅ garden — plain scaffold, design still open |
| `_partials/card.html` | ⬜ article-time — 552 lines of SCSS, the biggest win. **The grid wrapper moves with it**, see below |
| `_partials/_base/hero.html` | ✅ garden — sky, harbour, clock, wordmark, birds, seasonal overlays. Copied from Bulma, see below |
| `_partials/_base/footer.html` | ⬜ article-time |
| `_partials/_base/cookie-banner.html` | ⬜ article-time |
| `_partials/_base/maintenance.html` | ⬜ article-time — becomes the webcard |
| `baseof.html` | ✅ garden — shell, back-to-top and page ground. Still calls article-time's hero, footer and banner |
| `home.html`, `list.html`, `single.html` | ⬜ article-time |
| `page/archive.html`, `page/profile.html`, `404.html` | ⬜ article-time |
| `_partials/growth-badge.html`, `withered-*.html` | ⬜ article-time |
| `_partials/widgets/*.html` (9 files) | ⬜ article-time |
| `_markup/render-*.html` (3), `_shortcodes/*.html` (4) | ⬜ article-time — markup only, low priority |
| `_partials/_base/seo.html`, `validate-growth-stage.html` | ⬜ article-time — no styling, may never need moving |

### The card is not one file

`card.html` renders a single card, but its layout is decided by a wrapper that
lives in each consumer. Redesigning the card without redesigning the wrapper
gets you well-designed cards in a broken grid.

- **The wrapper**, currently Bulma's fixed-grid in `home.html:6-7`:
  `fixed-grid has-1-cols-mobile … has-3-cols-fullhd` plus
  `grid is-column-gap-7 is-row-gap-4 h-feed`. In Tailwind this becomes plain
  `grid` with responsive column counts and `gap-gutter`. Keep `h-feed` — it is
  a microformat, not styling.
- **The cell**, `card.html:3`: `cell` with a conditional `is-row-span-2` for
  term pages that carry an image.
- **Five consumers** must all be migrated or none: `home.html` (three call
  sites), `list.html` (two), `page/archive.html`, `404.html`.

Card, wrapper and cell are therefore one unit of work, not three.

### The header came from Bulma, not from the design system — done

**Migrated August 2026.** The rule it was migrated under still applies to
anything left over: the skill's header (`at-sky`, `at-city`, `at-clock`,
`at-bird`, `at-balloon`, `at-wordmark`, `at-footer-sea`) is a simplification
that looks finished. The design tool could not carry the SVG work. Held against
`scss/base/hero.scss` it was missing the stars entirely, the second bird, the
641–840px breakpoint and every seasonal overlay. **The source was `hero.html` +
`hero.scss` + `header.js`, put on tokens on the way.** The skill served as a
value table.

The pieces that needed an answer rather than a translation:

- **The stars.** Three Sass `multiple-box-shadow()` calls scattered 100 / 80 /
  30 random shadows across 2000×270px. There is no Sass here and no random in a
  Hugo template — by design, since a star field that moves on every build is a
  diff nobody asked for. The field is generated once into
  `static/images/header/stars.svg`, 1.6 KB gzipped, and now *repeats*: past
  2000px the old sky was empty.
- **The sky state.** `data-sky` on the header, one attribute with four values,
  replacing four classes that were added and never removed.
- **The wordmark's vertical offset.** Reproduced from measurements — 19px at
  desktop, 7px at tablet, 0 on a phone. Upstream those fell out of
  `top: calc(50% - 20px)` meeting three different Bulma paddings; there is no
  rule behind them. Kept anyway, because at 19px the mark sits on the skyline
  instead of in the middle of the clock face.

Three defects were fixed rather than carried over, all noted at the code:

1. `setInterval(dayNightSky(), …)` **called** the function and passed its
   `undefined` return value, so the sky was decided once per page load and a tab
   left open through sunset kept its afternoon.
2. The shimmer used `-webkit-gradient()` with two invalid fallbacks, so it has
   been **invisible in Firefox since 2020**.
3. The ghost set `animation-delay` and then included a shorthand that reset it.

**Still open, deliberately:** the sunrise/sunset coordinates are
`53.551086, -2.592`. The latitude is Hamburg's — so is the skyline in
`city.svg` — but the longitude is open water west of Liverpool, 12.6° off. Every
dusk therefore arrives about fifty minutes late. Not changed here, because it
alters what the site looks like at a given hour, which is a decision rather than
a port. Hamburg is `9.993682`, one edit in `themes/garden/assets/js/header.js`.

## JavaScript

Rule: new code is vanilla, no exceptions. Port a script when its component moves.

| Script | jQuery calls | Status |
|---|---|---|
| `search.js` | — | ✅ garden, vanilla — fixed a duplicate-listener bug and an outside-click bug on the way |
| `main.js` | — | ✅ garden, vanilla — see below |
| `header.js` | — | ✅ garden, vanilla — three defects fixed on the way, see the header note |
| `gdpr.js` | 3 | ⬜ smallest, easiest next port |

`main.js` was listed at 32 jQuery calls and that number was misleading: about 110
of its 138 lines were commented out — a comment form, a spoiler toggle, a
"most loved" widget, all for features this blog decided against. Two behaviours
were live, back-to-top and the footer reveal, and only those came across. Their
port is 50 lines and the resize listener became a `ResizeObserver`, which
catches the cases resize never did (a webfont finishing its swap, an image
settling).
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

## How the two stylesheets coexist

One arrangement makes everything else work, and it is worth understanding before
touching either stylesheet:

Order is declared once, at the top of `main.css`:

```css
@layer bulma, theme, base, components;
```

| Layer | What | Wins against |
|---|---|---|
| `@layer bulma` | article-time's whole compiled stylesheet | nothing |
| `@layer theme` | `tailwindcss/theme.css` — custom properties only | Bulma |
| `@layer base` | `css/base.css`, the scoped Preflight stand-in | Bulma |
| `@layer components` | `css/components.css` — `gd-*` and `at-*` | both above |
| unlayered | Tailwind utilities | everything |

**Any unlayered declaration beats every layered one, and any later layer beats
an earlier one — both regardless of specificity or source order.** That is what
lets every rule in `components.css` be a plain class selector: it beats Bulma by
layer, so it never has to beat anything by specificity, and a utility at the
call site still overrides it.

Two attempts got this wrong before it settled:

1. The baseline was raised to `[data-garden] p` (0-1-1) to out-shout Bulma,
   which then beat the utilities it was meant to let through. `text-2xl` on a
   paragraph rendered at 16px, `mb-3` did nothing, `space-y-*` collapsed, and a
   Bulma rule at 0-2-2 pushed the round button's icon 5px off centre.
2. Bulma was demoted, which fixed that — but the components stayed unlayered and
   scoped, so `[data-garden] .gd-panel` sat at 0-2-0 and beat the utilities all
   over again. Same bug, one round later.

**Demote, do not out-shout — and put your own rules in a layer too.**

### A layer decides conflicts. It does not delete anything.

The failure that keeps coming back: where garden declares *nothing*, Bulma still
applies unopposed, layer or no layer. Bare `button` gets a background and a
box-shadow. `[data-tooltip]` gets a whole tooltip. And `.grid` — a Bulma class
name as well as a Tailwind utility — contributes `gap: 0.75rem` and
`grid-template-columns: repeat(auto-fill, minmax(9rem, 1fr))`, which is how a
card carrying `grid` laid its own contents out in two columns.

Hence rule 1 below, and hence: when you do use a utility whose name Bulma also
owns, state every property Bulma would otherwise fill in.

The wrapping happens in `themes/garden/layouts/_partials/_base/head.html` and is
safe only because the compiled sheet contains no `@charset` and no `@import` —
both must precede any `@layer`. Keep the published path at the site root:
Bulma's `url()` references to fonts and header images are relative.

## Rules of thumb

1. **Never use a Bulma class name in a garden template.** `navbar`, `icon`,
   `input`, `control`, `field`, `card`, `box`, `title`, `content`, `hero`,
   `columns`, `column`. Bulma's rules are layered now so utilities still win,
   but the element inherits a pile of styling nobody asked for, and reading the
   result becomes guesswork.
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
6. **Run the dev server with `--disableFastRender`.** Tailwind live reload is
   wired up natively (`build.buildStats` + `build.cachebusters` + the
   `assets/watching` mount, see `config/_default/config.yaml`), but in
   fast-render mode a class that is not yet in `hugo_stats.json` does not
   surface until the server restarts.
7. **One component per commit.** Migrated template, its styles, its JS if any,
   and this file updated together.
