var Fingertip = function(x, y, radius, sandbox) {
  this.x = x;
  this.y = y;
  this.radius = radius;
  this.sandbox = sandbox;
  this.occupiedCoords = this.sandbox.grid.getInnerCoords(x, y, radius);
};

Fingertip.prototype.moveTo = function(toX, toY) {
  Utils.applyBetweenPoints(this.x, this.y, toX, toY, function(x, y) {
    this.x = x;
    this.y = y;
    this.occupiedCoords = this.sandbox.grid.getInnerCoords(x, y, this.radius);
    this.sandbox.pushSand(this);
  }.bind(this));
};

Fingertip.prototype.occupies = function(x, y) {
  return this.occupiedCoords.contains(x, y);
};
