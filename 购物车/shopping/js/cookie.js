/**
	操作cookie
*/
define(function () {
	return {
		setCookie: function (name, value, days, path='/') {
			var oDate = new Date();
			oDate.setDate(oDate.getDate() + days);
			document.cookie = name + '=' + encodeURIComponent(value) + ';expires='+oDate + ';path='+path;
		},
		getCookie: function (name) {
			var aCookie = document.cookie.split('; ');
			for(var i = 0; i < aCookie.length; i++) {
				var oTemp = aCookie[i].split('=');
				if(oTemp[0] === name) {
					return decodeURIComponent(oTemp[1]);
				}
			}
		},
		removeCookie: function () {}
	};
});