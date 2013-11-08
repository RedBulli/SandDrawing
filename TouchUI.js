var TouchUI = (function(){
  var currentTouches = []; // Store the fingertip objects by touch id. The array may contain gaps.
  var canvas;
  var sandbox;

  function init(sandboxObj) {
    sandbox = sandboxObj;
    canvas = sandbox.sandCanvas.canvas;
    canvas.addEventListener("touchstart", startTouch);
    canvas.addEventListener("touchend", endTouch);
    canvas.addEventListener("touchcancel", cancelTouch);
    canvas.addEventListener("touchleave", endTouch);
    canvas.addEventListener("touchmove", moveTouch);
    requestAnimationFrame(sandbox.sandCanvas.renderLoop.bind(sandbox.sandCanvas));
  }

  function startTouch(event) {
    event.preventDefault();

    for (var i = 0; i < event.changedTouches.length; i++) {
      var left = canvas.offsetLeft;
      var top = canvas.offsetTop;
      var x = event.changedTouches[i].pageX - left;
      var y = event.changedTouches[i].pageY - top;

      var fingertip = new Fingertip(x, y, FINGERTIP_RADIUS, sandbox);
      var id = event.changedTouches[i].identifier;
      currentTouches[id] = fingertip;
      sandbox.addFingertip(fingertip);
    }
  }

  function moveTouch(event) {
    event.preventDefault();

    for (var i = 0; i < event.changedTouches.length; i++) {
      var id = event.changedTouches[i].identifier;

      var left = canvas.offsetLeft;
      var top = canvas.offsetTop;
      var x = event.changedTouches[i].pageX - left;
      var y = event.changedTouches[i].pageY - top;

      var fingertip = currentTouches[id];
      fingertip.moveTo(x, y);
    }
  }

  function endTouch(event) {
    event.preventDefault();

    for (var i = 0; i < event.changedTouches.length; i++) {
      var id = event.changedTouches[i].identifier;

      var left = canvas.offsetLeft;
      var top = canvas.offsetTop;
      var x = event.changedTouches[i].pageX - left;
      var y = event.changedTouches[i].pageY - top;

      var fingertip = currentTouches[id];
      sandbox.removeFingertip(fingertip);
      delete currentTouches[id];
    }
  }

  function cancelTouch(event) {
    endTouch(event);
  }

  return {
    init : init
  };
})();
