
/**
 * The trackre constructor.  Note: We assume only one instance of the tracker at
 * a time.
 */
omtype.tracker = function(elemId, text) {
  this.elemId = elemId;

  // Arrays of text -- allow for easy manipulation
  this.baseText = text.trim().split('');
  this.currentText = this.baseText.slice();

  this.position = 0;
  this.mistakes = 0;
  this.correctChars = 0;
  this.started = false;
  this.startTime = null;
  this.initializedKeyHandler = false;
};


omtype.tracker.prototype = {
  render: function() {
    this.lazyInitKeyHandler();

    this.applyCharHighlight();
    var joined = this.currentText.join('');
    var p = joined.replace(/\n/g, '<span class="faint-char">¶</span><p>');
    $('#' + this.elemId).html(p);
    this.updateStats();
  },

  lazyInitKeyHandler: function() {
    if (!this.initializedKeyHandler) {
      $('body').on('keypress', function(event) {
        this.processKey(event.keyCode);
      }.bind(this));
      $('body').on('keydown', function(event) {
        var keyCode = event.keyCode;
        if (keyCode === '8') { // backspace
          this.processKey(event.keyCode);
        }
      }.bind(this));
      this.initializedKeyHandler = true;
    }
  },

  updateStats: function() {
    if (!this.started) return;

    var startTime = this.startTime;
    var currentTime = new Date();
    var deltaSeconds = (currentTime.getTime() - startTime.getTime()) / 1000;
    var wpm = this.correctChars / 5 / (deltaSeconds / 60);
    var roundedWpm = Math.round(wpm * 100) / 100;
    $('#WPM').text(roundedWpm);
    $('#Errors').text(this.mistakes);
    $('#Correct').text(this.correctChars);
  },

  processKey: function(keyCode) {
    var keyName = omtype.reverseMap[keyCode];
    if (keyName === undefined) {
      return;
    }
    if (this.started === false) {
      this.started = true;
      this.startTime = new Date();
    }
    var curChar = this.baseText[this.position];
    if (keyName === curChar) {
      this.position++
      this.correctChars++;
      this.render();
    } else if (keyName === 'BACKSPACE' && this.position > 0) {
      this.position--;
      this.correctChars++;
      this.render();
    } else {
      this.mistakes++;
    }
  },

  applyCharHighlight: function() {
    var pos = this.position;
    if (pos > 0) {
      this.currentText[pos - 1] = this.baseText[pos - 1];
    }
    if (pos < this.baseText.length - 1) {
      this.currentText[pos + 1] = this.baseText[pos + 1];
    }
    var char = this.baseText[pos];
    var out = '<zed><span class="hl-char">'
        // + '<span class="out-of-line">_</span>'
        + char
        + '</span></zed>';
    this.currentText[pos] = out;
  }
};
