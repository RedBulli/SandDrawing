var TouchUI = (function(){
  var currentTouches = []; // Store the fingertip objects by touch id. The array may contain gaps.
  var canvas;
  function init(canvasEl) {
    canvas = canvasEl;
    canvas.addEventListener("touchstart", startTouch);
    canvas.addEventListener("touchend", endTouch);
    canvas.addEventListener("touchcancel", cancelTouch);
    canvas.addEventListener("touchleave", endTouch);
    canvas.addEventListener("touchmove", moveTouch);
  }

  function getTouches() {
    return currentTouches;
  }

  function getEventCoords(event) {
    return {
      x: event.pageX - canvas.offsetLeft,
      y: event.pageY - canvas.offsetTop
    };
  }

  function startTouch(event) {
    event.preventDefault();
    for (var i = 0; i < event.changedTouches.length; i++) {
      var touch = event.changedTouches[i];
      currentTouches[touch.identifier] = new Fingertip(getEventCoords(touch));
    }
  }

  function moveTouch(event) {
    event.preventDefault();

    for (var i = 0; i < event.changedTouches.length; i++) {
      var touch = event.changedTouches[i];
      currentTouches[touch.identifier].moveTo(getEventCoords(touch));
    }
  }

  function endTouch(event) {
    event.preventDefault();

    for (var i = 0; i < event.changedTouches.length; i++) {
      delete currentTouches[event.changedTouches[i].identifier];
    }
  }

  function cancelTouch(event) {
    endTouch(event);
  }

  function copyArray() {
    var arr = [];
    for (var i = 0; i < currentTouches.length; i++) {
      if (currentTouches[i]) {
        arr.push(currentTouches[i].prevX);
        arr.push(currentTouches[i].prevY);
        arr.push(currentTouches[i].x);
        arr.push(currentTouches[i].y);
      }
    }
    return arr;
  }

  function resetPrevValues() {
    for (var i = 0; i < currentTouches.length; i++) {
      if (currentTouches[i]) {
        currentTouches[i].prevX = currentTouches[i].x;
        currentTouches[i].prevY = currentTouches[i].y;
      }
    }
  }

  function getArrayCopy() {
    var arr = [];
    for (var i = 0; i < currentTouches.length; i++) {
      if (currentTouches[i]) {
        arr.push({
          prevX: currentTouches[i].prevX,
          prevY: currentTouches[i].prevY,
          x: currentTouches[i].x,
          y: currentTouches[i].y
        });
      }
    }
    return arr;
  }

  return {
    init : init,
    getTouches : getTouches,
    getArrayCopy : getArrayCopy,
    copyArray : copyArray,
    resetPrevValues : resetPrevValues
  };
})();
