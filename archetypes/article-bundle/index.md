---
title: "{{ replace .TranslationBaseName "-" " " | title }}"
description: "SEO Description and Subheader for single posts" # Not more than 160 characters!
longdesc: "Summary for cards, remove for standard summary"
date: {{ .Date }}
publishdate: {{ now.Format "2006-01-02" }}
tags:
- eins
- zwei
categories: ""
contains:
- code
- instagram
- twitter
- youtube
- image
- gallery
- comment
series: [""]
weight: 1 # makes the post sticky, remove if not wanted
format: rating # rating design on the home page
rating: "0.5" # 0-5 with .5 possible, will show a rating on the home page
authors: angel
year: "{{ now.Format "2006" }}"
month: "{{ now.Format "2006/01" }}"
images:
- src: "./name.jpg"
  byline: "Idee <a href='#'>test</a>"
icons:
- src: "fab fa-windows"
  color: "#456987"
  tooltip: "Some Tooltip info"
---

<!-- Konsole: hugo new --kind article-bundle articles/my-post -->

{{< rating "Storyline" "0" >}}
{{< rating "Storyline" "3.5" >}}
{{< rating "Storyline" "5" >}}

{{< details "Genre" "Some, Tags, I Want" >}}
{{< details "Info" "Some, Tags, I Want" >}}

{{% infobox %}}**this** is a text{{% /infobox %}}
{{% infobox theme="info" %}}**this** is a text{{% /infobox %}}
{{% infobox theme="success" %}}**Yeahhh !** is a text{{% /infobox %}}
{{% infobox theme="warning" %}}**Be carefull** is a text{{% /infobox %}}
{{% infobox theme="danger" %}}**Beware !** is a text{{% /infobox %}}

Lorem Ipsum.