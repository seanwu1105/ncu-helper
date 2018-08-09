'use strict';

/**
 * Switch css loading.
 * Author: Sean Wu
 * NCU CSIE, Taiwan
 */

chrome.storage.sync.get('score-inquiries', (result) => {
    if (result['score-inquiries']) {
        // load css.
        const link = document.createElement('link');
        link.setAttribute('href', chrome.extension.getURL(
            'stylesheets/score-inquiries-header.css'));
        link.setAttribute('rel', 'stylesheet');
        const head = document.head || document.getElementsByTagName('head')[0]
            || document.documentElement;
        head.insertBefore(link, head.lastChild);

        $(document).ready(() => {
            // change the height of top bar (header) frame in frameset.
            parent.document.getElementsByTagName('frameset')[0].rows = '56, *';

            const header = document.createElement('header');
            const logo = document.createElement('div');
            const icon = document.createElement('img');
            const title = document.createElement('span');
            logo.id = 'logo';
            icon.src = chrome.extension.getURL('images/ncu_logo.svg');
            title.innerHTML = '國立中央大學教務系統';
            logo.appendChild(icon);
            logo.appendChild(title);
            header.appendChild(logo);
            document.body.appendChild(header);
        });
    }
});
