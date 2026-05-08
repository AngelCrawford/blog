---
title: "Withered Invalid Fixture"
date: 2026-05-08T00:00:00Z
draft: false
summary: "Build-smoke fixture (Story 1.4): withered article without withered_date. The Hugo build MUST fail via validate-growth-stage.html errorf so the missing required field is caught at Layer 3."
growth_stage: "withered"
---

This fixture intentionally omits `withered_date` while declaring
`growth_stage: "withered"`. The build is expected to fail with a Hugo `errorf`
naming the file path and the missing field.
