// document.addEventListener("DOMContentLoaded", function(event) {
// 	// function clickHandler(){
// 	// 	console.log('clicked');
// 	// }
// 	document.addEventListener('click', function() {
// 		console.log('clicked');
// 	}, false);
// 	// setTimeout(function() {
// 	// 	var anchor = document.querySelectorAll('[role="button"]');
// 	// 	if(anchor.addEventListener) // DOM method
// 	// 		anchor.addEventListener('click', clickHandler, false);
// 	// 	else if(anchor.attachEvent) {
// 	// 		anchor.attachEvent('onclick', function(){ 
// 	// 			return clickHandler.apply(anchor, [window.event]);
// 	// 	   });	
// 	// 	}
// 	// }, 1000);
// });

$(function() {
	$('body').on('click', '[role="button"]', function () {
		var b = $(this).parent().parent().index();
		var c = $(this).parent().index();
		$.get( "/count?name=sam-"+b+"-"+c, function( data ) {
		});
	});
});