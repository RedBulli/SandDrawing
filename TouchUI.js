function TouchUI(){
	this.currentTouches = New Array(); // ongoing touches
}

TouchUI.prototype.addListeners = function() {
	var box = document.getElementById("sandbox");
	box.addEventListener("touchstart", startTouch);
	box.addEventListener("touchend", endTouch);
	box.addEventListener("touchcancel", cancelTouch);
	box.addEventListener("touchleave", endTouch);
	box.addEventListener("touchmove", moveTouch);
}

TouchUI.prototype.startTouch = function(event) {
	event.preventDefault();
	var box = document.getElementById("sandbox");
	var ctx = box.getContext("2d");

	for (var i = 0; i < event.changedTouches.length; i++) {
		this.currentTouches.push(event.changedTouches[i]);
		var x = event.changedTouches[i].pageX;
		var y = event.changedTouches[i].pageY;
		// Mitä näille tehdään?
	}
}

TouchUI.prototype.moveTouch = function(event) {
	event.preventDefault();
	var box = document.getElementById("sandbox");
	var ctx = box.getContext("2d");

	for (var i = 0; i < event.changedTouches.length; i++) {
		var index = findTouchIndex(event.changedTouches[i].identifier);
		if (index >= 0) {
			var prevX = this.currentTouches[index].pageX;
			var prevY = this.currentTouches[index].pageY;
			var x = event.changedTouches[i].pageX;
			var y = event.changedTouches[i].pageY;
			// Mitä näille tehdään?

			this.currentTouches[index] = event.changedTouches[i];
		}
	}
}

TouchUI.prototype.endTouch = function(event) {
	event.preventDefault();
	var box = document.getElementById("sandbox");
	var ctx = box.getContext("2d");

	for (var i = 0; i < event.changedTouches.length; i++) {
		var index = findTouchIndex(event.changedTouches[i].identifier);
		if (index >= 0) {
			var prevX = this.currentTouches[index].pageX;
			var prevY = this.currentTouches[index].pageY;
			var x = event.changedTouches[i].pageX;
			var y = event.changedTouches[i].pageY;
			// Mitä näille tehdään?
			this.currentTouches.splice(index, 1); // Poistetaan kyseinen touch
		}
	}
}

TouchUI.prototype.cancelTouch = function(event) {
	// Tarvitaanko tätä edes
}

TouchUI.prototype.findTouchIndex = function(find) {
	for (var i = 0; i < this.currentTouches.length; i++) {
		var id = this.currentTouches[i].identifier;
		if (id == find) {
			return i
		}
	}
	return -1;
}
