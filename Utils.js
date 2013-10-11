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

  return {
    gaussianRandom : gaussianRandom,
    create2DArray : create2DArray
  };
})();