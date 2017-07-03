function EventTarget() {
	this.handlers = {};
}
EventTarget.prototype = {
	constructor:EventTarget,
	addHandler:function(type,handler){
		if (typeof this.handlers[type]== "undefined"){
			this.handlers[type]=[];
		}
		this.handlers[type].push(handler);
	},
	fire:function(event) {
		if (!event.target){
			event.target = this;
		}
		if (this.handlers[event.type] instanceof Array) {
			var handlers = this.handlers[event.type];
			for (var i=0,len=handlers.length;i<len;i++) {
				handlers[i](event);
			}
		}
	},
	removeHandler:function(type,handler) {
		if (this.handlers[type] instanceof Array) {
			var handlers = this.handlers[type];
			for (var i=0,len=handlers.length;i<len;i++) {
				if (handlers[i] == handler) {
					handlers.splice(i,1);
					break;
				}
			}
		}
	}
};
function DemoEventPerson (name,age) {
	EventTarget.call(this);
	this.name = name;
	this.age = age;
};
DemoEventPerson.inheritsFrom(EventTarget);
//inheritPrototype(DemoEventPerson,EventTarget);
DemoEventPerson.prototype.say = function (message) {
	this.fire({
		type:"message",
		message : message
	});
};
function handleMessage(event) {
	alert (event.target.name + " says " + event.message);
};
var demo = new DemoEventPerson("Nicholas",29);
DemoEventPerson.addHandler("message",handleMessage);
demo.say("Hello,my first event");