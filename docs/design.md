# Design system

The tokens live in `themes/garden/assets/css/main.css`. What they look like
lives at **`/pages/styleguide/`** — run `hugo server` and open it. This page is
only the *why*.

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

### Colour — dark and gold

Unchanged since 2020: *"Eigentlich würde ich gerne Schwarz/Dunkelgrau und Gold
verwenden. Ansonsten schlicht halten, eben eher im Minimalistischem Style."*

Three dark surface steps (sunken, default, raised), three text weights, three
gold steps, plus four growth-stage colours for the digital-garden signal. That
is the entire palette. New colours need a reason that survives the styleguide.

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
