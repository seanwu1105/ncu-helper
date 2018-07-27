"use strict";

/* Author: Sean Wu
** NCU CSIE, Taiwan
*/

(function () {
    // block the logout timer from counting down.
    let script = document.createElement('script');
    script.appendChild(document.createTextNode('if(typeof CC.timer != "undefined"){CC.timer.clear();console.log("Logout timer has stopped")}'));
    (document.body || document.head || document.documentElement).appendChild(script);

    // add LMS logo.
    let ccTabsL = document.getElementById('ccTabsL');
    if (ccTabsL)
        console.log("GOTIT!");
    let homepageLink = document.createElement('a');
    let logo = document.createElement('div');
    let icon = document.createElement('img');
    let title = document.createElement('span');
    homepageLink.href = ('https://lms.ncu.edu.tw/');
    logo.id = 'logo';
    icon.src = chrome.extension.getURL('images/NCULogo.svg');
    title.innerHTML = 'LMS';
    logo.appendChild(icon);
    logo.appendChild(title)
    homepageLink.appendChild(logo);
    ccTabsL.appendChild(homepageLink);

    // change the #ccQTool DOM node.
    let ccTabsR = document.getElementById('ccTabsR');
    ccTabsR.removeAttribute('nowrap')
    ccTabsR.appendChild(document.getElementById('ccQTool'));

    // change the .add DOM node.
    let classAdd = document.getElementsByClassName('add');
    for (let i = 0; i < classAdd.length; i++)
        classAdd.item(i).appendChild(document.createTextNode('+'));
})();
