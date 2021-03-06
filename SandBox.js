var Sandbox = function(canvas) {
  canvas.height = screen.height;
  canvas.width = screen.width;
  this.width = canvas.width;
  this.height = canvas.height;
  this.grid = new Grid(this.width, this.height);
  this.erosion = new Erosion(this);
  this.sandCanvas = new SandCanvas(canvas, this.grid);
  this.fingertips = [];
};

Sandbox.prototype.initialize = function() {
  this.sandCanvas.drawWholeBox();
};

Sandbox.prototype.addFingertip = function(fingertip) {
  if (this.fingertips.indexOf(fingertip) === -1) {
    this.fingertips.push(fingertip);
  }
};

Sandbox.prototype.removeFingertip = function(fingertip) {
  var i = this.fingertips.indexOf(fingertip);
  if (i !== -1) {
    this.fingertips.splice(i, 1);
  }
  var changed = this.grid.getOuterNeighbours(fingertip.occupiedCoords);
  changed.mergeSets(fingertip.occupiedCoords);
  if (fingertip.lastDestinationCoordinates) {
    changed.mergeSets(fingertip.lastDestinationCoordinates);
  }
  var changedGrid = this.erosion.run(changed);
  this.sandCanvas.queueForRedraw(changedGrid);
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

Sandbox.prototype.pushSand = function(fingertip) {
  var x0 = fingertip.x;
  var y0 = fingertip.y;
  var _this = this;
  var changed = new CoordSet();
  fingertip.occupiedCoords.each(function(x, y) {
    var angle = Math.atan2(y - y0, x - x0);
    var r = Math.round(fingertip.radius - Utils.eucledianDistance(x0, y0, x, y) + 1);
    var toX = x + Math.round(Math.cos(angle) * r);
    var toY = y + Math.round(Math.sin(angle) * r);
    _this.grid.distribute(x, y, toX, toY, _this.grid.getHeight(x,y));
    changed.addCoord(toX, toY);
  });
  return changed;
};
