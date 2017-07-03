;(function(d,$){
	$.fn.jQJsonGenerator=function(options){
		var jQJsonGenerator_default = {
				self:this,
				codeeditor:null
		};
		options = $.extend(jQJsonGenerator_default,options);
		console.debug(options);
		showGeneratorDialog(options.oriDivId,"JQJsonGenerator","test");
		
		function showGeneratorDialog(oriDivId,dialogDivId,dialogTitle){
			
			var oriDiv = document.getElementById(oriDivId);
			var dialogDiv = document.createElement("div");
			dialogDiv.setAttribute('id',dialogDivId);
			dialogDiv.setAttribute('title',dialogTitle);
			
			var toolBarDiv = document.createElement("div");
			toolBarDiv.className="tool-bar";
			toolBarDiv.setAttribute('id',"jsonTempTB");
			
			
			var topDiv = document.createElement("div");
			topDiv.className="top-info";
			var topLeftDiv = document.createElement("div");
			topLeftDiv.setAttribute('id',"jsoneditor");
			topLeftDiv.className="top-left";
			var topCenterDiv = document.createElement("div");
			topCenterDiv.className="top-center";
			var topRightDiv = document.createElement("div");
			topRightDiv.className="top-right";
			topRightDiv.setAttribute('id',"xmleditor");
			topDiv.appendChild(topLeftDiv);
			topDiv.appendChild(topCenterDiv);
			topDiv.appendChild(topRightDiv);
			
			var bottomDiv = document.createElement("div");
			bottomDiv.className="buttom-info";
			var textArea=document.createElement("textarea");
			textArea.setAttribute('id',"settingeditor");
			bottomDiv.appendChild(textArea);
			
			dialogDiv.appendChild(toolBarDiv);
			dialogDiv.appendChild(topDiv);
			dialogDiv.appendChild(bottomDiv);
			oriDiv.appendChild(dialogDiv);
			
			var soapMessageInputElem = document.createElement('input');   
			soapMessageInputElem.setAttribute("type", "file");
			soapMessageInputElem.setAttribute("accept", ".xml");
			soapMessageInputElem.setAttribute("id", "soapMessagefileInput");
			soapMessageInputElem.style.display = "none";
			soapMessageInputElem.onchange = function(e){
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
						
						var editor=document.getElementById("xmleditor");
						var xml = contents.replace(/\r\n|\n/g,"");
						xml = xml.replace(/\>\s+/g,">");
						Xonomy.render(xml, editor, null);
						$(document).on("xonomy-click-element", function(event, jsMe){
							console.log(jsMe);
							console.log(event.target);
							var xPath = jsMe.name;
							var o=event.target.parentElement;
							while (o!=null) {
								console.log(o.id);
								if (o.getAttribute("class")==="children") {
									o=o.parentElement;
									continue;
								}
								if (o.hasAttribute("data-name")) {
									xPath = o.getAttribute("data-name") + "/" + xPath;
									o=o.parentElement;
								}
								if (o.hasAttribute("id")) {
									if (o.getAttribute("id")==="xmleditor") {
										break;
									}
								}
							}
							console.log(xPath);
							options.codeeditor.setValue(xPath);
						});
						$(document).on("xonomy-click-attribute", function(event, jsMe){ console.log(jsMe); });
						//parseSqlContent(contents);
						//newTab(f.name,contents);
						//loadTabSourceContent(contents);
					};
					r.readAsText(f);
				}
				$("#soapMessagefileInput").val('');
				console.debug("readSoapMessage");
			};
			
			
			//soapMessageInputElem.addEventListener('change', this.readSoapMessage, false);
			oriDiv.appendChild(soapMessageInputElem);
			
			initFuncIcons();
			initFuncIconsEvent();
			createJsonEditor();
			createXMLEditor();
			createScriptEditor();
			$('#'+dialogDivId).dialog({
				width:options.width,
				close: function(event, ui){
			        $(this).dialog("close");
			        $(this).remove();
			    }
			});
		}
		
		function createJsonEditor() {
			var container = document.getElementById("jsoneditor");
	        var options = {};
	        var editor = new JSONEditor(container, options);
	        // set json
	        var json = {
	            "Array": [1, 2, 3],
	            "Boolean": true,
	            "Null": null,
	            "Number": 123,
	            "Object": {"a": "b", "c": "d"},
	            "String": "Hello World"
	        };
	        editor.set(json);
		}
		
		function createXMLEditor() {
			var xml="<list><item label='one'/><item label='two'/></list>";
			var editor=document.getElementById("xmleditor");
			Xonomy.render(xml, editor, null);
		}
		
		function createScriptEditor() {
			var code = document.getElementById("settingeditor");
			var editor = CodeMirror.fromTextArea(code, {
			    lineNumbers: true
			  });
			options.codeeditor = editor;
		}
		
		function initFuncIcons(){
			var funIcon = 
				"<table>" + 
					"<tr>" + 
						"<td class='dialogIcon'><img id='openSoapMessageImg' class='imgIcon', src='images/ayUeLj4.png' title='Open Soap Message File'></td>" +
					"</tr>" + 
				"</table>";
			
			$('#jsonTempTB').append(funIcon);
		};
		function initFuncIconsEvent(){
			var openSoapMessageIcon  = document.getElementById('openSoapMessageImg') ;
			openSoapMessageIcon.onclick=readSoapMessageFile;
		}
		function readSoapMessageFile() {
			$("#soapMessagefileInput").trigger('click');
		}
		
	};
	
}(document,jQuery));