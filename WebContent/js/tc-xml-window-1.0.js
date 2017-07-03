/* **************************************************************************
 * application : xml parsing and display engine                             *
 * author      : Tim wang                                                   *
 * file name   : tc-xml-window-1.0.js                                       *
 * change histor:                                                           *  
 *   Date     Tag Name  Description                                         *
 * -------------------------------------------------------------------------*
 * 20161119              Initialize                                         *
 * 20161120   TC-A.01    Fix Attribute Value Parsing Issue                  *
 * 20161120   TC-A.02    Fix Node Value                                     *
 * 20161125   TC-A.03    Fix Attrinute Name issue                           *
 * 20161126   TC-A.04    It needn't to change line before root tag name     *
 * 20170102   TC-A.05    Add function to get formatted xml                  *
 * 20170102   TC-A.06    Update Span value after keyup                      *
 * 20170107   TC-A.07    Collapsible should be a line                       *
 * 20170108   TC-A.08    Add icon div to each line                          *
 ****************************************************************************/

;(function(d,$){
	
	$.fn.jQxmlbox=function(options){
		
		var jQxmlbox_default = {
				spanKeyId:0,
				selectedSpanObj:null,
				self:this,
				resultAttrArray:null,
				resultAttrMap:{},
				readOnlyKeys:"tempKey"
		};
		
		options = $.extend(jQxmlbox_default,options);
		console.debug(options);
		this.data("myXMLControl",options);
		var formatedXML = formatXML(options.content);
		this.append(formatedXML);
		addEventListener();
		
		function formatXML(oXML) {
			var out = "";
		    var tab = "    ";
		    var indent = 0;
		    var inClosingTag=false;
		    var inHeader=false;
		    var preChar="";
		    var resultAttrArray = [];
		    var inTagName=false;
		    var tagNameStack = [];
		    var rootTagName="";
		    var tagName="";
		    var closingTagName="";
		    var tagType="";
		    var preTagType="BEGIN";
		    var inNodeDesc = false; //在 <XXX name=XX> 大括小括之間 //TIM-20161103
		    var inAttribute = false; //TIM-20161103
		    //TC-A.01 var inAttributeVal = false; //TIM-20161103
		    var attrName=""; //TIM-20161103
		    //TC-A.01 var attrVal=""; //TIM-20161103
		    var commentMap = {}; //TIM-20161109
		    var commentKeyList = []; //TIM-20161109
		    var preTagElement;
		    
		    var dent=function(no){
		        out += "\n";
		        for(var i=0; i < no; i++)
		            out+=tab;
		    };
		    //TIM-20161109 add start
		    var comIdx=0;
		    while(oXML.indexOf("<!--",comIdx)>0) {
		    	var comStart = oXML.indexOf("<!--",comIdx);
		    	var comEnd =  oXML.indexOf("-->",comStart);
		    	var tmpCom = oXML.substr(comStart+4,comEnd-comStart-4);
		    	var comKey = "comm_" + comStart + "_" + comEnd;
		    	console.debug ("[" + comKey + "][" + tmpCom + "]");
		    	commentMap[comKey]=tmpCom;
		    	commentKeyList.push(comKey);
		    	var front = oXML.substr(0,comStart);
		    	var endStrIdx = Number(comEnd) + 3;
		    	var endlen = oXML.length - Number(comEnd) -3;
		    	var end = oXML.substr(endStrIdx,endlen);
		    	oXML = front + "<!--" + comKey + "-->" + end;
		    	var comIdx = oXML.indexOf(comKey,comIdx) + comKey.length + 3;
		    }
		    //TIM-20161109 add end
		    var xml = oXML.replace(/\r\n|\n/g,"");
		    var startDate = new Date();
		    for (var i=0; i < xml.length; i++) {
		        var c = xml.charAt(i);
		        if(c=='<'){
		            // handle </
		            if(xml.charAt(i+1) == '/'){
		            	preTagType=tagType;
		            	tagType="END";
		                inClosingTag = true;
		            	if (preTagType=="END"){
		            		var tempText =createDentTextXML(indent);
		            		var lineFeed = standardTextElementForXML('\n','xml_lineFeed',indent);
		            		var forDent = standardTextElementForXML(tempText,'xml_dent',indent);
		            		resultAttrArray.push(lineFeed);
		            		resultAttrArray.push(forDent);
		            	}
		            	var resultMap = findClosingTag(xml,i);
		            	if (resultMap.valueEndIdx > 0) {
		            		var tmpC = standardTextElementForXML(resultMap.closingTag,'xml_closingTagName',indent);
		            		resultAttrArray.push(tmpC);
		            		i = resultMap.valueEndIdx;
		            		inClosingTag = false;
		            	}else {
		            		var tmpC = standardTextElementForXML('&lt;','xml_symbol',indent);
		            		resultAttrArray.push(tmpC);
		            	}
		            	indent--;
		            }else if (xml.charAt(i+1) == '?'){
		            	inHeader = true;
		            	var tmpC = standardTextElementForXML('&lt;','xml_symbol',indent);
		                resultAttrArray.push(tmpC);
		            }//TIM-20161106 add start
		            else if (xml.charAt(i+1) == '!' && xml.charAt(i+2)=='-' && xml.charAt(i+3)=='-') {
		            	var commentEnd = xml.indexOf('-->',i);
		            	var length = commentEnd+3-i;
		            	var theCommentKey = xml.substr(i,length);
		            	theCommentKey = theCommentKey.replace('<!--','').replace('-->','');
		            	console.debug("Find comment:" + theCommentKey );
		            	var theCommnent = commentMap[theCommentKey]; //TIM-20161112
		            	//console.debug(standardTextElementForXML(theComment,'xmlComment'));
		            	//resultAttrArray.push(standardTextElementForXML('<!-- ','xmlComment'));
		            	var lineFeed = standardTextElementForXML('\n','xml_lineFeed',indent); //TIM-20161109
		            	resultAttrArray.push(lineFeed); //TIM-20161109
		            	var tempText =createDentTextXML(indent+1); //TIM-20161109
		            	var forDent = standardTextElementForXML(tempText,'xml_dent',indent);//TIM-20161109
		            	resultAttrArray.push(forDent);//TIM-20161109
		            	resultAttrArray.push(standardTextElementForXML('&lt;','xml_commentSymbol',indent));
		            	resultAttrArray.push(standardTextElementForXML('!-','xml_commentSymbol',indent));
		            	resultAttrArray.push(standardTextElementForXML('- ','xml_commentSymbol',indent));
		            	//TIM-20161112 resultAttrArray.push(standardTextElementForXML(theCommentKey,'xmlComment'));
		            	resultAttrArray.push(standardTextElementForXML(theCommnent,'xml_comment',indent)); //TIM-20161112
		            	resultAttrArray.push(standardTextElementForXML(' -->','xml_commentSymbol',indent));
		            	i+=length;
		            	//console.debug(xml.charAt(i));
		            }
		            else {
		            	inTagName = true;
		            	inNodeDesc = true;
		            	preTagType=tagType;
		            	tagType="BEGIN";
		            	var lineFeed = standardTextElementForXML('\n','xml_lineFeed',indent);
		            	resultAttrArray.push(lineFeed);
		            	if (rootTagName!="") {
		            		var tempText =createDentTextXML(++indent);
		                	var forDent = standardTextElementForXML(tempText,'xml_dent',indent);
		                	resultAttrArray.push(forDent);
		            	}
		            	attrName="";
		            }
		        }else if(c=='>'){
		        	if (inTagName== true) {
		        		if (tagName==''){
		        			console.debug("Invalid element name near index-" + i);
		        		}else {
		        			var tmpTagElement = standardTextElementForXML(tagName,'xml_tagName',indent);
		        			preTagElement = hasChildTags(preTagElement,tmpTagElement);
		        			resultAttrArray.push(tmpTagElement);
		        			tagNameStack.push(tagName);
		        			if (rootTagName==""){
		        				rootTagName = tagName;
		        			}
		        		}
		        		inTagName=false;
		        		tagName="";
		        	}
		            if(xml.charAt(i-1) == '/'){
		                preTagType=tagType;
		            	tagType="END";
		            	var tmpTagName = tagNameStack.pop();
		            	inNodeDesc=false; //TIM-20161103
		            	attrName="";//TIM-20161103
		            	resultAttrArray.pop();
		            	resultAttrArray.push(standardTextElementForXML('/&gt;','xml_closingTagName',indent,tmpTagName));
		            	indent--;
		            	continue;
		            }else if (xml.charAt(i-1) == '?'){
		            	inHeader=false;
		            }else{
		            	if(!inClosingTag) {
		            	}else{
		            		resultAttrArray.push(standardTextElementForXML(closingTagName,'xml_closingTagName',indent));
		            		inClosingTag=false;
		            		closingTagName="";
		            	}
		            }
		            resultAttrArray.push(standardTextElementForXML('&gt;','xml_symbol',indent));
		            inAttribute=false;//TIM-20161103
		            attrName="";
		            var resultMap = hasTextNode(xml,i);
		            if (resultMap.valueEndIdx > 0) {
		            	resultAttrArray.push(standardTextElementForXML(resultMap.nodeText,'xml_nodevalue',indent));
		            	i = resultMap.valueEndIdx;
		            }
		        }else if (c==' ') {
		        	if (inTagName== true) {
		        		if (tagName==''){
		        			console.debug("Invalid element name near index-" + i);
		        		}else if (tagName=='?xml') {
		        			resultAttrArray.push(standardTextElementForXML(tagName,'xml_xmlDef',indent));
		        		}else {
		        			var tmpTagElement = standardTextElementForXML(tagName,'xml_tagName',indent);
		        			preTagElement = hasChildTags(preTagElement,tmpTagElement);
		        			resultAttrArray.push(tmpTagElement);
		        			tagNameStack.push(tagName);
		        			if (rootTagName==""){
		        				rootTagName = tagName;
		        			}
		        		}
		        		inTagName=false;
		        		tagName="";
		        		var hasAttrs=hasAttributeAfterTagName(xml,i);
		        		if (hasAttrs == true){
		        			inAttribute=true;
		        		}
		        	}
		        	else if (inAttribute==false) {
		        		inAttribute=true;
		        	}
		        	resultAttrArray.push(standardTextElementForXML(c,'xml_symbol',indent));
		        }else if (c=='/') {
		        	resultAttrArray.push(standardTextElementForXML(c,'xml_char',indent));
		        }else{
		          if (inTagName == true){
		        	  tagName+=c;
		          }else if (inClosingTag == true){
		        	  closingTagName+=c;
		          }
		          //TIM-20161103 add start
		          else if (inAttribute==true) {
		        	  if (c=='=') {
		        		  inAttributeVal=true;
		        		  if (attrName!="" && attrName.length > 0) {
		        			  resultAttrArray.push(standardTextElementForXML(attrName,'xml_attrName',indent));
		        			  attrName="";
		        		  }
		        		  resultAttrArray.push(standardTextElementForXML(c,'xml_char',indent));
		        		  //TC-A.01 add start
		        		  var attrMap = getAttributeValue(xml,i);
		        		  if (attrMap.quotEndIdx > 0 && attrMap.quotEndIdx < xml.length) {
		        			  if (attrMap.quotType == "doublQuotation") {
		        				  resultAttrArray.push(standardTextElementForXML("\"",'xml_quotation',indent));
		        				  resultAttrArray.push(standardTextElementForXML(attrMap.attributeValue,'xml_attrValue',indent));
		        				  resultAttrArray.push(standardTextElementForXML("\"",'xml_quotation',indent));
		        				  c="\"";
		        			  }else {
		        				  resultAttrArray.push(standardTextElementForXML("'",'xml_quotation',indent));
		        				  resultAttrArray.push(standardTextElementForXML(attrMap.attributeValue,'xmlAttrValue',indent));
		        				  resultAttrArray.push(standardTextElementForXML("'",'xml_quotation',indent));
		        				  c="'";
		        			  }
		        			  i=attrMap.quotEndIdx;
		        			  inAttribute = false;
		        		  }else {
		        			  console.error("Parsing attribute value fail at index" + i );
		        		  }
		        	  }else {
		        		  attrName+=c;
		        	  }
		        
		          }
		          else {
		        	  resultAttrArray.push(standardTextElementForXML(c,'xml_char',indent));
		          }
		        }
		        preChar=c;
		    }
		    reformatForDisplay(resultAttrArray);
		    for (var i=0;i<resultAttrArray.length;i++) {
		    	out +=resultAttrArray[i].htmlText;
		    	options.resultAttrMap[resultAttrArray[i].spanKeyId] = resultAttrArray[i];
		    }
		    options.resultAttrArray = resultAttrArray;
		    var endDate = new Date();
		    var diff = endDate - startDate;
		    console.debug("xml reformat time diff is " + diff);
		    return out;
		}
		function reformatForDisplay(resultAttrArray) {
			for (var i=0;i<resultAttrArray.length;i++) {
				if (resultAttrArray[i].spanStyle == 'xml_tagName') {
					if (resultAttrArray[i].hasChild == false) {
						if (i-1 > 0 && resultAttrArray[i-1].spanStyle == 'xml_dent'){
							//TC-A.08 resultAttrArray[i-1].htmlText="<div class='xml_line'>" + resultAttrArray[i-1].htmlText;
							resultAttrArray[i-1].htmlText="<div class='xml_line'><div class='xml_lineicon'/>" + resultAttrArray[i-1].htmlText; //TC-A.08
						}else {
							//TC-A.08 resultAttrArray[i].htmlText="<div class='xml_line'><span class='"
							resultAttrArray[i].htmlText="<div class='xml_line'><div class='xml_lineicon'/><span class='"  //TC-A.08
								+ resultAttrArray[i].spanStyle + "' "
								+ " indent=" + resultAttrArray[i].indent 
								+ " hasChild='" + resultAttrArray[i].hasChild + "' "
								+ " tagName='" + resultAttrArray[i].tagName + "' " 
								+ " spanKey=" + resultAttrArray[i].spanKeyId + ">" + resultAttrArray[i].data + "</span>";
						}
						appendLineEndDivTag(resultAttrArray,i,resultAttrArray[i].tagName);
					}else {
						var hasChildDiv = false;
						if (i-1 > 0 && resultAttrArray[i-1].spanStyle == 'xml_dent') {
							//TC-A.07 resultAttrArray[i-1].htmlText="<div class='xml_collapsible'>" + resultAttrArray[i-1].htmlText;
							//TC-A.08 resultAttrArray[i-1].htmlText="<div class='xml_collapsible'><div class='xml_line'>" + resultAttrArray[i-1].htmlText; //TC-A.07
							resultAttrArray[i-1].htmlText="<div class='xml_collapsible'><div class='xml_line'><div class='xml_collapsibleicon'><img class='xmlCtrlIcon', src='images/xml_open.png'></div>" + resultAttrArray[i-1].htmlText; //TC-A.08
							
						}else {
							//TC-A.07 resultAttrArray[i].htmlText="<div class='xml_collapsible'><span class='"
							//TC-A.08 resultAttrArray[i].htmlText="<div class='xml_collapsible'><div class='xml_line'><span class='" //TC-A.07
							resultAttrArray[i].htmlText="<div class='xml_collapsible'><div class='xml_line'><div class='xml_collapsibleicon'><img class='xmlCtrlIcon', src='images/xml_open.png'></div><span class='" //TC-A.08
								+ resultAttrArray[i].spanStyle + "' "
								+ " indent=" + resultAttrArray[i].indent 
								+ " hasChild='" + resultAttrArray[i].hasChild + "' "
								+ " tagName='" + resultAttrArray[i].tagName + "' " 
								+ " spanKey=" + resultAttrArray[i].spanKeyId + ">" + resultAttrArray[i].data + "</span>";
						}
						appendTagEndDivTag(resultAttrArray,i,resultAttrArray[i].tagName); //TC-A.07 
						appendLineEndDivTag(resultAttrArray,i,resultAttrArray[i].tagName);
					}
				}
			}
		}
		function appendLineEndDivTag (resultAttrArray,strIdx,tagName) {
			var endTagFound = false;
			var endTagFoundIdx = -1;
			var lineFeedFoundIdx = -1;
			for (var j=strIdx;j<resultAttrArray.length;j++) {
				if (resultAttrArray[j].spanStyle=='xml_closingTagName') {
					if (resultAttrArray[j].tagName == tagName) {
						endTagFound = true;
						endTagFoundIdx = j;
					}
				}
				if (endTagFound == true) {
					if (resultAttrArray[j].spanStyle == 'xml_lineFeed') {
						resultAttrArray[j].htmlText+= "</div>";
						lineFeedFoundIdx = j;
						break;
					}
				}
			}
			console.debug("appendLineEndDivTag-[" + tagName + "]:" + endTagFoundIdx + ";" + lineFeedFoundIdx);
		}
		//TC-A.07 add start
		function appendTagEndDivTag (resultAttrArray,strIdx,tagName) { 
			var endTagFound = false;
			var endTagFoundIdx = -1;
			var lineFeedFoundIdx = -1;
			for (var j=strIdx;j<resultAttrArray.length;j++) {
				if (resultAttrArray[j].spanStyle=='xml_symbol' && resultAttrArray[j].data=="&gt;") {
					endTagFound = true;
					endTagFoundIdx = j;
				}
				if (endTagFound == true) {
					if (resultAttrArray[j].spanStyle == 'xml_lineFeed') {
						resultAttrArray[j].htmlText+= "</div>";
						lineFeedFoundIdx = j;
						break;
					}
				}
			}
			console.debug("appendTagEndDivTag-[" + tagName + "]:" + endTagFoundIdx + ";" + lineFeedFoundIdx);
		}
		//TC-A.07 add end
		function standardTextElementForXML(text,type,indent,theTagName) {
			var htmlText="";
			options.spanKeyId+=1;
			if (type=='xml_closingTagName'){
				var tmpText=text.replace("<","&lt;").replace(">","&gt;");
				if (theTagName != undefined && theTagName != null) {
					htmlText="<span class='" + type + "' indent=" + indent + " tagName='" + theTagName 
						+ "' spanKey=" + options.spanKeyId + ">" + tmpText + "</span>";
				}else {
					var tmpTagName = text.replace("<","").replace(">","").replace("/","");
					htmlText="<span class='" + type + "' indent="+ indent + " tagName='" + tmpTagName 
						+ "' spanKey=" + options.spanKeyId + ">" + tmpText + "</span>";
					theTagName=tmpTagName;
				}
			}else if (type=='xml_tagName') {
				var text = "&lt;" + text;
				var tmpTagName=text.replace("<","").replace(">","").replace("&lt;","");
				theTagName = tmpTagName;
				htmlText="<span class='" + type + "' indent=" + indent+ " tagName='" + tmpTagName 
						+ "' spanKey=" + options.spanKeyId + ">" + text + "</span>";
			}else {
				htmlText="<span class='" + type + "' indent=" + indent+ " spanKey=" + options.spanKeyId 
						+ ">" + text + "</span>";		
			}
			if (theTagName == undefined) {
				theTagName="";
			}
			var el = {
					data:text,
					spanStyle:type,
					htmlText:htmlText,
					indent:indent,
					tagName:theTagName,
					spanKeyId:options.spanKeyId
			};
			return el;
		}
		function createDentTextXML(no) {
			var tab = "    ";
			var out = "";
			for(var i=0; i < no; i++)
		        out+=tab;
			return out;
		}
		function getAttributeValue (xml,startIdx) {
			var quotType= "";
			var quotIdx = -1;
			var quotEndIdx = -1;
			var attrVal = "";
			for (var j=startIdx+1;j<xml.length;j++) {
				var c = xml.charAt(j);
		        if(c=="\""){
		        	quotType = "doublQuotation";
		        	quotIdx=j;
		        	break;
		        }else if ("'"){
		        	qutoType = "singleQuotation";
		        	quotIdx=j;
		        	break;
		        }
			}
			
			for (var j=quotIdx+1;j<xml.length;j++) {
				var c = xml.charAt(j);
				if (quotType=="doublQuotation") {
					if (c=="\"") {
						quotEndIdx=j;
						break;
					}else {
						attrVal+=c;
					}
				}else if (quotType=="singleQuotation") {
					if (c=="'") {
						quotEndIdx=j;
						break;
					}else {
						attrVal+=c;
					}
				}
			}
			var resultMap = {quotType:quotType,
					         quotIdx:quotIdx,
					         quotEndIdx:quotEndIdx,
					         attributeValue:attrVal};
			console.debug("QuotationMarkType is " + quotType + ";index is " + quotIdx + 
					"; qutoEndIdx is " + quotEndIdx + ";attrVal is " + attrVal);
			return resultMap;
		}
		function hasAttributeAfterTagName (xml,startIdx) {
			var attrText = "";
			for (var j=startIdx+1;j<xml.length;j++) {
				var c=xml.charAt(j);
				if (c=='>') {
					checkEndIdx=j;
				}else if (c==' ') {}
				else {
					attrText +=c;
				}
			}
			if (attrText=="") {
				return false;
			}else {
				return true;
			}
		}
		function ascii (a) { return a.charCodeAt(0);}
		function hasTextNode(xml,startIdx) {
			var nodeText = "";
			var valueEndIdx = -1;
			for (var j=startIdx+1;j<xml.length;j++) {
				var c = xml.charAt(j);
				if (c=='<') {
					var nc = xml.charAt(j+1);
					if (nc == '/') {
						valueEndIdx = j - 1;
					}
					break;
				}else {
					nodeText +=c;
				}
			}
			var resultMap= {
					valueEndIdx:valueEndIdx,
					nodeText:nodeText
			};
			console.debug("NodeText is " + nodeText + ", nodeTextEnd index is " + valueEndIdx);
			return resultMap;
				
		}
		function findClosingTag(xml,startIdx) {
			var tagName="";
			var valueEndIdx=-1;
			for (var j=startIdx;j<xml.length;j++) {
				var c=xml.charAt(j);
				if (c=='>'){
					tagName+=c;
					valueEndIdx=j;
					break;
				}else {
					tagName+=c;
				}
			}
			var resultMap = {
					valueEndIdx:valueEndIdx,
					closingTag:tagName
			};
			console.debug("ClosingTag is " + tagName + ", nodeTextEnd index is " + valueEndIdx);
			return resultMap;
		}
		function hasChildTags(preTagElement,tmpTagElement) {
			if (preTagElement == undefined || preTagElement == null) {
				preTagElement = tmpTagElement;
			}else {
				if (tmpTagElement.indent > preTagElement.indent) {
					preTagElement["hasChild"] = true;
				}else {
					preTagElement["hasChild"] = false;
				}
				preTagElement.htmlText = "<span class='" + preTagElement.spanStyle + "' indent=" + preTagElement.indent 
					+ " hasChild='" + preTagElement.hasChild + "' tagName='" + preTagElement.tagName 
					+ "' spanKey=" + preTagElement.spanKeyId + ">" + preTagElement.data + "</span>";
				preTagElement = tmpTagElement;
			}
			return preTagElement;
		}
		function addEventListener() {
			$(".xml_tagName[hasChild='true'").hover(function(e) {
				//TC-07 $(this).parent().toggleClass('forum_hover');
				$(this).parent().parent().toggleClass('forum_hover');
			});
			options.self.on('keyup',handleKeyupEvent);
			options.self.on('keydown',handleKeydownEvent);
			options.self.on('click',handleMouseClickEvent);
			options.self.on('dblclick',handleMouseDoubleClickEvent,false);
			//$("#regEventDiv").on("click",handleMouseClickEvent);
			//$("#regEventDiv").on("click",handleMouseClickEvent);
		}
		function handleKeyupEvent(e) {
			var theSelectedSpan = getPointerSpan();
			if (theSelectedSpan == undefined || theSelectedSpan == null) {
				return;
			}
			console.debug(theSelectedSpan);
			highLightSelectedSpan(theSelectedSpan);
		}
		function handleKeydownEvent(e) {
			var theSelectedSpan = getPointerSpan();
			if (theSelectedSpan == undefined || theSelectedSpan == null) {
				return;
			}
			if (theSelectedSpan.attr("class").indexOf("xml_nodevalue")>=0) {
				if (theSelectedSpan.attr("readonlyFlag")=="true") {
					if (e.keyCode == '37' || e.keyCode =='38' || e.keyCode=='39' || e.keyCode=='40') {
					}else {
						e.preventDefault();
					}
				}
			}
		}
		function handleMouseDoubleClickEvent(e) {
			e.preventDefault();
		}
		function handleMouseClickEvent(e) {
			var theSelectedSpan = getPointerSpan();
			if (theSelectedSpan == undefined || theSelectedSpan == null) {
				return;
			}
			console.debug(theSelectedSpan);
			highLightSelectedSpan(theSelectedSpan);
			
		}
		function highLightSelectedSpan(theSelectedSpan) {
			if (theSelectedSpan.attr("class").indexOf("xml_nodevalue")>=0) {
				if (theSelectedSpan.attr("readonlyFlag")=="true") {
					
				}else {
					console.debug("readonly==false");
					focusOnNodeValue(theSelectedSpan);
				}
			}else if (theSelectedSpan.attr("class").indexOf("xml_attrValue")>=0) {
				var updateFlag = updateSpanValue(theSelectedSpan);//TC-A.06 add start
				focusOnNodeValue(theSelectedSpan,updateFlag);
			}
			else {
				if (options.selectedSpanObj!=null) {
					options.selectedSpanObj.fadeIn("slow",function(){
						options.selectedSpanObj.removeClass("forum_select");
					});
				}
			}
		}
		//TC-A.06 add start
		function updateSpanValue(theSelectedSpan) {
			var updateFlag = false;
			var theSpanKey = theSelectedSpan.attr("spanKey");
			if (theSpanKey in options.resultAttrMap) {
				var theSpanData = options.resultAttrMap[theSpanKey];
				console.debug("The original span data is " + theSpanData.data);
				console.debug("The new span data is " + theSelectedSpan.text());
				if (theSpanData.data != theSelectedSpan.text()) {
					console.debug("Begin to change the span data");
					theSpanData.data = theSelectedSpan.text();
					updateFlag = true;
					/*
					theSpanData.htmlText = "<span class='" + theSpanData.spanStyle + "' indent=" + theSpanData.indent + 
						" spanKey=" + theSpanData.spanKeyId + " key='" + theSpanData.key + "' readonlyFlag='" 
						+ theSpanData.readonlyFlag + "'>" +theSpanData.data + "</span>";
						*/
				}else {
					console.debug("Span data is not been changed");
				}
			}
			return updateFlag;
		}
		//TC-A.06 add end
		function focusOnNodeValue(theFocusSpan,updateFlag) {
			if (options.selectedSpanObj !=null) {
				options.selectedSpanObj.fadeIn("slow",function(){
					options.selectedSpanObj.removeClass("forum_select");
					options.selectedSpanObj.css("background-color", "");
				});
			}
			if (updateFlag!=undefined && updateFlag ===true) {
				
				//theFocusSpan.animate({backgroundColor: '#FF99FF'}, 1000);
				theFocusSpan.css("background-color", '#FF99FF');
				theFocusSpan.animate({backgroundColor: '#FFFF9D'}, 1000);
				theFocusSpan.addClass("forum_select");
				
			}else{
				theFocusSpan.fadeIn("slow",function () {
					theFocusSpan.addClass("forum_select");
				});
			}
			options.selectedSpanObj = theFocusSpan;
			/*
			var theSpanKey = theFocusSpan.attr("spanKey");
			if (theSpanKey in options.resultAttrMap) {
				var theSpanData = options.resultAttrMap[theSpanKey];
				theSpanData.data = theFocusSpan[0].textContent;
				theSpanData.htmlText = "<span class='" + theSpanData.spanStyle + "' indent=" + theSpanData.indent + 
					" spanKey=" + theSpanData.spanKeyId + " key='" + theSpanData.key + "' readonlyFlag='" 
					+ theSpanData.readonlyFlag + "'>" +theSpanData.data + "</span>";
			}
			*/
		}
		function rollbackNodeValue(theFocusSpan) {
			var theSpanKey = theFocusSpan.attr("spanKey");
			if (theSpanKey in options.resultAttrMap) {
				var theSpanData = options.resultAttrMap[theSpanKey];
				theFocusSpan.text(theSpanData.data);
			}
		}
		function getPointerSpan() {
			console.debug("getPointerSpan");
			var theSelectedSpan=null;
			if ($("#cursorhook")==undefined || $("#cursorhook")!=null) {
				var x = document.getSelection();
				var r = x.getRangeAt(0);
				var tmpHtml=r.commonAncestorContainer.innerHTML;
				console.debug(r.commonAncestorContainer.innerHTML);
				console.debug(tmpHtml);
				if (tmpHtml === undefined) {
					var tempnode = document.createElement("div");
					tempnode.setAttribute("id", "cursorhook");
					r.surroundContents(tempnode);
					console.debug(r);
					theSelectedSpan=$("#cursorhook").parent();
					
					console.debug("The selected span key is " + $("#cursorhook").parent().attr("spanKey") + 
							" class is " + theSelectedSpan.attr("class"));
					console.debug($("#cursorhook").text());
					$("#cursorhook").remove();
				}else {
					theSelectedSpan = null;
				}
			}
			return theSelectedSpan;
		}
		
	};
	$.fn.getXMLString = function () {
		var obj = this.data("myXMLControl");
		var xmlString = "";
		if (obj.resultAttrArray!=undefined && obj.resultAttrArray!=null) {
			for (var i=0;i<obj.resultAttrArray.length;i++) {
				if (obj.resultAttrArray[i].spanStyle == 'xml_tagName' ||
					obj.resultAttrArray[i].spanStyle == 'xml_symbol' ||
					obj.resultAttrArray[i].spanStyle == 'xml_attrName' ||
					obj.resultAttrArray[i].spanStyle == 'xml_char' ||
					obj.resultAttrArray[i].spanStyle == 'xml_quotation' ||
					obj.resultAttrArray[i].spanStyle == 'xml_attrValue' ||
					obj.resultAttrArray[i].spanStyle == 'xml_nodevalue' ||
					obj.resultAttrArray[i].spanStyle == 'xml_closingTagName') {
					xmlString += obj.resultAttrArray[i].data.replace("&lt;","<").replace("&gt;",">");
				}
			}
		}
		return xmlString;
	};
	//TC-A.05 add start
	$.fn.getFormattedXMLString = function () {
		var obj = this.data("myXMLControl");
		var xmlString = "";
		if (obj.resultAttrArray!=undefined && obj.resultAttrArray!=null) {
			for (var i=0;i<obj.resultAttrArray.length;i++) {
				if (obj.resultAttrArray[i].spanStyle == 'xml_tagName' ||
					obj.resultAttrArray[i].spanStyle == 'xml_symbol' ||
					obj.resultAttrArray[i].spanStyle == 'xml_attrName' ||
					obj.resultAttrArray[i].spanStyle == 'xml_char' ||
					obj.resultAttrArray[i].spanStyle == 'xml_quotation' ||
					obj.resultAttrArray[i].spanStyle == 'xml_attrValue' ||
					obj.resultAttrArray[i].spanStyle == 'xml_nodevalue' ||
					obj.resultAttrArray[i].spanStyle == 'xml_closingTagName'||
					obj.resultAttrArray[i].spanStyle == 'xml_lineFeed' ||
					obj.resultAttrArray[i].spanStyle == 'xml_dent') {
					xmlString += obj.resultAttrArray[i].data.replace("&lt;","<").replace("&gt;",">");
				}
			}
			
			for (var i=0;i<obj.resultAttrArray.length;i++) {
				xmlString += obj.resultAttrArray[i].htmlText;
			}
		}
		return xmlString;
	};
	//TC-A.05 add end
}(document,jQuery));
