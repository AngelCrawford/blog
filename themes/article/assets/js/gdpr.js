$(document).ready(function() {

  var cookieBanner = document.querySelector('#cookie-banner');
  var hasCookieConsent = getCookie('cookies-consent');

  // console.log(hasCookieConsent);

  if (!hasCookieConsent) {
    cookieBanner.classList.remove('closed');
    cookieBanner.classList.add('opened');
    $('#remove-cookies').css('display', 'none');
  } 
  if (hasCookieConsent == 'false') {
    cookieBanner.classList.add('closed');
    $('#reject-cookies').attr('disabled', true);
    $('#reject-cookies').removeAttr('data-tooltip');
  }
  if (hasCookieConsent == 'true') {
    cookieBanner.classList.add('closed');
    getFavForExternalLinks();
    $('#consent-cookies').attr('disabled', true);
  }

  var consentCta = cookieBanner.querySelector('#consent-cookies');
  var rejectCta = cookieBanner.querySelector('#reject-cookies');
  var removeAll = cookieBanner.querySelector('#remove-cookies');

  consentCta.addEventListener('click', () => {
    cookieBanner.classList.add('closed');
    cookieBanner.classList.remove('opened');
    setCookie('cookies-consent', 'true', 365);
    location.reload();
  });

  rejectCta.addEventListener('click', () => {
    cookieBanner.classList.add('closed');
    cookieBanner.classList.remove('opened');
    setCookie('cookies-consent', 'false', 365);
    location.reload();
  });

  removeAll.addEventListener('click', () => {
    cookieBanner.classList.add('opened');
    cookieBanner.classList.remove('closed');
    deleteCookie('cookies-consent');
    location.reload();
  });

  $('#cookie-banner-opener').click(function(){
    $('#cookie-banner').toggleClass('closed');
    cookieBanner.classList.add('opened');
  });

});


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
function setGravatars(email, defaultImage) {
  // get the "last" script on the page
  var getScript = document.getElementsByTagName('script');
  getScript = getScript[getScript.length - 1];

  // create an image
  var createImg = document.createElement('img');
  createImg.className = 'is-rounded';
  createImg.width = '120';
  createImg.height = '120';
  createImg.alt = 'User Avatar';
  createImg.loading = "lazy";

  if (getCookie('cookies-consent') == 'false' || !getCookie('cookies-consent') ) {
    // <img class="is-rounded" src="/images/avatar.png" width="120" height="120" alt="Avatar Image">
    createImg.src= "/images/avatar.png";

  } else {
    // <img class="is-rounded" src="https://secure.gravatar.com/avatar/' + email + '?s=120&r=pg&d=' + defaultImage + '" width="120" height="120" alt="Gravatar Image">
    createImg.src= "https://secure.gravatar.com/avatar/" + email + "?s=120&r=pg&d=" + defaultImage;
  }

  // place before the closing script tag
  getScript.parentNode.insertBefore(createImg, getScript);
}


// ***************** Add Favicons to external links
// THANKS: https://codepen.io/angel_crawford/pen/VwKrvEW
function getFavForExternalLinks() {
  /* You can replace this with your site's domain */
  var basedomain = location.hostname.split('.').slice(-2).join('.');
  var selectLinks = 'a[href^="//"]:not(figure a):not(a.website):not(span.card-footer-item a):not(nav.pagination a):not(.author-icons-wrapper a), a[href^="http"]:not(figure a):not(a.website):not(span.card-footer-item a):not(nav.pagination a):not(.author-icons-wrapper a):not(.card.is-small-count a):not(.card.is-small a)';
  // console.log(basedomain);

	/* Select all external links */
	$(selectLinks).not( '[href*="' + basedomain + '"]' ).each(function() {

    /* Add the favicon as a background gradient */
		$(this).css({
			'background': 'url(https://www.google.com/s2/favicons?domain=' + this.href + ') left center no-repeat',
			'padding-left': '21px',
			'background-size': '16px 16px'
		});

	});
};