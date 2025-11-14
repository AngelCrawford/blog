# Open Questions Decision Guide

**Date:** 2025-11-13
**Analyst:** Mary (Business Analyst)
**Purpose:** Help Angel make informed decisions on 10 open questions from PRD

---

## Decision Framework

For each question, I'll provide:
1. **Context** - Why this matters
2. **Options** - Detailed pros/cons
3. **Recommendation** - My analysis-based suggestion
4. **Decision** - Your final choice

---

## Product Questions

### Question 1: Withered Content Handling

**Context:**
When articles are marked as withered (💀), should they be visible by default or hidden? This affects discoverability vs. clutter.

**Options:**

#### Option A: Show by Default
**Pros:**
- Complete transparency (nothing hidden)
- Readers can discover historical content
- SEO benefits (all content indexed)
- Simple implementation (no special logic)

**Cons:**
- Visual clutter on homepage
- May confuse new visitors
- Withered content competes with current content
- Could dilute quality signal

**Implementation:** Display withered with warning banner, no filter changes

---

#### Option B: Hide by Default
**Pros:**
- Cleaner homepage experience
- New visitors see only current content
- Quality signal is clear
- Opt-in for curious readers

**Cons:**
- Less transparent (requires click to see)
- SEO impact (if not indexed)
- Could feel like "hiding mistakes"
- More complex filter logic

**Implementation:**
```js
// Default filter: hide withered
activeFilters.stage = 'all-except-withered';

// Explicit "Show Withered" toggle
<button data-filter="stage" data-value="withered">
  Show Withered ({{ witheredCount }})
</button>
```

---

#### Option C: Separate Archive Page
**Pros:**
- Best of both worlds (homepage clean, archive discoverable)
- Clear mental model (active vs. archive)
- SEO preserved (archive is indexed)
- Room for nostalgia/reflection ("The Graveyard" page)

**Cons:**
- Additional page to maintain
- More complex navigation
- Splits content across locations
- May be overkill for small sites

**Implementation:**
- Homepage: Hide withered by default
- New page: `/archive/` or `/withered/` listing all deprecated content
- Link in footer: "See deprecated content →"

---

**My Recommendation: Option B (Hide by Default)**

**Reasoning:**
1. **User experience first:** New visitors should see your best/current content
2. **Digital garden philosophy:** Withered = deprecated, not part of active garden
3. **Simple to implement:** Just a filter default, not a new page
4. **Transparency maintained:** Warning banner + explicit "Show Withered" button
5. **Reversible:** Can add archive page later if needed

**Suggested Implementation:**
- Default filter hides withered
- Add toggle button: "Show Withered Content (3)" with count
- Withered articles still indexed by search engines (SEO)
- Direct links to withered articles work (with warning banner)

**Decision:** _[Your choice: A / B / C / Other]_

---

### Question 2: Grace Period Duration

**Context:**
How long should the grace period last after `last_significant_update`? This affects visibility boost for updated content.

**Options:**

#### Option A: 4 Weeks (28 days)
**Pros:**
- One full month of visibility
- Aligns with monthly content cycles
- Enough time to gather engagement
- Matches brainstorming session

**Cons:**
- May be too long for frequent updaters
- Could clutter grace period tier
- Might encourage gaming (minor updates for boost)

**Sweet spot for:** Moderate update frequency (monthly or less)

---

#### Option B: 2 Weeks (14 days)
**Pros:**
- Faster cycling through grace period
- Encourages more frequent updates
- Less clutter in Tier 2
- Tighter quality signal

**Cons:**
- May be too short to gather engagement
- Pressures creator to update frequently
- Could miss weekends/holidays

**Sweet spot for:** Frequent updaters (weekly content)

---

#### Option C: 6 Weeks (42 days)
**Pros:**
- More generous visibility window
- Better for less frequent updaters
- More time for engagement to accumulate
- Less pressure

**Cons:**
- Grace period could dominate homepage
- Slower refresh cycle
- May feel stale after 6 weeks

**Sweet spot for:** Infrequent updaters (monthly or less)

---

#### Option D: Author-Configurable
**Pros:**
- Maximum flexibility
- Can vary by content type
- Experimentation friendly
- Accounts for different update cycles

**Cons:**
- Adds complexity (frontmatter field)
- Inconsistent user experience
- Harder to explain to readers
- Could be gamed

**Implementation:**
```yaml
grace_period_days: 28  # Override default
```

---

**My Recommendation: Option A (4 Weeks) with Re-evaluation**

**Reasoning:**
1. **Balanced:** Not too short (pressure) or too long (clutter)
2. **Proven:** Brainstorming session chose this deliberately
3. **Aligns with "New" badge:** Also 4 weeks, consistent mental model
4. **Evaluatable:** Start with 4, measure after 3 months, adjust if needed

**Evaluation Plan:**
- After 3 months, analyze:
  - Average grace period tier size (target: 30-40% of homepage)
  - Update frequency (are you updating every 4 weeks?)
  - Engagement velocity (does 4 weeks capture peak engagement?)
- Adjust to 2 or 6 weeks if data suggests

**Suggested Metrics:**
```
If grace period articles > 50% of homepage → Reduce to 2 weeks
If grace period articles < 20% of homepage → Increase to 6 weeks
If update frequency < 1/month → Consider 6 weeks
If update frequency > 1/week → Consider 2 weeks
```

**Decision:** _[Your choice: A (4w) / B (2w) / C (6w) / D (configurable)]_

---

### Question 3: Pinned Article Limit

**Context:**
How many articles can have `weight: 10` (pinned to top)? This affects editorial control vs. natural sorting.

**Options:**

#### Option A: 3 Articles (Recommended in PRD)
**Pros:**
- Forces curation (only your absolute best)
- Doesn't dominate homepage
- Clear "flagship content" signal
- Rule of three (cognitive sweet spot)

**Cons:**
- May feel limiting if you have 5+ strong articles
- Requires tough choices

**Sweet spot for:** Focused content strategy

---

#### Option B: 5 Articles
**Pros:**
- More flexibility
- Accommodates multiple content pillars
- Still manageable
- Common blog sidebar pattern

**Cons:**
- Could dominate first page (with 6 per page)
- Less selective signal
- Tier 2 pushed down

**Sweet spot for:** Multi-topic blogs

---

#### Option C: Unlimited
**Pros:**
- Maximum editorial control
- No artificial constraints
- Can pin entire categories

**Cons:**
- Defeats purpose of quality signal
- Could become all-pinned homepage
- Grace period becomes invisible
- Essentially reverts to manual sorting

**Sweet spot for:** Control freaks (not recommended)

---

**My Recommendation: Option A (3 Articles)**

**Reasoning:**
1. **Forces quality curation:** Only truly flagship content
2. **Doesn't dominate:** With 6 per page, 50% are still organic
3. **Clear mental model:** "Top 3" is understandable
4. **Scarcity creates value:** Makes pinned slot prestigious
5. **Reversible:** Can increase to 5 if truly needed

**Alternative Approach:**
- Start with 3 for Phase 1
- After 6 months, evaluate:
  - Are you constantly swapping pinned articles? → Maybe need 5
  - Are all 3 slots always filled? → 3 is right
  - Do you rarely use all 3? → Could even reduce to 2

**Implementation Note:**
```yaml
# Frontmatter
weight: 10  # Pinned (max 3 site-wide)
weight: 5   # High priority in sorting, but not pinned
weight: 1   # Normal priority
weight: 0   # Deprioritized
```

**Decision:** _[Your choice: 3 / 5 / Unlimited / Start with 3, re-evaluate]_

---

### Question 4: Format Expansion Priority

**Context:**
Beyond articles and logs, which new formats should be prioritized? This affects archetype development and card templates.

**Potential Formats:**
- **Link:** External resource with commentary (like bookmarks)
- **Gallery:** Photo collection with captions
- **Chat:** Interview/conversation transcript
- **Instagram:** Photo post with short text (social-style)
- **Quote:** Highlighted quote with source + commentary
- **Video:** Embedded video with notes
- **Book:** Book review/notes
- **Project:** Portfolio piece

**Options:**

#### Option A: Link (Next Priority)
**Use Case:** Curate external resources with your commentary

**Why prioritize:**
- Lightweight (just URL + summary)
- Complements articles (sources, references)
- Common in digital gardens (Maggie Appleton does this)
- Easy to create (low effort, high value)

**Card Design:**
- External link icon
- Opens in new tab
- Shows domain (e.g., "→ example.com")
- Your summary + tags

**Implementation Effort:** Low (1 day)

---

#### Option B: Gallery (Next Priority)
**Use Case:** Photo essays, travel logs, design showcases

**Why prioritize:**
- Visual content diversity
- Showcases photography/design work
- Distinct from article format
- High engagement potential

**Card Design:**
- Image grid preview (2×2 or 3×3)
- Photo count badge
- Cover image featured

**Implementation Effort:** Medium (3-5 days, image grid logic)

---

#### Option C: Quote (Next Priority)
**Use Case:** Highlight wisdom from books, articles, conversations

**Why prioritize:**
- Very lightweight (minimal writing)
- Fills content gaps between articles
- High shareability
- Common microblog pattern

**Card Design:**
- Large quote in card
- Attribution (source, author)
- Your commentary below
- Distinct typography

**Implementation Effort:** Low (1-2 days)

---

#### Option D: Defer All (Focus on Core)
**Why defer:**
- Articles + Logs are sufficient for MVP
- Don't add complexity before validating core garden
- Can add formats in Phase 4
- Risk of overengineering

**Timeline:**
- Phase 1-2: Articles + Logs only
- Phase 3: Add 1 new format (based on content needs)
- Phase 4: Expand as needed

---

**My Recommendation: Option D (Defer All)**

**Reasoning:**
1. **MVP first:** Validate core digital garden concept before expanding
2. **You already have 2 formats:** Articles (long-form) + Logs (short-form)
3. **Format ≠ sorting:** Growth stages are more important than format variety
4. **Avoid scope creep:** Each format adds archetypes, templates, CSS
5. **Content-driven:** Let actual content needs dictate which format to add

**Suggested Approach:**
1. **Phase 1-2:** Articles + Logs only (current state)
2. **After 3 months:** Evaluate content you're creating
   - Are you sharing lots of links? → Add Link format
   - Are you posting photos? → Add Gallery format
   - Are you collecting quotes? → Add Quote format
3. **Phase 3-4:** Add 1-2 formats based on actual need

**If you must add one now:** Choose **Link** (easiest, complements articles)

**Decision:** _[Your choice: Link / Gallery / Quote / Defer / Other format]_

---

### Question 5: Webmention Moderation

**Context:**
Should incoming webmentions require manual approval before displaying? This affects spam control vs. automation.

**Options:**

#### Option A: Auto-Approve All
**Pros:**
- Fully automated (no manual work)
- Real-time display (no delay)
- Encourages engagement (instant feedback)
- True to federated spirit

**Cons:**
- Spam risk (especially after growth)
- No editorial control
- Could display low-quality mentions
- May need cleanup later

**Sweet spot for:** Low-traffic sites, trusted communities

---

#### Option B: Manual Review Queue
**Pros:**
- Complete spam control
- Editorial quality control
- Can filter noise vs. signal
- Professional appearance

**Cons:**
- Requires daily moderation
- Delay before mentions appear
- Time investment
- Could discourage engagement

**Sweet spot for:** High-traffic sites, spam-prone topics

**Implementation:**
- webmention.io → JSON file → Manual review script → Approved list → Display

---

#### Option C: Trusted Domain Whitelist
**Pros:**
- Semi-automated (best of both worlds)
- Trusted sources auto-approved
- Unknown sources require review
- Scales well

**Cons:**
- Requires whitelist maintenance
- Could miss legitimate new domains
- More complex implementation

**Implementation:**
```js
// Trusted domains (auto-approve)
const trustedDomains = [
  'mastodon.social',
  'micro.blog',
  'yourfriend.com'
];

// Auto-approve if from trusted domain
// Queue for review if unknown
```

**Sweet spot for:** Growing sites with established community

---

#### Option D: Start Auto, Add Moderation Later
**Pros:**
- No upfront work
- Learn what spam looks like first
- Can add moderation when needed
- Don't over-engineer early

**Cons:**
- May get burned by spam
- Reactive vs. proactive

**Timeline:**
- Phase 1-2: Auto-approve all
- Monitor for spam
- Add moderation if spam rate > 10%

---

**My Recommendation: Option D (Start Auto, Add Moderation Later)**

**Reasoning:**
1. **You're not famous yet:** Low traffic = low spam risk initially
2. **Don't over-engineer:** Solve problems you actually have, not theoretical ones
3. **Webmention spam is rare:** More common in traditional comments
4. **Easy to add later:** Can implement moderation queue in Phase 2
5. **Real-time feedback:** Encourages early engagement

**Monitoring Plan:**
- Track webmention volume weekly
- Watch for spam patterns
- If spam rate > 10% → Implement Option C (whitelist)
- If spam rate > 30% → Implement Option B (full moderation)

**Escape Hatch:**
```yaml
# Add to config if needed
webmentions:
  moderation: true  # Toggle moderation on/off
  auto_approve_domains: ['mastodon.social', 'micro.blog']
```

**Decision:** _[Your choice: A (auto) / B (manual) / C (whitelist) / D (start auto)]_

---

## Technical Questions

### Question 6: Umami Hosting

**Context:**
Where should Umami analytics run? This affects cost, control, and API rate limits.

**Options:**

#### Option A: Self-Hosted (Own Server)
**Pros:**
- **Unlimited API calls** (critical for daily rebuild)
- Complete data ownership
- No monthly costs (after setup)
- Full control and customization
- Privacy guarantee

**Cons:**
- Requires server setup (VPS)
- Monthly server cost (~€5-10/month)
- Maintenance burden (updates, security)
- Need technical skills (Docker/Node.js)
- Uptime responsibility

**Cost Analysis:**
- VPS: €5-10/month (Hetzner, DigitalOcean, Linode)
- OR: Free tier (Railway.app, Fly.io, Render.com)
- One-time setup: 2-4 hours

**Best for:** Technical users, unlimited API needs, privacy-focused

---

#### Option B: Umami Cloud (Official SaaS)
**Pros:**
- Zero setup (5 minutes)
- No maintenance
- Professional support
- Automatic updates
- Reliable uptime

**Cons:**
- **Monthly cost:** €9/month (Hobby plan)
- **API rate limits:** May restrict daily rebuilds
- Less control
- Data on their servers (still GDPR-compliant)

**Cost Analysis:**
- Hobby: €9/month (100k events, 3 websites)
- Pro: €19/month (1M events, 10 websites)

**API Limits:**
- Hobby: 1000 API calls/day (enough for 1 daily rebuild)
- Pro: 10000 API calls/day

**Best for:** Non-technical users, value time over money, low API needs

---

#### Option C: Umami Cloud (Start) → Self-Host (Later)
**Pros:**
- Fast MVP launch (no setup delay)
- Learn Umami before self-hosting
- Can migrate when needed
- Validates usage before investing in VPS

**Cons:**
- Migration work later
- Pay for cloud while learning
- Temporary API limits

**Timeline:**
- Phase 1: Umami Cloud (€9/month)
- After 3 months: Evaluate API usage
- If hitting limits → Migrate to self-hosted
- Migration: ~1 day (export/import data)

**Best for:** Risk-averse, validate before investing

---

**My Recommendation: Option A (Self-Hosted) IF you're comfortable, otherwise Option C**

**Reasoning for Self-Hosted:**
1. **Unlimited API calls:** Your daily rebuild needs this
2. **Free VPS options exist:** Railway.app, Fly.io free tiers
3. **One-time effort:** Setup once, runs forever
4. **You're a developer:** Web dev is your full-time job
5. **Complete control:** No vendor lock-in

**Easy Self-Host Setup:**
```bash
# Option 1: Railway.app (Free tier)
1. Fork github.com/umami-software/umami
2. Connect to Railway.app
3. Add PostgreSQL database (free tier)
4. Deploy (1-click)
5. Done!

# Option 2: Docker on cheap VPS (Hetzner €4/month)
docker run -d \
  --name umami \
  -p 3000:3000 \
  -e DATABASE_URL=postgresql://... \
  ghcr.io/umami-software/umami:postgresql-latest
```

**Fallback:** If setup fails, use Umami Cloud temporarily (€9/month)

**Decision:** _[Your choice: Self-hosted / Cloud / Cloud→Self-hosted]_

**If self-hosted:** _[Platform: Railway / Fly.io / Hetzner VPS / Other]_

---

### Question 7: Deployment Platform

**Context:**
Where should the Hugo static site be hosted? This affects GitHub Actions integration, build times, and cost.

**Options:**

#### Option A: Netlify
**Pros:**
- Excellent Hugo support
- Built-in CI/CD (or use GitHub Actions)
- Free tier: 100GB bandwidth, 300 build minutes/month
- Instant cache invalidation
- Forms, serverless functions included
- Great DX (developer experience)

**Cons:**
- Build minutes limited (may run out with daily rebuilds)
- 300 min/month ÷ 30 days = 10 min/day max
- Overage: $7/500 build minutes

**Cost:**
- Free tier: Likely sufficient
- If daily builds take 2 min each → 60 min/month (well under limit)

**GitHub Actions Integration:**
```yaml
- name: Deploy to Netlify
  uses: netlify/actions/cli@master
  with:
    args: deploy --prod --dir=public
  env:
    NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
    NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
```

**Best for:** Most users, great free tier

---

#### Option B: Vercel
**Pros:**
- Excellent performance (Edge network)
- Zero-config Hugo support
- Free tier: 100GB bandwidth, unlimited builds
- GitHub integration
- Serverless functions

**Cons:**
- Commercial detection (may require Pro plan €20/month if flagged)
- Build time limits (45 min free, enough for Hugo)
- Less Hugo-specific than Netlify

**Cost:**
- Hobby (free): Personal projects
- Pro (€20/month): If detected as commercial

**GitHub Actions Integration:**
```yaml
- name: Deploy to Vercel
  uses: amondnet/vercel-action@v20
  with:
    vercel-token: ${{ secrets.VERCEL_TOKEN }}
    vercel-org-id: ${{ secrets.ORG_ID }}
    vercel-project-id: ${{ secrets.PROJECT_ID }}
```

**Best for:** Performance-obsessed, personal projects

---

#### Option C: Cloudflare Pages
**Pros:**
- **Unlimited bandwidth** (even on free tier!)
- Unlimited builds
- Cloudflare CDN (excellent performance)
- Free tier: 500 builds/month, 1 build at a time
- R2 storage integration (future expansion)

**Cons:**
- Newer platform (less mature than Netlify)
- Build environment less flexible
- Concurrent build limit (1 at a time on free)

**Cost:**
- Free tier: Unlimited bandwidth, 500 builds/month
- Perfect for daily rebuilds (30 builds/month)

**GitHub Actions Integration:**
```yaml
- name: Deploy to Cloudflare Pages
  uses: cloudflare/pages-action@v1
  with:
    apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
    accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
    projectName: article-time
    directory: public
```

**Best for:** Unlimited bandwidth needs, cost-conscious

---

#### Option D: GitHub Pages
**Pros:**
- Completely free
- Native GitHub integration
- Simple setup
- Reliable

**Cons:**
- No serverless functions
- Slower than CDN options
- 100GB bandwidth soft limit
- Less features
- No instant cache invalidation

**Cost:**
- Free forever

**GitHub Actions Integration:**
```yaml
- name: Deploy to GitHub Pages
  uses: peaceiris/actions-gh-pages@v3
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    publish_dir: ./public
```

**Best for:** Simplicity, zero cost

---

**My Recommendation: Option A (Netlify) or C (Cloudflare Pages)**

**Choose Netlify if:**
- You want proven Hugo support
- You value DX and community
- 100GB bandwidth is enough
- You might use forms/functions later

**Choose Cloudflare Pages if:**
- You want unlimited bandwidth (future-proof)
- You're cost-conscious
- You value performance (CF CDN is excellent)
- 500 builds/month is plenty (daily = 30/month)

**My Pick: Cloudflare Pages**

**Reasoning:**
1. **Unlimited bandwidth:** No usage anxiety as site grows
2. **500 builds/month:** Way more than 30 daily rebuilds
3. **Best CDN:** Cloudflare's network is top-tier
4. **Free forever:** No risk of outgrowing free tier
5. **Your use case fits perfectly:** Static site, daily builds, growing traffic

**Setup Time:**
- Netlify: 10 minutes
- Cloudflare Pages: 15 minutes
- Either is easy to switch later

**Decision:** _[Your choice: Netlify / Vercel / Cloudflare Pages / GitHub Pages]_

---

### Question 8: OG Image Generation

**Context:**
How should social share preview images (with growth stage badges) be generated? This affects build performance and complexity.

**Options:**

#### Option A: Hugo Image Processing (Build-Time)
**How it works:**
- Hugo generates OG images during build
- Uses resources.GetRemote or assets pipeline
- SVG → Raster conversion
- Cached after first generation

**Pros:**
- No external dependencies
- Free
- Offline-capable
- Full control
- Cached images persist

**Cons:**
- Slower first build (image processing)
- Limited typography (system fonts)
- Complex Hugo syntax
- May hit memory limits on large sites

**Example:**
```hugo
{{ $img := resources.Get "images/og-template.png" }}
{{ $img = $img | images.Filter (images.Text "Article Title" (dict "color" "#fff" "size" 48)) }}
{{ $img = $img | images.Filter (images.Overlay $badge) }}
```

**Build Time Impact:**
- First build: +30-60 seconds (generate all images)
- Subsequent: ~0 seconds (cached)
- Daily rebuild: Only new/updated articles

**Best for:** Self-hosters, offline builds, cost-conscious

---

#### Option B: External Service (Cloudinary, Imgix, etc.)
**How it works:**
- Template stored on Cloudinary
- URL parameters customize image
- Generated on-demand
- Cached on CDN

**Pros:**
- Zero build time
- Professional typography
- Dynamic (no rebuild for changes)
- Handles fonts, layouts perfectly
- Scales infinitely

**Cons:**
- External dependency
- Monthly cost (or free tier limits)
- Vendor lock-in
- Requires internet

**Example:**
```html
<meta property="og:image"
  content="https://res.cloudinary.com/demo/image/upload/
    l_text:Arial_48:{{ .Title }},co_white,g_north_west,x_50,y_50/
    l_text:Arial_24:{{ .Params.growth_stage }},co_green,g_south_east,x_50,y_50/
    og-template.png" />
```

**Cost:**
- Cloudinary free tier: 25GB storage, 25GB bandwidth/month
- Likely sufficient for personal blog
- Paid plans: $89/month (overkill)

**Best for:** Professional sites, complex designs, no build time concerns

---

#### Option C: Screenshot API (Puppeteer, Playwright)
**How it works:**
- HTML template for OG image
- Headless browser screenshots during build
- Saved as PNG
- Committed to repo

**Pros:**
- Full HTML/CSS control
- Custom fonts via Google Fonts
- Pixel-perfect design
- No external service

**Cons:**
- Slowest option (browser overhead)
- Requires Node.js in build
- Large dependencies (Chromium)
- May timeout on slow builds

**Example:**
```js
// scripts/generate-og-images.js
const puppeteer = require('puppeteer');

async function generateOG(article) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 630 });
  await page.setContent(`
    <html>
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700&display=swap" rel="stylesheet">
      <style>/* OG image styles */</style>
      <body>
        <h1>${article.title}</h1>
        <div class="badge">${article.growth_stage}</div>
      </body>
    </html>
  `);
  await page.screenshot({ path: `static/og/${article.slug}.png` });
  await browser.close();
}
```

**Build Time Impact:**
- +5-10 seconds per image
- 10 articles = +50-100 seconds per build
- Can be parallelized

**Best for:** Design control, custom fonts, no external dependencies

---

#### Option D: Static Template (Defer Dynamic)
**How it works:**
- Single OG image for all articles (for now)
- Site logo + branding
- No article-specific customization
- Simplest option

**Pros:**
- Zero build time
- Zero complexity
- Zero cost
- Good enough for MVP

**Cons:**
- Not article-specific
- No growth stage badges
- Less engagement on social shares
- Feels generic

**Example:**
```html
<!-- Same image for all articles -->
<meta property="og:image" content="/images/og-default.png" />
```

**Timeline:**
- Phase 1: Use this (ship faster)
- Phase 2: Upgrade to Option A or C
- Only implement when you see traffic from social shares

**Best for:** MVP, ship fast, iterate later

---

**My Recommendation: Option D (Static) → Option C (Screenshot) in Phase 2**

**Reasoning:**
1. **Don't over-engineer MVP:** OG images are nice-to-have, not must-have
2. **You don't have traffic yet:** No social shares to optimize for
3. **Save time for core features:** Focus on sorting/growth stages first
4. **Easy to upgrade:** Can add dynamic OG images in Phase 2

**Phase 1 (Now):**
- Create one good OG image: Site logo + "Digital Garden" branding
- Use for all articles
- Effort: 30 minutes in Canva/Figma

**Phase 2 (Later):**
- Implement Option C (Puppeteer screenshots)
- Full control, custom fonts, growth stage badges
- Effort: 1-2 days
- Only do this when social traffic warrants it

**If you insist on dynamic now:** Use **Option A (Hugo)** (free, no dependencies)

**Decision:** _[Your choice: A (Hugo) / B (Cloudinary) / C (Puppeteer) / D (Static, defer)]_

---

### Question 9: POSSE Target

**Context:**
Which social platforms should auto-syndicate new articles? This is "Publish Own Site, Syndicate Elsewhere."

**Options:**

#### Option A: Mastodon Only
**Pros:**
- Decentralized (aligns with IndieWeb)
- No corporate platform
- Active tech community
- Direct API access
- Supports webmentions natively (Bridgy)

**Cons:**
- Smaller audience than Twitter/LinkedIn
- Less discoverability
- Echo chamber risk (tech-heavy)

**Implementation:**
```js
// GitHub Actions: Post to Mastodon
const Mastodon = require('mastodon-api');
const M = new Mastodon({
  access_token: process.env.MASTODON_TOKEN,
  api_url: 'https://mastodon.social/api/v1/'
});

M.post('statuses', {
  status: `New article: ${title}\n\n${summary}\n\n${url}`
});
```

**Best for:** IndieWeb purists, tech audience

---

#### Option B: Mastodon + Bluesky
**Pros:**
- Two decentralized platforms
- Growing Bluesky momentum (2024-2025)
- Tech-savvy audiences
- Own your data on both

**Cons:**
- Double maintenance
- Bluesky still beta (API changes)
- Fragmented engagement
- More code to maintain

**Implementation:**
- Mastodon API (established)
- Bluesky API (AT Protocol, newer)

**Best for:** Hedging bets, early adopters

---

#### Option C: Multi-Platform (Mastodon + Twitter/X + LinkedIn)
**Pros:**
- Maximum reach
- Diverse audiences
- Professional (LinkedIn) + casual (Twitter)
- More discovery opportunities

**Cons:**
- Supports corporate platforms (anti-IndieWeb)
- Twitter API costs money ($100/month basic)
- LinkedIn API complex
- Maintenance burden
- Conflicting philosophies

**Implementation:**
- Mastodon: Free API
- Twitter: $100/month (Basic tier required for posting)
- LinkedIn: Complex OAuth, rate limits

**Best for:** Business blogs, maximum reach

---

#### Option D: Start with Mastodon, Expand Later
**Pros:**
- Simplest to start
- Learn POSSE mechanics first
- Can add platforms as needed
- No vendor lock-in decisions

**Cons:**
- Smaller initial reach
- May never expand (inertia)

**Timeline:**
- Phase 1: Manual posting (no automation)
- Phase 2: Mastodon POSSE automation
- Phase 3: Evaluate if more platforms needed
- Phase 4: Add others if data shows value

**Best for:** Pragmatists, iterate based on data

---

**My Recommendation: Option D (Mastodon First, Iterate)**

**Reasoning:**
1. **Start simple:** One platform, learn the workflow
2. **Aligned with values:** Mastodon matches IndieWeb philosophy
3. **Free API:** No cost barriers
4. **Revisit later:** Add platforms when you see ROI

**Suggested Approach:**
- **Phase 1-2:** Manual posting to Mastodon (no automation yet)
- **Phase 3:** Automate Mastodon POSSE
- **After 6 months:** Evaluate
  - Is Mastodon driving traffic? (Check referrals)
  - Do you have audience on other platforms?
  - Is Twitter API worth $100/month?
- **Phase 4:** Add Bluesky if it gains traction

**Manual vs. Automated:**
- Start with manual posting (learn what works)
- Automate once you've refined the format
- Don't automate bad posts faster

**Decision:** _[Your choice: Mastodon only / Mastodon+Bluesky / Multi-platform / Start manual]_

**If Mastodon:** _[Instance: mastodon.social / mastodon.technology / own instance]_

---

### Question 10: Data File Storage

**Context:**
Should `popularity_scores.json` be committed to Git repo or treated as a build artifact? This affects version history and repo cleanliness.

**Options:**

#### Option A: Commit to Repo
**How it works:**
- GitHub Actions generates `data/popularity_scores.json`
- Commits changes back to repo
- Stored in version control

**Pros:**
- **Version history:** See popularity changes over time
- **Local development:** Can build locally with real data
- **Debugging:** Inspect historical scores
- **Transparency:** Public data (if repo is public)
- **Rollback:** Can revert if calculation breaks

**Cons:**
- Noisy commit history (daily "Update scores" commits)
- Repo size grows (JSON diffs)
- Merge conflicts (if manual edits)
- Not "clean" (generated code in repo)

**Implementation:**
```yaml
# GitHub Actions
- name: Calculate popularity scores
  run: node scripts/calculate-popularity.js

- name: Commit updated scores
  run: |
    git config user.name "GitHub Actions Bot"
    git config user.email "actions@github.com"
    git add data/popularity_scores.json
    git commit -m "chore: update popularity scores [skip ci]" || echo "No changes"
    git push
```

**Commit History:**
```
chore: update popularity scores [skip ci]
chore: update popularity scores [skip ci]
feat: add new article about Hugo
chore: update popularity scores [skip ci]
```

**Best for:** Transparency, debugging, local dev

---

#### Option B: Build Artifact Only
**How it works:**
- GitHub Actions generates scores
- Not committed to repo
- Hugo build uses generated file
- Deployed with site, not in Git

**Pros:**
- Clean commit history (no daily noise)
- Repo stays lean
- Separation of concerns (code vs. data)
- Follows "don't commit generated files" principle

**Cons:**
- **No local dev data:** Local builds have stale/empty scores
- No historical tracking
- Harder to debug score issues
- Can't inspect past scores

**Implementation:**
```yaml
# GitHub Actions
- name: Calculate popularity scores
  run: node scripts/calculate-popularity.js
  # NO git commit step

- name: Build Hugo
  run: hugo --environment production
  # Uses generated data file

- name: Deploy
  # Site includes data file, but not in Git
```

**Local Development:**
- Need mock data file or empty scores
- Or: Run fetch scripts manually before hugo serve

**Best for:** Clean repos, production-only data

---

#### Option C: Separate Data Repository
**How it works:**
- Create second repo: `article-time-data`
- Store `popularity_scores.json` there
- Main repo pulls data during build

**Pros:**
- Best of both worlds (version history + clean main repo)
- Can make data repo private (sensitive metrics)
- Organized separation
- Historical tracking preserved

**Cons:**
- More complex setup
- Two repos to manage
- Overhead for small project
- Extra build step (clone data repo)

**Implementation:**
```yaml
# GitHub Actions
- name: Checkout data repo
  uses: actions/checkout@v4
  with:
    repository: AngelCrawford/article-time-data
    path: data-repo
    token: ${{ secrets.PAT }}

- name: Copy data files
  run: cp data-repo/*.json data/

- name: Build Hugo
  run: hugo
```

**Best for:** Large projects, sensitive data, multi-site setups

---

#### Option D: Hybrid (Commit Weekly, Not Daily)
**How it works:**
- Daily builds use artifact (not committed)
- Weekly cron commits snapshot
- Balance between history and noise

**Pros:**
- Historical tracking (weekly granularity)
- Less commit noise (52/year vs. 365/year)
- Still can debug issues
- Local dev has recent data

**Cons:**
- More complex workflow
- Could miss daily fluctuations
- Arbitrary decision (why weekly?)

**Implementation:**
```yaml
# Daily rebuild: No commit
on:
  schedule:
    - cron: '0 2 * * *'  # 2 AM daily
  # ... calculate scores, build, deploy (no commit)

# Weekly snapshot: Commit data
on:
  schedule:
    - cron: '0 3 * * 0'  # 3 AM Sunday
  # ... calculate scores, commit to repo
```

**Best for:** Want history without daily noise

---

**My Recommendation: Option A (Commit to Repo)**

**Reasoning:**
1. **Transparency:** You're building in public, show the data
2. **Debugging:** Can see "why did this article rank here on Nov 15?"
3. **Local dev:** Can test sorting locally with real scores
4. **Simple:** One workflow, no extra complexity
5. **Commit noise is fine:** Use `[skip ci]` to prevent rebuild loops

**Mitigating Commit Noise:**
- Use `[skip ci]` in commit message (no rebuild triggered)
- Squash commits occasionally (git rebase)
- Filter commits in GitHub (hide "chore:" messages)
- Separate branch (data-updates) if it bothers you

**Alternative if you hate noise:** **Option D (Weekly commits)**
- Daily builds for fresh data
- Weekly commits for history
- Balances both concerns

**For MVP:** Start with Option A, can switch to B later if it bothers you

**Decision:** _[Your choice: A (commit) / B (artifact) / C (separate repo) / D (weekly)]_

---

## Summary of Recommendations

Here's my suggested decision set for MVP (you can override any):

| Question | Recommendation | Rationale |
|----------|---------------|-----------|
| **1. Withered Handling** | Hide by Default (B) | Clean UX, explicit toggle |
| **2. Grace Period** | 4 Weeks (A) | Balanced, re-evaluate after 3 months |
| **3. Pinned Limit** | 3 Articles (A) | Forces curation, clear signal |
| **4. Format Priority** | Defer All (D) | Focus on core garden first |
| **5. Webmention Moderation** | Auto-Approve (D) | Start simple, add moderation if needed |
| **6. Umami Hosting** | Self-Hosted (A) | You're technical, unlimited API |
| **7. Deployment** | Cloudflare Pages (C) | Unlimited bandwidth, excellent CDN |
| **8. OG Images** | Static → Dynamic (D→C) | Ship MVP fast, polish later |
| **9. POSSE Target** | Mastodon First (D) | Learn workflow, expand later |
| **10. Data Storage** | Commit to Repo (A) | Transparency, debugging, simplicity |

**Total Time Saved by These Decisions:**
- Defer formats: ~1 week saved
- Static OG images: ~2 days saved
- Manual POSSE: ~3 days saved (Phase 1)
- Self-hosted Umami: ~€9/month saved

**MVP Timeline with These Decisions:**
- Phase 0: 1 week
- Phase 1: 5-6 weeks (instead of 6-8)
- Launch: ~2 months total

---

## Next Steps

1. **Review recommendations** - Do they align with your goals?
2. **Mark your decisions** - Fill in _[Your choice]_ for each question
3. **Update PRD** - I can update the PRD with your final decisions
4. **Start Phase 0** - Begin implementation with clear direction

Ready to lock in your decisions? Let me know which ones you agree with or want to discuss further!
