// console.log("background.js load...");

var portStore = {};

var createConnect = function (tabId) {
	var port = portStore[tabId];
	
	if (port) {
		return port;
	}
	
	port = chrome.tabs.connect(tabId);
	portStore[tabId] = port;
	
	return port;
};



// 监听通信事件
chrome.extension.onConnect.addListener(function(port) {
	port.onMessage.addListener(function(msg) {
		if (msg.type == "log") {
			console.info("receive a log request from port...");
			
			var logList = msg.logList;
			logList.unshift("port log: ");
			
			console.log.apply(console, logList);
			
			return;
		}
		
		
		
		// console.log(msg.info);
		
		chrome.tabs.getAllInWindow(function (tabArray) {
			// console.log("tabs:");
			// console.log(tabArray);
			
			var currentTab = null;
			var targetTab = null;
			
			currentTab = tabArray.find(function(tab, index, tabs) {
				return tab.selected;
			});
			
			// 根据contentScripts传来的方向，确定将要切换的 目标tab
			if (msg.isSwitchToLeft) {
				// console.log("prev tag");
				
				targetTab = tabArray[currentTab.index - 1];
				
				if (!targetTab) {
					targetTab = tabArray.slice(-1)[0];
				}
			}
			if (msg.isSwitchToRight) {
				// console.log("next tag");
				
				targetTab = tabArray[currentTab.index + 1];
				
				if (!targetTab) {
					targetTab = tabArray[0];
				}
			}
			
			// console.log("targetTab:", targetTab);
			
			// 切换tab
			chrome.tabs.update(targetTab.id, {
				selected: true
			}, function callback() {
				var currentTabPort = createConnect(currentTab.id);
				currentTabPort.postMessage("leave");
				
				var targetTabPort = createConnect(targetTab.id);
				targetTabPort.postMessage("enter");
				
				// console.log("switch to tab:", targetTab.index);
			});
		});
	});
});
