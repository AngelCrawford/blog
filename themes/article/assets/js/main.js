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

  if (window.location.hash == "#comment-submitted") {
    $('.modal#comment-submitted').addClass("is-active");
  }
  if (window.location.hash == "#comment-error") {
    $('.modal#comment-error').addClass("is-active");
  }
  
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
  window.location.hash = "#comment-form";
};