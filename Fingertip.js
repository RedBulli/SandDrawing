var Fingertip = function(x, y, radius, sandbox) {
  this.x = x;
  this.y = y;
  this.prevX;
  this.prevY;
  this.radius = radius;
  this.sandbox = sandbox;
};

Fingertip.prototype.moveTo = function(x, y) {
  this.prevX = this.x;
  this.prevY = this.y;
  this.x = x;
  this.y = y;
  this.sandbox.pushSand(this.prevX, this.prevY, x, y, this.radius);
};

Fingertip.prototype.occupies = function(targetX, targetY) {
  return Utils.isInsideCircle(this.x, this.y, targetX, targetY, this.radius);
};
