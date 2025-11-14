# 8. Final Decisions

[← Back to Index](./README.md) | [Previous: Implementation Phases](./07-implementation-phases.md) | [Next: Risks & Dependencies →](./09-risks-and-dependencies.md)

---

All 10 open questions from the PRD have been answered and locked.

**Decision Date:** 2025-11-13
**Status:** LOCKED - Ready for implementation

---

## Decision 1: Withered Content Handling

**Decision:** Hide by default, include in SEO/RSS with "[Withered DATE]" suffix

**Implementation:**
- Homepage: Hidden by default
- Filter: Explicit "Show Withered" toggle
- RSS: Title suffix `[Withered Nov 2025]`
- RSS Description: Prepend warning with date/reason
- Sitemap: Include, use withered_date for lastmod, priority 0.3
- Archive page: Link withered content to existing `/pages/archiv/`

**Frontmatter:**
```yaml
growth_stage: "withered"
withered_date: 2025-11-13
withered_reason: "Framework deprecated, see: /new-article/"
```

---

## Decision 2: Grace Period Duration

**Decision:** 4 weeks (28 days), configurable

**Configuration:**
```yaml
# config/_default/params.yaml
digital_garden:
  grace_period_days: 28
```

**Re-evaluation:** After 3 months, analyze tier size and adjust if needed (target: 30-40% of homepage)

---

## Decision 3: Pinned Article Limit

**Decision:** Exactly 3 articles (enforced in template)

**Implementation:**
```html
{{ $pinned := where .Pages "Params.weight" "eq" 10 | first 3 }}
```

**Rationale:** Forces quality curation, doesn't dominate homepage

---

## Decision 4: Format Expansion

**Decision:** Implement ALL 6 formats (no rush)

**Formats:**
1. ✅ Article (existing)
2. ✅ Log (existing)
3. ❌ Link (Phase 1B Week 7-8, 2-3 days)
4. ❌ Video (Phase 1B Week 7-8, 2-3 days)
5. ❌ Gallery (Phase 1B Week 9, 4-5 days)
6. ❌ Portfolio (Phase 1B Week 9, 3-4 days)

**Removed:** Instagram format (identical to Log)

**Timeline:** +3 weeks for format expansion

---

## Decision 5: Webmention Moderation

**Decision:** Auto-approve all, monitor for spam >10%

**Monitoring:**
- Track spam rate weekly
- If spam >10%: Implement whitelist
- If spam >30%: Implement manual review

---

## Decision 6: Umami Hosting

**Decision:** Umami Cloud Hobby (FREE with API)

**Details:**
- Plan: Hobby (Free forever)
- Limits: 100K events/month, 3 websites, 6-month retention
- API: ✅ Confirmed available
- Cost: $0/month

**Setup:**
1. Generate API key: Settings → API Keys
2. Add to GitHub Secrets: UMAMI_API_KEY, UMAMI_WEBSITE_ID

---

## Decision 7: Deployment Platform

**Decision:** GitHub Pages

**Configuration:**
```yaml
# .github/workflows/daily-rebuild.yml
- name: Deploy to GitHub Pages
  uses: peaceiris/actions-gh-pages@v3
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    publish_dir: ./public
    cname: article-time.de
```

**Limits (not a concern):**
- Repo: 1 GB
- Site: 1 GB
- Bandwidth: 100 GB/month (~100K pageviews)
- Build time: ~2-5 min

---

## Decision 8: OG Image Generation

**Decision:** Hugo image processing (build-time)

**Implementation:**
```html
{{ $template := resources.Get "images/og-template.png" }}
{{ $badge := resources.Get (printf "images/badges/%s.png" .Params.growth_stage) }}
{{ $img := $template | images.Filter (images.Text .Title ...) }}
{{ $img = $img | images.Filter (images.Overlay $badge ...) }}
{{ $img = $img.Resize "1200x630 webp" }}
```

**Build Impact:**
- First build: +30-60 seconds
- Subsequent: ~5-10 seconds (cached)

---

## Decision 9: POSSE Platforms

**Decision:** Automate Mastodon + Threads (try), Manual Facebook + Reddit

**Summary:**

| Platform | Method | Phase | API | Notes |
|----------|--------|-------|-----|-------|
| **Mastodon** | Automated | Phase 3 | ✅ Easy | Top priority |
| **Threads** | Automated (try) | Phase 3 | ⚠️ New | If API allows |
| **Facebook** | Manual | All | ❌ Restricted | Personal profile TOS |
| **Reddit** | Manual | All | ⚠️ Anti-spam | Needs engagement |

**Mastodon Implementation:**
```javascript
// scripts/posse-mastodon.js
M.post('statuses', {
  status: `🌱 New: ${title}\n\n${summary}\n\n🔗 ${url}\n\n#DigitalGarden`,
  visibility: 'public'
});
```

**Effort:** 1-2 days (Mastodon), 2-3 days (Threads if possible)

---

## Decision 10: Data File Storage

**Decision:** Commit to `data-updates` branch (separate from main)

**Branch Structure:**
```
main (clean commits)
├── code, content, layouts
└── (data NOT committed)

data-updates (data history)
└── data/
    ├── popularity_scores.json
    ├── umami_hearts.json
    └── webmentions_by_article.json
```

**Benefits:**
✅ Clean main branch (no daily noise)
✅ Data history preserved
✅ Local development (merge data-updates)
✅ Transparency (public data)

**Accessing historical data:**
```bash
git checkout data-updates
git log -- data/popularity_scores.json
git show <commit>:data/popularity_scores.json
```

---

[← Back to Index](./README.md) | [Previous: Implementation Phases](./07-implementation-phases.md) | [Next: Risks & Dependencies →](./09-risks-and-dependencies.md)
