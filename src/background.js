import moment from 'moment'

const defaultOptions = {
  'popupDarkTheme': true,
  'portalSkin': true,
  'lmsSkin': true,
  'scoreInquiriesSkin': true,
  'graduateSkin': true,
  'gpaCalculator': true,
  'dormNetflowEnabled': false,
  'dormNetflowIp': undefined
}

/* XXX: for backward compatability. */
const oldNewOptionKeysConversion = {
  'portal': 'portalSkin',
  'lms': 'lmsSkin',
  'score-inquiries': 'scoreInquiriesSkin',
  'graduate': 'graduateSkin',
  'gpa': 'gpaCalculator',
  'dorm-netflow': 'dormNetflowEnabled',
  'dormIpAddress': 'dormNetflowIp'
}

// Set default settings when installation, extension or chrome update.
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get(results => {
    for (let [key, value] of Object.entries(defaultOptions)) {
      if (results[key] === undefined) chrome.storage.sync.set({ [key]: value })
    }
  })
})

/* Dorm Netflow */

// Initialize the updating alarms.
chrome.storage.sync.get(['dorm-netflow', 'dormIpAddress'], results => {
  updateDormNetflow({
    enabled: results['dorm-netflow'],
    ip: results.dormIpAddress
  })
  chrome.alarms.create('updateDormNetflow', { periodInMinutes: 3 })
  chrome.alarms.onAlarm.addListener(_alarm => { updateDormNetflow() })
})

// Initialize message listeners.
chrome.runtime.onMessage.addListener((message, _sender, _sendResponse) => {
  if (message.name === 'updateDormNetflow') {
    updateDormNetflow({
      enabled: message.enabled,
      ip: message.ip
    })
  }
})

function updateDormNetflow (dormNetflow) {
  if (dormNetflow.enabled && dormNetflow.ip) {
    const ret = []
    const url = 'https://uncia.cc.ncu.edu.tw/dormnet/index.php'
    const xhr = new XMLHttpRequest()
    xhr.addEventListener('load', function () {
      if (this.status === 200) {
        const table = this.responseXML.querySelector('table[border="1"][cellspacing="0"][cellpadding="5"]')
        table.querySelectorAll('tr[bgcolor="#ffffee"], tr[bgcolor="#eeeeee"]').forEach(tr => {
          const data = []
          tr.querySelectorAll('td').forEach((td, idx) => { data[idx] = td.innerText })
          ret.push({
            // NOTE: the following `add` method is a workaround for apexchart issue:
            // https://github.com/apexcharts/apexcharts.js/issues/110
            time: moment(data[0]).add(8, 'hours').toString(),
            externalUpload: data[1] * 1 || 0,
            externalDownload: data[2] * 1 || 0,
            totalUpload: data[3] * 1 || 0,
            totalDownload: data[4] * 1 || 0
          })
        })
        ret.reverse()
        chrome.storage.local.set({ dormNetflowData: ret }, () => {
          console.log('Dorm netflow info updated.', dormNetflow.ip)
        })
      }
    })
    xhr.open('post', url, true)
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
    xhr.responseType = 'document'
    xhr.send(`section=netflow&ip=${dormNetflow.ip}`)
  }
}
