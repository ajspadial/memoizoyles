(function() {
var memoizeDrawText = function(textFn){

  var memo = {};

  var getHeight = function(font) {
    var pxPosition = font.indexOf('px');
    return parseInt(font.substring(0, pxPosition));
  }

  var memoized = function(text, x, y) {
    var font = this.font;
    if (!(font in memo)) {
      memo[font] = {};
    }
    if (!(text in memo[font])) {
      var canvas = document.createElement('canvas');
      canvas.width = this.measureText(text).width;
      canvas.height = getHeight(font);
      
      var ctx = canvas.getContext('2d');
      // This state attributes list was taken from 
      // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/save#Drawing_state
      // So far, I don't know how to copy transformation matrix, clipping
      // region or dash list. Maybe I would deep-copy a context into other.
      var stateAttributes = ["strokeStyle", "fillStyle", "globalAlpha", "lineWidth", "lineCap", "lineJoin", "miterLimit", "lineDashOffset", "shadowOffsetX", "shadowOffsetY", "shadowBlur", "shadowColor", "globalCompositeOperation", "font", "textAlign", "textBaseline", "direction", "imageSmoothingEnabled"
      ];
      for (attribute of stateAttributes) {
        ctx[attribute] = this[attribute];
      }

      textFn.call(ctx, text, 0, canvas.height - 1);
      memo[font][text] = canvas;
    }
    
    this.drawImage(memo[font][text], x, y - getHeight(font));
  }

  return memoized;
}

  var strokeText = CanvasRenderingContext2D.prototype.strokeText;
  var fillText = CanvasRenderingContext2D.prototype.fillText;

  CanvasRenderingContext2D.prototype.strokeText = memoizeDrawText(strokeText);
  CanvasRenderingContext2D.prototype.fillText = memoizeDrawText(fillText);
})();
