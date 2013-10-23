var Sandbox = function(elementId, width, height) {
  this.grid = new Grid(width, height);
  this.erosion = new Erosion(this.grid);
  this.displacement = new Displacement(this.grid);
  this.sandCanvas = new SandCanvas(elementId, this.grid);
  this.ui = new UI(elementId, this);
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
  this.sandCanvas.drawChanged(changedGrid);
};

Sandbox.prototype.pushSand = function(x, y) {
  var innerCoords = this.grid.getInnerCoords(x,y,2.1);
  var neighbours = this.grid.getOuterNeighbours(innerCoords);
  var totalAmount = 0;
  var _this = this;
  innerCoords.each(function(x, y) {
    totalAmount += _this.grid.getHeight(x,y);
    _this.grid.setHeight(x, y, 0);
  });
  var distAmount = totalAmount / neighbours.size();
  neighbours.each(function(x, y) {
    _this.grid.dropSand(x, y, distAmount);
  });
  var changedGrid = this.erosion.run(innerCoords.mergeSets(neighbours));
  this.sandCanvas.drawChanged(changedGrid);
};

Sandbox.prototype.moveSand = function(x, y, prevX, prevY) {
  var changedGrid = this.displacement.moveSand(x, y, prevX, prevY);
  changedGrid.mergeSets(this.erosion.run(changedGrid));
  this.graphics.drawChanged(changedGrid);
};
