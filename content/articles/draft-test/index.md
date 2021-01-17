---
title: "Draft Test"
description: "SEO Description and Subheader for single posts" # Not more than 160 characters!
summary: ""
date: 2020-12-31T11:02:30+01:00
publishdate: 2020-12-31
draft: true # true/false, auf false setzen wenn publiziert werden soll
tags:
- eins
- zwei
categories: "Allgemein"
contains:
- code
authors: angel
year: "2020"
month: "2020/12"
featured_image:
- src: ./featured.jpg
  byline: Lorem Picsum <a href='https://picsum.photos/'>https://picsum.photos/</a>
comments:
  enabled: true
  deactivatedOn: YYYY-MM-DD
  message: "Reaktionen wurden entfernt weil...."
icons:
- src: "windows-line"
  color: "#456987"
  tooltip: "Some Tooltip info"
- src: "ubuntu-line"
  color: "tomato"
- src: "android-line"
  color: "green"
- src: "apple-line"
  color: "white"
stickers:
- heading: "Genre"
  tags:
  - tag: "Some"
  - tag: "Tag"
  - tag: "I Want"
- heading: "Info"
  tags:
  - tag: "Some Tag"
  - tag: "Long Tag I want for testing purpose"
  - tag: "Anything"

---

{{% infobox theme="warning" title="test" %}}**Be carefull** is a text{{% /infobox %}}

```html
  <meta name="author" content="Angel Crawford" />
```

{{% spoiler %}}**Bold is** A collection of *textile samples* lay spread out on the table - Samsa was a travelling salesman - and above it there hung a picture that he had recently cut out of an illustrated magazine and housed in a nice, gilded frame.{{% /spoiler %}}

{{% spoiler %}}
  **Bold is** A collection of *textile samples* lay spread out on the table - Samsa was a travelling salesman - and above it there hung a picture that he had recently cut out of an illustrated magazine and housed in a nice, gilded frame.
{{% /spoiler %}}


{{% details title="Some details" %}}
  **Bold is** A collection of textile samples lay spread out on the table - Samsa was a travelling salesman - and above it there hung a picture that he had recently cut out of an illustrated magazine and housed in a nice, gilded frame.
{{% /details %}}

{{% details title="Some details" %}}
  **Bold is** A collection of *textile samples* lay spread out on the table - Samsa was a travelling salesman - and above it there hung a picture that he had recently cut out of an illustrated magazine and housed in a nice, gilded frame.
{{% /details %}}

* listeneintrag 1
* listeneintrag 2

> A collection of textile samples lay spread out on the table - Samsa was a travelling salesman - and above it there hung a picture that he had recently cut out of an illustrated magazine and housed in a nice, gilded frame. It showed a lady fitted out with a fur hat and fur boa who sat upright, raising a heavy fur muff that covered the whole of her lower arm towards the viewer. Gregor then turned to look out the window at the dull weather. Drops Samsa woke
> 
> *Quelle: some name*

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
A collection of textile samples lay spread out on the table - Samsa was a travelling salesman - and above it there hung a picture that he had recently cut out of an illustrated magazine and housed in a nice, gilded frame. It showed a lady fitted out with a fur hat and fur boa who sat upright, raising a heavy fur muff that covered the whole of her lower arm towards the viewer. Gregor then turned to look out the window at the dull weather. Drops Samsa woke

{{% infobox theme="warning" %}}**Be carefull** is a text{{% /infobox %}}
