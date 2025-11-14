# Digital Garden

## Ideas
- Liking with hearts (no downvoting)
  - If a post has more likes, it will change the sort order
  - Integration with webmentions = hearts from OTHER sites count too!
- Put back comment system -> More comments will change the sort order, too?
- First card should be the explanation card?
- Do you show the tending history on the article page itself? Like: "🌱 Planted: Jan 2024 → 🌿 Tended: Mar 2024 → 🌳 Evergreen: Nov 2024"?

## Home page filter
- Filter for 
  - By Date
  - By growth stage
  - By type (called "formats" in the system) https://github.com/AngelCrawford/blog/issues/59
  - By category (called "Rubrik" in the system), would replace the need of the category stand alone page

## Home Sorting
- Withered work will not be visible on the home page, only if the user clicks on the growth stage filter

// Priority sorting (client-side or build-time)
1. Pinned articles (max 3)
2. 5 articles with last_tended_date DESC sorting -> Only for x-weeks active, then popularity_score
3. Articles after this will get sorted by popularity_score = (webmention_likes * 1) + (comments * 3) + (weight * 2)
4. EXCLUDE: growth_stage === 'withered'

Home Page Hierarchy:
┌─────────────────────────────────────────────────┐
│ 📍 PINNED (Top 3 by recency if >3 exist)        │
│ ┌───────────────────────────────────────────┐   │
│ │ Garden Guide                              │   │
│ │ My Philosophy                             │   │
│ │ Current Focus Project                     │   │
│ └───────────────────────────────────────────┘   │
├─────────────────────────────────────────────────┤
│ 🌱 RECENTLY TENDED (4-week grace period)        │
│                                                 │
│ ⭐ Early Promoted (20+ points, sorted by score) │
│ ┌───────────────────────────────────────────┐   │
│ │ [🌳 Evergreen] [UPDATED]                  │   │
│ │ Complete Hugo Guide                       │   │
│ │ Planted: Jan 2023 • Updated: Nov 13       │   │
│ │ 💚 25 hearts • 💬 8 replies (= 49 pts)    │   │
│ └───────────────────────────────────────────┘   │
│                                                 │
│ 📅 Regular (< 20 points, sorted by date)        │
│ ┌───────────────────────────────────────────┐   │
│ │ [🌱 Seedling] [NEW]                       │   │
│ │ CSS Grid Experiments                      │   │
│ │ Planted: Nov 13                           │   │
│ └───────────────────────────────────────────┘   │
│ ┌───────────────────────────────────────────┐   │
│ │ [🌿 Budding] [UPDATED]                    │   │
│ │ Learning Rust                             │   │
│ │ Planted: Oct 1 • Updated: Nov 10          │   │
│ │ 💚 5 hearts • 💬 2 replies (= 11 pts)     │   │
│ └───────────────────────────────────────────┘   │
├─────────────────────────────────────────────────┤
│ 🌳 ESTABLISHED GARDEN (Past grace period)       │
│ ┌───────────────────────────────────────────┐   │
│ │ [🌳 Evergreen]                            │   │
│ │ JavaScript Patterns                       │   │
│ │ Planted: Mar 2024 • Refined: Sep 2024     │   │
│ │ 💚 45 hearts • 💬 15 replies (= 75 pts)   │   │
│ └───────────────────────────────────────────┘   │
│ ...                                             │
└─────────────────────────────────────────────────┘


## Growth stage 
- 🌱 Seedling: "Thinking out loud..." `<i class="ri-seedling-line"></i>`
- 🌿 Budding: "Refining..." `<i class="ri-plant-line"></i>`
- 🌳 Evergreen: "Refined & reliable" `<i class="ri-tree-line"></i>`
- 💀 Withered (when filtered): "Archived thinking" `<i class="ri-skull-line"></i>`

Visual Signals for Tiers:
- Pinned: Gold border, 📍 pin icon
- Recently Tended: Fresh green accent, "New" badge
- Established: Standard cards with visible metrics

  For pinned posts strategy:
  Pin 1: "Start Here: How This Garden Works" (onboarding)
  Pin 2: "About Me & My Philosophy" (context)
  Pin 3: [Your current passion project] (dynamic)


## Single page information
- Date first planted
- Date last tended
- category (only one, are called "Rubrik") and tags
- State (draft, in progress?, finished, withered) -> See growth stage above
- 1-10 importance tag
- Digital Garden Icons explanation in "Info" Box or hover only?
- History hinzufügen, from Seedling to Withered

Option 1: Timeline Visualization
┌────────────────────────────────────────┐
│ 📜 Article History                     │
├────────────────────────────────────────┤
│ 🌳 Dec 3, 2024 - Evergreen            │
│    Refined asset pipeline section     │
│                                        │
│ 📝 Nov 5, 2024                         │
│    Complete overhaul with Hugo 0.120+ │
│                                        │
│ 🌿 Aug 15, 2023 - Budding             │
│    Promoted after community feedback   │
│                                        │
│ 📝 Jun 10, 2023                        │
│    Major rewrite (lines 145-230)       │
│                                        │
│ 📝 Mar 20, 2023                        │
│    Added shortcodes section            │
│                                        │
│ 🌱 Jan 15, 2023 - Seedling            │
│    Initial planting
│                                        │
│ 💀 Mar 2025: "Marking as withered - Hugo changed this completely"
│    Note: "See [new article] for current approach"
│                                        │
└────────────────────────────────────────┘

## Rules
- https://github.com/swyxio/digital-garden-tos

## Changes
- Remove archiv, not needed anymore and a hell of a lot of (design) work
- Evergreens are right now fixed articles, should be changed
- Adding the categories as a filter and removing the category single page, could mean I can remove the top navigation bar. Think about.
  - Con: To get to a full category, user has to click on the category link of an article
  - Could add a "See all categories" button on each category page -> Breadcrumb? Same for tags then