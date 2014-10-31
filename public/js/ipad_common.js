//iPad通用JS程序库


//以下代码段废弃
//翻转效果，已经由css实现
//iPad版应用的文字大小设置功能 已经废弃
//var a = 0;	//默认竖屏
function init_content_class(){
	//return true;
	var str = window.location.hash;
	var font_size_position = str.indexOf('_');
	if(font_size_position != -1){
		var font_size_hash = str.substring(font_size_position);
		str = str.substring(0, font_size_position);
	}
/*	if((window.orientation && window.orientation != 0 && window.orientation != 180) || str == '#landscape'){
		// 通过 通过浏览器变量判断， 浏览器宽度， URL 锚点传值 判断是否为 横屏
		a = 1;
	}*/
	
	var content_div_classname = '';
/*	if(a == 0){
		// iPad 竖屏模式
		content_div_classname = '';
	} else {
		content_div_classname = content_div_classname + " horizontal";
	}
*/	if(font_size_hash == '_large'){
		content_div_classname = content_div_classname + " large";
	} else if (font_size_hash == '_x-large'){
		content_div_classname = content_div_classname + " x-large";
	}
	document.write('<div id="content" class="' + content_div_classname + '">');
}


//屏幕翻转 函数已废弃
function change_screen(a){
	if(need_resize_img){
		resize_img();
	}
	
	return true;
	if(a == undefined){
		var a = window.orientation;
	}
	var content = document.getElementById('content');
	var str = content.className;
	str = str.replace(/horizontal/ig, "");
	if(a == 0 || a == 180){
		// iPad 竖屏模式
		content.className = str;
	} else {
		content.className = str + ' horizontal';
	}
}

//此功能不支持 iPad版应用。函数已废弃
//设置文字大小
function set_font_size(size){
	var content = document.getElementById('content');
	var str = " " + content.className + " ";
	
	if(size == 2){
		var new_class = "x-large";
	} else {
		var new_class = "large";
	}
	
	str = str.replace(" large ", " ");
	str = str.replace(" x-large ", " ");
	
	if(size){
		content.className = str + " " + new_class;
	} else {
		content.className = str;
	}
}

//效果取消，函数废弃
//显示/隐藏 全屏图片的说明文字
function change_image_introduction(){
	var introduction = document.getElementById('image_introduction');
	var arrow = document.getElementById('arrow');

	if(introduction.style.display == ''){
		introduction.style.display = 'none';
		arrow.className = '';
	} else {
		introduction.style.display = '';
		arrow.className = 'down';
	}
}

//打开图库
function show_ipad_img(){
	//window.location = '{jscall}';
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

//获取元素的纵坐标
function getTop(e){
	var offset=e.offsetTop;
	if(e.offsetParent!=null) offset+=getTop(e.offsetParent);
	return offset;
}
//获取元素的横坐标
function getLeft(e){
	var offset=e.offsetLeft;
	if(e.offsetParent!=null) offset+=getLeft(e.offsetParent);
	return offset;
} 

//重置 图库 按钮的位置
function resize_img(){
	var img = document.getElementById("img_ipad");
	var iw = document.getElementById("img_ipad").width -33;
	var ih = document.getElementById("img_ipad").height -33;
	var w = getLeft(img) + iw;
	w = Math.min(w,iw);
	var h = getTop(img) + ih;
	h = Math.min(h,ih);
	document.getElementById("ipad_images_box").style.left = w+"px";
	document.getElementById("ipad_images_box").style.top = h+"px";
}

//为 andriod 分享功能，提供特殊的HTML代码
function get_body_html(){
	//得到html源码
	var html = document.getElementsByTagName("body")[0].innerHTML;
	
	//删除重复的标题,简介等内容
	if(document.getElementById("image_title")){
		var content_title_html = document.getElementById("image_title").innerHTML;
		html = html.replace(new RegExp(content_title_html,"g"), "");
	}
	if(document.getElementById("content_title")){
		var content_title_html = document.getElementById("content_title").innerHTML;
		html = html.replace(new RegExp(content_title_html,"g"), "");
	}
	
	//替换图片
	var images = document.getElementsByTagName("IMG");
	for(i=0,length = images.length;i<length;i++){
		var wrapper = document.createElement("div");
		wrapper.appendChild(images[i].cloneNode(true));
		html = html.replace(wrapper.innerHTML, "<a href='" + images[i].src + "' target='_blank'>点击查看图片</a>");
	}
	
	return html;
}

// 设置 viewport 值
function set_viewport(){
	var meta = document.createElement("META");
	meta.name = "viewport";
	if(window.location.hash.indexOf("glaxayNote") == -1){
		meta.content = "width=800; initial-scale=1.0; maximum-scale=1.0; user-scalable=0;";
	} else {
		// glaxay note 
		meta.content = "width=800; maximum-scale=1.0; user-scalable=1;";
	}
	document.getElementsByTagName("head")[0].appendChild(meta);

	/*<meta name="viewport" content="width=800; maximum-scale=1.0; user-scalable=1;" />
	<meta name="viewport" content="width=800; initial-scale=1.0; maximum-scale=1.0; user-scalable=0;" /> */
}
