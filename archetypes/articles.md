---
title: '{{ replace .File.ContentBaseName `-` ` ` | title }}'
# slug: "" -> Use if title has Ä, Ö, Ü, ß and other special characters
subtitle: "" # Optional
date: {{ .Date }}
# lastmod: {{ .Date }} -> Change if you update the post and want another date then from git
# publishdate: {{ .Date }} -> Only usefull, if running Hugo on server
draft: true # true/false, turn to false if you want to publish the post
weight: 0 # 1 = makes the post sticky

categories: ["Allgemein"] # Only the first one will get used
tags: [""] # Array of tags, ["tag1", "tag2"]
series: [""] # Needs to be the same name, if you want to group posts
authors: ["angel"] # Default is angel, can be removed

summary: "" # Summary for the list view, will replace the content truncation if set

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
colors to use: dark, link, info, primary, success, warning, danger
{{< tags tags="tag: Action Crime name: Genre color: primary tag: Adventure name: Genre color: info tag: Sci-Fi name: Genre color: danger" >}}
{{< youtube id="VIDEO_ID" >}}
{{< rating value="4.5" showValue="true" >}}
{{< message color="info" header="Info" >}}This is an info message content{{< /message >}}
-->
