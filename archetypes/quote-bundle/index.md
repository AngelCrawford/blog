---
title: "{{ replace .TranslationBaseName "-" " " | title }}"
date: {{ .Date }}
publishdate: {{ now.Format "2006-01-02" }}
tags:
- eins
- zwei
categories: ""
format: quote
authors: angel
year: "{{ now.Format "2006" }}"
month: "{{ now.Format "2006/01" }}"
images:
- src: "./name.jpg"
  byline: "Idee <a href='#'>test</a>"
_build:
  render: false
  list: true
---

<!-- Konsole: hugo new --kind quote-bundle articles/my-quote -->

Lorem Ipsum.