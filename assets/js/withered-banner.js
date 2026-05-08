// Withered banner dismiss handler (Story 1.4).
// Hides the banner for the current article+session via sessionStorage.
// No cookies, no localStorage by design — re-shows on next visit.
// Vanilla IIFE; the footer bundle is loaded with `defer`, so DOM is ready.
//
// `!function(){}()` (rather than `(function(){})()`) is intentional:
// resources.Concat splices files without a separator and resources.Minify
// strips redundant leading semicolons, so a leading `(` would be parsed as a
// call applied to the previous file's last expression. The unary `!` cleanly
// terminates whatever came before and consumes the function expression.
!function () {
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
}();
