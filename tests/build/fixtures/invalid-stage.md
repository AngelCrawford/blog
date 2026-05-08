---
title: "Invalid Stage Fixture"
date: 2026-05-08T00:00:00Z
draft: false
summary: "Build-smoke fixture: deliberately invalid growth_stage to assert errorf trips."
growth_stage: "rotten"
---

This fixture deliberately uses an invalid `growth_stage` value. The Hugo build MUST fail
with an errorf message that includes the file path and the allowed-values list.
