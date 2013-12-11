/* Based on http://www.html5rocks.com/en/tutorials/webgl/webgl_fundamentals/
*  by Gregg Tavares
*  Licensed under a BSD license. */

var WIDTH = 512;
var HEIGHT = 256;
window.onload = start;

function start() {
  var canvas = document.getElementById("canvas");
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  render();
}

function render() {
  // Get A WebGL context
  var canvas = document.getElementById("canvas");
  var ui = TouchUI;
  ui.init(canvas);
  var gl = getWebGLContext(canvas);
  if (!gl) {
    return;
  }

  // setup GLSL program
  vertexShader = createShaderFromScriptElement(gl, "2d-vertex-shader");
  fragmentShader = createShaderFromScriptElement(gl, "erosion-shader");
  program = createProgram(gl, [vertexShader, fragmentShader]);
  gl.useProgram(program);

  // look up where the vertex data needs to go.
  var positionLocation = gl.getAttribLocation(program, "a_position");
  var texCoordLocation = gl.getAttribLocation(program, "a_texCoord");

  // provide texture coordinates for the rectangle.
  var texCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      0.0,  0.0,
      1.0,  0.0,
      0.0,  1.0,
      0.0,  1.0,
      1.0,  0.0,
      1.0,  1.0]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(texCoordLocation);
  gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);

  function createAndSetupTexture(gl) {
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Set up texture so we can render any size image and so we are
    // working with pixels.
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    return texture;
  }

  // Create a texture and put the image in it.
  var originalImageTexture = createAndSetupTexture(gl);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, WIDTH, HEIGHT, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

  // create 2 textures and attach them to framebuffers.
  var textures = [];
  var framebuffers = [];
  for (var ii = 0; ii < 2; ++ii) {
    var texture = createAndSetupTexture(gl);
    textures.push(texture);

    // make the texture the same size as the image
    gl.texImage2D(
        gl.TEXTURE_2D, 0, gl.RGBA, WIDTH, HEIGHT, 0,
        gl.RGBA, gl.UNSIGNED_BYTE, null);

    // Create a framebuffer
    var fbo = gl.createFramebuffer();
    framebuffers.push(fbo);
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);

    // Attach a texture to it.
    gl.framebufferTexture2D(
        gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
  }

  // lookup uniforms
  var resolutionLocation = gl.getUniformLocation(program, "u_resolution");
  var textureSizeLocation = gl.getUniformLocation(program, "u_textureSize");
  var flipYLocation = gl.getUniformLocation(program, "u_flipY");
  var stageLocation = gl.getUniformLocation(program, "u_stage");
  var touchLocations = gl.getUniformLocation(program, "u_touchlocations");

  // set the size of the image
  gl.uniform2f(textureSizeLocation, WIDTH, HEIGHT);

  // Create a buffer for the position of the rectangle corners.
  var positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

  // Set a rectangle the same size as the image.
  setRectangle( gl, 0, 0, WIDTH, HEIGHT);

  // start with the original image
  gl.bindTexture(gl.TEXTURE_2D, originalImageTexture);
  var first = true;
  var count = 0;
  requestAnimationFrame(drawEffects);
  function drawEffects() {
    // don't y flip images while drawing to the textures
    gl.uniform1f(flipYLocation, 1);
    count = count % 2;
    function displacement() {
      gl.uniform1f(stageLocation, 0);
      var touches = ui.getArrayCopy();
      var paths = [];
      ui.resetPrevValues();
      for (var i=0;i<touches.length;i++) {
        paths.push(getCoordPath(touches[i].prevX, touches[i].prevY, touches[i].x, touches[i].y));
      }
      while (paths.length > 0) {
        var arr = [];
        for (var j=0;j<paths.length;j++) {
          if (paths[j].length == 0) {
            paths.splice(j, 1);
            j--;
          } else {
            var prevCoord = paths[j].splice(0, 1)[0];
            var nextCoord = paths[j][0];
            if (!nextCoord) {
              paths.splice(j, 1);
              j--;
            } else {
              arr.push(prevCoord.x);
              arr.push(prevCoord.y);
              arr.push(nextCoord.x);
              arr.push(nextCoord.y);
            }
          }
        }
        if (arr.length > 0) {
          gl.uniform4fv(touchLocations, new Float32Array(arr));
          // Draw
          setFramebuffer(framebuffers[count % 2], WIDTH, HEIGHT);
          draw();
          // for the next draw, use the texture we just rendered to.
          gl.bindTexture(gl.TEXTURE_2D, textures[count % 2]);
          // increment count so we use the other texture next time.
          ++count;
          // End draw
        }
      }
    }
    function erosionReceive() {
      gl.uniform1f(stageLocation, -1);
      setFramebuffer(framebuffers[count % 2], WIDTH, HEIGHT);
      draw();
      // for the next draw, use the texture we just rendered to.
      gl.bindTexture(gl.TEXTURE_2D, textures[count % 2]);
      // increment count so we use the other texture next time.
      ++count;
    }

    function erosion() {
      gl.uniform1f(stageLocation, 1);
      setFramebuffer(framebuffers[count % 2], WIDTH, HEIGHT);
      draw();
      // for the next draw, use the texture we just rendered to.
      gl.bindTexture(gl.TEXTURE_2D, textures[count % 2]);
      // increment count so we use the other texture next time.
      ++count;
    }

    function setupSand() {
      gl.uniform1f(stageLocation, -2);
      setFramebuffer(framebuffers[count % 2], WIDTH, HEIGHT);
      draw();
      // for the next draw, use the texture we just rendered to.
      gl.bindTexture(gl.TEXTURE_2D, textures[count % 2]);
      // increment count so we use the other texture next time.
      ++count;
    }

    function renderToScreen() {
      // finally draw the result to the canvas.
      gl.uniform1f(flipYLocation, -1);  // need to y flip for canvas
      gl.uniform1f(stageLocation, 2);
      setFramebuffer(null, canvas.width, canvas.height);
      draw();
      requestAnimationFrame(drawEffects);
    }
    if (first) {
      setupSand();
      first = false;
    } else {
      erosionReceive();
    }
    displacement();
    erosion();
    renderToScreen();
  }

  function setFramebuffer(fbo, width, height) {
    // make this the framebuffer we are rendering to.
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);

    // Tell the shader the resolution of the framebuffer.
    gl.uniform2f(resolutionLocation, width, height);

    // Tell webgl the viewport setting needed for framebuffer.
    gl.viewport(0, 0, width, height);
  }

  function draw() {
    // Draw the rectangle.
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
}

function randomInt(range) {
  return Math.floor(Math.random() * range);
}

function setRectangle(gl, x, y, width, height) {
  var x1 = x;
  var x2 = x + width;
  var y1 = y;
  var y2 = y + height;
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
     x1, y1,
     x2, y1,
     x1, y2,
     x1, y2,
     x2, y1,
     x2, y2]), gl.STATIC_DRAW);
}

function applyBetweenPoints(x0, y0, x1, y1, func) {
  if (x0 == null || y0 == null || x1 == null || y1 == null) {
    return;
  } else if (x0 == x1 && y0 == y1){
    return;
  } else {
    var dx = Math.abs(x1 - x0), sx = x0 < x1 ? 1 : -1;
    var dy = Math.abs(y1 - y0), sy = y0 < y1 ? 1 : -1;
    var err = (dx>dy ? dx : -dy)/2;
    while (true) {
      if (x0 === x1 && y0 === y1) break;
      func(x0,y0);
      
      var e2 = err;
      if (e2 > -dx) { err -= dy; x0 += sx; }
      if (e2 < dy) { err += dx; y0 += sy; }
    }
  }
}

function getNthCoordTowards(x0, y0, x1, y1, n) {
  var dx = Math.abs(x1 - x0), sx = x0 < x1 ? 1 : -1;
  var dy = Math.abs(y1 - y0), sy = y0 < y1 ? 1 : -1;
  var err = (dx>dy ? dx : -dy)/2;
  var count = 0;
  while (true) {
    if (count==n) {
      return {x: x0, y: y0};
    }
    if (x0 === x1 && y0 === y1) break;
    var e2 = err;
    if (e2 > -dx) { err -= dy; x0 += sx; }
    if (e2 < dy) { err += dx; y0 += sy; }
    count++;
  }
  return null;
}

function getCoordPath(x0, y0, x1, y1) {
  var dx = Math.abs(x1 - x0), sx = x0 < x1 ? 1 : -1;
  var dy = Math.abs(y1 - y0), sy = y0 < y1 ? 1 : -1;
  var err = (dx>dy ? dx : -dy)/2;
  var arr = [];
  var count = 0;
  while (true) {
    if (count < 2 || count % 5 == 0) {
      arr.push({x: x0, y: y0});
    }
    count++;
    
    
    if (x0 === x1 && y0 === y1) break;
    var e2 = err;
    if (e2 > -dx) { err -= dy; x0 += sx; }
    if (e2 < dy) { err += dx; y0 += sy; }
  }
  if (arr.length <= 1) {
    return [];
  } 
  return arr;
}
