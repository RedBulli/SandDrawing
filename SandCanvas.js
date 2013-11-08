var SandCanvas = function(canvasId, grid) {
  this.grid = grid;
  this.canvas = document.getElementById(canvasId);
  this.ctx = this.canvas.getContext('2d');
  this.changedCoords = [];
};

SandCanvas.prototype.drawChanged = function(changedCoords) {
  var _this = this;
  changedCoords.each(function(x, y) {
    _this.drawPixel(x, y, _this.grid.getHeight(x,y));
  });
};

SandCanvas.prototype.drawPixel = function(x, y, z) {
  if (z === 0) {
    this.ctx.fillStyle = this.getShadeColor(SAND_COLOR, 10);
  } else {
    var percentage = -95 * z / (1 + z);
    var rnd = Utils.gaussianRandom().first * 3;
    percentage += rnd;
    percentage += this.getNeighbourLights(x,y);
    this.ctx.fillStyle = this.getShadeColor(SAND_COLOR, percentage);
  }
  this.ctx.fillRect(x, y, 1, 1);
};

SandCanvas.prototype.getNeighbourLights = function(x,y) {
  var neighbours = this.grid.getNeighbours(x,y);
  var light = 0;
  for (var i=0;i<neighbours.length;i++) {
    if (neighbours[i].height <= 0.1) {
      light += 0;
    }
  }
  return light;
};

SandCanvas.prototype.drawWholeBox = function() {
  for (var i=0;i<WIDTH;i++) {
    for (var j=0;j<HEIGHT;j++) {
      this.drawPixel(i, j, this.grid.getHeight(i,j));
    }
  }
};

SandCanvas.prototype.getShadeColor = function(color, percent) {
  var num = parseInt(color.slice(1),16), amt = Math.round(2.55 * percent), R = (num >> 16) + amt, B = (num >> 8 & 0x00FF) + amt, G = (num & 0x0000FF) + amt;
  return "#" + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (B<255?B<1?0:B:255)*0x100 + (G<255?G<1?0:G:255)).toString(16).slice(1);
};

SandCanvas.prototype.queueForRedraw = function(coords) {
  this.changedCoords.push(coords);
};

SandCanvas.prototype.renderLoop = function() {
  var _this = this;
  if (this.changedCoords.length > 0) {
    this.changedCoords.forEach(function(coords) {
      coords.each(function(x, y) {
        _this.drawPixel(x, y, _this.grid.getHeight(x,y));
      });
    });
  }
  this.changedCoords = [];
  requestAnimationFrame(this.renderLoop.bind(this));
};
