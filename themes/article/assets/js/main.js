// Bulma Navbar Header Toggle

$(document).ready(function() {

  // Check for click events on the navbar burger icon
  $(".navbar-burger").click(function() {

      // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
      $(".navbar-burger").toggleClass("is-active");
      $(".navbar-menu").toggleClass("is-active");

  });

  // ***************** Back to Top Button
  // Funktion für das Scroll-Verhalten
  $(window).scroll(function () {
    if ($(this).scrollTop() > 100) { // Wenn 100 Pixel gescrolled wurde
      $('.back-to-top').fadeIn();
    } else {
      $('.back-to-top').fadeOut();
    }
  });

  $('.back-to-top').click(function () { // Klick auf den Button
    $('html').animate({
      scrollTop: 0
    }, 800);
    return false;
  });

  // ***************** Logo Animation
  setTimeout(function(){
    $(".shimmer").css("animation-play-state", "paused");
  },2000);

  window.setInterval(function(){
    if ($(".shimmer").css("animation-play-state", "paused")) {
      $(".shimmer").css("animation-play-state", "running");
      setTimeout(function(){
        $(".shimmer").css("animation-play-state", "paused");
      },2000);
    } 
  }, 20000);
  
  $(".shimmer").hover(function() {
    $(".shimmer").css("animation-play-state", "running");    
    setTimeout(function(){
      $(".shimmer").css("animation-play-state", "paused");
    },2000);
  });


  // ***************** Sticky Navbar
  $(window).scroll(function () {
    navScroll();
  });

  navScroll();

  // ***************** Comments
  var invalidClassName = 'is-danger'
  var inputs = document.querySelectorAll('input, select, textarea')
  inputs.forEach(function (input) {
    // Add a css class on submit when the input is invalid.
    input.addEventListener('invalid', function () {
      if ( $('input[type="checkbox"]') ) {
        $('.b-checkbox').addClass('is-danger');
      }
      input.classList.add(invalidClassName);
      $('.help.is-danger').css('display', 'block');
      $('.icon.is-danger').css('display', 'inline-flex');
    })

    // Remove the class when the input becomes valid.
    // 'input' will fire each time the user types
    input.addEventListener('input', function () {
      if (input.validity.valid) {  
        if ( $('input[type="checkbox"]') ) {
          $('.b-checkbox').removeClass('is-danger');
        }
        input.classList.remove(invalidClassName);
        $('.help.is-danger').css('display', 'none');
        $('.icon.is-danger').css('display', 'none');
      }
    })
  });

  $('#comment-form').submit(function() {
      $('#comment-send').addClass("is-loading");
      $('#comment-name').addClass('is-disabled');
      $('#comment-email').addClass('is-disabled');
      $('#comment-website').addClass('is-disabled');
      $('#comment-message').addClass('is-disabled');
  });

  if (window.location.hash == "#comment-submitted") {
    $('#comment-submitted').css('display', 'block');
  }
  if (window.location.hash == "#comment-error") {
    $('#comment-error').css('display', 'block');
  }

  $('#comment-submitted button.delete').click(function () {
    $('#comment-submitted').css('display', 'none');
    window.location.hash = "#postcomment";
  });

  $('#comment-error button.delete').click(function () {
    $('#comment-error').css('display', 'none');
    window.location.hash = "#postcomment";
  });
  
});

var navScroll = function () {
  var theNavigation = $(".navbar");
  stuck = "is-fixed-top";
  theHeader = $('.header').height() - 56;

  if ($(this).scrollTop() > theHeader) {
    theNavigation.addClass(stuck);
    $(".navbar-logo").css('display', 'flex');
  } else {
    theNavigation.removeClass(stuck);
    $(".navbar-logo").css('display', 'none');
  }
}

// ***************** Comment ReplyTo Button function
// Added function to change value onclick
var changeValue = function (elementName, newValue) {
  document.getElementsByName(elementName)[0].value=newValue;
  window.location.hash = "#postcomment";
};