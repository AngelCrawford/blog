// Bulma Navbar Header Toggle

$(document).ready(function() {

  // Check for click events on the navbar burger icon
  $(".navbar-burger").click(function() {

      // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
      $(".navbar-burger").toggleClass("is-active");
      $(".navbar-menu").toggleClass("is-active");

  });

 
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

});
