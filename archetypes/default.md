---
title: "{{ replace .TranslationBaseName "-" " " | title }}"
description: "SEO Description and Subheader for single posts" # Not more than 160 characters!
summary: "" # if content has shortcodes, than the excerpt will render it. USE <!--start-summary--> comment in content or summary here instead
date: {{ .Date }}
draft: true # true/false, auf false setzen wenn publiziert werden soll
tags:
- eins
- zwei
categories: "Allgemein"
contains:
- code
- instagram
- twitter
- youtube
- image
- gallery
series: [""]
weight: 0 # 1 = makes the post sticky
authors: angel # if more than one, write like tags
year: "{{ now.Format "2006" }}"
month: "{{ now.Format "2006/01" }}"
featured_image:
- src: ./featured.jpg
  byline: TEST <a href='#'>test</a>
comments:
  enabled: true # set to enable comments
  deactivatedOn: YYYY-MM-DD # if set, will show the Date in the header of the message box, otherwise the infobox header will not show a date
  message: "Reaktionen wurden entfernt weil...." # if set, will show the message in the body of the message box, otherwise  the infobox will show a default text
icons:
- src: "windows-line"
  color: "#456987"
  tooltip: "Some Tooltip info"
- src: "ubuntu-line"
  color: "tomato"
- src: "android-line"
  color: "green"
- src: "apple-line"
  color: "#aaa"
ratings:
- heading: "Gesamt" # the first rating will be shown on the card and on the sidebar of the single page
  number: "3.5" # 0-5 with .5 possible, will show a rating on the home page
- heading: "Schauspieler"
  number: "0.5"
stickers:
- heading: "Genre"
  tags:
  - tag: "one"
    color: "#456987"
  - tag: "two"
- heading: "More"
  tags:
  - tag: "one"
    color: "tomato"
  - tag: "two"

---

<!-- Konsole: hugo new --kind article-bundle articles/my-post -->

[Ein Test](/articles/2020/02/test-123/ "Link Title")
[Angel Crawford](https://angel-crawford.de/ "Profil von Angel Crawford")
![Alt Attribute Description for Screen Readers](image-in-same-folder.jpg "Title and Image Descirption, shown on the frontpage <a href='#'>Testlink</a>")

{{% infobox %}}**this** is a text{{% /infobox %}}
{{% infobox title="This is a header" %}}**this** is a text{{% /infobox %}}

{{% infobox theme="info" %}}**this** is a text{{% /infobox %}}
{{% infobox title="This is a header" theme="info" %}}**this** is a text{{% /infobox %}}

{{% infobox theme="success" %}}**Yeahhh !** is a text{{% /infobox %}}
{{% infobox title="This is a header" theme="success" %}}**Yeahhh !** is a text{{% /infobox %}}

{{% infobox theme="warning" %}}**Be carefull** is a text{{% /infobox %}}
{{% infobox title="This is a header" theme="warning" %}}**Be carefull** is a text{{% /infobox %}}

{{% infobox theme="danger" %}}**Beware !** is a text{{% /infobox %}}
{{% infobox title="This is a header" theme="danger" %}}**Beware !** is a text{{% /infobox %}}

{{% infobox theme="question" %}}**Question !** is a text{{% /infobox %}}
{{% infobox title="This is a header" theme="question" %}}**Question !** is a text{{% /infobox %}}

<!--start-summary-->
## Eine Überschrift
Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.

{{% spoiler %}}**Bold is** A collection of *textile samples* lay spread out on the table - Samsa was a travelling salesman - and above it there hung a picture that he had recently cut out of an illustrated magazine and housed in a nice, gilded frame.{{% /spoiler %}}

{{% spoiler %}}
  **Bold is** A collection of *textile samples* lay spread out on the table - Samsa was a travelling salesman - and above it there hung a picture that he had recently cut out of an illustrated magazine and housed in a nice, gilded frame.
{{% /spoiler %}}

<!-- Title has to be filled, without it's not working! -->
<!-- The Text inside has to be on his own line, otherwise it will not be inside a p-element -->
{{% details title="Some details" %}}
  **Bold is** A collection of textile samples lay spread out on the table - Samsa was a travelling salesman - and above it there hung a picture that he had recently cut out of an illustrated magazine and housed in a nice, gilded frame.
{{% /details %}}

> A collection of textile samples lay spread out on the table - Samsa was a travelling salesman - and above it there hung a picture that he had recently cut out of an illustrated magazine and housed in a nice, gilded frame. It showed a lady fitted out with a fur hat and fur boa who sat upright, raising a heavy fur muff that covered the whole of her lower arm towards the viewer. Gregor then turned to look out the window at the dull weather. Drops Samsa woke
> 
> *Quelle: some name*

<!-- linenos=table         => show numbers in code block -->
<!-- hl_lines=[1,"3-5", 8] => highlight row 1, 3 to 5 and 8 -->
<!-- linenostart=3         => start numbers from row number 3 -->

```html {linenos=table,hl_lines=[1,"3-5", 8],linenostart=3}
  <meta name="author" content="Angel Crawford" />
  <p>
    Weit hinten, hinter den Wortbergen, fern der Länder Vokalien und Konsonantien leben die Blindtexte.<br />
    Abgeschieden wohnen sie in Buchstabhausen an der Küste des Semantik, eines großen Sprachozeans.<br />
    Ein kleines Bächlein namens Duden fließt durch ihren Ort und versorgt sie mit den nötigen Regelialien.<br />
    Es ist ein paradiesmatisches Land, in dem einem gebratene Satzteile in den Mund fliegen.<br />
    Nicht einmal von der allmächtigen Interpunktion werden die Blindtexte beherrscht<br />
  </p>
```