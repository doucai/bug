require.config({
	jquery: './js/jquery',
	cookie: './js/cookie'
});

require(['jquery', 'cookie'], function ($, cookie) {
	$(function () {

		// 显示商品列表
		var sCookie = cookie.getCookie('goods');
		var aCookie = typeof sCookie === 'undefined' ? [] : JSON.parse(sCookie);

		aCookie.forEach(function (v) {
			$('#list').append(`<li>
			<div class="add-goods" data-id="${v.id}">删除</div>
			<img src="${v.url}" alt="">
			<div class="goods-title">${v.title}</div>
			<div class="price">${v.price}元，数量 ${v.num}</div>
		</li>`);
		});


		// 删除商品
		$('.add-goods').click(function () {
			var iId = Number($(this).data('id'));

			for(var i = 0; i < aCookie.length; i++) {
				if(aCookie[i].id == iId) {
					aCookie.splice(i, 1);
					break;
				}
			}

			// 再将新的数组添加到cookie中
			cookie.setCookie('goods', JSON.stringify(aCookie), 7);
			// 删除DOM节点
			$(this).parent().remove();
		});
	});
});