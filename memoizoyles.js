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
      ctx.font = font;

      textFn.call(ctx, text, 0, canvas.height - 1);
      memo[font][text] = canvas;
    }
    
    this.drawImage(memo[font][text], x, y - canvas.height);
  }

  return memoized;
}

  var strokeText = CanvasRenderingContext2D.prototype.strokeText;
  var fillText = CanvasRenderingContext2D.prototype.fillText;

  CanvasRenderingContext2D.prototype.strokeText = memoizeDrawText(strokeText);
  CanvasRenderingContext2D.prototype.fillText = memoizeDrawText(fillText);
})();
