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
5. **Kein jQuery.** Neuer JavaScript-Code ist Vanilla, ausnahmslos. jQuery ist noch im Bundle, weil `gdpr.js`, `header.js`, `main.js` und `search.js` daran hängen — aber es kommt nichts mehr dazu. Wenn eine Komponente nach `garden` wandert, wandert ihr JS jQuery-frei mit. Das Ziel ist, `jquery.js` (285 KB Quelltext) mit dem letzten dieser vier Skripte zu löschen.
6. **Fertige Test-Ordner werden gelöscht.** `npm test` räumt bei Erfolg selbst auf (`scripts/clean-test-artifacts.mjs`). Bei Fehlschlag bleiben sie liegen — dann braucht man sie zum Debuggen. Wer neue Build-Ziele einführt, trägt sie dort ein.
7. **Backlog lebt in GitHub Issues**, nicht in Dateien. Keine Epics, keine Stories, keine Sprint-Artefakte im Repo.
8. **Issues fasse ich nicht an.** Anlegen, schließen, labeln macht Angel selbst.

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

**Theme-Komposition:** `theme: ["garden", "article-time"]`. Hugo löst von links nach rechts auf — das erste Theme, das eine Datei definiert, gewinnt; der Projekt-Root schlägt beide. `garden` trägt das Tailwind-4-Design-System und übernimmt Komponente für Komponente, `article-time` liefert alles Übrige weiter aus. Eine Datei in `garden` anzulegen aktiviert sie automatisch.

Wer eine Datei sucht: `themes/<theme>/layouts/…`, nicht `layouts/…`.

**Wo stehe ich gerade?** → [`docs/migration.md`](docs/migration.md). Dort steht, welche Komponente schon in `garden` liegt, welche noch nicht, und was die nächsten Meilensteine sind. Die Datei wird im selben Commit aktualisiert, der eine Komponente verschiebt.

## Tailwind-Regeln (teuer gelernt)

Solange beide Themes laufen:

1. **Bulma liegt in einem Cascade Layer**, Garden nicht. Ungelayertes CSS schlägt *jedes* gelayerte, unabhängig von Spezifität und Reihenfolge — dadurch gewinnt Garden immer, ohne je überbieten zu müssen. Der Versuch, Bulma stattdessen per Spezifität zu schlagen, hat reihenweise Utilities lahmgelegt: `text-2xl` auf einem Absatz kam als 16 px, `mb-3` tat nichts, `space-y-*` fiel zusammen. **Herunterstufen statt überschreien.**
2. **Kein Preflight.** Tailwinds Reset und Bulmas Normalize würden sich prügeln. Erst anschalten, wenn das letzte Bulma-Template weg ist — dann fällt auch der gescopete Ersatz-Reset weg.
3. **`source(none)` plus explizites `@source`.** Ohne das scannt Tailwind vom Projektverzeichnis aus und findet das *gebaute* HTML voller Bulma-Klassen — gemessen 44 ungewollte Utilities. `@source` muss auf **jeden** Ort zeigen, an dem Klassennamen stehen, auch auf JavaScript, das DOM baut.
4. **`@source`-Pfade sind projektrelativ**, nicht dateirelativ. Hugo pipet das CSS über stdin an die CLI. Ein falscher Pfad erzeugt stillschweigend null Utilities.
5. **Tailwind liest auch Kommentare.** Ein bloßes Wort in Prosa, das zufällig ein Utility-Name ist, wird als echte Regel erzeugt. In Prosa umschreiben oder trennen.
6. **Klassennamen nie aus Variablen zusammensetzen.** Tailwind extrahiert nur vollständige Strings; `bg-{{ .name }}` erzeugt gar nichts, ohne Warnung.
7. **Tokens gehören in `@theme static`**, sonst wirft Tailwind ungenutzte Variablen weg.
8. **Dev-Server mit `--disableFastRender`** starten, sonst tauchen neue Klassen erst nach Neustart auf.

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
