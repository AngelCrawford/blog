---
title: "Datenschutz"
type: page
menu:
  footer:
    weight: 20
params:
  robotsdisallow: true
---

*Stand: 11. Mai 2026 · Version: 1.1*

## Auf einen Blick

Diese Seite respektiert Deine Privatsphäre — und ist dabei ehrlich darüber, was passiert. Es gibt **keine Tracking-Cookies, keine personalisierte Werbung, keine Newsletter-Anmeldung, kein Kommentarsystem**. Aber vier Dinge wirst Du wissen wollen, weil sie Daten betreffen:

1. **Umami** — anonyme Seitenaufrufe ohne Cookies (siehe Abschnitt unten).
2. **Herz-Reaktionen** — Du kannst Artikeln ein Herz geben; das wird als anonymes Event gezählt.
3. **Webmentions** — wenn andere Seiten auf meine Artikel verweisen, erscheinen diese Erwähnungen öffentlich.
4. **Hinweis-Dismiss bei verwelkten Inhalten** — blendest Du einen Warnhinweis aus, merkt sich Dein Browser das nur für die aktuelle Sitzung.

Im Detail:

## Anonyme Analyse mit Umami

Ich nutze [Umami Cloud](https://umami.is) (`cloud.umami.is`), um zu sehen, wie viele Leute meine Artikel lesen — **ohne Cookies, ohne IP-Speicherung, ohne Wiedererkennung über Sitzungen hinweg**.

**Was wird erfasst?**

* Seitenaufrufe (anonymisiert, gehasht aus URL + User-Agent + täglich rotierender Salt)
* Verweisende Seite (Referrer)
* Browser, Betriebssystem, Bildschirmgröße (grobe Kategorien)
* Land (über IP, aber die IP selbst wird nicht gespeichert)

**Was wird NICHT erfasst?**

* Keine Cookies
* Keine eindeutige Geräte- oder Nutzer-ID
* Keine IP-Adressen (in Umamis Cookieless-Modus)
* Keine Wiedererkennung beim erneuten Besuch

**Verarbeiter:** Umami Software, Inc. — Datenschutzhinweise: <https://umami.is/docs/legal/privacy>

**Rechtsgrundlage:** Art. 6 Abs. 1 lit. f DSGVO — berechtigtes Interesse an der Performance-Messung der eigenen Website ohne personenbezogene Daten.

**Wie kannst Du widersprechen?**

* Aktiviere `Do Not Track` in Deinem Browser — Umami respektiert das.
* Blockiere `cloud.umami.is` über Browser-Erweiterungen wie uBlock Origin.
* Nutze einen Browser, der externe Scripts standardmäßig blockiert.

## Herz-Reaktionen

Unter jedem Artikel findest Du eine Herz-Schaltfläche. Wenn Du sie anklickst, wird ein anonymes Event über Umami gezählt — kein Login, kein Profil, keine personenbezogenen Daten.

**Was wird gesendet?**

* Ein Umami-Event mit dem Namen `heart` und der Artikel-URL als Parameter (z. B. `{ article: "/articles/mein-artikel/" }`).
* Sonst nichts.

**Was wird im Browser gespeichert?**

* Ein Eintrag im `localStorage` Deines Browsers (Schlüssel `hearted-<artikel-url>`), damit Du nicht versehentlich mehrfach klickst.
* Dieser Eintrag bleibt nur in Deinem Browser, wird nirgendwo synchronisiert.
* Du kannst ihn über die Browser-Einstellungen (DevTools → Application → Local Storage → Site löschen) jederzeit entfernen.

**Rechtsgrundlage:** Art. 6 Abs. 1 lit. f DSGVO — berechtigtes Interesse an der Erhebung anonymer Engagement-Signale; keine Identifikation einzelner Lesender möglich.

**Wie kannst Du widersprechen?** Klicke das Herz nicht. Es gibt keine andere Erfassung.

## Webmentions

Diese Website empfängt **Webmentions** über den Dienst [webmention.io](https://webmention.io/) (betrieben von Aaron Parecki). Webmentions sind ein offener IndieWeb-Standard für föderierte Erwähnungen und Antworten zwischen Websites — vergleichbar mit Trackbacks/Pingbacks, aber moderner und spamresistenter.

**Welche Daten werden empfangen?**

Wenn eine andere Website auf einen meiner Artikel verweist und eine Webmention sendet, werden folgende Informationen öffentlich auf meiner Seite sichtbar:

* URL der verweisenden Seite (Quell-URL)
* Autorenname (sofern von der sendenden Seite bereitgestellt)
* Avatar-Bild des Autors (sofern bereitgestellt — wird direkt von der Domain des Senders geladen, dabei wird Deine IP an diese Domain übermittelt)
* Antworttext oder Auszug der Erwähnung (sofern bereitgestellt)

Es werden **keine** IP-Adressen, Cookies oder personenbezogenen Daten der Webmention-Sender oder der Lesenden bei mir gespeichert. Die Erfassung erfolgt regelmäßig durch einen automatischen Build-Prozess.

**Verarbeitung durch webmention.io:** Der Dienst webmention.io empfängt die Webmentions stellvertretend und stellt sie über eine öffentliche API bereit. Verantwortlich für diesen Dienst ist Aaron Parecki. Datenschutzhinweise: <https://webmention.io/>.

**Rechtsgrundlage:** Art. 6 Abs. 1 lit. f DSGVO — berechtigtes Interesse an föderierter Kommunikation und transparenter Diskussion zwischen Websites.

**Wie kannst Du widersprechen?**

* Sende keine Webmentions an Artikel auf dieser Seite.
* Du kannst eine bereits gesendete Webmention zurückziehen, indem Du den Link auf der ursprünglich verweisenden Seite entfernst — die Webmention wird beim nächsten Build automatisch entfernt.
* Bei Erwähnungen, die über Drittplattformen weitergeleitet wurden (z. B. Mastodon-Boosts), ist eine Rücknahme per Link-Entfernung nicht immer möglich. In diesen Fällen kontaktiere mich direkt — siehe Abschnitt **Kontakt für Datenschutzanfragen**.

## Hinweis-Dismiss bei verwelkten Inhalten

Auf als „verwelkt" (deprecated) markierten Artikelseiten erscheint oben ein gelber Warnhinweis. Wenn Du auf das ✕ klickst, merkt sich Dein Browser **nur für die aktuelle Sitzung**, dass dieser eine Hinweis ausgeblendet bleiben soll.

**Was wird gespeichert?**

* Ein Eintrag im `sessionStorage` Deines Browsers, Schlüssel `withered-banner-dismissed:<artikel-pfad>`, Wert `1`.
* Pro Artikel ein eigener Eintrag (das Ausblenden auf einem verwelkten Artikel betrifft keine anderen).

**Wie lange bleibt das gespeichert?** Bis Du den Tab schließt — `sessionStorage` wird vom Browser automatisch gelöscht, anders als `localStorage` oder Cookies. Beim nächsten Besuch erscheint der Hinweis wieder.

**Was wird übertragen?** Nichts. Der Eintrag verlässt Deinen Browser nicht.

**Rechtsgrundlage:** § 25 Abs. 2 Nr. 2 TTDSG — technisch erforderlich, um die von Dir per Klick angeforderte Dismiss-Funktion umzusetzen. Keine Einwilligung nötig.

## Was diese Seite NICHT tut

Damit es keine Missverständnisse gibt, hier eine Liste dessen, was diese Seite **nicht** macht:

* **Keine Tracking-Cookies.** Umami arbeitet im Cookieless-Modus. Hearts werden im `localStorage` markiert, der Withered-Hinweis-Dismiss im `sessionStorage` (sitzungsweise, kein Cookie). Webmentions sind serverseitig, kein Browser-Storage.
* **Keine personenbezogenen Daten.** Es gibt keine Anmeldung, keinen Newsletter, kein Kommentarsystem, kein Kontaktformular.
* **Keine Werbung.** Keine Banner, keine Affiliate-Links mit Tracking, keine „Sponsored Content"-Einbindungen, kein Google AdSense.
* **Kein Google Analytics.** Kein Google Tag Manager, keine Google Fonts (Schriftarten werden lokal eingebunden), keine Google reCAPTCHA.
* **Kein Facebook-Pixel.** Keine Like-Buttons, keine Open-Graph-Pixel, keine Conversion-Tracker.

Aber transparent: ein paar Dinge entstehen technisch automatisch:

* **Server-Log beim Hoster (GitHub Pages):** GitHub speichert Zugriffslogs (siehe Abschnitt **Externes Hosting** weiter unten).
* **Eingebundene YouTube-Videos:** Wenn ein Artikel ein YouTube-Video einbettet, wird `youtube-nocookie.com` genutzt (datenschutzfreundlicher Modus, keine Cookies bis zum Klick auf Play).
* **Avatare bei Webmentions:** Werden direkt von den Servern der jeweiligen Sender geladen (siehe Abschnitt **Webmentions**).

## Kontakt für Datenschutzanfragen

Bei Fragen zum Datenschutz oder zur Ausübung Deiner DSGVO-Rechte erreichst Du mich per E-Mail. Die Adresse ist gegen Spam-Bots leicht verfremdet — bitte vor dem Senden einmal manuell zusammensetzen ([at] → `@`, [dot] → `.`):

> **mail [at] article-time [dot] de**

**Deine Rechte unter der DSGVO:**

* **Auskunftsrecht (Art. 15):** Welche Daten habe ich über Dich gespeichert? (Antwort vorab: keine personenbezogenen Daten — siehe Abschnitt **Was diese Seite NICHT tut**.)
* **Recht auf Berichtigung (Art. 16):** Falls doch etwas falsch ist, kannst Du Korrektur verlangen.
* **Recht auf Löschung (Art. 17):** Du kannst die Löschung Deiner Daten verlangen.
* **Recht auf Einschränkung der Verarbeitung (Art. 18).**
* **Recht auf Datenübertragbarkeit (Art. 20).**
* **Widerspruchsrecht (Art. 21).**
* **Beschwerderecht bei der Aufsichtsbehörde (Art. 77):** Du kannst Dich bei der zuständigen Datenschutzaufsichtsbehörde Deines Bundeslandes beschweren — das Beschwerderecht besteht unbeschadet anderweitiger Rechtsbehelfe.

## Externes Hosting

Diese Website wird bei einem externen Dienstleister gehostet (Hoster). Die personenbezogenen Daten, die auf dieser Website erfasst werden, werden auf den Servern des Hosters gespeichert. Hierbei kann es sich v. a. um IP-Adressen, Meta- und Kommunikationsdaten, Webseitenzugriffe und sonstige Daten, die über eine Website generiert werden, handeln.

### Github Pages

Diese Website wird auf Servern von [Github Inc.](https://www.github.com/), 88 Colin P Kelly Jr St, San Francisco, CA 94107, USA gehostet. Beachte daher auch die [GitHub Privacy Policy](https://help.github.com/de/github/site-policy/github-privacy-statement#github-privacy-statement).

### Server-Log-Dateien

Der Provider der Seiten erhebt und speichert automatisch Informationen in so genannten Server-Log-Dateien, die Dein Browser automatisch an mich übermittelt. Dies sind:

* Browsertyp und Browserversion
* verwendetes Betriebssystem
* Referrer URL
* Hostname des zugreifenden Rechners
* Uhrzeit der Serveranfrage
* IP-Adresse

Eine Zusammenführung dieser Daten mit anderen Datenquellen wird nicht vorgenommen.

Die Erfassung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO. Der Websitebetreiber hat ein berechtigtes Interesse an der technisch fehlerfreien Darstellung und der Optimierung seiner Website — hierzu müssen die Server-Log-Files erfasst werden.

### SSL- bzw. TLS-Verschlüsselung

Diese Seite nutzt aus Sicherheitsgründen und zum Schutz der Übertragung vertraulicher Inhalte eine SSL- bzw. TLS-Verschlüsselung. Eine verschlüsselte Verbindung erkennst Du daran, dass die Adresszeile des Browsers von „http://" auf „https://" wechselt und an dem Schloss-Symbol in Deiner Browserzeile. Wenn die SSL- bzw. TLS-Verschlüsselung aktiviert ist, können die Daten, die Du an mich übermittelst, nicht von Dritten mitgelesen werden.

### Cookies widersprechen

Du kannst die Speicherung von Cookies generell durch eine entsprechende Einstellung Deiner Browser-Software verhindern. Da diese Seite ohnehin keine Tracking-Cookies setzt, ist das hier weniger eine Datenschutzfrage als eine generelle Browser-Konfiguration.

Anleitungen für:

* [Google Chrome](https://support.google.com/chrome/answer/95647?co=GENIE.Platform%3DDesktop&hl=de)
* [Firefox](https://support.mozilla.org/de/kb/cookies-loeschen-daten-von-websites-entfernen)
* [Safari](https://support.apple.com/de-de/guide/safari/sfri11471/mac)
* [Safari iOS](https://support.apple.com/de-de/HT201265)
* [Opera](https://help.opera.com/de/latest/security-and-privacy/#clearPrivateData)
* [Google Chrome Android](https://support.google.com/accounts/answer/32050?co=GENIE.Platform%3DAndroid&hl=de)
