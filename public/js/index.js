(function() {
  var input = document.getElementById('input');
  input.focus();
  input.onblur = function() {
    this.focus();
  };
  input.onkeyup = function(e) {
    e.which = e.which || e.keyCode;
    if (e.which === 13) submit();
  };

  function submit() {
    input.className += " hide";
    input.onblur = function () {};
    getText(input.value, function(err, res) {
      var fetch = JSON.parse(res);
      var el = document.querySelector('#blink');
      if (fetch.text.length === 0) el.innerHTML('Error parsing text');
      blinkify(fetch.text, el);
    });
  }

  function blinkify(text, el) {
    this.el = el;
    this.wpm = 500; // TODO: change later
    this.msPerWord = 60000 / this.wpm;
    this.current = 0;
    this.running = false;
    this.timers = [];

    // Preprocess.
    var words = text.trim().split(/\s+/);
    var tempWords = words.slice(0);
    var t = 0;
    var prePunc = [',', ':', '-', '('];
    var postPunc = ['.', '!', '?', ':', ';', ')'];
    for (var i = 0; i < words.length; i++) {
      for (var j = 0; j < prePunc.length; j++) {
        if (~words[i].indexOf(prePunc[j])) {
          tempWords.splice(t+1, 0, words[i]);
          tempWords.splice(t+1, 0, words[i]);
          t++;
          t++;
        }
      }
      for (var k = 0; k < postPunc.length; k++) {
        if (~words[i].indexOf(postPunc[k])) {
          tempWords.splice(t+1, 0, words[i]);
          tempWords.splice(t+1, 0, words[i]);
          tempWords.splice(t+1, 0, words[i]);
          t++;
          t++;
          t++;
        }
      }
      t++;
    }
    this.words = tempWords.slice(0);

    /**
     * Start blinking.
     */

    this.start = function() {
      this.running = true;
      this.timers.push(setInterval(function() {
        this._show(this.current);
        this.current++;
        if(this.current >= this.words.length) {
          this.current = 0;
          this.stop();
        }
      }.bind(this), this.msPerWord));
    };

    /**
     * Stop blinking.
     */

    this.stop = function() {
      for(var i = 0; i < this.timers.length; i++)
        clearTimeout(this.timers[i]);
      this.running = false;
    };

    /**
     * Show the word in HTML with pivot colored.
     *
     * @param {Number} i
     */

    this._show = function(i) {
      var p = _getPivot(this.words[i]);
      var html = '<span class="left"><span class="pre-pivot">' + this.words[i].substr(0, p - 1) + '</span></span>';
      html += '<span class="right"><span class="pivot">' + this.words[i].substr(p - 1, 1) + '</span>';
      html += '<span class="post-pivot">' + this.words[i].substr(p, this.words[i].length - p) + '</span></span>';
      (this.el).innerHTML = html;
    };

    /**
     * Return the index of the 'pivot' character.
     *
     * @param {String} word
     *
     * @return {Number}
     */

    this._getPivot = function(word) {
      var i = 5;
      switch (word.length) {
        case 1:
          i = 1; // first
          break;
        case 2:
        case 3:
        case 4:
        case 5:
          i = 2; // second
          break;
        case 6:
        case 7:
        case 8:
        case 9:
          i = 3; // third
          break;
        case 10:
        case 11:
        case 12:
        case 13:
          i = 4; // fourth
          break;
        default:
          i = 5; // fifth
      };
      return i;
    };

    this.start();
  }

  /**
   * Function to get text from a URL.
   *
   * @param {String} url.
   */

  function getText(url, cb) {
    var fetchtext = 'https://fetchtext-api.herokuapp.com/fetch/?url=' + url;
    get(fetchtext, function(err, res) {
      if (err) cb(err, null);
      cb(null, res);
    });
  }

  /**
   * Helper function to send GET request.
   *
   * @param {String} url
   * @param {Function} cb
   */

  function get(url, cb) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
        cb(null, xmlhttp.responseText);
    }
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
  }

})();
