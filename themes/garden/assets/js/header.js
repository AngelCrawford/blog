/* Garden — header behaviour. Vanilla, no jQuery.
 *
 * Two jobs: sweep a highlight across the wordmark, and pick which of the four
 * skies the header wears. Ported from themes/article-time/assets/js/header.js,
 * which was the last sizeable jQuery dependant after main.js.
 *
 * Loaded from the bundle in baseof.html, deferred, after suncalc.js — which is
 * where `SunriseSunsetJS` comes from.
 */

/* ── The shimmer ───────────────────────────────────────────────────────────
 * A 50px-wide highlight travels across the letters: once shortly after load,
 * and again whenever you point at the mark.
 *
 * The class is removed on `animationend` rather than after a hard-coded 900ms
 * (jQuery's `.delay(900).queue()`), so the two can never drift apart — the
 * animation is 800ms today and the timer was set to 900. Removing it is what
 * makes the next hover able to start it again. */
(() => {
  const shimmer = document.querySelector(".at-wordmark-shimmer");
  if (!shimmer) return;

  const run = () => shimmer.classList.add("is-shimmering");
  shimmer.addEventListener("animationend", () =>
    shimmer.classList.remove("is-shimmering")
  );

  /* 1.9s after load — late enough that the clock has finished rising, so the
   * two openings do not talk over each other. */
  setTimeout(run, 1900);
  shimmer.parentElement.addEventListener("mouseenter", run);
})();

/* ── Time of day ───────────────────────────────────────────────────────────
 * Four skies: night, dawn, day, dusk, chosen from the sun's actual times rather
 * than from fixed clock hours, so the header follows the season.
 *
 * Dawn and dusk are the hour either side of sunrise and sunset; day and night
 * are what is left once that hour has passed.
 *
 * THE STATE IS ONE ATTRIBUTE, NOT FOUR CLASSES. Upstream added `is-night` and
 * friends and never removed them, which stayed invisible only because of the
 * bug below — nothing ever ran a second time. An attribute cannot hold two
 * values, so a re-run simply replaces the old one.
 */
(() => {
  const header = document.querySelector(".at-header");
  if (!header || typeof SunriseSunsetJS === "undefined") return;

  /* CARRIED OVER UNCHANGED, AND THE LONGITUDE LOOKS WRONG. 53.55 is Hamburg's
   * latitude; 9.99 is Hamburg's longitude, but this says -2.59, which is open
   * water west of Liverpool. The two are 12.6° apart, so every sunrise and
   * sunset here lands about fifty minutes late — visible as a dusk that starts
   * too late in the evening.
   *
   * Not changed as part of this migration: it would alter what the site looks
   * like at a given hour, which is a decision, not a port. Hamburg is
   * { lat: 53.551086, lon: 9.993682 } — one edit when you want it. */
  const LAT = 53.551086;
  const LON = -2.592;

  const el = {
    stars: document.querySelector("[data-hero-stars]"),
    balloon: document.querySelector("[data-hero-balloon]"),
    santa: document.querySelector("[data-hero-santa]"),
    ghost: document.querySelector("[data-hero-ghost]"),
  };

  /* Minutes since midnight, for a Date or for now. */
  const minutes = (d) => d.getHours() * 60 + d.getMinutes();
  /* Windows can cross midnight — night almost always does. */
  const within = (now, start, end) =>
    end < start ? now >= start || now <= end : now >= start && now <= end;

  const HOUR = 60 * 60 * 1000;
  const MINUTE = 60 * 1000;

  const paint = () => {
    const now = new Date();
    const sunrise = SunriseSunsetJS.getSunrise(LAT, LON);
    const sunset = SunriseSunsetJS.getSunset(LAT, LON);
    const at = minutes(now);

    /* Order matters: dawn and dusk are checked before day and night because
     * their windows are the narrower ones. Upstream looped over all four and
     * let later matches stack on top of earlier ones; here the first match
     * wins, which is the same result stated as a rule. */
    const sky =
      (within(at, minutes(new Date(+sunrise - 59 * MINUTE)), minutes(new Date(+sunrise + 59 * MINUTE))) && "dawn") ||
      (within(at, minutes(new Date(+sunset - 59 * MINUTE)), minutes(new Date(+sunset + 59 * MINUTE))) && "dusk") ||
      (within(at, minutes(new Date(+sunrise + HOUR)), minutes(new Date(+sunset - HOUR))) && "day") ||
      "night";

    header.dataset.sky = sky;

    const show = (node, on) => { if (node) node.hidden = !on; };
    show(el.stars, sky === "night" || sky === "dusk");
    show(el.balloon, sky === "day" || sky === "dusk");

    /* Seasonal overlays. Month is 0-based, hence the +1 nowhere — comparing the
     * 0-based month directly is shorter and less error-prone than rebuilding a
     * yyyy-mm-dd string to compare lexically, which is what upstream did. */
    const month = now.getMonth();
    const day = now.getDate();
    show(el.santa, month === 11 && day >= 1 && day <= 27);
    show(el.ghost, month === 9 && day >= 7 && day <= 31);
  };

  paint();
  /* Hourly. Upstream wrote `setInterval(dayNightSky(), …)` — the parentheses
   * call the function and hand its return value, `undefined`, to setInterval.
   * So the sky was decided once at page load and never revisited, and a tab
   * left open through sunset kept its afternoon. Passing the reference is the
   * whole fix. */
  setInterval(paint, HOUR);
})();
