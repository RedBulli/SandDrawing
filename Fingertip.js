var Fingertip = function(x, y, radius, sandbox) {
  this.x = x;
  this.y = y;
  this.radius = radius;
  this.sandbox = sandbox;
  this.occupiedCoords = this.sandbox.grid.getInnerCoords(x, y, radius);
  this.lastDestinationCoordinates = null;
};

Fingertip.prototype.moveTo = function(toX, toY) {
  var changed = new CoordSet();
  Utils.applyBetweenPoints(this.x, this.y, toX, toY, function(x, y) {
    this.x = x;
    this.y = y;
    this.occupiedCoords = this.sandbox.grid.getInnerCoords(x, y, this.radius);
    changed.mergeSets(this.sandbox.pushSand(this));
  }.bind(this));
  this.lastDestinationCoordinates = changed;
  var changedGrid = this.sandbox.erosion.run(changed);
  this.sandbox.sandCanvas.queueForRedraw(changedGrid);
  this.sandbox.sandCanvas.queueForRedraw(this.occupiedCoords);
};

Fingertip.prototype.occupies = function(x, y) {
  return this.occupiedCoords.contains(x, y);
};
