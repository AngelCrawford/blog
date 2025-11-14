# 9. Risks & Dependencies

[← Back to Index](./README.md) | [Previous: Final Decisions](./08-final-decisions.md) | [Next: Appendices →](./10-appendices.md)

---

## Critical Path Dependencies

```
Phase 0: Foundation
    ↓
Epic 1: Engagement Infrastructure
    ↓
Epic 3: Popularity Scoring
    ↓
Epic 4: Three-Tier Sorting
    ↓
Epic 5: Badge & Filter System
    ↓
Phase 1 Complete

Epic 2: Growth Stages (parallel to Epic 1)
Epic 6: History Timeline (parallel to Epic 8)
Epic 8: Format Expansion (parallel to Epics 6-7)
Epic 7: POSSE (Phase 3, after Phase 1)
```

**Blockers:**
- Epic 1 must complete before Epic 3
- Epic 3 must complete before Epic 4
- Epic 8 (formats) can develop parallel to Epics 6-7

---

## Technical Risks

### Risk 1: Umami Cloud API Rate Limiting
**Probability:** LOW
**Impact:** High

**Mitigation:**
- ✅ Free plan confirmed with API access
- 1 fetch/day = 30 calls/month (well under limits)
- Monitor API response times
- Fallback: Self-host if needed

---

### Risk 2: Webmention Spam
**Probability:** Medium
**Impact:** Medium

**Mitigation:**
- Start with auto-approve
- Monitor spam rate weekly
- Implement whitelist if spam >10%
- Manual review if spam >30%

---

### Risk 3: GitHub Actions Build Failures
**Probability:** Low
**Impact:** Medium

**Mitigation:**
- GitHub Pages has no strict build time limits
- Monitor build times (expect <5 min)
- Alert on failure (GitHub notifications)
- Manual trigger available (workflow_dispatch)

---

### Risk 4: Performance Degradation
**Probability:** Low
**Impact:** Medium

**Mitigation:**
- 6 formats × 50 articles = 300 items (Hugo handles 1000+ easily)
- Static files (no server processing)
- Image processing cached in /resources/
- Implement pagination if homepage >100 items
- Lazy load Gallery images

---

### Risk 5: Format-Specific Complexity
**Probability:** Medium
**Impact:** Medium

**Mitigation:**
- Shared base template (DRY principle)
- Consistent card structure
- Comprehensive testing per format
- Beta test before Phase 1B complete
- Document format decision matrix

---

### Risk 6: Threads API Unavailability
**Probability:** Medium
**Impact:** Low

**Mitigation:**
- Evaluate in Phase 3
- Fallback: Document manual posting
- Mastodon automation guaranteed
- Threads is "nice-to-have"

---

## Business Risks

### Risk 1: Scope Creep
**Probability:** Medium
**Impact:** Medium

**Mitigation:**
- 14-week timeline locked
- Phase 4 for future enhancements
- "Quality over speed" mindset prevents rushing

---

### Risk 2: Low Engagement
**Probability:** Low
**Impact:** Low

**Mitigation:**
- System works even with zero engagement
- Manual weight compensates
- Designed for long-term growth

---

[← Back to Index](./README.md) | [Previous: Final Decisions](./08-final-decisions.md) | [Next: Appendices →](./10-appendices.md)
