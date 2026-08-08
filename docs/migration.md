# Migration status — Bulma → Tailwind

**Where am I?** This page answers that. It is the only place that tracks the
Bulma-to-Tailwind migration; if it disagrees with your memory, believe this page.

Update it in the same commit that moves a component. A status line that lags
behind the code is worse than none.

---

## Right now

`theme: ["garden"]` — garden alone since the teardown. The composition
(`["garden", "article-time"]`, first theme wins per file) was what carried the
migration: **the site was never broken between steps**, because everything
absent from garden kept rendering from article-time until its replacement
landed. The folder is still on disk as an unmounted archive; see the milestone
at the bottom.

- **Migrated: everything.** Every template, hook, shortcode, script and asset
  renders from `garden`; article-time serves nothing. Markup, styling and
  JavaScript all garden, all jQuery-free.
- **August 2026: the teardown.** `single.html` (with its sidebar widgets,
  render hooks and the withered banner), the four shortcodes, profile,
  maintenance and the cookie banner all render from `garden`; everything
  Bulma-free that article-time still carried (SEO/logic partials, RSS/JSON/
  sitemap outputs, three JS files, i18n, archetypes, static images) moved
  wholesale. `theme: ["garden"]` — the Bulma stylesheet is not built any more.
  **`themes/article-time/` stays on disk as an unmounted archive** for looking
  things up (the firework.js lesson), by Angel's call; deleting it is the last
  milestone below.
- **The design round is done** (August 2026, after the teardown): the article
  page runs the Steckbrief ("Auf einen Blick", leader-dot rows, heart capsule
  in the tile head), likes and reposts are sidebar facepiles per IndieWeb
  convention, reactions sit on the page ground with per-entry tiles, the
  profile is the card with the left icon rail, and the feed grid carries the
  28rem floor that matches the card's own stack threshold. Blockquote and
  codeblock render through garden hooks; the figure shortcode routes through
  ui/figure; the table hook was judged and declined (structural CSS stays).
- **Cover captions work for the first time**: every consumer read
  `.Meta.Exif.Tags.ImageDescription`, and `.Meta.Exif` is a plain tags map
  with no `.Tags` beneath it — broken since article-time, invisible because
  `with` swallows nils. `image-caption.html` is the one place that reads it
  now (`.Meta.Exif.ImageDescription`, nil-safe, no deprecation warning).
- **The design system's vocabulary is fully adopted** — see below. Templates are
  now the only thing left; no component still needs its CSS invented.
- **Preflight is on** since the teardown; the scoped stand-in reset in
  `base.css` went with it, and the `data-garden` markers it scoped are swept.
  What survives in `base.css` is the interaction baseline (pointer on
  everything clickable) — a site rule, not a reset. Everything garden owns is
  in a cascade layer, the utilities deliberately are not — see the rules in
  [`../CLAUDE.md`](../CLAUDE.md).
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
| `css/base.css` | ✅ Preflight plus the interaction baseline, `layer(base)` — the stand-in reset died with the teardown |
| `css/styleguide.css` | ✅ the catalogue's own entry point, loaded by that page alone — its ~90 exclusive class names no longer ride along on every page |
| `css/components.css` | ✅ 164 rules after the full audit — only what utilities cannot express; everything else is utilities in templates or the `ui/*` partials |
| Webfonts | ✅ Montserrat, Montserrat Alternates and remixicon registered in garden |
| Header chrome | ✅ `at-header`, `at-city`, `at-clock`, `at-stars`, `at-birds`, `at-balloon`, `at-wordmark` — derived from `hero.scss`, not from the skill |
| Footer chrome | ✅ `at-footer`, `at-footer-sea`, `at-hcard*`, `at-socials`, `at-slogan` — from `footer.scss`. The skill's `at-footer-sea` was right and was checked rather than trusted |
| `body`, `a`, `:focus-visible` | ✅ Preflight landed with the teardown; the frame Bulma's `main`/`body` rules supplied rides as utilities in `baseof.html` |

Two deliberate divergences from the skill, both commented at the rule:

- `.at-card` gains `display: grid; grid-template-rows: 1fr auto`. Upstream the
  React component sets it inline; Hugo has no component, so leaving it at the
  call site means retyping it at all five of them.
- `.at-sr-only` is skipped — Tailwind already emits `sr-only`.

**The vocabulary question was settled the hard way in August 2026.** The design
system's 933 CSS lines were first ported wholesale; Angel then challenged the
result twice (once over utility bundles, once over `.at-figure-float`), and a
complete rule-by-rule audit followed: **305 ported rules became 164**, and every
survivor is a pseudo-element, a sibling/descendant rule, a keyframe, a custom-
property hand-off, a state, or Markdown styling with no render hook. Repeated
markup decisions live in partials — `ui/button`, `ui/figure`, `ui/badge` — not
in classes. `no-utility-bundles.test.mjs` trips on regressions; its property
list deliberately excludes the background/animation/filter families, because
the header and sea chrome is CSS by recorded decision.

## Templates

THE TABLE IS COMPLETE — every row garden since the August 2026 teardown. Kept
as the map of what lives where, not as a to-do list.

| Template | Status |
|---|---|
| `_partials/_base/head.html` | ✅ one stylesheet: the Tailwind bundle |
| `_partials/_base/navigation.html` | ✅ sticky bar, fading gold rule, drawer below 768px |
| `_partials/card.html` | ✅ article, note and term in one partial; grids live at the call sites |
| `_partials/_base/hero.html` | ✅ sky, harbour, clock, wordmark, birds, seasonal overlays |
| `_partials/_base/footer.html` | ✅ sea reflection, h-card, three columns, content capped at 96rem |
| `_partials/_base/cookie-banner.html` | ✅ two-click notice, `.is-visible` as element variant |
| `_partials/_base/maintenance.html` | ✅ self-contained clock page on the Tailwind bundle |
| `baseof.html` | ✅ shell, back-to-top, page ground, deferred single bundle |
| `home.html`, `list.html` | ✅ feed grid: 28rem floor = the card's own stack threshold |
| `single.html` | ✅ Steckbrief sidebar, facepiles, Reaktionen on the page ground |
| `page/archive.html`, `404.html` | ✅ |
| `page/profile.html` | ✅ the business card: icon rail left with the footer's fade, two-click Spotify embed |
| `_partials/growth-badge.html` | ✅ tint as finished utility per stage, both contexts |
| `_partials/withered-*.html` (banner + notice + 2 logic) | ✅ banner in the withered grey, logic untouched |
| `_partials/widgets/*` | ✅ tile-head, toc/series/related sidebars, webmentions + facepile, heart capsule, pagination, archive |
| `_partials/ui/*` | ✅ button, figure, badge, tile-head — the partials that replaced utility-pile classes |
| `_markup/render-*` (5) | ✅ heading, image, link, blockquote, codeblock |
| `_shortcodes/*` (5) | ✅ message, rating, tags, youtube, figure→ui/figure |
| `_partials/_base/seo.html`, `validate-growth-stage.html`, outputs (`rss`, `index.json`, `sitemap`) | ✅ moved verbatim, no styling |

### The card is not one file

`card.html` renders a single card, but its layout is decided by a wrapper that
lives in each consumer. Redesigning the card without redesigning the wrapper
gets you well-designed cards in a broken grid.

- **The wrapper**, an auto-fill grid at each call site since the migration:
  `repeat(auto-fill, minmax(min(28rem,100%), 1fr))` with doubled gaps and a
  gutter of left indent for the cover's overhang. The 28rem floor IS the
  card's own stack threshold, so every track that exists carries the float
  layout. `h-feed` stays — a microformat, not styling.
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
rather than a copy: `growth-badge.html` and `widgets/heart-button.html`. Both
branches speak garden now — the single branch became the Steckbrief's badge
row and the heart capsule when `single.html` moved.

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

### What the navigation redesign turned up

**August 2026.** The nav was the first template off Bulma and it stayed the
"plain scaffold to prove the path" for the whole migration. It carries the
skill's `SiteNav` design now: sunken surface, the fading gold rule along the
bottom, stuck to the top so that rule survives scrolling, and the current item
marked with a 2px gold underline that fades out to the right.

**The skill's 90 lines of `at-nav-*` were not ported, on purpose.** They are the
exact rules the August audit deleted for being a private framework — this is the
component they were written for, and it still did not need them. What ended up
in `components.css` is four pseudo-element rules, a keyframe and a scroll lock;
everything else is utilities in the template.

Three things the design did not anticipate, all of them consequences of Hugo
rather than of the design:

- **The drawer is the same DOM as the bar, not a second copy.** The skill's
  React component renders the search field twice, once per shape. `#searchBox`
  may exist exactly once — `search.js` binds it by id and a second copy takes
  over silently — so one set of elements re-flows instead: `md:` for the bar,
  the base classes for the drawer, `order-*` for the two different sequences
  (search first in the drawer, last in the bar).
- **The result panel needed two anchors, not one.** The recorded rule was
  "anchor it to `<nav>`, never to the field", because an 800px panel under a
  224px input lands in the wrong place. That is still true in the bar — but in
  the drawer the field *is* where the panel belongs. `md:static` on the field
  wrapper does both with one element: below 768px the wrapper is the containing
  block, above it `<nav>` is.
- **`z-50` on `<nav>` capped the drawer at 50.** The bar's own z-index makes
  `<nav>` a stacking context, so the drawer's `z-[100]` was measured against the
  page as 50 — under the cookie banner (99999) and back-to-top (999999). The
  banner covered the drawer's follow icons outright. The fix lifts the *context*
  while the toggle is checked, and it has to be a utility: `components.css` is
  layered and would lose to `z-50` no matter how specific the selector.

**The toggle stays a checkbox.** It works with no JavaScript, and `:checked` is
a state assistive technology reports — unlike the `aria-expanded="false"` the
old markup hardcoded on the label and never updated, because nothing was ever
bound to it. The accessible name and the tab stop sit on the input, so Space
still closes the drawer from wherever focus is. The scroll lock is
`body:has(#menu-switch:checked)`; nothing else reaches `<body>` from inside
`<nav>`. **Still missing: Escape to close** — that needs a script, and the
skill's own component does not have it either.

`baseof.html` changed in the same step: the scroll offset went from 35px to
`scroll-pt-18`. A sticky bar means every in-page anchor, footnote jump and
heading link lands underneath it otherwise.

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
| `hearts.js`, `withered-banner.js`, `suncalc.js` | 0 | ✅ already vanilla; moved to garden in the teardown |
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

- [x] **Preflight on.** Done August 2026, in the same stroke as the teardown.
- [ ] **Delete `themes/article-time/`.** The folder is unmounted and serves as
      an archive until Angel is done consulting it. When it goes: drop
      `sudo snap install dart-sass` from both workflows, delete
      `postcss.config.js`, remove `postcss`, `postcss-cli` and
      `@fullhuman/postcss-purgecss` from `package.json`, and drop the
      `hugo_stats.json` build-stats mount if nothing else has claimed it.
- [x] **Delete `jquery.js`.** Done August 2026. The head bundle went with it —
      it existed only because everything assumed `$` was already there.

## How the cascade is arranged (and how two stylesheets used to coexist)

Order is declared once, at the top of `main.css`:

```css
@layer theme, base, components;
```

| Layer | What | Wins against |
|---|---|---|
| `@layer theme` | `tailwindcss/theme.css` + `tokens.css` — custom properties | — |
| `@layer base` | Preflight, then the interaction baseline | `theme` |
| `@layer components` | `css/components.css` — `gd-*` and `at-*` | both above |
| unlayered | Tailwind utilities | everything |

During the migration there was a fourth layer at the very bottom: `bulma`,
holding article-time's entire compiled stylesheet, demoted in one move. That
trick — demote, don't out-shout — is what made the two-theme year survivable
and is worth remembering for any future coexistence problem.

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
