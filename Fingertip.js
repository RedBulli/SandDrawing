var Fingertip = function(x, y, radius, sandbox) {
  this.x = x;
  this.y = y;
  this.radius = radius;
  this.sandbox = sandbox;
  this.occupiedCoords = sandbox.grid.getInnerCoords(x, y, radius);
  this.sandbox.pushSand(this.occupiedCoords);
};

Fingertip.prototype.moveTo = function(x, y) {
  this.occupiedCoords = this.sandbox.grid.getInnerCoords(x, y, this.radius);
  this.sandbox.pushSand(this.occupiedCoords);
  this.x = x;
  this.y = y;
};

Fingertip.prototype.occupies = function(targetX, targetY) {
  var comparison = false;
  this.occupiedCoords.each(function(x, y) {
    if (targetX === x && targetY === y) {
      comparison = true;
    }
  });
  return comparison;
};
