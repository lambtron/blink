'use strict';

(function() {

  getText('http://www.google.com');

  /**
   * Function to get text from a URL.
   *
   * @param {String} url.
   */

  function getText(url) {
    var fetchtext = 'https://fetchtext-api.herokuapp.com/fetch/?url=' + url;
    getURL(fetchtext, function(err, res) {
      console.log(res);
    });
  }

  /**
   * Helper function to send GET request.
   *
   * @param {String} url
   * @param {Function} cb
   */

  function getURL(url, cb) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
        cb(null, xmlhttp.responseText);
      else
        cb(xmlhttp.status, null);
    }
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
  }

})();
