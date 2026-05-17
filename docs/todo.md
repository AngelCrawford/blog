Muss für IndieWeb nicht die volle Karte auf ALLEN Seiten vorhanden sein, auch auf der Startseite? Also, müssten die icons nicht eher generell im Header/Footer vorhanden sein? Hmm, ist die About me dann nicht nur noch mehr Content?

---

Sehr berechtigte Frage — du hast tatsächlich einen architektonischen blinden Fleck aufgedeckt.

## Was IndieWeb-Konvention verlangt

- **h-card auf JEDER Seite** (für Webmention/Mastodon/Bridgy Avatar-Resolution beim Verlinken)
- **`rel="me"` Links zu Social Profilen** auf jeder Seite (für RelMeAuth, IndieAuth)
- **Mind. eine kanonische Identitätsfläche** — typischerweise im Footer

Aktueller Stand nach unserem Refactor:
- Sidebar-h-card existiert NUR auf Article-Single-Pages ❌
- Auf Startseite, Term-Pages, Archiv, sogar About selbst → **keine h-card im Footer** ❌
- Socials nur auf `/pages/ueber-mich/` ❌

Du hast recht: **Sidebar ist die falsche Hauptlandung** für die IndieWeb-Karte. Footer ist der korrekte Ort, weil dann auf jeder Page präsent.

## Was Issue #254 dafür schon vorhält

Issue #254 ist eh als Bundle gedacht — drei Stories an derselben Surface:
- **Part A (Story 9.13):** site-wide h-card im Footer (genau was du beschreibst)
- **Part B (Story 9.10):** Author-Box auf Article-Page (was wir gerade gemacht haben, aber als Sidebar statt Footer)
- **Part C (Story 9.12):** Social-Follow-Icon-Row in Header + Footer

Wenn wir Part A + C jetzt auch mit reinziehen, ist Issue #254 **komplett** geschlossen statt nur Part B.

## Architektur-Vorschlag (Variante "Footer-First")

| Surface | Inhalt | Wer es sieht |
|---|---|---|
| **Footer (site-wide)** | h-card: Mini-Avatar + Name + Note + 9 Social-Icons (rel=me) + CTA „Mehr über mich →" | Jede Page |
| **Sidebar auf Articles** | **entfällt** — redundant zum Footer | — |
| **`/pages/ueber-mich/`** | Long-Form Content: Avatar groß + Name + Bullets + dynamisches Alter + Long-Bio-Text + ggf. Spotify/Musikgeschmack/Werdegang | Wer mehr will |

## Was die About-Page dann ist (deine Frage)

**Mehr-Content, ja** — aber legitimer Mehr-Content, kein doppelter Boilerplate. Die About-Page ist nicht mehr „IndieWeb-Pflicht", sondern Long-Form-Profil:
- Größerer Avatar, persönlichkeitsstarke Darstellung
- Birthdate / Alter (dynamisch)
- Strukturierte Bullets
- Free-text Long-Bio (kannst du nach Lust befüllen — Gummibärchen-Text aus dem alten `_index.md` z.B.)
- Spätere Erweiterungen: Spotify-Embed, Werdegang, Now-Page, Kontakt

Der Footer linkt zur About-Page als „mehr Details über die Person hinter dem Footer". Das ist **die kanonische IndieWeb-Page-Hierarchie**: kleine ständige Identitäts-Präsenz + große dedizierte Persönlichkeits-Page.

## Aufwand

- Sidebar-Code rauswerfen (gerade gebaut): 5 Min
- Footer-h-card + Social-Row bauen: ~45 Min (Markup + SCSS + Hide-on-Maintenance-Edge-Case)
- Issue #254 Part A + C komplett dokumentieren: 5 Min

Insgesamt: ~1h zusätzlich.

## Empfehlung

**Variante Footer-First umsetzen.** Sidebar-Arbeit ist nicht „verloren" — die Partial-/SCSS-Patterns übertrage ich direkt aufs Footer-h-card. Das macht Issue #254 in einem Rutsch komplett zu, und die Architektur wird konsistent.

Go? Oder willst du Sidebar trotzdem als „Wer hat den Artikel geschrieben"-Stamp behalten (für mehrteilige Co-Author-Fälle)?



Write in deutsch, translate to english, with banner → [#195](https://github.com/AngelCrawford/blog/issues/195), [#198](https://github.com/AngelCrawford/blog/issues/198), [#182](https://github.com/AngelCrawford/blog/issues/182)


## Testen für nachdem alles live ist, vor meinem ersten Blogeintrag

- https://internet.nl (testet Domain auf Sicherheit)
- W3C feed validator pass on `public/index.xml` (https://validator.w3.org/feed/)
- RSS reader spot-check (Feedbin / NetNewsWire)
  - Withered content nicht mehr drin?

## Erste gute Seiten zum Interagieren (noch aktiv!)
> IndieWeb! Schauen wie ich mich mit anderen Seiten verbinden kann!
- https://minutestomidnight.co.uk/

# Tools
- [IndieWeb Events](https://events.indieweb.org/)

# Active WIP (no issue — actively designing)

- [Icons austauschen](ideas/IconDemo.html)
- [New Home Design, einbauen](ideas/Home.html)
- [New Artikel Design, einbauen](ideas/Artikel.html)

# 📚 SEO Keyword Guidelines (Reminder beim Schreiben)

- Use 1 SEO Keyword, or as max 3 words
- Optimize posts around a single keyword
- No keyword stuffing!
- Use keyword in the HTML title and in the actual H1 title (in the URL, too)
- Mention keyword in the conclusion, too
- Mention keyword one time at the start of the post, too

# 💬 Mentor-Stil (für AI-Assistant-Setup)

> You are my ruthless mentor. Don't sugarcoat anything if my idea is weak, call it trash and tell me why. Your job is to test everything until I say it's bulletproof.
