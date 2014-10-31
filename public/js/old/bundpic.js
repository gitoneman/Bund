/*
 * 外滩画报广告 点击空白的操作效果
 * 页面加载 init_touch 即可
 */

function init_touch(){
	var images = document.getElementsByTagName("IMG");
	for(var i=0, length=images.length;i<length;i++){
		images[i].ontouchstart = function(){setdt(event);};
		images[i].ontouchend = function(){setut(event);};
		images[i].touchmove = function(){touchMove(event);};
	}
}

var dt = 0;
var ut = 0;
var touchnum = 0;
var old_x,old_y,new_x,new_y, deltaX, deltaY , isTouching = new Array(false);
var callimg = false;
var handle;
function dojscall(){
	if(handle){
		clearTimeout(handle);
	}
	var srcElem = window.event.srcElement;
	var tag = srcElem.tagName;
	var t = ut - dt;
	/*if(tag == "IMG" && t > 800){
		window.location = 'JSCall://touchimage'+srcElem.src;
	}else*/ 
	if(t < 300){
		touchnum = 0;
		window.location = "JSCall://touchBlank";
	}
	return true;
}
function setdt(event){
	if(handle){
		clearTimeout(handle);
	}
	var srcElem = window.event.srcElement;
	var tag = srcElem.tagName;
	touchnum = touchnum + 1;
	if(tag == "IMG" && event.touches.length == 1){
		handle = setTimeout(function(){listen(srcElem.src);},800);
	}
	if(isTouching[0]){
		return;
	}
	//if(event.changedTouches[0] == "undefined"){
		old_x = new_x = event.changedTouches[0].pageX;
		old_y = new_y = event.changedTouches[0].pageY;
		deltaX = deltaY = 0;
	//}
	var myDate = new Date();
	dt = myDate.getTime();
	isTouching[0] = true;
}
function setut(event){
	if(touchnum > 0){
		touchnum = touchnum - 1;
	}
	if(! isTouching[0]){
		return;
	}
	var myDate = new Date();
	ut = myDate.getTime();
	var t = ut - dt;
	if(Math.abs(deltaX) < 20 && Math.abs(deltaY) < 20){ //0.3秒
		dojscall();
	}
	isTouching[0] = false;
	deltaX = deltaY = 0;
}
function touchMove(event) {
	if(! isTouching[0]){
		return;
	}
	var pageX = event.changedTouches[0].pageX;
	var pageY = event.changedTouches[0].pageY;
	//event.preventDefault();
	deltaX = deltaX + pageX - old_x;
	deltaY = deltaY + pageY - old_y;
	
	old_x = pageX;
	old_y = pageY;
}
function listen(path){
	if(isTouching[0]){
		touchnum = 0;
		window.location = 'JSCall://touchimage'+path;
	}
}

//设置 viewport 值
function set_viewport(){
	var meta = document.createElement("META");
	meta.name = "viewport";
	if(navigator.userAgent.indexOf("iPad") != -1){
		meta.content = "width=device-width; initial-scale=1.0; maximum-scale=1.0; user-scalable=0;";
	} else if (window.location.hash.indexOf("glaxayNote") == -1){
		meta.content = "width=800; initial-scale=1.0; maximum-scale=1.0; user-scalable=0;";
	} else {
		// glaxay note 
		meta.content = "width=800; maximum-scale=1.0; user-scalable=1;";
	}
	document.getElementsByTagName("head")[0].appendChild(meta);

	/*<meta name="viewport" content="width=800; maximum-scale=1.0; user-scalable=1;" />
	<meta name="viewport" content="width=800; initial-scale=1.0; maximum-scale=1.0; user-scalable=0;" /> */
}
