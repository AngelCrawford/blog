// assets/js/hearts.js — Story 2.2 Heart Button
//
// Vanilla JS module bundled into footerBundle.js (see layouts/baseof.html).
// Depends on:
//   - window.umami    (loaded by Story 2.1's Umami snippet in head.html;
//                     production-only — undefined in `hugo server`, in which
//                     case the click is a silent no-op).
//   - localStorage    (same-origin, persistent across reloads).
// localStorage key format: `hearted-${articleUrl}` (e.g.
// `hearted-/articles/my-post/`). Per-browser only — clearable, not secure;
// acceptable because hearts are an engagement signal, not a vote.
;(function() {
    'use strict';

    function init() {
        const heartButtons = document.querySelectorAll('.heart-button:not(.heart-button-fallback)');
        if (!heartButtons.length) return;

        heartButtons.forEach(setupButton);
    }

    function setupButton(button) {
        const articleUrl = button.dataset.article;
        if (!articleUrl) return;
        const storageKey = 'hearted-' + articleUrl;

        // Restore prior hearted state from localStorage.
        if (safeGetItem(storageKey) === '1') {
            button.classList.add('hearted');
            button.setAttribute('aria-pressed', 'true');
            button.disabled = true;
        }

        button.addEventListener('click', function() {
            onHeartClick(button, articleUrl, storageKey);
        });
    }

    function onHeartClick(button, articleUrl, storageKey) {
        if (button.disabled || button.classList.contains('hearted')) return;

        // Track event via Umami — fire-and-forget. Wrapped in try/catch so any
        // tracker error is non-fatal for the optimistic UI update.
        try {
            if (window.umami && typeof window.umami.track === 'function') {
                window.umami.track('heart', { article: articleUrl });
            }
        } catch (err) {
            console.warn('[hearts] umami.track failed (non-fatal):', err);
        }

        // Optimistic UI: increment the count immediately.
        const countEl = button.querySelector('.heart-count');
        if (countEl) {
            const current = parseInt(countEl.textContent, 10) || 0;
            countEl.textContent = String(current + 1);
        }

        button.classList.add('hearted');
        button.setAttribute('aria-pressed', 'true');

        // Heart-pop animation — skipped when the user prefers reduced motion.
        if (typeof button.animate === 'function' &&
                !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            button.animate(
                [
                    { transform: 'scale(1)' },
                    { transform: 'scale(1.3)' },
                    { transform: 'scale(1)' }
                ],
                { duration: 300, easing: 'ease-out' }
            );
        }

        // Transient "Geherzt!" confirmation via the hint element (single-page
        // context only — log cards have no .heart-button-hint sibling).
        var wrapper = button.closest('.heart-button-wrapper');
        var hintEl = wrapper ? wrapper.querySelector('.heart-button-hint') : null;
        if (hintEl) {
            var originalHint = hintEl.textContent;
            hintEl.textContent = 'Geherzt!';
            setTimeout(function() { hintEl.textContent = originalHint; }, 1500);
        }

        // Persist hearted state and stay disabled. Architecture pattern
        // (digital-garden-integration-architecture.md lines 446–469) keeps the
        // button permanently disabled — localStorage check on next page load
        // restores the hearted state, so the AC-#7 "1-second debounce" is
        // satisfied trivially. Stay-disabled is the architecturally consistent
        // choice and a stronger guard than a 1s re-enable.
        safeSetItem(storageKey, '1');
        button.disabled = true;
    }

    // localStorage may be disabled (e.g. private mode in some browsers, or
    // user policy). Guard reads/writes so a failure doesn't break the click.
    function safeGetItem(key) {
        try {
            return localStorage.getItem(key);
        } catch (err) {
            return null;
        }
    }

    function safeSetItem(key, value) {
        try {
            localStorage.setItem(key, value);
        } catch (err) {
            /* swallow — heart still tracked via Umami, just not persisted */
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
