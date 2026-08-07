/* Garden — page-shell behaviour. Vanilla, no jQuery.
 *
 * Ported from themes/article-time/assets/js/main.js, which was 138 lines of
 * which about 110 were commented out: a comment form, a spoiler toggle and a
 * "most loved" widget, all for features this blog decided against years ago
 * (there is no comment system — replies arrive as webmentions). Only the two
 * live behaviours came across. The dead code is not carried over and the dead
 * `compare()` helper it needed goes with it.
 *
 * Loaded from the bundle in baseof.html, deferred, so the DOM is parsed.
 */

/* ── Back to top ───────────────────────────────────────────────────────────
 * The button is `opacity-0 pointer-events-none` at rest and fades in past the
 * threshold. The jQuery version used fadeIn/fadeOut, which write an inline
 * `display` — that would overwrite the `inline-flex` .gd-round-button needs to
 * centre its glyph, so visibility is carried by opacity instead. Both classes
 * are toggled together: a button you cannot see must not be clickable.
 *
 * The class names are written out in full. Tailwind scans this directory
 * (`@source "themes/garden/assets/js"`) and extracts complete literal strings
 * only — a name built from a variable produces no rule at all. */
(() => {
  const button = document.getElementById("back-to-top");
  if (!button) return;

  const THRESHOLD = 800; // px, unchanged from the original

  const sync = () => {
    const show = window.scrollY > THRESHOLD;
    button.classList.toggle("opacity-0", !show);
    button.classList.toggle("pointer-events-none", !show);
  };

  sync();
  /* `passive` because the handler never calls preventDefault; without it the
   * browser has to wait for it before it can scroll. */
  window.addEventListener("scroll", sync, { passive: true });

  button.addEventListener("click", () => {
    /* The original animated over 50ms, which is a jump with extra steps.
     * `smooth` is what that was reaching for — and it is skipped for anyone who
     * asked for reduced motion, where an instant jump is the correct answer
     * rather than a degraded one. */
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: still ? "auto" : "smooth" });
  });
})();

/* ── Footer reveal ─────────────────────────────────────────────────────────
 * The footer is `position: fixed` at `z-index: -1`, so it sits behind the page
 * and is uncovered as you reach the bottom. For that to work the main column
 * has to end exactly one footer-height above the bottom of the document —
 * otherwise the footer is either permanently visible or never reachable.
 *
 * Its height is not knowable at build time: it depends on the h-card, the
 * archive list and how the columns wrap. So it is measured.
 *
 * A ResizeObserver replaces the original's window-resize listener. Resize was
 * always a proxy for "the footer might be a different height now", and it
 * misses the cases that actually change it — a webfont finishing its swap, an
 * image settling, the archive list growing. Observing the element answers the
 * real question. */
(() => {
  const main = document.querySelector("[data-page-main]");
  const footer = document.querySelector("[data-page-footer]");
  if (!main || !footer) return;

  const fit = () => {
    main.style.marginBottom = `${footer.offsetHeight}px`;
  };

  fit();
  new ResizeObserver(fit).observe(footer);
})();
