---
title:  "{{ replace .TranslationBaseName "-" " " | title }}"
description: "Summary Text (remove if not wanted)"
date: {{ .Date }}
publishdate: {{ now.Format "2006-01-02" }}
tags:
- eins
- zwei
categories: ""
series: [""]
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

{{< details "Genre" "Some, Tags, I Want" >}}
{{< details "Info" "Some, Tags, I Want" >}}

{{% infobox %}}**this** is a text{{% /infobox %}}
{{% infobox theme="info" %}}**this** is a text{{% /infobox %}}
{{% infobox theme="success" %}}**Yeahhh !** is a text{{% /infobox %}}
{{% infobox theme="warning" %}}**Be carefull** is a text{{% /infobox %}}
{{% infobox theme="danger" %}}**Beware !** is a text{{% /infobox %}}

Lorem Ipsum.