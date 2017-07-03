var tHandle;
var actionGroupId;
function update(theMessage) {
	console.debug("update");
	$("#simulateStatusDiv").append(theMessage + "<br />");
	//var objDiv = document.getElementById("simulateStatusDiv");
	//objDiv.scrollTop = objDiv.scrollHeight;
	var myDiv = $("#simulateStatusDiv").get(0);
	//console.debug("scroll height of myDiv is " + myDiv.scrollHeight);
	//console.debug("client height of myDiv is " + myDiv.clientHeight);
	//console.debug("scroll top of myDiv is " + myDiv.scrollTop);
	var tmpScrollTop = myDiv.scrollHeight - myDiv.clientHeight;
	//console.debug("client height of myDiv is " + tmpScrollTop);
	myDiv.scrollTop = tmpScrollTop;
}
function readMessageQueue() {
	console.debug("readMessageQueue");
	$.ajax({
		type:'POST',
		url:'ReadMessageQueueServlet',
		dataType:'json',
		data:{
			'ActionGroupId': actionGroupId
		},
		success:function(json){
			//console.debug("readMessageQueue Done");
			//console.debug(json);
			if (json.MessageList.length > 0) {
				for (var i=0;i<json.MessageList.length;i++) {
					//console.debug(json.MessageList[i]);
					update(json.MessageList[i]);
				}
			}
		}
	});
}
function genSimulationTemplate(actionGroupId) {
	console.debug("genSimulationTemplate");
	$.ajax({
		type:'POST',
		url:'GenSimulationTemplateServlet',
		dataType:'json',
		data:{
			'ActionGroupId': actionGroupId
		},
		success:function(json){
			console.debug(json);
			console.debug("genSimulationTemplate Done");
		}
	});
}
function runTheActionGroup(){
	console.debug("runTheActionGroup");
		
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
			console.debug("runTheActionGroup Done");
		}
	});
}
function simulateActionGroup(srcDivId,dialogDivId,dialogTitle,actionGroupId) {
	
	var ltplnDiv = document.getElementById(srcDivId);
	var dialogDiv = document.createElement("div");
	dialogDiv.setAttribute('id',dialogDivId);
	dialogDiv.setAttribute('title',dialogTitle);
	
	//initialize canvas div and canvas
	var consoleDiv = document.createElement("div");
	consoleDiv.setAttribute('id',"consoleDiv");
	
	var simulateStatusDiv = document.createElement("div");
	simulateStatusDiv.setAttribute('id',"simulateStatusDiv");
	simulateStatusDiv.setAttribute('class',"runningLog");
	consoleDiv.appendChild(simulateStatusDiv);
	
	dialogDiv.appendChild(consoleDiv);
		
	ltplnDiv.appendChild(dialogDiv);
	$('#'+dialogDivId).dialog({
		minWidth:402,
		close: function(){
			clearInterval(tHandle);
			$(this).remove();
		},
		open:function() {
			console.debug("Dialog open");
			tHandle=setInterval(readMessageQueue, 300);
			console.debug("The action group handler:" + tHandle);
			genSimulationTemplate(actionGroupId);
			runTheActionGroup();
			
		}
	});
}

