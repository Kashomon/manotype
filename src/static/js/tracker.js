
/**
 * The trackre constructor.  Note: We assume only one instance of the tracker at
 * a time.
 */
manotype.tracker = function(elemId, text) {
  this.elemId = elemId;

  // Arrays of text -- allow for easy manipulation
  this.baseText = text.trim();

  this.position = 0;
  this.mistakes = 0;
  this.correctChars = 0;
  this.started = false;
  this.startTime = null;
  this.initializedKeyHandler = false;
};


manotype.tracker.prototype = {
  render: function() {
    this.lazyInitKeyHandler();
    var text = this.applySpans(this.baseText);
    $('#' + this.elemId).html(text);
    this.updateStats();
  },

  /** Turn the text into a list of spans. */
  applySpans: function(inText) {
    var out = [];
    var postProcessFn = null;
    for (var i = 0; i < inText.length; i++) {
      var activeClass = null;
      if (i === 0) { activeClass = 'active-char'; }

      var char = inText.charAt(i);
      if (char === '\n') {
        var char = '¶<br>';
      } else if (char === '<') {
        char = '&lt;'
      } else if (char === '>') {
        char = '&gt;'
      }
      var text = '<span class="base-char-class';
      if (activeClass) {
        text += ' ' + activeClass;
      }
      text += '">' + char + '</span>';
      out.push(text);
    }
    return out.join('');
  },

  lazyInitKeyHandler: function() {
    if (!this.initializedKeyHandler) {
      $('body').on('keypress', function(event) {
        this.processKey(event.keyCode);
      }.bind(this));
      $('body').on('keydown', function(event) {
        var keyCode = event.keyCode;
        if (keyCode === 8) { // backspace
          event.preventDefault();
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
    $('#WPMStats').text(roundedWpm);
    $('#ErrorsStats').text(this.mistakes);
    $('#CorrectStats').text(this.correctChars);

    var minutes = Math.floor(deltaSeconds / 60);
    var secs = Math.round(deltaSeconds % 60)
    $('#TimeStats').text(minutes + ':'
        + (secs < 10 ? '0' : '')
        + secs);
  },

  processKey: function(keyCode) {
    var keyName = manotype.reverseMap[keyCode];
    if (keyName === undefined) {
      return;
    }
    if (this.started === false) {
      this.started = true;
      this.startTime = new Date();
      // setTimeout(this.updateStats.bind(this))
    }
    var curChar = this.baseText[this.position];
    if (this.position < this.baseText.length &&
        keyName !== 'BACKSPACE') {
      this.position++
      this.correctChars++;
      this.nextPos(keyName === curChar);
    } else if (keyName === 'BACKSPACE' && this.position > 0) {
      this.position--;
      this.prevPos();
    } else {
      this.mistakes++;
    }
  },

  nextPos: function(wasCorrectChar) {
    var current = $('.active-char');
    var next = current.next();
    next.addClass('active-char');
    current.removeClass('active-char');
    current.removeClass('base-char-class');
    if (wasCorrectChar) {
      current.addClass('seen-correct-char');
    } else {
      current.addClass('seen-incorrect-char');
    }
  },

  prevPos : function() {
    var current = $('.active-char');
    var prev = current.prev();
    prev.removeClass('seen-incorrect-char');
    prev.removeClass('seen-correct-char');
    prev.addClass('active-char');
    prev.addClass('base-char-class');

    current.removeClass('active-char');
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
