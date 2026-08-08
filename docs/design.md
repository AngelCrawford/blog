# Design system

The tokens live in `themes/garden/assets/css/tokens.css`. What they look like
lives at **`/pages/styleguide/`** — run `hugo server` and open it. This page is
only the *why*.

**Every code label on the styleguide shows what you TYPE in a template** — the
complete class name (`text-ink-muted`, `gap-gutter`, `rounded-md`), never a bare
token stem like `muted` or `4`. The page had both for a while, and mixed
notation on the reference page is how mixed notation gets into the code that
copies from it. The `--color-*` form appears only where the CSS custom property
is genuinely what you want, namely inside component CSS.

## Component or utilities

The old theme did not fail because it had components. It failed because its
components invented their own values — `card.scss` runs to 552 lines because
colours, spacing and radii were decided afresh inside it. A component is not the
problem; a component without tokens is.

So the safeguard is not "avoid components", it is **every component composes
from tokens**. That is checkable, and currently holds: zero raw colour or size
values exist outside the token block.

Write a component when one of these is true:

1. **The same decision would repeat and could drift.** `gd-button` exists
   because its font weight was lost once already — six utilities repeated at
   every call site is six chances to forget one.
2. **Utilities cannot express it.** `gd-h1` needs two pseudo-elements for the
   gradient, `gd-round-button` needs the shadow inversion, `#resultsWrapper`
   needs positioning against a distant ancestor.

Do not write one because it "looks tidier". Giving every element a class builds
a private framework, and a private framework becomes something to fight — which
is precisely the position Bulma has us in now.

Layout stays in the markup. The card is a component; the grid it sits in is not.
`grid gap-gutter sm:grid-cols-2` at the call site is more honest than
`gd-card-grid`, because the grid genuinely differs per page.

**Building a component means picking from the styleguide, not inventing.** That
rule is the whole point. Between 2020 and 2026 every component got its own
design round, which is how 4.355 lines of SCSS accumulated across 29 files with
`card.scss` alone at 552 lines — and why nothing ever felt finished.

---

## Decisions

### Type — Montserrat Alternates + Montserrat

Headings in Montserrat Alternates, body in Montserrat. Both self-hosted; nothing
is fetched from Google at runtime, which was a GDPR requirement from the start.

Decided in February 2020 and confirmed again in 2026. The original specimen is
`design/typography-codepen-2020.png`
([Codepen](https://codepen.io/angel_crawford/pen/zYGvYoE)).

**Known trade-off, accepted knowingly:** in Montserrat the glyphs `I i l L` are
hard to tell apart — `Illegal` and `Ill 1l` read ambiguously. This was noted in
2020 and re-raised in 2026, and the answer both times was to keep the typeface
anyway: the character it gives the site outweighs the ambiguity, which almost
never causes real confusion in running prose. The styleguide prints
`Illegal — Ill 1l` at every size so the cost stays visible rather than
forgotten. Serif alternatives were rejected outright — a standing personal
preference, not a technical argument.

The size scale is explicit rather than inherited from Tailwind's defaults, so
changing it is one edit in the token block instead of a hunt through components.

### The Rubrik is a dot badge, not a ribbon

**Decided August 2026.** The category is a neutral pill with a coloured dot —
`at-badge`, the dot set from the category's `categoryColor` front-matter field.
On an article card it sits in the metadata row; on a note card, which has no
metadata row, it sits in the footer beside the dates.

**The ribbon is gone entirely.** The design system keeps one on notes, arguing
the label has to sit on the picture because the picture is the whole card. The
footer is a metadata row and a note has one, so that argument does not hold — and
one card type carrying the device the other three dropped is worse than either
choice applied consistently.

**Why:** the ribbon put a saturated fill across the top of a photograph. It
competed with the photograph and with the gold, on the most repeated element on
the site — three hues (`#1d7a7a`, `#285fa5`, `#a52828`), none of them in the
palette.

The pill's **text is gold**, like every other link; only its surface is neutral.
Set in `--color-ink` it looked like the sentence beside it, leaving the outline
to do all the work of saying that it goes somewhere.

**Why this does not break "gold is the only accent":** the surface stays
neutral. What carries the colour is a 0.5em dot — enough to tell Rubriken apart
at a glance, too small to fight anything. A row of badges still reads as one
family. Per-category colour was never rejected as an idea, only as a *fill*.

The Rubrik also moved from above the title into the metadata line beside the
date: above it, it stood between the reader and the one thing on the card that
matters, and it is metadata, so it belongs with the metadata.

### The cascade has four layers

**Decided August 2026**, and it is a design decision rather than a migration
detail, because it is what allows a component to be a plain class selector.

`bulma, theme, base, components`, with the utilities deliberately *unlayered*
above all of them. A later layer beats an earlier one regardless of specificity,
and unlayered beats every layer. So `components.css` never has to out-specify
Bulma, and a utility at the call site still overrides a component.

The alternative — winning each collision by specificity — was tried twice and
failed twice; [`migration.md`](migration.md) records both rounds. The rule that
came out of it: **demote, do not out-shout, and put your own rules in a layer
too.**

### The component test is the point, and it was skipped once

**Recorded August 2026, after getting it wrong.** The rule above — write a
component when the decision repeats and could drift, or when utilities cannot
express it — was not applied when the design system was brought into `garden`.
933 lines of CSS were ported in one commit, before any template used a line of
it, and the reasoning at the time was that every later migration would then be
"markup work rather than another design round". That inverts the rule: instead
of writing a component when a template needs one, it writes 271 and goes looking
for templates.

**Why the design system looks the way it does, and why that does not carry.**
Its own README says it: *"No build step, and no Tailwind […] it has to open in a
browser with nothing installed."* The skill is a reference that must render
without `npm install`, so everything in it has to be a class. `garden` has a
build step — that is the whole reason it exists. Carrying the constraint across
was the mistake, not the design.

**What it cost, measured.** 17 classes were defined and used by nothing, the
navigation vocabulary among them — about 90 lines for a component that was
migrated with utilities and never touched them. Another dozen were a pile of
utilities with a name: `.at-card-title` was `m-0 font-heading text-xl
font-semibold tracking-heading`, `.at-hcard` was `flex flex-col items-center
text-center`. The clean-up took the file from 305 rules to 231 and moved the
markup from 246 distinct utilities to 272.

**What legitimately stayed**, and it is more than a third of the file: everything
styling generated Markdown, where no class can be put on anything; pseudo-elements
(the gradient title, the dotted leader, the quote marks, the corner ribbon of a
rule that grows on hover); rules about siblings and descendants; the header's
animations and its four skies; and the duotone icon stack.

**`tests/build/no-utility-bundles.test.mjs` checks the second half of the rule**
on every build. A single bare class whose declarations are all
utility-expressible fails the suite unless it is on an allowlist with a written
reason. The first half — "repeats and could drift" — is a judgement, and the
allowlist is where that judgement is recorded rather than assumed.

### Two page widths, not one

**Decided August 2026.** Documents cap at **64rem** (`--page-max`) — the article
page, the styleguide, anything that is mostly prose. Listings cap at **96rem**:
the front page, section and term listings, the archive, 404.

The design system has only the first number, and annotates it
`1024px content column, max-w-5xl upstream`. It was read off the styleguide page
— the only garden page that existed when the system was built — and then applied
to the card overview as well. A styleguide is a document. A feed of cards is not:
at 64rem it renders as one column with 120px of empty page either side.

The card follows from this rather than the other way round. It is a **size
container**, and its cover floats into the text only when the card itself is
wider than 40rem; below that the picture goes on top. That is why one card works
in a 732px single column and three across at 480px. Sizing it against the
viewport cannot work — at 1536px wide the viewport is "desktop" whether the card
is 1488px or 480px.

`--page-max-wide` does not exist as a token yet; the four listing templates carry
`max-w-[96rem]` literally. It belongs in the design system on the next sync.

### Depth — restrained shadows

Soft, shallow shadows for cards and panels. Three steps, no more.

On a surface as dark as `hsl(190 11% 11%)` a shadow reads as a slightly darker
halo rather than as lift, so separation is carried mainly by surface contrast
plus a thin gold rule. The shadows are support, not structure.

**Neumorphism was the 2020 aspiration** (see `design/neumorphism-reference-2020.png`)
and was dropped in 2026. It depends on a light-to-mid grey background to make
paired light and dark shadows readable; against this palette the effect is
nearly invisible, and its low-contrast edges routinely fail WCAG AA. Recorded
here so the idea is not rediscovered as if it were new.

### Radius — lightly rounded

4 px on buttons, inputs and badges. 8 px on cards and panels. 12 px on dialogs
and overlays.

Close to the existing `$tile-radius` of `0.45rem`, so nothing looks foreign, but
stepped deliberately instead of chosen per component. Three steps is a decision
in itself: a fourth invites a debate every time something new is built.

### Space — airy

4 px base unit. 24 px between related blocks (`gutter`). 80 px between sections
(`section`).

Named steps carry the page rhythm; the numeric scale (`p-2`, `gap-6`, …) is for
fine adjustment inside a component. Text-heavy pages benefit more from air than
from density, and this is a blog before it is anything else.

### Colour — dark and gold, named by role

Values unchanged since 2020: *"Eigentlich würde ich gerne Schwarz/Dunkelgrau und Gold
verwenden. Ansonsten schlicht halten, eben eher im Minimalistischem Style."*

Three surface steps, three ink weights, three accent steps, three state
colours, plus four growth-stage tints. That is the entire palette. New colours
need a reason that survives the styleguide.

**The tokens are named for their role, not their appearance.** The first
version used `--color-dark`, `--color-light`, `--color-gold` and produced
absurdities like `--color-dark-lighter` and `--color-light-darker` — names that
contradict themselves and say nothing about when to reach for them. Worse,
`dark` was a surface while `light` was text, so one naming pattern covered two
unrelated jobs.

| Group | Tokens | Answers |
|---|---|---|
| Surface | `surface`, `surface-raised`, `surface-sunken` | what things sit on |
| Ink | `ink`, `ink-strong`, `ink-muted` | what you read |
| Accent | `accent`, `accent-hover`, `accent-muted` | what you act on |
| State | `success`, `warning`, `error` | what happened |
| Growth | `seedling`, `budding`, `evergreen`, `withered` | icon tints only, never surfaces or text |

Role names also survive a palette change: if the site ever stops being
dark-on-gold, `surface-raised` is still the raised surface.

#### Ink is warm, surfaces stay cool — on purpose

The ink ramp was rebuilt in 2026 for two reasons. The old steps were 95 / 90 / 72
percent lightness, and five points between heading and body does not survive
antialiasing — everything read as one weight, which is exactly how it looked.
They are now 96 / 85 / 63. And the hue moved from 190 (cyan) to 40, the same
family as the gold accent at 35, because cool text sitting almost opposite a
warm accent quietly competes with it.

Saturation falls as the text gets quieter (25 → 12 → 8 percent), so the muted
step recedes instead of becoming a second accent.

The surfaces were deliberately **not** moved with it. They stay at hue 190,
which leaves a warm-text-on-cool-surface contrast. Two alternatives were
computed and rejected: desaturating the surfaces to near-neutral, and rotating
them to hue 40 with the text. The contrast is kept because it makes text read as
sitting *in front of* the surface rather than merged into it. If it ever grates,
the desaturation route (`hsl(190 4% …)`) is the smaller of the two changes.

Contrast against the default surface: 15.5 / 12.1 / 6.7 to 1 — all comfortably
past WCAG AA, the muted step included.

The styleguide shows hex values **computed from the live tokens** rather than a
hand-maintained list, because the hand-maintained one had already drifted.

---

## History

Condensed from the `blog-data` repository (2020), which this section replaces.

### The original diagnosis, in Angel's words

> *"Der Grund warum ich es nie gebacken bekomme einen Blog fertig zu stellen,
> sind meine zu Hohen Anforderungen. Zusammen mit der Tatsache, dass ich
> eigentlich nie so genau weiß, wo ich eigentlich hin will. Ich denke bereits
> während der Entwicklung an Design, was ich für die Zukunft brauchen könnte,
> was nötig wird falls der Blog 20 Autoren und Millionenfache Besucher hat…"*

And the remedy, written at the same time:

> *"Design und Programmierung müssen getrennt voneinander statt finden! Erst die
> Programmierung, **dann** das komplette Design."*

That path was then walked anyway: multi-author platform → co-author blog →
digital garden → private IndieWeb blog. The 2020 note had already answered it —
*"Fazit: Erst einmal ein privater Blog."* The scope sentence in
[`../CLAUDE.md`](../CLAUDE.md) is that same answer, written down where it gets read.

### Requirements, February 2020

First priority, all shipped: tags **and** categories, series, per-article table
of contents, two menus (main + footer), Markdown authoring, search. Comments
were on the list and were later answered differently — by IndieWeb webmentions
rather than a comment system.

Second priority: media handling, reading time, author box. Third priority: user
management, which the single-author decision has since made obsolete.

### Why Hugo

Evaluated against WordPress, Grav and Jekyll on fifteen criteria.

- **WordPress** — rejected. A permanent update treadmill, a backend to secure,
  and theme development described as *"nervenaufreibend und langatmig"*.
- **Grav** — rejected. Thin documentation, and two separate menus were not
  possible without custom work.
- **Jekyll** — chosen first, then rejected on 2020-02-28: GitHub Pages disables
  third-party plugins, which removed most of its appeal.
- **Hugo** — chosen. Already known from the profile card, batteries included for
  SEO, sitemap and RSS, and a static site with local-only editing was the
  explicit preference.

Bulma was picked as the CSS framework at the same time, on the criteria: not too
large, no deeply nested markup, flexbox rather than floats, JavaScript optional.
It was replaced by Tailwind in 2026 — see [`migration.md`](migration.md) for the
reasoning and the current state.
