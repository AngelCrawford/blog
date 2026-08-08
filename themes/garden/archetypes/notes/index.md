---
title: '{{ replace .File.ContentBaseName `-` ` ` | title }}' # For internal use, will not show up in the list
date: {{ .Date }}
# lastmod: {{ .Date }} -> Change if you update the post and want another date then from git
draft: true # true/false, turn to false if you want to publish the post

categories: ["Allgemein"] # Only the first one will get used
tags: [""] # Array of tags ["tag1", "tag2"]

# Main author defaults to params.identity.name (site owner). Override only for guest posts.
# author: "Guest Author Name"

# Digital-Garden growth stage. One of:
#   seedling  = early/draft (rough idea, may have errors, expect change)
#   budding   = developing  (in progress, partial coverage)
#   evergreen = mature/maintained (vetted, kept up to date)
#   withered  = deprecated  (kept for history, no longer accurate/maintained)
# If omitted, templates fall back to "seedling" via `default "seedling" .Params.growth_stage`.
growth_stage: "seedling"

# Withered metadata — uncomment when growth_stage: "withered"
# withered_date: ""        # YYYY-MM-DD when this content was deprecated (REQUIRED if withered)
# withered_reason: ""      # Optional: brief explanation, e.g. "Framework deprecated"
# replacement_url: ""      # Optional: link to replacement content, e.g. "/articles/new-version/"
---

<!-- USE WITH: hugo147.exe new content notes/my-title-name (NO .md at the end, generates folder) -->

<!--
- Place your main image as "cover.[format]" in the same folder
- All images will be automatically converted to WebP format
- Use the image Properties as figcaption. Windows: Properties -> Details -> Description -> Title -> Add here for figcaption
-->

<!-- Use only one line for notes, no summary -> HEADLESS PAGE, see content/notes/_index.md -->
