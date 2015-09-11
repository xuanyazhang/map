	// 定义一个控件类,即function
	function ZoomControl(){
	  // 默认停靠位置和偏移量
	  this.defaultAnchor = BMAP_ANCHOR_BOTTOM_RIGHT;
	  this.defaultOffset = new BMap.Size(10, 10);
	}

	// 通过JavaScript的prototype属性继承于BMap.Control
	ZoomControl.prototype = new BMap.Control();

	// 自定义控件必须实现自己的initialize方法,并且将控件的DOM元素返回
	// 在本方法中创建个div元素作为控件的容器,并将其添加到地图容器中
	ZoomControl.prototype.initialize = function(map){
	  // 创建一个DOM元素
	  var div = document.createElement("div");
	  // 添加文字说明
	  div.appendChild(document.createTextNode("统计数据"));
	  // 设置样式
	  div.style.cursor = "pointer";
	  div.style.textAlign="center";
	  div.style.border = "1px solid gray";
	  div.style.color  = "white";
	  div.style.width  = "150px";
	  div.style.height = "50px";
	  div.style.opacity= "0.8";
	  div.style.backgroundColor = "#000000";
	  // 绑定事件,点击一次放大两级
	  div.onclick = function(e){
		
	  }
	  // 添加DOM元素到地图中
	  map.getContainer().appendChild(div);
	  // 将DOM元素返回
	  return div;
	}

	 $("#search-bar").on("focus",function(event) {
		$("#sidebar-search-button").addClass('on');
	 }).on("blur",function(event) {
		$("#sidebar-search-button").removeClass('on');
	 });

	 $(".filter").click(function(event) {
	 	$("#filterbar").addClass('active');
	 });

	 $(".icon-filter-close").click(function(event) {
	 	$("#filterbar").removeClass('active');
	 });

	 $(".filter-til").click(function(event) {
	 	console.log("nihao");
	 	$(this).next(".filter-list-box").slideToggle(1000);
	 	$(".filter-til p").toggleClass('btn-all').toggleClass('arrow-active');
	 })