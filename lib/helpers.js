/**
 *helper function
 */
function fullScreen(){	   
	var doc = document.documentElement;
    (doc.requestFullscreen||doc.webkitRequestFullscreen||doc.mozRequestFullscreen||doc.msRequestFullscreen).call(doc);
}


function strip(num, precision = 12) {
    return +parseFloat(num.toPrecision(precision));
}

         
function download(){
    var canvas = document.getElementById("julia");
	Canvas2Image.saveAsJPEG(canvas); 
    
}
