// APP 公用 JS 效果库


//公用 JS
function $(id){
	return document.getElementById(id);
}
Element.prototype.hasClass = function(className){
	if(!className){
		return false;
	}
	var old_className = " " + this.className + " ";
	if(old_className.indexOf(" " + className + " ") == -1){
		return false;
	} else {
		return true;
	}
}
Element.prototype.addClass = function(className){
	if(!className){
		return this;
	}
	this.className = this.className + " " + className;
	if ( !this.className ) {
		this.className = className;
	} else {
		var old_className = " " + this.className + " ";
		if ( old_className.indexOf( " " + className + " " ) < 0 ) {
			this.className += " " + className;
		}
	}
	return this;
}
Element.prototype.removeClass = function(className){
	if(!className){
		return this;
	}
	if(this.className == className){
		var old_className = " " + this.className + " ";
		old_className = old_className.replace(" " + className + " ", " ");
		this.className = old_className.substring(1, old_className.length - 1);
	} else {
		this.className = "";
	}
	return this;
}
Element.prototype.closest_scroller = function(){
	if(this.className.match(/\bscroller\b/)){
		return this;
	} else if(this.tagName == "BODY") {
		return false;
	} else if (this.parentNode){
		return this.parentNode.closest_scroller();
	} else {
		return false;
	}
}

//图片轮换
function iSwitch(ele, i, time){
	this.index = i;
	this.time = (time) ? time * 1000 : 4000;
	this.switch_lis = ele.getElementsByTagName("LI");
	/*if(duration){
		for(i=0;i<this.switch_lis.length;i++){
			this.switch_lis[i].style.webkitTransitionDuration = duration + "s";
			this.switch_lis[i].style.MozTransitionDuration = duration ;
		}
	}*/
}
iSwitch.prototype.start = function() {
	if(this.switch_timer){
		return;
	}
	var i = this.index;
//	this.imageSwitch();	防止CSS渲染未完成，增加 timeout
	setTimeout(function(){imageSwitch(i);}, 100);
	this.switch_timer = setInterval(function(){imageSwitch(i);}, this.time);
}
iSwitch.prototype.stop = function() {
	if(! this.switch_timer){
		return;
	}
	clearInterval(this.switch_timer);
	this.switch_timer = false;
}
iSwitch.prototype.imageSwitch = function(){
	switch_lis = this.switch_lis;
	for(i=0;i<switch_lis.length;i++){
		if(switch_lis[i].hasClass("in")){
			break;
		}
	}
	var index = i;
	
	var new_display_li = index + 1;
	if(index == (switch_lis.length - 1)){
		new_display_li = 0;
	}
	
	switch_lis[new_display_li].addClass("in");
	switch_lis[index].removeClass("in");
}
function imageSwitch(index){
	image_switch_list[index].iSwitch.imageSwitch();
}
/* -- demo --

image_switch_list = document.getElementsByClassName("switch_img");
for(i=0;i<image_switch_list.length;i++){
	//初始化变量，并未 开始轮换
	image_switch_list[i].iSwitch = new iSwitch(image_switch_list[i], i);
}*/

//音频扩展函数
Audio.prototype.toggle = function(){
	if(this.paused){
		this.iPlay();
	} else {
		this.iStop();
	}
}
Audio.prototype.iPlay = function(){
	if(! this.paused){
		return;
	}
	this.play();
	if(this.iControls){
		this.iControls.removeClass("play").addClass('stop');
	}
}
Audio.prototype.iStop = function(){
	if(this.paused){
		return;
	}
	this.pause();
	if(this.iControls){
		this.iControls.removeClass("stop").addClass('play');
	}
}

function videoController(ele, index){
	this.video = ele;
	this.index = index;
	this.iControls = document.getElementById(ele.id + "_controls");
	if(this.iControls){
		var i = index;
		this.iControls.onclick = function(){
			video_list[i].toggle();
		};
	}
}

videoController.prototype.toggle = function(){
	if(this.video.paused || this.video.ended){
		this.iPlay();
	} else {
		this.iStop();
	}
}
videoController.prototype.iPlay = function(){
	if(navigator.userAgent.indexOf("Android") !== -1){
		window.location = "JSCall://OpenVideoForAndroid=" + this.video.src;
		return;
	}
	if(! this.video.paused && ! this.video.ended){
		return;
	}
	this.video.play();
	if(this.iControls){
		this.iControls.removeClass("play").addClass('stop');
		
		var i = this.index;
		this.check_timer = setInterval(function(){videoCheckStatus(i);}, 100);
	}
}
videoController.prototype.iStop = function(){
	if(this.video.paused || this.video.ended){
		return;
	}
	this.video.pause();
	if(this.iControls){
		this.iControls.removeClass("stop").addClass('play');
		clearInterval(this.check_timer);
	}
}

//循环需要一个独立的函数
function videoCheckStatus(index){
	if(video_list[index].iControls && video_list[index].video.ended){
		video_list[index].iControls.removeClass("stop").addClass('play');
		clearInterval(video_list[index].check_timer);
	}
}

/* -- demo --
var video_list = new Array(), video_list_2 = document.getElementsByTagName("VIDEO");
for(i=0, len = video_list_2.length ; i<len; i++){
	video_list[i] = new videoController(video_list_2[i], i);
}*/


	
/*	//音频
	audio_list = document.getElementsByTagName("AUDIO");
	for(i=0, len = audio_list.length ; i<len; i++){
		audio_list[i].iControls = $(audio_list[i].id + "_controls");
		if(audio_list[i].iControls){
			var index = i;
			audio_list[i].iControls.onclick = function(){
				audio_list[index].toggle();
			};
			audio_list[i].iControls.addEventListener("touchend", function(e){
				e.stopPropagation();
			});
		}
	}
	
*/

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

