"use strict";
/* Styleguide interactions — click a token to copy it.
 *
 * Loaded only by page/styleguide.html, not bundled into the site.
 *
 * navigator.clipboard needs a secure context: localhost counts, plain http on
 * another host does not, so the fallback path matters and is not dead code.
 */
(function () {
  /* Resolve a custom property to a hex string.
   *
   * The tokens are authored in HSL, but a hex value is what you paste into a
   * design tool or a bug report. Reading the COMPUTED value means this page can
   * never disagree with main.css — the hand-maintained list it replaces had
   * already drifted from the real tokens by a digit or two. */
  function tokenToHex(token) {
    const raw = getComputedStyle(document.documentElement)
      .getPropertyValue(token)
      .trim();
    if (!raw) return null;

    // Let the browser do the colour maths: paint it, read it back as rgb().
    const probe = document.createElement("span");
    probe.style.color = raw;
    probe.style.display = "none";
    document.body.appendChild(probe);
    const rgb = getComputedStyle(probe).color;
    probe.remove();

    const match = rgb.match(/\d+/g);
    if (!match || match.length < 3) return null;
    return (
      "#" +
      match
        .slice(0, 3)
        .map((n) => Number(n).toString(16).padStart(2, "0"))
        .join("")
        .toUpperCase()
    );
  }

  document.addEventListener("DOMContentLoaded", () => {
    for (const holder of document.querySelectorAll("[data-hex-for]")) {
      const hex = tokenToHex(holder.dataset.hexFor);
      const label = holder.querySelector("[data-hex-label]");
      if (!hex) continue;
      if (label) label.textContent = hex;
      holder.setAttribute("data-copy", hex); // makes it copyable like the rest
    }

    const buttons = document.querySelectorAll("[data-copy]");
    if (!buttons.length) return;

    let resetTimer = null;

    for (const button of buttons) {
      button.addEventListener("click", async () => {
        const value = button.dataset.copy;
        const label = button.querySelector("[data-copy-label]");
        const original = label ? label.textContent : null;

        let ok = false;
        try {
          if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(value);
            ok = true;
          } else {
            // Fallback for non-secure contexts: a throwaway textarea plus the
            // legacy exec command, which still works where the async API is
            // unavailable.
            const scratch = document.createElement("textarea");
            scratch.value = value;
            scratch.setAttribute("readonly", "");
            scratch.style.position = "fixed";
            scratch.style.opacity = "0";
            document.body.appendChild(scratch);
            scratch.select();
            ok = document.execCommand("copy");
            scratch.remove();
          }
        } catch {
          ok = false;
        }

        // Swap the stacked-sheets glyph for a checkmark. The sprite has no
        // dedicated copy icon, so `stack-line` stands in for duplicate and
        // `check-fill` confirms — clearer than only swapping the text.
        const icon = button.querySelector("[data-copy-icon] use");
        const spriteHref = icon && icon.getAttribute("href");

        if (icon && spriteHref) {
          icon.setAttribute("href", spriteHref.replace(/#.*$/, "#check-fill"));
        }
        if (label) label.textContent = ok ? "kopiert" : "ging nicht";

        clearTimeout(resetTimer);
        resetTimer = setTimeout(() => {
          if (label) label.textContent = original;
          if (icon && spriteHref) icon.setAttribute("href", spriteHref);
        }, 1200);
      });
    }
  });
})();
