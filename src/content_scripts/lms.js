import { insertCSS } from './common'

chrome.storage.sync.get('lmsSkin', results => {
  if (results.lmsSkin) {
    insertCSS(chrome.runtime.getURL('stylesheets/lms.css'))
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', modifyHeader)
    } else modifyHeader()
  }
})

function modifyHeader () {
  /* Add LMS logo. */
  const ccTabsL = document.getElementById('ccTabsL')
  const homepageLink = document.createElement('a')
  const logo = document.createElement('div')
  const icon = document.createElement('img')
  const title = document.createElement('span')
  homepageLink.href = ('https://lms.ncu.edu.tw/')
  logo.id = 'logo'
  icon.src = chrome.extension.getURL('images/ncu-logo.svg')
  title.innerText = 'LMS'
  logo.appendChild(icon)
  logo.appendChild(title)
  homepageLink.appendChild(logo)
  if (ccTabsL) ccTabsL.appendChild(homepageLink)

  /* Change `#ccQTool` DOM nodes. */
  const ccTabsR = document.getElementById('ccTabsR')
  if (ccTabsR) {
    ccTabsR.removeAttribute('nowrap')
    ccTabsR.appendChild(document.getElementById('ccQTool'))
  }

  /* Change `.add` DOM nodes. */
  const classAdd = document.getElementsByClassName('add')
  for (let node of classAdd) {
    node.appendChild(document.createTextNode('+'))
  }
}
