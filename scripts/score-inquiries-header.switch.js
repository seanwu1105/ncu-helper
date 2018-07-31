'use strict';

/**
 * Switch css loading.
 * Author: Sean Wu
 * NCU CSIE, Taiwan
 */

chrome.storage.sync.get('score-inquiries', function(result) {
    let switcher = result['score-inquiries'];
    if (switcher) {
        // load css.
        const link = document.createElement('link');
        link.setAttribute('href', chrome.extension.getURL(
            'stylesheets/score-inquiries-header.css'));
        link.setAttribute('rel', 'stylesheet');
        const head = document.head || document.getElementsByTagName('head')[0]
            || document.documentElement;
        head.insertBefore(link, head.lastChild);
    }
});
