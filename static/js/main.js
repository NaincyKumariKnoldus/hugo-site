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
    let nav = document.getElementById("nav");

    if (nav.style.opacity != "1") {
        document.body.classList.add("stop-scrolling"); 
      nav.style.opacity = "1";
    }
    else {
      document.body.classList.remove("stop-scrolling"); 
      nav.style.opacity = "0";  
    }
  }

  