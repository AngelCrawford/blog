---
title: "{{ replace .Name "-" " " | title }}"
date: {{ .Date }}
draft: true
---

<!-- Images erhalten ihre figcaption über die EXIF data in der Datei - Image > Properties > Details > Title (kann HTML) -->
<!-- Das Header Bild MUSS "cover" heißen, Hugo übernimmt das formatieren zu .webp und die Bilder werden in die richtige Größe gesetzt -->

```html
title: Chapter I: The Grand Hall

date: 2017-04-09T10:58:08-04:00
publishdate: 2020-12-31
lastmod: 2022-11-29T22:33:55.556Z
draft: false # true/false, auf false setzen wenn publiziert werden soll

description: Pierre Gringoire
summary: Demand to be let outside at once, and expect owner to wait for me as i think about it sleep nap for sleep all day whilst slave is at work, play all night whilst slave is sleeping and meow. Stinky cat meowing chowing and wowing lick the other cats.

# format: rating # rating design on the home page
# rating: "0.5" # 0-5 with .5 possible, will show a rating on the home page

tags:
  - scene
  - quote
categories: Movie
series: Seriennummer

authors: angel
authors: 
- angel
- jdksaj

contains:
  - image
  - instagram
  - code
  - gallery
weight: 1

slug: chapter-1-the-grand-hall
year: 2017
month: 2017/04

comments:
  enabled: true
  deactivatedOn: YYYY-MM-DD
  message: "Reaktionen wurden entfernt weil...."

ratings:
	- heading: "Gesamt"
	  number: "3.5" # 0-5 with .5 possible, will show a rating on the home page
	- heading: "Schauspieler"
	  number: "0.5"
icons:
	- src: "windows-line"
	  color: "#456987"
	  tooltip: "Some Tooltip info"
	- src: "ubuntu-line"
	  color: "tomato"
	- src: "android-line"
	  color: "green"
	- src: "apple-line"
	  color: "white"
stickers:
	- heading: "Genre"
	  tags:
	  - tag: "Some"
	  - tag: "Tag"
	  - tag: "I Want"
	- heading: "Info"
	  tags:
	  - tag: "Some Tag"
	  - tag: "Long Tag I want for testing purpose"
	  - tag: "Anything"
```

```md
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

<!-- {{% spoiler %}}**Bold is** A collection of *textile samples* lay spread out on the table - Samsa was a travelling salesman - and above it there hung a picture that he had recently cut out of an illustrated magazine and housed in a nice, gilded frame.{{% /spoiler %}}

{{% spoiler %}}
  **Bold is** A collection of *textile samples* lay spread out on the table - Samsa was a travelling salesman - and above it there hung a picture that he had recently cut out of an illustrated magazine and housed in a nice, gilded frame.
{{% /spoiler %}}


{{% details title="Some details" %}}
  **Bold is** A collection of textile samples lay spread out on the table - Samsa was a travelling salesman - and above it there hung a picture that he had recently cut out of an illustrated magazine and housed in a nice, gilded frame.
{{% /details %}}

{{% details title="Some details" %}}
  **Bold is** A collection of *textile samples* lay spread out on the table - Samsa was a travelling salesman - and above it there hung a picture that he had recently cut out of an illustrated magazine and housed in a nice, gilded frame.
{{% /details %}} -->


<!-- {{% infobox theme="warning" title="test" %}}**Be carefull** is a text{{% /infobox %}} -->
```