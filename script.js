/* Based on http://www.html5rocks.com/en/tutorials/webgl/webgl_fundamentals/
*  by Gregg Tavares
*  Licensed under a BSD license. */

var WIDTH = 1024;
var HEIGHT = 512;
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
  var mouseLocation = gl.getUniformLocation(program, "u_mouse");

  // set the size of the image
  gl.uniform2f(textureSizeLocation, WIDTH, HEIGHT);

  // Create a buffer for the position of the rectangle corners.
  var positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

  // Set a rectangle the same size as the image.
  setRectangle( gl, 0, 0, WIDTH, HEIGHT);

  var mouseCoords = {};
  document.addEventListener('mousemove', function(evt) {
    mouseCoords.x = evt.clientX - canvas.offsetLeft;
    mouseCoords.y = evt.clientY - canvas.offsetTop;
  }, false);
  // start with the original image
  gl.bindTexture(gl.TEXTURE_2D, originalImageTexture);

  requestAnimationFrame(drawEffects);
  var first = true;

  function drawEffects() {

    // don't y flip images while drawing to the textures
    gl.uniform1f(flipYLocation, 1);
    
    gl.uniform2f(mouseLocation, mouseCoords.x, mouseCoords.y);

    // loop through each effect we want to apply.
    var count = 0;
    var iters = 2;
    if (first) {
      iters = 3;
    }
    for (var ii = 0; ii < iters; ++ii) {
      if (first) {
        gl.uniform1f(stageLocation, -2);
        first = false;
      } else {
        gl.uniform1f(stageLocation, ii);
      }
      // Setup to draw into one of the framebuffers.
      setFramebuffer(framebuffers[count % 2], WIDTH, HEIGHT);

      draw();

      // for the next draw, use the texture we just rendered to.
      gl.bindTexture(gl.TEXTURE_2D, textures[count % 2]);

      // increment count so we use the other texture next time.
      ++count;
    }

    // finally draw the result to the canvas.
    gl.uniform1f(flipYLocation, -1);  // need to y flip for canvas
    gl.uniform1f(stageLocation, -1);
    setFramebuffer(null, canvas.width, canvas.height);
    draw();
    requestAnimationFrame(drawEffects);
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
