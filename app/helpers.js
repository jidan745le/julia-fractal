function throttle(method,timeDiff,context,arg){
	method.curTime = new Date().getTime();
	if(!method.preTime || method.curTime-method.preTime > timeDiff){
		method.preTime = method.curTime;
		method.apply(context,arg);
	}
	
}