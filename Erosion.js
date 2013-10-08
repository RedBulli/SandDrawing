var Erosion = function(sandbox) {
  this.sandbox = sandbox;
};

Erosion.prototype.run = function(activeGrains) {
  var changedGrains = new CoordSet();
  changedGrains.mergeSets(activeGrains);
  var _this = this;
  while(!activeGrains.isEmpty()) {
    this.nextActiveGrains = new CoordSet();
    activeGrains.each(function(x, y) {
      _this.applyErosion(x, y);
    });
    changedGrains.mergeSets(this.nextActiveGrains);
    activeGrains = this.nextActiveGrains;
  }
  return changedGrains;
};

Erosion.prototype.applyErosion = function(x, y) {
  var steepNeighbours = this.getTooSteepNeighbours(x, y);
  var rerun = false;
  if (steepNeighbours.length > 0) {
    this.smoothSlope(x, y, steepNeighbours);
    rerun = true;
  }
  return rerun;
};

Erosion.prototype.smoothSlope = function(x, y, steepNeighbours) {
  var height = this.sandbox.getHeight(x,y);
  var distrAmount = this.getAverageHeightDifference(height, steepNeighbours) 
    * FRACTIONAL_CONSTANT / steepNeighbours.length;
  this.nextActiveGrains.addCoord(x, y);
  for (var i=0; i<steepNeighbours.length; i++) {
    this.sandbox.distribute(x, y, steepNeighbours[i].x, steepNeighbours[i].y, distrAmount);
    this.nextActiveGrains.addCoord(steepNeighbours[i].x, steepNeighbours[i].y);
  }
};


Erosion.prototype.hasSlopes = function(height, neighbours) {
  for (var i=0; i<neighbours.length; i++) {
    if (this.isTooSteep(height, this.sandbox.getHeightFromCoords(neighbours[i]))) {
      return true;
    }
  }
  return false;
};

Erosion.prototype.isTooSteep = function(height, neighbourHeight) {
  return this.getSlope(height, neighbourHeight) > SLOPE_TRESHOLD;
};

Erosion.prototype.getSlope = function(height, neighbourHeight) {
  return Math.atan(height-neighbourHeight);
};

Erosion.prototype.getTooSteepNeighbours = function(x, y) {
  var steepNeighbours = [];
  var height = this.sandbox.getHeight(x, y);
  var neighbours = this.sandbox.getNeighbours(x, y);
  for (var i=0; i<neighbours.length; i++) {
    if(this.isTooSteep(height, neighbours[i].height)) {
      steepNeighbours.push(neighbours[i]);
    }
  }
  return steepNeighbours;
};

Erosion.prototype.getAverageHeightDifference = function(height, neighbours) {
  var heightDiffSum = 0;
  var n = 0;
  for (var i=0; i<neighbours.length; i++) {
    heightDiffSum += height - neighbours[i].height;
    n++
  }
  return heightDiffSum / n;
};
