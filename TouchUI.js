$(document).ready(function() {
  TouchUI.init();
});

var TouchUI = (function(){
	var currentTouches = [];

	function init() {
		var box = document.getElementById("sandbox");
		box.addEventListener("touchstart", startTouch);
		box.addEventListener("touchend", endTouch);
		box.addEventListener("touchcancel", cancelTouch);
		box.addEventListener("touchleave", endTouch);
		box.addEventListener("touchmove", moveTouch);
	}

	function startTouch(event) {
		event.preventDefault();
		var box = document.getElementById("sandbox");
		var ctx = box.getContext("2d");

		for (var i = 0; i < event.changedTouches.length; i++) {
			currentTouches.push(event.changedTouches[i]);
			var left = box.offsetLeft;
			var top = box.offsetTop;
			var x = event.changedTouches[i].pageX - left;
			var y = event.changedTouches[i].pageY - top;
			console.log("x: " + x);
			console.log("y: " + y);
		}
	}

	function moveTouch(event) {
		event.preventDefault();
		var box = document.getElementById("sandbox");
		var ctx = box.getContext("2d");

		for (var i = 0; i < event.changedTouches.length; i++) {
			var index = findTouchIndex(event.changedTouches[i].identifier);
			if (index >= 0) {
				var left = box.offsetLeft;
				var top = box.offsetTop;
				var prevX = currentTouches[index].pageX - left;
				var prevY = currentTouches[index].pageY - top;
				var x = event.changedTouches[i].pageX - left;
				var y = event.changedTouches[i].pageY - top;
				console.log("x: " + x);
				console.log("y: " + y);
				console.log("prevX: " + prevX);
				console.log("prevY: " + prevY);

				currentTouches[index] = event.changedTouches[i];
			}
		}
	}

	function endTouch(event) {
		event.preventDefault();
		var box = document.getElementById("sandbox");
		var ctx = box.getContext("2d");

		for (var i = 0; i < event.changedTouches.length; i++) {
			var index = findTouchIndex(event.changedTouches[i].identifier);
			if (index >= 0) {
				var left = box.offsetLeft;
				var top = box.offsetTop;
				var prevX = currentTouches[index].pageX - left;
				var prevY = currentTouches[index].pageY - top;
				var x = event.changedTouches[i].pageX - left;
				var y = event.changedTouches[i].pageY - top;
				console.log("x: " + x);
				console.log("y: " + y);
				console.log("prevX: " + prevX);
				console.log("prevY: " + prevY);
				currentTouches.splice(index, 1); // Poistetaan kyseinen touch
			}
		}
	}

	function cancelTouch(event) {
		endTouch(event);
	}

	function findTouchIndex(find) {
		for (var i = 0; i < currentTouches.length; i++) {
			var id = currentTouches[i].identifier;
			if (id == find) {
				return i
			}
		}
		return -1;
	}
	
	return {
		init : init
	};
})();
