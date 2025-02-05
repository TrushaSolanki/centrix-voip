//  ex: createCookie('cookieName','testcookieValue',7)(expire after 7 days)
function createCookie(name: string, value: string, days: number) {
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    //    convet like this formate--> Fri, 27 Jul 2001 02:47:11 UTC
    var expires = "; expires=" + date.toUTCString();
  } else var expires = "";
  if (typeof window !== "undefined") {
    document.cookie = name + "=" + value + expires + "; path=/";
  }
}

function readCookie(name: string) {
  var nameEQ = name + "=";
  if (typeof window !== "undefined") {
    var ca = document.cookie.split(";");
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }
  return null;
}

function removeCookie(name: string) {
  createCookie(name, "", -1);
}

export { readCookie, createCookie, removeCookie };
