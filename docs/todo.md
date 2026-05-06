# Open Items (Make Github issues?)

- Preflight Datei anlegen mit SEO Stuff für jede Seite - Wenn nicht erfüllt, kein commit möglich?
- [Icons austauschen](docs/IconDemo.html)
- [New Home Design, einbauen](docs/Home.html)
- [New Artikel Design, einbauen]('docs/Artikel.html')

Was kommt nach dem Re-Deploy

1. Workflow läuft grün durch mit den Scripts
2. Du machst die **3 manuellen Verifikationen** (CSP/RSS/Schema) — sind ja jetzt mehrfach gepusht worden, sollten alle stabil sein
3. Wenn alles passt: **Day 7.2 README updaten** (mache ich) + **Day 7.1 Final-Cycle-Test** (1× Workflow manuell triggern, alle Steps grün?)
4. **Issues schließen** (#31, #38, #41, #49, #173)
5. **Optional:** ersten Release-Tag setzen `git tag -a v0.1.0` → Footer zeigt das ab nächstem Run

Sag Bescheid wenn der Push durch ist und der Workflow grün durchgelaufen ist — dann gehen wir Day 7 an.

---

## 🔄 Remixicon Updates: Cache-Bust Workflow

**Kontext:** Phase-0-Cleanup hat das `?t={{ .Site.Params.remixicon_version }}` aus den `@font-face`-URLs in `assets/scss/vars/_icons.scss` entfernt — Hugo prozessiert SCSS-Imports nicht als Template, daher rendert die Variable dort nicht. Der `?t=`-Query blieb literal in der URL stehen.

### Wo der Cache-Bust noch funktioniert (HTML-Templates)

Diese Dateien werden von Hugo **als Template gerendert**, hier funktioniert `{{ .Site.Params.remixicon_version }}` einwandfrei:

- `layouts/baseof.html`, `layouts/single.html`, `layouts/list.html`, `layouts/page/archive.html`
- `layouts/_partials/card.html`, `layouts/_partials/_base/{footer,navigation}.html`
- `layouts/_partials/widgets/{archive,pagination,series}.html`
- `layouts/_markup/render-heading.html`, `layouts/_shortcodes/rating.html`
- `assets/js/search.js` (wird via `resources.ExecuteAsTemplate` prozessiert)

→ Diese laden alle `remixicon.symbol.svg?t=<version>#<icon-name>`. **Bump von `remixicon_version` in `params.yaml` invalidiert den Browser-Cache der SVG-Sprite-Datei korrekt.**

### Wo der Cache-Bust NICHT mehr funktioniert (CSS @font-face)

`assets/scss/vars/_icons.scss` lädt die Remixicon-Font-Files (`.eot`, `.woff2`, `.woff`, `.ttf`, `.svg`) ohne Query-Parameter:

```scss
src: url("fonts/remixicon/remixicon.woff2") format("woff2"),
     ...
```

→ Browser cached diese Dateien per ETag/Last-Modified von GitHub Pages.

### Workflow beim Update der Remixicon-Files

**Wenn du nur die Icon-Liste in der SVG-Sprite (`remixicon.symbol.svg`) änderst:**

1. Sprite-Datei in `static/fonts/remixicon/remixicon.symbol.svg` ersetzen
2. `config/_default/params.yaml`: `remixicon_version` bumpen (Unix-Timestamp in ms, z. B. `1750019714996`)
3. Commit + push → Workflow deployed → Browser invalidiert SVG-Sprite-Cache automatisch

**Wenn du die Font-Files (`remixicon.woff2` etc.) änderst** (passiert bei größeren Remixicon-Updates):

1. Font-Dateien in `static/fonts/remixicon/` ersetzen
2. `_icons.scss` bumpen — z. B. einen Whitespace/Kommentar-Change einfügen
   - Damit ändert sich der CSS-Fingerprint-Hash (`style.min.<NEUER-HASH>.css`)
   - Browser lädt die neue CSS-Datei und bei If-Modified-Since fragt es die Font-Files neu an
   - GitHub Pages liefert die geänderten Files zurück
3. Optional: zusätzlich `remixicon_version` in `params.yaml` bumpen (für die Sprite)
4. Commit + push

### Bessere Lösung (wenn du oft updatest)

Falls dir das nervt, gibt's einen sauberen Hugo-Weg ohne CSS-Editing-Ritual:

**Option: SCSS partial rausziehen → als Template-Partial einbinden**

`_icons.scss` wird zu einem Hugo-Template (z. B. `layouts/_partials/icons-css.html`), das einen `<style>`-Block mit den `@font-face`-Definitionen rendert. Dort funktioniert `{{ .Site.Params.remixicon_version }}` direkt. Wird in `head.html` per `{{ partial "icons-css" . }}` eingebunden.

Vorteile:
- `params.yaml: remixicon_version` bumpen reicht für Komplett-Cache-Bust (Sprite + Fonts)
- Kein Whitespace-Trick mehr in SCSS nötig

Nachteile:
- Zusätzlicher Inline-`<style>`-Block in `<head>` (~1 KB unminified)
- Würde `'unsafe-inline'` in CSP `style-src` voraussetzen — haben wir bereits
- Etwas mehr Setup-Komplexität

→ Lohnt sich wenn du Remixicon **mehrmals pro Woche** updatest. Für gelegentliche Updates reicht das aktuelle Schema mit `_icons.scss` Whitespace-Bump.

### Schnelltest: ist der Cache wirklich invalidiert?

Nach Re-Deploy in DevTools → Network → Hard-Refresh (Ctrl+F5):
- `style.min.<hash>.css` sollte **neuen Hash** haben (Beweis: SCSS wurde neu kompiliert)
- `remixicon.woff2` sollte mit Status **200** (nicht "200 (from disk cache)") laden
- `remixicon.symbol.svg?t=<neue-version>` mit dem aktuellen `remixicon_version`-Wert

## 1. Modern browsers don't need jQuery for basic DOM manipulation 
**Recommendation:** Consider migrating to vanilla JavaScript to reduce bundle size by ~30KB (minified).

## 2. Overly aggressive use of !important (main.scss:55-57)
```css
*, html {
scroll-behavior: smooth !important;
scroll-padding-top: 35px;
}
```
**Problem:** Using !important on the universal selector (*) is an anti-pattern that can cause cascading issues.

**Better approach:**
```css
html {
scroll-behavior: smooth;
scroll-padding-top: 35px;
}
```

## 3. Hardcoded German text 
- In baseof.html:15
- Mixing language comments

## 5. Performance Considerations

**Large search index loading**
- search.js loads entire site index from /index.json
- This grows with every article you publish
- No lazy loading - loads even if user never searches

**Recommendations:**
- Lazy load search functionality (only when search box is focused)
- Consider Algolia, Lunr.js, or Pagefind for better search performance
- Implement search result pagination

**Font loading**
- You're using preload for fonts (good!)
- But missing font-display: swap in CSS to prevent FOIT (Flash of Invisible Text)

**JavaScript bundle size**
- jQuery: ~30KB minified + gzipped
- Consider using native JavaScript for simple operations
- Split vendor bundles more aggressively


## 6. No error pages beyond 404:
- Missing 500.html, 403.html, etc.
- Could improve user experience during errors

---

## Other
- A token-based design system
- https://discourse.gohugo.io/t/title-of-categories-page-is-not-translated/55359/2
- AI davon abhalten meinen Content zu klauen
- Wenn ein Bild mit AI generiert wurde, Watermark hinzufügen, hover Watermark öffnet ein Tooltip mit dem Prompt der benutzt wurde, Model, etc.

> You are my ruthless mentor. Don’t sugarcoat anything if my idea is weak, call it trash and tell me why. Your job is to test everything until i say it’s bulletproof.

------------------

- Search Console Google verwenden, DSGVO?
- Use 1 SEO Keyword, or as max 3 words
- Optimize Posts around A Single Keyword
- No Keyword stuffing!
- Use Keyword in the title of HTML and in the actual H1 title (in the URL, too)
- Mention keyword in the conclusion, too 
- Mention keyword one time in the start of the post, too

---

[docs\0-discovery\Digital-garden.md](docs\0-discovery\Digital-garden.md)

Content that grows and evolves over time, where quality naturally rises through community engagement, and updates are rewarded with visibility.

---

## ⚠️ Sprint-Reihenfolge: Epic-Nummern ≠ chronologische Reihenfolge!

Quelle: [docs/1-planning/epics.md](1-planning/epics.md) — Tabelle "Epic Overview" (Spalte **Weeks**) + Abschnitt "Story Sequencing Notes".

**Tatsächliche zeitliche Reihenfolge laut PRD-Roadmap:**

| Reihenfolge | Epic | Phase | Week | Hinweis |
|---|---|---|---|---|
| 1. | **Epic 2** — Engagement Infrastructure | 1A | Week 1-2 | Critical Path Start (Umami + Webmentions) |
| parallel | **Epic 1** — Growth Stage System | 1A | Week 3 | unabhängig, kann parallel zu Epic 2 |
| 2. | Epic 3 — Popularity Scoring | 1A | Week 4-5 | braucht Epic 2 |
| 3. | Epic 4 — Three-Tier Sorting | 1A | Week 4-5 | braucht Epic 3 |
| 4. | Epic 5 — Badge & Filter System | 1A | Week 6 | braucht Epic 1 + Epic 4 |
| 5. | Epic 8 — Format Expansion | 1B | Week 7-9 | braucht Epic 5 |
| 6. | Epic 6 — History Timeline | 2 | Week 10 | parallel zu Epic 8 möglich |
| 6. | Epic 9 — Polish & Optimization | 2 | Week 10-11 | |
| 7. | Epic 7 — POSSE & Adv. Webmentions | 3 | Week 12-13 | braucht nur Epic 2 |

**Critical Path:** Epic 2 → Epic 3 → Epic 4 → Epic 5

**Eigene Entscheidung (Solo-Projekt, Hugo-Blog):**
- Epic 1 zuerst ist auch ok — kleinere Stories, sichtbares visuelles Feedback (🌱🌿🌳💀), blockiert nichts Kritisches.
- Epic 2 hat externe Abhängigkeiten (Umami-Account, webmention.io-Setup, GitHub Secrets) — Phase-0-Setup nicht vergessen.
- Hybrid möglich: Story 2.1 (Umami, 0.5d) als Quick-Win → Epic 1 komplett → zurück zu Epic 2.

**Sprint-Planning-Strategie:**
- Bei "flachen" Epics (Epic 6, Epic 8): alle Stories des Epics gemeinsam draften ist ok.
- Bei Epics mit Inter-Story-Abhängigkeiten (Epic 2, Epic 5): 1-2 Stories voraus draften, dann implementieren.
- BMM-Default "eine Story nach der anderen" zielt auf Teams ab; Solo darf gebatcht werden.

---

## 📝 Manuelle Aufgabe: Growth-Stage-Migration bestehender Inhalte

**Wann:** Nach Abschluss von Story 1.1 (Growth Stage Frontmatter Field), idealerweise vor Epic 4 (Three-Tier Sorting), spätestens vor Live-Schaltung der Filter (Epic 5).

**Warum:** Story 1.1 fügt nur das `growth_stage`-Feld + Default-Fallback hinzu — bestehende Artikel werden technisch **nicht** angefasst (würden alle als `seedling` zählen, weil das der Default ist). Für die Sortierung (Epic 4) und das Filtern (Epic 5) bringt das aber wenig Aussagekraft, solange alle Artikel als Sämling gelten.

**Was zu tun ist:**

Alle bestehenden Artikel in `content/articles/` und `content/logs/` durchgehen und ehrlich bewerten:

| Stage | Bedeutung | Beispiel-Heuristik |
|---|---|---|
| 🌱 `seedling` | Früher Entwurf, noch unvollständig | Letzte 3 Monate, kurze Notiz, „TODO" im Text |
| 🌿 `budding` | In Entwicklung, Hauptpunkte da, aber nicht poliert | Solider Inhalt, evtl. unfertige Struktur |
| 🌳 `evergreen` | Ausgereift, gut gepflegt, weiterhin korrekt | Tiefer Inhalt, regelmäßig aktualisiert oder zeitlos |
| 💀 `withered` | Veraltet/deprecated, sollte als überholt markiert werden | Tools/Frameworks veraltet, keine Pflege geplant |

**Praktischer Workflow:**
1. Liste aller Artikel: `find content/articles content/logs -name "*.md" | wc -l` — wie viele sind es?
2. Pro Artikel: lesen, Stage festlegen, im Frontmatter ergänzen
3. Für `withered` zusätzlich: `withered_date`, optional `withered_reason` und `replacement_url` setzen (siehe Story 1.4)
4. Bulk-Review: einmal mit `hugo` builden → falls `errorf`-Validierung greift (Story 1.1 implementiert), korrigieren
5. Commit als eigenständigen Migrations-Commit (`chore(content): assign growth_stage to existing posts`) — sauber separat von Code-Changes

**Tipp:** Einen kleinen Helper-Script schreiben falls > 50 Artikel: liest alle .md-Files, listet sie mit Datum + Titel auf, fragt im Terminal nach Stage. Aber für ~31 Artikel (laut `architecture.md`) lohnt sich das nicht — manuell durchklicken ist schneller.

**Quelle:** Architektur-Dokument `docs/2-solutioning/digital-garden-integration-architecture.md` (lines 1527-1528, "Update existing articles with `growth_stage: \"seedling\"` (migration task)") — als Migration explizit out-of-scope von Story 1.1.

---

## 🌐 Custom Domain Setup: article-time.de (verschoben aus Phase-0 Task 3.2)

**Wann:** Wenn du bereit bist, die Site unter `article-time.de` statt `angelcrawford.github.io/blog/` zu betreiben.

**Warum verschoben:** DNS-Propagation dauert 1-24h und blockiert dich bei Phase-0-Tests. Der Workflow funktioniert auch ohne — `actions/configure-pages` liefert automatisch die richtige `base_url`, sobald Custom Domain in den Pages-Settings gesetzt ist.

### Voraussetzungen

- Zugriff auf den Domain-Registrar (wo `article-time.de` gekauft wurde)
- Repository ist public (✅ erledigt)
- GitHub Pages ist aktiv via GitHub Actions (✅ erledigt)

### Schritte

**Teil A: DNS-Records beim Registrar setzen**

Vier A-Records auf GitHub Pages IPs + ein CNAME für `www`:

| Type | Name | Value |
|---|---|---|
| A | @ (oder `article-time.de`) | `185.199.108.153` |
| A | @ | `185.199.109.153` |
| A | @ | `185.199.110.153` |
| A | @ | `185.199.111.153` |
| CNAME | www | `angelcrawford.github.io` |

DNS-Änderungen brauchen 1-24h zur Propagation.

**Teil B: GitHub-Settings**

1. Repository → Settings → Pages
2. **Custom domain** Feld → `article-time.de` eintragen → Save
3. Warten auf "DNS check successful" (kann ein paar Minuten dauern)
4. Sobald grün: **Enforce HTTPS** anhaken

**Teil C: Verifikation**

- `http://article-time.de` → leitet auf `https://article-time.de` um
- Browser zeigt grünes HTTPS-Schloss
- DevTools → Network: `style.xxx.css` lädt mit Status 200 von `article-time.de`

### Was im Workflow automatisch passiert

Der `daily-rebuild.yml`-Workflow nutzt `actions/configure-pages@v5` mit Output `base_url`. Sobald Custom Domain gesetzt ist:
- `base_url` → `https://article-time.de/` (war: `https://angelcrawford.github.io/blog/`)
- Hugo wird mit `--baseURL` gegen den neuen Wert gebaut
- **Keine Workflow-Änderung nötig** — beim nächsten Run sind alle Asset-URLs korrekt

### Akzeptanzkriterien

- [ ] DNS-Records beim Registrar eingetragen
- [ ] Custom Domain in GitHub Pages Settings gesetzt
- [ ] DNS-Check passt (nach Propagation)
- [ ] Enforce HTTPS aktiv
- [ ] Site erreichbar unter `https://article-time.de` mit funktionierendem Design

**Quelle:** `docs/3-implementation/phase-0-task-breakdown.md` Task 3.2 — verschoben für späteren Termin.
