"use strict";

// Check the webpage
chrome.tabs.onUpdated.addListener(function (tagID, changeInfo, tab) {
    if (new URL(tab.url).hostname === "lms.ncu.edu.tw") {
        chrome.browserAction.enable(tagID);
    } else {
        chrome.browserAction.disable(tagID);
    }
});