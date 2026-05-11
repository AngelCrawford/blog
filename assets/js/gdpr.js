// ***************** Cookie Banner (Story 2.7) — vanilla JS, no jQuery.
// Privacy notice surfaced once per browser session. State is held in
// sessionStorage (key: `cookie-banner-dismissed`) — NOT a cookie. The flag
// clears with the browser session, so a returning visitor in a fresh session
// sees the banner again. Architecture rule: digital-garden-integration-
// architecture.md Critical Agent Rule #5 (no jQuery for new features).
(function () {
    var DISMISS_KEY = 'cookie-banner-dismissed';
    var ANIM_MS = 300;

    function init() {
        var banner = document.getElementById('cookie-banner');
        if (!banner) return;

        try {
            if (sessionStorage.getItem(DISMISS_KEY) === '1') return;
        } catch (e) {
            // sessionStorage unavailable (private mode, quota, disabled) —
            // banner shows every page-load. Acceptable degraded behaviour.
        }

        // Keep banner pinned at the main/footer boundary: at viewport bottom
        // while scrolling through content; follows the reveal edge when footer appears.
        function updateBottom() {
            var main = document.querySelector('main');
            if (!main) return;
            var excess = window.innerHeight - main.getBoundingClientRect().bottom;
            banner.style.bottom = (excess > 0 ? excess : 0) + 'px';
        }
        window.addEventListener('scroll', updateBottom, { passive: true });
        window.addEventListener('resize', updateBottom, { passive: true });

        banner.removeAttribute('hidden');
        updateBottom();
        // Defer .is-visible one frame so the CSS transition triggers.
        requestAnimationFrame(function () { banner.classList.add('is-visible'); });

        var dismissed = false;

        function dismiss() {
            if (dismissed) return;
            dismissed = true;
            window.removeEventListener('scroll', updateBottom);
            window.removeEventListener('resize', updateBottom);
            try { sessionStorage.setItem(DISMISS_KEY, '1'); } catch (e) { /* ignore */ }
            banner.classList.remove('is-visible');
            banner.classList.add('is-dismissing');
            setTimeout(function () {
                if (banner.parentNode) banner.parentNode.removeChild(banner);
            }, ANIM_MS);
        }

        var closeBtn = banner.querySelector('.cookie-banner-close');
        if (closeBtn) closeBtn.addEventListener('click', dismiss);

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && !dismissed && banner.classList.contains('is-visible')) {
                dismiss();
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();


// ***************** Cookie Functions getCookie() and setCookie()
function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');

  for(var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return false;
}

function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/;SameSite=strict";
}

function deleteCookie(cname) {
  document.cookie = cname + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; 
}


// ***************** Load Gravatar Images, if cookie is true, else load internal avatar
// function setGravatars(email, defaultImage) {
//   // get the "last" script on the page
//   var getScript = document.getElementsByTagName('script');
//   getScript = getScript[getScript.length - 1];

//   // create an image
//   var createImg = document.createElement('img');
//   createImg.className = 'is-rounded';
//   createImg.width = '120';
//   createImg.height = '120';
//   createImg.alt = 'User Avatar';
//   createImg.loading = "lazy";

//   if (getCookie('cookies-consent') == 'false' || !getCookie('cookies-consent') ) {
//     // <img class="is-rounded" src="/images/avatar.png" width="120" height="120" alt="Avatar Image">
//     createImg.src= "/images/avatar.png";

//   } else {
//     // <img class="is-rounded" src="https://secure.gravatar.com/avatar/' + email + '?s=120&r=pg&d=' + defaultImage + '" width="120" height="120" alt="Gravatar Image">
//     createImg.src= "https://secure.gravatar.com/avatar/" + email + "?s=120&r=pg&d=" + defaultImage;
//   }

//   // place before the closing script tag
//   getScript.parentNode.insertBefore(createImg, getScript);
// }

$(document).ready(function() {
  // ***************** Handle visited articles
  // Store current page as visited (only if it's an article)
  const currentPath = window.location.pathname;
  // Only mark as visited if it's an article page
  if (currentPath.includes('/articles/')) {
    localStorage.setItem('visited-' + currentPath, 'true');
  }

  // Check all links on the page
  const links = document.getElementsByTagName('a');
  for (let i = 0; i < links.length; i++) {
    const link = links[i];
    
    // Only check links to articles on the same site
    if (link.host === window.location.host) {
      const linkPath = link.pathname;
      
      // Only process article links
      if (linkPath.includes('/articles/')) {
        // Check if this article has been visited
        if (localStorage.getItem('visited-' + linkPath) === 'true') {
          // Mark as visited
          link.setAttribute('data-visited', 'true');
          
          // Also mark the parent article if it exists
          const parentArticle = link.closest('article.card.is-horizontal');
          if (parentArticle) {
            parentArticle.classList.add('visited');
          }
        }
      }
    }
  }
  markNewArticles(7);
});

// ***************** Handle new articles
// Function to mark articles as new if they are not older than X days
function markNewArticles(daysThreshold) {
  // Get all article cards
  const articleCards = document.querySelectorAll('article.card.is-horizontal');
  
  // Current date
  const currentDate = new Date();
  
  // Process each article
  articleCards.forEach(article => {
    // Find the time element inside the article
    const timeElement = article.querySelector('time[datetime]');
    
    if (timeElement) {
      // Get the article date from the datetime attribute
      const articleDateStr = timeElement.getAttribute('datetime');
      const articleDate = new Date(articleDateStr);
      
      // Calculate the difference in days
      const diffTime = currentDate - articleDate;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      // If the article is not older than the threshold, mark it as new
      if (diffDays <= daysThreshold) {
        article.classList.add('is-new');
      }
    }
  });
}