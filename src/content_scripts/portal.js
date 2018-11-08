import { insertCSS } from './common'

(function () {
  let use = true
  /* TODO: Using conditions should depend on the different page-enabling settings. */
  if (use) insertCSS(chrome.runtime.getURL('stylesheets/portal.css'))
})()
