var UI = function(canvasId,  sandbox) {
  this.canvas = $('#' + canvasId);
  this.sandbox = sandbox;
  this.initialize();
  this.mousePressed = false;
};

UI.prototype.initialize = function() {
  var _this = this;
  var mouseLoop = function() {
    if (_this.mousePressed) {
      _this.sandbox.pushSand(_this.mouseCoords.x, _this.mouseCoords.y, 5);
      requestAnimationFrame(mouseLoop);
    }
  };

  this.canvas.mousedown(function(event) {
    _this.mouseCoords = _this.getCanvasTouchCoords(event);
    _this.mousePressed = true;
    requestAnimationFrame(mouseLoop);
    return false;
  });
  this.canvas.mousemove(function(event) {
    _this.mouseCoords = _this.getCanvasTouchCoords(event);
  });

  $(document).mouseup(function(){
    _this.mousePressed = false;
    return false;
  });
};

UI.prototype.getCanvasTouchCoords = function(event) {
  var offset = this.canvas.offset();
  var x = event.pageX - offset.left;
  var y = event.pageY - offset.top;
  return {x: x, y: y};
};
