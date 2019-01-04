//常规参数
var cvsElem =document.getElementById("julia");
var clientHeight = document.documentElement.clientHeight-25;
cvsElem.width = clientHeight*1.5;
cvsElem.height = clientHeight;
var TOTAL_HALF_WIDTH = (cvsElem.width-1)/2;
var TOTAL_HALF_HEIGHT = (cvsElem.height-1)/2;
var moveX=0;
var moveY=0;
var w = 0;
var h = 0;
var moveTimer;
var expandTimer;
var loop = 0;
var step = 10;
var interval = 20;
var animateFinishedTime=0;

//上下左右的julia块具体位置
var ltp = new Point(-(TOTAL_HALF_WIDTH*2),-(TOTAL_HALF_HEIGHT*2));
var lp = new Point(-(TOTAL_HALF_WIDTH*2),0); 
var lbp = new Point(-(TOTAL_HALF_WIDTH*2),(TOTAL_HALF_HEIGHT*2));
var bp = new Point(0,(TOTAL_HALF_HEIGHT*2));
var rbp = new Point((TOTAL_HALF_WIDTH*2),(TOTAL_HALF_HEIGHT*2));
var rp = new Point((TOTAL_HALF_WIDTH*2),0);
var rtp = new Point((TOTAL_HALF_WIDTH*2),-(TOTAL_HALF_HEIGHT*2));
var tp = new Point(0,-(TOTAL_HALF_HEIGHT*2));
var origin =new Point(0,0);

/**
  类:点
 */
function Point(x,y){
	this.x = x;
	this.y = y;
	this.add = function(p){
		return new Point(this.x+p.x,this.y+p.y)
	}
}

/**
  函数说明:偏移一个canvas块由p位置以v方向和距离移动
  图示: ■ ↑↓←→
  @params ctx:渲染场景
  @params cvsElem:要偏移的canvas元素的dom对象
  @params p:要偏移的canvas元素的位置 ,左上角 {x:x,y:y}
  @params v:向量
  
 */
function moveCanvasChunk(ctx,cvsElem,p,v){
	if(cvsElem&&ctx){		
	    ctx.drawImage(cvsElem,p.x+v.x,p.y+v.y);
	}
	
}

/**
  函数说明:偏移一个大canvas块由p位置以v方向和距离移动
  图示:■ ■ ■
	   ■ ■ ■ ↑↓←→
	   ■ ■ ■	
  @params ctx:渲染场景  
  @params p:要偏移的canvas元素的位置 ,左上角 {x:x,y:y}
  @params v:向量
  
 */
function moveWholeGraph(ctx,vector,offset){
	 moveCanvasChunk(ctx,cvsBuffer,origin.add(offset),vector);
	 moveCanvasChunk(ctx,cvsBufferLeft,lp.add(offset),vector);
	 moveCanvasChunk(ctx,cvsBufferRight,rp.add(offset),vector);
	 moveCanvasChunk(ctx,cvsBufferTop,tp.add(offset),vector);
	 moveCanvasChunk(ctx,cvsBufferBottom,bp.add(offset),vector);
	 moveCanvasChunk(ctx,cvsBufferBottomLeft,lbp.add(offset),vector);
	 moveCanvasChunk(ctx,cvsBufferBottomRight,rbp.add(offset),vector);
	 moveCanvasChunk(ctx,cvsBufferTopLeft,ltp.add(offset),vector);
	 moveCanvasChunk(ctx,cvsBufferTopRight,rtp.add(offset),vector);
}

/**
  函数说明:开始移动并放大julia图到锁定位置处。 
 */
function animateProcess(cvsElem,tx,ty,zoomLevel,render){	
	return setInterval(()=>{
		moveJuliaGraph(cvsElem,tx,ty,zoomLevel,render);
	},interval);
}

function moveJuliaGraph(cvsElem,tx,ty,zoomLevel,render){
	let ctx = cvsElem.getContext('2d');
	//canvas快照,保存在animateProcess函数中
	if(loop == 0){
	animateProcess.cvsBuffer = cloneCanvas(cvsElem);	
		animateProcess.stepX = tx/step;
		animateProcess.stepY = ty/step;
	    animateProcess.vector = {x:-animateProcess.stepX,y:animateProcess.stepY};	
	}	 
	
    if(loop>step){
	clearInterval(moveTimer);
	console.log("click position interval:",tx,ty,c,d,zoomLevel);	
	loop =0;
	moveX=0;
    moveY=0;
	expandTimer = setInterval(()=>{expandJuliaGraph(cvsElem,tx,ty,zoomLevel,render)},interval);
	return;
	}
	ctx.clearRect(0,0,(TOTAL_HALF_WIDTH*2+1),(TOTAL_HALF_HEIGHT*2+1));//清空canvas
	moveCanvasChunk(ctx,animateProcess.cvsBuffer,origin,{x:moveX,y:moveY});
	if(cvsBufferLeft){	       	
     let vector = {x:moveX,y:moveY};
	 let offset = new Point(mX,mY);
	 moveWholeGraph(ctx,vector,offset);
	}
	moveX=moveX-animateProcess.stepX;
	moveY=moveY+animateProcess.stepY;
	loop++;	
	console.log(moveX,moveY);
	
}

function expandJuliaGraph(cvsElem,tx,ty,zoomLevel,render){
	if(loop == 0){
	animateProcess.cvsBuffer = cloneCanvas(cvsElem);	
	animateProcess.stepW = (TOTAL_HALF_WIDTH*2+1)/step;
	animateProcess.stepH = (TOTAL_HALF_HEIGHT*2+1)/step;
	}
	
	if(loop>step){
	clearInterval(expandTimer);
	console.log("lock click 20",lock);
	console.log("click position interval 1:",tx,ty,c,d,zoomLevel);	
	console.log("click position interval 2:",mX,mY,c,d,zoomLevel);	
	render.bind(julia)(tx-mX,ty+mY,c,d,zoomLevel);
	julia.returnSidesData1.bind(julia)(tx-mX,ty+mY,c,d,zoomLevel,1);
	julia.returnSidesData1.bind(julia)(tx-mX,ty+mY,c,d,zoomLevel,2);
	julia.returnSidesData1.bind(julia)(tx-mX,ty+mY,c,d,zoomLevel,3);
	julia.returnSidesData1.bind(julia)(tx-mX,ty+mY,c,d,zoomLevel,4);
	julia.returnSidesData1.bind(julia)(tx-mX,ty+mY,c,d,zoomLevel,5);
	julia.returnSidesData1.bind(julia)(tx-mX,ty+mY,c,d,zoomLevel,6);
	julia.returnSidesData1.bind(julia)(tx-mX,ty+mY,c,d,zoomLevel,7);
	julia.returnSidesData1.bind(julia)(tx-mX,ty+mY,c,d,zoomLevel,8);
		
	cvsBuffer = cloneCanvas(cvsElem);
	console.log("lock click 201",lock);
	loop =0;
	moveX=0;
    moveY=0;
	w=0;
	h=0;
	mX = 0;	
    mY = 0;
	lock = false;
	animateFinishedTime = new Date().getTime();
	console.log(animateFinishedTime);
	setBufferEmpty();
	return;
	}
	console.log("lock click",lock);
	let ctx = cvsElem.getContext('2d');
	ctx.clearRect(0,0,(TOTAL_HALF_WIDTH*2+1),(TOTAL_HALF_HEIGHT*2+1));//清空canvas
	ctx.drawImage(animateProcess.cvsBuffer,moveX,moveY,(TOTAL_HALF_WIDTH*2+1)+w,(TOTAL_HALF_HEIGHT*2+1)+h);
	w = w+animateProcess.stepW;
	h = h+animateProcess.stepH;
	moveX = moveX-animateProcess.stepW/2;
	moveY = moveY-animateProcess.stepH/2;
	console.log(moveX,moveY,w,h,'expandJuliaGraph');
	loop++;	
	
}