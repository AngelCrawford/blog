# System-Level Test Design

**Project:** Article Time Digital Garden Transformation
**Date:** 2025-11-15
**Test Architect:** Murat (BMad Method)
**Phase:** Phase 2 - Solutioning (Pre-Gate Check)
**Status:** ✅ Ready for Review

---

## Executive Summary

This document provides a **system-level testability assessment** of the Digital Garden architecture before proceeding to implementation (Phase 3). The architecture is fundamentally testable with minor concerns that have clear mitigations.

**Overall Testability Assessment:** ✅ **PASS with CONCERNS**

**Key Findings:**
- **Controllability:** ✅ PASS - JAMstack architecture provides deterministic, repeatable builds
- **Observability:** ⚠️ CONCERNS - Needs production error tracking (Sentry recommended)
- **Reliability:** ⚠️ CONCERNS - API failure strategy must be documented

**Recommendation:** **PROCEED TO IMPLEMENTATION** with 5 testability concerns tracked (all addressable, none blocking)

---

## Testability Assessment

### Controllability: ✅ PASS

**Definition:** Can we control system state for testing?

**Strengths:**
1. **Static generation = perfect determinism**
   - Same input → same output every build
   - No database, no shared state, no concurrency issues
   - Git version control provides complete history

2. **Mockable external dependencies**
   - Umami Cloud API: REST with Bearer auth (easily mocked with nock/msw)
   - webmention.io API: Public REST endpoint (no auth required, easily mocked)
   - GitHub Actions: Testable locally with `act` tool

3. **Testable client-side state**
   - LocalStorage for heart deduplication (easily manipulated in tests)
   - No cookies = no cookie management complexity
   - Vanilla JavaScript = no framework-specific test setup

4. **Deterministic build process**
   - Hugo static site generator (reproducible builds)
   - Data files committed to `data-updates` branch (version controlled)
   - GitHub Actions workflow (declarative, testable)

**Evidence:**
- Architecture §5.2: Data Branch Strategy - separate branch for automated commits
- Architecture §6: API Integration - standard REST patterns
- Architecture §11: Development Environment - local Hugo server, `act` for workflow testing

**Validation:** ✅ All external APIs mockable, builds reproducible, state controllable

---

### Observability: ⚠️ CONCERNS

**Definition:** Can we inspect system state and validate behavior?

**Strengths:**
1. **Static HTML inspectable**
   - Generated output easily validated (text comparison, HTML parsing)
   - Browser DevTools for client-side inspection (console, network, performance)

2. **Transparent build process**
   - GitHub Actions logs capture full pipeline (fetch → process → build → deploy)
   - Hugo build output shows template errors
   - JSON data files human-readable (`umami_hearts.json`, `webmentions_by_article.json`)

3. **Git audit trail**
   - All changes versioned (main for code/content, data-updates for generated data)
   - Commit history shows when/why changes occurred

**CONCERNS:**

| Concern | Impact | Risk Score | Mitigation | Owner | Deadline |
|---------|--------|------------|------------|-------|----------|
| **No production error tracking** | Client-side JavaScript errors invisible | 4 (Medium) | Add Sentry JavaScript SDK | TBD (dev) | Before production launch |
| **No structured logging** | Debugging production issues difficult | 4 (Medium) | Sentry + console.error() standardization | TBD (dev) | Epic 9 |
| **Limited analytics depth** | Umami shows pageviews/events, not errors | 2 (Low) | Acceptable - Sentry covers this | N/A | N/A |

**Recommendation:** Add Sentry to Epic 9: Polish & Optimization for production error tracking

**Validation:** ⚠️ Observable with browser tools, but needs production monitoring

---

### Reliability: ⚠️ CONCERNS

**Definition:** Can we recover from failures gracefully?

**Strengths:**
1. **Perfect test isolation**
   - No shared state between builds
   - Static files = no runtime dependencies
   - Each build is independent (no side effects)

2. **Reproducible failures**
   - Git history + data branch = full audit trail
   - Can reproduce any build by checking out specific commit
   - Hugo error messages clear (template syntax errors, missing partials)

3. **Loosely coupled architecture**
   - No backend dependencies
   - External APIs optional (Hugo templates use `| default` for graceful degradation)
   - Client-side JavaScript isolated (IIFE pattern prevents global pollution)

**CONCERNS:**

| Concern | Impact | Risk Score | Mitigation | Owner | Deadline |
|---------|--------|------------|------------|-------|----------|
| **API failure strategy undefined** | Unclear behavior when Umami/webmention.io fails | **6 (High)** | Document fail-fast vs. use-stale-data | Winston (Architect) | Before gate check |
| **No health checks** | Failed daily rebuilds may go unnoticed | 4 (Medium) | GitHub Actions email alerts enabled | TBD (DevOps) | Epic 2 |
| **No offline mode** | Heart button fails without network | 2 (Low) | Acceptable - optimistic UI update only | N/A | N/A |

**Critical Decision Required:**
**API Failure Strategy** - Choose one before gate check:

- **Option A (Recommended): Fail-Fast**
  - If Umami or webmention.io API fails → workflow fails
  - No deployment with stale data
  - Email alert on failure
  - ✅ Prevents data staleness
  - ❌ Site won't rebuild if APIs down

- **Option B: Use Stale Data**
  - If API fails → use previous day's data
  - Workflow succeeds with warning
  - ⚠️ Risk of stale popularity scores
  - ✅ Site always rebuilds

**Validation:** ⚠️ Needs API failure strategy documented

---

## Architecturally Significant Requirements (ASRs)

ASRs are quality requirements that **drive architectural decisions** and require special testing attention. Scored using probability × impact (1-9 scale).

### High-Priority ASRs (Score ≥6)

| ASR ID | Category | Requirement | Probability | Impact | Score | Test Approach |
|--------|----------|-------------|-------------|--------|-------|---------------|
| **ASR-001** | SEC | **GDPR Compliance: Zero tracking cookies** | 2 (Possible) | 3 (Critical) | **6** | Playwright cookie audit, automated checks |
| **ASR-002** | TECH | **API Resilience: Handle Umami/webmention.io failures** | 3 (Likely) | 2 (Degraded) | **6** | Mock API failures in integration tests |
| **ASR-003** | SEC | **XSS Prevention: Sanitize webmention content** | 2 (Possible) | 3 (Critical) | **6** | Playwright XSS injection attempts |

### Medium-Priority ASRs (Score 3-5)

| ASR ID | Category | Requirement | Probability | Impact | Score | Test Approach |
|--------|----------|-------------|-------------|--------|-------|---------------|
| **ASR-004** | BUS | **Three-Tier Sorting Correctness** | 2 (Possible) | 2 (Degraded) | 4 | Integration tests with edge cases |
| **ASR-005** | OPS | **Daily Rebuild Reliability** | 2 (Possible) | 2 (Degraded) | 4 | GitHub Actions workflow tests |
| **ASR-006** | DATA | **Graceful Degradation: Missing data files** | 2 (Possible) | 2 (Degraded) | 4 | Hugo builds with empty/missing data |

### Low-Priority ASRs (Score 1-2)

| ASR ID | Category | Requirement | Probability | Impact | Score | Test Approach |
|--------|----------|-------------|-------------|--------|-------|---------------|
| **ASR-007** | PERF | **Client-Side Filter Performance: <50ms for 500 cards** | 1 (Unlikely) | 1 (Minor) | 1 | Playwright performance tests |
| **ASR-008** | PERF | **Build Performance: <15 seconds for 500 articles** | 1 (Unlikely) | 1 (Minor) | 1 | Manual benchmarking |

---

## Test Levels Strategy

**Architecture Profile:** JAMstack Static Site (Hugo + GitHub Actions + GitHub Pages)

**Recommended Distribution:** 30% Unit / 40% Integration / 30% E2E

### Rationale

JAMstack shifts complexity from runtime to build-time:
- **Build pipeline is the "backend"** → Integration tests critical (40%)
- **Visual/interactive features** → E2E validation needed (30%)
- **Limited pure logic** → Unit tests still important but smaller (30%)

---

### Unit Tests (30%)

**Target:** Pure functions, business logic, data transformations

**What to test:**
1. **JavaScript functions** (Jest/Vitest)
   - `filterCards(stage, format)` - Filter logic correctness
   - `calculatePopularityScore(hearts, webmentions, weight)` - Formula validation
   - LocalStorage heart deduplication logic

2. **Node.js API scripts** (Mocha/Chai)
   - `fetch-umami-hearts.js` - API response parsing
   - `fetch-webmentions.js` - Data fetching logic
   - `process-webmentions.js` - Data transformation (raw → grouped by article)
   - Error handling (malformed JSON, missing fields)

3. **Hugo partial templates** (Manual validation or Hugo test fixtures)
   - `popularity-score.html` - Formula: `(hearts × 1) + (webmentions × 3) + (weight × 2)`
   - Edge cases: missing data, negative values, null handling

**Tools:**
- Jest or Vitest (JavaScript unit tests)
- Mocha + Chai (Node.js scripts)
- Hugo test builds (template validation)

**Example:**
```javascript
// tests/unit/popularity-score.test.js
import { calculatePopularityScore } from '../../assets/js/popularity-score.js';

describe('calculatePopularityScore', () => {
  it('calculates correct score with all inputs', () => {
    const score = calculatePopularityScore(10, 5, 3);
    // (10 × 1) + (5 × 3) + (3 × 2) = 10 + 15 + 6 = 31
    expect(score).toBe(31);
  });

  it('handles missing hearts gracefully', () => {
    const score = calculatePopularityScore(0, 5, 3);
    expect(score).toBe(21); // (0 × 1) + (5 × 3) + (3 × 2)
  });

  it('handles all missing data', () => {
    const score = calculatePopularityScore(0, 0, 0);
    expect(score).toBe(0);
  });
});
```

---

### Integration Tests (40%)

**Target:** Build pipeline, API integration, template rendering

**What to test:**
1. **GitHub Actions workflow** (Full pipeline testing)
   - Fetch → Process → Build → Deploy flow
   - Data branch commit logic
   - API authentication (Umami Bearer token)
   - **Failure scenarios:**
     - Umami API returns 500 error
     - webmention.io timeout
     - Hugo build fails (template error)
     - Deployment fails (invalid CNAME)

2. **API integration** (Mock API responses with nock)
   - Umami API success (200 with valid JSON)
   - Umami API failure (401 auth, 500 error, timeout)
   - webmention.io success (pagination, multiple mentions)
   - webmention.io failure (malformed JSON, empty response)

3. **Hugo build process** (Integration tests with test fixtures)
   - **Three-tier sorting edge cases:**
     - >3 pinned articles (only first 3 shown)
     - Grace period boundary (28 days exactly)
     - Popularity score ties (sort by date DESC)
   - Growth badge rendering (all 4 stages: seedling, budding, evergreen, withered)
   - Filter UI data attributes (`data-growth-stage`, `data-format`)
   - **Graceful degradation:**
     - Missing `umami_hearts.json` (defaults to 0)
     - Missing `webmentions_by_article.json` (defaults to empty array)
     - Corrupted JSON files (build fails cleanly with error message)

**Tools:**
- GitHub Actions (`act` for local testing)
- nock or msw (API mocking)
- Hugo test builds with fixtures

**Example:**
```bash
# tests/integration/github-actions-workflow.sh
#!/bin/bash

# Test API failure scenario
export UMAMI_API_KEY="invalid"
node scripts/fetch-umami-hearts.js

# Verify workflow fails gracefully
if [ $? -ne 1 ]; then
  echo "❌ FAIL: Script should exit with code 1 on auth failure"
  exit 1
fi

echo "✅ PASS: Workflow fails gracefully on API error"
```

---

### E2E Tests (30%)

**Target:** Critical user journeys, visual regression, accessibility

**What to test:**
1. **Critical user journeys** (Playwright)
   - Homepage three-tier sorting visible (Pinned → Grace Period → Established)
   - Heart button click increments count (optimistic UI update)
   - Client-side filtering works (growth stage + format)
   - Combined filters (e.g., "evergreen articles") apply correctly
   - Webmentions display on article pages
   - Withered content hidden by default, visible when "Show Withered" toggled

2. **Visual regression** (Playwright screenshots)
   - Growth badge rendering (all 4 stages: 🌱 seedling, 🌿 budding, 🌳 evergreen, 💀 withered)
   - Card footer layout (growth badge + format + author)
   - Filter UI active states
   - Timeline widget (Epic 6 - future)

3. **Accessibility** (axe-core via Playwright)
   - Keyboard navigation (Tab, Enter, Escape)
   - Screen reader labels (ARIA, landmarks, alt text)
   - WCAG AA color contrast (growth stage colors)
   - Focus indicators visible

4. **Cross-browser compatibility** (Chromium, Firefox, WebKit)
   - Heart button localStorage works cross-browser
   - Client-side filtering performance consistent
   - CSS grid/flexbox layout renders correctly

**Tools:**
- Playwright (E2E + visual regression + accessibility)
- axe-core (WCAG compliance)
- percy.io (optional - visual regression service)

**Example:**
```typescript
// tests/e2e/critical-journeys.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Critical User Journeys', () => {
  test('homepage displays three-tier sorting', async ({ page }) => {
    await page.goto('/');

    // Tier 1: Pinned
    const pinnedSection = page.getByRole('heading', { name: /pinned/i });
    await expect(pinnedSection).toBeVisible();

    // Tier 2: Grace Period
    const graceSection = page.getByRole('heading', { name: /recently tended/i });
    await expect(graceSection).toBeVisible();

    // Tier 3: Established Garden
    const establishedSection = page.getByRole('heading', { name: /established garden/i });
    await expect(establishedSection).toBeVisible();
  });

  test('heart button increments count on click', async ({ page }) => {
    await page.goto('/articles/test-article/');

    const heartBtn = page.getByTestId('heart-btn');
    const heartCount = page.getByTestId('heart-count');

    // Initial count
    const initialCount = parseInt(await heartCount.textContent() || '0');

    // Click heart
    await heartBtn.click();

    // Optimistic UI update
    await expect(heartBtn).toHaveClass(/hearted/);
    await expect(heartCount).toHaveText((initialCount + 1).toString());
  });

  test('filter by growth stage works', async ({ page }) => {
    await page.goto('/');

    // Select "evergreen" filter
    await page.getByTestId('filter-stage').selectOption('evergreen');

    // Only evergreen cards visible
    const cards = page.locator('.card');
    const visibleCards = await cards.filter({ has: page.locator('[data-growth-stage="evergreen"]') }).count();
    const hiddenCards = await cards.filter({ has: page.locator('[data-growth-stage="seedling"]') }).count();

    expect(visibleCards).toBeGreaterThan(0);
    expect(hiddenCards).toBe(0); // Seedlings hidden
  });
});
```

---

## NFR Testing Approach

### Security (SEC) - ✅ PASS with Validation Required

**Critical Requirements:**
- **ASR-001:** Zero tracking cookies (GDPR compliance)
- **ASR-003:** XSS prevention in webmention content
- **FR-047:** Privacy-respecting engagement

**Testing Approach:**

| Test | Tool | Pass Criteria |
|------|------|---------------|
| No tracking cookies set | Playwright | Cookie audit shows 0 tracking cookies |
| Webmention HTML escaped | Playwright | XSS payload rendered as text, not executed |
| API keys not exposed | Playwright | Client-side JavaScript contains no secrets |
| npm vulnerabilities | npm audit (CI) | 0 critical/high vulnerabilities |
| HTTPS enforced | Lighthouse | All resources loaded over HTTPS |

**Example Test:**
```typescript
// tests/nfr/security.spec.ts
test('site sets zero tracking cookies', async ({ context, page }) => {
  await page.goto('/');
  await page.click('[data-testid="heart-btn"]'); // Trigger interaction

  const cookies = await context.cookies();
  const trackingCookies = cookies.filter(c =>
    !c.name.startsWith('__Host-') && c.name !== 'gdpr-consent'
  );

  expect(trackingCookies).toHaveLength(0); // ✅ PASS
});
```

**Validation:** ✅ PASS if no tracking cookies, XSS escaped, npm audit clean

---

### Performance (PERF) - ⚠️ CONCERNS (Baseline Required)

**No Traditional Load Testing:** Static site served from GitHub Pages CDN (no backend to stress test)

**Critical Requirements:**
- **ASR-007:** Client-side filtering <50ms for 500 cards
- **ASR-008:** Hugo build <15 seconds for 500 articles
- **Core Web Vitals:** FCP <1s, LCP <2.5s, TTI <3s

**Testing Approach:**

| Metric | Tool | Threshold | Pass Criteria |
|--------|------|-----------|---------------|
| Client-side filter performance | Playwright + Date.now() | <50ms | Filter operation completes in <50ms |
| FCP (First Contentful Paint) | Lighthouse | <1s | Homepage FCP <1000ms |
| LCP (Largest Contentful Paint) | Lighthouse | <2.5s | Homepage LCP <2500ms |
| TTI (Time to Interactive) | Lighthouse | <3s | Homepage TTI <3000ms |
| Hugo build time | `time hugo build` | <15s | 500 articles build in <15 seconds |
| Lighthouse score | Lighthouse CI | ≥90 | Performance score ≥90/100 |

**Example Test:**
```typescript
// tests/nfr/performance.spec.ts
test('filter performance <50ms for 500 cards', async ({ page }) => {
  await page.goto('/test-page-500-cards');

  const filterStart = Date.now();
  await page.getByTestId('filter-stage').selectOption('evergreen');
  const filterEnd = Date.now();

  const duration = filterEnd - filterStart;
  expect(duration).toBeLessThan(50); // ✅ <50ms threshold
});
```

**Validation:** ⚠️ CONCERNS - Need baseline measurements before implementation

---

### Reliability (REL) - ⚠️ CONCERNS (API Failure Strategy Required)

**Critical Requirements:**
- **ASR-002:** API resilience
- **ASR-005:** Daily rebuild reliability
- **ASR-006:** Graceful degradation

**Testing Approach:**

| Scenario | Tool | Pass Criteria |
|----------|------|---------------|
| Missing data files | Playwright | Site renders, heart counts default to 0 |
| Umami API failure | Mock API + Workflow test | Workflow fails cleanly OR uses stale data (TBD) |
| webmention.io timeout | Mock API + Workflow test | Workflow fails cleanly OR uses stale data (TBD) |
| Heart button offline | Playwright + network mock | Optimistic UI update, no error shown |
| Corrupt JSON data | Hugo build test | Build fails with clear error message |

**Example Test:**
```typescript
// tests/nfr/reliability.spec.ts
test('site renders with missing data files', async ({ page }) => {
  // Simulate missing umami_hearts.json by using empty data
  await page.goto('/');

  // Homepage should load (not crash)
  await expect(page.getByRole('main')).toBeVisible();

  // Heart counts default to 0
  const heartCount = await page.getByTestId('heart-count').first().textContent();
  expect(heartCount).toBe('0'); // ✅ Graceful degradation
});
```

**Validation:** ⚠️ CONCERNS - API failure strategy must be documented (fail-fast vs. stale data)

---

### Maintainability (MAIN) - ✅ PASS (CI Enforcement Required)

**Critical Requirements:**
- Test coverage ≥70% (adjusted for Hugo templates)
- Code duplication <5%
- No critical/high npm vulnerabilities
- Linting/formatting enforced

**Testing Approach:**

| Metric | Tool | Threshold | CI Enforcement |
|--------|------|-----------|----------------|
| Test coverage | Jest coverage | ≥70% | Fail PR if <70% |
| Code duplication | jscpd | <5% | Fail PR if ≥5% |
| npm vulnerabilities | npm audit | 0 critical/high | Fail PR if critical/high found |
| Linting | ESLint | 0 errors | Fail PR if errors |
| Formatting | Prettier | 0 diffs | Fail PR if unformatted |

**Example CI Job:**
```yaml
# .github/workflows/code-quality.yml
jobs:
  test-coverage:
    runs-on: ubuntu-latest
    steps:
      - run: npm run test:coverage
      - run: |
          COVERAGE=$(jq '.total.lines.pct' coverage/coverage-summary.json)
          if (( $(echo "$COVERAGE < 70" | bc -l) )); then
            echo "❌ FAIL: Coverage $COVERAGE% below 70%"
            exit 1
          fi
```

**Validation:** ✅ PASS if CI checks green (coverage, duplication, vulnerabilities, linting)

---

## Test Environment Requirements

| Environment | Purpose | Setup | Tools |
|-------------|---------|-------|-------|
| **Local Development** | Unit + Integration tests | Node.js 20.x, Hugo v0.152.2 | Jest, Mocha, Hugo |
| **GitHub Actions (CI)** | Full test suite + deployment | `ubuntu-latest`, `act` for local testing | Playwright, npm audit, jscpd |
| **Playwright Browsers** | E2E tests | Headless Chromium/Firefox/WebKit | `playwright.config.js` |

**Data Requirements:**
- **Test fixtures:** Sample markdown content (all 4 growth stages, all 6 formats)
- **Mock API responses:** `tests/fixtures/umami-response.json`, `tests/fixtures/webmentions-response.json`
- **Test data files:** `data/umami_hearts.json` (with known values for assertions)

---

## Testability Concerns Summary

| Concern | Risk Score | Status | Mitigation | Owner | Deadline |
|---------|------------|--------|------------|-------|----------|
| **No production error tracking** | 4 (Medium) | ⚠️ OPEN | Add Sentry JavaScript SDK | TBD (dev) | Before production |
| **API failure strategy undefined** | **6 (High)** | ⚠️ OPEN | Document fail-fast vs. stale data | Winston (Architect) | **Before gate check** |
| **Hugo template testing difficulty** | 4 (Medium) | ⚠️ OPEN | Integration tests + manual validation | TBD (QA) | Epic 4 |
| **No E2E infrastructure planned** | 6 (High) | ⚠️ OPEN | Add Playwright to package.json, create test structure | Winston + TBD (dev) | Epic 1 |
| **GitHub Actions workflow testing complexity** | 4 (Medium) | ⚠️ OPEN | Document `act` usage, create workflow tests | TBD (DevOps) | Epic 2 |

**Total Concerns:** 5
**High-Priority (Score ≥6):** 2
**Blockers:** 0

---

## Recommendations for Sprint 0

**Before Epic 1 implementation begins**, establish test infrastructure:

### 1. Add Playwright to Project

```bash
npm install -D @playwright/test
npx playwright install --with-deps
```

### 2. Create Test Directory Structure

```
tests/
├── unit/               # Jest/Vitest for JavaScript functions
│   ├── filter.test.js
│   └── popularity-score.test.js
├── integration/        # GitHub Actions, Hugo builds, API mocks
│   ├── workflow.test.sh
│   ├── api-fetch.test.js
│   └── hugo-build.test.js
├── e2e/                # Playwright browser tests
│   ├── critical-journeys.spec.ts
│   ├── filtering.spec.ts
│   └── heart-button.spec.ts
├── nfr/                # Security, performance, reliability
│   ├── security.spec.ts
│   ├── performance.spec.ts
│   └── reliability.spec.ts
└── fixtures/           # Test data
    ├── umami-response.json
    ├── webmentions-response.json
    └── sample-content/
```

### 3. Configure Playwright

```javascript
// playwright.config.js
export default {
  testDir: './tests/e2e',
  use: {
    baseURL: 'http://localhost:1313',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  webServer: {
    command: 'hugo server --environment development',
    url: 'http://localhost:1313',
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
};
```

### 4. Add GitHub Actions Test Job

```yaml
# .github/workflows/test.yml
name: Test Suite
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20.x'

      - name: Install dependencies
        run: npm ci

      - name: Run unit tests
        run: npm run test:unit

      - name: Run integration tests
        run: npm run test:integration

      - name: Setup Playwright
        run: npx playwright install --with-deps

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-results
          path: test-results/
```

### 5. Document API Failure Strategy

**Add to Architecture Document (§6.7 Error Handling):**

```markdown
## API Failure Strategy

**Decision:** FAIL-FAST (Option A)

**Rationale:**
- Prevents deployment with stale popularity scores
- Clear failure signal (GitHub Actions email alert)
- Aligns with "correctness over availability" principle for static sites

**Behavior:**
- If Umami API fails → workflow exits with code 1, no deployment
- If webmention.io fails → workflow exits with code 1, no deployment
- GitHub Actions sends email alert on failure
- Manual re-run workflow when APIs recover

**Alternative (Option B - Rejected):** Use stale data from previous day
**Reason for rejection:** Risk of stale popularity scores misleading readers
```

---

## Gate Check Recommendation

**Decision:** ✅ **PASS WITH CONCERNS** → Proceed to Phase 3 (Implementation)

**Rationale:**
- Architecture is fundamentally testable (JAMstack = deterministic, reproducible)
- All high-priority ASRs have clear test approaches
- 5 testability concerns identified, **all addressable** (none are blockers)
- Test infrastructure can be established in Sprint 0 (before Epic 1)

**Conditions:**
1. ✅ **API failure strategy documented** (Winston - Architect) - **Before gate check approval**
2. ✅ **Playwright added to project** (Dev team) - **Sprint 0**
3. ⚠️ **Sentry error tracking** (Dev team) - **Epic 9** (before production launch)

**Next Steps:**
1. **Architect:** Document API failure strategy in architecture.md (Option A: Fail-Fast)
2. **Dev Team:** Set up test infrastructure in Sprint 0 (Playwright, directory structure, CI)
3. **QA/Test Architect:** Create test plan for Epic 1 (Growth Stage System) using this design as baseline

---

**Generated by:** Murat (Master Test Architect)
**Date:** 2025-11-15
**Method:** BMad Method - System-Level Testability Review
**Next:** Proceed to solutioning-gate-check workflow
