# Phase 0: Foundation Cleanup - Detailed Task Breakdown

**Duration:** 1 week
**Goal:** Prepare infrastructure for digital garden transformation
**Status:** Ready to start

---

## Overview

Phase 0 establishes the infrastructure and completes open "control" issues before building the digital garden. This phase has **NO digital garden features** - just foundation work.

**What you'll have after Phase 0:**
- ✅ Umami Cloud API key ready
- ✅ GitHub Actions workflow skeleton
- ✅ data-updates branch created
- ✅ GitHub Pages configured with custom domain
- ✅ Privacy policy and contact page published
- ✅ All validation issues (#38, #31, #173) checked

---

## Task Checklist

### Day 1: Umami & GitHub Setup

#### Task 1.1: Generate Umami API Key ⭐ **START HERE**
**Time:** 5 minutes
**Difficulty:** Easy

**Steps:**
1. Log in to Umami Cloud: https://cloud.umami.is
2. Go to Settings → API Keys
3. Click "Create API Key"
4. Name: "GitHub Actions - Daily Rebuild"
5. Copy the generated API key (save it - you'll only see it once!)

**Save for later:**
- API Key: `um_XXXXXXXXXXXXXXXXXXXXXXXX`
- Website ID: Find in Settings → Websites → Your site

**Verification:**
```bash
# Test API key works (replace with your values)
curl -X GET "https://cloud.umami.is/api/websites/<YOUR_WEBSITE_ID>/stats" \
  -H "Authorization: Bearer <YOUR_API_KEY>"

# Should return JSON with website stats
```

**Acceptance Criteria:**
- [ ] API key generated
- [ ] API key saved securely (password manager)
- [ ] Website ID noted
- [ ] Test API call succeeds

---

#### Task 1.2: Add GitHub Secrets
**Time:** 5 minutes
**Difficulty:** Easy

**Steps:**
1. Go to GitHub repository: https://github.com/AngelCrawford/blog
2. Navigate to: Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Add first secret:
   - Name: `UMAMI_API_KEY`
   - Value: [paste your API key from Task 1.1]
   - Click "Add secret"
5. Add second secret:
   - Name: `UMAMI_WEBSITE_ID`
   - Value: [paste your website ID from Task 1.1]
   - Click "Add secret"

**Verification:**
- Secrets page shows: UMAMI_API_KEY, UMAMI_WEBSITE_ID (values hidden)

**Acceptance Criteria:**
- [ ] UMAMI_API_KEY secret created
- [ ] UMAMI_WEBSITE_ID secret created
- [ ] Secrets visible in repository settings

---

#### Task 1.3: Create data-updates Branch
**Time:** 2 minutes
**Difficulty:** Easy

**Steps:**
1. Open terminal in blog directory
2. Create and push new branch:

```bash
# Create orphan branch (no history from main)
git checkout --orphan data-updates

# Remove all files (we only want data files here)
git rm -rf .

# Create data folder
mkdir data

# Create placeholder file
echo '{}' > data/popularity_scores.json

# Commit
git add data/popularity_scores.json
git commit -m "Initial data-updates branch"

# Push to GitHub
git push origin data-updates

# Switch back to main
git checkout main
```

**Verification:**
- GitHub repository now shows 2 branches: main, data-updates
- data-updates branch has only data/ folder

**Acceptance Criteria:**
- [ ] data-updates branch exists on GitHub
- [ ] Branch contains data/popularity_scores.json
- [ ] Switched back to main branch

---

### Day 2: GitHub Actions Setup

#### Task 2.1: Create GitHub Actions Workflow File
**Time:** 15 minutes
**Difficulty:** Medium

**Steps:**
1. Create workflow directory (if not exists):

```bash
mkdir -p .github/workflows
```

2. Create file: `.github/workflows/daily-rebuild.yml`

3. Add this content:

```yaml
name: Daily Rebuild with Engagement Data

on:
  schedule:
    - cron: '0 2 * * *'  # 2 AM UTC daily
  workflow_dispatch:      # Manual trigger button

jobs:
  fetch-and-rebuild:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout main branch
        uses: actions/checkout@v4
        with:
          ref: main
          fetch-depth: 0  # Full history

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Setup Hugo
        uses: peaceiris/actions-hugo@v2
        with:
          hugo-version: '0.147.0'
          extended: true

      - name: Install dependencies
        run: npm install

      - name: Create data directory
        run: mkdir -p data

      - name: Fetch Umami hearts (placeholder)
        env:
          UMAMI_API_KEY: ${{ secrets.UMAMI_API_KEY }}
          UMAMI_WEBSITE_ID: ${{ secrets.UMAMI_WEBSITE_ID }}
        run: |
          echo '{}' > data/umami_hearts.json
          # TODO: Add scripts/fetch-umami-hearts.js in Phase 1A

      - name: Fetch webmentions (placeholder)
        run: |
          echo '{"children":[]}' > data/webmentions_raw.json
          # TODO: Add webmention.io fetch in Phase 1A

      - name: Calculate popularity scores (placeholder)
        run: |
          echo '{}' > data/popularity_scores.json
          # TODO: Add scripts/calculate-popularity.js in Phase 1A

      - name: Commit to data-updates branch
        run: |
          git config user.name "GitHub Actions Bot"
          git config user.email "actions@github.com"

          # Switch to data-updates branch
          git checkout data-updates

          # Add data files
          git add data/*.json

          # Commit (skip if no changes)
          git commit -m "chore: update data $(date +%Y-%m-%d) [skip ci]" || echo "No changes to commit"

          # Push to data-updates
          git push origin data-updates

          # Switch back to main
          git checkout main

      - name: Copy data from data-updates branch
        run: |
          git fetch origin data-updates
          git checkout origin/data-updates -- data/
          # Now main workspace has latest data (not committed)

      - name: Build Hugo site
        run: hugo --environment production --minify

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./public
          cname: article-time.de  # Your custom domain
```

4. Save and commit:

```bash
git add .github/workflows/daily-rebuild.yml
git commit -m "feat: add GitHub Actions daily rebuild workflow (Phase 0)"
git push origin main
```

**Verification:**
- File exists at `.github/workflows/daily-rebuild.yml`
- GitHub Actions tab shows "Daily Rebuild with Engagement Data" workflow

**Acceptance Criteria:**
- [ ] Workflow file created
- [ ] File committed and pushed
- [ ] Workflow appears in GitHub Actions tab

---

#### Task 2.2: Test GitHub Actions Workflow
**Time:** 10 minutes
**Difficulty:** Easy

**Steps:**
1. Go to GitHub: Actions tab
2. Click "Daily Rebuild with Engagement Data"
3. Click "Run workflow" button (dropdown on right)
4. Select branch: main
5. Click green "Run workflow" button
6. Wait 2-5 minutes for workflow to complete

**Expected Result:**
- Workflow runs successfully (green checkmark)
- Build Hugo site step succeeds
- Deploy step pushes to gh-pages branch

**If workflow fails:**
- Check error logs in Actions tab
- Common issues:
  - Hugo version mismatch
  - Missing dependencies
  - GitHub Pages not enabled

**Acceptance Criteria:**
- [ ] Workflow triggered manually
- [ ] Workflow completes successfully
- [ ] gh-pages branch created (or updated)
- [ ] data-updates branch has new commit

---

### Day 3: GitHub Pages Configuration

#### Task 3.1: Enable GitHub Pages
**Time:** 5 minutes
**Difficulty:** Easy

**Steps:**
1. Go to repository: Settings → Pages
2. Under "Source":
   - Select branch: `gh-pages`
   - Select folder: `/ (root)`
3. Click "Save"
4. Wait 1-2 minutes for deployment

**Verification:**
- Settings → Pages shows: "Your site is published at https://angelcrawford.github.io/blog/"

**Acceptance Criteria:**
- [ ] GitHub Pages enabled
- [ ] Deployment successful
- [ ] Site accessible at https://angelcrawford.github.io/blog/

---

#### Task 3.2: Configure Custom Domain (article-time.de)
**Time:** 10 minutes
**Difficulty:** Medium

**Steps:**

**Part A: DNS Settings (at your domain registrar)**
1. Log in to your domain registrar (where you bought article-time.de)
2. Go to DNS settings for article-time.de
3. Add these records:

```
Type: A
Name: @ (or article-time.de)
Value: 185.199.108.153

Type: A
Name: @ (or article-time.de)
Value: 185.199.109.153

Type: A
Name: @ (or article-time.de)
Value: 185.199.110.153

Type: A
Name: @ (or article-time.de)
Value: 185.199.111.153

Type: CNAME
Name: www
Value: angelcrawford.github.io
```

4. Save DNS changes (may take 1-24 hours to propagate)

**Part B: GitHub Settings**
1. Go to repository: Settings → Pages
2. Under "Custom domain":
   - Enter: `article-time.de`
   - Click "Save"
3. Wait for DNS check (may take a few minutes)
4. Once DNS verified, check "Enforce HTTPS"

**Verification:**
- After DNS propagation (1-24 hours):
  - http://article-time.de redirects to https://article-time.de
  - Site loads with HTTPS (green padlock)

**Acceptance Criteria:**
- [ ] DNS records added at registrar
- [ ] Custom domain set in GitHub Pages settings
- [ ] DNS check passes (may take hours)
- [ ] Enforce HTTPS enabled (after DNS propagates)
- [ ] Site accessible at https://article-time.de

---

### Day 4: Validation Issues

#### Task 4.1: Validate Security Headers (#38)
**Time:** 10 minutes
**Difficulty:** Easy

**Steps:**
1. Go to https://securityheaders.com/
2. Enter: https://article-time.de (or current URL)
3. Click "Scan"
4. Review report

**Expected Headers (from config.yaml):**
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

**Note:** GitHub Pages doesn't support custom headers in config.yaml. Headers set in `config.yaml` only work with `hugo server`, not on GitHub Pages.

**GitHub Pages Limitation:**
- GitHub Pages serves static files only
- Cannot set custom HTTP headers
- Security headers require server configuration (Netlify, Vercel support this)

**Options:**
1. **Accept limitation** - GitHub Pages doesn't support custom headers (most sites don't have them)
2. **Add meta tags** (limited, not as good as HTTP headers)
3. **Switch to Netlify/Vercel** (if headers are critical)

**Recommendation:** Accept limitation for Phase 0. GitHub Pages is secure by default (HTTPS enforced). Custom headers are "nice-to-have", not required.

**Close Issue #38 with note:**
"GitHub Pages doesn't support custom HTTP headers. Site is secure via HTTPS. Custom headers would require Netlify/Vercel. Accepted limitation."

**Acceptance Criteria:**
- [ ] Security scan completed
- [ ] Limitation understood (GitHub Pages doesn't support headers)
- [ ] Decision made: Accept limitation or switch host
- [ ] Issue #38 updated with findings

---

#### Task 4.2: Validate RSS Feed (#31)
**Time:** 5 minutes
**Difficulty:** Easy

**Steps:**
1. Build site locally or wait for GitHub Pages deploy
2. Check RSS feed exists: https://article-time.de/index.xml
3. Validate RSS:
   - Go to https://validator.w3.org/feed/
   - Enter: https://article-time.de/index.xml
   - Click "Check"

**Expected Result:**
- Feed is valid RSS 2.0
- Contains recent articles
- No errors

**If errors found:**
- Check layouts/rss.xml template
- Common issues: HTML entities, invalid characters

**Acceptance Criteria:**
- [ ] RSS feed accessible at /index.xml
- [ ] Feed validates (W3C Feed Validator)
- [ ] Feed contains articles
- [ ] Issue #31 closed (or updated with findings)

---

#### Task 4.3: Validate Schema Markup (#173)
**Time:** 10 minutes
**Difficulty:** Medium

**Steps:**
1. Deploy site (via GitHub Actions or manual build)
2. Go to Google Rich Results Test: https://search.google.com/test/rich-results
3. Enter article URL: https://article-time.de/articles/[some-article]/
4. Click "Test URL"
5. Review results

**Expected Schema Types:**
- Article
- Person (author)
- WebSite
- BreadcrumbList

**If errors found:**
- Check layouts/_partials/_base/seo.html
- Check layouts/single.html (schema.org markup)
- Common issues: Missing required fields, invalid dates

**Acceptance Criteria:**
- [ ] Schema markup present in HTML
- [ ] Rich Results Test passes (or shows warnings, not errors)
- [ ] Article schema recognized
- [ ] Issue #173 updated with findings

---

### Day 5: Legal Pages

#### Task 5.1: Create/Update Privacy Policy (#49)
**Time:** 30 minutes
**Difficulty:** Medium

**Steps:**
1. Create file: `content/pages/privacy.md`

```yaml
---
title: "Privacy Policy"
date: 2025-11-13
---

# Privacy Policy

**Last updated:** November 13, 2025

## Overview

Article Time ("we", "our", or "us") operates article-time.de. This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service.

## Data We Collect

### Analytics (Umami)

We use Umami Cloud for privacy-respecting analytics.

**What Umami collects:**
- Page views
- Referrer (which site you came from)
- Browser type
- Country (based on IP, then IP is discarded)
- Device type (desktop, mobile, tablet)

**What Umami does NOT collect:**
- No cookies
- No personal information
- No cross-site tracking
- IP addresses are NOT logged

**Why we collect this:**
To understand which content is popular and improve our site.

**Data retention:**
6 months (Umami Cloud Hobby plan)

**Where data is stored:**
Umami Cloud servers (GDPR-compliant)

**Your choices:**
This tracking is anonymous and cannot be disabled without losing site functionality. No personal data is collected.

### Heart Events (Engagement)

When you click the heart button (❤️) on articles, we track this anonymously via Umami events.

**What we track:**
- That someone clicked a heart on article X
- No personal information
- No cookies

**Why:**
To understand which articles resonate with readers.

**Your choices:**
Don't click the heart if you don't want to participate.

### Webmentions (Federated Comments)

If you send a webmention from your own website, we collect:
- Your website URL
- Your name and avatar (if provided by your site)
- The content of your mention

**Why:**
To display comments and interactions from other websites.

**Your choices:**
Don't send webmentions if you don't want your site mentioned here.

**Data retention:**
Indefinitely (to preserve conversations)

## Cookies

We do not use cookies. Umami Cloud operates without cookies.

## Third-Party Services

- **Umami Cloud:** Analytics (https://umami.is/privacy)
- **webmention.io:** Federated comments (https://webmention.io/)
- **GitHub Pages:** Hosting (https://docs.github.com/en/github/site-policy/github-privacy-statement)

## Your Rights (GDPR)

If you're in the EU, you have the right to:
- Access your data (contact us)
- Delete your data (webmentions can be removed on request)
- Object to processing (stop sending webmentions)

## Contact

Email: [your-email@example.com]

## Changes to This Policy

We may update this policy. Changes will be posted on this page with updated date.
```

2. Save and commit:

```bash
git add content/pages/privacy.md
git commit -m "feat: add privacy policy (Phase 0)"
git push origin main
```

3. Add link to footer (update layouts/_partials/_base/footer.html)

**Acceptance Criteria:**
- [ ] Privacy policy page created
- [ ] Covers Umami, heart events, webmentions
- [ ] GDPR rights explained
- [ ] Link added to footer
- [ ] Issue #49 marked as complete (privacy policy)

---

#### Task 5.2: Create Contact Page (#41)
**Time:** 15 minutes
**Difficulty:** Easy

**Steps:**
1. Create file: `content/pages/contact.md`

```yaml
---
title: "Contact"
date: 2025-11-13
---

# Contact

## Email

📧 [your-email@example.com](mailto:your-email@example.com)

## Social

- 🐘 Mastodon: [@angelcrawford@mastodon.social](https://mastodon.social/@angelcrawford)
- 🧵 Threads: [@your-handle](https://threads.net/@your-handle)
- 📘 Facebook: [Your Profile](https://facebook.com/your-profile)
- 🗨️ Reddit: [u/your-username](https://reddit.com/user/your-username)

## RSS Feed

Subscribe to updates: [RSS Feed](/index.xml)

## Response Time

I typically respond within 2-3 business days. For urgent matters, please mention "URGENT" in the subject line.
```

2. Update with your actual contact information

3. Save and commit:

```bash
git add content/pages/contact.md
git commit -m "feat: add contact page (Phase 0)"
git push origin main
```

4. Add link to footer or navigation

**Acceptance Criteria:**
- [ ] Contact page created
- [ ] All contact methods listed
- [ ] Link added to navigation or footer
- [ ] Issue #41 closed

---

### Day 6: Create Placeholder Scripts

These scripts won't do anything yet (Phase 1A will implement them), but creating them now ensures GitHub Actions workflow won't error.

#### Task 6.1: Create scripts/ Directory
**Time:** 1 minute

```bash
mkdir -p scripts
```

---

#### Task 6.2: Create fetch-umami-hearts.js (placeholder)
**Time:** 2 minutes

Create file: `scripts/fetch-umami-hearts.js`

```javascript
#!/usr/bin/env node

/**
 * Fetch Umami heart events and save to data/umami_hearts.json
 * Phase 0: Placeholder (returns empty object)
 * Phase 1A: Implement actual Umami API fetch
 */

const fs = require('fs');
const path = require('path');

// Phase 0: Return empty data
const hearts = {};

// Ensure data directory exists
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Write to data/umami_hearts.json
fs.writeFileSync(
  path.join(dataDir, 'umami_hearts.json'),
  JSON.stringify(hearts, null, 2)
);

console.log('✓ Umami hearts fetched (placeholder)');
```

Save and commit:

```bash
chmod +x scripts/fetch-umami-hearts.js
git add scripts/fetch-umami-hearts.js
git commit -m "feat: add Umami hearts fetch script (Phase 0 placeholder)"
```

---

#### Task 6.3: Create process-webmentions.js (placeholder)
**Time:** 2 minutes

Create file: `scripts/process-webmentions.js`

```javascript
#!/usr/bin/env node

/**
 * Process webmentions and group by article
 * Phase 0: Placeholder (returns empty object)
 * Phase 1A: Implement actual processing
 */

const fs = require('fs');
const path = require('path');

// Phase 0: Return empty data
const webmentionsByArticle = {};

// Ensure data directory exists
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Write to data/webmentions_by_article.json
fs.writeFileSync(
  path.join(dataDir, 'webmentions_by_article.json'),
  JSON.stringify(webmentionsByArticle, null, 2)
);

console.log('✓ Webmentions processed (placeholder)');
```

Save and commit:

```bash
chmod +x scripts/process-webmentions.js
git add scripts/process-webmentions.js
git commit -m "feat: add webmention processing script (Phase 0 placeholder)"
```

---

#### Task 6.4: Create calculate-popularity.js (placeholder)
**Time:** 2 minutes

Create file: `scripts/calculate-popularity.js`

```javascript
#!/usr/bin/env node

/**
 * Calculate popularity scores from engagement data
 * Phase 0: Placeholder (returns empty object)
 * Phase 1A: Implement actual formula
 */

const fs = require('fs');
const path = require('path');

// Phase 0: Return empty data
const popularityScores = {};

// Ensure data directory exists
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Write to data/popularity_scores.json
fs.writeFileSync(
  path.join(dataDir, 'popularity_scores.json'),
  JSON.stringify(popularityScores, null, 2)
);

console.log('✓ Popularity scores calculated (placeholder)');
```

Save and commit:

```bash
chmod +x scripts/calculate-popularity.js
git add scripts/calculate-popularity.js
git commit -m "feat: add popularity calculation script (Phase 0 placeholder)"
```

---

### Day 7: Final Testing & Documentation

#### Task 7.1: Test Full Daily Rebuild Cycle
**Time:** 15 minutes

**Steps:**
1. Trigger GitHub Actions workflow manually
2. Wait for completion
3. Verify:
   - Workflow succeeds
   - data-updates branch has new commit
   - GitHub Pages deploys
   - Site loads at article-time.de

**Acceptance Criteria:**
- [ ] Workflow completes without errors
- [ ] data-updates branch updated
- [ ] Site deploys successfully
- [ ] All placeholder scripts run

---

#### Task 7.2: Update README.md
**Time:** 10 minutes

Add Phase 0 completion notice to README:

```markdown
## Phase 0: Foundation Complete ✅

**Completed:** 2025-11-13

- ✅ Umami Cloud API key configured
- ✅ GitHub Actions daily rebuild workflow
- ✅ data-updates branch created
- ✅ GitHub Pages configured (article-time.de)
- ✅ Privacy policy published
- ✅ Contact page published
- ✅ All validation issues addressed

**Next:** Phase 1A - Core Garden (6 weeks)
```

Commit:

```bash
git add README.md
git commit -m "docs: Phase 0 completion (foundation ready)"
git push origin main
```

---

#### Task 7.3: Close Phase 0 Issues
**Time:** 5 minutes

Close these GitHub issues with completion notes:

- #38: Security Headers (accepted GitHub Pages limitation)
- #31: RSS Feed (validated, working)
- #173: Schema Markup (validated, working)
- #49: Privacy Policy (published)
- #41: Contact Page (published)

**Template:**
```
Completed in Phase 0.

- Privacy policy covers Umami, webmentions, hearts
- GDPR compliant
- Link added to footer

Closes #49
```

---

## Phase 0 Checklist Summary

**Day 1: Umami & GitHub Setup**
- [ ] Task 1.1: Generate Umami API key
- [ ] Task 1.2: Add GitHub Secrets
- [ ] Task 1.3: Create data-updates branch

**Day 2: GitHub Actions Setup**
- [ ] Task 2.1: Create workflow file
- [ ] Task 2.2: Test workflow

**Day 3: GitHub Pages Configuration**
- [ ] Task 3.1: Enable GitHub Pages
- [ ] Task 3.2: Configure custom domain

**Day 4: Validation Issues**
- [ ] Task 4.1: Validate security headers (#38)
- [ ] Task 4.2: Validate RSS feed (#31)
- [ ] Task 4.3: Validate schema markup (#173)

**Day 5: Legal Pages**
- [ ] Task 5.1: Create privacy policy (#49)
- [ ] Task 5.2: Create contact page (#41)

**Day 6: Placeholder Scripts**
- [ ] Task 6.1: Create scripts/ directory
- [ ] Task 6.2: Create fetch-umami-hearts.js
- [ ] Task 6.3: Create process-webmentions.js
- [ ] Task 6.4: Create calculate-popularity.js

**Day 7: Final Testing**
- [ ] Task 7.1: Test full daily rebuild
- [ ] Task 7.2: Update README
- [ ] Task 7.3: Close Phase 0 issues

---

## Success Criteria

**Phase 0 is complete when:**
- ✅ Umami API key working (test API call succeeds)
- ✅ GitHub Actions workflow runs successfully
- ✅ data-updates branch exists with initial commit
- ✅ GitHub Pages serves site at article-time.de
- ✅ HTTPS enabled on custom domain
- ✅ Privacy policy published
- ✅ Contact page published
- ✅ All placeholder scripts created
- ✅ README updated with Phase 0 completion
- ✅ All Phase 0 issues closed (#38, #31, #173, #49, #41)

---

## Troubleshooting

### Umami API Key Issues

**Problem:** API test fails with 401 Unauthorized
**Solution:**
- Check API key copied correctly (no extra spaces)
- Verify API key is active in Umami dashboard
- Check website ID is correct

**Problem:** API test fails with 404 Not Found
**Solution:**
- Check Umami Cloud URL (should be cloud.umami.is)
- Verify website ID exists in Umami

---

### GitHub Actions Issues

**Problem:** Workflow fails on "Setup Hugo" step
**Solution:**
- Check Hugo version in workflow (should be 0.147.0)
- Verify extended: true is set

**Problem:** Workflow fails on "Build Hugo site" step
**Solution:**
- Check for Hugo errors in logs
- Test build locally: `hugo --environment production`
- Common issues: Missing archetypes, invalid frontmatter

**Problem:** Workflow fails on "Deploy to GitHub Pages" step
**Solution:**
- Verify GitHub Pages is enabled
- Check gh-pages branch exists
- Ensure GITHUB_TOKEN has write permissions

---

### GitHub Pages Issues

**Problem:** Custom domain DNS check fails
**Solution:**
- Wait 1-24 hours for DNS propagation
- Verify A records point to GitHub's IPs
- Verify CNAME points to angelcrawford.github.io
- Use DNS checker: https://dns.google/

**Problem:** Site shows 404 after deployment
**Solution:**
- Check gh-pages branch has content
- Verify Settings → Pages shows correct branch
- Clear browser cache
- Wait 5-10 minutes for deployment

**Problem:** HTTPS certificate error
**Solution:**
- Wait for Let's Encrypt certificate (can take 1 hour)
- Uncheck "Enforce HTTPS", wait 30 min, re-check
- Verify custom domain is set correctly

---

## Next Phase

**Phase 1A: Core Garden (6 weeks)**

After Phase 0 completion, proceed to Phase 1A which implements:
- Engagement infrastructure (Umami hearts, webmentions)
- Growth stage system (seedling → evergreen)
- Popularity scoring engine
- Three-tier sorting algorithm
- Badge & filter system

**Phase 1A will:**
- Replace placeholder scripts with real implementations
- Add growth_stage frontmatter to articles
- Implement homepage sorting
- Build heart button component
- Integrate webmention.io

**Estimated start:** After Phase 0 complete (~1 week from now)

---

*Phase 0 Task Breakdown by Mary (Business Analyst)*
*Date: 2025-11-13*
*Status: Ready to execute*
