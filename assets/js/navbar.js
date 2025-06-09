// ***************** Navigation Scroll
function navScroll() {
    var theNavigation = $(".navbar");
    stuck = "is-fixed-top";
    theHeader = 300;
  
    if ($(window).scrollTop() > theHeader) {
      theNavigation.addClass(stuck);
    } else {
      theNavigation.removeClass(stuck);
    }
}
$(window).on('scroll',function() { 
    navScroll();
});


// ***************** Navigation
// Check for click events on the navbar burger icon
$(".button.toggle-sidebar").click(function() {
    $("aside.sidebar").toggleClass("is-opened");
});
