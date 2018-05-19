//rem布局代码
(function (doc, win) {
	var docEl = doc.documentElement;
	resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
	recalc = function () {
	    var clientWidth = docEl.clientWidth;
	    docEl.style.fontSize = 100 * (clientWidth / 640) + 'px';//640可根据设计稿大小更改
	};
	if (!doc.addEventListener) return;
	win.addEventListener(resizeEvt, recalc, false);
	doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);
