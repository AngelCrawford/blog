---
title: "Withered Minimal Fixture"
date: 2026-05-08T00:00:00Z
draft: false
summary: "Build-smoke fixture (Story 1.4): withered article with only withered_date set. Exercises the optional-field branch — no reason paragraph and no replacement link should render."
growth_stage: "withered"
withered_date: "2026-04-15"
---

This fixture only sets `withered_date`. The rendered banner must show the
deprecation date but must NOT emit `.withered-banner-reason` or
`.withered-banner-replacement` — empty placeholders are forbidden.
