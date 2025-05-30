
// ***************** Navigation
// Check for click events on the navbar burger icon
$(".button.toggle-sidebar").click(function() {
  $("aside.sidebar").toggleClass("is-opened");
});


$("ul.menu-list li.toggle-parent").click(function () { 
  $(this).children('ul.toggle-parent-sublist').toggleClass("is-open");
  $(this).toggleClass("sub-is-open");  
});

if ( $('ul.menu-list li.toggle-parent a.is-active') ) {
  $('ul.menu-list li.toggle-parent a.is-active ~ ul.toggle-parent-sublist').addClass("is-open");
  $('ul.menu-list li.toggle-parent a.is-active').parent().addClass("sub-is-open");
}


// if ($(window).width() <= 1023) {
//   $(".navbar-item.has-dropdown a.navbar-link").removeAttr("href");
//   $('.navbar-item.has-dropdown .navbar-dropdown').css("display", "none");
// }

// ***************** Back to Top Button
// Funktion für das Scroll-Verhalten
$(window).scroll(function () {
  if ($(this).scrollTop() > 100) { // Wenn 100 Pixel gescrolled wurde
    $('#back-to-top').fadeIn();
  } else {
    $('#back-to-top').fadeOut();
  }
});

$('#back-to-top').click(function () { // Klick auf den Button
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


// // ***************** Sticky Navbar
// // $(window).scroll(function () {
// //   navScroll();
// // });

// // navScroll();


// // ***************** Spoiler
// $('.spoiler').click(function () {
//   $(this).toggleClass('visible');
// });

// // ***************** Comments
// var invalidClassName = 'is-danger'
// var inputs = document.querySelectorAll('input, select, textarea')
// inputs.forEach(function (input) {
//   // Add a css class on submit when the input is invalid.
//   input.addEventListener('invalid', function () {
//     input.classList.add(invalidClassName);

//     $('#' + input.id).parent().next('.help.is-danger').css('display', 'block');
//     $('#' + input.id).parent().children('.icon.is-right.is-danger').css('display', 'inline-flex');
//     $('#' + input.id).parent().addClass('is-danger');
//   })

//   // Remove the class when the input becomes valid.
//   // 'input' will fire each time the user types
//   input.addEventListener('input', function () {
//     if (input.validity.valid) {
//       input.classList.remove(invalidClassName);
      
//       $('#' + input.id).parent().next('.help.is-danger').css('display', 'none');
//       $('#' + input.id).parent().children('.icon.is-right.is-danger').css('display', 'none');
//       $('#' + input.id).parent().removeClass('is-danger');
//     }
//   })
// });

// $('#comment-form').submit(function() {
//     $('#comment-send').addClass("is-loading");
//     $('#comment-name').addClass('is-disabled');
//     $('#comment-email').addClass('is-disabled');
//     $('#comment-website').addClass('is-disabled');
//     $('#comment-message').addClass('is-disabled');
//     $('.b-checkbox').addClass('is-disabled');      
// });

// if (window.location.hash == "#comment-submitted") {
//   $('#comment-submitted').css('display', 'block');
// }
// if (window.location.hash == "#comment-error") {
//   $('#comment-error').css('display', 'block');
// }

// $('#comment-submitted button.delete').click(function () {
//   $('#comment-submitted').css('display', 'none');
//   window.location.hash = "#postcomment";
// });

// $('#comment-error button.delete').click(function () {
//   $('#comment-error').css('display', 'none');
//   window.location.hash = "#postcomment";
// });
  

// // ***************** Navigation Scroll
// function navScroll() {
//   var theNavigation = $(".navbar");
//   stuck = "is-fixed-top";
//   theHeader = $('.header').height() - 56;

//   if ($(this).scrollTop() > theHeader) {
//     theNavigation.addClass(stuck);
//     $(".navbar-logo").css('display', 'flex');
//   } else {
//     theNavigation.removeClass(stuck);
//     $(".navbar-logo").css('display', 'none');
//   }

//   // $(".navbar-logo").css('display', 'flex');
// }


// // ***************** Comment ReplyTo Button function
// // Added function to change value onclick
// function changeValue(elementName, newValue) {
//   document.getElementsByName(elementName)[0].value=newValue;
//   window.location.hash = "#postcomment";
// };


// // ***************** Sky Background Function
// // THANKS: https://codepen.io/ellimccale/pen/wxzJMx
function dayNightSky() {
  
  var $sky = $("header.hero.has-sky");

  var sunset = SunriseSunsetJS.getSunset(53.551086, -2.5920);
  var sunrise = SunriseSunsetJS.getSunrise(53.551086, -2.5920);
  // console.log("Sunrise: ", sunrise);
  // console.log("Sunset: ", sunset);
  
  var nightStart = new Date(sunset.getTime() + (60 * 60 * 1000));
  var nightEnd = new Date(sunrise.getTime() - (60 * 60 * 1000));
  var nightStartTime = [nightStart.getHours(), nightStart.getMinutes()];
  var nightEndTime = [nightEnd.getHours(), nightEnd.getMinutes()];

  // Dawn is the period when the sky lightens before the sun rises
  var dawnStart = new Date(sunrise.getTime() - (59 * 60 * 1000));
  var dawnEnd = new Date(sunrise.getTime() + (59 * 60 * 1000));
  var dawnStartTime = [dawnStart.getHours(), dawnStart.getMinutes()];
  var dawnEndTime = [dawnEnd.getHours(), dawnEnd.getMinutes()];

  var dayStart = new Date(sunrise.getTime() + (60 * 60 * 1000));
  var dayEnd = new Date(sunset.getTime() - (60 * 60 * 1000));
  var dayStartTime = [dayStart.getHours(), dayStart.getMinutes()];
  var dayEndTime = [dayEnd.getHours(), dayEnd.getMinutes()];

  // Dusk is the period when the sky darkens after the sun sets
  var duskStart = new Date(sunset.getTime() - (59 * 60 * 1000));
  var duskEnd = new Date(sunset.getTime() + (59 * 60 * 1000));
  var duskStartTime = [duskStart.getHours(), duskStart.getMinutes()];
  var duskEndTime = [duskEnd.getHours(), duskEnd.getMinutes()];


  var timeBlocks = [
    { start: nightStartTime, end: nightEndTime, class: "is-night" },
    { start: dawnStartTime, end: dawnEndTime, class: "is-dawn" },
    { start: dayStartTime, end: dayEndTime, class: "is-day" },
    { start: duskStartTime, end: duskEndTime, class: "is-dusk" }
  ]

  // Start by looping through the objects in the timeBlocks array
  for ( var i = 0; i < timeBlocks.length; i++ ) {
    // Select the current timeBlock
    var timeOfDay = timeBlocks[i];
    // console.log("Time of Day: ", timeOfDay);

    // console.log(timeOfDay.start);
    // console.log(timeOfDay.end);

    if ( isTimeBetween(timeOfDay.start, timeOfDay.end) ) {
      $sky.addClass(timeOfDay.class);
      // console.log("Time of Day: ", timeOfDay);
    }
  }

  if ( $sky.hasClass("is-night") || $sky.hasClass("is-dusk") ) {
    $("#stars").css("display", "block");
  } else {
    $("#stars").css("display", "none");
  }
  
  if ( $sky.hasClass("is-day") || $sky.hasClass("is-dusk") ) {
    $("#hotairballoon").css("display", "block");
  } else {
    $("#hotairballoon").css("display", "none");
  }

  var dateObject = new Date();
  var month = dateObject.getMonth() + 1;
  var day = dateObject.getDate();
  var nowDate = dateObject.getFullYear() + "-" + (month < 10 ? '0' : '') + month + "-" + (day < 10 ? '0' : '') + day;

  var xmasStart = dateObject.getFullYear() + "-12-01";
  var xmasEnd = dateObject.getFullYear() + "-12-27";
  if (nowDate >= xmasStart && nowDate <= xmasEnd) {
    $("#santahat").css("display", "block");
  } else {
    $("#santahat").css("display", "none");
  }

  var halloweenStart = dateObject.getFullYear() + "-10-07";
  var halloweenEnd = dateObject.getFullYear() + "-10-31";
  if (nowDate >= halloweenStart && nowDate <= halloweenEnd) {
    $("#ghosty").css("display", "block");
  } else {
    $("#ghosty").css("display", "none");
  }

}

// // ***************** Widget Most Loved
// $.getJSON("/index.json", function( data ) {
//   var items = [];
//   var counter = 0;

//   data.sort(compare);

//   $.each(data, function(key, val) {
    
//     if (counter == 5) {
//       return false
//     }

//     if (val.commentsCount == 0) {
//       return false
//     }

//     items.push("<li><span class='variable'><a href='" + val.permalink + "#comments' alt='" + val.title + "' title='" 
//       + val.title + "'><svg class='remix-small comments'><use xlink:href='/fonts/remixicon/remixicon.symbol.svg#question-answer-line'></use></svg>"
//       + val.commentsCount + "</a></span><span class='variable-number'><a href='" + val.permalink + "' alt='" 
//       + val.title + "' title='" + val.title + "'>" + val.title + "</a></span></li>" );

//     counter++;
//   });

//   $("<ul/>", {
//     html: items.join("")
//   }).appendTo( ".widget.mostloved.box" );
// });


function compare(a, b) {
  if (a.commentsCount < b.commentsCount)
    return 1;
  if (a.commentsCount > b.commentsCount)
    return -1;
  return 0;
}

function isTimeBetween(startTimeAsArray, endTimeAsArray) {
  var startTime = startTimeAsArray;
  var endTime = endTimeAsArray;
  
  var dateObj = new Date(); 
  var now = [dateObj.getHours(), dateObj.getMinutes()];
  
  function to_minutes(time_array) {
    return time_array[0] * 60 + time_array[1];
  }
  
  var start_minutes = to_minutes(startTime);
  var end_minutes = to_minutes(endTime);
  var now_minutes = to_minutes(now);
  
  // Handle times that cross midnight
  if (end_minutes < start_minutes) {
    // If now is after start OR now is before end, it's between
    return now_minutes >= start_minutes || now_minutes <= end_minutes;
  } else {
    // Normal case: check if now is between start and end
    return now_minutes >= start_minutes && now_minutes <= end_minutes;
  }
}