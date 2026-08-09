// assets/js/mail-guard.js — reassembles the guarded mail address
// (_shortcodes/mail.html) for human visitors.
//
// The shortcode ships the address BASE64-ENCODED in `data-m` and shows the
// [at]/[dot] form as no-JS fallback text. This script decodes it, writes
// the real mailto: href and drops the data attribute. Runs once on load —
// which means a JS-executing crawler gets the address too; that trade-off is
// documented at the shortcode and was accepted deliberately. Vanilla, no
// exceptions (CLAUDE.md rule 6).
;(function () {
    'use strict';

    function init() {
        document.querySelectorAll('.mail-guard[data-m]').forEach(function (el) {
            var addr;
            try {
                addr = window.atob(el.getAttribute('data-m'));
            } catch (err) {
                return; // corrupt attribute: leave the [at]/[dot] fallback standing
            }
            el.href = 'mailto:' + addr;
            el.textContent = addr;
            el.removeAttribute('data-m');
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
