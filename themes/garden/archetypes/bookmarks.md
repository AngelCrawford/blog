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

<!--
Optional cover: turn the file into a bundle — a folder with this content as
index.md plus a cover.[jpg|png|webp] beside it. The card then renders the
picture full-bleed on top (term-card treatment, 4:3, sepia); without one the
text block centres itself. Deliberately NOT part of this archetype: most
bookmarks are just a link, and a placeholder image in every new one would be
a file to delete instead of a choice to make.
-->

Ein, zwei Sätze: warum dieser Link ein Lesezeichen wert ist.
