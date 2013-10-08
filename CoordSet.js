function CoordSet()
{
  this.items = {};

  this.addCoord = function(x, y)
  {
    if (!this.items.hasOwnProperty(x)) {
      this.items[x] = {};
    }
    this.items[x][y] = undefined;
  };

  this.each = function(fn) {
    var rows = Object.keys(this.items);
    for (var i=0; i<rows.length; i++) {
      var cols = Object.keys(this.items[rows[i]]);
      for (var j=0; j<cols.length; j++) {
        fn(parseInt(rows[i]), parseInt(cols[j]));
      }
    }
  };

  this.isEmpty = function() {
    return (Object.keys(this.items).length === 0);
  };

  this.mergeSets = function(coordSet) {
    var _this = this;
    coordSet.each(function(x, y) {
      _this.addCoord(x, y);
    });
  };

}
