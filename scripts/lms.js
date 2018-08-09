'use strict';

/**
 * Switch css loading.
 * Author: Sean Wu
 * NCU CSIE, Taiwan
 */

chrome.storage.sync.get('lms', (result) => {
    let switcher = result.lms;
    if (switcher) {
        // load css.
        const link = document.createElement('link');
        link.setAttribute(
            'href', chrome.extension.getURL('stylesheets/lms.css'));
        link.setAttribute('rel', 'stylesheet');
        const head = document.head || document.getElementsByTagName('head')[0]
            || document.documentElement;
        head.insertBefore(link, head.lastChild);

        $(document).ready(() => {
            // add LMS logo.
            const ccTabsL = document.getElementById('ccTabsL');
            const homepageLink = document.createElement('a');
            const logo = document.createElement('div');
            const icon = document.createElement('img');
            const title = document.createElement('span');
            homepageLink.href = ('https://lms.ncu.edu.tw/');
            logo.id = 'logo';
            icon.src = chrome.extension.getURL('images/ncu_logo.svg');
            title.innerHTML = 'LMS';
            logo.appendChild(icon);
            logo.appendChild(title);
            homepageLink.appendChild(logo);
            if (ccTabsL) ccTabsL.appendChild(homepageLink);

            // change the #ccQTool DOM node.
            const ccTabsR = document.getElementById('ccTabsR');
            if (ccTabsR) {
                ccTabsR.removeAttribute('nowrap');
                ccTabsR.appendChild(document.getElementById('ccQTool'));
            }

            // change the .add DOM node.
            const classAdd = document.getElementsByClassName('add');
            for (let i = 0; i < classAdd.length; i++) {
                classAdd.item(i).appendChild(document.createTextNode('+'));
            }
        });
    }
});
