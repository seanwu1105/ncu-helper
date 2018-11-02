import { insertCSS } from './common'

(function () {
  let use = true
  if (use) insertCSS(chrome.runtime.getURL('stylesheets/graduate.css'))
})()
