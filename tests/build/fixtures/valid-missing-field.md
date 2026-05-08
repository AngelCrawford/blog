---
title: "Valid Missing-Field Fixture"
date: 2026-05-08T00:00:00Z
draft: false
summary: "Build-smoke fixture: growth_stage omitted entirely (relies on default fallback)."
---

This fixture omits `growth_stage` to verify AC #3: build still succeeds and consumers
fall back to "seedling" via `default "seedling" .Params.growth_stage`.
