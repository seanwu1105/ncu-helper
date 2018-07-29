'use strict';

/**
 * Author: Sean Wu
 * NCU CSIE, Taiwan
 */


const enableList = ['lms.ncu.edu.tw', 'portal.ncu.edu.tw'];

// Check the webpage
chrome.tabs.onUpdated.addListener(function(tagID, _changeInfo, tab) {
    if (enableList.indexOf(new URL(tab.url).hostname) >= 0) {
        chrome.browserAction.enable(tagID);
    } else chrome.browserAction.disable(tagID);
});

// Set default settings.
chrome.storage.sync.set({
    'lms': true,
    'score-inquiries': true,
});
