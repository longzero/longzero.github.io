function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  let expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

// CHECK PARAMETER IN URL
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

// CHECK IF THERE IS A COLOR SCHEME COOKIE TO SET THE RIGHT COLOR SCHEME
let colorScheme = getCookie("color_scheme");
if (colorScheme == "dark") document.body.classList.add('dark-mode')
else document.body.classList.remove('dark-mode')

// OVERRIDE COLOR SCHEME COOKIE IF URL HAS A PARAMETER dark=1
if (getParameterByName('dark') == 1) document.body.classList.add('dark-mode')

// TOGGLE FOR COLOR SCHEME
document.querySelector('.js-toggle-dark-light-mode')?.addEventListener('click', function() {
  document.body.classList.toggle('dark-mode')
  if (colorScheme == "dark") colorScheme = "light"
  else colorScheme = "dark"
  setCookie("color_scheme", colorScheme, 365);
})
