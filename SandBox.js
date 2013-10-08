var Sandbox = function(elementId, width, height) {
  this.grid = new Grid(width, height);
  this.erosion = new Erosion(this.grid);
  this.displacement = new Displacement(this.grid);
  this.sandCanvas = new SandCanvas(elementId, this.grid);
  this.ui = new UI(elementId, this);
};

Sandbox.prototype.initialize = function() {
  this.sandCanvas.drawWholeBox();
};

Sandbox.prototype.dropSand = function(x, y) {
  var activeCoords = new CoordSet();
  for (var i=-5; i<5; i++) {
    for (var j=-5; j<5; j++) {
      if (Math.sqrt(i*i+j*j) <= 5) {
        if(Math.random() > 0.5) {
          this.grid.dropSand(x+i, y+j, 1);
          activeCoords.addCoord(x+i, y+j);
        }
      }
    }
  }
  var changedGrid = this.erosion.run(activeCoords);
  this.sandCanvas.drawChanged(changedGrid);
};

Sandbox.prototype.moveSand = function(x, y, prevX, prevY) {
  var changedGrid = this.displacement.moveSand(x, y, prevX, prevY);
  changedGrid.mergeSets(this.erosion.run(changedGrid));
  this.graphics.drawChanged(changedGrid);
};
