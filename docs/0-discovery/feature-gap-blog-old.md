# Feature-Gap: blog-old → blog (NEU)

**Erstellt:** 2026-04-30
**Quelle:** `D:\Projects\Hugo\Sites\blog-old` (Stand Mai 2025)
**Ziel:** Übersicht aller Features aus der alten Hugo-Site, die im aktuellen Repo nicht mehr vorhanden sind.

Bereits getrackt durch offene Issues (#185, #183, #182, #173, #176, #158, #147, #146, #145, #124) wurden hier nicht doppelt aufgeführt — werden aber referenziert wo sinnvoll.

---

## 💬 Comments (komplett entfernt)

Alte Site hatte volle **Staticman v3**-Integration: Form, Replies, Moderation, Gravatar-Fallback, Comment-Counter auf Cards, 15 gespeicherte Kommentare in `data/comments/`.

- `blog-old/staticman.yml`
- `blog-old/themes/article/layouts/partials/comments/` (`comments.html`, `comment-form.html`, `comment-replies.html`)
- `[params.staticman]` Block in `blog-old/config.toml`
- `blog-old/data/comments/` (15 Beispiel-YML-Kommentare)

**Tracking (alte Issues, NICHT in den aktuell offenen):** #103, #119, #68, #69

---

## 🔒 Privacy / DSGVO

### Cookie-Banner UI
- `gdpr.js` wurde ins neue Repo übernommen
- **Aber:** Banner-Partial fehlt
- `blog-old/themes/article/layouts/partials/cookie-banner.html`
- Tracking: Issue #94

### CSP-Konfiguration kaputt ⚠️ **Live-Bug**
- `layouts/_partials/_base/head.html` referenziert `.Site.Params.csp.fontsrc / formaction / framesrc / objectsrc / stylesrc / scriptsrc / scriptsrcelem / connectsrc / default`
- In `params.yaml` ist nur `imgsrc` definiert (in `production`/`development` Overlays)
- **Folge:** Die anderen rendern als leere CSP-Direktiven
- Alt: kompletter `[params.csp]` Block in `blog-old/config.toml`

---

## 🌐 Social

- **`[[params.social]]`-Array** (FB / Twitter / Instagram / Github / RSS mit `inHeader` / `inFooter`-Flags)
  - Neu: nur RSS in einem `follow`-Block
- **`social-follow.html`** Partial (Header- + Footer-Icon-Reihe)
  - `blog-old/themes/article/layouts/partials/social-follow.html`
- **Twitter-Cards**
  - Alt hatte `[params.seo].twitterHandle` und `twitter:*` Meta-Tags
  - Neuer SEO-Partial generiert nur OpenGraph

---

## 📝 Content-Formate

### Quote-Format
Eigener Content-Type mit Layout, Bild-Overlay, Author-Anzeige, Archetype, eigenen Cards.
- `blog-old/content/quotes/`
- `blog-old/themes/article/layouts/partials/formats/quote-summary.html`
- `blog-old/archetypes/quote-bundle/index.md`

### `contains`-Taxonomie
Lieferte die Format-Icons (Instagram / Twitter / YouTube / Bild / Galerie / Code) auf Cards.
- Im alten `[taxonomies]` Block, im neuen Repo komplett raus
- Issue #158 (Format Filter) deckt nur den Filter ab — die Icons selbst fehlen ebenfalls

---

## 🧩 Shortcodes

Neu hat nur eine generische `message`-Shortcode als Ersatz.

| Shortcode | Funktion | Datei | Issue |
|---|---|---|---|
| `details` | Collapsible `<details>/<summary>` | `blog-old/themes/article/layouts/shortcodes/details.html` | #105 |
| `spoiler` | Click-to-reveal Hidden Content | `blog-old/themes/article/layouts/shortcodes/spoiler.html` | #104 |
| `infobox` | Themed Icons (info/question/warning/success/danger) | `blog-old/themes/article/layouts/shortcodes/infobox.html` | #109 |

---

## 📄 Page-Level Features

### Headline-Hash (Auto-Anchor)
Regex-basierte Injection von `#anchor`-Icons an jede Heading.
- `blog-old/themes/article/layouts/partials/single-pages/headline-hash.html`
- Neu: nur einfaches `_markup/render-heading.html` (vermutlich ohne Anchor-Icon)
- Tracking: Issue #60

### Author-Box auf Single-Page
Standalone-Partial mit Bio, Socials, Birthdate.
- `blog-old/themes/article/layouts/partials/single-pages/author-box.html`
- Neu: stripped-down Variante via `card.html`, Socials-Icons-Footer fehlt

### "Most Loved" Widget
Populäre Artikel, JS-gefüllt.
- `blog-old/themes/article/layouts/partials/widget-mostloved.html`
- Tracking: Issue #115

### Ratings auf Listing-Cards
Sterne-Anzeige auf Card-Übersichten.
- `blog-old/themes/article/layouts/partials/ratings.html`
- Neu: `rating`-Shortcode existiert nur für Body-Content
- Tracking: Issue #162

---

## 🔍 Such-Index

`index.json`-Output enthielt im alten Theme zusätzliche Felder pro Artikel:
- `tags`
- `image`
- `commentsCount`

Im neuen Repo sind `image` und `commentsCount` raus.
- `blog-old/themes/article/layouts/_default/index.json`

---

## 🤖 SEO / Output-Formate

### Per-Page RSS
- Alt: `page = ["HTML","RSS"]` — jede Seite hatte eigenen RSS-Output
- Neu: nur HTML (`page: ["HTML"]` in `config.yaml`)

### Custom robots.txt / sitemap.xml Layouts
- Alt hatte eigene Templates im Theme
- Neu: Hugo-Defaults
- `blog-old/themes/article/layouts/robots.txt`
- `blog-old/themes/article/layouts/sitemap.xml`
- Tracking: Issues #170, #171, #172 (decken die Files ab, aber die Layouts selbst fehlen jetzt auch)

---

## ⚙️ Config / Taxonomies

| Feature | Status | Tracking |
|---|---|---|
| `year` + `month`-Taxonomien | weg | #183 (URL-Anpassung) |
| `[permalinks]` für `articles/:year/:month/:slug/` | auskommentiert in neuer config.yaml | — |
| `contains`-Taxonomie | weg (siehe Content-Formate) | — |
| `[Author]`-Block (name/email Site-Ebene) | weg | — |
| `copyright`-String (Footer-Credit) | weg | — |
| `googleAnalytics`-Key | weg | #70 |
| `[params.categoryColor]`-Array (globales Kategorie→Farbe-Mapping) | weg, nun pro Term im Frontmatter | #143 |

---

## 📁 Top-Level Files

- `deploy.sh` — Bash-Deploy-Script
- `LOG.md` — 100-Days-of-Code-Log (Issue #40)
- `staticman.yml` — siehe Comments
- `code.html` / `buildDate.txt` / `version.txt` / `.hugo_build.lock` — Build-Artefakte, irrelevant

---

## ✅ Verifiziert vorhanden in NEU (nicht zu adden)

- TableOfContents (in `single.html`)
- Series-Widget
- Related-Articles
- Archive-Widget
- Pagination
- `rating`-Shortcode (Body-Content)
- `message`-Shortcode (Ersatz für details/spoiler/infobox)
- OpenGraph + JSON-LD (partial — Status siehe #173)
- Favicon-Set
- Fonts

---

## 🎯 Priorisierungs-Empfehlung

### Sofort (Live-Bug)
1. **CSP-Config in `params.yaml` vervollständigen** — sonst rendern die meisten CSP-Direktiven leer

### Phase 0 / Foundation Cleanup
2. Cookie-Banner UI (Issue #94)
3. Twitter-Cards Meta-Tags (ergänzt #173)
4. Custom `robots.txt` / `sitemap.xml` (Issues #170–172)

### Mit Digital-Garden-Roadmap einplanen
5. Staticman-Comments (alte Issues #68/#69/#103/#119)
6. Format-Icons via `contains`-Taxonomie (verbindet sich mit #158)
7. Quote-Content-Type
8. `details` / `spoiler` / `infobox`-Shortcodes (#105/#104/#109)

### Nice-to-have / Backlog
9. Headline-Hash Auto-Anchor (#60)
10. Most-Loved Widget (#115)
11. Ratings auf Listing-Cards (#162)
12. Author-Box mit Socials
13. Rich `index.json` (image, commentsCount erst nach Comments)
14. Globales `categoryColor`-Mapping (#143)
15. Per-Page RSS

### Skip / nicht sinnvoll
- `deploy.sh` (Deploy ist über GitHub Actions geplant — siehe Phase-0)
- `LOG.md` (Issue #40 — falls noch gewünscht, neu aufsetzen)
