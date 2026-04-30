# Open Items (Make Github issues?)
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

## 4. CSP Configuration
The head.html references .Site.Params.csp.* but the params file wasn't fully reviewed. Ensure CSP is properly configured to prevent XSS attacks.

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