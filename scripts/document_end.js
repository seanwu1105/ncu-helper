"use strict";

// block the logout timer from counting down
var script = document.createElement('script');
script.appendChild(document.createTextNode('if(typeof CC.timer != "undefined"){CC.timer.clear();console.log("Logout timer has stopped")}'));
(document.body || document.head || document.documentElement).appendChild(script);

// add LMS logo
var ccTabsL = document.getElementById('ccTabsL');
var homepageLink = document.createElement('a');
var logo = document.createElement('div');
var icon = document.createElement('img');
var title = document.createElement('span');
homepageLink.href = ('https://lms.ncu.edu.tw/');
logo.id = 'logo';
icon.src = chrome.extension.getURL('images/NCULogo.svg');
icon.id = 'logoIcon';
title.id = 'logoTitle';
title.innerHTML = 'LMS';
logo.appendChild(icon);
logo.appendChild(title)
homepageLink.appendChild(logo);
ccTabsL.appendChild(homepageLink);

// change the #ccQTool DOM node
var ccTabsR = document.getElementById('ccTabsR');
ccTabsR.removeAttribute('nowrap')
ccTabsR.appendChild(document.getElementById('ccQTool'));

// change the .add DOM node
var classAdd = document.getElementsByClassName('add');
for (var i = 0; i < classAdd.length; i++) {
    classAdd.item(i).appendChild(document.createTextNode('+'));
}