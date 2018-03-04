"use strict";

/* Author: Sean Wu
** NCU CSIE, Taiwan
*/

// change the height of top bar (header) frame in frameset.
parent.document.getElementsByTagName('frameset')[0].rows = '56, *';

var header = document.createElement('header');
var logo = document.createElement('div');
var icon = document.createElement('img');
var title = document.createElement('span');
logo.id = 'logo';
icon.src = chrome.extension.getURL('images/NCULogo.svg');
title.innerHTML = '國立中央大學教務系統';
logo.appendChild(icon);
logo.appendChild(title)
header.appendChild(logo);
document.body.appendChild(header);