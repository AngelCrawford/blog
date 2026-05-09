# Active WIP (no issue — actively designing)
- [Backlog](docs/backlog)
- [Icons austauschen](docs/IconDemo.html)
- [New Home Design, einbauen](docs/Home.html)
- [New Artikel Design, einbauen]('docs/Artikel.html')
- [Noch mini Sachen offen](docs\3-implementation\phase-0-task-breakdown.md)

## These require your GitHub identity / live-site access and cannot be done by me:

1. **T1 — webmention.io account for `article-time.de`** (AC #2). Recommended: GitHub OAuth at https://webmention.io. If signup needs `rel="me"`, fall back to adding `<link rel="me" href="https://github.com/AngelCrawford" />` to `head.html` (1-line, in-scope addition).
2. **T4 — store `WEBMENTION_IO_TOKEN` in GitHub Secrets** (AC #4). Repo Settings → Secrets and variables → Actions. Pre-positioning for Story 3.2.
3. **T3 — manual webmention.rocks Test #1** (AC #3) — *post-deploy*. Send to a real article URL → confirm in webmention.io dashboard within ~30s.


# 🔄 Remixicon Updates: Cache-Bust Workflow

**Sprite (`remixicon.symbol.svg`) updated:**

1. Datei in `static/fonts/remixicon/` ersetzen
2. `config/_default/params.yaml`: `remixicon_version` bumpen (Unix-Timestamp ms)
3. Commit + push

**Font-Files (`.woff2` / `.woff` / `.ttf` / `.eot` / `.svg`) updated:**

1. Files in `static/fonts/remixicon/` ersetzen
2. `_icons.scss` Whitespace-Bump (forciert neuen CSS-Fingerprint → Browser holt neue Fonts)
3. Optional: `remixicon_version` mitbumpen
4. Commit + push

> Hintergrund + sauberere Lösung (SCSS-Template-Partial): bei Bedarf nachfragen oder im git-log nach `feat(seo): CSP block` suchen.


# 📚 SEO Keyword Guidelines (Reminder beim Schreiben)

- Use 1 SEO Keyword, or as max 3 words
- Optimize Posts around A Single Keyword
- No Keyword stuffing!
- Use Keyword in the title of HTML and in the actual H1 title (in the URL, too)
- Mention keyword in the conclusion, too
- Mention keyword one time in the start of the post, too


# 🌱 Digital Garden Concept Reference

[docs\0-discovery\Digital-garden.md](docs\0-discovery\Digital-garden.md)

> Content that grows and evolves over time, where quality naturally rises through community engagement, and updates are rewarded with visibility.

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

**🔗 Cross-Epic Dependencies in Epic 2 (Klarstellung):**

Zwei Stories in Epic 2 referenzieren Epic 3 — **kein Strukturfehler**, sondern *soft dependency* (Daten/Runtime, kein Build-Blocker):

| Story | Hintergrund |
|---|---|
| **2.4 — Webmention Display** | UI ist mit leerem/Mock-JSON baubar + testbar. Echte Daten-Datei `data/webmentions_by_article.json` wird von Story 3.2 erzeugt; bis dahin greift der „No replies yet"-Fallback (AC5 explizit Teil der Story). |
| **2.6 — Daily Rebuild Workflow** | Workflow-Scaffolding (Cron + Hugo Build + Deploy) ist eigenständig. „Fetch engagement data" ist in AC4 explizit als **Placeholder-Step** spezifiziert, der erst in Epic 3 mit echten Scripts befüllt wird. |

**Warum die Trennung sinnvoll bleibt:**

- Epic 2 = *Surface Layer* (Endpoints, UI, Scaffolding — was Reader & externe Sites sehen)
- Epic 3 = *Data Layer* (Fetch-Scripts, Score-Berechnung — was die Daten produziert)

Würde man 2.4 + 2.6 nach Epic 3 verschieben, zerriss es die thematische Klammer „Engagement Infrastructure". Status quo bleibt, Soft-Dep ist hiermit dokumentiert.

**Konsequenz fürs Drafting:**

Epic 2 komplett draftbar (alle 7 Stories), inkl. 2.4 + 2.6 — beim Implementieren von 2.4/2.6 Mocks bzw. Placeholder verwenden, bis Epic 3 echte Daten liefert. Reihenfolge im Critical Path bleibt: Epic 2 → Epic 3 → echte Datenflüsse.

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

## 💬 Mentor-Stil (für AI-Assistant-Setup)

> You are my ruthless mentor. Don't sugarcoat anything if my idea is weak, call it trash and tell me why. Your job is to test everything until I say it's bulletproof.
