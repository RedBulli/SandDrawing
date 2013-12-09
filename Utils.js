var Utils = (function() {

  // http://www.taygeta.com/random/gaussian.html
  function gaussianRandom() {
    var x1, x2, w;

    do {
       x1 = 2.0 * Math.random() - 1.0;
       x2 = 2.0 * Math.random() - 1.0;
       w = x1 * x1 + x2 * x2;
    } while ( w >= 1.0 );

    w = Math.sqrt((-2.0 * Math.log(w)) / w);
    return { first : x1 * w, second : x2 * w };
  }

  function create2DArray(width, height, initialValue) {
    var array = [];
    for (var i = 0; i < width; i++) {
      array[i] = [];
      for (var j = 0; j < height; j++) {
        array[i][j] = initialValue;
      }
    }
    return array;
  }

  function eucledianDistance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x1-x2, 2)+Math.pow(y1-y2, 2))
  }


  function isInsideCircle(x1, y1, x2, y2, radius) {
    /* 0.707 because we want all of the coordinates which the radius intercects */
    return eucledianDistance(x1, y1, x2, y2)-radius < 0.707;
  }

  /* http://rosettacode.org/wiki/Bitmap/Bresenham's_line_algorithm#JavaScript */
  function applyBetweenPoints(x0, y0, x1, y1, func) {
    var dx = Math.abs(x1 - x0), sx = x0 < x1 ? 1 : -1;
    var dy = Math.abs(y1 - y0), sy = y0 < y1 ? 1 : -1; 
    var err = (dx>dy ? dx : -dy)/2;
    while (true) {
      func(x0,y0);
      if (x0 === x1 && y0 === y1) break;
      var e2 = err;
      if (e2 > -dx) { err -= dy; x0 += sx; }
      if (e2 < dy) { err += dx; y0 += sy; }
    }
  }

  return {
    gaussianRandom : gaussianRandom,
    create2DArray : create2DArray,
    isInsideCircle : isInsideCircle,
    applyBetweenPoints : applyBetweenPoints,
    eucledianDistance : eucledianDistance
  };
})();