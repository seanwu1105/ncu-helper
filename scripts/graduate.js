'use strict';

/**
 * Switch css loading.
 * Author: Sean Wu
 * NCU CSIE, Taiwan
 */

chrome.storage.sync.get('graduate', (result) => {
    if (result['graduate']) {
        // load css.
        const link = document.createElement('link');
        link.setAttribute('href', chrome.extension.getURL(
            'stylesheets/graduate.css'));
        link.setAttribute('rel', 'stylesheet');
        const head = document.head || document.getElementsByTagName('head')[0]
            || document.documentElement;
        head.insertBefore(link, head.lastChild);
    }
});
