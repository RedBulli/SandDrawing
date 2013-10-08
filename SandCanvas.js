var SandCanvas = function(canvasId, grid) {
  this.grid = grid;
  this.canvas = document.getElementById(canvasId);
  this.ctx = this.canvas.getContext('2d');
};

SandCanvas.prototype.drawChanged = function(changedCoords) {
  var _this = this;
  changedCoords.each(function(x, y) {
    _this.drawPixel(x, y, _this.grid.getHeight(x,y));
  });
};

SandCanvas.prototype.drawPixel = function(x, y, z) {
  var percentage = 100;
  if (z > 0) {
    percentage = -5*z;
  }
  this.ctx.fillStyle = this.getShadeColor(SAND_COLOR, percentage);
  this.ctx.fillRect(x, y, 1, 1);
};

SandCanvas.prototype.drawWholeBox = function() {
  for (var i=0;i<1000;i++) {
    for (var j=0;j<1000;j++) {
      this.drawPixel(i, j, this.grid.getHeight(i,j));
    }
  }
};

SandCanvas.prototype.getShadeColor = function(color, percent) {   
  var num = parseInt(color.slice(1),16), amt = Math.round(2.55 * percent), R = (num >> 16) + amt, B = (num >> 8 & 0x00FF) + amt, G = (num & 0x0000FF) + amt;
  return "#" + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (B<255?B<1?0:B:255)*0x100 + (G<255?G<1?0:G:255)).toString(16).slice(1);
};
