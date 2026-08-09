---
title: '{{ replace .File.ContentBaseName `-` ` ` | title }}' # Usually the target page's own title
date: {{ .Date }}
draft: true # Flip to false to publish

# The saved URL — REQUIRED. The card links here; the single page renders it
# as u-bookmark-of, which is what webmention.io delivers to the target as a
# bookmark webmention (sending: #220's Telegraph flow).
bookmark_of: ""

categories: ["Allgemein"] # Optional on bookmarks — first one is the Rubrik badge
tags: [""]
---

<!-- USE WITH: hugo new content bookmarks/name-des-lesezeichens.md -->

Ein, zwei Sätze: warum dieser Link ein Lesezeichen wert ist.
