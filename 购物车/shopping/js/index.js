require.config({
	jquery: './js/jquery',
	cookie: './js/cookie'
});

require(['jquery', 'cookie'], function ($, cookie) {
	$(function () {
		// 给按钮添加点击事件
		$('.add-goods').click(function () {

			// 第一次添加商品
			var
				isAdd = false,  // 假设没有商品没有添加过
				sGoods = cookie.getCookie('goods');

			if(typeof sGoods === 'undefined') {
				var aGoods = []; // 相当于购物的车子
			} else {
				var aGoods = JSON.parse(sGoods);

				// 判断当前商品有没有添加过
				for(var i = 0; i < aGoods.length; i++) {
					if(aGoods[i].id == $(this).data('id')) {
						aGoods[i].num++;
						isAdd = true;
						break;
					}
				}
			}
			
			// 如果isAdd为false,说明商品没有添加过
			if(!isAdd) {
				var oGoods = {
					id:    $(this).data('id'),
					title: $(this).data('title'),
					price: $(this).data('price'),
					url:   $(this).data('url'),
					num:   1
				};

				aGoods.push(oGoods);
			}

			// 存储cookie
			cookie.setCookie('goods', JSON.stringify(aGoods), 7);
		});
	});
});