# Next Steps
- [ ] Agent `Analyst`: Brainstorming with PRD and Github Issues in mind
- [ ] Agent `Anylist`: PRD workflow with reference to: `docs/bmm-index.md`

# Ideas
- Mit AI auf EN übersetzen?
- Datum eines Artikels in URL anpassen, sobald er neu editiert wird. Mit canonical URL dann aber arbeiten für die alte URL?
- neobrutalism web design
- Backlinks hinzufügen? Würde die "Related" Box auf der Single Seite ersetzen?
- Instagram format = Log, selbes Design


# Open Items (Make Github issues?)
## 1. Modern browsers don't need jQuery for basic DOM manipulation 
**Recommendation:** Consider migrating to vanilla JavaScript to reduce bundle size by ~30KB (minified).

## 2. Overly aggressive use of !important (main.scss:55-57)
```css
*, html {
scroll-behavior: smooth !important;
scroll-padding-top: 35px;
}
```
**Problem:** Using !important on the universal selector (*) is an anti-pattern that can cause cascading issues.

**Better approach:**
```css
html {
scroll-behavior: smooth;
scroll-padding-top: 35px;
}
```

## 3. Hardcoded German text 
- In baseof.html:15
- Mixing language comments

## 4. CSP Configuration
The head.html references .Site.Params.csp.* but the params file wasn't fully reviewed. Ensure CSP is properly configured to prevent XSS attacks.

## 5. Performance Considerations

**Large search index loading**
- search.js loads entire site index from /index.json
- This grows with every article you publish
- No lazy loading - loads even if user never searches

**Recommendations:**
- Lazy load search functionality (only when search box is focused)
- Consider Algolia, Lunr.js, or Pagefind for better search performance
- Implement search result pagination

**Font loading**
- You're using preload for fonts (good!)
- But missing font-display: swap in CSS to prevent FOIT (Flash of Invisible Text)

**JavaScript bundle size**
- jQuery: ~30KB minified + gzipped
- Consider using native JavaScript for simple operations
- Split vendor bundles more aggressively


## 6. No error pages beyond 404:
- Missing 500.html, 403.html, etc.
- Could improve user experience during errors

## Other
- A token-based design system


# BMAD Method
## When Creating a Brownfield PRD
- Point the PRD workflow to: `docs/bmm-index.md`

## For Any Development Work
- **UI features**: Reference `docs/component-inventory.md`
- **Content changes**: Reference `docs/data-models.md`
- **Architecture questions**: Reference `docs/architecture.md`
- **Setup/workflow**: Reference `docs/development-guide.md`