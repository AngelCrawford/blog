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
  

// // ***************** Comment ReplyTo Button function
// // Added function to change value onclick
// function changeValue(elementName, newValue) {
//   document.getElementsByName(elementName)[0].value=newValue;
//   window.location.hash = "#postcomment";
// };


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
//       + val.title + "'><svg class='remix-small comments'><use xlink:href='/fonts/remixicon/remixicon.symbol.svg?t={{ .Site.Params.remixicon_version}}#question-answer-line'></use></svg>"
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