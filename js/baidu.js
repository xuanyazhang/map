/*
 * 百度地图API
 */ 
var map = new BMap.Map("map",{mapType:BMAP_HYBRID_MAP});    // 创建Map实例
var point=new BMap.Point(106.396809 ,38.329801);
map.centerAndZoom(point,10);  // 初始化地图,设置中心点坐标和地图级别
map.addControl(new BMap.NavigationControl({anchor:BMAP_ANCHOR_TOP_LEFT,offset:new BMap.Size(30,70)})); //添加缩略地图控件
// 添加到地图当中 
map.setCurrentCity("银川");          // 设置地图显示的城市 此项是必须设置的
map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
map.addControl(new BMap.ScaleControl({anchor:BMAP_ANCHOR_BOTTOM_RIGHT,offset:new BMap.Size(200,10)}));


var label=new BMap.Label("航旅天眼为你持续提供服务",{position:point,offset:new BMap.Size(30,-30)});
label.setStyle({
	color:"#82bf50",
	fontSize:"20px",
	height:"20px",
	lineHeight:"20px",
	fontFamily:"微软雅黑"
});
map.addOverlay(label);

var opts={
		enableMessage:true
}


$(".plat").click(function(event) {
	$(".plat").css({display:"none"});
	$(".satellite").css({display:"block"});
	map.setMapType(BMAP_NORMAL_MAP);
	
});

$(".satellite").click(function(event) {
	$(".satellite").css({display:"none"});
	$(".plat").css({display:"block"});
	map.setMapType(BMAP_HYBRID_MAP);
});

var contents=
	"<h4 style='margin:0 0 5px 0;padding:0.2em 0;text-align:center'>航班信息</h4>" + 
	"<img style='float:right;margin:4px' id='imgDemo' src='/UmeInfantry/resources/umeinfantry/images/plane1.png' width='32' height='32' title='flighInfo'/>" + 
	"<p style='margin:0;line-height:1.5;font-size:13px;'>航班公司：${flightCompany}</p>" + 
	"<p style='margin:0;line-height:1.5;font-size:13px;'>航班号：${flightNO}</p>" + 
	"<p style='margin:0;line-height:1.5;font-size:13px;'>出发地：${departureCity}</p>" +
	"<p style='margin:0;line-height:1.5;font-size:13px;'>目的地：${arrivalCity}</p>" +
	"<p style='margin:0;line-height:1.5;font-size:13px;'>当前飞行速度：${speed}</p>"+
	"<p style='margin:0;line-height:1.5;font-size:13px;'>当前飞行高度：${height}</p>"+
	"<p style='margin:0;line-height:1.5;font-size:13px;'>飞行时长：${flyTime}分钟</p>"+
	"<p style='margin:0;line-height:1.5;font-size:13px;'>机龄：${year}年</p>"+
	"<p style='margin:0;line-height:1.5;font-size:13px;'>飞行里程：${distance}米</p>"+
	"</div>";

var path="/UmeInfantry/resources/umeinfantry";
var polyline;
//发送请求
var sendReq = function(){
	var lng1=map.getBounds().we;
	var lat1=map.getBounds().qe;
	var lng2=map.getBounds().re;
	var lat2=map.getBounds().ve;
    //向后台发出请求
    $.ajax({
        url: "/UmeInfantry/mapFlight",
        contentType: "application/x-www-form-urlencoded",
        dataType: "json",
        data:{lng1:lng1,lat1:lat1,lng2:lng2,lat2:lat2},
        timeout: 50000,
        success: function(json){
            //返回内容为""表示无数据
            if(json){
            	var points=[];
            	var url="/UmeInfantry/resources/umeinfantry/images/plane.png";
            	var Icon=new BMap.Icon(url,new BMap.Size(32,32));
            	for(var i=0;i<json.length;i++){   		
            		var angle=json[i].vec;
            		var flightno=json[i].flightno;
            		var height=json[i].alt;
            		var speed=json[i].cas;
            		var marker=new BMap.Marker(new BMap.Point(json[i].lon,json[i].lat),{icon:Icon});
            		marker.setRotation(angle);            		
            		map.addOverlay(marker);
            		addMouseoverHandler(flightno,marker,height,speed,angle);
            		points.push(new BMap.Point(json[i].lng,json[i].lat));
            	}
                //60s后更新数据
                setTimeout(function(){sendReq();},10000);
            }else{
                //showDialog("暂无数据");
            }
           
        },
        error: function(err){
        }
    });
};

function addMouseoverHandler(flightno,marker,height,speed,angle){
	marker.addEventListener("mouseover",function(e){
		$.ajax({
			url:"/UmeInfantry/flightInfoByNO",
			contentType: "application/x-www-form-urlencoded",
			dataType:"json",
			data:{flightNO:flightno},
			timeout: 50000,
			success:function(json){
				if(json){
					json["flightNO"]=flightno;
					json["height"]=height;
					json["speed"]=speed;
					var message=substitute(contents,json);
					openInfo(message,e);
					var url="/UmeInfantry/resources/umeinfantry/images/plane1.png";
			        var icon=new BMap.Icon(url,new BMap.Size(32,32));
			        marker.setIcon(icon);
			        marker.setRotation(angle);
				}
			},
			error:function(e){
				
			}
		});
		
		$.ajax({
			url:"/UmeInfantry/flightRoutes",
			contentType: "application/x-www-form-urlencoded",
			dataType:"json",
			data:{flightNO:flightno},
			timeout: 50000,
			success:function(json){
				var points=[];
				for(var i=0;i<json.length;i++){
					points.push(new BMap.Point(json[i].lon,json[i].lat));					
				}
				polyline = new BMap.Polyline(points,{strokeColor:"blue", strokeWeight:2, strokeOpacity:0.5});    
		        map.addOverlay(polyline);
			},
			error:function(e){}
		});
	});
	
	marker.addEventListener("mouseout", function(e){			
        var url="/UmeInfantry/resources/umeinfantry/images/plane.png";
        var icon=new BMap.Icon(url,new BMap.Size(32,32));
        //map.removeOverlay(polyline);
        marker.setIcon(icon);
        marker.setRotation(angle);          
	});
}

function openInfo(message,e){
	var p = e.target;
	var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
	var infoWindow = new BMap.InfoWindow(message,opts);  // 创建信息窗口对象 
	map.openInfoWindow(infoWindow,point); //开启信息窗口
	infoWindow.addEventListener('close',function(e){
		//map.removeOverlay(polyline);
	});
}