// ***************** Back to Top Button
// Funktion für das Scroll-Verhalten
$(window).scroll(function () {
  if ($(this).scrollTop() > 800) { // Wenn x Pixel gescrolled wurde
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

// Handle visited articles
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


// ***************** Footer Reveal Effect
// Function to adjust body padding based on footer height
function adjustBodyPadding() {
  const footerHeight = $('footer.footer').outerHeight();
  $('body main.content.section').css('margin-bottom', footerHeight + 'px');
}

// Run on page load
$(document).ready(function() {
  adjustBodyPadding();
  
  // Also run when window is resized to handle responsive changes
  $(window).on('resize', function() {
    adjustBodyPadding();
  });
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