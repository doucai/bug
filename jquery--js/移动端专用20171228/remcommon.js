$(document).ready(function () {
//20171228
	var scale = 1 / devicePixelRatio;
	document.querySelector('meta[name="viewport"]').setAttribute('content','initial-scale='+scale+',maximum-scale='+scale+',minimum-scale='+scale+',user-scalable=no');
	document.documentElement.style.fontSize = document.documentElement.clientWidth / 10 + 'px';
//20171228
  //fixed mobile home page slider width
  $(window).trigger('resize');
})




window.onresize = setHtmlFontSize;
function setHtmlFontSize(){
    const htmlWidth = document.documentElement.clientWidth || document.body.clientWidth;
    const htmlDom = document.getElementsByTagName('html')[0];
    htmlDom.style.fontSize = htmlWidth / 10 + 'px';
};
setHtmlFontSize();
