---
title: "{{ replace .TranslationBaseName "-" " " | title }}"
date: {{ .Date }}
tags:
- eins
- zwei
categories: ""
authors: angel
year: "{{ now.Format "2006" }}"
month: "{{ now.Format "2006/01" }}"
featured_image:
- src: ./featured.jpg
  byline: TEST <a href='#'>test</a>
_build:
  render: false
  list: true
---

<!-- Konsole: hugo new --kind quote-bundle articles/my-quote -->

Lorem Ipsum.