// console.log("insertEvent.js");

// 鼠标右键按住的标志（根据此标志判断 滚动滚轮时是否切换标签）
var isRightClick = false;
var port = chrome.extension.connect();
var postMessage = function (message) {
	port.postMessage(message);
};
var logToBackground = function () {
	port.postMessage({
		type: "log",
		logList: Array.from(arguments)
	});
};


// 鼠标按下事件
$(document).mousedown(function (e) {
	// console.log("mousedown on document");
	
	// 鼠标按下为右键时，设置标志
	if (e.which == 3) {
		isRightClick = true;
	}
	else {
		isRightClick = false;
	}
});
// 鼠标松开时，取消标志
$(document).mouseup(function (e) {
	// console.log("mouseup on document");
	
	isRightClick = false;
});

// 监听滚轮事件
$(window).bind("mousewheel", function (e) {
	// console.log("mousewheel on window");
	// console.log("isRightClick:", isRightClick);
	// console.log("e.wheelDelta :", e.originalEvent.wheelDelta);
	logToBackground("isRightClick:", isRightClick);
	
	// 当 鼠标右键按住的标志 为true时，向 后台js发送消息
	if (isRightClick) {
		var wheelDelta = e.originalEvent.wheelDelta;
		var isSwitchToLeft = (wheelDelta > 0) ? true : false;
		var isSwitchToRight = !isSwitchToLeft;
		
		if (isSwitchToLeft) {
			// console.log("switchToLeft!");
			
			postMessage({
				info: "switchToLeft",
				isSwitchToLeft: true
			});
		}
		if (isSwitchToRight) {
			// console.log("switchToRight!");
			
			postMessage({
				info: "switchToRight",
				isSwitchToRight: true
			});
		}
		
		// 取消浏览器默认事件（否则会出现右键菜单，并且让 继续滚动滚轮时 重新切换标签 失效）
		e.preventDefault();
	}
});




