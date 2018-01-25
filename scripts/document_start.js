"use strict";

(function insertCSS() {
    var lmsCSS = document.createElement('link');
    lmsCSS.href = chrome.extension.getURL('main.css');
    lmsCSS.id = 'insert';
    lmsCSS.type = 'text/css';
    lmsCSS.rel = 'stylesheet';
    document.documentElement.appendChild(lmsCSS);
})();

function removeCSS() {
    var lmsCSS = document.getElementById('insert');
    lmsCSS.parentNode.removeChild(lmsCSS);
}