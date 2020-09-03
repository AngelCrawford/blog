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

  // ***************** Logo Animation and Header
  
  if (!$("span.shimmer").hasClass("shimmer-animation")) {
    setTimeout(function(){
      // $("span.shimmer").toggleClass("shimmer-animation");
      $("span.shimmer").addClass("shimmer-animation").delay(900).queue(function(next){
        $("span.shimmer").removeClass("shimmer-animation");
          next();
      });
    },1900);
  }

  $("span.shimmer").mouseenter(function() {
    $("span.shimmer").addClass("shimmer-animation").delay(900).queue(function(next){
      $("span.shimmer").removeClass("shimmer-animation");
        next();
    }); 
  });

  dayNightSky();

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
      input.classList.add(invalidClassName);

      $('#' + input.id).parent().next('.help.is-danger').css('display', 'block');
      $('#' + input.id).parent().children('.icon.is-right.is-danger').css('display', 'inline-flex');
      $('#' + input.id).parent().addClass('is-danger');
    })

    // Remove the class when the input becomes valid.
    // 'input' will fire each time the user types
    input.addEventListener('input', function () {
      if (input.validity.valid) {
        input.classList.remove(invalidClassName);
        
        $('#' + input.id).parent().next('.help.is-danger').css('display', 'none');
        $('#' + input.id).parent().children('.icon.is-right.is-danger').css('display', 'none');
        $('#' + input.id).parent().removeClass('is-danger');
      }
    })
  });

  $('#comment-form').submit(function() {
      $('#comment-send').addClass("is-loading");
      $('#comment-name').addClass('is-disabled');
      $('#comment-email').addClass('is-disabled');
      $('#comment-website').addClass('is-disabled');
      $('#comment-message').addClass('is-disabled');
      $('.b-checkbox').addClass('is-disabled');      
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

// ***************** Sky Background Function
// THANKS: https://codepen.io/ellimccale/pen/wxzJMx
var dayNightSky = function() {
  // Get the current hour; JS runs on the 24-hour clock
  var hour = new Date().getHours();
  var $sky = $("header.sky");

  var timeBlocks = [
    // TEST BLOCK
    // { start: 0, end: 24, class: "night" },
    { start: 23, end: 24, class: "night" },
    { start: 0, end: 6, class: "night" },
    { start: 7, end: 10, class: "dawn" },
    { start: 11, end: 17, class: "day" },
    { start: 18, end: 22, class: "dusk" }
  ]

  // Start by looping through the objects in the timeBlocks array
  for ( var i = 0; i < timeBlocks.length; i++ ) {
    // Select the current timeBlock
    var timeOfDay = timeBlocks[i];
    // Check if the current hour is within each timeBlock
    if ( timeOfDay.start <= hour && hour <= timeOfDay.end ) {
      // If it is, add the relevant class to #sky
      $sky.addClass(timeOfDay.class);
    }
  }

  if ( $("header.sky").hasClass("night") ) {
    $(".sky-stars-wrapper").css("display", "block");
  } else {
    $(".sky-stars-wrapper").css("display", "none");
  }
}