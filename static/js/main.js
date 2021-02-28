/**
 * My dirty js code. Ideally eventually wont use jquery.
 */

var articleStart;
function loadDOMHandler() {
  //articleStart = ($('#hero').height() + $('#nav').height());
  articleStart = ($('#header').height() + 100);

  // Checks for the theme stored in the browser
  const currentTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') : null;
  if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);
  }
}



document.addEventListener("DOMContentLoaded", loadDOMHandler);

/* When the user scrolls down, hide the navbar. When the user scrolls up, show the navbar 
    source https://www.w3schools.com/howto/howto_js_navbar_hide_scroll.asp
*/


var prevScrollpos = window.pageYOffset;
window.onscroll = throttle(100, function () {
  var currentScrollPos = window.pageYOffset;
  if (prevScrollpos > currentScrollPos) {
    document.getElementById("header").style.top = "0";
  } else {
    document.getElementById("header").style.top = "-200px";
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

// Only run on index.html
/*if (window.location.pathname === '/') {*/
$(window).scroll(
  throttle(50,
    function () {
    // let height = ($('#hero').height() + $('#nav').height());
      if ($(window).scrollTop() >= articleStart) {
        $('header').addClass('header-shadow');
      }
      else {
        $('header').removeClass('header-shadow');
      }
}));










function themeSwitch() {
  let theme = document.documentElement.getAttribute('data-theme');
  if (theme == null || theme == 'light') {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark'); //add this
  }
  else if (theme == 'dark') {
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('theme', 'light'); //add this
  }
}



function navToogle() {
    let nav = document.getElementById("nav-expanded");
    if (nav.style.visibility != "visible") {
      document.body.classList.add("stop-scrolling"); 
      nav.style.visibility = "visible";
      nav.style.opacity = "1";
    }
    else {
      document.body.classList.remove("stop-scrolling"); 
      nav.style.visibility = "hidden";  
      nav.style.opacity = "0";
    }
  }

  


  