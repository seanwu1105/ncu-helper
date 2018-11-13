import { insertCSS } from './common'

chrome.storage.sync.get('graduateSkin', results => {
  if (results.graduateSkin) insertCSS(chrome.runtime.getURL('stylesheets/graduate.css'))
})
