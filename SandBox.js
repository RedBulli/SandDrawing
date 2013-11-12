var Sandbox = function(elementId, width, height) {
  document.getElementById(elementId).width = 1000;
  document.getElementById(elementId).height = 1000;
  this.grid = new Grid(width, height);
  this.erosion = new Erosion(this);
  this.displacement = new Displacement(this.grid);
  this.sandCanvas = new SandCanvas(elementId, this.grid);
  this.fingertips = [];
};

Sandbox.prototype.initialize = function() {
  var allCoords = new CoordSet();
  for (var i=0;i<WIDTH;i++) {
    for (var j=0;j<HEIGHT;j++) {
      allCoords.addCoord(i,j);
    }
  }
  this.erosion.run(allCoords);
  this.sandCanvas.drawWholeBox();
};

Sandbox.prototype.addFingertip = function(fingertip) {
  if (this.fingertips.indexOf(fingertip) === -1) {
    this.fingertips.push(fingertip);
  }
};

Sandbox.prototype.removeFingertip = function(fingertip) {
  var i = this.fingertips.indexOf(fingertip);
  var changedGrid = this.grid.getInnerCoords(fingertip.x, fingertip.y, fingertip.radius);
  changedGrid.mergeSets(this.grid.getOuterNeighbours(changedGrid));
  this.erosion.run(changedGrid);
  this.sandCanvas.queueForRedraw(changedGrid);
  if (i !== -1) {
    this.fingertips.splice(i, 1);
  }
};

Sandbox.prototype.isOccupied = function(x, y) {
  var occupied = this.fingertips.some(function(fingertip) {
    return fingertip.occupies(x, y);
  });
  return occupied;
};

Sandbox.prototype.dropSand = function(x, y) {
  var activeCoords = new CoordSet();
  var radius = 10;
  for (var i=-radius; i<radius; i++) {
    for (var j=-radius; j<radius; j++) {
      if (Math.sqrt(i*i+j*j) <= radius) {
        if(Math.random() > 0.8) {
          this.grid.dropSand(x+i, y+j, 1);
          activeCoords.addCoord(x+i, y+j);
        }
      }
    }
  }
  var changedGrid = this.erosion.run(activeCoords);
  this.sandCanvas.queueForRedraw(changedGrid);
};

Sandbox.prototype.pushSand = function(x1, y1, x2, y2, radius) {
  var pushedCoords =  this.grid.getInnerCoordsFromPath(x1, y1, x2, y2, radius);
  var lastNeighbours = this.grid.getOuterNeighbours(this.grid.getInnerCoords(x2,y2, radius));
  var distance = Utils.eucledianDistance(x2, y2, x1, y1);
  //Get only the neighbours that are further away than the ending position
  lastNeighbours.filter(function(x,y) {
    return Utils.eucledianDistance(x1, y1, x, y) > distance;
  });
  var totalAmount = 0;
  var _this = this;
  pushedCoords.each(function(x, y) {
    totalAmount += _this.grid.getHeight(x,y);
    _this.grid.setHeight(x, y, 0);
  });
  var distAmount = totalAmount / lastNeighbours.size();
  lastNeighbours.each(function(x, y) {
    _this.grid.dropSand(x, y, distAmount);
  });
  var changedGrid = this.erosion.run(pushedCoords.mergeSets(lastNeighbours));
  this.sandCanvas.queueForRedraw(changedGrid);
};
