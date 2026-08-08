/* Garden — privacy notice, and the read/new markers on article cards.
 * Vanilla. This was the last script in the bundle that needed jQuery.
 *
 * Ported from themes/article-time/assets/js/gdpr.js, which was already vanilla
 * apart from one thing: a `$(document).ready(…)` wrapper around the second
 * block. Everything inside it was plain DOM. Three cookie helpers
 * (getCookie / setCookie / deleteCookie) and a commented-out Gravatar loader
 * came off with it — the helpers had exactly one caller, and that caller was
 * the commented-out block. Nothing on this site sets a cookie.
 *
 * It also moves: this used to be a render-BLOCKING script in <head>, because
 * jQuery had to be there before anything could use it. It now rides the
 * deferred footer bundle with the rest.
 */

/* Deferred scripts already run after the document is parsed, so this resolves
 * immediately in practice. It stays because the guarantee should not depend on
 * where in the page someone puts the tag next. */
const onReady = (fn) =>
  document.readyState === "loading"
    ? document.addEventListener("DOMContentLoaded", fn)
    : fn();

/* ── Privacy notice ────────────────────────────────────────────────────────
 * Surfaced once per browser session. NOT a consent gate: Umami runs cookieless
 * and no tracking cookie is ever set, so there is nothing to consent to. The
 * banner is a transparency signal that points at the privacy policy.
 *
 * State lives in sessionStorage, deliberately not in a cookie — a cookie banner
 * that sets a cookie to remember it was dismissed is a joke the web has told
 * for fifteen years. The flag clears with the session, so a returning visitor
 * in a fresh session sees it again.
 *
 * Hidden by the `hidden` attribute in the markup so it cannot flash before this
 * runs. With JavaScript off it simply stays hidden, which is the correct
 * degraded state for a notice nobody has to act on.
 */
onReady(() => {
  const DISMISS_KEY = "cookie-banner-dismissed";
  const ANIM_MS = 300;

  const banner = document.getElementById("cookie-banner");
  if (!banner) return;

  try {
    if (sessionStorage.getItem(DISMISS_KEY) === "1") return;
  } catch {
    /* Private mode, quota, or storage disabled. The banner then shows on every
     * page load — annoying, but the honest failure for a notice. */
  }

  /* Pin the banner to the main/footer boundary: at the bottom of the viewport
   * while you are in the content, and riding the reveal edge once the fixed
   * footer starts to show from behind it. */
  const updateBottom = () => {
    const main = document.querySelector("[data-page-main]");
    if (!main) return;
    const excess = window.innerHeight - main.getBoundingClientRect().bottom;
    banner.style.bottom = `${excess > 0 ? excess : 0}px`;
  };
  window.addEventListener("scroll", updateBottom, { passive: true });
  window.addEventListener("resize", updateBottom, { passive: true });

  banner.removeAttribute("hidden");
  updateBottom();
  /* One frame later, or the element goes from `display: none` to visible in the
   * same paint and the CSS transition has nothing to transition from. */
  requestAnimationFrame(() => banner.classList.add("is-visible"));

  let dismissed = false;
  const dismiss = () => {
    if (dismissed) return;
    dismissed = true;
    window.removeEventListener("scroll", updateBottom);
    window.removeEventListener("resize", updateBottom);
    try {
      sessionStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* ignore — worst case it reappears */
    }
    banner.classList.remove("is-visible");
    banner.classList.add("is-dismissing");
    setTimeout(() => banner.remove(), ANIM_MS);
  };

  banner.querySelector(".cookie-banner-close")?.addEventListener("click", dismiss);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !dismissed && banner.classList.contains("is-visible")) {
      dismiss();
    }
  });
});

/* ── Read and new markers ──────────────────────────────────────────────────
 * Two corner flags on the cards: "Gesehen" for an article this browser has
 * opened before, "Neu" for one published within the last week.
 *
 * Both are LOCAL. Nothing is sent anywhere, nothing is stored server-side, and
 * that is the point — the site can tell you what you have read without knowing
 * who you are. It is also why the privacy notice above mentions it by name.
 *
 * The card is garden's now, so the hook is `article.at-card` — one class instead
 * of the two Bulma ones this used to reach for.
 */
onReady(() => {
  const CARD = "article.at-card";
  const NEW_DAYS = 7;
  const DAY_MS = 24 * 60 * 60 * 1000;

  /* Remember this page, if it is an article. */
  const here = window.location.pathname;
  if (here.includes("/articles/")) {
    try {
      localStorage.setItem(`visited-${here}`, "true");
    } catch {
      /* Storage disabled: no markers. Nothing else breaks. */
    }
  }

  /* Mark every link pointing at an article already opened. Same-origin only —
   * whether someone read an article somewhere else is not knowable and not our
   * business. */
  const seen = (path) => {
    try {
      return localStorage.getItem(`visited-${path}`) === "true";
    } catch {
      return false;
    }
  };

  /* The corner flag itself. Upstream this was a `::after` carrying the literal
   * text "✓ Gesehen" — one of the site's only two unicode symbols, and the
   * design system replaced both with sprite glyphs. A pseudo-element cannot hold
   * an `<svg><use>`, so the badge has to be a real element, and since the state
   * is in localStorage it has to be built here rather than in the template.
   *
   * Root-relative sprite path for the same reason the webfonts use one: baseURL
   * carries no sub-path in any of the four environments. */
  const SPRITE = "/fonts/remixicon/remixicon.symbol.svg";
  /* `tone` is the flag's colour as a COMPLETE class literal — never composed,
   * Tailwind only extracts whole strings. "Neu" speaks the palette's one green:
   * on a feed where most cards already say "Gesehen", the new one has to be
   * the thing your eye lands on, and a second gold flag was not. */
  const flag = (card, icon, label, tone) => {
    if (card.querySelector(".at-card-badge")) return;
    const el = document.createElement("span");
    /* `at-card-badge` is only the dedup hook above — the styles are utilities,
     * legal here because Tailwind scans this directory too. */
    /* The flag's CENTRE is pinned 18px inside the corner on both axes, via
     * translate from the corner point — width-independent, so the long
     * "Gesehen" sits on the diagonal exactly like the short "Neu". Anchoring
     * the right EDGE (the old -right-3.5) let every extra letter drag the
     * centre along the card edge. */
    el.className =
      "at-card-badge absolute top-0 right-0 z-10 inline-flex w-max " +
      "translate-x-[calc(50%-18px)] translate-y-[calc(-50%+18px)] rotate-45 " +
      "items-center gap-1 rounded-[3px] border " +
      "bg-[hsl(190_11%_12%)] px-[9px] py-[3px] text-[0.7rem] " + tone;
    el.innerHTML =
      `<svg class="size-[0.9em] shrink-0 fill-current" aria-hidden="true">` +
      `<use href="${SPRITE}#${icon}"></use></svg>`;
    el.append(label);
    card.prepend(el);
  };

  for (const link of document.querySelectorAll(`a[href*="/articles/"]`)) {
    if (link.host !== window.location.host || !seen(link.pathname)) continue;
    link.setAttribute("data-visited", "true");
    const card = link.closest(CARD);
    if (!card) continue;
    card.classList.add("visited");
    flag(card, "check-fill", "Gesehen", "border-accent-muted/70 text-accent");
  }

  /* And mark the recent ones. The card's own `datetime` is the source — no
   * second date has to be threaded through the template for this.
   *
   * "Gesehen" wins: `flag()` refuses a second badge, and read beats new. A card
   * you opened yesterday is not news to you. */
  const now = Date.now();
  for (const card of document.querySelectorAll(CARD)) {
    const when = card.querySelector("time[datetime]")?.getAttribute("datetime");
    if (!when) continue;
    if (Math.ceil((now - new Date(when)) / DAY_MS) <= NEW_DAYS) {
      card.classList.add("is-new");
      flag(card, "sparkling-line", "Neu", "border-success/70 text-success");
    }
  }
});
