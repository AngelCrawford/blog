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

- **Migrated: 13 of 37 templates.** The whole page chrome — `head`, navigation,
  `baseof.html`, header, footer — plus the card and everything that lists it:
  `home`, `list`, `page/archive`, `404`, the growth badge, the heart and
  pagination. Markup, styling and JavaScript all in `garden`, all jQuery-free.
  **`single.html` is the last page template left.**
- **The design system's vocabulary is fully adopted** — see below. Templates are
  now the only thing left; no component still needs its CSS invented.
- Tailwind runs without Preflight. Everything garden owns is in a cascade layer,
  the utilities deliberately are not — see the rules in
  [`../CLAUDE.md`](../CLAUDE.md). Do not change either without reading them.
- **jQuery is gone.** Deleted, with `article-time/assets/js/{main,header,gdpr}.js`.
  There is now exactly one script on the page and it is deferred: 105 KB of
  minified JavaScript became 17 KB, and the render-blocking `<script>` in the
  head went with it.

## Vocabulary

Counting templates alone stopped being the useful metric in August 2026: a whole
pass landed without a single row in the table below moving. The design system
under `.claude/skills/design/` is where decisions are made; `garden` is where
they ship. That gap is closed apart from the two rows marked below.

| What | Status |
|---|---|
| Tokens | ✅ all 33 adopted. `design-tokens.test.mjs` holds an **empty** backlog and fails if it refills |
| `css/tokens.css` | ✅ the `@theme static` block, shared by both entry points — main.css emits it, styleguide.css imports it `theme(reference)` |
| `css/base.css` | ✅ the Preflight stand-in, `layer(base)` |
| `css/styleguide.css` | ✅ the catalogue's own entry point, loaded by that page alone — its ~90 exclusive class names no longer ride along on every page |
| `css/components.css` | ✅ `gd-*` plus the `at-*` vocabulary, `layer(components)` |
| Webfonts | ✅ Montserrat, Montserrat Alternates and remixicon registered in garden |
| Header chrome | ✅ `at-header`, `at-city`, `at-clock`, `at-stars`, `at-birds`, `at-balloon`, `at-wordmark` — derived from `hero.scss`, not from the skill |
| Footer chrome | ✅ `at-footer`, `at-footer-sea`, `at-hcard*`, `at-socials`, `at-slogan` — from `footer.scss`. The skill's `at-footer-sea` was right and was checked rather than trusted |
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
| `_partials/card.html` | ✅ garden — article, note and term in one partial. The cell wrapper is gone; the grid lives at each call site |
| `_partials/_base/hero.html` | ✅ garden — sky, harbour, clock, wordmark, birds, seasonal overlays. Copied from Bulma, see below |
| `_partials/_base/footer.html` | ✅ garden — sea reflection, h-card, three columns. Copied from Bulma |
| `_partials/_base/cookie-banner.html` | ⬜ article-time |
| `_partials/_base/maintenance.html` | ⬜ article-time — becomes the webcard |
| `baseof.html` | ✅ garden — shell, back-to-top and page ground. Still calls article-time's hero, footer and banner |
| `home.html`, `list.html` | ✅ garden |
| `single.html` | ⬜ article-time — the last page template |
| `page/archive.html`, `404.html` | ✅ garden |
| `page/profile.html` | ⬜ article-time |
| `_partials/growth-badge.html` | ✅ garden — two contexts; the `single` branch stays Bulma until single.html moves |
| `_partials/withered-hidden-notice.html` | ✅ garden |
| `_partials/withered-*.html` (4, logic only) | ⬜ article-time — no styling |
| `_partials/widgets/archive.html` | ✅ garden — moved with the footer; `page/archive.html` is its second consumer |
| `_partials/widgets/heart-button.html` | ✅ garden — three shapes; the `single` branch stays Bulma |
| `_partials/widgets/pagination.html` | ✅ garden |
| `_partials/widgets/*.html` (6 files) | ⬜ article-time — all sidebar widgets, they move with single.html |
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

### The New Year fireworks: geometry, not the migration

Checked after the header moved, because a canvas is the kind of thing a
migration breaks silently. **It did not break anything** — verified against a
build of the previous commit with the date faked to 30 December: same 125
particles at peak, same painted-pixel count within sampling noise.

The effect had three geometry bugs of its own, all the same mistake — a canvas
has two sizes, and nobody was telling the bitmap what the box was doing:

- The bitmap was 300px tall and the element renders at `height: 80%` of a 300px
  header, so everything drawn was squashed by a fifth. The `80%` looked like it
  kept the effect clear of the skyline; a canvas scales rather than crops, so it
  never did.
- `ch` was the literal `300` while the header is 200px below 640px wide — a
  third of a squash on a phone.
- `cw` was read once at load, so resizing stretched whatever was on the canvas
  and left new fireworks aiming off-screen.

`size()` reads the element's own box now, on load and (debounced) on resize, and
the CSS is `height: 100%`. Verified at 1280 and 420, and across a resize.

Two questions went back to Angel and both came back with an answer.

**Two tuning knobs at the top of the file, and a note on the one that looks
like a knob and is not.** `this.speed` on a rocket does nothing: `acceleration`
is 500, so the speed is multiplied by five hundred on the first frame and the
rocket arrives instantly whatever it started at. There is no climb left to
shorten — which is also why no rising streak is ever visible, and no loss, since
it would climb behind the skyline anyway. The show's pace lives in the gap
between launches, so `TEMPO` divides that: at 2, the nine bursts land in about
six seconds instead of twelve.

`TEMPO` deliberately leaves the fade alone. Scaling `decay` with it was tried and
measured: the length came out the same either way — the show is gap-driven — but
doubling the fade dropped the peak from 201 particles to 125 and no two bursts
ever shared the sky. Leaving it means a burst is still falling while the next
goes up. Shortening each burst is not speed, it is just less.

**The stop is a count now, not a clock.** The intent was always "a handful of
rockets, then let the header be still"; twelve seconds was a stand-in for that.
Time is the wrong unit — one launch happens every 80 frames, so twelve seconds
bought nine bursts at 60Hz, four or five on anything struggling, and eighteen on
a 120Hz display. `TOTAL_LAUNCHES = 9` is what it bought at 60fps, so the effect
is unchanged where it already looked right.

Stopping also had to be fixed to stop *cleanly*: the old code called
`cancelAnimationFrame` on the frame it had just requested, which halted the loop
and left the final half-faded particles painted on the canvas until the next page
load. It now waits for the last burst to fade, clears, and returns. Verified:
nine bursts, quiet after ~13s, canvas empty, `hue` frozen — the loop is genuinely
stopped, not idling.

**The canvas belongs behind the city, and already was.** Confirmed by flooding it
solid red: the skyline, the clock and the wordmark all paint over it. The rockets
climb unseen behind the buildings and only the burst clears the roofline, so the
city looks like it fired them. That is the intent — do not lift the canvas above
the silhouette. Fixing the height from 80% to 100% moved the launch point 60px
further down, which deepens it.

### What the footer migration turned up

Three things worth knowing, all fixed in the same commit.

**`partialCached` had no key.** The footer menu marks the page you are on with
`aria-current` — and with no cache key, Hugo baked whichever page it rendered
first into every other footer. On `/pages/datenschutz/` the footer still offered
"Datenschutz" as a link to itself, and no page ever marked its own entry. Keyed
on `.RelPermalink` now. The same shape exists in any `partialCached` that reads
`.RelPermalink`: check before you copy one.

**The statistics rows ran backwards.** `.variable-number` held the icon and
label at `order: 3`, `.variable` held the count at `order: 1`, so the footer read
`9 ⋯ Artikel` directly beside an archive widget reading `2025 ⋯ 4 Einträge`. Two
dotted-leader lists side by side, pointing opposite ways. Both are
`at-leader-list` now — name left, count right — which is the "one row shape"
decision from the design system doing its job on its first outing.

**A container's `element` rule outranks a component's own class.** The footer
had a blanket `.at-footer a:hover { color: … }` — one class, one element, one
pseudo-class, so (0,2,1). `.gd-button-secondary:hover` is two classes and a
pseudo-class, (0,2,0). The container won, and the button's hover filled with gold
while keeping its light-gold label: gold on gold. It looked like the button had
not been migrated at all, which is how it was reported. Excluded with
`:not(.gd-button)`. Worth remembering as a shape rather than an incident — any
component dropped inside a container that styles bare elements gets quietly
overruled, and the symptom is "this component looks wrong here".

**A colour in a `style` attribute came out as `ZgotmplZ`.** Go's template
escaper refuses `rgb(88, 179, 189)` in a CSS context and writes its placeholder
instead, so the statistics icons rendered colourless — silently, because
`ZgotmplZ` is a valid-looking string, not an error. `hsl(29, 100%, 80%)` in the
same attribute passes, and the h-card's hex values pass, which is why only one
of five icons was affected and nobody spotted it for a week. **Do not put a
colour through a Go template into a `style` attribute.** Carry the finished
utility class as data instead — that keeps the value in the token system as
well. `fill-accent`, never `fill-` plus a variable.

**`archiveTitle` was passed and ignored.** Both call sites hand the widget a
title; the widget hardcoded `Übersicht` and dropped it. The footer therefore said
"Übersicht" where it meant "Archiv". The parameter is read now.

**Left alone on purpose:** the slogan. It invites strangers to publish here —
*"Du willst schreiben – ohne einen eigenen Blog zu veröffentlichen? Be a part of
Article Time!"* — which is the multi-author platform the scope sentence in
CLAUDE.md exists to end, and half of it is English. Copy is Angel's call, not a
migration's, so it moved across verbatim with a FIXME on it.

**Dropped:** a fourth column headed "Most Loved Widgets", English, over nothing.
What would have filled it was a commented-out `$.getJSON` in main.js counting
comments, for a comment system this blog decided against. An empty heading is an
unfinished feature announcing itself, not a design element. The design system
keeps `identity.mostLoved` as an idea; it needs the hearts data plumbed through,
which is a feature.

### What the card migration turned up

**The `.cell` wrapper and sixty lines of empty cells are gone.** Upstream every
card came wrapped in Bulma's `.cell`, and `list.html` then counted how many cards
a row was short and emitted `<div class="cell empty-cell">` to stop the fixed
grid stretching two cards across five columns. `auto-fill` creates those tracks
without markup — that is what it is for.

**The "Neu" and "Gesehen" flags had to become real elements.** They were
`::after` pseudo-elements carrying the literal text `☀ Neu` and `✓ Gesehen`, the
site's only two unicode symbols, which the design system replaced with
`sparkling-line` and `check-fill` from the sprite. A pseudo-element cannot hold
an `<svg><use>`, and the state is in localStorage rather than in the content, so
gdpr.js builds the badge now instead of just adding a class. "Gesehen" wins over
"Neu": a card you opened yesterday is not news to you.

**`.at-growth svg` and `.gd-icon-duo svg` are both (0,1,1),** and the growth one
comes later, so it was sizing the two stacked copies to 1.2em of their own font
size and overflowing a 1em box. It only shows once a growth badge is actually
rendered duotone, which is why the design system has the same collision latent
in it. Fixed with `.at-growth .gd-icon-duo svg`.

**Pagination's disabled ends were anchors.** `<a href="#" disabled>` — an anchor
has no `disabled` attribute, so the first and last buttons looked dead and were
fully clickable, scrolling you to the top of the page you were already on. They
are `<button disabled>` now, and the current page is a held-pressed round button
rather than a coloured one: the shadow inversion is already the site's word for
"pressed", so "you are here" needs no colour of its own.

**Two partials are shared with `single.html` and got a context parameter**
rather than a copy: `growth-badge.html` and `widgets/heart-button.html` render
garden markup for the card and article-time's, unchanged, for the article page.
Delete those branches in the commit that moves `single.html` — the pattern is
already there in the file.

**The feed is 96rem wide and the card reacts to its own width.** The first cut
put it in a single 733px column, because `--page-max` is 64rem and `.at-card`
capped at 733.5px. That cap turned out not to be a decision about feeds at all:
`spacing.css` annotates the token `1024px content column, max-w-5xl upstream` —
it was read off garden's *styleguide* page, the only garden page that existed
when the design system was built, and a styleguide is a document.

Widening alone does not work either. The card's floated cover needs roughly
700px of card to leave a readable text column; at three across it is 480px and
the text runs four words to a line, which is the exact failure the 4:3 landscape
ratio was adopted to avoid. The float dropped at `max-width: 640px` — the right
threshold measured against the wrong thing, since in a three-column grid on a
1536px screen the viewport never gets small.

So `.at-card` is a **size container** and the float drops at
`@container (max-width: 40rem)`. One card, floated when it is wide and stacked
when it is not, wherever it is put. Two things had to go with it: the 733.5px cap
and the auto margins — `margin: auto` makes a grid item shrink to fit its
contents, and `contain: inline-size` forbids the contents from deciding the
inline size, so the pair collapsed every card to its 2px of border.

The grid floor is 28rem rather than 30. At 30rem three tracks come to exactly
1488px in a 1488px grid and the browser rounds down to two; a boundary is not a
margin. `1fr` still shares the leftovers, so the tracks land at 480px anyway.

Measured: 3 columns above 1536, 2 from about 1030, 1 below; the cover floats at
900px viewport (one 732px card) and at 1400 (two 604px cards), and stacks
otherwise.

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

A fourth was fixed a commit later, once Angel confirmed it: the sunrise/sunset
longitude had been `-2.592` since 2020 — open water west of Liverpool, 12.6° from
the Hamburg skyline the header actually draws. The latitude was right all along,
which is why it never looked broken, only late. It is `9.993682` now.

## JavaScript

Rule: new code is vanilla, no exceptions. Port a script when its component moves.

| Script | jQuery calls | Status |
|---|---|---|
| `search.js` | — | ✅ garden, vanilla — fixed a duplicate-listener bug and an outside-click bug on the way |
| `main.js` | — | ✅ garden, vanilla — see below |
| `header.js` | — | ✅ garden, vanilla — three defects fixed on the way, see the header note |
| `gdpr.js` | — | ✅ garden, vanilla — moved out of the head into the deferred bundle |

`main.js` was listed at 32 jQuery calls and that number was misleading: about 110
of its 138 lines were commented out — a comment form, a spoiler toggle, a
"most loved" widget, all for features this blog decided against. Two behaviours
were live, back-to-top and the footer reveal, and only those came across. Their
port is 50 lines and the resize listener became a `ResizeObserver`, which
catches the cases resize never did (a webfont finishing its swap, an image
settling).
| `firework.js` | — | ✅ garden — moved with the header; canvas geometry fixed, see below |
| `hearts.js`, `withered-banner.js`, `suncalc.js` | 0 | ✅ already vanilla, still article-time's |
| `navbar.js` | — | ✅ deleted, was dead code |

**All four are done.** The rule while they were not — porting one saves zero
bytes, so treat it as a by-product of component work rather than a project — held
right up to the last one, and then paid all at once: 105 KB of minified
JavaScript down to 17 KB, and the only remaining script is deferred.

Two of the four were also much smaller than the tally suggested. `main.js` was
listed at 32 jQuery calls and `gdpr.js` at 3; between them, most of that lived in
commented-out code for a comment form, a spoiler toggle, a Gravatar loader and a
"most loved" widget — features this blog decided against years ago. Counting
calls in a file counts its history, not its work.

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
- [x] **Delete `jquery.js`.** Done August 2026. The head bundle went with it —
      it existed only because everything assumed `$` was already there.

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
