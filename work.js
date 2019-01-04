importScripts("lib/math.js");  
function strip(num, precision = 12) {
    return +parseFloat(num.toPrecision(precision));
}
   function mod(x, y) {
        return x * x + y * y;
    }
	 
	 function doConverge(x, y, zx, zy){
		var xa;
        for (var i = 0; i < 200; i++) {
            if (this.mod(x, y) > 4){
                return i;
            }
            xa = x;
            x = x * x - y * y + zx;
            y = 2 * xa * y + zy;
			 }
        return i;
	 }
	 
	 /**
	 *返回八个边的数据
	 */
	function returnSides(xx,yy,c,ci,preA,preB,maxWidth,maxHeight,zoomOut,direction,imgData){
		var stepX = 1.5/maxWidth;
		var stepY = 1/maxHeight;
		var a = 4;
        var b = maxWidth * 8 + 4;
        var d = maxWidth * maxHeight * 8 + 4 * (maxWidth + maxHeight);
        
		//var imgData = this.cvs.createImageData(2 * this.maxWidth + 1, 2 * this.maxHeight * 2 + 1);//空白对象
		console.log("sides thread",xx,yy,preA,preB,maxWidth,maxHeight,c,ci,zoomOut,direction);
		switch(direction)//顺时针方向
        {
        case 1:
        yy = yy+ maxHeight;
        break;
        case 2:
        yy = yy+ maxHeight,xx=xx+maxWidth;
        break;
		case 3:
        xx+=maxWidth;
        break;
        case 4:
        yy = yy- maxHeight,xx=xx+maxWidth;
        break;
		case 5:
        yy = yy- maxHeight;
        break;
        case 6:
        yy = yy- maxHeight,xx=xx-maxWidth;
        break;
		case 7:
        xx = xx- maxWidth;
        break;
        case 8:
        yy = yy+ maxHeight,xx=xx-maxWidth;
        break;        
        }	
		
        if (zoomOut == 1) {
            var pointx = 0;
            var pointy = 0;
        } else if (zoomOut >= 2) {
           console.log("preA",preA);
            var pointx = math.subtract(math.multiply(stepX / (zoomOut / 2), (maxWidth + xx)), preA);
            var pointy = strip(math.subtract(math.multiply(stepY / (zoomOut / 2), (maxHeight + yy)), preB));
            console.log("XY", pointx, pointy); 
        }

        for (var j = -maxHeight; j <= maxHeight; j++) for (var i = -maxWidth; i <= maxWidth; i++) {

            var x = pointx + math.multiply((stepX) / zoomOut, i); //math.subtract(math.multiply(0.0025/this.precise, (this.maxWidth + i)), 1.5);
            var y = pointy + math.multiply((stepY) / zoomOut, j); //strip(math.subtract(math.multiply(0.0025/this.precise, (this.maxHeight + j)), 1));
            var val = doConverge(x, y, c, ci);

            var rgb = rgbNum(val);          
            imgData.data[a * i - b * j + d] = rgb[0];
            imgData.data[a * i - b * j + d + 1] = rgb[1];
            imgData.data[a * i - b * j + d + 2] = rgb[2];
            imgData.data[a * i - b * j + d + 3] = rgb[3];
			
        }
				
		//this.cvs.drawImage(cvsTempDom, 0, 0);
		return imgData;
	}
	
	 function rgbNum(escapeTime) {		
		     var R = 254 * (escapeTime/255);			 
			 var G = 200 * (escapeTime/255);
			 var B = 201 * (escapeTime/255);
			 var ALPHA = 255;
			 return [R, G, B, ALPHA];	
    }



self.addEventListener('message', function (e) {
  var data = e.data;
  
  switch (data.cmd) {
    case 'start':
      self.postMessage(1);
      break;
    case 'stop':
      self.postMessage(2);
      self.close(); // Terminates the worker.
      break;
    default:
	//xx,yy,c,ci,preA,preB,maxWidth,maxHeight,zoomOut,direction
      self.postMessage({data:returnSides(data.xx,data.yy,data.c,data.ci,data.preA,data.preB,data.maxWidth,data.maxHeight,data.zoomOut,data.direction,data.imgData),dir:data.direction});
  };
}, false);