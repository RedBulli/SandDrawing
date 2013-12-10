var Fingertip = function(coords) {
  this.prevX = coords.x;
  this.prevY = coords.y;
  this.x = coords.x;
  this.y = coords.y;
};

Fingertip.prototype.moveTo = function(coords) {
  this.x = coords.x;
  this.y = coords.y;
};

Fingertip.prototype.setPrev = function(x, y) {
  this.prevX = x;
  this.prevY = y;
};
