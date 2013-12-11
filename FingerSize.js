$(document).ready(function() {
    window.addEventListener("keydown", changeSize);
    
    function changeSize(e) {
    	if(e.keyCode == 49) {
    		FINGERTIP_RADIUS += 1;
    	}
    	
    	else if(e.keyCode == 50) {
    		FINGERTIP_RADIUS -= 1;
    	}
    }
});
