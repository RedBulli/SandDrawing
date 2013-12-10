$(document).ready(function() {
    window.addEventListener("keydown", changeSize);
    
    function changeSize(e) {
    	if(e.keyCode == 38) {
    		console.log('+');
    		FINGERTIP_RADIUS += 1;
    	}
    	
    	else if(e.keyCode == 40) {
    		console.log('-');
    		FINGERTIP_RADIUS -= 1;
    	}
    }
});
