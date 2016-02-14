(function() {
var memoizeDrawText = function(textFn){

  var memo = {};

  var getHeight = function(font) {
    var pxPosition = font.indexOf('px');
    return parseInt(font.substring(0, pxPosition));
  }

  var getContextState = function(context) {
    // This state attributes list was taken from 
    // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/save#Drawing_state
    // So far, I don't know how to copy transformation matrix, clipping
    // region or dash list. Maybe I would deep-copy a context into other.
    var stateAttributes = ["strokeStyle", "fillStyle", "globalAlpha", "lineWidth", "lineCap", "lineJoin", "miterLimit", "lineDashOffset", "shadowOffsetX", "shadowOffsetY", "shadowBlur", "shadowColor", "globalCompositeOperation", "font", "textAlign", "textBaseline", "direction", "imageSmoothingEnabled"
      ];
    var stateSignature = '';
    for (attribute of stateAttributes) {
      stateSignature += context[attribute];
    }
    return stateSignature;
  }

  var memoized = function(text, x, y) {
    var state = getContextState(this);
    var fontHeight = getHeight(this.font);

    if (!(state in memo)) {
      memo[state];
    }
    if (!(text in memo[state])) {
      var canvas = document.createElement('canvas');
      canvas.width = this.measureText(text).width;
      canvas.height = getHeight(fontHeight);
      
      var ctx = canvas.getContext('2d');

      textFn.call(ctx, text, 0, canvas.height - 1);
      memo[state][text] = canvas;
    }
    
    this.drawImage(memo[state][text], x, y - getHeight(fontHeight));
  }

  return memoized;
}

  var strokeText = CanvasRenderingContext2D.prototype.strokeText;
  var fillText = CanvasRenderingContext2D.prototype.fillText;

  CanvasRenderingContext2D.prototype.strokeText = memoizeDrawText(strokeText);
  CanvasRenderingContext2D.prototype.fillText = memoizeDrawText(fillText);
})();
