/*

Adapted from the code samples at http://lodev.org/cgtutor/randomnoise.html.

Copyright (c) 2004-2007, Lode Vandevenne

All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
"AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR
CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

var TurbulentWaveFilter = (function() {
  var noiseHeight = 300;
  var noiseWidth = 300;

  var noise = Utils.create2DArray(noiseWidth, noiseHeight);

  generateNoise();

  function applyTo(matrix) {
    var width = matrix.length;
    var height = matrix[0].length;
    var xPeriod = 3.3; //defines repetition of marble lines in x direction
    var yPeriod = 1.5; //defines repetition of marble lines in y direction
    //turbPower = 0 ==> it becomes a normal sine pattern
    var turbPower = 1.0; //makes twists
    var turbSize = 150.0; //initial size of the turbulence
    
    for(var y = 0; y < height; y++) {
      for(var x = 0; x < width; x++) {    
          var xyValue = x * xPeriod / noiseHeight + y * yPeriod / noiseWidth + turbPower * turbulence(x, y, turbSize) / 256.0;
          var sineValue = Math.abs(Math.sin(xyValue * Math.PI));
          matrix[x][y] *= sineValue;
      }
    }
  }

  function turbulence(x, y, size) {
      var value = 0.0, initialSize = size;
      
      while(size >= 1)
      {
          value += smoothNoise(x / size, y / size) * size;
          size /= 2.0;
      }
      
      return(128.0 * value / initialSize);
  }

  function generateNoise() {
    for (var x = 0; x < noiseWidth; x++) {
      for (var y = 0; y < noiseHeight; y++) {
          noise[x][y] = Math.random();
      }
    }
  }

  function smoothNoise(x, y) {  
     //get fractional part of x and y
     var fractX = x - Math.floor(x);
     var fractY = y - Math.floor(y);
     
     //wrap around
     var x1 = (Math.floor(x) + noiseWidth) % noiseWidth;
     var y1 = (Math.floor(y) + noiseHeight) % noiseHeight;
     
     //neighbor values
     var x2 = (x1 + noiseWidth - 1) % noiseWidth;
     var y2 = (y1 + noiseHeight - 1) % noiseHeight;

     //smooth the noise with bilinear varerpolation
     var value = 0.0;
     value += fractX       * fractY       * noise[x1][y1];
     value += fractX       * (1 - fractY) * noise[x1][y2];
     value += (1 - fractX) * fractY       * noise[x2][y1];
     value += (1 - fractX) * (1 - fractY) * noise[x2][y2];

     return value;
  }

  return {
    applyTo : applyTo
  };
})();