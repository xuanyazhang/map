function substitute(a, b) {
	return a.replace(/\$\{([^\s\:\}]+)(?:\:([^\s\:\}]+))?\}/g, function(a, c) {
		return b[c] != undefined ? b[c] : "" == b[c] ? "" : a;
	});
};

var map = new BMap.Map("allmap",{mapType:BMAP_HYBRID_MAP});    // 创建Map实例
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

//var point=new BMap.Point(116.404, 39.515);
var point=new BMap.Point(106.396809 ,38.329801);
map.centerAndZoom(point,5);  // 初始化地图,设置中心点坐标和地图级别
map.addControl(new BMap.NavigationControl({anchor:BMAP_ANCHOR_TOP_LEFT,offset:new BMap.Size(30,70)})); //添加缩略地图控件
// 创建控件实例    
var myZoomCtrl = new ZoomControl();
// 添加到地图当中 
map.addControl(myZoomCtrl);
map.setCurrentCity("银川");          // 设置地图显示的城市 此项是必须设置的
map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
map.addControl(new BMap.ScaleControl({anchor:BMAP_ANCHOR_BOTTOM_RIGHT,offset:new BMap.Size(200,10)}));


var label=new BMap.Label("航旅天眼为你持续提供服务",{position:point,offset:new BMap.Size(30,-30)});
label.setStyle({
	color:"#82bf50",
	fontSize:"12px",
	height:"20px",
	lineHeight:"20px",
	fontFamily:"微软雅黑"
});



var content=
"<h4 style='margin:0 0 5px 0;padding:0.2em 0;text-align:center'>航班信息</h4>" + 
"<img style='float:right;margin:4px' id='imgDemo' src='./images/umetrip.png' width='32' height='32' title='flighInfo'/>" + 
"<p style='margin:0;line-height:1.5;font-size:13px;'>航班号：${NO}</p>" + 
"<p style='margin:0;line-height:1.5;font-size:13px;'>出发地-目的地：${OD}</p>" +
"<p style='margin:0;line-height:1.5;font-size:13px;'>当前飞行速度：${speed}</p>"+
"<p style='margin:0;line-height:1.5;font-size:13px;'>当前飞行高度：${height}</p>"+ 
"<p style='margin:0;line-height:1.5;font-size:13px;'>机龄：${year}</p>"+
"<p style='margin:0;line-height:1.5;font-size:13px;'>飞行里程：${distance}</p>"+
"</div>";

map.addOverlay(label);
	
//动态获取数据
var data_info = [];
	    
var airplanes=[
				[113.19975555555556,40.47041388888889,substitute(content,{NO:'CA1104',OD:'HET--PEK',year:'0.3年',distance:'1107公里',height:'6888m',speed:'791km/h'}),95.10],
				[117.69219722222222,26.81397777777778,substitute(content,{NO:'MF8185',OD:'FOC--CSX',year:'0.3年',distance:'1107公里',height:'7650m',speed:'804km/h'}),315.93],
				[119.69823333333333,29.92126388888889,substitute(content,{NO:'FM9331',OD:'SHA--SZX',year:'0.3年',distance:'1107公里',height:'9989m',speed:'328km/h'}),296.42],
				[117.33559166666666,31.281916666666667,substitute(content,{NO:'ZH9615',OD:'CAN--LYI',year:'0.3年',distance:'1107公里',height:'9784m',speed:'865km/h'}),52.12],				
		     ];


var opts = {			
			enableMessage:true//设置允许信息窗发送短息
		   };
var coordinates=[];

for(var i=0;i<airplanes.length;i++){
	var url="./images/plane.png";
	var angle=airplanes[i][3];
	var myIcon=new BMap.Icon(url,new BMap.Size(32,32));
	var marker = new BMap.Marker(new BMap.Point(airplanes[i][0],airplanes[i][1]),{icon:myIcon});  // 创建标注
	marker.setRotation(angle);
	var content = airplanes[i][2];
	map.addOverlay(marker);               // 将标注添加到地图中
	addMouseoverHandler(content,marker,angle);
}

var points=[];
for(var i=0;i<4;i++){
   points.push(new BMap.Point(airplanes[i][0],airplanes[i][1]));
}


var polyline;
var OMarker;
var DMarker;
function addMouseoverHandler(content,marker,angle){
	marker.addEventListener("mouseover",function(e){
		openInfo(content,e);
        var url="./images/umetrip.png";
        var icon=new BMap.Icon(url,new BMap.Size(32,32));
        var pin="./images/pin.png";
        var ODpin=new BMap.Icon(pin,new BMap.Size(32,32));
        OMarker=new BMap.Marker(new BMap.Point(106.3967,38.3299),{icon:ODpin});
        DMarker=new BMap.Marker(new BMap.Point(121.8094,31.1563),{icon:ODpin});
        marker.setIcon(icon);
        marker.setRotation(angle);      
        
        polyline = new BMap.Polyline(points,{strokeColor:"blue", strokeWeight:2, strokeOpacity:0.5});    
        map.addOverlay(polyline);
        map.addOverlay(OMarker);
        map.addOverlay(DMarker);
	});

	marker.addEventListener("mouseout", function(e){			
        var url="./images/plane.png";
        var icon=new BMap.Icon(url,new BMap.Size(32,32));
        marker.setIcon(icon);
        marker.setRotation(angle);          
	})
}
function openInfo(content,e){
	var p = e.target;
	var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
	var infoWindow = new BMap.InfoWindow(content,opts);  // 创建信息窗口对象 
	map.openInfoWindow(infoWindow,point); //开启信息窗口
	infoWindow.addEventListener('close',function(e){
		map.removeOverlay(polyline);
        map.removeOverlay(OMarker);
        map.removeOverlay(DMarker);
	})
}
map.addEventListener("zoomend", function(e){
	
})


window.run = function (){	
	var paths = points.length;    //获得有几个点
	console.log(paths);
	var carMk = new BMap.Marker(points[0],{icon:new BMap.Icon("./images/plane.png",new BMap.Size(32,32))});
	map.addOverlay(carMk);
	i=0;
	function resetMkPoint(i){
		carMk.setPosition(points[i]);
		if(i < paths){
			setTimeout(function(){
				i++;
				resetMkPoint(i);
			},5000);
		}
	}
	setTimeout(function(){
		resetMkPoint(0);
	},5000)
}

setTimeout(function(){
	run();
},5000);

