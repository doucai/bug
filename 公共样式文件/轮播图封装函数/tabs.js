/**********************************

	* tabso
	* Copyright (c) yeso!
	* Date: 2010-07-28
	
˵����
	* Ӧ�ö������Ϊ��ǩ��ť��ֱ�Ӹ�Ԫ�أ��Ҹ�Ԫ���ڲ�������ǰ�ťԪ��
	* example: $( ".menus_wrap" ).tabso({ cntSelect:".content_wrap",tabEvent:"mouseover" });
	* cntSelect:���ݿ��ֱ�Ӹ�Ԫ�ص� jq ѡ����
	* tabEvent:�����¼���
	* tabStyle:�л���ʽ����ȡֵ��"normal" "fade" "move" "move-fade" "move-animate"
	* direction:�ƶ����򡣿�ȡֵ��"left" "top" ��tabStyleΪ"move"��"move-fade" "move-animate"ʱ��Ч��
	* aniMethod:��������������Ч���������磺easing��֧�֣�tabStyleΪ"move-animate"ʱ��Ч��
	* aniSpeed:�����ٶ�
	* onStyle:�˵�ѡ����ʽ��
**********************************/
/* �������?����֮�� lanrenzhijia.com */

;(function($){
	
$.fn.tabso=function( options ){

	var opts=$.extend({},$.fn.tabso.defaults,options );
	
	return this.each(function(i){
		var _this=$(this);
		var $menus=_this.children( opts.menuChildSel ).children("span");
		var $container=$( opts.cntSelect ).eq(i);
		
		if( !$container) return;
		
		if( opts.tabStyle=="move"||opts.tabStyle=="move-fade"||opts.tabStyle=="move-animate" ){
			var step=0;
			if( opts.direction=="left"){
				step=$container.children().children( opts.cntChildSel ).outerWidth(true);
			}else{
				step=$container.children().children( opts.cntChildSel ).outerHeight(true);
			}
		}
		
		if( opts.tabStyle=="move-animate" ){ var animateArgu=new Object();	}
			
		$menus[ opts.tabEvent]( function(){
			var index=$menus.index( $(this) );
			$(this).parent("li").addClass( opts.onStyle )
				.siblings().removeClass( opts.onStyle );
			switch( opts.tabStyle ){
				case "fade":
					if( !($container.children( opts.cntChildSel ).eq( index ).is(":animated")) ){
						$container.children( opts.cntChildSel ).eq( index ).siblings().css( "display", "none")
							.end().stop( true, true ).fadeIn( opts.aniSpeed );
					}
					break;
				case "move":
					$container.children( opts.cntChildSel ).css(opts.direction,-step*index+"px");
					break;
				case "move-fade":
					if( $container.children( opts.cntChildSel ).css(opts.direction)==-step*index+"px" ) break;
					$container.children( opts.cntChildSel ).stop(true).css("opacity",0).css(opts.direction,-step*index+"px").animate( {"opacity":1},opts.aniSpeed );
					break;
				case "move-animate":
					animateArgu[opts.direction]=-step*index+"px";
					$container.children( opts.cntChildSel ).stop(true).animate( animateArgu,opts.aniSpeed,opts.aniMethod );
					break;
				default:
					$container.children( opts.cntChildSel ).eq( index ).css( "display", "block")
						.siblings().css( "display","none" );
			}
	
		});
		
		$menus.eq(0)[ opts.tabEvent ]();
		
	});
};	

$.fn.tabso.defaults={
	cntSelect : ".content_wrap",
	tabEvent : "mouseover",
	tabStyle : "normal",
	direction : "left",
	aniMethod : "swing",
	aniSpeed : "fast",
	onStyle : "current",
	menuChildSel : "*",
	cntChildSel : "*"
};

})(jQuery);

/* �������?����֮�� lanrenzhijia.com */