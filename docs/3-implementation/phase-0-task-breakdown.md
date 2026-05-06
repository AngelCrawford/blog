# Phase 0: Foundation Cleanup - Detailed Task Breakdown

**Duration:** 1 week
**Goal:** Prepare infrastructure for digital garden transformation
**Status:** ⏳ In Progress — Day 1-4 complete + Day 5 partially done (existing pages reused). Day 6/7 pending.

**Deferred:**
- Task 3.2 (Custom Domain) — moved to `docs/todo.md` (DNS-Propagation blockt sonst Tests)

**Skipped (decision made):**
- Switch to Netlify/Vercel — bleibt GitHub Pages, CSP via meta + Hugo's caching reichen aus

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
- [x] API key generated
- [x] API key saved securely (password manager)
- [x] Website ID noted
- [x] Test API call succeeds

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
- [x] UMAMI_API_KEY secret created
- [x] UMAMI_WEBSITE_ID secret created
- [x] Secrets visible in repository settings

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
- [x] data-updates branch exists on GitHub
- [x] Branch contains data/popularity_scores.json
- [x] Switched back to main branch

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
- [x] Workflow file created
- [x] File committed and pushed
- [x] Workflow appears in GitHub Actions tab

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
- [x] Workflow triggered manually
- [x] Workflow completes successfully
- [x] gh-pages branch created (or updated)
- [x] data-updates branch has new commit

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
- [x] GitHub Pages enabled
- [x] Deployment successful
- [x] Site accessible at https://angelcrawford.github.io/blog/

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

**Status:** ⏭️ Verschoben — siehe `docs/todo.md` "Custom Domain Setup: article-time.de". DNS-Propagation 1-24h würde Phase-0-Tests blockieren.

**Acceptance Criteria:**
- [ ] DNS records added at registrar
- [ ] Custom domain set in GitHub Pages settings
- [ ] DNS check passes (may take hours)
- [ ] Enforce HTTPS enabled (after DNS propagates)
- [ ] Site accessible at https://article-time.de

---

### Day 4: Validation Issues

#### Task 4.0: Fix CSP Configuration in `params.yaml` ⚠️ **Live Bug** ⭐ **DO FIRST**
**Time:** 15 minutes
**Difficulty:** Easy

**Background:**
`layouts/_partials/_base/head.html` references nine `.Site.Params.csp.*` keys (`default`, `formaction`, `framesrc`, `imgsrc`, `objectsrc`, `stylesrc`, `scriptsrc`, `scriptsrcelem`, `connectsrc`) but `config/_default/params.yaml` defines only `imgsrc`. The other CSP directives currently render with empty values, silently weakening the site's Content-Security-Policy header.

**Reference:** `docs/0-discovery/feature-gap-blog-old.md` → "Privacy / DSGVO → CSP-Konfiguration kaputt". The legacy `[params.csp]` block in `blog-old/config.toml` had a complete set — port the same values and update for new external services (Umami Cloud, webmention.io).

**Steps:**
1. Open `config/_default/params.yaml` (and any `production`/`development` overlay)
2. Add the missing CSP keys under `params.csp.*` (example values — adjust per actual external services in use):

```yaml
csp:
  default: ["'self'"]
  formaction: ["'self'"]
  framesrc: ["'self'", "https://www.youtube-nocookie.com"]
  imgsrc: ["'self'", "data:", "https:"]
  objectsrc: ["'none'"]
  stylesrc: ["'self'", "'unsafe-inline'"]
  scriptsrc: ["'self'", "https://cloud.umami.is"]
  scriptsrcelem: ["'self'", "https://cloud.umami.is"]
  connectsrc: ["'self'", "https://cloud.umami.is", "https://webmention.io"]
```

3. Build site locally: `hugo --environment production`
4. Inspect the generated `<meta http-equiv="Content-Security-Policy">` tag in any built HTML page — confirm all nine directives have non-empty values
5. (Optional) Validate via https://csp-evaluator.withgoogle.com/ on a published article URL

**Acceptance Criteria:**
- [x] All 9 CSP directives have non-empty values in built HTML
- [ ] No browser console CSP-violation errors on the live site (verify after re-deploy)
- [ ] CSP evaluator reports no critical findings (verify manually)
- [x] `docs/0-discovery/feature-gap-blog-old.md` "CSP-Konfiguration kaputt" item ticked off

---

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

**Note:** GitHub Pages doesn't support custom HTTP headers in config.yaml. Headers set in `config.yaml` only work with `hugo server`, not on GitHub Pages.

**Decision (this project):** ✅ Accepted limitation. We stay on GitHub Pages. CSP via `<meta http-equiv="Content-Security-Policy">` (Task 4.0), HTTPS enforced by GitHub Pages. Custom HTTP headers would require migrating to a different host — out of scope.

**Close Issue #38 with note:**
"GitHub Pages doesn't support custom HTTP headers. Site is secure via HTTPS. CSP delivered via meta tag. Accepted limitation."

**Acceptance Criteria:**
- [ ] Security scan completed (run after re-deploy: https://securityheaders.com/)
- [x] Limitation understood (GitHub Pages doesn't support headers)
- [x] Decision made: Accept limitation
- [ ] Issue #38 updated with findings (close with note above)

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

#### Task 4.4: Restore `[Author]`-Block in Site Config
**Time:** 5 minutes
**Difficulty:** Easy

**Background:**
The legacy `blog-old/config.toml` exposed a top-level `[Author]` block with `name` and `email`. This was consumed by the OpenGraph `article:author` meta tag, the Schema.org `Person` markup, and the footer copyright credit. The new repo dropped the block — affected templates either fall back to defaults or render with empty author metadata.

**Reference:** `docs/0-discovery/feature-gap-blog-old.md` → "Config / Taxonomies → `[Author]`-Block".

**Steps:**
1. Open `config/_default/params.yaml`
2. Add a top-level `author` block (snake_case keys, per project convention):

```yaml
author:
  name: "Angel Crawford"
  email: "..."           # optional — only if you want it exposed in metadata
  url: "https://article-time.de"
```

3. Search the codebase for `.Site.Params.author` references — verify SEO partial (`layouts/_partials/_base/seo.html`) and any Schema.org partial pick up the new keys. Add fallbacks if missing.
4. Build site locally: `hugo --environment production`
5. Inspect a built article HTML: `<meta property="article:author">` and JSON-LD `author` should both be populated.

**Acceptance Criteria:**
- [x] `params.author` block present with at least `name` and `url`
- [x] OpenGraph `article:author` meta tag populated on article pages
- [x] Schema.org `Person` `name` populated on article pages
- [x] No empty `author=""` artifacts in built HTML

---

#### Task 4.5: Restore Copyright Footer Credit
**Time:** 5 minutes
**Difficulty:** Easy

**Background:**
The legacy site rendered a copyright line in the footer (e.g. `© 2025 Angel Crawford`). The new footer is missing this. Quick win, depends on Task 4.4 (uses `params.author.name`).

**Reference:** `docs/0-discovery/feature-gap-blog-old.md` → "Config / Taxonomies → `copyright`-String".

**Steps:**
1. Open `layouts/_partials/_base/footer.html`
2. Add a copyright line (year auto-rolls via `now.Format`):

```go-html-template
<p class="copyright">
  © {{ now.Format "2006" }} {{ .Site.Params.author.name | default .Site.Title }}
</p>
```

3. (Optional) Add a `params.copyright_suffix` key in `params.yaml` if you want a custom suffix like "All rights reserved." appended:
```yaml
copyright_suffix: "All rights reserved."
```
And reference it in the template with `| default ""` for graceful absence.
4. Build and visually verify on a few pages (home, single article, log).

**Acceptance Criteria:**
- [x] Copyright line visible in footer on every page
- [x] Year auto-updates (uses Hugo `now.Format` — no hardcoded year)
- [x] Author name comes from `params.author.name` (depends on Task 4.4)
- [x] Styling matches surrounding footer text (no visual regression)

**Bonus (über Task hinaus):** Build Date jetzt dynamisch via `now.Format`, Version aus `git describe --tags --always` per Workflow-Step in `version.txt` geschrieben. `v`-Prefix wird per `hasPrefix`-Check nicht doppelt vergeben.

**Prerequisites:** Task 4.4

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

**Reality-Check:** ✅ `content/pages/datenschutz.md` (auf Deutsch) existiert bereits, ist im Footer-Menü verlinkt (`menu: footer: weight: 20`). Bestehender Inhalt deckt: Server-Logs (DSGVO Art. 6 Abs. 1 lit. f), GitHub Pages Hosting, SSL/TLS, Cookies-Hinweis, Spotify-Plugin.

**Was noch fehlt für Phase 1A (Umami + webmentions kommen):**
- Abschnitt **Umami Cloud Analytics** (anonyme Pageviews, keine Cookies, keine IP-Speicherung)
- Abschnitt **Heart-Events** (anonyme Engagement-Tracking via Umami-Events)
- Abschnitt **Webmentions** (Federierte Kommentare via webmention.io)
- DSGVO-Rechte explizit: Auskunft, Löschung, Widerspruch
- Stand-Datum aktualisieren

**Acceptance Criteria:**
- [x] Privacy policy page created (existed)
- [x] Link added to footer (existed via menu config)
- [ ] Covers Umami, heart events, webmentions (Phase 1A — fügen wir bei Story 2.1/2.2/2.3 hinzu)
- [ ] GDPR rights explained (teilweise — kann erweitert werden)
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

**Reality-Check:** ✅ Kontakt ist über bestehende Pages abgedeckt — kein separates Kontakt-Page nötig:
- `content/pages/impressum.md` enthält obfuskierte E-Mail (DSGVO-Pflichtangabe in DE)
- `content/pages/ueber-mich/index.md` (Über mich) — Platzhalter-Content, kann persönlichen Kontakt + Social aufnehmen wenn gewünscht
- Footer-Menü zeigt: Über mich | Datenschutz | Impressum

**Decision:** Kein separates `kontakt.md` — deutsches Konvention für private Blogs ist Impressum + Über mich.

**Acceptance Criteria:**
- [x] Contact page created (covered by Impressum + Über mich)
- [x] All contact methods listed (email in Impressum, social kann in Über mich)
- [x] Link added to navigation or footer (Impressum + Über mich already in footer menu)
- [ ] Issue #41 closed (mit Hinweis auf Impressum)

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
- [x] Workflow completes without errors
- [x] data-updates branch updated
- [x] Site deploys successfully
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
- [x] Task 1.1: Generate Umami API key
- [x] Task 1.2: Add GitHub Secrets
- [x] Task 1.3: Create data-updates branch

**Day 2: GitHub Actions Setup**
- [x] Task 2.1: Create workflow file
- [x] Task 2.2: Test workflow

**Day 3: GitHub Pages Configuration**
- [x] Task 3.1: Enable GitHub Pages (via GitHub Actions deployment, not branch — funktional äquivalent)
- [ ] Task 3.2: Configure custom domain ⏭️ verschoben (siehe `docs/todo.md`)

**Day 4: Validation Issues**
- [x] Task 4.0: Fix CSP configuration in params.yaml
- [x] Task 4.1: Decision: GitHub Pages headers limitation accepted (manual scan + Issue #38 close pending)
- [ ] Task 4.2: Validate RSS feed (#31) — manueller Verify nach Re-Deploy
- [ ] Task 4.3: Validate schema markup (#173) — manueller Verify nach Re-Deploy
- [x] Task 4.4: Restore [Author]-Block in site config
- [x] Task 4.5: Restore Copyright Footer Credit (+ Bonus: dynamic build date + version)

**Day 5: Legal Pages**
- [x] Task 5.1: Privacy policy (existed in `datenschutz.md` — Umami/webmentions-Abschnitte werden in Phase 1A ergänzt)
- [x] Task 5.2: Contact page (covered by Impressum + Über mich, kein separates Page nötig)

**Day 6: Placeholder Scripts**
- [x] Task 6.1: Create scripts/ directory
- [x] Task 6.2: Create fetch-umami-hearts.js (placeholder — `data/umami_hearts.json` mit `{}`)
- [x] Task 6.3: Create process-webmentions.js (placeholder — `data/webmentions_by_article.json` mit `{}`)
- [x] Task 6.4: Create calculate-popularity.js (placeholder — `data/popularity_scores.json` mit `{}`)
- [x] **Bonus:** Workflow aktualisiert — ruft jetzt die echten Scripts statt inline `echo '{}'` auf

**Day 7: Final Testing**
- [ ] Task 7.1: Test full daily rebuild
- [ ] Task 7.2: Update README
- [ ] Task 7.3: Close Phase 0 issues (#38, #41, #49, plus #31, #173 nach Verify)

---

## Open Verification Tasks (nach nächstem Re-Deploy)

Nach dem nächsten erfolgreichen Workflow-Run kannst du diese 4 Manual-Checks durchziehen:

| Check | URL | Erwartung |
|---|---|---|
| **CSP-Violations** | DevTools → Console | keine Refused-to-load-Errors |
| **CSP-Inhalt** | DevTools → Elements → `<meta http-equiv="Content-Security-Policy">` | 9 Direktiven mit Werten |
| **RSS** | https://validator.w3.org/feed/ → `https://angelcrawford.github.io/blog/index.xml` | Valid RSS 2.0 |
| **Schema** | https://search.google.com/test/rich-results → eine Article-URL | "Article" erkannt, keine Errors |
| **Security Headers** | https://securityheaders.com/ | F-Rating wegen Pages-Limit (akzeptiert) |

Issues schließen mit den jeweiligen Findings: #31, #38, #41, #49, #173.

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
