window.onload = function() {
	resizeObj.resize();
	var btn = document.querySelector('.btn');
	var join = document.querySelector('.join');
	var name = document.querySelector('.name');
	var tel = document.querySelector('.tel');
	var ok = document.querySelector('.ok');
	var meng = document.querySelector('.meng');
	var content = document.querySelector('.content');
	ok.onclick = function() {
		meng.style.display = 'none';
	}
	btn.addEventListener('click', function() {
		if (!(/^1[3|4|5|7|8][0-9]\d{4,8}$/.test(tel.value))) {
			meng.style.display = 'block';
			content.innerHTML = '手机信息填写错误!';
			return false;
		}
		if (join.value != '' && name.value != '' && tel.value != '') {
			var formData={};
			formData.appid='mla';
			formData.name=name.value;
			formData.tel=tel.value;
			formData.comments=join.value;
			$.ajax({
				type: "get",
				url: "http://case.h6app.com/Form/submit",
				async: true,
				data: formData,
				dataType: "jsonp",
				success: function(data) {
					if (data.code == 0) {
						meng.style.display = 'block';
						content.innerHTML = '您的信息已提交成功，感谢参与!';
						join.value = '';
						name.value = '';
						tel.value = '';
					}
				},
				error: function(e) {
					console.log(e);
					meng.style.display = 'block';
					content.innerHTML = '网络错误!';
				}
			});


		} else {
			meng.style.display = 'block';
			content.innerHTML = '信息填写不完整！';
		}
	}, false);
	join.onfocus = function() {
		if (join.innerHTML = '请输入20字以内宣言') {
			join.innerHTML = '';
		}
	}
	join.onblur = function() {
		if (join.innerHTML = '') {
			oin.innerHTML = '请输入20字以内宣言';
		} else if (join.innerHTML.length > 23) {
			join.innerHTML = join.innerHTML.substr(0, 23);
		}
	}
	document.onkeydown = examin;
	document.onkeyup = examin;
	join.onchange = examin;

	function examin() {
		if (join.innerHTML.length > 23 || join.value.length > 23) {
			join.innerHTML = join.innerHTML.substr(0, 23);
			join.value = join.value.substr(0, 23);
		}
	}
}



var isConver = false;
(function() {
	window.resizeObj = {
		size: {
			scale: 1,
			maxWidth: 640,
			maxHeight: 1080
		},
		resize: function resize() {
			var maxWidth = resizeObj.size.maxWidth,
				maxHeight = resizeObj.size.maxHeight;
			var currWidth = document.body.clientWidth;
			var currHeight = document.body.clientHeight;
			var lefts = (currWidth - maxWidth) / 2;
			var layerTop = (currHeight - maxHeight) / 2;
			if (currWidth / maxWidth < 1) {
				isConver = true;
			} else {
				isConver = false;
			}
			var scale = (isConver ? Math.max : Math.min)(currWidth / maxWidth, currHeight / maxHeight); //固定比率 变尺寸
			resizeObj.size.scale = scale;

			$("#box").css({
				WebkitTransform: "scale(" + scale + "," + scale + ")",
				WebkitTransformOrigin: "center",
				MsTransform: "scale(" + scale + "," + scale + ")",
				MsTransformOrigin: "center",
				MozTransform: "scale(" + scale + "," + scale + ")",
				MozTransformOrigin: "center",
				transform: "scale(" + scale + "," + scale + ")",
				transformOrigin: "center",
				left: lefts + "px",
				top: layerTop + "px"
			});

			pageTop = layerTop;
			return resize;
		}
	};

	window.addEventListener("load", function() {
		window.addEventListener("resize", resizeObj.resize(), false);
	}, false);
})();
var touchLocation,
	currentPage = 1,
	canMove = true,
	maxPage = 5;
(function() {
	window.pointerDown = function(l) {
		/// <summary>指针按下触发</summary>
		/// <param name="l" type="Object">位置对象</param>

		touchLocation = l;
		// event.preventDefault();
	};
	window.pointerMove = function(l) {
		/// <summary>指针移动触发</summary>
		/// <param name="l" type="Object">位置对象</param>

		if (canMove && touchLocation && touchLocation.y - l.y > 100 && currentPage < maxPage) {
			canMove = false;
			$(".page" + currentPage).animate({
				top: "-100%"
			}, 300, function() {
				canMove = true;
				$(this).hide();
			});
			currentPage++;
			if (pages[currentPage] && pages[currentPage].enter) pages[currentPage].enter();
			$(".page" + currentPage).css({
				top: "100%",
				display: "block"
			});
			$(".page" + currentPage).animate({
				top: "0px"
			}, 300);
		} else if (canMove && touchLocation && l.y - touchLocation.y > 100 && currentPage > 1) {
			canMove = false;
			$(".page" + currentPage).animate({
				top: "100%"
			}, 300, function() {
				canMove = true;
				$(this).hide();
			});
			currentPage--;
			if (pages[currentPage] && pages[currentPage].enter) pages[currentPage].enter();
			$(".page" + currentPage).css({
				top: "-100%",
				display: "block"
			});
			$(".page" + currentPage).animate({
				top: "0px"
			}, 300);
		}
		event.preventDefault();
	};
	window.pointerUp = function() {
		/// <summary>指针抬起触发</summary>

		touchLocation = null;
		//event.preventDefault();
	};
	/*
	    触摸相关
	*/
	window.addEventListener("touchstart", function(e) {
		pointerDown({
			x: e.changedTouches[0].pageX,
			y: e.changedTouches[0].pageY
		});
	});
	window.addEventListener("touchmove", function(e) {
		pointerMove({
			x: e.changedTouches[0].pageX,
			y: e.changedTouches[0].pageY
		});
	});
	window.addEventListener("touchend", function(e) {
		pointerUp();
	});
	/*
	    鼠标相关
	*/
	window.addEventListener("mousedown", function(e) {
		pointerDown({
			x: e.pageX,
			y: e.pageY
		});
	});
	window.addEventListener("mousemove", function(e) {
		pointerMove({
			x: e.pageX,
			y: e.pageY
		});
	});
	window.addEventListener("mouseup", function(e) {
		pointerUp();
	});
})();
var pages = {
	"1": {
		enter: function() {
			//$('body').css({'background':'#050600'});
		}
	},
	"2": {
		enter: function() {
			//$('body').css({'background':'#231815'});
		}
	}
}