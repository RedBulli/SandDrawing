function addListeners() {
	var box = document.getElementById("sandbox");
	box.addEventListener("touchstart", start);
	box.addEventListener("touchend", end);
	box.addEventListener("touchcancel", cancel);
	box.addEventListener("touchleave", end);
	box.addEventListener("touchmove", move);
}

var currentTouches = New Array(); // ongoing touches
var x;
var y;
var prevX;
var prevY;

function start(event) {
	event.preventDefault();
	var box = document.getElementById("sandbox");
	var ctx = box.getContext("2d");

	for (var i = 0; i < event.changedTouches.length; i++) {
		currentTouches.push(event.changedTouches[i]);
		x = event.changedTouches[i].pageX;
		y = event.changedTouches[i].pageY;
		// Mitä näille tehdään?
	}
}

function move(event) {
	event.preventDefault();
	var box = document.getElementById("sandbox");
	var ctx = box.getContext("2d");

	for (var i = 0; i < event.changedTouches.length; i++) {
		var index = findTouchIndex(event.changedTouches[i].identifier);
		if (index >= 0) {
			prevX = currentTouches[index].pageX;
			prevY = currentTouches[index].pageY;
			x = event.changedTouches[i].pageX;
			y = event.changedTouches[i].pageY;
			// Mitä näille tehdään?

			currentTouches[index] = event.changedTouches[i];
			// Voiko näin edes tehdä
		}
	}
}

function end(event) {
	event.preventDefault();
	var box = document.getElementById("sandbox");
	var ctx = box.getContext("2d");

	for (var i = 0; i < event.changedTouches.length; i++) {
		var index = findTouchIndex(event.changedTouches[i].identifier);
		if (index >= 0) {
			prevX = currentTouches[index].pageX;
			prevY = currentTouches[index].pageY;
			x = event.changedTouches[i].pageX;
			y = event.changedTouches[i].pageY;
			// Mitä näille tehdään?
			currentTouches.splice(index, 1); // Poistetaan kyseinen touch
		}
	}
}

function cancel(event) {
	// Tarvitaanko tätä edes
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
