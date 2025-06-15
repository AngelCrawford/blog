---
title: "{{ replace .Name "-" " " | title }}"
subtitle: "" # Optional
date: {{ .Date }}
# lastmod: {{ .Date }} -> Change if you update the post and want another date then from git
# publishdate: {{ .Date }} -> Only usefull, if running Hugo on server
draft: true # true/false, turn to false if you want to publish the post
weight: 0 # 1 = makes the post sticky

# format: log -> Activate the next three lines
# build:
#   list: always
#   render: link

year: {{ .Date.Format "2006" }} # Use for archive sorting year
month: {{ .Date.Format "2006/01" }} # Use for archive sorting month

categories: ["Allgemein"] # Only the first one will get used
tags: [""] # Array of tags, ["tag1", "tag2"]
series: [""] # Needs to be the same name, if you want to group posts

summary: "" # Summary for the list view, will replace the content truncation if set
# slug: "{{ replace .Name "-" " " | title }}" -> Use if title has Ä, Ö, Ü, ß and other special characters

authors: ["angel"] # Default is angel, can be removed

params:
  SEOdesc: "" # SEO Description for single posts, 160 characters max

---

<!--
- Place your main image as "cover.[format]" in the same folder
- All images will be automatically converted to WebP format
- Figcaption 
-->

## Introduction

Write your introduction here.

## Main Content

Your main content goes here.

## Conclusion

Wrap up your article here.

<!--
Shortcodes you can use:
{{< tags tags="tag: Action Crime name: Genre color: primary tag: Adventure name: Genre color: info tag: Sci-Fi name: Genre color: danger" >}}
{{< youtube id="VIDEO_ID" >}}
{{< rating value="4.5" showValue="true" >}}
-->
