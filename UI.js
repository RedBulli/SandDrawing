var UI = function(canvasId,  sandbox) {
  this.canvas = $('#' + canvasId);
  this.sandbox = sandbox;
  this.initialize();
};

UI.prototype.initialize = function(first_argument) {
  var timeout, mouseCoords;
  var _this = this;
  this.canvas.mousedown(function(event) {
    mouseCoords = _this.getCanvasTouchCoords(event);
    timeout = setInterval(function(){
      _this.sandbox.dropSand(mouseCoords.x, mouseCoords.y, 5);
    }, 25);
    return false;
  });
  this.canvas.mousemove(function(event) {
    mouseCoords = _this.getCanvasTouchCoords(event);
  });

  $(document).mouseup(function(){
    clearInterval(timeout);
    return false;
  });
};

UI.prototype.getCanvasTouchCoords = function(event) {
  var offset = this.canvas.offset();
  var x = event.pageX - offset.left;
  var y = event.pageY - offset.top;
  return {x: x, y: y};
};
