
if (document.addEventListener) {
	document.addEventListener('DOMContentLoaded',eventDOMLoaded,false);
}
window.addEventListener('load',eventWindowLoaded,false);
window.onbeforeunload = function (e) {
	return "你的資料還未儲存呢";
};
var resizeType="";
var inResizeMode = 0;
var tabContentPaddingSize=10;
var tabContentScrollHeight=3;
var loadedFileName = "";


function eventDOMLoaded () {
	console.log('我提前執行了');
}
function eventWindowLoaded(){
	console.log('頁面初始化完畢');
	myEditorApp();
}
function canvasSupport(){
	return Modernizr.canvas;
}

function myEditorApp() {
	/*resize control */
	var mx, my, ox, oy,o;
		
	//if (!canvasSupport()){
	//	return;
	//}
	
	init();
}

function MainLayout(config) {
	
}
function init (){
	var backgroundDiv = document.getElementById("backgroundDiv");
	backgroundDiv.style.width = "100%";
	backgroundDiv.style.height = $(window).height() + "px";
	//backgroundDiv.style.height = "100%";
	console.log("window height:" + $(window).height() + "px");
	backgroundDiv.style.backgroundColor='#F0F0F0';
		
	//console.debug($(window).height());
	var fileInputElem = document.createElement('input');   
	fileInputElem.setAttribute("type", "file");
	fileInputElem.setAttribute("accept", ".txt,.sql,.xml");
	fileInputElem.setAttribute("id", "fileInput");
	fileInputElem.style.display = "none";
	fileInputElem.addEventListener('change', this.readTextFile, false);
	backgroundDiv.appendChild(fileInputElem);
	var ctrlDiv = document.createElement("div");
	ctrlDiv.style.width = "100%";
	ctrlDiv.setAttribute('id',"ctrlDiv");
	ctrlDiv.style.backgroundColor='#B28666';
	backgroundDiv.appendChild(ctrlDiv);
	initFuncIcons();
	var openFileIcon  = document.getElementById('openFileImg') ;
	openFileIcon.onclick=readFile;
	var writeFileIcon  = document.getElementById('exportFileImg') ;
	writeFileIcon.onclick=writeFile;
	var actRunIcon= document.getElementById('actRunImg') ;
	actRunIcon.onclick=runActionGroup;
	
	var jsonGenIcon= document.getElementById('jsonGenImg') ;
	jsonGenIcon.onclick=generateJsonTemplate;
	
	console.log(ctrlDiv.clientHeight);
	var mainDivHeight = $(window).height() - 2 * (ctrlDiv.clientHeight);
	
	var docWidth = backgroundDiv.clientWidth;
	//var mainRightWidth = $(window).width()/5;
	var mainRightWidth = Math.floor(docWidth/5);
	var mainCtrlWidth = 5;
	//var mainLeftWidth = $(window).width()/5;
	var mainLeftWidth = mainRightWidth;
	var mainCenterWidth = docWidth - mainCtrlWidth *2 - mainRightWidth - mainLeftWidth; 
	console.debug("DocumentWidth:" + docWidth);
	console.debug("mainCenterWidth:" + mainCenterWidth);
	console.debug("SideWidth:" + mainLeftWidth);
	
	var mainDiv = document.createElement('div');
	mainDiv.style.width = "100%";
	mainDiv.style.height = mainDivHeight + "px";
	mainDiv.id = "mainDiv";
	mainDiv.style.backgroundColor='#FFFF80';
	backgroundDiv.appendChild(mainDiv);
	
	var mainLeftDiv = document.createElement('div');
	mainLeftDiv.id = "mainLeftDiv";
	mainLeftDiv.style.width = mainLeftWidth + "px";
	mainLeftDiv.style.height = "100%";
	mainLeftDiv.style.backgroundColor='#C8BFE7';
	mainLeftDiv.style.styleFloat = 'left';
	mainLeftDiv.style.cssFloat = 'left';
	mainDiv.appendChild(mainLeftDiv);
	
	var mainCtrlDiv1 = document.createElement('div');
	mainCtrlDiv1.id = "mainCtrlDiv1";
	mainCtrlDiv1.style.width = "5px";
	mainCtrlDiv1.style.height = "100%";
	mainCtrlDiv1.style.backgroundColor='#F0F0F0';
	mainCtrlDiv1.style.styleFloat = 'left';
	mainCtrlDiv1.style.cssFloat = 'left';
	mainDiv.appendChild(mainCtrlDiv1);
		
	var mainCenterDiv = document.createElement('div');
	mainCenterDiv.id = "mainCenterDiv";
	//mainCenterDiv.style.width = "Auto";
	mainCenterDiv.style.width = mainCenterWidth + "px";
	mainCenterDiv.style.height = "100%";
	mainCenterDiv.style.backgroundColor='#EFE4B0';
	mainCenterDiv.style.styleFloat = 'left';
	mainCenterDiv.style.cssFloat = 'left';
	mainDiv.appendChild(mainCenterDiv);
	
	var mainCtrlDiv2 = document.createElement('div');
	mainCtrlDiv2.id = "mainCtrlDiv2";
	mainCtrlDiv2.style.width = "5px";
	mainCtrlDiv2.style.height = "100%";
	mainCtrlDiv2.style.backgroundColor='#F0F0F0';
	mainCtrlDiv2.style.styleFloat = 'left';
	mainCtrlDiv2.style.cssFloat = 'left';
	mainDiv.appendChild(mainCtrlDiv2);
		
	var mainRightDiv = document.createElement('div');
	mainRightDiv.id = "mainRightDiv";
	mainRightDiv.style.width = mainRightWidth + "px";
	mainRightDiv.style.height = "100%";
	mainRightDiv.style.backgroundColor='#C8BFE7';
	mainRightDiv.style.styleFloat = 'right';
	mainRightDiv.style.cssFloat = 'right';
	mainDiv.appendChild(mainRightDiv);
		
	var bgSizeCtrlDiv1 = document.createElement('div');
	bgSizeCtrlDiv1.id = "bgSizeCtrlDiv1";
	bgSizeCtrlDiv1.style.width = "100%";
	bgSizeCtrlDiv1.style.height = "5px";
	bgSizeCtrlDiv1.style.backgroundColor='#F0F0F0';
	backgroundDiv.appendChild(bgSizeCtrlDiv1);
		
	var bgButtomDiv = document.createElement('div');
	bgButtomDiv.id = "bgButtomDiv";
	bgButtomDiv.style.width = "100%";
	bgButtomDiv.style.height = (ctrlDiv.clientHeight) + "px";
	bgButtomDiv.style.backgroundColor='#80FF80';
	backgroundDiv.appendChild(bgButtomDiv);
	
	document.onmousemove = handleDocMouseMove;
	document.onmousedown = handleDocMouseDown;
	document.onmouseup = handleDocMouseUp;
	document.onmouseleave = handleDocMouseLeave;
	
	createTab();
	$('#tabContainer').jQdmtab({
		padding:tabContentPaddingSize,
		borderWidth:1});
	//9E8FFF blue
	//A6FF9F light green
	//CC936B light brown
};
function readFile(){
	$("#fileInput").trigger('click');
};
function runActionGroup() {
	console.debug("run action group icon click");
	
	simulateActionGroup("mainDiv","simulateAgDiv","test");
	/*
	$.ajax({
		type:'POST',
		url:'RunActionGroupServlet',
		dataType:'json',
		data:{
			'reqYear': '2016',
			'reqMonth':'9',
			'accountId':'1234'
		},
		success:function(json){
			console.debug(json);
		}
	});
	*/
} 
function readTextFile(e){
	var f = e.target.files[0];
	if (f){
		var r = new FileReader();
		r.onload = function(e) { 
			var contents = e.target.result;
			console.log("Got the file:\n");
			console.log("name:" + f.name + "\n");
			console.log("type:" + f.type + "\n");
			console.log("size:" + f.size + "\n");
			loadedFileName = f.name;
			console.log(contents);
			//parseSqlContent(contents);
			//newTab(f.name,contents);
			loadTabSourceContent(contents);
		};
		r.readAsText(f);
	}
	$("#fileInput").val('');
	console.debug("Hi");
};
function initFuncIcons(){
	var funIcon = 
		"<table>" + 
			"<tr>" + 
				"<td class='funcIcon'><img id='openFileImg' class='imgIcon', src='images/OpenFile.png' title='Open file'></td>" +
				"<td class='funcIcon'><img id='newFileImg' class='imgIcon', src='images/newFile.png' title='New file'></td>" + 
				"<td class='funcIcon'><img id='exportFileImg' class='imgIcon', src='images/export.png' title='Export file'></td>" + 
				"<td class='funcIcon'><img id='autoPackageImg' class='imgIcon', src='images/autopackage.png' title='Export deployment package'></td>" +
				"<td class='funcIcon'><img id='deployImg' class='imgIcon', src='images/deploy.png' title='Release the deployment package'></td>" +
				"<td class='funcIcon'><img id='actRunImg' class='imgIcon', src='images/actions-run.png' title='Run the action group'></td>" +
				"<td class='funcIcon'><img id='jsonGenImg' class='imgIcon', src='images/json_temp.png' title='Generate Json Template'></td>" +
			"</tr>" + 
		"</table>";
	
	$('#ctrlDiv').append(funIcon);
};
function standardEvent(event) {
	if (!event) {
		event = window.event;
		event.target = event.srcElement;
		event.layerX = event.offsetX;
		event.layerY = event.offsetY;
	}
	event.mx = event.pageX || event.clientX + document.body.scrollLeft; 
	event.my = event.pageY || event.clientY + document.body.scrollTop;
	return event;
};

function move(event){
	//console.debug(event);
	event = standardEvent(event);
	console.debug("x:" + event.mx + ";y:" + event.my);
};
/*do resize */
function resizemain(diffy) {
	var mainDiv = document.getElementById("mainDiv");
	var mainsizer = document.getElementById("bgSizeCtrlDiv1");
	var bgbottom = document.getElementById("bgButtomDiv");
	var tabContainer = document.getElementById("tab_container");
	var sizerTop = mainsizer.offsetTop;
	var endMainHeight =  mainDiv.clientHeight + diffy ;
	var endButnHeight = bgbottom.clientHeight + (diffy * -1 );
	if (endMainHeight >= 60 && endButnHeight >= 30) {
		mainsizer.style.top=sizerTop + diffy + "px";
		mainDiv.style.height = mainDiv.clientHeight + diffy  + "px";
		console.debug("tab container height:" + tabContainer.clientHeight);
		console.debug("tab container Scroll Height:" + tabContentScrollHeight);
		console.debug("tab container Padding Size:" + tabContentPaddingSize);
		console.debug("diffy:" + diffy);
		var before = tabContainer.style.height;
		tabContainer.style.height = tabContainer.clientHeight-tabContentScrollHeight+ diffy  + "px";
		//tabContainer.style.height = tabContainer.clientHeight-tabContentPaddingSize*2-tabContentScrollHeight+ diffy  + "px";
		console.debug(before + "-->" + tabContainer.style.height);
		bgbottom.style.height = bgbottom.clientHeight + (diffy * -1 ) + "px";
	}
}
function resizemainLeft(diffx) {
	console.debug("resizemainLeft");
	var mainCenterDiv = document.getElementById("mainCenterDiv");
	var mainLeftDiv = document.getElementById("mainLeftDiv");
	var leftsizer = document.getElementById("mainCtrlDiv1");
	var sizerLeft = leftsizer.offsetLeft;
	var endMainCenterWidth = mainCenterDiv.clientWidth + (diffx * -1 );
	var endLeftWidth = mainLeftDiv.clientWidth + diffx;
	if (endMainCenterWidth >= 30 && endLeftWidth >=30) {
		leftsizer.style.left = sizerLeft + diffx + "px";
		mainCenterDiv.style.left = mainCenterDiv.offsetLeft + diffx + "px";
		mainCenterDiv.style.width = mainCenterDiv.clientWidth + (diffx * -1 ) + "px";
		mainLeftDiv.style.width = mainLeftDiv.clientWidth + diffx + "px";
	}
}
function resizemainRight(diffx) {
	console.debug("resizemainRight");
	var mainCenterDiv = document.getElementById("mainCenterDiv");
	var mainRightDiv = document.getElementById("mainRightDiv");
	var rightsizer = document.getElementById("mainCtrlDiv2");
	var sizerLeft = rightsizer.offsetLeft;
	var endMainCenterWidth = mainCenterDiv.clientWidth + diffx;
	var endRightWidth = mainRightDiv.clientWidth + (diffx * -1);
	if (endMainCenterWidth >= 30 && endRightWidth >=30) {
		rightsizer.style.left = sizerLeft + diffx + "px";
		mainRightDiv.style.left = mainRightDiv.offsetLeft + diffx + "px";
		//mainCenterDiv.style.left = mainCenterDiv.offsetLeft + diffx + "px";
		mainCenterDiv.style.width = mainCenterDiv.clientWidth + diffx  + "px";
		mainRightDiv.style.width = mainRightDiv.clientWidth + (diffx * -1 ) + "px";
	}
}
/*handle doc mouse event */
function handleDocMouseDown (event) {
	event = standardEvent(event);
	var mainsizer = document.getElementById("bgSizeCtrlDiv1");
	var leftsizer = document.getElementById("mainCtrlDiv1");
	var rightsizer = document.getElementById("mainCtrlDiv2");
	var yloc = parseInt(mainsizer.offsetTop);
	var xloc1 = parseInt(leftsizer.offsetLeft);
	var xloc2 = parseInt(rightsizer.offsetLeft);
	var modifySizeBegin = false;
	console.log("mainsizer.offsetTop:" + yloc);
	if (event.my-yloc >=0 && event.my-yloc <5) {
		//console.debug("start change vsize");
		inResizeMode = 1;
		resizeType="center-bottom";
		modifySizeBegin = true;
	}else if (event.mx-xloc1 >=0 && event.mx-xloc1 <5) {
		inResizeMode = 2;
		resizeType="center-left";
		modifySizeBegin = true;
	}else if (event.mx-xloc2 >=0 && event.mx-xloc2 <5) {
		inResizeMode = 2;
		resizeType="center-right";
		modifySizeBegin = true;
	}
	
	if (modifySizeBegin==true) {
		mx=event.mx;
		my=event.my;
		o=event.target;
		ox=event.target.offsetLeft;
		oy=event.target.offsetTop;
		console.log("ox:" + ox + ";oy:" + oy);
	}
}
function handleDocMouseMove (event) {
	event = standardEvent(event);
	var mainsizer = document.getElementById("bgSizeCtrlDiv1");
	var leftsizer = document.getElementById("mainCtrlDiv1");
	var rightsizer = document.getElementById("mainCtrlDiv2");
	var backgroundDiv = document.getElementById("backgroundDiv");
	var yloc = parseInt(mainsizer.offsetTop);
	var xloc1 = parseInt(leftsizer.offsetLeft);
	var xloc2 = parseInt(rightsizer.offsetLeft);
	if (event.my-yloc >=0 && event.my-yloc <5) {
		console.log("In bgSizeCtrlDiv1");
		backgroundDiv.style.cursor = "n-resize";
	}else if (event.mx-xloc1 >=0 && event.mx-xloc1 <5) {
		console.log("In mainCtrlDiv1");
		backgroundDiv.style.cursor = "e-resize";
	}else if (event.mx-xloc2 >=0 && event.mx-xloc2 <5) {
		console.log("In mainCtrlDiv2");
		backgroundDiv.style.cursor = "e-resize";
	}else {
		backgroundDiv.style.cursor = "default";
	}
	if (inResizeMode==1) {
		if (resizeType=="center-bottom") {
			var tmpy = event.my - my;
			resizemain(tmpy);
			 
		}
		mx=event.mx;
		my=event.my;
	}else if (inResizeMode==2) {
		var tmpx = event.mx - mx;
		if (resizeType=="center-left") {
			resizemainLeft(tmpx);
		}else if (resizeType=="center-right") {
			resizemainRight(tmpx);
		}
		mx=event.mx;
		my=event.my;
	}
}
function handleDocMouseUp (event) {
	event = standardEvent(event);
	initResizeState();
	//o=document.onmousemove = document.onmouseup = null;
}
function handleDocMouseLeave(event) {
	event = standardEvent(event);
	initResizeState();
}
function initResizeState() {
	var backgroundDiv = document.getElementById("backgroundDiv");
	backgroundDiv.style.cursor = "default";
	inResizeMode = 0;
	resizeType ="";
}
function createTab(){
	var dispTabs = "<section id='tabContainer' class='tabContainer'>" + 
						"<ul class='tabControls'>" + 
							"<li><a href='#tab_design'>Design</a></li>" + 
							"<li><a href='#tab_source'>Source</a></li>" +
							"<li><a href='#tab_both'>Both</a></li>" + 
						"</ul>" +
						"<div id='tab_container' class='tabContentsContainer'>" +
						"    <div id='tab_design' class='tab_content'>" +
						"        <h2>開發中的設計頁</h2>" + 
						"    </div>" +
						"    <div id='tab_source' class='tab_content' contenteditable='true' spellcheck='false' />" + 
						"    <div id='tab_both' class='tab_content'>" + 
						"        <h2>開發中的合併頁</h2>" + 
						"    </div>" +
						"</div>" +
					"</section>";
	$('#mainCenterDiv').append(dispTabs);
}
function loadTabSourceContent(content) {
	
	$('#tab_source').jQxmlbox({
				content:content});
	
	//20161117 mark for test var formatedXML = formatXML(content);
	//$("#tab_source").text(formatedXML);
	//20161117 mark for test $("#tab_source").append(formatedXML);
}
function writeFile(e) {
	var srcXML = "";
	srcXML = $('#tab_source').getFormattedXMLString();
	if (srcXML === "") {
		srcXML = "Can not get xml source,please load xml first.";
	}
	download(loadedFileName,srcXML);
}
function download(filename, text) {
	var element = document.createElement('a');
	element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
	element.setAttribute('download', filename);
	element.style.display = 'none';
	document.body.appendChild(element);
	element.click();
	document.body.removeChild(element);
}
function generateJsonTemplate() {
	$('#tab_design').jQJsonGenerator({
		oriDivId:"tab_design",
		width:800});
}