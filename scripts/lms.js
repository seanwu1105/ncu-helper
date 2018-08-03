'use strict';

/**
 * Author: Sean Wu
 * NCU CSIE, Taiwan
 */

if (switcher) {
    // block the logout timer from counting down.
    const script = document.createElement('script');
    script.appendChild(document.createTextNode(
        'if(typeof CC.timer != "undefined")'
        + '{CC.timer.clear();console.log("Logout timer has stopped")}'));
    (document.body || document.head
        || document.documentElement).appendChild(script);

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
    if (ccTabsL) {
        console.log('Override the logo.');
    }
    ccTabsL.appendChild(homepageLink);

    // change the #ccQTool DOM node.
    const ccTabsR = document.getElementById('ccTabsR');
    ccTabsR.removeAttribute('nowrap');
    ccTabsR.appendChild(document.getElementById('ccQTool'));

    // change the .add DOM node.
    const classAdd = document.getElementsByClassName('add');
    for (let i = 0; i < classAdd.length; i++) {
        classAdd.item(i).appendChild(document.createTextNode('+'));
    }
}
