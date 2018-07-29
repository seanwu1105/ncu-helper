'use strict';

/**
 * Author: Sean Wu
 * NCU CSIE, Taiwan
 */

(function() {
    const enableList = ['lms.ncu.edu.tw', 'portal.ncu.edu.tw'];

    // Check the webpage
    chrome.tabs.onUpdated.addListener(function(tagID, _changeInfo, tab) {
        if (enableList.indexOf(new URL(tab.url).hostname) >= 0) {
            chrome.browserAction.enable(tagID);
        } else chrome.browserAction.disable(tagID);
    });
})();
