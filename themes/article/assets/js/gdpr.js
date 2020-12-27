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


// ***************** Load Gravatar Images, if cookie is true, else load internal avatar
function setGravatars(email, defaultImage) {
  if (getCookie('cookies-consent') == 'false' || !getCookie('cookies-consent') ) {
    document.write('<img class="is-rounded" src="/images/avatar.png">');
  } else {
    //src="https://secure.gravatar.com/avatar/{{ .email }}?s=120&r=pg&d={{ $.Site.Params.staticman.gravatarDefault }}">
    document.write('<img class="is-rounded" src="https://secure.gravatar.com/avatar/' + email + '?s=120&r=pg&d=' + defaultImage + '">');
  }
}


// ***************** Add Favicons to external links
// THANKS: https://codepen.io/angel_crawford/pen/VwKrvEW
function getFavForExternalLinks() {
  /* You can replace this with your site's domain */
  var basedomain = location.hostname.split('.').slice(-2).join('.');
  var selectLinks = 'a[href^="//"]:not(figure a):not(a.website):not(span.card-footer-item a), a[href^="http"]:not(figure a):not(a.website):not(span.card-footer-item a)';
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