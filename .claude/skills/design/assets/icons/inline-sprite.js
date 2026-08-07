/* Inlines the Remixicon sprite into the document so every `<use href="#name">`
 * is a same-document reference.
 *
 * The sprite is self-hosted as a separate file upstream and referenced across
 * documents (`<use href="…/remixicon.symbol.svg#name">`). That form is fragile:
 * several rendering contexts — print, canvas rasterisation, sandboxed previews —
 * silently drop cross-document references, and the icon disappears with no
 * error. Inlining once at load costs one request and removes the whole class of
 * failure. Same-document references are live, so icons that React rendered
 * before the fetch finished light up on their own.
 *
 * Load it once per page, after styles.css:
 *   <script src="assets/icons/inline-sprite.js"></script>
 * Point it somewhere else with either
 *   <script src="…/inline-sprite.js" data-sprite="…/remixicon.symbol.svg"></script>
 * or `window.AT_SPRITE_URL = '…'` before the tag.
 *
 * THE URL IS NEVER GUESSED FROM A NON-MATCH. An earlier version derived it from
 * document.currentScript.src with a regex replace — and String.replace returns
 * the string UNCHANGED when the pattern does not match. Whenever currentScript
 * resolved to something else (a bundle tag, a rewritten src), the loader happily
 * fetched that file, got HTTP 200, and injected 101 KB of JavaScript into an
 * <svg> container. Every icon on the page vanished with nothing in the console.
 * Hence: derive only on a real match, fall back to finding our own script tag in
 * the document, and refuse any response that is not SVG.
 *
 * IDEMPOTENT, and that matters here: this file is re-executed in some contexts,
 * and a re-execution has a null document.currentScript. Bailing out on that path
 * logged an error on every single load — permanent noise that would mask the next
 * real one. The sprite already being in the document is the answer, so that check
 * comes first, before any URL resolution.
 */
(function () {
  if (document.getElementById('at-sprite')) return;

  var explicit = (document.currentScript && document.currentScript.dataset && document.currentScript.dataset.sprite)
    || (typeof window !== 'undefined' && window.AT_SPRITE_URL);
  var here = document.currentScript && document.currentScript.src;
  var derived = here && /inline-sprite\.js(\?.*)?$/.test(here)
    ? here.replace(/inline-sprite\.js(\?.*)?$/, 'remixicon.symbol.svg')
    : null;
  /* Last resort when currentScript is unavailable: find our own tag in the
   * document. Reliable at any page depth, unlike a document-relative guess —
   * this file lives beside the sprite, a page does not. */
  var own = null;
  var tags = document.querySelectorAll('script[src*="inline-sprite.js"]');
  if (tags.length) own = tags[tags.length - 1].src.replace(/inline-sprite\.js(\?.*)?$/, 'remixicon.symbol.svg');
  var url = explicit || derived || own;

  if (!url) {
    /* Silent, deliberately. This is reached only by a re-execution of this file in
     * a context that has neither currentScript nor our own tag in its document —
     * the first, real run has already fetched and mounted. Logging here put an
     * error in the console of every page in the project on every load, which is
     * permanent noise that would mask the next genuine failure. The failure that
     * matters — a response that is not an SVG sprite — is still loud, below. */
    return;
  }

  fetch(url).then(function (r) {
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return r.text();
  }).then(function (svg) {
    /* Guard: a 200 response proves nothing about what came back. */
    if (svg.indexOf('<symbol') === -1 && svg.trim().indexOf('<svg') !== 0) {
      throw new Error('response from ' + url + ' is not an SVG sprite (no <symbol> found)');
    }
    var mount = function () {
      if (document.getElementById('at-sprite')) return;
      var host = document.body || document.documentElement;
      var box = document.createElement('div');
      box.id = 'at-sprite';
      box.setAttribute('aria-hidden', 'true');
      box.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
      box.innerHTML = svg;
      host.insertBefore(box, host.firstChild);
    };
    if (document.body) mount(); else document.addEventListener('DOMContentLoaded', mount);
  }).catch(function (e) {
    console.error('inline-sprite.js: ' + e.message + ' — icons will not render.');
  });
})();
