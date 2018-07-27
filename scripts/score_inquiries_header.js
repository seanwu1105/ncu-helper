'use strict';

/* Author: Sean Wu
** NCU CSIE, Taiwan
*/

(function() {
    // change the height of top bar (header) frame in frameset.
    parent.document.getElementsByTagName('frameset')[0].rows = '56, *';

    let header = document.createElement('header');
    let logo = document.createElement('div');
    let icon = document.createElement('img');
    let title = document.createElement('span');
    logo.id = 'logo';
    icon.src = chrome.extension.getURL('images/ncu_logo.svg');
    title.innerHTML = '國立中央大學教務系統';
    logo.appendChild(icon);
    logo.appendChild(title);
    header.appendChild(logo);
    document.body.appendChild(header);
})();
