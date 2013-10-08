var Grid = function(width, height) {
  this.width = width;
  this.height = height;
  this.grid = [];
  for (var i=0; i<this.width; i++) {
    this.grid.push([]);
    for (var j=0; j<this.height; j++) {
      this.grid[i].push(2);
    }
  }
};

Grid.prototype.getGrains = function() {
  return this.grid;
};

Grid.prototype.setHeight = function(x, y, height) {
  this.grid[x][y] = height;
};

Grid.prototype.dropSand = function(x, y, amount) {
  this.grid[x][y] += amount;
};

Grid.prototype.getHeight = function(x, y) {
  return this.grid[x][y];
};

Grid.prototype.getHeightFromCoords = function(coords) {
  return this.grid[coords.x][coords.y];
};

Grid.prototype.getNeighbours = function(x, y) {
  var xVals = this.getNeighbourValues(x, 'x');
  var yVals = this.getNeighbourValues(y, 'y');
  var neighbours = [];
  for (var i = xVals.lower; i<=xVals.upper; i++) {
    for (var j = yVals.lower; j<=yVals.upper; j++) {
      if (i===x && j===y) {}
      else {
        neighbours.push({x: i, y: j, height: this.getHeight(i, j)});
      }
    }
  }
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
  this.grid[giverX][giverY] -= amount;
  this.grid[receiveX][receiveY] += amount;
};
