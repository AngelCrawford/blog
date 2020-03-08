---
title:  "{{ replace .TranslationBaseName "-" " " | title }}"
date: {{ .Date }}
publishdate: {{ now.Format "2006-01-02" }}
lastmod: {{ now.Format "2006-01-02" }}
tags: []
categories: ""
series: []
description: ""
year: "{{ now.Format "2006" }}"
month: "{{ now.Format "2006/01" }}"
images:
- src: "./name.jpg"
  byline: "Idee <a href='#'>test</a>"
- src: "./name.jpg"
  byline: "Idee <a href='#'>test</a>"
---

Lorem Ipsum.