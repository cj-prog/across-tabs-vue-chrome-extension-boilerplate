chrome.browserAction.onClicked.addListener(function() {
  const newURL = chrome.extension.getURL('index.html');
  chrome.tabs.create({ url: newURL });
});
