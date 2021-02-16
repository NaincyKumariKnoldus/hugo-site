/**
 * My dirty js code. Ideally eventually wont use jquery.
 */

var articleStart;
var navHide;
function loadDOMHandler() {
  //articleStart = ($('#hero').height() + $('#nav').height());
  articleStart = ($('#nav').height() + 100);

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

// Only run on index.html
/*if (window.location.pathname === '/') {*/
$(window).scroll(
  throttle(50,
    function () {
    // let height = ($('#hero').height() + $('#nav').height());
      if ($(window).scrollTop() >= articleStart) {
        $('nav').addClass('nav-shadow');
      }
      else {
        $('nav').removeClass('nav-shadow');
      }
}));



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
    localStorage.setItem('theme', 'dark'); //add this
  }
  else if (theme == 'dark') {
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('theme', 'light'); //add this
  }
}



function disableScroll() { 
  document.body.classList.add("stop-scrolling"); 
} 

function enableScroll() { 
  document.body.classList.remove("stop-scrolling"); 
} 

function navToogle() {
  let opacity = document.getElementById("nav-links-extend").style.opacity;
  console.log(document.getElementById("nav-links-extend").style.opacity)
  if (opacity != "1") {
    disableScroll();

    document.getElementById("nav-links-extend").style.opacity = "1";

    console.log(document.getElementById("nav-links-extend").style.opacity);
  }
  else {


    enableScroll(); 
    document.getElementById("nav-links-extend").style.opacity = "0";

    console.log(document.getElementById("nav-links-extend").style.opacity)


  }
}

