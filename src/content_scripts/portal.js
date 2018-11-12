import { insertCSS } from './common'

chrome.storage.sync.get(['portalSkin', 'scoreInquiriesSkin'], results => {
  const url = location.href
  const portalHomepageUrlPattern = new RegExp([
    /(^https?:\/\/portal\.ncu\.edu\.tw\/?$)|/,
    /(^https?:\/\/portal\.ncu\.edu\.tw\/chgpasswd.*$)|/,
    /(^https?:\/\/portal\.ncu\.edu\.tw\/login.*$)/
  ].map(r => r.source).join(''))
  const portalScoreInquiriesUrlPattern = new RegExp(
    /(^https?:\/\/portal\.ncu\.edu\.tw\/system\/162.*$)/.source
  )
  if ((results.portalSkin && portalHomepageUrlPattern.test(url)) ||
  (results.scoreInquiriesSkin && portalScoreInquiriesUrlPattern.test(url))) {
    insertCSS(chrome.runtime.getURL('stylesheets/portal.css'))
  }
})
