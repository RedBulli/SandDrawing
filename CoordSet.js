function CoordSet()
{
  this.items = {};

  this.addCoord = function(x, y)
  {
    if (!this.items.hasOwnProperty(x)) {
      this.items[x] = {};
    }
    this.items[x][y] = true;
  };

  this.contains = function(x, y) {
    return this.items[x] ? (this.items[x][y] ? true : false) : false;
  };

  this.deleteCoord = function(x, y) {
    if (this.items[x]) {
      delete(this.items[x][y]);
      if ($.isEmptyObject(this.items[x]))
        delete(this.items[x]);
    }
  };

  this.each = function(fn) {
    var rows = Object.keys(this.items);
    for (var i=0; i<rows.length; i++) {
      var cols = Object.keys(this.items[rows[i]]);
      for (var j=0; j<cols.length; j++) {
        fn(parseInt(rows[i], 10), parseInt(cols[j], 10));
      }
    }
  };

  this.size = function() {
    var count = 0;
    this.each(function(x, y) {
      count++;
    });
    return count;
  };

  this.isEmpty = function() {
    return (Object.keys(this.items).length === 0);
  };

  this.mergeSets = function(coordSet) {
    var _this = this;
    coordSet.each(function(x, y) {
      _this.addCoord(x, y);
    });
    return this;
  };

  this.minus = function(coordSet) {
    var _this = this;
    coordSet.each(function(x, y) {
      _this.deleteCoord(x, y);
    });
    return this;
  };

  this.filter = function(compFunc) {
    var _this = this;
    this.each(function(x,y) {
      if(!compFunc(x,y))
        _this.deleteCoord(x,y);
    });
  };

}
