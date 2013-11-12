var Fingertip = function(x, y, radius, sandbox) {
  this.x = x;
  this.y = y;
  this.prevX;
  this.prevY;
  this.radius = radius;
  this.sandbox = sandbox;
  this.occupiedCoords = sandbox.grid.getInnerCoords(x, y, radius);
  this.prevOccupiedCoords = new CoordSet();
  this.sandbox.pushSand(this.occupiedCoords, this.prevOccupiedCoords);
};

Fingertip.prototype.moveTo = function(x, y) {
  this.prevX = this.x;
  this.prevY = this.y;
  this.prevOccupiedCoords = this.occupiedCoords;
  this.occupiedCoords = this.sandbox.grid.getInnerCoords(x, y, this.radius);
  this.sandbox.pushSand(this.occupiedCoords, this.prevOccupiedCoords);
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
