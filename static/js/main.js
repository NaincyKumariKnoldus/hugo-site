var articleStart;
var navHide;
function loadDefParameters() {
  //articleStart = ($('#hero').height() + $('#nav').height());
  articleStart = ($('#nav').height() + 100);
}

document.addEventListener("DOMContentLoaded", loadDefParameters);

/* When the user scrolls down, hide the navbar. When the user scrolls up, show the navbar 
    source https://www.w3schools.com/howto/howto_js_navbar_hide_scroll.asp
*/
var prevScrollpos = window.pageYOffset;
window.onscroll = throttle(100, function () {
  var currentScrollPos = window.pageYOffset;
  if (prevScrollpos > currentScrollPos) {
    document.getElementById("nav").style.top = "0";
  } else {
    document.getElementById("nav").style.top = "-200px";
  }
  prevScrollpos = currentScrollPos;
});

/* Add shadow 
https://stackoverflow.com/questions/40967682/navbar-changing-to-add-shadow-on-scroll
*/

function throttle(limit, callback) {
  var waiting = false;                      // Initially, we're not waiting
  return function () {                      // We return a throttled function
    if (!waiting) {                       // If we're not waiting
      callback.apply(this, arguments);  // Execute users function
      waiting = true;                   // Prevent future invocations
      setTimeout(function () {          // After a period of time
        waiting = false;              // And allow future invocations
      }, limit);
    }
  }
}


$(window).scroll(
  throttle(50,
    function () {
     // let height = ($('#hero').height() + $('#nav').height());
      
      if ($(window).scrollTop() >= articleStart) {
        $('nav').addClass('shadow-strong');
      }
      else {
        $('nav').removeClass('shadow-strong');
      }
}));

// Hide scrollbar on fullscreen (if supported)
/* 
$(window).resize(function() {
    if((window.fullScreen) || (window.innerWidth == screen.width && window.innerHeight == screen.height)) {
        $("html").addClass("inv-scrollbar");
    } else {
        $("html").removeClass("inv-scrollbar");
    }
});*/


// Scroll down when clicking the arrow in index.html
// TODO: Replace this with plain js
function indexScrollDown() {
 
  $('html, body').animate({
    scrollTop: $("#article").offset().top - 20
  }, 1000);
}

function themeSwitch() {
  let theme = document.documentElement.getAttribute('data-theme');
  if (theme == null || theme == 'light') {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
  else if (theme == 'dark') {
    document.documentElement.setAttribute('data-theme', 'light');
  }
}

