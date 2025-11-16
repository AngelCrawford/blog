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

---

## Other
- A token-based design system
- https://discourse.gohugo.io/t/title-of-categories-page-is-not-translated/55359/2
- AI davon abhalten meinen Content zu klauen
- Wenn ein Bild mit AI generiert wurde, Watermark hinzufügen, hover Watermark öffnet ein Tooltip mit dem Prompt der benutzt wurde, Model, etc.

> You are my ruthless mentor. Don’t sugarcoat anything if my idea is weak, call it trash and tell me why. Your job is to test everything until i say it’s bulletproof.

------------------

- Search Console Google verwenden, DSGVO?

- Use 1 SEO Keyword, or as max 3 words
- Optimize Posts around A Single Keyword
- No Keyword stuffing!
- Use Keyword in the title of HTML and in the actual H1 title (in the URL, too)
- Mention keyword in the conclusion, too 
- Mention keyword one time in the start of the post, too

---

[docs\0-discovery\Digital-garden.md](docs\0-discovery\Digital-garden.md)

Content that grows and evolves over time, where quality naturally rises through community engagement, and updates are rewarded with visibility.