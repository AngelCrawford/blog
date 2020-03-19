---
date: 2017-04-14T11:25:05-04:00
tags: 
- CSS
- HTML
- JS
- Flex
- Position
- Tree
series: ["Seriennummer"]
authors: angel
title: "Chapter VI: Esmeralda"
year: "2017"
month: "2017/04"
images:
- byline: "Test"
---

## Headline
Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, 

## headline 2
sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.

```html
  <meta name="author" content="Angel Crawford" />
  <meta name="description" content="The last theme you&#39;ll ever need. Maybe." />
  <meta name="robots" content="index, follow, archive"><meta name="referrer" content="always" />
```

```go {linenos=table,hl_lines=[8,"15-17"],linenostart=199}
// GetTitleFunc returns a func that can be used to transform a string to
// title case.
// If an unknown or empty style is provided, AP style is what you get.
func GetTitleFunc(style string) func(s string) string {
  switch strings.ToLower(style) {
  case "go":
    return strings.Title
  case "chicago":
    return transform.NewTitleConverter(transform.ChicagoStyle)
  default:
    return transform.NewTitleConverter(transform.APStyle)
  }
}
```
