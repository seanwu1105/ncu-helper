'use strict';

/**
 * Author: Sean Wu
 * NCU CSIE, Taiwan
 */

(function() {
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
})();
