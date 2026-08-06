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


// // ***************** Sky Background Function
// // THANKS: Sky Background - https://codepen.io/ellimccale/pen/wxzJMx
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