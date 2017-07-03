;(function(d,$){
	var jQdmtab_defaults = {
		tabContentsContainer:'.tabContentsContainer',
		tabEventAction:'click',
		current:0,
		currentSelector:'current'
	};
	$.fn.jQdmtab=function(options){
		var defaults=jQdmtab_defaults;
		var setting = $.extend(defaults,options);
		var _$obj=$(this.get(0)),
		_s = $.data($(this),setting),
		_p = {
			tabObj:_$obj,
			tabs:_$obj.find('li'),
			tabCn:_$obj.find(_s.tabContentsContainer),
			tabCnHeight:function(){
				var _$cns=_p.tabCn.children(),
				_len=_$cns.length,
				_hi=0;
				if (_p.tabs.length>0){
					//_hi=Math.max(_hi,_$cns.eq(--_len).height());
					_hi=_p.tabs.eq(0).height();
				}
				//return _hi+40;
				var parentHeight = _p.tabObj.eq(0).parent().height();
				//console.debug("Parent Height:" + parentHeight);
				//console.debug("tab height:" + _hi);
				//console.debug("padding:" + _s.padding);
				var defaultTabMargin=1;
				var tabContentHeight = parentHeight - _hi - _s.padding*2 - defaultTabMargin*2 -_s.borderWidth*2;
				console.debug("tab content height:" + tabContentHeight);
				return tabContentHeight;
			},
			current:_s.current,
			isAnimate:false
		};
		console.debug(_$obj);
		tabChangeCurrent(_p.current);
		_p.tabCn.children().not(':eq('+ _p.current + ')').css({
			display:'none',
			opacity:0
		});
		_p.tabCn.css({
			position:'relative',
			overflow:'scroll',
			background:'#ffffff',
			height:_p.tabCnHeight(),
			padding:_s.padding
		});
		
		_p.tabs.on(_s.tabEventAction,function(e){
			if (typeof e.preventDefault === 'function') {
				e.preventDefault();
			}
			var _$t = $(this),
			_index = _$t.index();
			var _current = _p.current;
			if (_index != _current && !_p.isAnimate) {
				hideTabContent(_current);
				_p.current = _index;
				showTabContent(_index);
			}
		});
		function hideTabContent(_current) {
			var _$target =_p.tabCn.children().eq(_current);
			_p.isAnimate=false;
			tabChangeCurrent(_current);
			_$target.css({
				left:0,
				opacity:0,
				display:'none',
				position:'relative'
			});
		}
		
		/*
		function showTabContent(_t) {
			var _$target=_p.tabCn.children().eq(_t);
			_p.isAnimate=true;
			tabChangeCurrent(_t);
			_$target.css({
				display:'block',
				position:'relative',
				opacity:1
			});
		}
		*/
		function showTabContent(_t) {
			var _$target=_p.tabCn.children().eq(_t);
			_p.isAnimate=true;
			tabChangeCurrent(_t);
			_$target.css({
				display:'block',
				position:'relative'
			}).animate({opacity:1},{duration:500,
				complete:function(){
					showComplete(_$target);
				}});
		}
		function showComplete(_$target){
			_p.isAnimate=false;
			_$target.css({
				display:'block',
				position:'relative',
				opacity:1
			});
		}
		function tabChangeCurrent(_t) {
			console.debug("tabChangeCurrent");
			console.debug(_s);
			_p.tabs.eq(_t).toggleClass(_s.currentSelector);
		}
	};
	
	
}(document,jQuery));