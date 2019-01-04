/**
 *julia集
 */
(function() {
    'use strict';

    var RANGE_X = 1.5;
    var RANGE_Y = 1;
	

    function JuliaFractal(maxWidth, maxHeight) {
        this.maxWidth = maxWidth;
        this.maxHeight = maxHeight;

        this.cvsElem = document.getElementById("julia");
        this.cvs = this.cvsElem.getContext("2d");		
        this.imgData = this.cvs.createImageData(2 * this.maxWidth + 1, 2 * this.maxHeight * 2 + 1);
        this.listForTest = [];
        this.maxEscapeTime = 200;
        this.stepX = RANGE_X / this.maxWidth;
        this.stepY = RANGE_Y / this.maxHeight;
        console.log(this.stepX, this.stepY);
        this.posHistory = new Array();
        this.posHistory.push([RANGE_X, RANGE_Y]);
		this.preA = null;
        this.preB = null;
		this.emptyData = this.cvs.createImageData(2 * this.maxWidth + 1, 2 * this.maxHeight * 2 + 1);//空白对象

    }

    JuliaFractal.prototype.mod = function(x, y) {
        return x * x + y * y;
    }

    /**
     *是否收敛
     */
    JuliaFractal.prototype.doConverge = function(x, y, zx, zy) {
        var xa;
        for (var i = 0; i < 200; i++) {
            if (this.mod(x, y) > 4) {
                return i;
            }

            xa = x;
            x = x * x - y * y + zx;
            y = 2 * xa * y + zy;

        }

        return i;
    }

    JuliaFractal.prototype.render = function(xx, yy, c, ci, zoomOut) {
        var a = 4;
        var b = this.maxWidth * 8 + 4;
        var d = this.maxWidth * this.maxHeight * 8 + 4 * (this.maxWidth + this.maxHeight);

        if (zoomOut == 1) {
            var pointx = 0;
            var pointy = 0;
        } else if (zoomOut > 1) {
            var posHistory = this.posHistory.pop();
			this.preA = posHistory[0];
			this.preB = posHistory[1];//新增
            var pointx = math.subtract(math.multiply(this.stepX / (zoomOut / 2), (this.maxWidth + xx)), posHistory[0]);
            var pointy = strip(math.subtract(math.multiply(this.stepY / (zoomOut / 2), (this.maxHeight + yy)), posHistory[1]));
            console.log("XY", pointx, pointy);
            this.posHistory.push([math.subtract((RANGE_X / zoomOut), pointx), math.subtract((RANGE_Y / zoomOut), pointy)]);

            console.log("pop", this.posHistory, zoomOut);
        }

        for (var j = -this.maxHeight; j <= this.maxHeight; j++) for (var i = -this.maxWidth; i <= this.maxWidth; i++) {

            var x = pointx + math.multiply((this.stepX) / zoomOut, i); //math.subtract(math.multiply(0.0025/this.precise, (this.maxWidth + i)), 1.5);
            var y = pointy + math.multiply((this.stepY) / zoomOut, j); //strip(math.subtract(math.multiply(0.0025/this.precise, (this.maxHeight + j)), 1));
            var val = this.doConverge(x, y, c, ci);

            var rgb = this.rgbNum(val);
          
            this.imgData.data[a * i - b * j + d] = rgb[0];
            this.imgData.data[a * i - b * j + d + 1] = rgb[1];
            this.imgData.data[a * i - b * j + d + 2] = rgb[2];
            this.imgData.data[a * i - b * j + d + 3] = rgb[3];
        }
        console.log(this.imgData);
        this.cvs.putImageData(this.imgData, 0, 0);

    }
	
	/**
	 *返回八个边的数据
	 */
	JuliaFractal.prototype.returnSidesData = function(xx,yy,c,ci,zoomOut,direction){
		
		var a = 4;
        var b = this.maxWidth * 8 + 4;
        var d = this.maxWidth * this.maxHeight * 8 + 4 * (this.maxWidth + this.maxHeight);
        
		var imgData = this.cvs.createImageData(2 * this.maxWidth + 1, 2 * this.maxHeight * 2 + 1);
		console.log("sides normal",xx,yy,
		this.preA,
		this.preB,this.maxHeight,this.maxWidth,c,
		ci,
		zoomOut,direction);
		switch(direction)//顺时针方向
        {
        case 1:
        yy = yy+ this.maxHeight;
        break;
        case 2:
        yy = yy+ this.maxHeight,xx=xx+this.maxWidth;
        break;
		case 3:
        xx+=this.maxWidth;
        break;
        case 4:
        yy = yy- this.maxHeight,xx=xx+this.maxWidth;
        break;
		case 5:
        yy = yy- this.maxHeight;
        break;
        case 6:
        yy = yy- this.maxHeight,xx=xx-this.maxWidth;
        break;
		case 7:
        xx = xx- this.maxWidth;
        break;
        case 8:
        yy = yy+ this.maxHeight,xx=xx-this.maxWidth;
        break;
        
        }
		
		var cvsTempDom = document.createElement('canvas');
		var cvsTemp = cvsTempDom.getContext('2d');
		cvsTempDom.width = this.maxWidth*2;
		cvsTempDom.height = this.maxHeight*2;
		
        if (zoomOut == 1) {
            var pointx = 0;
            var pointy = 0;
        } else if (zoomOut >= 2) {
           console.log("preA",this.preA);
		   console.log("preB",this.preB);
            var pointx = math.subtract(math.multiply(this.stepX / (zoomOut / 2), (this.maxWidth + xx)), this.preA);
            var pointy = strip(math.subtract(math.multiply(this.stepY / (zoomOut / 2), (this.maxHeight + yy)), this.preB));
            console.log("XY", pointx, pointy);           

        }

        for (var j = -this.maxHeight; j <= this.maxHeight; j++) for (var i = -this.maxWidth; i <= this.maxWidth; i++) {

            var x = pointx + math.multiply((this.stepX) / zoomOut, i); //math.subtract(math.multiply(0.0025/this.precise, (this.maxWidth + i)), 1.5);
            var y = pointy + math.multiply((this.stepY) / zoomOut, j); //strip(math.subtract(math.multiply(0.0025/this.precise, (this.maxHeight + j)), 1));
            var val = this.doConverge(x, y, c, ci);

            var rgb = this.rgbNum(val);
          
            imgData.data[a * i - b * j + d] = rgb[0];
            imgData.data[a * i - b * j + d + 1] = rgb[1];
            imgData.data[a * i - b * j + d + 2] = rgb[2];
            imgData.data[a * i - b * j + d + 3] = rgb[3];
			
        }
		
		cvsTemp.putImageData(imgData, 0, 0);
		console.log("sides!");
		//this.cvs.drawImage(cvsTempDom, 0, 0);
		return cvsTempDom;
	}
	
	JuliaFractal.prototype.returnSidesData1 = function(xx,yy,c,ci,zoomOut,direction){
		console.log({xx:xx,
	                    yy:yy,
						c:c,
						ci:ci,
						preA:this.preA,
						preB:this.preB,
						maxWidth:this.maxWidth,
						maxHeight:this.maxHeight,
						zoomOut:zoomOut,
						direction:direction,
                        imgData:this.emptyData		
						});
	    worker[direction].postMessage({xx:xx,
	                    yy:yy,
						c:c,
						ci:ci,
						preA:this.preA,
						preB:this.preB,
						maxWidth:this.maxWidth,
						maxHeight:this.maxHeight,
						zoomOut:zoomOut,
						direction:direction,
                        imgData:this.emptyData		
						});
	}

    JuliaFractal.prototype.rgbNum = function(escapeTime) {
		
		     var R = 254 * (escapeTime/255);			 
			 var G = 200 * (escapeTime/255);
			 var B = 201 * (escapeTime/255);
			 var ALPHA = 255;
			 return [R, G, B, ALPHA];	
    };

    window.JuliaFractal = JuliaFractal;
})();