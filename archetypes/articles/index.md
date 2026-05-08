---
title: '{{ replace .File.ContentBaseName `-` ` ` | title }}' # Is the SEO meta title, too -> Only 60 - 70 characters
# slug: "" -> Use if title has Ä, Ö, Ü, ß and other special characters
subtitle: "" # Optional
date: {{ .Date }}
# lastmod: {{ .Date }} -> Change if you update the post and want another date then from git
# publishdate: {{ .Date }} -> Only usefull, if running Hugo on server
draft: true # true/false, turn to false if you want to publish the post
weight: 0 # 1 = makes the article sticky, every other number will sort the articles

categories: ["Allgemein"] # Only the first one will get used
tags: [""] # Array of tags ["tag1", "tag2"]
series: [""] # Needs to be the same name, if you want to group articles
authors: ["angel"] # Default is angel, can be removed

summary: "" # REQUIRED: Summary for the list view

# Digital-Garden growth stage. One of:
#   seedling  = early/draft (rough idea, may have errors, expect change)
#   budding   = developing  (in progress, partial coverage)
#   evergreen = mature/maintained (vetted, kept up to date)
#   withered  = deprecated  (kept for history, no longer accurate/maintained)
# If omitted, templates fall back to "seedling" via `default "seedling" .Params.growth_stage`.
growth_stage: "seedling"

params:
  SEO:
    desc: "Seo Desc" # SEO Description for single posts, 120 - 158 characters max -> If not set, Summary will be used
    keywords: [""] # Use 1 max 3, if not set, will get generated from tags
    canonicalURL: "" # Use if post on other Platform, else leave empty. Or use if homage to another post
---

<!-- USE WITH: hugo147.exe new content articles/my-title-name (NO .md at the end, generates folder) -->

<!--
- Place your main image as "cover.[format]" in the same folder
- All images will be automatically converted to WebP format
- Use the image Properties as figcaption. Windows: Properties -> Details -> Description -> Title -> Add here for figcaption
-->

## Introduction

Write your introduction here.

## Main Content

Your main content goes here.
![Alt for Screen Readers](20210109_215313.png "Title and Image Description, shown on the frontpage <a href='#'>Testlink</a>")

## Conclusion

Wrap up your article here.

<!--
Shortcodes
Colors to use: dark, link, info, primary, success, warning, danger
{{< tags tags="tag: Action Crime name: Genre color: primary tag: Adventure name: Genre color: info tag: Sci-Fi name: Genre color: danger" >}}
{{< youtube id="VIDEO_ID" >}}
{{< rating value="4.5" showValue="true" >}}
{{< message color="info" header="Info" >}}This is an info message content{{< /message >}}
-->

<!--
Use 1 SEO Keyword, or as max 3 words.
Optimize Posts around A Single Keyword
No Keyword stuffing!
Use Keyword in the title of HTML and in the actual H1 title (in the URL, too)
Mention keyword in the conclusion, too
Mention keyword one time in the start of the post, too
-->