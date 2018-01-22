chrome.tabs.onUpdated.addListener(function (tagID, changeInfo, tab) {
    if (new URL(tab.url).hostname == "lms.ncu.edu.tw") {
        chrome.pageAction.show(tagID);
    }
});