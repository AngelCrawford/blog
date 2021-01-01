---
title: "{{ replace .TranslationBaseName "-" " " | title }}"
description: "SEO Description and Subheader for single posts" # Not more than 160 characters!
summary: "" # if content has shortcodes, than the excerpt will render it. USE <!--start-summary--> comment in content or summary here instead
date: {{ .Date }}
draft: true # true/false, auf false setzen wenn publiziert werden soll
tags:
- eins
- zwei
categories: "Allgemein"
contains:
- code
- instagram
- twitter
- youtube
- image
- gallery
# series: [""]
# weight: 0 # 1 = makes the post sticky
# format: rating # rating design on the home page
# rating: "0.5" # 0-5 with .5 possible, will show a rating on the home page
# icons:
# - src: "windows-line"
#   color: "#456987"
#   tooltip: "Some Tooltip info"
# - src: "ubuntu-line"
#   color: "tomato"
# - src: "android-line"
#   color: "green"
# - src: "apple-line"
#   color: "white"
authors: angel # if more than one, write like tags
year: "{{ now.Format "2006" }}"
month: "{{ now.Format "2006/01" }}"
featured_image:
- src: ./featured.jpg
  byline: TEST <a href='#'>test</a>

---

<!-- Konsole: hugo new --kind article-bundle articles/my-post -->

[Ein Test](/articles/2020/02/test-123/ "Link Title")
[Angel Crawford](https://angel-crawford.de/ "Profil von Angel Crawford")

{{< rating "Storyline" "0" >}}
{{< rating "Storyline" "3.5" >}}
{{< rating "Storyline" "5" >}}
<!-- NO EMPTY LINE! Or else it will create an empty <p>-Tag on the frontend -->
{{< details "Genre" "Some, Tags, I Want" >}}
{{< details "Info" "Some, Tags, I Want" >}}

{{% infobox %}}**this** is a text{{% /infobox %}}
{{% infobox theme="info" %}}**this** is a text{{% /infobox %}}
{{% infobox theme="success" %}}**Yeahhh !** is a text{{% /infobox %}}
{{% infobox theme="warning" %}}**Be carefull** is a text{{% /infobox %}}
{{% infobox theme="danger" %}}**Beware !** is a text{{% /infobox %}}
{{% infobox theme="question" %}}**Question !** is a text{{% /infobox %}}

```html
  <meta name="author" content="Angel Crawford" />
```

```go {linenos=table,hl_lines=[8,"15-17"],linenostart=188}
// If an unknown or empty style is provided, AP style is what you get.
func GetTitleFunc(style string) func(s string) string {
  switch strings.ToLower(style) {
  case "go":
    return strings.Title
}
```

<!--start-summary-->
## Eine Überschrift
Lorem Ipsum.

![Alt Attribute Description for Screen Readers](image-in-same-folder.jpg "Title and Image Descirption, shown on the frontpage <a href='#'>Testlink</a>")