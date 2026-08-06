# Article Time — Scope & Arbeitsregeln

## Was das hier ist

> **Privater Blog im IndieWeb, ein Autor, mit etwas Digital Garden.**

Inhalte tragen eine Wachstumsstufe (`growth_stage`) und können verwelken. Das war's an Digital Garden.

## Was es nicht ist

Kein Magazin. Keine Plattform. Kein Multi-Author-System. Keine Community-Features.

Diese Liste ist der **Filter**: Wenn ein Feature-Vorschlag oder ein GitHub-Issue eines dieser Dinge voraussetzt, gehört es nicht in dieses Projekt — egal wie gut die Idee für sich ist. Der Blog ist zwischen 2020 und 2026 viermal umgedacht worden (Multi-Author-Plattform → Co-Author → Digital Garden → das hier). Diese Zeile beendet das.

## Arbeitsregeln

1. **Keine neuen Features, bis das Design-System steht.** Das ist die Regel, die sechs Jahre gefehlt hat.
2. **Keine hartkodierten Design-Werte.** Farben, Abstände, Radien, Schatten, Schriftgrößen kommen aus den Tokens — nie direkt ins Komponenten-SCSS. Wer eine Komponente baut, wählt aus dem Styleguide aus, statt neu zu erfinden.
3. **Design und Programmierung getrennt.** Erst funktioniert es, dann sieht es gut aus. Nicht gleichzeitig.
4. **Lorem-Ipsum-Content ist Absicht.** Der Content unter `content/` ist bewusst Fixture-Material für die Entwicklung. Nicht als „fehlender Inhalt" behandeln und nicht ungefragt ersetzen.
5. **Backlog lebt in GitHub Issues**, nicht in Dateien. Keine Epics, keine Stories, keine Sprint-Artefakte im Repo.
6. **Issues fasse ich nicht an.** Anlegen, schließen, labeln macht Angel selbst.

## Struktur

| Ort | Inhalt |
|---|---|
| `content/` | Inhalte (aktuell Fixtures) |
| `config/` | Hugo-Config, vier Umgebungen: `_default`, `development`, `production`, `maintenance` |
| `themes/article-time/` | Das bestehende Theme: `layouts`, `assets`, `i18n`, `archetypes`, `static` |
| `data/` | CI-generierte Laufzeitdaten (Hearts, Webmentions). Bleibt immer im Projekt-Root. |
| `static/CNAME` | GitHub-Pages-Domain. Gehört zum Projekt, nicht ins Theme. |
| `scripts/`, `schemas/`, `tests/` | Tooling, bleiben im Root |
| `docs/ideas/` | Angels Design-Gedanken und Mockups. **Nicht anfassen.** |

**Theme-Komposition:** `config/_default/config.yaml` setzt `theme`. Hugo löst von links nach rechts auf — das erste Theme, das eine Datei definiert, gewinnt; der Projekt-Root schlägt beide. Sobald `themes/garden/` (Design-System) existiert, wird daraus `theme: ["garden", "article-time"]`. So kann eine Komponente nach der anderen migriert werden, ohne dass zwischendurch etwas kaputt ist.

Wer eine Datei im Theme sucht: `themes/article-time/layouts/…`, nicht `layouts/…`.

## Beim Schreiben von Artikeln

- Ein SEO-Keyword pro Artikel, maximal drei Wörter. Kein Keyword-Stuffing.
- Keyword in HTML-Title, H1 und URL. Je einmal am Anfang und im Fazit erwähnen.
- Deutsch schreiben; Übersetzung ins Englische ist ein späteres Thema.

## Vor dem Livegang zu prüfen

- [internet.nl](https://internet.nl) — Domain-Sicherheit
- [W3C Feed Validator](https://validator.w3.org/feed/) gegen `public/index.xml`
- RSS-Reader-Stichprobe (Feedbin / NetNewsWire) — verwelkte Inhalte dürfen nicht auftauchen
- [indiewebify.me](https://indiewebify.me/) — IndieWeb-Validierung
- Fixture-Content entfernen (Screenshots vorher!)

## Ton

Angel will einen schonungslosen Gegenüber, keinen Ja-Sager. Schwache Ideen benennen und begründen, warum sie schwach sind. Annahmen prüfen, statt sie zu übernehmen. Das gilt ausdrücklich auch für Ideen, die von Angel selbst kommen.
