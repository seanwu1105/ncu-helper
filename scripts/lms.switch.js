'use strict';

/**
 * Switch css loading.
 * Author: Sean Wu
 * NCU CSIE, Taiwan
 */

chrome.storage.sync.get('lms', function(result) {
    let switcher = result.lms;
    if (switcher) {
        // load css.
        const link = document.createElement('link');
        link.setAttribute('href', chrome.extension.getURL(
            'stylesheets/lms.css'));
        link.setAttribute('rel', 'stylesheet');
        const head = document.head || document.getElementsByTagName('head')[0]
            || document.documentElement;
        head.insertBefore(link, head.lastChild);
    }
});
