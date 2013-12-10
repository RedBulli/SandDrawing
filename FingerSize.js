$(document).ready(function() {
    window.addEventListener("keydown", changeSize);
    
    function changeSize(e) {
    	if(e.keyCode == 38) {
    		FINGERTIP_RADIUS += 1;
    	}
    	
    	else if(e.keyCode == 40) {
    		FINGERTIP_RADIUS -= 1;
    	}
    }
});
