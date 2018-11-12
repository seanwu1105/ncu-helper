import moment from 'moment'

const defaultOptions = {
  'popupDarkTheme': true,
  'portal': true,
  'lms': true,
  'score-inquiries': true,
  'gpa': true,
  'graduate': true,
  'dorm-netflow': false, // is dorm-netflow usage enabled
  'dormIpAddress': undefined // use this name for backward compatibility
}

// Set default settings when first-time installation.
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get(results => {
    for (let [key, value] of Object.entries(defaultOptions)) {
      if (results[key] === undefined) chrome.storage.sync.set({ [key]: value })
    }
  })
})

/* Dorm Netflow */
let dormNetflowUsage = {
  enabled: undefined,
  ipAddress: undefined
}

// Initialize the updating alarms.
chrome.storage.sync.get(['dorm-netflow', 'dormIpAddress'], results => {
  dormNetflowUsage.enabled = results['dorm-netflow']
  dormNetflowUsage.ipAddress = results.dormIpAddress
  updateDormNetflowUsage()
  chrome.alarms.create('updateDormNetflow', { periodInMinutes: 3 })
  chrome.alarms.onAlarm.addListener(_alarm => { updateDormNetflowUsage() })
})

// Initialize message listeners.
chrome.runtime.onMessage.addListener((message, _sender, _sendResponse) => {
  if (message.name === 'updateDormIpAddress') {
    dormNetflowUsage.enabled = message.dormNetflowUsageEnabled
    dormNetflowUsage.ipAddress = message.dormNetflowUsageIp
    updateDormNetflowUsage()
  }
})

/**
 * Send post request to `uncia.cc.ncu.edu.tw/dormnet` and get the 24 hrs dorm
 * net flow usage statistics. And save the result in netflowUsage of local
 * storage.
 * @param {string} ipAddress The target ip address.
 */
function updateDormNetflowUsage () {
  if (dormNetflowUsage.enabled && dormNetflowUsage.ipAddress) {
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
        chrome.storage.local.set({ dormNetflowUsageSet: ret }, () => {
          console.log('Dorm netflow info updated.', dormNetflowUsage.ipAddress)
        })
      }
    })
    xhr.open('post', url, true)
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
    xhr.responseType = 'document'
    xhr.send(`section=netflow&ip=${dormNetflowUsage.ipAddress}`)
  }
}
