import { insertCSS } from './common'

chrome.storage.sync.get('scoreInquiriesSkin', results => {
  if (results.scoreInquiriesSkin) {
    insertCSS(chrome.runtime.getURL('stylesheets/score-inquiries-header.css'))
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', modifyHeader)
    } else modifyHeader()
  }
})

function modifyHeader () {
  /* Modify the height of top bar (header) frame in frameset. */
  parent.document.getElementsByTagName('frameset')[0].rows = '56, *'
  const header = document.createElement('header')
  const logo = document.createElement('div')
  const icon = document.createElement('img')
  const title = document.createElement('span')
  logo.id = 'logo'
  icon.src = chrome.extension.getURL('images/ncu-logo.svg')
  title.innerText = '國立中央大學教務系統'
  logo.appendChild(icon)
  logo.appendChild(title)
  header.appendChild(logo)
  document.body.appendChild(header)
}
