var Grid = function(width, height) {
  this.width = width;
  this.height = height;
  this.grid = Utils.create2DArray(width, height, 2);
  TurbulentWaveFilter.applyTo(this.grid);
};

Grid.prototype.getGrains = function() {
  return this.grid;
};

Grid.prototype.setHeight = function(x, y, height) {
  if (this.isValid(x, y)) {
    this.grid[x][y] = height;
  }
};

Grid.prototype.dropSand = function(x, y, amount) {
  if (this.isValid(x, y)) {
    this.grid[x][y] += amount;
    if (this.grid[x][y] < 0)
      this.grid[x][y] = 0;
  }
};

Grid.prototype.getHeight = function(x, y) {
  if (this.isValid(x, y)) {
    return this.grid[x][y];
  } else {
    return null;
  }
};

Grid.prototype.getHeightFromCoords = function(coords) {
  return this.getHeight(coords.x, coords.y);
};

Grid.prototype.getNeighbours = function(x, y) {
  var xVals = this.getNeighbourValues(x, 'x');
  var yVals = this.getNeighbourValues(y, 'y');
  var neighbours = [];
  for (var i = xVals.lower; i<=xVals.upper; i++) {
    for (var j = yVals.lower; j<=yVals.upper; j++) {
      if (i!==x && j!==y && this.isValid(i, j)) {
        neighbours.push({x: i, y: j, height: this.getHeight(i, j)});
      }
    }
  }
  return neighbours;
};

Grid.prototype.getNeighboursCoordSet = function(x, y) {
  var xVals = this.getNeighbourValues(x, 'x');
  var yVals = this.getNeighbourValues(y, 'y');
  var neighbours = new CoordSet();
  for (var i = xVals.lower; i<=xVals.upper; i++) {
    for (var j = yVals.lower; j<=yVals.upper; j++) {
      if (i!==x && j!==y && this.isValid(i, j)) {
        neighbours.addCoord(i, j);
      }
    }
  }
  return neighbours;
};

Grid.prototype.getInnerCoords = function(x, y, radius) {
  var coords = new CoordSet();
  var floorRadius = Math.floor(radius);
  var ceilRadius = Math.ceil(radius);
  for (var i=-floorRadius; i<ceilRadius; i++) {
    for (var j=-floorRadius; j<ceilRadius; j++) {
      if(Utils.isInsideCircle(x,y,x+i,y+j,radius) && this.isValid(x+i, y+j)) {
        coords.addCoord(x+i, y+j);
      }
    }
  }
  return coords;
};

Grid.prototype.getInnerCoordsFromPath = function(x1, y1, x2, y2, radius) {
  var coords = new CoordSet();
  var _this = this;
  Utils.applyBetweenPoints(x1,y1,x2,y2, function(x, y) {
    coords.mergeSets(_this.getInnerCoords(x,y, radius));
  });
  return coords;
};

Grid.prototype.getOuterNeighbours = function(coords) {
  var neighbours = new CoordSet();
  var _this = this;
  coords.each(function(x, y) {
    neighbours.mergeSets(_this.getNeighboursCoordSet(x, y));
  });
  neighbours.minus(coords);
  return neighbours;
};

Grid.prototype.getNeighbourValues = function(value, axis) {
  var maxVal = this.width;
  if (axis === 'y') {
    maxVal = this.height;
  }
  if (value === 0) {
    return {lower: value, upper: value+1};
  } else {
    if (value === maxVal-1) {
      return {lower: value-1, upper: value};
    } else {
      return {lower: value-1, upper: value+1};
    }
  }
};

Grid.prototype.distribute = function(giverX, giverY, receiveX, receiveY, amount) {
  if (this.isValid(giverX, giverY) && this.isValid(receiveX, receiveY)) {
    this.grid[giverX][giverY] -= amount;
    this.grid[receiveX][receiveY] += amount;
  }
};

Grid.prototype.isValid = function(x, y) {
  return x >= 0 && x < this.width && y >= 0 && y < this.height;
};
