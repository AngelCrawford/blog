// Withered banner dismiss handler (Story 1.4).
// Hides the banner for the current article+session via sessionStorage.
// No cookies, no localStorage by design — re-shows on next visit.
// Vanilla IIFE; the footer bundle is loaded with `defer`, so DOM is ready.
//
// Leading semicolon: resources.Concat splices files with no separator, so an
// unterminated previous statement (e.g. a function expression in the prior
// file) would parse `(function(){...})()` as a call applied to it. The `;`
// forces ASI to terminate whatever came before.
;(function () {
    const banner = document.querySelector('.withered-banner[data-banner-key]');
    if (!banner) return;

    const key = banner.getAttribute('data-banner-key');
    if (!key) return;

    // Restore prior dismissal for this session.
    try {
        if (sessionStorage.getItem(key) === '1') {
            banner.hidden = true;
            return;
        }
    } catch (_) {
        // sessionStorage may throw in strict privacy modes — fail open (banner visible).
    }

    const dismiss = banner.querySelector('.withered-banner-dismiss');
    if (!dismiss) return;
    dismiss.addEventListener('click', function () {
        banner.hidden = true;
        try {
            sessionStorage.setItem(key, '1');
        } catch (_) {
            // Same fallback as above — visual state stays hidden for this session.
        }
    });
})();
