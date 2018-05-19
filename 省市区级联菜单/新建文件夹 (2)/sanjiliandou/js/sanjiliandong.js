$(function(){
	_init()
})

function _init(){
	var _province = $("#province")
	$.ajax({
		type:"get",
		url:"./js/sheng.json",
		dataType:'json',
		async:true,
		success(data){
			for(var i=0;i<data.length;i++){
				var _node = document.createElement("option")
				_node.append(data[i].areaName)
				_node.setAttribute("areaId",data[i].areaId);
				_province.append(_node)
			}
		}
	});
}

$("#province").on("change",function(){
   var areaId = $("#province").get(0).options[this.selectedIndex].areaId;
   getCity(areaId)      
})

function getCity(areaId){
	var _City = $("#city")
	$.ajax({
		type:"get",
		url:"./js/sheng.json",
		//你给我传的json数据是错误的 我不知道你那个areaId是啥 对应上就可以了
		data:{areaId:areaId}
		dataType:'json',
		async:true,
		success(data){
			for(var i=0;i<data.length;i++){
				var _node = document.createElement("option")
				_node.append(data[i].areaName)
				_node.setAttribute("areaId",data[i].areaId);
				_City.append(_node)
			}
		}
	});
}

//区 和 市 写法一样