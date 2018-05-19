var storeDates = {};

$(function() {

  window.opentest = opentest;

  function opentest(k) {
    
    order.resetForm();
    initSelect();
    order.openOrder();

    function initSelect() {
      var lists = lbsModule.mapContral.getMarkerList();
      var data = lists[k]['infoData'];

      console.log(data);

      var $orderformWrap = $('.orderform_wrap');
      var $provinceChild = $orderformWrap.find('div[name="province"] ul[name="drop"] li');
      $provinceChild.each(function() {
          var $this = $(this);
          if (data.province == $this.text()) {
              $this.trigger('click');
          }
      });
      var $cityChild = $orderformWrap.find('div[name="city"] ul[name="drop"] li');
      $cityChild.each(function() {
          var $this = $(this);
          if (data.city == $this.text()) {
              $this.trigger('click');
          }
      });
      var $dealerChild = $orderformWrap.find('div[name="shop"] ul[name="drop"] li');
      $dealerChild.each(function() {
          var $this = $(this);
          if (data.roomname == $this.text()) {
              $this.trigger('click');
          }
      });
    }

  }


  if( $('#address_search_lbs').length == 0 ) return;


    var $addressInfoPanel = $('.address_info_panel');
    var $province = $addressInfoPanel.find('#province'),
        $city = $addressInfoPanel.find('#city'),
        $dealer = $addressInfoPanel.find('#dealer');

    var _iscroll = new IScroll("#wrapper", {
        //鼠标滚轮控制
        mouseWheel: true,
        //显示滚动条
        /*scrollbars:true*/
    });


    var _lbsModule = new lbsModule({
            province: $province,
            city: $city,
            dealer: $dealer,
            addressLlist: $('.address_list'),
            iscroll: _iscroll,
            cb: bindEvent
    });

    _lbsModule.init();
    window.lbsModule = _lbsModule;


    var $btnReset = $('#btn_reset');
    var $btnSearchStore = $('#btn_searchStore');

    function bindEvent() {
        $btnReset.on('click', function(){
            lbsModule.selectContral.resetform();
            return false;
        });

        $btnSearchStore.on('click', function(){
            var pid = $("#proname").val();
            var cid = $("#cityname").val();
            var did = $("#dealname").val();

            if(!pid){
              alert('请选择您所在的省份');
              return;
            }

            _lbsModule.mapContral.renderList(
                _lbsModule.selectContral.getValue(pid,cid,did)
            );
            return false;
        });
    }


});


function lbsModule(opt) {
    var _this = this;

    this.init = function() {
       
        //省份
        var _province = $("#province")
          $.ajaxMethod('/chinaweb/area/shen.action',{'lang':1},true,function(result){
            var data = eval(result)
            console.log(data)
            for(var i=0;i<data.length;i++){
              var _node = document.createElement("option")
             //console.log(data[i].areaName)
              _node.append(data[i].areaName)
               $("#proname").text(data[i].areaName)
              _node.setAttribute("areaId",data[i].areaId);
              _province.append(_node)
            }
          });
          
        
          
    };

    this.initLoad = function(data) {

        var provinceList = _.groupBy(data,"areaName");

        _.each(provinceList,function(val,key){
            storeDates[key]=_.groupBy(provinceList[key],"areaId");
        });

        _this.selectContral = new formSelect({
            province: opt.province,
            city: opt.city,
            dealer: opt.dealer,
            defaultVal: {
                province: '选择您所在的省份',
                city: '选择您所在的城市',
                dealer: '选择您所在的门店'
            }
        });

        _this.mapContral = new storeMap({
            contral: _this.selectContral,
            addressList: opt.addressLlist,
            iscroll: opt.iscroll
        });

        _this.mapContral.init('allmap');

    };

}

function storeMap(opt) {
    var _this = this;

    var map = this.map;

    var data = opt.data || storeDates;
    var contral = opt.contral;

    var markerList = [];
    var myLocation;
    var GeoLocationPoint;
    var $addressList = opt.addressList || $('.address_list');
    var $listTitle = $addressList.find('.addL-h3');
    var $listWrap = $addressList.find('.wrapper ul');
    var _iscroll = opt.iscroll;

    this.getMarkerList = function() {
      return markerList;
    }
    this.init = function(id) {
        map = new BMap.Map(id);
        this.map = map;
        map.addControl(new BMap.NavigationControl());
        map.enableScrollWheelZoom();

        _this.gc = new BMap.Geocoder();
        _this.geo = new BMap.Geolocation();

        _this.setcenterAndZoom(121.473, 31.230);
        _this.getGeoLocation();
    };

    this.renderList = function(data) {
        
        if(data && _.isArray(data) && data.length>0){
            _this.clearMarker();
            data = _.sortBy(data, function(item){
              return item.distance;
            });

            var html = '';
            $listTitle.text(data&&_.isArray(data)&&data.length>0&&data[0].city);


            var len = data.length;
            $.each(data, function(k,v) {
                _this.bindMarker(v,k);
                html += '<li class="'+ (k==len-1? "last": "") +'">\
                        <p class="amap-p1"><span>'+(k+1)+'</span>'+v.roomname+'</p>\
                        <p>地址：'+v.address+'</p>\
                        <p><span class="mr48">电话：'+v.tel+'</span> <span>门店类型：'+v.category+'</span></p>\
                        '+(v.distance? "<p class='c_blue' style='display:none;'><a href='sms:'>发送到手机</a></p>" :"")+'\
                    </li>';
            });


            if (myLocation) map.removeOverlay(myLocation);
            map.addOverlay(myLocation);
            // myLocation.setAnimation(BMAP_ANIMATION_BOUNCE);
            _this.setViewport();

            $listWrap.html(html);
            _iscroll.refresh();
        }

    };

    this.getGeoLocation = function() {
        _this.geo.getCurrentPosition(function(point) {
            GeoLocationPoint = new BMap.Point(point.longitude, point.latitude);
            map.centerAndZoom(GeoLocationPoint, 12);
            myLocation = new BMap.Marker(GeoLocationPoint, { icon: new BMap.Icon("/images/icon_point_new_v1.png", new BMap.Size(43, 43)) });
            myLocation.setAnimation(BMAP_ANIMATION_BOUNCE);
            map.addOverlay(myLocation);
            _this.initDistence();
            _this.gc.getLocation(GeoLocationPoint, function(rs) {
                var addComp = rs.addressComponents;
                var pid;
                var cid;

                _.each(data, function(k, v) {
                    if (addComp.province.indexOf(v) >= 0) {
                        pid = v;
                    }
                });

                //设置省份
                if (pid && data && data[pid]) {
                    // contral.set
                    contral.resetinit({
                        province: pid
                    });
                    
                    _.each(data[pid], function(k, v) {
                        if (addComp.city.indexOf(v) >= 0) {
                            cid = v;
                        }
                    });


                }
                if (pid && cid && data[cid]) {
                    // contral.set city
                    contral.resetinit({
                        province: pid,
                        city: cid
                    });
                    contral.initDealer();
                }

                _this.renderList(contral.getValue(pid,cid));

            });

        });

    };

    this.initDistence = function() {
        if(GeoLocationPoint) {
          $.each(storeDates, function(k,v) {
              $.each(v, function(l,m) {
                  $.each(m, function(o,p) {
                      (function(add){
                          var point = new BMap.Point(add.longitude, add.latitude);
                          add.distance = _this.getDistance(point, GeoLocationPoint);
                      })(p);
                  });
              });
          });
        }
    };

    this.getDistance =  function(pointA, pointB) {
        return map.getDistance(pointA, pointB).toFixed(0)-0;
    };

    this.getGeoLocationPoint = function() {
        return GeoLocationPoint;
    };

    this.setcenterAndZoom = function(lng, lat) {
        var Point = new BMap.Point(lng, lat);
        map.centerAndZoom(Point, 11);
    };

    this.bindMarker = function(data,k) {
        if (data.longitude === '' || data.latitude === '') {
            return;
        }
        var html = '<div><span style="color:#a61d1d;">' + data.roomname + '</span></div> \
        <div></span><span style="width:185px;color:#000000;display:block;float:left;margin:10px 0 0;">地址：' + data.address + '</span><div class="mybtnOrderWrap"><div class="mybtnOrder" onclick="opentest('+k+')"></div></div></div>\
        <div class="cblue"><span class="cblue1"></span><span class="cblue2"></span><span class="cblue3"></span></div>';

        var point = new BMap.Point(data.longitude, data.latitude);
        var marker = new BMap.Marker(point);
        map.centerAndZoom(point, 12);
        map.addOverlay(marker);

        var infoWindow = new BMap.InfoWindow(html,{width:304,height:110});
        marker.addEventListener("click", function() {
            this.openInfoWindow(infoWindow);
            // $(".order").on('click', function(event) {
            //     var $this = $(this);
            // });
            //图片加载完毕重绘infowindow
        });
        marker['infoData'] = data;
        markerList.push(marker);
    };

    this.clearMarker = function() {
        var i = 0,
            len = markerList.length;
        for (i; i < len; i++) {
            map.removeOverlay(markerList[i]);
        }
        markerList = [];
    };

    this.setViewport = function() {
        if (markerList.length <= 1) return;
        var i = 0,
            len = markerList.length,
            points = [];
        for (i; i < len; i++) {
            points.push(markerList[i].point);
        }
        //var points=[new BMap.Point(121.426628,31.260006),new BMap.Point(121.428633,31.288487),new BMap.Point(121.425399,31.293298),new BMap.Point(121.380851,31.257158),new BMap.Point(121.399749,31.245742)]
        map.setViewport(points);
    };


}


function formSelect(options){
  var that = this;

  this.global_data = options.data || storeDates;
  this.options = {};

  this.$province = options.province || $('#province');
  this.$city = options.city || $('#city');
  this.$dealer = options.dealer || $('#dealer');

  this.options.selects = {
    province: null,
    city: null,
    dealer: null
  };

  this.options.defaultVal = {
    province: '省份',
    city: '城市',
    dealer: '经销商',
  };

  $.extend(this.options,options);

  // this.options = options;


  this.init();

}


formSelect.prototype.resetform = function(){
  this.options.selects = {
    province: null,
    city: null,
    dealer: null
  };

  this.initProvince();
  this.initCity();
  this.initDealer();
};

formSelect.prototype.resetinit = function( options ){
  var selects = this.options.selects;

  if(options.province){
    this.options.selects.province = options.province;
    this.initProvince();
  }
  if(options.city){
    this.options.selects.city = options.city;
    this.initCity();
  }
  if(options.dealer){
    this.options.selects.dealer = options.dealer;
    this.initDealer();

    var dealers =  _.filter(this.global_data[selects.province][selects.city], function(data){
        return ( selects.dealer === '' ? true : (selects.dealer == data.name) ? true : false ) ? true : false;
    });
    if( typeof this.options.dealerCallback =='function'){
      this.options.dealerCallback(dealers);
    }

  }
};

formSelect.prototype.getValue= function(pid,cid,did) {
    var list = [];
    function getArray(obj) {
        if(_.isArray(obj)){
            list.push(obj);
            return;
        }
        for(var key in obj) {
            getArray(obj[key]);
        }
    }
    if(pid&&!cid&&!did) {
        getArray(storeDates[pid]);
    }
    if(pid&&cid&&!did) {
        getArray(storeDates[pid][cid]);
    }
    if(pid&&cid&&did) {
        list = _.where( storeDates[pid][cid], { "roomname": did })
    }

    return _.flatten(list);
}

formSelect.prototype.init = function(){
  var _self = this;

  var selects = _self.options.selects;

  if(_self.options.province) {
    this.initProvince();
  }

  if(_self.options.city) {
    this.initCity();
  }


  

  _self.$city.on('change',function(){
      var $this = $(this);
      $_id=$this.val();
      _self.options.selects.city = $this.val();
      _self.options.selects.dealer = null;
      _self.initCity(true);
      _self.initDealer();
      
      
      
      
      var dealers =  _.filter(_self.global_data[selects.province][selects.city], function(data){
          return data;
      });

      if( typeof _self.options.cityCallback =='function'){
        _self.options.cityCallback(dealers);
      }
      if( typeof _self.options.dealerCallback =='function'){
        _self.options.dealerCallback();
      }
  });


  if(_self.options.dealer) {
    this.initDealer();

    _self.$dealer.on('change',function(){
        var $this = $(this);
        _self.options.selects.dealer = $this.val();
        _self.initDealer(true);

        var dealers =  _.filter(_self.global_data[selects.province][selects.city], function(data){

            return ( selects.dealer === '' ? true : (selects.dealer == data.name) ? true : false ) ? true : false;
        });
        if( typeof _self.options.dealerCallback =='function'){
          _self.options.dealerCallback(dealers);
        }
    });

  }

};
formSelect.prototype.initProvince = function(){
  var _self = this;
  var html = '<option value="">'+this.options.defaultVal.province+'</option>';
  _.each(_.keys(_self.global_data),function(v,k){
      html += '<option value="'+v+'" '+(v==_self.options.selects.province?'selected="selected"':'')+' >'+v+'</option>';
  });

  if(_self.options.selects.province){
    _self.$province.html(html).prev('span').html(_self.options.selects.province);
  }else{
    _self.$province.html(html).prev('span').html(_self.options.defaultVal.province);
  }
};
formSelect.prototype.initCity = function(refresh){
  var _self = this;
  var html = '<option value="">'+this.options.defaultVal.city+'</option>';
  var selects = _self.options.selects; //省
  
  
  
  
  if(!refresh){

    if(selects.province){
      _.each(_.keys(_self.global_data[selects.province]),function(v,k){
        
        console.log(v)//110000
      
      //城市
      $.ajaxMethod('/chinaweb/area/shi.action',{'lang':1,'areaMetadataId': v},true,function(result){
          var $_result=eval(result)
          
          console.log($_result)
          for(var i=0;i<$_result.length;i++){
            
          }
      });
  
        
        
          html += '<option value="'+v+'" '+(v==_self.options.selects.city?'selected="selected"':'')+' >'+v+'</option>';
      });
    }
    _self.$city.html(html).prev('span').html(selects.city ? selects.city : _self.options.defaultVal.city);

  }else{
    _self.$city.prev('span').html(selects.city ? selects.city : _self.options.defaultVal.city);
  }

};
formSelect.prototype.initDealer = function(refresh){
  var _self = this;
  var html = '<option value="">'+this.options.defaultVal.dealer+'</option>';

  var selects = _self.options.selects;


  if(!refresh){

    if(selects.province && selects.city ){

      _.each(_self.global_data[selects.province][selects.city],function(v,k){
          html += '<option value="'+v.roomname+'" '+(v.roomname==_self.options.selects.dealer?'selected="selected"':'')+' >'+v.roomname+'</option>';
      });
    }
    _self.$dealer.html(html).prev('span').html(selects.dealer ? selects.dealer : _self.options.defaultVal.dealer);
  }else{

    _self.$dealer.prev('span').html(selects.dealer ? selects.dealer : _self.options.defaultVal.dealer);
  }

};

$("#province").on("change",function(){
  console.log(this.selectedIndex)
  $("#city").empty()
 var cc = $("#province").get(0).options[this.selectedIndex].getAttribute("areaid")
 var provalue = $("#province").get(0).options[this.selectedIndex].value
 $("#proname").text(provalue)
 getCity(cc)      
})

$("#city").on("change",function(){
  console.log(this.selectedIndex)
  $("#dealer").empty()
 var dd = $("#city").get(0).options[this.selectedIndex].getAttribute("areaid")
 var cityValue = $("#city").get(0).options[this.selectedIndex].value
  $("#cityname").text(cityValue)
 console.log(dd)
 getShang(dd)      
})


$("#dealer").on("change",function(){
  var dealValue = $("#dealer").get(0).options[this.selectedIndex].value
  $("#dealname").text(dealValue)
})


function getCity(areaId){
  var _City = $("#city")
  $.ajaxMethod('/chinaweb/area/shi.action',{'lang':1,'areaMetadataId': areaId},true,function(result){
    console.log(result)
        var data = eval(result)
      for(var i=0;i<data.length;i++){
              var _node = document.createElement("option")
             //console.log(data[i].areaName)
              _node.append(data[i].areaName)
               $("#cityname").text(data[i].areaName)
              _node.setAttribute("areaId",data[i].areaId);
              _City.append(_node)
            }
});
}

function getShang(areaId){
  var _Dealer = $("#dealer")
  $.ajaxMethod('/chinasearch/searchStore.action', {lang:1,page:1,pageSize:9999,city:areaId}, true, function(result){
    var data = result.records
    console.log(data)
 for(var i=0;i<data.length;i++){
              var _node = document.createElement("option")
             //console.log(data[i].storeName)
              _node.append(data[i].storeName)
              _node.setAttribute("jingdu",data[i].longitude);
              _node.setAttribute("weidu",data[i].latitude);
              _Dealer.append(_node)
            }
    });
}



 
