# Article Time — Design System

**Article Time** ist ein persönlicher Blog im IndieWeb mit etwas Digital Garden, geschrieben von **einer** Person: Angel Crawford. Er soll sich lesen wie ein Magazin — Rubriken, Tags, Serien, Kartenübersichten, Archiv — nur ohne Redaktion. Ein Produkt: eine statisch generierte Website (Hugo), deutschsprachig, dunkel und minimalistisch, Gold als einzige Akzentfarbe.

Everything in this system is German-facing. Component APIs and code comments are English; **every string a visitor reads is German.**

## The product

One product, one surface: `angel-crawford.de`, a Hugo site built from `AngelCrawford/blog`. **ONE THEME since August 2026:**

- **`themes/garden`** — Tailwind 4, every template, hook, shortcode and asset. Preflight is on, there is one stylesheet, and no `!important` anywhere.
- **`themes/article-time`** — the Bulma predecessor. **Deleted.** It owned the header, cards, article body and footer until the teardown; what was worth keeping was carried over deliberately, not inherited.

The design system in this project is the *garden* vocabulary (`gd-*` classes, role-named tokens) plus the article-time patterns worth keeping (the header, the card, the tile chrome, and above all the footer).

Content types: **Artikel** (full posts, with Rubrik, Tags, optional Serie, growth stage, reading time), **Notizen** (short notes with no detail page of their own), and the taxonomies **Rubriken**, **Tags**, **Serien**. A **Wachstumsstufe** — seedling, budding, evergreen, withered — is attached to every article; that is the digital-garden signal. Engagement is a **heart** and incoming **IndieWeb webmentions**; there is no comment system, by decision.

## Sources

- **Repository:** <https://github.com/AngelCrawford/blog> — branch `main`. Worth exploring before building anything substantial: `themes/garden/layouts` is the ground truth for every value here. See `github.md` for the sync record.
- **`docs/design.md`** in that repo — the *why* behind every decision below. Read it before changing a token.
- **`themes/garden/assets/css/tokens.css`** — the live token block; **`components.css`** — the 160-odd rules that survived the audit, each one something utilities cannot say.
- **The site itself.** There is no styleguide page any more: a hand-kept catalogue drifted from the components it claimed to document, so it was deleted in August 2026. Look at a card, an article and the footer.

No logo file exists in any source. **There is no wordmark asset** — the brand mark is the site title set in Montserrat Alternates with the gold gradient over it (`.at-wordmark`). Render the name in type wherever a logo would go; do not draw one.

---

## Content fundamentals

**Language.** German, always. Section labels use the plural: *Artikel, Notizen, Rubriken, Tags, Serien, Archiv*. Growth stages keep their English names (*Seedling, Budding, Evergreen, Withered*) with a German gloss in the tooltip: "Evergreen; gepflegt & aktuell".

**Person.** First person singular where the author speaks, second person where the reader is addressed — and sparingly. Most copy is neither: it is plain declarative statement of what a thing is. The site never says "wir".

**Register.** Direct, dry, self-aware, occasionally blunt about its own failures. The tone of the documentation *is* the tone of the product: a reason is given, alternatives that were rejected are named, and the cost of a decision is left visible rather than tidied away. Examples, verbatim from the sources:

> *"Ein Styleguide, der von Hand gepflegt wird, driftet innerhalb eines Monats."*
> *"Drei Flächenstufen reichen; eine vierte lädt nur zur Diskussion ein."*
> *"Die Zeile steht hier, damit der Preis sichtbar bleibt statt vergessen zu werden."*
> *"Erst die Programmierung, dann das komplette Design."*

**Sentence shape.** Short main clause, then the qualification after an em dash or a colon. Rhetorical questions are avoided. Exclamation marks appear roughly never — the one exception is a quoted note from 2020.

**Casing.** Sentence case in prose and on buttons (*Über mich*, *Weiterlesen*, *Archiv*). ALL CAPS only for the 11px tile labels (RUBRIK, STADIUM, PUBLIZIERT), with 0.08em tracking. Never in a heading.

**Numbers and dates.** Dates are always pre-formatted German short form `06.08.26`; a raw timestamp never reaches the page. Counts are stated plainly with the unit: "7 Min.", "14 Artikel", "3 Einträge", singular "1 Eintrag". Reading time is computed at 179 words per minute and rounded up.

**Emoji: no.** Not in copy, not in headings, not as icons — and since August 2026 there are no exceptions: the "Gesehen" and "Neu" corner badges, which used to carry ✓ and ☀ literally, now take `check-fill` and `sparkling-line` from the sprite. Anything that looks like a symbol is a Remixicon glyph.

**Empty states** are one italic muted line, not an illustration: *"Noch keine Reaktionen."*, *"Keine Treffer für „…“."*

**Honesty is a content rule.** A withered article is not deleted and not hidden — it says so at the top, gives the date it was last tended, and links its successor. The archive is the one place that counts withered entries, because an archive that hides things is not an archive.

---

## Visual foundations

### Colour

Dark plus gold, minimal, unchanged since 2020. **Tokens are named for their role, not their appearance** — `surface-raised` stays the raised surface even if the palette ever changes.

| Group | Tokens | Answers |
|---|---|---|
| Surface | `surface`, `surface-raised`, `surface-sunken` | what things sit on |
| Ink | `ink`, `ink-strong`, `ink-muted` | what you read |
| Accent | `accent`, `accent-hover`, `accent-muted`, `accent-shadow` | what you act on |
| State | `success`, `warning`, `error` | what happened |
| Growth | `seedling`, `budding`, `evergreen`, `withered` | icon tints only |

**Ink is warm, surfaces stay cool — on purpose.** Ink sits at hue 40, the same family as the gold accent at 35; the surfaces stay at hue 190. The resulting warm-on-cool contrast makes text read as sitting *in front of* the surface rather than merged into it. The ink ladder is 96 / 85 / 63 percent lightness (the old 95 / 90 / 72 collapsed into one visual weight under antialiasing), and saturation falls as the text gets quieter, 25 → 12 → 8, so the muted step recedes instead of becoming a second accent. Contrast against `--color-surface`: 15.5 / 12.1 / 6.7 : 1.

**Gold is the only accent.** Growth tints are the sole exception and are restricted to glyphs — never a surface, never a run of text. Social icons carry their silo's own brand colour in the h-card; that is the second and last exception. No other colour enters the system without a reason that survives a night's sleep. **No purple-blue gradients, no rainbow, no second accent.**

### Type

**Montserrat Alternates** for headings, **Montserrat** for body, both self-hosted (a GDPR requirement from the start — nothing is fetched from Google at runtime). Decided February 2020, confirmed 2026; serif alternatives were rejected outright as a standing personal preference.

Seven sizes, 14 → 48px, and **each size carries its own line height** (1.55 down to 1.1). Body sits at **1.7**, not the usual 1.5: dimmer text on a dark surface needs more room between lines. 12px does not exist — it was too small to read and was removed from the scale, so any leftover use fails visibly.

Headings are weight 600 with 0.03em tracking. The known cost — `I`, `l` and `1` are hard to tell apart in Montserrat — is accepted knowingly; the specimen string `Illegal · Ill 1l · lIl1` is worth typing whenever the heading font is touched, so the cost stays visible rather than forgotten.

**Re-opened and closed again, August 2026.** The body face was put back on the table specifically because of that ambiguity, and three replacements were set against it: **IBM Plex Sans** (resolves all three glyphs — tailed `l`, crossbarred `I`, footed `1`), **Atkinson Hyperlegible** (drawn for exactly this problem) and **Public Sans** (tailed `l`, otherwise near-identical proportions, the smallest possible change). **Montserrat stays.** Judged side by side at 16px on 1.7 it simply read better: the higher x-height and the finer, lighter stroke carry a long text more comfortably than any of the three, and the ambiguity — which almost never causes real confusion in running prose — does not outweigh that. Recorded here so the question is not reopened a third time as if it were new. The side-by-side comparison page is gone: it pulled all three candidates from Google Fonts at runtime, which this project does not do — this paragraph is the record instead.

### Space and layout

4px base unit. **24px (`gutter`) between related blocks, 80px (`section`) between sections.** Airy over dense: this is a blog before it is anything else. Content column caps at 64rem; prose caps at 70ch. Named steps carry page rhythm; the numeric scale is for fine adjustment inside a component.

The one fixed element is the back-to-top round button, bottom right.

### Backgrounds and texture

The page ground is `--color-surface-sunken` carrying a **dotted texture** — a radial-gradient dot on a 1vw grid, sized in viewport units so the grain scales instead of turning into polka dots on a large display. It is the bottom of the stack; every surface reads against it.

Imagery: **4:3 landscape and sepia, both without exception.** One aspect ratio for every photograph on the site — cards, term tiles, article headers. The old covers were 2:3 portrait cropped from the same files; a portrait well beside a text column makes the card as tall as the picture rather than as tall as the text, and this blog's pictures are roads, skylines and screens, which are landscape subjects forced upright.

Cover images render at `sepia(1)` and release to full colour on hover over 0.3s. That is the house treatment, not a per-image choice: it pulls every photograph, whatever its own palette, into the gold. **Position is part of the treatment too** — a figure floats left, `min(46%, 22rem)` wide, sitting 1.5em left of and 1.5em below its container's top corner so it hangs past the left edge and the text runs around it. Floated rather than placed in a grid column, because a landscape image in its own column leaves a text column six words wide. Below 640px the float drops and the image sits above the text. Any container holding one needs `.at-flow` to contain the float. **8px radius on both the card and the picture inside it**, paired shadow, captions as an opaque bar over the bottom edge — the image must not be rounder than the box that holds it. See the *Bilder* card under Brand.

The one exception is the **note card**, where the image is a full-bleed background at 50% opacity with the quote set over it — there the picture is the surface, not an illustration beside the text.

There are no full-bleed photographs, no hand-drawn illustrations and no repeating patterns beyond the dot grid. Gradients are used in exactly three places: the gold text gradient on `gd-h1` and the wordmark, the sky in the header, and the protection fades described below.

### Depth

Three shadow steps, used sparingly. On a surface this dark a shadow reads as a slightly darker halo, not as lift, so **separation is carried by surface contrast plus a thin gold hairline**; the shadows are support, not structure. The governing rule: **a surface level only ever sits on a *different* level.** Panel on page, card on panel or page, never panel on panel.

**Neumorphism** was the 2020 aspiration and was dropped as a page-wide idea in 2026 — it needs a light-to-mid grey ground to make paired light/dark shadows readable, and against this palette it disappears and fails AA. It survives in exactly two places, because there it works: the **card's paired shadow** (`--shadow-card`) and the **round button's shadow inversion on press** (`--shadow-domed` → `--shadow-pressed`).

### Borders and radii

Hairlines, not rules: 1px in `--color-accent-muted` at 40% (25% for the quieter variant). Radii step 4 / 8 / 12px — buttons and fields / cards and panels / dialogs and overlays — plus a legacy 7.2px on tile chrome. Three steps is itself a decision; a fourth invites a debate every time something new is built.

Gold appears as a line in three shapes, and they are not interchangeable: the **section rule** on `gd-h2` fading out to the right; the **centred rule** to both sides of a `LinedTitle` in the footer; and the **dotted leader** running between a label and its number in statistics and archive rows.

### Cards

`--color-surface-raised` fill, 8px radius, 1px gold border at 20% (50% for a pinned entry — any positive `weight`, capped at three per feed), and the paired card shadow. Hover does exactly three things: a **gold rule grows along the bottom edge** (2px, ending short of the corners so it never runs into the radius), the cover releases its sepia, and the round button presses in. Nothing scales, nothing lifts.

The excerpt is **not** clipped: a protection gradient needs `overflow: hidden`, which establishes a block formatting context and kills the floated cover's overhang. Hugo's `truncate` cuts the text instead. **No ribbon** — the Rubrik is a neutral pill with a dot in the category's own colour, and the corner belongs to the state flags (Neu / Gepflegt / Gesehen). The card footer is three segments divided by hairlines: reading time, the marks and counters, the round Weiterlesen button.

### The page title lives inside the box

Every page's `gd-h1` sits **inside** its content panel, not loose above it. Outside the panel it reads as a second banner hanging under the header: two gold display texts stacked, the wordmark and the page title competing for the same job. In the box the hierarchy is unambiguous — the decorated band at the top is the site, the box below is this page, and the title is the page's own heading rather than another masthead.

This is also why the header is allowed to be as decorated as it is. It only works because nothing directly beneath it competes.

**Still open:** the wordmark and `gd-h1` share the identical gold gradient. Upstream they always have, and putting the title in the box separates them well enough to live with. If it still reads as doubled, the smaller change is dropping the gradient from `gd-h1` and setting page titles in `--color-ink-strong`, which keeps the gradient as the mark's alone.

### Where the current site and the new rules disagree

Two things on the live card conflict with the token decisions, and both are left as they are rather than quietly changed:

- **Coloured Rubrik ribbons.** The live cards carried teal, red and gold ribbons from each category's `categoryColor` — three saturated hues, none in the palette, on the most repeated element of the site. **Resolved, August 2026:** the ribbon is gone entirely. The Rubrik is a neutral pill whose **dot** carries `categoryColor`; surface stays neutral, so a row of them reads as one family. Same mechanism on the tag pairs in prose.
- **The corner flags** were the only place the site set unicode symbols instead of sprite glyphs. **Resolved, August 2026:** the flags stay — a rotated 45° corner flag is useful and long-standing — with sprite glyphs, and there are now three: **Neu** in the palette's green (a feed full of gold "Gesehen" needs the new one to stand out), **Gepflegt** in light gold with the pencil (tended since YOUR last visit — the marker stores a timestamp, so it dies when you reopen the article), and **Gesehen** in muted gold. Nothing outside the sprite renders as an icon any more.

### Transparency and blur

Barely used, and only where nothing else works. `color-mix` alphas on borders and tints; `blur(30px)` behind the wordmark as a glow; `blur(0.1em)` plus an SVG turbulence filter on the footer's upside-down skyline reflection. No frosted-glass panels, no backdrop filters over content.

### Animation

Short and unshowy: 0.15 / 0.2 / 0.3s, all `ease-out`, on colour, border, shadow and transform only. Nothing bounces, nothing scales. Three real animations exist, all in chrome rather than content — the clock face rising once on load, two birds crossing the header on a slow loop, and a shimmer sweeping across the wordmark on hover. The footer's sea ripples over 200 seconds so it moves without anyone noticing. `prefers-reduced-motion` drops the movement everywhere and keeps the shadow inversion, because that is feedback, not decoration.

### Interaction states

- **Hover** — a *lighter* gold (`accent` → `accent-hover`), never darker, never an opacity change. On icon rows, hovering one item dims its siblings to 35% instead of highlighting the target.
- **Press** — shadow inversion plus 2px of downward travel, on round buttons only.
- **Focus** — a 2px `accent` outline at 2px offset; on fields a 3px translucent ring rather than a colour change, so it survives any field state. `caret-color` picks up the accent, so even the text cursor belongs to the palette.
- **Disabled** — 55% opacity, `not-allowed` cursor.
- **Current** — gold text plus `aria-current` in navigation; a permanently pressed round button in pagination.
- **Cursor** — anything clickable shows a pointer. Stated once globally so no component has to remember it.

---

## Iconography

**Remixicon**, self-hosted as an SVG sprite at `assets/icons/remixicon.symbol.svg` (53 symbols, copied from the repository — not a CDN link, and not substituted). The webfont build ships too, but for exactly ONE pair of glyphs now: the double quotes on pull quotes, notes and the footer slogan (`\ec51` / `\ec52`).

The other two codepoints were fiction. The external-link arrow (`\ecaf`) had been dead since the port — the escape came out of the CSS pipeline as an empty string, and the icon FONT it addressed was never even shipped by the site; it is a sprite `<svg>` in the link render hook now. The figcaption image marker is a sprite glyph too. **If a glyph can be an element, it is one**; the font survives only where CSS content is the only hook available.

**Duotone is the default, not the exception.** Every glyph renders as two stacked copies: behind, the filled `-fill` body in `--color-accent-shadow`, offset 0.03em right and 0.055em down; in front, the `-line` glyph in accent gold, lifting to `accent-hover` on hover while the shadow stays put. The offset is in `em`, so **size comes from `font-size`, never from width/height**. The vertical shift is nearly twice the horizontal one: an equal offset reads as a diagonal smear, weighting it down reads as the glyph sitting above its own shadow.

CSS cannot fill an outline, so glyphs whose `-fill` partner is missing from the sprite get the same offset via `drop-shadow` and stay single-colour. Getting true duotone across the whole set means regenerating the sprite with fill partners included.

Icon sizes in use: 1em inline in card and Steckbrief rows (the row decides the size — ONE SIZE IN THE ROW, and no component inside it sets its own), 1.25rem in navigation, 1.1em in the heart capsule, 35px inside a 48px round button (the drawn shape is far smaller than its 24×24 viewBox, so a "large" number is correct).

Icons never appear without a purpose: no decorative icon rows, no icon per paragraph. Growth stages, formats (article / note), metadata (calendar, pencil, timer, tag, stack), navigation and silo logos — that is the whole vocabulary.

---

## Index

| Path | What |
|---|---|
| `styles.css` | The one file consumers link. `@import` lines only. |
| `tokens/` | `colors.css`, `typography.css`, `spacing.css`, `radius.css`, `depth.css`, `motion.css`, `fonts.css` (`@font-face`). |
| `css/base.css` | Page ground, dotted texture, prose defaults, links, focus ring. |
| `css/components.css` | The `gd-*` vocabulary plus the article-time patterns (card, tile, growth, tooltip, wordmark, sky, widgets). In the live repo this file is down to ~160 rules: everything utilities could express moved into the markup or into a `ui/*` partial. |
| `guidelines/` | 18 specimen cards: Colors, Type, Spacing, Brand. |
| `components/` | React primitives, grouped below. |
| `ui_kits/website/` | Click-through recreation of the Hugo site — see its own README. |
| `assets/fonts/Montserrat/` | Three TTFs plus both OFL licences. |
| `assets/icons/` | Remixicon SVG sprite and woff2. |
| `assets/images/header/` | `city.svg` (harbour silhouette), `birds.svg`, `clock.webp`, `clock_small.webp`, `hotairballoon.svg`. |
| `assets/images/favicon/` | `favicon.svg`, `favicon-96x96.png`, `apple-touch-icon.png`. |
| `assets/images/identity/` | `angel.webp` — the h-card portrait. |
| `assets/images/covers/` | Two generic cover photographs for card and term mockups. |
| `github.md` | Source repository and sync record. |
| `SKILL.md` | Agent-skill entry point. |

### Components

**core/** — `Icon`, `Button`, `RoundButton`, `Panel`, `Heading`, `LinedTitle`, `Message`
**forms/** — `Field`, `Check`
**content/** — `ArticleCard`, `TermCard`, `GrowthBadge`, `HeartButton`, `Tag`, `Hashtag`, `Ribbon`, `InfoTiles`, `InfoTile`, `WitheredBanner`, `Webmention`
**navigation/** — `SiteNav`, `Pagination`, `TocSidebar`, `SeriesSidebar`, `RelatedSidebar`, `ArchiveWidget`
**site/** — `SiteHeader`, `SiteFooter`, `HCard`

Each has a sibling `.d.ts` (props) and `.prompt.md` (what & when, usage, variants). One `@dsCard` HTML per directory shows the states.

The inventory is the source's inventory. Nothing was added that the Hugo templates and SCSS do not define — no Toast, no Avatar, no Tabs, no Accordion.

**Intentional additions** (two, both wrappers rather than new design):
- `Icon` — the sprite has no component upstream; templates inline `<svg><use href>` by hand. A wrapper is needed so the duotone rule is applied consistently instead of retyped.
- `LinedTitle` — the `lined-title` SCSS mixin has no component of its own upstream; it is used at four call sites, which is exactly the "would repeat and could drift" test the source states for promoting something to a component.

### Not recreated

Present upstream, deliberately absent here because nothing would be gained by approximating them: the maintenance page, the cookie/GDPR banner, the profile page, the YouTube and rating shortcodes, the fireworks/santa-hat/ghost seasonal header overlays, and the search implementation itself (`search.js`). The header's seasonal overlays are the one omission worth flagging — if they matter, the assets and SCSS are in the repository.

---

## No build step, and no Tailwind

The live Hugo site runs Tailwind — the `garden` theme declares its tokens in a `@theme static` block and the templates are utility-classed. **This design system deliberately does not.** The same values ship as plain CSS custom properties in `tokens/`, the recurring patterns as ordinary classes in `css/components.css`, and the components as React with inline styles.

The reason is what a design system is for: it has to open in a browser and render with nothing installed. A utility-classed artifact needs Tailwind's scanner to have seen the exact literal class strings at build time — a class assembled from a variable produces no rule, no warning and an unstyled element, which is the failure mode the project's own CLAUDE.md warns about (Tailwind rule 6). Tokens survive that; utilities do not.

Consequences worth knowing:

- Utility names from the Hugo templates (`bg-surface-raised`, `text-ink-muted`, `gap-gutter`, `rounded-md`) **do not work here.** The token behind each one does: `var(--color-surface-raised)`, `var(--color-ink-muted)`, `var(--spacing-gutter)`, `var(--radius-md)`.
- Every token name matches upstream exactly, minus Tailwind's `--color-`/`--text-` prefixes where it had them, so porting a value in either direction is a rename and never a re-decision.
- Taking a component from here back into Hugo means writing the utilities for it; taking a Hugo template from there into a mock here means reading the token off the utility. The `gd-*` classes are the shared vocabulary in both directions.

## Using this system

1. Link `styles.css`. That reaches every token and both webfonts.
2. Set `window.AT_SPRITE` to the icon sprite's path relative to your page before mounting.
3. Compose from the components. **Never hardcode a colour, size, radius or shadow** — the previous theme accumulated 4,355 lines of SCSS across 29 files precisely because its components decided their values afresh.
4. Layout stays in the markup. The card is a component; the grid it sits in is not.
5. Before adding a component, apply the source's own test: does the decision repeat and could it drift, or can utilities genuinely not express it (pseudo-elements, counters, positioning against a distant ancestor)? If neither, do not write one.
