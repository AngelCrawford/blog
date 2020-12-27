// Bulma Navbar Header Toggle

$(document).ready(function() {


  // ***************** Navigation
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

  // Call every hour, or every page reload
  setInterval(dayNightSky(), 60*60*1000);
  

  // ***************** Sticky Navbar
  // $(window).scroll(function () {
  //   navScroll();
  // });

  // navScroll();

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
  
}); // Close $(document).ready(function()


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


// ***************** Navigation Scroll
function navScroll() {
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

  // $(".navbar-logo").css('display', 'flex');
}


// ***************** Comment ReplyTo Button function
// Added function to change value onclick
function changeValue(elementName, newValue) {
  document.getElementsByName(elementName)[0].value=newValue;
  window.location.hash = "#postcomment";
};


// ***************** Sky Background Function
// THANKS: https://codepen.io/ellimccale/pen/wxzJMx
function dayNightSky() {
  
  var $sky = $("header.sky");

  var location = {lat:"53.551086", long:"9.993682"};
  var now = new Date();
  var times = SunCalc.getTimes(now, location.lat, location.long);
  // console.log(SunCalc.getTimes(now, location.lat, location.long));

  var nightStart = [ times.night.getHours(), times.night.getMinutes() + 1 ];
  var nightEnd = [ times.nightEnd.getHours(), times.nightEnd.getMinutes() ];

  var dawnStart = [ times.nightEnd.getHours(), times.nightEnd.getMinutes() + 1 ];
  var dawnEnd = [ times.sunrise.getHours(), times.sunrise.getMinutes() ];

  var dayStart = [ times.sunrise.getHours(), times.sunrise.getMinutes() + 1 ];
  var dayEnd = [ times.sunset.getHours(), times.sunset.getMinutes() ];

  var duskStart = [ times.sunset.getHours(), times.sunset.getMinutes() + 1 ];
  var duskEnd = [ times.night.getHours(), times.night.getMinutes() ];

  var timeBlocks = [
    { start: nightStart, end: nightEnd, class: "night" },
    { start: dawnStart, end: dawnEnd, class: "dawn" },
    { start: dayStart, end: dayEnd, class: "day" },
    { start: duskStart, end: duskEnd, class: "dusk" }
  ]

  // Start by looping through the objects in the timeBlocks array
  for ( var i = 0; i < timeBlocks.length; i++ ) {
    // Select the current timeBlock
    var timeOfDay = timeBlocks[i];
    // console.log("Time of Day: ", timeOfDay);

    if ( isTimeBetween(timeOfDay.start, timeOfDay.end) ) {
      $sky.addClass(timeOfDay.class);
    }
  }

  if ( $("header.sky").hasClass("night") ) {
    $(".sky-stars-wrapper").css("display", "block");
  } else {
    $(".sky-stars-wrapper").css("display", "none");
  }
  
  if ( $("header.sky").hasClass("day") || $("header.sky").hasClass("dusk") ) {
    $("#hotairballoon").css("display", "block");
  } else {
    $("hotairballoon").css("display", "none");
  }

}


function isTimeBetween(startTimeAsArray, endTimeAsArray) {
  // THANKS: https://stackoverflow.com/a/25958232

  var startTime = startTimeAsArray;
  var endTime = endTimeAsArray;

  // We've got the two start times as an array of hours/minutes values.
  var dateObj = new Date(); 
  // var now = [0, 0]; // For testing purpose, set now time here
  var now = [dateObj.getHours(), dateObj.getMinutes()]; // Gets the current Hours/Minutes

  // If startTime is bigger than endTime
  if ( endTime[0] < startTime[0] && now[0] < startTime[0] ) {
    startTime[0] -= 24; // This is something I came up with because I do a lot of math.
  } else if ( startTime[0] > endTime[0] ) {
    endTime[0] += 24;
  }

  // the time strings converted to a string format. Made comparisons easier.
  var startString = to_hm_string(startTime);
  var endString = to_hm_string(endTime);
  var nowString = to_hm_string(now);

  // console.log("Now:", nowString, "Start:", startString, "End:", endString);

  var status = (startString <= nowString && nowString <= endString) ? true : false;
  // console.log(status);
  return status;
}

// Numbers to String, if startTime bigger than endTime, set startTime to minus
// startTime(18:18) endTime(06:26) = startTime(-06:18) endTime(06:26)
function to_hm_string(timearr){ 
  var hours = "";
  var minutes = timearr[1];

  if ( Math.abs(timearr[0]) < 10 ) {
    hours = "0";
  }
  hours = ( timearr[0] < 0 ) ? "-" + hours + Math.abs(timearr[0]) : hours + timearr[0];
  minutes = (minutes < 10 ? '0' : '') + minutes;

  // console.log(hours + ":" + minutes);
  return hours + ":" + minutes;
}